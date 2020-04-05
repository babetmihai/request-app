import React, { Fragment } from 'react'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import { db } from 'utils/firebase'
import { t } from 'core/intl'
import { connect } from 'react-redux'
import requestStore, {
  saveHistory,
  COMPLETED,
  REJECTED,
  CANCELED,
  ARCHIVED
} from 'core/requests'
import userStore from 'core/user'
import { Button } from '@material-ui/core'
import Page from 'components/Page'
import Loader from 'components/Loader'
import Request from 'core/requests/components/Request'
import requestStyles from 'core/requests/index.module.scss'
import styles from './index.module.scss'

function Requests({ requests, user, icon }) {
  const { id: userId } = user || {}
  React.useEffect(() => {
    const reqRef = db.ref('/requests')
    reqRef.on('value', () => reqRef
      .orderByChild('userId')
      .equalTo(userId)
      .once('value')
      .then((snap) => snap.val())
      .then((requests) => requestStore.set('userRequests', requests || {}))
    )
    return () => reqRef.off()
  }, [userId])
  const { userRequests } = requests || {}

  if (!userRequests || isEmpty(userRequests)) {
    return (
      <Page
        loading={!userRequests}
        className={styles.requests}
      >
        <Loader
          icon={icon}
          message={t('no.requests')}
        />
      </Page>
    )
  }

  return (
    <Page className={styles.requests}>
      {Object.values(userRequests)
        .sort((first, second) => (
          moment(second.created).valueOf() -
          moment(first.created).valueOf()
        ))
        .map((req) => {
          const { id, status } = req
          const isDone = [COMPLETED, REJECTED, CANCELED].includes(status)

          return (
            <Request
              key={id}
              request={req}
              actions={
                <Fragment>
                  {!isDone &&
                    <Button
                      className={requestStyles.action}
                      variant="contained"
                      color="secondary"
                      onClick={async () => {
                        await db.ref(`/requests/${id}/status`).set(CANCELED)
                        await saveHistory({ request: req, action: CANCELED })
                      }}
                    >
                      {t('cancel.request')}
                    </Button>
                  }
                  {isDone &&
                    <Button
                      className={requestStyles.action}
                      variant="contained"
                      color="secondary"
                      onClick={async () => {
                        await db.ref(`/archive/${id}`).set(req)
                        await db.ref(`/requests/${id}`).set(null)
                        await saveHistory({ request: req, action: ARCHIVED })
                      }}
                    >
                      {t('archive')}
                    </Button>
                  }
                </Fragment>
              }
            />
          )
        })}
    </Page>
  )
}

export default connect(() => ({
  requests: requestStore.get(),
  user: userStore.get()
}))(Requests)
