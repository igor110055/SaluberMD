import React, { useEffect, useState } from 'react'
import { View, StyleSheet, DeviceEventEmitter, Dimensions } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Header from '../../components/Header'
import { color3777EE, colorA7A8A9, colorF8F8F8, colorFFFFFF } from '../../constants/colors'
import NavigationService from '../../routes'
import Fonts from '../../constants/Fonts'
import Translate from '../../translate'
import { PrintAllMedical } from './PrintAllMedical'
import icHeader from '../../../assets/images/header'
import icHealthProfile from '../../../assets/images/health_profile'
import LoadingView from '../../components/LoadingView'
import { useNavigation } from '@react-navigation/native'
import Routes from '../../routes/Routes'

const Tab = createMaterialTopTabNavigator()

import MedicalRecords from './medical_records'
import Tracking from './tracking'
import FileArchive from './file_archive'
import WellnessData from './wellness_data'
import * as StateLocal from '../../state_local'
import {
  apiGetComplicationDisease,
  apiGetDisease,
  apiGetListDisease,
  apiGetAllergy,
  apiGetListAllergy,
  apiGetAllMedicine,
  apiGetMedication,
  apiGetListDependencies,
  apiGetDependency,
  apiGetListImmunizations,
  apiGetImmunizations,
  apiGetListIrre,
  apiGetIrregular,
  apiGetListProsthesis,
  apiGetProsthesis,
  apiGetHospitalizations,
  apiGetListHospitalizations,
  apiGetListCategoryFile,
  apiGetListDocument
} from './apis'
import MenuBar from '../../components/MenuBar'

