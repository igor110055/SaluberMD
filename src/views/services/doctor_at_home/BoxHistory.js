import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import {useSelector} from 'react-redux'

import {color040404, color3777EE, color5C5D5E, colorDDDEE1, colorFFFFFF} from 'constants/colors'
import Fonts from 'constants/Fonts'
import {customTxt} from 'constants/css'
import Translate from '../../../translate'

import icService from '../../../../assets/images/services'

export default function BoxAppointment({reportDate, description,
    backgroundColor, type, border, viewStyle, patientName, address}) {
    const txtBg = {backgroundColor: backgroundColor}
    const languageRedux = useSelector(state => state.common.language)
    return (
        <View>
          <View style={[styles.ctnNoti, txtBg, addStyle(border).ctnNotiAdd, viewStyle]}>
            <View style={styles.ctnText}>
              {/* Report date */}
              {reportDate && <View>
                <View style={styles.flexRow}>
                  <Image source={icService.ic_calendar_black} style={styles.iconStyle} />
                  <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginL8]}>
                    {Translate(languageRedux).requestdate}
                  </Text>
                </View>
                <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginL16]}>
                  {reportDate}
                </Text>
              </View>}
              {/* For who */}
              {patientName && <View>
                <View style={styles.structure}>
                  <Image source={icService.ic_user_check} style={styles.iconStyle} />
                  <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginL8]}>
                    {Translate(languageRedux).WHO_IS_FOR}
                  </Text>
                </View>
                <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginL16]}>
                  {patientName}
                </Text>
              </View>}
              {/* Assistance type */}
              {type && <View>
                <View style={styles.structure}>
                  <Image source={icService.ic_tag} style={styles.iconStyle} />
                  <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginL8]}>
                    {Translate(languageRedux).ASSISTANCE_TYPE}
                  </Text>
                </View>
                <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginL16]}>
                  {type}
                </Text>
              </View>}
              {/* Description */}
              {description && <View>
                <View style={styles.structure}>
                  <Image source={icService.ic_file_text} style={styles.iconStyle} />
                  <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginL8]}>
                    {Translate(languageRedux).description}
                  </Text>
                </View>
                <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginL16]}>
                  {description}
                </Text>
              </View>}
              {/* Address */}
              {address && <View>
                <View style={styles.structure}>
                  <Image source={icService.ic_map_pin} style={styles.iconStyle} />
                  <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginL8]}>
                    {Translate(languageRedux).address}
                  </Text>
                </View>
                <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginL16]}>
                  {address}
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
