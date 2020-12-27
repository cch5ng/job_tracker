import classNames from 'classnames/bind';
import styles from './Input.module.css';

let cx = classNames.bind(styles);

const Input = ({type, value, name, inputOnChangeHandler, label, inline, checked}) => {

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
      {checked !== undefined && (
        <input type={type} checked={checked} name={name} 
          className={styles.input} onChange={ev => inputOnChangeHandler(ev)}/>
      )}
      {value !== undefined && (
        <input type={type} value={value} name={name} 
          className={styles.input} onChange={ev => inputOnChangeHandler(ev)}/>
      )}
    </div>
  )
}

export default Input;