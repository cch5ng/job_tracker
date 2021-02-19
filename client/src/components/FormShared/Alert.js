import React from 'react';
import classNames from 'classnames/bind';
import { AiFillCloseCircle, AiOutlineClose } from "react-icons/ai";
import styles from './Alert.module.css';
import { useAlert, REMOVE } from '../../context/alert-context';

let cx = classNames.bind(styles);

//type, message, onClickHandler, id
const Alert = ({alert}) => {
  const { alertDispatch } = useAlert();

  //TODO put the parent div in here
  //also need to put a mapping function in here because the prop will be a list of alert objects
  return (
    <div id="alert_parent">
      {alert.map(al => {
        const {type, id, message} = al;
        const isAlertError = type === 'error';

        let alertClassName = cx({
          alert_error: isAlertError,
          alert_success: !isAlertError,
          alert: true,
          row_global_top: true,
          alert_container: true
        });
        let titleClassName = cx({
          alert_title_error: isAlertError,
          alert_title_success: !isAlertError,
          title: true
        });
        let messageClassName = cx({
          alert_message_error: isAlertError,
          alert_message_success: !isAlertError
        });
        let iconLeftClassName = cx({
          icon_error: isAlertError,
          icon_success: !isAlertError,
          icon_left: true
        });
        let iconRightClassName = cx({
          icon_error: isAlertError,
          icon_success: !isAlertError,
          icon_right: true
        });

        return (
          <div className={alertClassName} onClick={() =>
            alertDispatch({ type: REMOVE, payload: { id } })
          } id={id}>
            <div className={iconLeftClassName}><AiFillCloseCircle /></div>
            <div className={styles.alert_content}>
              {type === 'error' && (
                <p className={titleClassName}>Error</p>
              )}
              {type !== 'error' && (
                <p className={titleClassName}>Sucess</p>
              )}
              <p className={messageClassName}>{message}</p>
            </div>
            <div className={iconRightClassName}><AiOutlineClose /></div>
          </div>
        )
      })}
    </div>
  )
}

export default Alert;