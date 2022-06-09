import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useSelector } from 'react-redux'

import Fonts from '../../../../constants/Fonts'
import { customTxt } from '../../../../constants/css'
import { color040404, colorE53E3E, colorF8F8F8, colorFED7D7 } from '../../../../constants/colors'
import icHealthProfile from '../../../../../assets/images/health_profile'
import Translate from 'translate'

export default function BoxMedicine({
  textColor, borderColor, time,
  nameMedi, source, iconType, colorIconType,
  onPress, colorIcon, timeSkip
}) {
  const txtTextColor = { color: textColor }
  const txtBorderColor = { borderColor: borderColor }
  const languageRedux = useSelector(state => state.common.language)
  return (
    <View>
      {time !== '' &&
        <View style={styles.ctnTime}>
          <Text style={[
            customTxt(Fonts.Bold, 14, color040404).txt,
            styles.styleTime]}>
            {time}
          </Text>
        </View>}
      <View style={styles.ctnButtonLayout}>
        <TouchableOpacity onPress={onPress} style={[styles.ctnButton, txtBorderColor]}>
          <View style={styles.ctnIconType}>
            <Icon name={iconType} size={24} color={colorIconType} />
          </View>
          <View style={styles.ctnContent}>
            <Text numberOfLines={1} style={[customTxt(Fonts.Regular, 16).txt, txtTextColor]}>
              {nameMedi}
            </Text>
          </View>
          <View style={styles.ctnIconCheck}>
            <Icon name={source} size={24} color={colorIcon} />
          </View>
          <View style={styles.ctnIcon}>
            <Image source={icHealthProfile.ic_right} style={styles.iconStyle} />
          </View>
        </TouchableOpacity>
        {timeSkip && <View style={styles.ctnPostponed}>
          <View style={styles.marginR8}>
            <Text numberOfLines={1} style={customTxt(Fonts.SemiBold, 12, colorE53E3E).txt}>
               {Translate(languageRedux).reminder_postponed}
            </Text>
          </View>
          <View style={styles.timeSkip}>
            <Text numberOfLines={1} style={customTxt(Fonts.SemiBold, 12, colorE53E3E).txt}>
              {timeSkip}
            </Text>
          </View>
        </View>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  ctnButton: {
    height: 56,
    width: '100%',
    backgroundColor: colorF8F8F8,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1
  },
  ctnButtonLayout: {
    marginTop: 8,
    marginHorizontal: 16
  },
  styleTime: {
    fontWeight: '700'
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  ctnIcon: {
    marginRight: 16,
    height: 24,
    width: 24
  },
  ctnIconCheck: {
    marginRight: 8,
    height: 24,
    width: 24
  },
  ctnContent: {
    flex: 1,
    marginLeft: 8
  },
  ctnTime: {
    marginTop: 16,
    marginLeft: 16
  },
  ctnIconType: {
    marginLeft: 15
  },
  timeSkip: {
    backgroundColor: colorFED7D7,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginTop: 8
  },
  ctnPostponed: {
    flexDirection: 'row'
  },
  marginR8: {
    marginRight: 4,
    backgroundColor: colorFED7D7,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginTop: 8
  }
})
