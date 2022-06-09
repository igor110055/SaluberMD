import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native'

import {colorF0F0F0, colorFFFFFF} from '../../../constants/colors'
import Fonts from '../../../constants/Fonts'
import { customTxt } from '../../../constants/css'
import icHealthProfile from '../../../../assets/images/health_profile'

export default function Info({
  title, subTitle, borderBottomRightRadius, titleColor,
  subTitleColor, borderBottomLeftRadius, onPress,
  viewStyle, borderTopLeftRadius, borderTopRightRadius
}) {
  const txtTitleColor = {color: titleColor}
  const txtSubTitleColor = {color: subTitleColor}
  return (
    <View
      style={[styles.container, viewStyle]}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styleContainer(borderBottomRightRadius, borderBottomLeftRadius,
            borderTopLeftRadius, borderTopRightRadius).containerBox
        ]}>
        <View style={styles.ctnText}>
          <Text numberOfLines={1} style={[customTxt(Fonts.SemiBold, 16).txt, txtTitleColor]}>{title}</Text>
          <View style={{height: 4}} />
          {subTitle !== '' && <Text
            numberOfLines={1}
            style={[customTxt(Fonts.SemiBold, 12).txt, txtSubTitleColor]}>
            {subTitle}
          </Text>}
        </View>
        <View style={styles.ctnIcon}>
          <Image source={icHealthProfile.ic_right} style={styles.iconStyle}/>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20
  },
  ctnText: {
    flex: 1,
    marginLeft: 16,
    justifyContent:'center'
  },
  ctnIcon: {
    marginRight: 8,
    justifyContent:'center'
  },
  iconStyle: {
    height: 24,
    width: 24
  }
})

const styleContainer = (borderBottomRightRadius, borderBottomLeftRadius,
   borderTopLeftRadius, borderTopRightRadius) => StyleSheet.create({
  containerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 72,
    width: '100%',
    backgroundColor: colorFFFFFF,
    borderBottomRightRadius: borderBottomRightRadius,
    borderBottomLeftRadius: borderBottomLeftRadius,
    borderTopLeftRadius: borderTopLeftRadius,
    borderTopRightRadius: borderTopRightRadius,
    borderBottomWidth: 1,
    borderColor: colorF0F0F0
  }
})
