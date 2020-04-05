import * as firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/storage'

firebase.initializeApp({
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  storageBucket: process.env.REACT_APP_storageBucket
})

export const GoogleAuthProvider = firebase.auth.GoogleAuthProvider
export const auth = firebase.auth()
export const db = firebase.database()
export const storage = firebase.storage()