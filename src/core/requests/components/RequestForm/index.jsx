import React from 'react'
import join from 'classnames'
import { Formik } from 'formik'
import { t } from 'core/intl'
import moment from 'moment'
import { db } from 'utils/firebase'
import shortid from 'shortid'
import get from 'lodash/get'
import set from 'lodash/set'
import unsetFp from 'lodash/fp/unset'
import setFp from 'lodash/fp/set'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { nullIf } from 'utils/react'
import userStore from 'core/user'
import requestStore, {
  PENDING,
  CREATED,
  hideRequestForm,
  saveHistory
} from 'core/requests'
import {
  Add,
  Delete
} from '@material-ui/icons'
import {
  Fab,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Tooltip,
  Paper
} from '@material-ui/core'
import RequestStatus from 'core/requests/components/RequestStatus'
import Modal from 'components/Modal'
import requestStyles from 'core/requests/index.module.scss'
import styles from './index.module.scss'

const initialLine = { item: '', qty: '' }

function RequestForm({ user }) {
  const { id: userId, email, assignedEmail } = user || {}

  return (
    <Formik
      validateOnChange={false}
      initialValues={{
        date: '',
        notes: '',
        lines: { [shortid.generate()]: initialLine }
      }}
      validate={(values) => {
        let errors = {}
        const { date, lines } = values
        if (!date) set(errors, 'date', t('mandatory.field'))
        Object.keys(lines).forEach((id) => {
          const { item, qty } = get(lines, id, {})
          if (!item || !qty) set(errors, `lines.${id}.item`, t('empty.line'))
        })
        return errors
      }}
      onSubmit={async (values, { setSubmitting }) => {
        const { date, notes, lines } = values
        const number = await db.ref('/requestSequence').once('value')
          .then((snap) => snap.val() || 0)
        await db.ref('/requestSequence').set(number + 1)
        const requestRef = await db.ref('/requests').push()
        const request = {
          id: requestRef.key,
          number,
          userId,
          deadline: moment(date).valueOf(),
          created: moment().valueOf(),
          email,
          assignedEmail,
          notes,
          lines,
          status: PENDING
        }
        await requestRef.set(request)
        await saveHistory({ request, action: CREATED })
        setSubmitting(false)
        hideRequestForm()
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        setValues
      }) => {
        const oneLine = Object.keys(values.lines).length <= 1

        return (
          <Modal onClose={hideRequestForm}>
            <Paper
              elevation={11}
              className={styles.requestForm}
            >
              <RequestStatus />
              <div className={requestStyles.rightContent}>
                <div className={requestStyles.content}>
                  {Object.keys(values.lines).map((id, index) => {
                    const itemPath = `lines.${id}.item`
                    const qtyPath = `lines.${id}.qty`
                    const lineTouched = Boolean(
                      get(touched, itemPath) &&
                    get(touched, qtyPath)
                    )
                    const lineError = Boolean(get(errors, `lines.${id}`))

                    return (
                      <div key={id} className={requestStyles.line}>
                        <TextField
                          id={itemPath}
                          autoFocus
                          value={get(values, itemPath, '')}
                          error={lineTouched && lineError}
                          helperText={lineTouched && get(errors, itemPath)}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label={`${t('product')} ${index + 1}`}
                          className={requestStyles.lineField}
                          InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                          id={qtyPath}
                          value={get(values, qtyPath, '')}
                          error={lineTouched && lineError}
                          helperText={lineTouched && get(errors, qtyPath)}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label={t('qty')}
                          type="number"
                          className={requestStyles.lineField}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            endAdornment: !oneLine && (
                              <InputAdornment position="end">
                                <IconButton
                                  tabIndex={-1}
                                  onClick={() => setValues(unsetFp(`lines.${id}`, values))}
                                >
                                  <Delete />
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      </div>
                    )
                  })}
                  <Tooltip title={t('add.product')}>
                    <Fab
                      color="primary"
                      size="small"
                      className={styles.addButton}
                      onClick={() => setValues(setFp(
                        `lines.${shortid.generate()}`,
                        initialLine,
                        values
                      ))}
                    >
                      <Add />
                    </Fab>
                  </Tooltip>
                  <TextField
                    id="date"
                    label={t('deadline')}
                    type="date"
                    value={values.date}
                    error={Boolean(touched.date && errors.date)}
                    helperText={touched.date && errors.date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={join(requestStyles.field, styles.date)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    id="notes"
                    label={t('notes')}
                    value={values.notes}
                    error={Boolean(touched.notes && errors.notes)}
                    helperText={touched.notes && errors.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    multiline
                    className={requestStyles.field}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
                <div className={requestStyles.actions}>
                  <Button
                    tabIndex={-1}
                    className={requestStyles.action}
                    onClick={hideRequestForm}
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    className={requestStyles.action}
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                  >
                    {t('submit')}
                  </Button>
                </div>
              </div>
            </Paper>
          </Modal>
        )
      }}
    </Formik>
  )
}

export default compose(
  connect(() => ({
    requests: requestStore.get(),
    user: userStore.get()
  })),
  nullIf(({ requests, user }) => (
    !get(requests, 'requestForm') ||
    !get(user, 'assignedEmail')
  ))
)(RequestForm)