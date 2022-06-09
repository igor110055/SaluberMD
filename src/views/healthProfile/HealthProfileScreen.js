import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  StatusBar,
  DeviceEventEmitter
} from 'react-native'
import axios from 'axios'
import * as APIs from '../../api/APIs'
import { useDispatch, useSelector } from 'react-redux'

import {
  colorFFFFFF,
  color333333,
  color2F80ED,
  color3777EE,
  color363636,
  colorA7A8A9,
  colorF8F8F8
} from '../../constants/colors'
import Fonts from '../../constants/Fonts'

import { customTxt } from '../../constants/css'
import NavigationService from '../../navigation'
import Routes from '../../navigation/Routes'
import { apiCountry, apiHealthProfile } from '../../api/Auth'
import {
  saveDataAllergy, saveDataDepen, saveDataDisease, saveDataHosSur, saveDataImmu,
  saveDataIrre, saveDataMedi, saveDataPros, saveLSAllergi,
  saveLSComplication, saveLSCountry, saveLSDependency,
  saveLSHospitalization, saveLSImmunization, saveLSIrregular, saveLSMedication,
  saveLSMediForm,
  saveLSProsthesis,
  saveLSSubSurgery,
  saveLSSurgery} from '../../actions/common'
import Translate from '../../translate'
import { saveAllergies, saveChronicDisease, saveDependencies, saveHospitalization,
  saveImmunizations, saveIrregular, saveMedications, saveProsthesis, saveUserinfo } from 'actions/user'

import icHome from '../../../assets/images/home_screen'

import { COUNTRIES } from '../login_signup/SignUpView'
import { PopupThankyou } from './components/PopupThankyou'
import { PopupClose } from './components/PopupClose'
import Header from '../../components/Header'
import Info from './components/Info'
import LoadingView from '../../components/LoadingView'

const TYPE_HEALTH = {
  CHRONIC_DISEASE: 'CHRONIC_DISEASE',
  ALLERGY: 'ALLERGY',
  MEDICATION: 'MEDICATION',
  DEPENDENCIES: 'DEPENDENCIES',
  HOSPITALIZATION: 'HOSPITALIZATION',
  IMMUNIZATION: 'IMMUNIZATION',
  IRREGULAR: 'IRREGULAR',
  PROSTHESIS: 'PROSTHESIS'
}

