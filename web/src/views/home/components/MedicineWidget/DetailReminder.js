import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, DeviceEventEmitter} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import axios from 'axios'
// import * as APIs from '../../../../api/APIs'
import moment from 'moment'

import {color363636, color3777EE, color5C5D5E, colorF0F0F0, colorF8F8F8, colorFFFFFF, colorE53E3E} from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
// import { apiGetReminderReasons } from 'api/Reminder'
import { converLocalToSever, convertToSkip } from '../../../../constants/DateHelpers'

import icHeader from '../../../../../assets/images/header'
import icReminder from '../../../../../assets/images/reminder'

import Header from 'components/Header'
import SearchListWithName from 'components/SearchListWithName'
import CustomDatePicker from 'components/CustomDatePicker'
import ScheduleView from '../../../reminders/components/ScheduleView'
import ConfirmView from '../../../reminders/components/ConfirmView'
import Translate from '../../../../translate'

export default function DetailReminder({ route }) {
  const languageRedux = 'en_US'//useSelector(state => state.common.language)
  const passingData = route?.params?.data
  const [isConfirm, setShowConfirm] = useState(false)
  const [isShowReason, setShowReason] = useState(false)
  const [isSkip, setSkip] = useState(false)
  const [since, setSince] = useState(new Date())
  const [lsReason, setLsReason] = useState([])
  const dispatch = useDispatch()
  const token = ''//useSelector(state => state.user.token)
  const [reasonID, setReasonID] = useState()
  const datePickerRef = React.createRef()
  const datePickerConfirmRef = React.createRef()
  const [isReject, setReject] = useState(false)

  useEffect(() => {
    callAPILsReasons()
  }, [])

  useEffect(() => {
    isReject && onPressReject()
  }, [isReject])

  const callAPILsReasons = () => {
    // dispatch(apiGetReminderReasons()).then(res => {
    //   const getLs = res?.payload?.data || []
    //   setLsReason(getLs)
    // }).catch(() => { })
  }

  const renderBoxTakenAction = () => {
    return (
      <View style={styles.shadow}>
        <View style={styles.ctnTime}>
          <Image source={icReminder.ic_clock_white} style={styles.iconStyle} />
          <Text style={[customTxt(Fonts.Bold, 18, colorFFFFFF).txt, styles.marginL8]}>
            {passingData?.time}
          </Text>
        </View>
        <View style={styles.ctnNameDrug}>
          <Image source={icReminder.ic_medical} style={styles.imgMedical} />
          <View style={styles.flex1}>
            <Text style={customTxt(Fonts.Bold, 14, color363636).txt}>
              {passingData?.drugName}
            </Text>
            <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginT4]}>
              {passingData?.dosage}
            </Text>
          </View>
        </View>
        <View style={styles.medicalView}>
          <TouchableOpacity
            onPress={() => {
              setShowConfirm(true)
            }}
            style={styles.btStyle}
          >
            <Image source={icReminder.ic_tick} style={styles.imgIcon} />
            <Text style={customTxt(Fonts.Bold, 14, color3777EE).txt}>{Translate(languageRedux).DONE_BTN}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btStyle}
            onPress={() => {
              setSkip(true)
            }}
          >
            <Image source={icReminder.ic_reload} style={styles.imgIcon} />
            <Text style={customTxt(Fonts.Bold, 14, color5C5D5E).txt}>{Translate(languageRedux).skip_step}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowReason(true)
            }}
            style={styles.btStyle}
          >
            {/* <Image source={icReminder.ic_close_blue} style={styles.imgIcon} /> */}
            {/* <Icon name={'close'} size={19} color={colorE53E3E} /> */}
            <Text style={customTxt(Fonts.Bold, 14, colorE53E3E).txt}>{Translate(languageRedux).MISSED_BT}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const onPressReject = () => {
    const body = {
        reminderId: passingData?.id,
        idMed: passingData?.idDetail,
        reminderDetailId: passingData?.idDetail,
        reasonId: reasonID
    }
    console.log('BODY: ', body)
    // axios({
    //     method: 'post',
    //     url: `${APIs.hostAPI}backoffice/pillsreminder/rejectMedicine`,
    //     headers: {
    //       'x-auth-token': token
    //     },
    //     data: body
    // })
    // .then(response => {
    //     console.log('data: ', response.data)
    // })
    // .catch(error => {
    //     console.error('There was an error!', error)
    // })
    // DeviceEventEmitter.emit('reminder')
    // NavigationService.goBack()
  }

  const _onPressDone = () => {
    const dateLocal = moment(since).local().format('YYYY-MM-DDTHH:mm:ss.sss')
    const UTCDate = moment(dateLocal).utc().valueOf()
    const body = {
      reminderId: passingData?.id,
      reminderDetailId: passingData?.idDetail,
      timeTaken: UTCDate
    }
    console.log('BODY: ', body)
    // axios({
    //     method: 'post',
    //     url: `${APIs.hostAPI}backoffice/pillsreminder/markAsTakenReminder`,
    //     headers: {
    //       'x-auth-token': token
    //     },
    //     data: body
    // })
    // .then(response => {
    //     console.log('data: ', response.data)
    // })
    // .catch(error => {
    //     console.error('There was an error!', error)
    // })
    DeviceEventEmitter.emit('reminder')
    // NavigationService.goBack()
  }

  const _onPressSkip = () => {
    const body = {
      dosage: passingData?.dosage,
      reminderId: passingData?.id,
      idMed: passingData?.idDetail,
      drugName: passingData?.drugName,
      type: passingData?.type,
      tc: convertToSkip(since),
      postpone: 1,
      timeZone: -420,
      posdate: converLocalToSever(since),
      reminderDetailId: passingData?.idDetail
    }
    console.log('BODY: ', body)
    // axios({
    //     method: 'put',
    //     url: `${APIs.hostAPI}backoffice/pillsreminder/reminderNotification/`,
    //     headers: {
    //       'x-auth-token': token
    //     },
    //     data: body
    // })
    // .then(response => {
    //     console.log('data: ', response.data)
    // })
    // .catch(error => {
    //     console.error('There was an error!', error)
    // })
    DeviceEventEmitter.emit('reminder')
    // NavigationService.goBack()
  }

  const renderBody = () => {
    return (
      <View style={styles.paddingB48}>
        {renderBoxTakenAction()}
      </View>
    )
  }

  const _onChangeDatePicker = (date) => {
    setSince(date)
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).pa}
        iconLeft={icHeader.ic_left}
        onPressLeft={() => {
          // NavigationService.goBack()
        }}
      />
      <ScrollView>{renderBody()}</ScrollView>
      {isConfirm && (
        <ConfirmView
          setShow={val => setShowConfirm(val)}
          since={since}
          onPressSince={() => {datePickerRef.current.onPressDate()}}
          onPressUpdate={_onPressDone}
        />
      )}
      <CustomDatePicker
        refDatePicker={datePickerRef}
        onChangeDate={_onChangeDatePicker}
        date={since || new Date()}
        mode={'time'}
        minDate={new Date()}
      />
      {isSkip && (
        <ScheduleView
          setShow={val => setSkip(val)}
          since={since}
          onPressSince={() => {datePickerConfirmRef.current.onPressDate()}}
          onPressUpdate={_onPressSkip}
        />
      )}
      <CustomDatePicker
        refDatePicker={datePickerConfirmRef}
        onChangeDate={_onChangeDatePicker}
        date={since || new Date()}
        mode={'datetime'}
      />
      {
        isShowReason && (
          <SearchListWithName
            listData={lsReason}
            title={Translate(languageRedux).REASON_FOR_NOT_TAKING_THE_MEDICINE}
            onItemClick={(val) => {
              setReasonID(val?.id)
              setReject(true)
              // reasonID && onPressReject()
            }}
            onPressRight={() => {
              setShowReason(false)
            }}
          />
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  paddingB48: {
    paddingBottom: 48,
    marginHorizontal: 20,
    marginTop: 20
  },
  ctnTime: {
    backgroundColor: color3777EE,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingLeft: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  iconStyle: {
    height: 20,
    width: 20
  },
  marginL8: {
    marginLeft: 8
  },
  marginT4: {
    marginTop: 4
  },
  ctnNameDrug: {
    flexDirection: 'row',
    backgroundColor: colorFFFFFF,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colorF0F0F0
  },
  imgMedical: {
    width: 40,
    height: 40,
    marginRight: 16
  },
  flex1: {
    flex: 1
  },
  medicalView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colorFFFFFF,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16
  },
  btStyle: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imgIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginBottom: 4
  },
  shadow: {
    shadowColor: color3777EE,
    shadowOffset: {
      width: 0,
      height: 20
    },
    shadowOpacity: 0.08,
    shadowRadius: 40,
    elevation: 9
  }
})
