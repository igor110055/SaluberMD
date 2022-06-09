import React from 'react'
import {
  StyleSheet, TouchableOpacity, Text
} from 'react-native'
import { color3777EE, colorFFFFFF } from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'

export default function CustomButtonFillFix({
  onPress, title, btStyle, txtStyle
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.contain,
        btStyle
      ]}>
      <Text style={[
        customTxt(Fonts.Bold, 18, colorFFFFFF).txt,
        styles.txtStyle,
        txtStyle
      ]}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  contain: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color3777EE,
    borderRadius: 12,
    overflow: 'hidden',
    marginLeft: 0,
    marginRight: 0
  },
  txtStyle: {
    marginTop: 12,
    marginBottom: 12,
    minHeight: 24
  }
})