export default function HealthProfile({ route }) {
  const [isThankyou, setThankyou] = useState(false)
  const [isClose, setClose] = useState(false)
  const personalInfo = useSelector(state => state.user.personal_info)
  const chronic_disease = useSelector(state => state.user.chronic_disease)
  const allergies = useSelector(state => state.user.allergies)
  const medications = useSelector(state => state.user.medications)
  const dependencies = useSelector(state => state.user.dependencies)
  const hospitalization = useSelector(state => state.user.hospitalization)
  const immunizations = useSelector(state => state.user.immunizations)
  const irregular = useSelector(state => state.user.irregular)
  const prosthesis = useSelector(state => state.user.prosthesis)
  const dispatch = useDispatch()
  const languageRedux = useSelector(state => state.common.language)
  const passingData = route?.params?.data
  const token = useSelector(state => state.user.token)
  const [isLoad, setLoading] = useState(true)
  const [reload, setReload] = useState(1)
  const [reload2, setReload2] = useState(1)
  const [reloadInfo, setReloadInfo] = useState(1)
  const [userData, setUserData] = useState([])

  const lsComplicationRedux = useSelector(state => state.common.complication)
  const dataDisease = useSelector(state => state.common.dataDisease)

  const lsMediRedux = useSelector(state => state.common.medication)
  const lsMediFormRedux = useSelector(state => state.common.mediform)
  const dataMedi = useSelector(state => state.common.dataMedi)

  const lsAllergiRedux = useSelector(state => state.common.allergies)
  const dataAllergy = useSelector(state => state.common.dataAllergy)

  const lsDepenRedux = useSelector(state => state.common.dependency)
  const dataDepen = useSelector(state => state.common.dataDepen)

  const lsImmuRedux = useSelector(state => state.common.immunization)
  const dataImmu = useSelector(state => state.common.dataImmu)

  const lsIrreRedux = useSelector(state => state.common.irregular)
  const dataIrre = useSelector(state => state.common.dataIrre)

  const lsProsthesisRedux = useSelector(state => state.common.prosthesis)
  const dataPros = useSelector(state => state.common.dataPros)

  const lsCountryRedux = useSelector(state => state.common.country)
  const lsHospitalRedux = useSelector(state => state.common.hospitalization)
  const lsSubSurgeryRedux = useSelector(state => state.common.subsurgery)
  const lsSurgeryRedux = useSelector(state => state.common.surgery)
  const dataHosSur = useSelector(state => state.common.dataHosSur)

  const userinfo = useSelector(state => state.user.userinfo)

  const passingSignUp = route?.params?.signUp

  useEffect(() => {
    callAPIGetUserInfo()
  }, [reloadInfo])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('updatePersonal', () => {
      setReloadInfo(Math.random())
    })
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    callAPIGetCountries()

    callAPIChronicDisease()
    callAPIComplication()

    callAPIAllergy()
    callAPIListAllergy()

    callAPIListMedi()
    callAPIListMediForm()
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
    callAPISurgery()
    callAPISubSurgery()

    DeviceEventEmitter.addListener(Routes.HEALTHPROFILE_SCREEN, () => {
      setReload2(Math.random())
    })
  }, [reload2])

  useEffect(() => {
    convertDataDisease()
    converDataMedi()
    convertDataAllergy()
    convertDataDepen()
    convertDataImmu()
    convertDataIrre()
    convertDataPros()
    convertDataHosnSur()
    setTimeout(() => {
      if (reload < 3) {
        setReload(reload + 1)
      }
    }, 500)
  },[chronic_disease, medications, reload])

  const callAPIGetUserInfo = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/webdoctor/getUserInfo`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        // console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('dataInfo: ', 'data has been obtained userinfo')
          const getList = response.data.user || []
          setUserData(getList)
          Promise.all([
            dispatch(saveUserinfo(getList))
          ])
        }
        // setLoading(false)
      })
      .catch(error => {
        // setLoading(false)
        console.log(error)
      })
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
        // console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.malattie || []
          Promise.all([dispatch(saveChronicDisease(getList))])
        }
        // setLoading(false)
      })
      .catch(error => {
        // setLoading(false)
        console.log(error)
      })
  }

  const callAPIComplication = () => {
    // if (lsComplicationRedux.length > 0) {return}
    // setLoading(true)
    dispatch(apiHealthProfile()).then(res => {
      console.log('Res: ', res)
      const getCompli = res?.payload?.complicazioni || []
      if (getCompli.length > 0) {
        // setLSComplication(getCompli)
        Promise.all([
          dispatch(saveLSComplication(getCompli))
        ])
      }
      // setLoading(false)
    }).catch(() => {
      // setLoading(false)
    })
  }

  const convertDataDisease = () => {
    var listName = []
      for (var i = 0; i <= chronic_disease.length - 1; i++) {
        var item = {}
        var j = lsComplicationRedux.filter(
          val => val?.id === chronic_disease[i].complicationId,
        )
        if (j.length > 0) {
          var complicationName = j[0].name
          var complicationID = j[0].id
        }
        item['id'] = chronic_disease[i].diseaseId
        item['name'] = chronic_disease[i].name
        item['since'] = chronic_disease[i].startDate
        item['note'] = chronic_disease[i].remarks
        item['isEmergency'] = chronic_disease[i].onEmergencyLogin
        item['complication'] = complicationName
        item['complicationID'] = complicationID
        item['itemID'] = chronic_disease[i].id
        item['isIcd10'] = chronic_disease[i].isIcd10
        if (chronic_disease[i].diseaseId === '1') {
          item['other'] = chronic_disease[i].other
        }
        listName.push(item)
      }
      dispatch(saveDataDisease({datas: listName}))
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
        // console.log('allergy: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.allergie || []
          Promise.all([dispatch(saveAllergies(getList))])
        }
        // setLoading(false)
      })
      .catch(error => {
        // setLoading(false)
        console.log(error)
      })
  }

  const callAPIListAllergy = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/medicalData/getAllergies/en_US`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        // console.log('allergy: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.allergie || []
          if (getList.length > 0) {
            Promise.all([dispatch(saveLSAllergi(getList))])
          }
        }
        // setLoading(false)
      })
      .catch(error => {
        // setLoading(false)
        console.log(error)
      })
  }

  const convertDataAllergy = () => {
    var listName = []
      for (var i = 0; i <= allergies.length - 1; i++) {
        var item = {}
        var j = lsAllergiRedux.filter(
          val => val?.id === allergies[i].allergyId.toString(),
        )
        if (j.length > 0) {
          var nameAllery = j[0].name
          var idAllery = Number(j[0].id)
        }
        item['id'] = idAllery
        item['name'] = nameAllery
        item['since'] = allergies[i].since
        item['genericName'] = allergies[i].genericName
        item['note'] = allergies[i].remarks
        item['isEmergency'] = allergies[i].onEmergencyLogin
        item['itemID'] = allergies[i].id
        if (allergies[i].allergyId === 1) {
          item['other'] = allergies[i].other
        }
        listName.push(item)
      }
      dispatch(saveDataAllergy({datas: listName}))
  }

  const callAPIListMedi = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/medicalData/getAllMedicine`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        // console.log('listMedi: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.medicine || []
          Promise.all([dispatch(saveLSMedication(getList))])
        }
        // setLoading(false)
      })
      .catch(error => {
        // setLoading(false)
        console.log(error)
      })
  }

  const callAPIListMediForm = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/medicalData/getAllMedicine`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        // console.log('listMediForm: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.tipiFarmaci || []
          if (getList.length > 0) {
            Promise.all([dispatch(saveLSMediForm(getList))])
          }
        }
        // setLoading(false)
      })
      .catch(error => {
        // setLoading(false)
        console.log(error)
      })
  }

  const callAPIMedi = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/medication`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        // console.log('medi: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.farmaci || []
          Promise.all([dispatch(saveMedications(getList))])
        }
        // setLoading(false)
      })
      .catch(error => {
        // setLoading(false)
        console.log(error)
      })
  }

  const converDataMedi = () => {
    var listName = []
      for (var i = 0; i <= medications.length - 1; i++) {
        var item = {}
        var j = lsMediRedux.filter(
          val => val?.id === medications[i].medicineId,
        )
        var k = lsMediFormRedux.filter(
          val => val?.id === medications[i].medicationId
        )
        if (j.length > 0) {
          var nameMedi = j[0].name
          var idMedi = j[0].id
        }
        if (k.length > 0) {
          var nameMediForm = k[0].name
          var idMediForm = k[0].id
        }
        item['id'] = idMedi
        item['name'] = nameMedi
        item['since'] = medications[i].since
        item['genericName'] = medications[i].genericName
        item['note'] = medications[i].remarks
        item['isEmergency'] = medications[i].onEmergencyLogin
        item['medicationForm'] = nameMediForm
        item['idMediForm'] = idMediForm
        item['dosage'] = medications[i].dosage
        item['itemID'] = medications[i].id
        if (medications[i].medicineId === 1) {
          item['other'] = medications[i].other
        }
        listName.push(item)
      }
      dispatch(saveDataMedi({datas: listName}))
  }

  const callAPIListDepen = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/medicalData/getDependencies/en_US`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        // console.log('depen: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.dipendenze || []
          if (getList.length > 0) {
            Promise.all([dispatch(saveLSDependency(getList))])
          }
        }
        // setLoading(false)
      })
      .catch(error => {
        // setLoading(false)
        console.log(error)
      })
  }

  const callAPIDepen = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/dependency`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        // console.log('depen: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.dipendenze || []
          Promise.all([dispatch(saveDependencies(getList))])
        }
        // setLoading(false)
      })
      .catch(error => {
        // setLoading(false)
        console.log(error)
      })
  }

  const convertDataDepen = () => {
    var listName = []
      for (var i = 0; i <= dependencies.length - 1; i++) {
        var item = {}
        var j = lsDepenRedux.filter(
          val => val?.id === dependencies[i].dependencyId.toString(),
        )
        if (j.length > 0) {
          var nameDepen = j[0].name
          var idDepen = Number(j[0].id)
        }
        const checkWeanned = () => {
          if (dependencies[i].weaned_off === 0) {
            return 'No'
          }
          if (dependencies[i].weaned_off === 1) {
            return 'Yes'
          }
        }
        item['id'] = idDepen
        item['name'] = nameDepen
        item['since'] = dependencies[i].since
        item['dependency'] = dependencies[i].dependency
        item['note'] = dependencies[i].remarks
        item['isEmergency'] = dependencies[i].onEmergencyLogin
        item['yearStarted'] = dependencies[i].yearStarted
        item['weaned'] = checkWeanned()
        item['dailyUse'] = dependencies[i].daily_use
        item['itemID'] = dependencies[i].id
        if (dependencies[i].dependencyId === 1) {
          item['other'] = dependencies[i].other
        }
        listName.push(item)
      }
      dispatch(saveDataDepen({datas: listName}))
  }

  const callAPIListImmu = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/medicalData/getImmunizations/en_US`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        // console.log('Immu: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.vaccini || []
          if (getList.length > 0) {
            Promise.all([dispatch(saveLSImmunization(getList))])
          }
        }
        // setLoading(false)
      })
      .catch(error => {
        // setLoading(false)
        console.log(error)
      })
  }

  const callAPIImmu = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/immunization`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        // console.log('Immu: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.vaccini || []
          Promise.all([dispatch(saveImmunizations(getList))])
        }
        // setLoading(false)
      })
      .catch(error => {
        // setLoading(false)
        console.log(error)
      })
  }

  const convertDataImmu = () => {
    var listName = []
      for (var i = 0; i <= immunizations.length - 1; i++) {
        var item = {}
        var j = lsImmuRedux.filter(
          val => val?.id === immunizations[i].immunizationId.toString(),
        )
        if (j.length > 0) {
          var nameImmu = j[0].name
          var idImmu = Number(j[0].id)
        }
        item['id'] = idImmu
        item['name'] = nameImmu
        item['since'] = immunizations[i].immunizationDate
        item['immunizationMethod'] = immunizations[i].immunizationMethod
        item['note'] = immunizations[i].remarks
        item['isEmergency'] = immunizations[i].onEmergencyLogin
        item['itemID'] = immunizations[i].id
        if (immunizations[i].immunizationId === 1) {
          item['other'] = immunizations[i].other
        }
        listName.push(item)
      }
      dispatch(saveDataImmu({datas: listName}))
  }

  const callAPIListIrre = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/medicalData/getTests/en_US`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        // console.log('Irre: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.test || []
          if (getList.length > 0) {
            Promise.all([dispatch(saveLSIrregular(getList))])
          }
        }
        // setLoading(false)
      })
      .catch(error => {
        // setLoading(false)
        console.log(error)
      })
  }

  const callAPIIrre = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/test`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        // console.log('Irre: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.test || []
          Promise.all([dispatch(saveIrregular(getList))])
        }
        // setLoading(false)
      })
      .catch(error => {
        // setLoading(false)
        console.log(error)
      })
  }

  const convertDataIrre = () => {
    var listName = []
      for (var i = 0; i <= irregular.length - 1; i++) {
        var item = {}
        var j = lsIrreRedux.filter(
          val => val?.id === irregular[i].testId.toString(),
        )
        if (j.length > 0) {
          var nameIrregular = j[0].name
          var idIrregular = Number(j[0].id)
        }
        item['id'] = idIrregular
        item['name'] = nameIrregular
        item['since'] = irregular[i].testDate
        item['actionTaken'] = irregular[i].actionTaken
        item['description'] = irregular[i].description
        item['note'] = irregular[i].remarks
        item['isEmergency'] = irregular[i].onEmergencyLogin
        item['itemID'] = irregular[i].id
        if (irregular[i].testId === 1) {
          item['other'] = irregular[i].other
        }
        listName.push(item)
      }
      dispatch(saveDataIrre({datas: listName}))
  }

  const callAPIListPros = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/medicalData/getProsthesis/en_US`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        // console.log('Pros: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.protesi || []
          if (getList.length > 0) {
            Promise.all([dispatch(saveLSProsthesis(getList))])
          }
        }
        // setLoading(false)
      })
      .catch(error => {
        // setLoading(false)
        console.log(error)
      })
  }

  const callAPIPros = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/prothesis`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        // console.log('Pros: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.protesi || []
          Promise.all([dispatch(saveProsthesis(getList))])
        }
        // setLoading(false)
      })
      .catch(error => {
        // setLoading(false)
        console.log(error)
      })
  }

  const convertDataPros = () => {
    var listName = []
      for (var i = 0; i <= prosthesis.length - 1; i++) {
        var item = {}
        var j = lsProsthesisRedux.filter(
          val => val?.id === prosthesis[i].prosthesisId.toString(),
        )
        if (j.length > 0) {
          var namePros = j[0].name
          var idPros = Number(j[0].id)
        }
        item['id'] = idPros
        item['name'] = namePros
        item['since'] = prosthesis[i].since
        item['note'] = prosthesis[i].remarks
        item['isEmergency'] = prosthesis[i].onEmergencyLogin
        item['itemID'] = prosthesis[i].id
        if (prosthesis[i].prosthesisId === 1) {
          item['other'] = prosthesis[i].other
        }
        listName.push(item)
      }
      dispatch(saveDataPros({datas: listName}))
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
        // console.log('Hospital: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.ricoveri || []
          Promise.all([dispatch(saveHospitalization(getList))])
        }
        // setLoading(false)
      })
      .catch(error => {
        // setLoading(false)
        console.log(error)
      })
  }

  const callAPIHospital = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/medicalData/getHospitalizations/en_US`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        // console.log('listHospital: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.ospedalizzazioni || []
          if (getList.length > 0) {
            Promise.all([dispatch(saveLSHospitalization(getList))])
          }
        }
        // setLoading(false)
      })
      .catch(error => {
        // setLoading(false)
        console.log(error)
      })
  }

  const callAPISurgery = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/medicalData/getHospitalizations/en_US`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        // console.log('listSurgery: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.interventi || []
          if (getList.length > 0) {
            Promise.all([dispatch(saveLSSurgery(getList))])
          }
        }
        // setLoading(false)
      })
      .catch(error => {
        // setLoading(false)
        console.log(error)
      })
  }

  const callAPISubSurgery = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/medicalData/getHospitalizations/en_US`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        // console.log('listSubSurgery: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.subInterventi || []
          if (getList.length > 0) {
            Promise.all([dispatch(saveLSSubSurgery(getList))])
          }
        }
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        console.log(error)
      })
  }

  const convertDataHosnSur = () => {
    var listName = []
      for (var i = 0; i <= hospitalization.length - 1; i++) {
        var item = {}
        if (hospitalization[i].type === 1) {
          var j = lsHospitalRedux.filter(
            val => val?.id === hospitalization[i].hospitalizationId.toString(),
          )
          if (j.length > 0) {
            var nameHos = j[0].name
            var idHos = Number(j[0].id)
          }
          var countryName = lsCountryRedux.filter((val) => val.value === hospitalization[i].country || '')
          if (countryName.length > 0) {
            var country = countryName[0].text || ''
          }
          item['id'] = idHos
          item['name'] = nameHos
          item['since'] = hospitalization[i].hospDate
          item['type'] = 1
          item['note'] = hospitalization[i].remarks
          item['isEmergency'] = hospitalization[i].onEmergencyLogin
          item['country'] = country
          item['hospital'] = hospitalization[i].hospital
          item['itemID'] = hospitalization[i].id
          item['surgerySubCategoryId'] = hospitalization[i].surgerySubCategoryId
          if (hospitalization[i].hospitalizationId === 1 || 47 || 48) {
            item['other'] = hospitalization[i].other
          }
          listName.push(item)
        }
        if (hospitalization[i].type === 0) {
          var j = lsSubSurgeryRedux.filter(
            val => val?.id === hospitalization[i].surgerySubCategoryId.toString(),
          )
          var countryName = lsCountryRedux.filter((val) => val.value === hospitalization[i].country || '')
          if (countryName.length > 0) {
            var country = countryName[0].text || ''
          }
          if (j.length > 0) {
            var nameSub = j[0].name
            var idSur = j[0].idOpt
            var idSub = Number(j[0].id)
            var idSurgery = idSur.toString() || ''
          }
          var surgeryCate = lsSurgeryRedux.filter((val) => val.id === idSurgery)
          if ((surgeryCate || []).length > 0) {
            var name = surgeryCate[0].name || ''
          }
          item['idSubSurgery'] = idSub
          item['name'] = nameSub
          item['surgeryCategory'] = name
          item['idSurgeryCategory'] = idSur
          item['since'] = hospitalization[i].hospDate
          item['type'] = 0
          item['note'] = hospitalization[i].remarks
          item['isEmergency'] = hospitalization[i].onEmergencyLogin
          item['country'] = country
          item['hospital'] = hospitalization[i].hospital
          item['itemID'] = hospitalization[i].id
          item['hospitalizationId'] = hospitalization[i].hospitalizationId
          listName.push(item)
        }
      }
      dispatch(saveDataHosSur({datas: listName}))
  }

  const callAPIGetCountries = () => {
    dispatch(apiCountry()).then(res => {
      const getCountry = res?.payload?.country || []
      if (getCountry.length > 0) {
        Promise.all([
          dispatch(saveLSCountry(getCountry))
        ])
      } else {
        Promise.all([
          dispatch(saveLSCountry(COUNTRIES))
        ])
      }
    }).catch(() => {
      Promise.all([
        dispatch(saveLSCountry(COUNTRIES))
      ])
    })
  }

  const getSubTitle = (type) => {
    const arr = () => {
      switch (type) {
        case TYPE_HEALTH.CHRONIC_DISEASE:
          return dataDisease
        case TYPE_HEALTH.ALLERGY:
          return dataAllergy
        case TYPE_HEALTH.MEDICATION:
          return dataMedi
        case TYPE_HEALTH.DEPENDENCIES:
          return dataDepen
        case TYPE_HEALTH.HOSPITALIZATION:
          return dataHosSur
        case TYPE_HEALTH.IMMUNIZATION:
          return dataImmu
        case TYPE_HEALTH.IRREGULAR:
          return dataIrre
        case TYPE_HEALTH.PROSTHESIS:
          return dataPros
        default:
          return []
      }
    }
    const checkUndefined = typeof arr()?.datas === 'undefined' || (passingSignUp && (arr()?.datas || []).length === 0)

    var nameSub = (arr()?.datas || []).map((val, index) => {
      if ((val?.id === '1') || (val?.id === 1)) {
        const getNameOther = (val?.other || '') + ((index === (arr()?.datas || []).length - 1) ? '' : ', ')
        return getNameOther
      }
      if (val?.id === 47) {
        const getNameAccident = (val?.name || '') + ((index === (arr()?.datas || []).length - 1) ? '' : ', ')
        return getNameAccident
      }
      if (val?.id === 48) {
        const getNameCancer = (val?.name || '') + ((index === (arr()?.datas || []).length - 1) ? '' : ', ')
        return getNameCancer
      }
      else {
        const getName = (val?.name || '') + ((index === (arr()?.datas || []).length - 1) ? '' : ', ')
        return getName
      }
    })

    const noNameSub = () => {
      switch (type) {
        case TYPE_HEALTH.CHRONIC_DISEASE:
          return Translate(languageRedux).NO_CHRONIC_DISEASE
        case TYPE_HEALTH.ALLERGY:
          return Translate(languageRedux).NO_ALLERGIES
        case TYPE_HEALTH.MEDICATION:
          return Translate(languageRedux).NO_MEDICATION
        case TYPE_HEALTH.DEPENDENCIES:
          return Translate(languageRedux).NO_DEPENDENCIES
        case TYPE_HEALTH.HOSPITALIZATION:
          return Translate(languageRedux).NO_HOSPITALIZATION_OR_SURGICAL
        case TYPE_HEALTH.IMMUNIZATION:
          return Translate(languageRedux).NO_IMMUNIZATION
        case TYPE_HEALTH.IRREGULAR:
          return Translate(languageRedux).NO_IRREGULAR_TEST
        case TYPE_HEALTH.PROSTHESIS:
          return Translate(languageRedux).NO_PROSTHESIS_MEDICAL
        default:
          return ''
      }
    }

    const checkNameSub = nameSub.length > 0 ? nameSub : noNameSub()

    return checkUndefined
    ? <Text style={customTxt(Fonts.SemiBold, 12, colorA7A8A9).txt}>{Translate(languageRedux).NOT_COMPLIED}</Text>
    : checkNameSub

  }

  const getSubAddress = () => {
    if ((userData?.city || userData?.country || userData?.address)) {
      return (
        <View>
          <Text style={customTxt(Fonts.SemiBold, 12, color3777EE).txt}>{Translate(languageRedux).address}, </Text>
        </View>)
    }
    else {
      return (<View><Text style={customTxt(Fonts.SemiBold, 12, colorA7A8A9).txt}>{Translate(languageRedux).address}, </Text></View>)
    }
  }

  const getSubPhycialChara = () => {
    if ((userData?.height || userData?.weight)) {
      return (
        <View>
          <Text style={customTxt(Fonts.SemiBold, 12, color3777EE).txt}>{Translate(languageRedux).PHYSICAL_CHARATERISTICS}, </Text>
        </View>)
      }
    else {
      return (<View><Text style={customTxt(Fonts.SemiBold, 12, colorA7A8A9).txt}>{Translate(languageRedux).PHYSICAL_CHARATERISTICS}, </Text></View>)
    }
  }

  const getSubFamilyPhysician = () => {
    if ((userData?.medicphone || userData?.medicemail || userData?.medicname1)) {
      return (
        <View>
          <Text style={customTxt(Fonts.SemiBold, 12, color3777EE).txt}>{Translate(languageRedux).PHYSICIAN}</Text>
        </View>)
    }
    else {
      return (<View><Text style={customTxt(Fonts.SemiBold, 12, colorA7A8A9).txt}>{Translate(languageRedux).PHYSICIAN}</Text></View>)
    }
  }

  const dataRecom = [
    {
      id: 0,
      title: Translate(languageRedux).datipersonali,
      borderColor: personalInfo ? color2F80ED : colorFFFFFF,
      titleColor: personalInfo ? color2F80ED : color333333,
      subTitleColor: personalInfo ? color3777EE : colorA7A8A9,
      address: getSubAddress(),
      phycial: getSubPhycialChara(),
      family: getSubFamilyPhysician()
    },
    {
      id: 1,
      title: Translate(languageRedux).CHRONIC_DISEASE,
      borderColor: (typeof dataDisease?.datas !== 'undefined') ? color2F80ED : colorFFFFFF,
      titleColor: (typeof dataDisease?.datas !== 'undefined') ? color2F80ED : color333333,
      subTitleColor: (typeof dataDisease?.datas !== 'undefined') ? color3777EE : colorA7A8A9,
      subtitle: getSubTitle(TYPE_HEALTH.CHRONIC_DISEASE)
    },
    {
      id: 2,
      title: Translate(languageRedux).allergie,
      borderColor: (typeof dataAllergy?.datas === 'undefined') ? colorFFFFFF : color2F80ED,
      titleColor: (typeof dataAllergy?.datas === 'undefined') ? color333333 : color2F80ED,
      subTitleColor: (typeof dataAllergy?.datas === 'undefined') ? colorA7A8A9 : color3777EE,
      subtitle: getSubTitle(TYPE_HEALTH.ALLERGY)
    },
    {
      id: 3,
      title: Translate(languageRedux).medication,
      borderColor: (typeof dataMedi?.datas !== 'undefined') ? color2F80ED : colorFFFFFF,
      titleColor: (typeof dataMedi?.datas !== 'undefined') ? color2F80ED : color333333,
      subTitleColor: (typeof dataMedi?.datas !== 'undefined') ? color3777EE : colorA7A8A9,
      subtitle: getSubTitle(TYPE_HEALTH.MEDICATION),
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16
    }
  ]

  const dataOther = [
    {
      id: 0,
      title: Translate(languageRedux).dependencies,
      borderColor: (typeof dataDepen?.datas !== 'undefined') ? color2F80ED : colorFFFFFF,
      titleColor: (typeof dataDepen?.datas !== 'undefined') ? color2F80ED : color333333,
      subTitleColor: (typeof dataDepen?.datas !== 'undefined') ? color3777EE : colorA7A8A9,
      subtitle: getSubTitle(TYPE_HEALTH.DEPENDENCIES)
    },
    {
      id: 1,
      title: Translate(languageRedux).HOSPITALIZATION_SURGICAL,
      borderColor: (typeof dataHosSur?.datas !== 'undefined') ? color2F80ED : colorFFFFFF,
      titleColor: (typeof dataHosSur?.datas !== 'undefined') ? color2F80ED : color333333,
      subTitleColor: (typeof dataHosSur?.datas !== 'undefined') ? color3777EE : colorA7A8A9,
      subtitle: getSubTitle(TYPE_HEALTH.HOSPITALIZATION)
    },
    {
      id: 2,
      title: Translate(languageRedux).immunization,
      borderColor: (typeof dataImmu?.datas !== 'undefined') ? color2F80ED : colorFFFFFF,
      titleColor: (typeof dataImmu?.datas !== 'undefined') ? color2F80ED : color333333,
      subTitleColor: (typeof dataImmu?.datas !== 'undefined') ? color3777EE : colorA7A8A9,
      subtitle: getSubTitle(TYPE_HEALTH.IMMUNIZATION)
    },
    {
      id: 3,
      title: Translate(languageRedux).IRREGULAR_TEST,
      borderColor: (typeof dataIrre?.datas !== 'undefined') ? color2F80ED : colorFFFFFF,
      titleColor: (typeof dataIrre?.datas !== 'undefined') ? color2F80ED : color333333,
      subTitleColor: (typeof dataIrre?.datas !== 'undefined') ? color3777EE : colorA7A8A9,
      subtitle: getSubTitle(TYPE_HEALTH.IRREGULAR)
    },
    {
      id: 4,
      title: Translate(languageRedux).PROSTHESIS_MEDICAL_AIDS,
      borderColor: (typeof dataPros?.datas !== 'undefined') ? color2F80ED : colorFFFFFF,
      titleColor: (typeof dataPros?.datas !== 'undefined') ? color2F80ED : color333333,
      subTitleColor: (typeof dataPros?.datas !== 'undefined') ? color3777EE : colorA7A8A9,
      subtitle: getSubTitle(TYPE_HEALTH.PROSTHESIS),
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16
    }
  ]

  useEffect(() => {
    console.log('personalInfo: ', personalInfo)
    console.log('allergies: ', allergies)
  }, [personalInfo, allergies])

  const renderItem = ({ item }) => {
    const _onPressItem = () => {
      switch (item?.title) {
        case dataRecom[0].title:
          return NavigationService.navigate(Routes.PERSONALINFO_SCREEN)
        case dataRecom[1].title:
          return NavigationService.navigate(Routes.CHRONIC_DISEASE_SCREEN)
        case dataRecom[2].title:
          return NavigationService.navigate(Routes.MEDICAL_RECORD_SCREEN)
        case dataRecom[3].title:
          return NavigationService.navigate(Routes.MEDICATION_SCREEN)
        case dataOther[0].title:
          return NavigationService.navigate(Routes.DEPENDENCIES_SCREEN)
        case dataOther[1].title:
          return NavigationService.navigate(Routes.HOSPITALIZATION_SCREEN)
        case dataOther[2].title:
          return NavigationService.navigate(Routes.IMMUNIZATION_SCREEN)
        case dataOther[3].title:
          return NavigationService.navigate(Routes.IRREGULAR_SCREEN)
        case dataOther[4].title:
          return NavigationService.navigate(Routes.PROSTHESIS_SCREEN)
        default:
          return null
      }
    }

    return (
      <View>
        <Info
          titleColor={color363636}
          subTitleColor={item.subTitleColor}
          title={item.title}
          subTitle={item.subtitle}
          onPress={_onPressItem}
          borderBottomLeftRadius={item.borderBottomLeftRadius}
          borderBottomRightRadius={item.borderBottomRightRadius}
          address={item?.address}
          phycial={item?.phycial}
          family={item?.family}
        />
      </View>
    )
  }
  // RECOMMENDED INFO
  const recomInfo = () => {
    return (
      <View style={styles.ctnRecomInfo}>
        <View style={styles.ctnCategory}>
          <View style={styles.marginL16}>
            <Text style={customTxt(Fonts.SemiBold, 18, colorFFFFFF).txt}>
              {Translate(languageRedux).RECOMMENDED_INFO}
            </Text>
          </View>
        </View>
        <FlatList
          data={dataRecom}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      </View>
    )
  }
  // OTHER INFO
  const otherInfo = () => {
    return (
      <View style={styles.ctnOtherInfo}>
        <View style={styles.ctnCategory}>
          <View style={styles.marginL16}>
            <Text style={customTxt(Fonts.SemiBold, 18, colorFFFFFF).txt}>
            {Translate(languageRedux).OTHER_INFO}
            </Text>
          </View>
        </View>
        <FlatList
          data={dataOther}
          keyExtractor={item => 'data-' + item.id}
          renderItem={renderItem}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View>
        <View style={styles.ctnText}>
          <Text style={customTxt(Fonts.Regular, 16, color333333).txt}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Text>
        </View>
        <View>{recomInfo()}</View>
        <View style={styles.bottomDistance}>{otherInfo()}</View>
      </View>
    )
  }
  const _onPressCancel = () => {
    setThankyou(false)
    setClose(false)
  }
  const _onPressOKClose = () => {
    if (passingData?.typeView === 'support') {
      NavigationService.goBack()
    } else {
      NavigationService.navigateAndReset(Routes.DRAWER_NAVIGATION)
    }
  }
  const _onPressOKThankyou = () => {
    if (passingData?.typeView === 'support') {
      NavigationService.goBack()
    } else {
      NavigationService.navigateAndReset(Routes.DRAWER_NAVIGATION)
    }
  }
  const _onPressClose = () => {
    console.log('personalInfo: ', personalInfo)
    if (
      typeof dataDisease?.datas === 'undefined' &&
      typeof allergies?.isSubmit === 'undefined' &&
      typeof medications?.isSubmit === 'undefined' &&
      typeof dependencies?.isSubmit === 'undefined' &&
      typeof hospitalization?.isSubmit === 'undefined' &&
      typeof immunizations?.isSubmit === 'undefined' &&
      typeof irregular?.isSubmit === 'undefined' &&
      typeof prosthesis?.isSubmit === 'undefined' &&
      personalInfo === null
    ) {
      setThankyou(false)
      setClose(true)
      return
    }
    console.log('Thanks')
    setThankyou(true)
    setClose(false)
    return
  }
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} backgroundColor="white"/>
        <Header
          textCenter={Translate(languageRedux).HEALTH_PROFILE}
          backgroundColor={colorFFFFFF}
          iconRight={icHome.ic_close}
          onPressRight={_onPressClose}
        />
        <ScrollView>{renderBody()}</ScrollView>
      </View>
      {isThankyou === true && (
        <PopupThankyou
          onPressOK={_onPressOKThankyou}
          onPressViewProfile={() => {
            setTimeout(() => {
              DeviceEventEmitter.emit(Routes.HEALTH_PROFILE_TRACKING_SCREEN, { medical: true })
            }, 200)
            NavigationService.navigate(Routes.HEALTH_PROFILE_TRACKING_SCREEN)
          }}
          onPressCancel={_onPressCancel}
        />
      )}
      {isClose === true && <PopupClose
        onPressOK={_onPressOKClose}
        onPressCancel={_onPressCancel} />}
      {isLoad && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  ctnText: {
    marginTop: 16,
    marginHorizontal: 20
  },
  ctnCategory: {
    marginHorizontal: 20,
    height: 56,
    backgroundColor: color3777EE,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    justifyContent: 'center',
    marginBottom: 0
  },
  ctnOtherInfo: {
    marginTop: 21,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9
  },
  ctnRecomInfo: {
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9
  },
  bottomDistance: {
    marginBottom: 42
  },
  marginL16: {
    marginLeft: 16
  },
  flexRow: {
    flexDirection: 'row',
    flex: 1
  }
})
