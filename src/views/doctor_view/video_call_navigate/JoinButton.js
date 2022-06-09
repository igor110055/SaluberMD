import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'

import { color3777EE, color48BB78, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'

export default function JoinButton({onPress}) {
  return (
    <View style={styles.contain}>
      <View style={styles.container}>
        <View>
          <Text style={customTxt(Fonts.SemiBold, 14, colorFFFFFF).txt}>
            The patient is now
          </Text>
          <Text style={customTxt(Fonts.SemiBold, 14, colorFFFFFF).txt}>
            in the waiting room
          </Text>
        </View>
        <TouchableOpacity onPress={onPress} style={styles.button}>
          <Text style={customTxt(Fonts.SemiBold, 16, color3777EE).txt}>
            Join
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  contain: {
    position: 'absolute',
    bottom: 20,
    borderRadius: 12
  },
  container: {
    borderRadius: 12,
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingLeft: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 9,
    backgroundColor: color48BB78,
    flexDirection: 'row'
  },
  button: {
    backgroundColor: colorFFFFFF,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginRight: 8,
    marginLeft: 68
  }
})
