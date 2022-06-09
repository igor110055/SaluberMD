import React from 'react'
import {View, Text, StyleSheet, Image} from 'react-native'
import { useSelector } from 'react-redux'

import Translate from 'translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import { color040404, colorFFFFFF } from 'constants/colors'
import NavigationService from 'navigation'

import imgService from '../../../../assets/images/services'
import icHeader from '../../../../assets/images/header'

import Header from 'components/Header'

export default function NoDoctorAvailable() {
  const languageRedux = useSelector(state => state.common.language)
  return (
    <View style={styles.flex1}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_left}
        textCenter={Translate(languageRedux).nutritionist}
        textCenterColor={color040404}
        onPressLeft={() => {
          NavigationService.goBack()
        }}
      />
      <View style={styles.container}>
        <Image source={imgService.img_no_doctor} style={styles.imgStyle} />
        <Text style={customTxt(Fonts.Bold, 20, color040404).txt}>
          {Translate(languageRedux).nonutritionist}
        </Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.75
  },
  flex1: {
    flex: 1
  },
  imgStyle: {
    height: 160,
    width: 160
  }
})
