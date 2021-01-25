import React from 'react';
import classNames from 'classnames/bind';
import styles from './Button.module.css';

let cx = classNames.bind(styles);

const Button = ({id, clickHandler, label, size, name}) => {

  const buttonClassName = cx({
    button: true,
    small: true,
    wide: size && size === 'wide',
    medium: size && size === 'medium'
  })

  return (
    <button id={id} name={name} className={buttonClassName}
      onClick={ev => clickHandler(ev)}>
      {label}
    </button>
  )
}

export default Button;