import React, { useState } from 'react'
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native'
import {
  color040404, color3777EE, colorFFFFFF, color00379D,
  colorF8F8F8,
  colorC1C3C5,
  colorF0F0F0
} from '../../constants/colors'
import CSS, { customTxt } from '../../constants/css'
import Fonts from '../../constants/Fonts'
import NavigationService from '../../navigation'
import Routes from '../../navigation/Routes'
import { useDispatch, useSelector } from 'react-redux'
import { checkLogin, savePermission, saveToken } from '../../actions/user'
import LoadingView from '../../components/LoadingView'
import TextInputView from './components/TextInputView'
import icLogin from '../../../assets/images/login_signup'
import { apiPostGetServerByUser, apiPreLogin } from '../../api/Auth'
import * as APIs from '../../api/APIs'
import AsyncStorage from '@react-native-community/async-storage'
import { STORAGE_KEY } from '../../constants/define'
import Translate from '../../translate'
import NotificationView, { STATUS_NOTIFY } from '../../components/NotificationView'
import _ from 'lodash'
import PopupChangeServer from './components/PopupChangeServer'
import Button from 'components/Button'
import { apiGetServerByCode } from 'api/SignUp'
import { apiCheckPermission } from 'api/MedicalRecord'
import DeviceInfo from 'react-native-device-info'

