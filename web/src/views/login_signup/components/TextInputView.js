import React from 'react'
import {
  StyleSheet, View, TextInput, Text,
  TouchableOpacity, Image
} from 'react-native'
import imgAccount from '../../../../assets/images/account'
import { color333333, colorDDDEE1, colorE0E0E0, colorEB5757 } from '../../../constants/colors'
import { border, customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'
import imgSignUp from '../../../../assets/images/login_signup'

export default function TextInputView({
  ref, onSubmitEditing,
  title, value, onChangeTxt,
  rightIcon, onPressRightIcon,
  isSecure, onPressSecure,
  isShowImg, placeholder,
  textStyle, textinputStyle,
  multiline, returnKeyType,
  onPress, validate,
  onPressDropDown, imgStyle
}) {

  const getIcon = onPressDropDown ?
                    imgSignUp.ic_dropdown :
                    (isSecure ?
                      imgAccount.ic_show_pass :
                      imgAccount.ic_hiden_pass)

  return (
    <View>
      <View style={styles.rowView}>
        <Text style={[
          styles.txtTitleTextInput,
          customTxt(Fonts.SemiBold, 14, color333333).txt,
          textStyle
        ]}>{title}</Text>
        <TouchableOpacity style={styles.rightTitleIconView} onPress={onPressRightIcon}>
          {rightIcon && <Image style={styles.imgRTitle} source={imgSignUp.ic_question_mark} />}
        </TouchableOpacity>
      </View>
      <TextInput
        ref={ref}
        value={value}
        placeholder={placeholder || ''}
        placeholderTextColor={colorE0E0E0}
        onChangeText={(text) => onChangeTxt(text)}
        secureTextEntry={isSecure}
        autoCapitalize={'none'}
        returnKeyType={returnKeyType ? returnKeyType : 'done'}
        style={[
          txtInputStyle(isShowImg).txtinputStyle,
          border(validate ? colorEB5757 : colorDDDEE1).border,
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
          (isShowImg || onPressDropDown) && (
            <Image
              source={getIcon}
              style={[styles.imgIconShow, imgStyle]}
            />
          )
        }
      </TouchableOpacity>
      {
        (onPress || onPressDropDown) && (
          <TouchableOpacity style={styles.fullView} onPress={(onPress || onPressDropDown)} />
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  txtTitleTextInput: {
    flex: 1,
    marginTop: 16
  },
  showPassBT: {
    width: 54,
    height: 50,
    position: 'absolute',
    top: 0,
    right: 0,
    marginTop: 39,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgIconShow: {
    width: 24,
    height: 24,
    marginLeft: 10,
    resizeMode: 'contain'
  },
  fullView: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  rowView: {
    flexDirection: 'row'
  },
  rightTitleIconView: {
    width: 20,
    height: 36
  },
  imgRTitle: {
    marginTop: 16,
    width: 20,
    height: 20,
    resizeMode: 'contain'
  }
})

const txtInputStyle = (isIconImg) => StyleSheet.create({
  txtinputStyle: {
    height: 50,
    marginTop: 4,
    borderRadius: 12,
    paddingLeft: 10,
    paddingRight: isIconImg ? 50 : 20,
    color: color333333,
    fontSize: 16,
    fontFamily: Fonts.Regular
  }
})
