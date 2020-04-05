import React, { Fragment } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import get from 'lodash/get'
import userStore, { USER_ROLE, MANAGER_ROLE } from 'core/user'
import {
  SupervisedUserCircle,
  ListAlt,
  HourglassEmpty
} from '@material-ui/icons'

import Main from 'core/layout/components/Main'
import Alerts from 'core/alerts/components/Alerts'
import Login from 'core/layout/components/Login'

import Requests from 'routes/Requests'
import Approvals from 'routes/Approvals'
import History from 'routes/History'

import RequestFrom from 'core/requests/components/RequestForm'
import RequestModal from 'core/requests/components/RequestModal'

const routes = {
  [USER_ROLE]: [
    { id: 'my.requests', path: '/', component: Requests, icon: <ListAlt /> },
    { id: 'my.history', path: '/history', component: History, icon: <HourglassEmpty /> }
  ],
  [MANAGER_ROLE]: [
    { id: 'my.approvals', path: '/', component: Approvals, icon: <SupervisedUserCircle /> },
    { id: 'my.requests', path: '/requests', component: Requests, icon: <ListAlt /> },
    { id: 'my.history', path: '/history', component: History, icon: <HourglassEmpty /> }
  ]
}

function App({ user }) {
  const { role, assignedEmail } = user || {}
  const userRoutes = get(routes, role, [])
    .filter(({ component }) => assignedEmail || component !== Requests)
  return (
    <Fragment>
      {role
        ? (
          <Main
            user={user}
            routes={userRoutes}
          >
            <Switch>
              {userRoutes.map((route) => {
                const { id, path, component, icon } = route
                return (
                  <Route
                    key={id}
                    exact
                    path={path}
                    render={(props) => React.createElement(component, {
                      ...props,
                      id,
                      icon
                    })}
                  />
                )
              })}
              <Redirect to="/" />
            </Switch>
          </Main>
        ) : <Login />
      }
      <RequestModal />
      <RequestFrom />
      <Alerts />
    </Fragment>
  )
}

export default connect(() => ({
  user: userStore.get()
}))(App)

