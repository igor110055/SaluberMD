import React from 'react'
import {View, Text, StyleSheet, ScrollView} from 'react-native'
import { useSelector } from 'react-redux'

import {color040404, colorF0F0F0, colorFFFFFF} from 'constants/colors'
import Translate from 'translate'
import Fonts from 'constants/Fonts'
import { customTxt } from 'constants/css'
import {convertDMMMYYYY} from 'constants/DateHelpers'

export default function ConsultationInfo({ route }) {
  const languageRedux = useSelector(state => state.common.language)
  const surveyPatient = useSelector(state => state.common.surveyPatient)

  const renderCell = (title, content) => {
    return (
      <View style={styles.ctnCell}>
        <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
          {title}
        </Text>
        <Text style={[customTxt(Fonts.Regular, 18, color040404).txt, styles.marginT8]}>
          {content}
        </Text>
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View>
        {renderCell(Translate(languageRedux).PATIENT, surveyPatient?.survey?.subject || '')}
        {renderCell(Translate(languageRedux).name_member, surveyPatient?.survey?.name || '')}
        {renderCell(Translate(languageRedux).birthdate, convertDMMMYYYY(surveyPatient?.survey?.childbirthdate) || '')}
        <View style={styles.line} />
        {renderCell(Translate(languageRedux).motivazione, surveyPatient?.survey?.description || '')}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={customTxt(Fonts.Bold, 22, color040404).txt}>
        {Translate(languageRedux).CONSULTATION_REQUEST}
      </Text>
      <ScrollView>{renderBody()}</ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorFFFFFF,
    margin: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 9
  },
  marginT8: {
    marginTop: 8
  },
  ctnCell: {
    marginTop: 16
  },
  line: {
    marginTop: 16,
    borderWidth: 0.75,
    borderColor: colorF0F0F0
  }
})
