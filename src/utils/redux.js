
export const combineReducers = (reducerObject) => {
  return (state, action) => {
    let edited
    const newState = {}
    for (const key in reducerObject) {
      const newKeyState = reducerObject[key](state[key], action)
      if (newKeyState !== state[key]) {
        edited = true
        newState[key] = newKeyState
      }
    }

    if (edited) return {
      ...state,
      ...newState
    }

    return state
  }
}

export const mergeReducers = (...reducers) => {
  return (state, action) => {
    for (let reducer of reducers) {
      const newState = reducer(state, action)
      if (newState !== state) return newState
    }
    return state
  }
}
