import React from 'react'
import { View, StyleSheet  } from 'react-native'
import { color3777EE, colorFFFFFF } from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import Translate from '../../../../translate'

import ChronicDisease from './ChronicDisease'
import Allergy from './Allergy'
import Medication from './Medication'
import Dependency from './Dependency'
import Hospitalization from './Hospitalization'
import Immunization from './Immunization'
import Irregular from './Irregular'
import Prosthesis from './Prosthesis'
import * as StateLocal from '../../../../state_local'

export default function Medical() {

  const languageRedux = StateLocal.userinfo?.language_id || 'en_US'
  const chronic_disease = StateLocal.chronic_disease || []
  const allergies = StateLocal.allergies || []
  const medications = StateLocal.medications || []
  const dependencies = StateLocal.dependency || []
  const hospitalization = StateLocal.hospitalization || []
  const immunizations = StateLocal.immunization || []
  const irregular = StateLocal.irregular || []
  const prosthesis = StateLocal.prothesis || []

  const renderBody = () => {
    return (
      <View>
        {chronic_disease.length > 0 && <ChronicDisease />}
        {allergies.length > 0 && <Allergy />}
        {medications.length > 0 && <Medication />}
        {dependencies.length > 0 && <Dependency />}
        {hospitalization.length > 0 && <Hospitalization />}
        {immunizations.length > 0 && <Immunization />}
        {irregular.length > 0 && <Irregular />}
        {prosthesis.length > 0 && <Prosthesis />}
      </View>
    )
  }

  return (
    <View style={styles.bottom42}>
      {renderBody()}
    </View>
  )
}

const styles = StyleSheet.create({
  ctnCategory: {
    height: 56,
    backgroundColor: color3777EE,
    marginHorizontal: 20,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    marginBottom: 0,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9
  },
  marginL16: {
    marginLeft: 16,
    flex: 1
  },
  marginR16: {
    marginRight: 16
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  flexRow: {
    flexDirection: 'row'
  },
  viewName: {
    backgroundColor: colorFFFFFF,
    marginHorizontal: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9
  },
  nameStyle: {
    marginVertical: 24,
    marginHorizontal: 16
  },
  bottom42: {
    marginBottom: 42
  }
})
