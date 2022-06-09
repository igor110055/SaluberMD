import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { useSelector } from 'react-redux'

import { color5C5D5E, colorFFFFFF } from '../../constants/colors'
import { customTxt } from '../../constants/css'
import Fonts from '../../constants/Fonts'
import Translate from '../../translate'

import icVisit from '../../../assets/images/visit'

export default function FunctionButton({
  onPressCancel,
  onPressDirectCall,
  onPressAppointment,
  titleDirectCall, imgDirectCall,
  titleAppointment, imgAppointment
}) {

  const languageRedux = 'en_US'//useSelector(state => state.common.language)

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.bgOpacity} onPress={onPressCancel} />
      <View style={styles.floatView}>
        <TouchableOpacity onPress={onPressDirectCall} style={styles.ctnLine}>
          <Image
            source={imgDirectCall || icVisit.ic_drcall}
            style={styles.iconStyle}
          />
          <View style={styles.marginR12} />
          <Text style={customTxt(Fonts.Regular, 14, color5C5D5E).txt}>
            {titleDirectCall || Translate(languageRedux).direct_call}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressAppointment} style={styles.ctnLine2}>
          <Image
            source={imgAppointment || icVisit.ic_appointment}
            style={styles.iconStyle}
          />
          <View style={styles.marginR12} />
          <Text style={customTxt(Fonts.Regular, 14, color5C5D5E).txt}>
            {titleAppointment || Translate(languageRedux).NEW_APPOINTMENT}
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
    height: 52,
    width: '100%',
    backgroundColor: colorFFFFFF,
    shadowColor: '#000',
    borderRadius: 16,
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
    marginBottom: 8,
    alignItems: 'center',
    height: 52,
    width: '100%',
    backgroundColor: colorFFFFFF,
    shadowColor: '#000',
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 9
  },
  marginR12: {
    marginRight: 12
  },
  iconStyle: {
    height: 20,
    width: 20
  }
})
