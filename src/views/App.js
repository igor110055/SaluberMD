import React, { useEffect, useState } from 'react'
import { LogBox, Platform, AppState, PermissionsAndroid, DeviceEventEmitter } from 'react-native'
import { Provider } from 'react-redux'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import store from '../store'
import RootNavigation from '../navigation/AppNavigation'
import NetInfo from '@react-native-community/netinfo'
import * as types from '../actions/ActionTypes'
import NotificationView from '../components/NotificationView'
import { STATUS_NOTIFY } from '../components/NotificationView'
import Translate from '../translate'
import { language, STORAGE_KEY } from 'constants/define'
import * as Sentry from '@sentry/react-native'
import BleManager from 'react-native-ble-manager'
import AsyncStorage from '@react-native-community/async-storage'
import Pushy from 'pushy-react-native'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import PushNotification from 'react-native-push-notification'
import SoundPlayer from 'react-native-sound-player'
import { requestMultiple, PERMISSIONS } from 'react-native-permissions'
import PushNotificationIOS from '@react-native-community/push-notification-ios'

const App = () => {
  const [isConnect, setConnect] = useState(false)
  const [isShowNoti, setNoti] = useState(false)
  const [activeApp, setActiveApp] = useState(true)

  useEffect(() => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.addEventListener('register', () => {
        // Alert.alert('register')
      })
      PushNotificationIOS.addEventListener('registrationError', () => {
        // Alert.alert('registrationError')
      })
      PushNotificationIOS.addEventListener('notification', () => {
      })
      PushNotificationIOS.addEventListener('localNotification', async (noti) => {
        try {
          const getDataNoti = await JSON.parse(JSON.stringify(noti?._data))
          if (getDataNoti?.messagePush === 'New incoming call') {
            setTimeout(() => {
              SoundPlayer.stop()
              if (store.getState()?.user?.permission?.isDoctor) {
                NavigationService.navigate(Routes.DOCTOR_NOTIFICAION_NAVIGATOR_VIEW, {
                  notification: JSON.stringify(getDataNoti)
                })
              } else {
                NavigationService.navigate(Routes.PATINET_ACCEPT_CALL_SCREEN, {
                  notification: JSON.stringify(getDataNoti)
                })
              }
            }, 500)
          } else {
            if (getDataNoti) {
              try {
                onPressNotification(JSON.stringify(getDataNoti))
              } catch (error) {}
            }
          }
        } catch (error) {}
      })

      PushNotificationIOS.requestPermissions({
        alert: true,
        badge: true,
        sound: true,
        critical: true
      }).then(
        (data) => {
          console.log('PushNotificationIOS.requestPermissions', data)
        },
        (data) => {
          console.log('PushNotificationIOS.requestPermissions failed', data)
        },
      )

      return () => {
        PushNotificationIOS.removeEventListener('register')
        PushNotificationIOS.removeEventListener('registrationError')
        PushNotificationIOS.removeEventListener('notification')
        PushNotificationIOS.removeEventListener('localNotification')
      }
    }
  }, [])

  useEffect(() => {
    setNoti(isConnect)
  }, [isConnect])

  useEffect(() => {
    requestMultiple([
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.FACE_ID,
      PERMISSIONS.IOS.CALENDARS,
      PERMISSIONS.IOS.LOCATION_ALWAYS,
      PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
      PERMISSIONS.IOS.PHOTO_LIBRARY,
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.BLUETOOTH_PERIPHERAL,
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.READ_CALENDAR,
      PERMISSIONS.ANDROID.WRITE_CALENDAR,
      PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION,
      PERMISSIONS.ANDROID.RECORD_AUDIO
    ]).then((statuses) => {
      console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA])
      console.log('FaceID', statuses[PERMISSIONS.IOS.FACE_ID])
    })

    if (Platform.OS === 'android') {
      setTimeout(() => {
        requestBluePermission()
      }, 500)
    }

    const _onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
      console.log('finished playing', success)
    })
    const _onFinishedLoadingSubscription = SoundPlayer.addEventListener('FinishedLoading', ({ success }) => {
      console.log('finished loading', success)
    })
    const _onFinishedLoadingFileSubscription = SoundPlayer.addEventListener('FinishedLoadingFile', ({ success, name, type }) => {
      console.log('finished loading file', success, name, type)
    })
    const _onFinishedLoadingURLSubscription = SoundPlayer.addEventListener('FinishedLoadingURL', ({ success, url }) => {
      console.log('finished loading url', success, url)
    })

    return () => {
      Promise.all([
        _onFinishedPlayingSubscription.remove(),
        _onFinishedLoadingSubscription.remove(),
        _onFinishedLoadingURLSubscription.remove(),
        _onFinishedLoadingFileSubscription.remove()
      ])
    }
  }, [])

  useEffect(() => {
    AppState.addEventListener('change', handleChange)

    return () => {
      AppState.removeEventListener('change', handleChange)
    }
  }, [])

  useEffect(() => {
    if (Platform.OS === 'android') {
      Pushy.listen()
      // Register the user for push notifications
      Pushy.register()
        .then(async deviceToken => {
          // Display an alert with device token
          // alert('Pushy device token: ' + deviceToken)
          Promise.all([
            AsyncStorage.setItem(STORAGE_KEY.DEVICE_TOKEN, deviceToken)
          ])
          // Send the token to your backend server via an HTTP GET request
          //await fetch('https://your.api.hostname/register/device?token=' + deviceToken);
          // Succeeded, optionally do something to alert the user
        })
        .catch(err => {
          // Handle registration errors
          console.error(err)
        })

      Pushy.toggleInAppBanner(true)

      Pushy.setNotificationListener(async data => {
        // Print notification payload data
        console.log('Received notification: ' + JSON.stringify(data))
        if (data?.message === 'New incoming call' || data?.messagePush === 'New incoming call') {
          SoundPlayer.playSoundFile('notification', 'mp3')
        }
        // Notification title
        let notificationTitle = data?.title || 'MyApp'
        // Attempt to extract the "message" property from the payload: {"message":"Hello World!"}
        let notificationText = data?.message || 'Test notification'
        // Display basic system notification
        Pushy.notify(notificationTitle, notificationText, data)
        // Clear iOS badge count
        Pushy.setBadge(0)
      })

      // Listen for Notification Click
      Pushy.setNotificationClickListener(async data => {
        // Display basic alert
        if (data?.message === 'New incoming call' || data?.messagePush === 'New incoming call') {
          if (store.getState()?.user?.permission?.isDoctor) {
            NavigationService.navigate(Routes.DOCTOR_NOTIFICAION_NAVIGATOR_VIEW, {
              notification: data?.additionalData
            })
          } else {
            NavigationService.navigate(Routes.PATINET_ACCEPT_CALL_SCREEN, {
              notification: data?.additionalData
            })
          }
        } else {
          if (data?.additionalData) {
            try {
              const getData = JSON.parse(data?.additionalData)
              onPressNotification(getData)
            } catch (error) {
            }
          }
        }
      })

      // Make sure the user is registered
      Pushy.isRegistered().then(isRegistered => {
        if (isRegistered) {
          // Subscribe the user to a topic
          Pushy.subscribe('news')
            .then(() => {
              // Subscribe successful
              // alert('Subscribed to topic successfully')
            })
            .catch(err => {
              console.error(err)
            })
        }
      })
    } else {
      PushNotification.configure({
        onRegister: function (token) {
          console.log('PushNotification: ', token)
          if (token?.token) {
            Promise.all([
              AsyncStorage.setItem(STORAGE_KEY.DEVICE_TOKEN, token?.token)
            ])
          }
        },
        onNotification: async function (notify) {
          if (notify?.message === 'New incoming call' || notify?.data?.messagePush === 'New incoming call') {
            SoundPlayer.playSoundFile('notification', 'mp3')
          }
        },
        onAction: function (noti) {
          if (noti?.message === 'New incoming call' || noti?.data?.messagePush === 'New incoming call') {
            setTimeout(() => {
              // SoundPlayer.stop()
              if (store.getState()?.user?.permission?.isDoctor) {
                NavigationService.navigate(Routes.DOCTOR_NOTIFICAION_NAVIGATOR_VIEW, {
                  notification: noti?.data || noti?.userInfo
                })
              } else {
                NavigationService.navigate(Routes.PATINET_ACCEPT_CALL_SCREEN, {
                  notification: noti?.data || noti?.userInfo
                })
              }
            }, 500)
          } else {
            if (noti?.data || noti?.userInfo) {
              try {
                const getData = JSON.parse(JSON.stringify(noti?.data || noti?.userInfo))
                onPressNotification(getData)
              } catch (error) {
              }
            }
          }
        },
        onRegistrationError: function (err) {
          console.error(err.message, err)
        },
        permissions: {
          alert: true,
          badge: true,
          sound: true
        },
        popInitialNotification: true,
        requestPermissions: true
      })
    }
  }, [])

  useEffect(() => {
    Sentry.init({
      dsn: 'https://bd1e23015fdb4d57ad15bf9a4a5f502a@o1021543.ingest.sentry.io/5987534'
    })

    LogBox.ignoreAllLogs()

    BleManager.start({ showAlert: false }).then(() => {
      // Success code
      console.log('Module initialized')
    })
  }, [])

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection type', state.type)
      console.log('Is connected?', state.isConnected)
      store.dispatch({
        type: types.CHANGE_CONNECT,
        isConnect: state.isConnected
      })
      setConnect(!(state.isConnected))
    })

    return () => unsubscribe
  }, [])

  const handleChange = (newState) => {
    if (newState === 'active') {
      console.log('Active app')
      setActiveApp(true)
    } else {
      console.log('Bg app')
      setActiveApp(false)
    }
  }

  const onPressNotification = (data) => {
    // type:6 - action:53, action:54 -> Appointment
    // type:6 - action:50 -> changes medical data (doctor changed in post call - disease, allergy, ...) ~ Change patient info
    // type:4 - action:52 -> send message
    // type:null - action:51 -> add or update reminder
    // type:58 - action:58 -> send prescription
    // type:100 - action:100 -> prepare question (domanda table)
    // type:22 - action:22 -> Password expiring
    // type:null - action:603 -> video call - doctor has choosen or waiting
    // type:602 - action:602 -> video call - doctor is available
    // type:null - action:601 -> video call - doctor no answer
    // type:600 - action:600 -> send notification new video call to the physicians
    switch (data?.action || '0') {
      case '22':
        return NavigationService.navigate(Routes.CHANGE_PASSWORD_SCREEN)
      case '50':
        return NavigationService.navigate(Routes.HEALTH_PROFILE_TRACKING_SCREEN)
      case '51'://DETAIL_REMINDER_VIEW   , {data: data}
        return NavigationService.navigate(Routes.MEDICINE_REMINDER_SCREEN)
      case '52':
        setTimeout(() => {
          DeviceEventEmitter.emit(Routes.NOTIFICATION_SCREEN, { tabs: 1 })
        }, 500)
        return NavigationService.navigate(Routes.NOTIFICATION_SCREEN)
      case '53': case '54':
        return NavigationService.navigate(Routes.VISIT_MAIN_SCREEN)
      case '58':
        setTimeout(() => {
          DeviceEventEmitter.emit(Routes.VISIT_MAIN_SCREEN, { tabs: 1 })
        }, 500)
        return NavigationService.navigate(Routes.VISIT_MAIN_SCREEN)
      default:
        break
    }
  }

  const requestBluePermission = async () => {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'SaluberMD App Bluetooth Permission',
          message: 'SaluberMD App needs access to your Bluetooth ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      )
    } catch (err) {
      console.log(err)
    }

    try {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'SaluberMD App Camera Permission',
          message: 'SaluberMD App needs access to your Camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      )
    } catch (err) {
      console.log(err)
    }

    try {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: 'SaluberMD App Location Permission',
          message: 'SaluberMD App needs access to your Location ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      )
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <RootNavigation />
      </SafeAreaProvider>
      <NotificationView
        status={STATUS_NOTIFY.WARNING}
        isShow={isShowNoti}
        setShow={(val) => setNoti(val)}
        content={Translate(language).internet_missing}
      />
    </Provider>
  )
}

export default Sentry.wrap(App)
