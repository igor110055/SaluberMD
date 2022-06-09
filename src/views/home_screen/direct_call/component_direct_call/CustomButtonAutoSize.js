import React from 'react'
import {
  StyleSheet, Text, TouchableOpacity
} from 'react-native'
import { color3777EE, colorC1C3C5, colorF0F0F0, colorFFFFFF } from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'

export default function CustomButtonAutoSize({
  isActive, onPress, textButton, disabled,
  stylesView, stylesText
}) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isActive ? styles.bgActive : null,
        stylesView
      ]}
      onPress={onPress}
      activeOpacity={isActive ? 0 : 1}
      disabled={disabled}
    >
      <Text style={[
        styles.txtBt,
        customTxt(Fonts.Bold, 18, colorC1C3C5).txt,
        isActive ? styles.txtActive : null,
        stylesText
      ]}>{textButton}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    minWidth: 110,
    backgroundColor: colorF0F0F0,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16
  },
  bgActive: {
    backgroundColor: color3777EE
  },
  txtBt: {
    marginTop: 12,
    marginLeft: 37.5,
    marginRight: 37.5,
    marginBottom: 12
  },
  txtActive: {
    color: colorFFFFFF
  }
})
