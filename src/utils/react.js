import React from 'react'
import noop from 'lodash/noop'

export const nullIf = (selector = noop) => (component) => {
  return function NullIf(props) {
    if (selector(props)) return null
    return React.createElement(component, props)
  }
}

export const decode = (selector = noop, component) => (defaultComponent) => {
  return function Decode(props) {
    if (selector(props)) return React.createElement(component, props)
    return React.createElement(defaultComponent, props)
  }
}

