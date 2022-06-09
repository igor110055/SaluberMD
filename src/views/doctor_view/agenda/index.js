import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions, DeviceEventEmitter, Platform, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { color3777EE, colorA7A8A9, colorE53E3E, colorFFFFFF } from 'constants/colors'
import Translate from '../../../translate'
import NavigationService from 'navigation'
import icHeader from '../../../../assets/images/header'
import Header from 'components/Header'
import ButtonOnOff from '../home_view/button_on_off'
import DeviceInfo from 'react-native-device-info'
import { apiSwitchOnlineStatus, apiGetOnlineStatus } from '../home_view/apis'
import icVisit from '../../../../assets/images/visit'
import { useNavigation } from '@react-navigation/native'
import moment from 'moment'

import AppointmentAgendaScreen from './appointments'
import AvailabilityAgendaScreen from './availability'
import HistoryAgendaScreen from './history'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import SOSButton from '../../home_screen/components/SOSButton/SOSButton'
import Fonts from 'constants/Fonts'
import LoadingView from 'components/LoadingView'
import SearchListWithName from 'components/SearchListWithName'
import { convertYYYYMMDDLocal, endOfWeek, ranageDate, startOfMonth, startOfWeek, getNumPrevDay, getNumNextDay, convertYYYYMMDD, convertNumberTime, convertToUTC, convertDayDD, addDate, subtractDate, getDateToSever } from 'constants/DateHelpers'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
import axios from 'axios'
import * as APIs from '../../../api/APIs'
import CustomDatePicker from 'components/CustomDatePicker'
import _, { cloneDeep } from 'lodash'
import AddAvailabilityView from './availability/AddAvailabilityView'
import { apiDeleteAllAppointment, apiDeleteAppointment, apiGenerateUrlAppointment, apiGetAppointmentMonth, apiPostAppointment, apiPostAppointmentSeries } from 'api/Agenda'
import Routes from 'navigation/Routes'
import AgendaDetailView from './availability/AgendaDetailView'
import TodaySlot from './appointments/accpect_request_appointment/TodaySlot'
import DialogCustom from 'components/DialogCustom'
import Clipboard from '@react-native-community/clipboard'
import MultupleChooseView from '../my_profiles/components/MultupleChooseView'
import CustomTimePikerAndroid from 'components/CustomTimePikerAndroid'

const Tab = createMaterialTopTabNavigator()

