import { color040404, color3777EE, colorFFFFFF } from 'constants/colors'
import React from 'react'
import {
  StyleSheet, View, Text, Dimensions, TouchableOpacity
} from 'react-native'
import CSS, { border, customTxt } from 'constants/css'
import Translate from 'translate'
import { useSelector } from 'react-redux'
import Fonts from 'constants/Fonts'
import CustomTextInput from 'views/healthProfile/components/CustomTextInput'
import { convertDateToDDMMMYYYYHHmm } from 'constants/DateHelpers'
import imgDoc from '../../../../assets/images/document'

export default function ScheduleView({
  setShow, since, onPressSince, onPressUpdate
}) {
  const languageRedux = useSelector(state => state.common.language)

  const renderCenterInput = () => {
    return (
      <View style={styles.timeView}>
        <CustomTextInput
          title={Translate(languageRedux).date}
          value={since ? convertDateToDDMMMYYYYHHmm(since) : convertDateToDDMMMYYYYHHmm(new Date())}
          onChangeTxt={() => { }}
          placeholder={Translate(languageRedux).SELECT_A_DATE}
          onPress={onPressSince}
          iconRight={imgDoc.ic_choose_date}
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
            styles.btStyle
          ]}>
          <Text style={customTxt(Fonts.Bold, 16, color3777EE).txt}>{Translate(languageRedux).cancel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPressUpdate}
          style={[
            styles.btStyle,
            styles.bgUpdate
          ]}>
          <Text style={customTxt(Fonts.Bold, 16, colorFFFFFF).txt}>{Translate(languageRedux).UPDATE}</Text>
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
        <View style={[styles.titleView, border().borderB]}>
          <Text style={customTxt(Fonts.Bold, 16, color040404).txt}>{Translate(languageRedux).schedule}</Text>
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
    width: 300,
    height: 200,
    borderRadius: 16
  },
  titleView: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
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
    backgroundColor: color3777EE,
    borderBottomEndRadius: 8
  }
})
