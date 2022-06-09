import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native'

import { colorF8F8F8, color0B40B1, color3777EE } from 'constants/colors'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'

import icVisit from '../../../../assets/images/visit'

import PersonalInfo from './PersonalInfo'
import SOSButton from 'views/home_screen/components/SOSButton/SOSButton'
import ChronicDisease from './Medical/ChronicDisease'
import Allergy from './Medical/Allergy'
import Medication from './Medical/Medication'
import Dependency from './Medical/Dependency'
import Hospitalization from './Medical/Hospitalization'
import Immunization from './Medical/Immunization'
import Irregular from './Medical/Irregular'
import Prosthesis from './Medical/Prosthesis'

export default function MedicalRecords({
  dataDisease, dataAllergy, dataMedication, dataDependency,
  dataImmunization, dataIrregular, dataProsthesis, dataHosnSur,
  setReload
}) {
  const _onPressNewRecord = () => {
    NavigationService.navigate(Routes.NEW_RECORD_HEALTH_PROFILE)
  }

  const renderPlusButton = () => {
    return (
      <SOSButton
        source={icVisit.ic_plus}
        backgroundColor={color3777EE}
        onPress={_onPressNewRecord}
      />
    )
  }

  const [refreshing, setRefresh] = useState(false)

  const _onRefresh = () => {
    setRefresh(true)
    setReload(true)
    setTimeout(() => {
      setRefresh(false)
    }, 3000)
  }

  const renderBody = () => {
    return (
      <View>
        <PersonalInfo />
        {(dataDisease || []).length > 0 && <ChronicDisease dataList={dataDisease} />}
        {(dataAllergy || []).length > 0 && <Allergy dataList={dataAllergy} />}
        {(dataMedication || []).length > 0 && <Medication dataList={dataMedication} />}
        {(dataDependency || []).length > 0 && <Dependency dataList={dataDependency} />}
        {(dataHosnSur || []).length > 0 && <Hospitalization dataList={dataHosnSur} />}
        {(dataImmunization || []).length > 0 && <Immunization dataList={dataImmunization} />}
        {(dataIrregular || []).length > 0 && <Irregular dataList={dataIrregular} />}
        {(dataProsthesis || []).length > 0 && <Prosthesis dataList={dataProsthesis} />}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={_onRefresh}
            tintColor={color0B40B1}
          />
        }
      >
        {renderBody()}
      </ScrollView>
      {renderPlusButton()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  contentContainer: {
    paddingBottom: 80
  }
})
