import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import {useSelector} from 'react-redux'

import {color040404, color3777EE, color5C5D5E, colorDDDEE1, colorFFFFFF} from 'constants/colors'
import Fonts from 'constants/Fonts'
import {customTxt} from 'constants/css'
import Translate from '../../../translate'

import icService from '../../../../assets/images/services'

export default function BoxAppointment({date, city,
    backgroundColor, address, border, viewStyle, country}) {
    const txtBg = {backgroundColor: backgroundColor}
    const languageRedux = useSelector(state => state.common.language)
    const cityName = city ?  ',' + ' ' + city : ''
    const countryName = country ? ',' + ' ' + country : ''
    return (
        <View>
          <View style={[styles.ctnNoti, txtBg, addStyle(border).ctnNotiAdd, viewStyle]}>
            <View style={styles.ctnText}>
              {/* Report date */}
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
              {/* Delivery address */}
              {address && <View>
                <View style={styles.structure}>
                  <Image source={icService.ic_map_pin} style={styles.iconStyle} />
                  <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginL8]}>
                    {Translate(languageRedux).address2}
                  </Text>
                </View>
                <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginL16]}>
                  {address}{cityName}{countryName}
                </Text>
              </View>}
            </View>
          </View>
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
