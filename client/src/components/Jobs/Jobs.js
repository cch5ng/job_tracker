import {useState, useEffect} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {useAppAuth} from '../../context/auth-context';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const { name, picture, email } = user;
  const {login, getUserGuid, userGuid, userEmail, sessionToken} = useAppAuth();

  const callSecureApi = async () => {
    try {
      const token = await getAccessTokenSilently();
      login({userEmail: email, sessionToken: token})
    } catch (error) {
      console.error('error', error)
    }
  };

  useEffect(() => {
    callSecureApi();
    getUserGuid({userEmail: email});
  }, [])

  useEffect(() => {
    if (userGuid && sessionToken) {
      fetch(`http://localhost:3000/api/jobs/${userGuid}`, {
        headers: {Authorization: `Bearer ${sessionToken}`}
      })
        .then(resp => resp.json())
        .then(json => {
          let {jobs} = json;
          setJobs(jobs);
        })
        .catch(err => console.error('err', err))  
    }
  
  }, [sessionToken, userGuid]);

  return (
    <div>
      <h1>JOBS TODO</h1>

      <h1>JOBS LIST</h1>
      {jobs.map(job => (
        <div>
          <div>Name: {job.name}</div>
          <div>status: {job.status}</div>
          <div>company_name: {job.name}</div>
          <div>url: {job.url}</div>
          <div>description: {job.description}</div>
          <div>questions: {job.questions}</div>
          <div>source: {job.source}</div>
        </div>
      ))}

    </div>
  );
};

export default Jobs;