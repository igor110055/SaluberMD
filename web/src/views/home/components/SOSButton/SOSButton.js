import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { colorFFFFFF } from '../../../../constants/colors'
import Fonts from '../../../../constants/Fonts'
import { customTxt } from '../../../../constants/css'

export default function SOSButton({ onPress, backgroundColor, text, source }) {

  const txtBackgroundColor = { backgroundColor: backgroundColor }

  return (
    <View style={styles.contain}>
      <TouchableOpacity onPress={onPress} style={[styles.container, txtBackgroundColor]}>
        {source && <Image source={source} style={styles.iconStyle}/>}
        {text && <Text style={customTxt(Fonts.Bold, 20, colorFFFFFF).txt}>{text}</Text>}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  contain: {
    position: 'absolute',
    width: 60,
    height: 60,
    bottom: 42,
    right: 20,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    height: 56,
    width: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 9
  },
  iconStyle: {
    height: 24,
    width: 24
  }
})
