import React from 'react';
import classNames from 'classnames/bind';
import { AiFillCloseCircle, AiOutlineClose } from "react-icons/ai";
import styles from './Alert.module.css';

let cx = classNames.bind(styles);

const Alert = ({type, message, onClickHandler, id}) => {
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
  })

  let iconRightClassName = cx({
    icon_error: isAlertError,
    icon_success: !isAlertError,
    icon_right: true
  })

  return (
    <div className={alertClassName} onClick={(ev) => onClickHandler(ev)} id={id}>
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
}

export default Alert;