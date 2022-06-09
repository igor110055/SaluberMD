import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import {
  color040404,
  color3777EE,
  color5C5D5E,
  colorF0F0F0,
  colorFFFFFF
} from '../../../../constants/colors'
import {customTxt} from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import icHome from '../../../../../assets/images/home_screen'

export default function MedicineWidget({
  onPress,
  onPressClose
}) {
  return (
    <View style={styles.container}>
      <View style={styles.containerBox}>
        <View style={styles.ctnCategory}>
          <View style={styles.marginL16}>
            <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
            Today’s Medicines
            </Text>
          </View>
          <TouchableOpacity onPress={onPressClose} style={styles.ctnIcon}>
            <Image source={icHome.ic_close} style={styles.iconStyle}/>
          </TouchableOpacity>
        </View>
        <View style={styles.ctnContent}>
          <Text
            style={[
              customTxt(Fonts.Regular, 14, color5C5D5E).txt,
              styles.styleContent
            ]}>
            With this widget you can monitor your daily medicines. Let’s get started!
          </Text>
        </View>
        <View style={styles.button}>
          <View style={styles.ctnButtonLayout}>
            <TouchableOpacity onPress={onPress} style={[styles.ctnButton]}>
              <Text style={customTxt(Fonts.Bold, 14, color3777EE).txt}>
                Add a  Medicine Reminder
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 16
  },
  containerBox: {
    flex: 1,
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9
  },
  ctnCategory: {
    flexDirection: 'row',
    height: 48,
    alignItems:'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colorF0F0F0
  },
  marginL16: {
    marginLeft: 16
  },
  ctnContent: {
    marginTop: 16,
    marginHorizontal: 16
  },
  ctnButton: {
    height: 40,
    width: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: color3777EE
  },
  ctnButtonLayout: {
    marginHorizontal: 16,
    alignItems: 'center'
  },
  ctnButton2: {
    height: 40,
    width: 174,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: color3777EE
  },
  button: {
    marginTop: 16,
    marginBottom: 16
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  ctnIcon: {
    marginRight: 16
  }
})