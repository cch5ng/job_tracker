import React from 'react';
import classNames from 'classnames/bind';
import styles from './TextArea.module.css';

let cx = classNames.bind(styles);

type TextAreaProps = {
  label: string;
  value: string;
  name: string;
  inputOnChangeHandler(event: React.FormEvent<HTMLTextAreaElement>): void;
  inline?: boolean;
  required?: boolean;
}

const TextArea = ({label, value, name, inputOnChangeHandler, inline, required}: TextAreaProps) => {

  const textAreaGroupClassName = cx(
    {
      inputGroupContainer: !inline,
      inputGroupInline: inline
    }
  )

  const labelRequired = `${label} *`;

  return (
    <div className={textAreaGroupClassName}>
      <label htmlFor={name} className={styles.label}>{required ? labelRequired : label}</label>
      <textarea value={value} name={name} 
        className={styles.textArea} onChange={ev => inputOnChangeHandler(ev)}/>
    </div>

  )
}

export default TextArea;