import React, { useState } from 'react';

const JobsContext = React.createContext([{}, () => {}]);
function JobsProvider({children}) {
  const [state, setState] = React.useState({
    jobsDict: {},
    status: 'pending'
  });

  // const getJobsByUserGuid = ({userGuid}) => {
  //   //make api request
  //   //check if the user exists in the db
  //   return fetch('http://localhost:3000/api/auth/guid', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({email: userEmail})
  //   })
  //     .then(resp => resp.json())
  //     .then(json => {
  //       if (json.user_guid) {
  //         //yes
  //         let userGuid = json.user_guid;
  //         setState({...state, userGuid});
  //         return userGuid;  
  //       } else {
  //         //no
  //         return fetch('http://localhost:3000/api/auth/user', {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json'
  //           },
  //           body: JSON.stringify({email: userEmail})
  //         })
  //           .then(resp => resp.json())
  //           .then(json => {
  //             console.log('json', json)
  //             if (json.user_guid) {
  //               //yes
  //               let userGuid = json.user_guid;
  //               setState({...state, userGuid});
  //               return userGuid;  
  //             }
  //           })
  //       }
  //     })
  //     .catch(err => console.error('err', err))        
  // }

  let jobsState = {...state, }; //getJobsByUserGuid

  /**
   * Provider component is the place where you'd pass a prop called value to, 
   * which you can subsequently consume within the Consumer component
   */
  return (
    <JobsContext.Provider value={jobsState}>
      {state.status === 'pending' ? (
        'Loading...'
      ) : state.status === 'error' ? (
        'There was an error retrieving jobs. Please retry.'
      ) : (
        children
      )}
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