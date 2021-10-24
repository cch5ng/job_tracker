import React, {useState} from 'react';
import classNames from 'classnames/bind';
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
  inputOnChangeHandler(ev: React.FormEvent<HTMLInputElement>): void;
}

const PasswordInput = ({type, value, name, inputOnChangeHandler, label, inline, 
  placeholder, inputRef, required, error, id}: InputProps) => {

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

  if (!showPassword) {
    return (
      <div className={inputGroupClassName}>
        {label && (
          <label htmlFor={name} className={styles.label}>{required ? labelRequired : label}</label>
        )}
        {value !== undefined && (
          <input type='password' value={value} name={name} 
            className={inputClassName} onChange={ev => inputOnChangeHandler(ev)}
            placeholder={placeholder} ref={inputRef} />
        )}
      </div>
    )
  } 

  return (
    <Input type='text'
      id={name}
      name={name}
      label='Password'
      value={value}
      inputOnChangeHandler={inputOnChangeHandler}
      error={error}
    />

    // <div className={inputGroupClassName}>
    //   {label && (
    //     <label htmlFor={name} className={styles.label}>{required ? labelRequired : label}</label>
    //   )}
    //   {error && (
    //     <span>{error}</span>
    //   )}
    //   {value !== undefined && (
    //     <input type='text' value={value} name={name} 
    //       className={inputClassName} onChange={ev => inputOnChangeHandler(ev)}
    //       placeholder={placeholder} ref={inputRef} />
    //   )}
    // </div>
  )
}

export default PasswordInput;
