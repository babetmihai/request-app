
import { createStore } from 'redux'
import { pathReducer, createPathApi } from 'utils/pathRedux'

const store = createStore(
  pathReducer,
  {},
  global.__REDUX_DEVTOOLS_EXTENSION__ &&
    global.__REDUX_DEVTOOLS_EXTENSION__()
)

export const createStoreApi = (moduleName) => createPathApi({
  moduleName,
  store
})

export default store
