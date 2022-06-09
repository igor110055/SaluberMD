import React, { useState } from 'react'
import {
  View, Text, StyleSheet, FlatList, ScrollView,
  RefreshControl, Platform
} from 'react-native'

import {
  color040404,
  color0B40B1,
  color3777EE,
  color5C5D5E,
  colorBDBDBD,
  colorF8F8F8,
  colorFFFFFF
} from '../../constants/colors'
import Fonts from '../../constants/Fonts'
import { customTxt } from '../../constants/css'
import { useSelector } from 'react-redux'
import BoxAppointment from '../home_screen/components/VisitsWidget/BoxAppointment'
import { convertNumberTime, convertDMMMYYYY } from '../../constants/DateHelpers'
import { concat } from 'lodash'
import moment from 'moment'
import NavigationService from '../../navigation'
import Routes from '../../navigation/Routes'
import NoDataView from 'components/NoDataView'
import Translate from 'translate'
import imgNoData from '../../../assets/images/nodata'

export default function UpcomingAppointment({ listAppointment, listRequest, setReload,
  listDisease, listAllergy, listMedi }) {
  const [refreshing, setRefresh] = useState(false)
  const languageRedux = useSelector(state => state.common.language)

  const renderAppointmentFlatlist = () => {

    const RenderItem = ({ item, index }) => {
      const convertTimeStart = item?.startsAt ? convertNumberTime(item?.startsAt) : ''
      const convertTimeEnd = item?.endsAt ? convertNumberTime(item?.endsAt) : ''
      const converTime = convertTimeStart + ' - ' + convertTimeEnd
      const convertDate = item?.startsAt ? convertDMMMYYYY(item?.startsAt) : ''

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
            }
          }
          if (hb - hn === 0) {
            if (minutesBook - minutesNow <= 5) {
              return true
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
      var d = moment(item?.startsAt).format('D')
      var today = moment().format('YYYY-MM-DD')
      var tomorrow = moment().add(1, 'days').endOf('day').format('YYYY-MM-DD')
      const checkDay = () => {
        if (moment(item?.startsAt).format('YYYY-MM-DD') === today) {
          return <Text style={customTxt(Fonts.SemiBold, 18, colorBDBDBD).txt}>{Translate(languageRedux).TODAY}</Text>
        }
        if (moment(item?.startsAt).format('YYYY-MM-DD') === tomorrow) {
          return <Text style={customTxt(Fonts.SemiBold, 18, colorBDBDBD).txt}>{Translate(languageRedux).TOMORROW}</Text>
        }
        else {
          return <Text style={customTxt(Fonts.SemiBold, 18, colorBDBDBD).txt}>{convertDate}</Text>
        }
      }

      const _onPressItem = () => {
        NavigationService.navigate(Routes.DETAIL_APPOINTMENT_SCREEN, {
          data: item,
          index: index,
          lsAppointment: listAppointment
        })
      }

      const _onPress5Minutes = () => {
        if (check5Minutes()) {
          NavigationService.navigate(Routes.ANAMNESIS_SCREEN, {
            data: listAppointment[index],
            disease: listDisease,
            allergy: listAllergy,
            medication: listMedi
          })
        } else {
          NavigationService.navigate(Routes.DETAIL_APPOINTMENT_SCREEN, {
            data: listAppointment[index],
            index: index,
            lsAppointment: listAppointment,
            disease: listDisease,
            allergy: listAllergy,
            medication: listMedi
          })
        }
      }

      return (
        <View style={styles.marginB16}>
          <BoxAppointment
            docName={'Doc. ' + item.doctor?.nome + ' ' + item.doctor?.cognome}
            time={check5Minutes() ? checkText5M() : converTime}
            viewStyle={styles.shadow}
            day={check5Minutes() ? null : checkDay()}
            specail={item?.doctor?.specializationStr}
            docNameColor={check5Minutes() ? colorFFFFFF : color040404}
            timeColor={check5Minutes() ? colorFFFFFF : color040404}
            specailColor={check5Minutes() ? colorFFFFFF : color040404}
            backgroundColor={check5Minutes() ? color3777EE : colorFFFFFF}
            // onPress={check5Minutes() ? _onPress5Minutes : _onPressItem}
            onPress={_onPress5Minutes}
          />
        </View>
      )
    }

    let sortByDate = ((a, b) => {
      return a.startsAt - b.startsAt
    })

    return (
      <View>
        <FlatList
          data={listAppointment.sort(sortByDate)}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderRequestAppointmentFlatlist = () => {

    const RenderItem = ({ item, index }) => {
      const sliceDay = () => {
        var t1 = item?.daySlice.slice(0, 5)
        var t2 = item?.daySlice.slice(9, 14)
        var time = concat(t1, ' - ', t2)
        return time
      }
      const convertDate = item?.date ? convertDMMMYYYY(item?.date) : ''

      const _onPressWaiting = () => {
        NavigationService.navigate(Routes.DETAIL_WAITING_SCREEN, {
          data: item,
          index: index,
          lsRequest: listRequest
        })
      }

      return (
        <View style={styles.marginB16}>
          <BoxAppointment
            docName={Translate(languageRedux).WAITING_FOR_CONFIRMATION}
            time={sliceDay()}
            day={convertDate}
            viewStyle={styles.shadow}
            specail={item?.name}
            docNameColor={color3777EE}
            timeColor={color040404}
            specailColor={color5C5D5E}
            backgroundColor={colorFFFFFF}
            onPress={_onPressWaiting}
          />
        </View>
      )
    }

    return (
      <View>
        <FlatList
          data={listRequest}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View>
        {renderAppointmentFlatlist()}
        {renderRequestAppointmentFlatlist()}
      </View>
    )
  }

  const _onRefresh = () => {
    setRefresh(true)
    setReload(Math.random())
    setTimeout(() => {
      setRefresh(false)
    }, 3000)
  }

  return (
    <View style={styles.flex}>
      {(listAppointment || []).length === 0 &&
        (listRequest || []).length === 0 &&
        <NoDataView
          imageSource={imgNoData.img_nodata_upcoming}
          text={Translate(languageRedux).UPCOMING_NO_DATA}
          noDataViewStyle={styles.ctnNoDataImg}
        />}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={_onRefresh}
            tintColor={color0B40B1}
          />
        }
        style={styles.container}>
        {renderBody()}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  container: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: 20
  },
  shadow: {
    shadowColor: Platform.OS === 'ios' ? '#000' : '#6b6b6b',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3
  },
  marginB16: {
    marginBottom: 16
  },
  ctnNoDataImg: {
    top: 48
  }
})