export default function AgendaDoctorView() {
  const dispatch = useDispatch()
  const [isOnline, setOnline] = useState(false)
  const [imgAvt, setImgAvt] = useState()
  const userinfoRedux = useSelector(state => state.user.userinfo)
  const [userInfo, setUserInfo] = useState(userinfoRedux)
  const languageRedux = useSelector(state => state.common.language)
  const [isShow, setShow] = useState(false)
  const [isLoading, setLoading] = useState(true)
  const [isDropTypeCalendar, setDropTypeCalendar] = useState(false)
  const [getWeek, setWeekCalendar] = useState()
  const [dateSelected, setDateSelected] = useState(new Date())
  const [dataNoti, setDataNoti] = useState()
  const [isShowNoti, setShowNoti] = useState(false)
  const tokenRedux = useSelector(state => state.user.token)
  const [slot, setSlot] = useState([])
  const datePickerRef = React.createRef()
  const [refreshing, setRefresh] = useState(false)
  const [dataWeekCalendar, setDataWeekCalendar] = useState([])
  const [monthCalendar, setMonthCalendar] = useState()
  const [dataMonthCalendar, setDataMonthCalendar] = useState()
  const navigation = useNavigation()

  const [duration, setDuration] = useState()
  const [selectedDuration, setSelectedDuration] = useState()
  const [isDropDuration, setDropDuration] = useState(false)

  const [dateAdd, setDateAdd] = useState(new Date())
  const dateTimePickerRef = React.createRef()
  const [startDate, setStartDate] = useState(new Date())
  const [startTime, setStartTime] = useState()
  const [endDate, setEndDate] = useState(new Date())
  const [endTime, setEndTime] = useState()
  const [isTabsTime, setTabsTime] = useState(0)

  const [isDetail, setDetail] = useState(false)
  const [dateDetail, setDateDetail] = useState(new Date())
  const [lsDetail, setLsDetail] = useState()
  const [lsToday, setLsToday] = useState()
  const [isPopupRequest, setPopupRequest] = useState(false)
  const [dataRequest, setDataRequest] = useState()
  const [reload, setReload] = useState(1)
  const [routeViewRequest, setRouteViewRequest] = useState(false)
  const token = useSelector(state => state.user.token)
  const [isDialog, setDialog] = useState(false)
  const [itemDelete, setItemDelete] = useState()
  const [isDialogAll, setDialogAll] = useState(false)
  const [dataLinking, setDataLinking] = useState()
  //history
  const [pageNumber, setPageNumber] = useState(0)
  const [listTotal, setListTotal] = useState([])
  const [reloadList, setReloadList] = useState(1)
  //apointment
  const [listAppointment, setListAppointment] = useState([])
  const [listRequestAppointment, setRequestListAppointment] = useState([])
  const [reloadAppointment, setReloadAppointment] = useState(1)

  const TYPE_DATE = {
    START_DATE: 'START_DATE',
    END_DATE: 'END_DATE',
    ADD_DATE: 'ADD_DATE',
    SELECTED_DATE: 'SELECTED_DATE'
  }
  const [typeDate, setTypeDate] = useState()

  const typeCalendar = [
    {
      type: 'week',
      name: Translate(languageRedux).week
    },
    {
      type: 'month',
      name: Translate(languageRedux).month
    }
  ]
  const [typeDrop, setTypeDrop] = useState(typeCalendar[0])

  const [isShowWeekDay, setShowWeekDay] = useState(false)
  const TYPE_DAYS = [
    {
      name: 'Monday',
      value: 'MONDAY',
      id: 0
    },
    {
      name: 'Tuesday',
      value: 'TUESDAY',
      id: 1
    },
    {
      name: 'Wednesday',
      value: 'WEDNESDAY',
      id: 2
    },
    {
      name: 'Thursday',
      value: 'THURSDAY',
      id: 3
    },
    {
      name: 'Friday',
      value: 'FRIDAY',
      id: 4
    },
    {
      name: 'Saturday',
      value: 'SATURDAY',
      id: 5
    },
    {
      name: 'Sunday',
      value: 'SUNDAY',
      id: 6
    }
  ]
  const sortByDateWeek = ((a, b) => {
    return b?.id - a?.id
  })
  const sortDays = sortByDateWeek(TYPE_DAYS)
  const [lsWeekDay, setLsWeekDay] = useState(sortDays)
  const [tabs, setTabs] = useState(1)

  useEffect(() => {
    setLsWeekDay(sortDays)
  }, [sortDays])

  useEffect(() => {
    setUserInfo(userinfoRedux)
    if (userinfoRedux?.userImage) {
      var base64 = `data:image/png;base64,${userinfoRedux?.userImage}`
      setImgAvt({ uri: base64 })
    }
  }, [userinfoRedux])

  useEffect(() => {
    getWeekSelectedDay(dateSelected)
    getDataMonth()
  }, [dateSelected])

  useEffect(() => {
    convertWeekCalendar()
    convertDataMonthCalendar()
    setLsDetail(getRecordWithDate(dateDetail))
  }, [getWeek, slot, monthCalendar])

  useEffect(() => {
    callAPIGetData()
    callAPIGetStatus()
    callAPIGetDuration()
    callAPIGenerateUrlAppointment()
  }, [])

  useEffect(() => {
    setLsDetail(getRecordWithDate(dateDetail))
  }, [dateDetail])

  useEffect(() => {
    callAPIListHistory()
  }, [pageNumber, reloadList])

  useEffect(() => {
    callAPIListRequestAppointment()
    callAPIListAppointment()
  }, [reloadAppointment])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('reloadAppointment', () => {
      setReloadAppointment(Math.random())
    })
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.AGENDA_DOCTOR_VIEW, (res) => {
      if (res?.history) {
        navigation.navigate('History')
      }
    })
    return () => subscription.remove()
  }, [])

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
        console.log('callAPIListAppointment: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (callAPIListAppointment)')
          const getPro = response.data.slot || []
          convertData(getPro)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const convertData = (dataAppointment) => {
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
      console.log('dataApointment: ', data)
      const sortByDate = ((a, b) => {
        return b.startsAt - a.startsAt
      })
      const sortData = data.sort(sortByDate)
      setListAppointment(sortData)
    }
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
        console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (callAPIListRequestAppointment)')
          const getList = response.data.requests || []
          convertDataRequestAppointment(getList)
        }
      })
      .catch((error) => {
        console.log(error)
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
        item.patientBirthdate = dataAppointment[i]?.patientBirthdate
        item.lastDataTracking = JSON.parse(dataAppointment[i]?.lastData)
        data.push(item)
      }
      filterRequestPending(data)
    }
  }

  const filterRequestPending = (dataRequestAppointment) => {
    if ((dataRequestAppointment || []).length > 0) {
      const listFilter = dataRequestAppointment.filter((val) => val?.doctorTimeSlotId === null)
      console.log('listFilter: ', listFilter)
      setRequestListAppointment(listFilter)
    }
  }

  const callAPIListHistory = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/webdoctor/getPatientVisitHistoryApp/${pageNumber}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        console.log('callAPIListHistory: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (callAPIListHistory)')
          const getList = response.data.visits || []
          getListTotalHistory(getList)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const getListTotalHistory = (data) => {
    const checkData = () => {
      if (data[0]?.webconferenceId === listTotal[0]?.webconferenceId) {
        return []
      } else {
        return listTotal
      }
    }
    if ((data || []).length > 0) {
      var list = [...checkData()]
      var listConcat = _.concat(list, data)
      setListTotal(listConcat)
    }
  }

  //** Function */
  const callAPIGetData = () => {
    // axios({
    //   method: 'get',
    //   url: `${APIs.hostAPI}backoffice/appointment?action=search`,
    //   headers: {
    //     'content-type': 'application/json',
    //     'x-auth-token': tokenRedux
    //   }
    // }).then(res => {
    //   setLoading(false)
    //   if (res?.data?.esito === '0') {
    //     setSlot(res?.data?.slot)
    //   } else {
    //     setDataNoti({
    //       status: STATUS_NOTIFY.ERROR,
    //       content: res?.data?.motivo || 'error'
    //     })
    //     setTimeout(() => {
    //       setShowNoti(true)
    //     }, 500)
    //   }
    // }).catch(() => {
    //   setLoading(false)
    // })

    dispatch(apiGetAppointmentMonth(getDateToSever(dateSelected))).then(res => {
      console.log('res: ', res?.payload)
      setLoading(false)
      if (res?.payload?.esito === '0') {
        setSlot(res?.payload?.slot)
      } else {
        setDataNoti({
          status: STATUS_NOTIFY.ERROR,
          content: res?.payload?.motivo || 'error'
        })
        setTimeout(() => {
          setShowNoti(true)
        }, 500)
      }
    }).catch((err) => {
      console.log(err)
      setLoading(false)
    })
  }

  const callAPIGetDuration = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/app/getSlotDuration`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': tokenRedux
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

  const callAPIGetStatus = async () => {
    const udid = await DeviceInfo.getUniqueId()
    if (udid) {
      dispatch(apiGetOnlineStatus(udid)).then(res => {
        setOnline(res?.payload?.isonline)
      }).catch(() => {

      })
    }
  }
  const resetData = () => {
    setDateAdd(new Date())
    setStartDate(new Date())
    setEndDate(new Date())
    setStartTime()
    setEndTime()
    setLsWeekDay(TYPE_DAYS)
    setDate(new Date())
    setDateEndAndroid(new Date())
  }

  const callAPIPostAppointment = () => {
    if (tabs === 1) { //Single
      setReload(Math.random())
      var endTimeSlice = moment(startTime).add(Number(selectedDuration?.value), 'minutes').format('HH:mm')
      const startsTime = `${convertYYYYMMDD(routeViewRequest ? dataRequest?.date : dateAdd)}T${convertNumberTime(startTime)}:00`
      const endsTime = `${convertYYYYMMDD(routeViewRequest ? dataRequest?.date : dateAdd)}T${routeViewRequest ? endTimeSlice : convertNumberTime(endTime)}:00`
      const body = {
        esito: '0',
        startsAt: convertToUTC(startsTime),
        endsAt: convertToUTC(endsTime),
        timeSlot: selectedDuration?.id
      }
      console.log('body: ', body)
      setLoading(true)
      dispatch(apiPostAppointment(body)).then(res => {
        console.log('apiPostAppointment: ', res)
        setLoading(false)
        if (res?.payload?.esito === '0') {
          callAPIGetData()
          setShow(false)
          resetData()
          setDataNoti({
            status: STATUS_NOTIFY.SUCCESS,
            content: Translate(languageRedux).confirmation_success
          })
          setTimeout(() => {
            setShowNoti(true)
          }, 500)
        } else {
          setDataNoti({
            status: STATUS_NOTIFY.ERROR,
            content: res?.payload?.motivo || 'error'
          })
          setTimeout(() => {
            setShowNoti(true)
          }, 500)
        }
      }).catch(() => {
        setLoading(false)
      })
    } else { //Series
      setReload(Math.random())
      var endTimeSlice = moment(startTime).add(Number(selectedDuration?.value), 'minutes').format('HH:mm')
      const startsTime = `${convertYYYYMMDD(startDate)}T${convertNumberTime(startTime)}:00`
      const endsTime = `${convertYYYYMMDD(endDate)}T${routeViewRequest ? endTimeSlice : convertNumberTime(endTime)}:00`
      const weekdays = lsWeekDay.filter(val => val?.isSelected).map(val => { return val?.value })
      const body = {
        weekdays: weekdays,
        startsAt: getDateToSever(startsTime),
        timeSlot: selectedDuration?.id,
        endsAt: getDateToSever(endsTime)
      }

      console.log('body: ', body)
      setLoading(true)
      dispatch(apiPostAppointmentSeries(body)).then(res => {
        console.log('apiPostAppointmentSeries: ', res?.payload)
        setLoading(false)
        if (res?.payload?.esito === '0') {
          callAPIGetData()
          setShow(false)
          resetData()

          setDataNoti({
            status: STATUS_NOTIFY.SUCCESS,
            content: Translate(languageRedux).confirmation_success
          })
          setTimeout(() => {
            setShowNoti(true)
          }, 500)
        } else {
          setDataNoti({
            status: STATUS_NOTIFY.ERROR,
            content: res?.payload?.motivo || 'error'
          })
          setTimeout(() => {
            setShowNoti(true)
          }, 500)
        }
      }).catch(() => {
        setLoading(false)
      })
    }

  }

  const callAPIBook = () => {
    setLoading(true)
    setPopupRequest(false)
    var endTimeSlice = moment(startTime).add(Number(selectedDuration?.value), 'minutes').format('HH:mm')
    const startsTime = `${convertYYYYMMDD(routeViewRequest ? dataRequest?.date : dateAdd)}T${convertNumberTime(startTime)}:00`
    const endsTime = `${convertYYYYMMDD(routeViewRequest ? dataRequest?.date : dateAdd)}T${endTimeSlice}:00`
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
        setReloadAppointment(Math.random())
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
        }
        if (_.includes([1, '1'], response?.data?.esito)) {
          setDataNoti({
            status: STATUS_NOTIFY.ERROR,
            content: response?.data?.motivo
          })
        }
      })
      .catch(error => {
        setLoading(false)
        console.error('There was an error!', error)
      })
  }

  const getWeekSelectedDay = (newDate) => {
    setWeekCalendar([])
    var convertWeekDate = newDate
    if (convertDayDD(newDate) === 'Sun') {
      convertWeekDate = addDate(newDate, -2)
    }
    const dateOfWeekStart = startOfWeek(convertWeekDate || dateSelected)
    const dateOfWeekEnd = endOfWeek(convertWeekDate || dateSelected)

    const getLsDate = ranageDate(dateOfWeekStart, dateOfWeekEnd)
    var lsDateOfWeek = []
    for (var days of getLsDate.by('days')) {
      lsDateOfWeek.push({
        date: days.format('YYYY-MM-DD'),
        event: []
      })
    }
    if (lsDateOfWeek.length > 0) {
      setWeekCalendar(lsDateOfWeek)
    }
  }

  const callAPIGenerateUrlAppointment = () => {
    dispatch(apiGenerateUrlAppointment()).then(res => {
      if ((res?.payload?.links || []).length > 0) {
        setDataLinking(res?.payload?.links[0])
      }
    }).catch(() => {

    })
  }

  const _onPressSwitch = async () => {
    const udid = await DeviceInfo.getUniqueId()
    if (!udid) { return }
    dispatch(apiSwitchOnlineStatus(udid)).then(res => {
      setOnline(res?.payload?.isOnline)
    }).catch(() => {

    })
  }

  const sortData = (data) => {
    const newData = cloneDeep(data)
    return newData.sort(function (a, b) { return a?.startsAt - b?.startsAt })
  }

  const convertWeekCalendar = () => {
    setDataWeekCalendar([])
    const newWeek = (getWeek || []).map((val) => {
      var tempSlot = []
      const loop = (slot || []).map(val1 => {
        if (val1?.startsAt) {
          if ((val?.date || '') === (convertYYYYMMDDLocal(val1?.startsAt) || '')) {
            tempSlot.push(val1)
          }
        }
      })
      console.log(loop)
      if ((convertYYYYMMDDLocal(new Date()) || '') === (convertYYYYMMDDLocal(val?.date) || '')) {
        setLsToday(sortData(tempSlot))
      }
      return {
        date: val?.date,
        event: sortData(tempSlot)
      }
    })
    setRefresh(false)
    if (newWeek.length > 0) {
      setDataWeekCalendar(newWeek)
    }
  }

  const getRecordWithDate = (date) => {
    var tempSlot = []
    const loop = (slot || []).map(val1 => {
      if (val1?.startsAt) {
        if (convertYYYYMMDDLocal(date || new Date()) === (convertYYYYMMDDLocal(val1?.startsAt) || '')) {
          tempSlot.push(val1)
        }
      }
    })
    console.log(loop)
    return sortData(tempSlot)
  }

  const getDataMonth = () => {
    var daysInMonth = []
    var monthDate = startOfMonth(dateSelected)
    _.times(monthDate.daysInMonth(), function (n) {
      daysInMonth.push({
        date: monthDate.format('YYYY-MM-DD'),
        event: []
      })
      monthDate.add(1, 'day')
    })

    var lsPreviouswDay = []
    if (daysInMonth.length > 0) {
      var lsAdd = getNumPrevDay(daysInMonth[0]?.date)
      lsPreviouswDay = _.concat(lsAdd, daysInMonth)
    }

    var lsNextDay = []

    if (daysInMonth.length > 0) {
      var lsAdd = getNumNextDay(daysInMonth[daysInMonth.length - 1]?.date)
      lsNextDay = _.concat(lsPreviouswDay, lsAdd)
    }
    setMonthCalendar(lsNextDay)
  }

  const convertDataMonthCalendar = () => {
    setDataMonthCalendar([])
    const newMonth = (monthCalendar || []).map((val) => {
      var tempSlot = []
      const loop = (slot || []).map(val1 => {
        if (val1?.startsAt) {
          if ((val?.date || '') === (convertYYYYMMDDLocal(val1?.startsAt) || '')) {
            tempSlot.push(val1)
          }
        }
      })
      console.log(loop)
      return {
        date: val?.date,
        event: sortData(tempSlot),
        outDay: val?.outDay
      }
    })
    setRefresh(false)
    if (newMonth.length > 0) {
      setDataMonthCalendar(newMonth)
    }
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
        return setDateSelected(date)
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
        return dateSelected
    }
  }

  const _onChangeTimePicker = (date) => {
    if (isTabsTime === 0) {
      var st = moment(date).utc().valueOf()
      var et = moment(endTime).utc().valueOf()
      var etn = moment().utc().valueOf()
      if (et < st && et !== etn) {
        setShowNoti(true)
        setDataNoti({
          status: STATUS_NOTIFY.ERROR,
          content: Translate(languageRedux).Start_time_is_after_end_time
        })
      } else {
        setStartTime(date)
      }
    } else {
      var st = moment(startTime).utc().valueOf()
      var et = moment(date).utc().valueOf()
      if (et < st) {
        setShowNoti(true)
        setDataNoti({
          status: STATUS_NOTIFY.ERROR,
          content: Translate(languageRedux).Start_time_is_after_end_time
        })
      } else {
        setEndTime(date)
      }
    }
  }

  const _onRefreshAvailability = () => {
    setRefresh(true)
    convertWeekCalendar()
    callAPIGetData()
  }

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.AGENDA_DOCTOR_VIEW, params => {
      if (params?.history) {
        navigation.navigate('History')
      }
    })
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.AGENDA_DOCTOR_VIEW, params => {
      if (params?.appointment) {
        navigation.navigate('Appointment')
      }
    })
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.AGENDA_DOCTOR_VIEW, params => {
      if (params?.availability) {
        navigation.navigate('Availability')
      }
    })
    return () => subscription.remove()
  }, [])

  const onPressDetailView = (val) => {
    setDetail(true)
    setDateDetail(val)
  }

  const callAPIDeleteItem = () => {
    const params = {
      'esito': '0',
      'slot': [],
      'startsAt': convertToUTC(itemDelete?.startsAt),
      'timeSlot': 15,
      'endsAt': convertToUTC(itemDelete?.endsAt)
    }
    setDialog(false)
    if (itemDelete?.id) {
      dispatch(apiDeleteAppointment(itemDelete?.id, params)).then(res => {
        console.log('delete id: ', itemDelete, res)
        setLsDetail([])
        if (res?.payload?.esito === '0') {
          setDialog(false)
          setDataNoti({
            status: STATUS_NOTIFY.SUCCESS,
            content: Translate(languageRedux).record_rimosso
          })
          setItemDelete()
          setTimeout(() => {
            setShowNoti(true)
          }, 100)
          callAPIGetData()
        } else {
          setDataNoti({
            status: STATUS_NOTIFY.ERROR,
            content: Translate(languageRedux).REQUEST_ERROR
          })
          setTimeout(() => {
            setShowNoti(true)
            console.log('data: ', dataNoti)
          }, 100)
        }

      }).catch(() => {
        setDataNoti({
          status: STATUS_NOTIFY.ERROR,
          content: Translate(languageRedux).REQUEST_ERROR
        })
        setTimeout(() => {
          setShowNoti(true)
          console.log('data: ', dataNoti)
        }, 100)
      })
    }
  }

  const onPressDeleteItem = (item) => {
    setDialog(true)
    setItemDelete(item)
  }

  const callAPIDeleteAllItem = () => {
    const getData = getRecordWithDate(dateDetail)
    const lsId = (getData || []).map((val) => {
      return { id: `${val?.id}` }
    })
    const params = {
      list: lsId
    }
    dispatch(apiDeleteAllAppointment(params)).then(res => {
      if (res?.payload?.esito === '0') {
        setDialogAll(false)
        setDataNoti({
          status: STATUS_NOTIFY.SUCCESS,
          content: Translate(languageRedux).record_rimosso
        })
        setTimeout(() => {
          setShowNoti(true)
        }, 100)
        callAPIGetData()
      } else {
        setDataNoti({
          status: STATUS_NOTIFY.ERROR,
          content: Translate(languageRedux).REQUEST_ERROR
        })
        setTimeout(() => {
          setShowNoti(true)
        }, 100)
        callAPIGetData()
      }
    }).catch(() => {
      setDataNoti({
        status: STATUS_NOTIFY.ERROR,
        content: Translate(languageRedux).REQUEST_ERROR
      })
      setTimeout(() => {
        setShowNoti(true)
        console.log('data: ', dataNoti)
      }, 100)
    })
  }

  const onPressDeleteAll = () => {
    setDialogAll(true)
  }

  const _onPressLinking = () => {
    if (dataLinking) {
      setDataNoti({
        status: STATUS_NOTIFY.SUCCESS,
        content: Translate(languageRedux).copy_url
      })
      setTimeout(() => {
        setShowNoti(true)
      }, 100)
      Clipboard.setString(`https://react.salubermd.com/backoffice/setupappointment?initiative=${dataLinking?.encinit}&doctor=${dataLinking?.encuser}`)
    }
  }
  //******renderView

  const renderBody = () => {
    return (
      <View style={styles.statusDoctor}>
        <ButtonOnOff
          isOnline={isOnline}
          onPressSwitch={_onPressSwitch}
          base64Avt={imgAvt}
          firstName={userInfo?.nome || ''}
          lastName={userInfo?.cognome || ''}
        />
      </View>
    )
  }

  const renderPlusButton = () => {
    if (isShow) {
      return null
    } else {
      return (
        <SOSButton
          source={isShow ? icVisit.ic_x : icVisit.ic_plus}
          backgroundColor={color3777EE}
          onPress={() => {
            setShow(!isShow)
            setDateAdd(new Date())
            setStartTime()
            setEndTime()
          }}
        />
      )
    }
  }


  const [isShowTimeStart, setShowTimeStart] = useState(false)
  const [isShowTimeEnd, setShowTimeEnd] = useState(false)
  const [date, setDate] = useState(new Date())
  const [dateEndAndroid, setDateEndAndroid] = useState(new Date())

  const _onChangeStart = (event, selectedDate) => {
    const currentDate = selectedDate || date
    var timeStamp = moment(selectedDate).utc().valueOf()
    var et = moment(endTime).utc().valueOf()
    var etn = moment().utc().valueOf()
    console.log('timeStamp: ', timeStamp)
    console.log('et: ', et)
    if (Number(et) < Number(timeStamp) && et !== etn) {
      setShowTimeStart(false)
      setDate(new Date())
      setShowNoti(true)
      setDataNoti({
        status: STATUS_NOTIFY.ERROR,
        content: Translate(languageRedux).Start_time_is_after_end_time
      })
    } else {
      setShowTimeStart(false)
      setDate(new Date())
      setStartTime(timeStamp)
    }
  }

  const _onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || dateEndAndroid
    var timeStamp = moment(selectedDate).utc().valueOf()
    var st = moment(startTime).utc().valueOf()
    console.log('timeStamp: ', timeStamp)
    if (Number(timeStamp) < Number(st)) {
      setShowTimeEnd(false)
      setDateEndAndroid(new Date())
      setShowNoti(true)
      setDataNoti({
        status: STATUS_NOTIFY.ERROR,
        content: Translate(languageRedux).Start_time_is_after_end_time
      })
    } else {
      setShowTimeEnd(false)
      setDateEndAndroid(new Date())
      setEndTime(timeStamp)
    }
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_menudrawer}
        textCenter={Translate(languageRedux).AGENDA}
        onPressLeft={() => {
          console.log('open drawer')
          NavigationService.openDrawer()}}
      />
      {renderBody()}
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: color3777EE,
          tabBarInactiveTintColor: colorA7A8A9,
          tabBarLabelStyle: {
            fontSize: 14,
            textTransform: 'none',
            fontFamily: Fonts.SemiBold,
            width: '100%'
          },
          tabBarStyle: {
            height: 52,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            justifyContent: 'center'
          },
          tabBarIndicatorStyle: {
            height: 4,
            width: 76,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            marginHorizontal: ((Dimensions.get('window').width) / 3 - 76) / 2
          }
        }}>
        <Tab.Screen
          name={'Availability'}
          options={{ tabBarLabel: Translate(languageRedux).AVAILABILITY || '' }}
          component={() => <AvailabilityAgendaScreen
            typeDrop={typeDrop}
            onPressChangeTypeCalendar={() => {
              setDropTypeCalendar(!isDropTypeCalendar)
            }}
            dateSelected={dateSelected}
            getWeek={dataWeekCalendar}
            onPressChangeDate={() => {
              setTypeDate(TYPE_DATE.SELECTED_DATE)
              datePickerRef.current.onPressDate()
            }}
            refreshing={refreshing}
            setRefresh={(val) => setRefresh(val)}
            onRefresh={_onRefreshAvailability}
            dataMonthCalendar={dataMonthCalendar || monthCalendar}
            onPressDetail={onPressDetailView}
            lsToday={lsToday}
            onPressLinking={_onPressLinking}
          />}
        />
        <Tab.Screen
          name={'Appointment'}
          options={{ tabBarLabel: Translate(languageRedux).appuntamenti || '' }}
          component={() => <AppointmentAgendaScreen
            onPressRequestAppointment={() => {
              setPopupRequest(true)
            }}
            setValueItemRequest={setDataRequest}
            dataRequestAppointment={listRequestAppointment}
            dataAppointment={listAppointment}
            setReloadAppointment={setReloadAppointment}
          />}
        />
        <Tab.Screen
          name={'History'}
          options={{ tabBarLabel: Translate(languageRedux).HISTORY || '' }}
          component={() => <HistoryAgendaScreen
            dataHistory={listTotal}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            setReloadList={setReloadList}
          />}
        />
      </Tab.Navigator>
      {renderPlusButton()}
      {
        isDetail && (
          <AgendaDetailView
            onPressClose={() => setDetail(false)}
            date={dateDetail}
            lsData={lsDetail}
            onPressAdd={(val) => {
              setShow(true)
              setDateAdd(new Date(val))
            }}
            onPressDeleteAll={onPressDeleteAll}
            onPressPrevious={() => {
              setDateDetail(addDate(dateDetail, -1))
            }}
            onPressNext={() => {
              setDateDetail(addDate(dateDetail, 1))
            }}
            onPressCopyItem={() => {

            }}
            onPressDeleteItem={onPressDeleteItem}
          />
        )
      }
      {
        isPopupRequest &&
        <TodaySlot
          onPressClose={() => { setPopupRequest(false) }}
          dataPassing={dataRequest}
          onPressAddNewAvailability={() => { setShow(true) }}
          reloadAdd={reload}
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
            dateAdd={routeViewRequest ? dataRequest?.date : dateAdd}
            duration={selectedDuration?.value}
            startDate={startDate}
            startTime={startTime}
            onPressStartDate={() => {
              setTypeDate(TYPE_DATE.START_DATE)
              datePickerRef.current.onPressDate()
            }}
            onPressStartTime={() => {
              setTabsTime(0)
              Platform.OS === 'ios' ? dateTimePickerRef.current.onPressDate() : setShowTimeStart(true)
            }}
            endDate={endDate}
            onPressEndDate={() => {
              setTypeDate(TYPE_DATE.END_DATE)
              datePickerRef.current.onPressDate()
            }}
            endTime={endTime}
            onPressEndTime={() => {
              setTabsTime(1)
              Platform.OS === 'ios' ? dateTimePickerRef.current.onPressDate() : setShowTimeEnd(true)
            }}
            onPressAdd={routeViewRequest ? callAPIBook : callAPIPostAppointment}
            routeViewRequest={routeViewRequest}
            weekDay={lsWeekDay}
            onPressWeekDay={() => setShowWeekDay(true)}
            tabs={tabs}
            setTabs={val => {
              if (tabs !== val) {
                resetData()
              }
              setTabs(val)
            }}
          />
        )
      }
      {
        isDropTypeCalendar && (
          <SearchListWithName
            listData={typeCalendar}
            title={`${Translate(languageRedux).CHOOSE_TYPE}`}
            itemSelected={typeDrop}
            onItemClick={(val) => {
              setTypeDrop(val)
              setDropTypeCalendar(false)
            }}
            onPressRight={() => {
              setDropTypeCalendar(false)
            }}
            hideSearchText={true}
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
      {Platform.OS === 'ios' && <CustomDatePicker
        mode={Platform.OS === 'ios' ? 'time' : 'date'}
        refDatePicker={dateTimePickerRef}
        onChangeDate={_onChangeTimePicker}
        date={isTabsTime === 0 ? startTime : endTime}
        minuteInterval={selectedDuration?.value || 0}
        is24Hour={true}
        minDate={(convertYYYYMMDD(dateAdd) === convertYYYYMMDD()) ? new Date() : null}
      />}
      {isShowTimeStart && Platform.OS === 'android' &&
        <CustomTimePikerAndroid
          value={date}
          onChange={_onChangeStart}
          minimumDate={new Date()}
      />}
      {isShowTimeEnd && Platform.OS === 'android' &&
        <CustomTimePikerAndroid
          value={dateEndAndroid}
          onChange={_onChangeEnd}
      />}
      {
        isShowWeekDay && (
          <MultupleChooseView
            title={Translate(languageRedux).WEEK_DAYS}
            lsData={lsWeekDay || []}
            onPressRight={() => setShowWeekDay(false)}
            onPressSave={(val) => {
              console.log('MultupleChooseView: ', val)
              setLsWeekDay(val)
              setShowWeekDay(false)
            }}
          />
        )
      }
      {isLoading && <LoadingView />}
      {
        isDialog && (
          <DialogCustom
            title={Translate(languageRedux).ALERT}
            content={Translate(languageRedux).deleteMessage}
            txtlLeft={Translate(languageRedux).cancel}
            onPressCancel={() => setDialog(false)}
            txtRight={Translate(languageRedux).delete_record}
            styleRightView={styles.styleRightView}
            onPressOK={callAPIDeleteItem}
          />
        )
      }
      {
        isDialogAll && (
          <DialogCustom
            title={Translate(languageRedux).ALERT}
            content={Translate(languageRedux).deleteSlotDay}
            txtlLeft={Translate(languageRedux).cancel}
            onPressCancel={() => setDialogAll(false)}
            txtRight={Translate(languageRedux).delete_record}
            styleRightView={styles.styleRightView}
            onPressOK={callAPIDeleteAllItem}
          />
        )
      }
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
  statusDoctor: {
    width: Dimensions.get('window').width,
    height: 76
  },
  styleRightView: {
    backgroundColor: colorE53E3E
  }
})
