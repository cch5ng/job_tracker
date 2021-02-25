import React from 'react';
import styles from './ButtonGroup.module.css';

function ButtonGroup(props) {
  return (
    <div className={styles.button_group_container}>
      {props.children}
    </div>
  )
}

export default ButtonGroup;