import React, { useState } from 'react'
import {
  StyleSheet, View, Text, Dimensions,
  TouchableOpacity
} from 'react-native'
import {
  color000000, color005CD8, color2F80ED,
  color333333, colorF2F2F2, colorFFFFFF
} from '../../../constants/colors'
import { customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'
import {
  KeyboardAwareScrollView
} from 'react-native-keyboard-aware-scroll-view'
import CustomTextInput from './CustomTextInput'
import { useSelector } from 'react-redux'
import Translate from 'translate'

export default function PopupChangePassword({
  onPressCancel,
  onPressConfirm,
  currentPass, setCurrentPass,
  newPass, setNewPass,
  confirmPass, setConfirmPass
}) {
  const [securePass, setSecurePass] = useState(true)
  const [secureNewPass, setSecureNewPass] = useState(true)
  const [secureConfirm, setSecureConfirm] = useState(true)
  const languageRedux = useSelector(state => state.common.language)


  const renderTitle = () => {
    return (
      <>
        <Text style={[
          customTxt(Fonts.SemiBold, 20, color333333).txt
          ]}>{Translate(languageRedux).CHANGE_PWD_SECTION_TITLE}
        </Text>
      </>
    )
  }

  const renderTextInput = () => {
    return (
      <>
        <CustomTextInput
          title={Translate(languageRedux).CURRENT_PASSWORD}
          value={currentPass}
          isSecure={securePass}
          onPressSecure={() => setSecurePass(!securePass)}
          onChangeTxt={txt => setCurrentPass(txt)}
          isShowImg={true}
        />
        <CustomTextInput
          title={Translate(languageRedux).NEW_PASSWORD}
          value={newPass}
          isSecure={secureNewPass}
          onPressSecure={() => setSecureNewPass(!secureNewPass)}
          onChangeTxt={txt => setNewPass(txt)}
          isShowImg={true}
        />
        <CustomTextInput
          title={Translate(languageRedux).CONFIRM_NEW_PASSWORD}
          value={confirmPass}
          isSecure={secureConfirm}
          onPressSecure={() => setSecureConfirm(!secureConfirm)}
          onChangeTxt={txt => setConfirmPass(txt)}
          isShowImg={true}
        />
      </>
    )
  }

  const renderButton = () => {
    return (
      <>
        <TouchableOpacity style={styles.logoutBT} onPress={onPressConfirm}>
          <Text style={
            customTxt(Fonts.SemiBold, 16, colorFFFFFF).txt
          }>{Translate(languageRedux).CONFIRM}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBT} onPress={onPressCancel}>
          <Text style={
            customTxt(Fonts.SemiBold, 16, color005CD8).txt
          }>{Translate(languageRedux).cancel}</Text>
        </TouchableOpacity>
      </>
    )
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.bgOpacity} onPress={onPressCancel} />
      <KeyboardAwareScrollView>
        <View style={styles.fullView}>
          <View style={styles.logoutView}>
            {renderTitle()}
            {renderTextInput()}
            {renderButton()}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  fullView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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
    marginLeft: 24,
    marginRight: 24,
    backgroundColor: colorFFFFFF,
    borderRadius: 8,
    padding: 20
  },
  txtAreU: {
    marginTop: 8
  },
  logoutBT: {
    height: 50,
    marginTop: 24,
    marginBottom: 8,
    borderRadius: 4,
    backgroundColor: color2F80ED,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cancelBT: {
    height: 50,
    borderRadius: 4,
    backgroundColor: colorF2F2F2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  }
})
