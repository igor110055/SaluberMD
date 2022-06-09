import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import {useSelector} from 'react-redux'

import {color040404, color3777EE, color5C5D5E, colorA7A8A9, colorDDDEE1, colorFFFFFF} from 'constants/colors'
import Fonts from 'constants/Fonts'
import {customTxt} from 'constants/css'
import Translate from 'translate'

import icService from '../../../../assets/images/services'

export default function BoxAppointment({name, address,
    backgroundColor, date, border, viewStyle,
    website, onPressWeb, phone, onPressPhone}) {
    const languageRedux = useSelector(state => state.common.language)
    const txtBg = {backgroundColor: backgroundColor}
    return (
        <View>
          <View style={[styles.ctnNoti, txtBg, addStyle(border).ctnNotiAdd, viewStyle]}>
            <View style={styles.ctnText}>
              {/* TIME and DAY */}
              {date && <View>
                <View style={styles.flexRow}>
                  <Image source={icService.ic_calendar_black} style={styles.iconStyle} />
                  <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginL8]}>
                    {Translate(languageRedux).requestdate}
                  </Text>
                </View>
                <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginL16]}>
                  {date}
                </Text>
              </View>}
              {name && <View>
                <View style={styles.structure}>
                  <Image source={icService.ic_office} style={styles.iconStyle} />
                  <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginL8]}>
                    {Translate(languageRedux).dettaglio_struttura}
                  </Text>
                </View>
                <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginL16]}>
                  {name}
                </Text>
                <Text style={[customTxt(Fonts.Regular, 16, color3777EE).txt, styles.marginL16]}>
                  {address}
                </Text>
                <TouchableOpacity onPress={onPressPhone}>
                  <Text style={[customTxt(Fonts.Regular, 16, color3777EE).txt, styles.marginL16]}>
                    {phone}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressWeb}>
                  <Text style={[customTxt(Fonts.Regular, 16, color3777EE).txt, styles.marginL16]}>
                    {website}
                  </Text>
                </TouchableOpacity>
              </View>}
            </View>
            <View style={styles.width16} />
          </View>
        </View>
    )
}

const styles = StyleSheet.create({
    ctnNoti: {
      borderRadius: 12,
      backgroundColor: colorFFFFFF,
      flexDirection: 'row',
      flex: 1
    },
    ctnText: {
      padding: 16,
      flex: 1
    },
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    structure: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16
    },
    iconStyle: {
      height: 24,
      width: 24
    },
    marginL8: {
      marginLeft: 8
    },
    marginL16: {
      marginLeft: 32,
      marginTop: 4
    },
    marginT4: {
      marginTop: 4
    },
    width16: {
      width:16
    }
  })

  const addStyle = (border) => StyleSheet.create({
    ctnNotiAdd: {
        borderWidth: border ? 1 : 0,
        borderColor: border ? colorDDDEE1 : color3777EE
    }
  })
