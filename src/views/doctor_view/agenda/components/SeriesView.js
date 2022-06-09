import { color040404, color3777EE, colorC1C3C5, colorF0F0F0, colorFFFFFF } from 'constants/colors'
import React from 'react'
import {
  StyleSheet, View, Text, Dimensions, TouchableOpacity, Platform
} from 'react-native'
import { DropboxView } from './DropboxView'
import imgService from '../../../../../assets/images/services'
import imgHome from '../../../../../assets/images/home_screen'
import Translate from 'translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import _ from 'lodash'
import { convertDMMMYYYY, convertNumberTime } from 'constants/DateHelpers'

export default function SeriesView({
  languageRedux, weekDay, onPressWeekDay,
  duration, onPressDuration,
  startDate, endDate,
  onPressStartDate, onPressEndDate,
  onPressStartTime, onPressEndTime,
  startTime, endTime,
  onPressAdd
}) {
  const renderDropView = (title, content, img, style, onPress, isValidate) => {
    return (
      <View style={[
        styles.itemDropView,
        style
      ]}>
        <Text style={[
          customTxt(Fonts.Bold, 14, color040404).txt,
          styles.txtTitle
        ]}>{title}</Text>
        <DropboxView
          txt={content}
          img={img}
          txtStyle={styles.txtTitleStyle}
          onPress={onPress}
          styleView={isValidate ? styles.borderRed : null}
        />
      </View>
    )
  }

  const checkActive = () => {
    return !(_.isEmpty(startTime)) && !(_.isEmpty(endTime)) && (getLsWeekDay().length > 0)
  }

  const checkActiveAndroid = () => {
    return startTime && endTime && (getLsWeekDay().length > 0)
  }

  const renderAdd = () => {
    return (
      <TouchableOpacity style={[
        styles.addView,
        (Platform.OS === 'ios' ? checkActive() : checkActiveAndroid()) ? styles.bgActive : null
      ]}
        onPress={onPressAdd}
      >
        <Text style={[
          customTxt(Fonts.Bold, 16, (Platform.OS === 'ios' ? checkActive() : checkActiveAndroid()) ? colorFFFFFF : colorC1C3C5).txt
        ]}>{Translate(languageRedux).TXT_ADD}</Text>
      </TouchableOpacity>
    )
  }

  const getLsWeekDay = () => {
    return (weekDay || []).filter(val => val?.isSelected)
  }

  const getNameWeekDate = () => {
    const getName = getLsWeekDay().map(val => {
      return val?.name
    })
    return getName.length > 0 ? `${getName}` : null
  }

  const countWeekDay = () => {
    return (getLsWeekDay().length > 0) ? ` (${getLsWeekDay().length})` : ''
  }

  return (
    <View style={styles.container}>
      <View style={styles.rowView}>
        {renderDropView(Translate(
          languageRedux).WEEK_DAYS + countWeekDay(),
          getNameWeekDate() || Translate(languageRedux).SELECT_DATE,
          imgService.ic_calendar_black,
          null,
          onPressWeekDay,
          getLsWeekDay().length === 0
        )}
        {renderDropView(
          Translate(languageRedux).duration,
          duration ? `${duration} ${Translate(languageRedux).MINS}` : `${Translate(languageRedux).SELECT_AN_OPTION}`.toUpperCase(),
          imgHome.ic_down,
          styles.itemDropRightView,
          onPressDuration
        )}
      </View>
      <View style={styles.rowView}>
        {renderDropView(
          Translate(languageRedux).dateStart,
          startDate ? convertDMMMYYYY(startDate) : '',
          imgService.ic_clock,
          null,
          onPressStartDate
        )}
        {renderDropView(
          Translate(languageRedux).endDate,
          endDate ? convertDMMMYYYY(endDate) : '',
          imgService.ic_clock,
          styles.itemDropRightView,
          onPressEndDate
        )}
      </View>
      <View style={styles.rowView}>
        {renderDropView(Translate(
          languageRedux).START_TIME,
          startTime ? convertNumberTime(startTime) : 'HH : MM',
          imgService.ic_clock,
          null,
          onPressStartTime,
          Platform.OS === 'ios' ? _.isEmpty(startTime) : !startTime
        )}
        {renderDropView(Translate(
          languageRedux).END_TIME,
          endTime ? convertNumberTime(endTime) : 'HH : MM',
          imgService.ic_clock,
          styles.itemDropRightView,
          onPressEndTime,
          Platform.OS === 'ios' ? _.isEmpty(endTime) : !endTime
        )}
      </View>
      {renderAdd()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  txtTitleStyle: {
    flex: 1
  },
  rowView: {
    flexDirection: 'row'
  },
  txtTitle: {
    marginBottom: 8
  },
  itemDropView: {
    width: Dimensions.get('window').width / 2,
    paddingTop: 16,
    paddingLeft: 20,
    paddingRight: 10
  },
  itemDropRightView: {
    width: Dimensions.get('window').width / 2,
    paddingTop: 16,
    paddingLeft: 10,
    paddingRight: 20
  },
  addView: {
    marginTop: 32,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorF0F0F0,
    height: 48,
    borderRadius: 12
  },
  borderRed: {
    borderColor: 'red'
  },
  bgActive: {
    backgroundColor: color3777EE
  }
})
