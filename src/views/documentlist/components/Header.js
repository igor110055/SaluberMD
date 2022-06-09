import React, { useEffect } from 'react'
import {
  View, Text, NativeModules, StyleSheet, TouchableOpacity, Platform,
  Image
} from 'react-native'
import { customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'
import NavigationService from '../../../navigation'
import icHeader from '../../../../assets/images/header'
import { color040404 } from '../../../constants/colors'

export default function Header({
  backgroundColor, textRightColor,
  textCenter, onPressLeft, onPressRight,
  iconLeft, backgroundColorRight, disabledRight, textRight
}) {
  const [h, setH] = React.useState(0)

  useEffect(() => {
    const { StatusBarManager } = NativeModules
    setH(StatusBarManager.HEIGHT)
  }, [])

  const txtBackgroundColor = { backgroundColor: backgroundColor }
  const txtTextRightColor = {color: textRightColor || color040404}
  const txtBGRight = {backgroundColor: backgroundColorRight}

  const _onPressBack = () => {
    NavigationService.goBack()
  }

  return (
    <View style={heighNavi(h).fullView}>
      {/* STATUS BAR */}
      {Platform.OS === 'ios' && <View style={[txtBackgroundColor, { height: h }]} />}
      {/* HEADER */}
      <View style={[styles.container, txtBackgroundColor]}>
        {/* LEFT */}
        <TouchableOpacity
          onPress={onPressLeft || _onPressBack}
          style={styles.contentCornerLeft}>
          {iconLeft && <Image style={styles.imgIcon} source={iconLeft}/>}
        </TouchableOpacity>
        {/* CENTER */}
        <View style={styles.centerView}>
          {textCenter && <Text style={[
            customTxt(Fonts.SemiBold, 16, color040404).txt,
            styles.txtCenter
          ]}>{textCenter}</Text>}
          {!textCenter && <Image source={icHeader.ic_logo} style={styles.logoStyle}/>}
        </View>
        {/* RIGHT */}
        <TouchableOpacity
          disabled={disabledRight}
          onPress={onPressRight}
          style={[styles.contentCornerRight, txtBGRight]}>
            <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt, txtTextRightColor]}>
              {textRight}
            </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contentCornerLeft: {
    height: '100%',
    width: 64,
    justifyContent: 'center',
    marginLeft: 20
  },
  contentCornerRight: {
    height: 32,
    width: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderRadius: 8
  },
  contentCornerStyle: {
    fontFamily: Fonts.Regular,
    fontSize: 16
  },
  centerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtCenter: {
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10
  },
  logoStyle: {
    height: 24,
    width: 120
  },
  imgIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain'
  }
})

const heighNavi = (h) => StyleSheet.create({
  fullView: {
    width: '100%',
    height: 60 + h
  }
})
