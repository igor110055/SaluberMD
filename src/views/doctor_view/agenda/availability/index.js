import React from 'react'
import {
  StyleSheet, View, Text, TouchableOpacity,
  Image
} from 'react-native'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import { color040404, colorDDDEE1, colorF8F8F8, colorFFFFFF } from 'constants/colors'
import { DropboxView } from '../components/DropboxView'
import imgAgenda from '../../../../../assets/images/agenda'
import WeekCalendarView from './WeekCalendarView'
import MonthCalendarView from './MonthCalendarView'
import { useSelector } from 'react-redux'
import Translate from 'translate'
import { convertMonthMMMM, convertWeek, convertYear } from 'constants/DateHelpers'

export default function AvailabilityAgendaScreen({
  isLoading, setLoading,
  typeDrop, onPressChangeTypeCalendar,
  dateSelected, getWeek, onPressChangeDate,
  refreshing, setRefresh, onRefresh,
  dataMonthCalendar, onPressDetail,
  lsToday, onPressLinking
}) {

  const languageRedux = useSelector(state => state.common.language)

  const renderDropBox = () => {
    const getNameDropMonth = () => {
      if (typeDrop?.type === 'month') {
        return `${convertMonthMMMM(dateSelected) || ''} ${convertYear(dateSelected || new Date())}`
      }
      return `${Translate(languageRedux).week} ${convertWeek(dateSelected) || ''}/${convertYear(dateSelected || new Date())}`
    }
    return (
      <View style={styles.dropboxView}>
        <DropboxView
          txt={typeDrop?.name || Translate(languageRedux).week}
          onPress={onPressChangeTypeCalendar}
        />
        <DropboxView
          txt={getNameDropMonth()}
          styleView={styles.marginLeft8}
          onPress={onPressChangeDate}
        />
        <TouchableOpacity style={styles.touchLink} onPress={onPressLinking}>
          <Image source={imgAgenda.ic_link_agenda} style={styles.imgLink} />
        </TouchableOpacity>
      </View>
    )
  }

  const RenderCalendar = () => {
    switch (typeDrop?.type) {
      case 'month':
        return (
          <MonthCalendarView
          dataMonthCalendar={dataMonthCalendar}
          onPressDetail={(val) => onPressDetail(val)}
          onRefresh={onRefresh}
            refreshing={refreshing}
          />
        )
      default:
        return (
          <WeekCalendarView
            getWeek={getWeek}
            onPressDetail={(val) => onPressDetail(val)}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        )
    }
  }

  const countFreeToday = () => {
    const countToday = (lsToday || []).filter(function (item) {
      return item?.user?.nome === null
    })
    return (countToday || []).length
  }

  // function handleScroll(event) {
  //   console.log('event.nativeEvent.contentOffset.y || 0: ', event.nativeEvent.contentOffset.y || 0)
  // }

  return (
    <View style={styles.container}>
      <View
        style={styles.scrolldrop}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={refreshing || false}
        //     onRefresh={onRefresh}
        //     tintColor={color0B40B1}
        //   />
        // }
      >
        <Text style={[
          customTxt(Fonts.Medium, 16, color040404).txt,
          styles.txtTextTop
        ]}>{`${Translate(languageRedux).FREE_SLOT_FOR_TODAY} (${countFreeToday()})`}</Text>
        {renderDropBox()}
        <RenderCalendar />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  fullView: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  txtTextTop: {
    marginTop: 16,
    marginLeft: 20
  },
  scrolldrop: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  dropboxView: {
    flexDirection: 'row',
    marginTop: 8,
    marginLeft: 20,
    marginBottom: 8,
    alignItems: 'center',
    backgroundColor: colorF8F8F8
  },
  marginLeft8: {
    marginLeft: 8
  },
  touchLink: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    overflow: 'hidden',
    marginLeft: 8,
    padding: 12,
    backgroundColor: colorFFFFFF
  },
  imgLink: {
    width: 24,
    height: 24
  }
})