export default function LoginView() {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('') // aaaa  //khoa-pat //J1
  const [password, setPassword] = useState('') //test   //Quanhung94@ //test
  const [securePass, setSecurePass] = useState(true)
  const [isLoading, setLoading] = useState(false)
  const languageRedux = useSelector(state => state.common.language)
  const [isShowPushNoti, setPushNoti] = useState(false)
  const [errorNoti, setErrorNoti] = useState()
  const [isChangeServer, setChangeServer] = useState(false)

  const _onPressForgotPass = () => {
    NavigationService.navigate(Routes.FORGOT_PASSWORD_SCREEN)
  }

  const renderTextInput = () => {
    return (
      <View style={styles.ctn2TextInput}>
        <TextInputView
          title={Translate(languageRedux).USERNAME}
          value={username}
          onChangeTxt={(txt) => setUsername(txt.trim())}
          placeholder={Translate(languageRedux).USERNAME}
          validate={username ? false : true}
        />
        <TextInputView
          title={Translate(languageRedux).PASSWORD}
          value={password}
          onChangeTxt={(txt) => setPassword(txt.trim())}
          placeholder={Translate(languageRedux).PASSWORD}
          isSecure={securePass}
          onPressSecure={() => setSecurePass(!securePass)}
          isShowImg={true}
          onSubmitEditing={_onPressWinzed}
          validate={password ? false : true}
        />
        <TouchableOpacity
          onPress={_onPressForgotPass}
          style={styles.forgotPass}>
          <Text
            style={
              customTxt(Fonts.Bold, 14, color3777EE).txt
            }>{Translate(languageRedux).forgot_password}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const _onPressWinzed = () => {
    Keyboard.dismiss()
    if (_.isEmpty(username) && _.isEmpty(password)) {
      return
    }
    let body = {
      password
    }
    dispatch(apiGetServerByCode(body)).then(res => {
      console.log('Res getServerByCode: ', res)
    }).catch(() => {
      setLoading(false)
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
    }).catch(() => {
      setLoading(false)
    })

    setLoading(true)
    dispatch(apiPreLogin(JSON.stringify(param))).then(res => {
      console.log('Res apiPreLogin: ', res)
    }).catch(() => {
      setLoading(false)
    })

    Promise.all([
      setTimeout(() => {
        callAPIAuthFetch()
      }, 1000)
    ])
  }

  const renderButton = () => {
    return (
      <View style={styles.outsideLoginView}>
        <Button
          disabled={(username && password) ? false : true}
          onPress={_onPressWinzed}
          text={Translate(languageRedux).LOGIN}
          textColor={(username && password) ? colorFFFFFF : colorC1C3C5}
          backgroundColor={(username && password) ? color3777EE : colorF0F0F0}
        />
      </View>
    )
  }

  const callAPIAuthFetch = async () => {
    let param = {
      username: username,
      password: password,
      'code': '000000'
    }
    setLoading(true)
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
        setLoading(false)
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
          AsyncStorage.setItem(STORAGE_KEY.USERNAME, username),
          AsyncStorage.setItem(STORAGE_KEY.PASSWORD, password),
          AsyncStorage.setItem(STORAGE_KEY.IS_FACE_ID, 'false'),
          dispatch(saveToken(`${getToken}`))
        ])
        Promise.all([
          setTimeout(() => {
            callAPIPermission()
          }, 1000)
        ])
      } else {
        setLoading(false)
      }

      // Examine the text in the response
      response.json().then(function (data) {
        console.log(data)
      })
    }

    ).then((json) => {
      console.log('Json: ', json)
    }).catch((error) => {
      console.error(error)
      setLoading(false)
    })
  }

  const callAPIPermission = () => {
    console.log('getBuildNumber', DeviceInfo.getBuildNumber())
    console.log('getVersion', DeviceInfo.getVersion())
    const params = {
      build: DeviceInfo.getBuildNumber(),
      isIOS: Platform.OS === 'ios',
      uuid: DeviceInfo.getUniqueId(),
      version: DeviceInfo.getVersion()
    }
    dispatch(apiCheckPermission(params)).then(res => {
      console.log('callAPICheckPermission Res: ', res)
      console.log('callAPICheckPermission Res payload: ', res?.payload)
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

    })
  }

  const renderTopNavi = () => {
    const _onPressBack = () => {
      NavigationService.navigateAndReset(Routes.LOGIN_SIGN_UP_SCREEN)
    }
    return (
      <View style={[CSS.shadown, styles.topNaviView]}>
        <TouchableOpacity onPress={_onPressBack}>
          <Image source={icLogin.ic_back} style={styles.imgBack} />
        </TouchableOpacity>
      </View>
    )
  }

  // const _onPressChangeServer = () => {
  //   setChangeServer(true)
  // }

  const _onPressClose = () => {
    setChangeServer(false)
  }

  const _onPressChange = () => {
    setChangeServer(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white"/>
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardStyle}>
          <ScrollView keyboardShouldPersistTaps='handled'>
            {renderTopNavi()}
            <View style={styles.contentView}>
              <TouchableOpacity
                delayLongPress={1000 * 2}
                // onLongPress={_onPressChangeServer}
                activeOpacity={1}
                style={styles.centerView}>
                <Text style={[
                  styles.txtTitle,
                  customTxt(Fonts.SemiBold, 24, color040404).txt
                ]}>{Translate(languageRedux).MSG_WELCOME_BACK}!</Text>
                {renderTextInput()}
                {renderButton()}
              </TouchableOpacity>
            </View>
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
          </ScrollView>
        </KeyboardAvoidingView>
      {isChangeServer && (
        <PopupChangeServer
          onPressClose={_onPressClose}
          onPressChange={_onPressChange}
        />
      )}
      {isLoading && <LoadingView />}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  keyboardStyle: {
    width: '100%',
    height: '100%'
  },
  contentView: {
    marginTop: 54
  },
  centerView: {
    marginLeft: 20,
    marginRight: 20
  },
  txtTitle: {
    marginTop: 8
  },
  outsideLoginView: {
    marginTop: 32
  },
  loginView: {
    width: '100%',
    marginTop: 32,
    height: 48,
    backgroundColor: color3777EE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12
  },
  txtLogin: {
    marginLeft: 24,
    marginRight: 24
  },
  topNaviView: {
    top: 30,
    height: 50,
    marginLeft: 20,
    shadowColor: color00379D,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 2,
      height: 4
    },
    elevation: 1100
  },
  imgBack: {
    width: 48,
    height: 48
  },
  forgotPass: {
    alignItems: 'flex-end',
    marginTop: 16
  },
  touchID: {
    height: 56,
    width: 56,
    backgroundColor: colorF8F8F8,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  ctnBottom: {
    alignItems: 'center',
    marginBottom: 74
  }
})
