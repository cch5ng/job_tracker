import * as React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {useParams, Redirect, useHistory} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {useAppAuth} from '../../context/auth-context';
import {useJobs} from '../../context/jobs-context';
import { useAlert, ADD } from '../../context/alert-context';
import Input from '../FormShared/Input';
import TextArea from '../FormShared/TextArea';
import SelectGroup from '../FormShared/SelectGroup';
import Button from '../FormShared/Button';
import styles from './Jobs.module.css';

const JOB_STATUS_OPTIONS = [
  {label: 'select a status', value: 'none'},
  {label: 'applied', value: 'applied'},
  {label: 'interview scheduled', value: 'interview scheduled'},
  {label: 'in process', value: 'in process'},
  {label: 'archived', value: 'archived'}
];
const JOB_SOURCE_OPTIONS = [
  {label: 'select a source', value: 'none'},
  {label: 'hacker news', value: 'hacker news'},
  {label: 'women who code', value: 'women who code'},
  {label: 'diversify tech', value: 'diversify tech'},
  {label: 'remotive.io', value: 'remotive.io'},
  {label: 'we work remotely', value: 'we work remotely'},
  {label: 'remote woman', value: 'remote woman'},
  {label: 'teal community', value: 'teal community'}  
];

function JobsForm({type, jobId}) {
  const {updateJobsDict, jobsDict} = useJobs();
  const [formStatus, setFormStatus] = React.useState('inProgress'); //redirectJobs, redirectEventForm
  const [jobName, setJobName] = React.useState('');
  const [jobStatus, setJobStatus] = React.useState('none');
  const [companyName, setCompanyName] = React.useState('');
  const [jobUrl, setJobUrl] = React.useState('');
  const [jobDescription, setJobDescription] = React.useState('');
  const [jobQuestions, setJobQuestions] = React.useState('');
  const [jobSource, setJobSource] = React.useState('none');
  const [jobGuid, setJobGuid] = React.useState(null);
  const [jobCreatedAt, setJobCreatedAt] = React.useState('');
  const {userGuid, sessionToken, getUserGuid, userEmail} = useAppAuth();
  const { alertDispatch } = useAlert();
  let inputRef = React.useRef(null);

  //input change handlers
  const inputOnChangeHandler = (ev) => {
    const {name, value} = ev.target;
    const nameToSetterDict = {
      'jobName': function(v) {
        setJobName(v)},
      'jobStatus': function(v) {
        setJobStatus(v)},
      'companyName': function(v) {
        setCompanyName(v)},
      'jobUrl': function(v) {
        setJobUrl(v)},
      'jobDescription': function(v) {
        setJobDescription(v)},
      'jobQuestions': function(v) {
        setJobQuestions(v)},
      'jobSource': function(v) {
        setJobSource(v)}
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
        setJobName('');
        setJobStatus('');
        setCompanyName('');
        setJobUrl('');
        setJobDescription('');
        setJobQuestions('');
        setJobSource('');
      } else if (type === 'edit') {

      }
    }

    if (id === 'buttonSave' || id === 'buttonSaveJobEvent') {
      getUserGuid({userEmail})
        .then(uGuid => {
            //handle buttonSave
            let body = {
              name: jobName, 
              status: jobStatus, 
              description: jobDescription, 
              url: jobUrl, 
              company_name: companyName, 
              questions: jobQuestions, 
              source: jobSource, 
              user_guid: uGuid
            }
            if (type === 'create') {
              let guid = uuidv4();
              let curDate = new Date();
              body.guid = guid;
              body.created_at = curDate.toISOString();
              fetch(`http://localhost:3000/api/jobs/`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${sessionToken}`
                },
                body: JSON.stringify(body)
              })
              .then(resp => {
                if (resp.status === 201) {
                  updateJobsDict(body);
                }
                return resp.json(); 
              })
              .then(json => {
                if (json.job_guid) {
                  alertDispatch({ type: ADD, payload: {type: 'success', message: json.message} });
                  setJobGuid(json.job_guid);
                } else {
                  alertDispatch({ type: ADD, payload: {type: 'error', message: json.message} });
                }
              })
              .catch(err => console.error('err', err))
            } else if (type === 'edit' && jobId.length) {
              fetch(`http://localhost:3000/api/jobs/update/${jobId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${sessionToken}`
                },
                body: JSON.stringify(body)
              })
              .then(resp => {
                if (resp.status === 201) {
                  body.guid = jobId;
                  body.created_at = jobCreatedAt;
                  updateJobsDict(body);
                }
                return resp.json();
              })
              .then(json => {
                if (json.job_guid) {
                  alertDispatch({ type: ADD, payload: {type: 'success', message: json.message} });
                } else {
                  alertDispatch({ type: ADD, payload: {type: 'error', message: json.message} });
                }

              })
              .catch(err => console.error('err', err))
            }
        })
    } 

    if (id === 'buttonSave') {
      setFormStatus('redirectJobs')
    }
  }

  //if type=edit, get existing form fields
  React.useEffect(() => {
    if (type === 'edit' && jobId && sessionToken) {
      let url = `http://localhost:3000/api/jobs/${jobId}`
      fetch(url, {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      })
        .then(resp => resp.json())
        .then(json => {
          console.log('json', json)
          const {company_name, description, name, questions, source, status, url, created_at} = json.job;
          if (company_name) {
            setCompanyName(company_name);
          }
          if (name) {
            setJobName(name);
          }
          if (status) {
            setJobStatus(status);
          }
          if (url) {
            setJobUrl(url);
          }
          if (description) {
            setJobDescription(description);
          }
          if (questions) {
            setJobQuestions(questions);
          }
          if (source) {
            setJobSource(source);
          }
          if (created_at) {
            setJobCreatedAt(created_at);
          }
        })
        .catch(err => console.error('err', err))
   }
  }, [])

  React.useEffect(() => {
    if (inputRef) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  React.useEffect(() => {
    if (jobGuid) {
      setFormStatus('redirectEventForm');
    }
  }, [jobGuid])

  if (formStatus === 'redirectJobs') {
    return (
      <Redirect
        to={{
          pathname: "/jobs"
        }}
      />
    )
  }

  if (formStatus === 'redirectEventForm') {
    return (
      <Redirect
        to={{
          pathname: `/events/new/${jobGuid}`
        }}
      />
    )
  }

  if (formStatus === 'inProgress') {
    return (
      <div>
        <h1 className="view_title">JOBS FORM</h1>
        <form>
          <Input type="text" value={jobName} name="jobName" inputRef={inputRef}
            inputOnChangeHandler={inputOnChangeHandler} label="name"/>
          <SelectGroup 
            label="status" name="jobStatus" value={jobStatus} 
            inputOnChangeHandler={inputOnChangeHandler} optionsList={JOB_STATUS_OPTIONS} />
          <Input type="text" value={companyName} name="companyName" inputOnChangeHandler={inputOnChangeHandler} label="company"/>
          <Input type="url" value={jobUrl} name="jobUrl"
            inputOnChangeHandler={inputOnChangeHandler} label="url"/>
          <TextArea value={jobDescription} name="jobDescription" inputOnChangeHandler={inputOnChangeHandler}  
            label="description"/>
          <TextArea value={jobQuestions} name="jobQuestions" inputOnChangeHandler={inputOnChangeHandler}  
            label="questions"/>
          <SelectGroup 
            label="source" name="jobSource" value={jobSource} 
            inputOnChangeHandler={inputOnChangeHandler} optionsList={JOB_SOURCE_OPTIONS} />
          <div>
            <Button id="buttonSaveJobEvent" clickHandler={buttonOnClickHandler} 
              label="Save and Create Event" size="wide"/>
            <Button id="buttonSave" clickHandler={buttonOnClickHandler} 
              label="Save"/>
            <Button id="buttonCancel" clickHandler={buttonOnClickHandler} 
              label="Cancel"/>
          </div>
        </form>
      </div>
    );
  }
};

export default JobsForm;