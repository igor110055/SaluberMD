import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, DeviceEventEmitter } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import moment from 'moment'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import * as APIs from '../../../api/APIs'
import _ from 'lodash'

import { color363636, color3777EE, color5E5E5E, colorA7A8A9, colorF8F8F8, colorFFFFFF } from 'constants/colors'
import Translate from 'translate'
import { customTxt } from 'constants/css'
import NavigationService from 'navigation'
import Fonts from 'constants/Fonts'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
import Routes from 'navigation/Routes'
import { convertDMMMYYYY } from 'constants/DateHelpers'

import icHeader from '../../../../assets/images/header'
import icAccount from '../../../../assets/images/account'

import LoadingView from 'components/LoadingView'
import NewDocumentFloating from '../../documentlist/components/NewDocumentFloating'
import HeaderCustom from '../../documentlist/components/Header'
import ActionsView from './ActionsView'
import Referral from './actions/Referral'
import NewMess from './actions/NewMess'
import MedicalCertificate from './actions/MedicalCertificate'
import PrescriptionList from './actions/PrescriptionList'
import Drug from '../post_call/Drug'

const Tab = createMaterialTopTabNavigator()
import MedicalRecords from './medical_records'
import FileArchive from './file_archive'
import Communications from './communications'
import Consultation from './consultation'
import { apiGetCallPatient, apiPostSurveyDoctor } from 'api/DoctorPatientCall'
import { apiGetCategoryListByPatinet, apiGetSurveyBOIdReq } from '../notification_navigator/apis'
import { saveSurveyPatient } from 'actions/common'
// import Tracking from '../../health_profile_main/tracking'
import Tracking from './tracking'

