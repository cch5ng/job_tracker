import {useParams, Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {useAppAuth} from '../../context/auth-context';
import {getDictFromAr, getArFromDictBasic, convertISOStrToLocalDateTime, orderArByProp} from '../../utils';

function Events(props) {
  const {jobId} = useParams();
  const [eventsDict, setEventsDict] = useState({});
  const {userGuid, sessionToken} = useAppAuth();

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

  let eventsAr = Object.keys(eventsDict).length ? getArFromDictBasic(eventsDict) : [];
  orderArByProp(eventsAr, 'follow_up', 'desc');

  return (
    <div>
      <h1>EVENTS</h1>
      { eventsAr.map(event => {
        let url = `/events/edit/${event.guid}`;
        return (
          <div key={event.guid}>
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