export default function HealthProfileMain() {
  const languageRedux = StateLocal.userinfo?.language_id || 'en_US'
  const [isLoad, setLoading] = useState(true)
  const [reLoad, setReLoad] = useState(1)
  const navigation = useNavigation()

  useEffect(() => {
    callAPIChronicDisease()
    callAPIComplicationDisease()
    callAPIListDisease()

    callAPIAllergy()
    callAPIListAllergy()

    callAPIListMedi()
    callAPIMedi()

    callAPIListDepen()
    callAPIDepen()

    callAPIListImmu()
    callAPIImmu()

    callAPIListIrre()
    callAPIIrre()

    callAPIListPros()
    callAPIPros()

    callAPIHospitalnSurgery()
    callAPIHospital()

    callAPIListDocument()
    callAPIListCategoryFile()

    // DeviceEventEmitter.addListener('update', () => {
    //   setLoading(true)
    //   setReLoad(Math.random())
    //   setTimeout(() => {
    //     setLoading(false)
    //   }, 3000)
    // })
  }, [])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.HEALTH_PROFILE_TRACKING_SCREEN, params => {
      if (params?.tracking) {
        navigation.navigate('Tracking')
      }
    })
    return () => subscription.remove()
  }, [])

  const callAPIChronicDisease = () => {
    apiGetDisease().then(async res => {
      const parseData = await res.json()
      const getList = parseData?.malattie || []
      StateLocal.disease = getList
    })
  }

  const callAPIListDisease = () => {
    apiGetListDisease().then(async res => {
      const parseData = await res.json()
      const getList = parseData?.malattie || []
      StateLocal.medicalDataDisease = getList
    })
  }

  const callAPIComplicationDisease = () => {
    apiGetComplicationDisease().then(async res => {
      const parseData = await res.json()
      const getList = parseData?.complicazioni || []
      StateLocal.complication = getList
    })
  }

  const callAPIAllergy = () => {
    apiGetAllergy().then(async res => {
      const parseData = await res.json()
      const getList = parseData?.allergie || []
      StateLocal.allergies = getList
    })
  }

  const callAPIListAllergy = () => {
    apiGetListAllergy().then(async res => {
      const parseData = await res.json()
      const getList = parseData?.allergie || []
      StateLocal.medicalDataAllergies = getList
    })
  }

  const callAPIListMedi = () => {
    apiGetAllMedicine().then(async res => {
      const parseData = await res.json()
      const getList = parseData?.medicine || []
      const getListForm = response.data.tipiFarmaci || []
      StateLocal.medicalDataMedicine = getList
      StateLocal.medicalMediForm = getListForm
    })
  }

  const callAPIMedi = () => {
    apiGetMedication().then(async res => {
      const parseData = await res.json()
      const getList = parseData?.farmaci || []
      StateLocal.medications = getList
    })
  }

  const callAPIListDepen = () => {
    apiGetListDependencies().then(async res => {
      const parseData = await res.json()
      const getList = parseData?.dipendenze || []
      StateLocal.medicalDataDipendenze = getList
    })
  }

  const callAPIDepen = () => {
    apiGetDependency().then(async res => {
      const parseData = await res.json()
      const getList = parseData?.dipendenze || []
      StateLocal.dependency = getList
    })
  }

  const callAPIListImmu = () => {
    apiGetListImmunizations().then(async res => {
      const parseData = await res.json()
      const getList = parseData?.vaccini || []
      StateLocal.medicalDataImmunization = getList
    })
  }

  const callAPIImmu = () => {
    apiGetImmunizations().then(async res => {
      const parseData = await res.json()
      const getList = parseData?.vaccini || []
      StateLocal.immunization = getList
    })
  }

  const callAPIListIrre = () => {
    apiGetListIrre().then(async res => {
      const parseData = await res.json()
      const getList = parseData?.test || []
      StateLocal.medicalDataIrre = getList
    })
  }

  const callAPIIrre = () => {
    apiGetIrregular().then(async res => {
      const parseData = await res.json()
      const getList = parseData?.test || []
      StateLocal.irregular = getList
    })
  }

  const callAPIListPros = () => {
    apiGetListProsthesis().then(async res => {
      const parseData = await res.json()
      const getList = parseData?.protesi || []
      StateLocal.medicalDataProsthesis = getList
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

  const callAPIHospital = () => {
    apiGetListHospitalizations().then(async res => {
      const parseData = await res.json()
      StateLocal.medicalDataHospitalization = parseData?.ospedalizzazioni || []
      StateLocal.medicalDataSurgery = parseData?.interventi || []
      StateLocal.medicalDataSubInterventi = parseData?.subInterventi || []
    })
  }

  const callAPIListCategoryFile = () => {
    apiGetListCategoryFile().then(async res => {
      const parseData = await res.json()
      StateLocal.lsCategoryFile = parseData?.categorie || []
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }

  const callAPIListDocument = () => {
    apiGetListDocument().then(async res => {
      const parseData = await res.json()
      StateLocal.lsDataNewDoc = parseData?.documenti || []
    })
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).HEALTH_PROFILE}
        iconLeft={icHeader.ic_menudrawer}
        iconRight={icHealthProfile.ic_function_right}
        onPressRight={() => { }}
      />
      <View style={styles.menuView}>
        <MenuBar />
        <Tab.Navigator
          style={styles.styleTopBar}
          screenOptions={{
            tabBarActiveTintColor: color3777EE,
            tabBarInactiveTintColor: colorA7A8A9,
            tabBarLabelStyle: {
              fontSize: 12,
              textTransform: 'none',
              fontFamily: Fonts.SemiBold
            },
            tabBarStyle: {
              height: 52,
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16
            },
            tabBarIndicatorStyle: {
              height: 4,
              width: 76,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              marginHorizontal: ((Dimensions.get('window').width - 300) / 4 - 76) / 2
            }
          }}>
          <Tab.Screen
            name={'Medical'}
            options={{ tabBarLabel: Translate(languageRedux).MEDICAL_RECORDS || '' }}
            component={() => {
              return <MedicalRecords isLoading={isLoad} />
            }}
          />
          <Tab.Screen
            name={'Tracking'}
            options={{ tabBarLabel: Translate(languageRedux).TRACKING || '' }}
            component={Tracking}
          />
          <Tab.Screen
            name={'Wellness'}
            options={{ tabBarLabel: Translate(languageRedux).wellnessdata || '' }}
            component={WellnessData}
          />
          <Tab.Screen
            name={'File'}
            options={{ tabBarLabel: Translate(languageRedux).FILE_ARCHIVE || '' }}
            component={FileArchive}
          />
        </Tab.Navigator>
      </View>
      {isLoad && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: colorF8F8F8
  },
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  menuView: {
    flex: 1,
    flexDirection: 'row'
  },
  fullView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute'
  }
})
