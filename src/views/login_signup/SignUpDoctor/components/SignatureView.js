import React, {useState} from 'react'
import {View, StyleSheet, Image} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import Signature from 'react-native-signature-canvas'
import { cloneDeep } from 'lodash'

import {color3777EE, colorF8F8F8, colorFFFFFF} from 'constants/colors'
import Translate from 'translate'
import NavigationService from 'navigation'
import { saveBase64Signature } from 'actions/common'

import icHeader from '../../../../../assets/images/header'

import Header from 'components/Header'

export default function SignatureView() {
  const languageRedux = useSelector(state => state.common.language)
  const dispatch = useDispatch()
  const base64Signature = useSelector(state => state.common.base64Signature)
  const [signBase64, setSignBase64] = useState(cloneDeep(base64Signature))

  const handleOK = (signature) => {
    // console.log(signature)
    setSignBase64(signature)
    Promise.all([
      dispatch(saveBase64Signature(signature))
    ])
    NavigationService.goBack()
  }

  const handleEmpty = () => {
    Promise.all([
      dispatch(saveBase64Signature(''))
    ])
    NavigationService.goBack()
  }

  const style = `.m-signature-pad--footer
    .button {
      background-color: ${color3777EE};
      color: ${colorFFFFFF};
    }`

  return (
    <View style={styles.container}>
      <Header
        textCenter={Translate(languageRedux).SIGNUP_BTN}
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_left}
        onPressLeft={() => {
          NavigationService.goBack()
        }}
      />
      <Signature
        onOK={handleOK}
        onEmpty={handleEmpty}
        descriptionText=""
        clearText={Translate(languageRedux).clearsignature}
        confirmText={Translate(languageRedux).SUBMIT}
        webStyle={style}
        dataURL={signBase64}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  preview: {
    width: 335,
    height: 114,
    backgroundColor: colorF8F8F8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15
  }
})
