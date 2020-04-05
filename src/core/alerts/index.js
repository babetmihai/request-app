import { createStoreApi } from 'store'
import shortid from 'shortid'

const MODULE_NAME = 'alerts'
const store = createStoreApi(MODULE_NAME)

export const ALERT_ERROR = 'ALERT_ERROR'
export const ALERT_SUCCESS = 'ALERT_SUCCESS'

export const setAlertError = (message) => {
  const id = shortid.generate()
  return store.set(id, { id, type: ALERT_ERROR, message })
}

export const setAlertSuccess = (message) => {
  const id = shortid.generate()
  return store.set(id, { id, type: ALERT_SUCCESS, message })
}

export const clearAlert = (id) => store.delete(id)

export default store