import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'

import { colorFFFFFF, color040404, colorA7A8A9, colorF0F0F0 } from 'constants/colors'
import Translate from '../../../translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import NavigationService from 'navigation'
import { convertDMMMYYYY } from 'constants/DateHelpers'

import icHeader from '../../../../assets/images/header'

import Header from '../../../components/Header'

export default function DetailReminder({ route }) {

  const languageRedux = useSelector(state => state.common.language)
  const passingData = route.params?.data

  const RenderItem = ({category, content}) => {
    return (
      <View style={styles.ctnItem}>
        <Text style={customTxt(Fonts.SemiBold, 12, colorA7A8A9).txt}>
          {category}
        </Text>
        <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginT8]}>
          {content}
        </Text>
        <View style={styles.divider} />
      </View>
    )
  }

  const TimeItem = ({time, order}) => {
    return (
      <View>
        <View style={styles.ctnHowManyTime}>
          <View style={styles.flexRow}>
            <Text style={[customTxt(Fonts.Regular, 14, color040404).txt]}>
              {order}
            </Text>
            <Icon name={'circle-thin'} size={6} color={color040404} />
          </View>
          <Text style={[customTxt(Fonts.Regular, 16, color040404).txt]}>
            {time}
          </Text>
        </View>
        <View style={styles.divider} />
      </View>
    )
  }

  const checkHours = passingData?.hours || []

  const renderAllTime = () => {
    var data = []
    for (var i = 0; i <= checkHours.length - 1; i++) {
      var time = checkHours.length > 0 ? passingData?.hours[i]?.time : ''
      var j = <TimeItem order={i + 1} time={time} />
      data.push(j)
    }
    return data
  }

  const renderHowManyTime = () => {
    return (
      <View style={styles.ctnItem}>
        <Text style={customTxt(Fonts.SemiBold, 12, colorA7A8A9).txt}>
          {Translate(languageRedux).times}
        </Text>
        {renderAllTime()}
      </View>
    )
  }

  const renderSchdule = () => {
    return (
      <View>
        <View style={styles.ctnItem}>
          <Text style={customTxt(Fonts.SemiBold, 12, colorA7A8A9).txt}>
            {Translate(languageRedux).schedule}
          </Text>
          <View style={styles.endDate}>
            <Text style={[customTxt(Fonts.Regular, 16, color040404).txt]}>
              {Translate(languageRedux).endDate}:
            </Text>
            <Text style={[customTxt(Fonts.Regular, 16, color040404).txt]}>
              {convertDMMMYYYY(passingData?.until)}
            </Text>
          </View>
          <View style={styles.divider} />
        </View>
      </View>
    )
  }

  const renderView = () => {
    return (
      <View>
        {passingData?.type === '1' && <View>
          <RenderItem category={Translate(languageRedux).pills} content={passingData?.drugName} />
          <RenderItem category={Translate(languageRedux).note} content={passingData?.dosage} />
        </View>}
        {passingData?.type === '2' && <View>
          <RenderItem category={Translate(languageRedux).EXCERCISE} content={passingData?.drugName} />
          <RenderItem category={Translate(languageRedux).note} content={passingData?.dosage} />
        </View>}
        {passingData?.type === '3' && <View>
          <RenderItem category={Translate(languageRedux).MEASUREMENT} content={passingData?.drugName} />
          <RenderItem category={Translate(languageRedux).note} content={passingData?.dosage} />
        </View>}
        {renderHowManyTime()}
        {renderSchdule()}
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.paddingB48}>
        {renderView()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_left}
        textCenter={Translate(languageRedux).PRESCRIPTION_ASSISTANT}
        textCenterColor={color040404}
        onPressLeft={() => {
          NavigationService.goBack()
        }}
      />
      <ScrollView>{renderBody()}</ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  paddingB48: {
    paddingBottom: 48
  },
  ctnItem: {
    marginHorizontal: 20,
    marginBottom: 16
  },
  marginT8: {
    marginTop: 8,
    marginBottom: 16
  },
  divider: {
    height: 1,
    backgroundColor: colorF0F0F0
  },
  ctnHowManyTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8
  },
  flexRow: {
    flexDirection: 'row'
  },
  endDate: {
    flexDirection: 'row',
    paddingVertical: 8,
    justifyContent: 'space-between'
  }
})
