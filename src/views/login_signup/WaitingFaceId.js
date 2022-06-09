import { color3777EE, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import React, { useEffect, useState } from 'react'
import {
  StyleSheet, ImageBackground, TouchableOpacity, Text, Dimensions,
  View, Platform
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Translate from 'translate'
import imgLoginSignUp from '../../../assets/images/login_signup'
import TouchID from 'react-native-touch-id'
import { checkLogin, savePermission, saveToken } from 'actions/user'
import { apiCheckPermission } from 'api/MedicalRecord'
import AsyncStorage from '@react-native-community/async-storage'
import { STORAGE_KEY } from 'constants/define'
import { apiGetServerByCode } from 'api/SignUp'
import _ from 'lodash'
import { apiPostGetServerByUser, apiPreLogin } from 'api/Auth'
import * as APIs from '../../api/APIs'
import LoadingView from 'components/LoadingView'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
import DeviceInfo from 'react-native-device-info'

export default function WaitingFaceId() {
  const languageRedux = useSelector(state => state.common.language)
  const dispatch = useDispatch()
  const [isFaceID, setFaceID] = useState(0)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [isShowPushNoti, setPushNoti] = useState(false)
  const [errorNoti, setErrorNoti] = useState()

  useEffect(() => {
    getUserPass()
  }, [])

  useEffect(() => {
    // onPressFaceId()
    const optionalConfigObject = {
      unifiedErrors: false, // use unified error messages (default false)
      passcodeFallback: false // if true is passed, itwill allow isSupported to return an error if the device is not enrolled in touch id/face id etc. Otherwise, it will just tell you what method is supported, even if the user is not enrolled.  (default false)
    }
    TouchID.isSupported(optionalConfigObject)
      .then(biometryType => {
        if (biometryType === 'FaceID') {
          setFaceID(2)
          console.log('Face ID')
        } else {
          setFaceID(1)
          console.log('Touch ID')
        }
      })
      .catch(error => {
        console.log(error)
        setFaceID(0)
      })
  }, [])

  //action
  const getUserPass = async () => {
    const user = await AsyncStorage.getItem(STORAGE_KEY.USERNAME)
    setUsername(user || '')
    const pass = await AsyncStorage.getItem(STORAGE_KEY.PASSWORD)
    setPassword(pass)
  }

  const onPressFaceId = () => {
    TouchID.authenticate(`Confirm ${isFaceID === 1 ? 'fingerprint' : 'face ID'} to continue`).then(() => {
      if (username && password) {
        setLoading(true)
        Promise.all([
          _onPressWinzed()
        ])
      }
    }).catch(err => {
      console.log('Err: ', err)
    })
  }

  const _onPressWinzed = () => {
    if (_.isEmpty(username) && _.isEmpty(password)) {
      return
    }
    let body = {
      password
    }
    setLoading(true)
    dispatch(apiGetServerByCode(body)).then(res => {
      console.log('Res getServerByCode: ', res)
    }).catch(() => {

    })
    let param = {
      username,
      password
    }
    Promise.all([
      dispatch(checkLogin(param))
    ])
    dispatch(apiPostGetServerByUser(param)).then(res => {
      console.log('Res getServerByUser: ', res)
    })

    dispatch(apiPreLogin(JSON.stringify(param))).then(res => {
      console.log('Res apiPreLogin: ', res)
    })

    Promise.all([
      setTimeout(() => {
        callAPIAuthFetch()
      }, 1000)
    ])
  }

  const callAPIAuthFetch = async () => {
    let param = {
      username: username,
      password: password,
      'code': '000000'
    }
    return await fetch(`${APIs.hostAPI}backoffice/auth`, {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        'access-control-request-headers': 'X-AUTH-TOKEN'
      },
      body: JSON.stringify(param)
    }).then(async function (response) {
      console.log('Res: ', response)
      console.log('response.headers: ', response.headers)
      console.log('X-AUTH-TOKEN:', response.headers.get('x-auth-token'))
      const getToken = response.headers.get('x-auth-token')
      if (response.status !== 200) {
        console.log('Status Code: ' + response.status)
        if ([401, 404].includes(response?.status)) {
          setPushNoti(true)
          setErrorNoti({
            esito: 1,
            motivo: Translate(languageRedux).MSG_LOGIN_ERROR
          })
        }
        const errJson = await JSON.parse(response._bodyText)
        setPushNoti(true)
        setErrorNoti({
          esito: 1,
          motivo: errJson?.reason || Translate(languageRedux).server_missing
        })
        return
      }
      if (getToken) {
        Promise.all([
          AsyncStorage.setItem(STORAGE_KEY.TOKEN, `${getToken}`),
          dispatch(saveToken(`${getToken}`))
        ])
        Promise.all([
          setTimeout(() => {
            callAPIPermission()
          }, 1000)
        ])
      } else {
      }

      // Examine the text in the response
      response.json().then(function (data) {
        console.log(data)
      })
    }).then((json) => {
      console.log('Json: ', json)
    }).catch((error) => {
      console.error(error)
      setLoading(false)
    })
  }

  const callAPIPermission = () => {
    const params = {
      build: DeviceInfo.getBuildNumber(),
      isIOS: Platform.OS === 'ios',
      uuid: DeviceInfo.getUniqueId(),
      version: DeviceInfo.getVersion()
    }
    dispatch(apiCheckPermission(params)).then(res => {
      setLoading(false)
      Promise.all([
        dispatch(savePermission(res?.payload))
      ])
      if (res?.payload?.isDoctor === true) {
        setTimeout(() => {
          NavigationService.navigateAndReset(Routes.DRAWER_NAVIGATION_DOCTOR)
         }, 3000)
      }
      else {
        setTimeout(() => {
          NavigationService.navigateAndReset(Routes.DRAWER_NAVIGATION)
        }, 3000)
      }
    }).catch(() => {
      setLoading(false)
    })
  }


  const onPressBackLogin = () => {
    return NavigationService.navigateAndReset(Routes.LOGIN_SCREEN)
  }

  const renderBT = () => {
    return (
      <View style={styles.btView}>
        <TouchableOpacity
          onPress={onPressFaceId}
          style={styles.ctnSaveButton}>
          <Text style={
            customTxt(Fonts.SemiBold, 18, color3777EE).txt
          }>{Translate(languageRedux).LOGIN}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPressBackLogin}
          style={styles.ctnSaveButton}>
          <Text style={
            customTxt(Fonts.SemiBold, 18, color3777EE).txt
          }>{Translate(languageRedux).BACK_LOGIN}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ImageBackground style={styles.container} source={imgLoginSignUp.ic_splashview}>
      {renderBT()}
      {isLoading && <LoadingView />}
      <NotificationView
          status={_.includes([1, '1'], errorNoti?.esito) ? STATUS_NOTIFY.ERROR : STATUS_NOTIFY.SUCCESS}
          content={errorNoti?.motivo || ''}
          isShow={isShowPushNoti || false}
          setShow={(val) => {
            setPushNoti(val)
            if (!val) {
              setErrorNoti()
            }
          }}
        />
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ctnSaveButton: {
    height: 46,
    width: Dimensions.get('window').width - 40,
    borderRadius: 12,
    backgroundColor: colorFFFFFF,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btView: {
    marginTop: Dimensions.get('window').height / 3
  }
})
