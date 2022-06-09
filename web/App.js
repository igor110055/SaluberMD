import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SplashView from './src/views/splash'
import Routes from './src/routes/Routes'
import LoginSignUpView from './src/views/login_signup'
import HomeView from './src/views/home'
import LoginView from './src/views/login_signup/LoginView'
import SignUpView from './src/views/login_signup/SignUpView'
import ForgotPasswordView from './src/views/login_signup/ForgotPasswordView'
import VisitsDirectCallView from './src/views/home/direct_call/VisitsDirectCallView'
import { navigationRef } from './src/routes'
// import { createDrawerNavigator } from '@react-navigation/drawer'
import VideoCallView from './src/views/home/direct_call/VideoCallView'
import DirectCallWebView from './src/views/home/direct_call/DirectCallWebView'
import DetialAppointment from './src/views/visit/DetialAppointment'
import NewAppointment from './src/views/home/new_appointment'
import ThankYou from './src/views/home/new_appointment/components/ThankYou'
import DetailConsultation from './src/views/visit/DetailConsultation'
import HealthProfileMain from './src/views/health_profile_main'
import NewRecord from './src/views/health_profile_main/medical_records/NewRecord'
//Visits
import VisitScreen from './src/views/visit'

import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import dashboardReducer from './src/store/reducers/dashboardReducer'
const Stack = createNativeStackNavigator()

const linking = {
  config: {
    screens: {
      Splash: {
        path: '/',
        initialRouteName: 'Splash',
        screens: {
          Splash: 'Splash'
        }
      },
      LoginSignUp: {
        path: 'login-signup',
        screens: {
          LoginSignUp: 'LoginSignUp'
        }
      },
      Home: {
        path: 'home',
        screens: {
          Home: 'Home'
        }
      }
    }
  }
}



// Combine all reducers
const rootReducer = combineReducers({
  dashboard: dashboardReducer
})
// Logger for dispatching, console.logs are optional
const logger = state => {
  return next => {
    return action => {
      console.log('Middleware dispatching', action)
      const result = next(action)
      console.log('[MiddleWare next state]', state.getState())
      return result
    }
  }
}
// Redux dev tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
// Store instance
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(logger, thunk)))
export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <NavigationContainer linking={linking} ref={navigationRef}>
          <Stack.Navigator initialRouteName={Routes.SPLASH_SCREEN}>
            <Stack.Screen name={Routes.SPLASH_SCREEN} component={SplashView} />
            <Stack.Screen name={Routes.LOGIN_SIGN_UP_SCREEN} component={LoginSignUpView} />
            <Stack.Screen name={Routes.LOGIN_SCREEN} component={LoginView} />
            <Stack.Screen name={Routes.SIGN_UP_SCREEN} component={SignUpView} />
            <Stack.Screen name={Routes.HOME_SCREEN} component={HomeView} />
            <Stack.Screen name={Routes.FORGOT_PASSWORD_SCREEN} component={ForgotPasswordView} />
            <Stack.Screen name={Routes.VISITS_DIRECT_CALL_SCREEN} component={VisitsDirectCallView} />
            <Stack.Screen name={Routes.VIDEOS_CALL_SCREEN} component={VideoCallView} />
            <Stack.Screen name={Routes.DIRECT_CALL_WEB_SCREEN} component={DirectCallWebView} />
            <Stack.Screen name={Routes.DETAIL_APPOINTMENT_SCREEN} component={DetialAppointment} />
            <Stack.Screen name={Routes.NEW_APPOINTMENT_SCREEN} component={NewAppointment} />
            <Stack.Screen name={Routes.THANKYOU_NEW_APPOINTMENT_SCREEN} component={ThankYou} />
            <Stack.Screen name={Routes.VISITS_SCREEN} component={VisitScreen} />
            <Stack.Screen name={Routes.DETAIL_CONSULTATION_SCREEN} component={DetailConsultation} />
            <Stack.Screen name={Routes.HEALTH_PROFILE_MAIN} component={HealthProfileMain} />
            <Stack.Screen name={Routes.NEW_RECORD_HEALTH_PROFILE} component={NewRecord} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}
