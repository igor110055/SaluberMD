import React, { useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  ScrollView, DeviceEventEmitter
} from 'react-native'
import {
  colorFFFFFF,
  colorF0F0F0,
  color040404,
  color3777EE,
  colorFED7D7,
  colorC6F6D5,
  colorE53E3E,
  color848586,
  color2F855A,
  colorA7A8A9
} from '../../../../constants/colors'
import Fonts from '../../../../constants/Fonts'
import { customTxt } from '../../../../constants/css'
import icTracking from '../../../../../assets/images/home_screen'
import BoxTracking from './BoxTracking'
import BoxTrackingCompact from './BoxTrackingCompact'
import Routes from '../../../../routes/Routes'
import { convertNumberToDDMMMYYYY } from '../../../../constants/DateHelpers'
import Translate from '../../../../translate'
import * as StateLocal from '../../../../state_local'
export default function Tracking({
  lsBodyPressure, lsBodyTemperature, lsBreathingVolumes,
  lsHeartRateValues, lsSpo2, lsWeight
}) {
  const [toggle, setToggle] = useState(false)
  const permissionRedux = StateLocal.permission
  const checkData = permissionRedux?.iniziativa
  const languageRedux = StateLocal.userinfo?.language_id || 'en_US'

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

  const getLastUpdate = () => {
    const weightDate = (lsWeight || []).length > 0 ? (lsWeight[0]?.date || '0') : '0'
    const bodyPressureDate = (lsBodyPressure || []).length > 0 ? (lsBodyPressure[0]?.date || '0') : '0'
    const spo2Date = (lsSpo2 || []).length > 0 ? (lsSpo2[0]?.date || '0') : '0'
    const bodyTemperatureDate = (lsBodyTemperature || []).length > 0 ? (lsBodyTemperature[0]?.date || '0') : '0'
    const heartRateDate = (lsHeartRateValues || []).length > 0 ? (lsHeartRateValues[0]?.date || '0') : '0'
    const lsDate = [
      weightDate,
      bodyPressureDate,
      spo2Date,
      bodyTemperatureDate,
      heartRateDate
    ]
    const sortDate = lsDate.sort(function (a, b) {
      return b - a
    })

    return sortDate === '0' ? null : `${Translate(languageRedux).LAST_UPDATAE_AT} ${convertNumberToDDMMMYYYY(sortDate[0])}`
  }

  const renderLongVer = () => {
    return (
      <View>
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
      </View>
    )
  }

  const renderCompactVer = () => {
    return (
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {/* {
          checkData?.corx === '1' && (
            <BoxTrackingCompact
              backgroundColor={colorFED7D7}
              source={icTracking.ic_blood}
            />
          )
        } */}
        {
          checkData?.ariax === '1' && (
            <BoxTrackingCompact
              backgroundColor={colorF0F0F0}
              source={icTracking.ic_lungs}
              // onPress={() => NavigationService.navigate(Routes.LIST_BREATHING_VOLUMES)}
            />
          )
        }
        {
          checkData?.scalx === '1' && (
            <BoxTrackingCompact
              backgroundColor={colorC6F6D5}
              source={icTracking.ic_weight}
              // onPress={() => NavigationService.navigate(Routes.LIST_WEIGHT)}
            />
          )
        }
        {
          checkData?.presx === '1' && (
            <BoxTrackingCompact
              backgroundColor={colorFED7D7}
              source={icTracking.ic_blood}
              // onPress={() => NavigationService.navigate(Routes.LIST_BODY_PRESSURE)}
            />
          )
        }
        {
          checkData?.spo2 === '1' && (
            <BoxTrackingCompact
              backgroundColor={colorF0F0F0}
              source={icTracking.ic_spo2}
              // onPress={() => NavigationService.navigate(Routes.LIST_SPO2_SCREEN)}
            />
          )
        }
        {
          checkData?.temperature === '1' && (
            <BoxTrackingCompact
              backgroundColor={colorF0F0F0}
              source={icTracking.ic_temperature}
              // onPress={() => NavigationService.navigate(Routes.LIST_BODY_TEMPERATURE)}
            />
          )
        }
        {checkData?.heartrate === '1' && (
          <BoxTrackingCompact
            backgroundColor={colorFED7D7}
            source={icTracking.ic_heart}
            // onPress={() => NavigationService.navigate(Routes.LIST_HEART_RATE)}
          />
        )}
        {/* {checkData?.hasKiosk === '1' && (
          <BoxTrackingCompact
          />
        )} */}
      </ScrollView>
    )
  }

  const _onPressToggle = () => {
    console.log(toggle)
    toggle === false && setToggle(true)
    toggle === true && setToggle(false)
  }

  const _onPressHealthProfile = () => {
    setTimeout(() => {
      DeviceEventEmitter.emit(Routes.HEALTH_PROFILE_TRACKING_SCREEN, { tracking: true })
    }, 200)
    // NavigationService.navigate(Routes.HEALTH_PROFILE_TRACKING_SCREEN)
  }

  return (
    <View style={styles.container}>
      <View style={[styles.containerBox]}>
        <TouchableOpacity onPress={_onPressToggle} style={styles.ctnCategory}>
          <View style={styles.marginL16}>
            <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
              {Translate(languageRedux).HEALTH_TRACKING}
            </Text>
          </View>
          <View style={styles.ctnIcon}>
            <View>
              {!toggle && <Image source={icTracking.ic_down} style={styles.iconStyle} />}
              {toggle && <Image source={icTracking.ic_up} style={styles.iconStyle} />}
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.ctnContent}>
          <View style={styles.marginB16}>
            <Text style={customTxt(Fonts.Regular, 14, colorA7A8A9).txt}>
              {getLastUpdate()}
            </Text>
          </View>
          {toggle === true && renderLongVer()}
          {toggle === false && renderCompactVer()}
        </View>
        <View style={styles.button}>
          <View style={styles.ctnButtonLayout}>
            <TouchableOpacity onPress={_onPressHealthProfile} style={[styles.ctnButton]}>
              <Text style={customTxt(Fonts.Bold, 14, color3777EE).txt}>
                {Translate(languageRedux).ADD_NEW_MEASUREMENT}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 16
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
  }
})