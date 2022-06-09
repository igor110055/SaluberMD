import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions, DeviceEventEmitter } from 'react-native'
import { useSelector } from 'react-redux'
import * as APIs from '../../api/APIs'
import axios from 'axios'
import _ from 'lodash'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import Header from '../../components/Header'
import { color3777EE, colorA7A8A9, colorF8F8F8, colorFFFFFF } from '../../constants/colors'
import NavigationService from '../../navigation'
import icHeader from '../../../assets/images/header'
import Routes from '../../navigation/Routes'
import SOSButton from '../home_screen/components/SOSButton/SOSButton'
import PlusButtonFloating from './PlusButtonFloating'
import icVisit from '../../../assets/images/visit'
import Fonts from '../../constants/Fonts'
import Translate from '../../translate'
import LoadingView from 'components/LoadingView'

const Tab = createMaterialTopTabNavigator()

import HistoryAppointment from './HistoryAppointment'
import UpcomingAppointment from './UpcomingAppointment'
import { useNavigation } from '@react-navigation/native'

export default function Visit({ route }) {
  const [isShow, setShow] = useState(false)
  const typeView = route?.params?.typeView || ''
  const languageRedux = useSelector(state => state.common.language)
  const countNotiRedux = useSelector(state => state.common.countNoti)
  const navigation = useNavigation()
  const token = useSelector(state => state.user.token)
  const [pageNumber, setPageNumber] = useState(0)
  const [listHistory, setListHistory] = useState([])
  const [listTotal, setListTotal] = useState([])
  const [reloadHistory, setReloadHistory] = useState(1)
  const [isLoading, setLoading] = useState(true)
  const [listAppointment, setListAppointmet] = useState([])
  const [listRequest, setListRequest] = useState([])
  const [reloadAppointment, setReloadAppointment] = useState(1)
  const [listDiseasePost, setListDiseasePost] = useState([])
  const [listAllergyPost, setListAllergyPost] = useState([])
  const [listMedicationPost, setListMedicationPost] = useState([])

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(Routes.VISIT_MAIN_SCREEN, data => {
      if (data?.tabs === 1){
        navigation.navigate('History')
      }
    })
    return () => sub.remove()
  }, [])

  useEffect(() => {
    callAPIListAppointment()
    callAPIListRequestAppointment()
  }, [reloadAppointment])

  useEffect(() => {
    callAPIListHistoryAppointment()
  }, [pageNumber, reloadHistory])

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
          const sortByDate = ((a, b) => {
            return a.startsAt - b.startsAt
          })
          const sortData = getPro.sort(sortByDate)
          setListAppointmet(sortData)
        }
      })
      .catch((error) => {
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
        // setLoading(false)
        console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getReq = response.data.requests || []
          setListRequest(getReq)
        }
      })
      .catch((error) => {
        // setLoading(false)
        console.log(error)
      })
  }

  const callAPIListHistoryAppointment = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/webdoctor/getVisitHistoryApp/${pageNumber}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getPro = response.data.visits || []
          setListHistory(getPro)
          getListTotalHistory(getPro)
          setLoading(false)
        }
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
      })
  }

  const getListTotalHistory = (data) => {
    if ((data || []).length > 0) {
      if (data[0]?.webconferenceId !== listHistory[0]?.webconferenceId) {
        var list = [...listTotal]
        var listConcat = _.concat(list, data)
        setListTotal(listConcat)
      } else {
        setListTotal(listTotal)
      }
    }
  }

  useEffect(() => {
    callAPIChronicDisease()
    callAPIAllergy()
    callAPIMedication()
  }, [])

  const callAPIChronicDisease = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/disease`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        console.log('dataDisease: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get disease')
        } else {
          console.log('noti: ', 'disease')
          const getList = response.data.malattie || []
          getListDiseasePost(getList)
        }
      })
      .catch(error => {
        console.log('diseaseErr: ',  error)
      })
  }

  const getListDiseasePost = (data) => {
    var dataDisease = []
    for (var i = 0; i < (data || []).length; i++) {
      var item = {}
      item.id = data[i]?.id
      item.nameCurrentValue = data[i]?.disease
      item.other = data[i]?.other
      item.diseaseId = data[i]?.diseaseId
      dataDisease.push(item)
    }
    setListDiseasePost(dataDisease)
  }

  const callAPIAllergy = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/allergy`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        console.log('dataAllergy: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get allergy')
        } else {
          console.log('noti: ', 'allergy')
          const getList = response.data.allergie || []
          getListAllergyPost(getList)
        }
      })
      .catch(error => {
        console.log('allergyErr: ',  error)
      })
  }

  const getListAllergyPost = (data) => {
    var dataAllergy = []
    for (var i = 0; i < (data || []).length; i++) {
      var item = {}
      item.id = data[i]?.id
      item.nameCurrentValue = data[i]?.allergy
      item.other = data[i]?.other
      item.allergyId = data[i]?.allergyId
      dataAllergy.push(item)
    }
    setListAllergyPost(dataAllergy)
  }

  const callAPIMedication = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/medication`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        console.log('dataMedi: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get medi')
        } else {
          console.log('noti: ', 'medi')
          const getList = response.data.farmaci || []
          getListMediPost(getList)
        }
      })
      .catch(error => {
        console.log('mediErr: ',  error)
      })
  }

  const getListMediPost = (data) => {
    var dataMedi = []
    for (var i = 0; i < (data || []).length; i++) {
      var item = {}
      item.id = data[i]?.id
      item.nameCurrentValue = data[i]?.medicineName
      item.genericName = data[i]?.genericName
      item.dosage = data[i]?.dosage
      item.medicationId = data[i]?.medicineId
      dataMedi.push(item)
    }
    setListMedicationPost(dataMedi)
  }

  const renderPlusButton = () => {
    return (
      <SOSButton
        source={isShow ? icVisit.ic_x : icVisit.ic_plus}
        backgroundColor={color3777EE}
        onPress={() => { setShow(true) }}
      />
    )
  }

  const _onPressLEftNavi = () => {
    if (typeView === 'home') {
      return NavigationService.popToRoot()
    }
    return NavigationService.navigate(Routes.DRAWER_NAVIGATION)
  }

  const _onPressNotificaion = () => {
    return NavigationService.navigate(Routes.NOTIFICATION_SCREEN)
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={
          typeView === 'home' ? icHeader.ic_left : icHeader.ic_menudrawer
        }
        iconRight={icHeader.ic_noti}
        onPressLeft={_onPressLEftNavi}
        onPressRight={_onPressNotificaion}
        notiRight={countNotiRedux}
      />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: color3777EE,
          tabBarInactiveTintColor: colorA7A8A9,
          tabBarLabelStyle: {
            fontSize: 14,
            textTransform: 'none',
            fontFamily: Fonts.SemiBold
          },
          tabBarStyle: {
            height: 52,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16
          },
          tabBarIndicatorStyle: {
            height: 4,
            width: 76,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            marginHorizontal: ((Dimensions.get('window').width) / 2 - 76) / 2
          }
        }}>
        <Tab.Screen
          name={'Upcoming'}
          options={{ tabBarLabel: Translate(languageRedux).UPCOMING || '' }}
          component={() =>
            <UpcomingAppointment
              listAppointment={listAppointment}
              listRequest={listRequest}
              setReload={setReloadAppointment}
              listDisease={listDiseasePost}
              listAllergy={listAllergyPost}
              listMedi={listMedicationPost}
            />
          }
        />
        <Tab.Screen
          name={'History'}
          options={{ tabBarLabel: Translate(languageRedux).HISTORY || '' }}
          component={() =>
            <HistoryAppointment
              listHistory={listTotal}
              setReload={setReloadHistory}
              onPressLoadMore={() => {
                setPageNumber(pageNumber + 1)
                setLoading(true)
              }}
              listHistoryFirst={listHistory}
            />
          }
        />
      </Tab.Navigator>
      {renderPlusButton()}
      {isShow === true && (
        <View style={[styles.floatView]}>
          <PlusButtonFloating
            onPressCancel={() => {
              setShow(false)
            }}
            onPressAppointment={() => {
              setShow(false)
              NavigationService.navigate(Routes.NEW_APPOINTMENT_SCREEN)
            }}
            onPressDirectCall={() => {
              setShow(false)
              NavigationService.navigate(Routes.VISITS_DIRECT_CALL_SCREEN)
            }}
          />
        </View>)}
        {isLoading && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  }
})
