import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import join from 'classnames'
import styles from './index.module.scss'

export default class Modal extends PureComponent {

  handleKeyDown = (event) => {
    const { onKeyDown, onClose } = this.props
    if (onKeyDown) onKeyDown(event)
    switch (event.key) {
      case 'Escape': {
        if (onClose) onClose()
        break
      }
      default: break
    }
  }

  handleClick = (event) => {
    const { onClose } = this.props
    if (event.target.isSameNode(this.underlayRef)) {
      if (onClose) onClose()
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown, true)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown, true)
  }

  render() {
    const { children, className } = this.props
    return ReactDOM.createPortal((
      <div
        onClick={this.handleClick}
        className={styles.underlay}
        ref={(node) => {
          this.underlayRef = node
        }}
      >
        <div className={join(styles.modal, className)}>
          {children}
        </div>
      </div>
    ), document.getElementById('root'))
  }
}