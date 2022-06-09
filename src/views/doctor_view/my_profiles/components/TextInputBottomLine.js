import { color040404, colorE0E0E0, colorF0F0F0 } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import React from 'react'
import {
  StyleSheet, View, TextInput, Text
} from 'react-native'

export default function TextInputBottomLine({
  title, value, isHidenLine, ref, placeholder,
  onChangeTxt, isSecure, returnKeyType, textinputStyle,
  onSubmitEditing, multiline, keyboardType, isView
}) {
  return (
    <View style={
      styles.container
    }>
      <Text style={[
        customTxt(Fonts.Regular, 12, color040404).txt
      ]}>{title}</Text>
      <TextInput
        ref={ref}
        value={value || ''}
        placeholder={placeholder || ''}
        placeholderTextColor={colorE0E0E0}
        onChangeText={(text) => onChangeTxt(text)}
        secureTextEntry={isSecure}
        autoCapitalize={'none'}
        returnKeyType={returnKeyType ? returnKeyType : 'done'}
        style={[
          customTxt(Fonts.SemiBold, 16, color040404).txt,
          styles.txtinputView,
          textinputStyle
        ]}
        onSubmitEditing={onSubmitEditing}
        // clearButtonMode={isShowImg ? undefined : 'while-editing'}
        multiline={multiline}
        keyboardType={keyboardType}
      />
      {!isHidenLine && <View style={styles.lineView} />}
      {isView && (<View style={styles.fullView} />)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginBottom: 0
  },
  lineView: {
    backgroundColor: colorF0F0F0,
    height: 1,
    width: '100%'
  },
  txtinputView: {
    marginTop: 8,
    marginBottom: 16
  },
  fullView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    opacity: 0.1
  }
})
