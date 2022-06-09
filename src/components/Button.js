import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import { customTxt } from '../constants/css'
import Fonts from '../constants/Fonts'

export default function Button({backgroundColor, textColor, onPress, text, viewStyle, disabled}) {

  const txtTextColor = {color: textColor}
  const txtBackgroundColor = {backgroundColor: backgroundColor}

  return (
    <View>
      <TouchableOpacity disabled={disabled} viewStyle={viewStyle} onPress={onPress} style={[styles.container, txtBackgroundColor, viewStyle]}>
        <Text style={[customTxt(Fonts.SemiBold, 18).txt, txtTextColor]}>{text}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    width: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
