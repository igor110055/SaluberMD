import React, { useEffect, useState } from 'react'
import {
  StyleSheet, View, ScrollView,
  RefreshControl, DeviceEventEmitter
} from 'react-native'
import { useSelector } from 'react-redux'
import Translate from 'translate'
import { color0B40B1, color2F855A, color848586, colorC6F6D5, colorE53E3E, colorF0F0F0, colorFED7D7, colorFFFFFF } from 'constants/colors'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import BoxTracking from 'views/home_screen/components/DataTrackingWidget/BoxTracking'
import icTracking from '../../../../../assets/images/home_screen'
import { convertNumberToDDMMMYYYY } from 'constants/DateHelpers'

export default function Tracking({routeViewDoctor, patientToken, patientId,
bodyTemp, bloodPress, breathVolume, heartRate, spo2, weight,
rangeHR, rangeW, setReloadTracking}) {
  const permissionRedux = useSelector(state => state.user.permission)
  const languageRedux = useSelector(state => state.common.language)
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)
  const [reload, setReload] = useState(1)

  useEffect(() => {
    // callAPIDataTracking2()
  }, [toggleReload])

  useEffect(() => {
    console.log('reload')
    DeviceEventEmitter.addListener('trackingReload', () => {
      // callAPIDataTracking2()
      setTimeout(() => {
        setReload(Math.random())
      }, 500)
    })
  }, [reload])

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
    normal: 'normal',
    toohot: 'toohot'
  }

  const typeStatusHeartRate = {
    growing: 'growing',
    stable: 'stable',
    decreasing: 'decreasing',
    growingIn: ' growing ',
    decreasingIn: ' decreasing ',
    stableIn: ' stable ',
    growingOut: ' growing',
    decreasingOut: ' decreasing',
    stableOut: ' stable'
  }

  const checkStatusBloodPressure = () => {
    if ((bloodPress || []).length > 1) {
      if (Number(bloodPress[0]?.systolic) - Number(bloodPress[1]?.systolic) > 10) {
        return typeStatus.growing
      } else if (Number(bloodPress[1]?.systolic) - Number(bloodPress[0]?.systolic) > 10) {
        return typeStatus.decreasing
      }
      return typeStatus.stable
    }
    return typeStatus.stable
  }

  const checkStatusSpo2 = () => {
    if ((spo2 || []).length > 1) {
      if (Number(spo2[0].value) > 94) {
        return typeStatus.growing
      } else if (Number(spo2[0].value) < 94) {
        return typeStatus.decreasing
      }
      return typeStatus.stable
    }
    return typeStatus.stable
  }

  const checkStatusBodyTemperature = () => {
    if ((bodyTemp || []).length > 1) {
      if (Number(bodyTemp[0]?.value) > 37.5) {
        return typeStatus.toohot
      } else if (Number(bodyTemp[0]?.value) <= 37.5) {
        return typeStatus.normal
      }
      return typeStatus.normal
    }
    return typeStatus.normal
  }

  const checkStatusHeartRate = () => {
    if ((heartRate || []).length > 1) {
      if ((rangeHR || []).length > 0) {
        if (Number(heartRate[0]?.value) >= Number(rangeHR[0]?.min) && Number(heartRate[0]?.value) <= Number(rangeHR[0]?.max)) {
          if (Number(heartRate[0]?.value) - Number(heartRate[1]?.value) > 10) {
            return typeStatusHeartRate.growingIn
          } else if (Number(heartRate[1]?.value) - Number(heartRate[0]?.value) > 10) {
            return typeStatusHeartRate.decreasingIn
          }
          return typeStatusHeartRate.stableIn
        } else {
          if (Number(heartRate[0]?.value) - Number(heartRate[1]?.value) > 10) {
            return typeStatusHeartRate.growingOut
          } else if (Number(heartRate[1]?.value) - Number(heartRate[0]?.value) > 10) {
            return typeStatusHeartRate.decreasingOut
          }
          return typeStatusHeartRate.stableOut
        }
      } else {
        if (Number(heartRate[0]?.value) - Number(heartRate[1]?.value) > 10) {
          return typeStatusHeartRate.growing
        } else if (Number(heartRate[1]?.value) - Number(heartRate[0]?.value) > 10) {
          return typeStatusHeartRate.decreasing
        }
        return typeStatusHeartRate.stable
      }
    }
    return typeStatusHeartRate.stable
  }

  const checkStatusWeight = () => {
    if ((weight || []).length > 1) {
      if ((rangeW || []).length > 0) {
        if (Number(weight[0]?.value) >= Number(rangeW[0]?.min) && Number(weight[0]?.value) <= Number(rangeW[0]?.max)) {
          if (Number(weight[0]?.value) > Number(weight[1]?.value) + 1) {
            return typeStatusHeartRate.growingIn
          } else if (Number(weight[0]?.value) < Number(weight[1]?.value) - 1) {
            return typeStatusHeartRate.decreasingIn
          }
          return typeStatusHeartRate.stableIn
        } else {
          if (Number(weight[0]?.value) > Number(weight[1]?.value) + 1) {
            return typeStatusHeartRate.growingOut
          } else if (Number(weight[0]?.value) < Number(weight[1]?.value) - 1) {
            return typeStatusHeartRate.decreasingOut
          }
          return typeStatusHeartRate.stableOut
        }
      }
      if (Number(weight[0]?.value) > Number(weight[1]?.value) + 1) {
        return typeStatusHeartRate.growing
      } else if (Number(weight[0]?.value) < Number(weight[1]?.value) - 1) {
        return typeStatusHeartRate.decreasing
      }
      return typeStatusHeartRate.stable
    }
    return typeStatusHeartRate.stable
  }

  const bgColor = (status) => {
    switch (status) {
      case typeStatus.growing:
      case typeStatus.normal:
        return colorC6F6D5
      case typeStatus.decreasing:
      case typeStatus.fever:
        return colorF0F0F0
      case typeStatus.low:
      case typeStatus.toohot:
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
        return color848586
      case typeStatus.toohot:
        return colorE53E3E
      default:
        return color848586
    }
  }

  const bgColorHeartRate = (status) => {
    switch (status) {
      case typeStatusHeartRate.growing:
      case typeStatusHeartRate.decreasing:
      case typeStatusHeartRate.stable:
        return colorF0F0F0
      case typeStatusHeartRate.growingIn:
      case typeStatusHeartRate.decreasingIn:
      case typeStatusHeartRate.stableIn:
        return colorC6F6D5
      case typeStatusHeartRate.growingOut:
      case typeStatusHeartRate.decreasingOut:
      case typeStatusHeartRate.stableOut:
        return colorFED7D7
      default:
        return colorF0F0F0
    }
  }

  const txtColorHeartRate = (status) => {
    switch (status) {
      case typeStatusHeartRate.growing:
      case typeStatusHeartRate.decreasing:
      case typeStatusHeartRate.stable:
        return color848586
      case typeStatusHeartRate.growing:
      case typeStatusHeartRate.decreasingIn:
      case typeStatusHeartRate.stableIn:
        return color2F855A
      case typeStatusHeartRate.growingOut:
      case typeStatusHeartRate.decreasingOut:
      case typeStatusHeartRate.stableOut:
        return colorE53E3E
      default:
        return color848586
    }
  }

  const getDataBloodPressure = () => {
    if ((bloodPress || []).length > 0) {
      return `${bloodPress[0]?.systolic || 0}/${bloodPress[0]?.diastolic || 0} ${bloodPress[0]?.deviceSelectedUnit || 'mmhg'}`
    }
    return null
  }

  const getDataBodyTemperature = () => {
    if ((bodyTemp || []).length > 0) {
      return `${Number(bodyTemp[0]?.value || 0).toFixed(1)} º${bodyTemp[0]?.unit || ''}`
    }
    return null
  }

  const _onRefresh = () => {
    setRefresh(true)
    setReloadTracking(Math.random())
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
        {/* {
          checkData?.corx === '1' && (
            <BoxTracking
              category={Translate(languageRedux).CORX_DATA}
              // timePerWeek="1 per week"
              onPress={() => NavigationService.navigate(Routes.LIST_CORX_DATA)}
            />
          )
        } */}
        {/* {
          checkData?.ariax === '1' && (
            <BoxTracking
              category={Translate(languageRedux).ARIAX}
              // timePerWeek="1 per week"
              bgStatus={colorF0F0F0}
              // status="stable"
              statusColor={color848586}
              bgParam={colorF0F0F0}
              // param="IRV 3.1"
              paramColor={color848586}
              // param2="ERV 1.1"
              source={icTracking.ic_lungs}
              onPress={() => NavigationService.navigate(Routes.LIST_BREATHING_VOLUMES, {route: routeViewDoctor, patientId: patientId, patientToken: patientToken})}
            />
          )
        } */}
        {
          checkData?.scalx === '1' && (
            <BoxTracking
              category={Translate(languageRedux).SCALX}
              // timePerWeek="4 per week"
              bgStatus={bgColorHeartRate(checkStatusWeight())}
              status={checkStatusWeight()}
              statusColor={txtColorHeartRate(checkStatusWeight())}
              bgParam={colorF0F0F0}
              param={(weight || []).length > 0 ? `${weight[0]?.value} ${weight[0]?.unit || ''}` : null}
              paramColor={color848586}
              source={icTracking.ic_weight}
              onPress={() => NavigationService.navigate(Routes.LIST_WEIGHT, {route: routeViewDoctor, patientId: patientId, patientToken: patientToken})}
              txtLastUpdate={(weight || []).length > 0 ? `${Translate(languageRedux).LAST_UPDATAE_AT} ${weight[0]?.date ? convertNumberToDDMMMYYYY(weight[0]?.date) : ''}` : null}
            />
          )
        }
        {
          checkData?.presx === '1' && (
            <BoxTracking
              category={Translate(languageRedux).PRESX}
              // timePerWeek="3 per week"
              bgStatus={bgColor(checkStatusBloodPressure())}
              status={checkStatusBloodPressure()}
              statusColor={txtColor(checkStatusBloodPressure())}
              bgParam={colorF0F0F0}
              param={getDataBloodPressure()}
              paramColor={color848586}
              source={icTracking.ic_blood}
              onPress={() => NavigationService.navigate(Routes.LIST_BODY_PRESSURE, {route: routeViewDoctor, patientId: patientId, patientToken: patientToken})}
              txtLastUpdate={(bloodPress || []).length > 0 ? `${Translate(languageRedux).LAST_UPDATAE_AT} ${bloodPress[0]?.date ? convertNumberToDDMMMYYYY(bloodPress[0]?.date) : ''}` : null}
            />
          )
        }
        {
          checkData?.spo2 === '1' && (
            <BoxTracking
              category={Translate(languageRedux).DEVICE_SPO2}
              // timePerWeek="1 per week"
              bgStatus={bgColor(checkStatusSpo2())}
              status={checkStatusSpo2()}
              statusColor={txtColor(checkStatusSpo2())}
              bgParam={colorF0F0F0}
              param={(spo2 || []).length > 0 ? `${spo2[0]?.value}%` : null}
              paramColor={color848586}
              source={icTracking.ic_spo2}
              onPress={() => NavigationService.navigate(Routes.LIST_SPO2_SCREEN, {route: routeViewDoctor, patientId: patientId, patientToken: patientToken})}
              txtLastUpdate={(spo2 || []).length > 0 ? `${Translate(languageRedux).LAST_UPDATAE_AT} ${spo2[0]?.date ? convertNumberToDDMMMYYYY(spo2[0]?.date) : ''}` : null}
              isShowParams={true}
            />
          )
        }
        {
          checkData?.temperature === '1' && (
            <BoxTracking
              category={Translate(languageRedux).TEMPERATURE}
              // timePerWeek="1 per week"
              bgStatus={bgColor(checkStatusBodyTemperature())}
              status={checkStatusBodyTemperature()}
              statusColor={txtColor(checkStatusBodyTemperature())}
              bgParam={colorF0F0F0}
              param={getDataBodyTemperature()}
              paramColor={color848586}
              source={icTracking.ic_temperature}
              onPress={() => NavigationService.navigate(Routes.LIST_BODY_TEMPERATURE, {route: routeViewDoctor, patientId: patientId, patientToken: patientToken})}
              txtLastUpdate={(bodyTemp || []).length > 0 ? `${Translate(languageRedux).LAST_UPDATAE_AT} ${bodyTemp[0]?.date ? convertNumberToDDMMMYYYY(bodyTemp[0]?.date) : ''}` : null}
              isShowParams={true}
            />
          )
        }
        {/* {
          checkData?.cholesterol === '1' && (
            <BoxTracking
              category={Translate(languageRedux).DEVICE_CHL}
              // timePerWeek="1 per week"
              bgStatus={colorF0F0F0}
              // status="stable"
              statusColor={color848586}
              bgParam={colorF0F0F0}
              // param="96%"
              paramColor={color848586}
              // source={icTracking.ic_temperature}
            />
          )
        } */}
        {checkData?.heartrate === '1' && (
          <BoxTracking
            category={Translate(languageRedux).DEVICE_HEART_RATE}
            // timePerWeek="3 per week"
            bgStatus={bgColorHeartRate(checkStatusHeartRate())}
            status={checkStatusHeartRate()}
            statusColor={txtColorHeartRate(checkStatusHeartRate())}
            bgParam={colorF0F0F0}
            param={(heartRate || []).length > 0 ? `${heartRate[0]?.value} bpm` : null}
            paramColor={color848586}
            source={icTracking.ic_heart}
            onPress={() => NavigationService.navigate(Routes.LIST_HEART_RATE, {route: routeViewDoctor, patientId: patientId, patientToken: patientToken})}
            txtLastUpdate={(heartRate || []).length > 0 ? `${Translate(languageRedux).LAST_UPDATAE_AT} ${heartRate[0]?.date ? convertNumberToDDMMMYYYY(heartRate[0]?.date) : ''}` : null}
          />
        )}
        {/* {checkData?.hasKiosk === '1' && (
          <BoxTracking
            category={Translate(languageRedux).kiosk}
            // timePerWeek="1 per week"
            onPress={() => NavigationService.navigate(Routes.LIST_VITAL_CARE_KIT)}
          />
        )} */}
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
    marginLeft: 15
  }
})
