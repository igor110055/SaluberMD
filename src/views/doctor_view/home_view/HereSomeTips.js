import React from 'react'
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, ScrollView} from 'react-native'
import { useSelector } from 'react-redux'

import {color000000, color040404, color5C5D5E, colorFFFFFF} from 'constants/colors'
import Translate from 'translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'

import icHeader from '../../../../assets/images/header'
import icGlobal from '../../../../assets/images/global'

export default function HereSomeTips({onPressCancel}) {
  const languageRedux = useSelector(state => state.common.language)

  const renderTop = () => {
    return (
      <View style={styles.ctnTop}>
        <Text style={customTxt(Fonts.Bold, 20, color040404).txt}>
          {Translate(languageRedux).WELCOME_TIPS}
        </Text>
        <TouchableOpacity onPress={onPressCancel}>
          <Image source={icHeader.ic_close} style={styles.iconStyle} />
        </TouchableOpacity>
      </View>
    )
  }

  const renderTip = () => {
    return (
      <View>
        <Image source={icGlobal.img_tips} style={styles.imgTipStyle} />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View>
        <Text style={[customTxt(Fonts.Regular, 16, color5C5D5E).txt, styles.ctnText]}>
          {Translate(languageRedux).CONTENT_TIPS}
        </Text>
        {renderTip()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.bgOpacity}
        onPress={onPressCancel}
      />
      <View style={styles.fullView}>
        {renderTop()}
        <ScrollView>
          {renderBody()}
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center'
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
    borderRadius: 12,
    height: 530,
    marginHorizontal: 16
  },
  ctnTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginHorizontal: 24
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  ctnText: {
    marginVertical: 24,
    marginHorizontal: 24
  },
  imgTipStyle: {
    width: '100%',
    height: 328,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12
  }
})
