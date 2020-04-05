import React from 'react'
import moment from 'moment'
import { db } from 'utils/firebase'
import { connect } from 'react-redux'
import requestStore from 'core/requests'
import isEmpty from 'lodash/isEmpty'
import { t } from 'core/intl'
import userStore from 'core/user'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton
} from '@material-ui/core'
import {
  Link,
  Refresh
} from '@material-ui/icons'
import Page from 'components/Page'
import Loader from 'components/Loader'
import styles from './index.module.scss'

function Approvals({ user, requests, icon }) {
  const { id: userId } = user || {}
  const [loading, setLoading] = React.useState()
  React.useEffect(() => {
    const reqRef = db.ref('/history')
    reqRef.on('value', () => reqRef
      .orderByChild('userId')
      .equalTo(userId)
      .once('value')
      .then((snap) => snap.val())
      .then((requests) => requestStore.set('historyList', requests || {}))
    )
    return () => reqRef.off()
  }, [userId])
  const { historyList } = requests || {}

  if (!historyList || isEmpty(historyList)) {
    return (
      <Page
        loading={!historyList}
        className={styles.history}
      >
        <Loader
          icon={icon}
          message={t('no.history.available')}
        />
      </Page>
    )
  }

  return (
    <Page className={styles.history}>
      <Paper className={styles.historyTable}>
        <Table size="small" className={styles.table}>
          <TableHead>
            <TableRow>
              <TableCell>{t('request.no')}</TableCell>
              <TableCell>{t('action')}</TableCell>
              <TableCell align="right">{t('action.date')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.values(historyList)
              .sort((first, second) => (
                moment(second.created).valueOf() -
                moment(first.created).valueOf()
              ))
              .map((historyItem, index) => {
                const { requestId, created, action, requestNo } = historyItem
                const isLoading = loading === index
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <div className={styles.requestCell}>
                        <IconButton
                          disabled={isLoading}
                          size="small"
                          onClick={async () => {
                            setLoading(index)
                            let request = await db.ref(`/requests/${requestId}`)
                              .once('value')
                              .then((snap) => snap.val())
                            if (!request) request = await db.ref(`/archive/${requestId}`)
                              .once('value')
                              .then((snap) => snap.val())

                            await requestStore.set('modalRequest', request)
                            setLoading(undefined)
                          }}
                        >
                          {isLoading
                            ? <Refresh className={styles.loading} />
                            : <Link />
                          }
                        </IconButton>
                        {requestNo}
                      </div>
                    </TableCell>
                    <TableCell>{t(action)}</TableCell>
                    <TableCell align="right">
                      {moment(created).format('L')}
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </Paper>
    </Page>
  )
}
export default connect(() => ({
  requests: requestStore.get(),
  user: userStore.get()
}))(Approvals)