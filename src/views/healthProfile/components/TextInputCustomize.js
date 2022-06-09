import React from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native'

import {colorFFFFFF, color040404, colorA7A8A9, colorF0F0F0, colorDDDEE1} from '../../../constants/colors'
import { customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'
import icPersonalInfo from '../../../../assets/images/health_profile'

export default function Component({value, title, placeholder, onChangeText,
  autoCapitalize, onPress, onPressCm, onPressFt, onPressKg, onPressLb, cenColor,
  feetColor, kgColor, lbColor, keyboardType
}) {

  const txtCenColor = {color: cenColor}
  const txtfeetColor = {color: feetColor}
  const txtKgColor = {color: kgColor}
  const txtLbColor = {color: lbColor}

  return (
    <View style={styles.container}>
      <View style={styles.ctnTitle}>
        <Text style={customTxt(Fonts.SemiBold, 14, color040404).txt}>{title}</Text>
      </View>
      <View style={styles.ctnTextInput}>

        <View style={styles.styleInput}>
          <TextInput style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginL]}
          onChangeText={onChangeText}
          autoCapitalize={autoCapitalize}
          placeholderTextColor={colorA7A8A9}
          placeholder={placeholder}
          autoCompleteType={'off'}
          value={value}
          keyboardType={keyboardType}
          />
        </View>

        {title === 'Height' && <View style={styles.ctnDram}>
        <TouchableOpacity onPress={onPressCm}>
            <Text style={[customTxt(Fonts.Regular, 16).txt, txtCenColor]}>cm</Text>
          </TouchableOpacity>
          <Text style={[customTxt(Fonts.Regular, 16, colorA7A8A9).txt]}>{'    '}|{'    '}</Text>
          <TouchableOpacity onPress={onPressFt}>
            <Text style={[customTxt(Fonts.Regular, 16).txt, txtfeetColor]}>ft</Text>
          </TouchableOpacity>
        </View>}

        {title === 'Weight' && <View style={styles.ctnDram}>
          <TouchableOpacity onPress={onPressKg}>
            <Text style={[customTxt(Fonts.Regular, 16).txt, txtKgColor]}>kg</Text>
          </TouchableOpacity>
          <Text style={[customTxt(Fonts.Regular, 16, colorA7A8A9).txt]}>{'    '}|{'    '}</Text>
          <TouchableOpacity onPress={onPressLb}>
            <Text style={[customTxt(Fonts.Regular, 16).txt, txtLbColor]}>lbs</Text>
          </TouchableOpacity>
        </View>}

        {title === 'Country' && <TouchableOpacity style={styles.ctnDownIcon}>
            <Image source={icPersonalInfo.ic_dropdown} style={styles.iconStyle}/>
          </TouchableOpacity>}

        {title === 'State' && <TouchableOpacity style={styles.ctnDownIcon}>
            <Image source={icPersonalInfo.ic_dropdown} style={styles.iconStyle}/>
          </TouchableOpacity>}

        {title === 'Province' && <TouchableOpacity style={styles.ctnDownIcon}>
            <Image source={icPersonalInfo.ic_dropdown} style={styles.iconStyle}/>
          </TouchableOpacity>}
      </View>
      {
        onPress && title !== 'Weight' && title !== 'Height' && (
          <TouchableOpacity style={styles.fullView} onPress={onPress} />
        )
      }
      {
        onPress && (title === 'Weight' || title === 'Height') && (
          <TouchableOpacity style={styles.fullView2} onPress={onPress} />
        )
      }
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
  ctnTextInput: {
    flexDirection:'row',
    marginTop: 4
  },
  ctnDram: {
    flexDirection: 'row',
    alignItems:'center',
    marginLeft: -95
  },
  ctnDownIcon: {
    flexDirection: 'row',
    alignItems:'center',
    marginLeft: -40
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  fullView: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  ctnPhoneCode: {
    flexDirection: 'row',
    alignItems:'center',
    marginLeft: 16,
    borderRightWidth: 1,
    borderRightColor: colorF0F0F0
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 48,
    width: '100%',
    backgroundColor: colorFFFFFF,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colorDDDEE1
  },
  marginL: {
    marginLeft: 16,
    width: '100%'
  },
  fullView2: {
    position: 'absolute',
    width: '70%',
    height: '100%'
  }
})
