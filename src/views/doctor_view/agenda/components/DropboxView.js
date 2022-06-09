import { color040404, colorDDDEE1, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import React from 'react'
import {
  StyleSheet, TouchableOpacity, Text, Image
} from 'react-native'
import imgDrop from '../../../../../assets/images/document'

export function DropboxView({
  txt, styleView, onPress, img, txtStyle
}) {
  return (
    <TouchableOpacity style={[styles.container, styleView]} onPress={onPress}>
      <Text
        numberOfLines={1}
        style={[
          customTxt(Fonts.Regular, 16, color040404).txt,
          styles.txtStyle,
          txtStyle
        ]}>{txt}</Text>
      <Image source={img || imgDrop.ic_dropdown} style={styles.imgDrop} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colorFFFFFF
  },
  txtStyle: {
    marginLeft: 12,
    marginTop: 12,
    marginBottom: 12
  },
  imgDrop: {
    width: 24,
    height: 24,
    marginLeft: 12,
    marginRight: 10
  }
})
