import * as React from "react";
import classNames from 'classnames/bind';
import { getAuth } from "firebase/auth";
import {Link, useHistory} from 'react-router-dom';

import {useAuth} from '../../context/auth-context';
import {useJobs} from '../../context/jobs-context';
import {useCompany} from '../../context/company-context';
import {getDictFromAr, getArFromDict, orderArByProp} from '../../utils';
import styles from './Jobs.module.css';
import Button from '../FormShared/Button';
import Input from '../FormShared/Input';

let cx = classNames.bind(styles);

function Jobs() {
  const [jobFilterStr, setJobFilterStr] = React.useState('');
  const { jobsDict, updateJobsDict } = useJobs();
  const { companyDict } = useCompany();

  const auth = getAuth();
  const user = auth.currentUser;

  const inputOnChangeHandler = (ev) => {
    const {name, value} = ev.target;
    if (name === 'jobFilterStr') {
      setJobFilterStr(value);
    }
  }

  const handleArchiveButtonClick = (ev) => {
    ev.preventDefault();
    const {name} = ev.target;

    user.getIdToken()
      .then(fbIdToken => {
        if (user && name && fbIdToken) {
          let body = {fbIdToken}
          fetch(`http://localhost:3000/api/jobs/archive/${name}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          })
            .then(resp => resp.json())
            .then(json => {
              if (json.status === 'success') {
                let updatedJob = {...jobsDict[name], status: 'archived'};
                updateJobsDict(updatedJob);
              }
            })
            .catch(err => console.error('err', err))  
        } else {
          console.error('err', 'missing fbIdToken')
        }
    
      })
      .catch(error => console.error('err', error))
  }

  let jobsAr = [];
  if (jobsDict) {
    jobsAr = getArFromDict(jobsDict);
    orderArByProp(jobsAr, 'created_at', 'desc')
  }
  if (jobsAr.length && jobFilterStr && jobFilterStr.length) {
    jobsAr = jobsAr.filter(job => {
      if (job.name && job.company_id) {
        let includeJob = false;
        if (job.name.indexOf(jobFilterStr) > -1) {
          includeJob = true;
        }
        if (job.company_id) {
          let companyId = job.company_id;
          let company = companyDict[companyId];
          if (company.name.indexOf(jobFilterStr) > -1) {
            includeJob = true;
          }
        }
        return includeJob;
      } else if (job.name) {
        return job.name.indexOf(jobFilterStr) > -1
      } else if (job.company_id) {
        let companyId = job.company_id;
        let company = companyDict[companyId];
        return company.name.indexOf(jobFilterStr) > -1
      }
    })
  }

  return (
    <div>
      <h1 className="view_title">JOBS LIST</h1>
      <Link to="/jobs/new" className="link_icon">
        <div className="add_icon">+</div>
      </Link>
      <Input type="text" value={jobFilterStr} name="jobFilterStr" 
        inputOnChangeHandler={inputOnChangeHandler} placeholder="Search by company or role" />

      <div className="list_container">
        {jobsAr.map(job => {
          let url = `/jobs/${job.guid}`;
          let newEventUrl = `events/new/${job.guid}`;
          let eventsUrl = `jobs/${job.guid}/events`;
          let companyId = job.company_id;
          let companyName = companyDict[companyId];
          return (
            <div key={job.guid} className="list_item_container">
              <Link to={url}>
                <h2>{job.name}</h2>
                <div><span className="list_item_label">status</span> {job.status}</div>
                {companyName && companyName.name.length > 0 && (
                  <div><span className="list_item_label">company</span> {companyName.name}</div>
                )}
                
                <div><span className="list_item_label">url</span> {job.url}</div>
                <div><span className="list_item_label">description</span> {job.description}</div>
                <div><span className="list_item_label">questions</span> {job.questions}</div>
                <div><span className="list_item_label">source</span> {job.source}</div>
                {job.created_at && (
                  <div className="list_item_small">created {job.created_at}</div>
                )}
              </Link>
              <div className="button_container">
                <Link to={newEventUrl}>
                  <Button name="button_save" label="Add event" clickHandler={() => {}} size="wide"/>
                  </Link>
                <Link to={eventsUrl}>
                  <Button name="button_events" label="Get events" clickHandler={() => {}} size="wide"/>
                </Link>
                <Button name={job.guid} label="Hide" clickHandler={handleArchiveButtonClick} size="wide"/>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default Jobs;