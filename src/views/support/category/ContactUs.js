import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import DeviceInfo from 'react-native-device-info'

import { color040404, color3777EE, colorA7A8A9, colorC1C3C5, colorF0F0F0, colorFFFFFF } from 'constants/colors'
import Translate from '../../../translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'

import icHeader from '../../../../assets/images/header'

import Header from '../../healthProfile/components/Header'
import CustomTextInput from '../../healthProfile/components/CustomTextInput'
import Button from '../../../components/Button'
import DialogView from '../../../components/DialogView'

export default function ContactUs() {

  const languageRedux = useSelector(state => state.common.language)
  const [mes, setMes] = useState()
  const [isDialog, setDialog] = useState(false)

  const InfoView = ({ text }) => {
    return (
      <View style={styles.infoView}>
        <Text style={[
          customTxt(Fonts.Regular, 14, colorA7A8A9).txt
        ]}>{text}</Text>
      </View>
    )
  }

  const renderBody = () => {
    const checkWhiteSpace = (s) => {
      var format = /^[^a-zA-Z0-9]+$/
      if (_.isEmpty(s)) {
        return false
      }
      if (format.test(s)) {
        return false
      } else {
        return true
      }
    }
    return (
      <View style={styles.marginHori}>
        <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginB16]}>
          {Translate(languageRedux).CONTACT_US_SECTION_TITLE1}
        </Text>
        <CustomTextInput
          value={mes}
          onChangeTxt={(txt) => setMes(txt)}
          placeholder={Translate(languageRedux).PLACEHOLDER_TEXTINPUT_CONTACT_US}
          validate={checkWhiteSpace(mes) ? false : true}
          multiline={true}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.textinputStyle]}
        />
        <Button
          text={Translate(languageRedux).SUBMIT}
          textColor={checkWhiteSpace(mes) ? colorFFFFFF : colorC1C3C5}
          backgroundColor={checkWhiteSpace(mes) ? color3777EE : colorF0F0F0}
          disabled={checkWhiteSpace(mes) ? false : true}
          onPress={() => {setDialog(true)}}
        />
        <View style={styles.infoVersion}>
          <InfoView text={`${Translate(languageRedux).APP_VERSION}: ${DeviceInfo.getVersion()}`} />
          <InfoView text={`${Translate(languageRedux).BUILD_NUMBER}: ${DeviceInfo.getBuildNumber()}`} />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        source={icHeader.ic_left}
        title={Translate(languageRedux).CONTACT_US_TITLE}
      />
      <ScrollView>{renderBody()}</ScrollView>
      <DialogView
        isShow={isDialog}
        onPressCancel={() => {NavigationService.navigate(Routes.DRAWER_NAVIGATION)}}
        title={Translate(languageRedux).THANK_YOU}
        content={Translate(languageRedux).CONTENT_DIALOG_CONTACT_US}
        txt1={Translate(languageRedux).OK}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  marginHori: {
    marginHorizontal: 20
  },
  marginB16: {
    marginBottom: 16
  },
  textinputStyle: {
    height: 160,
    paddingBottom: 12,
    marginBottom: 24
  },
  infoVersion: {
    marginTop: 16,
    alignItems: 'center'
  },
  infoView: {
    marginBottom: 8
  }
})
