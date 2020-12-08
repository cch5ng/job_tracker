import {useState, useEffect} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {useParams, Redirect} from 'react-router-dom';
import {useAppAuth} from '../../context/auth-context';
import {convertLocalDateTimeToISOStr, prettyFormatDate} from '../../utils';

const EVENT_NAME_OPTIONS = [
  'meeting',
  'test',
  'assessment'
];
const EVENT_FORMAT_OPTIONS_DICT = {
  meeting: ['phone', 'video', 'group'],
  test: [
    'online (with interviewer)',
    'online (timed alone)',
    'online (unscheduled alone)'
  ],
  assessment: [
    'take-home scheduled timed',
    'take-home unscheduled'
  ]
};

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
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [eventDateTime, setEventDateTime] = useState('');
  const [eventName, setEventName] = useState('meeting');
  const [eventFormat, setEventFormat] = useState('phone');
  const [eventContact, setEventContact] = useState('');
  const [eventNotes, setEventNotes] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventFollowUp, setEventFollowUp] = useState('');
  const [eventGuid, setEventGuid] = useState('');
  const [jobGuid, setJobGuid] = useState('');

  const {userGuid, sessionToken, getUserGuid, userEmail} = useAppAuth();

  //input change handlers
  const inputOnChangeHandler = (ev) => {
    const {name, value} = ev.target;
    const nameToSetterDict = {
      'eventName': function(v) {
        setEventName(v)},
      'eventFormat': function(v) {
        setEventFormat(v)},
      'eventContact': function(v) {
        setEventContact(v)},
      'eventNotes': function(v) {
        setEventNotes(v)},
      'eventDescription': function(v) {
        setEventDescription(v)},
      'eventFollowUp': function(v) {
        setEventFollowUp(v)},
      'eventDateTime': function(v) {
        setEventDateTime(v)}
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
        setEventName('');
        setEventFormat('');
        setEventContact('');
        setEventNotes('');
        setEventDescription('');
        setEventFollowUp('');
        setEventDateTime('');
      } else if (type === 'edit') {
      }
    }

    if (id === 'buttonSave') {
      getUserGuid({userEmail})
        .then(uGuid => {
            //handle buttonSave
            let body = {
              job_guid: jobId, 
              name: eventName, 
              format: eventFormat, 
              contact: eventContact, 
              notes: eventNotes, 
              description: eventDescription, 
              follow_up: eventFollowUp, 
              date_time: convertLocalDateTimeToISOStr(eventDateTime)
            }
            if (type === 'create') {
              fetch(`http://localhost:3000/api/events/`, {
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
              fetch(`http://localhost:3000/api/events/${eventId}`, {
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
      setFormSubmitted(true);
    }
  }

  //if type=edit, get existing form fields
  useEffect(() => {
    if (type === 'edit' && eventId && sessionToken) {
      console.log('gets here')
      let url = `http://localhost:3000/api/events/${eventId}`
      fetch(url, {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      })
        .then(resp => resp.json())
        .then(json => {
          console.log('json', json)
          if (json.event) {
            const {name, format, contact, notes, description, follow_up, job_guid, date_time, guid} = json.event;
            if (name) {
              setEventName(name);
            }
            if (format) {
              setEventFormat(format);
            }
            if (contact) {
              setEventContact(contact);
            }
            if (notes) {
              setEventNotes(notes);
            }
            if (description) {
              setEventDescription(description);
            }
            if (follow_up) {
              setEventFollowUp(follow_up);
            }
            if (job_guid) {
              setJobGuid(job_guid);
            }
            if (date_time) {
              let eventDate = new Date(date_time);
              let year = eventDate.getFullYear();
              let month = eventDate.getMonth() + 1;
              month = prettyFormatDate(month);
              let date = eventDate.getDate();
              date = prettyFormatDate(date);
              let hour = eventDate.getHours();
              hour = prettyFormatDate(hour);
              let minute = eventDate.getMinutes();
              minute = prettyFormatDate(minute);
              let dateStr = `${year}-${month}-${date}`;
              let timeStr = `T${hour}:${minute}`;
              setEventDateTime(`${dateStr}${timeStr}`);
            }
            if (guid) {
              setEventGuid(guid);
            }
          }
        })
        .catch(err => console.error('err', err))
   }
  }, [])

  if (formSubmitted) {
    return (
      <Redirect to="/jobs" />
    )
  }

  //name, format, contact, notes, description, follow_up, job_guid, date_time
  return (
    <div>
      <h1>EVENTS FORM</h1>
      <form>
        <div>
          <label>name</label>
          <select value={eventName} name="eventName" onChange={inputOnChangeHandler}>
            <option value="none">Select a name</option>
            {EVENT_NAME_OPTIONS.map(option => (
              <option value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <label>format</label>
          <select value={eventFormat} name="eventFormat" onChange={inputOnChangeHandler}>
            <option value="none">Select a format</option>
            {EVENT_FORMAT_OPTIONS_DICT[eventName].map(option => (
              <option value={option}>{option}</option>
            ))}
          </select>
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
          <input type="datetime-local" name="eventDateTime" value={eventDateTime} onChange={inputOnChangeHandler}/>
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