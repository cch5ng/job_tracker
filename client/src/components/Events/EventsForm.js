import {useState, useEffect} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {useParams, Redirect} from 'react-router-dom';
import {useAppAuth} from '../../context/auth-context';

function EventsForm(props) {
  const {type} = props;
  let eventId;
  let jobId;
  if (type === 'create') {
    jobId = props.jobId;
  }
  if (type === 'edit') {
    eventId = props.eventId;
  }
  const [formStatus, setFormStatus] = useState('inProgress'); //redirectJobs, redirectEventForm
  const [eventDateTime, setEventDateTime] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventFormat, setEventFormat] = useState('');
  const [eventContact, setEventContact] = useState('');
  const [eventNotes, setEventNotes] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventFollowUp, setEventFollowUp] = useState('');

  const {userGuid, sessionToken, getUserGuid, userEmail} = useAppAuth();

  //input change handlers
  const inputOnChangeHandler = (ev) => {
    const {name, value} = ev.target;
    const nameToSetterDict = {
      'jobName': function(v) {
        setJobName(v)},
      'jobStatus': function(v) {
        setJobStatus(v)},
      'companyName': function(v) {
        setCompanyName(v)},
      'jobUrl': function(v) {
        setJobUrl(v)},
      'jobDescription': function(v) {
        setJobDescription(v)},
      'jobQuestions': function(v) {
        setJobQuestions(v)},
      'jobSource': function(v) {
        setJobSource(v)}
    }
    nameToSetterDict[name](value);
  }

  //button click handlers
  const buttonOnClickHandler = (ev) => {
    ev.preventDefault();
    const {id} = ev.target;

    if (id === 'buttonCancel') {
      //handle buttonCancel
      if (type === 'create') {
        setJobName('');
        setJobStatus('');
        setCompanyName('');
        setJobUrl('');
        setJobDescription('');
        setJobQuestions('');
        setJobSource('');
      } else if (type === 'edit') {
      }
    }

    if (id === 'buttonSave') {
      getUserGuid({userEmail})
        .then(uGuid => {
            //handle buttonSave
            let body = {
              name: jobName, 
              status: jobStatus, 
              description: jobDescription, 
              url: jobUrl, 
              company_name: companyName, 
              questions: jobQuestions, 
              source: jobSource, 
              user_guid: uGuid
            }
            if (type === 'create') {
              fetch(`http://localhost:3000/api/jobs/`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${sessionToken}`
                },
                body: JSON.stringify(body)
              })
              .then(resp => resp.json())
              .then(json => console.log('json', json))
              .catch(err => console.error('err', err))
            } else if (type === 'edit') {
              fetch(`http://localhost:3000/api/jobs/`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${sessionToken}`
                },
                body: JSON.stringify(body)
              })
              .then(resp => resp.json())
              .then(json => console.log('json', json))
              .catch(err => console.error('err', err))
            }
        })
    } 

    if (id === 'buttonSave') {
      setFormStatus('redirectJobs')
    }
    if (id === 'buttonSaveJobEvent') {
      setFormStatus('redirectEventForm')
    }
  }

  //if type=edit, get existing form fields
  useEffect(() => {
  //   if (type === 'edit' && jobId && sessionToken) {
  //     let url = `http://localhost:3000/api/jobs/${jobId}`
  //     fetch(url, {
  //       headers: {
  //         'Authorization': `Bearer ${sessionToken}`
  //       }
  //     })
  //       .then(resp => resp.json())
  //       .then(json => {
  //         console.log('json', json)
  //         const {company_name, description, name, questions, source, status, url} = json.job;
  //         if (company_name) {
  //           setCompanyName(companyName);
  //         }
  //         if (name) {
  //           setJobName(name);
  //         }
  //         if (status) {
  //           setJobStatus(status);
  //         }
  //         if (url) {
  //           setJobUrl(url);
  //         }
  //         if (description) {
  //           setJobDescription(description);
  //         }
  //         if (questions) {
  //           setJobQuestions(questions);
  //         }
  //         if (source) {
  //           setJobSource(source);
  //         }
  //       })
  //       .catch(err => console.error('err', err))
  //  }
  }, [])

  //name, format, contact, notes, description, follow_up, job_guid, date_time
  return (
    <div>
      <h1>EVENTS FORM</h1>
      <form>
        <div>
          <label>name</label>
          <input type="text" value={eventName} name="eventName" onChange={inputOnChangeHandler}/>
        </div>
        <div>
          <label>format</label>
          <input type="text" value={eventFormat} name="eventFormat" onChange={inputOnChangeHandler}/>
        </div>
        <div>
          <label>contact</label>
          <input type="text" value={eventContact} name="eventContact" onChange={inputOnChangeHandler}/>
        </div>
        <div>
          <label>notes</label>
          <textarea value={eventNotes} name="eventNotes" onChange={inputOnChangeHandler}/>
        </div>
        <div>
          <label>description</label>
          <textarea value={eventDescription} name="eventDescription" onChange={inputOnChangeHandler}/>
        </div>
        <div>
          <label>follow up</label>
          <input type="text" value={eventFollowUp} name="eventFollowUp" onChange={inputOnChangeHandler}/>
        </div>
        <div>
          <label>date time</label>
          <input type="datetime-local" name="event_date_time" value={eventDateTime}/>
        </div>
        <div>
          <button id="buttonSave" onClick={buttonOnClickHandler}>Save</button>
          <button id="buttonCancel" onClick={buttonOnClickHandler}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EventsForm;