import React from 'react'
import {
  StyleSheet, View, Text
} from 'react-native'
import { useSelector } from 'react-redux'
import _ from 'lodash'

import { color040404, color333333, colorFFFFFF } from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import Translate from '../../../../translate'

import CustomTextInput from '../../../healthProfile/components/CustomTextInput'

export default function Description({
  value, setValue
}) {
  const languageRedux = useSelector(state => state.common.language)

  const renderTalkAbout = () => {
    const checkWhiteSpace = s => {
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
      <View style={styles.talkView}>
        <CustomTextInput
          value={value || ''}
          onChangeTxt={txt => setValue(txt)}
          validate={checkWhiteSpace(value) ? false : true}
          multiline={true}
          textinputStyle={[
            customTxt(Fonts.Regular, 16, color040404).txt,
            styles.textinputStyle
          ]}
        />
      </View>
    )
  }

  return (
    <View style={[styles.questionView]}>
      <Text style={[
        customTxt(Fonts.SemiBold, 16, color333333).txt
      ]}>{Translate(languageRedux).doctorAtHomeQuestion3}</Text>
      {renderTalkAbout()}
    </View>
  )
}

const styles = StyleSheet.create({
  questionView: {
    padding: 16,
    marginHorizontal: 20,
    backgroundColor: colorFFFFFF,
    overflow: 'hidden'
  },
  talkView: {
    marginTop: 12
  },
  textinputStyle: {
    height: 144,
    paddingTop: 12,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 12
  }
})
