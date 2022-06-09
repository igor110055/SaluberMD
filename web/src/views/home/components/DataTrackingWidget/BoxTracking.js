import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'

import { color363636, color3777EE, color5C5D5E, colorBDBDBD, colorF0F0F0, colorFFFFFF } from '../../../../constants/colors'
import Fonts from '../../../../constants/Fonts'
import { customTxt } from '../../../../constants/css'

export default function BoxTracking({
  category, timePerWeek, source,
  bgStatus, status, param, param2,
  statusColor, bgParam, paramColor, onPress,
  txtLastUpdate, iconName, colorIcon
}) {
  const txtStatusColor = { color: statusColor }
  const txtBgStatus = { backgroundColor: bgStatus }
  const txtParamColor = { color: paramColor }
  const txtBgParam = { backgroundColor: bgParam }

  const marginBetween = { marginLeft: 10 }
  const marginHori = { marginHorizontal: 10 }

  const paramStyle = { color: txtParamColor, fontSize: 12 }

  return (
    <View style={styles.outsideView}>
      <TouchableOpacity onPress={onPress} style={styles.ctnBoxTracking}>
        <View style={styles.ctnContent}>
          <View style={styles.ctnCategory}>
            <Text style={customTxt(Fonts.SemiBold, 16, color363636).txt}>{category}</Text>
            <Image source={source} style={styles.iconStyle} />
            {/* {iconName && <Icon name={iconName} size={26} color={color3777EE} />} */}
          </View>
          <View style={styles.ctnTime}>
            <Text style={
              customTxt(Fonts.Regular, 12, color5C5D5E).txt
            }>{timePerWeek}{txtLastUpdate && <Text style={[
              customTxt(Fonts.Medium, 12, colorBDBDBD).txt,
              styles.txtLastUpdateStyle
            ]}> | {txtLastUpdate}</Text>}</Text>
          </View>
          {
            status && param && (
              <View style={styles.ctnNoti}>
                <View style={[styles.ctnStatus, txtBgStatus]}>
                  <View style={marginHori}>
                    <Text style={[customTxt(Fonts.Regular, 12).txt, txtStatusColor]}>{status}</Text>
                  </View>
                </View>
                <View style={[styles.ctnStatus, txtBgParam, marginBetween]}>
                  <View style={marginHori}>
                    <Text style={paramStyle}>{param}</Text>
                  </View>
                </View>
                {param2 && <View style={[styles.ctnStatus, txtBgParam, marginBetween]}>
                  <View style={marginHori}>
                    <Text style={[customTxt(Fonts.Regular, 12).txt, txtParamColor]}>{param2}</Text>
                  </View>
                </View>}
              </View>
            )
          }
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  outsideView: {
    marginTop: 8
  },
  ctnBoxTracking: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colorF0F0F0,
    backgroundColor: colorFFFFFF
  },
  ctnContent: {
    margin: 16
  },
  ctnCategory: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  ctnTime: {
    marginTop: 4,
    flexDirection: 'row',
    marginRight: 30
  },
  txtLastUpdateStyle: {
    flex: 1
  },
  ctnNoti: {
    marginTop: 12,
    flexDirection: 'row'
  },
  ctnStatus: {
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconStyle: {
    height: 24,
    width: 24
  }
})
