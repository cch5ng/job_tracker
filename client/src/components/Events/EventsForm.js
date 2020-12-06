import {useState, useEffect} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {useParams, Redirect} from 'react-router-dom';
import {useAppAuth} from '../../context/auth-context';

function EventsForm(props) {
  const {type} = props;
  let jobId;
  if (type === 'edit') {
    jobId = props.jobId;
  }
  const [formStatus, setFormStatus] = useState('inProgress'); //redirectJobs, redirectEventForm
  const [jobName, setJobName] = useState('');
  const [jobStatus, setJobStatus] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobQuestions, setJobQuestions] = useState('');
  const [jobSource, setJobSource] = useState('');

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

    if (id === 'buttonSave') {
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
              .then(json => console.log('json', json))
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
    if (id === 'buttonSaveJobEvent') {
      setFormStatus('redirectEventForm')
    }
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
        })
        .catch(err => console.error('err', err))
   }
  }, [])

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
          pathname: "/events/form"
        }}
      />
    )
  }


  if (formStatus === 'inProgress') {
    return (
      <div>
        <h1>EVENTS FORM</h1>
        <form>
          <div>
            <label>name</label>
            <input type="text" value={jobName} name="jobName" onChange={inputOnChangeHandler}/>
          </div>
          <div>
            <label>status</label>
            <select name="jobStatus" value={jobStatus} onChange={inputOnChangeHandler}>
              <option value="none">Select a status</option>
              {JOB_STATUS_OPTIONS.map(option => (
                <option value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label>company</label>
            <input type="text" value={companyName} name="companyName" onChange={inputOnChangeHandler}/>
          </div>
          <div>
            <label>url</label>
            <input type="url" value={jobUrl} name="jobUrl" onChange={inputOnChangeHandler}/>
          </div>
          <div>
            <label>description</label>
            <textarea value={jobDescription} name="jobDescription" onChange={inputOnChangeHandler}/>
          </div>
          <div>
            <label>questions</label>
            <textarea value={jobQuestions} name="jobQuestions" onChange={inputOnChangeHandler}/>
          </div>
          <div>
            <label>source</label>
            <select name="jobSource" value={jobSource} onChange={inputOnChangeHandler}>
              <option value="none">Select a source</option>
              {JOB_SOURCE_OPTIONS.map(option => (
                <option value={option}>{option}</option>
              ))}
            </select>
          </div>
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

export default EventsForm;