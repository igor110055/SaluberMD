import React from 'react'
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, DeviceEventEmitter } from 'react-native'
import { useSelector } from 'react-redux'
import moment from 'moment'

import { color040404, color3777EE, color5C5D5E, colorA7A8A9, colorE53E3E, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from 'translate'
import { convertDMMMYYYY, convertNumberTime } from 'constants/DateHelpers'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'

import icGlobal from '../../../../../assets/images/global'

export default function RecentVisits({ data, onPressHereSomeTips }) {
  const languageRedux = useSelector(state => state.common.language)

  const RenderItemBox = ({ name, day, status, onPress, time }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.ctnBox}>
        <Text style={[customTxt(Fonts.Regular, 12, colorA7A8A9).txt, styles.marginB4]}>
          {day} {time}
        </Text>
        <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>{name}</Text>
        <Text style={customTxt(Fonts.SemiBold, 12, color3777EE).txt}>{status}</Text>
      </TouchableOpacity>
    )
  }

  const RenderItem = ({ item }) => {
    var today = moment().format('YYYY-MM-DD')
    const checkDay = () => {
      if (moment(Number(item?.date)).format('YYYY-MM-DD') === today) {
        return Translate(languageRedux).TODAY
      } else {
        return convertDMMMYYYY(Number(item?.date))
      }
    }

    const convertStartTime = item?.startCallDate ? convertNumberTime(Number(item?.startCallDate)) : ''
    const dateTime = convertStartTime

    const _onPressItem = () => {
      if (item?.summarySaved === 1) {
        NavigationService.navigate(Routes.DETAIL_HISTORY_APPOINTMENT_DOCTOR, {
          data: item
        })
      } else {
        NavigationService.navigate(Routes.POST_CALL_SCREEN, {
          data: item,
          routeDoctor: true,
          routeViewHome: true
        })
      }
    }

    var hourPlus2 = Number(moment(Number(item?.endCallDate)).add(+2, 'hours').format('HHmm'))
    var hour = Number(moment().format('HHmm'))
    var minuteNow = Number(moment().format('mm'))
    var hourNow = Number(moment().format('HH'))
    var hour2 = Number(moment(Number(item?.endCallDate)).add(+2, 'hours').format('HH'))

    const checkMinuteLeft = () => {
      if (hour2 - hourNow === 2) {
        return 60 - minuteNow + 60
      }
      if (hour2 - hourNow === 1) {
        return 60 - minuteNow
      }
    }

    const checkStatus = () => {
      if (item?.summarySaved === 1) {
        return Translate(languageRedux).COMPLETED
      } else {
        if (moment(Number(item?.startCallDate)).format('YYYY-MM-DD') === today) {
          if (hour <= hourPlus2) {
            return (
              <Text style={customTxt(Fonts.SemiBold, 12, colorE53E3E).txt}>
                {Translate(languageRedux).DRAFT} |{' '}
                {checkMinuteLeft()} {Translate(languageRedux).MINS_LEFT}
              </Text>
            )
          } else {
            return (
              <Text style={customTxt(Fonts.SemiBold, 12, colorE53E3E).txt}>
                {Translate(languageRedux).DRAFT} |{' '}
                {Translate(languageRedux).OVERDUE}
              </Text>
            )
          }
        } else {
          return (
            <Text style={customTxt(Fonts.SemiBold, 12, colorE53E3E).txt}>
              {Translate(languageRedux).DRAFT} |{' '}
              {Translate(languageRedux).OVERDUE}
            </Text>
          )
        }
      }
    }

    return (
      <View>
        <RenderItemBox
          name={item?.patient}
          day={checkDay()}
          status={checkStatus()}
          onPress={_onPressItem}
          time={dateTime}
        />
      </View>
    )
  }

  const renderFlatlist = () => {
    return (
      <View>
        <FlatList
          data={data}
          horizontal={true}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const _onPressSeeAll = () => {
    setTimeout(() => {
      DeviceEventEmitter.emit(Routes.AGENDA_DOCTOR_VIEW, { history: true })
    }, 1000)
    setTimeout(() => {
      NavigationService.navigate(Routes.AGENDA_DOCTOR_VIEW)
    }, 500)
    NavigationService.popToRoot()
  }

  const renderViewFirstTime = () => {
    return (
      <View style={styles.firstTime}>
        <Text style={customTxt(Fonts.Regular, 16, color5C5D5E).txt}>
          This is the place for the most recent visits, looks a bit empty now, but don't worry,
          <View style={styles.textHST}>
            <TouchableOpacity onPress={onPressHereSomeTips} >
              <Text style={[customTxt(Fonts.SemiBold, 16, color3777EE).txt, styles.lineHeight24]}>Here some tips </Text>
            </TouchableOpacity>
            <Text style={[customTxt(Fonts.Regular, 16, color5C5D5E).txt, styles.lineHeight24]}>on how to use them ;)</Text>
          </View>
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.ctnTitle}>
        <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
          {Translate(languageRedux).RECENT_VISITS}
        </Text>
        {(data || []).length > 0 && (
          <TouchableOpacity onPress={_onPressSeeAll} style={styles.flexRow}>
            <Text style={customTxt(Fonts.SemiBold, 16, color3777EE).txt}>
              {Translate(languageRedux).SEE_ALL}
            </Text>
            <Image source={icGlobal.ic_arrow_right} style={styles.iconStyle} />
          </TouchableOpacity>
        )}
      </View>
      {(data || []).length === 0 && renderViewFirstTime()}
      {(data || []).length > 0 && renderFlatlist()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginHorizontal: 20
  },
  ctnBox: {
    backgroundColor: colorFFFFFF,
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9
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
  },
  textHST: {
    flexDirection: 'row'
  },
  lineHeight24: {
    lineHeight: 24
  }
})
