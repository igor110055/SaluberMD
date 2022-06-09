import React, { useEffect, useState } from 'react'
import { View, StyleSheet, DeviceEventEmitter, Dimensions } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../api/APIs'
import _ from 'lodash'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Header from '../../components/Header'
import { color3777EE, colorA7A8A9, colorF8F8F8, colorFFFFFF } from 'constants/colors'
import NavigationService from 'navigation'
import Fonts from 'constants/Fonts'
import Translate from '../../translate'
import { PrintAllMedical } from './PrintAllMedical'

import icHeader from '../../../assets/images/header'
import icHealthProfile from '../../../assets/images/health_profile'
import LoadingView from '../../components/LoadingView'
import { useNavigation } from '@react-navigation/native'
import Routes from 'navigation/Routes'

const Tab = createMaterialTopTabNavigator()

import MedicalRecords from './medical_records'
import Tracking from './tracking'
import FileArchive from './file_archive'
import WellnessData from './wellness_data'
import { saveAllergies, saveChronicDisease, saveDependencies, saveHospitalization, saveImmunizations, saveIrregular, saveMedications, saveProsthesis } from 'actions/user'

export default function HealthProfileMain() {
  const dispatch = useDispatch()
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const [isLoad, setLoading] = useState(true)
  const navigation = useNavigation()
  const [listDisease, setListDisease] = useState([])
  const [listAllergy, setListAllergy] = useState([])
  const [listMedication, setListMedication] = useState([])
  const [listDependency, setListDependency] = useState([])
  const [listImmunization, setListImmunization] = useState([])
  const [listIrregular, setListIrregular] = useState([])
  const [listProsthesis, setListProsthesis] = useState([])
  const [listHosnSur, setListHosnSur] = useState([])
  const [reloadAllergy, setReloadAllergy] = useState(1)
  const [listDocument, setListDocument] = useState([])
  const [reloadDisease, setReloadDisease] = useState(1)
  const [reloadMedi, setReloadMedi] = useState(1)
  const [reloadImmu, setReloadImmu] = useState(1)
  const [reloadDpen, setReloadDepen] = useState(1)
  const [reloadIrre, setReloadIrre] = useState(1)
  const [reloadPros, setReloadPros] = useState(1)
  const [reloadHos, setReloadHos] = useState(1)
  const [listCategory, setListCategory] = useState([])
  const [reloadDoc, setReloadDoc] = useState(1)

  useEffect(() => {
    callAPIListCategoryFile()
  }, [isLoad, reloadDoc])

  useEffect(() => {
    callAPIChronicDisease()
  }, [reloadDisease, isLoad])

  useEffect(() => {
    callAPIAllergy()
  }, [reloadAllergy, isLoad])

  useEffect(() => {
    callAPIMedication()
  }, [reloadMedi, isLoad])

  useEffect(() => {
    callAPIImmunization()
  }, [reloadImmu, isLoad])

  useEffect(() => {
    callAPIDependency()
  }, [reloadDpen, isLoad])

  useEffect(() => {
    callAPIIrregular()
  }, [reloadIrre, isLoad])

  useEffect(() => {
    callAPIProsthesis()
  }, [reloadPros, isLoad])

  useEffect(() => {
    callAPIHospitalnSurgery()
  }, [reloadHos, isLoad])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('updateDisease', () => {
      setReloadDisease(Math.random())
    })
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('updateAllergy', () => {
      setReloadAllergy(Math.random())
    })
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('updateMedication', () => {
      setReloadMedi(Math.random())
    })
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('updateImmu', () => {
      setReloadImmu(Math.random())
    })
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('updateDepen', () => {
      setReloadDepen(Math.random())
    })
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('updateIrre', () => {
      setReloadIrre(Math.random())
    })
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('updatePros', () => {
      setReloadPros(Math.random())
    })
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('updateHos', () => {
      setReloadHos(Math.random())
    })
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('updateDoc', () => {
      setReloadDoc(Math.random())
    })
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.HEALTH_PROFILE_TRACKING_SCREEN, params => {
      if (params?.tracking) {
        navigation.navigate('Tracking')
      } else if (params?.medical) {
        navigation.navigate('Medical')
      } else if (params?.file) {
        navigation.navigate('File')
      }
    })
    return () => subscription.remove()
  }, [])

  const callAPIListCategoryFile = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/util/getCategorieFiles`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        console.log('callAPIListCategoryFile: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'callAPIListCategoryFile')
          const getList = response.data.categorie || []
          setListCategory(getList)
          callAPIListDocument(getList)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  const callAPIListDocument = (data) => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/disman/getFiles`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        console.log('document: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'document')
          const getList = response.data.documenti || []
          convertDataDocument(getList, data)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  const convertDataDocument = (dataImp, dataCategory) => {
    var data = []
    for (var i = 0; i <= dataImp.length - 1; i++ ) {
      var item = {}
      var id = Number(dataImp[i]?.categoryId)
      var j = dataCategory.filter(
        val => val?.id === id,
      )
      if ((j || []).length > 0) {
        var category = j[0]?.name
        var idCategory = j[0]?.id
      }
      item.id = Number(dataImp[i]?.id)
      item.title = dataImp[i]?.title
      item.filename = dataImp[i]?.name
      item.insertDate = Number(dataImp[i]?.insertDate)
      item.reportDate = Number(dataImp[i]?.reportDate)
      item.description = dataImp[i]?.description
      item.fileType = dataImp[i]?.dettagli?.contentType
      item.categoryName = category
      item.idCategory = idCategory
      item.medical = dataImp[i]?.medical
      item.titleAZ = _.replace(item.title, ' ', '_')
      data.push(item)
    }
    console.log('listData: ', data)
    setListDocument(data)
  }

  const callAPIChronicDisease = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/disease`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        console.log('dataDisease: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get disease')
        } else {
          console.log('noti: ', 'disease')
          const getList = response.data.malattie || []
          setListDisease(getList)
          dispatch(saveChronicDisease(getList))
        }
      })
      .catch(error => {
        console.log('diseaseErr: ',  error)
      })
  }

  const callAPIAllergy = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/allergy`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get allergy')
        } else {
          console.log('noti: ', 'allergy')
          const getList = response.data.allergie || []
          setListAllergy(getList)
          dispatch(saveAllergies(getList))
        }
      })
      .catch(error => {
        console.log('allergyErr: ',  error)
      })
  }

  const callAPIMedication = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/medication`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get medi')
        } else {
          console.log('noti: ', 'medi')
          const getList = response.data.farmaci || []
          setListMedication(getList)
          dispatch(saveMedications(getList))
        }
      })
      .catch(error => {
        console.log('mediErr: ',  error)
      })
  }

  const callAPIDependency = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/dependency`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get dependency')
        } else {
          console.log('noti: ', 'dependency')
          const getList = response.data.dipendenze || []
          setListDependency(getList)
          dispatch(saveDependencies(getList))
        }
      })
      .catch(error => {
        console.log('dependencyErr: ',  error)
      })
  }

  const callAPIImmunization = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/immunization`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get dependency')
        } else {
          console.log('noti: ', 'Immunization')
          const getList = response.data.vaccini || []
          setListImmunization(getList)
          dispatch(saveImmunizations(getList))
        }
      })
      .catch(error => {
        console.log('ImmunizationErr: ',  error)
      })
  }

  const callAPIIrregular = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/test`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get test')
        } else {
          console.log('noti: ', 'test')
          const getList = response.data.test || []
          setListIrregular(getList)
          dispatch(saveIrregular(getList))
        }
      })
      .catch(error => {
        console.log('testErr: ',  error)
      })
  }

  const callAPIProsthesis = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/prothesis`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get prothesis')
        } else {
          console.log('noti: ', 'prothesis')
          const getList = response.data.protesi || []
          setListProsthesis(getList)
          dispatch(saveProsthesis(getList))
        }
      })
      .catch(error => {
        console.log('prothesisErr: ',  error)
      })
  }

  const callAPIHospitalnSurgery = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/hospitalization`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        setTimeout(() => {
          setLoading(false)
        }, 2000)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get hospitalization')
        } else {
          console.log('noti: ', 'hospitalization')
          const getList = response.data.ricoveri || []
          setListHosnSur(getList)
          dispatch(saveHospitalization(getList))
        }
      })
      .catch(error => {
        setTimeout(() => {
          setLoading(false)
        }, 4000)
        console.log('hospitalizationErr: ',  error)
      })
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).HEALTH_PROFILE}
        iconLeft={icHeader.ic_menudrawer}
        iconRight={icHealthProfile.ic_function_right}
        onPressLeft={() => NavigationService.openDrawer()}
        onPressRight={PrintAllMedical()}
      />
      <Tab.Navigator
          style={styles.styleTopBar}
          screenOptions={{
            tabBarActiveTintColor: color3777EE,
            tabBarInactiveTintColor: colorA7A8A9,
            tabBarLabelStyle: {
              fontSize: 14,
              textTransform: 'none',
              fontFamily: Fonts.SemiBold,
              width:'100%',
              marginRight: 5
            },
            tabBarStyle: {
              height: 52,
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16
            },
            tabBarIndicatorStyle: {
              height: 4,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16
            },
            tabBarScrollEnabled: true
          }}>
          <Tab.Screen
            name={'Medical'}
            options={{ tabBarLabel: Translate(languageRedux).MEDICAL_RECORDS || '' }}
            component={() =>
              <MedicalRecords
                dataDisease={listDisease}
                dataAllergy={listAllergy}
                dataMedication={listMedication}
                dataDependency={listDependency}
                dataImmunization={listImmunization}
                dataIrregular={listIrregular}
                dataProsthesis={listProsthesis}
                dataHosnSur={listHosnSur}
                setReload={setLoading}
              />
            }
          />
          <Tab.Screen
            name={'Tracking'}
            options={{ tabBarLabel: Translate(languageRedux).TRACKING || '' }}
            component={Tracking}
          />
          {/* <Tab.Screen
            name={'Wellness'}
            options={{ tabBarLabel: Translate(languageRedux).wellnessdata || '' }}
            component={WellnessData}
          /> */}
          <Tab.Screen
            name={'File'}
            options={{ tabBarLabel: Translate(languageRedux).FILE_ARCHIVE || '' }}
            component={() =>
              <FileArchive
                dataListFile={listDocument}
                listCategoryFile={listCategory}
              />
            }
          />
        </Tab.Navigator>
        {isLoad && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  styleTopBar: {

  }
})
