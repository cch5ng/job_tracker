import React from 'react';
import classNames from 'classnames/bind';
import styles from './Input.module.css';

let cx = classNames.bind(styles);

//TODO see if checked is used at all
type InputProps = {
  type: string; 
  value: string; 
  name: string;
  label: string;
  inline?: boolean;
  placeholder?: string;
  required?: boolean;
  inputRef?: string;
  error?: boolean;
  inputOnChangeHandler(ev: React.FormEvent<HTMLInputElement>): void;
}

const Input = ({type, value, name, inputOnChangeHandler, label, inline, 
  placeholder, inputRef, required, error}: InputProps) => {
  const inputGroupClassName = cx(
    {
      inputGroupContainer: !inline,
      inputGroupInline: inline,
    }
  );
  const inputClassName = cx({
    input: true,
    error,
  });
  const labelRequired = `${label} *`;


  return (
    <div className={inputGroupClassName}>
      {label && (
        <label htmlFor={name} className={styles.label}>{required ? labelRequired : label}</label>
      )}
      {value !== undefined && (
        <input type={type} value={value} name={name} 
          className={inputClassName} onChange={ev => inputOnChangeHandler(ev)}
          placeholder={placeholder} ref={inputRef} />
      )}
    </div>
  )
}

export default Input;