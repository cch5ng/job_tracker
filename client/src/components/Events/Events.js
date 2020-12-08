import {useParams} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {useAppAuth} from '../../context/auth-context';
import {getDictFromAr, getArFromDict, convertISOStrToLocalDateTime} from '../../utils';

function Events(props) {
  const {jobId} = useParams();
  const [eventsDict, setEventsDict] = useState({});
  const {sessionToken} = useAppAuth();

  useEffect(() => {
    let url = `http://localhost:3000/api/events/job/${jobId}`;
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
  }, [])

  let eventsAr = Object.keys(eventsDict).length ? getArFromDict(eventsDict) : [];
  console.log('eventsAr', eventsAr)

  return (
    <div>
      <div>TODO EVENTS LIST</div>
      { eventsAr.map(event => (
          <div key={event.guid}>
            <div>name: {event.name}</div>
            <div>format: {event.format}</div>
            <div>contact: {event.contact}</div>
            <div>notes: {event.notes}</div>
            <div>description: {event.description}</div>
            <div>follow up: {event.follow_up}</div>
            <div>date/time: {convertISOStrToLocalDateTime(event.date_time)}</div>

          </div>
      ))}

    </div>
  );
};

export default Events;