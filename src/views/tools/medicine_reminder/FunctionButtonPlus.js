import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { color040404, colorFFFFFF, color3777EE } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from '../../../translate'

export default function FunctionButton({ onPressCancel,
  onPressExcercise, onPressMeasurement, onPressPill
}) {

  const languageRedux = useSelector(state => state.common.language)

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.bgOpacity} onPress={onPressCancel} />
      <View style={styles.floatView}>
        <TouchableOpacity onPress={onPressPill} style={styles.ctnLine}>
          <Icon name={'pill'} size={24} color={color3777EE} />
          <View style={styles.marginR12} />
          <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
            {Translate(languageRedux).pills}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressExcercise} style={styles.ctnLine}>
          <Icon name={'run'} size={26} color={color3777EE} />
          <View style={styles.marginR12} />
          <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
            {Translate(languageRedux).EXCERCISE}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressMeasurement} style={styles.ctnLine}>
          <Icon name={'pulse'} size={26} color={color3777EE} />
          <View style={styles.marginR12} />
          <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
            {Translate(languageRedux).MEASUREMENT}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  bgOpacity: {
    width: '100%',
    height: '100%',
    flex: 1,
    position: 'absolute'
  },
  floatView: {
    marginRight: 20,
    marginBottom: 100,
    alignItems: 'flex-end'
  },
  ctnLine: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
    backgroundColor: colorFFFFFF,
    shadowColor: '#000',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 9
  },
  ctnLine2: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ctnLastLine: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  marginR12: {
    marginRight: 12
  },
  iconStyle: {
    height: 20,
    width: 20
  }
})
