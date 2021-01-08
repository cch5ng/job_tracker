import React from 'react';
import classNames from 'classnames/bind';
import './Checkbox.css';

const Checkbox = (props) => {
  let { checkboxVal, onChangeHandler, checkboxLabel, id, name, checkClassName, size } = props;
  let checkClass;
  if (checkClassName && size && size === 'largeCheckbox') {
    checkClass = `form-group-large ${checkClassName}`
  } else if (checkClassName) {
    checkClass = `form-group ${checkClassName}`
  }

  let labelClassName = 'checkbox-label';
  if (size && size === 'largeCheckbox') {
    labelClassName = `checkbox-label ${size}`
  }
  if (checkboxLabel) {
    return (
      <div className={checkClass}>
        <input type="checkbox" className="list-item-input"
          checked={checkboxVal}
          onChange={ev => onChangeHandler(ev)}
          name={name} />
        {checkboxLabel && (
          <label className={labelClassName} onClick={ev => onChangeHandler(ev)} id={id}>{checkboxLabel}</label>
        )}
      </div>
    )
  }

  return (
    <div className={checkClass}>
      <input checked={checkboxVal} type="checkbox" className="list-item-input"
        onChange={ev => onChangeHandler(ev)} name={name}
        />
      <label className={labelClassName} onClick={ev => onChangeHandler(ev)} id={id} />
    </div>
  )
}

export default Checkbox;