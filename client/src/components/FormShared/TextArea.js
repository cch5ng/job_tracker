import classNames from 'classnames/bind';
import styles from './TextArea.module.css';

let cx = classNames.bind(styles);

const TextArea = ({label, value, name, inputOnChangeHandler, inline}) => {

  const textAreaGroupClassName = cx(
    {
      inputGroupContainer: !inline,
      inputGroupInline: inline
    }
  )

  return (
    <div className={textAreaGroupClassName}>
      <label for={name} className={styles.label}>{label}</label>
      <textarea value={value} name={name} 
        className={styles.textArea} onChange={ev => inputOnChangeHandler(ev)}/>
    </div>

  )
}

export default TextArea;