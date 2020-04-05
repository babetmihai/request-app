import React, { Fragment } from 'react'
import moment from 'moment'
import join from 'classnames'
import isEmpty from 'lodash/isEmpty'
import { db } from 'utils/firebase'
import { t } from 'core/intl'
import { connect } from 'react-redux'
import requestStore, {
  saveHistory,
  COMPLETED,
  REJECTED,
  APPROVED,
  PENDING
} from 'core/requests'
import userStore from 'core/user'
import { Button } from '@material-ui/core'
import Page from 'components/Page'
import Loader from 'components/Loader'
import Request from 'core/requests/components/Request'
import requestStyles from 'core/requests/index.module.scss'
import styles from './index.module.scss'

function Approvals({ user, requests, icon }) {
  const { email, assignedEmail } = user || {}
  React.useEffect(() => {
    const reqRef = db.ref('/requests')
    reqRef.on('value', () => reqRef
      .orderByChild('assignedEmail')
      .equalTo(email)
      .once('value')
      .then((snap) => snap.val())
      .then((requests) => {
        return requestStore.set('assignedRequests', Object.values(requests || {})
          .filter((req) => [PENDING].includes(req.status))
          .reduce((acc, req) => {
            acc[req.id] = req
            return acc
          }, {})
        )
      })
    )
    return () => reqRef.off()
  }, [email])

  const { assignedRequests } = requests || {}
  if (!assignedRequests || isEmpty(assignedRequests)) {
    return (
      <Page
        loading={!assignedRequests}
        className={styles.approvals}
      >
        <Loader
          icon={icon}
          message={t('no.pending.requests')}
        />
      </Page>
    )
  }

  return (
    <Page className={styles.approvals}>
      {Object.values(assignedRequests)
        .sort((first, second) => (
          moment(first.deadline).valueOf() -
          moment(second.deadline).valueOf()
        ))
        .map((req) => {
          const { id } = req
          return (
            <Request
              key={id}
              assigned
              request={req}
              actions={
                <Fragment>
                  <Button
                    className={requestStyles.action}
                    variant="contained"
                    color="secondary"
                    onClick={async () => {
                      await db.ref(`/requests/${id}/status`).set(REJECTED)
                      await saveHistory({ request: req, action: REJECTED })
                    }}
                  >
                    {t('reject')}
                  </Button>
                  <Button
                    className={join(requestStyles.action, styles.approve)}
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                      if (assignedEmail) {
                        await db.ref(`/requests/${id}/assignedEmail`).set(assignedEmail)
                        await saveHistory({ request: req, action: APPROVED })
                      } else {
                        await db.ref(`/requests/${id}/status`).set(COMPLETED)
                        await saveHistory({ request: req, action: COMPLETED })
                      }
                    }}
                  >
                    {t('approve')}
                  </Button>
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
}))(Approvals)