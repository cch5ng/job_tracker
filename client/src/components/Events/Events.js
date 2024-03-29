import React from "react";
import * as ReactDOM from "react-dom";
import {useParams, Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { getAuth } from "firebase/auth";

import "react-big-calendar/lib/css/react-big-calendar.css";
import {useAuth} from '../../context/auth-context';
import {useJobs} from '../../context/jobs-context';
import {useCompany} from '../../context/company-context';
import { useAlert, ADD } from '../../context/alert-context';
import {getDictFromAr, getArFromDict, convertISOStrToLocalDateTime, orderArByProp} from '../../utils';
import Button from '../FormShared/Button';
import Checkbox from '../FormShared/Checkbox';
import SelectGroup from '../FormShared/SelectGroup';
import Input from '../FormShared/Input';
import Alert from '../FormShared/Alert';
import styles from './Events.module.css';

const EVENTS_SORT_OPTIONS = [
  {label: 'oldest to newest', value: 'oldest to newest'},
  {label: 'newest to oldest', value: 'newest to oldest'}
]

const localizer = momentLocalizer(moment);

function Events(props) {
  const {jobId} = useParams();
  const [eventsDict, setEventsDict] = useState({});
  const [eventsSortBy, setEventsSortBy] = useState('oldest to newest');
  const [filterHidePastEvents, setFilterHidePastEvents] = useState(true);
  const [filterEventPhoneMeeting, setFilterEventPhoneMeeting] = useState(true);
  const [filterEventVideoMeeting, setFilterEventVideoMeeting] = useState(true);
  const [filterEventOnlineTestInterview, setFilterEventOnlineTestInterview] = useState(true);
  const [filterEventOnlineTestAutomated, setFilterEventOnlineTestAutomated] = useState(true);
  const [filterEventTakeHomeTestScheduled, setFilterEventTakeHomeTestScheduled] = useState(true);
  const [filterEventTakeHomeTestUnscheduled, setFilterEventTakeHomeTestUnscheduled] = useState(true);

  const {login, getUserGuidReq} = useAuth();
  const {jobsDict, getJobsForUser} = useJobs();
  const {companyDict, getCompanies} = useCompany();
  const { alertDispatch } = useAlert();

  const auth = getAuth();
  const user = auth.currentUser;
  let userEmail;
  if (user) {
    userEmail = user.email;
  }

  const buttonOnClickHandler = (ev) => {
    ev.preventDefault();

    if (user) {
      user.getIdToken()
        .then(fbIdToken => {
          let {id, name} = ev.target;
          let eventGuid = name;
          let body = {fbIdToken}
          fetch(`http://localhost:3000/api/events/${eventGuid}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          })
            .then(resp => resp.json())
            .then(json => {
              if (json.status === 'success') {
                let copyEventDict = {...eventsDict};
                delete copyEventDict[eventGuid];
                setEventsDict(copyEventDict);
              }
            })
            .catch(err => console.error('err', err))

        })
        .catch(err => console.error('err', err))

    }
  }

  const inputOnChangeHandler = (ev) => {
    const {name, value, checked, id} = ev.target;
    if (name === 'eventsSortBy') {
      setEventsSortBy(value);
    } else if (id === 'filterHidePastEvents') {
      setFilterHidePastEvents(!filterHidePastEvents)
    } else if (id === 'filterEventPhoneMeeting') {
      setFilterEventPhoneMeeting(!filterEventPhoneMeeting)
    } else if (id === 'filterEventVideoMeeting') {
      setFilterEventVideoMeeting(!filterEventVideoMeeting)
    } else if (id === 'filterEventOnlineTestInterview') {
      setFilterEventOnlineTestInterview(!filterEventOnlineTestInterview)
    } else if (id === 'filterEventOnlineTestAutomated') {
      setFilterEventOnlineTestAutomated(!filterEventOnlineTestAutomated)
    } else if (id === 'filterEventTakeHomeTestScheduled') {
      setFilterEventTakeHomeTestScheduled(!filterEventTakeHomeTestScheduled)
    } else if (id === 'filterEventTakeHomeTestUnscheduled') {
      setFilterEventTakeHomeTestUnscheduled(!filterEventTakeHomeTestUnscheduled)
    }
  }

  const callSecureApi = (uGuid, fbIdToken) => {
    try {
      if (fbIdToken) {
        
        if (userEmail) {
          login({userEmail, fbIdToken})
        }
  
        let eventsUrl;
        let body = {fbIdToken}
        if (!jobId && uGuid) {
          eventsUrl = `http://localhost:3000/api/events/user/${uGuid}`;
        } else if (jobId) {
          eventsUrl = `http://localhost:3000/api/events/job/${jobId}`
        }
        if (eventsUrl) {
          fetch(eventsUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },          
            body: JSON.stringify(body)
          })
            .then(resp => {
              if (!resp.ok) {
                alertDispatch({ type: ADD, payload: {type: 'error', message: `HTTP Status Code: ${resp.status}`} })
              } 
              return resp.json();
            })
            .then(json => {
              if (json.events.length) {
                let evDict = json.events ? getDictFromAr(json.events): {};
                setEventsDict(evDict);
              } else if (json.type === 'error') {
                alertDispatch({ type: ADD, payload: {type: 'error', message: json.message} })
              }
            })
            .catch(err => console.error('error', err))
        }
  
        if (uGuid) {
          let companiesUrl = `http://localhost:3000/api/company/all/${uGuid}`;
          getCompanies({url: companiesUrl, fbIdToken});
            
          let jobsUrl = `http://localhost:3000/api/jobs/all/${uGuid}`;
          getJobsForUser({url: jobsUrl, fbIdToken});

        }            


      }
      //  })
      //  .catch(error => console.error('err', error))

    } catch (error) {
      console.error('error', error)
    }
  };

  const filterEventsByEventFormat = (eventsList) => {
    let filteredList;
    let includeList = [];
    let excludeList = [];

    const formatDict = {
      'phone meeting': filterEventPhoneMeeting,
      'video meeting': filterEventVideoMeeting,
      'online test, interview': filterEventOnlineTestInterview,
      'online test, automated': filterEventOnlineTestAutomated,
      'take-home assessment, scheduled': filterEventTakeHomeTestScheduled,
      'take-home assessment, unscheduled': filterEventTakeHomeTestUnscheduled
    }

    filteredList = eventsList.filter(ev => {
      let format = ev.format;
      if (formatDict[format]) {
        return ev;
      }
    })
    return filteredList;
  }

  useEffect(() => {
    if (userEmail) {
      user.getIdToken()
        .then(fbIdToken => {
          if (fbIdToken) {
            getUserGuidReq({userEmail, fbIdToken})
              .then(uGuid => {
                
                callSecureApi(uGuid, fbIdToken);
              })
              .catch(error => console.error('err', error))
          }
        })
        .catch(error => console.error('err', error))
    }
  }, [])

  let eventsAr = Object.keys(eventsDict).length ? getArFromDict(eventsDict) : [];
  let sortOrder = eventsSortBy === 'oldest to newest' ? 'asc' : 'desc'; 
  orderArByProp(eventsAr, 'date_time', sortOrder);
  let filteredEvents;
  if (!filterHidePastEvents) {
    filteredEvents = eventsAr;
  } else {
    filteredEvents = eventsAr.filter(ev => {
      let eventDate = new Date(ev.date_time);
      let curDate = new Date();
      return eventDate >= curDate;
    });  
  }
  //filter for the event type
  filteredEvents = filterEventsByEventFormat(filteredEvents);
  let createUrl = `/events/new/${jobId}`;

  const myEventsList = [];
  filteredEvents.forEach(event => {
    let evObj = {};
    let dt = moment(event.date_time)
    evObj.start = dt;
    evObj.end = moment(event.date_time).add(1, "hour");
    evObj.title = event.format;
    myEventsList.push(evObj);
  });
  
  return (
    <div>
      <h1 className="view_title">EVENTS LIST</h1>

      <form className={styles.events_filter_container}>
        <SelectGroup name="eventsSortBy" value={eventsSortBy} label="sort by"
          inputOnChangeHandler={inputOnChangeHandler} optionsList={EVENTS_SORT_OPTIONS} />
        <Checkbox checkboxVal={filterHidePastEvents} onChangeHandler={inputOnChangeHandler}
          checkboxLabel='hide past events' name='filterHidePastEvents' checkClassName=''
          id='filterHidePastEvents' />
        <Checkbox checkboxVal={filterEventPhoneMeeting} onChangeHandler={inputOnChangeHandler}
          checkboxLabel='show phone meetings' name='filterEventPhoneMeeting' checkClassName=''
          id='filterEventPhoneMeeting' />
        <Checkbox checkboxVal={filterEventVideoMeeting} onChangeHandler={inputOnChangeHandler}
          checkboxLabel='show video meetings' name='filterEventVideoMeeting' checkClassName=''
          id='filterEventVideoMeeting' />
        <Checkbox checkboxVal={filterEventOnlineTestInterview} onChangeHandler={inputOnChangeHandler}
          checkboxLabel='show online tests, interview' name='filterEventOnlineTestInterview' checkClassName=''
          id='filterEventOnlineTestInterview' />
        <Checkbox checkboxVal={filterEventOnlineTestAutomated} onChangeHandler={inputOnChangeHandler}
          checkboxLabel='show online tests, automated' name='filterEventOnlineTestAutomated' checkClassName=''
          id='filterEventOnlineTestAutomated' />
        <Checkbox checkboxVal={filterEventTakeHomeTestScheduled} onChangeHandler={inputOnChangeHandler}
          checkboxLabel='show take-home assessments, scheduled' name='filterEventTakeHomeTestScheduled' checkClassName=''
          id='filterEventTakeHomeTestScheduled' />
        <Checkbox checkboxVal={filterEventTakeHomeTestUnscheduled} onChangeHandler={inputOnChangeHandler}
          checkboxLabel='show take-home assessments, unscheduled' name='filterEventTakeHomeTestUnscheduled' checkClassName=''
          id='filterEventTakeHomeTestUnscheduled' />
      </form>

      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 , marginBottom: 32}}
        views={['month', 'day', 'agenda']}
      />

      <div className="list_container">
        { filteredEvents.map(event => {
          let url = `/events/edit/${event.guid}`;
          let job_guid = event.job_guid;
          let jobUrl = `/jobs/${job_guid}`;
          return (
            <div key={event.guid} className="list_item_container">
              <Link to={url}>
                <div><span className="list_item_label">format:</span> {event.format}</div>
                <div><span className="list_item_label">contact:</span> {event.contact}</div>
                <div><span className="list_item_label">notes:</span> {event.notes}</div>
                <div><span className="list_item_label">description:</span> {event.description}</div>
                <div><span className="list_item_label">follow up:</span> {event.follow_up}</div>
                <div><span className="list_item_small">date/time:</span> {convertISOStrToLocalDateTime(event.date_time)}</div>
              </Link>
              <Link to={jobUrl}>
                {jobsDict && jobsDict[job_guid] && jobsDict[job_guid].name && (
                  <div><span className="list_item_label">job name:</span> {jobsDict[job_guid].name}</div>
                )}
                {jobsDict && jobsDict[job_guid] && jobsDict[job_guid].company_name && (
                  <div><span className="list_item_label">company name:</span> {jobsDict[job_guid].company_name}</div>
                )}
              </Link>
              <div className="button_container">
                <Button id="buttonDelete" name={event.guid} label="Delete" clickHandler={buttonOnClickHandler} size="wide"/>
              </div>
            </div>
          )
        })}        
      </div>
    </div>
  );
};

export default Events;