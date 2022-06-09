import React, { useEffect, useState } from 'react'
import {
  StyleSheet, View, ScrollView,
  RefreshControl, DeviceEventEmitter
} from 'react-native'
import Translate from '../../../translate'
import { color0B40B1, color2F855A, color848586, colorC6F6D5, colorE53E3E, colorF0F0F0, colorFED7D7, colorFFFFFF } from '../../../constants/colors'
import NavigationService from '../../../routes'
import Routes from '../../../routes/Routes'
// import { apiGetBreathingVolumes, apiGetHeartRateValues, apiGetMisurazioniPresx, apiGetMisurazioniScalx, apiGetSpo2Values, apiGetTempValues } from 'api/DataTracking'
import BoxTracking from '../../home/components/DataTrackingWidget/BoxTracking'
import icTracking from '../../../../assets/images/home_screen'
import { convertNumberToDDMMMYYYY } from '../../../constants/DateHelpers'

export default function Tracking() {
  const permissionRedux = {}//useSelector(state => state.user.permission)
  const languageRedux = ''
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)

  const userinfo = {}//useSelector(state => state.user.userinfo)

  const [lsBodyPressure, setLsBodyPressure] = useState([])
  const [lsBodyTemperature, setLsBodyTemperature] = useState([])
  const [lsBreathingVolumes, setLsBreathingVolumes] = useState([])
  const [lsHeartRateValues, setLsHeartRateValues] = useState([])
  const [lsSpo2, setLsSpo2] = useState()
  const [lsWeight, setLsWeight] = useState()

  useEffect(() => {
    callAPIDataTracking()
  }, [toggleReload])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.DETAIL_DATA_TRACKING_SCREEN, () => {
      setToggleReload(Math.random())
    })
    return () => subscription.remove()
  }, [])

  const typeStatus = {
    growing: 'growing', //tăng trưởng
    fluctuating: 'fluctuating', // dao động
    stable: 'stable', // ổn định
    decreasing: 'decreasing', // giảm
    fever: 'fever',
    low: 'low',
    normal: 'normal'
  }

  const checkStatusWeight = () => {
    if ((lsWeight || []).length > 1) {
      if (Number(lsWeight[0]?.weight) > Number(lsWeight[1]?.weight)) {
        return typeStatus.growing
      } else if (Number(lsWeight[0]?.weight) < Number(lsWeight[1]?.weight)) {
        return typeStatus.decreasing
      }
      return typeStatus.stable
    }
    return typeStatus.stable
  }

  const checkStatusBloodPressure = () => {
    if ((lsBodyPressure || []).length > 1) {
      if (Number(lsBodyPressure[0]?.systolic) > Number(lsBodyPressure[1]?.systolic)) {
        return typeStatus.growing
      } else if (Number(lsBodyPressure[0]?.systolic) < Number(lsBodyPressure[1]?.systolic)) {
        return typeStatus.decreasing
      }
      return typeStatus.stable
    }
    return typeStatus.stable
  }

  const checkStatusSpo2 = () => {
    if ((lsSpo2 || []).length > 1) {
      if (Number(lsSpo2[0].spo2) > 96) {
        return typeStatus.growing
      } else if (Number(lsSpo2[0].spo2) < 95) {
        return typeStatus.decreasing
      }
      return typeStatus.stable
    }
    return typeStatus.stable
  }

  const checkStatusBodyTemperature = () => {
    if ((lsBodyTemperature || []).length > 1) {
      if (Number(lsBodyTemperature[0]?.temp) > 37.5) {
        return typeStatus.fever
      } else if (Number(lsBodyTemperature[0]?.temp) < 36) {
        return typeStatus.low
      }
      return typeStatus.normal
    }
    return typeStatus.normal
  }

  const checkStatusHeartRate = () => {
    if ((lsHeartRateValues || []).length > 1) {
      if (Number(lsHeartRateValues[0]?.value) > Number(lsHeartRateValues[1]?.value)) {
        return typeStatus.growing
      } else if (Number(lsHeartRateValues[0]?.value) < Number(lsHeartRateValues[1]?.value)) {
        return typeStatus.decreasing
      }
      return typeStatus.stable
    }
    return typeStatus.stable
  }

  const bgColor = (status) => {
    switch (status) {
      case typeStatus.growing:
      case typeStatus.normal:
        return colorC6F6D5
      case typeStatus.decreasing:
      case typeStatus.fever:
      case typeStatus.low:
        return colorFED7D7
      default:
        return colorF0F0F0
    }
  }

  const txtColor = (status) => {
    switch (status) {
      case typeStatus.growing:
      case typeStatus.normal:
        return color2F855A
      case typeStatus.decreasing:
      case typeStatus.fever:
      case typeStatus.low:
        return colorE53E3E
      default:
        return color848586
    }
  }

  const getDataBloodPressure = () => {
    if ((lsBodyPressure || []).length > 0) {
      return `${lsBodyPressure[0]?.systolic || 0}/${lsBodyPressure[0]?.diastolic || 0} ${lsBodyPressure[0]?.deviceSelectedUnit || 'mmhg'}`
    }
    return null
  }

  const getDataBodyTemperature = () => {
    if ((lsBodyTemperature || []).length > 0) {
      return `${lsBodyTemperature[0]?.temp || 0} º${lsBodyTemperature[0]?.type || ''}`
    }
    return null
  }


  const callAPIDataTracking = () => {
    // dispatch(apiGetMisurazioniPresx(10)).then(res => {
    //   console.log('apiGetMisurazioniPresx:', res)
    //   const ls = res?.payload?.rilevazioni || []
    //   setLsBodyPressure(ls)
    // }).catch(() => { })

    // dispatch(apiGetTempValues(10)).then(res => {
    //   console.log('apiGetTempValues:', res)
    //   const ls = res?.payload?.data || []
    //   setLsBodyTemperature(ls)
    // }).catch(() => { })

    // dispatch(apiGetBreathingVolumes(10)).then(res => {
    //   console.log('apiGetBreathingVolumes:', res)
    //   const ls = res?.payload?.rilevazioni || []
    //   setLsBreathingVolumes(ls)
    // }).catch(() => { })

    // dispatch(apiGetHeartRateValues(10)).then(res => {
    //   console.log('apiGetHeartRateValues:', res)
    //   const ls = res?.payload?.data || []
    //   setLsHeartRateValues(ls)
    // }).catch(() => { })

    // dispatch(apiGetSpo2Values(10)).then(res => {
    //   console.log('apiGetSpo2Values:', res)
    //   const ls = res?.payload?.data || []
    //   setLsSpo2(ls)
    // }).catch(() => { })

    // dispatch(apiGetMisurazioniScalx(10)).then(res => {
    //   console.log('apiGetMisurazioniScalx:', res)
    //   const ls = res?.payload?.rilevazioni || []
    //   setLsWeight(ls)
    //   setRefresh(false)
    // }).catch(() => { setRefresh(false) })
  }

  const _onRefresh = () => {
    setRefresh(true)
    setToggleReload(Math.random())
  }

  const renderLSContent = () => {
    const checkData = permissionRedux?.iniziativa
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={_onRefresh}
            tintColor={color0B40B1}
          />
        }
      >
        {
          checkData?.corx === '1' && (
            <BoxTracking
              category={Translate(languageRedux).CORX_DATA}
              timePerWeek="1 per week"
              // onPress={() => NavigationService.navigate(Routes.LIST_CORX_DATA)}
            />
          )
        }
        {
          checkData?.ariax === '1' && (
            <BoxTracking
              category={Translate(languageRedux).ARIAX}
              timePerWeek="1 per week"
              bgStatus={colorF0F0F0}
              // status="stable"
              statusColor={color848586}
              bgParam={colorF0F0F0}
              // param="IRV 3.1"
              paramColor={color848586}
              // param2="ERV 1.1"
              source={icTracking.ic_lungs}
              // onPress={() => NavigationService.navigate(Routes.LIST_BREATHING_VOLUMES)}
            />
          )
        }
        {
          checkData?.scalx === '1' && (
            <BoxTracking
              category={Translate(languageRedux).SCALX}
              timePerWeek="4 per week"
              bgStatus={bgColor(checkStatusWeight())}
              status={checkStatusWeight()}
              statusColor={txtColor(checkStatusWeight())}
              bgParam={colorF0F0F0}
              param={(lsWeight || []).length > 0 ? `${lsWeight[0].weight} ${lsWeight[0]?.unit || ''}` : null}
              paramColor={color848586}
              source={icTracking.ic_weight}
              // onPress={() => NavigationService.navigate(Routes.LIST_WEIGHT)}
              txtLastUpdate={(lsWeight || []).length > 0 ? `${Translate(languageRedux).LAST_UPDATAE_AT} ${lsWeight[0]?.date ? convertNumberToDDMMMYYYY(lsWeight[0]?.date) : ''}` : null}
            />
          )
        }
        {
          checkData?.presx === '1' && (
            <BoxTracking
              category={Translate(languageRedux).PRESX}
              timePerWeek="3 per week"
              bgStatus={bgColor(checkStatusBloodPressure())}
              status={checkStatusBloodPressure()}
              statusColor={txtColor(checkStatusBloodPressure())}
              bgParam={colorF0F0F0}
              param={getDataBloodPressure()}
              paramColor={color848586}
              source={icTracking.ic_blood}
              // onPress={() => NavigationService.navigate(Routes.LIST_BODY_PRESSURE)}
              txtLastUpdate={(lsBodyPressure || []).length > 0 ? `${Translate(languageRedux).LAST_UPDATAE_AT} ${lsBodyPressure[0]?.date ? convertNumberToDDMMMYYYY(lsBodyPressure[0]?.date) : ''}` : null}
            />
          )
        }
        {
          checkData?.spo2 === '1' && (
            <BoxTracking
              category={Translate(languageRedux).DEVICE_SPO2}
              timePerWeek="1 per week"
              bgStatus={bgColor(checkStatusSpo2())}
              status={checkStatusSpo2()}
              statusColor={txtColor(checkStatusSpo2())}
              bgParam={colorF0F0F0}
              param={(lsSpo2 || []).length > 0 ? `${lsSpo2[0]?.spo2}%` : null}
              paramColor={color848586}
              source={icTracking.ic_spo2}
              // onPress={() => NavigationService.navigate(Routes.LIST_SPO2_SCREEN)}
              txtLastUpdate={(lsSpo2 || []).length > 0 ? `${Translate(languageRedux).LAST_UPDATAE_AT} ${lsSpo2[0]?.date ? convertNumberToDDMMMYYYY(lsSpo2[0]?.date) : ''}` : null}
            />
          )
        }
        {
          checkData?.temperature === '1' && (
            <BoxTracking
              category={Translate(languageRedux).TEMPERATURE}
              timePerWeek="1 per week"
              bgStatus={bgColor(checkStatusBodyTemperature())}
              status={checkStatusBodyTemperature()}
              statusColor={txtColor(checkStatusBodyTemperature())}
              bgParam={colorF0F0F0}
              param={getDataBodyTemperature()}
              paramColor={color848586}
              source={icTracking.ic_temperature}
              // onPress={() => NavigationService.navigate(Routes.LIST_BODY_TEMPERATURE)}
              txtLastUpdate={(lsBodyTemperature || []).length > 0 ? `${Translate(languageRedux).LAST_UPDATAE_AT} ${lsBodyTemperature[0]?.date ? convertNumberToDDMMMYYYY(lsBodyTemperature[0]?.date) : ''}` : null}
            />
          )
        }
        {
          checkData?.cholesterol === '1' && (
            <BoxTracking
              category={Translate(languageRedux).DEVICE_CHL}
              timePerWeek="1 per week"
              bgStatus={colorF0F0F0}
              // status="stable"
              statusColor={color848586}
              bgParam={colorF0F0F0}
              // param="96%"
              paramColor={color848586}
              // source={icTracking.ic_temperature}
            />
          )
        }
        {checkData?.heartrate === '1' && (
          <BoxTracking
            category={Translate(languageRedux).DEVICE_HEART_RATE}
            timePerWeek="3 per week"
            bgStatus={bgColor(checkStatusHeartRate())}
            status={checkStatusHeartRate()}
            statusColor={txtColor(checkStatusHeartRate())}
            bgParam={colorF0F0F0}
            param={(lsHeartRateValues || []).length > 0 ? `${lsHeartRateValues[0]?.value} bpm` : null}
            paramColor={color848586}
            source={icTracking.ic_heart}
            // onPress={() => NavigationService.navigate(Routes.LIST_HEART_RATE)}
            txtLastUpdate={(lsHeartRateValues || []).length > 0 ? `${Translate(languageRedux).LAST_UPDATAE_AT} ${lsHeartRateValues[0]?.date ? convertNumberToDDMMMYYYY(lsHeartRateValues[0]?.date) : ''}` : null}
          />
        )}
        {checkData?.hasKiosk === '1' && (
          <BoxTracking
            category={Translate(languageRedux).kiosk}
            // timePerWeek="1 per week"
            // onPress={() => NavigationService.navigate(Routes.LIST_VITAL_CARE_KIT)}
          />
        )}
      </ScrollView>
    )
  }

  return (
    <View>
      {renderLSContent()}
    </View>
  )
}

const styles = StyleSheet.create({
  contentView: {
    flexDirection: 'row',
    backgroundColor: colorFFFFFF,
    padding: 16,
    paddingTop: 12
  },
  contentContainer: {
    paddingBottom: 40
  },
  scrollView: {
    marginLeft: 15,
    marginRight: 15
  }
})
