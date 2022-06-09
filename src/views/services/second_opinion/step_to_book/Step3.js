import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native'
import { useSelector } from 'react-redux'
import IconRight from 'react-native-vector-icons/Feather'

import {color040404, color363636, color3777EE, colorC1C3C5, colorFFFFFF} from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from '../../../../translate'

export default function Step3({onPressNext}) {
  const languageRedux = useSelector(state => state.common.language)

  return (
    <View style={styles.container}>
      <ScrollView style={styles.ctnContent}>
        <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt, styles.marginB16]}>
          {Translate(languageRedux).UPLOAD_INSTRUCTION_1}
        </Text>
        <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt, styles.marginB16]}>
          {Translate(languageRedux).UPLOAD_INSTRUCTION_2}
        </Text>
        <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt, styles.marginB16]}>
          {Translate(languageRedux).UPLOAD_INSTRUCTION_3}
        </Text>
        <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt, styles.marginB16]}>
          {Translate(languageRedux).UPLOAD_INSTRUCTION_4}
        </Text>
        <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt, styles.marginB16]}>
          {Translate(languageRedux).UPLOAD_INSTRUCTION_5}
        </Text>
        <View style={styles.ctnTextLine}>
          <Text style={[customTxt(Fonts.Regular, 14, color363636).txt, styles.marginR8]}>1</Text>
          <View style={styles.borderBottom}>
            <Text style={[customTxt(Fonts.Regular, 14, color363636).txt]}>
              {Translate(languageRedux).UPLOAD_INSTRUCTION_6}
            </Text>
          </View>
        </View>
        <View style={styles.ctnTextLine}>
          <Text style={[customTxt(Fonts.Regular, 14, color363636).txt, styles.marginR8]}>2</Text>
          <View style={styles.borderBottom}>
            <Text style={[customTxt(Fonts.Regular, 14, color363636).txt]}>
              {Translate(languageRedux).UPLOAD_INSTRUCTION_7}
            </Text>
          </View>
        </View>
        <View style={styles.ctnTextLine}>
          <Text style={[customTxt(Fonts.Regular, 14, color363636).txt, styles.marginR8]}>3</Text>
          <View style={styles.borderBottom}>
            <Text style={[customTxt(Fonts.Regular, 14, color363636).txt]}>
              {Translate(languageRedux).UPLOAD_INSTRUCTION_8}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF,
    marginHorizontal: 20
  },
  ctnContent: {
    paddingHorizontal: 16
  },
  marginB16: {
    marginBottom: 8
  },
  ctnTextLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8
  },
  marginR8: {
    marginRight: 8
  },
  borderBottom: {
    borderBottomWidth: 1,
    width: '100%',
    justifyContent: 'center',
    borderBottomColor: colorC1C3C5
  },
  ctniconRight: {
    alignItems: 'center',
    marginTop: 16,
    height: 48,
    width: 117,
    backgroundColor: color3777EE,
    alignSelf: 'flex-end',
    borderRadius: 16,
    justifyContent: 'center'
  }
})
