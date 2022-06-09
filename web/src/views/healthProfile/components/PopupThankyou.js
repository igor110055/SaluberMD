import React from 'react'
import {
  StyleSheet, View, Text,
  TouchableOpacity
} from 'react-native'
import {
  color000000, color040404, color363636, color3777EE, colorF0F0F0, colorFFFFFF
} from '../../../constants/colors'
import { customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'
import { useSelector } from 'react-redux'
import Translate from '../../../translate'

export function PopupThankyou({
  onPressOK,
  onPressCancel,
  onPressViewProfile
}) {

  const languageRedux = 'en_US'//useSelector(state => state.common.language)

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.bgOpacity} onPress={onPressCancel} />
      <View style={styles.logoutView}>
        <View style={styles.ctnContent}>
        <Text
          style={[
            styles.txtThankyou,
            customTxt(Fonts.SemiBold, 16, color040404).txt
          ]}>
          {Translate(languageRedux).THANK_YOU}
        </Text>
        <Text
          style={[
            styles.txtYouCan,
            customTxt(Fonts.Regular, 12, color363636).txt
          ]}>
          {Translate(languageRedux).CONTENT_POPUP_THANKYOU}
        </Text>
        </View>
        <View style={styles.ctnButton}>
          <View style={styles.ctnCancel}>
            <TouchableOpacity onPress={onPressViewProfile}>
              <Text style={customTxt(Fonts.SemiBold, 16, color3777EE).txt}>
              {Translate(languageRedux).VIEW_PROFILE}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.ctnOK}>
            <TouchableOpacity onPress={onPressOK}>
              <Text style={customTxt(Fonts.SemiBold, 16, colorFFFFFF).txt}>
              {Translate(languageRedux).OK}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bgOpacity: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: color000000,
    opacity: 0.7
  },
  logoutView: {
    width: 270,
    height: 149,
    marginLeft: 24,
    marginRight: 24,
    backgroundColor: colorFFFFFF,
    borderRadius: 16
  },
  txtThankyou: {
    marginTop: 20,
    textAlign: 'center'
  },
  txtYouCan: {
    marginTop: 8,
    marginLeft: 20,
    marginRight: 20,
    textAlign:'center'
  },
  ctnOK: {
    height: 44,
    width: 135,
    borderBottomRightRadius: 16,
    backgroundColor: color3777EE,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ctnCancel: {
    height: 44,
    width: 135,
    borderBottomLeftRadius: 16,
    backgroundColor: colorFFFFFF,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colorF0F0F0
  },
  ctnButton: {
    flexDirection: 'row',
    alignItems:'center',
    marginTop: 21
  }
})