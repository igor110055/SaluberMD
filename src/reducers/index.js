import { combineReducers } from 'redux'
import { toastReducer as toast } from 'react-native-redux-toast'
import common from './common'
import user from './user'
import authentication from './authentication'

export default combineReducers({
  common,
  toast,
  user,
  authentication
})
