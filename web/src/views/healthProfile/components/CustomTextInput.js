import React from 'react'
import {
  StyleSheet, View, TextInput, Text,
  TouchableOpacity, Image
} from 'react-native'
import imgAccount from '../../../../assets/images/account'
import { color333333, color040404, colorA7A8A9, colorDDDEE1, colorF56565 } from '../../../constants/colors'
import { border, customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'

export default function CustomTextInput({
  ref, onSubmitEditing,
  title, value, onChangeTxt,
  isSecure, onPressSecure,
  isShowImg, placeholder,
  textStyle, textinputStyle,
  multiline, returnKeyType,
  onPress, validate, iconRight,
  autoCapitalize, keyboardType,
  onPressIn
}) {
  return (
    <View>
      {
        title && (
          <Text style={[
            styles.txtTitleTextInput,
            customTxt(Fonts.SemiBold, 14, color040404).txt,
            textStyle
          ]}>{title}</Text>
        )
      }
      <View style={styles.styleInput}>
        <TextInput
          ref={ref}
          value={value}
          placeholder={placeholder || ''}
          placeholderTextColor={colorA7A8A9}
          onChangeText={(text) => onChangeTxt(text)}
          secureTextEntry={isSecure}
          keyboardType={keyboardType || 'default'}
          returnKeyType={returnKeyType ? returnKeyType : 'done'}
          style={[
            txtInputStyle(isShowImg).txtinputStyle,
            border(validate ? colorF56565 : colorDDDEE1).border,
            textinputStyle
          ]}
          onSubmitEditing={onSubmitEditing}
          // clearButtonMode={isShowImg ? undefined : 'while-editing'}
          multiline={multiline}
          autoCapitalize={autoCapitalize}
          onPressIn={onPressIn}
        />
      </View>
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
        {
          iconRight && (
            <Image
              source={iconRight}
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
    width: 50,
    height: 50,
    position: 'absolute',
    bottom: 0,
    right: 5,
    justifyContent: 'center',
    alignItems: 'center'
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
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  styleInput: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ctnDram: {
    marginLeft: -40
  }
})

const txtInputStyle = (isIconImg, isMultiline) => StyleSheet.create({
  txtinputStyle: {
    height: 48,
    width: '100%',
    marginTop: 4,
    borderRadius: 12,
    paddingLeft: 10,
    paddingRight: isIconImg ? 50 : 10,
    color: color333333
  }
})
