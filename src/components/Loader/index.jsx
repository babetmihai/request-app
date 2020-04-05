import React from 'react'
import join from 'classnames'
import styles from './index.module.scss'

function Loader({ className, message, icon }) {

  return (
    <div className={join(styles.loader, className)}>
      <div className={styles.center}>
        {React.cloneElement(icon, {
          className: join(
            styles.icon,
            icon.props.className
          )
        })}
        <h2 className={styles.message}>
          {message}
        </h2>
      </div>
    </div>
  )
}

export default Loader
