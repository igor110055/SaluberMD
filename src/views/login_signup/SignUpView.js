import React, { useState, useEffect, useRef } from 'react'
import {
  StyleSheet, View, StatusBar, SafeAreaView,
  Image, Text, TouchableOpacity, ScrollView,
  Dimensions
} from 'react-native'
import {
  color00379D, color040404, color3777EE, colorC1C3C5,
  colorF0F0F0, colorFFFFFF
} from '../../constants/colors'
import imgSignUp from '../../../assets/images/login_signup'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CSS, { customTxt } from '../../constants/css'
import TextInputView from './components/TextInputView'
import Fonts from '../../constants/Fonts'
import DialogView from '../../components/DialogView'
import NavigationService from '../../navigation'
import HTML from 'react-native-render-html'
import { useDispatch, useSelector } from 'react-redux'
import { apiPreLogin, apiPrivacy, apiTerms } from '../../api/Auth'
import imgHealth from '../../../assets/images/health_profile'
import { convertCalenderDDMMYYYY, convertYYYYMMDD, getDate112000, subtractNumberDay } from '../../constants/DateHelpers'
import { checkLogin, saveSignUp, saveToken } from '../../actions/user'
import Routes from '../../navigation/Routes'
import CustomDatePicker from '../../components/CustomDatePicker'
import { apiGetLanguages } from '../../api/Common'
import SearchListWithName from '../../components/SearchListWithName'
import LoadingView from '../../components/LoadingView'
import AsyncStorage from '@react-native-community/async-storage'
import { STORAGE_KEY } from '../../constants/define'
import * as APIs from '../../api/APIs'
import { apiGetServerByCode, apiPostAddUser, apiPostCheckEmail } from '../../api/SignUp'
import NotificationView, { STATUS_NOTIFY } from '../../components/NotificationView'
import _ from 'lodash'
// import { getLanguages } from 'react-native-i18n'
import { saveLanguage } from '../../actions/common'
import * as defines from '../../constants/define'
import Translate from '../../translate'
import { isIphoneX, validateEmail, validatePassword } from '../../constants/utils'
import IntlPhoneInput from 'react-native-intl-phone-input'

const TYPE_SCREEN = {
  WELCOME: 'WELCOME',
  TERMS: 'TERMS',
  PRIVACY: 'PRIVACY',
  TELL_US: 'TELL_US'
}

