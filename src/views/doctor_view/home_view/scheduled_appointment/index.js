import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image, FlatList, DeviceEventEmitter} from 'react-native'
import {useSelector} from 'react-redux'
import moment from 'moment'

import {
  color040404,
  color333333,
  color3777EE,
  color5C5D5E,
  color848586,
  colorA7A8A9,
  colorF0F0F0,
  colorFFFFFF,
  colorC6F6D5,
  colorFED7D7,
  color2F855A,
  colorE53E3E
} from 'constants/colors'
import {customTxt} from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from 'translate'
import {convertDMMMYYYY, convertNumberTime} from 'constants/DateHelpers'
import Routes from 'navigation/Routes'
import NavigationService from 'navigation'

import icGlobal from '../../../../../assets/images/global'
import icDoc from '../../../../../assets/images/document'

export default function ScheduledAppointment({data}) {
  const languageRedux = useSelector(state => state.common.language)

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

  const BoxAppointment = ({day, timeStart, timeEnd, age,
    firstName, lastName, lastMeasurement, timeRequest, statusColorSPO2,
    bgStatusSPO2, statusSPO2, statusEKG, statusBP, statusW, bgStatusEKG,
    bgStatusBP, bgStatusW, statusColorEKG, statusColorBP, statusColorW, onPress}) => {
    const txtBgStatus = { backgroundColor: bgStatusSPO2 }
    const txtBgStatusEKG = { backgroundColor: bgStatusEKG }
    const txtBgStatusBP = { backgroundColor: bgStatusBP }
    const txtBgStatusW = { backgroundColor: bgStatusW }
    return (
      <TouchableOpacity onPress={onPress} style={styles.ctnBoxAppointment}>
        <View style={styles.line1Box}>
          <View>
            <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>
              {day}
            </Text>
            <View style={styles.flexRow}>
              {(timeStart || []).length > 0 && (
                <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
                  {timeStart}
                </Text>
              )}
              {(timeEnd || []).length > 0 && (
                <Text style={customTxt(Fonts.SemiBold, 16, colorA7A8A9).txt}>
                  {' '}
                  {'-'} {timeEnd}
                </Text>
              )}
              {(timeRequest || []).length > 0 && (
                <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
                  {timeRequest}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.center}>
            <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>
              {age} {Translate(languageRedux).years} {Translate(languageRedux).OLD}
            </Text>
            <Text style={customTxt(Fonts.SemiBold, 16, color333333).txt}>
              {firstName} {lastName}
            </Text>
          </View>
        </View>
        {/* <View style={styles.line2Box}>
          <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>
            Last measurement
          </Text>
          <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
            2 week ago
          </Text>
        </View> */}
        <View style={styles.line3Box}>
          <View style={styles.marginR4}>
            <Text style={customTxt(Fonts.Regular, 12, color040404).txt}>
              {Translate(languageRedux).DEVICE_SPO2}
            </Text>
            <View style={[styles.boxStatus, txtBgStatus]}>
              <Text style={[customTxt(Fonts.SemiBold, 12, statusColorSPO2).txt]}>
                {statusSPO2}
              </Text>
            </View>
          </View>
          {/* <View>
            <Text style={customTxt(Fonts.Regular, 12, color040404).txt}>
              {Translate(languageRedux).DEVICE_EKG}
            </Text>
            <View style={[styles.boxStatus, txtBgStatusEKG]}>
              <Text style={customTxt(Fonts.SemiBold, 12, statusColorEKG).txt}>
                {statusEKG}
              </Text>
            </View>
          </View> */}
          <View style={styles.marginR4}>
            <Text style={customTxt(Fonts.Regular, 12, color040404).txt}>
              {Translate(languageRedux).SCALX}
            </Text>
            <View style={[styles.boxStatus, txtBgStatusW]}>
              <Text style={customTxt(Fonts.SemiBold, 12, statusColorW).txt}>
                {statusW}
              </Text>
            </View>
          </View>
          <View style={styles.marginR4}>
            <Text style={customTxt(Fonts.Regular, 12, color040404).txt}>
              {Translate(languageRedux).DEVICE_BLOOD_PRESSURE}
            </Text>
            <View style={[styles.boxStatus, txtBgStatusBP]}>
              <Text style={[customTxt(Fonts.SemiBold, 12, statusColorBP).txt, styles.textAlignCenter]}>
                {statusBP}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const RenderItem = ({item}) => {
    const convertDate = item?.startsAt ? convertDMMMYYYY(item?.startsAt) : ''
    const convertTimeStart = item?.startsAt ? convertNumberTime(item?.startsAt) : ''
    const convertTimeEnd = item?.endsAt ? convertNumberTime(item?.endsAt) : ''
    // check Today Tomorrow
    var today = moment().format('YYYY-MM-DD')
    var tomorrow = moment().add(1, 'days').endOf('day').format('YYYY-MM-DD')
    const checkDay = () => {
      if (moment(item?.startsAt).format('YYYY-MM-DD') === today) {
        return <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>{Translate(languageRedux).TODAY}</Text>
      }
      if (moment(item?.startsAt).format('YYYY-MM-DD') === tomorrow) {
        return <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>{Translate(languageRedux).TOMORROW}</Text>
      }
      else {
        return <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>{convertDate}</Text>
      }
    }
    const checkStatusSpo2 = () => {
      if ((item?.lastDataTracking?.SPO2 || []).length > 1) {
        if (Number(item?.lastDataTracking?.SPO2[0]?.value) > 94) {
          return typeStatus.growing
        } else if (Number(item?.lastDataTracking?.SPO2[0]?.value) < 94) {
          return typeStatus.decreasing
        }
        return typeStatus.stable
      }
      return typeStatus.stable
    }
    const checkStatusBloodPressure = () => {
      if ((item?.lastDataTracking?.BLOOD_PRESSURE || []).length > 1) {
        if (Number(item?.lastDataTracking?.BLOOD_PRESSURE[0]?.systolic) - Number(item?.lastDataTracking?.BLOOD_PRESSURE[1]?.systolic) > 10) {
          return typeStatus.growing
        } else if (Number(item?.lastDataTracking?.BLOOD_PRESSURE[1]?.systolic) - Number(item?.lastDataTracking?.BLOOD_PRESSURE[0]?.systolic) > 10) {
          return typeStatus.decreasing
        }
        return typeStatus.stable
      }
      return Translate(languageRedux).NO_DATA
    }
    const checkStatusWeight = () => {
      if ((item?.lastDataTracking?.WEIGHT || []).length > 1) {
        if (Number(item?.lastDataTracking?.WEIGHT[0]?.value) > Number(item?.lastDataTracking?.WEIGHT[1]?.value) + 1) {
          return typeStatus.growing
        } else if (Number(item?.lastDataTracking?.WEIGHT[0]?.value) < Number(item?.lastDataTracking?.WEIGHT[1]?.value) - 1) {
          return typeStatus.decreasing
        }
        return typeStatus.stable
      }
      return Translate(languageRedux).NO_DATA
    }
    const _onPressItem = () => {
      NavigationService.navigate(Routes.CONSULTATION_LOBBY_SCREEN, {
        data: item
      })
    }
    const renderAge = () => {
      var yearNow = moment().format('YYYY')
      var yearUser = moment(item?.user?.birthdate).format('YYYY')
      return yearNow - yearUser
    }
    return (
      <View>
        <BoxAppointment
          day={checkDay()}
          lastName={item?.user?.cognome || ''}
          firstName={item?.user?.nome || ''}
          timeStart={convertTimeStart}
          timeEnd={convertTimeEnd}
          statusSPO2={
            (item?.lastDataTracking?.SPO2 || []).length > 0
              ? `${item?.lastDataTracking?.SPO2[0]?.value}%`
              : Translate(languageRedux).NO_DATA
          }
          bgStatusSPO2={bgColor(checkStatusSpo2())}
          statusColorSPO2={txtColor(checkStatusSpo2())}
          statusBP={checkStatusBloodPressure()}
          bgStatusBP={bgColor(checkStatusBloodPressure())}
          statusColorBP={txtColor(checkStatusBloodPressure())}
          statusW={checkStatusWeight()}
          bgStatusW={bgColor(checkStatusWeight())}
          statusColorW={txtColor(checkStatusWeight())}
          onPress={_onPressItem}
          age={renderAge()}
        />
      </View>
    )
  }

  const renderListAppointment = () => {
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
        DeviceEventEmitter.emit(Routes.AGENDA_DOCTOR_VIEW, { appointment: true })
      }, 1000)
    NavigationService.navigate(Routes.AGENDA_DOCTOR_VIEW)
  }

  const renderViewFirstTime = () => {
    return (
      <View style={styles.firstTime}>
        <Image source={icDoc.ic_choose_date} style={styles.iconCalender} />
        <Text style={[customTxt(Fonts.Regular, 16, color5C5D5E).txt, styles.ctnText]}>
          {Translate(languageRedux).FIRST_TIME_APPOINTMENT_DOCTOR}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.ctnTitle}>
        <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
          {Translate(languageRedux).SCHEDULED_APPOINTMENTS}
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
      {(data || []).length > 0 && renderListAppointment()}
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
  ctnBoxAppointment: {
    backgroundColor: colorFFFFFF,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
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
  line1Box: {
    flexDirection: 'row'
  },
  divider: {
    width: 1,
    borderWidth: 1,
    borderColor: colorF0F0F0,
    marginHorizontal: 8
  },
  line2Box: {
    marginTop: 8
  },
  line3Box: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  boxStatus: {
    backgroundColor: colorF0F0F0,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 4
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
    elevation: 9,
    alignItems: 'center'
  },
  iconCalender: {
    height: 56,
    width: 56,
    marginBottom: 16
  },
  ctnText: {
    textAlign: 'center'
  },
  textAlignCenter: {
    textAlign: 'center'
  },
  marginR4: {
    marginRight: 4
  }
})