export default function PatientDetail({ route }) {
  const languageRedux = useSelector(state => state.common.language)
  const passingData = route?.params?.data
  const passingToken = route?.params?.token
  const checkRouteView = route?.params?.historyView
  const navigation = useNavigation()

  const [listDoc, setListDoc] = useState()
  const [listCategoryFile, setListCategoryFile] = useState()
  const [isShowNewDoc, setShowNewDoc] = useState(false)
  const [listDisease, setListDisease] = useState([])
  const [listAllergy, setListAllergy] = useState([])
  const [listMedication, setListMedication] = useState([])
  const [listDependency, setListDependency] = useState([])
  const [listImmunization, setListImmunization] = useState([])
  const [listIrregular, setListIrregular] = useState([])
  const [listProsthesis, setListProsthesis] = useState([])
  const [listHosnSur, setListHosnSur] = useState([])
  const [isLoading, setLoading] = useState(true)
  const token = useSelector(state => state.user.token)
  const [listHistoryConsultation, setListHistoryConsultation] = useState([])
  const [patientInfo, setPatientInfo] = useState([])
  const [reloadList, setReloadList] = useState(1)
  const [base64Img, setBase64Img] = useState()

  // communications
  const [listReferral, setListReferral] = useState()
  const [listMedical, setListMedical] = useState()
  const [listPrescription, setListPrescription] = useState()
  const [listMessage, setListMessage] = useState()

  // action button
  const [statusAddDoc, setStatusAddDoc] = useState()
  const [dataNoti, setDataNoti] = useState()
  const [isShowNoti, setShowNoti] = useState()
  const [isActionView, setActionView] = useState()
  const [isAddReferral, setAddReferral] = useState()
  const [isNewMess, setNewMess] = useState()
  const [isAddCertificate, setAddCertificate] = useState()
  const [isAddPrescription, setAddPrescription] = useState()
  const [statusNewMess, setStatusNewMess] = useState()
  const [isShowNotiNewMess, setShowNotiNewMess] = useState()
  const [statusNewCertificate, setStatusNewCertificate] = useState()
  const [isShowNotiNewCertificate, setShowNotiNewCertificate] = useState()
  const [statusNewReferral, setStatusNewReferral] = useState()
  const [isShowNotiNewReferral, setShowNotiNewReferral] = useState()
  const dispatch = useDispatch()
  const [statusNewPrescription, setStatusNewPrescription] = useState()
  const [isShowNotiNewPrescription, setShowNotiNewPrescription] = useState()
  const [isShowListDrug, setShowListDrug] = useState(false)
  const [listDrugSend, setListDrugSend] = useState([])
  const [listDrugTotal, setListDrugTotal] = useState([])

  // data tracking
  const [lsBodyPressure, setLsBodyPressure] = useState([])
  const [lsBodyTemperature, setLsBodyTemperature] = useState([])
  const [lsBreathingVolumes, setLsBreathingVolumes] = useState([])
  const [lsHeartRateValues, setLsHeartRateValues] = useState([])
  const [lsSpo2, setLsSpo2] = useState()
  const [lsWeight, setLsWeight] = useState()
  const [rangeHeartRate, setRangeHeartRate] = useState()
  const [rangeWeight, setRangeWeight] = useState()
  const [reloadTracking, setReloadTracking] = useState(1)

  useEffect(() => {
    callAPIPatientInfo()
    callAPIListCategoryFile()
    callAPIChronicDisease()
    callAPIAllergy()
    callAPIMedication()
    callAPIDependency()
    callAPIImmunization()
    callAPIIrregular()
    callAPIProsthesis()
    callAPIHospitalnSurgery()
  }, [])

  useEffect(() => {
    callAPITrackingLastValueByPatientId()
    callAPIGetRangeHR()
    callAPIGetRangeW()
  }, [reloadTracking])

  useEffect(() => {
    callAPIListHistory()
  }, [reloadList])

  useEffect(() => {
    checkNotiStausAddDocument()
    callAPIListDocument()
  }, [statusAddDoc])

  useEffect(() => {
    checkNotiStausSendMess()
    callAPIListMessage()
  }, [statusNewMess])

  useEffect(() => {
    checkNotiStausSendCertificate()
    callAPIMedicalSent()
  }, [statusNewCertificate])

  useEffect(() => {
    checkNotiStausSendReferral()
    callAPIReferralSent()
  }, [statusNewReferral])

  useEffect(() => {
    checkNotiStausSendPrescription()
    callAPIPrescriptionSent()
  }, [statusNewPrescription])

  useEffect(() => {
    var list = [...listDrugTotal]
    var listTotal = _.concat(listDrugSend, list)
    setListDrugTotal(listTotal)
    console.log('listDrugTotal: ', listDrugTotal)
  }, [listDrugSend])

  const checkNotiStausAddDocument = () => {
    if (_.includes([0, '0'], statusAddDoc)) {
      setDataNoti({
        status: STATUS_NOTIFY.SUCCESS,
        content: 'Add document successful'
      })
    }
    if (_.includes([1, '1'], statusAddDoc)) {
      setDataNoti({
        status: STATUS_NOTIFY.ERROR,
        content: 'Add document failed'
      })
    }
  }

  const checkNotiStausSendMess = () => {
    if (_.includes([0, '0'], statusNewMess?.esito)) {
      setDataNoti({
        status: STATUS_NOTIFY.SUCCESS,
        content: 'Send messsage successful'
      })
    }
    if (_.includes([1, '1'], statusNewMess?.esito)) {
      setDataNoti({
        status: STATUS_NOTIFY.ERROR,
        content: 'Send message failed'
      })
    }
  }

  const checkNotiStausSendCertificate = () => {
    if (statusNewCertificate === 201) {
      setDataNoti({
        status: STATUS_NOTIFY.SUCCESS,
        content: 'Send medical certificate successful'
      })
    }
    else {
      setDataNoti({
        status: STATUS_NOTIFY.ERROR,
        content: 'Send medical certificate failed'
      })
    }
  }

  const checkNotiStausSendReferral = () => {
    if (_.includes([0, '0'], statusNewReferral?.esito)) {
      setDataNoti({
        status: STATUS_NOTIFY.SUCCESS,
        content: 'Send referral successful'
      })
    }
    if (_.includes([1, '1'], statusNewReferral?.esito)) {
      setDataNoti({
        status: STATUS_NOTIFY.ERROR,
        content: 'Send referral failed'
      })
    }
  }

  const checkNotiStausSendPrescription = () => {
    if (_.includes([0, '0'], statusNewPrescription)) {
      setDataNoti({
        status: STATUS_NOTIFY.SUCCESS,
        content: 'Send prescription successful'
      })
    }
    if (_.includes([1, '1'], statusNewPrescription)) {
      setDataNoti({
        status: STATUS_NOTIFY.ERROR,
        content: 'Send prescription failed'
      })
    }
  }

  const callAPITrackingLastValueByPatientId = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/webdoctor/getPatientDataLastUpdate/${passingData?.id}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (callAPITrackingLastValueByPatientId)')
          const getList = response?.data?.data || []
          setLsHeartRateValues(getList?.HEART_RATE)
          setLsBodyTemperature(getList?.TEMPERATURE)
          setLsSpo2(getList?.SPO2)
          setLsWeight(getList?.WEIGHT)
          setLsBodyPressure(getList?.BLOOD_PRESSURE)
        }
      })
      .catch(error => {
        console.log('callAPITrackingLastValueByPatientIdErr: ',  error)
      })
  }

  const callAPIGetRangeHR = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/disman/getPatientThresholdValues/${passingData?.id}/4`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        // setLoading(false)
        console.log('callAPIGetThreshold: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (callAPIGetThreshold)')
          const getList = response?.data?.data || []
          setRangeHeartRate(getList)
        }
      })
      .catch((error) => {
        // setLoading(false)
        console.log(error)
      })
  }

  const callAPIGetRangeW = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/disman/getPatientThresholdValues/${passingData?.id}/1`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        // setLoading(false)
        console.log('callAPIGetThreshold: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (callAPIGetThreshold)')
          const getList = response?.data?.data || []
          setRangeWeight(getList)
        }
      })
      .catch((error) => {
        // setLoading(false)
        console.log(error)
      })
  }

  const callAPIListDocument = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/disman/getFilesById/${passingData?.id}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (document)')
          const getList = response.data || []
          setListDoc(getList)
        }
      })
      .catch(error => {
        console.log('documentErr: ',  error)
      })
  }

  const callAPIListCategoryFile = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/util/getCategorieFiles`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': passingToken
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (CategorieFiles)')
          const getList = response.data.categorie || []
          setListCategoryFile(getList)
        }
      })
      .catch(error => {
        console.log('getCategorieFilesErr: ', error)
      })
  }

  const callAPIListHistory = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/webdoctor/getDetailPatientVisit/${passingData?.id}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        console.log('dataHistory: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (history)')
          const getList = response.data.dettaglioVisita || []
          const getBase64 = response?.data?.user?.userImage || []
          console.log('getBase64: ', getBase64)
          setListHistoryConsultation(getList)
          setBase64Img(getBase64)
        }
      })
      .catch((error) => {
        console.log('historyConsultationErr: ',  error)
      })
  }

  const callAPIChronicDisease = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/disease`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': passingToken
      }
    })
      .then(response => {
        // console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get disease')
        } else {
          console.log('noti: ', 'disease')
          const getList = response.data.malattie || []
          setListDisease(getList)
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
        'x-auth-token': passingToken
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get allergy')
        } else {
          console.log('noti: ', 'allergy')
          const getList = response.data.allergie || []
          setListAllergy(getList)
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
        'x-auth-token': passingToken
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get medi')
        } else {
          console.log('noti: ', 'medi')
          const getList = response.data.farmaci || []
          setListMedication(getList)
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
        'x-auth-token': passingToken
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get dependency')
        } else {
          console.log('noti: ', 'dependency')
          const getList = response.data.dipendenze || []
          setListDependency(getList)
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
        'x-auth-token': passingToken
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get dependency')
        } else {
          console.log('noti: ', 'Immunization')
          const getList = response.data.vaccini || []
          setListImmunization(getList)
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
        'x-auth-token': passingToken
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get test')
        } else {
          console.log('noti: ', 'test')
          const getList = response.data.test || []
          setListIrregular(getList)
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
        'x-auth-token': passingToken
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get prothesis')
        } else {
          console.log('noti: ', 'prothesis')
          const getList = response.data.protesi || []
          setListProsthesis(getList)
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
        'x-auth-token': passingToken
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get hospitalization')
        } else {
          console.log('noti: ', 'hospitalization')
          const getList = response.data.ricoveri || []
          setListHosnSur(getList)
        }
      })
      .catch(error => {
        console.log('hospitalizationErr: ',  error)
      })
  }

  const callAPIReferralSent = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/disman/getReferralDM/${passingData?.id}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (callAPIReferralSent)')
          const getList = response.data.ricette || []
          setListReferral(getList)
        }
      })
      .catch(error => {
        console.log('referralErr: ',  error)
      })
  }

  const callAPIPrescriptionSent = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/disman/getPrescriptionsDM/${passingData?.id}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (callAPIPrescriptionSent)')
          const getList = response.data.ricette || []
          setListPrescription(getList)
        }
      })
      .catch(error => {
        console.log('prescriptionErr: ',  error)
      })
  }

  const callAPIMedicalSent = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/getCertificationsByPatientId/${passingData?.id}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (callAPIMedicalSent)')
          const getList = response.data || []
          setListMedical(getList)
        }
      })
      .catch(error => {
        console.log('medicationSentErr: ',  error)
      })
  }

  const callAPIListMessage = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/disman/getSentMessages/${passingData?.id}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (callAPIListMessage)')
          const getList = response.data.messaggi || []
          setListMessage(getList)
        }
      })
      .catch(error => {
        console.log('messageErr: ',  error)
      })
  }

  const callAPIPatientInfo = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/webdoctor/getUserInfo`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': passingToken
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (callAPIPatientInfo)')
          const getList = response.data.user || []
          setPatientInfo(getList)
          setLoading(false)
        }
      })
      .catch(error => {
        console.log('userInfoErr: ',  error)
        setLoading(false)
      })
  }

  const getAge = () => {
    var yearPatient = moment(passingData?.birthdate).format('YYYY')
    var yearNow = moment().format('YYYY')
    var agePatient = Number(yearNow) - Number(yearPatient)
    return agePatient
  }

  const getGender = () => {
    if (patientInfo?.gender === 0) {
      return Translate(languageRedux).male
    }
    if (patientInfo?.gender === 1) {
      return Translate(languageRedux).female
    }
    if (patientInfo?.gender === 2) {
      return Translate(languageRedux).I_WOULD_RATHER_NOT_SAY
    }
  }

  const renderInfoPatient = () => {
    return (
      <View style={styles.infoPatient}>
        <View style={styles.line1}>
          <View style={styles.flexRow}>
            <Image
              source={
                checkRouteView
                  ? {uri: `data:image;base64,${passingData?.userImage}`}
                  : (base64Img
                  ? {uri: `data:image;base64,${base64Img}`}
                  : icAccount.ic_profile_avatar)
              }
              style={styles.avtStyle}
            />
            <View style={styles.namePatient}>
              <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>
                {getGender()}, {Translate(languageRedux).age} {getAge()}
              </Text>
              <Text style={customTxt(Fonts.SemiBold, 16, colorFFFFFF).txt}>
                {checkRouteView ? passingData?.nome : passingData?.name}{' '}
                {checkRouteView ? passingData?.cognome : passingData?.surname}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View>
            <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>
              {Translate(languageRedux).lastvisit}
            </Text>
            <Text style={customTxt(Fonts.Regular, 16, colorFFFFFF).txt}>
              {convertDMMMYYYY(passingData?.lastVisit)}
            </Text>
          </View>
          {/* <TouchableOpacity style={styles.buttonAction}>
            <Text style={customTxt(Fonts.Bold, 14, color3777EE).txt}>
              {Translate(languageRedux).actions}
            </Text>
          </TouchableOpacity> */}
        </View>
        {/* <View style={styles.line2}>
          <View>
            <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>
              {Translate(languageRedux).DOCTOR}
            </Text>
            <Text style={customTxt(Fonts.Regular, 16, colorFFFFFF).txt}>
                Mark Lazar Mirr
            </Text>
          </View>
          <View style={styles.divider} />
          <View>
            <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>
              {Translate(languageRedux).lastvisit}
            </Text>
            <Text style={customTxt(Fonts.Regular, 16, colorFFFFFF).txt}>
                17 Feb 2022
            </Text>
          </View>
        </View> */}
      </View>
    )
  }

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.PATIENT_DETAIL_SCREEN, params => {
      if (params?.medicalrecords) {
        navigation.navigate('MedicalRecords')
      }
    })
    return () => subscription.remove()
  }, [])

  //Call
  const _onPressCall = () => {
    setActionView(false)
    setLoading(true)
    callAPISaveSurveyDoctor()
  }

  const callAPISaveSurveyDoctor = () => {
    const params = {
      allergies: [],
      answer1: 'Me',
      answer2: 'DM call',
      auth: 'true',
      complaints: [],
      files: [],
      idMedico: -1,
      idQuestionario: -1,
      medications: []
    }
    if (passingData?.id) {
      console.log('Params: ', params)
      dispatch(apiPostSurveyDoctor(passingData?.id, params)).then(res => {
        console.log('callAPISaveSurveyDoctor: ', res?.payload)
        if (res?.payload?.esito === '0' && res?.payload?.idSurvey) {
          Promise.all([
            callAPICallPatient(res?.payload?.idSurvey)
          ])
        } else {
          setLoading(false)
          setDataNoti({
            status: STATUS_NOTIFY.ERROR,
            content: res?.payload?.motivo || 'error'
          })
          setTimeout(() => {
            setShowNoti(true)
          }, 500)
        }

      }).catch(() => {
        setLoading(false)
      })
    }
  }

  const callAPIGetPatient = (data) => {
    dispatch(apiGetSurveyBOIdReq(data?.idReq)).then(res => {
      console.log('apiGetSurveyIdReq: ', res?.payload)
      Promise.all([
        dispatch(saveSurveyPatient(res?.payload))
      ])
      callAPICategoryListByPatinet()
      if (res?.payload?.esito === '0') {
        setTimeout(() => {
          setLoading(false)
          NavigationService.navigate(Routes.VIDEO_CALL_NAVIGATE, {
            data: data,
            dataSurvey: data?.idSurvey,
            idReq: data?.idReq,
            isJoin: true
          })
        }, 1000)
      } else {
        setLoading(false)
      }
    }).catch(() => {
      setLoading(false)
    })
  }

  const callAPICategoryListByPatinet = () => {
    dispatch(apiGetCategoryListByPatinet(passingData?.id)).then(res => {
      console.log('apiGetCategoryListByPatinet: ', res)
    })
  }

  const callAPICallPatient = (idSurvey) => {
    dispatch(apiGetCallPatient(idSurvey, passingData?.id)).then(res => {
      console.log('res => ', res?.payload)
      setLoading(false)
      if (res?.payload?.esito === '0') {
        callAPIGetPatient(res?.payload)
      } else {
        setDataNoti({
          status: STATUS_NOTIFY.ERROR,
          content: res?.payload?.motivo || 'error'
        })
        setTimeout(() => {
          setShowNoti(true)
        }, 500)
      }
    }).catch(() => {
      setLoading(false)
    })
  }

  return (
    <View style={styles.container}>
      <HeaderCustom
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_left}
        textCenter={Translate(languageRedux).PATIENT_DETAIL}
        onPressLeft={() => NavigationService.popToRoot(Routes.PATIENT_SCREEN)}
        textRight={Translate(languageRedux).actions}
        textRightColor={colorFFFFFF}
        backgroundColorRight={color3777EE}
        onPressRight={() => {
          setActionView(true)
        }}
      />
      {renderInfoPatient()}
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: color3777EE,
          tabBarInactiveTintColor: colorA7A8A9,
          tabBarLabelStyle: {
            fontSize: 14,
            textTransform: 'none',
            fontFamily: Fonts.Bold,
            width:'100%',
            marginRight: 5
          },
          tabBarStyle: {
            height: 52
          },
          tabBarIndicatorStyle: {
            height: 4,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16
          },
          tabBarScrollEnabled: true
        }}>
        <Tab.Screen
          name={'MedicalRecords'}
          options={{
            tabBarLabel: Translate(languageRedux).MEDICAL_RECORDS || ''
          }}
          component={() => (
            <MedicalRecords
              dataPersonal={passingData}
              gender={getGender()}
              token={passingToken}
              dataDisease={listDisease}
              dataAllergy={listAllergy}
              dataMedication={listMedication}
              dataDependency={listDependency}
              dataImmunization={listImmunization}
              dataIrregular={listIrregular}
              dataProsthesis={listProsthesis}
              dataHosnSur={listHosnSur}
            />
          )}
        />
        <Tab.Screen
          name={'Tracking'}
          options={{ tabBarLabel: Translate(languageRedux).TRACKING || '' }}
          component={() =>
            <Tracking
              routeViewDoctor={true}
              patientToken={passingToken}
              patientId={passingData?.id}
              bodyTemp={lsBodyTemperature}
              bloodPress={lsBodyPressure}
              breathVolume={lsBreathingVolumes}
              heartRate={lsHeartRateValues}
              spo2={lsSpo2}
              weight={lsWeight}
              rangeHR={rangeHeartRate}
              rangeW={rangeWeight}
              setReloadTracking={setReloadTracking}
            />
          }
        />
        <Tab.Screen
          name={'Consultation'}
          options={{ tabBarLabel: Translate(languageRedux).CONSULTATION || '' }}
          component={() => (
            <Consultation
              dataPatient={passingData}
              dataHistory={listHistoryConsultation}
              setReloadList={setReloadList}
              listCategoryFile={listCategoryFile}
            />
          )}
        />
        <Tab.Screen
          name={'FileArchive'}
          options={{ tabBarLabel: Translate(languageRedux).FILE_ARCHIVE || '' }}
          component={() => (
            <FileArchive
              dataListDoc={listDoc}
              dataListCategory={listCategoryFile}
              setShow={setShowNewDoc}
              isShow={isShowNewDoc}
              patientToken={passingToken}
            />
          )}
        />
        <Tab.Screen
          name={'Communications'}
          options={{ tabBarLabel: Translate(languageRedux).COMMUNICATIONS || '' }}
          component={() => (
            <Communications
              dataReferral={listReferral}
              dataPrescription={listPrescription}
              dataMedical={listMedical}
              dataMessage={listMessage}
            />
          )}
        />
      </Tab.Navigator>
      {isShowNewDoc && (
        <View style={[styles.floatView]}>
          <NewDocumentFloating
            onPressCancel={() => {
              setShowNewDoc(false)
            }}
            routeViewFromDoctor={isShowNewDoc}
            patientId={passingData?.id}
            listCategoryFile={listCategoryFile}
            setStatus={setStatusAddDoc}
            setShowNotiAdd={setShowNoti}
          />
        </View>
      )}
      {isActionView && (
        <ActionsView
          onPressClose={() => {
            setActionView(false)
          }}
          onPressReferral={() => {
            setAddReferral(true)
          }}
          onPressNewMess={() => {
            setNewMess(true)
          }}
          onPressCertificate={() => {
            setAddCertificate(true)
          }}
          onPressPrescription={() => {
            setAddPrescription(true)
          }}
          onPressCall={_onPressCall}
        />
      )}
      {isAddReferral && <Referral
        onPressClose={() => {
          setAddReferral(false)
        }}
        patientId={passingData?.id}
        setStatus={setStatusNewReferral}
        setShowNotiAdd={setShowNotiNewReferral}
      />}
      {isNewMess && <NewMess
        onPressClose={() => {
          setNewMess(false)
        }}
        patientId={passingData?.id}
        setStatus={setStatusNewMess}
        setShowNotiAdd={setShowNotiNewMess}
      />}
      {isAddCertificate && <MedicalCertificate
        onPressClose={() => {
          setAddCertificate(false)
        }}
        patientId={passingData?.id}
        setStatus={setStatusNewCertificate}
        setShowNotiAdd={setShowNotiNewCertificate}
      />}
      {isAddPrescription && <Drug
        onPressCancel={() => {
          setAddPrescription(false)
        }}
        patientId={passingData?.id}
        onPressAddAction={() => {setShowListDrug(true)}}
        setValueItem={setListDrugSend}
        routeAction={true}
        isActionView={isShowListDrug}
      />}
      {isShowListDrug && <PrescriptionList
        onPressClose={() => {setShowListDrug(false)}}
        listData={listDrugTotal}
        onPressCloseTop={() => {
          setListDrugTotal([])
          setShowListDrug(false)
          setAddPrescription(false)
        }}
        setListData={setListDrugTotal}
        patientId={passingData?.id}
        setStatus={setStatusNewPrescription}
        setShowNotiAdd={setShowNotiNewPrescription}
      />}
      <NotificationView
        isShow={isShowNoti}
        setShow={() => setShowNoti(false)}
        status={dataNoti?.status || STATUS_NOTIFY.ERROR}
        content={dataNoti?.content || ''}
      />
      <NotificationView
        isShow={isShowNotiNewMess}
        setShow={() => setShowNotiNewMess(false)}
        status={dataNoti?.status || STATUS_NOTIFY.ERROR}
        content={dataNoti?.content || ''}
      />
      <NotificationView
        isShow={isShowNotiNewCertificate}
        setShow={() => setShowNotiNewCertificate(false)}
        status={dataNoti?.status || STATUS_NOTIFY.ERROR}
        content={dataNoti?.content || ''}
      />
      <NotificationView
        isShow={isShowNotiNewReferral}
        setShow={() => setShowNotiNewReferral(false)}
        status={dataNoti?.status || STATUS_NOTIFY.ERROR}
        content={dataNoti?.content || ''}
      />
      <NotificationView
        isShow={isShowNotiNewPrescription}
        setShow={() => setShowNotiNewPrescription(false)}
        status={dataNoti?.status || STATUS_NOTIFY.ERROR}
        content={dataNoti?.content || ''}
      />
      {isLoading && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  infoPatient: {
    backgroundColor: color363636,
    padding: 16
  },
  line1: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  flexRow: {
    flexDirection: 'row'
  },
  avtStyle: {
    height: 40,
    width: 40,
    borderRadius: 20
  },
  namePatient: {
    marginLeft: 16
  },
  buttonAction: {
    padding: 8,
    backgroundColor: colorFFFFFF,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  line2: {
    flexDirection: 'row',
    marginTop: 20
  },
  divider: {
    borderWidth: 1,
    borderColor: color5E5E5E,
    marginHorizontal: 40
  },
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  }
})
