import React from 'react'
import get from 'lodash/get'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { nullIf } from 'utils/react'
import { t } from 'core/intl'
import requestStore from 'core/requests'
import { Button } from '@material-ui/core'
import Modal from 'components/Modal'
import Request from 'core/requests/components/Request'
import requestStyles from 'core/requests/index.module.scss'

const handleClose = () => requestStore.delete('modalRequest')
function RequestModal({ requests }) {
  const { modalRequest } = requests || {}
  return (
    <Modal onClose={handleClose}>
      <Request
        elevation={11}
        open
        assigned
        request={modalRequest}
        actions={(
          <Button
            tabIndex={-1}
            color="primary"
            variant="contained"
            className={requestStyles.action}
            onClick={handleClose}
          >
            {t('close')}
          </Button>
        )}
      />
    </Modal>
  )
}

export default compose(
  connect(() => ({
    requests: requestStore.get()
  })),
  nullIf(({ requests }) => !get(requests, 'modalRequest'))
)(RequestModal)
