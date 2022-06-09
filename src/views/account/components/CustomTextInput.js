import React from 'react'
import {
  StyleSheet, View, TextInput, Text,
  TouchableOpacity, Image
} from 'react-native'
import imgAccount from '../../../../assets/images/account'
import { color333333, colorE0E0E0, colorEB5757 } from '../../../constants/colors'
import { border, customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'

export default function CustomTextInput({
  ref, onSubmitEditing,
  title, value, onChangeTxt,
  isSecure, onPressSecure,
  isShowImg, placeholder,
  textStyle, textinputStyle,
  multiline, returnKeyType,
  onPress, validate
}) {
  return (
    <View>
      <Text style={[
        styles.txtTitleTextInput,
        customTxt(Fonts.Regular, 12, color333333).txt,
        textStyle
      ]}>{title}</Text>
      <TextInput
        ref={ref}
        value={value}
        placeholder={placeholder || ''}
        placeholderTextColor={colorE0E0E0}
        onChangeText={(text) => onChangeTxt(text)}
        secureTextEntry={isSecure}
        returnKeyType={returnKeyType ? returnKeyType : 'done'}
        style={[
          txtInputStyle(isShowImg).txtinputStyle,
          border(validate ? colorEB5757 : null).border,
          textinputStyle
        ]}
        onSubmitEditing={onSubmitEditing}
        // clearButtonMode={isShowImg ? undefined : 'while-editing'}
        multiline={multiline}
      />
      <TouchableOpacity
        onPress={onPressSecure}
        style={styles.showPassBT}>
        {
          isShowImg && (
            <Image
              source={isSecure ?
                imgAccount.ic_show_pass
                : imgAccount.ic_hiden_pass}
              style={styles.imgIconShow}
            />
          )
        }
      </TouchableOpacity>
      {
        onPress && (
          <TouchableOpacity style={styles.fullView} onPress={onPress} />
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  txtTitleTextInput: {
    marginTop: 16
  },
  showPassBT: {
    width: 54,
    height: 50,
    position: 'absolute',
    top: 0,
    right: 0,
    marginTop: 39,
    justifyContent: 'center'
  },
  imgIconShow: {
    width: 24,
    height: 24,
    marginLeft: 10
  },
  fullView: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  }
})

const txtInputStyle = (isIconImg, isMultiline) => StyleSheet.create({
  txtinputStyle: {
    height: 50,
    marginTop: 8,
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: isIconImg ? 50 : 10,
    color: color333333
  }
})
