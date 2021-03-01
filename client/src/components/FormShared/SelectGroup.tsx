import React from 'react';
import classNames from 'classnames/bind';
import styles from './SelectGroup.module.css';

let cx = classNames.bind(styles);

type SelectGroupProps = {
  label: string;
  name: string;
  value: string;
  optionsList: {
    value: string;
    label: string;
  }[]; 
  inline?: boolean;
  required?: boolean;
  error?: boolean;
  inputOnChangeHandler(event: React.FormEvent<HTMLSelectElement>): void;
}
const SelectGroup = ({ label, name, value, inputOnChangeHandler, optionsList, inline, required, error}: SelectGroupProps) => {
  const selectGroupClassName = cx({
    inputGroupContainer: !inline,
    inputGroupInline: inline 
  });
  const selectClassName = cx({
    select: true,
    error
  });
  const labelRequired = `${label} *`;

  return (
    <div className={selectGroupClassName}>
      {label && (
        <label htmlFor={name} className={styles.label}>{required ? labelRequired : label}</label>
      )}
      <select name={name} value={value} 
        className={selectClassName} onChange={ev => inputOnChangeHandler(ev)}>
        {optionsList.map(option => (
          <option value={option.value} key={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )
}

export default SelectGroup;