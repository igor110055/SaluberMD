import React, { useEffect } from 'react'
import {
  View, Text, NativeModules, StyleSheet, TouchableOpacity, Platform,
  Image
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import NavigationService from 'navigation'
import { color040404, colorFFFFFF } from 'constants/colors'
import { useSelector } from 'react-redux'
import Translate from 'translate'
import moment from 'moment'

export default function HeaderVideoCall({
  backgroundColor, textCenterColor, textCenter,
  onPressLeft, onPressRight,
  textLeft, textRight, txtRightStyle,
  iconRightName, iconLeftName, iconColor,
  iconLeft, iconRight, textRightColor, rightDisabled,
  notiRight, name, surname, gender, age
}) {
  const [h, setH] = React.useState(0)
  const surveyPatient = useSelector(state => state.common.surveyPatient)
  const languageRedux = useSelector(state => state.common.language)

  useEffect(() => {
    const { StatusBarManager } = NativeModules
    setH(StatusBarManager.HEIGHT)
  }, [])

  const txtTextCenterColor = { color: textCenterColor || color040404 }
  const txtTextRightColor = { color: textRightColor || color040404 }
  const txtBackgroundColor = { backgroundColor: backgroundColor }

  const _onPressBack = () => {
    NavigationService.goBack()
  }

  const checkGender = () => {
    if (surveyPatient?.user?.gender === 0 || gender === 0) {
      return Translate(languageRedux).male + ', '
    }
    if (surveyPatient?.user?.gender === 1 || gender === 1) {
      return Translate(languageRedux).female + ', '
    }
    if (surveyPatient?.user?.gender === 2 || gender === 2) {
      return ''
    }
  }
5
  const renderAge = () => {
    var yearNow = moment().format('YYYY')
    var yearUser = moment(surveyPatient?.user?.data_nascita || age).format('YYYY')
    return yearNow - yearUser
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
          <Text style={[
            customTxt(Fonts.SemiBold, 16, color040404).txt,
            styles.txtCenter,
            txtTextCenterColor
          ]}>{surveyPatient?.user?.nome || name || ''}{' '}{surveyPatient?.user?.cognome || surname || ''}</Text>
          <Text style={[
            customTxt(Fonts.Medium, 10, color040404).txt,
            styles.txtCenter,
            txtTextCenterColor
          ]}>{checkGender()}{Translate(languageRedux).age}{' '}{renderAge()}</Text>
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
          {iconRightName && <Icon name={iconRightName} size={24} color={iconColor} />}
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
    height:Platform.OS === 'android' ? 20 + h : 60 + h
  }
})
