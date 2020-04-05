import React from 'react'
import get from 'lodash/get'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { nullIf } from 'utils/react'
import { IconButton, Tooltip } from '@material-ui/core'
import { NoteAdd } from '@material-ui/icons'
import { t } from 'core/intl'
import requestStore, { showRequestForm } from 'core/requests'
import userStore from 'core/user'

function RequestFormButton({ requests, className }) {
  const { requestForm } = requests || {}
  return (
    <Tooltip title={t('new.request')}>
      <IconButton
        className={className}
        size="medium"
        disabled={requestForm}
        onClick={showRequestForm}
      >
        <NoteAdd />
      </IconButton>
    </Tooltip>
  )
}

export default compose(
  connect(() => ({
    requests: requestStore.get(),
    user: userStore.get()
  })),
  nullIf(({ user }) => !get(user, 'assignedEmail'))
)(RequestFormButton)