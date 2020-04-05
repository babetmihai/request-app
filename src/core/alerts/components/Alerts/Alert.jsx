import React from 'react'
import join from 'classnames'
import { ALERT_ERROR, ALERT_SUCCESS } from 'core/alerts'
import {
  Warning,
  Info,
  CheckCircle,
  Close
} from '@material-ui/icons'
import {
  SnackbarContent,
  IconButton
} from '@material-ui/core'
import styles from './index.module.scss'

const getClass = (type) => {
  switch (type) {
    case (ALERT_ERROR): return styles.error
    case (ALERT_SUCCESS): return styles.success
    default: return undefined
  }
}

const getIcon = (type) => {
  switch (type) {
    case (ALERT_ERROR): return <Warning />
    case (ALERT_SUCCESS): return <CheckCircle />
    default: return <Info />
  }
}

export default function Alert({ alert, onClose }) {
  const { id, type, message } = alert
  React.useEffect(() => {
    setTimeout(() => onClose(id), 8 * 1000)
  }, []) // eslint-disable-line

  return (
    <SnackbarContent
      className={join(styles.alert, getClass(type))}
      message={
        <div className={styles.message}>
          {getIcon(type)}
          <p>{message}</p>
        </div>
      }
      action={
        <IconButton
          color="inherit"
          className={styles.close}
          onClick={() => onClose(id)}
        >
          <Close />
        </IconButton>
      }
    />
  )
}
