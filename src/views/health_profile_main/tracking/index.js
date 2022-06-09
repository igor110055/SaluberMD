import React, { useEffect, useState } from 'react'
import {
  StyleSheet, View, ScrollView,
  RefreshControl
} from 'react-native'
import { useSelector } from 'react-redux'
import Translate from 'translate'
import { color0B40B1, color848586, colorF0F0F0, colorFFFFFF } from 'constants/colors'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import BoxTracking from 'views/home_screen/components/DataTrackingWidget/BoxTracking'
import icTracking from '../../../../assets/images/home_screen'
import { convertNumberToDDMMMYYYY } from 'constants/DateHelpers'
import { bgColor, checkStatusBloodPressure, checkStatusBodyTemperature, checkStatusHeartRate, checkStatusSpo2, checkStatusWeight, txtColor } from '../../home_screen/components/DataTrackingWidget/Tracking'

export default function Tracking() {
  const permissionRedux = useSelector(state => state.user.permission)
  const languageRedux = useSelector(state => state.common.language)
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)

  //data tracking
  // const trackingBreathingVolumes = useSelector(state => state.common.trackingBreathingVolumes)
  const trackingWeight = useSelector(state => state.common.trackingWeight)
  const trackingBloodPressure = useSelector(state => state.common.trackingBloodPressure)
  const trackingSpo2 = useSelector(state => state.common.trackingSpo2)
  const trackingBodyTemperature = useSelector(state => state.common.trackingBodyTemperature)
  const trackingHeartRate = useSelector(state => state.common.trackingHeartRate)

  useEffect(() => {
    console.log('trackingWeight: ', trackingWeight)
    console.log('trackingBloodPressure: ', trackingBloodPressure)
    console.log('trackingSpo2: ', trackingSpo2)
    console.log('trackingBodyTemperature: ', trackingBodyTemperature)
    console.log('trackingHeartRate: ', trackingHeartRate)
  }, [trackingBloodPressure, trackingWeight, trackingSpo2, trackingBodyTemperature, trackingHeartRate])

  const getDataBloodPressure = () => {
    if ((trackingBloodPressure || []).length > 0) {
      return `${trackingBloodPressure[0]?.systolic || 0}/${trackingBloodPressure[0]?.diastolic || 0} ${trackingBloodPressure[0]?.deviceSelectedUnit || 'mmhg'}`
    }
    return null
  }

  const getDataBodyTemperature = () => {
    if ((trackingBodyTemperature || []).length > 0) {
      return `${Number(trackingBodyTemperature[0]?.temp || 0).toFixed(1)} º${trackingBodyTemperature[0]?.type || ''}`
    }
    return null
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
        {/* {
          checkData?.corx === '1' && (
            <BoxTracking
              category={Translate(languageRedux).CORX_DATA}
              onPress={() => NavigationService.navigate(Routes.LIST_CORX_DATA)}
            />
          )
        } */}
        {/* {
          checkData?.ariax === '1' && (
            <BoxTracking
              category={Translate(languageRedux).ARIAX}
              bgStatus={colorF0F0F0}
              statusColor={color848586}
              bgParam={colorF0F0F0}
              paramColor={color848586}
              source={icTracking.ic_lungs}
              onPress={() => NavigationService.navigate(Routes.LIST_BREATHING_VOLUMES, {route: routeViewDoctor, patientId: patientId})}
            />
          )
        } */}
        {
          checkData?.scalx === '1' && (
            <BoxTracking
              category={Translate(languageRedux).SCALX}
              bgStatus={colorF0F0F0}
              status={checkStatusWeight(trackingWeight)}
              statusColor={color848586}
              bgParam={colorF0F0F0}
              param={(trackingWeight || []).length > 0 ? `${trackingWeight[0].weight} ${trackingWeight[0]?.unit || ''}` : null}
              paramColor={color848586}
              source={icTracking.ic_weight}
              onPress={() => NavigationService.navigate(Routes.LIST_WEIGHT)}
              txtLastUpdate={(trackingWeight || []).length > 0 ? `${Translate(languageRedux).LAST_UPDATAE_AT} ${trackingWeight[0]?.date ? convertNumberToDDMMMYYYY(trackingWeight[0]?.date) : ''}` : null}
            />
          )
        }
        {
          checkData?.presx === '1' && (
            <BoxTracking
              category={Translate(languageRedux).PRESX}
              bgStatus={bgColor(checkStatusBloodPressure(trackingBloodPressure))}
              status={checkStatusBloodPressure(trackingBloodPressure)}
              statusColor={txtColor(checkStatusBloodPressure(trackingBloodPressure))}
              bgParam={colorF0F0F0}
              param={getDataBloodPressure(trackingBloodPressure)}
              paramColor={color848586}
              source={icTracking.ic_blood}
              onPress={() => NavigationService.navigate(Routes.LIST_BODY_PRESSURE)}
              txtLastUpdate={(trackingBloodPressure || []).length > 0 ? `${Translate(languageRedux).LAST_UPDATAE_AT} ${trackingBloodPressure[0]?.date ? convertNumberToDDMMMYYYY(trackingBloodPressure[0]?.date) : ''}` : null}
            />
          )
        }
        {
          checkData?.spo2 === '1' && (
            <BoxTracking
              category={Translate(languageRedux).DEVICE_SPO2}
              bgStatus={bgColor(checkStatusSpo2(trackingSpo2))}
              status={checkStatusSpo2(trackingSpo2)}
              statusColor={txtColor(checkStatusSpo2(trackingSpo2))}
              bgParam={colorF0F0F0}
              param={(trackingSpo2 || []).length > 0 ? `${trackingSpo2[0]?.spo2}%` : null}
              paramColor={color848586}
              source={icTracking.ic_spo2}
              onPress={() => NavigationService.navigate(Routes.LIST_SPO2_SCREEN)}
              txtLastUpdate={(trackingSpo2 || []).length > 0 ? `${Translate(languageRedux).LAST_UPDATAE_AT} ${trackingSpo2[0]?.date ? convertNumberToDDMMMYYYY(trackingSpo2[0]?.date) : ''}` : null}
            />
          )
        }
        {
          checkData?.temperature === '1' && (
            <BoxTracking
              category={Translate(languageRedux).TEMPERATURE}
              bgStatus={bgColor(checkStatusBodyTemperature(trackingBodyTemperature))}
              status={checkStatusBodyTemperature(trackingBodyTemperature)}
              statusColor={txtColor(checkStatusBodyTemperature(trackingBodyTemperature))}
              bgParam={colorF0F0F0}
              param={getDataBodyTemperature()}
              paramColor={color848586}
              source={icTracking.ic_temperature}
              onPress={() => NavigationService.navigate(Routes.LIST_BODY_TEMPERATURE)}
              txtLastUpdate={(trackingBodyTemperature || []).length > 0 ? `${Translate(languageRedux).LAST_UPDATAE_AT} ${trackingBodyTemperature[0]?.date ? convertNumberToDDMMMYYYY(trackingBodyTemperature[0]?.date) : ''}` : null}
              isShowParams={true}
            />
          )
        }
        {/* {
          checkData?.cholesterol === '1' && (
            <BoxTracking
              category={Translate(languageRedux).DEVICE_CHL}
              bgStatus={colorF0F0F0}
              statusColor={color848586}
              bgParam={colorF0F0F0}
              paramColor={color848586}
            />
          )
        } */}
        {checkData?.heartrate === '1' && (
          <BoxTracking
            category={Translate(languageRedux).DEVICE_HEART_RATE}
            bgStatus={bgColor(checkStatusHeartRate(trackingHeartRate))}
            status={checkStatusHeartRate(trackingHeartRate)}
            statusColor={txtColor(checkStatusHeartRate(trackingHeartRate))}
            bgParam={colorF0F0F0}
            param={(trackingHeartRate || []).length > 0 ? `${trackingHeartRate[0]?.value} bpm` : null}
            paramColor={color848586}
            source={icTracking.ic_heart}
            onPress={() => NavigationService.navigate(Routes.LIST_HEART_RATE)}
            txtLastUpdate={(trackingHeartRate || []).length > 0 ? `${Translate(languageRedux).LAST_UPDATAE_AT} ${trackingHeartRate[0]?.date ? convertNumberToDDMMMYYYY(trackingHeartRate[0]?.date) : ''}` : null}
          />
        )}
        {/* {checkData?.hasKiosk === '1' && (
          <BoxTracking
            category={Translate(languageRedux).kiosk}
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
    marginLeft: 15,
    marginRight: 0
  }
})
