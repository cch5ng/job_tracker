import {useState, useEffect} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {useParams, Redirect} from 'react-router-dom';
import {useAppAuth} from '../../context/auth-context';
import {convertLocalDateTimeToISOStr, prettyFormatDate} from '../../utils';
import Input from '../FormShared/Input';
import TextArea from '../FormShared/TextArea';
import SelectGroup from '../FormShared/SelectGroup';
import Button from '../FormShared/Button';

const EVENT_NAME_OPTIONS = [
  {label: 'Select a format', value: "none"},
  {label: 'meeting', value: 'meeting'},
  {label: 'test', value: 'test'},
  {label: 'assessment', value: 'assessment'}
];

const EVENT_FORMAT_OPTIONS_LIST = [
  {label: 'Select a format', value: "none"},
  {label: 'phone meeting', value: 'phone meeting'},
  {label: 'video meeting', value: 'video meeting'},
  {label: 'online test, interview', value: 'online test, interview'},
  {label: 'online test, automated', value: 'online test, automated'},
  {label: 'take-home assessment, scheduled', value: 'take-home assessment, scheduled'},
  {label: 'take-home assessment, unscheduled', value: 'take-home assessment, unscheduled'}
];

function EventsForm(props) {
  const {type} = props;
  let eventId;
  let createJobId;
  if (type === 'create') {
    createJobId = props.jobId;
  }
  if (type === 'edit') {
    eventId = props.eventId;
  }
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [eventDateTime, setEventDateTime] = useState('');
  const [eventFormat, setEventFormat] = useState('phone meeting');
  const [eventContact, setEventContact] = useState('');
  const [eventNotes, setEventNotes] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventFollowUp, setEventFollowUp] = useState('');
  const [eventGuid, setEventGuid] = useState('');
  const [editJobGuid, setEditJobGuid] = useState('');

  const {userGuid, sessionToken, getUserGuid, userEmail} = useAppAuth();

  //input change handlers
  const inputOnChangeHandler = (ev) => {
    const {name, value} = ev.target;
    const nameToSetterDict = {
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
        //setEventName('');
        setEventFormat('');
        setEventContact('');
        setEventNotes('');
        setEventDescription('');
        setEventFollowUp('');
        setEventDateTime('');
      } else if (type === 'edit') {
      }
    }

    if (id === 'buttonDelete') {
      fetch(`http://localhost:3000/api/events/${eventId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`
          }
        })
        .then(resp => resp.json())
        .then(json => {
          setFormSubmitted(true);
        })
        .catch(err => console.error('err', err))
    }

    if (id === 'buttonSave') {
      let body = {
        job_guid: type === 'create' ? createJobId : editJobGuid,
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
    } 

    if (id === 'buttonSave') {
      setFormSubmitted(true);
    }
  }

  //if type=edit, get existing form fields
  useEffect(() => {
    if (type === 'edit' && eventId && sessionToken) {
      let url = `http://localhost:3000/api/events/${eventId}`
      fetch(url, {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      })
        .then(resp => resp.json())
        .then(json => {
          if (json.event) {
            const {format, contact, notes, description, follow_up, job_guid, date_time, guid} = json.event;
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
              setEditJobGuid(job_guid);
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

  return (
    <div>
      <h1 className="view_title">EVENTS FORM</h1>
      <form>
        <SelectGroup 
          label="format" name="eventFormat" value={eventFormat} 
          inputOnChangeHandler={inputOnChangeHandler} optionsList={EVENT_FORMAT_OPTIONS_LIST} />  
        <Input type="text" value={eventContact} name="eventContact" inputOnChangeHandler={inputOnChangeHandler} label="contact"/>
        <TextArea value={eventNotes} name="eventNotes" inputOnChangeHandler={inputOnChangeHandler}  
          label="notes"/>
        <TextArea value={eventDescription} name="eventDescription" inputOnChangeHandler={inputOnChangeHandler}  
          label="description"/>
        <Input type="text" value={eventFollowUp} name="eventFollowUp" 
          inputOnChangeHandler={inputOnChangeHandler} label="follow up"/>
        <Input type="datetime-local" value={eventDateTime} name="eventDateTime" 
          inputOnChangeHandler={inputOnChangeHandler} label="date time"/>
        <div>
          <Button id="buttonSave" clickHandler={buttonOnClickHandler} 
            label="Save" />
          <Button id="buttonCancel" clickHandler={buttonOnClickHandler} 
            label="Cancel" />
          {type === 'edit' && (
            <Button id="buttonDelete" clickHandler={buttonOnClickHandler} 
              label="Delete" />
          )}
        </div>
      </form>
    </div>
  );
};

export default EventsForm;