import React, {useEffect, useState} from 'react'
import {View, StyleSheet, ScrollView, Platform, RefreshControl, StatusBar, DeviceEventEmitter} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import DeviceInfo from 'react-native-device-info'
import { STORAGE_KEY } from 'constants/define'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import * as APIs from '../../../api/APIs'
import moment from 'moment'
import _ from 'lodash'

import {color0B40B1, colorF8F8F8, colorFFFFFF} from 'constants/colors'
import NavigationService from 'navigation'
import { apiGetSummary, apiGetUserInfo } from 'api/Auth'
import { saveSummary, saveUserinfo } from 'actions/user'
import { apiRegisterPush } from 'api/VideoCall'
import { apiSwitchOnlineStatus, apiGetOnlineStatus } from './apis'
import Routes from 'navigation/Routes'
import { convertDMMMYYYY, convertYYYYMMDD, convertNumberTime, convertToUTC } from 'constants/DateHelpers'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
import Translate from 'translate'

import icHeader from '../../../../assets/images/header'

import Header from 'components/Header'
import ButtonOnOff from './button_on_off'
import RecentVisits from './recent_visits'
import ScheduledAppointment from './scheduled_appointment'
import TodayActivities from './today_activities'
import LoadingView from 'components/LoadingView'
import AppointmentRequest from './appointment_request'
import HereSomeTips from './HereSomeTips'
import TodaySlot from '../agenda/appointments/accpect_request_appointment/TodaySlot'
import AddAvailabilityView from '../agenda/availability/AddAvailabilityView'
import SearchListWithName from 'components/SearchListWithName'
import CustomDatePicker from 'components/CustomDatePicker'
import { apiCountNotification } from 'api/Notification'
import { saveCountNoti } from 'actions/common'

