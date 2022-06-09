import { color040404, color3777EE, colorFFFFFF } from 'constants/colors'
import React from 'react'
import {
  StyleSheet, View, Text, Dimensions, TouchableOpacity, Image
} from 'react-native'
import CSS, { border, customTxt } from 'constants/css'
import Translate from 'translate'
import { useSelector } from 'react-redux'
import Fonts from 'constants/Fonts'
import CustomTextInput from 'views/healthProfile/components/CustomTextInput'
import { convertDateTohhmmA } from 'constants/DateHelpers'
import imgReminder from '../../../../assets/images/reminder'

export default function ConfirmView({
  setShow, since, onPressSince, onPressUpdate
}) {
  const languageRedux = useSelector(state => state.common.language)

  const renderCenterInput = () => {
    return (
      <View style={styles.timeView}>
        <CustomTextInput
          value={since ? convertDateTohhmmA(since) : convertDateTohhmmA(new Date())}
          onChangeTxt={() => { }}
          placeholder={Translate(languageRedux).SELECT_A_DATE}
          onPress={onPressSince}
          iconRight={imgReminder.ic_clock}
        />
      </View>
    )
  }

  const renderBottomButton = () => {
    return (
      <View style={[
        styles.buttonView,
        border().borderT
      ]}>
        <TouchableOpacity
          onPress={() => setShow(false)}
          style={[
            styles.btStyle,
            border().borderR
          ]}>
          <Text style={customTxt(Fonts.Bold, 16, color3777EE).txt}>{Translate(languageRedux).cancel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPressUpdate}
          style={[
            styles.btStyle,
            styles.bgUpdate
          ]}>
          <Text style={customTxt(Fonts.Bold, 16, colorFFFFFF).txt}>{Translate(languageRedux).CONFIRM}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setShow(false)}
        style={[
          styles.container,
          styles.bgBlack
        ]} />
      <View style={[styles.centerView, CSS.shadown]}>
        <View style={[styles.titleView]}>
          <Text
          style={[
            customTxt(Fonts.Bold, 16, color040404).txt,
            styles.txtCenter
          ]}
          >{Translate(languageRedux).CONFIRM_THE_TIME_YOU_TOOK_THE_MEDICINE}</Text>
        </View>
        {renderCenterInput()}
        {renderBottomButton()}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bgBlack: {
    backgroundColor: color040404,
    opacity: 0.4
  },
  centerView: {
    backgroundColor: colorFFFFFF,
    width: 270,
    height: 190,
    borderRadius: 16
  },
  titleView: {
    width: '100%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  timeView: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20
  },
  buttonView: {
    flexDirection: 'row'
  },
  btStyle: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bgUpdate: {
    borderBottomEndRadius: 8,
    backgroundColor: color3777EE
  },
  imgClock: {
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },
  txtCenter: {
    textAlign: 'center',
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20
  }
})
