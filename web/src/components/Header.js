import React, { useEffect } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, Platform,
  Image
} from 'react-native'
import { customTxt } from '../constants/css'
import Fonts from '../constants/Fonts'
import icHeader from '../../assets/images/header'
import { color040404, colorFFFFFF } from '../constants/colors'

export default function Header({
  backgroundColor, textCenterColor, textCenter,
  onPressLeft, onPressRight,
  textLeft, textRight, txtRightStyle,
  iconRightName, iconLeftName, iconColor,
  iconLeft, iconRight, textRightColor, rightDisabled,
  notiRight
}) {
  const [h, setH] = React.useState(0)

  const txtTextCenterColor = { color: textCenterColor || color040404 }
  const txtTextRightColor = { color: textRightColor || color040404 }
  const txtBackgroundColor = { backgroundColor: backgroundColor }

  const _onPressBack = () => {
    // NavigationService.goBack()
  }

  return (
    <View style={heighNavi(h).fullView}>
      {/* STATUS BAR */}
      <View style={[txtBackgroundColor, { height: h }]} />
      {/* HEADER */}
      <View style={[styles.container, txtBackgroundColor]}>
        {/* LEFT */}
        <TouchableOpacity
          onPress={onPressLeft || _onPressBack}
          style={styles.contentCornerLeft}>
          {
            textLeft &&
            <Text
              style={[
                customTxt(Fonts.SemiBold, 16).txt,
                styles.marginL16
              ]}>
              {textLeft}
            </Text>
          }
          {iconLeft && <Image style={styles.imgIcon} source={iconLeft} />}
        </TouchableOpacity>
        {/* CENTER */}
        <View style={styles.centerView}>
          {textCenter && <Text style={[
            customTxt(Fonts.SemiBold, 16, color040404).txt,
            styles.txtCenter,
            txtTextCenterColor
          ]}>{textCenter || ''}</Text>}
          {!textCenter && <Image source={icHeader.ic_logo} style={styles.logoStyle} />}
        </View>
        {/* RIGHT */}
        <TouchableOpacity
          disabled={rightDisabled}
          onPress={onPressRight}
          style={styles.contentCornerRight}>
          {
            textRight &&
            <Text style={[
              customTxt(Fonts.SemiBold, 14).txt, txtTextRightColor,
              styles.marginR16,
              txtRightStyle
            ]}>
              {textRight}
            </Text>
          }
          {iconRight && <Image style={styles.imgIcon} source={iconRight} />}
          {
            notiRight && (
              <View style={styles.notiRightStyle}>
                <Text
                  numberOfLines={1}
                  style={[
                    customTxt(Fonts.Bold, 12, colorFFFFFF).txt,
                    styles.txtNoti
                  ]}>{notiRight}</Text>
              </View>
            )
          }
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
    minWidth: 70,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentCornerRight: {
    height: '100%',
    minWidth: 70,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentCornerStyle: {
    fontFamily: Fonts.Regular,
    fontSize: 16
  },
  marginL16: {
    marginLeft: 16,
    marginRight: 10
  },
  marginR16: {
    marginRight: 16
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
    width: 120,
    resizeMode: 'contain'
  },
  imgIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain'
  },
  notiRightStyle: {
    backgroundColor: 'red',
    position: 'absolute',
    top: Platform.OS === 'android' ? 25 : 10,
    right: 20,
    maxWidth: 100,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  txtNoti: {
    marginLeft: 5,
    marginRight: 5
  }
})

const heighNavi = (h) => StyleSheet.create({
  fullView: {
    width: '100%',
    height: 60 + h
  }
})
