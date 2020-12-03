import {useState, useEffect} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {useAppAuth} from '../../context/auth-context';

const JOB_STATUS_OPTIONS = [
  'applied',
  'interview scheduled',
  'in process',
  'archived'
];
const JOB_SOURCE_OPTIONS = [
  'hacker news',
  'women who code',
  'diversify tech',
  'stack overflow',
  'remotive.io',
  'we work remotely',
  'remote woman',
  'teal community'
];

function JobsForm(props) {
  const {type} = props;

  const [jobName, setJobName] = useState('');
  const [jobStatus, setJobStatus] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobQuestions, setJobQuestions] = useState('');
  const [jobSource, setJobSource] = useState('');

  const {userGuid, sessionToken} = useAppAuth();

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

    //handle buttonSave

    //handle buttonCancel

  }

  //if type=edit, get existing form fields
  //useEffect(() => {
  //  if (type === 'edit') {
  //  }
  //}, [])

  return (
    <div>
      <h1>JOBS FORM</h1>
      <form>
        <div>
          <label>name</label>
          <input type="text" value={jobName} name="jobName" onChange={inputOnChangeHandler}/>
        </div>
        <div>
          <label>status</label>
          <select name="jobStatus" value={jobStatus} onChange={inputOnChangeHandler}>
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
            {JOB_SOURCE_OPTIONS.map(option => (
              <option value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <button id="buttonSave" onClick={buttonOnClickHandler}>Save</button>
          <button id="buttonCancel" onClick={buttonOnClickHandler}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default JobsForm;