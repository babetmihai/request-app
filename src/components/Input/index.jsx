import React from 'react'
import join from 'classnames'
import styles from './index.module.scss'

export default function Input({
  append,
  error,
  className,
  value = '',
  loading,
  multiline,
  label,
  ...props
}) {

  return (
    <div className={join(styles.input, className)}>
      {label && <label>{label}</label>}
      <div className="input-group">
        {React.createElement(multiline ? 'textarea' : 'input',
          {
            ...props,
            value,
            className: join(
              'form-control',
              styles.input,
              error && 'is-invalid'
            )
          }
        )}
        {append &&
          <div className="input-group-append">
            {append}
          </div>
        }
      </div>
      {error &&
        <div className={join('invalid-feedback', styles.error)}>
          {error}
        </div>
      }
    </div>
  )
}
