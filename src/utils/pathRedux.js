import setWith from 'lodash/fp/setWith'
import unset from 'lodash/fp/unset'
import updateWith from 'lodash/fp/updateWith'
import isPlainObject from 'lodash/isPlainObject'
import get from 'lodash/get'
import isNil from 'lodash/isNil'

const STORE_SET = '@SET'
const STORE_DELETE = '@DELETE'
const STORE_UPDATE = '@UPDATE'

export const pathReducer = (state = {}, action = {}) => {
  const { method, type = '', payload } = action
  switch (method) {
    case (STORE_SET): {
      if (isNil(payload)) return unset(type, state)
      return setWith(Object, type, payload, state)
    }
    case (STORE_UPDATE): {
      if (isNil(payload)) return state
      return updateWith(Object, type, (value) => {
        if (isPlainObject(value) && isPlainObject(payload)) {
          return { ...value, ...payload }
        } else {
          return payload
        }
      }, state)
    }
    case (STORE_DELETE): return unset(type, state)
    default: return state
  }
}

const join = (...args) => args.filter(Boolean).join('.')
const parse = (args) => {
  if (args.length === 0) throw new Error('invalid.arguments')
  if (args.length === 1) return { payload: args[0] }
  return {
    type: args[0],
    payload: args[1]
  }
}

export const createPathApi = ({ store, moduleName }) => ({
  select: (selector) => selector(store.getState()),
  get: (type, defautValue) => {
    if (!type) return get(store.getState(), moduleName, {})
    return get(store.getState(), join(moduleName, type), defautValue)
  },
  set: (...args) => new Promise((resolve, reject) => {
    const { type, payload } = parse(args)
    setTimeout(() => {
      try {
        store.dispatch({
          type: join(moduleName, type),
          payload,
          method: STORE_SET
        })
        resolve(payload)
      } catch (error) {
        reject(error)
      }
    })
  }),
  update: (...args) => new Promise((resolve, reject) => {
    const { type, payload } = parse(args)
    setTimeout(() => {
      try {
        store.dispatch({
          type: join(moduleName, type),
          payload,
          method: STORE_UPDATE
        })
        resolve(payload)
      } catch (error) {
        reject(error)
      }
    })
  }),
  delete: (type) => new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        store.dispatch({
          type: join(moduleName, type),
          method: STORE_DELETE
        })
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  })
})

