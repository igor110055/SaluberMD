import React, { useEffect, useState } from 'react'
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Image
} from 'react-native'
import { color3777EE, colorFFFFFF } from '../../constants/colors'
import { customTxt } from '../../constants/css'
import Fonts from '../../constants/Fonts'
import NavigationService from '../../navigation'
import Routes from '../../navigation/Routes'
import icLoginSingUp from '../../../assets/images/login_signup'
import Translate from '../../translate'
import * as define from '../../constants/define'
import { useDispatch, useSelector } from 'react-redux'
import imgDocument from '../../../assets/images/document'
import CSS from 'constants/css'
import { isIphoneX } from 'constants/utils'
import SearchListWithName from 'components/SearchListWithName'
import * as defines from 'constants/define'
import { saveLanguage } from 'actions/common'
import AsyncStorage from '@react-native-community/async-storage'
import _ from 'lodash'
import uuid from 'react-native-uuid'
// import PushNotification from 'react-native-push-notification'
// import Pushy from 'pushy-react-native'
// import base64 from 'react-native-base64'

export default function Login_SignUpView() {
  const languageRedux = useSelector(state => state.common.language)
  const [showLanguage, setShowLanguage] = useState(false)
  const dispatch = useDispatch()
  const getLsLanguage = useSelector(state => state.common.lsLanguage)
  const [language, setLanguage] = useState()

  useEffect(() => {
    console.log('Translate', Translate)
    console.log('language:', JSON.stringify(define.language))
    setLanguage({
      'name': 'English',
      'value': 'en_US',
      'idOpt': '1',
      'attr': null
    })

    console.log('udid v4: ', uuid.v4())
    setupNotification()
  }, [])

  useEffect(() => {
    const filterIndex = _.findIndex(defines.LANGUAGE, { value: languageRedux })
    if (filterIndex > 0) {
      setLanguage(defines.LANGUAGE[filterIndex])
      console.log('filterIndex', defines.LANGUAGE[filterIndex])
    } else {
      setLanguage({
        'name': 'English',
        'value': 'en_US',
        'idOpt': '1',
        'attr': null
      })
    }
  }, [getLsLanguage])

  const setupNotification = () => {
    // PushNotification.configure({
    //   onRegister: function (tokenNoti) {
    //     console.log('TOKEN PushNotification:', tokenNoti)
    //   },
    //   onNotification: async function (notify) {
    //     console.log('Notify overview :', notify)
    //   },
    //   onAction: async function (noti) {
    //     console.log('Touch noti: ', noti)
    //   },
    //   permissions: {
    //     alert: true,
    //     badge: true,
    //     sound: true
    //   },
    //   popInitialNotification: true,
    //   requestPermissions: true
    // })

    // Pushy.register().then(async (deviceToken) => {
    //   // Display an alert with device token
    //   console.log('Pushy device token: ', deviceToken)
    //   console.log('Pushy device token base64: ', base64.encode(deviceToken))
    //   // Send the token to your backend server via an HTTP GET request
    //   //await fetch('https://your.api.hostname/register/device?token=' + deviceToken);

    //   // Succeeded, optionally do something to alert the user
    // }).catch((err) => {
    //   // Handle registration errors
    //   console.error(err)
    // })
  }

  function CustomButton({ title, style, onPress, textColor }) {
    const txtTextColor = { color: textColor }
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.toStyle,
          style
        ]}>
        <Text style={[customTxt(Fonts.Bold, 16).txt, txtTextColor]}>{title}</Text>
      </TouchableOpacity>
    )
  }

  const renderContent = () => {
    return (
      <View style={styles.ctnButton}>
        <CustomButton
          title={Translate(languageRedux).LOGIN}
          style={styles.loginStyle}
          textColor={colorFFFFFF}
          onPress={() => NavigationService.navigate(Routes.LOGIN_SCREEN)}
        />
        <CustomButton
          title={Translate(languageRedux).SIGNUP_BTN}
          textColor={color3777EE}
          onPress={() => NavigationService.navigate(Routes.SIGN_UP_SCREEN)}
        />
      </View>
    )
  }

  const _onPressChangeLanguage = () => {
    setShowLanguage(true)
  }

  const renderChangeLanguage = () => {
    return (
      <TouchableOpacity
        onPress={_onPressChangeLanguage}
        style={[
          styles.languageView,
          CSS.shadown
        ]}>
        <Text style={customTxt(Fonts.SemiBold, 16, color3777EE).txt}>{language?.name || ''}</Text>
        <Image source={imgDocument.ic_dropdown} style={styles.imgLanguage} />
      </TouchableOpacity>
    )
  }

  return (
    <ImageBackground
      source={icLoginSingUp.ic_bg}
      style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white" />
      {renderContent()}
      {renderChangeLanguage()}
      {
        showLanguage && (
          <SearchListWithName
            listData={getLsLanguage}
            title={`${Translate(languageRedux).select} ${Translate(languageRedux).LANGUAGE_TYPE}`}
            itemSelected={language}
            onItemClick={(val) => {
              setLanguage(val)
              setShowLanguage(false)
              defines.language = val?.value
              Promise.all([
                dispatch(saveLanguage(val?.value)),
                AsyncStorage.setItem(define.STORAGE_KEY.LANGUAGE, val?.value)
              ])
            }}
            onPressRight={() => {
              setShowLanguage(false)
            }}
          />
        )
      }
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  ctnButton: {
    marginBottom: 48,
    marginHorizontal: 20
  },
  toStyle: {
    width: 335,
    height: 56,
    borderRadius: 12,
    backgroundColor: colorFFFFFF,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginStyle: {
    marginBottom: 16,
    backgroundColor: color3777EE
  },
  languageView: {
    flexDirection: 'row',
    position: 'absolute',
    top: isIphoneX ? 50 : 30,
    right: 20,
    backgroundColor: colorFFFFFF,
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    alignItems: 'center'
  },
  imgLanguage: {
    width: 10,
    height: 15,
    marginLeft: 8
  }
})
