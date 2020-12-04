import {useParams} from 'react-router-dom';
import JobsForm from './JobsForm';

function JobsFormEdit(props) {
  const {jobId} = useParams();
  return (
    <JobsForm type="edit" jobId={jobId} />
  );
};

export default JobsFormEdit;