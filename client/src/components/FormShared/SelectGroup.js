import classNames from 'classnames/bind';
import styles from './SelectGroup.module.css';

let cx = classNames.bind(styles);

const SelectGroup = ({ label, name, value, inputOnChangeHandler, optionsList, inline}) => {

  const selectGroupClassName = cx(
    {
      inputGroupContainer: !inline,
      inputGroupInline: inline
    }
  );

  return (
    <div className={selectGroupClassName}>
      {label && (
        <label htmlFor={name} className={styles.label}>{label}</label>
      )}
      <select name={name} value={value} 
        className={styles.select} onChange={ev => inputOnChangeHandler(ev)}>
        {optionsList.map(option => (
          <option value={option.value} key={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )
}

export default SelectGroup;