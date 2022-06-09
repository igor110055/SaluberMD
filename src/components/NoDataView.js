import React from 'react'
import {
  StyleSheet, View, Image, Text
} from 'react-native'
import { useSelector } from 'react-redux'
import img from '../../assets/images/global'
import Fonts from '../constants/Fonts'
import Translate from '../translate'
import { customTxt } from '../constants/css'
import { color040404 } from '../constants/colors'

export default function NoDataView({
  noDataViewStyle, text, imageSource
}) {
  const languageRedux = useSelector(state => state.common.language)
  return (
    <View style={[styles.container, noDataViewStyle]}>
      <Image style={styles.img} source={imageSource ? imageSource : img.ic_nodata} />
      <Text style={[
        customTxt(Fonts.SemiBold, 16, color040404).txt,
        styles.txt
        ]}>{text ? text : Translate(languageRedux).NO_DATA}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  img: {
    width: 100,
    height: 100
  },
  txt:{
   fontSize: 13,
   marginTop: 16
  }
})
