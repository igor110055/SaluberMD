import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios'
import * as APIs from '../../../api/APIs'
import _ from 'lodash'
import AsyncStorage from '@react-native-community/async-storage'

import {color040404, color3777EE, colorC1C3C5, colorDDDEE1, colorF0F0F0, colorF56565, colorFFFFFF} from 'constants/colors'
import Translate from 'translate'
import NavigationService from 'navigation'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Routes from 'navigation/Routes'
import { checkWhiteSpace } from 'constants/CheckWhiteSpace'
import {convertYYYYMMDD} from 'constants/DateHelpers'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
import { STORAGE_KEY } from 'constants/define'
import { saveBase64Signature, saveDataSignUpDr2,
  saveDataSignUpDr3, saveListSpecialtySelected } from 'actions/common'
import { apiPreLogin } from 'api/Auth'
import { checkLogin, saveToken } from 'actions/user'

import icHeader from '../../../../assets/images/header'
import icDoc from '../../../../assets/images/document'

import Header from 'components/Header'
import CustomTextInput from '../../healthProfile/components/CustomTextInput'
import Button from 'components/Button'
import SearchListWithName from 'components/SearchListWithName'
import LoadingView from 'components/LoadingView'
import ChooseSpecialtyView from './components/ChooseSpecialtyView'

