import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import {useSelector} from 'react-redux'

import {color040404, color3777EE, color5C5D5E, colorDDDEE1, colorFFFFFF} from 'constants/colors'
import Fonts from 'constants/Fonts'
import {customTxt} from 'constants/css'
import Translate from 'translate'

import icService from '../../../../assets/images/services'

export default function BoxAppointment({special, question,
    backgroundColor, date, border, viewStyle,
    who, attachmentName}) {
    const txtBg = {backgroundColor: backgroundColor}
    const languageRedux = useSelector(state => state.common.language)
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
              {/* For who */}
              {who && <View>
                <View style={styles.structure}>
                  <Image source={icService.ic_user_check} style={styles.iconStyle} />
                  <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginL8]}>
                    {Translate(languageRedux).WHO_IS_FOR}
                  </Text>
                </View>
                <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginL16]}>
                  {who}
                </Text>
              </View>}
              {/* Specialization */}
              {special && <View>
                <View style={styles.structure}>
                  <Image source={icService.ic_tag} style={styles.iconStyle} />
                  <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginL8]}>
                    {Translate(languageRedux).SPECIALITY}
                  </Text>
                </View>
                <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginL16]}>
                  {special}
                </Text>
              </View>}
              {/* Attachment */}
              {attachmentName && <View>
                <View style={styles.structure}>
                  <Image source={icService.ic_attachment} style={styles.iconStyle} />
                  <Text numberOfLines={1} style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginL8]}>
                    {Translate(languageRedux).attachment}
                  </Text>
                </View>
                {attachmentName}
              </View>}
              {/* Concern */}
              {question && <View>
                <View style={styles.structure}>
                  <Image source={icService.ic_message} style={styles.iconStyle} />
                  <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginL8]}>
                    {Translate(languageRedux).CONCERNS}
                  </Text>
                </View>
                <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginL16]}>
                  {question}
                </Text>
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
      marginTop: 16,
      flex: 1
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
