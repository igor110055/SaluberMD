import React, {useState} from 'react'
import {View, Platform, StyleSheet, ScrollView, DeviceEventEmitter} from 'react-native'
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
import CustomTimePikerAndroid from 'components/CustomTimePikerAndroid'

export default function AddCalories() {
  const languageRedux = useSelector(state => state.common.language)
  const [calories, setCalories] = useState()
  const [date, setDate] = useState()
  const [hour, setHour] = useState()
  const pickerDate = React.createRef()
  const pickerHour = React.createRef()
  const token = useSelector(state => state.user.token)
  const [isShowNoti, setShowNoti] = useState()
  const [dataNoti, setDataNoti] = useState()
  const [isShowTime, setShowTime] = useState(false)
  const [hourAndroid, setHourAndroid] = useState()

  const getTimeZone = () => {
    var date = new Date()
    var offsetInHours = date.getTimezoneOffset()
    return offsetInHours
  }

  const renderContent = () => {
    return (
      <View>
        <CustomTextInput
          title={Translate(languageRedux).calories}
          value={calories}
          onChangeTxt={(txt) => setCalories(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          validate={calories > 0 ? false : true}
          keyboardType={'phone-pad'}
          textStyle={customTxt(Fonts.Regular, 14, color040404).txt}
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
          value={Platform.OS === 'ios' ? (hour ? convertNumberTime(hour) : '') : (hourAndroid ? convertNumberTime(hourAndroid) : '')}
          onChangeTxt={(txt) => setHour(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          validate={hour ? false : true}
          iconRight={icDoc.ic_choose_date}
          textStyle={customTxt(Fonts.Regular, 14, color040404).txt}
          onPress={Platform.OS === 'ios' ? _onPressHourIos : _onPressHourAndroid}
        />
      </View>
    )
  }

  const _onPressHourIos = () => [
    pickerHour.current.onPressDate()
  ]

  const _onPressHourAndroid = () => [
    setShowTime(true)
  ]

  const renderButtonAdd = () => {
    return (
      <View style={styles.marginT16}>
        <Button
          text={Translate(languageRedux).add_new}
          backgroundColor={calories > 0 && date && (Platform.OS === 'ios' ? hour : hourAndroid) ? color3777EE : colorF0F0F0}
          textColor={calories > 0 && date && (Platform.OS === 'ios' ? hour : hourAndroid) ? colorFFFFFF : colorC1C3C5}
          disabled={calories > 0 && date && (Platform.OS === 'ios' ? hour : hourAndroid) ? false : true}
          onPress={_onPressAdd}
        />
      </View>
    )
  }

  const hourLocal = moment(date).local().format('H')
  const minutesLocal = moment(date).local().format('m')

  const _onPressAdd = () => {
    const body = {
      value: calories,
      data: convertToUTC(date),
      hour: convertToUTC(Platform.OS === 'ios' ? hour : hourAndroid),
      hours: hourLocal,
      minutes: minutesLocal,
      timezoneOffset: getTimeZone()
    }
    console.log('BODY: ', body)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/wellness/addCalories`,
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
          DeviceEventEmitter.emit('calories')
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

  const _onChangeHourAndroid = (event, selectedDate) => {
    const currentDate = selectedDate || hourAndroid
    setHourAndroid(currentDate)
    setShowTime(false)
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
      {Platform.OS === 'ios' && (
        <CustomDatePicker
          refDatePicker={pickerHour}
          onChangeDate={_onChangeHour}
          maxDate={new Date()}
          mode={'time'}
        />
      )}
      {isShowTime && Platform.OS === 'android' && (
        <CustomTimePikerAndroid
          value={hourAndroid || new Date()}
          onChange={_onChangeHourAndroid}
        />
      )}
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
