import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import _ from 'lodash'
import AsyncStorage from '@react-native-community/async-storage'

import {color040404, color3777EE, colorC1C3C5, colorF0F0F0, colorFFFFFF} from 'constants/colors'
import Translate from 'translate'
import NavigationService from 'navigation'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Routes from 'navigation/Routes'
import { apiGetLanguages } from 'api/Common'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
import * as defines from 'constants/define'
import * as define from 'constants/define'
import { checkWhiteSpace } from 'constants/CheckWhiteSpace'

import icDoc from '../../../../assets/images/document'
import icHeader from '../../../../assets/images/header'

import Header from 'components/Header'
import CustomTextInput from '../../healthProfile/components/CustomTextInput'
import Button from 'components/Button'
import SearchListWithName from 'components/SearchListWithName'
import { saveLanguage } from 'actions/common'

export default function Step1({ route }) {
  const languageRedux = useSelector(state => state.common.language)
  const passingData = route?.params?.data
  const passingDataCheckEmal = route?.params?.dataCheckEmail
  const registrationCode = route?.params?.registrationCode
  const [userName, setUserName] = useState()
  const [email, setEmail] = useState(passingData)
  const [password, setPassword] = useState()
  const [confirmPass, setConfirmPass] = useState()
  const [language, setLanguage] = useState()
  const [securePass, setSecurePass] = useState(true)
  const [secureConfirm, setSecureConfirm] = useState(true)
  const [isShowLanguage, setShowLanguage] = useState(false)
  const [lsLanguage, setLsLanguage] = useState()
  const dispatch = useDispatch()
  const [dataNoti, setDataNoti] = useState()
  const [isShowNoti, setShowNoti] = useState()
  const [statusErrorPass, setStatusErrorPass] = useState()
  const getLsLanguage = useSelector(state => state.common.lsLanguage)

  useEffect(() => {
    callAPILsLanguage()
    console.log('passingDataCheckEmal: ', passingDataCheckEmal)
  }, [])

  useEffect(() => {
    checkStatusErrorPass()
  }, [password, confirmPass])

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

  const callAPILsLanguage = () => {
    dispatch(apiGetLanguages()).then(res => {
      const getData = res?.payload?.lingue || []
      if (getData.length > 0) {
        console.log('Get data language: ', getData)
        setLsLanguage(getData)
      }
    }).catch(() => { })
  }

  const checkPass = (text) => {
    var format = new RegExp(passingDataCheckEmal?.config?.regexPassword)
    if (_.isEmpty(text)) {
      return false
    }
    if (format.test(text)) {
      return true
    } else {
      return false
    }
  }

  const renderTextInput = () => {
    return (
      <View>
        <CustomTextInput
          title={Translate(languageRedux).USERNAME}
          onChangeTxt={(txt) => setUserName(txt)}
          value={userName}
          validate={checkWhiteSpace(userName) ? false : true}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          autoCapitalize={'none'}
        />
        <CustomTextInput
          title={Translate(languageRedux).EMAIL}
          onChangeTxt={txt => setEmail(passingData)}
          value={email}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
        <CustomTextInput
          title={Translate(languageRedux).PASSWORD}
          onChangeTxt={txt => setPassword(txt)}
          value={password}
          isShowImg={true}
          isSecure={securePass}
          onPressSecure={() => setSecurePass(!securePass)}
          validate={password ? false : true}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
        <CustomTextInput
          title={Translate(languageRedux).CONFIRM_PWD}
          onChangeTxt={txt => setConfirmPass(txt)}
          value={confirmPass}
          isShowImg={true}
          isSecure={secureConfirm}
          onPressSecure={() => setSecureConfirm(!secureConfirm)}
          validate={confirmPass ? false : true}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
        <CustomTextInput
          title={Translate(languageRedux).LANGUAGE}
          onChangeTxt={txt => setLanguage(txt)}
          value={language?.name}
          iconRight={icDoc.ic_dropdown}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          onPress={() => { setShowLanguage(true) }}
        />
      </View>
    )
  }

  const checkStatusErrorPass = () => {
    if (password === confirmPass) {
      if (checkPass(confirmPass) === true) {
        setStatusErrorPass(0)
      }
      else {
        setStatusErrorPass(2)
      }
    }
    else {
      setStatusErrorPass(1)
    }
  }

  const checkDisable = () => {
    if (checkWhiteSpace(userName) && password && confirmPass) {
      return false
    }
    else {
      return true
    }
  }

  const renderButtonNext = () => {
    return (
      <View style={styles.marginT40}>
        <Button
          text={Translate(languageRedux).NEXT}
          textColor={checkDisable() ? colorC1C3C5 : colorFFFFFF}
          backgroundColor={checkDisable() ? colorF0F0F0 : color3777EE}
          disabled={checkDisable()}
          onPress={() => {
            if (statusErrorPass === 0) {
              NavigationService.navigate(Routes.SIGN_UP_DOCTOR_2, {
                data: {
                  userName: userName,
                  email: email,
                  password: password,
                  language: language,
                  listCurrency: passingDataCheckEmal?.config?.currencies,
                  currency: passingDataCheckEmal?.config?.currency,
                  fee: passingDataCheckEmal?.config?.videocallPrice,
                  slot: passingDataCheckEmal?.config?.defaultSlotDuration,
                  registrationCode: registrationCode
                }
              })
            }
            if (statusErrorPass === 1) {
              setShowNoti(true)
              setDataNoti({
                status: STATUS_NOTIFY.ERROR,
                content: Translate(languageRedux).PWD_NOTMATCH
              })
            }
            if (statusErrorPass === 2) {
              setShowNoti(true)
              setDataNoti({
                status: STATUS_NOTIFY.ERROR,
                content: passingDataCheckEmal?.config?.passwordErrorMessage || Translate(languageRedux).PWD_NOTMATCH
              })
            }
          }}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        {renderTextInput()}
        {renderButtonNext()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        textCenter={Translate(languageRedux).SIGNUP_BTN}
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_left}
        onPressLeft={() => {
          NavigationService.goBack()
        }}
      />
      <KeyboardAwareScrollView>
        {renderBody()}
      </KeyboardAwareScrollView>
      {
        isShowLanguage && (
          <SearchListWithName
            listData={lsLanguage}
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
  ctnBody: {
    paddingBottom: 48,
    marginHorizontal: 20
  },
  marginT40: {
    marginTop: 40
  }
})
