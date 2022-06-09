import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native'
import { useSelector } from 'react-redux'

import Translate from 'translate'
import { color000000, color040404, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'

export default function SortList({onPressCancel, onPressName, onPressTomorrow, onPressDate}) {
  const languageRedux = useSelector(state => state.common.language)

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressCancel} style={styles.bgOpacity} />
      <View style={styles.floatView}>
        <View style={styles.ctn}>
          <TouchableOpacity onPress={onPressDate} style={styles.ctnLine}>
            <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
              {Translate(languageRedux).date}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressName} style={styles.ctnLastLine}>
            <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
              {Translate(languageRedux).name}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center'
  },
  bgOpacity: {
    width: '100%',
    height: '100%',
    flex: 1,
    position: 'absolute',
    backgroundColor: color000000,
    opacity: 0.53
  },
  ctn: {
    backgroundColor: colorFFFFFF,
    shadowColor: '#000',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 9,
    width: Dimensions.get('window').width - 40
  },
  floatView: {
    marginHorizontal: 20
  },
  ctnLine: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center'
  },
  ctnLastLine: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})
