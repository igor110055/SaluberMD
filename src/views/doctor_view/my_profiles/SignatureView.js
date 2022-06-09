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
import imgDirect from '../../../../assets/images/direct_call'
import SignatureScreen from 'react-native-signature-canvas'

export default function EditAccountInfo({
  onPressClose, onPressUpdate, dataSignature, onOK,
  signBase64
}) {
  const languageRedux = useSelector(state => state.common.language)
  const [isChange, setChange] = useState(false)
  const [base64, setBase64] = useState(signBase64)
  const ref = React.useRef()

  // Called after ref.current.readSignature() reads a non-empty base64 string
  const handleOK = (signature) => {
    setBase64(signature)
    setChange(true)
    onOK(signature || signBase64)
  }

  // Called after ref.current.readSignature() reads an empty string
  const handleEmpty = () => {
    console.log('Empty')
  }

  // Called after ref.current.clearSignature()
  const handleClear = () => {
    console.log('clear success!')
    setChange(true)
  }

  // Called after end of stroke
  const handleEnd = () => {
    ref.current.readSignature()
  }

  // Called after ref.current.getData()
  const handleData = (data) => {
    console.log(data)
  }

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

  const checkBT = () => {
    return isChange
  }

  const _onPressSubmit = () => {
    onOK(base64)
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
          ]}>{Translate(languageRedux).update_list}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.flexView}>
      <View style={styles.outsideView} />
      <View style={styles.contentView}>
        {renderHeaderView()}
        <SignatureScreen
          ref={ref}
          // onEnd={handleEnd}
          onOK={handleOK}
          onEmpty={handleEmpty}
          onClear={handleClear}
          onGetData={handleData}
          descriptionText={''}
          clearText={Translate(languageRedux).clearsignature}
          // confirmText={''}//Translate(languageRedux).SUBMIT}
          dataURL={base64}
        />
        {/* {renderSubmitButton()} */}
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
    marginTop: 16,
    marginBottom: 20,
    marginLeft: 16,
    marginRight: 16
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
