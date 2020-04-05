import 'normalize.css'
import 'utils/polyfills'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { createMuiTheme } from '@material-ui/core/styles'
import { jssPreset, StylesProvider, ThemeProvider } from '@material-ui/styles'
import * as serviceWorker from 'utils/serviceWorker'
import store from 'store'
import { authSync } from 'core/user'
import { initLocale } from 'core/intl'
import { create } from 'jss'
import './index.scss'
import constants from 'constants.module.scss'
import App from './App'

const jssComment = 'jss-insertion-point'
const jss = create({ ...jssPreset(), insertionPoint: jssComment })
const theme = createMuiTheme({
  palette: {
    primary: {
      main: constants.primary
    },
    secondary: {
      main: constants.secondary
    }
  },
  status: {
    danger: {
      main: constants.secondary
    }
  }
})

document.head.prepend(document.createComment(jssComment))
Promise.all([
  initLocale(),
  authSync()
]).then(() => {
  ReactDOM.render((
    <StylesProvider jss={jss}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <HashRouter>
            <App />
          </HashRouter>
        </Provider>
      </ThemeProvider>
    </StylesProvider>
  ), document.getElementById('root'))
})

serviceWorker.unregister()
