import React from 'react'
import { View, StyleSheet, Text, Image } from 'react-native'
import { Switch } from 'react-native-switch'

import { color48BB78, color9AE6B4, colorA7A8A9, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'

import imgAccount from '../../../../../assets/images/account'

export default function ButtonOnOff({
 onPressSwitch, isOnline, base64Avt, firstName, lastName
}) {

  const renderSwitchButton = () => {
    return (
      <View style={styles.switchButton}>
        <Switch
          onValueChange={onPressSwitch}
          value={isOnline ? true : false}
          renderActiveText={false}
          renderInActiveText={false}
          backgroundActive={color9AE6B4}
          circleSize={24}
          circleBorderWidth={0}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        <View style={styles.flexRow}>
          <Image
            style={styles.imgStyle}
            source={base64Avt || imgAccount.ic_profile_avatar}
          />
          <View style={styles.ctnName}>
            <View style={styles.name}>
              <Text style={customTxt(Fonts.SemiBold, 18, colorFFFFFF).txt}>
                {firstName}{' '}
              </Text>
              <Text style={customTxt(Fonts.SemiBold, 18, colorFFFFFF).txt}>
                {lastName}
              </Text>
            </View>
            <Text style={customTxt(Fonts.SemiBold, 12, colorFFFFFF).txt}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </Text>
          </View>
        </View>
        {renderSwitchButton()}
      </View>
    )
  }
  return (
    <View style={styleBG(isOnline).container}>
      {renderBody()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorA7A8A9
  },
  ctnBody: {
    marginHorizontal: 20,
    marginVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  imgStyle: {
    height: 40,
    width: 40,
    borderRadius: 20
  },
  name: {
    flexDirection: 'row'
  },
  ctnName: {
    marginLeft: 12,
    justifyContent: 'center'
  },
  switchButton: {
    justifyContent: 'center'
  },
  flexRow: {
    flexDirection: 'row'
  }
})

const styleBG = (isOnline) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isOnline ? color48BB78 : colorA7A8A9
  }
})
