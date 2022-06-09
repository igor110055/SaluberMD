import React from 'react'
import {
  StyleSheet, View, Text
} from 'react-native'
import { useSelector } from 'react-redux'
import { color333333, colorFFFFFF } from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import Translate from '../../../../translate'
import RadioButton from '../../../healthProfile/components/RadioButton'
import CustomTextInput from '../../../healthProfile/components/CustomTextInput'
import { convertDMMMYYYY } from '../../../../constants/DateHelpers'
import icDoc from '../../../../../assets/images/document'

export default function Step1({
  value, setValue, name, setName,
  birthday, onPressBirthday
}) {
  const languageRedux = useSelector(state => state.common.language)

  const renderYourChild = () => {
    if (value) {
      return (
        <View style={styles.yourChildView}>
          <CustomTextInput
            title={Translate(languageRedux).YOUR_CHILD_NAME}
            value={name || ''}
            onChangeTxt={(txt) => setName(txt)}
            placeholder={Translate(languageRedux).name_member}
            validate={name ? false : true}
          />
          <CustomTextInput
            title={Translate(languageRedux).YOUR_CHILD_BIRTHDAY}
            value={birthday ? convertDMMMYYYY(birthday) : ''}
            onChangeTxt={() => {}}
            placeholder={Translate(languageRedux).SELECT_A_DATE}
            onPress={onPressBirthday}
            validate={birthday ? false : true}
            iconRight={icDoc.ic_choose_date}
          />
        </View>
      )
    }
    return null
  }

  return (
    <View style={[styles.questionView]}>
      <Text style={[
        customTxt(Fonts.SemiBold, 16, color333333).txt, styles.contentView
      ]}>{Translate(languageRedux).second_opinion_question1}</Text>
      <RadioButton
        title1={Translate(languageRedux).SEE_A_DOCTOR_Q1_A1}
        title2={Translate(languageRedux).SEE_A_DOCTOR_Q1_A2}
        value={value}
        setValue={(val) => setValue(val)}
      />
      {renderYourChild()}
    </View>
  )
}

const styles = StyleSheet.create({
  questionView: {
    padding: 16,
    flex: 1,
    backgroundColor: colorFFFFFF,
    marginTop: 20,
    marginHorizontal: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  contentView: {
    marginBottom: 12
  },
  yourChildView: {
    marginTop: 0
  }
})
