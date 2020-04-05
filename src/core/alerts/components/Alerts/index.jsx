import React from 'react'
import isEmpty from 'lodash/isEmpty'
import ReactDOM from 'react-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { nullIf } from 'utils/react'

import store, { clearAlert } from 'core/alerts'

import Alert from './Alert'
import styles from './index.module.scss'

function Alerts({ alerts = {} }) {

  return ReactDOM.createPortal(
    <div className={styles.alerts}>
      {Object.values(alerts).map((alert) => (
        <Alert
          key={alert.id}
          alert={alert}
          onClose={clearAlert}
        />
      ))}
    </div>,
    document.getElementById('root')
  )
}

export default compose(
  connect(() => ({ alerts: store.get() })),
  nullIf(({ alerts }) => isEmpty(alerts))
)(Alerts)