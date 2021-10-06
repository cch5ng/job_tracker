import React, { useState } from 'react';
import {getDictFromAr} from '../utils';

const CompanyContext = React.createContext([{}, () => {}]);
function CompanyProvider({children}) {
  const [state, setState] = React.useState({
    companyDict: {},
    companyRequestStatus: 'pending',
    companyRequestAlert: ''
  });

  const getCompanies = ({url, fbIdToken}) => {
    let body = {fbIdToken}
    fetch(url, {
      body: JSON.stringify(body)
    })
      .then(resp => resp.json())
      .then(json => {
        if (json.companies.length) {
          let {companies} = json;
          let companyObj = {};
          companies.forEach(company => {
            let key = company.id;
            companyObj[key] = company;
          })
          setState({...state, companyDict: companyObj, companyRequestStatus: 'success'})
        } 
      })
      .catch(err => {
        console.error('error', err);
        setState({...state, companyRequestStatus: 'error', companyRequestAlert: err})
      })      
  }

  const updateCompanyDict = (companyObj) => {
    let {id} = companyObj;
    if (!state.companyDict[id]) {
      setState({...state, companyDict: {...state.companyDict, [id]: companyObj}})
    } else {
      let updatedCompany = {...state.companyDict};
      delete updatedCompany[id];
      updatedCompany[id] = companyObj;
      setState({...state, companyDict: updatedCompany});      
    }
  }

  let companyState = {...state, getCompanies, updateCompanyDict};

  return (
    <CompanyContext.Provider value={companyState}>
        {children}
    </CompanyContext.Provider>
  )
}

//this seems simpler method to pass functions from context to consumers
function useCompany() {
  const context = React.useContext(CompanyContext)
  if (context === undefined) {
    throw new Error(`useCompany must be used within a CompanyProvider`)
  }
  return context;
}

export {CompanyProvider, useCompany};