import * as React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {useParams, Redirect, useHistory} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import CreatableSelect from 'react-select/creatable';
import {useAppAuth} from '../../context/auth-context';
import {useJobs} from '../../context/jobs-context';
import {useCompany} from '../../context/company-context';
import { useAlert, ADD } from '../../context/alert-context';
import Input from '../FormShared/Input';
import TextArea from '../FormShared/TextArea';
import SelectGroup from '../FormShared/SelectGroup';
import Button from '../FormShared/Button';
import styles from './Jobs.module.css';
import ButtonGroup from '../FormShared/ButtonGroup';
import {getCreateableDataFromDict} from '../../utils';

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
  const {updateCompanyDict, companyDict} = useCompany();
  const [formStatus, setFormStatus] = React.useState('inProgress'); //redirectJobs, redirectEventForm
  const [jobName, setJobName] = React.useState('');
  const [jobNameError, setJobNameError] = React.useState(false);
  const [jobStatus, setJobStatus] = React.useState('none');
  const [jobStatusError, setJobStatusError] = React.useState(false);

  const [createableDefault, setCreateableDefault] = React.useState({value: '', label: ''})
  // const [companyName, setCompanyName] = React.useState('');
  // const [companyNameError, setCompanyNameError] = React.useState(false);
  const [jobUrl, setJobUrl] = React.useState('');
  const [jobDescription, setJobDescription] = React.useState('');
  const [jobDescriptionError, setJobDescriptionError] = React.useState(false);
  const [jobQuestions, setJobQuestions] = React.useState('');
  const [jobSource, setJobSource] = React.useState('none');
  const [jobSourceError, setJobSourceError] = React.useState(false);
  const [jobGuid, setJobGuid] = React.useState(null);
  const [jobCreatedAt, setJobCreatedAt] = React.useState('');
  const {userGuid, sessionToken, getUserGuid, userEmail} = useAppAuth();
  const { alertDispatch } = useAlert();
  let inputRef = React.useRef(null);

  //TEST
  let creatableData = getCreateableDataFromDict(companyDict);
  console.log('creatableData', creatableData);

  const isFormValid = () => {
    let formIsValid = true;
    if (!jobName.length) {
      setJobNameError(true);
      formIsValid = false;
    } else {
      setJobNameError(false);
    }
    // if (!companyName.length) {
    //   setCompanyNameError(true);
    //   formIsValid = false;
    // } else {
    //   setCompanyNameError(false);
    // }
    if (!jobDescription.length) {
      setJobDescriptionError(true);
      formIsValid = false;
    } else {
      setJobDescriptionError(false);
    }
    if (jobStatus === 'none') {
      setJobStatusError(true);
      formIsValid = false;
    } else {
      setJobStatusError(false);
    }
    if (jobSource === 'none') {
      setJobSourceError(true);
      formIsValid = false;
    } else {
      setJobSourceError(false);
    }
    if (!formIsValid) {
      alertDispatch({ type: ADD, 
        payload: {type: 'error', message: `Name, status, company, description, and source are required.`} });
    }
    return formIsValid;
  }

  //input change handlers
  const inputOnChangeHandler = (ev) => {
    const {name, value} = ev.target;
    const nameToSetterDict = {
      'jobName': function(v) {
        setJobName(v)},
      'jobStatus': function(v) {
        setJobStatus(v)},
      // 'companyName': function(v) {
      //   setCompanyName(v)},
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

  const handleSelectChange = (newValue: any, actionMeta: any) => {
    console.group('Value Changed (new)');
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    if (actionMeta.action === 'create-option') {
      //post new company
      let name = newValue.value;
      if (name.length) {
        getUserGuid({userEmail})
          .then(uGuid => {
            let body = {
              name,
              user_guid: uGuid
            }
            let curDate = new Date();
            body.created_at = curDate.toISOString();
            fetch(`http://localhost:3000/api/company/`, {
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
              if (json.type === 'error') {
                alertDispatch({ type: ADD, payload: {type: json.type, message: json.message} });
              } else if (json.companyId) {
                alertDispatch({ type: ADD, payload: {type: 'success', message: json.message} });
                setCreateableDefault({value: json.companyId, label: name});
                updateCompanyDict({id: json.companyId, name})
              }
            })
            .catch(err => console.error('err', err))
          })
      }
    } else if (actionMeta.action === 'select-option') {
      setCreateableDefault(newValue);
    }

  };

  const handleSelectInputChange = (inputValue: any, actionMeta: any) => {
    console.group('Input Changed (existing)');
    console.log(inputValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  };

  //button click handlers
  const buttonOnClickHandler = (ev) => {
    ev.preventDefault();
    const {id} = ev.target;

    if (id === 'buttonCancel') {
      //handle buttonCancel
      if (type === 'create') {
        setJobName('');
        setJobStatus('');
        setCreateableDefault({value: '', label: ''});
        setJobUrl('');
        setJobDescription('');
        setJobQuestions('');
        setJobSource('');
      } else if (type === 'edit') {

      }
    }

    //error validation
    let formValid = isFormValid();

    if (formValid) {
      if (id === 'buttonSave' || id === 'buttonSaveJobEvent') {
        getUserGuid({userEmail})
          .then(uGuid => {
              //handle buttonSave
              let body = {
                name: jobName, 
                status: jobStatus, 
                description: jobDescription, 
                url: jobUrl,
                company_id: createableDefault.value,
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
                  if (json.type === 'error') {
                    alertDispatch({ type: ADD, payload: {type: json.type, message: json.message} });
                  } else if (json.job_guid) {
                    alertDispatch({ type: ADD, payload: {type: 'success', message: json.message} });
                    setJobGuid(json.job_guid);
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
                  if (json.type === 'error') {
                    alertDispatch({ type: ADD, payload: {type: json.type, message: json.message} });
                  } else if (json.job_guid) {
                    alertDispatch({ type: ADD, payload: {type: 'success', message: json.message} });
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
          const {company_id, description, name, questions, source, status, url, created_at} = json.job;
          if (company_id) {
            let selectOption = {};
            let company = companyDict[company_id];
            selectOption.value = company.id;
            selectOption.label = company.name;
            setCreateableDefault(selectOption);
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
      <Redirect to={{ pathname: "/jobs" }}/>
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
            inputOnChangeHandler={inputOnChangeHandler} label="name" required={true} 
            error={jobNameError} />
          <SelectGroup 
            label="status" name="jobStatus" value={jobStatus} 
            inputOnChangeHandler={inputOnChangeHandler} optionsList={JOB_STATUS_OPTIONS} 
            required={true} error={jobStatusError} />

          <label>company</label>
          <CreatableSelect
            isClearable
            onChange={handleSelectChange}
            onInputChange={handleSelectInputChange}
            options={creatableData}
            value={createableDefault}
          />

          {/* <Input type="text" value={companyName} name="companyName" 
            inputOnChangeHandler={inputOnChangeHandler} label="company" 
            required={true} error={companyNameError} /> */}
          <TextArea value={jobDescription} name="jobDescription" 
            inputOnChangeHandler={inputOnChangeHandler}  label="description" 
            required={true} error={jobDescriptionError} />
          <SelectGroup 
            label="source" name="jobSource" value={jobSource} required={true}
            inputOnChangeHandler={inputOnChangeHandler} 
            optionsList={JOB_SOURCE_OPTIONS} error={jobSourceError} />
          <Input type="url" value={jobUrl} name="jobUrl"
            inputOnChangeHandler={inputOnChangeHandler} label="url"/>
          <TextArea value={jobQuestions} name="jobQuestions" inputOnChangeHandler={inputOnChangeHandler}  
            label="questions"/>
          <ButtonGroup>
            <Button id="buttonSaveJobEvent" clickHandler={buttonOnClickHandler} 
              label="Save and Create Event" size="wide"/>
            <Button id="buttonSave" clickHandler={buttonOnClickHandler} 
              label="Save"/>
            <Button id="buttonCancel" clickHandler={buttonOnClickHandler} 
              label="Cancel"/>
          </ButtonGroup>
        </form>
      </div>
    );
  }
};

export default JobsForm;