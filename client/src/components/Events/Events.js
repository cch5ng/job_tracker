import {useParams, Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {useAppAuth} from '../../context/auth-context';
import {getDictFromAr, getArFromDict, convertISOStrToLocalDateTime, orderArByProp} from '../../utils';
import Button from '../FormShared/Button';
import SelectGroup from '../FormShared/SelectGroup';
import Input from '../FormShared/Input';

const EVENTS_SORT_OPTIONS = [
  {label: 'oldest to newest', value: 'oldest to newest'},
  {label: 'newest to oldest', value: 'newest to oldest'}
]

function Events(props) {
  const {jobId} = useParams();
  const [eventsDict, setEventsDict] = useState({});
  const [eventsSortBy, setEventsSortBy] = useState('oldest to newest');
  const [filterHidePastEvents, setFilterHidePastEvents] = useState(true);
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const { name, picture, email } = user;
  const {login, getUserGuid, userGuid, userEmail, sessionToken} = useAppAuth();

  const buttonOnClickHandler = (ev) => {
    ev.preventDefault();
    let {id, name} = ev.target;
    let eventGuid = name;
    fetch(`http://localhost:3000/api/events/${eventGuid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
      }
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

  }

  const inputOnChangeHandler = (ev) => {
    const {name, value, checked} = ev.target;
    if (name === 'eventsSortBy') {
      setEventsSortBy(value);
    } else if (name === 'filterHidePastEvents') {
      setFilterHidePastEvents(checked)
    }
  }

  const callSecureApi = async (uGuid) => {
    try {
      const token = await getAccessTokenSilently();
      login({userEmail: email, sessionToken: token, userGuid: uGuid})

      let url;
      if (!jobId && uGuid) {
        url = `http://localhost:3000/api/events/user/${uGuid}`;
      } else if (jobId) {
        url = `http://localhost:3000/api/events/job/${jobId}`
      }
      if (url) {
        fetch(url, {
          headers: {Authorization: `Bearer ${token}`}
        })
          .then(resp => resp.json())
          .then(json => {
            if (json.events.length) {
              let evDict = json.events ? getDictFromAr(json.events): {};
              setEventsDict(evDict);
            } 
          })
          .catch(err => console.error('error', err))
      }
    } catch (error) {
      console.error('error', error)
    }
  };

  useEffect(() => {
    getUserGuid({userEmail: email})
      .then(uGuid => {
        callSecureApi(uGuid);
      })
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
  
  let createUrl = `/events/new/${jobId}`;

  return (
    <div>
      <h1 className="view_title">EVENTS LIST</h1>
      <Link to={createUrl} className="link_icon">Add Event
        <div className="add_icon">+</div>    
      </Link>
      <form>
        <SelectGroup name="eventsSortBy" value={eventsSortBy} label="sort by"
          inputOnChangeHandler={inputOnChangeHandler} optionsList={EVENTS_SORT_OPTIONS} />
        <Input type="checkbox" checked={filterHidePastEvents} name="filterHidePastEvents" inputOnChangeHandler={inputOnChangeHandler} label="hide past events"/>
      </form>
      <div className="list_container">
        { filteredEvents.map(event => {
          let url = `/events/edit/${event.guid}`;
          return (
            <div key={event.guid} className="list_item_container">
              <Link to={url}>
                <div><span className="list_item_label">name:</span> {event.name}</div>
                <div><span className="list_item_label">format:</span> {event.format}</div>
                <div><span className="list_item_label">contact:</span> {event.contact}</div>
                <div><span className="list_item_label">notes:</span> {event.notes}</div>
                <div><span className="list_item_label">description:</span> {event.description}</div>
                <div><span className="list_item_label">follow up:</span> {event.follow_up}</div>
                <div><span className="list_item_small">date/time:</span> {convertISOStrToLocalDateTime(event.date_time)}</div>
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