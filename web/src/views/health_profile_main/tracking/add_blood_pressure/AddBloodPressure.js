import React, { useState } from 'react'
import {
  StyleSheet, View, DeviceEventEmitter, ScrollView
} from 'react-native'
import Translate from '../../../translate'
import CustomTextInput from '../../../healthProfile/components/CustomTextInput'
import icHeader from '../../../../../assets/images/header'
import imgDoc from '../../../../../assets/images/document'
import Header from '../../../../components/Header'
import { color3777EE, colorA7A8A9, colorFFFFFF } from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import { convertDateDDMMYYYYMMssToSever, convertDateToDDMMMYYYYHHmm } from 'constants/DateHelpers'
import Fonts from '../../../../constants/Fonts'
// import CustomDatePicker from 'components/CustomDatePicker'
import { apiPostPresx } from 'api/DataTracking'
import NotificationView, { STATUS_NOTIFY } from '../../../../components/NotificationView'
// import NavigationService from 'navigation'
import LoadingView from '../../../../components/LoadingView'
// import Routes from 'navigation/Routes'
import _ from 'lodash'

export default function AddBloodPressure() {
  const languageRedux = ''
  const [value, setValue] = useState()
  const [since, setSince] = useState(new Date())
  const datePickerRef = React.createRef()
  const [isShowNoti, setShowNoti] = useState()
  const [dataNoti, setDataNoti] = useState()
  const [isLoading, setLoading] = useState(false)
  const [diastolic, setDiastolic] = useState()
  const [heartrate, setHeartrate] = useState()

  const _onPressSince = () => {
    if (datePickerRef?.current) {
      datePickerRef?.current?.onPressDate()
    }
  }

  const callAPIPost = () => {
    var param = {
      'systolic': `${value}`.replace(',', '.'),
      'diastolic': `${diastolic}`.replace(',', '.'),
      'date': convertDateDDMMYYYYMMssToSever(since),
      'timezoneOffset': (new Date()).getTimezoneOffset()
    }
    if (heartrate) {
      param = {
        ...param,
        'pulseRate': `${heartrate}`.replace(',', '.')
      }
    }
    // setLoading(true)
    // dispatch(apiPostPresx(param)).then(res => {
    //   console.log('apiPostPresx1', res)

    //   setShowNoti(true)
    //   if (!(res?.payload) && res?.type === 'apiPostPresx1') {
    //     setDataNoti({
    //       status: STATUS_NOTIFY.SUCCESS,
    //       content: Translate(languageRedux).record_aggiunto
    //     })
    //     setTimeout(() => {
    //       NavigationService.goBack()
    //     }, 4000)
    //     setTimeout(() => {
    //       DeviceEventEmitter.emit(Routes.LIST_BODY_PRESSURE)
    //     }, 4500)
    //     return
    //   }
    //   if (_.includes([0, '0'], res?.payload?.esito)) {
    //     setDataNoti({
    //       status: STATUS_NOTIFY.SUCCESS,
    //       content: Translate(languageRedux).record_aggiunto
    //     })
    //     setTimeout(() => {
    //       NavigationService.goBack()
    //     }, 4000)
    //     setTimeout(() => {
    //       DeviceEventEmitter.emit(Routes.LIST_BODY_PRESSURE)
    //     }, 4500)
    //     return
    //   }
    //   setLoading(false)
    //   setDataNoti({
    //     status: STATUS_NOTIFY.ERROR,
    //     content: res?.payload?.motivo || ''
    //   })
    // }).catch(() => { setLoading(false) })
  }

  const renderContentInput = () => {
    return (
      <View style={styles.contentInput}>
        <CustomTextInput
          title={Translate(languageRedux).systolicBloodPressure}
          value={value}
          onChangeTxt={(txt) => { setValue(txt) }}
          placeholder={Translate(languageRedux).systolicBloodPressure}
          validate={value ? false : true}
        />
        <CustomTextInput
          title={Translate(languageRedux).diastolicBloodPressure}
          value={diastolic}
          onChangeTxt={(txt) => { setDiastolic(txt) }}
          placeholder={Translate(languageRedux).diastolicBloodPressure}
          validate={diastolic ? false : true}
        />
        <CustomTextInput
          title={Translate(languageRedux).PULSE_RATE}
          value={heartrate}
          onChangeTxt={(txt) => { setHeartrate(txt) }}
          placeholder={Translate(languageRedux).PULSE_RATE}
        />
        <CustomTextInput
          title={Translate(languageRedux).date}
          value={since ? convertDateToDDMMMYYYYHHmm(since) : ''}
          onChangeTxt={() => { }}
          placeholder={Translate(languageRedux).SELECT_A_DATE}
          onPress={_onPressSince}
          iconRight={imgDoc.ic_choose_date}
        />
      </View>
    )
  }

  const _onPressSave = () => {
    if (value && diastolic) {
      callAPIPost()
    }
  }

  const _onChangeDatePicker = (date) => {
    setSince(date)
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).PRESX}
        iconLeft={icHeader.ic_left}
        textRight={Translate(languageRedux).btnsave}
        txtRightStyle={customTxt(Fonts.Medium, 16, value ? color3777EE : colorA7A8A9).txt} //value ? color3777EE :
        onPressRight={_onPressSave}
      />
      <ScrollView>
        {renderContentInput()}
      </ScrollView>
      <CustomDatePicker
        refDatePicker={datePickerRef}
        onChangeDate={_onChangeDatePicker}
        date={since || new Date()}
        mode={'datetime'}
        maxDate={new Date()}
      />
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
  contentInput: {
    marginLeft: 16,
    marginRight: 16
  }
})
