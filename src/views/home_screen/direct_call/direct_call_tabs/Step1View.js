import React from 'react'
import {
  StyleSheet, View, Text
} from 'react-native'
import { useSelector } from 'react-redux'
import { color333333, color5C5D5E, colorFFFFFF } from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import Translate from '../../../../translate'
import RadioButton from '../../../healthProfile/components/RadioButton'
import CustomTextInput from '../../../healthProfile/components/CustomTextInput'
import { convertDMMMYYYY } from '../../../../constants/DateHelpers'
import CustomNextBT from '../component_direct_call/CustomNextBT'
import imgAccount from '../../../../../assets/images/document'

export default function Step1View({
  value, setValue, name, setName,
  birthday, onPressBirthday,
  onPressNext
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
            onChangeTxt={() => { }}
            placeholder={Translate(languageRedux).SELECT_A_DATE}
            onPress={onPressBirthday}
            validate={birthday ? false : true}
            iconRight={imgAccount.ic_choose_date}
          />
          <CustomNextBT
            textButton={Translate(languageRedux).NEXT}
            isActive={name && birthday}
            onPress={() => {
              if (name && birthday) {
                onPressNext()
              }
            }}
          />
        </View>
      )
    }
    return null
  }

  return (
    <View style={[styles.questionView]}>
      <Text style={[
        customTxt(Fonts.Bold, 18, color333333).txt
      ]} >{Translate(languageRedux).SEE_A_DOCTOR_Q1}</Text>
      <Text style={[
        customTxt(Fonts.Regular, 16, color5C5D5E).txt,
        styles.contentView
      ]}>{Translate(languageRedux).STEP1_QS}</Text>
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
    padding: 20,
    margin: 16,
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    overflow: 'hidden'
  },
  contentView: {
    marginTop: 8,
    marginBottom: 24
  },
  yourChildView: {
    marginTop: 0
  }
})
