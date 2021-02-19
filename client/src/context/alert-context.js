import React, { createContext, useReducer, useContext } from 'react';
import { createPortal } from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import {getDictFromAr} from '../utils';
import Alert from '../components/FormShared/Alert';

const AlertContext = React.createContext([{}, () => {}]);

const initialState = []; //array of alert objects {id, createdDateISO, type, message}

//action types
export const ADD = 'ADD';
export const REMOVE = 'REMOVE';
export const REMOVE_ALL = 'REMOVE_ALL';

export const alertReducer = (state, action) => {
  switch (action.type) {
    case ADD:
      console.log('gets to alertReducer')
      return [
        ...state,
        {
          id: uuidv4(),
          message: action.payload.message,
          type: action.payload.type
        }
      ];
    case REMOVE:
      return state.filter(t => t.id !== action.payload.id);
    case REMOVE_ALL:
      return initialState;
    default:
      return state;
  }
};

function AlertProvider({children}) {
  //alert is [{alert obj}, {}]
  const [alert, alertDispatch] = useReducer(alertReducer, initialState);
  const alertData = { alert, alertDispatch };

  // const getAlertList = () => {
  //   const alertDict = state.alertDict;
  //   let alertList = Object.keys(alertDict).map(alertId => alertDict[alertId]);
  //   if (alertList.length > 1) {
  //     alertList.sort((a, b) => {
  //       let createdDateA = new Date(a.createdDateISO);
  //       let createdDateB = new Date(b.createdDateISO);
  //       if (createdDateB > createdDateA) {
  //         return -1;
  //       } else if (createdDateA > createdDateB) {
  //         return 1;
  //       } else {
  //         return 0;
  //       }
  //     })
  //   }
  //   return alertList;  
  // }

  // const getAlertDict = () => {
  //   return state.alertDict;
  // }

  // const addToAlertDict = (alertObj) => {
  //   let {message} = alertObj;
  //   let isMessageNew = true;

  //   let alertList = getAlertList();
  //   alertList.forEach(alert => {
  //     if (alert.message === message) {
  //       isMessageNew = false;
  //     }
  //   })

  //   if (isMessageNew) {
  //     const id = uuidv4();
  //     alertObj.id = id;
  //     const curDate = new Date();
  //     alertObj.createdDateISO = curDate.toISOString();
  //     setState({...state, alertDict: {...state.alertDict, [id]: alertObj}});  
  //   }
  // }

  // const removeFromAlertDict = (alertId) => {
  //   const copyAlertDict = {...state.alertDict};
  //   delete copyAlertDict[alertId];
  //   setState({ ...state, alertDict: copyAlertDict });
  // }

  //let alertState = {...state, getAlertList, addToAlertDict, removeFromAlertDict, getAlertDict}; //getJobsByUserGuid

   return (
    <AlertContext.Provider value={alertData}>
        {children}
        {createPortal(<Alert alert={alert} />, document.body)}
    </AlertContext.Provider>
  )
}

//this seems simpler method to pass functions from context to consumers
function useAlert() {
  const context = React.useContext(AlertContext)
  if (context === undefined) {
    throw new Error(`useAlert must be used within an AlertProvider`)
  }
  return context;
}

export {AlertProvider, useAlert};