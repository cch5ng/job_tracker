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
  inputRef?: string;
  inputOnChangeHandler(ev: React.FormEvent<HTMLInputElement>): void;
}

const Input = ({type, value, name, inputOnChangeHandler, label, inline, placeholder, inputRef}: InputProps) => {
  const inputGroupClassName = cx(
    {
      inputGroupContainer: !inline,
      inputGroupInline: inline
    }
  );

  return (
    <div className={inputGroupClassName}>
      {label && (
        <label htmlFor={name} className={styles.label}>{label}</label>
      )}
      {value !== undefined && (
        <input type={type} value={value} name={name} 
          className={styles.input} onChange={ev => inputOnChangeHandler(ev)}
          placeholder={placeholder} ref={inputRef} />
      )}
    </div>
  )
}

export default Input;