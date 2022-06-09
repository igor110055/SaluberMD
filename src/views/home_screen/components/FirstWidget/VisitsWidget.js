import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import { useSelector } from 'react-redux'
import Translate from 'translate'
import {
  color040404,
  color3777EE,
  color5C5D5E,
  colorF0F0F0,
  colorFFFFFF
} from '../../../../constants/colors'
import {customTxt} from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'

export default function VisitsWidget({
  onPressNewAppointment,
  onPressDirectCall
}) {
  const languageRedux = useSelector(state => state.common.language)

  return (
    <View style={styles.container}>
      <View style={styles.containerBox}>
        <View style={styles.ctnCategory}>
          <View style={styles.marginL16}>
            <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
              {Translate(languageRedux).VISITS}
            </Text>
          </View>
        </View>
        <View style={styles.ctnContent}>
          <Text
            style={[
              customTxt(Fonts.Regular, 14, color5C5D5E).txt,
              styles.styleContent
            ]}>
            {Translate(languageRedux).DIRECT_CALL_NEW_APPOINTMENT}
          </Text>
        </View>
        <View style={styles.button}>
          <View style={styles.ctnButtonLayout}>
            <TouchableOpacity onPress={onPressDirectCall} style={[styles.ctnButton]}>
              <Text style={customTxt(Fonts.Bold, 14, color3777EE).txt}>
                {Translate(languageRedux).direct_call}
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <View>
              <TouchableOpacity
                onPress={onPressNewAppointment}
                style={styles.ctnButton2}>
                <View>
                  <Text style={customTxt(Fonts.Bold, 14, color3777EE).txt}>
                    {Translate(languageRedux).NEW_APPOINTMENT}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
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
    height: 48,
    justifyContent:'center',
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
    width: 122,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: color3777EE
  },
  ctnButtonLayout: {
    marginRight: 16
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
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 16,
    justifyContent: 'center'
  }
})