export default function SignUpView() {
  const [percent, setPercent] = useState(2)
  const [type, setType] = useState(TYPE_SCREEN.WELCOME)
  const [email, setEmail] = useState('')
  const [validateTxtEmail, setValidateEmail] = useState(true)
  const [registrationCode, setRegistrationCode] = useState()
  const [isDialog, setDialog] = useState(false)
  const dispatch = useDispatch()
  const [terms, setTerms] = useState(txtTermsShow)
  const [privacy, setPrivacy] = useState(txtPrivacyShow)
  const [isAccept, setAccept] = useState(false)
  const [isActive, setActive] = useState(false)
  const scrollRef = useRef()

  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [securePass, setSecurePass] = useState(true)
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [gender, setGender] = useState('')
  const [isShowGender, setShowGender] = useState(false)
  const [birthday, setBirthday] = useState()
  const [birthPlace, setBirthPlace] = useState('')
  const [country, setCountry] = useState('')
  const [isShowCountry, setShowCountry] = useState(false)
  const datePickerRef = React.createRef()
  const [getLsLanguage, setLsLanguage] = useState(defines.LANGUAGE)
  const [showLanguage, setShowLanguage] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isShowPushNoti, setPushNoti] = useState(false)
  const [errorNoti, setErrorNoti] = useState()
  const [resCheckEmail, setResCheckEmail] = useState()
  const languageRedux = useSelector(state => state.common.language)
  const [language, setLanguage] = useState({ value: languageRedux })
  const [dataCheckEmail, setDataCheckEmail] = useState()
  const [phone, setPhone] = useState()

  const GENDERS = [
    { name: Translate(languageRedux).male, id: 0 },
    { name: Translate(languageRedux).female, id: 1 },
    { name: Translate(languageRedux).I_WOULD_RATHER_NOT_SAY, id: 2 }
  ]

  useEffect(() => {
    callAPITerm()
    callAPIPrivacy()
    callAPILsLanguage()
  }, [])

  useEffect(() => {
    getPercent()
  }, [type])

  useEffect(() => {
    checkButton()
  }, [email, registrationCode, isAccept])

  useEffect(() => {
    checkButton()
  }, [username, password, name, lastName, birthday, gender, country, language])

  useEffect(() => {
    const filterIndex = _.findIndex(defines.LANGUAGE, { value: languageRedux })
    if (filterIndex > 0) {
      setLanguage(defines.LANGUAGE[filterIndex])
    }
  }, [languageRedux])

  useEffect(() => {
    // getLanguages().then(languages => {
    //   console.log('Language: ', languages) // ['en-US', 'en']
    //   if ((language || []).length > 1) {
    //     Promise.all([
    //       dispatch(saveLanguage(language[1]))
    //     ])
    //   }
    // })
    Promise.all([
      dispatch(saveLanguage('en_US'))
    ])
  }, [])

  const callAPILsLanguage = () => {
    dispatch(apiGetLanguages()).then(res => {
      const getData = res?.payload?.lingue || []
      if (getData.length > 0) {
        console.log('Get data language: ', getData)
        setLsLanguage(getData)
      }
    }).catch(() => { })
  }

  const callAPITerm = () => {
    dispatch(apiTerms()).then(res => {
      console.log('Terms: ', res)
      if (res.payload?.data?.terms) {
        setTerms(res.payload?.data?.terms)
      }
    })
  }

  const callAPIPrivacy = () => {
    dispatch(apiPrivacy()).then(res => {
      console.log('Privacy: ', res)
      if (res.payload?.data?.text) {
        setPrivacy(res.payload?.data?.text)
      }
    })
  }

  const getPercent = () => {
    setTimeout(() => {
      switch (type) {
        case TYPE_SCREEN.TERMS:
          return setPercent(25)
        case TYPE_SCREEN.PRIVACY:
          return setPercent(50)
        case TYPE_SCREEN.TELL_US:
          return setPercent(100)
        default:
          return setPercent(2)
      }
    }, 200)
  }

  const _onPressback = () => {
    switch (type) {
      case TYPE_SCREEN.TERMS:
        setType(TYPE_SCREEN.WELCOME)
        return
      case TYPE_SCREEN.PRIVACY:
        setType(TYPE_SCREEN.TERMS)
        setActive(false)
        setAccept(false)
        return
      case TYPE_SCREEN.TELL_US:
        setType(TYPE_SCREEN.PRIVACY)
        setActive(false)
        setAccept(false)
        setUserName('')
        setPassword('')
        setName('')
        setLastName('')
        setBirthday()
        setBirthPlace('')
        setGender('')
        setCountry('')
        setLanguage('')
        return
      default:
        NavigationService.goBack()
        return
    }
  }

  const renderBack = () => {
    return (
      <TouchableOpacity
        onPress={_onPressback}
        style={[CSS.shadown, styles.shadown]}>
        <Image style={styles.imgBack} source={imgSignUp.ic_back} />
      </TouchableOpacity>
    )
  }
  //Welcome to SaluberMD!
  const renderWelcome = () => {
    return (
      <KeyboardAwareScrollView style={styles.marginR20}>
        <Text style={[
          customTxt(Fonts.Bold, 24, color040404).txt,
          styles.titleStyle
        ]}>{Translate(languageRedux).WELCOM_TO_SALUBERMD}</Text>
        <TextInputView
          title={Translate(languageRedux).EMAIL}
          placeholder={Translate(languageRedux).EMAIL}
          value={email}
          onChangeTxt={(txt) => {
            setEmail(txt)
            setValidateEmail(true)
          }}
          validate={!validateTxtEmail}
        />
        <TextInputView
          title={Translate(languageRedux).REGISTRATION_CODE}
          placeholder={Translate(languageRedux).REGISTRATION_CODE}
          rightIcon={true}
          onPressRightIcon={() => setDialog(true)}
          value={registrationCode}
          onChangeTxt={(txt) => setRegistrationCode(txt)}
        />
        {/* <TextInputView
          title={Translate(languageRedux).LANGUAGE_TYPE}
          value={language?.name || ''}
          onChangeTxt={(txt) => setLanguage(txt)}
          placeholder={'English'}
          onPressDropDown={() => {
            setShowLanguage(true)
          }}
          imgStyle={styles.imgStyle}
        /> */}
      </KeyboardAwareScrollView>
    )
  }

  const renderTerms = () => {
    return (
      <ScrollView
        style={styles.marginR20}
        ref={scrollRef}
        onMomentumScrollEnd={({ nativeEvent }) => {
          checkButton(true)
        }}
      >
        <Text style={[
          customTxt(Fonts.Bold, 24, color040404).txt,
          styles.titleStyle
        ]}>{Translate(languageRedux).TERMS_CONDITIONS}</Text>
        <HTML source={{ html: terms }} />
      </ScrollView>
    )
  }

  const renderAccept = () => {
    return (
      <View style={styles.acceptView}>
        <TouchableOpacity onPress={() => setAccept(!isAccept)}>
          <Image
            style={styles.imgAccept}
            source={isAccept ? imgHealth.ic_checkbox : imgHealth.ic_emptybox}
          />
        </TouchableOpacity>
        <Text
          style={
            customTxt(Fonts.Regular, 16, color040404).txt
          }>{Translate(languageRedux).ACCEPT_BTN}</Text>
      </View>
    )
  }

  const renderPrivacy = () => {
    return (
      <ScrollView
        ref={scrollRef}
        style={styles.marginR20}>
        <Text style={[
          customTxt(Fonts.Bold, 24, color040404).txt,
          styles.titleStyle
        ]}>{Translate(languageRedux).PRIVACY_POLICY_TITLE}</Text>
        <HTML source={{ html: privacy }} />
        {renderAccept()}
      </ScrollView>
    )
  }

  const _onChangePhone = (txt) => {
    setPhone((txt || '').trim())
  }

  const convertNumber = (txt) => {
    const currentValue = (txt || '').replace(/[^\d]/g, '')
    const cvLength = currentValue.length

    // returns: "x", "xx", "xxx"
    if (cvLength < 4) { return currentValue }

    // returns: "xxx xxx xxx",
    if (cvLength < 7) { return `${currentValue.slice(0, 3)} ${currentValue.slice(3)}` }
    return `${currentValue.slice(0, 3)} ${currentValue.slice(3, 6)} ${currentValue.slice(6, 9)} ${currentValue.slice(9, 12)} ${currentValue.slice(12, 15)} ${currentValue.slice(15, 18)}`
  }

  const renderTellUs = () => {
    return (
      <KeyboardAwareScrollView
        style={styles.marginR20}
        onKeyboardDidHide={() => {
          // setTimeout(() => {
          //   setPhone(convertNumber(phone))
          // }, 500)
        }}
      >
        {/* <IntlPhoneInput
          onChangeText={onChangeText}
          defaultCountry="VN"
          renderAction={() => { }}
        /> */}
        <Text style={[
          customTxt(Fonts.Bold, 24, color040404).txt,
          styles.titleStyle
        ]}>{Translate(languageRedux).TELL_US_MORE_ABOUT_YOU}</Text>
        <TextInputView
          title={Translate(languageRedux).USERNAME}
          value={username}
          onChangeTxt={(txt) => setUserName(txt)}
          placeholder={Translate(languageRedux).USERNAME}
          validate={username ? false : true}
        />
        <TextInputView
          title={Translate(languageRedux).PASSWORD}
          value={password}
          onChangeTxt={(txt) => setPassword(txt)}
          placeholder={Translate(languageRedux).PASSWORD}
          isSecure={securePass}
          onPressSecure={() => setSecurePass(!securePass)}
          isShowImg={true}
          validate={validatePassword(password) ? false : true}
        />
        <TextInputView
          title={Translate(languageRedux).FIRST_NAME}
          value={name}
          onChangeTxt={(txt) => setName(txt)}
          placeholder={Translate(languageRedux).FIRST_NAME}
          textStyle={styles.marginT18}
          validate={name ? false : true}
        />
        <TextInputView
          title={Translate(languageRedux).surname}
          value={lastName}
          onChangeTxt={(txt) => setLastName(txt)}
          placeholder={Translate(languageRedux).surname}
          validate={lastName ? false : true}
        />
        <TextInputView
          title={Translate(languageRedux).birthday_member}
          value={birthday ? convertCalenderDDMMYYYY(birthday) : ''}
          onChangeTxt={(txt) => setBirthday(txt)}
          placeholder={'DD.MM.YYYY'}
          onPress={() => datePickerRef.current.onPressDate()}
          validate={birthday ? false : true}
        />
        <TextInputView
          title={Translate(languageRedux).gender1}
          value={gender?.name || ''}
          onChangeTxt={(txt) => setGender(txt)}
          placeholder={Translate(languageRedux).gender1}
          onPressDropDown={() => setShowGender(true)}
          imgStyle={styles.imgStyle}
          validate={gender?.name ? false : true}
        />
        <TextInputView
          title={Translate(languageRedux).placeOfBirth}
          value={birthPlace}
          onChangeTxt={(txt) => setBirthPlace(txt)}
          placeholder={Translate(languageRedux).placeOfBirth}
        />
        <TextInputView
          title={Translate(languageRedux).ricettario}
          value={country?.text || ''}
          onChangeTxt={(txt) => setCountry(txt)}
          placeholder={Translate(languageRedux).select}
          onPressDropDown={() => setShowCountry(true)}
          imgStyle={styles.imgStyle}
          validate={country?.text ? false : true}
        />
        <TextInputView
          title={Translate(languageRedux).PHONE}
          value={phone}
          onChangeTxt={_onChangePhone}
          placeholder={Translate(languageRedux).PHONE}
          validate={phone ? false : true}
          keyboardType={'phone-pad'}
          onSubmitEditing={() => {
            // setTimeout(() => {
            //   setPhone(convertNumber(phone))
            // }, 500)
          }}
        />
        {/* <TextInputView
          title={'Language'}
          value={language?.name || ''}
          onChangeTxt={(txt) => setLanguage(txt)}
          placeholder={Translate(languageRedux).select}
          onPressDropDown={() => {
            setShowLanguage(true)
          }}
          imgStyle={styles.imgStyle}
        /> */}
      </KeyboardAwareScrollView>
    )
  }

  const renderContent = () => {
    switch (type) {
      case TYPE_SCREEN.TERMS:
        return renderTerms()
      case TYPE_SCREEN.PRIVACY:
        return renderPrivacy()
      case TYPE_SCREEN.TELL_US:
        return renderTellUs()
      default:
        return renderWelcome()
    }
  }

  const checkButton = (isAct) => {
    switch (type) {
      case TYPE_SCREEN.TERMS:
        return setActive(isAct)
      case TYPE_SCREEN.PRIVACY:
        return setActive(isAccept)
      case TYPE_SCREEN.TELL_US:
        return setActive(username && validatePassword(password) && name && lastName && birthday && gender && country)
      default:
        return setActive(email && registrationCode)
    }
  }

  const login = () => {
    let param = {
      username: email,
      password: password
    }
    Promise.all([
      dispatch(checkLogin(param))
    ])

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

  const callAPIAuthFetch = async () => {
    let param = {
      username: email,
      password: password,
      'code': '000000'
    }
    setLoading(true)
    console.log('Param login: ', param)
    return await fetch(`${APIs.hostAPI}backoffice/auth`, {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        'access-control-request-headers': 'X-AUTH-TOKEN'
      },
      body: JSON.stringify(param)
    }).then(function (response) {
      console.log('response.headers: ', response.headers)
      console.log('X-AUTH-TOKEN:', response.headers.get('x-auth-token'))
      const getToken = response.headers.get('x-auth-token')
      if (response.status !== 200) {
        console.log('Status Code: ' + response.status)
        console.log('response:', response?._bodyText)
        setLoading(false)
        setPushNoti(true)
        const getErr = JSON.parse(response?._bodyText)
        if (getErr) {
          console.log(getErr)
          setErrorNoti({
            esito: 1,
            motivo: getErr?.reason || ''
          })
        }
        return
      }
      if (getToken) {
        Promise.all([
          AsyncStorage.setItem(STORAGE_KEY.TOKEN, `${getToken}`),
          AsyncStorage.setItem(STORAGE_KEY.USERNAME, username),
          AsyncStorage.setItem(STORAGE_KEY.PASSWORD, password),
          dispatch(saveToken(`${getToken}`))
        ])
        setTimeout(() => {
          NavigationService.navigateAndReset(Routes.WELCOME_SCREEN)
        }, 3000)
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

  const checkCode = () => {
    let param = {
      code: registrationCode
    }
    dispatch(apiGetServerByCode(param)).then(res => {
      console.log('CheckServer: ', res)
    }).catch(err => {
      console.log('err:', err)
    })

    setTimeout(() => {
      checkEmail()
    }, 500)
  }

  const checkEmail = async () => {
    let param = {
      code: registrationCode,
      email,
      locale: languageRedux
    }
    setLoading(true)
    dispatch(apiPostCheckEmail(param)).then(res => {
      console.log('CheckEmail: ', res)
      if (_.includes([1, '1'], res?.payload?.esito)) {
        setErrorNoti(res?.payload)
        setPushNoti(true)
        setLoading(false)
      } else {
        if (res?.payload?.terms) {
          setTerms(res?.payload?.terms)
        }
        if (res?.payload?.privacy) {
          setPrivacy(res?.payload?.privacy)
        }
        if (res?.payload) {
          setDataCheckEmail(res?.payload)
        }
        setResCheckEmail(res?.payload)
        setTimeout(() => {
          setType(TYPE_SCREEN.TERMS)
          setActive(false)
          setLoading(false)
        }, 300)
      }
    }).catch(err => {
      setLoading(false)
      console.log('err: ', err)
    })
  }

  const callAPAddUser = () => {
    let privacyAgreed = [
      {
        'value': 1,
        'values': [
          {
            'text': 'Accept',
            'value': 1,
            'key': 1,
            'group': 1,
            '$$hashKey': 'object:701'
          }
        ],
        'label': 'Accept',
        'mandatory': 1,
        '$$hashKey': 'object:699',
        'answer': '1'
      }
    ]

    let param = {
      placeOfBirth: birthPlace || '',
      birthdate: birthday ? convertYYYYMMDD(birthday) : '',
      city: '',
      code: registrationCode,
      cognome: lastName || '',
      country: country?.value || '',
      currency: resCheckEmail?.config?.currency || 'EUR',
      dob: birthday ? `${convertYYYYMMDD(subtractNumberDay(1, birthday))}T17:00:00.000Z` : '',
      doctorEmail: '',
      doctorName: '',
      doctorPhone: '',
      email: email,
      fee: 1,
      gender: `${gender?.id}`,
      locale: language?.value || languageRedux,
      nome: name,
      password: password,
      password1: password,
      phone1: (phone || ''),
      privacyAgreed: JSON.stringify(privacyAgreed),
      provider: -7,
      role: 5,
      state: '',
      timeslot: 15,
      username: username,
      version: '11'
    }
    console.log('param: ', param)
    setLoading(true)
    dispatch(apiPostAddUser(param)).then(res => {
      console.log('res: ', res)
      if (_.includes([1, '1'], res?.payload?.esito)) {
        setErrorNoti(res?.payload)
        setPushNoti(true)
        setLoading(false)
      } else {
        setTimeout(() => {
          Promise.all([login()])
        }, 300)
      }
    }).catch(err => {
      console.log('err :', err)
      setLoading(false)
    })
  }

  const _onPressNext = () => {
    if (isActive && type === TYPE_SCREEN.WELCOME) {
      const validate = validateEmail(email)
      setValidateEmail(validate)
      if (validate) {
        checkCode()
      }
    } else if (isActive && type === TYPE_SCREEN.TERMS) {
      if (scrollRef?.current) {
        scrollRef?.current?.scrollTo({
          x: 0,
          y: 0,
          animated: true
        })
      }
      setType(TYPE_SCREEN.PRIVACY)
      setActive(false)
    } else if (isActive && type === TYPE_SCREEN.PRIVACY) {
      if (dataCheckEmail?.role === 5) {
        setType(TYPE_SCREEN.TELL_US)
        setActive(false)
      }
      if (dataCheckEmail?.role === 4) {
        NavigationService.navigate(Routes.SIGN_UP_DOCTOR_1, {
          data: email,
          dataCheckEmail: dataCheckEmail,
          registrationCode: registrationCode
        })
      }
    } else if (type === TYPE_SCREEN.TELL_US) {
      if (username && password && name && lastName && birthday && gender && country && language?.name) {
        Promise.all([
          dispatch(saveSignUp({
            email: username
          }))
        ])
        callAPAddUser()
      }
    }
  }

  const _onPressComplete = () => {
    console.log('type: ', type)
    if (username && password && name && lastName && birthday && gender && country && language?.name && phone) {
      Promise.all([
        dispatch(saveSignUp({
          email: username
        }))
      ])
      callAPAddUser()
    }
  }

  const renderBottomButton = () => {
    const getNameBT = type === TYPE_SCREEN.TELL_US ?
      Translate(languageRedux).COMPLETE :
      Translate(languageRedux).NEXT
    return (
      <View style={styles.marginR20}>
        <TouchableOpacity
          activeOpacity={isActive ? 0 : 1}
          onPress={type === TYPE_SCREEN.TELL_US ? _onPressComplete : _onPressNext}
          style={styleCustom(isActive).bottomView}>
          <Text style={[
            customTxt(Fonts.SemiBold, 18, colorC1C3C5).txt,
            styleCustom(isActive).txtNext
          ]}>{getNameBT}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const _onChangeDatePicker = (date) => {
    setBirthday(date)
  }

  const scrollDown = () => {
    const onPressScrollDown = () => {
      scrollRef.current.scrollToEnd({ animated: true })
      checkButton(true)
    }

    if (type === TYPE_SCREEN.TERMS || type === TYPE_SCREEN.PRIVACY) {
      return (
        <TouchableOpacity
          onPress={onPressScrollDown}
          style={[styles.scrollDownStyle, CSS.shadown]}>
          <Image source={imgSignUp.ic_scroll_down} style={styles.imgScrollDown} />
        </TouchableOpacity>
      )
    }
    return null
  }

  const onChangeText = (dialCode, unmaskedPhoneNumber, phoneNumber, isVerified) => {
    console.log(dialCode, unmaskedPhoneNumber, phoneNumber, isVerified)
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white" />
      <SafeAreaView style={styles.safeView1} />
      <SafeAreaView style={styles.safeView2}>
        <View style={[
          styleCustom().precentView,
          styles.widthView
        ]}>
          <View style={[
            styleCustom(percent).precentView2
          ]} />
        </View>
        {renderBack()}
        {renderContent()}
        {renderBottomButton()}
        <DialogView
          isShow={isDialog}
          onPressCancel={() => setDialog(false)}
          title={Translate(languageRedux).TITLE_Y_N}
          content={Translate(languageRedux).CONTENT_TITLE_Y_N}
          txt1={Translate(languageRedux).OK}
        />
        <CustomDatePicker
          refDatePicker={datePickerRef}
          onChangeDate={_onChangeDatePicker}
          maxDate={new Date()}
          date={birthday || getDate112000()}
        />
      </SafeAreaView>
      {
        isShowGender && (
          <SearchListWithName
            listData={GENDERS}
            title={`${Translate(languageRedux).select} ${Translate(languageRedux).gender1}`}
            itemSelected={gender}
            onItemClick={(val) => {
              setGender(val)
              setShowGender(false)
            }}
            onPressRight={() => {
              setShowGender(false)
            }}
            hideSearchText={true}
          />
        )
      }
      {
        isShowCountry && (
          <SearchListWithName
            listData={COUNTRIES}
            title={`${Translate(languageRedux).select} ${Translate(languageRedux).ricettario}`}
            itemSelected={country}
            onItemClick={(val) => {
              setCountry(val)
              setShowCountry(false)
            }}
            onPressRight={() => {
              setShowCountry(false)
            }}
            isText={true}
          />
        )
      }
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
                AsyncStorage.setItem(STORAGE_KEY.LANGUAGE, val?.value)
              ])
            }}
            onPressRight={() => {
              setShowLanguage(false)
            }}
          />
        )
      }
      {scrollDown()}
      {
        isLoading && <LoadingView />
      }
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  safeView1: {
    flex: 0
  },
  safeView2: {
    flex: 1,
    marginLeft: 20
  },
  imgBack: {
    width: 48,
    height: 48,
    marginTop: 12,
    marginBottom: 20
  },
  marginR20: {
    paddingRight: 20,
    paddingBottom: isIphoneX ? 0 : 20
  },
  shadown: {
    width: 48,
    height: 84,
    shadowColor: color00379D,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 2,
      height: 4
    }
  },
  titleStyle: {
    marginBottom: 16
  },
  acceptView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  imgAccept: {
    width: 24,
    height: 24,
    marginTop: 24,
    marginRight: 16,
    marginBottom: 24
  },
  imgStyle: {
    width: 12,
    height: 6
  },
  widthView: {
    width: Dimensions.get('window').width - 40
  },
  scrollDownStyle: {
    position: 'absolute',
    width: 40,
    height: 40,
    right: 20,
    bottom: 100,
    borderRadius: 20,
    backgroundColor: colorFFFFFF
  },
  imgScrollDown: {
    width: 40,
    height: 40
  }
})

