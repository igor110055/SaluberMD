import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import { colorFFFFFF, color040404, color5C5D5E, color3777EE, colorF0F0F0, colorDDDEE1, colorF8F8F8, colorBDBDBD } from '../../../../constants/colors'
import Fonts from '../../../../constants/Fonts'
import { customTxt } from '../../../../constants/css'
import BoxAppointment from './BoxAppointment'
import { useSelector } from 'react-redux'
import { convertNumberTime, convertDMMMYYYY } from '../../../../constants/DateHelpers'
import moment from 'moment'
import { concat } from 'lodash'
import { cloneDeep } from 'lodash'
import Translate from '../../../../translate'
import NavigationService from '../../../../routes'
import Routes from '../../../../routes/Routes'

export default function Apointment({lsAppointmentRedux, onPressDirectCall}) {
  // const lsAppointmentRedux = []//useSelector(state => state.common.appointment)
  const lsRequestRedux = []//useSelector(state => state.common.lsRequest)
  const languageRedux = 'en_US'//useSelector(state => state.common.language)
  const [lsData, setLsAppointment] = useState(cloneDeep([]))

  useEffect(() => {
    const resetView = setInterval(() => {
      // setLsAppointment(lsAppointmentRedux)
    }, 1000 * 60)

    return () => clearInterval(resetView)
  }, [])

  useEffect(() => {
    setLsAppointment(lsAppointmentRedux)
  }, [lsAppointmentRedux])

  const renderMorethan2 = () => {
    return (
      <TouchableOpacity onPress={_onPress2More} style={[styles.ctnMorethan2]}>
        <View style={styles.ctnButtonMorethan2}>
          <Text style={customTxt(Fonts.Regular, 16, color5C5D5E).txt}>
            {(lsData || []).length + (lsRequestRedux || []).length - 1}{' '}
            {Translate(languageRedux).MORE_APPOINTMENT}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  const _onPress2More = () => {
    // NavigationService.navigate(Routes.VISIT_MAIN_SCREEN, { typeView: 'home' })
  }

  const renderBoxAppointment = (index) => {
    const convertTimeStart = lsData[index]?.startsAt ? convertNumberTime(lsData[index]?.startsAt) : ''
    const convertTimeEnd = lsData[index]?.endsAt ? convertNumberTime(lsData[index]?.endsAt) : ''
    const converTime = convertTimeStart + ' - ' + convertTimeEnd
    const convertDate = lsData[index]?.startsAt ? convertDMMMYYYY(lsData[index]?.startsAt) : ''

    // check Starting in 5 minutes
    var hn = moment().format('H')
    var minutesNow = moment().format('m')
    var bookTime = convertTimeStart
    var hb = bookTime.slice(0, 2)
    var minutesBook = bookTime.slice(3, 5)
    const check5Minutes = () => {
      if (d === dn) {
        if (hb - hn === 1) {
          if (minutesBook - minutesNow <= -55) {
            return true
          } else {
            return false
          }
        }
        if (hb - hn === 0) {
          if (minutesBook - minutesNow <= 5) {
            return true
          } else {
            return false
          }
        }
      }
    }
    const checkText5M = () => {
      if (d === dn) {
        if (hb - hn === 0) {
          if (minutesBook - minutesNow <= 0) {
            return <Text>{Translate(languageRedux).STARTING_NOW}</Text>
          }
          if (minutesBook - minutesNow <= 5 && minutesBook - minutesNow > 0) {
            return <Text>{Translate(languageRedux).STARTING_IN} {minutesBook - minutesNow} minutes</Text>
          }
        }
        if (hb - hn === 1) {
          if (minutesBook - minutesNow === -55) {
            return <Text>{Translate(languageRedux).START_5M}</Text>
          }
          if (minutesBook - minutesNow === -56) {
            return <Text>{Translate(languageRedux).START_4M}</Text>
          }
          if (minutesBook - minutesNow === -57) {
            return <Text>{Translate(languageRedux).START_3M}</Text>
          }
          if (minutesBook - minutesNow === -58) {
            return <Text>{Translate(languageRedux).START_2M}</Text>
          }
          if (minutesBook - minutesNow === -59) {
            return <Text>{Translate(languageRedux).START_1M}</Text>
          }
        }
      }
    }
    // check Today Tomorrow
    var dn = moment().format('D')
    var mn = moment().format('M')
    var d = moment(lsData[index]?.startsAt).format('D')
    var m = moment(lsData[index]?.startsAt).format('M')
    const checkDay = () => {
      if (mn === m) {
        if (d - dn === 1) {
          return <Text style={customTxt(Fonts.SemiBold, 18, colorBDBDBD).txt}>{Translate(languageRedux).TOMORROW}</Text>
        }
        if (d - dn === 0) {
          return <Text style={customTxt(Fonts.SemiBold, 18, colorBDBDBD).txt}>{Translate(languageRedux).TODAY}</Text>
        }
        else {
          return <Text style={customTxt(Fonts.SemiBold, 18, colorBDBDBD).txt}>{convertDate}</Text>
        }
      }
    }

    const _onPressItem = () => {
      console.log('Touch item')
      NavigationService.navigate(Routes.DETAIL_APPOINTMENT_SCREEN, {
        data: lsData[index]
      })
    }

    const _onPress5Minutes = () => {
      // NavigationService.navigate(Routes.ANAMNESIS_SCREEN, {
      //   data: lsData[index]
      // })
    }

    return (
      <View>
        <BoxAppointment
          docName={'Doc. ' + lsData[index].doctor?.nome + ' ' + lsData[index].doctor?.cognome}
          time={check5Minutes() ? checkText5M() : converTime}
          day={check5Minutes() ? null : checkDay()}
          specail={lsData[index].doctor?.specializationStr}
          docNameColor={check5Minutes() ? colorFFFFFF : color040404}
          timeColor={check5Minutes() ? colorFFFFFF : color040404}
          specailColor={check5Minutes() ? colorFFFFFF : color040404}
          backgroundColor={check5Minutes() ? color3777EE : colorFFFFFF}
          onPress={() => check5Minutes() ? _onPress5Minutes(index) : _onPressItem(index)}
          border={true}
          viewStyle={styles.marginB8}
        />
      </View>
    )
  }

  const renderBoxRequest = (index) => {
    const sliceDay = () => {
      var t1 = lsRequestRedux[index]?.daySlice.slice(0, 5)
      var t2 = lsRequestRedux[index]?.daySlice.slice(9, 14)
      var time = concat(t1, ' - ', t2)
      return time
    }
    const convertDate = lsRequestRedux[index]?.date ? convertDMMMYYYY(lsRequestRedux[index]?.date) : ''

    const _onPressWaiting = () => {
      // NavigationService.navigate(Routes.DETAIL_WAITING_SCREEN, {
      //   data: lsRequestRedux[index]
      // })
    }
    return (
      <View>
        <BoxAppointment
          docName={Translate(languageRedux).WAITING_FOR_CONFIRMATION}
          time={sliceDay()}
          day={convertDate}
          specail={lsRequestRedux[index]?.name}
          docNameColor={color3777EE}
          timeColor={color040404}
          specailColor={color5C5D5E}
          backgroundColor={colorFFFFFF}
          onPress={_onPressWaiting}
          border={true}
          viewStyle={styles.marginB8}
        />
      </View>
    )
  }

  const _onPressDirectCall = () => {
    onPressDirectCall()
    // NavigationService.navigate(Routes.VISITS_DIRECT_CALL_SCREEN)
  }

  const _onPressNewAppointment = () => {
    NavigationService.navigate(Routes.NEW_APPOINTMENT_SCREEN)
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerBox}>
        <View style={styles.ctnCategory}>
          <View style={styles.marginL16}>
            <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
              Visits
            </Text>
          </View>
        </View>
        <View style={styles.ctnContent}>
          {lsData.length > 0 && renderBoxAppointment(0)}
          {lsData.length > 1 && lsData.length < 3 && ((lsRequestRedux.length + lsData.length) < 3) && renderBoxAppointment(1)}
          {lsRequestRedux.length > 0 && lsData.length < 2 && renderBoxRequest(0)}
          {lsRequestRedux.length > 1 && lsData.length === 0 && lsRequestRedux.length < 3 && renderBoxRequest(1)}
          {(lsData.length + lsRequestRedux.length >= 3) && renderMorethan2()}
        </View>
        <View style={styles.button}>
          <View style={styles.ctnButtonLayout}>
            <TouchableOpacity
              onPress={_onPressDirectCall}
              style={[styles.ctnButton]}>
              <Text style={customTxt(Fonts.Bold, 14, color3777EE).txt}>
                {Translate(languageRedux).direct_call}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.flexView}>
            <TouchableOpacity onPress={_onPressNewAppointment} style={styles.ctnButton2}>
              <Text style={customTxt(Fonts.Bold, 14, color3777EE).txt}>
                {Translate(languageRedux).NEW_APPOINTMENT}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  flexView: {
    flex: 1
  },
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
    height: 48,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colorF0F0F0
  },
  marginL16: {
    marginLeft: 16
  },
  marginB8: {
    marginBottom: 8
  },
  ctnContent: {
    marginTop: 16,
    marginHorizontal: 16
  },
  ctnButton: {
    height: 40,
    width: 122,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: color3777EE
  },
  ctnButtonLayout: {
    marginRight: 16
  },
  ctnButton2: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: color3777EE
  },
  button: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 16,
    justifyContent: 'center',
    marginLeft: 16,
    marginRight: 16
  },
  ctnMorethan2: {
    height: 56,
    borderRadius: 12,
    backgroundColor: colorF8F8F8,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    justifyContent: 'center',
    marginBottom: 8
  },
  ctnText: {
    marginLeft: 20,
    marginTop: 16,
    marginBottom: 22
  },
  ctnDayTime: {
    flexDirection: 'row',
    marginTop: 7,
    alignItems: 'center'
  },
  ctnSpecial: {
    marginTop: 5
  },
  ctnButtonMorethan2: {
    marginLeft: 16
  },
  iconStyle: {
    height: 24,
    width: 24
  }
})
