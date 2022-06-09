import * as types from '../actions/ActionTypes'

const INITIAL_STATE = {
  isSigningin: false
}

const authentication = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.REQUEST_LOGIN:
      return { ...state, isSigningin: true }

    case types.LOGIN_SUCCESS:
      console.log(action)
      return { ...state, isSigningin: false }

    case types.LOGIN_ERROR:
      return { ...state, isSigningin: false }
    default:
      return state
  }
}

export default authentication
