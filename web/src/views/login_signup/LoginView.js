import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, ImageBackground, Dimensions, TouchableOpacity, Image } from 'react-native'
import img from '../../../assets/img/bg'
import CSS, { customTxt } from '../../constants/css'
import icLogin from '../../../assets/images/login_signup'
import { color00379D, color040404, color3777EE, colorC1C3C5, colorF0F0F0, colorFFFFFF } from '../../constants/colors'
import Translate from '../../translate'
import Fonts from '../../constants/Fonts'
import TextInputView from './components/TextInputView'
import _ from 'lodash'
import Button from '../../components/Button'
import Routes from '../../routes/Routes'
import NavigateServer from '../../routes/index'
import { apiPreLogin, apiAuth } from './apis'
import { KEY_STORAGE } from '../../constants/storage'
import AsyncStorage from '@callstack/async-storage'
import * as defines from '../../constants/define'
import * as APIs from '../../apis'
import NotificationView from '../../components/NotificationView'
import {STATUS_NOTIFY} from '../../components/NotificationView'

function LoginView({ navigation }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [securePass, setSecurePass] = useState(true)
  const [isLoading, setLoading] = useState(false)
  const [isShowPushNoti, setPushNoti] = useState(false)
  const [errorNoti, setErrorNoti] = useState()
  const [isChangeServer, setChangeServer] = useState(false)
  // const dispatch = useDispatch()

  const renderTopNavi = () => {
    const _onPressBack = () => {
      navigation.goBack()
    }
    return (
      <View style={[CSS.shadown, styles.topNaviView]}>
        <TouchableOpacity onPress={_onPressBack}>
          <Image source={icLogin.ic_back} style={styles.imgBack} />
        </TouchableOpacity>
      </View>
    )
  }

  const _onPressWinzed = () => {
    if (_.isEmpty(username) && _.isEmpty(password)) {
      return
    }
    let param = {
      username: username,
      password: password,
      'code': '000000'
    }
    setLoading(true)
    apiPreLogin(JSON.stringify(param)).then(res => {
      console.log('Res apiPreLogin: ', res)

    }).catch(() => {
      setLoading(false)
    })

    setTimeout(() => {
      callAPIAuth()
    }, 1000)
  }

  const callAPIAuth = () => {
    let param = {
      username,
      password
    }
    apiAuth(JSON.stringify(param)).then(async response => {
      console.log('Res apiAuth: ', response)
      console.log('response.headers: ', response.headers)
      console.log('X-AUTH-TOKEN:', response.headers.get('x-auth-token'))
      const getToken = response.headers.get('x-auth-token')
      console.log('Token : ', getToken)
      // await setToken(getToken)
      if (getToken) {
        defines.tokenApp = getToken
        APIs.header = {
          Accept: '*/*',
          'Content-Type': 'application/json',
          'X-AUTH-TOKEN': getToken
        }
        AsyncStorage.setItem(KEY_STORAGE.TOKEN, getToken)
        return NavigateServer.navigate(Routes.HOME_SCREEN)
      } else {
        setPushNoti(true)
        setErrorNoti({
          esito: 1,
          motivo: Translate().MSG_LOGIN_ERROR
        })
      }
    }).catch(() => {
      setLoading(false)
    })
  }

  const _onPressForgotPass = () => {
    navigation.navigate(Routes.FORGOT_PASSWORD_SCREEN)
  }

  const renderTextInput = () => {
    return (
      <View>
        <TextInputView
          title={Translate().USERNAME}
          value={username}
          onChangeTxt={(txt) => setUsername(txt.trim())}
          placeholder={Translate().USERNAME}
          validate={username ? false : true}
        />
        <TextInputView
          title={Translate().PASSWORD}
          value={password}
          onChangeTxt={(txt) => setPassword(txt.trim())}
          placeholder={Translate().PASSWORD}
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
            }>{Translate().forgot_password}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderButton = () => {
    return (
      <View style={styles.outsideLoginView}>
        <Button
          disabled={(username && password) ? false : true}
          onPress={_onPressWinzed}
          text={Translate().LOGIN}
          textColor={(username && password) ? colorFFFFFF : colorC1C3C5}
          backgroundColor={(username && password) ? color3777EE : colorF0F0F0}
        />
      </View>
    )
  }

  const renderContent = () => {
    return (
      <View style={styles.contentView}>
        <TouchableOpacity
          delayLongPress={1000 * 2}
          activeOpacity={1}
          style={styles.centerView}>
          <Text style={[
            styles.txtTitle,
            customTxt(Fonts.SemiBold, 24, color040404).txt
          ]}>{Translate().MSG_WELCOME_BACK}!</Text>
          {renderTextInput()}
          {renderButton()}
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ImageBackground style={styles.contain} source={img.ic_bg}>
      <View style={styles.loginView}>
        {renderTopNavi()}
        {renderContent()}
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
    </ImageBackground>
  )
}

export default LoginView

const styles = StyleSheet.create({
  contain: {
    width: '100%',
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginView: {
    width: 500,
    backgroundColor: 'white',
    borderRadius: 12
  },
  topNaviView: {
    top: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
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
  contentView: {
    marginTop: 54
  },
  txtTitle: {
    marginTop: 8
  },
  centerView: {
    marginLeft: 20,
    marginRight: 20
  },
  forgotPass: {
    alignItems: 'flex-end',
    marginTop: 16
  },
  outsideLoginView: {
    marginTop: 20,
    marginBottom: 20
  }
})
