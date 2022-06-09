import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { color3777EE, color5C5D5E, colorFFFFFF } from '../../../constants/colors'

import Header from '../../healthProfile/components/Header'
import icHeader from '../../../../assets/images/header'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'
import CustomTextInput from '../../healthProfile/components/CustomTextInput'
import Button from '../../../components/Button'
import { useDispatch, useSelector } from 'react-redux'
import { apiPostChangePassword } from 'api/Auth'
import LoadingView from 'components/LoadingView'
import Translate from 'translate'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'

export default function ChangePasswordView() {
  const [securePass, setSecurePass] = useState(true)
  const [secureNewPass, setSecureNewPass] = useState(true)
  const [secureConfirm, setSecureConfirm] = useState(true)
  const [currentPass, setCurrentPass] = useState()
  const [newPass, setNewPass] = useState()
  const [confirmPass, setConfirmPass] = useState()
  const dispatch = useDispatch()
  const [isLoading, setLoading] = useState(false)
  const languageRedux = useSelector(state => state.common.language)
  const [isShowNoti, setShowNoti] = useState()
  const [dataNoti, setDataNoti] = useState()

  const apiChangePassword = () => {
    if (newPass !== confirmPass) {
      setDataNoti({
        status: STATUS_NOTIFY.WARNING,
        content: Translate(languageRedux).PWD_NOTMATCH
      })
      setTimeout(() => {
        setShowNoti(true)
        console.log('data: ', dataNoti)
      }, 500)
      return
    } else if (newPass === currentPass) {
      setDataNoti({
        status: STATUS_NOTIFY.WARNING,
        content: Translate(languageRedux).OLDPWD_ERROR
      })
      setTimeout(() => {
        setShowNoti(true)
        console.log('data: ', dataNoti)
      }, 500)
      return
    }
    const param = {
      'confirmpwd': confirmPass,
      'newpwd': newPass,
      'oldpwd': currentPass
    }
    setLoading(true)
    dispatch(apiPostChangePassword(param)).then(res => {
      console.log('apiPostChangePassword: ', res)
      if (res?.payload?.esito === '0') {
        setDataNoti({
          status: STATUS_NOTIFY.SUCCESS,
          content: Translate(languageRedux).NEWPWD_CONFIRM
        })
        setTimeout(() => {
          setShowNoti(true)
          console.log('data: ', dataNoti)
        }, 100)
        setTimeout(() => {
          return NavigationService.navigateAndReset(Routes.LOGIN_SCREEN)
        }, 4000)
      } else {
        setLoading(false)
        setDataNoti({
          status: STATUS_NOTIFY.ERROR,
          content: res?.payload?.motivo || 'error'
        })
        setTimeout(() => {
          setShowNoti(true)
          console.log('data: ', dataNoti)
        }, 500)
      }
    }).catch(() => {
      setLoading(false)
    })
  }

  const renderTextInput = () => {
    return (
      <View style={styles.marginT8}>
        <CustomTextInput
          title={Translate(languageRedux).CURRENT_PASSWORD}
          value={currentPass}
          isSecure={securePass}
          onPressSecure={() => setSecurePass(!securePass)}
          onChangeTxt={txt => setCurrentPass(txt)}
          isShowImg={true}
          validate={currentPass ? false : true}
        />
        <CustomTextInput
          title={Translate(languageRedux).NEW_PASSWORD}
          value={newPass}
          isSecure={secureNewPass}
          onPressSecure={() => setSecureNewPass(!secureNewPass)}
          onChangeTxt={txt => setNewPass(txt)}
          isShowImg={true}
          validate={newPass ? false : true}
        />
        <CustomTextInput
          title={Translate(languageRedux).CONFIRM_NEW_PASSWORD}
          value={confirmPass}
          isSecure={secureConfirm}
          onPressSecure={() => setSecureConfirm(!secureConfirm)}
          onChangeTxt={txt => setConfirmPass(txt)}
          isShowImg={true}
          validate={confirmPass ? false : true}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.cntBody}>
        <View style={styles.ctnText}>
          <Text style={customTxt(Fonts.Regular, 14, color5C5D5E).txt}>
          {Translate(languageRedux).CHANGE_PWD_SECTION_TITLE}
          </Text>
        </View>
        {renderTextInput()}
        <View style={styles.ctnButton}>
          <Button
            backgroundColor={color3777EE}
            text={Translate(languageRedux).CONFIRM}
            textColor={colorFFFFFF}
            onPress={apiChangePassword}
          />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        title={Translate(languageRedux).CHANGE_PWD_SECTION_TITLE}
        source={icHeader.ic_left}
      />
      <KeyboardAwareScrollView>
        {renderBody()}
      </KeyboardAwareScrollView>
      {isLoading && <LoadingView />}
      <NotificationView
        isShow={isShowNoti}
        setShow={() => setShowNoti(false)}
        status={dataNoti?.status || STATUS_NOTIFY.ERROR}
        content={dataNoti?.content || ''}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  cntBody: {
    marginHorizontal: 20
  },
  marginT8: {
    marginTop: 8
  },
  ctnButton: {
    marginTop: 24
  }
})
