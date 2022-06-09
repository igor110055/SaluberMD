import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, Dimensions, Text } from 'react-native'
import VisitsWidget from './components/FirstWidget/VisitsWidget'
import MedicineWidget from './components/FirstWidget/MedicineWidget'
import PharmaciesWidget from './components/FirstWidget/PharmaciesWidget'
import MagazineWidget from './components/FirstWidget/MagazineWidget'
import SOSButton from './components/SOSButton/SOSButton'
import Medicines from './components/MedicineWidget/Medicines'
import Pharmacy from './components/Pharmacy'
import Appointment from './components/VisitsWidget/Appointment'
import Tracking from './components/DataTrackingWidget/Tracking'
import Translate from '../../translate'
import { color3777EE, color4F4F4F, colorF0F0F0, colorF5455B, colorFFFFFF } from '../../constants/colors'
import { header } from '../../apis'
import { apiCheckPermission, apiGetCountries, apiGetMagazine, apiListAppointment, apiListPharmacies, apiUserInfo } from './apis'
import { saveUserinfo } from '../../store/generics/utility'
import { useSelector } from 'react-redux'
import dashboardReducer from '../../store/reducers/dashboardReducer'
import * as stateLocal from '../../state_local'
import Header from '../../components/Header'
import icHeader from '../../../assets/images/header'
import MenuBar from '../../components/MenuBar'
import Routes from '../../routes/Routes'
import NavigationService from '../../routes'
import LoadingView from '../../components/LoadingView'

