import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ScrollView, DeviceEventEmitter } from 'react-native'
import { colorF8F8F8, color0B40B1, color3777EE } from 'constants/colors'
import NavigationService from '../../../routes'
import Routes from '../../../routes/Routes'

import icVisit from '../../../../assets/images/visit'
import PersonalInfo from './PersonalInfo'
import Medical from './Medical'
import {
  apiGetDisease,
  apiGetAllergy,
  apiGetMedication,
  apiGetDependency,
  apiGetImmunizations,
  apiGetIrregular,
  apiGetProsthesis,
  apiGetHospitalizations,
  apiGetListDependencies,
  apiGetListDisease
} from '../apis'
import SOSButton from '../../home/components/SOSButton/SOSButton'
import * as StateLocal from '../../../state_local'
import { apiUserInfo } from '../../home/apis'

export default function MedicalRecords({ isLoading }) {
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
  const [toggleReload, setToggleReload] = useState(1)
  const [isLoad, setLoading] = useState(true)

  useEffect(() => {
    callAPIUserinfo()
  }, [])

  useEffect(() => {
    callAPIUserinfo()

    callAPIChronicDisease()

    callAPIAllergy()

    callAPIMedi()

    callAPIDepen()

    callAPIImmu()

    callAPIIrre()

    callAPIPros()

    callAPIHospitalnSurgery()
    // DeviceEventEmitter.addListener('update', () => {
    //   setRefresh(true)
    //   setToggleReload(Math.random())
    //   setTimeout(() => {
    //     setRefresh(false)
    //   }, 3000)
    // })
  }, [refreshing])

  const callAPIUserinfo = () => {
    apiUserInfo().then(async res => {
      const parseData = await res.json()
      const getuserInfo = parseData?.user
      StateLocal.userinfo = getuserInfo
    })
  }

  const callAPIChronicDisease = () => {
    apiGetDisease().then(async res => {
      const parseData = await res.json()
      const getList = parseData?.malattie || []
      StateLocal.chronic_disease = getList
    })

    apiGetListDisease().then(async res => {
      const parseData = await res.json()
      const getList = parseData?.malattie || []
      StateLocal.medicalDataDisease = getList
    })
  }

  const callAPIAllergy = () => {
    apiGetAllergy().then(async res => {
      const parseData = await res.json()
      const getList = parseData?.allergie || []
      StateLocal.allergies = getList
    })
  }

  const callAPIMedi = () => {
    apiGetMedication().then(async res => {
      const parseData = await res.json()
      const getList = parseData?.farmaci || []
      StateLocal.medications = getList
    })
  }

  const callAPIDepen = () => {
    apiGetDependency().then(async res => {
      const parseData = await res.json()
      const getList = parseData?.dipendenze || []
      StateLocal.dependency = getList
    })

    apiGetListDependencies().then(async res => {
      const parseData = await res.json()
      const getList = parseData?.dipendenze || []
      StateLocal.medicalDataDependencies = getList
    })
  }

  const callAPIImmu = () => {
    apiGetImmunizations().then(async res => {
      const parseData = await res.json()
      const getList = parseData?.vaccini || []
      StateLocal.immunization = getList
    })
  }

  const callAPIIrre = () => {
    apiGetIrregular().then(async res => {
      const parseData = await res.json()
      const getList = parseData?.test || []
      StateLocal.irregular = getList
    })
  }

  const callAPIPros = () => {
    apiGetProsthesis().then(async res => {
      const parseData = await res.json()
      const getList = parseData?.protesi || []
      StateLocal.prothesis = getList
    })
  }

  const callAPIHospitalnSurgery = () => {
    apiGetHospitalizations().then(async res => {
      const parseData = await res.json()
      const getList = parseData?.ricoveri || []
      StateLocal.hospitalization = getList
    })
  }

  const renderBody = () => {
    return (
      <View style={styles.container}>
        <PersonalInfo />
        <Medical />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}>
        {!isLoading && renderBody()}
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
