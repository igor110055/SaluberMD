import React from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native'

import {colorFFFFFF, color040404, colorA7A8A9, colorDDDEE1} from '../../../constants/colors'
import { customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'
import icPersonalInfo from '../../../../assets/images/health_profile'

export default function TextInputPhoneNumber({onPressPhoneCode, phoneCode, title, onChangeText,
autoCapitalize, value, placeholder, onPressIn}) {
    return (
      <View style={styles.container}>
        <View style={styles.ctnTitle}>
          <Text style={customTxt(Fonts.SemiBold, 14, color040404).txt}>
            {title}
          </Text>
        </View>
        <View style={styles.ctnPhoneNumber}>
          <TouchableOpacity
            onPress={onPressPhoneCode}
            style={styles.ctnPhoneCode}>
            <View style={styles.phoneNumber}>
              <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
                {phoneCode || '+39'}
              </Text>
            </View>
            <View style={styles.iconDropDown}>
              <Image
                source={icPersonalInfo.ic_dropdown}
                style={styles.iconStyle}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.styleInput}>
            <TextInput
              style={[customTxt(Fonts.Regular, 16).txt, {color: color040404}]}
              onChangeText={onChangeText}
              autoCapitalize={autoCapitalize}
              placeholder={placeholder}
              placeholderTextColor={colorA7A8A9}
              autoCompleteType="off"
              value={value}
              keyboardType='phone-pad' 
              onPressIn={onPressIn}
            />
          </View>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
      marginHorizontal: 16,
      paddingBottom: 16
    },
    ctnTitle: {
      height: 20
    },
    iconStyle: {
      height: 24,
      width: 24
    },
    ctnPhoneCode: {
      flexDirection: 'row',
      alignItems:'center',
      marginLeft: 16,
      borderRightWidth: 1,
      borderRightColor: colorDDDEE1
    },
    phoneNumber: {
      height: 24,
      width: 28,
      marginRight: 8
    },
    iconDropDown: {
      marginRight: 16
    },
    styleInput: {
      justifyContent: 'center',
      marginLeft: 16,
      width: '100%'
    },
    ctnPhoneNumber: {
      flexDirection:'row',
      height: 48,
      width: '100%',
      backgroundColor: colorFFFFFF,
      borderWidth: 1,
      borderRadius: 12,
      borderColor: colorDDDEE1,
      marginTop: 4
    }
  })