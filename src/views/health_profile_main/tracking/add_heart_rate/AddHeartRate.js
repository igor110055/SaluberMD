
import React, { useState } from 'react'
import {
  StyleSheet, View, DeviceEventEmitter, Keyboard
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Translate from 'translate'
import CustomTextInput from 'views/healthProfile/components/CustomTextInput'
import icHeader from '../../../../../assets/images/header'
import imgDoc from '../../../../../assets/images/document'
import Header from 'components/Header'
import { color3777EE, colorA7A8A9, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import { converlocalToSever000, convertDateDDMMYYYYMMssToSever, convertDateHH, convertDatemm, convertDateToDDMMMYYYYHHmm } from 'constants/DateHelpers'
import Fonts from 'constants/Fonts'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CustomDatePicker from 'components/CustomDatePicker'
import { apiPostHeartRate } from 'api/DataTracking'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
import NavigationService from 'navigation'
import LoadingView from 'components/LoadingView'
import Routes from 'navigation/Routes'
import _ from 'lodash'

export default function AddHeartRate() {
  const languageRedux = useSelector(state => state.user.language)
  const [value, setValue] = useState()
  const [since, setSince] = useState(new Date())
  const datePickerRef = React.createRef()
  const dispatch = useDispatch()
  const [isShowNoti, setShowNoti] = useState()
  const [dataNoti, setDataNoti] = useState()
  const [isLoading, setLoading] = useState(false)

  const _onPressSince = () => {
    if (datePickerRef?.current) {
      datePickerRef?.current?.onPressDate()
    }
  }

  const callAPIPost = () => {
    Keyboard.dismiss()
    if (Number(value) > 39 && Number(value) < 161) {
      const param = {
        'value': `${value}`.replace(',', '.'),
        'date': convertDateDDMMYYYYMMssToSever(converlocalToSever000(since)),
        'hours': convertDateHH(since),
        'minutes': convertDatemm(since),
        'timezoneOffset': (new Date()).getTimezoneOffset()
      }
      setLoading(true)
      dispatch(apiPostHeartRate(param)).then(res => {
        console.log('apiPostHeartRate1', res)

        setShowNoti(true)
        if (!(res?.payload) && res?.type === 'apiPostHeartRate1') {
          setDataNoti({
            status: STATUS_NOTIFY.SUCCESS,
            content: Translate(languageRedux).record_aggiunto
          })
          setTimeout(() => {
            NavigationService.goBack()
          }, 4000)
          setTimeout(() => {
            DeviceEventEmitter.emit(Routes.LIST_HEART_RATE)
          }, 4500)
          return
        }
        if (_.includes([0, '0'], res?.payload?.esito)) {
          setDataNoti({
            status: STATUS_NOTIFY.SUCCESS,
            content: Translate(languageRedux).record_aggiunto
          })
          setTimeout(() => {
            NavigationService.goBack()
          }, 4000)
          setTimeout(() => {
            DeviceEventEmitter.emit(Routes.LIST_HEART_RATE)
          }, 4500)
          return
        }
        setLoading(false)
        setDataNoti({
          status: STATUS_NOTIFY.ERROR,
          content: res?.payload?.motivo || ''
        })
      }).catch(() => { setLoading(false) })
    } else {
      setShowNoti(true)
      setDataNoti({
        status: STATUS_NOTIFY.WARNING,
        content: Translate(languageRedux).OUT_OF_RANGE
      })
    }
  }

  const renderContentInput = () => {
    return (
      <View style={styles.contentInput}>
        <CustomTextInput
          title={Translate(languageRedux).DEVICE_HEART_RATE}
          value={value}
          onChangeTxt={(txt) => { setValue(txt) }}
          placeholder={Translate(languageRedux).DEVICE_HEART_RATE}
          validate={value ? false : true}
          keyboardType={'number-pad'}
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
    if (value) {
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
        textCenter={Translate(languageRedux).DEVICE_HEART_RATE}
        iconLeft={icHeader.ic_left}
        textRight={Translate(languageRedux).btnsave}
        txtRightStyle={customTxt(Fonts.Medium, 16, value ? color3777EE : colorA7A8A9).txt} //value ? color3777EE :
        onPressRight={_onPressSave}
      />
      <KeyboardAwareScrollView>
        {renderContentInput()}
      </KeyboardAwareScrollView>
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
