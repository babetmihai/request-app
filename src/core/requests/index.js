
import { createStoreApi } from 'store'
import moment from 'moment'
import { db } from 'utils/firebase'
import userStore from 'core/user'

const MODULE_NAME = 'requests'
const store = createStoreApi(MODULE_NAME)

export const PENDING = 'pending'
export const REJECTED = 'rejected'
export const COMPLETED = 'completed'
export const ARCHIVED = 'archived'
export const CANCELED = 'canceled'
export const APPROVED = 'approved'
export const CREATED = 'created'

export const showRequestForm = () => store.set('requestForm', true)
export const hideRequestForm = () => store.delete('requestForm')

export const saveHistory = async ({ action, request }) => {
  const { id: userId, email: userEmail, assignedUserId } = userStore.get()
  const { id: requestId, number: requestNo, email: requestEmail } = request
  const historyItem = {
    action,
    userId,
    userEmail,
    requestId,
    requestNo,
    requestEmail,
    created: moment().valueOf()
  }

  switch (action) {
    case (CANCELED): {
      await db.ref(`/requests/${requestId}/history`).push(historyItem)
      await db.ref('/history').push({
        ...historyItem,
        userId: assignedUserId
      })
      await db.ref('/history').push(historyItem)
      break
    }
    case (ARCHIVED): {
      await db.ref(`/archive/${requestId}/history`).push(historyItem)
      await db.ref('/history').push(historyItem)
      break
    }
    default: {
      await db.ref(`/requests/${requestId}/history`).push(historyItem)
      await db.ref('/history').push(historyItem)
    }
  }
}

export default store