export default function Step3({ route }) {
  const languageRedux = useSelector(state => state.common.language)
  const passingData = route?.params?.data
  const [specialty, setSpecialty] = useState()
  const [school, setSchool] = useState()
  const [licenseNumber, setLicenseNumber] = useState()
  const [lengthPractice, setLengthPractice] = useState()
  const [fee, setFee] = useState()
  const [currency, setCurrency] = useState()
  const [slot, setSlot] = useState()
  const token = useSelector(state => state.user.token)
  const [isLoad, setLoading] = useState(true)
  const [listSpecialty, setListSpecialty] = useState()
  const [isShowSpecialty, setShowSpecialty] = useState(false)
  const [isShowListCurrency, setShowListCurrency] = useState(false)
  const [isShowListSlot, setShowListSlot] = useState(false)
  const listSpecialtySelected = useSelector(state => state.common.listSpecialtySelected)
  const base64Signature = useSelector(state => state.common.base64Signature)
  const [signBase64, setSignBase64] = useState()
  const [listIdSpecialty, setListIdSpecialty] = useState()
  const [dataNoti, setDataNoti] = useState(false)
  const [isShowNoti, setShowNoti] = useState()
  const dispatch = useDispatch()
  const dataSignUpDr3 = useSelector(state => state.common.dataSignUpDr3)
  const [base64Data, setBase64Data] = useState()

  useEffect(() => {
    setSignBase64(base64Signature)
  }, [base64Signature])

  useEffect(() => {
    console.log('dataSignUpDr3: ', dataSignUpDr3)
    setSchool(dataSignUpDr3?.school || '')
    setLicenseNumber(dataSignUpDr3?.licenseNumber || '')
    setLengthPractice(dataSignUpDr3?.lengthPractice || '')
    setFee(dataSignUpDr3?.fee || '')
    setCurrency(dataSignUpDr3?.currency || '')
    setSlot(dataSignUpDr3?.slot || '')
    if ((dataSignUpDr3 || []).length === 0) {
      setFee((passingData?.fee).toString() || '')
      setCurrency(passingData?.currency || '')
      setSlot((passingData?.slot).toString() || '')
    }
  }, [])

  useEffect(() => {
    var base64 = passingData?.imgProfile?.data
    const after_ = base64.substring(base64.indexOf(',') + 1)
    setBase64Data(after_)
  }, [passingData])

  const SLOTS = [
    { name: '60', id: 0 },
    { name: '45', id: 1 },
    { name: '30', id: 2 },
    { name: '15', id: 3 }
  ]

  useEffect(() => {
    callAPIListSpecialty()
  }, [])

  useEffect(() => {
    var length = (listSpecialtySelected || []).length
    setSpecialty(length)
    convertListSpecialtySelectedToServer()
  }, [listSpecialtySelected])

  const convertListSpecialtySelectedToServer = () => {
    var list = []
    for (var i = 0; i <= (listSpecialtySelected || []).length - 1; i++) {
      var id = listSpecialtySelected[i]?.id
      list.push(id)
    }
    setListIdSpecialty(list)
  }

  const callAPIListSpecialty = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/util/getAllSpecialita`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        setLoading(false)
        console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.specialita || []
          setListSpecialty(getList)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const renderTextInput = () => {
    return (
      <View>
        <CustomTextInput
          title={Translate(languageRedux).SPECIALTY}
          onChangeTxt={(txt) => setSpecialty(txt)}
          value={specialty + ' ' + Translate(languageRedux).ITEMS}
          validate={specialty ? false : true}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icDoc.ic_dropdown}
          onPress={() => { setShowSpecialty(true) }}
        />
        <CustomTextInput
          title={Translate(languageRedux).M_SCHOOL}
          onChangeTxt={(txt) => setSchool(txt)}
          value={school}
          validate={checkWhiteSpace(school) ? false : true}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
        <CustomTextInput
          title={Translate(languageRedux).LICENSE_NUMBER}
          onChangeTxt={(txt) => setLicenseNumber(txt)}
          value={licenseNumber}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
        <CustomTextInput
          title={Translate(languageRedux).PRACTICE_LENGTH}
          onChangeTxt={(txt) => setLengthPractice(txt)}
          value={lengthPractice}
          validate={checkWhiteSpace(lengthPractice) ? false : true}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
        <View style={styles.flexRow}>
          <View style={styles.flex1}>
            <CustomTextInput
              title={Translate(languageRedux).price_per_visit}
              onChangeTxt={(txt) => setFee(txt)}
              value={fee}
              textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
              validate={checkWhiteSpace(fee) ? false : true}
            />
          </View>
          <View style={styles.width20} />
          <View style={styles.flex1}>
            <CustomTextInput
              title={Translate(languageRedux).currency}
              onChangeTxt={(txt) => setCurrency(txt)}
              value={currency}
              textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
              iconRight={icDoc.ic_dropdown}
              validate={currency ? false : true}
              onPress={() => { setShowListCurrency(true) }}
            />
          </View>
        </View>
        <CustomTextInput
          title={Translate(languageRedux).slotime}
          onChangeTxt={(txt) => setSlot(txt)}
          value={slot}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icDoc.ic_dropdown}
          validate={slot ? false : true}
          onPress={() => { setShowListSlot(true) }}
        />
      </View>
    )
  }

  const renderSignatureView = () => {
    return (
      <View style={styles.signatureView}>
        <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt, styles.marginB8]}>
          {Translate(languageRedux).signature}
        </Text>
        <TouchableOpacity onPress={() => { NavigationService.navigate(Routes.SIGNATURE_VIEW) }} 
        style={signBase64 ? styles.viewTouch : styles.viewTouch2}>
          <Image
            resizeMode={'contain'}
            style={styles.viewTouch}
            source={{ uri: signBase64 }}
          />
        </TouchableOpacity>
      </View>
    )
  }

  const checkDisable = () => {
    if (specialty && checkWhiteSpace(school) &&
    checkWhiteSpace(lengthPractice) && checkWhiteSpace(fee) && signBase64) {
      return false
    }
    else {
      return true
    }
  }

  const renderButtonSignUp = () => {
    return (
      <View style={styles.ctnButton}>
        <Button
          text={Translate(languageRedux).SIGNUP_BTN}
          textColor={checkDisable() ? colorC1C3C5 : colorFFFFFF}
          backgroundColor={checkDisable() ? colorF0F0F0 : color3777EE}
          disabled={checkDisable()}
          onPress={_onPressAddUserDoctor}
        />
      </View>
    )
  }

  const _onPressAddUserDoctor = () => {
    const body = {
      role: 4,
      email: passingData?.email,
      birthdate: convertYYYYMMDD(passingData?.birthday),
      username: passingData?.userName,
      locale: passingData?.language?.value,
      country: passingData?.country?.value,
      password: passingData?.password,
      code: passingData?.registrationCode,
      fee: Number(fee),
      currency: currency,
      timeslot: Number(slot),
      privacyAgreed:
        '[{"value":1,"values":[{"text":"Accept","value":1,"key":1,"group":1,"$$hashKey":"object:6484"}],"label":"Accept","mandatory":1,"$$hashKey":"object:6482","answer":"1"}]',
      signaturealt: signBase64,
      signature: signBase64,
      password1: passingData?.password,
      nome: passingData?.firstName,
      cognome: passingData?.lastName,
      dob: passingData?.birthday,
      gender: passingData?.gender?.id,
      address: passingData?.officeAddress,
      city: passingData?.city,
      phone1: passingData?.phone,
      specializations: listIdSpecialty,
      school: school,
      lengthPractice: lengthPractice,
      version: '11',
      provider: -7,
      licenseNumber: licenseNumber,
      photo: {
        filetype: passingData?.imgProfile?.type,
        filename: 'user_image',
        filesize: passingData?.imgProfile?.res?.size,
        base64: base64Data
      }
    }
    console.log('BODY: ', body)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/demo/addUser`,
      headers: {
        'x-auth-token': token
      },
      data: body
    })
      .then(response => {
        console.log('data: ', response.data)
        setLoading(true)
        setShowNoti(true)
        if (_.includes([0, '0'], response?.data?.esito)) {
          Promise.all([
            dispatch(saveDataSignUpDr2([])),
            dispatch(saveDataSignUpDr3([])),
            dispatch(saveListSpecialtySelected([])),
            dispatch(saveBase64Signature(null))
          ])
          setDataNoti({
            status: STATUS_NOTIFY.SUCCESS,
            content: response?.data?.motivo
          })
          setTimeout(() => {
            Promise.all([login()])
          }, 300)
        }
        if (_.includes([1, '1'], response?.data?.esito)) {
          setDataNoti({
            status: STATUS_NOTIFY.ERROR,
            content: response?.data?.motivo
          })
          setLoading(false)
        }
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
  }

  const login = () => {
    if (_.isEmpty(passingData?.userName || '') && _.isEmpty(passingData?.password || '')) {
      return
    }
    let param = {
      username: passingData?.userName || '',
      password: passingData?.password
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
      username: passingData?.userName || '',
      password: passingData?.password || '',
      code: '000000'
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
          setShowNoti(true)
          setShowNoti({
            esito: 1,
            motivo: Translate(languageRedux).MSG_LOGIN_ERROR
          })
        }
        const errJson = await JSON.parse(response._bodyText)
        setLoading(false)
        setShowNoti(true)
        setShowNoti({
          esito: 1,
          motivo: errJson?.reason || Translate(languageRedux).server_missing
        })
        return
      }
      if (getToken) {
        Promise.all([
          AsyncStorage.setItem(STORAGE_KEY.TOKEN, `${getToken}`),
          AsyncStorage.setItem(STORAGE_KEY.USERNAME, passingData?.userName),
          AsyncStorage.setItem(STORAGE_KEY.PASSWORD, passingData?.password),
          AsyncStorage.setItem(STORAGE_KEY.IS_FACE_ID, 'false'),
          dispatch(saveToken(`${getToken}`))
        ])
        Promise.all([
          setTimeout(() => {
            NavigationService.navigate(Routes.DRAWER_NAVIGATION_DOCTOR)
          }, 2000)
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

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        {renderTextInput()}
        {renderSignatureView()}
        {renderButtonSignUp()}
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
          var data = {
            school: school,
            licenseNumber: licenseNumber,
            lengthPractice: lengthPractice,
            fee: fee,
            currency: currency || dataSignUpDr3?.currency,
            slot: slot || dataSignUpDr3?.slot
          }
          Promise.all([
            dispatch(saveDataSignUpDr3(data))
          ])
          setTimeout(() => {
            NavigationService.goBack()
          }, 500)
        }}
      />
      <KeyboardAwareScrollView>
        {renderBody()}
      </KeyboardAwareScrollView>
      {isShowSpecialty && (
        <ChooseSpecialtyView
          onPressCancel={() => {setShowSpecialty(false)}}
          listSpecialty={listSpecialty}
        />
      )}
      {
        isShowListCurrency && (
          <SearchListWithName
            listData={passingData?.listCurrency || []}
            title={Translate(languageRedux).CHOOSE_CURRENCY}
            itemSelected={currency}
            onItemClick={(val) => {
              setCurrency(val?.name)
              setShowListCurrency(false)
            }}
            onPressRight={() => {
              setShowListCurrency(false)
            }}
          />
        )
      }
      {
        isShowListSlot && (
          <SearchListWithName
            listData={SLOTS}
            title={Translate(languageRedux).CHOOSE_SLOT}
            itemSelected={slot}
            onItemClick={(val) => {
              setSlot(val?.name)
              setShowListSlot(false)
            }}
            onPressRight={() => {
              setShowListSlot(false)
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
      {isLoad && <LoadingView />}
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
  flexRow: {
    flexDirection: 'row'
  },
  flex1: {
    flex: 1
  },
  width20: {
    width: 20
  },
  ctnButton: {
    marginTop: 40
  },
  signatureView: {
    height: 150,
    marginTop: 16
  },
  viewTouch: {
    height: 150,
    borderWidth: 0.5,
    borderRadius: 12,
    borderColor: colorDDDEE1
  },
  viewTouch2: {
    height: 150,
    borderWidth: 0.5,
    borderRadius: 12,
    borderColor: colorF56565
  },
  marginB8: {
    marginBottom: 8
  }
})
