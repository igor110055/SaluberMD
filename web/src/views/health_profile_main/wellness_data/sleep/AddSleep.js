import React, {useState} from 'react'
import {View, Text, StyleSheet, ScrollView, DeviceEventEmitter} from 'react-native'
import {useSelector} from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'
import moment from 'moment'
import _ from 'lodash'

import {color040404, color3777EE, colorC1C3C5, colorF0F0F0, colorFFFFFF} from 'constants/colors'
import Translate from 'translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import { convertDMMMYYYY, convertNumberTime, convertToUTC } from 'constants/DateHelpers'
import NavigationService from 'navigation'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'

import icHeader from '../../../../../assets/images/header'
import icDoc from '../../../../../assets/images/document'

import Header from 'components/Header'
import CustomTextInput from '../../../healthProfile/components/CustomTextInput'
import CustomDatePicker from 'components/CustomDatePicker'
import Button from 'components/Button'

export default function AddSleep() {
  const languageRedux = useSelector(state => state.common.language)
  const [total, setTotal] = useState()
  const [deep, setDeep] = useState()
  const [light, setLight] = useState()
  const [date, setDate] = useState()
  const [hour, setHour] = useState()
  const pickerDate = React.createRef()
  const pickerHour = React.createRef()
  const token = useSelector(state => state.user.token)
  const [isShowNoti, setShowNoti] = useState()
  const [dataNoti, setDataNoti] = useState()

  const renderContent = () => {
    return (
      <View>
        <CustomTextInput
          title={Translate(languageRedux).SLEEP}
          value={total}
          onChangeTxt={(txt) => setTotal(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          validate={total > 0 ? false : true}
          keyboardType={'phone-pad'}
          textStyle={customTxt(Fonts.Regular, 14, color040404).txt}
          placeholder={Translate(languageRedux).TOTAL_SLEEP_TIME}
        />
        <CustomTextInput
          title={Translate(languageRedux).DEEP_SLEEP_TIME}
          value={deep}
          onChangeTxt={(txt) => setDeep(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          validate={deep > 0 ? false : true}
          keyboardType={'phone-pad'}
          textStyle={customTxt(Fonts.Regular, 14, color040404).txt}
          placeholder={Translate(languageRedux).DEEP_SLEEP_TIME}
        />
        <CustomTextInput
          title={Translate(languageRedux).LIGHT_SLEEP_TIME}
          value={light}
          onChangeTxt={(txt) => setLight(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          validate={light > 0 ? false : true}
          keyboardType={'phone-pad'}
          textStyle={customTxt(Fonts.Regular, 14, color040404).txt}
          placeholder={Translate(languageRedux).LIGHT_SLEEP_TIME}
        />
        <CustomTextInput
          title={Translate(languageRedux).date}
          value={date ? convertDMMMYYYY(date) : ''}
          onChangeTxt={(txt) => setDate(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          validate={date ? false : true}
          iconRight={icDoc.ic_choose_date}
          textStyle={customTxt(Fonts.Regular, 14, color040404).txt}
          onPress={() => { pickerDate.current.onPressDate() }}
        />
        <CustomTextInput
          title={Translate(languageRedux).hour}
          value={hour ? convertNumberTime(hour) : ''}
          onChangeTxt={(txt) => setHour(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          validate={hour ? false : true}
          iconRight={icDoc.ic_choose_date}
          textStyle={customTxt(Fonts.Regular, 14, color040404).txt}
          onPress={() => { pickerHour.current.onPressDate() }}
        />
      </View>
    )
  }

  const checkDisable = () => {
    if ((total > 0) && (deep > 0) && (light > 0) && date && hour) {
      return true
    }
    else {
      return false
    }
  }

  const renderButtonAdd = () => {
    return (
      <View style={styles.marginT16}>
        <Button
          text={Translate(languageRedux).add_new}
          backgroundColor={checkDisable() ? color3777EE : colorF0F0F0}
          textColor={checkDisable() ? colorFFFFFF : colorC1C3C5}
          disabled={!checkDisable()}
          onPress={_onPressAdd}
        />
      </View>
    )
  }

  const _onPressAdd = () => {
    const hourLocal = moment(hour).local().format('H')
    const minutesLocal = moment(hour).local().format('m')
    const body = {
      value1: total,
      value2: deep,
      value3: light,
      data: convertToUTC(date),
      hours: hourLocal,
      minutes: minutesLocal,
      timezoneOffset: -420
    }
    console.log('BODY: ', body)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/wellness/addSleep`,
      headers: {
        'x-auth-token': token
      },
      data: body
    })
      .then(response => {
        console.log('data: ', response.data)
        setShowNoti(true)
        if (_.includes([0, '0'], response?.data?.esito)) {
          setDataNoti({
            status: STATUS_NOTIFY.SUCCESS,
            content: Translate(languageRedux).record_aggiunto
          })
        }
        if (_.includes([1, '1'], response?.data?.esito)) {
          setDataNoti({
            status: STATUS_NOTIFY.ERROR,
            content: 'Add record failed'
          })
        }
        setTimeout(() => {
          DeviceEventEmitter.emit('sleep')
          NavigationService.goBack()
        }, 500)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        {renderContent()}
        {renderButtonAdd()}
      </View>
    )
  }

  const _onChangeDate = (date) => {
    setDate(date)
  }

  const _onChangeHour = (date) => {
    setHour(date)
  }

  return (
    <View style={styles.container}>
      <Header
        textCenter={Translate(languageRedux).calories}
        textCenterColor={color040404}
        iconLeft={icHeader.ic_left}
      />
      <ScrollView>{renderBody()}</ScrollView>
      <CustomDatePicker
        refDatePicker={pickerDate}
        onChangeDate={_onChangeDate}
        maxDate={new Date()}
      />
      <CustomDatePicker
        refDatePicker={pickerHour}
        onChangeDate={_onChangeHour}
        maxDate={new Date()}
        mode={'time'}
      />
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
  marginT16: {
    marginTop: 16
  }
})
