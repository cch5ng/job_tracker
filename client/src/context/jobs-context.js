import React, { useState } from 'react';
import {getDictFromAr} from '../utils';

const JobsContext = React.createContext([{}, () => {}]);
function JobsProvider({children}) {
  const [state, setState] = React.useState({
    jobsDict: {},
    status: 'pending'
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
          setState({...state, jobsDict: jobsObj, status: 'success'})
        } 
      })
      .catch(err => {
        console.error('error', err);
        setState({...state, status: 'error'})
      })      
  }

  const updateJobsDict = (jobObj) => {
    let {guid} = jobObj;
    setState({...state, jobsDict: {...state.jobsDict, [guid]: jobObj}})
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