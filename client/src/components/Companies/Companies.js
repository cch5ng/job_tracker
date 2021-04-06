import React from 'react';
import {Link} from 'react-router-dom';
import {useCompany} from '../../context/company-context';
import Button from '../FormShared/Button';

function Companies() {
  const {companyDict} = useCompany();
  console.log('companyDict', companyDict)
  const companyList = [];
  if (companyDict) {
    Object.keys(companyDict).forEach(companyId => {
      companyList.push(companyDict[companyId]);
    })
  }
  return (
    <div>
      <h1>Companies</h1>
      <>
      {companyList.map(company => {
        const companyFormUrl = `/companies/form/${company.id}`
        return (
          <div key={company.id} className="list_item_container">
            <h2>{company.name}</h2>
            <Link to={companyFormUrl}>
              <Button name="button_events" label="Edit" clickHandler={() => {}} size="wide"/>
            </Link>
            </div>
        )
      })}
      </>
    </div>
  )
}

export default Companies;