const styleCustom = (percent) => StyleSheet.create({
  precentView: {
    height: 4,
    backgroundColor: colorF0F0F0
  },
  precentView2: {
    width: `${percent}%`,
    height: 4,
    backgroundColor: color3777EE
  },
  bottomView: {
    width: '100%',
    height: 56,
    backgroundColor: percent ? color3777EE : colorF0F0F0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 12
  },
  txtNext: {
    color: percent ? colorFFFFFF : colorC1C3C5
  }
})

const txtTermsShow = `
TERMS
Last revision: Dec 7, 2017
Use of the Site.
SaluberMD, LLC (“SaluberMD”, “we”, “us”, or “our”) operates the website located
at www.salubermd.com and other related websites and mobile applications with links to these
Terms of Use (collectively, the “Site”). We offer online telehealth services (the “Services”) enabling our members (“Members”) to report their health history and engage healthcare professionals (“Healthcare Professionals”) to obtain medical and healthcare services (“Services”). By accessing and using the Site, you agree to be bound by these Terms of Use and all other terms and policies that appear on the Site. If you do not wish to be bound by any of these Terms of Use, you may not use the Site or the Services.

HEALTHCARE SERVICES
The Healthcare Professionals who deliver Services through SaluberMD are independent professionals practicing within a group of independently owned professional practices collectively known as “SaluberMD Professionals”. SaluberMD, LLC does not practice medicine or any other licensed profession, and does not interfere with the practice of medicine or any other licensed profession by Healthcare Professionals, each of whom is responsible for his or her services and compliance with the requirements applicable to his or her profession and license. Neither SaluberMD nor any third parties who promote the Services or provide you with a link to the Services shall be liable for any professional advice you obtain from a Healthcare Professional via the Services.
SITE CONTENT
None of the Site content (other than information you receive from Healthcare Professionals) should be considered medical advice or an endorsement, representation or warranty that any particular medication or treatment is safe, appropriate, or effective for you.
PRIVACY
SaluberMD is required to comply with federal healthcare privacy and security laws and maintain safeguards to protect the security of your health information. Additionally, the information you provide to your Healthcare Professional during a medical consultation or therapy session is legally confidential, except for certain legal exceptions as more fully described in our Privacy Policy. We devote considerable effort toward ensuring that your personal information is secure. Information regarding our use of health and other personal information is provided in our Privacy Policy. As part of providing you the Services, we may need to provide you with certain communications, such as appointment reminders, service announcements and administrative messages. These communications are considered part of the Services and your Account. While secure electronic messaging is always preferred to insecure email, under certain circumstances, insecure email communication containing personal health information may take place between you and SaluberMD. SaluberMD cannot ensure the security or confidentiality of messages sent by email. Information relating to your care, including clinical notes and medical records, are stored on secure, encrypted servers maintained by SaluberMD.
USER ACCOUNTS
When you register on the Site, you are required to create an account (“Account”) by entering your name, email address, password and certain other information collected by SaluberMD (collectively “Account Information”). To create an Account, you must be of legal age to form a binding contract. If you are not of legal age to form a binding contract, you may not register to use our Services. You agree that the Account Information that you provide to us at all times, including during registration and in any information you upload to the Site, will be true, accurate, current, and complete. You may not transfer or share your Account password with anyone, or create more than one Account (with the exception of subaccounts established for children of whom you are the parent or legal guardian). You are responsible for maintaining the confidentiality of your Account password and for all activities that occur under your Account.

SaluberMD reserves the right to take any and all action, as it deems necessary or reasonable, regarding the security of the Site and your Account Information. In no event and under no circumstances shall SaluberMD be held liable to you for any liabilities or damages resulting from or arising out of your use of the Site, your use of the Account Information or your release of the Account Information to a third party. You may not use anyone else's account at any time.
ACCESS RIGHTS
We hereby grant to you a limited, non-exclusive, nontransferable right to access the Site and use the Services solely for your personal non-commercial use and only as permitted under these Terms of Use and any separate agreements you may have entered into with us (“Access Rights”). We reserve the right, in our sole discretion, to deny or suspend use of the Site or Services to anyone for any reason. You agree that you will not, and will not attempt to: (a) impersonate any person or entity, or otherwise misrepresent your affiliation with a person or entity; (b) use the Site or Services to violate any local, state, national or international law; (c) reverse engineer, disassemble, decompile, or translate any software or other components of the Site or Services; (d) distribute viruses or other harmful computer code through the Site; or (e) otherwise use the Services or Site in any manner that exceeds the scope of use granted above. In addition, you agree to refrain from abusive language and behavior which could be regarded as inappropriate, or conduct that is unlawful or illegal, when communicating with Healthcare Professionals through the Site and to refrain from contacting Healthcare Professionals for telehealth services outside of the Site. SaluberMD is not responsible for any interactions with Healthcare Professionals that are not conducted through the Site. We strongly recommend that you do not use the Services on public computers. We also recommend that you do not store your Account password through your web browser or other software.
FEES AND PURCHASE TERMS
You agree to pay all fees or charges to your Account in accordance with the fees, charges, and billing terms in effect at the time a fee or charge is due and payable. By providing SaluberMD with your credit card number or PayPal account and associated payment information, you agree that SaluberMD is authorized to immediately invoice your account for all fees and charges due and payable to SaluberMD hereunder and that no additional notice or consent is required. If your health plan, employer or agency has arranged with SaluberMD to pay the fee or any portion of the fee, or if the fee is pursuant to some other arrangement with SaluberMD, that fee adjustment will be reflected in the fee that you are ultimately charged. Please check with your employer, health plan or agency to determine if any Services will be reimbursed.

If you do not have insurance coverage for Services, or if your coverage is denied, you acknowledge and agree that you shall be personally responsible for all incurred expenses. SaluberMD offers no guarantee that you shall receive any such reimbursement.
SaluberMD reserves the right to modify or implement a new pricing structure at any time prior to billing you for your initial payment or for future payments due pursuant to these Terms of Use. You understand and agree that for Services provided on an appointment basis, you will be responsible for a missed appointment fee equal to all or a portion of the fees you and your insurer or other payor would have paid for the scheduled services if you do not cancel a scheduled appointment at least 24 hours in advance, unless we notify you in writing that a shorter cancellation window applies.
WEBSITE LINKS
WE WILL NOT BE LIABLE FOR ANY INFORMATION, SOFTWARE, OR LINKS FOUND AT ANY OTHER WEBSITE, INTERNET LOCATION, OR SOURCE OF INFORMATION, NOR FOR YOUR USE OF SUCH INFORMATION, SOFTWARE OR LINKS, NOR FOR THE ACTS OR OMISSIONS OF ANY SUCH WEBSITES OR THEIR RESPECTIVE OPERATORS.
OWNERSHIP
The Site and its entire contents, features and functionality (including but not limited to all information, software, text, displays, images, video and audio, and the design, selection and arrangement thereof), are owned by SaluberMD, its licensors or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret and other intellectual property or proprietary rights laws. These Terms of Use permit you to use the Site for your personal, non-commercial use only. You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store or transmit any of the material on our Site except as generally and ordinarily permitted through the Site according to these Terms of Use. You must not access or use for any commercial purposes any part of the Site or any services or materials available through the Site.
TRADEMARKS
Certain of the names, logos, and other materials displayed on the Site or in the Services may constitute trademarks, trade names, service marks or logos ("Marks") of SaluberMD or other entities. You are not authorized to use any such Marks without the express written permission
of SaluberMD. Ownership of all such Marks and the goodwill associated therewith remains with us or those other entities.
TERMINATION
You may deactivate your Account and end your registration at any time, for any reason by sending an email to info@salubermd.com. SaluberMD may suspend or terminate your use of the Site, your Account and/or registration for any reason at any time. Subject to applicable law, SaluberMD reserves the right to maintain, delete or destroy all communications and materials posted or uploaded to the Site pursuant to its internal record retention and/or content destruction policies. After such termination, SaluberMD will have no further obligation to provide the Services, except to the extent we are obligated to provide you access to your health records or Healthcare Professionals are required to provide you with continuing care under their applicable legal, ethical and professional obligations to you.
RIGHT TO MODIFY
We may at our sole discretion change, add, or delete portions of these Terms of Use at any time on a going-forward basis. Continued use of the Site and/or Services following notice of any such changes will indicate your acknowledgement of such changes and agreement to be bound by the revised Terms of Use, inclusive of such changes.
DISCLAIMER OF WARRANTIES
YOU EXPRESSLY AGREE THAT USE OF THE SITE OR SERVICES IS AT YOUR SOLE RISK. BOTH THE SITE AND SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. SALUBERMD EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR USE OR PURPOSE, NON-INFRINGEMENT, TITLE, OPERABILITY, CONDITION, QUIET ENJOYMENT, VALUE, ACCURACY OF DATA AND SYSTEM INTEGRATION.
INDEMNIFICATION
You agree to indemnify, defend and hold harmless SaluberMD, its officers, directors, employees, agents, subsidiaries, affiliates, licensors, and suppliers, from and against any claim, actions, demands, liabilities and settlements, including without limitation reasonable legal and accounting fees (“Claims”), resulting from, or alleged to result from, your violation of these Terms of Use.
GEOGRAPHICAL RESTRICTIONS
SaluberMD makes no representation that all products, services and/or material described on the Site, or the Services available through the Site, are appropriate or available for use in locations outside the United States or all territories within the United States.
DISCLOSURES
All Health Professionals on the Site hold professional licenses issued by the professional licensing boards in the states where they practice. All physicians and psychologists hold advanced degrees in either medicine or psychology and have undergone postgraduate training. You can report a complaint relating to the care provided by a Healthcare Professional by contacting the professional licensing board in the state where the care was received. In a professional relationship, sexual intimacy is never appropriate and should be reported to the board or agency that licenses, registers, or certifies the licensee.

You can find the contact information for each of the state professional licensing boards governing medicine on the Federation of State Medical Boards website at http://www.fsmb.org/state-medical-boards/contacts and governing psychology on the Association of State and Provincial Psychology Boards website at http://www.asppb.net/?page=BdContactNewPG.

Any clinical records created as a result of your use of the Services will be securely maintained by SaluberMD on behalf of SaluberMD Professionals for a period that is no less than the minimum number of years such records are required to be maintained under state and federal law, and which is typically at least six years.
MISCELLANEOUS
These Terms of Use and your use of the Site shall be governed by the laws of the State of Delaware, without giving effect to the principles of conflict of laws. Any dispute arising under or relating in any way to these Terms of Use will be resolved exclusively by final and binding arbitration in San Francisco, California under the rules of the American Arbitration Association, except that either party may bring a claim related to intellectual property rights, or seek temporary and preliminary specific performance and injunctive relief, in any court of competent jurisdiction, without the posting of bond or other security. The parties agree to the personal and subject matter jurisdiction and venue of the courts located in San Francisco, California, for any action related to these Terms of Use.
You understand that by checking the “agree” box for these Terms of Use and/or any other forms presented to you on the Site you are agreeing to these Terms of Use and that such action constitutes a legal signature. You agree that we may send to you any privacy or other notices, disclosures, or communications regarding the Services (collectively, "Communications") through electronic means including but not limited to: (1) by e-mail, using the address that you provided to us during registration, (2) short messaging service (“SMS”) text message to the mobile number you provided us during registration, (3) push notifications on your mobile device, or (4) by posting the Communications on the Site. The delivery of any Communications from us is effective when sent by us, regardless of whether you read the Communication when you receive it or whether you actually receive the delivery. You can withdraw your consent to receive Communications by deactivating your Account. You can opt-out of future Communications through SMS text message by replying “STOP” or by calling SaluberMD Member Support.

No waiver by SaluberMD of any term or condition set forth in these Terms of Use shall be deemed a further or continuing
waiver of such term or condition or a waiver of any other term or condition, and any failure of SaluberMD to assert a right or provision under these Terms of Use shall not constitute a waiver of such right or provision. If any provision of these Terms of Use is held by a court or other tribunal of competent jurisdiction to be invalid, illegal or unenforceable for any reason, such provision shall be eliminated or limited to the minimum extent such that the remaining provisions of the Terms of Use will continue in full force and effect.

SaluberMD devotes considerable effort to optimizing signal strength and diagnosis deficiencies but is not responsible for the internet or data bandwidth and signal of your mobile device.
The Digital Millennium Copyright Act of 1998 (the "DMCA") provides recourse for copyright owners who believe that material appearing on the Internet infringes their rights under U.S. copyright law. If you believe in good faith that materials appearing on the Site infringe your copyright, you (or your agent) may send us a notice requesting that the material be removed, or access to it blocked. In addition, if you believe in good faith that a notice of copyright infringement has been wrongly filed against you, the DMCA permits you to send us a counter- notice. Notices and counter-notices must meet statutory requirements imposed by the DMCA.

One place to find more information is the U.S. Copyright Office Web site, currently located at http://www.loc.gov/copyright. In accordance with the DMCA, SaluberMD has designated an agent to receive notification of alleged copyright infringement in accordance with the DMCA. Any written Notification of Claimed infringement should comply with Title 17, United States Code, Section 512(c)(3)(A) and should be provided in writing to SaluberMD LLC c/o Baily & Glasser, LLP, ATTN: Brian Glasser, 209 Capitol Street, Charleston, West Virginia 25301.

Please report any violations of these Terms of Use to info@salubermd.com.
`

