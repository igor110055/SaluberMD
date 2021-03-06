
import React, { useEffect, useState } from 'react'
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
import { apiPostNewTemp } from 'api/DataTracking'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
import NavigationService from 'navigation'
import LoadingView from 'components/LoadingView'
import Routes from 'navigation/Routes'
import _ from 'lodash'

export default function AddBodyTemperature({route}) {
  const languageRedux = useSelector(state => state.user.language)
  const unit = route?.params?.unit
  const [value, setValue] = useState('')
  const [since, setSince] = useState(new Date())
  const datePickerRef = React.createRef()
  const dispatch = useDispatch()
  const [isShowNoti, setShowNoti] = useState()
  const [dataNoti, setDataNoti] = useState()
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    console.log('unit: ', unit)
    console.log('route?.params: ', route?.params)
  }, [])

  const _onPressSince = () => {
    if (datePickerRef?.current) {
      datePickerRef?.current?.onPressDate()
    }
  }

  const callAPIPost = () => {
    Keyboard.dismiss()
    var newValue = `${value}`.replace(',', '.')
    console.log('newValue: ', newValue)
    // if (unit === 'F') {
    //   newValue = (Number(newValue) - 32) / 1.8000
    //   console.log('newValue F: ', newValue)
    // }
    const param = {
      'value': `${newValue}`,
      'date': since ? convertDateDDMMYYYYMMssToSever(since) : '',
      'coordinate': {
        accuracy: 2099.9990234375,
        latitude: 15.8384901,
        longitude: 108.2801997
      }
    }
    console.log('param: ', param)
    setLoading(true)
    dispatch(apiPostNewTemp(param)).then(res => {
      console.log('apiPostNewTemp', res)

      setShowNoti(true)
      if (!(res?.payload) && res?.type === 'apiPostNewTemp1') {
        setDataNoti({
          status: STATUS_NOTIFY.SUCCESS,
          content: Translate(languageRedux).record_aggiunto
        })
        setTimeout(() => {
          NavigationService.goBack()
        }, 4000)
        setTimeout(() => {
          DeviceEventEmitter.emit(Routes.LIST_BODY_TEMPERATURE)
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
          DeviceEventEmitter.emit(Routes.LIST_BODY_TEMPERATURE)
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


  const checkVal = () => {
    const convertC = (Number(value.replace(',', '.')) - 32) / 1.8000
    if (unit === 'F') {
      if (convertC < 24 && convertC > 50) {
        return true
      } else if (convertC < 25) {
        return true
      }
    } else {
      if (Number(value.replace(',', '.')) < 33) {
        return true
      } else if (Number(value.replace(',', '.')) > 45) {
        return true
      }
    }

    if (_.isEmpty(value)) {
      return true
    }

    return false
  }


  const renderContentInput = () => {
    return (
      <View style={styles.contentInput}>
        <CustomTextInput
          title={Translate(languageRedux).TEMPERATURE}
          value={value}
          onChangeTxt={(txt) => { setValue(txt) }}
          placeholder={Translate(languageRedux).TEMPERATURE + ` ??${unit}`}
          validate={checkVal()}
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
        textCenter={Translate(languageRedux).TEMPERATURE}
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
