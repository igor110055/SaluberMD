import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, DeviceEventEmitter} from 'react-native'
import {useSelector} from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'
import _ from 'lodash'

import {
  colorFFFFFF,
  color040404,
  colorF0F0F0,
  color333333,
  color3777EE,
  colorC1C3C5
} from 'constants/colors'
import {customTxt} from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from '../../../../translate'
import NavigationService from 'navigation'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'

import icDoc from '../../../../../assets/images/document'

import CustomTextInput from '../../../healthProfile/components/CustomTextInput'
import Button from 'components/Button'
import Routes from 'navigation/Routes'

export default function Step4({
  setShowCountry,
  setCountry,
  country,
  countryValue,
  subject,
  doctorType,
  description
}) {
  const languageRedux = useSelector(state => state.common.language)
  const [address, setAddress] = useState()
  const [zipCode, setZipCode] = useState()
  const [city, setCity] = useState()
  const [phone, setPhone] = useState()
  const [note, setNote] = useState()
  const userinfo = useSelector(state => state.user.userinfo)
  const token = useSelector(state => state.user.token)
  const [dataNoti, setDataNoti] = useState()
  const [isShowNoti, setShowNoti] = useState()

  useEffect(() => {
    setAddress(userinfo?.address || '')
    setZipCode(userinfo?.zipCode || '')
    setCity(userinfo?.city || '')
    setPhone(userinfo?.phone1 || '')
  }, [userinfo])

  const renderTextInput = () => {
    return (
      <View>
        <CustomTextInput
          title={Translate(languageRedux).address3}
          value={address}
          onChangeTxt={txt => setAddress(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt]}
          validate={address ? false : true}
        />
        <CustomTextInput
          title={Translate(languageRedux).zipCode}
          value={zipCode}
          onChangeTxt={txt => setZipCode(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt]}
          validate={zipCode ? false : true}
        />
        <CustomTextInput
          title={Translate(languageRedux).city}
          value={city}
          onChangeTxt={txt => setCity(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt]}
          validate={city ? false : true}
        />
        <CustomTextInput
          title={Translate(languageRedux).phone1}
          value={phone}
          onChangeTxt={txt => setPhone(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt]}
          validate={phone ? false : true}
        />
        <CustomTextInput
          title={Translate(languageRedux).country1}
          value={country}
          onChangeTxt={txt => setCountry(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt]}
          validate={country ? false : true}
          iconRight={icDoc?.ic_dropdown}
          onPress={() => {
            setShowCountry(true)
          }}
        />
        <CustomTextInput
          title={Translate(languageRedux).note}
          value={note}
          onChangeTxt={txt => setNote(txt)}
          textinputStyle={[
            customTxt(Fonts.Regular, 16, color040404).txt,
            styles.heightNote
          ]}
          multiline={true}
        />
      </View>
    )
  }

  const checkDisable = () => {
    if (address && zipCode && city && phone && country && doctorType && description
      && (subject === true || subject === false)) {
      return true
    } else {
      return false
    }
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBox}>
        <View style={styles.ctnTitle}>
          <Text style={[customTxt(Fonts.SemiBold, 16, color333333).txt]}>
            {Translate(languageRedux).doctorAtHomeQuestion4}
          </Text>
        </View>
        {renderTextInput()}
        <View style={styles.ctnButton}>
          <Button
            backgroundColor={checkDisable() ? color3777EE : colorF0F0F0}
            text={Translate(languageRedux).doctorAtHomeRequestBtn}
            textColor={checkDisable() ? colorFFFFFF : colorC1C3C5}
            onPress={_onPressSendRequest}
            disabled={!checkDisable()}
          />
        </View>
      </View>
    )
  }

  const _onPressSendRequest = () => {
    const body = {
      answer1: subject ? 'My child' : 'Me',
      answer2: doctorType,
      answer3: description,
      answer4: address,
      answer6: city,
      answer5: zipCode,
      answer7: countryValue,
      answer8: phone,
      answer9: note
    }
    console.log('BODY: ', body)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/doctorAtHome`,
      headers: {
        'x-auth-token': token
      },
      data: body
    })
      .then(response => {
        console.log('data: ', response.data)
        if (_.includes([0, '0'], response?.data?.esito)) {
          setShowNoti(true)
          setDataNoti({
            status: STATUS_NOTIFY.SUCCESS,
            content: Translate(languageRedux).record_inserito
          })
          DeviceEventEmitter.emit('doctorathome')
          setTimeout(() => {
            DeviceEventEmitter.emit(Routes.DOCTOR_AT_HOME_SCREEN, { history: true })
          }, 1000)
          NavigationService.navigate(Routes.DOCTOR_AT_HOME_SCREEN)
        }
        if (_.includes([1, '1'], response?.data?.esito)) {
          setDataNoti({
            status: STATUS_NOTIFY.ERROR,
            content: 'Request failed'
          })
        }
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
  }

  return (
   <View style={styles.container}>
      {renderBody()}
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
    backgroundColor: colorFFFFFF,
    marginHorizontal: 20,
    marginBottom: 48,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16
  },
  ctnBox: {
    paddingBottom: 16,
    marginHorizontal: 16
  },
  divider: {
    width: '100%',
    borderWidth: 1,
    borderColor: colorF0F0F0
  },
  speciality: {
    marginHorizontal: 16,
    marginTop: 16
  },
  styleSpeciality: {
    marginTop: 8,
    marginBottom: 16
  },
  ctnTitle: {
    paddingTop: 16
  },
  heightNote: {
    height: 72
  },
  ctnButton: {
    marginTop: 16
  }
})
