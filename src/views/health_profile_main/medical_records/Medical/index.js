import React, { useEffect } from 'react'
import { View, StyleSheet  } from 'react-native'
import { useSelector } from 'react-redux'

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

export default function Medical({
  dataDisease, dataAllergy, dataMedication, dataDependency,
  dataImmunization, dataIrregular, dataProsthesis, dataHosnSur
}) {
  const chronic_disease = useSelector(state => state.user.chronic_disease)
  const allergies = useSelector(state => state.user.allergies)
  const medications = useSelector(state => state.user.medications)
  const dependencies = useSelector(state => state.user.dependencies)
  const hospitalization = useSelector(state => state.user.hospitalization)
  const immunizations = useSelector(state => state.user.immunizations)
  const irregular = useSelector(state => state.user.irregular)
  const prosthesis = useSelector(state => state.user.prosthesis)

  useEffect(() => {
  }, [])

  const renderBody = () => {
    return (
      <View>
        {(dataDisease || []).length > 0 && <ChronicDisease dataList={dataDisease} />}
        {(dataAllergy || []).length > 0 && <Allergy dataList={dataAllergy} />}
        {(dataMedication || []).length > 0 && <Medication />}
        {(dataDependency || []).length > 0 && <Dependency />}
        {(dataHosnSur || []).length > 0 && <Hospitalization />}
        {(dataImmunization || []).length > 0 && <Immunization />}
        {(dataIrregular || []).length > 0 && <Irregular />}
        {(dataProsthesis || []).length > 0 && <Prosthesis />}
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
