import { color040404, color3777EE, colorA7A8A9, colorE2E2E2, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import React from 'react'
import {
  Dimensions, TouchableOpacity,
  StyleSheet, View, Text, Image
} from 'react-native'
import { useSelector } from 'react-redux'
import Translate from 'translate'
import imgDirect from '../../../../../assets/images/direct_call'
import SeriesView from '../components/SeriesView'
import SingleView from '../components/SingleView'

export default function AddAvailabilityView({
  onPressClose, onPressDuration, duration, onPressDate,
  dateAdd, onPressStartTime, onPressEndTime,
  startTime, endTime, onPressAdd, routeViewRequest,
  startDate, endDate,
  onPressStartDate, onPressEndDate,
  weekDay, onPressWeekDay,
  tabs, setTabs
}) {

  const languageRedux = useSelector(state => state.common.language)

  const renderHeaderView = () => {
    return (
      <View style={styles.headerView}>
        <Text style={[
          customTxt(Fonts.SemiBold, 16, color040404).txt
        ]}>{Translate(languageRedux).NEW_AVAILABILITY}</Text>
        <TouchableOpacity style={styles.closeView} onPress={onPressClose}>
          <Image source={imgDirect.ic_close} style={styles.imgClose} />
        </TouchableOpacity>
      </View>
    )
  }

  const renderSegment = () => {
    return (
      <View style={styles.segmentView}>
        <TouchableOpacity style={styles.segmentItemView} onPress={() => setTabs(0)}>
          <View style={styles.titleSegmentView}>
            <Text style={[
              customTxt(Fonts.SemiBold, 16, tabs === 0 ? color3777EE : colorA7A8A9).txt
            ]}>Series</Text>
          </View>
          {tabs === 0 && <View style={styles.tabsActiveView} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.segmentItemView} onPress={() => setTabs(1)}>
          <View style={styles.titleSegmentView}>
            <Text style={[
              customTxt(Fonts.SemiBold, 16, tabs === 1 ? color3777EE : colorA7A8A9).txt
            ]}>Single</Text>
          </View>
          {tabs === 1 && <View style={styles.tabsActiveView} />}
        </TouchableOpacity>
      </View>
    )
  }

  const renderContentView = () => {
    switch (tabs) {
      case 1:
        return <SingleView
          languageRedux={languageRedux}
          onPressDuration={onPressDuration}
          duration={duration}
          onPressDate={routeViewRequest ? () => { } : onPressDate}
          date={dateAdd}
          onPressStartTime={onPressStartTime}
          onPressEndTime={onPressEndTime}
          startTime={startTime}
          endTime={endTime}
          onPressAdd={onPressAdd}
          routeViewRequest={routeViewRequest}
        />
      default:
        return <SeriesView
          languageRedux={languageRedux}
          onPressDuration={onPressDuration}
          duration={duration}
          onPressDate={routeViewRequest ? () => { } : onPressDate}
          weekDay={weekDay}
          onPressWeekDay={onPressWeekDay}
          onPressStartTime={onPressStartTime}
          onPressEndTime={onPressEndTime}
          startTime={startTime}
          onPressStartDate={onPressStartDate}
          endTime={endTime}
          onPressEndDate={onPressEndDate}
          onPressAdd={onPressAdd}
          startDate={startDate}
          endDate={endDate}
        />
    }
  }

  return (
    <View style={styles.flexView}>
      <View style={styles.outsideView} />
      <View style={styles.contentView}>
        {renderHeaderView()}
        {routeViewRequest === false && renderSegment()}
        {renderContentView()}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  flexView: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  outsideView: {
    flex: 1,
    backgroundColor: color040404,
    opacity: 0.4
  },
  contentView: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    backgroundColor: colorFFFFFF,
    top: 64,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
    overflow: 'hidden'
  },
  headerView: {
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeView: {
    position: 'absolute',
    width: 56,
    height: 56,
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgClose: {
    width: 24,
    height: 24
  },
  segmentView: {
    flexDirection: 'row',
    width: '100%',
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: colorE2E2E2
  },
  titleSegmentView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  segmentItemView: {
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden'
  },
  tabsActiveView: {
    width: (Dimensions.get('window').width - 60) / 2,
    height: 8,
    backgroundColor: color3777EE,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    top: 3
  }
})
