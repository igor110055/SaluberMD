
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
import { convertDateDDMMYYYYMMssToSever, convertDateHH, convertDatemm, convertDateToDDMMMYYYYHHmm } from 'constants/DateHelpers'
import Fonts from 'constants/Fonts'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CustomDatePicker from 'components/CustomDatePicker'
import { apiPostWeight } from 'api/DataTracking'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
import NavigationService from 'navigation'
import LoadingView from 'components/LoadingView'
import Routes from 'navigation/Routes'
import _ from 'lodash'

export default function AddManualInputWeight() {
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
      'weight': `${value}`.replace(',', '.'),
      'date': convertDateDDMMYYYYMMssToSever(since),
      'hour': convertDateDDMMYYYYMMssToSever(since),
      'hours': convertDateHH(since),
      'minutes': convertDatemm(since),
      'timezoneOffset': (new Date()).getTimezoneOffset()
    }
    setLoading(true)
    dispatch(apiPostWeight(param)).then(res => {
      console.log('apiPostWeight', res)

      setShowNoti(true)
      if (!(res?.payload) && res?.type === 'apiPostWeight1') {
        setDataNoti({
          status: STATUS_NOTIFY.SUCCESS,
          content: Translate(languageRedux).record_aggiunto
        })
        setTimeout(() => {
          NavigationService.goBack()
        }, 4000)
        setTimeout(() => {
          DeviceEventEmitter.emit(Routes.LIST_WEIGHT)
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
          DeviceEventEmitter.emit(Routes.LIST_WEIGHT)
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
          title={Translate(languageRedux).SCALX}
          value={value}
          onChangeTxt={(txt) => { setValue(txt) }}
          placeholder={Translate(languageRedux).SCALX}
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
        textCenter={Translate(languageRedux).SCALX}
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
