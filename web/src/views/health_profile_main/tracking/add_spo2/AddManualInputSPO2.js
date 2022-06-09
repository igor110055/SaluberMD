
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
import { convertDateDDMMYYYYMMssToSever, convertDateToDDMMMYYYYHHmm } from 'constants/DateHelpers'
import Fonts from 'constants/Fonts'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CustomDatePicker from 'components/CustomDatePicker'
import { apiPostSpo2Values } from 'api/DataTracking'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
import NavigationService from 'navigation'
import LoadingView from 'components/LoadingView'
import Routes from 'navigation/Routes'
import _ from 'lodash'

export default function AddManualInputSPO2() {
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
    const param = {
      'value': `${value}`.replace(',', '.'),
      'date': since ? convertDateDDMMYYYYMMssToSever(since) : '',
      'coordinate': {
        accuracy: 2099.9990234375,
        latitude: 15.8384901,
        longitude: 108.2801997
      }
    }
    setLoading(true)
    dispatch(apiPostSpo2Values(param)).then(res => {
      console.log('apiPostSpo2Values', res)

      setShowNoti(true)
      if (!(res?.payload) && res?.type === 'apiPostSpo2Values1') {
        setDataNoti({
          status: STATUS_NOTIFY.SUCCESS,
          content: Translate(languageRedux).record_aggiunto
        })
        setTimeout(() => {
          NavigationService.goBack()
        }, 4000)
        setTimeout(() => {
          DeviceEventEmitter.emit(Routes.LIST_SPO2_SCREEN)
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
          DeviceEventEmitter.emit(Routes.LIST_SPO2_SCREEN)
        }, 4500)
        return
      }
      setLoading(false)
      setDataNoti({
        status: STATUS_NOTIFY.ERROR,
        content: res?.payload?.motivo || ''
      })
    }).catch(() => { setLoading(false) })
  }

  const renderContentInput = () => {
    return (
      <View style={styles.contentInput}>
        <CustomTextInput
          title={Translate(languageRedux).DEVICE_SPO2 + ' %'}
          value={value}
          onChangeTxt={(txt) => { setValue(txt) }}
          placeholder={Translate(languageRedux).DEVICE_SPO2 + ' %'}
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
        textCenter={Translate(languageRedux).DEVICE_SPO2}
        iconLeft={icHeader.ic_left}
        textRight={Translate(languageRedux).btnsave}
        txtRightStyle={customTxt(Fonts.Medium, 16, value ? color3777EE : colorA7A8A9).txt}
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
