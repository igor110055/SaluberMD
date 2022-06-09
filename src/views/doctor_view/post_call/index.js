import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, DeviceEventEmitter} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../api/APIs'
import _ from 'lodash'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'

import { color040404, color3777EE, colorDDDEE1, colorF8F8F8, colorFFFFFF } from 'constants/colors'
import Translate from 'translate'
import Fonts from 'constants/Fonts'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import { customTxt } from 'constants/css'
import { convertToUTC } from 'constants/DateHelpers'

import icHeader from '../../../../assets/images/header'
import icCall from '../../../../assets/images/video_call'

import Button from 'components/Button'
import CustomTextInput from '../../healthProfile/components/CustomTextInput'
import Symptoms from './Symptoms'
import Disease from './Disease'
import Drug from './Drug'
import LoadingView from 'components/LoadingView'
import DialogCustom from 'components/DialogCustom'
import Header from '../../documentlist/components/Header'
import { apiGetCallPatient, apiPostSurveyDoctor } from 'api/DoctorPatientCall'
import { apiGetCategoryListByPatinet, apiGetSurveyBOIdReq } from '../notification_navigator/apis'
import { saveSurveyPatient } from 'actions/common'

export default function PostCall({ route }) {
  const languageRedux = useSelector(state => state.common.language)
  const dataNoti = useSelector(state => state.common.dataNoti)
  const [subjective, setSubjective] = useState()
  const [objective, setObjective] = useState()
  const [assessment, setAssessment] = useState()
  const [plan, setPlan] = useState()
  const [referral, setReferral] = useState()
  const [certificate, setCertificate] = useState()
  const [isSymptom, setSymptom] = useState(false)
  const [listSymptom, setListSymptom] = useState()
  const [isDisease, setDisease] = useState(false)
  const [listDisease, setListDisease] = useState()
  const [isDrug, setDrug] = useState(false)
  const [listDrug, setListDrug] = useState([])
  const [listDrugTotal, setListDrugTotal] = useState([])
  const token = useSelector(state => state.user.token)
  const [isLoad, setLoading] = useState(false)
  const [isDialogSend, setDialogSend] = useState(false)
  const [isDialogLater, setDialogLater] = useState(false)
  const surveyPatient = useSelector(state => state.common.surveyPatient)
  var patientId = surveyPatient?.user?.id || 0
  const [listDiseaseConvert, setListDiseaseConvert] = useState()
  const passingData = route?.params?.data
  const passingRouteDoctor = route?.params?.routeDoctor
  const [noti, setNoti] = useState()
  const [isShowNoti, setShowNoti] = useState()
  const dispatch = useDispatch()
  const passingRouteHome = route?.params?.routeViewHome

  useEffect(() => {
    var list = [...listDrugTotal]
    var listTotal = _.concat(listDrug, list)
    setListDrugTotal(listTotal)
    console.log('listDrugTotal: ', listDrugTotal)
  }, [listDrug])

  useEffect(() => {
    console.log('listDisease: ', listDisease)
    converDisease()
  }, [listDisease])

  useEffect(() => {
    callAPIGetSummaryTemp()
  }, [])

  const callAPIGetSummaryTemp = () => {
    setLoading(true)
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/webdoctor/getSummary/${Number(passingData?.webconferenceId)}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        console.log('callAPIGetSummaryTemp: ', response?.data)
        if (response.data.length === 0) {
          setLoading(false)
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (callAPIGetSummaryTemp)')
          const getList = response?.data || []
          setSubjective(getList?.consult)
          setObjective(getList?.objective)
          setAssessment(getList?.summary)
          setPlan(getList?.recommendations)
          setReferral(getList?.referral)
          setCertificate(getList?.certificate)
          setListDrugTotal(getList?.drugs)
          setLoading(false)
        }
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }

  const converDisease = () => {
    var data = []
    for (var i = 0; i < (listDisease || []).length; i++) {
      var item = {}
      item.code = listDisease[i]?.icd10_section3_code
      item.diseaseId = listDisease[i]?.icd10_section3_id
      item.name = listDisease[i]?.name
      item.selected = true
      item.insertedBy = patientId
      item.startDate = convertToUTC()
      data.push(item)
    }
    setListDiseaseConvert(data)
  }

  const renderSOAP = () => {
    return (
      <View>
        <Text style={customTxt(Fonts.Bold, 18, color040404).txt}>
          {Translate(languageRedux).CONSULTATION_OUTCOME}
        </Text>
        <CustomTextInput
          title={Translate(languageRedux).SUBJECTIVE}
          value={subjective}
          onChangeTxt={(txt) => setSubjective(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.txtTextInput]}
          multiline={true}
        />
        <CustomTextInput
          title={Translate(languageRedux).OBJECTIVE}
          value={objective}
          onChangeTxt={(txt) => setObjective(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.txtTextInput]}
          multiline={true}
        />
        <CustomTextInput
          title={Translate(languageRedux).ASSESSMENT}
          value={assessment}
          onChangeTxt={(txt) => setAssessment(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.txtTextInput]}
          multiline={true}
        />
        <CustomTextInput
          title={Translate(languageRedux).PLAN}
          value={plan}
          onChangeTxt={(txt) => setPlan(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.txtTextInput]}
          multiline={true}
        />
      </View>
    )
  }

  const RenderItemListSelected = ({ item, type, index, data }) => {
    const _onPressItemSelectedSymptom = () => {
      var selectID = [...data]
      if (selectID.includes(item)) {
        selectID = selectID.filter((val) => val?.id !== item?.id)
      }
      else {
        selectID.push(item)
      }
      setListSymptom(selectID)
    }
    const _onPressItemSelectedDisease = () => {
      var selectID = [...data]
      if (selectID.includes(item)) {
        selectID = selectID.filter((val) => val?.diseaseId !== item?.diseaseId)
      }
      else {
        selectID.push(item)
      }
      setListDisease(selectID)
    }
    const _onPressItemSelectedDrug = () => {
      var selectID = [...data]
      if (selectID.includes(item)) {
        selectID = selectID.filter((val) => val?.drugId !== item?.drugId)
      }
      else {
        selectID.push(item)
      }
      setListDrugTotal(selectID)
    }
    const checkOnPress = () => {
      if (type === 1) {
        return _onPressItemSelectedSymptom
      }
      if (type === 2) {
        return _onPressItemSelectedDisease
      }
      if (type === 3) {
        return _onPressItemSelectedDrug
      }
    }
    return (
      <View>
        <View style={styles.ctnItemSelected}>
          <View style={styles.flex1}>
            <Text numberOfLines={1} style={customTxt(Fonts.Bold, 14, color040404).txt}>
              {item?.nameCurrentValue || item?.name}
            </Text>
          </View>
          <TouchableOpacity onPress={checkOnPress()}>
            <Image source={icCall.ic_trash} style={styles.iconStyle} />
          </TouchableOpacity>
        </View>
        {(index !== (data || []).length - 1) && <View style={styles.line} />}
      </View>
    )
  }

  const RenderCell = ({ title, onPress, data, typeId }) => {
    return (
      <View style={styles.ctnCell}>
        <View style={styles.ctnTitleCell}>
          <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
            {title}
          </Text>
          <TouchableOpacity onPress={onPress} style={styles.flexRow}>
            <Image source={icCall.ic_file_plus} style={styles.iconStyle} />
            <Text style={[customTxt(Fonts.SemiBold, 16, color3777EE).txt, styles.marginL8]}>
              {Translate(languageRedux).add_new}
            </Text>
          </TouchableOpacity>
        </View>
        {(data || []).length > 0 && <View style={styles.line} />}
        <FlatList
          data={data || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItemListSelected
              item={item}
              type={typeId}
              index={index}
              data={data || []}
            />
          )}
        />
      </View>
    )
  }

  const renderDocuments = () => {
    return (
      <View>
        <Text style={[customTxt(Fonts.Bold, 18, color040404).txt, styles.marginT32]}>
          {Translate(languageRedux).documents}
        </Text>
        {/* <RenderCell
          title={Translate(languageRedux).symptoms}
          onPress={() => {setSymptom(true)}}
          data={listSymptom}
          typeId={1}
        /> */}
        <RenderCell
          title={Translate(languageRedux).disease_1}
          onPress={() => { setDisease(true) }}
          data={listDisease}
          typeId={2}
        />
        <RenderCell
          title={Translate(languageRedux).prescription}
          onPress={() => { setDrug(true) }}
          data={listDrugTotal}
          typeId={3}
        />
      </View>
    )
  }

  const renderOtherDoc = () => {
    return (
      <View>
        <Text style={[customTxt(Fonts.Bold, 18, color040404).txt, styles.marginT32]}>
          {Translate(languageRedux).OTHER_DOCUMENTS}
        </Text>
        <CustomTextInput
          title={Translate(languageRedux).REFERRAL}
          value={referral}
          onChangeTxt={(txt) => setReferral(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
        <CustomTextInput
          title={Translate(languageRedux).medical_certificate}
          value={certificate}
          onChangeTxt={(txt) => setCertificate(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.txtTextInput]}
        />
      </View>
    )
  }

  const renderButton = () => {
    return (
      <View style={styles.ctnButton}>
        <Button
          text={Translate(languageRedux).SEND_BTN}
          textColor={colorFFFFFF}
          backgroundColor={color3777EE}
          onPress={_onPressSend}
        />
        <View style={styles.distanceButton} />
        <Button
          text={Translate(languageRedux).SAVE_FOR_LATER}
          textColor={color3777EE}
          onPress={() => {
            saveDraftSummary()
          }}
        />
      </View>
    )
  }

  const _onPressSend = () => {
    const body = {
      symptoms: [],
      drugs: listDrugTotal || [],
      visits: [],
      diseases: listDiseaseConvert || [],
      // onlyNew: [],
      isChanged: true,
      consult: subjective || '',
      objective: objective || '',
      summary: assessment || '',
      recommendations: plan || '',
      referral: referral || '',
      drug_country: 'US',
      times: 2,
      certificate: certificate
    }
    console.log('BODY: ', body)
    setLoading(true)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/webdoctor/saveAndSendSummary/${Number(passingData?.webconferenceId) || dataNoti?.idReq
        }?offSet=7&webIcd10=web`,
      headers: {
        'x-auth-token': token
      },
      data: body
    })
      .then(response => {
        DeviceEventEmitter.emit('reloadHistory')
        console.log('dataSendSucces: ', response.data)
        setLoading(false)
        setShowNoti(true)
        if (response?.data?.esito === '0') {
          setNoti({
            status: STATUS_NOTIFY.SUCCESS,
            content: 'Send consultation call successful'
          })
          setDialogSend(true)
        } else {
          setNoti({
            status: STATUS_NOTIFY.ERROR,
            content: 'Send consultation call failed'
          })
        }
      })
      .catch(error => {
        console.error('There was an error!', error)
        setLoading(false)
      })
  }

  const saveDraftSummary = () => {
    const body = {
      symptoms: [],
      drugs: listDrugTotal || [],
      visits: [],
      diseases: listDiseaseConvert || [],
      // onlyNew: [],
      isChanged: true,
      consult: subjective || '',
      objective: objective || '',
      summary: assessment || '',
      recommendations: plan || '',
      referral: referral || '',
      drug_country: 'US',
      times: 2,
      certificate: certificate
    }
    console.log('BODY: ', body)
    setLoading(true)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/webdoctor/saveDratfSummary/${Number(passingData?.webconferenceId) || dataNoti?.idReq
        }?offSet=7&webIcd10=web`,
      headers: {
        'x-auth-token': token
      },
      data: body
    })
      .then(response => {
        console.log('saveSummary: ', response?.data)
        setLoading(false)
        // setShowNoti(true)
        if (response?.data?.esito === '0') {
          setNoti({
            status: STATUS_NOTIFY.SUCCESS,
            content: Translate(languageRedux).POST_CALL_SUCCESSFUL
          })
        } else {
          setNoti({
            status: STATUS_NOTIFY.ERROR,
            content: Translate(languageRedux).POST_CALL_FAIL
          })
        }
        setDialogLater(true)
      })
      .catch(error => {
        console.error('There was an error!', error)
        setLoading(false)
      })
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        {renderSOAP()}
        {renderDocuments()}
        {renderOtherDoc()}
        {renderButton()}
      </View>
    )
  }

  const _onPressCancel = () => {
    setDialogSend(false)
    setDialogLater(false)
  }

  const _onPressHome = () => {
    NavigationService.navigate(Routes.DRAWER_NAVIGATION_DOCTOR)
  }

  const _onPresOK = () => {
    NavigationService.navigate(Routes.DRAWER_NAVIGATION_DOCTOR)
  }

  const _onPressHistory = () => {
    setLoading(true)
    setTimeout(() => {
      DeviceEventEmitter.emit(Routes.AGENDA_DOCTOR_VIEW, { history: true })
    }, 1000)
    setTimeout(() => {
      NavigationService.navigate(Routes.AGENDA_DOCTOR_VIEW)
    }, 300)

    NavigationService.navigateAndReset(Routes.DRAWER_NAVIGATION_DOCTOR)
  }

  const _onPressRecall = () => {
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
    if (patientId) {
      setLoading(true)
      console.log('Params: ', params)
      dispatch(apiPostSurveyDoctor(patientId, params)).then(res => {
        console.log('callAPISaveSurveyDoctor: ', res?.payload)
        if (res?.payload?.esito === '0' && res?.payload?.idSurvey) {
          Promise.all([
            callAPICallPatient(res?.payload?.idSurvey)
          ])
        } else {
          setLoading(false)
          // setDataNoti({
          //   status: STATUS_NOTIFY.ERROR,
          //   content: res?.payload?.motivo || 'error'
          // })
          // setTimeout(() => {
          //   setShowNoti(true)
          // }, 500)
        }

      }).catch(() => {
        setLoading(false)
      })
    }
  }

  // NavigationService.navigate(Routes.VIDEO_CALL_NAVIGATE, {
  //   data: res?.payload,
  //   dataSurvey: dataSurvey,
  //   idReq: dataNoti?.idReq
  // })

  const callAPICallPatient = (idSurvey) => {
    dispatch(apiGetCallPatient(idSurvey, patientId)).then(res => {
      console.log('res => ', res?.payload)
      setLoading(false)
      if (res?.payload?.esito === '0') {
        callAPIGetPatient(res?.payload)

        setTimeout(() => {
          NavigationService.navigateAndReset(Routes.DRAWER_NAVIGATION_DOCTOR)
        }, 1000)

        setTimeout(() => {
          NavigationService.navigate(Routes.VIDEO_CALL_NAVIGATE, {
            data: res?.payload,
            dataSurvey: idSurvey,
            idReq: res?.payload?.idReq,
            isJoin: true
          })
        }, 2500)
      } else {
        // setDataNoti({
        //   status: STATUS_NOTIFY.ERROR,
        //   content: res?.payload?.motivo || 'error'
        // })
        // setTimeout(() => {
        //   setShowNoti(true)
        // }, 500)
      }
    }).catch(() => {
      setLoading(false)
    })
  }

  const callAPIGetPatient = (data) => {
    dispatch(apiGetSurveyBOIdReq(data?.idReq)).then(res => {
      console.log('apiGetSurveyIdReq: ', res?.payload)
      Promise.all([
        dispatch(saveSurveyPatient(res?.payload))
      ])
      // callAPICategoryListByPatinet()
      if (res?.payload?.esito === '0') {
        setTimeout(() => {
          setLoading(false)
          // NavigationService.navigate(Routes.VIDEO_CALL_NAVIGATE, {
          //   data: data,
          //   dataSurvey: data?.idSurvey,
          //   idReq: data?.idReq,
          //   isJoin: true
          // })
        }, 1000)
      } else {
        setLoading(false)
      }
    }).catch(() => {
      setLoading(false)
    })
  }

  const callAPICategoryListByPatinet = () => {
    dispatch(apiGetCategoryListByPatinet(patientId)).then(res => {
      console.log('apiGetCategoryListByPatinet: ', res)
    })
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_close}
        onPressLeft={saveDraftSummary}
        textCenter={Translate(languageRedux).CONSULTATION_CALL}
        textRight={!passingRouteDoctor && Translate(languageRedux).RECALL}
        onPressRight={_onPressRecall}
        backgroundColorRight={!passingRouteDoctor && color3777EE}
        textRightColor={!passingRouteDoctor && colorFFFFFF}
      />
      <ScrollView>{renderBody()}</ScrollView>
      {
        isSymptom &&
        <Symptoms
          onPressCancel={() => { setSymptom(false) }}
          valueItem={listSymptom || []}
          setValueItem={setListSymptom}
        />
      }
      {
        isDisease &&
        <Disease
          onPressCancel={() => { setDisease(false) }}
          valueItem={listDisease || []}
          setValueItem={setListDisease}
        />
      }
      {
        isDrug &&
        <Drug
          onPressCancel={() => { setDrug(false) }}
          setValueItem={setListDrug}
          patientId={Number(passingData?.patientId)}
        />
      }
      {
        isDialogLater && (
          <DialogCustom
            title={Translate(languageRedux).QUESTION_POST_CALL_1}
            content={Translate(languageRedux).CONTENT_Q1_POST_CALL}
            txtlLeft={passingRouteHome ? Translate(languageRedux).BACK_BTN : Translate(languageRedux).HISTORY}
            onPressCancel={_onPressCancel}
            txtRight={Translate(languageRedux).homepage}
            onPressOK={_onPressHome}
            onPressLeft={_onPressHistory}
          />
        )
      }
      {
        isDialogSend && (
          <DialogCustom
            title={Translate(languageRedux).TITLE_POST_CALL_2}
            content={Translate(languageRedux).CONTENT_POST_CALL_2}
            txtlLeft={Translate(languageRedux).OK}
            onPressLeft={_onPresOK}
          />
        )
      }
      {isLoad && <LoadingView />}
      <NotificationView
        isShow={isShowNoti}
        setShow={() => setShowNoti(false)}
        status={noti?.status || STATUS_NOTIFY.ERROR}
        content={noti?.content || ''}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  ctnBody: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingBottom: 42
  },
  checkBox: {
    flexDirection: 'row',
    alignContent: 'center',
    marginBottom: 8
  },
  marginL8: {
    marginLeft: 8
  },
  ctnList: {
    marginTop: 16,
    marginLeft: 16
  },
  ctnItemSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14
  },
  marginT32: {
    marginTop: 32,
    marginBottom: 16
  },
  ctnCell: {
    padding: 16,
    backgroundColor: colorF8F8F8,
    borderRadius: 8,
    marginBottom: 12
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  txtTextInput: {
    height: 72
  },
  line: {
    borderWidth: 0.75,
    borderColor: colorDDDEE1,
    marginTop: 16
  },
  ctnButton: {
    marginTop: 31
  },
  distanceButton: {
    height: 8
  },
  ctnTitleCell: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  flex1: {
    flex: 1
  }
})
