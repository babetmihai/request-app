import React, { useState } from 'react'
import { Formik } from 'formik'

import { t } from 'core/intl'
import {
  passwordLoginRegister,
  passwordReset
} from 'core/user'

import {
  Card,
  IconButton,
  Button,
  TextField,
  InputAdornment
} from '@material-ui/core'

import {
  Visibility,
  VisibilityOff
} from '@material-ui/icons'

import Page from 'components/Page'
import styles from './index.module.scss'

const validateField = ({ id, value }) => {
  switch (id) {
    case ('password'): {
      if (!value || value.length < 6) return t('short.password')
      break
    }
    case ('email'): {
      if (!value) return 'Please enter an email'
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) return t('invalid.email')
      break
    }
    default: return undefined
  }
}

const validateForm = (values = {}) => Object.keys(values)
  .reduce((acc, id) => {
    const error = validateField({ id, value: values[id] })
    if (error) acc[id] = error
    return acc
  }, {})

function Login() {
  const [visible, setVisibility] = useState(false)

  return (
    <Page className={styles.login}>
      <Formik
        initialValues={{ email: '', password: '' }}
        validate={(values) => validateForm(values)}
        onSubmit={(values, { setSubmitting }) => {
          return passwordLoginRegister(values)
            .then(() => setSubmitting(false))
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          isSubmitting
        }) => (
          <Card
            component="form"
            className={styles.form}
          >
            <div className={styles.header}>
              <h2>{t('login')}</h2>
            </div>
            <div className={styles.content}>
              <TextField
                type="email"
                id="email"
                autoFocus
                className={styles.field}
                label={t('email')}
                error={Boolean(errors.email && touched.email)}
                helperText={touched.email && errors.email}
                value={values.email}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                id="password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setVisibility((visible) => !visible)}>
                        {visible
                          ? <Visibility />
                          : <VisibilityOff />
                        }
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                type={visible ? 'text' : 'password'}
                className={styles.field}
                label={t('password')}
                error={Boolean(errors.password && touched.password)}
                helperText={touched.password && errors.password}
                value={values.password}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
              <div className={styles.actions}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  className={styles.button}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {t('login')}
                </Button>
                <Button
                  className={styles.button}
                  size="large"
                  onClick={() => passwordReset(values)}
                >
                  {t('reset.password')}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </Formik>
    </Page>
  )
}

export default Login