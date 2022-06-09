import React, { useEffect } from 'react'
import {
  StyleSheet, View, Text
} from 'react-native'
import { useSelector } from 'react-redux'
import {
  colorFFFFFF, color333333
} from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import Translate from '../../../../translate'
import CustomTextShow from '../component_direct_call/CustomTextShow'
import CustomButtonFillFix from '../component_direct_call/CustomButtonFillFix'

export default function Step4View({
  valueDoctor, valueTalkAbout, onPress
}) {
  const languageRedux = useSelector(state => state.common.language)

  useEffect(() => {
    console.log('Doctor: ', valueDoctor)
  }, [])

  const getListSpecialization = valueDoctor?.specialization || []
  var getNameSpecialization = getListSpecialization.map((val, index) => {
    if (index === getListSpecialization.length - 1) {
      return `${val}`
    }
    return `${val}, `
  })

  return (
    <View style={[styles.questionView]}>
      <Text style={[
        customTxt(Fonts.Bold, 18, color333333).txt
      ]} >{Translate(languageRedux).CONFIRM_THE_DIRECT_CALL_REQUEST}</Text>
      <CustomTextShow
        title={Translate(languageRedux).PROVIDER}
        content={valueDoctor?.name || Translate(languageRedux).ANY_FREE_PROVIDER}
      />
      {
        getNameSpecialization.length > 0 && (
          <CustomTextShow
            title={Translate(languageRedux).SPECIALITY}
            content={getNameSpecialization || ''}
          />
        )
      }
      <CustomTextShow
        title={Translate(languageRedux).description}
        content={valueTalkAbout || ''}
      />
      <CustomButtonFillFix
        title={Translate(languageRedux).CONFIRM_REQUEST}
        btStyle={styles.marginT16}
        onPress={onPress}
      />
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
  marginT16: {
    marginTop: 16
  }
})
