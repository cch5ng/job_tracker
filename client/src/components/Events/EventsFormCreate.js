import {useParams} from 'react-router-dom';
import EventsForm from './EventsForm';

function EventsFormCreate(props) {
  const {jobId} = useParams();
  return (
    <EventsForm type="create" jobId={jobId} />
  );
};

export default EventsFormCreate;