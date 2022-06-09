import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image, DeviceEventEmitter} from 'react-native'
import { useSelector } from 'react-redux'

import Translate from 'translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import { color040404, color3777EE, color38A169, color5C5D5E, colorA7A8A9, colorFFFFFF } from 'constants/colors'

import icGlobal from '../../../../../assets/images/global'
import Routes from 'navigation/Routes'
import NavigationService from 'navigation'

export default function TodayActivities({listTodayAM, listTodayPM, listAppointmentAM, listAppointmentPM}) {
  const languageRedux = useSelector(state => state.common.language)

  var data =
    (listTodayAM || []).length +
    (listTodayPM || []).length +
    (listAppointmentAM || []).length +
    (listAppointmentPM || []).length

  const renderBox = () => {
    return (
      <View style={styles.ctnBox}>
        <View style={styles.todayAM}>
          <Text style={[customTxt(Fonts.Regular, 12, colorA7A8A9).txt, styles.marginB4]}>
            {Translate(languageRedux).TODAY} AM
          </Text>
          <Text style={customTxt(Fonts.SemiBold, 16, color38A169).txt}>
            {(listTodayAM || []).length} {Translate(languageRedux).SLOTS}
          </Text>
          {(listAppointmentAM || []).length > 0 && <Text style={customTxt(Fonts.SemiBold, 12, color5C5D5E).txt}>
            {(listAppointmentAM || []).length} {Translate(languageRedux).appuntamenti}
          </Text>}
          {(listAppointmentAM || []).length === 0 && <Text style={customTxt(Fonts.SemiBold, 12, color5C5D5E).txt}>
            {Translate(languageRedux).no} {Translate(languageRedux).appuntamenti}
          </Text>}
        </View>
        <View style={styles.todayPM}>
          <Text style={[customTxt(Fonts.Regular, 12, colorA7A8A9).txt, styles.marginB4]}>
            {Translate(languageRedux).TODAY} PM
          </Text>
          <Text style={customTxt(Fonts.SemiBold, 16, color38A169).txt}>
            {(listTodayPM || []).length} {Translate(languageRedux).SLOTS}
          </Text>
          {(listAppointmentPM || []).length > 0 && <Text style={customTxt(Fonts.SemiBold, 12, color5C5D5E).txt}>
            {(listAppointmentPM || []).length} {Translate(languageRedux).appuntamenti}
          </Text>}
          {(listAppointmentPM || []).length === 0 && <Text style={customTxt(Fonts.SemiBold, 12, color5C5D5E).txt}>
            {Translate(languageRedux).no} {Translate(languageRedux).appuntamenti}
          </Text>}
        </View>
      </View>
    )
  }

  const _onPressSeeAll = () => {
    setTimeout(() => {
        DeviceEventEmitter.emit(Routes.AGENDA_DOCTOR_VIEW, { availability: true })
      }, 1000)
      NavigationService.navigate(Routes.AGENDA_DOCTOR_VIEW)
  }

  const renderViewFirstTime = () => {
    return (
      <View style={styles.firstTime}>
        <Text style={customTxt(Fonts.Regular, 16, color5C5D5E).txt}>
          {Translate(languageRedux).TODAY_ACTIVITIES_FIRST_TIME_1}
        </Text>
        <TouchableOpacity onPress={_onPressSeeAll}>
          <Text style={customTxt(Fonts.SemiBold, 16, color3777EE).txt}>
            {Translate(languageRedux).TODAY_ACTIVITIES_FIRST_TIME_2}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.ctnTitle}>
        <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
          {Translate(languageRedux).TODAY_ACTIVITES}
        </Text>
        {data > 0 && (
          <TouchableOpacity onPress={_onPressSeeAll} style={styles.flexRow}>
            <Text style={customTxt(Fonts.SemiBold, 16, color3777EE).txt}>
              {Translate(languageRedux).AVAILABILITY}
            </Text>
            <Image source={icGlobal.ic_arrow_right} style={styles.iconStyle} />
          </TouchableOpacity>
        )}
      </View>
      {data === 0 && renderViewFirstTime()}
      {data > 0 && renderBox()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginHorizontal: 20
  },
  ctnTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  flexRow: {
    flexDirection: 'row'
  },
  marginB4: {
    marginBottom: 4
  },
  ctnBox: {
    backgroundColor: colorFFFFFF,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9,
    flexDirection: 'row'
  },
  todayAM: {
    flex: 1
  },
  todayPM: {
    flex: 1
  },
  firstTime: {
    padding: 16,
    backgroundColor: colorFFFFFF,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9
  }
})
