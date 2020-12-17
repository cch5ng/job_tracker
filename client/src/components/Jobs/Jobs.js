import {useState, useEffect} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import classNames from 'classnames/bind';
import {useAppAuth} from '../../context/auth-context';
import {Link, useHistory} from 'react-router-dom';
import {getDictFromAr, getArFromDict, orderArByProp} from '../../utils';
import styles from './Jobs.module.css';

let cx = classNames.bind(styles);

function Jobs() {
  const [jobsDict, setJobsDict] = useState({});
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const { name, picture, email } = user;
  const {login, getUserGuid, userGuid, userEmail, sessionToken} = useAppAuth();

  const handleArchiveButtonClick = (ev) => {
    ev.preventDefault();
    const {name} = ev.target;

    if (name && sessionToken) {
      fetch(`http://localhost:3000/api/jobs/archive/${name}`, {
        method: 'PUT',
        headers: {Authorization: `Bearer ${sessionToken}`}
      })
        .then(resp => resp.json())
        .then(json => {
          if (json.status === 'success') {
            setJobsDict({...jobsDict, [name]: {...jobsDict[name], status: 'archived'}})
          }
        })
        .catch(err => console.error('err', err))  
    }
  }

  const callSecureApi = async (uGuid) => {
    try {
      const token = await getAccessTokenSilently();
      login({userEmail: email, sessionToken: token, userGuid: uGuid})

      if (uGuid && token) {
        fetch(`http://localhost:3000/api/jobs/all/${uGuid}`, {
          headers: {Authorization: `Bearer ${token}`}
        })
          .then(resp => resp.json())
          .then(json => {
            let {jobs} = json;
            let jobsObj = getDictFromAr(jobs);
            setJobsDict(jobsObj);
          })
          .catch(err => console.error('err', err))  
      }  
    } catch (error) {
      console.error('error', error)
    }
  };

  useEffect(() => {
    getUserGuid({userEmail: email})
      .then(uGuid => {
        callSecureApi(uGuid);
      })
  }, [])

  let jobsAr = getArFromDict(jobsDict);
  orderArByProp(jobsAr, 'created_at', 'desc')

  return (
    <div className={styles.jobs_container_outter}>
      <h1 className={styles.view_title}>JOBS LIST</h1>
      <Link to="/jobs/new" className={styles.link_icon}>
        <div className={styles.add_icon}>+</div>
      </Link>

      <div className={styles.jobs_container} >
        {jobsAr.map(job => {
          let url = `/jobs/${job.guid}`;
          let newEventUrl = `events/new/${job.guid}`;
          let eventsUrl = `jobs/${job.guid}/events`;
          return (
            <div key={job.guid} className={styles.job_container}>
              <Link to={url}>
                <h2>{job.name}</h2>
                <div><span className={styles.label}>status</span> {job.status}</div>
                <div><span className={styles.label}>company</span> {job.name}</div>
                <div><span className={styles.label}>url</span> {job.url}</div>
                <div><span className={styles.label}>description</span> {job.description}</div>
                <div><span className={styles.label}>questions</span> {job.questions}</div>
                <div><span className={styles.label}>source</span> {job.source}</div>
                {job.created_at && (
                  <div className={styles.small}>created {job.created_at}</div>
                )}
              </Link>
              <div className={styles.button_container}>
                <Link to={newEventUrl}><button className={styles.nav_button}>Add event</button></Link>
                <Link to={eventsUrl}><button className={styles.nav_button}>Get events</button></Link>
                <button onClick={handleArchiveButtonClick} name={job.guid} className={styles.button}>Hide</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default Jobs;