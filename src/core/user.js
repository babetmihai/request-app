// https://firebase.google.com/docs/auth/web/manage-users
import get from 'lodash/get'
import { db, auth } from 'utils/firebase'
import { setAlertError, setAlertSuccess } from 'core/alerts'
import { createStoreApi } from 'store'

const MODULE_NAME = 'user'
const store = createStoreApi(MODULE_NAME)
export const USER_ROLE = 'user'
export const MANAGER_ROLE = 'manager'

export const logout = async () => {
  try {
    await auth.signOut()
  } catch (error) {
    await setAlertError(error.message)
  }
}

export const passwordLoginRegister = async ({ email, password }) => {
  try {
    await auth.signInWithEmailAndPassword(email, password)
  } catch (error) {
    await setAlertError(error.message)
  }
}

export const passwordReset = async ({ email }) => {
  try {
    await auth.sendPasswordResetEmail(email)
    await setAlertSuccess('Email sent')
  } catch (error) {
    await setAlertError(error.message)
  }
}

export const authSync = () => new Promise((resolve) => {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const userId = get(user, 'uid')
      const userData = await db.ref(`users/${userId}`)
        .once('value')
        .then((snap) => snap.val())
      await store.update(userData)
    } else {
      store.delete()
    }
    resolve()
  })
})

export default store