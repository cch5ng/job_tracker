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
      let isPayloadUnique = true;
      for (let i = 0; i < state.length; i++) {
        if (state[i].message === action.payload.message) {
          isPayloadUnique = false;
          break;
        }
      }
      if (isPayloadUnique) {
        return [
          ...state,
          {
            id: uuidv4(),
            message: action.payload.message,
            type: action.payload.type
          }
        ];  
      } else {
        return state;
      }
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

  return (
    <AlertContext.Provider value={alertData}>
        {children}
        {createPortal(<Alert alert={alert} />, document.body)}
    </AlertContext.Provider>
  )
}

function useAlert() {
  const context = React.useContext(AlertContext)
  if (context === undefined) {
    throw new Error(`useAlert must be used within an AlertProvider`)
  }
  return context;
}

export {AlertProvider, useAlert};