export default function HomeViewDoctor() {
  const languageRedux = useSelector(state => state.common.language)
  const dispatch = useDispatch()
  const [udid, setUdid] = useState()
  const [isOnline, setOnline] = useState(false)
  const [imgAvt, setImgAvt] = useState()
  const [userInfo, setUserInfo] = useState()
  const [listHistory, setListHistory] = useState([])
  const token = useSelector(state => state.user.token)
  const [listAppointment, setListAppointment] = useState()
  const [listAvailability, setListAvailability] = useState()
  const [listAvailTodayAM, setListAvailTodayAM] = useState()
  const [listAvailTodayPM, setListAvailTodayPM] = useState()
  const [listAppointmentAM, setListAppointmentAM] = useState()
  const [listAppointmentPM, setListAppointmentPM] = useState()
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)
  const [isLoading, setLoading] = useState(true)
  const [listAppointmentRequest, setListAppointmentRequest] = useState()
  const [isShowTip, setShowTip] = useState(false)
  const [isPopupRequest, setPopupRequest] = useState(false)
  const [isShow, setShow] = useState(false)
  const [routeViewRequest, setRouteViewRequest] = useState(false)
  const [duration, setDuration] = useState()
  const [selectedDuration, setSelectedDuration] = useState()
  const [isDropDuration, setDropDuration] = useState(false)
  const datePickerRef = React.createRef()
  const dateTimePickerRef = React.createRef()
  const [dataRequest, setDataRequest] = useState()
  const [startDate, setStartDate] = useState(new Date())
  const [startTime, setStartTime] = useState()
  const [endDate, setEndDate] = useState(new Date())
  const [endTime, setEndTime] = useState()
  const [isTabsTime, setTabsTime] = useState(0)
  const [dateAdd, setDateAdd] = useState(new Date())
  const [reload, setReload] = useState(1)
  const [isShowNoti, setShowNoti] = useState(false)
  const [dataNoti, setDataNoti] = useState()
  const countNotiRedux = useSelector(state => state.common.countNoti)
  const [reloadHistory, setReloadHistory] = useState(1)

  const TYPE_DATE = {
    START_DATE: 'START_DATE',
    END_DATE: 'END_DATE',
    ADD_DATE: 'ADD_DATE',
    SELECTED_DATE: 'SELECTED_DATE'
  }
  const [typeDate, setTypeDate] = useState()

  useEffect(() => {
    if (userInfo?.userImage) {
      var base64 = `data:image/png;base64,${userInfo?.userImage}`
      setImgAvt({uri: base64})
    }
  }, [userInfo])

  useEffect(() => {
    callAPIUserinfo()
    callAPIRegisterDevice()
    callAPIListAvailability()
    callAPIGetSummary()
    callAPIGetDuration()
  }, [refreshing])

  useEffect(() => {
    callAPIListHistory()
  }, [refreshing, reloadHistory])

  useEffect(() => {
    callAPIListAppointment()
    callAPIListRequestAppointment()
    callAPICountNoti()
  }, [refreshing, reload])

  useEffect(() => {
    getListAvailabilityToday()
  }, [listAvailability, refreshing])

  useEffect(() => {
    callAPIGetStatus()
  }, [udid])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('reloadAppointment', () => {
      setReload(Math.random())
    })
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('reloadHistory', () => {
      setReloadHistory(Math.random())
    })
    return () => subscription.remove()
  }, [])


  const callAPIRegisterDevice = async () => {
    const udidv4 = await DeviceInfo.getUniqueId()
    setUdid(udidv4)
    const getDeviceToken = await AsyncStorage.getItem(STORAGE_KEY.DEVICE_TOKEN)
    const param = {
      'deviceUUID': udidv4,
      'platform': Platform.OS === 'ios' ? 'ios' : 'pushy',
      'token': getDeviceToken
    }
    if (getDeviceToken) {
      console.log('param apiRegisterPush: ', param)
      dispatch(apiRegisterPush(param)).then(res => {
        console.log('apiRegisterPush success', res)
      }).catch(() => {

      })
    }
  }

  const callAPIUserinfo = () => {
    dispatch(apiGetUserInfo()).then(res => {
      console.log('userInfo: ', res?.payload)
      const getuserInfo = res?.payload?.user
      if (getuserInfo) {
        Promise.all([
          dispatch(saveUserinfo(getuserInfo))
        ])
        setUserInfo(getuserInfo)
      }
      // setRefresh(false)
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    }).catch((err) => {
      console.log('err: ', err)
      setLoading(false)
    })
  }

  const callAPIGetStatus = async () => {
    console.log('callAPIGetStatus udidv4', udid)
    if (udid) {
      dispatch(apiGetOnlineStatus(udid)).then(res => {
        console.log('apiGetOnlineStatus ', res?.payload)
        setOnline(res?.payload?.isonline)
      }).catch(() => {

      })
    }
  }
  const _onPressSwitch = () => {
    if (!udid) {return}
    dispatch(apiSwitchOnlineStatus(udid)).then(res => {
      console.log('apiSwitchOnlineStatus udidv4', res?.payload)
      setOnline(res?.payload?.isOnline)
    }).catch(() => {

    })
  }

  const callAPIListHistory = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/webdoctor/getPatientVisitHistoryApp/0`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        console.log('dataRecetnVisit: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.visits || []
          setListHistory(getList)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const callAPIListAppointment = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/getDoctorAppointment/-420`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getPro = response.data.slot || []
          convertDataAppointment(getPro)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const convertDataAppointment = (dataAppointment) => {
    if ((dataAppointment || []).length > 0) {
      var data = []
      for (var i = 0; i < (dataAppointment || []).length; i++) {
        var item = {}
        item.user = dataAppointment[i]?.user
        item.startsAt = dataAppointment[i]?.startsAt
        item.endsAt = dataAppointment[i]?.endsAt
        item.idSlot = dataAppointment[i]?.id
        item.subject = dataAppointment[i]?.subject
        item.reason = dataAppointment[i]?.reason
        item.childName = dataAppointment[i]?.childName
        item.specializationName = dataAppointment[i]?.specializationName
        item.lastDataTracking = JSON.parse(dataAppointment[i]?.user?.lastData)
        data.push(item)
      }
      const sortByDate = ((a, b) => {
        return a.startsAt - b.startsAt
      })
      const sortData = data.sort(sortByDate)
      setListAppointment(sortData)
    }
  }

  const callAPIListAvailability = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/appointment?action=search`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        console.log('dataAvailability: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getPro = response.data.slot || []
          const sortByDate = ((a, b) => {
            return b.startsAt - a.startsAt
          })
          const sortData = getPro.sort(sortByDate)
          setListAvailability(sortData)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const callAPIListRequestAppointment = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/getAllBySpecId`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        console.log('dataRequest: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.requests || []
          convertDataRequestAppointment(getList)
        }
      })
      .catch((error) => {
        console.log('errDataRequest: ', error)
      })
  }

  const callAPICountNoti = () => {
    dispatch(apiCountNotification()).then(res => {
      console.log('apiCountNotification:', res)
      const countNotification = res?.payload?.total || null
      Promise.all([
        dispatch(saveCountNoti(countNotification))
      ])
    })
  }

  const convertDataRequestAppointment = (dataAppointment) => {
    if ((dataAppointment || []).length > 0) {
      var data = []
      for (var i = 0; i < (dataAppointment || []).length; i++) {
        var item = {}
        item.requestId = dataAppointment[i]?.requestId
        item.daySliceId = dataAppointment[i]?.daySliceId
        item.slices = dataAppointment[i]?.slices
        item.date = dataAppointment[i]?.date
        item.patientName = dataAppointment[i]?.patientName
        item.patientId = dataAppointment[i]?.patientId
        item.doctorTimeSlotId = dataAppointment[i]?.doctorTimeSlotId
        item.specializationId = dataAppointment[i]?.specializationId
        item.lastDataTracking = JSON.parse(dataAppointment[i]?.lastData)
        item.patientBirthdate = dataAppointment[i]?.patientBirthdate
        data.push(item)
      }
      filterRequestPending(data)
    }
  }

  const filterRequestPending = (dataRequestAppointment) => {
    if ((dataRequestAppointment || []).length > 0) {
      const listFilter = dataRequestAppointment.filter((val) => val?.doctorTimeSlotId === null)
      console.log('listFilter: ', listFilter)
      setListAppointmentRequest(listFilter)
    }
  }

  const callAPIGetSummary = () => {
    dispatch(apiGetSummary()).then(res => {
      console.log('apiGetSummary: ', res?.payload)
      const data = (res?.payload?.dettagli || []).length > 0 ? res?.payload?.dettagli[0] : null
      if (data) {
        Promise.all([
          dispatch(saveSummary(data))
        ])
      }
    })
  }

  const getListAvailabilityToday = () => {
    var today = convertDMMMYYYY()
    if ((listAvailability || []).length > 0) {
      var listToday = listAvailability.filter((val) => convertDMMMYYYY(val?.startsAt) === today)
      if ((listToday || []).length > 0) {
        var listTodayAM = listToday.filter((val) => Number(moment(val?.startsAt).format('H') <= 12))
        setListAvailTodayAM(listTodayAM)
        if ((listTodayAM || []).length > 0) {
          var appointmentAM = listTodayAM.filter((val) => val?.patientId !== 0)
          setListAppointmentAM(appointmentAM)
        }
      }
      if ((listToday || []).length > 0) {
        var listTodayPM = listToday.filter((val) => Number(moment(val?.startsAt).format('H') > 12))
        setListAvailTodayPM(listTodayPM)
        if ((listTodayPM || []).length > 0) {
          var appointmentPM = listTodayPM.filter((val) => val?.patientId !== 0)
          setListAppointmentPM(appointmentPM)
        }
      }
    }
  }

  const callAPIGetDuration = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/app/getSlotDuration`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    }).then(res => {
      if ((res?.data?.durations || []).length > 0) {
        console.log('apiGetSlotDuration: ', res?.data?.durations)
        setDuration(res?.data?.durations)
        setSelectedDuration(res?.data?.durations[0])
      } else {
        setDataNoti({
          status: STATUS_NOTIFY.ERROR,
          content: res?.data?.motivo || 'error'
        })
        setTimeout(() => {
          setShowNoti(true)
        }, 500)
      }
    }).catch(() => { })
  }

  const callAPIBook = () => {
    setLoading(true)
    var endTimeSlice = moment(startTime).add(Number(selectedDuration?.value), 'minutes').format('HH:mm')
    const startsTime = `${convertYYYYMMDD(dataRequest?.date)}T${convertNumberTime(startTime)}:00`
    const endsTime = `${convertYYYYMMDD(dataRequest?.date)}T${endTimeSlice}:00`
    const body = {
      startDate: convertToUTC(startsTime) || '',
      endDate: convertToUTC(endsTime) || '',
      timeSlot: selectedDuration?.id || '',
      patientId: dataRequest?.patientId || '',
      id: dataRequest?.requestId || '',
      // slotId: item?.id || '',
      daySliceId: dataRequest?.daySliceId || '',
      tz: -7,
      specializationId: dataRequest?.specializationId
    }
    console.log('bodyBook: ', body)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/bookRequestSlot`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      },
      data: body
    })
      .then(response => {
        setLoading(false)
        setShow(false)
        setDateAdd(new Date())
        setStartTime()
        setEndTime()
        console.log('data: ', response.data)
        setShowNoti(true)
        if (_.includes([0, '0'], response?.data?.esito)) {
          setDataNoti({
            status: STATUS_NOTIFY.SUCCESS,
            content: response?.data?.motivo
          })
          setReload(Math.random())
          setPopupRequest(false)
        }
        if (_.includes([1, '1'], response?.data?.esito)) {
          setDataNoti({
            status: STATUS_NOTIFY.ERROR,
            content: response?.data?.motivo
          })
          setPopupRequest(false)
        }
      })
      .catch(error => {
        setLoading(false)
        console.error('There was an error!', error)
      })
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        <ButtonOnOff
          isOnline={isOnline}
          onPressSwitch={_onPressSwitch}
          base64Avt={imgAvt}
          firstName={userInfo?.nome || ''}
          lastName={userInfo?.cognome || ''}
        />
        <RecentVisits
          data={(listHistory || []).slice(0, 5)}
          onPressHereSomeTips={() => {setShowTip(true)}}
        />
        <ScheduledAppointment
          data={(listAppointment || []).slice(0, 5)}
        />
        <AppointmentRequest
          data={(listAppointmentRequest || []).slice(0, 5)}
          onPressRequestAppointment={() => {
            setPopupRequest(true)
          }}
          setValueItemRequest={setDataRequest}
        />
        <TodayActivities
          listTodayAM={listAvailTodayAM}
          listTodayPM={listAvailTodayPM}
          listAppointmentAM={listAppointmentAM}
          listAppointmentPM={listAppointmentPM}
        />
      </View>
    )
  }

  const _onRefresh = () => {
    setRefresh(true)
    setToggleReload(Math.random())
    setTimeout(() => {
      setRefresh(false)
    }, 3000)
  }

  const _onPressNotificaion = () => {
    return NavigationService.navigate(Routes.NOTIFICATION_DOCTOR_SCREEN)
  }

  const resetData = () => {
    setDateAdd(new Date())
    setStartDate(new Date())
    setEndDate(new Date())
    setStartTime()
    setEndTime()
  }

  const _onChangeDatePicker = (date) => {
    switch (typeDate) {
      case TYPE_DATE.ADD_DATE:
        return setDateAdd(date)
      case TYPE_DATE.START_DATE:
        return setStartDate(date)
      case TYPE_DATE.END_DATE:
        return setEndDate(date)
      default:
        return
    }
  }

  const _getValueDatePicker = () => {
    switch (typeDate) {
      case TYPE_DATE.ADD_DATE:
        return dateAdd
      case TYPE_DATE.START_DATE:
        return startDate
      case TYPE_DATE.END_DATE:
        return endDate
      default:
        return
    }
  }

  const _onChangeTimePicker = (date) => {
    if (isTabsTime === 0) {
      return setStartTime(date)
    }
    setEndTime(date)
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white" />
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_menudrawer}
        iconRight={icHeader.ic_noti}
        onPressLeft={() => NavigationService.openDrawer()}
        onPressRight={_onPressNotificaion}
        notiRight={countNotiRedux}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={_onRefresh}
            tintColor={color0B40B1}
          />
        }
      >
        {renderBody()}
      </ScrollView>
      {isLoading && <LoadingView/>}
      {isShowTip && <View style={styles.floatView}>
        <HereSomeTips
          onPressCancel={() => {setShowTip(false)}}
        />
      </View>}
      {
        isPopupRequest &&
          <TodaySlot
            onPressClose={() => { setPopupRequest(false) }}
            dataPassing={dataRequest}
            onPressAddNewAvailability={() => { setShow(true) }}
            setRoute={setRouteViewRequest}
          />
      }
      {
        isShow && (
          <AddAvailabilityView
            onPressClose={() => {
              setShow(false)
              setRouteViewRequest(false)
              resetData()
            }}
            onPressDuration={() => setDropDuration(true)}
            onPressDate={() => {
              setTypeDate(TYPE_DATE.ADD_DATE)
              datePickerRef.current.onPressDate()
            }}
            dateAdd={dataRequest?.date}
            duration={selectedDuration?.value}
            startDate={startDate}
            startTime={startTime}
            onPressStartDate={() => {
              setTypeDate(TYPE_DATE.START_DATE)
              datePickerRef.current.onPressDate()
            }}
            onPressStartTime={() => {
              setTabsTime(0)
              dateTimePickerRef.current.onPressDate()
            }}
            endDate={endDate}
            onPressEndDate={() => {
              setTypeDate(TYPE_DATE.END_DATE)
              datePickerRef.current.onPressDate()
            }}
            endTime={endTime}
            onPressEndTime={() => {
              setTabsTime(1)
              dateTimePickerRef.current.onPressDate()
            }}
            onPressAdd={callAPIBook}
            routeViewRequest={routeViewRequest}
            tabs={1}
          />
        )
      }
      {
        isDropDuration && (
          <SearchListWithName
            listData={duration}
            title={`${Translate(languageRedux).SELECT_AN_OPTION}`}
            itemSelected={selectedDuration}
            onItemClick={(val) => {
              setSelectedDuration(val)
              setDropDuration(false)
            }}
            onPressRight={() => {
              setDropDuration(false)
            }}
            hideSearchText={true}
            isValue={true}
          />
        )
      }
      <CustomDatePicker
        refDatePicker={datePickerRef}
        onChangeDate={_onChangeDatePicker}
        date={_getValueDatePicker()}
      />
      <CustomDatePicker
        mode={Platform.OS === 'ios' ? 'time' : 'date'}
        refDatePicker={dateTimePickerRef}
        onChangeDate={_onChangeTimePicker}
        date={isTabsTime === 0 ? startTime : endTime}
        minuteInterval={selectedDuration?.value || 0}
        is24Hour={true}
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
    backgroundColor: colorF8F8F8
  },
  ctnBody: {
    paddingBottom: 42
  },
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  }
})
