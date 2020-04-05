const DB_NAME = 'app-database'
const DB_STORE = 'add-store'

let db
const request = indexedDB.open(DB_NAME)
request.onsuccess = () => {
  db = request.result
  db.transaction(DB_STORE, 'readwrite').objectStore(DB_STORE)
}
request.onupgradeneeded = () => {
  db = request.result
  db.createObjectStore(DB_STORE)
}

const setPromise = (key, value) => new Promise((resolve, reject) => {
  const request = db
    .transaction(DB_STORE, 'readwrite')
    .objectStore(DB_STORE)
    .put(value, key)

  request.onerror = (err) => reject(err)
  request.onsuccess = () => resolve(request.result)
})

const getPromise = (key) => new Promise((resolve, reject) => {
  const request = db
    .transaction(DB_STORE)
    .objectStore(DB_STORE)
    .get(key)

  request.onerror = (err) => reject(err)
  request.onsuccess = () => resolve(request.result)
})

const allPromise = () => new Promise((resolve, reject) => {
  const request = db
    .transaction(DB_STORE)
    .objectStore(DB_STORE)
    .getAll()

  request.onerror = (err) => reject(err)
  request.onsuccess = () => resolve(request.result)
})

const keysPromise = () => new Promise((resolve, reject) => {
  const request = db
    .transaction(DB_STORE)
    .objectStore(DB_STORE)
    .getAllKeys()

  request.onerror = (err) => reject(err)
  request.onsuccess = () => resolve(request.result)
})

const deletePromise = (key) => new Promise((resolve, reject) => {
  if (key) {
    const request = db
      .transaction(DB_STORE, 'readwrite')
      .objectStore(DB_STORE)
      .delete(key)
    request.onerror = (err) => reject(err)
    request.onsuccess = () => resolve()
  } else {
    const request = db
      .transaction(DB_STORE, 'readwrite')
      .objectStore(DB_STORE)
      .clear()
    request.onerror = (err) => reject(err)
    request.onsuccess = () => resolve()
  }
})

export default {
  set: setPromise,
  get: getPromise,
  all: allPromise,
  delete: deletePromise,
  keys: keysPromise
}