function HomeView() {
  const [isShow, setShow] = useState(false)
  const [isLoading, setLoading] = useState(true)
  const lsPharmacyRedux = []
  const lsMedicineRedux = []
  const [lsMedicine, setLSMedicine] = useState(lsMedicineRedux || [])
  const [lsPharmacy, setLSPharmacy] = useState(lsPharmacyRedux || [])
  const lsAppointmentRedux = []
  const [lsAppointment, setLSAppointment] = useState(lsAppointmentRedux || [])
  const lsRequestRedux = []
  const [lsRequest, setLSRequest] = useState(lsRequestRedux || [])
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)
  const lsCountryRedux = []
  const [magazine, setMagazine] = useState()

  const userinfo = null

  const [lsBodyPressure, setLsBodyPressure] = useState([])
  const [lsBodyTemperature, setLsBodyTemperature] = useState([])
  const [lsBreathingVolumes, setLsBreathingVolumes] = useState([])
  const [lsHeartRateValues, setLsHeartRateValues] = useState([])
  const [lsSpo2, setLsSpo2] = useState()
  const [lsWeight, setLsWeight] = useState()
  const [isContact, setShowContact] = useState(false)
  const [getUnit, setGetUnit] = useState({
    showReminder: 1,
    showPharmacy: 1
  })

  const [countNoti, setCountNoti] = useState()
  const countNotiRedux = '1'
  const [deviceToken, setTokenNoti] = useState()
  const [isOpenMenu, setOpenMenu] = useState(true)

  useEffect(() => {
    callAPIUserinfo()
    callAPICheckPermission()
    callAPIListAppointment()
    callAPIListPharmacies()
    callAPIMagazine()
    callAPICountry()
  }, [])

  useEffect(() => {
    if (userinfo) {
      console.log('userinfo redux: ', userinfo)
    }
  }, [userinfo])

  const callAPIUserinfo = () => {
    apiUserInfo().then(async res => {
      if (res) {
        const parseData = await res.json()
        console.log('userinfo: ', parseData)
        stateLocal.userinfo = parseData?.user
      }
    })
  }

  const callAPICheckPermission = () => {
    const body = {
      build: 100194,
      isIOS: false,
      uuid: 'deviceid-web',
      version: '1.0.78'
    }
    apiCheckPermission(body).then(async res => {
      if (res) {
        const parseData = await res.json()
        console.log('apiCheckPermission: ', parseData)
        stateLocal.permission = parseData
      }
    })
  }

  const callAPIListAppointment = () => {
    apiListAppointment().then(async res => {
      if (res) {
        const parseData = await res.json()
        console.log('apiListAppointment: ', parseData)
        setLSAppointment(parseData?.slot || [])
      }
    })
  }

  const callAPIListPharmacies = () => {
    apiListPharmacies().then(async res => {
      const parseData = await res.json()
      setLSPharmacy(parseData?.farmacie || [])
      stateLocal.pharmacys = parseData?.farmacie || []
    }).catch(() => {

    })
  }

  const callAPIMagazine = () => {
    apiGetMagazine().then(async res => {
      const getData = await res.json()
      console.log('callAPIMagazine: ', getData)
      if (getData.length > 0) {
        const sortByDate = ((a, b) => {
          return b.insertDate - a.insertDate
        })
        const sortData = getData.sort(sortByDate)
        setMagazine(sortData[0] || [])
      }
    })
  }

  const callAPICountry = () => {
    apiGetCountries().then(async res => {
      const getData = await res.json()
      stateLocal.lsCountry = getData?.country || []
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
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
        {(lsAppointment.length > 0 || lsRequest.length > 0) && (
          <Appointment
            lsAppointmentRedux={lsAppointment}
            onPressDirectCall={() => {
              NavigationService.navigate(Routes.VISITS_DIRECT_CALL_SCREEN)
            }}
          />
        )}
      </View>
    )
  }

  const _onPressCloseMedi = () => {

  }

  // render Today's medicines
  const renderMedi = () => {
    return (
      <View style={styles.container}>
        {getUnit?.showReminder === 1 && <View>
          {lsMedicine.length === 0 && <MedicineWidget
            onPressClose={_onPressCloseMedi}
          />}
          {lsMedicine.length > 0 && <Medicines />}
        </View>}
      </View>
    )
  }

  const _onPressClosePharma = () => {

  }

  // render Data Tracking & Favorite Pharmacy
  const renderDataPharma = () => {
    return (
      <View>
        <Tracking
          lsBodyPressure={lsBodyPressure}
          lsBodyTemperature={lsBodyTemperature}
          lsBreathingVolumes={lsBreathingVolumes}
          lsHeartRateValues={lsHeartRateValues}
          lsSpo2={lsSpo2}
          lsWeight={lsWeight}
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
      return Translate().HEALTH_INDEX
    }
    if (magazine?.section === 1) {
      return Translate().nutrition
    }
  }
  const renderMagazine = () => {
    return (
      <MagazineWidget
        base64={magazine?.image?.base64}
        title={magazine?.name}
        description={magazine?.description}
        data={magazine}
        category={checkType()}
      />
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
      <View style={styles.container}>
        {renderVisti()}
        {renderMedi()}
        {renderDataPharma()}
        {renderMagazine()}
      </View>
    )
  }

  const _onPressNotificaion = () => {
    // return NavigationService.navigate(Routes.NOTIFICATION_SCREEN)
  }

  return (
    <View style={styles.contain}>
      <Header
        backgroundColor={colorFFFFFF}
        textColor={color4F4F4F}
        iconLeft={icHeader.ic_menudrawer}
        iconRight={icHeader.ic_noti}
        // onPressLeft={() => setOpenMenu(!isOpenMenu)}
        onPressRight={_onPressNotificaion}
        notiRight={countNoti}
      />
      {
        !stateLocal.permission?.isDoctor && (
          <View style={styles.menuView}>
            {
              isOpenMenu && <MenuBar />
            }
            <ScrollView
              style={styles.contain}
            >
              {renderBody()}
            </ScrollView>
            {/* {renderSOSButton()} */}
          </View>
        )
      }

      {isLoading && <LoadingView />}
    </View>
  )
}

export default HomeView

const styles = StyleSheet.create({
  contain: {
    width: '100%',
    height: Dimensions.get('window').height,
    backgroundColor: colorF0F0F0
  },
  container: {
    flex: 1
  },
  containerBox: {
    flex: 1,
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9
  },
  ctnCategory: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colorF0F0F0
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  boxDistance: {
    marginTop: 8
  },
  ctnNewMeasure: {
    alignItems: 'flex-end',
    marginVertical: 16,
    marginRight: 16
  },
  ctnButtonCompact: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  marginL16: {
    marginLeft: 16
  },
  marginB16: {
    marginBottom: 16
  },
  ctnIcon: {
    marginRight: 16
  },
  button: {
    marginTop: 16,
    marginBottom: 16
  },
  ctnButtonLayout: {
    marginHorizontal: 16,
    alignItems: 'center'
  },
  ctnButton: {
    height: 40,
    width: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: color3777EE
  },
  ctnContent: {
    marginTop: 16,
    marginHorizontal: 16
  },
  menuView: {
    flex: 1,
    flexDirection: 'row'
  },
  topDistance: {
    marginTop: 4
  }
})
