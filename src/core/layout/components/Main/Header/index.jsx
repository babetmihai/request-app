import React from 'react'
import join from 'classnames'
import { IconButton } from '@material-ui/core'
import { PowerSettingsNew } from '@material-ui/icons'
import { logout } from 'core/user'
import { t } from 'core/intl'
import styles from './index.module.scss'

function Header({ user, route, className }) {
  const { email } = user || {}
  const { id } = route || {}

  return (
    <div className={join(styles.header, className)}>
      <div className={styles.left}>
        <h1 className={styles.title}>{t(id)}</h1>
        <div className="spacer" />
        <p className={styles.link}>{email}</p>
      </div>
      <IconButton
        className={styles.logout}
        aria-label="Logout"
        onClick={logout}
      >
        <PowerSettingsNew />
      </IconButton>
    </div>
  )
}

export default Header