const txtPrivacyShow = `
Introduction This notice explains SaluberMD’s policy concerning gathering, storing, handling, and securing customer information and data, and the various measures Telemedicine takes to protect your privacy.

Your Privacy SaluberMD pledges to always respect and secure your privacy. SaluberMD provides sophisticated telemedicine services using advanced technologies that require us to collect and store personal and medical information that you supply to us. Because collecting and storing data is a key part of our business, SaluberMD recognizes its commitment to at all times protect the secrecy and confidentiality of your information. We make great efforts to ensure that the information you share with SaluberMD is kept strictly confidential and secured through a variety of hardware and software procedures. We also recognize the importance of maintaining strict confidentiality and security policies regarding disclosure of customer identity or personal information.

Our Privacy Guarantee SaluberMD is the sole collector and owner of information submitted to us by you. SaluberMD will never share and/or transfer your personal information with or to any third party, unless legally required to do so by a recognized court of law. SaluberMD may share only non-personal or aggregate data that contain no personal identifying information.

Personal Information We Collect and Store You may provide SaluberMD with two types of information: 1. Personal information you choose to submit when you register with SaluberMD, such as your name, address, etc., and persons who are to be contacted in case of emergency. 2. Medical information, including medical histories you choose to submit during registration, and medical data we collect from our medical monitoring devices and during the interactive healthcare sessions we conduct with you at your request.

The personal and medical information is protected by security measures, as specified below.

Email Address In order to use this website, you must first complete a registration procedure. During registration you are required to give your contact information, such as name and email address. The email address is mandatory. When registration is complete, we send you – the new member – a welcoming email that provides your User ID and Password. If you forget your password, you may use the recovery procedure and a new password will be sent to your email address.

Home Address You may (but are not obliged to) provide your home address. This address, however, is required should you order an emergency card. The emergency card will be sent to this address.

Links To Other Websites Our website may contain links to other websites. You should carefully review the privacy policies and practices of other websites, as we cannot control or be responsible for their privacy practices.

Cookies Many websites use “cookies,” small computer files placed automatically on a PC’s hard drive that provide the web site with information about the user. SaluberMD does not use cookies on its customer website.

Our Security Measures Our website and database are protected by a comprehensive, multi-layered information security model. SaluberMD's security model is designed to ensure the confidentiality of the patient and health information providers through appropriate security measures.

Authentication: You must enter personal identification information to enter your personal account. On the login page you must enter your User ID and Password. When you login to the system with your User ID and Password you will have the right to view and edit your records. If you login to the system with your User ID and Emergency Password or you delegate another person (a medical specialist) to login with the Emergency Password you (or he/she) will have the right to view a partial set of your data – the emergency data. As the owner of this data, you will have the ability to control and define the set of emergency data that will be disclosed at emergency login.

Encryption – SSL 128 bits: Secure Socket Layer (SSL) technology is used for data transmission between our web site and the browser at your local computer. We use 128-bit encryption, the highest level of protection available for all Internet communications, including credit card and other financial transactions. SSL means that the personal information you provide us is transmitted safely because it is encrypted. Encryption involves systematic scrambling of numbers and letters so that if someone manages to intercept a digital packet of data, then he/she would not be able to use it. When you leave our secured site you may encounter a standard warning that most browsers display when a visitor moves from a "secured" page to an "unsecured" page. Verisign Valid Certificate: Our Verisign SSL Web Server Certificate provides secure communications by encrypting all data to and from the site. Verisign has checked and verified the company’s registration documents and the site's registered domain name. This enables you to check the site's validity yourself. Always check a site's certificate before entering any sensitive information.

SaluberMD Staff Access Limitation: Access to all customer information, including the sensitive information noted above, is restricted within our offices. Only authorized Telemedicine personnel who require the information to perform a specific job have access to web server logs and to information that can be linked to a specific individual. These employees are held to strict confidentiality and security policies regarding disclosure of customer identity or personal information.

Secured environment: The servers on which we store personally identifiable information are kept in a secure environment.

Changes to This Privacy Policy SaluberMD may update this privacy policy from time to time as necessary. If we propose to make changes in the way we treat personal information, we will notify you by placing a prominent notice on our site. We will handle personal identifiable information in accordance with the privacy policy that was in effect when such information was collected or submitted.

How to Contact Us Should you have questions or concerns about our privacy policy, please send us an email at info@salubermd.com. 
`
export const COUNTRIES = [
  { 'text': 'Afghanistan', 'value': 'AF' },
  { 'text': '\u212bland Islands', 'value': 'AX' },
  { 'text': 'Albania', 'value': 'AL' },
  { 'text': 'Algeria', 'value': 'DZ' },
  { 'text': 'American Samoa', 'value': 'AS' },
  { 'text': 'Andorra', 'value': 'AD' },
  { 'text': 'Angola', 'value': 'AO' },
  { 'text': 'Anguilla', 'value': 'AI' },
  { 'text': 'Antarctica', 'value': 'AQ' },
  { 'text': 'Antigua and Barbuda', 'value': 'AG' },
  { 'text': 'Argentina', 'value': 'AR' },
  { 'text': 'Armenia', 'value': 'AM' },
  { 'text': 'Aruba', 'value': 'AW' },
  { 'text': 'Australia', 'value': 'AU' },
  { 'text': 'Austria', 'value': 'AT' },
  { 'text': 'Azerbaijan', 'value': 'AZ' },
  { 'text': 'Bahamas', 'value': 'BS' },
  { 'text': 'Bahrain', 'value': 'BH' },
  { 'text': 'Bangladesh', 'value': 'BD' },
  { 'text': 'Barbados', 'value': 'BB' },
  { 'text': 'Belarus', 'value': 'BY' },
  { 'text': 'Belgium', 'value': 'BE' },
  { 'text': 'Belize', 'value': 'BZ' },
  { 'text': 'Benin', 'value': 'BJ' },
  { 'text': 'Bermuda', 'value': 'BM' },
  { 'text': 'Bhutan', 'value': 'BT' },
  { 'text': 'Bolivia', 'value': 'BO' },
  { 'text': 'Bosnia and Herzegovina', 'value': 'BA' },
  { 'text': 'Botswana', 'value': 'BW' },
  { 'text': 'Bouvet Island', 'value': 'BV' },
  { 'text': 'Brazil', 'value': 'BR' },
  { 'text': 'British Indian Ocean Territory', 'value': 'IO' },
  { 'text': 'Brunei Darussalam', 'value': 'BN' },
  { 'text': 'Bulgaria', 'value': 'BG' },
  { 'text': 'Burkina Faso', 'value': 'BF' },
  { 'text': 'Burundi', 'value': 'BI' },
  { 'text': 'Cambodia', 'value': 'KH' },
  { 'text': 'Cameroon', 'value': 'CM' },
  { 'text': 'Canada', 'value': 'CA' },
  { 'text': 'Cape Verde', 'value': 'CV' },
  { 'text': 'Cayman Islands', 'value': 'KY' },
  { 'text': 'Central African Republic', 'value': 'CF' },
  { 'text': 'Chad', 'value': 'TD' },
  { 'text': 'Chile', 'value': 'CL' },
  { 'text': 'China', 'value': 'CN' },
  { 'text': 'Christmas Island', 'value': 'CX' },
  { 'text': 'Cocos (Keeling) Islands', 'value': 'CC' },
  { 'text': 'Colombia', 'value': 'CO' },
  { 'text': 'Comoros', 'value': 'KM' },
  { 'text': 'Congo', 'value': 'CG' },
  { 'text': 'Congo, The Democratic Republic of the', 'value': 'CD' },
  { 'text': 'Cook Islands', 'value': 'CK' },
  { 'text': 'Costa Rica', 'value': 'CR' },
  { 'text': "Cote D'Ivoire", 'value': 'CI' },
  { 'text': 'Croatia', 'value': 'HR' },
  { 'text': 'Cuba', 'value': 'CU' },
  { 'text': 'Cyprus', 'value': 'CY' },
  { 'text': 'Czech Republic', 'value': 'CZ' },
  { 'text': 'Denmark', 'value': 'DK' },
  { 'text': 'Djibouti', 'value': 'DJ' },
  { 'text': 'Dominica', 'value': 'DM' },
  { 'text': 'Dominican Republic', 'value': 'DO' },
  { 'text': 'Ecuador', 'value': 'EC' },
  { 'text': 'Egypt', 'value': 'EG' },
  { 'text': 'El Salvador', 'value': 'SV' },
  { 'text': 'Equatorial Guinea', 'value': 'GQ' },
  { 'text': 'Eritrea', 'value': 'ER' },
  { 'text': 'Estonia', 'value': 'EE' },
  { 'text': 'Ethiopia', 'value': 'ET' },
  { 'text': 'Falkland Islands (Malvinas)', 'value': 'FK' },
  { 'text': 'Faroe Islands', 'value': 'FO' },
  { 'text': 'Fiji', 'value': 'FJ' },
  { 'text': 'Finland', 'value': 'FI' },
  { 'text': 'France', 'value': 'FR' },
  { 'text': 'French Guiana', 'value': 'GF' },
  { 'text': 'French Polynesia', 'value': 'PF' },
  { 'text': 'French Southern Territories', 'value': 'TF' },
  { 'text': 'Gabon', 'value': 'GA' },
  { 'text': 'Gambia', 'value': 'GM' },
  { 'text': 'Georgia', 'value': 'GE' },
  { 'text': 'Germany', 'value': 'DE' },
  { 'text': 'Ghana', 'value': 'GH' },
  { 'text': 'Gibraltar', 'value': 'GI' },
  { 'text': 'Greece', 'value': 'GR' },
  { 'text': 'Greenland', 'value': 'GL' },
  { 'text': 'Grenada', 'value': 'GD' },
  { 'text': 'Guadeloupe', 'value': 'GP' },
  { 'text': 'Guam', 'value': 'GU' },
  { 'text': 'Guatemala', 'value': 'GT' },
  { 'text': 'Guernsey', 'value': 'GG' },
  { 'text': 'Guinea', 'value': 'GN' },
  { 'text': 'Guinea-Bissau', 'value': 'GW' },
  { 'text': 'Guyana', 'value': 'GY' },
  { 'text': 'Haiti', 'value': 'HT' },
  { 'text': 'Heard Island and Mcdonald Islands', 'value': 'HM' },
  { 'text': 'Holy See (Vatican City State)', 'value': 'VA' },
  { 'text': 'Honduras', 'value': 'HN' },
  { 'text': 'Hong Kong', 'value': 'HK' },
  { 'text': 'Hungary', 'value': 'HU' },
  { 'text': 'Iceland', 'value': 'IS' },
  { 'text': 'India', 'value': 'IN' },
  { 'text': 'Indonesia', 'value': 'ID' },
  { 'text': 'Iran, Islamic Republic Of', 'value': 'IR' },
  { 'text': 'Iraq', 'value': 'IQ' },
  { 'text': 'Ireland', 'value': 'IE' },
  { 'text': 'Isle of Man', 'value': 'IM' },
  { 'text': 'Israel', 'value': 'IL' },
  { 'text': 'Italy', 'value': 'IT' },
  { 'text': 'Jamaica', 'value': 'JM' },
  { 'text': 'Japan', 'value': 'JP' },
  { 'text': 'Jersey', 'value': 'JE' },
  { 'text': 'Jordan', 'value': 'JO' },
  { 'text': 'Kazakhstan', 'value': 'KZ' },
  { 'text': 'Kenya', 'value': 'KE' },
  { 'text': 'Kiribati', 'value': 'KI' },
  { 'text': "Democratic People's Republic of Korea", 'value': 'KP' },
  { 'text': 'Korea, Republic of', 'value': 'KR' },
  { 'text': 'Kosovo', 'value': 'XK' },
  { 'text': 'Kuwait', 'value': 'KW' },
  { 'text': 'Kyrgyzstan', 'value': 'KG' },
  { 'text': "Lao People's Democratic Republic", 'value': 'LA' },
  { 'text': 'Latvia', 'value': 'LV' },
  { 'text': 'Lebanon', 'value': 'LB' },
  { 'text': 'Lesotho', 'value': 'LS' },
  { 'text': 'Liberia', 'value': 'LR' },
  { 'text': 'Libyan Arab Jamahiriya', 'value': 'LY' },
  { 'text': 'Liechtenstein', 'value': 'LI' },
  { 'text': 'Lithuania', 'value': 'LT' },
  { 'text': 'Luxembourg', 'value': 'LU' },
  { 'text': 'Macao', 'value': 'MO' },
  { 'text': 'Macedonia, The Former Yugoslav Republic of', 'value': 'MK' },
  { 'text': 'Madagascar', 'value': 'MG' },
  { 'text': 'Malawi', 'value': 'MW' },
  { 'text': 'Malaysia', 'value': 'MY' },
  { 'text': 'Maldives', 'value': 'MV' },
  { 'text': 'Mali', 'value': 'ML' },
  { 'text': 'Malta', 'value': 'MT' },
  { 'text': 'Marshall Islands', 'value': 'MH' },
  { 'text': 'Martinique', 'value': 'MQ' },
  { 'text': 'Mauritania', 'value': 'MR' },
  { 'text': 'Mauritius', 'value': 'MU' },
  { 'text': 'Mayotte', 'value': 'YT' },
  { 'text': 'Mexico', 'value': 'MX' },
  { 'text': 'Micronesia, Federated States of', 'value': 'FM' },
  { 'text': 'Moldova, Republic of', 'value': 'MD' },
  { 'text': 'Monaco', 'value': 'MC' },
  { 'text': 'Mongolia', 'value': 'MN' },
  { 'text': 'Montenegro', 'value': 'ME' },
  { 'text': 'Montserrat', 'value': 'MS' },
  { 'text': 'Morocco', 'value': 'MA' },
  { 'text': 'Mozambique', 'value': 'MZ' },
  { 'text': 'Myanmar', 'value': 'MM' },
  { 'text': 'Namibia', 'value': 'NA' },
  { 'text': 'Nauru', 'value': 'NR' },
  { 'text': 'Nepal', 'value': 'NP' },
  { 'text': 'Netherlands', 'value': 'NL' },
  { 'text': 'Netherlands Antilles', 'value': 'AN' },
  { 'text': 'New Caledonia', 'value': 'NC' },
  { 'text': 'New Zealand', 'value': 'NZ' },
  { 'text': 'Nicaragua', 'value': 'NI' },
  { 'text': 'Niger', 'value': 'NE' },
  { 'text': 'Nigeria', 'value': 'NG' },
  { 'text': 'Niue', 'value': 'NU' },
  { 'text': 'Norfolk Island', 'value': 'NF' },
  { 'text': 'Northern Mariana Islands', 'value': 'MP' },
  { 'text': 'Norway', 'value': 'NO' },
  { 'text': 'Oman', 'value': 'OM' },
  { 'text': 'Pakistan', 'value': 'PK' },
  { 'text': 'Palau', 'value': 'PW' },
  { 'text': 'Palestinian Territory, Occupied', 'value': 'PS' },
  { 'text': 'Panama', 'value': 'PA' },
  { 'text': 'Papua New Guinea', 'value': 'PG' },
  { 'text': 'Paraguay', 'value': 'PY' },
  { 'text': 'Peru', 'value': 'PE' },
  { 'text': 'Philippines', 'value': 'PH' },
  { 'text': 'Pitcairn', 'value': 'PN' },
  { 'text': 'Poland', 'value': 'PL' },
  { 'text': 'Portugal', 'value': 'PT' },
  { 'text': 'Puerto Rico', 'value': 'PR' },
  { 'text': 'Qatar', 'value': 'QA' },
  { 'text': 'Reunion', 'value': 'RE' },
  { 'text': 'Romania', 'value': 'RO' },
  { 'text': 'Russian Federation', 'value': 'RU' },
  { 'text': 'Rwanda', 'value': 'RW' },
  { 'text': 'Saint Helena', 'value': 'SH' },
  { 'text': 'Saint Kitts and Nevis', 'value': 'KN' },
  { 'text': 'Saint Lucia', 'value': 'LC' },
  { 'text': 'Saint Pierre and Miquelon', 'value': 'PM' },
  { 'text': 'Saint Vincent and the Grenadines', 'value': 'VC' },
  { 'text': 'Samoa', 'value': 'WS' },
  { 'text': 'San Marino', 'value': 'SM' },
  { 'text': 'Sao Tome and Principe', 'value': 'ST' },
  { 'text': 'Saudi Arabia', 'value': 'SA' },
  { 'text': 'Senegal', 'value': 'SN' },
  { 'text': 'Serbia', 'value': 'RS' },
  { 'text': 'Seychelles', 'value': 'SC' },
  { 'text': 'Sierra Leone', 'value': 'SL' },
  { 'text': 'Singapore', 'value': 'SG' },
  { 'text': 'Slovakia', 'value': 'SK' },
  { 'text': 'Slovenia', 'value': 'SI' },
  { 'text': 'Solomon Islands', 'value': 'SB' },
  { 'text': 'Somalia', 'value': 'SO' },
  { 'text': 'South Africa', 'value': 'ZA' },
  { 'text': 'South Georgia and the South Sandwich Islands', 'value': 'GS' },
  { 'text': 'Spain', 'value': 'ES' },
  { 'text': 'Sri Lanka', 'value': 'LK' },
  { 'text': 'Sudan', 'value': 'SD' },
  { 'text': 'Surilabel', 'value': 'SR' },
  { 'text': 'Svalbard and Jan Mayen', 'value': 'SJ' },
  { 'text': 'Swaziland', 'value': 'SZ' },
  { 'text': 'Sweden', 'value': 'SE' },
  { 'text': 'Switzerland', 'value': 'CH' },
  { 'text': 'Syrian Arab Republic', 'value': 'SY' },
  { 'text': 'Taiwan', 'value': 'TW' },
  { 'text': 'Tajikistan', 'value': 'TJ' },
  { 'text': 'Tanzania, United Republic of', 'value': 'TZ' },
  { 'text': 'Thailand', 'value': 'TH' },
  { 'text': 'Timor-Leste', 'value': 'TL' },
  { 'text': 'Togo', 'value': 'TG' },
  { 'text': 'Tokelau', 'value': 'TK' },
  { 'text': 'Tonga', 'value': 'TO' },
  { 'text': 'Trinidad and Tobago', 'value': 'TT' },
  { 'text': 'Tunisia', 'value': 'TN' },
  { 'text': 'Turkey', 'value': 'TR' },
  { 'text': 'Turkmenistan', 'value': 'TM' },
  { 'text': 'Turks and Caicos Islands', 'value': 'TC' },
  { 'text': 'Tuvalu', 'value': 'TV' },
  { 'text': 'Uganda', 'value': 'UG' },
  { 'text': 'Ukraine', 'value': 'UA' },
  { 'text': 'United Arab Emirates', 'value': 'AE' },
  { 'text': 'United Kingdom', 'value': 'GB' },
  { 'text': 'United States', 'value': 'US' },
  { 'text': 'United States Minor Outlying Islands', 'value': 'UM' },
  { 'text': 'Uruguay', 'value': 'UY' },
  { 'text': 'Uzbekistan', 'value': 'UZ' },
  { 'text': 'Vanuatu', 'value': 'VU' },
  { 'text': 'Venezuela', 'value': 'VE' },
  { 'text': 'Viet Nam', 'value': 'VN' },
  { 'text': 'Virgin Islands, British', 'value': 'VG' },
  { 'text': 'Virgin Islands, U.S.', 'value': 'VI' },
  { 'text': 'Wallis and Futuna', 'value': 'WF' },
  { 'text': 'Western Sahara', 'value': 'EH' },
  { 'text': 'Yemen', 'value': 'YE' },
  { 'text': 'Zambia', 'value': 'ZM' },
  { 'text': 'Zimbabwe', 'value': 'ZW' }
]
