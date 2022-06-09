import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'

import { colorFFFFFF, colorF0F0F0, color363636, color5C5D5E } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'

import icTools from '../../../../assets/images/tools'

export default function EachBox({
  title, subTitle, borderBottomRightRadius,
  borderBottomLeftRadius, onPress,
  viewStyle, borderTopLeftRadius, borderTopRightRadius,
  onPressDelete
}) {
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
            <Text numberOfLines={1} style={[customTxt(Fonts.Bold, 14, color363636).txt, styles.marginB4]}>
              {title}
            </Text>
            {subTitle !== '' && <Text
              numberOfLines={1}
              style={customTxt(Fonts.Regular, 14, color5C5D5E).txt}>
              {subTitle}
            </Text>}
          </View>
          <TouchableOpacity onPress={onPressDelete} style={styles.ctnIcon}>
            <Image source={icTools.ic_trash} style={styles.iconStyle}/>
          </TouchableOpacity>
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
    justifyContent: 'center'
  },
  ctnIcon: {
    marginRight: 16,
    justifyContent: 'center'
  },
  iconStyle: {
    height: 20,
    width: 20
  },
  marginB4: {
    marginBottom: 4
  }
})

const styleContainer = (
  borderBottomRightRadius,
  borderBottomLeftRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
) =>
  StyleSheet.create({
    containerBox: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 76,
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
