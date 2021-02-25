import React, { useState } from 'react';
import {getDictFromAr} from '../utils';

const JobsContext = React.createContext([{}, () => {}]);
function JobsProvider({children}) {
  const [state, setState] = React.useState({
    jobsDict: {},
    jobsRequestStatus: 'pending',
    jobsRequestAlert: ''
  });

  const getJobsForUser = ({url, token}) => {
    fetch(url, {
      headers: {Authorization: `Bearer ${token}`}
    })
      .then(resp => resp.json())
      .then(json => {
        if (json.jobs.length) {
          let {jobs} = json;
          let jobsObj = getDictFromAr(jobs);
          setState({...state, jobsDict: jobsObj, jobsRequestStatus: 'success'})
        } 
      })
      .catch(err => {
        console.error('error', err);
        setState({...state, jobsRequestStatus: 'error', jobsRequestAlert: err})
      })      
  }

  const updateJobsDict = (jobObj) => {
    let {guid} = jobObj;
    if (!state.jobsDict[guid]) {
      setState({...state, jobsDict: {...state.jobsDict, [guid]: jobObj}})
    } else {
      let updatedJobs = {...state.jobsDict}
      delete updatedJobs[guid];
      updatedJobs[guid] = jobObj;
      console.log('updatedJobs', updatedJobs)
      setState({...state, jobsDict: updatedJobs});      
    }
  }

  let jobsState = {...state, getJobsForUser, updateJobsDict}; //getJobsByUserGuid

  /**
   * Provider component is the place where you'd pass a prop called value to, 
   * which you can subsequently consume within the Consumer component
   */
/*
      {state.status === 'pending' ? (
        'Loading...'
      ) : state.status === 'error' ? (
        'There was an error retrieving jobs. Please retry.'
      ) : (
      )}
*/

   return (
    <JobsContext.Provider value={jobsState}>
        {children}
    </JobsContext.Provider>
  )
}

//this seems simpler method to pass functions from context to consumers
function useJobs() {
  const context = React.useContext(JobsContext)
  if (context === undefined) {
    throw new Error(`useJobs must be used within a JobsProvider`)
  }
  return context;
}

export {JobsProvider, useJobs};