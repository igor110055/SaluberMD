import React from 'react'
import { DrawerActions, StackActions } from '@react-navigation/native'
import { createNavigationContainerRef } from '@react-navigation/native'

export const navigationRef = createNavigationContainerRef()
export const isMountedRef = React.createRef()

/**
 * Call this function when you want to navigate to a specific route.
 *
 * @param routeName The name of the route to navigate to. Routes are defined in RootScreen using createStackNavigator()
 * @param params Route parameters.
 */
function navigate(routeName, params) {
  if (navigationRef.isReady()) {
    // Perform navigation if the app has mounted
    navigationRef.navigate(routeName, params)
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}

function goBack() {
  if (navigationRef.isReady()) {
    // Perform navigation if the app has mounted
    navigationRef.goBack()
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}

function popToRoot() {
  if (navigationRef.isReady()) {
    const popAction = StackActions.pop(1)
    navigationRef.dispatch(popAction)
  }
}

/**
 * Call this function when you want to navigate to a specific route AND reset the navigation history.
 *
 * That means the user cannot go back. This is useful for example to redirect from a splashscreen to
 * the main screen: the user should not be able to go back to the splashscreen.
 *
 * @param routeName The name of the route to navigate to. Routes are defined in RootScreen using createStackNavigator()
 * @param params Route parameters.
 */
function navigateAndReset(routeName, params) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: routeName }]
    })
  }
}

function toggleDrawer() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(DrawerActions.toggleDrawer())
  }
}

function openDrawer() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(DrawerActions.openDrawer())
  }
}

function closeDrawer() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(DrawerActions.closeDrawer())
  }
}

const NavigationService = {
  navigate,
  toggleDrawer,
  openDrawer,
  closeDrawer,
  navigateAndReset,
  goBack,
  popToRoot
}

export default NavigationService
