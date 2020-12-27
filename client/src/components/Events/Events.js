import {useParams, Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {useAppAuth} from '../../context/auth-context';
import {getDictFromAr, getArFromDict, convertISOStrToLocalDateTime, orderArByProp} from '../../utils';
import Button from '../FormShared/Button';

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
      <h1 className="view_title">EVENTS LIST</h1>
      <Link to={createUrl} className="link_icon">Add Event
        <div className="add_icon">+</div>    
      </Link>
      <div className="list_container">
        { eventsAr.map(event => {
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
                {/* <button id="buttonDelete" name={event.guid} onClick={buttonOnClickHandler}>Delete</button>               */}
              </div>

            </div>
          )
        })}        
      </div>
    </div>
  );
};

export default Events;