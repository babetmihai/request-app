import React, { PureComponent } from 'react'
import join from 'classnames'
import { Refresh } from '@material-ui/icons'
import Loader from 'components/Loader'
import styles from './index.module.scss'

export default class Page extends PureComponent {

  render() {
    const {
      children,
      loading,
      className
    } = this.props

    return (
      <div className={join(styles.page, className)}>
        {loading
          ? <Loader icon={<Refresh className={styles.loading} />} />
          : children
        }
      </div>
    )
  }
}
