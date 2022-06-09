import React, { useState } from 'react'
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native'
import {
  color040404, color3777EE, colorFFFFFF, color00379D,
  colorF8F8F8,
  colorC1C3C5,
  colorF0F0F0,
  color5C5D5E
} from '../../constants/colors'
import CSS, { customTxt } from '../../constants/css'
import Fonts from '../../constants/Fonts'
import NavigationService from '../../navigation'
import { useDispatch, useSelector } from 'react-redux'
import LoadingView from '../../components/LoadingView'
import TextInputView from './components/TextInputView'
import icLogin from '../../../assets/images/login_signup'
import Translate from '../../translate'
import NotificationView, { STATUS_NOTIFY } from '../../components/NotificationView'
import Button from 'components/Button'
import { apiPostResetPassword } from '../../api/Auth'

export default function ForgotPasswordView() {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [isLoading, setLoading] = useState(false)
  const languageRedux = useSelector(state => state.common.language)
  const [isShowNoti, setShowNoti] = useState()
  const [dataNoti, setDataNoti] = useState()

  const renderTextInput = () => {
    return (
      <View style={styles.ctn2TextInput}>
        <TextInputView
          title={Translate(languageRedux).EMAIL_OR_USERNAME}
          value={username}
          onChangeTxt={(txt) => setUsername(txt.trim())}
          placeholder={Translate(languageRedux).EMAIL_OR_USERNAME}
          validate={username ? false : true}
        />
      </View>
    )
  }

  const _onPress = () => {
    setLoading(true)
    const param = {
      email: username
    }
    dispatch(apiPostResetPassword(param)).then(res => {
      console.log('res: ', res)
      if (res?.payload?.esito === '0' || res?.payload?.motivo === '') {
        setDataNoti({
          status: STATUS_NOTIFY.SUCCESS,
          content: Translate(languageRedux).MSG_RESET_REQUEST_SUCCESS
        })
        setTimeout(() => {
          setShowNoti(true)
        }, 100)
        setTimeout(() => {
          return NavigationService.goBack()
        }, 4000)
      } else {
        setLoading(false)
        setDataNoti({
          status: STATUS_NOTIFY.ERROR,
          content: res?.payload?.motivo || Translate(languageRedux).MSG_RESET_REQUEST_ERROR
        })
        setTimeout(() => {
          setShowNoti(true)
        }, 500)
      }
    }).catch(() => {
      setLoading(false)
    })

  }

  const renderButton = () => {
    return (
      <View style={styles.outsideLoginView}>
        <Button
          disabled={(username) ? false : true}
          onPress={_onPress}
          text={Translate(languageRedux).SEND_BTN}
          textColor={(username) ? colorFFFFFF : colorC1C3C5}
          backgroundColor={(username) ? color3777EE : colorF0F0F0}
        />
      </View>
    )
  }

  const renderTopNavi = () => {
    const _onPressBack = () => {
      NavigationService.goBack()
    }
    return (
      <View style={[CSS.shadown, styles.topNaviView]}>
        <TouchableOpacity onPress={_onPressBack}>
          <Image source={icLogin.ic_back} style={styles.imgBack} />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white"/>
      <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={styles.keyboardStyle}
      >
        <ScrollView keyboardShouldPersistTaps='handled'>
          {renderTopNavi()}
          <View style={styles.contentView}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.centerView}>
              <Text style={[
                styles.txtTitle,
                customTxt(Fonts.SemiBold, 24, color040404).txt
              ]}>{Translate(languageRedux).RESETPWD_BTN}</Text>
              <Text style={[
                styles.txtContent,
                customTxt(Fonts.Regular, 16, color5C5D5E).txt
              ]}>{Translate(languageRedux).RESET_PASSWORD}</Text>
              {renderTextInput()}
              {renderButton()}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {isLoading && <LoadingView />}
      <NotificationView
        isShow={isShowNoti}
        setShow={() => setShowNoti(false)}
        status={dataNoti?.status || STATUS_NOTIFY.ERROR}
        content={dataNoti?.content || ''}
      />
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
  },
  txtContent: {
    marginTop: 8,
    marginBottom: 10
  }
})
