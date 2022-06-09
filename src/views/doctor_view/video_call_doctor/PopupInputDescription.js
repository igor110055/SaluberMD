import React, {useState} from 'react'
import {View, Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native'
import { useSelector } from 'react-redux'

import { color000000, color2F80ED, color333333, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from 'translate'
import CustomTextInput from '../../healthProfile/components/CustomTextInput'

export default function PopupInputDescription({
    onPressCancel, onPressSend,
    valueInput, setValueInput
}) {
  const languageRedux = useSelector(state => state.common.language)

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.bgOpacity} onPress={onPressCancel}/>
      <View style={styles.logoutView}>
        <Text style={[
          styles.txtLogout,
          customTxt(Fonts.SemiBold, 20, color333333).txt
        ]}>{Translate(languageRedux).descrizione}</Text>
        <CustomTextInput
          multiline={true}
          textinputStyle={styles.txtInput}
          value={valueInput}
          onChangeTxt={(txt) => setValueInput(txt)}
        />
        <TouchableOpacity style={styles.logoutBT} onPress={onPressSend}>
          <Text style={
            customTxt(Fonts.SemiBold, 16, colorFFFFFF).txt
          }>{Translate(languageRedux).send}</Text>
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
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: colorFFFFFF,
    borderRadius: 8
  },
  txtLogout: {
    alignSelf: 'center',
    marginBottom: 16
  },
  txtAreU: {
    marginTop: 8,
    marginLeft: 20,
    marginRight: 20
  },
  logoutBT: {
    height: 50,
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: color2F80ED,
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtInput: {
    height: 98
  }
})
