import React, { useEffect } from 'react'
import {
  View, Text, NativeModules, StyleSheet, TouchableOpacity, Platform, Image
} from 'react-native'

import { customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'
import NavigationService from '../../../navigation'
import { color040404, color3777EE } from '../../../constants/colors'

export default function Header({
  backgroundColor, textButtonColor, buttonText, title, onPressLeft,
  onPressSubmit, disabled, backgroundColorButton, source
}) {
  const [h, setH] = React.useState(0)

  useEffect(() => {
    const { StatusBarManager } = NativeModules
    setH(StatusBarManager.HEIGHT)
  }, [])

  const txtTextColor = { color: textButtonColor || color040404 }
  const txtBackgroundColor = { backgroundColor: backgroundColor }
  const txtBackgroundColorButton = { backgroundColor: backgroundColorButton }

  const _onPressBack = () => {
    NavigationService.goBack()
  }

  return (
    <View style={heighNavi(h).fullView}>
      {/* STATUS BAR */}
      {Platform.OS === 'ios' && <View style={[txtBackgroundColor, { height: h }]} />}
      {/* HEADER */}
      <View style={[styles.container, txtBackgroundColor]}>
        <View style={styles.ctnTop}>
            <TouchableOpacity onPress={onPressLeft || _onPressBack} style={styles.ctnIconLeft}>
                <Image source={source} style={styles.iconStyles} />
            </TouchableOpacity>
            {buttonText && <TouchableOpacity onPress={onPressSubmit} style={[styles.ctnButton, txtBackgroundColorButton]}
            disabled={disabled}>
                <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, txtTextColor]}>{buttonText}</Text>
            </TouchableOpacity>}
        </View>
        <View style={styles.ctnTitle}>
            <Text style={customTxt(Fonts.SemiBold, 24, color040404).txt}>{title}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    justifyContent:'flex-end'
  },
  ctnTop: {
    flexDirection:'row',
    justifyContent:'space-between'
  },
  ctnButton: {
    height: 32,
    width: 88,
    borderRadius: 8,
    marginRight: 20,
    backgroundColor: color3777EE,
    justifyContent:'center',
    alignItems:'center'
  },
  ctnIconLeft: {
    height: 32,
    marginLeft: 20
  },
  ctnTitle: {
    marginLeft: 20,
    marginTop: 4,
    marginBottom: 12
  },
  iconStyles: {
    height: 24,
    width: 24
  }
})

const heighNavi = (h) => StyleSheet.create({
  fullView: {
    width: '100%',
    height: 100 + h
  }
})
