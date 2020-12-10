import {useParams, Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {useAppAuth} from '../../context/auth-context';
import {getDictFromAr, getArFromDict, convertISOStrToLocalDateTime, orderArByProp} from '../../utils';

function Events(props) {
  const {jobId} = useParams();
  const [eventsDict, setEventsDict] = useState({});
  const {userGuid, sessionToken} = useAppAuth();

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

  useEffect(() => {
    let url;
    if (!jobId && userGuid) {
      url = `http://localhost:3000/api/events/user/${userGuid}`;
    } else if (jobId) {
      url = `http://localhost:3000/api/events/job/${jobId}`
    }
    if (url) {
      fetch(url, {
        headers: {Authorization: `Bearer ${sessionToken}`}
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
  }, [])

  let eventsAr = Object.keys(eventsDict).length ? getArFromDict(eventsDict) : [];
  orderArByProp(eventsAr, 'date_time', 'desc');
  let createUrl = `/events/new/${jobId}`;

  return (
    <div>
      <h1>EVENTS</h1>
      <Link to={createUrl}>Add Event</Link>
      { eventsAr.map(event => {
        let url = `/events/edit/${event.guid}`;
        return (
          <div key={event.guid}>
            <button id="buttonDelete" name={event.guid} onClick={buttonOnClickHandler}>Delete</button>
            <Link to={url}>
              <div>name: {event.name}</div>
              <div>format: {event.format}</div>
              <div>contact: {event.contact}</div>
              <div>notes: {event.notes}</div>
              <div>description: {event.description}</div>
              <div>follow up: {event.follow_up}</div>
              <div>date/time: {convertISOStrToLocalDateTime(event.date_time)}</div>
            </Link>
          </div>
        )
      })}
    </div>
  );
};

export default Events;