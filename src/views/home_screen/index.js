import React, { useEffect, useState } from 'react'
import {
  View, ScrollView, StyleSheet, RefreshControl, DeviceEventEmitter,
  StatusBar,
  Platform
} from 'react-native'
import * as APIs from '../../api/APIs'
import axios from 'axios'
import Header from '../../components/Header'
import VisitsWidget from './components/FirstWidget/VisitsWidget'
import MedicineWidget from './components/FirstWidget/MedicineWidget'
import PharmaciesWidget from './components/FirstWidget/PharmaciesWidget'
import MagazineWidget from './components/FirstWidget/MagazineWidget'
import SOSButton from './components/SOSButton/SOSButton'
import Medicines from './components/MedicineWidget/Medicines'
import Pharmacy from './components/Pharmacy'
import Appointment from './components/VisitsWidget/Appointment'
import icHeader from '../../../assets/images/header'
import SOSFloating from './components/SOSButton/SOSFloating'
import LoadingView from '../../components/LoadingView'
import Tracking from 'views/home_screen/components/DataTrackingWidget/Tracking'
import DeviceInfo from 'react-native-device-info'
import { colorFFFFFF, color4F4F4F, colorF8F8F8, colorF5455B, color0B40B1 } from '../../constants/colors'
import NavigationService from '../../navigation'
import Routes from '../../navigation/Routes'
import { useDispatch, useSelector } from 'react-redux'
import Translate from '../../translate'

import { apiCountry, apiGetUserInfo, apiMedicine } from '../../api/Auth'
import { saveAllergies, saveChronicDisease, saveDependencies, saveHospitalization, saveImmunizations, saveIrregular, saveMedications, savePermission, saveProsthesis, saveShowMedi, saveShowPharma, saveUserinfo } from '../../actions/user'
import { saveCountNoti, saveDataAllergy, saveDataDepen, saveDataDisease, saveDataHosSur, saveDataImmu, saveDataIrre, saveDataMedi, saveDataPros, saveListHealthProfile, saveLSAllergi, saveLSAppoitment, saveLSComplication, saveLSCountry, saveLSDependency, saveLSDisease, saveLSHospitalization, saveLSImmunization, saveLSIrregular, saveLSMedi, saveLSMedication, saveLSMediForm, saveLSPharma, saveLSProsthesis, saveLSRequestAppoitment, saveLSSubSurgery, saveLSSurgery, saveTrackingBloodPressure, saveTrackingBodyTemperature, saveTrackingBreathingVolumes, saveTrackingHeartRate, saveTrackingSPO2, saveTrackingWeight } from '../../actions/common'
import { apiCheckPermission, apiHealthProfile } from 'api/MedicalRecord'
import { apiGetMagazine } from 'api/Magazine'
import { apiGetBreathingVolumes, apiGetHeartRateValues, apiGetMisurazioniPresx, apiGetMisurazioniScalx, apiGetSpo2Values, apiGetTempValues } from 'api/DataTracking'
import EmergencyContactView from './components/EmergencyContactView'
import { apiCountNotification } from 'api/Notification'
import { apiRegisterPush } from 'api/VideoCall'
import uuid from 'react-native-uuid'
import { STORAGE_KEY } from 'constants/define'
import AsyncStorage from '@react-native-community/async-storage'

