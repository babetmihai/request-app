import React from 'react'
import { withRouter } from 'react-router'
import Header from './Header'
import Sidebar from './Sidebar'
import styles from './index.module.scss'

function Main({ children, user, routes, location }) {
  const currentRoute = routes.find(({ path }) => path === location.pathname) || {}

  return (
    <div className={styles.main}>
      <Header user={user} route={currentRoute} />
      <div className={styles.content}>
        <Sidebar
          routes={routes}
          route={currentRoute}
          className={styles.sidebar}
        />
        <div className={styles.rightContent}>
          {children}
        </div>
      </div>

    </div>
  )
}

export default withRouter(Main)