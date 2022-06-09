import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, ScrollView} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

import Translate from 'translate'
import { colorC6F6D5, colorF0F0F0, colorFED7D7, color2F855A, colorE53E3E, color848586 } from 'constants/colors'
import {convertDMMMYYYY, convertNumberToDDMMMYYYY} from 'constants/DateHelpers'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'

import icTracking from '../../../../../assets/images/home_screen'

import BoxTracking from '../../../home_screen/components/DataTrackingWidget/BoxTracking'
import { apiGetBloodPressDr, apiGetBreathingVolumesDoctor, apiGetHeartRateDr, apiGetSpo2Dr, apiGetTempDr, apiGetWeightDr } from './api'

export default function Tracking() {
  const languageRedux = useSelector(state => state.common.language)
  const surveyPatient = useSelector(state => state.common.surveyPatient)
  const dataWeight = surveyPatient?.weight
  const dataPressure = surveyPatient?.pressure

  const [lsBodyPressure, setLsBodyPressure] = useState([])
  const [lsBodyTemperature, setLsBodyTemperature] = useState([])
  const [lsBreathingVolumes, setLsBreathingVolumes] = useState([])
  const [lsHeartRateValues, setLsHeartRateValues] = useState([])
  const [lsSpo2, setLsSpo2] = useState()
  const [lsWeight, setLsWeight] = useState()
  const dispatch = useDispatch()
  var patientId = surveyPatient?.user?.id || 0

  useEffect(() => {
    callAPIDataTracking()
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
    dispatch(apiGetBloodPressDr(10, patientId)).then(res => {
      console.log('apiGetMisurazioniPresx:', res)
      const ls = res?.payload?.rilevazioni || []
      setLsBodyPressure(ls)
    }).catch(() => { })

    dispatch(apiGetTempDr(10, patientId)).then(res => {
      console.log('apiGetTempValues:', res)
      const ls = res?.payload?.data || []
      setLsBodyTemperature(ls)
    }).catch(() => { })

    dispatch(apiGetBreathingVolumesDoctor(10, patientId)).then(res => {
      console.log('apiGetBreathingVolumes:', res)
      const ls = res?.payload?.rilevazioni || []
      setLsBreathingVolumes(ls)
    }).catch(() => { })

    dispatch(apiGetHeartRateDr(10, patientId)).then(res => {
      console.log('apiGetHeartRateValues:', res)
      const ls = res?.payload?.data || []
      setLsHeartRateValues(ls)
    }).catch(() => { })

    dispatch(apiGetSpo2Dr(10, patientId)).then(res => {
      console.log('apiGetSpo2Values:', res)
      const ls = res?.payload?.data || []
      setLsSpo2(ls)
    }).catch(() => { })

    dispatch(apiGetWeightDr(10, patientId)).then(res => {
      console.log('apiGetMisurazioniScalx:', res)
      const ls = res?.payload?.rilevazioni || []
      setLsWeight(ls)
    }).catch(() => { })
  }

  const renderBody = () => {
    return (
      <View style={styles.container}>
        <BoxTracking
          category={Translate(languageRedux).ARIAX}
          timePerWeek="1 per week"
          bgStatus={colorF0F0F0}
          statusColor={color848586}
          bgParam={colorF0F0F0}
          paramColor={color848586}
          source={icTracking.ic_lungs}
          onPress={() =>
            NavigationService.navigate(Routes.LIST_BREATH_DOCTOR_VIEW)
          }
        />
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
          onPress={() => NavigationService.navigate(Routes.LIST_WEIGHT_DOCTOR_VIEW)}
          txtLastUpdate={(lsWeight || []).length > 0 ? `${Translate(languageRedux).LAST_UPDATAE_AT} ${lsWeight[0]?.date ? convertDMMMYYYY(lsWeight[0]?.date) : ''}` : null}
        />
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
          onPress={() => NavigationService.navigate(Routes.LIST_BLOOD_PRESSURE_DOCTOR_VIEW)}
          txtLastUpdate={(lsBodyPressure || []).length > 0 ? `${Translate(languageRedux).LAST_UPDATAE_AT} ${lsBodyPressure[0]?.date ? convertNumberToDDMMMYYYY(lsBodyPressure[0]?.date) : ''}` : null}
        />
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
          onPress={() => NavigationService.navigate(Routes.LIST_SPO2_DOCTOR_VIEW)}
          txtLastUpdate={(lsSpo2 || []).length > 0 ? `${Translate(languageRedux).LAST_UPDATAE_AT} ${lsSpo2[0]?.date ? convertNumberToDDMMMYYYY(lsSpo2[0]?.date) : ''}` : null}
        />
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
          onPress={() => NavigationService.navigate(Routes.LIST_BODY_TEMP_DOCTOR_VIEW)}
          txtLastUpdate={(lsBodyTemperature || []).length > 0 ? `${Translate(languageRedux).LAST_UPDATAE_AT} ${lsBodyTemperature[0]?.date ? convertNumberToDDMMMYYYY(lsBodyTemperature[0]?.date) : ''}` : null}
        />
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
          onPress={() => NavigationService.navigate(Routes.LIST_HEART_RATE_DOCTOR_VIEW)}
          txtLastUpdate={(lsHeartRateValues || []).length > 0 ? `${Translate(languageRedux).LAST_UPDATAE_AT} ${lsHeartRateValues[0]?.date ? convertNumberToDDMMMYYYY(lsHeartRateValues[0]?.date) : ''}` : null}
        />
      </View>
    )
  }

  return (
    <View>
      <ScrollView>{renderBody()}</ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 42,
    marginTop: 12,
    marginHorizontal: 20
  }
})
