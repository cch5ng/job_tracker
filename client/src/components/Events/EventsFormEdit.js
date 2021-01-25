import React from "react";
import {useParams} from 'react-router-dom';
import EventsForm from './EventsForm';

function EventsFormEdit(props) {
  const {eventId} = useParams();
  return (
    <EventsForm type="edit" eventId={eventId} />
  );
};

export default EventsFormEdit;