import React, {useState, useEffect} from 'react'
import {View, Platform, StyleSheet, DeviceEventEmitter} from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useSelector } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../api/APIs'
import _ from 'lodash'

import {color3777EE, colorA7A8A9, colorF8F8F8, colorFFFFFF} from 'constants/colors'
import Translate from 'translate'
import Fonts from 'constants/Fonts'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'

import icHeader from '../../../../assets/images/header'

import HeaderVideoCall from '../video_call_navigate/HeaderVideoCall'
import LoadingView from 'components/LoadingView'
import DialogCustom from 'components/DialogCustom'
import TodaySlot from '../agenda/appointments/accpect_request_appointment/TodaySlot'
import AddAvailabilityView from '../agenda/availability/AddAvailabilityView'
import SearchListWithName from 'components/SearchListWithName'
import CustomDatePicker from 'components/CustomDatePicker'
import MultupleChooseView from '../my_profiles/components/MultupleChooseView'
import {convertToUTC} from 'constants/DateHelpers'

const Tab = createMaterialTopTabNavigator()
import ConsultationInfo from './consultation_info'
import MedicalRecords from '../patient/medical_records'
import Tracking from '../patient/tracking'
import FileArchive from '../patient/file_archive'
import NavigationService from 'navigation'

export default function ConlsultationLobby({ route }) {
  const languageRedux = useSelector(state => state.common.language)
  const passingData = route?.params?.data
  const [dataNoti, setDataNoti] = useState()
  const [isShowNoti, setShowNoti] = useState()
  const [isLoad, setLoading] = useState(true)
  const [isDialogDelete, setDialogDelete] = useState(false)
  const [isChangeSlot, setChangeSlot] = useState(false)
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
  const [isShow, setShow] = useState(false)
  const [tabs, setTabs] = useState(1)
  const [isDialog, setDialog] = useState(false)

  const [listDisease, setListDisease] = useState([])
  const [listAllergy, setListAllergy] = useState([])
  const [listMedication, setListMedication] = useState([])
  const [listDependency, setListDependency] = useState([])
  const [listImmunization, setListImmunization] = useState([])
  const [listIrregular, setListIrregular] = useState([])
  const [listProsthesis, setListProsthesis] = useState([])
  const [listHosnSur, setListHosnSur] = useState([])
  const passingToken = passingData?.user?.token
  const token = useSelector(state => state.user.token)

  const [lsBodyPressure, setLsBodyPressure] = useState([])
  const [lsBodyTemperature, setLsBodyTemperature] = useState([])
  const [lsBreathingVolumes, setLsBreathingVolumes] = useState([])
  const [lsHeartRateValues, setLsHeartRateValues] = useState([])
  const [lsSpo2, setLsSpo2] = useState([])
  const [lsWeight, setLsWeight] = useState([])

  const [listDoc, setListDoc] = useState()
  const [listCategoryFile, setListCategoryFile] = useState()
  const [listDocSuggest, setListDocSuggest] = useState()
  const [chosenItem, setChosenItem] = useState({})

  useEffect(() => {
    callAPIListDocument()
    callAPIListCategoryFile()
    callAPIGetDetail()
    callAPIChronicDisease()
    callAPIAllergy()
    callAPIMedication()
    callAPIDependency()
    callAPIImmunization()
    callAPIIrregular()
    callAPIProsthesis()
    callAPIHospitalnSurgery()
    callAPITrackingLastValueByPatientId()
    callAPIGetDuration()
  }, [])

  const callAPITrackingLastValueByPatientId = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/webdoctor/getPatientDataLastUpdate/${passingData?.user?.id}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (callAPITrackingLastValueByPatientId)')
          const getList = response?.data?.data || []
          setLsHeartRateValues(getList?.HEART_RATE)
          setLsBodyTemperature(getList?.TEMPERATURE)
          setLsSpo2(getList?.SPO2)
          setLsWeight(getList?.WEIGHT)
          setLsBodyPressure(getList?.BLOOD_PRESSURE)
        }
        setLoading(false)
      })
      .catch(error => {
        console.log('callAPITrackingLastValueByPatientIdErr: ',  error)
      })
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

  const callAPIListDocument = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/disman/getFilesById/${passingData?.user?.id}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (document)')
          const getList = response.data || []
          setListDoc(getList)
        }
      })
      .catch(error => {
        console.log('documentErr: ',  error)
      })
  }

  const callAPIListCategoryFile = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/util/getCategorieFiles`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': passingToken
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (CategorieFiles)')
          const getList = response.data.categorie || []
          setListCategoryFile(getList)
        }
      })
      .catch(error => {
        console.log('getCategorieFilesErr: ', error)
      })
  }

  const callAPIGetDetail = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/getSurvey/${passingData?.idSlot}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': passingToken
      }
    })
      .then((response) => {
        setLoading(false)
        console.log('datacallAPIGetDetail: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (callAPIGetDetail)')
          const getData = response.data.survey || []
          setListDocSuggest(getData)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const callAPIChronicDisease = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/disease`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': passingToken
      }
    })
      .then(response => {
        // console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get disease')
        } else {
          console.log('noti: ', 'disease')
          const getList = response.data.malattie || []
          setListDisease(getList)
        }
      })
      .catch(error => {
        console.log('diseaseErr: ',  error)
      })
  }

  const callAPIAllergy = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/allergy`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': passingToken
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get allergy')
        } else {
          console.log('noti: ', 'allergy')
          const getList = response.data.allergie || []
          setListAllergy(getList)
        }
      })
      .catch(error => {
        console.log('allergyErr: ',  error)
      })
  }

  const callAPIMedication = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/medication`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': passingToken
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get medi')
        } else {
          console.log('noti: ', 'medi')
          const getList = response.data.farmaci || []
          setListMedication(getList)
        }
      })
      .catch(error => {
        console.log('mediErr: ',  error)
      })
  }

  const callAPIDependency = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/dependency`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': passingToken
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get dependency')
        } else {
          console.log('noti: ', 'dependency')
          const getList = response.data.dipendenze || []
          setListDependency(getList)
        }
      })
      .catch(error => {
        console.log('dependencyErr: ',  error)
      })
  }

  const callAPIImmunization = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/immunization`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': passingToken
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get dependency')
        } else {
          console.log('noti: ', 'Immunization')
          const getList = response.data.vaccini || []
          setListImmunization(getList)
        }
      })
      .catch(error => {
        console.log('ImmunizationErr: ',  error)
      })
  }

  const callAPIIrregular = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/test`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': passingToken
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get test')
        } else {
          console.log('noti: ', 'test')
          const getList = response.data.test || []
          setListIrregular(getList)
        }
      })
      .catch(error => {
        console.log('testErr: ',  error)
      })
  }

  const callAPIProsthesis = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/prothesis`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': passingToken
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get prothesis')
        } else {
          console.log('noti: ', 'prothesis')
          const getList = response.data.protesi || []
          setListProsthesis(getList)
        }
      })
      .catch(error => {
        console.log('prothesisErr: ',  error)
      })
  }

  const callAPIHospitalnSurgery = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/hospitalization`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': passingToken
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get hospitalization')
        } else {
          console.log('noti: ', 'hospitalization')
          const getList = response.data.ricoveri || []
          setListHosnSur(getList)
        }
      })
      .catch(error => {
        console.log('hospitalizationErr: ',  error)
      })
  }

  const _onPressChangeSlot = () => {
    const body = {
      startDate: chosenItem?.startsAt || '',
      endDate: chosenItem?.endsAt || '',
      timeSlot: chosenItem?.timeSlot,
      slotId: chosenItem?.id || '',
      tz: -420
    }
    console.log('bodyChange: ', body)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/updateDoctorAppointment/${passingData?.idSlot}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      },
      data: body
    })
      .then(response => {
        setChangeSlot(false)
        console.log('data: ', response.data)
        setShowNoti(true)
        if (_.includes([0, '0'], response?.data?.esito)) {
          setDataNoti({
            status: STATUS_NOTIFY.SUCCESS,
            content: 'The appointment has been updated sucessfully'
          })
        }
        if (_.includes([1, '1'], response?.data?.esito)) {
          setDataNoti({
            status: STATUS_NOTIFY.ERROR,
            content: 'Appointment update failed'
          })
        }
        DeviceEventEmitter.emit('reloadAppointment')
        setTimeout(() => {
          NavigationService.goBack()
        }, 2000)
      })
      .catch(error => {
        setChangeSlot(false)
        setTimeout(() => {
          NavigationService.goBack()
        }, 2000)
        console.log('There was an error!', error)
      })
  }

  const getGender = () => {
    if (passingData?.user?.gender === 0) {
      return Translate(languageRedux).male
    }
    if (passingData?.user?.gender === 1) {
      return Translate(languageRedux).female
    }
    if (passingData?.user?.gender === 2) {
      return Translate(languageRedux).I_WOULD_RATHER_NOT_SAY
    }
  }

  const _onPressDelete = () => {
    axios({
      method: 'delete',
      url: `${APIs.hostAPI}backoffice/cancelDoctorAppointment/${passingData?.idSlot}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        setLoading(false)
        console.log('data: ', response.data)
        setShowNoti(true)
        if (_.includes([0, '0'], response?.data?.esito)) {
          setDataNoti({
            status: STATUS_NOTIFY.SUCCESS,
            content: response?.data?.motivo
          })
          setTimeout(() => {
            NavigationService.goBack()
          }, 2000)
          DeviceEventEmitter.emit('reloadAppointment')
        }
        if (_.includes([1, '1'], response?.data?.esito)) {
          setDataNoti({
            status: STATUS_NOTIFY.ERROR,
            content: response?.data?.motivo
          })
          setTimeout(() => {
            NavigationService.goBack()
          }, 500)
        }
      })
      .catch(error => {
        setLoading(false)
        console.error('There was an error!', error)
      })
  }

  const TYPE_DATE = {
    START_DATE: 'START_DATE',
    END_DATE: 'END_DATE',
    ADD_DATE: 'ADD_DATE',
    SELECTED_DATE: 'SELECTED_DATE'
  }
  const [typeDate, setTypeDate] = useState()
  const TYPE_DAYS = [
    {
      name: 'Monday',
      value: 'MONDAY'
    },
    {
      name: 'Tuesday',
      value: 'TUESDAY'
    },
    {
      name: 'Wednesday',
      value: 'WEDNESDAY'
    },
    {
      name: 'Thursday',
      value: 'THURSDAY'
    },
    {
      name: 'Friday',
      value: 'FRIDAY'
    },
    {
      name: 'Saturday',
      value: 'SATURDAY'
    },
    {
      name: 'Sunday',
      value: 'SUNDAY'
    }
  ]
  const [lsWeekDay, setLsWeekDay] = useState(TYPE_DAYS)
  const [isShowWeekDay, setShowWeekDay] = useState(false)

  const resetData = () => {
    setDateAdd(new Date())
    setStartDate(new Date())
    setEndDate(new Date())
    setStartTime()
    setEndTime()
    setLsWeekDay(TYPE_DAYS)
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

  const handleBookAppointment = (item) => {
    setChosenItem(item)
    setDialog(true)
  }

  return (
    <View style={styles.container}>
      <HeaderVideoCall
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_left}
        gender={passingData?.user?.gender}
        name={passingData?.user?.nome}
        surname={passingData?.user?.cognome}
        age={passingData?.user?.birthdate}
        onPressLeft={() => {
          NavigationService.popToRoot()
        }}
      />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: color3777EE,
          tabBarInactiveTintColor: colorA7A8A9,
          tabBarLabelStyle: {
            fontSize: 14,
            textTransform: 'none',
            fontFamily: Fonts.Bold,
            width: '100%'
          },
          tabBarStyle: {
            height: 52
          },
          tabBarIndicatorStyle: {
            height: 4,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16
          },
          tabBarScrollEnabled: true
        }}>
        <Tab.Screen
          name={'ConsultationInfo'}
          options={{ tabBarLabel: Translate(languageRedux).CONSULTATION_INFO || '' }}
          component={() => <ConsultationInfo
            data={passingData}
            setLoading={setLoading}
            setShowNoti={setShowNoti}
            setDataNoti={setDataNoti}
            onPressDelete={() => {setDialogDelete(true)}}
            onPressChange={() => {setChangeSlot(true)}}
          />}
        />
        <Tab.Screen
          name={'MedicalRecords'}
          options={{ tabBarLabel: Translate(languageRedux).MEDICAL_RECORDS || '' }}
          component={() => (
            <MedicalRecords
              dataPersonal={passingData?.user}
              gender={getGender()}
              token={passingToken}
              dataDisease={listDisease}
              dataAllergy={listAllergy}
              dataMedication={listMedication}
              dataDependency={listDependency}
              dataImmunization={listImmunization}
              dataIrregular={listIrregular}
              dataProsthesis={listProsthesis}
              dataHosnSur={listHosnSur}
            />
          )}
        />
        <Tab.Screen
          name={'Tracking'}
          options={{ tabBarLabel: Translate(languageRedux).TRACKING || '' }}
          component={() =>
            <Tracking
              routeViewDoctor={true}
              patientToken={passingToken}
              patientId={passingData?.user?.id}
              bodyTemp={lsBodyTemperature}
              bloodPress={lsBodyPressure}
              breathVolume={lsBreathingVolumes}
              heartRate={lsHeartRateValues}
              spo2={lsSpo2}
              weight={lsWeight}
            />
          }
        />
        <Tab.Screen
          name={'FileArchive'}
          options={{ tabBarLabel: Translate(languageRedux).FILE_ARCHIVE || '' }}
          component={() => (
            <FileArchive
              dataListDoc={listDoc}
              dataListCategory={listCategoryFile}
              patientToken={passingToken}
              dataDocSuggest={listDocSuggest}
            />
          )}
        />
      </Tab.Navigator>
      <NotificationView
        isShow={isShowNoti}
        setShow={() => setShowNoti(false)}
        status={dataNoti?.status || STATUS_NOTIFY.ERROR}
        content={dataNoti?.content || ''}
      />
      {isLoad && <LoadingView />}
      {
        isDialogDelete && (
          <DialogCustom
            title={Translate(languageRedux).deleteAppointment}
            onPressCancel={() => {setDialogDelete(false)}}
            txtlLeft={Translate(languageRedux).OK}
            onPressLeft={_onPressDelete}
          />
        )
      }
      {
        isChangeSlot &&
          <TodaySlot
            onPressClose={() => { setChangeSlot(false) }}
            dataPassing={passingData}
            onPressAddNewAvailability={() => { setShow(true) }}
            // reloadAdd={reload}
            setRoute={setRouteViewRequest}
            routeFromAgenda={true}
            // setChooseSlot={setChooseSlot}
            handleBookAppointment={handleBookAppointment}
          />
      }
      {
        isDialog && (
          <DialogCustom
            title={Translate(languageRedux).ALERT}
            content={Translate(languageRedux).bookAppointment}
            txtlLeft={Translate(languageRedux).cancel}
            onPressCancel={() => setDialog(false)}
            txtRight={Translate(languageRedux).BOOK}
            styleRightView={styles.styleRightView}
            onPressOK={_onPressChangeSlot}
          />
        )
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
            dateAdd={dateAdd}
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
            // onPressAdd={callAPIBook}
            weekDay={lsWeekDay}
            onPressWeekDay={() => setShowWeekDay(true)}
            routeViewRequest={false}
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  }
})
