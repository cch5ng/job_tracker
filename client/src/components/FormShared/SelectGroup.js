const SelectGroup = ({ label, name, value, inputOnChangeHandler, optionsList}) => {
  return (
    <div>
      <label for={name}>{label}</label>
      <select name={name} value={value} onChange={ev => inputOnChangeHandler(ev)}>
        {optionsList.map(option => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )
}

export default SelectGroup;