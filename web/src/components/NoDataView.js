import React from 'react'
import {
  StyleSheet, View, Image, Text, Dimensions
} from 'react-native'
import img from '../../assets/images/global'
import Fonts from '../constants/Fonts'
import Translate from '../translate'
import { customTxt } from '../constants/css'
import { colorA7A8A9 } from '../constants/colors'
import * as StateLocal from '../state_local'

export default function NoDataView({
  noDataViewStyle
}) {
  const languageRedux = StateLocal.userinfo?.language_id || 'en_US'
  return (
    <View style={[styles.container, noDataViewStyle]}>
      <Image style={styles.img} source={img.ic_nodata} />
      <Text style={[
        customTxt(Fonts.Regular, 16, colorA7A8A9).txt,
        styles.txt
      ]}>{Translate(languageRedux).NO_DATA}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  img: {
    width: 60,
    height: 60
  },
  txt: {
    fontSize: 13,
    fontFamily: Fonts.Medium,
    marginTop: 10
  }
})
