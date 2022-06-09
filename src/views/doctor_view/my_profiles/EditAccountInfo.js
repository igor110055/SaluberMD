import { color040404, color3777EE, colorA7A8A9, colorBDBDBD, colorC1C3C5, colorDDDEE1, colorF0F0F0, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import React, { useState, useEffect } from 'react'
import {
  Dimensions, TouchableOpacity,
  StyleSheet, View, Text, Image,
  TextInput
} from 'react-native'
import { useSelector } from 'react-redux'
import Translate from 'translate'
import TextInputView from 'views/login_signup/components/TextInputView'
import imgDirect from '../../../../assets/images/direct_call'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CustomTextInput from 'views/healthProfile/components/CustomTextInput'
import imgHome from '../../../../assets/images/home_screen'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'

export default function EditAccountInfo({
  onPressClose, virtualOffice, setShowLanguage, language,
  onPressEdit
}) {
  const userinfoRedux = useSelector(state => state.user.userinfo)
  const languageRedux = useSelector(state => state.common.language)
  const [email, setEmail] = useState(virtualOffice?.email || '')
  const [isChange, setChange] = useState(false)

  useEffect(() => {
    if (languageRedux !== language?.value) {
      setChange(true)
    } else if (virtualOffice?.email === email && languageRedux === language?.value) {
      setChange(false)
    }
  }, [languageRedux, language, email])

  const renderHeaderView = () => {
    return (
      <View style={styles.headerView}>
        <Text style={[
          customTxt(Fonts.SemiBold, 16, color040404).txt
        ]}>{Translate(languageRedux).EDIT_ACCOUNT_INFO}</Text>
        <TouchableOpacity style={styles.closeView} onPress={onPressClose}>
          <Image source={imgDirect.ic_close} style={styles.imgClose} />
        </TouchableOpacity>
      </View>
    )
  }

  const renderContent = () => {
    return (
      <>
        <TextInputView
          title={Translate(languageRedux).USERNAME}
          value={userinfoRedux?.username || ''}
          isView={true}
        />
        <TextInputView
          title={Translate(languageRedux).email1}
          value={email}
          onChangeTxt={(txt) => {
            setEmail(txt)
            setChange(true)
          }}
          placeholder={Translate(languageRedux).email1}
        // validate={lastName ? false : true}
        />
        {renderChangePassInPut()}
        {/* <TextInputView
          title={Translate(languageRedux).PASSWORD}
          value={'*******'}
          isView={true}
        /> */}
        <CustomTextInput
          title={Translate(languageRedux).LANGUAGE_TYPE}
          value={language?.name}
          placeholder={Translate(languageRedux).select}
          textStyle={styles.txtStyle}
          onPress={() => setShowLanguage(true)}
          iconRight={imgHome.ic_down}
        />
      </>
    )
  }

  const _onPressChange = () => {
    NavigationService.navigate(Routes.CHANGE_PASSWORD_SCREEN)
  }

  const renderChangePassInPut = () => {
    return (
      <View style={styles.changePass}>
        <Text style={customTxt(Fonts.SemiBold, 14, color040404).txt}>{Translate(languageRedux).PASSWORD}</Text>
        <View style={styles.ctnLayout}>
          <View style={styles.styleInput}>
            <TextInput
              value={'********'}
              onChangeText={() => {}}
              secureTextEntry={true}
              style={[
                styles.txtinputStyle
              ]}
            />
          </View>
          <View style={styles.fullView} />
          <TouchableOpacity onPress={_onPressChange} style={styles.changeButton}>
            <Text style={[customTxt(Fonts.SemiBold, 16, colorFFFFFF).txt, styles.marginHori14]}>Change</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const checkBT = () => {
    return isChange
  }

  const _onPressSubmit = () => {
    onPressEdit(email)
  }

  const renderSubmitButton = () => {

    return (
      <View style={styles.addBT}>
        <TouchableOpacity
          style={btStyle(checkBT()).btView}
          activeOpacity={checkBT() ? 0 : 1}
          onPress={_onPressSubmit}
        >
          <Text style={[
            customTxt(Fonts.SemiBold, 18, colorC1C3C5).txt,
            btStyle(checkBT()).txtBT
          ]}>{Translate(languageRedux).SAVE_CHANGES}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.flexView}>
      <View style={styles.outsideView} />
      <View style={styles.contentView}>
        {renderHeaderView()}
        <KeyboardAwareScrollView
          style={styles.scrollView}
        >
          {renderContent()}
          {renderSubmitButton()}
        </KeyboardAwareScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  flexView: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  outsideView: {
    flex: 1,
    backgroundColor: color040404,
    opacity: 0.4
  },
  contentView: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    backgroundColor: colorFFFFFF,
    top: 64,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
    overflow: 'hidden'
  },
  headerView: {
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeView: {
    position: 'absolute',
    width: 56,
    height: 56,
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgClose: {
    width: 24,
    height: 24
  },
  scrollView: {
    padding: 20
  },
  txtStyle: {
    marginTop: 16
  },
  textinputNoteStyle: {
    flex: 1,
    height: 120,
    paddingTop: 14,
    paddingBottom: 14
  },
  addBT: {
    marginTop: 16
  },
  rowView: {
    flexDirection: 'row'
  },
  fullTxtInputLeft: {
    flex: 1,
    marginRight: 8
  },
  fullTxtInputRight: {
    flex: 1,
    marginLeft: 8
  },
  changePass: {
    marginTop: 16
  },
  styleInput: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  txtinputStyle: {
    width: '100%',
    color: colorA7A8A9
  },
  changeButton: {
    height: 48,
    backgroundColor: color3777EE,
    marginLeft: -84,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    borderColor: color3777EE
  },
  marginHori14: {
    marginHorizontal: 14
  },
  ctnLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    width: '100%',
    marginTop: 4,
    borderRadius: 12,
    paddingLeft: 10,
    color: colorA7A8A9,
    borderColor: colorDDDEE1,
    borderWidth: 1
  },
  fullView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0
  }
})

const btStyle = (isActive) => StyleSheet.create({
  btView: {
    backgroundColor: isActive ? color3777EE : colorF0F0F0,
    borderRadius: 12,
    height: 48,
    minWidth: 117,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  txtBT: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 24,
    marginRight: 24,
    color: isActive ? colorFFFFFF : colorBDBDBD
  }
})