export default function HomeScreen() {
  const languageRedux = useSelector(state => state.common.language)
  const [isShow, setShow] = useState(false)
  const dispatch = useDispatch()
  const [isLoading, setLoading] = useState(true)
  const lsPharmacyRedux = useSelector(state => state.common.pharmacy)
  const lsMedicineRedux = useSelector(state => state.common.medicine)
  const [lsMedicine, setLSMedicine] = useState(lsMedicineRedux || [])
  const [lsPharmacy, setLSPharmacy] = useState(lsPharmacyRedux || [])
  const token = useSelector(state => state.user.token)
  const lsAppointmentRedux = useSelector(state => state.common.appointment)
  const [lsAppointment, setLSAppointment] = useState(lsAppointmentRedux || [])
  const lsRequestRedux = useSelector(state => state.common.lsRequest)
  const [lsRequest, setLSRequest] = useState(lsRequestRedux || [])
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)
  const lsCountryRedux = useSelector(state => state.common.country)
  const [magazine, setMagazine] = useState()

  const [isContact, setShowContact] = useState(false)
  const [getUnit, setGetUnit] = useState()
  const [reload, setReload] = useState(1)
  const [countNoti, setCountNoti] = useState()
  const countNotiRedux = useSelector(state => state.common.countNoti)

  useEffect(() => {
    callAPICountry()
    console.log('udid v4: ', uuid.v4())
    callAPIRegisterDevice()
  }, [])

  useEffect(() => {
    setCountNoti(countNotiRedux)
  }, [countNotiRedux])

  useEffect(() => {
    callAPIMagazine()
    callAPIMedicine()
    callAPIListAppointment()
    callAPIListRequestAppointment()
    callAPIHealthProfile()
    callAPIListPharmacies()
    callAPICountNoti()
    callAPICheckPermission()
    callAPIUserinfo()
  }, [toggleReload, reload])

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('reminder', () => {
      setReload(Math.random())
    })

    return () => sub.remove()
  }, [])

  useEffect(() => {
    callAPIDataTracking()
  }, [toggleReload])

  useEffect(() => {
    callAPIGetUnit()
    const sub = DeviceEventEmitter.addListener('checkShow', () => {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    })

    return () => sub.remove()
  }, [isLoading])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.NOTIFICATION_SCREEN, () => {
      callAPICountNoti()
    })

    return () => subscription.remove()
  }, [])

  const callAPICheckPermission = () => {
    const params = {
      build: DeviceInfo.getBuildNumber(),
      isIOS: Platform.OS === 'ios',
      uuid: DeviceInfo.getUniqueId(),
      version: DeviceInfo.getVersion()
    }
    dispatch(apiCheckPermission(params)).then(res => {
      console.log('callAPICheckPermission Res: ', res)
      dispatch(savePermission(res?.payload))
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }

  const callAPIListPharmacies = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/getFavouritesFarmacy`,
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
          const getList = response.data.farmacie || []
          setLSPharmacy(getList)
          Promise.all([
            dispatch(saveLSPharma(getList))
          ])
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const callAPIMagazine = () => {
    dispatch(apiGetMagazine())
      .then(res => {
        console.log('magazine: ', res?.payload)
        const getData = res?.payload
        if (getData.length > 0) {
          const sortByDate = ((a, b) => {
            return b.insertDate - a.insertDate
          })
          const sortData = getData.sort(sortByDate)
          setMagazine(sortData[0] || [])
        }
      })
      .catch(err => {
        console.log('err: ', err)
      })
  }

  const callAPICountry = () => {
    if (lsCountryRedux.length > 0) { return }
    dispatch(apiCountry()).then(res => {
      console.log('Res: ', res)
      const getCountry = res?.payload?.country || []
      if (getCountry.length > 0) {
        Promise.all([
          dispatch(saveLSCountry(getCountry))
        ])
      }
    }).catch(() => {
    })
  }

  const callAPIMedicine = () => {
    // if (lsMedicineRedux.length > 0) { return }
    dispatch(apiMedicine()).then(res => {
      console.log('Medicine: ', res?.payload?.medicine)
      const getMedi = res?.payload?.medicine || []
      setLSMedicine(getMedi)
      Promise.all([
        dispatch(saveLSMedi(getMedi))
      ])
    }).catch(() => {
    })
  }

  const callAPIUserinfo = () => {
    dispatch(apiGetUserInfo()).then(res => {
      console.log('res: ', res?.payload)
      const getuserInfo = res?.payload?.user
      if (getuserInfo) {
        Promise.all([
          dispatch(saveUserinfo(getuserInfo))
        ])
      }
      setRefresh(false)
      setLoading(false)
    }).catch((err) => {
      console.log('err: ', err)
      setLoading(false)
    })
  }

  const callAPIListAppointment = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/listappointment`,
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
          if (getPro.length > 0) {
            const sortByDate = ((a, b) => {
              return a.startsAt - b.startsAt
            })
            const sortData = getPro.sort(sortByDate)
            setLSAppointment(sortData)
            Promise.all([
              dispatch(saveLSAppoitment(sortData))
            ])
          }
        }
      })
      .catch((error) => {
        setRefresh(false)
        console.log(error)
      })
  }

  const callAPIListRequestAppointment = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/getRequestsByPatientId`,
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
          const getReq = response.data.requests || []
          if (getReq.length > 0) {
            setLSRequest(getReq)
            Promise.all([
              dispatch(saveLSRequestAppoitment(getReq))
            ])
          }
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const callAPIHealthProfile = () => {
    dispatch(apiHealthProfile()).then(res => {
      console.log('res apiHealthProfile: ', res?.payload)
      Promise.all([
        dispatch(saveListHealthProfile(res?.payload))
      ])
    }).catch(() => {

    })
  }

  //data tracking
  const trackingBreathingVolumes = useSelector(state => state.common.trackingBreathingVolumes)
  const trackingWeight = useSelector(state => state.common.trackingWeight)
  const trackingBloodPressure = useSelector(state => state.common.trackingBloodPressure)
  const trackingSpo2 = useSelector(state => state.common.trackingSpo2)
  const trackingBodyTemperature = useSelector(state => state.common.trackingBodyTemperature)
  const trackingHeartRate = useSelector(state => state.common.trackingHeartRate)

  const callAPIDataTracking = () => {
    dispatch(apiGetMisurazioniPresx(10, null, 0, 0)).then(res => {
      console.log('apiGetMisurazioniPresx:', res)
      const ls = res?.payload?.rilevazioni || []
      Promise.all([
        dispatch(saveTrackingBloodPressure(ls))
      ])
    }).catch(() => { })

    dispatch(apiGetTempValues(10, null, 0, 0)).then(res => {
      console.log('apiGetTempValues:', res)
      const ls = res?.payload?.data || []
      Promise.all([
        dispatch(saveTrackingBodyTemperature(ls))
      ])
    }).catch(() => { })

    dispatch(apiGetBreathingVolumes(10)).then(res => {
      console.log('apiGetBreathingVolumes:', res)
      const ls = res?.payload?.rilevazioni || []
      Promise.all([
        dispatch(saveTrackingBreathingVolumes(ls))
      ])
    }).catch(() => { })

    dispatch(apiGetHeartRateValues(10, null, 0, 0)).then(res => {
      console.log('apiGetHeartRateValues:', res)
      const ls = res?.payload?.data || []
      Promise.all([
        dispatch(saveTrackingHeartRate(ls))
      ])
    }).catch(() => { })

    dispatch(apiGetSpo2Values(10, null, 0, 0)).then(res => {
      console.log('apiGetSpo2Values:', res)
      const ls = res?.payload?.data || []
      Promise.all([
        dispatch(saveTrackingSPO2(ls))
      ])
    }).catch(() => { })

    dispatch(apiGetMisurazioniScalx(10, null, 0, 0)).then(res => {
      console.log('apiGetMisurazioniScalx:', res)
      const ls = res?.payload?.rilevazioni || []
      Promise.all([
        dispatch(saveTrackingWeight(ls))
      ])
    }).catch(() => { })
  }

  const callAPIGetUnit = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/getUnitStatus`,
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
          const getList = response.data || []
          setGetUnit(getList)
          dispatch(saveShowMedi(getList?.showReminder))
          dispatch(saveShowPharma(getList?.showPharmacy))
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const _onPressCloseMedi = () => {
    const body = {
      showReminder: 0
    }
    setLoading(true)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/settingUnitStatus`,
      headers: {
        'x-auth-token': token
      },
      data: body
    })
      .then(response => {
        console.log('data: ', response.data)
        Promise.all([
          dispatch(saveShowMedi(0))
        ])
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
  }

  const callAPICountNoti = () => {
    dispatch(apiCountNotification()).then(res => {
      console.log('ResNoti: ', res?.payload?.total)
      const dataNoti = res?.payload?.total || null
      Promise.all([
        dispatch(saveCountNoti(dataNoti))
      ])
      setCountNoti(dataNoti)
    })
  }

  const _onPressClosePharma = () => {
    const body = {
      showPharmacy: 0
    }
    setLoading(true)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/settingUnitStatus`,
      headers: {
        'x-auth-token': token
      },
      data: body
    }).then(response => {
      console.log('data: ', response.data)
      Promise.all([
        dispatch(saveShowPharma(0))
      ])
    })
      .catch(error => {
        console.error('There was an error!', error)
      })
  }

  const callAPIRegisterDevice = async () => {
    const udidv4 = await DeviceInfo.getUniqueId()
    console.log('Token callAPIRegisterDevice: ', udidv4)
    const getDeviceToken = await AsyncStorage.getItem(STORAGE_KEY.DEVICE_TOKEN)
    console.log('Token callAPIRegisterDevice1: ', getDeviceToken)
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

  // render Visit
  const _onPressDirectCall = () => {
    NavigationService.navigate(Routes.VISITS_DIRECT_CALL_SCREEN)
  }

  const _onPressNewAppointment = () => {
    NavigationService.navigate(Routes.NEW_APPOINTMENT_SCREEN)
  }

  const renderVisti = () => {
    return (
      <View style={styles.topDistance}>
        {(lsAppointment.length === 0 && lsRequest.length === 0) &&
          <VisitsWidget onPressDirectCall={_onPressDirectCall} onPressNewAppointment={_onPressNewAppointment} />}
        {(lsAppointment.length > 0 || lsRequest.length > 0) && <Appointment />}
      </View>
    )
  }
  // render Today's medicines
  const renderMedi = () => {
    return (
      <View>
        {getUnit?.showReminder === 1 && <View>
          {lsMedicine.length === 0 && <MedicineWidget
            onPressClose={_onPressCloseMedi}
          />}
          {lsMedicine.length > 0 && <Medicines />}
        </View>}
      </View>
    )
  }
  // render Data Tracking & Favorite Pharmacy
  const renderDataPharma = () => {
    return (
      <View>
        <Tracking
          lsBodyPressure={trackingBloodPressure}
          lsBodyTemperature={trackingBodyTemperature}
          lsBreathingVolumes={trackingBreathingVolumes}
          lsHeartRateValues={trackingHeartRate}
          lsSpo2={trackingSpo2}
          lsWeight={trackingWeight}
        />
        {getUnit?.showPharmacy === 1 && <View>
          {lsPharmacy.length === 0 && <PharmaciesWidget
            onPressClose={_onPressClosePharma}
          />}
          {lsPharmacy.length > 0 && <Pharmacy />}
        </View>}
      </View>
    )
  }

  // render Magazine
  const checkType = () => {
    if (magazine?.section === 0) {
      return Translate(languageRedux).HEALTH_INDEX
    }
    if (magazine?.section === 1) {
      return Translate(languageRedux).nutrition
    }
  }
  const renderMagazine = () => {
    return (
      <View>
        <MagazineWidget
          base64={magazine?.image?.base64}
          title={magazine?.name}
          description={magazine?.description}
          data={magazine}
          category={checkType()}
        />
      </View>
    )
  }
  // render SOS button
  const renderSOSButton = () => {
    return (
      <SOSButton
        text={'SOS'}
        backgroundColor={colorF5455B}
        onPress={() => { setShow(true) }}
      />
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.marginB42}>
        {renderVisti()}
        {renderMedi()}
        {renderDataPharma()}
        {renderMagazine()}
      </View>
    )
  }

  const _onRefresh = () => {
    setRefresh(true)
    setToggleReload(Math.random())
  }

  const _onPressNotificaion = () => {
    return NavigationService.navigate(Routes.NOTIFICATION_SCREEN)
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textColor={color4F4F4F}
        iconLeft={icHeader.ic_menudrawer}
        iconRight={icHeader.ic_noti}
        onPressLeft={() => NavigationService.openDrawer()}
        onPressRight={_onPressNotificaion}
        notiRight={countNoti}
      />
      <StatusBar
        backgroundColor="white"
        barStyle={'dark-content'} />
      <ScrollView
        contentContainerStyle={styles.paddingB100}
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
      {renderSOSButton()}
      {
        isShow &&
        <View style={[styles.floatView]}>
          <SOSFloating
            onPressCancel={() => setShow(false)}
            onPressContact={() => {
              setShow(false)
              setTimeout(() => {
                setShowContact(true)
              }, 150)
            }}
            onPressShare={() => {
              setShow(false)
              setTimeout(() => {
                NavigationService.navigate(Routes.SHARE_YOUR_MEDICAL_RECORD)
              }, 100)
            }}
          />
        </View>
      }
      {
        isContact && (
          <EmergencyContactView
            setShow={(val) => {
              setShowContact(val)
            }}
          />
        )
      }
      {isLoading && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  topDistance: {
    marginTop: 4
  },
  marginB42: {
    marginBottom: 42
  },
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  paddingB100: {
    paddingBottom: 100
  }
})
