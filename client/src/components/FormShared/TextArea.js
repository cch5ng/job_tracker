const TextArea = ({label, value, name, inputOnChangeHandler}) => {

  return (
    <div>
      <label for={name}>{label}</label>
      <textarea value={value} name={name} onChange={ev => inputOnChangeHandler(ev)}/>
    </div>

  )
}

export default TextArea;