import React from 'react';
import styles from './Button.module.css';

const Button = ({ onClick, children, type = 'button', className = '', id }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`${styles.button} ${className}`}
      id={id} 
    >
      {children}
    </button>
  );
};

export default Button;