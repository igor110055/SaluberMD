import React from 'react'
import {
  StyleSheet, View, Text
} from 'react-native'
import { useSelector } from 'react-redux'
import _ from 'lodash'

import { color040404, color333333, color3777EE, colorC1C3C5, colorF0F0F0, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from '../../../../translate'

import CustomTextInput from '../../../healthProfile/components/CustomTextInput'
import Button from 'components/Button'

export default function Description({
  value, setValue, onPressNext,
  subject, childname, childbirthdate, specializationID, files
}) {
  const languageRedux = useSelector(state => state.common.language)

  const checkDisable = () => {
    if (value && specializationID && files && subject === false) {
      return true
    }
    if (value && specializationID && files && subject === true &&
      childname && childbirthdate) {
      return true
    }
    else {
      return false
    }
  }

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
          placeholder={Translate(languageRedux).ADD_YOUR_DES_HERE}
          validate={checkWhiteSpace(value) ? false : true}
          multiline={true}
          textinputStyle={[
            customTxt(Fonts.Regular, 16, color040404).txt,
            styles.textinputStyle
          ]}
        />
        <View style={styles.ctnButton}>
          <Button
            text={Translate(languageRedux).NEXT}
            backgroundColor={checkDisable() ? color3777EE : colorF0F0F0}
            textColor={checkDisable() ? colorFFFFFF : colorC1C3C5}
            disabled={!checkDisable()}
            onPress={() => {
              onPressNext()
            }}
          />
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.questionView]}>
      <Text style={[
        customTxt(Fonts.SemiBold, 16, color333333).txt
      ]}>{Translate(languageRedux).MSG_COMPLETE_QESTION}</Text>
      {renderTalkAbout()}
    </View>
  )
}

const styles = StyleSheet.create({
  questionView: {
    paddingHorizontal: 16,
    flex: 1,
    backgroundColor: colorFFFFFF,
    marginHorizontal: 20,
    marginBottom: 48,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16
  },
  talkView: {
    marginTop: 8
  },
  textinputStyle: {
    height: 144,
    paddingTop: 12,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 12
  },
  ctnButton: {
    marginTop: 20,
    paddingBottom: 20
  }
})
