import { color040404, color3777EE, colorBDBDBD, colorC1C3C5, colorF0F0F0, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import React, { useState } from 'react'
import {
  Dimensions, TouchableOpacity,
  StyleSheet, View, Text, Image
} from 'react-native'
import { useSelector } from 'react-redux'
import Translate from 'translate'
import TextInputView from 'views/login_signup/components/TextInputView'
import imgDirect from '../../../../assets/images/direct_call'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CustomTextInput from 'views/healthProfile/components/CustomTextInput'
import imgHome from '../../../../assets/images/home_screen'

export default function HoursDonationView({
  onPressClose
}) {

  const languageRedux = useSelector(state => state.common.language)
  const [donate, setDonate] = useState('')
  const [hoursBank] = useState('')//setHoursBank

  const renderHeaderView = () => {
    return (
      <View style={styles.headerView}>
        <Text style={[
          customTxt(Fonts.SemiBold, 16, color040404).txt
        ]}>{Translate(languageRedux).HOURS_DONATION}</Text>
        <TouchableOpacity style={styles.closeView} onPress={onPressClose}>
          <Image source={imgDirect.ic_close} style={styles.imgClose} />
        </TouchableOpacity>
      </View>
    )
  }

  const onPressCategory = () => {

  }

  const renderContent = () => {
    return (
      <>
        <TextInputView
          title={Translate(languageRedux).DONATE_HOURS_TITLE}
          value={donate}
          onChangeTxt={(txt) => setDonate(txt)}
          placeholder={Translate(languageRedux).DONATE_HOURS_TITLE}
          validate={donate ? false : true}
        />
        <CustomTextInput
          title={Translate(languageRedux).HOURS_BANK_TITLE}
          value={hoursBank}
          placeholder={Translate(languageRedux).select}
          textStyle={styles.txtStyle}
          onPress={onPressCategory}
          iconRight={imgHome.ic_down}
        />
      </>
    )
  }

  const checkBT = () => {
    return donate
  }

  const _onPressSubmit = () => {

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
          ]}>{Translate(languageRedux).HOURS_BANK_DONATE_BTN}</Text>
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
          <Text style={[
            customTxt(Fonts.SemiBold, 16, color040404).txt
          ]}>{Translate(languageRedux).DONATED}: 0hrs</Text>
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
    marginTop: 24
  },
  textinputNoteStyle: {
    flex: 1,
    height: 120,
    paddingTop: 14,
    paddingBottom: 14
  },
  addBT: {
    marginTop: 16
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
