import React from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity
} from 'react-native'
import { colorFFFFFF, color3777EE, colorF0F0F0, colorA7A8A9 } from '../../../constants/colors'
import { customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'

export default function Component({
  value, setValue,
  title1, title2
}) {

  const renderRadio = (isRadio, title, onPress, style) => {
    return (
      <TouchableOpacity
        style={[styles.container, style,
        addStyle(isRadio).containerAdd
      ]}
        onPress={onPress}>
        <Text style={[customTxt(Fonts.SemiBold, 16).txt,
          addStyle(isRadio).titleAdd]}>{title}</Text>
      </TouchableOpacity>
    )
  }

  const _onPressOff = () => {
    setValue(false)
  }

  const _onPressOn = () => {
    setValue(true)
  }

  return (
    <View style={styles.ctn2RadioButton}>
      {
        renderRadio(
          value !== null ? !value : null,
          title1 || 'NO',
          _onPressOff,
          styles.NoButton
        )
      }
      {
        renderRadio(
          value,
          title2 || 'YES',
          _onPressOn
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    width: 144,
    backgroundColor: colorF0F0F0,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent:'center'
  },
  ctn2RadioButton: {
    flexDirection: 'row',
    justifyContent:'center'
  },
  NoButton: {
    marginRight: 16
  }
})

const addStyle = (isRadio) => StyleSheet.create({
  containerAdd: {
    backgroundColor: isRadio ? color3777EE : colorF0F0F0
  },
  titleAdd: {
    color: isRadio ? colorFFFFFF : colorA7A8A9
  }
})

