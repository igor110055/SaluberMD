import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import {color040404, color3777EE, color5C5D5E, colorBDBDBD, colorDDDEE1, colorFFFFFF} from '../../../../constants/colors'
import Fonts from '../../../../constants/Fonts'
import {customTxt} from '../../../../constants/css'

export default function BoxAppointment({docName, time, day, specail,
    backgroundColor, docNameColor, timeColor, specailColor, border, onPress, viewStyle}) {
    const txtBg = {backgroundColor: backgroundColor}
    const txtDocNameColor = {color: docNameColor}
    const txtTimeColor = {color: timeColor}
    const txtSpecialColor = {color: specailColor}
    return (
        <View>
          <TouchableOpacity onPress={onPress} style={[styles.ctnNoti, txtBg, addStyle(border).ctnNotiAdd, viewStyle]}>
            <View style={styles.ctnText}>
              {/* DOCTOR NAME */}
              {docName && <View>
                  <Text style={[customTxt(Fonts.Regular, 12).txt, txtDocNameColor]}>
                   {docName}
                  </Text>
              </View>}
              {/* TIME and DAY */}
              <View style={styles.ctnDayTime}>
               {time && <Text style={[customTxt(Fonts.SemiBold, 18).txt, txtTimeColor]}>
                    {time}
                </Text>}
                {day && <Text style={customTxt(Fonts.SemiBold, 18, color040404).txt}>
                  {' '}|{' '}
                </Text>}
                <Text style={customTxt(Fonts.SemiBold, 18, colorBDBDBD).txt}>
                  {day}
                </Text>
              </View>
              {/* SPECIAL */}
              {specail && <View style={styles.ctnSpecial}>
                <Text style={[customTxt(Fonts.SemiBold, 12).txt, txtSpecialColor]}>
                  {specail}
                </Text>
              </View>}
            </View>
          </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    ctnNoti: {
      borderRadius: 12,
      backgroundColor: colorFFFFFF
    },
    ctnText: {
      marginLeft: 16,
      marginTop: 16,
      marginBottom: 16
    },
    ctnDayTime: {
      flexDirection: 'row',
      marginTop: 8,
      alignItems: 'center'
    },
    ctnSpecial: {
      marginTop: 8
    }
  })

  const addStyle = (border) => StyleSheet.create({
    ctnNotiAdd: {
        borderWidth: border ? 1 : 0,
        borderColor: border ? colorDDDEE1 : color3777EE
    }
  })
