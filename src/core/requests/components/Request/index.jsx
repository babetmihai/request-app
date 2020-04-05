import React, { Fragment } from 'react'
import moment from 'moment'
import { t } from 'core/intl'
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton
} from '@material-ui/core'
import { Add, Remove } from '@material-ui/icons'
import requestStyles from 'core/requests/index.module.scss'
import Field from 'components/Field'
import RequestStatus from 'core/requests/components/RequestStatus'
import styles from './index.module.scss'

export default function Request({ request, actions, assigned, open }) {
  const {
    number,
    deadline,
    created,
    assignedEmail,
    email,
    status
  } = request
  const {
    notes,
    lines = {},
    history = {}
  } = request
  const deadlineText = moment(deadline).format('L')
  const createdText = moment(created).format('L')
  const [expanded, onExpand] = React.useState()
  return (
    <Paper className={styles.requestCard}>
      <RequestStatus status={status} />
      <div className={styles.header}>

        <div className={styles.headerContent}>
          <div className={styles.left}>
            <Field label={`${t('no')}:`} value={number} />
            <Field label={`${t('status')}:`} value={t(status)} />
            {assigned
              ? <Field label={`${t('created.by')}:`} value={email} />
              : <Field label={`${t('assigned.to')}:`} value={assignedEmail} />
            }
          </div>
          <div className={styles.right}>
            <Field label={`${t('deadline')}:`} value={deadlineText} />
            <Field label={`${t('created')}:`} value={createdText} />

          </div>
        </div>
        {!open &&
          <IconButton
            size="medium"
            className={styles.button}
            onClick={() => onExpand((value) => !value)}
          >
            {expanded ? <Remove /> : <Add />}
          </IconButton>
        }
      </div>
      {(expanded || open) &&
        <Fragment>
          <div className={requestStyles.content}>
            <h3>{t('products')}</h3>
            <div className={styles.tableContainer}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('product')}</TableCell>
                    <TableCell align="right">{t('qty')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.values(lines).map((line, index) => {
                    const { item, qty } = line
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          {item}
                        </TableCell>
                        <TableCell align="right">
                          {qty}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="spacer" />
            <div className="spacer" />
            <h3>{t('notes')}</h3>
            <div className={styles.tableContainer}>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {notes.trim().split('\n').map((line, index)=> (
                        <Fragment key={index}>
                          {line}
                          <br />
                        </Fragment>
                      ))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="spacer" />
            <div className="spacer" />
            <h3>{t('history')}</h3>
            <div className={styles.tableContainer}>
              <Table size="small" className={styles.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('user')}</TableCell>
                    <TableCell>{t('action')}</TableCell>
                    <TableCell align="right">{t('date')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.values(history)
                    .sort((first, second) => (
                      moment(second.created).valueOf() -
                        moment(first.created).valueOf()
                    ))
                    .map((historyItem, index) => {
                      const { userEmail, created, action } = historyItem
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            {userEmail}
                          </TableCell>
                          <TableCell>
                            {t(action)}
                          </TableCell>
                          <TableCell align="right">
                            {moment(created).format('L')}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </div>
          </div>
          {actions &&
            <div className={requestStyles.actions}>
              {actions}
            </div>
          }
        </Fragment>
      }
    </Paper>
  )
}
