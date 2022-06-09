import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, Dimensions, Platform } from 'react-native'
import { color000000, color040404, colorF0F0F0, colorF5455B, colorFFFFFF } from '../../../../constants/colors'
import { border, customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import icFloat from '../../../../../assets/images/home_screen'
import icButton from '../../../../../assets/images/home_screen'
import { useSelector } from 'react-redux'
import Translate from '../../../../translate'

export default function SOSFloating({
  onPressCancel, onPressContact, onPressShare
}) {
  const txtBg = { backgroundColor: colorF5455B }
  const borderColor = { borderColor: colorF5455B }
  const permissionRedux = []//useSelector(state => state.user.permission)
  const phoneNumber = permissionRedux?.iniziativa?.sosDefaultNumber
  const languageRedux = 'en_US'//useSelector(state => state.common.language)

  const callEmergencyNumber = () => {
    if (phoneNumber) {
      const convertPhone = (phoneNumber || '').trim().replace('(', '').replace(')', '')
      if (Platform.OS !== 'android') {
        return Linking.openURL(`telprompt:${convertPhone}`)
      }
      Linking.openURL(`tel:${convertPhone}`)
    }
  }

  const renderContent = () => {
    return (
      <View style={[styles.floatingView, border().border]}>
        <View style={styles.ctnTitle}>
          <View style={styles.flex1} />
          <View style={styles.ctnSOS}>
            <Text style={customTxt(Fonts.SemiBold, 18, color000000).txt}>SOS</Text>
          </View>
          <TouchableOpacity onPress={onPressCancel} style={styles.marginR16}>
            <Image source={icFloat.ic_close} style={styles.iconStyle} />
          </TouchableOpacity>
        </View>
        <View style={styles.ctnButtonLayout}>
          <TouchableOpacity onPress={onPressShare}
            style={styles.ctnButton}>
            <Image source={icButton.ic_medical_record} style={styles.iconStyle} />
            <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>{Translate(languageRedux).SHARE_YOUR_MEDICAL_RECORD}</Text>
          </TouchableOpacity>
          <View style={styles.marginT12} />
          <TouchableOpacity style={styles.ctnButton} onPress={onPressContact}>
            <Image source={icButton.ic_your_emergency} style={styles.iconStyle} />
            <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>{Translate(languageRedux).CALL_YOUR_EMERGENCY_CONTACT}</Text>
          </TouchableOpacity>
          <View style={styles.marginT12} />
          <TouchableOpacity
            onPress={callEmergencyNumber}
            style={[
              styles.ctnButton,
              txtBg,
              borderColor
            ]}>
            <Image source={icButton.ic_emergency_num} style={styles.iconStyle} />
            <Text style={customTxt(Fonts.SemiBold, 16, colorFFFFFF).txt}>{Translate(languageRedux).CALL_THE_EMERGENCY_NUMBER} ({phoneNumber})</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderSwipe = () => {
    return renderContent()
    // return (
    //   <SwipeUpDownModal
    //     modalVisible={true}
    //     PressToanimate={false}
    //     ContentModal={renderContent()}
    //     ContentModalStyle={styles.Modal}
    //     HeaderContent={
    //       <TouchableOpacity style={styles.containerHeader} onPress={onPressCancel}/>
    //     }
    //     onClose={onPressCancel}
    //   />
    // )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.bgOpacity} onPress={onPressCancel} />
      {renderSwipe()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'flex-end'
  },
  bgOpacity: {
    width: '100%',
    height: '100%',
    flex: 1,
    position: 'absolute',
    backgroundColor: color000000,
    opacity: 0.4
  },
  floatingView: {
    width: Dimensions.get('window').width,
    height: 314,
    backgroundColor: colorFFFFFF,
    borderRadius: 16
  },
  ctnTitle: {
    height: 56,
    flexDirection: 'row'
  },
  iconStyle: {
    height: 24,
    width: 24,
    marginRight: 16,
    marginLeft: 16
  },
  flex1: {
    flex: 1
  },
  ctnSOS: {
    flex: 4,
    alignItems: 'center',
    marginTop: 18
  },
  marginR16: {
    flex: 1,
    alignItems: 'flex-end',
    marginTop: 18
  },
  ctnButtonLayout: {
    marginTop: 15,
    marginHorizontal: 16
  },
  ctnButton: {
    height: 56,
    width: '100%',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colorF0F0F0,
    flexDirection: 'row',
    alignItems: 'center'
  },
  marginT12: {
    marginTop: 12
  },
  containerHeader: {
   width: Dimensions.get('window').width,
   height: Dimensions.get('window').height - 354
  },
  Modal: {
    height: 314,
    backgroundColor: colorFFFFFF,
    alignItems: 'center',
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
    overflow: 'hidden',
    marginTop: Dimensions.get('window').height - 314
  }
})
