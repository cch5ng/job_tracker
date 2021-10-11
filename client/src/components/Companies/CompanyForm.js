import React, {useEffect, useState} from 'react';
import {useParams, Redirect, useHistory} from 'react-router-dom';
import { getAuth } from "firebase/auth";

import {useAuth} from '../../context/auth-context';
import {useCompany} from '../../context/company-context';
import { useAlert, ADD } from '../../context/alert-context';
import Input from '../FormShared/Input';
import TextArea from '../FormShared/TextArea';
import Button from '../FormShared/Button';

function CompanyForm() {
  const {companyId} = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState('');
  const [financial, setFinancial] = useState('');
  const [company, setCompany] = useState({});
  const [formStatus, setFormStatus] = React.useState('inProgress'); //redirectCompanies
  const {userGuid} = useAuth();
  const {updateCompanyDict, companyDict} = useCompany();
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
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
    //call update api endpoint
      user.getIdToken()
        .then(fbIdToken => {

          //let sessionToken = user.getToken();
          let body = {};
          body.name = name;
          body.financial = financial;
          body.description = description;
          body.purpose = purpose;
          body.userGuid = userGuid;
          body.fbIdToken = fbIdToken;
          let updateUrl = `http://localhost:3000/api/company/update/${companyId}`;
    
          fetch(updateUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
              //'Authorization': `Bearer ${sessionToken}`
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
              setFormStatus('redirectCompanies');
            })
            .catch(err => console.error('err', err))

        })
        .catch(error => console.error('err', error))

    }
  }

  useEffect(() => {
    if (companyId && companyDict) {
      let company = companyDict[companyId];
      if (company.name) {
        setName(company.name);
      }
      if (company.description) {
        setDescription(company.description);
      }
      if (company.financial) {
        setFinancial(company.financial)
      }
      if (company.purpose) {
        setPurpose(company.purpose);
      }
    }
  }, []);

  return (
    <div>
      {formStatus === 'redirectCompanies' && (
        <Redirect to="/companies" />
      )}

      {formStatus === 'inProgress' && (
        <>
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
        </>
      )}
    </div>
  )
}

export default CompanyForm;