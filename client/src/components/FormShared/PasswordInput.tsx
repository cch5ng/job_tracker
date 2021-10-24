import React, {useState} from 'react';
import classNames from 'classnames/bind';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import styles from './Input.module.css';
import Input from './Input';

let cx = classNames.bind(styles);

//TODO see if checked is used at all
type InputProps = {
  type: string; 
  value: string; 
  name: string;
  id?: string;
  label: string;
  inline?: boolean;
  placeholder?: string;
  required?: boolean;
  inputRef?: string;
  error?: boolean;
  help?: string;
  inputOnChangeHandler(ev: React.FormEvent<HTMLInputElement>): void;
}

const PasswordInput = ({type, value, name, inputOnChangeHandler, label, inline, 
  placeholder, inputRef, required, error, id, help}: InputProps) => {

  const [showPassword, setShowPassword] = useState(false);

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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  if (!showPassword) {
    return (
      <div className={inputGroupClassName}>
        {label && (
          <label htmlFor={name} className={styles.label}>{required ? labelRequired : label}</label>
        )}
        {error && (
          <span>{error}</span>
        )}
        {help && (
          <span>{help}</span>
        )}
        {value !== undefined && (
          <div className={styles.password_input_container}>

            <input type='password' value={value} name={name} 
              className={styles.password_input} onChange={ev => inputOnChangeHandler(ev)}
              placeholder={placeholder} ref={inputRef} />
            <AiFillEye className={styles.icon} onClick={(ev) => toggleShowPassword()} />
          </div>
        )}
      </div>
    )
  } 

  return (
    <div className={inputGroupClassName}>
      {label && (
        <label htmlFor={name} className={styles.label}>{required ? labelRequired : label}</label>
      )}
      {error && (
        <span>{error}</span>
      )}
      {help && (
        <span>{help}</span>
      )}
      {value !== undefined && (
        <div className={styles.password_input_container}>

          <input type='text' value={value} name={name} 
            className={styles.password_input} onChange={ev => inputOnChangeHandler(ev)}
            placeholder={placeholder} ref={inputRef} />
          <AiFillEyeInvisible className={styles.icon} onClick={(ev) => toggleShowPassword()} />
        </div>
      )}
    </div>

  )
}

export default PasswordInput;
