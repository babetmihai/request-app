import React from 'react'
import join from 'classnames'
import { Link } from 'react-router-dom'
import {
  IconButton,
  Tooltip
} from '@material-ui/core'
import { t } from 'core/intl'
import RequestFormButton from 'core/requests/components/RequestFormButton'
import styles from './index.module.scss'

function Sidebar({ route, routes, className }) {
  const { path: currentPath } = route

  return (
    <div className={join(styles.sidebar, className)}>
      <RequestFormButton className={styles.fab} />
      {routes.map((route) => {
        const { path, icon, id } = route
        return (
          <Tooltip key={id} title={t(id)}>
            <IconButton
              disabled={path === currentPath}
              component={Link}
              size="medium"
              className={styles.fab}
              to={path}
            >
              {icon}
            </IconButton>
          </Tooltip>
        )
      })}
    </div>
  )
}

export default Sidebar