import { color040404, color0B40B1, color3777EE, color48BB78, colorA7A8A9, colorC1C3C5, colorF0F0F0, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import { convertDateTime, convertDay, convertDayDD, convertDMMMYYYY, convertNumberTime, convertYYYYMMDD } from 'constants/DateHelpers'
import Fonts from 'constants/Fonts'
import React from 'react'
import {
  StyleSheet, View, Text, FlatList, TouchableOpacity, ScrollView,
  RefreshControl
} from 'react-native'
import moment from 'moment'

export default function WeekCalendarView({
  getWeek, onPressDetail, onRefresh, refreshing
}) {
  const renderWeekTitle = () => {
    const renderTitleView = (txt, day, isToday, date) => {
      return (
        <TouchableOpacity style={styles.titleView} onPress={() => isToday ? onPressDetail(date) : {}}>
          <Text style={[
            customTxt(Fonts.Bold, 14, isToday ? color040404 : colorA7A8A9).txt
          ]}>{txt}</Text>
          <Text style={[
            customTxt(Fonts.Bold, 14, isToday ? color040404 : colorA7A8A9).txt,
            styles.txtDay
          ]}>{day}</Text>
        </TouchableOpacity>
      )
    }

    const checkToday = (date) => {
      var timeNow = moment().add(-1, 'days').utc().valueOf()
      var time = moment(date).utc().valueOf()
      if (Number(time) > Number(timeNow)) {
        return true
      }
      return false
    }

    return (
      <View style={styles.weekTitleStyle}>
        {(getWeek || []).length > 0 && (
          getWeek.map((val) => {
            return (
              <>
                {renderTitleView(convertDayDD(val?.date), convertDay(val?.date), checkToday(val?.date), val?.date)}
              </>
            )
          })
        )}
      </View>
    )
  }

  const checkMinDay = (date) => {
    if (convertDMMMYYYY(new Date(date)) < convertDMMMYYYY(new Date())) {//C1C3C5
      return true
    }
    return false
  }

  const checkTimeSlot = (date) => {
    var timeNow = moment().add(-1, 'days').utc().valueOf()
    var time = moment(date).utc().valueOf()
    if (Number(time) > Number(timeNow)) {
      return true
    }
    return false
  }

  const RenderWeekContent = () => {
    const renderContentView = (dataContent, date, isTimeSlot) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => isTimeSlot ? onPressDetail(date) : {}}
          style={[
            dataContent?.length > 0 ? styles.contentView : styles.contentAddView
          ]}
        >
          {(dataContent || []).length > 0 ? (
            <FlatList
              data={dataContent}
              renderItem={({ item }) => {
                return (
                  <View style={[
                    styles.dayView,
                    item?.user?.nome ? styles.bookingDay : (isTimeSlot ? styles.dayAvailable : styles.minDay)
                  ]}>
                    {
                      item?.startsAt && !(item?.user?.nome) && (
                        <Text
                          // numberOfLines={1}
                          style={[
                            customTxt(Fonts.Bold, 10, colorFFFFFF).txt,
                            styles.txtDayContent
                          ]}>{(convertNumberTime(item?.startsAt)) || ''}</Text>
                      )
                    }
                    {
                      item?.user?.nome && (
                        <Text
                          numberOfLines={1}
                          style={[
                            customTxt(Fonts.Bold, 12, colorFFFFFF).txt,
                            styles.txtDayContent
                          ]}>{item?.user?.nome || ''}{` ${item?.user?.middleName}` || ' '} {item?.user?.cognome || ''}</Text>
                      )
                    }
                  </View>
                )
              }}
            />
          )
            :
            (
              null
              // <View style={[styles.dayView, styles.addDayView]}>
              //   <Text style={[
              //     customTxt(Fonts.Bold, 12, colorFFFFFF).txt,
              //     styles.txtDayContent
              //   ]}>{'Add'}</Text>
              // </View>
            )}
        </TouchableOpacity>
      )
    }

    return (
      <View style={styles.weekTitleStyle}>
        {(getWeek || []).length > 0 && (
          getWeek.map((val) => {
            return (
              <>
                {renderContentView(val?.event || [], val?.date || new Date(), checkTimeSlot(val?.date))}
              </>
            )
          })
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {renderWeekTitle()}
      <ScrollView
        contentContainerStyle={styles.marginB120}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || false}
            onRefresh={onRefresh}
            tintColor={color0B40B1}
          />
        }
      >
        <RenderWeekContent />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  marginB120: {
    paddingBottom: 120
  },
  weekTitleStyle: {
    flexDirection: 'row'
  },
  titleView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colorF0F0F0
  },
  contentView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 6
  },
  contentAddView: {
    flex: 1,
    paddingTop: 6,
    paddingBottom: 6
  },
  txtDay: {
    marginTop: 2
  },
  txtDayContent: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 4,
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dayView: {
    marginTop: 6,
    marginLeft: 6,
    marginRight: 6,
    borderRadius: 4,
    overflow: 'hidden',
    height: 32
  },
  addDayView: {
    backgroundColor: color3777EE
  },
  dayAvailable: {
    backgroundColor: color48BB78,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bookingDay: {
    backgroundColor: color040404,
    justifyContent: 'center',
    alignItems: 'center'
  },
  minDay: {
    backgroundColor: colorC1C3C5,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
