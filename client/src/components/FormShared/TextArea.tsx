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
}

const TextArea = ({label, value, name, inputOnChangeHandler, inline}: TextAreaProps) => {

  const textAreaGroupClassName = cx(
    {
      inputGroupContainer: !inline,
      inputGroupInline: inline
    }
  )

  return (
    <div className={textAreaGroupClassName}>
      <label htmlFor={name} className={styles.label}>{label}</label>
      <textarea value={value} name={name} 
        className={styles.textArea} onChange={ev => inputOnChangeHandler(ev)}/>
    </div>

  )
}

export default TextArea;