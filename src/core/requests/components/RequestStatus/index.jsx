import React, { PureComponent } from 'react'
import join from 'classnames'
import { COMPLETED, REJECTED, PENDING } from 'core/requests'
import styles from './index.module.scss'

export default class RequestStatus extends PureComponent {

  getClassName() {
    const { status } = this.props

    switch (status) {
      case (COMPLETED): return styles.completed
      case (REJECTED): return styles.rejected
      case (PENDING): return styles.pending
      default: return undefined
    }
  }

  render() {
    const { className } = this.props
    const statusClassName = join(
      styles.cardStatus,
      this.getClassName(),
      className
    )

    return <div className={statusClassName} />
  }
}
