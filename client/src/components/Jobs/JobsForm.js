import {useState, useEffect} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {useParams, Redirect, useHistory} from 'react-router-dom';
import {useAppAuth} from '../../context/auth-context';
import Input from '../FormShared/Input';
import TextArea from '../FormShared/TextArea';
import SelectGroup from '../FormShared/SelectGroup';

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

function JobsForm(props) {
  const {type} = props;
  let jobId;
  if (type === 'edit') {
    jobId = props.jobId;
  }
  const [formStatus, setFormStatus] = useState('inProgress'); //redirectJobs, redirectEventForm
  const [jobName, setJobName] = useState('');
  const [jobStatus, setJobStatus] = useState('none');
  const [companyName, setCompanyName] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobQuestions, setJobQuestions] = useState('');
  const [jobSource, setJobSource] = useState('none');
  const [jobGuid, setJobGuid] = useState(null);

  const {userGuid, sessionToken, getUserGuid, userEmail} = useAppAuth();

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
              fetch(`http://localhost:3000/api/jobs/`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${sessionToken}`
                },
                body: JSON.stringify(body)
              })
              .then(resp => resp.json())
              .then(json => {
                if (json.job_guid) {
                  setJobGuid(json.job_guid);
                }
              })
              .catch(err => console.error('err', err))
            } else if (type === 'edit') {
              fetch(`http://localhost:3000/api/jobs/`, {
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
      setFormStatus('redirectJobs')
    }
    // if (id === 'buttonSaveJobEvent' && jobGuid) {
    //   setFormStatus('redirectEventForm')
    // }
  }

  //if type=edit, get existing form fields
  useEffect(() => {
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
          const {company_name, description, name, questions, source, status, url} = json.job;
          if (company_name) {
            setCompanyName(companyName);
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

/*
company_name: null
description: "fake desc"
guid: "7109867a-a8d8-4ef5-b3ee-e3d0023ce9fd"
name: "test_job"
questions: "how do you practice inclusion?"
source: "the moogler"
status: "applied"
url: "http://jobs.com"
*/

        })
        .catch(err => console.error('err', err))
   }
  }, [])

  useEffect(() => {
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
        <h1>JOBS FORM</h1>
        <form>
          <Input type="text" value={jobName} name="jobName" inputOnChangeHandler={inputOnChangeHandler} label="name"/>

          <SelectGroup 
            label="status" name="jobStatus" value={jobStatus} 
            inputOnChangeHandler={inputOnChangeHandler} optionsList={JOB_STATUS_OPTIONS} />

          {/* <div>
            <label>status</label>
            <select name="jobStatus" value={jobStatus} onChange={inputOnChangeHandler}>
              {JOB_STATUS_OPTIONS.map(option => (
                <option value={option.value}>{option.label}</option>
              ))}
            </select>
          </div> */}

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

          {/* <div>
            <label>source</label>
            <select name="jobSource" value={jobSource} onChange={inputOnChangeHandler}>
              {JOB_SOURCE_OPTIONS.map(option => (
                <option value={option.value}>{option.label}</option>
              ))}
            </select>
          </div> */}
          <div>
            <button id="buttonSaveJobEvent" onClick={buttonOnClickHandler}>Save and Create Event</button>
            <button id="buttonSave" onClick={buttonOnClickHandler}>Save</button>
            <button id="buttonCancel" onClick={buttonOnClickHandler}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

};

export default JobsForm;