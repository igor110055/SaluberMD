import React, { useState } from 'react'
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, Platform, ScrollView} from 'react-native'
import { useSelector } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {color000000, colorFFFFFF, color040404, color3777EE, colorC1C3C5, colorF0F0F0} from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from 'translate'
import {checkWhiteSpace} from 'constants/CheckWhiteSpace'

import icHeader from '../../../../../assets/images/header'

import CustomTextInput from '../../../healthProfile/components/CustomTextInput'
import Button from 'components/Button'

export default function Referral({onPressClose, patientId, setStatus, setShowNotiAdd}) {
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const [referral, setReferral] = useState()

  const renderTop = () => {
    return (
      <View>
        <View style={styles.ctnTitle}>
          <View style={styles.flex1} />
          <View style={styles.ctnSOS}>
            <Text style={customTxt(Fonts.SemiBold, 18, color040404).txt}>
              {Translate(languageRedux).NEW_REFERRAL}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.marginR16}
            onPress={onPressClose}>
            <Image source={icHeader.ic_close} style={styles.iconStyleFloat} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        <CustomTextInput
          placeholder={Translate(languageRedux).NEW_REFERRAL}
          value={referral}
          onChangeTxt={(txt) => setReferral(txt)}
          textinputStyle={styles.txtInput}
          multiline={true}
          validate={checkWhiteSpace(referral) ? false : true}
        />
        <Button
          text={Translate(languageRedux).send}
          textColor={checkWhiteSpace(referral) ? colorFFFFFF : colorC1C3C5}
          backgroundColor={checkWhiteSpace(referral) ? color3777EE : colorF0F0F0}
          disabled={checkWhiteSpace(referral) ? false : true}
          onPress={_onPressSend}
        />
        {/* <Button
          text={Translate(languageRedux).ALL_REFERRAL}
          textColor={colorFFFFFF}
          backgroundColor={color3777EE}
          viewStyle={styles.marginT32}
        /> */}
      </View>
    )
  }

  const _onPressSend = () => {
    const body = {
      text: referral,
      patientId: patientId
    }
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/disman/saveReferral`,
      headers: {
        'x-auth-token': token
      },
      data: body
    })
      .then(response => {
        setShowNotiAdd(true)
        console.log('data: ', response.data)
        setStatus(response.data)
        onPressClose()
      })
      .catch(error => {
        console.error('There was an error!', error)
        onPressClose()
      })
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.bgOpacity}
        onPress={onPressClose}
      />
      {Platform.OS === 'ios' && (
        <View style={styles.fullView}>
          {renderTop()}
          <KeyboardAwareScrollView>{renderBody()}</KeyboardAwareScrollView>
        </View>
      )}
      {Platform.OS === 'android' && (
        <ScrollView contentContainerStyle={styles.floatingViewAndroid}>
          {renderTop()}
          {renderBody()}
        </ScrollView>
      )}
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
    opacity: 0.7
  },
  fullView: {
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    height: Dimensions.get('window').height - 64
  },
  ctnTitle: {
    flexDirection: 'row',
    paddingVertical: 16,
    marginBottom: 16
  },
  iconStyleFloat: {
    height: 24,
    width: 24,
    marginRight: 16,
    marginLeft: 16
  },
  ctnSOS: {
    flex: 4,
    alignItems: 'center'
  },
  marginR16: {
    flex: 1,
    alignItems: 'flex-end'
  },
  flex1: {
    flex: 1
  },
  ctnBody: {
    marginHorizontal: 16
  },
  txtInput: {
    height: 108,
    marginBottom: 32
  },
  marginT32: {
    marginTop: 32
  },
  floatingViewAndroid: {
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    top: Dimensions.get('window').height < 800 ? 0 : 64,
    height: Dimensions.get('window').height - 64
  }
})
