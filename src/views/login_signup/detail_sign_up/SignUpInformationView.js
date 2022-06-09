import React, { useState } from 'react'
import {
  StyleSheet, View, StatusBar, Text,
  TouchableOpacity
} from 'react-native'
import {
  color2F80ED,
  color333333,
  color5F6368,
  colorFFFFFF
} from '../../../constants/colors'
import Header from '../../../components/Header'
import { customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import NavigationService from '../../../navigation'
import Routes from '../../../navigation/Routes'
import CustomTextInput from '../../account/components/CustomTextInput'
import { convertCalenderDDMMYYYY, getDate112000 } from '../../../constants/DateHelpers'
import CustomDatePicker from '../../../components/CustomDatePicker'
import { useSelector } from 'react-redux'
import Translate from 'translate'


export default function SignUpInformationView() {
  const [isInformation, setInformation] = useState(false)
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [securePass, setSecurePass] = useState(true)
  const [confirmPassword, setConfirmPassword] = useState()
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true)
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [gender, setGender] = useState('')
  const [birthday, setBirthday] = useState(getDate112000())
  const [birthPlace, setBirthPlace] = useState('')
  const [country, setCountry] = useState('')
  const [language, setLanguage] = useState('')
  const datePickerRef = React.createRef()
  const languageRedux = useSelector(state => state.common.language)


  const _onPressCancel = () => {
    if (isInformation) {
      return setInformation(false)
    }
    NavigationService.navigateAndReset(Routes.LOGIN_SIGN_UP_SCREEN)
  }

  const textTitle = Translate(languageRedux).SIGNUP_BTN

  const renderUserName = () => {
    return (
      <View style={styles.marginInfo}>
        <CustomTextInput
          title={Translate(languageRedux).USERNAME + '*'}
          value={username}
          onChangeTxt={(txt) => setUserName(txt)}
          placeholder={Translate(languageRedux).USERNAME}
          textStyle={styles.marginT18}
        />
        <CustomTextInput
          title={Translate(languageRedux).PASSWORD + '*'}
          value={password}
          onChangeTxt={(txt) => setPassword(txt)}
          placeholder={Translate(languageRedux).PASSWORD}
          isSecure={securePass}
          onPressSecure={() => setSecurePass(!securePass)}
          isShowImg={true}
        />
        <CustomTextInput
          title={Translate(languageRedux).CONFIRM_PWD + '*'}
          value={confirmPassword}
          onChangeTxt={(txt) => setConfirmPassword(txt)}
          placeholder={Translate(languageRedux).CONFIRM_PWD}
          isSecure={secureConfirmPassword}
          onPressSecure={() => setSecureConfirmPassword(!secureConfirmPassword)}
          isShowImg={true}
        />
      </View>
    )
  }

  const renderInformation = () => {
    return (
      <View style={styles.marginInfo}>
        <CustomTextInput
          title={Translate(languageRedux).name_member + '*'}
          value={name}
          onChangeTxt={(txt) => setName(txt)}
          placeholder={Translate(languageRedux).name_member}
          textStyle={styles.marginT18}
        />
        <CustomTextInput
          title={Translate(languageRedux).surname + '*'}
          value={surname}
          onChangeTxt={(txt) => setSurname(txt)}
          placeholder={Translate(languageRedux).surname}
        />
        <CustomTextInput
          title={Translate(languageRedux).gender_member + '*'}
          value={gender}
          onChangeTxt={(txt) => setGender(txt)}
          placeholder={Translate(languageRedux).gender_member}
        />
        <CustomTextInput
          title={Translate(languageRedux).birthday_member + '*'}
          value={birthday ? convertCalenderDDMMYYYY(birthday) : ''}
          onChangeTxt={(txt) => setBirthday(txt)}
          placeholder={Translate(languageRedux).birthday_member}
          onPress={() => datePickerRef.current.onPressDate()}
        />
        <CustomTextInput
          title={Translate(languageRedux).placeOfBirth + '*'}
          value={birthPlace}
          onChangeTxt={(txt) => setBirthPlace(txt)}
          placeholder={Translate(languageRedux).placeOfBirth}
        />
        <CustomTextInput
          title={Translate(languageRedux).ricettario + '*'}
          value={country}
          onChangeTxt={(txt) => setCountry(txt)}
          placeholder={Translate(languageRedux).ricettario}
        />
        <CustomTextInput
          title={Translate(languageRedux).LANGUAGE_TYPE + '*'}
          value={language}
          onChangeTxt={(txt) => setLanguage(txt)}
          placeholder={Translate(languageRedux).LANGUAGE_TYPE}
        />
      </View>
    )
  }

  const renderBottomButton = () => {
    const _onPressNext = () => {
      if (isInformation) {
        NavigationService.navigateAndReset(Routes.WELCOME_SCREEN)
      }
      setInformation(true)
    }

    return (
      <View style={styles.bottomBTView}>
        <TouchableOpacity
          onPress={_onPressNext}
          style={styles.nextStyle}>
          <Text style={[
            customTxt(Fonts.SemiBold, 16, colorFFFFFF).txt,
            styles.txtNext
          ]}>{Translate(languageRedux).NEXT}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const _onChangeDatePicker = (date) => {
    setBirthday(date)
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white"/>
      <Header
        textCenter={Translate(languageRedux).SIGNUP_BTN}
        backgroundColor={color5F6368}
        textColor={colorFFFFFF}
        textLeft={Translate(languageRedux).cancel}
        onPressLeft={_onPressCancel}
      />
      <KeyboardAwareScrollView>
        <View style={styles.contentView}>
          <Text style={
            customTxt(Fonts.SemiBold, 16, color333333).txt
          }>{textTitle}</Text>
          {isInformation ? renderInformation() : renderUserName()}
          {renderBottomButton()}
        </View>
      </KeyboardAwareScrollView>
      <CustomDatePicker
        refDatePicker={datePickerRef}
        onChangeDate={_onChangeDatePicker}
        maxDate={new Date()}
        date={birthday}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  contentView: {
    marginTop: 48,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 48
  },
  bottomBTView: {
    alignItems: 'flex-end',
    marginTop: 35
  },
  nextStyle: {
    backgroundColor: color2F80ED,
    borderRadius: 4
  },
  txtNext: {
    marginTop: 15,
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 15
  },
  marginT18: {
    marginTop: 25
  },
  marginInfo: {
    marginLeft: 20
  }
})
