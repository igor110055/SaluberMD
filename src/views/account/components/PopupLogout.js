import React from 'react'
import {
  StyleSheet, View, Text, Dimensions,
  TouchableOpacity
} from 'react-native'
import { useSelector } from 'react-redux'
import Translate from 'translate'
import {
  color000000, color005CD8, color2F80ED, color333333, colorF2F2F2, colorFFFFFF
} from '../../../constants/colors'
import { customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'

export function PopupLogout({
  onPressCancel,
  onPressLogout
}) {

  const languageRedux = useSelector(state => state.common.language)


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.bgOpacity} onPress={onPressCancel}/>
      <View style={styles.logoutView}>
        <Text style={[
          styles.txtLogout,
          customTxt(Fonts.SemiBold, 20, color333333).txt
        ]}>{Translate(languageRedux).LOGOUT_BTN}</Text>
        <Text style={[
          styles.txtAreU,
          customTxt(Fonts.Regular, 16, color333333).txt
        ]}>{Translate(languageRedux).LOGOUT_BTN}</Text>
        <TouchableOpacity style={styles.logoutBT} onPress={onPressLogout}>
          <Text style={
            customTxt(Fonts.SemiBold, 16, colorFFFFFF).txt
          }>{Translate(languageRedux).LOGOUT_BTN}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBT} onPress={onPressCancel}>
          <Text style={
            customTxt(Fonts.SemiBold, 16, color005CD8).txt
          }>{Translate(languageRedux).cancel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bgOpacity: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: color000000,
    opacity: 0.53
  },
  logoutView: {
    width: Dimensions.get('window').width - 48,
    height: 252,
    marginLeft: 24,
    marginRight: 24,
    backgroundColor: colorFFFFFF,
    borderRadius: 8
  },
  txtLogout: {
    marginTop: 32,
    marginLeft: 20
  },
  txtAreU: {
    marginTop: 8,
    marginLeft: 20,
    marginRight: 20
  },
  logoutBT: {
    height: 50,
    marginTop: 24,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 8,
    borderRadius: 4,
    backgroundColor: color2F80ED,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cancelBT: {
    height: 50,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    borderRadius: 4,
    backgroundColor: colorF2F2F2,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
