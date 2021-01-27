import {useParams} from 'react-router-dom';
import EventsForm from './EventsForm';

import React from "react";

function EventsFormCreate(props) {
  const {jobId} = useParams();
  return (
    <EventsForm type="create" jobId={jobId} />
  );
};

export default EventsFormCreate;