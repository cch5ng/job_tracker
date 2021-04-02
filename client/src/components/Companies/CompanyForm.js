import React, {useEffect, useState} from 'react';
import {useParams, Redirect, useHistory} from 'react-router-dom';
import {useAppAuth} from '../../context/auth-context';
import {useCompany} from '../../context/company-context';
import { useAlert, ADD } from '../../context/alert-context';

import Input from '../FormShared/Input';
import TextArea from '../FormShared/TextArea';
import Button from '../FormShared/Button';

function CompanyForm() {
  const {companyId} = useParams();
  console.log('companyId', companyId);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState('');
  const [financial, setFinancial] = useState('');
  const [company, setCompany] = useState({});
  const {userGuid, sessionToken} = useAppAuth();
  const {updateCompanyDict} = useCompany();
  const { alertDispatch } = useAlert();

  const inputOnChangeHandler = (ev) => {
    const {name, value} = ev.target;

    if (value.length) {
      switch(name) {
        case('name'):
          setName(value);
          return;
        case('financial'):
          setFinancial(value);
          return;
        case('description'):
          setDescription(value);
          return;
        case('purpose'):
          setPurpose(value);
          return;
        default:
          return;
      }  
    }

  }

  const buttonOnClickHandler = (ev) => {
    ev.preventDefault();
    //call update api endpoint
    let body = {};
    body.name = name;
    body.financial = financial;
    body.description = description;
    body.purpose = purpose;
    body.userGuid = userGuid;
    let updateUrl = `http://localhost:3000/api/company/update/${companyId}`;

    fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
      },
      body: JSON.stringify(body)
    })
    .then(resp => {
      if (resp.status === 201) {
        let newCompany = {...body, id: companyId};
        delete newCompany['userGuid'];
        updateCompanyDict(newCompany);
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

  //useEffect(() => {
  // }, []);

  /*
  error={jobNameError}
  error={jobDescriptionError} 
  */

  return (
    <div>
      <h1 className="view_title">Company Edit Form</h1>
      <form>
        <Input type="text" value={name} name="name"
          inputOnChangeHandler={inputOnChangeHandler} label="name" required={true} />
        <Input type="text" value={financial} name="financial"
          inputOnChangeHandler={inputOnChangeHandler} label="financial" />
        <TextArea value={description} name="description" 
          inputOnChangeHandler={inputOnChangeHandler}  label="description" />
        <TextArea value={purpose} name="purpose" 
          inputOnChangeHandler={inputOnChangeHandler}  label="purpose" />
        <Button id="buttonSave" clickHandler={buttonOnClickHandler} 
          label="Save"/>

      </form>
    </div>
  )
}

/*
name (required)
description (size, background, values); text area
purpose (what they do); input
financial (funding status); input
*/

export default CompanyForm;