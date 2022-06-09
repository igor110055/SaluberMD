import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { apiMiddleware } from 'redux-api-middleware'
import interceptor from '../network/api_interceptor'
import rootReducer from '../reducers'
import { ToastActionsCreators } from 'react-native-redux-toast'
import NavigationService from '../navigation'
import Routes from '../navigation/Routes'
import { saveToken } from '../actions/user'
import AsyncStorage from '@react-native-community/async-storage'

type AppState = ReturnType<typeof rootReducer>

const createStoreWithMiddleware = applyMiddleware(interceptor({
  onRequestError: (state: any, response: any) => {
    console.log('onRequestError response', response)
    if ((response.status_code !== 200 || response.status_code !== 201) && response.error) {
      dispatch(ToastActionsCreators.displayError(response.error.message))
    }
    else if (response.status_code === 401 && state.user.token) {
      // logout()
    }
  },
  headers: (origHeaders: object, state: AppState) => {
    if (Object.entries(origHeaders).length === 0 && state.user.token) {
      return {
        Accept: '*/*',
        'Content-Type': 'application/json',
        'X-AUTH-TOKEN': state.user.token
      }
    } else return origHeaders
  }
}), thunk, apiMiddleware)(createStore)

function configureStore() {
  return createStoreWithMiddleware(rootReducer)
}

const store = configureStore()

const { dispatch } = store

// function logout() {
//   Promise.all([
//     dispatch(saveToken('')),
//     dispatch(ToastActionsCreators.displayError('ERROR: token'))
//   ]).then(() => {
//     NavigationService.navigateAndReset(Routes.LOGIN_SCREEN)
//   })
// }

export default store
