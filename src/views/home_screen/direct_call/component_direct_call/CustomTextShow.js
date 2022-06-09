import React from 'react'
import {
 StyleSheet, View, Text
} from 'react-native'
import { color040404, color5C5D5E } from '../../../../constants/colors'
import { border, customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'

export default function CustomTextShow({
  title, content
}) {
  return (
    <View style={[
        styles.contain,
        border().borderB
      ]}>
      <Text style={[
        styles.txtTitle,
        customTxt(Fonts.Regular, 12, color5C5D5E).txt
      ]}>{title}</Text>
      <Text style={[
        customTxt(Fonts.Regular, 16, color040404).txt,
        styles.txtContent
      ]}>{content}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  contain: {
    flex: 1
  },
  txtTitle: {
    marginTop: 16,
    marginBottom: 8
  },
  txtContent: {
    marginBottom: 16
  }
})
