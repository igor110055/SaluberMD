import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import React, { useEffect } from 'react'
import {
  StyleSheet, View, TouchableOpacity, Dimensions,
  Text, Keyboard
} from 'react-native'
import {
  hostAPIDev,
  hostAPIStaging,
  hostAPILive
} from 'api/APIs'
import * as APIs from '../../../api/APIs'
import * as colors from '../../../constants/colors'
import AsyncStorage from '@react-native-community/async-storage'
import { STORAGE_KEY } from '../../../constants/define'

export default function PopupChangeServer({
  onPressClose, onPressChange
}) {
  useEffect(() => {
    Keyboard.dismiss()
  }, [])

  const RenderItemChange = ({title, hostChange, onPress}) => {
    const styleServerSelect = {
      backgroundColor: colors.color3777EE
    }
    const txtStyleSelect = {
      color: '#fff'
    }
    return (
      <TouchableOpacity style={[
        styles.changeItem,
        hostChange === APIs.hostAPI ? styleServerSelect : null
        ]} onPress={onPress}>
        <Text style={[
          customTxt(Fonts.SemiBold, 13, colors.color040404).txt,
          hostChange === APIs.hostAPI ? txtStyleSelect : null
        ]}>{title}</Text>
        <Text style={[
          customTxt(Fonts.SemiBold, 13, colors.color040404).txt,
          hostChange === APIs.hostAPI ? txtStyleSelect : null
        ]}>{hostChange}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container} >
      <TouchableOpacity style={[styles.container, styles.bgHidenView]} onPress={onPressClose} />
      <View style={styles.changeView}>
        <RenderItemChange
          title={'Dev API'}
          hostChange={hostAPIDev}
          onPress={async () => {
            APIs.hostAPI = hostAPIDev
            await AsyncStorage.setItem(STORAGE_KEY.SERVER, hostAPIDev)
            onPressChange()
          }}
        />
        <RenderItemChange
          title={'Staging API'}
          hostChange={hostAPIStaging}
          onPress={async () => {
            APIs.hostAPI = hostAPIStaging
            await AsyncStorage.setItem(STORAGE_KEY.SERVER, hostAPIStaging)
            onPressChange()
          }}
        />
        <RenderItemChange
          title={'Live API'}
          hostChange={hostAPILive}
          onPress={async () => {
            APIs.hostAPI = hostAPILive
            await AsyncStorage.setItem(STORAGE_KEY.SERVER, hostAPILive)
            onPressChange()
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  bgHidenView: {
    backgroundColor: 'black',
    opacity: 0.3
  },
  changeView: {
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingBottom: 40
  },
  changeItem: {
    padding: 10
  }
})
