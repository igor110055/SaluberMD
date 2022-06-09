import React, { useEffect, useState } from 'react'
import {
  View, Text, NativeModules, StyleSheet, TouchableOpacity, Platform,
  Image,
  Dimensions
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import NavigationService from 'navigation'
import icHeader from '../../../../../assets/images/header'
import { color040404, colorFFFFFF } from 'constants/colors'
import { useSelector } from 'react-redux'
import * as APIs from '../../../../api/APIs'

export default function HeaderTrackingNew({
  backgroundColor, textCenterColor, textCenter,
  onPressLeft, onPressRight,
  textLeft, textRight, txtRightStyle,
  iconRightName, iconLeftName, iconColor,
  iconLeft, iconRight, textRightColor, rightDisabled,
  notiRight, iconRight2, onPressRight2
}) {
  const [h, setH] = React.useState(0)
  const userinfoRedix = useSelector(state => state.user.userinfo)
  const [newLogo, setNewLogo] = useState()

  useEffect(() => {
    const { StatusBarManager } = NativeModules
    setH(StatusBarManager.HEIGHT)
  }, [])

  useEffect(() => {
    if ((userinfoRedix?.iniziative || []).length > 0) {
      callAPIGetLogo(userinfoRedix?.iniziative[0])
    }
  }, [userinfoRedix])

  const txtTextCenterColor = { color: textCenterColor || color040404 }
  const txtTextRightColor = { color: textRightColor || color040404 }
  const txtBackgroundColor = { backgroundColor: backgroundColor }

  const callAPIGetLogo = (id) => {
    setNewLogo(`${APIs.hostAPI}backoffice/img/loghi/salubermd_${id}.png`)
  }

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
          {iconLeftName && <Icon name={iconLeftName} size={24} color={iconColor} />}
          {iconLeft && <Image style={styles.imgIcon} source={iconLeft} />}
        </TouchableOpacity>
        {/* CENTER */}
        <View style={styles.centerView}>
          {textCenter && <Text style={[
            customTxt(Fonts.SemiBold, 16, color040404).txt,
            styles.txtCenter,
            txtTextCenterColor
          ]}>{textCenter || ''}</Text>}
          {!textCenter && <Image source={newLogo ? { uri: newLogo } : icHeader.ic_logo} style={styles.logoStyle} />}
        </View>
        {/* RIGHT */}
        <View
          disabled={rightDisabled}
          style={styles.contentCornerRight}>
          <TouchableOpacity onPress={onPressRight}>
            {iconRight && <Image style={styles.imgIcon} source={iconRight} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressRight2} style={styles.icRight2}>
            {iconRight2 && <Image style={styles.imgIcon} source={iconRight2} />}
          </TouchableOpacity>
        </View>
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
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
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
    height: 50,
    width: Dimensions.get('window').width / 2,
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
  },
  icRight2: {
    marginLeft: 8
  }
})

const heighNavi = (h) => StyleSheet.create({
  fullView: {
    width: '100%',
    height: Platform.OS === 'android' ? 40 + h : 60 + h
  }
})
