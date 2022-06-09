import React from 'react'
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Image} from 'react-native'
import { useSelector } from 'react-redux'

import {color000000, color040404, colorFFFFFF, colorDDDEE1, color3777EE} from 'constants/colors'
import Translate from 'translate'

import icHeader from '../../../../assets/images/header'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'

export default function ActionsView({onPressClose, onPressReferral,
onPressNewMess, onPressCall, onPressCertificate, onPressPrescription}) {
  const languageRedux = useSelector(state => state.common.language)

  const renderTop = () => {
    return (
      <View>
        <View style={styles.ctnTitle}>
          <View style={styles.flex1} />
          <View style={styles.ctnSOS}>
            <Text style={customTxt(Fonts.SemiBold, 18, color040404).txt}>
              {Translate(languageRedux).actions}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.marginR16}
            onPress={onPressClose}>
            <Image source={icHeader.ic_close} style={styles.iconStyleFloat} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderItemBtn = (text, onPress) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.ctnBtn}>
        <Text style={customTxt(Fonts.SemiBold, 16, color3777EE).txt}>
          {text}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        {renderItemBtn(Translate(languageRedux).NEW_MESSAGE, onPressNewMess)}
        {renderItemBtn(Translate(languageRedux).call, onPressCall)}
        {renderItemBtn(Translate(languageRedux).NEW_MEDICAL_CERTIFICATE, onPressCertificate)}
        {renderItemBtn(Translate(languageRedux).NEW_REFERRAL, onPressReferral)}
        {renderItemBtn(Translate(languageRedux).NEW_PRESCRIPTION, onPressPrescription)}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.bgOpacity}
        onPress={onPressClose}
      />
      <View style={styles.fullView}>
        {renderTop()}
        {renderBody()}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'flex-end'
  },
  bgOpacity: {
    width: '100%',
    height: '100%',
    flex: 1,
    position: 'absolute',
    backgroundColor: color000000,
    opacity: 0.7
  },
  fullView: {
    backgroundColor: colorFFFFFF,
    borderRadius: 16
  },
  ctnTitle: {
    flexDirection: 'row',
    paddingVertical: 16,
    marginBottom: 16
  },
  flex1: {
    flex: 1
  },
  ctnSOS: {
    flex: 4,
    alignItems: 'center'
  },
  marginR16: {
    flex: 1,
    alignItems: 'flex-end'
  },
  iconStyleFloat: {
    height: 24,
    width: 24,
    marginRight: 16,
    marginLeft: 16
  },
  ctnBtn: {
    padding: 16,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    borderRadius: 12,
    marginHorizontal: 16,
    alignItems: 'center',
    marginBottom: 12
  },
  ctnBody: {
    paddingBottom: 37
  }
})
