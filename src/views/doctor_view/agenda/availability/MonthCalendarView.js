import { color040404, color0B40B1, color3777EE, color38A169, colorA7A8A9, colorF0F0F0, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import { convertDayDD, convertDay, convertYYYYMMDD, convertdddMMYYYYY, convertDMMMYYYY } from 'constants/DateHelpers'
import Fonts from 'constants/Fonts'
import React from 'react'
import {
  StyleSheet, View, Text, FlatList, RefreshControl
} from 'react-native'
import { useSelector } from 'react-redux'
import Translate from 'translate'

export default function MonthCalendarView({
  dataMonthCalendar, onRefresh, refreshing
}) {
  const languageRedux = useSelector(state => state.common.language)

  const checkDay = (date) => {
    if (convertdddMMYYYYY(date) === convertdddMMYYYYY(new Date())) {
      return true
    }
    return false
  }

  const checkToday = (date) => {
    if (convertYYYYMMDD(date) === convertYYYYMMDD(new Date())) {
      return true
    }
    return false
  }

  const renderTitleMonth = (data) => {
    return (
      <View style={styles.titleView}>
        {data?.date && (
          <Text style={[
            customTxt(Fonts.Bold, 14, checkDay(data?.date) ? color040404 : colorA7A8A9).txt
          ]}>{convertDayDD(data?.date)}</Text>
        )}
      </View>
    )
  }

  const renderTitle = () => {
    return (
      <View style={styles.titlesMonth}>
        {
          (dataMonthCalendar || []).map((value, index) => {
            if (index > 6 && index < 14) {
              return renderTitleMonth(value)
            }
          })
        }
      </View>
    )
  }

  const checkMinDay = (date) => {
    if (convertDMMMYYYY(new Date(date)) < convertDMMMYYYY(new Date())) {//C1C3C5
      return true
    }
    return false
  }

  const renderContentView = () => {
    const renderItemContent = (val, style, txtStyle) => {
      const getLsAvailable = (val?.event || []).filter(item => item?.user?.nome === null)
      const getLsScheduled = (val?.event || []).filter(item => item?.user?.nome !== null)

      return (
        <View style={[
          styles.contentView,
          style,
          val?.outDay ? styles.outDayView : null
        ]}>
          {!(val?.outDay) && (
            <Text style={[
              customTxt(Fonts.Medium, 12, color040404).txt,
              txtStyle
            ]}>{convertDay(val?.date)}</Text>
          )}
          {
            (getLsAvailable || []).length > 0 && (
              <Text
                numberOfLines={1}
                style={[
                  customTxt(Fonts.Medium, 12, val?.outDay ? colorFFFFFF : (checkMinDay(val?.date) ? colorA7A8A9 : color38A169)).txt
                ]}>{(getLsAvailable || []).length} {Translate(languageRedux).AVAILABLE}</Text>
            )
          }
          {
            (getLsScheduled || []).length > 0 && (
              <Text
                numberOfLines={1}
                style={[
                  customTxt(Fonts.Medium, 12, val?.outDay ? colorFFFFFF : (checkMinDay(val?.date) ? colorA7A8A9 : color3777EE)).txt
                ]}>{(getLsScheduled || []).length} {Translate(languageRedux).SCHEDULED}</Text>
            )
          }
        </View>
      )
    }
    return (
      <FlatList
        data={dataMonthCalendar || []}
        numColumns={7}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || false}
            onRefresh={onRefresh}
            tintColor={color0B40B1}
          />
        }
        renderItem={({ item }) => {
          return renderItemContent(
            item,
            checkToday(item?.date) ? styles.todayView : null,
            checkToday(item?.date) ? styles.txtTodayView : null,
          )
        }}
      />
    )
  }

  return (
    <View style={styles.container}>
      {renderTitle()}
      {renderContentView()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF,
    paddingLeft: 10,
    paddingRight: 10
  },
  titlesMonth: {
    flexDirection: 'row',
    backgroundColor: colorFFFFFF,
    borderBottomWidth: 1,
    borderBottomColor: colorF0F0F0,
    marginBottom: 12
  },
  titleView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8
  },
  contentView: {
    flex: 1,
    minHeight: 68,
    paddingLeft: 4,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: colorF0F0F0,
    marginBottom: 2,
    marginRight: 2
  },
  outDayView: {
    backgroundColor: colorFFFFFF
  },
  todayView: {
    backgroundColor: color040404
  },
  txtTodayView: {
    color: colorFFFFFF
  }
})
