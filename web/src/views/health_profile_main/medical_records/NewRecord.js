import React, { useState, useEffect } from 'react'
import {
  StyleSheet, View, Text, DeviceEventEmitter, ScrollView, Dimensions
} from 'react-native'
import Header from '../../../components/Header'
import Translate from '../../../translate'
import { color333333, color3777EE, color5C5D5E, colorA7A8A9, colorFFFFFF } from '../../../constants/colors'
import imgDirectCall from '../../../../assets/images/direct_call'
import { customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'
import CustomTextInput from '../../login_signup/components/TextInputView'
import SearchListWithName from '../../../components/SearchListWithName'
import NewChronicDisease from './component_record/NewChronicDisease'
import _ from 'lodash'
// import { apiCountry, apiICD10 } from 'api/Auth'
// import CustomDatePicker from 'components/CustomDatePicker'
import { convertDateDDMMYYYYToSever, convertYear, getDate112000 } from '../../../constants/DateHelpers'
// import { apiCheckPermission, apiPostAllergy, apiPostDependency, apiPostDisease, apiPostHospitalization, apiPostImmunization, apiPostIrregular, apiPostMedication, apiPostProthesis } from 'api/MedicalRecord'
import NewMedication from './component_record/NewMedication'
import NewAllergies from './component_record/NewAllergies'
import NewDependencies from './component_record/NewDependencies'
import NewHospitalizationSurgicalHistory from './component_record/NewHospitalizationSurgicalHistory'
import NewImmunization from './component_record/NewImmunization'
import NewProstheticsMedicalAid from './component_record/NewProstheticsMedicalAid'
import { COUNTRIES } from '../../login_signup/SignUpView'
// import { saveLSCountry } from 'actions/common'
import LoadingView from '../../../components/LoadingView'
// import NavigationService from 'navigation'
import NotificationView, { STATUS_NOTIFY } from '../../../components/NotificationView'
// import { hostAPI, hostAPIStaging } from 'api/APIs'
import NewIrregular from './component_record/NewIrregular'
import * as StateLocal from '../../../state_local'

export default function NewRecord() {

  const datePickerRef = React.createRef()
  const languageRedux = ''
  const [permissionUser, setPermissionUser] = useState()
  const lsRecord = [
    Translate(languageRedux).CHRONIC_DISEASE,
    Translate(languageRedux).allergie,
    Translate(languageRedux).medication,
    Translate(languageRedux).dependencies,
    Translate(languageRedux).HOSPITALIZATION_SURGICAL,
    Translate(languageRedux).immunization,
    Translate(languageRedux).irregulartest,
    Translate(languageRedux).PROSTHESIS_MEDICAL_AIDS
  ]
  const [isSearchList, setSearchList] = useState(false)
  const [typeRecord, setTypeRecord] = useState()
  //Disease
  const [lsDisease, setLsDisease] = useState([])
  const lsComplication = StateLocal.complication
  const [txtSearch, setTxtSearch] = useState()
  const [name, setName] = useState()
  const [other, setOther] = useState()
  const [complication, setComplication] = useState()
  const [since, setSince] = useState()
  const [note, setNote] = useState()
  const [isEmergency, setEmergency] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isShowPopupName, setShowPopupName] = useState(false)
  const [isShowCompli, setShowCompli] = useState(false)
  //Allergies
  const lsAllergi = StateLocal.allergies
  //Medication
  const lsMedication = StateLocal.medications
  const [dosage, setDosage] = useState()
  const [genericName, setGenericName] = useState()
  const [medicationForm, setMedicationForm] = useState()
  const lsMedicationForm = StateLocal.medicalMediForm
  //Dependencies
  const lsType = [
    { 'name': Translate(languageRedux).no },
    { 'name': Translate(languageRedux).yes }
  ]
  const [weaned, setWeaned] = useState('')
  const lsDepen = []//useSelector(state => state.common.lsDipendenze)
  const [isShowType, setShowType] = useState()
  const [dailyuse, setDailyuse] = useState()
  //Hospitalization
  const lsTypeSurgery = [
    {
      'id': 0,
      'name': Translate(languageRedux).surgeryCategory
    },
    {
      'id': 1,
      'name': Translate(languageRedux).hospitalization
    }
  ]
  const [typeSurgery, setTypeSurgery] = useState()
  const lsSurgery = []//useSelector(state => state.common.lsSurgery)
  const lsHospital = StateLocal.hospitalization
  const [surgeryCategory, setSurgeryCategory] = useState()
  const lsSubSurgery = []//useSelector(state => state.common.lsSubSurgery)
  const [isShowSurgeryCategory, setShowSurgeryCategory] = useState(false)
  const [country, setCountry] = useState()
  const [isShowCountry, setShowCountry] = useState(false)
  const lsCountry = StateLocal.lsCountry
  //Immunization
  const lsImmu = StateLocal.immunization
  //Irregular
  const lsIrregular = StateLocal.irregular
  const [descrizione, setDescrizione] = useState()
  const [actionTaken, setActionTaken] = useState()
  //Prosthetics
  const lsProsthesis = []//useSelector(state => state.common.lsProsthetics)
  const [isShowNoti, setShowNoti] = useState(false)
  const [dataNoti, setDataNoti] = useState()
  //redux
  const AllergiesRedux = StateLocal.medicalDataAllergies
  const chronicDiseaseRedux = StateLocal.chronic_disease
  const medicationsRedux = StateLocal.medicalDataMedicine
  const dependenciesRedux = StateLocal.medicalDataDependencies
  const hospitalizationRedux = StateLocal.medicalDataHospitalization
  const immunizationsRedux = StateLocal.medicalDataImmunization
  const irregularRedux = StateLocal.medicalDataIrre
  const prosthesisRedux = StateLocal.medicalDataProsthesis
  const lsDiseaseRedux = StateLocal.medicalDataDisease


  useEffect(() => {
    callAPICheckPermission()
    if (lsCountry.length === 0) {
      callAPIGetCountries()
    }
  }, [])

  useEffect(() => {
    resetAllData()
  }, [typeRecord])

  useEffect(() => {
    if (typeRecord === lsRecord[0]) {
      callAPIDisease()
    }
  }, [txtSearch])

  const callAPIGetCountries = () => {
    // dispatch(apiCountry()).then(res => {
    //   const getCountry = res?.payload?.country || []
    //   if (getCountry.length > 0) {
    //     Promise.all([
    //       dispatch(saveLSCountry(getCountry))
    //     ])
    //   } else {
    //     Promise.all([
    //       dispatch(saveLSCountry(COUNTRIES))
    //     ])
    //   }
    // }).catch(() => {
    //   Promise.all([
    //     dispatch(saveLSCountry(COUNTRIES))
    //   ])
    // })
  }

  const callAPICheckPermission = () => {
    // dispatch(apiCheckPermission()).then(res => {
    //   console.log('callAPICheckPermission Res: ', res)
    //   setPermissionUser(res?.payload)
    // }).catch(() => {

    // })
  }

  const callAPIDisease = () => {
    // dispatch(apiICD10(txtSearch)).then(res => {
    //   console.log('Res: ', res)
    //   const getDisease = res?.payload?.disease || []
    //   if (getDisease.length > 0) {
    //     if (hostAPI !== hostAPIStaging) {
    //       setLsDisease(getDisease)
    //     }
    //   }
    // }).catch(() => {
    // })
  }

  const resetAllData = () => {
    setName()
    setLsDisease([])
    setTxtSearch()
    setOther()
    setComplication()
    setSince()
    setNote()
    setEmergency()
    setDosage()
    setGenericName()
    setMedicationForm()
    setWeaned()
    setDailyuse()
    setTypeSurgery()
    setSurgeryCategory()
    setCountry()
    setActionTaken()
    setDescrizione()
  }

  const checkSave = () => {
    switch (typeRecord) {
      case lsRecord[0]:
        return !(_.isEmpty(name))
      case lsRecord[1]:
        return !(_.isEmpty(name))
      case lsRecord[2]:
        return (!(_.isEmpty(name)) && (name?.id === 1 ? !(_.isEmpty(other)) : true))
      case lsRecord[3]:
        return (!(_.isEmpty(name)) && !(_.isEmpty(weaned)) && since)
      case lsRecord[4]:
        if (typeSurgery?.name === lsTypeSurgery[0].name) {
          return (!(_.isEmpty(name)) && since)
        } else if (typeSurgery?.name === lsTypeSurgery[1].name) {
          return (!(_.isEmpty(name)) && (name?.id === 1 ? !(_.isEmpty(other)) : true) && since)
        }
        return typeSurgery
      case lsRecord[5]:
        return !(_.isEmpty(name))
      case lsRecord[6]:
        return !(_.isEmpty(name))
      case lsRecord[7]:
        return !(_.isEmpty(name))
      default:
        return false
    }
  }

  const renderTop = () => {
    return (
      <View style={styles.topStyle}>
        <Text style={[
          customTxt(Fonts.Bold, 18, color333333).txt
        ]}>{Translate(languageRedux).RECORD_TYPE}</Text>
        <Text style={[
          customTxt(Fonts.Regular, 16, color5C5D5E).txt
        ]}>{Translate(languageRedux).LOREM_IPSUM_DOLOR}</Text>
        <CustomTextInput
          value={typeRecord || ''}
          onChangeTxt={() => { }}
          placeholder={Translate(languageRedux).SELECT_A_CATALOGUE}
          onPressDropDown={() => setSearchList(true)}
          imgStyle={styles.imgStyle}
          validate={''}
        />
      </View>
    )
  }

  const _onPressName = () => {
    if (typeSurgery?.name === lsTypeSurgery[0].name && !(surgeryCategory?.name)) {
      return
    }
    setShowPopupName(true)
  }

  const _onPressPopup2 = () => {
    setShowCompli(true)
  }

  const _onPressSince = () => {
    if (datePickerRef?.current) {
      datePickerRef?.current?.onPressDate()
    }
  }

  const _onPressCountry = () => {
    setShowCountry(true)
  }

  const renderCenter = () => {
    if (_.isEmpty(typeRecord)) {
      return null
    }
    switch (typeRecord) {
      case lsRecord[0]:
        return <NewChronicDisease
          disease={name}
          setDisease={val => {
            setName({ id: 1, name: val })
          }}
          onPressDisease={_onPressName}
          other={other}
          setOther={val => setOther(val)}
          complication={complication}
          onPressCompli={_onPressPopup2}
          since={since}
          onPressSince={_onPressSince}
          note={note}
          setNote={val => setNote(val)}
          isEmergency={isEmergency}
          setEmergency={val => setEmergency(val)}
        />
      case lsRecord[1]:
        return <NewAllergies
          allergies={name}
          onPressAllergies={_onPressName}
          other={other}
          setOther={val => setOther(val)}
          genericName={genericName}
          setGenericName={val => setGenericName(val)}
          since={since}
          onPressSince={_onPressSince}
          note={note}
          setNote={val => setNote(val)}
          isEmergency={isEmergency}
          setEmergency={val => setEmergency(val)}
        />
      case lsRecord[2]:
        return <NewMedication
          medication={name}
          onPressMedication={_onPressName}
          other={other}
          setOther={val => setOther(val)}
          dosage={dosage}
          setDosage={val => setDosage(val)}
          genericName={genericName}
          setGenericName={val => setGenericName(val)}
          since={since}
          onPressSince={_onPressSince}
          note={note}
          setNote={val => setNote(val)}
          medicationForm={medicationForm?.name || ''}
          onPressMediForm={_onPressPopup2}
          isEmergency={isEmergency}
          setEmergency={val => setEmergency(val)}
        />
      case lsRecord[3]:
        return <NewDependencies
          dependency={name}
          onPressDependency={_onPressName}
          other={other}
          setOther={val => setOther(val)}
          weaned={weaned}
          onPressWean={() => setShowType(true)}
          since={since}
          onPressSince={_onPressSince}
          dailyuse={dailyuse}
          setDailyuse={val => setDailyuse(val)}
          note={note}
          setNote={val => setNote(val)}
          isEmergency={isEmergency}
          setEmergency={val => setEmergency(val)}
        />
      case lsRecord[4]:
        return <NewHospitalizationSurgicalHistory
          type={typeSurgery}
          onPressType={() => setShowType(true)}
          surgeryCategory={surgeryCategory || ''}
          onPressSurgeryCategory={() => setShowSurgeryCategory(true)}
          nameType={name}
          onPressNameType={_onPressName}
          other={other}
          setOther={val => setOther(val)}
          since={since}
          onPressSince={_onPressSince}
          country={country?.text || ''}
          onPressCountry={_onPressCountry}
          note={note}
          setNote={val => setNote(val)}
          isEmergency={isEmergency}
          setEmergency={val => setEmergency(val)}
        />
      case lsRecord[5]:
        return <NewImmunization
          immunization={name}
          onPressImmunization={_onPressName}
          other={other}
          setOther={val => setOther(val)}
          since={since}
          onPressSince={_onPressSince}
          note={note}
          setNote={val => setNote(val)}
          isEmergency={isEmergency}
          setEmergency={val => setEmergency(val)}
        />
      case lsRecord[6]:
        return <NewIrregular
          irregular={name}
          onPressIrregular={_onPressName}
          other={other}
          setOther={val => setOther(val)}
          descrizione={descrizione}
          setDescrizione={val => setDescrizione(val)}
          actionTaken={actionTaken}
          setActionTaken={val => setActionTaken(val)}
          since={since}
          onPressSince={_onPressSince}
          note={note}
          setNote={val => setNote(val)}
          isEmergency={isEmergency}
          setEmergency={val => setEmergency(val)}
        />
      case lsRecord[7]:
        return <NewProstheticsMedicalAid
          prosthetics={name}
          onPressProsthetics={_onPressName}
          other={other}
          setOther={val => setOther(val)}
          since={since}
          onPressSince={_onPressSince}
          note={note}
          setNote={val => setNote(val)}
          isEmergency={isEmergency}
          setEmergency={val => setEmergency(val)}
        />
      default:
        return <NewChronicDisease />
    }
  }

  const getLsSubSurgery = () => {
    return lsSubSurgery.filter((id) => id.surgeryCategoryId === surgeryCategory?.id)
  }

  const getLsDataName = () => {
    switch (typeRecord) {
      case lsRecord[0]:
        return lsDiseaseRedux
      case lsRecord[1]:
        return lsAllergi
      case lsRecord[2]:
        return lsMedication
      case lsRecord[3]:
        return lsDepen
      case lsRecord[4]:
        return typeSurgery?.name === lsTypeSurgery[0]?.name ? getLsSubSurgery() : lsHospital
      case lsRecord[5]:
        return lsImmu
      case lsRecord[6]:
        return lsIrregular
      case lsRecord[7]:
        return lsProsthesis
      default:
        return []
    }
  }

  const getTitlePopupName = () => {
    if (typeRecord) {
      if (typeRecord === lsRecord[4]) {
        if (typeSurgery === lsTypeSurgery[0]) {
          return Translate(languageRedux).CHOOSE_SURGERY
        } else {
          return Translate(languageRedux).CHOOSE_SURGERY
        }
      } else if (typeRecord === lsRecord[6]) {
        return Translate(languageRedux).SELECT_TEST
      }
      return `${Translate(languageRedux).select} ${typeRecord}`
    }
    return ''
  }

  const getLSData2 = () => {
    switch (typeRecord) {
      case lsRecord[0]:
        return lsComplication
      case lsRecord[1]:
        return []
      case lsRecord[2]:
        return lsMedicationForm
      case lsRecord[3]:
        return []
      case lsRecord[4]:
        return []
      case lsRecord[5]:
        return []
      case lsRecord[6]:
        return []
      default:
        return []
    }
  }

  const getTitlePopup2 = () => {
    switch (typeRecord) {
      case lsRecord[0]:
        return Translate(languageRedux).CHOOSE_COMPLICATIO
      case lsRecord[1]:
        return []
      case lsRecord[2]:
        return `${Translate(languageRedux).select} ${Translate(languageRedux).formafarmaco}`
      case lsRecord[3]:
        return []
      case lsRecord[4]:
        return []
      case lsRecord[5]:
        return []
      case lsRecord[6]:
        return []
      default:
        return []
    }
  }

  const _onChangeDatePicker = (date) => {
    setSince(date)
  }

  const _onPressClickName = (val) => {
    setName(val)
    setShowPopupName(false)
    setOther()
  }

  const _onPressClickPopup2 = (val) => {
    setShowCompli(false)
    switch (typeRecord) {
      case lsRecord[0]:
        return setComplication(val)
      case lsRecord[1]:
        return null
      case lsRecord[2]:
        return setMedicationForm(val)
      case lsRecord[3]:
        return null
      case lsRecord[4]:
        return null
      case lsRecord[5]:
        return null
      case lsRecord[6]:
        return null
      default:
        return null
    }
  }

  const _onPressItemPopup2 = (val) => {
    switch (typeRecord) {
      case lsRecord[0]:
        return complication
      case lsRecord[1]:
        return null
      case lsRecord[2]:
        return medicationForm
      case lsRecord[3]:
        return null
      case lsRecord[4]:
        return null
      case lsRecord[5]:
        return null
      case lsRecord[6]:
        return null
      default:
        return null
    }
  }

  const getLSData3Type = () => {
    switch (typeRecord) {
      case lsRecord[0]:
        return []
      case lsRecord[1]:
        return []
      case lsRecord[2]:
        return []
      case lsRecord[3]:
        return lsType
      case lsRecord[4]:
        return lsTypeSurgery
      case lsRecord[5]:
        return []
      case lsRecord[6]:
        return []
      default:
        return []
    }
  }

  const _getTitlePopup3Type = () => {
    switch (typeRecord) {
      case lsRecord[0]:
        return null
      case lsRecord[1]:
        return null
      case lsRecord[2]:
        return null
      case lsRecord[3]:
        return Translate(languageRedux).CHOOSE_WEANED_OFF
      case lsRecord[4]:
        return Translate(languageRedux).CHOOSE_TYPE
      case lsRecord[5]:
        return null
      case lsRecord[6]:
        return null
      default:
        return null
    }
  }

  const _onPressItemPopup3Type = () => {
    switch (typeRecord) {
      case lsRecord[0]:
        return null
      case lsRecord[1]:
        return null
      case lsRecord[2]:
        return null
      case lsRecord[3]:
        return weaned
      case lsRecord[4]:
        return typeSurgery
      case lsRecord[5]:
        return null
      case lsRecord[6]:
        return null
      default:
        return null
    }
  }

  const _onPressClickPopup3Type = (val) => {
    setShowType(false)
    switch (typeRecord) {
      case lsRecord[0]:
        return null
      case lsRecord[1]:
        return null
      case lsRecord[2]:
        return []
      case lsRecord[3]:
        return setWeaned(val)
      case lsRecord[4]:
        if (val?.name === typeSurgery?.name) { return }
        setSurgeryCategory()
        setName()
        setOther()
        setSince()
        return setTypeSurgery(val)
      case lsRecord[5]:
        return null
      case lsRecord[6]:
        return null
      default:
        return null
    }
  }

  const _onPressItemPopupSurgeryCategory = (val) => {
    setSurgeryCategory(val)
    setName()
    setShowSurgeryCategory(false)
  }

  const getResType = (idx) => {
    switch (idx) {
      case 0:
        return 'apiPostDisease1'
      case 1:
        return 'apiPostAllergy1'
      case 2:
        return 'apiPostMedication1'
      case 3:
        return 'apiPostDependency1'
      case 4:
        return 'apiPostHospitalization1'
      case 5:
        return 'apiPostImmunization1'
      case 6:
        return 'apiPostIrregular1'
      case 7:
        return 'apiPostProthesis1'
      default:
        return ''
    }
  }

  const checkResponse = (res, index) => {
    setShowNoti(true)
    if (!(res?.payload) && res?.type === getResType(index)) {
      setDataNoti({
        status: STATUS_NOTIFY.SUCCESS,
        content: Translate(languageRedux).record_aggiunto
      })
      setTimeout(() => {
        NavigationService.goBack()
      }, 4000)
      setTimeout(() => {
        DeviceEventEmitter.emit('update')
      }, 4500)
      return
    }
    if (_.includes([0, '0'], res?.payload?.esito)) {
      setDataNoti({
        status: STATUS_NOTIFY.SUCCESS,
        content: Translate(languageRedux).record_aggiunto
      })
      setTimeout(() => {
        NavigationService.goBack()
      }, 4000)
      setTimeout(() => {
        DeviceEventEmitter.emit('update')
      }, 4500)
      return
    }
    setLoading(false)
    setDataNoti({
      status: STATUS_NOTIFY.ERROR,
      content: res?.payload?.motivo || ''
    })
  }

  const _onPressRightNavi = () => {
    if (!checkSave()) { return }
    switch (typeRecord) {
      case lsRecord[0]:
        var param = {
          'onEmergencyLogin': isEmergency ? 1 : 0,
          // 'code': name?.code,
          'complicationId': complication?.id,
          'disease': name?.name || '',
          'diseaseId': name?.id,//name?.diseaseId,
          'isIcd10': permissionUser?.iniziativa?.hasIcd10 === '0' ? 0 : 1,
          'name': name?.name || '',
          'startDate': convertDateDDMMYYYYToSever(since),
          'remarks': note || ''
        }
        if (_.includes(['1', 1], name?.id)) {
          param = {
            ...param,
            'other': name?.name || ''
          }
        }
        // setLoading(true)
        // return dispatch(apiPostDisease(param)).then(res => {
        //   console.log('res apiPostDisease: ', res)
        //   checkResponse(res, 0)
        // }).catch(() => {

        // })
      case lsRecord[1]:
        var param = {
          'allergyId': name?.id,
          'since': since ? (new Date(since)).getTime() : '',
          'genericName': genericName || '',
          'remarks': note || '',
          'onEmergencyLogin': isEmergency ? 1 : 0
        }
        if (_.includes(['1', 1], name?.id)) {
          param = {
            ...param,
            'other': other || ''
          }
        }
        // setLoading(true)
        // return dispatch(apiPostAllergy(param)).then(res => {
        //   console.log('res apiPostAllergy:', res)
        //   checkResponse(res, 1)
        // }).catch(() => {

        // })
      case lsRecord[2]:
        console.log('medicationForm: ', medicationForm)
        var param = {
          'medicineId': name?.id,
          'medicationId': medicationForm?.id,
          'dosage': dosage || '',
          'since': since ? (new Date(since)).getTime() : '',
          'genericName': genericName || '',
          'remarks': note || '',
          'onEmergencyLogin': isEmergency ? 1 : 0
        }
        if (_.includes(['1', 1], name?.id)) {
          param = {
            ...param,
            'other': other || ''
          }
        }
        // setLoading(true)
        // return dispatch(apiPostMedication(param)).then(res => {
        //   console.log('res apiPostMedication:', res)
        //   checkResponse(res, 2)
        // }).catch(() => {
        //   setLoading(false)
        // })
      case lsRecord[3]:
        var param = {
          'dependencyId': name?.id,
          'yearStarted': convertYear(since),
          'weaned_off': weaned?.name === lsType[1] ? 1 : 0,
          'since': since ? (new Date(since)).getTime() : '',
          'daily_use': dailyuse || '',
          'remarks': note || '',
          'onEmergencyLogin': isEmergency ? 1 : 0
        }
        if (_.includes(['1', 1], name?.id)) {
          param = {
            ...param,
            'other': other || ''
          }
        }
        // setLoading(true)
        // return dispatch(apiPostDependency(param)).then(res => {
        //   console.log('res apiPostDependency:', res)
        //   checkResponse(res, 3)
        // }).catch(() => {

        // })
      case lsRecord[4]:
        var param = {
          'type': typeSurgery.id,
          'country': country?.value || '',
          'remarks': note || '',
          'onEmergencyLogin': isEmergency ? 1 : 0,
          'hospDate': since ? (new Date(since)).getTime() : ''
        }
        if (_.includes(['1', 1], name?.id)) {
          param = {
            ...param,
            'other': other || ''
          }
        }
        if (typeSurgery?.id === 0) {
          param = {
            ...param,
            'select': surgeryCategory?.id,
            'surgerySubCategoryId': name?.id
          }
        } else if (typeSurgery?.id === 1) {
          param = {
            ...param,
            'hospitalizationId': name?.id
          }
        }
        // setLoading(true)
        // return dispatch(apiPostHospitalization(param)).then(res => {
        //   console.log('res apiPostDependency:', res)
        //   checkResponse(res, 4)
        // }).catch(() => {

        // })
      case lsRecord[5]:
        var param = {
          'immunizationId': name?.id,
          'immunizationDate': since ? (new Date(since)).getTime() : '',
          'daily_use': dailyuse || '',
          'remarks': note || '',
          'onEmergencyLogin': isEmergency ? 1 : 0
        }
        if (_.includes(['1', 1], name?.id)) {
          param = {
            ...param,
            'other': other || ''
          }
        }
        // setLoading(true)
        // return dispatch(apiPostImmunization(param)).then(res => {
        //   console.log('res apiPostDependency:', res)
        //   checkResponse(res, 5)
        // }).catch(() => {

        // })
      case lsRecord[6]:
        var param = {
          'testId': name?.id,
          'testDate': since ? (new Date(since)).getTime() : '',
          'actionTaken': actionTaken,
          'description': descrizione,
          'remarks': note || '',
          'onEmergencyLogin': isEmergency ? 1 : 0
        }
        if (_.includes(['1', 1], name?.id)) {
          param = {
            ...param,
            'other': other || ''
          }
        }
        // setLoading(true)
        // return dispatch(apiPostIrregular(param)).then(res => {
        //   console.log('res apiPostDependency:', res)
        //   checkResponse(res, 6)
        // }).catch(() => {

        // })
      case lsRecord[7]:
        var param = {
          'prosthesisId': name?.id,
          'since': since ? (new Date(since)).getTime() : '',
          'remarks': note || '',
          'onEmergencyLogin': isEmergency ? 1 : 0
        }
        if (_.includes(['1', 1], name?.id)) {
          param = {
            ...param,
            'other': other || ''
          }
        }
        // setLoading(true)
        // return dispatch(apiPostProthesis(param)).then(res => {
        //   console.log('res apiPostDependency:', res)
        //   checkResponse(res, 7)
        // }).catch(() => {

        // })
      default:
        return null
    }
  }

  const getLsHiden = () => {
    switch (typeRecord) {
      case lsRecord[0]:
        return chronicDiseaseRedux || []
      case lsRecord[1]:
        const notOther = (AllergiesRedux || []).filter(val => val?.allergyId !== 1)
        return notOther.map(val => { return { id: val?.allergyId } })
      case lsRecord[2]:
        const notOther2 = (medicationsRedux || []).filter(val => val?.medicineId !== 1)
        return notOther2.map(val => { return { id: val?.medicineId } })
      case lsRecord[3]:
        const notOther3 = (dependenciesRedux || []).filter(val => val?.dependencyId !== 1)
        return notOther3.map(val => { return { id: val?.dependencyId } })
      case lsRecord[4]:
        const getId = (val) => {
          (val?.surgerySubCategoryId || val?.hospitalizationId)
          if (val?.surgerySubCategoryId === 0) {
            return val?.hospitalizationId
          } else if (val?.hospitalizationId === 0) {
            return val?.surgerySubCategoryId
          }
        }
        const notOther4 = (hospitalizationRedux || []).filter(val => getId(val) !== (val?.surgerySubCategoryId === 0 ? 1 : 0))
        return notOther4.map(val => { return { id: (val?.surgerySubCategoryId || val?.hospitalizationId) } })
      case lsRecord[5]:
        const notOther5 = (immunizationsRedux || []).filter(val => val?.immunizationId !== 1)
        return notOther5.map(val => { return { id: val?.immunizationId } })
      case lsRecord[6]:
        const notOther6 = (irregularRedux || []).filter(val => val?.testId !== 1)
        return notOther6.map(val => { return { id: val?.testId } })
      case lsRecord[7]:
        const notOther7 = (prosthesisRedux || []).filter(val => val?.prosthesisId !== 1)
        return notOther7.map(val => { return { id: val?.prosthesisId } })
      default:
        return null
    }
  }

  return (
    <View style={styles.container}>
      <Header
        textCenter={Translate(languageRedux).NEW_RECORD}
        backgroundColor={colorFFFFFF}
        iconLeft={imgDirectCall.ic_close}
        textRight={Translate(languageRedux).btnsave}
        txtRightStyle={customTxt(Fonts.Medium, 16, checkSave() ? color3777EE : colorA7A8A9).txt}
        onPressRight={_onPressRightNavi}
      />
      <ScrollView>
        {renderTop()}
        {renderCenter()}
      </ScrollView>
      {
        isSearchList && (
          <SearchListWithName
            listData={lsRecord}
            title={`${Translate(languageRedux).select} ${Translate(languageRedux).RECORD_TYPE}`}
            itemSelected={typeRecord}
            onItemClick={(val) => {
              setTypeRecord(val)
              setSearchList(false)
            }}
            onPressRight={() => {
              setSearchList(false)
            }}
            isItem={true}
          />
        )
      }
      {
        isShowPopupName && (
          <SearchListWithName
            listData={getLsDataName()}
            title={getTitlePopupName()}
            itemSelected={name}
            onItemClick={_onPressClickName}
            onPressRight={() => {
              setShowPopupName(false)
            }}
            setTxtSearch={val => setTxtSearch(val)}
            lsHiden={getLsHiden()}
          />
        )
      }
      {
        isShowCompli && (
          <SearchListWithName
            listData={getLSData2()}
            title={getTitlePopup2()}
            itemSelected={_onPressItemPopup2()}
            onItemClick={_onPressClickPopup2}
            onPressRight={() => {
              setShowCompli(false)
            }}
            refreshing={isLoading}
          />
        )
      }
      {
        isShowType && (
          <SearchListWithName
            listData={getLSData3Type()}
            title={_getTitlePopup3Type()}
            itemSelected={_onPressItemPopup3Type()}
            onItemClick={_onPressClickPopup3Type}
            onPressRight={() => {
              setShowType(false)
            }}
            hideSearchText={true}
          />
        )
      }
      {
        isShowSurgeryCategory && (
          <SearchListWithName
            listData={lsSurgery}
            title={Translate(languageRedux).CHOOSE_SURGERY_CATEGORY}
            itemSelected={surgeryCategory}
            onItemClick={_onPressItemPopupSurgeryCategory}
            onPressRight={() => {
              setShowSurgeryCategory(false)
            }}
            hideSearchText={true}
          />
        )
      }
      {
        isShowCountry && (
          <SearchListWithName
            listData={lsCountry}
            title={`${Translate(languageRedux).select} ${Translate(languageRedux).ricettario}`}
            itemSelected={country}
            onItemClick={(val) => {
              setCountry(val)
              setShowCountry(false)
            }}
            onPressRight={() => {
              setShowCountry(false)
            }}
            isText={true}
          />
        )
      }
      {/* <CustomDatePicker
        refDatePicker={datePickerRef}
        onChangeDate={_onChangeDatePicker}
        maxDate={new Date()}
        date={since || getDate112000()}
      /> */}
      {isLoading && <LoadingView />}
      <NotificationView
        isShow={isShowNoti}
        setShow={() => setShowNoti(false)}
        status={dataNoti?.status || STATUS_NOTIFY.ERROR}
        content={dataNoti?.content || ''}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: colorFFFFFF
  },
  topStyle: {
    margin: 20
  },
  imgStyle: {
    width: 12,
    height: 6
  }
})
