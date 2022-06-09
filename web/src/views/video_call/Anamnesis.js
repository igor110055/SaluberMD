import React, { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, FlatList, ScrollView,
  DeviceEventEmitter
} from 'react-native'
import Header from '../../components/Header'
import icHeader from '../../../assets/images/header'
import { color040404, color363636, color3777EE, color5C5D5E, colorA7A8A9, colorE53E3E, colorFFFFFF } from '../../constants/colors'
import { customTxt } from '../../constants/css'
import Fonts from '../../constants/Fonts'
import Info from '../healthProfile/components/Info'
import { useDispatch, useSelector } from 'react-redux'
import NavigationService from '../../navigation'
import Routes from '../../navigation/Routes'
import ButtonOutline from './components/ButtonOutline'
import Translate from '../../translate'
import LoadingView from '../../components/LoadingView'
import NotificationView from '../../components/NotificationView'
import { STATUS_NOTIFY } from '../../components/NotificationView'
import axios from 'axios'
// import * as APIs from '../../api/APIs'
import _ from 'lodash'
import { convertYYYYMMDD } from '../../constants/DateHelpers'

const TYPE_HEALTH = {
  CHRONIC_DISEASE: 'CHRONIC_DISEASE',
  ALLERGY: 'ALLERGY',
  MEDICATION: 'MEDICATION'
}

export default function Anamnesis({ route }) {
  const passingData = route?.params?.data
  const chronic_disease = []//useSelector(state => state.user.chronic_disease)
  const allergies = []//useSelector(state => state.user.allergies)
  const medications = []//useSelector(state => state.user.medications)
  const token = ''//useSelector(state => state.user.token)
  const languageRedux = 'en_US'//useSelector(state => state.common.language)
  const [isLoading, setLoading] = useState(false)
  const [errCallBack, setErrCallBack] = useState()
  const [isShowNoti, setShowNoti] = useState(false)
  const [survey, setSurvey] = useState()
  const dataDoc = route?.params?.dataDoc
  const viewType = route?.params?.viewType
  const nameChild = route?.params?.nameChild
  const birthdayChild = route?.params?.birthdayChild
  const talkAbout = route?.params?.talkAbout

  useEffect(() => {
    callAPIGetSurvey()
  }, [])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.ANAMNESIS_SCREEN, params => {
      console.log(params)
      setShowNoti(true)
      setErrCallBack({
        esito: 4
      })
    })

    return () => subscription.remove()
  }, [])

  const getSubTitle = (type) => {
    const arr = () => {
      switch (type) {
        case TYPE_HEALTH.CHRONIC_DISEASE:
          return chronic_disease
        case TYPE_HEALTH.ALLERGY:
          return allergies
        case TYPE_HEALTH.MEDICATION:
          return medications
        default:
          return []
      }
    }
    const checkUndefined = typeof arr()?.isSubmit === 'undefined'

    var nameSub = (arr()?.datas || []).map((val, index) => {
      if ((val.id === '1') || (val.id === 1)) {
        const getNameOther = (val?.other || '') + ((index === (arr()?.datas || []).length - 1) ? '' : ', ')
        return getNameOther
      }
      if (val.id === 47) {
        const getNameAccident = (val?.otherAccident || '') + ((index === (arr()?.datas || []).length - 1) ? '' : ', ')
        return getNameAccident
      }
      if (val.id === 48) {
        const getNameCancer = (val?.otherCancer || '') + ((index === (arr()?.datas || []).length - 1) ? '' : ', ')
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
        default:
          return ''
      }
    }

    const checkNameSub = nameSub.length > 0 ? nameSub : noNameSub()

    return checkUndefined ? (
      <View>
        <Text style={customTxt(Fonts.Regular, 12, colorE53E3E).txt}>
          {Translate(languageRedux).NOT_COMPLIED}
        </Text>
      </View>
    ) : (
      checkNameSub
    )

  }

  const dataRecom = [
    {
      id: 0,
      title: Translate(languageRedux).CHRONIC_DISEASE,
      subTitleColor: (typeof chronic_disease?.isSubmit !== 'undefined') ? color3777EE : colorA7A8A9,
      subtitle: getSubTitle(TYPE_HEALTH.CHRONIC_DISEASE),
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16
    },
    {
      id: 1,
      title: Translate(languageRedux).allergie,
      subTitleColor: (typeof allergies?.isSubmit === 'undefined') ? colorA7A8A9 : color3777EE,
      subtitle: getSubTitle(TYPE_HEALTH.ALLERGY)
    },
    {
      id: 2,
      title: Translate(languageRedux).farmaco,
      subTitleColor: (typeof medications?.isSubmit !== 'undefined') ? color3777EE : colorA7A8A9,
      subtitle: getSubTitle(TYPE_HEALTH.MEDICATION),
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16
    }
  ]

  const renderItem = ({ item }) => {
    const _onPressItem = () => {
      switch (item?.title) {
        case dataRecom[0].title:
          return NavigationService.navigate(Routes.CHRONIC_DISEASE_SCREEN)
        case dataRecom[1].title:
          return NavigationService.navigate(Routes.MEDICAL_RECORD_SCREEN)
        case dataRecom[2].title:
          return NavigationService.navigate(Routes.MEDICATION_SCREEN)
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
          borderTopLeftRadius={item.borderTopLeftRadius}
          borderTopRightRadius={item.borderTopRightRadius}
        />
      </View>
    )
  }

  const recomInfo = () => {
    return (
      <View>
        <FlatList
          data={dataRecom}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      </View>
    )
  }

  const renderHealthProfile = () => {
    return (
      <View>
        <View style={styles.ctnTitle}>
          <Text style={customTxt(Fonts.SemiBold, 18, color040404).txt}>
            {Translate(languageRedux).TITLE_ANAMNESIS}</Text>
        </View>
        <View style={styles.ctnTextPlease}>
          <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
            {Translate(languageRedux).PLEASE_CONFIRM_HEALTH_PROFILE}</Text>
        </View>
        <View style={styles.ctnInfo}>
          {recomInfo()}
        </View>
      </View>
    )
  }

  const renderDocument = () => {
    return (
      <View>
        <View style={styles.ctnRecomDoc}>
          <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>{Translate(languageRedux).RECOMMENDED_DOCUMENTS}</Text>
        </View>
        <View style={styles.ctnTextPlease}>
          <Text style={customTxt(Fonts.Regular, 16, color5C5D5E).txt}>
            {Translate(languageRedux).DESCRIPTION_RECOMMENDED_DOCUMENTS}
          </Text>
        </View>
        <View style={styles.ctnButton}>
          <ButtonOutline
            text={Translate(languageRedux).UPLOAD_DOCUMENT}
            onPress={() => { NavigationService.navigate(Routes.DOCUMENT_LIST_SCREEN) }}
          />
        </View>
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View>
        {renderHealthProfile()}
        {renderDocument()}
      </View>
    )
  }

  const checkErr = (data) => {
    if (_.includes([2, 3, '2', '3'], (data || errCallBack?.esito))) {
      return true
    }
    return false
  }

  const callAPIGetSurvey = async () => {
    var params = {
      'idQuestionario': -1,
      'idMedico': -1,
      'medications': [
        {
          'id': '1',
          'nameCurrentValue': 'Other',
          'genericName': 'Drug name',
          'dosage': '100ml',
          'medicationId': '13133'
        }
      ],
      'allergies': [
        {
          'id': '25',
          'nameCurrentValue': 'Analgesic',
          'other': null,
          'allergyId': '1577'
        }
      ],
      'diseases': [
        {
          'id': '47863',
          'nameCurrentValue': 'Freckles',
          'other': null,
          'diseaseId': '4316'
        }
      ],
      'complaints': [],
      'files': [],
      'answer1': 'Me',
      'answer2': talkAbout,
      'auth': 'true',
      'slotId' : passingData?.id
    }

    if (nameChild) {
      params = {
        ...params,
        childname: nameChild,
        childbirthdate: `${convertYYYYMMDD(birthdayChild)}T17:00:00.000Z`
      }
    }

    console.log('paramsss:', params)

    // await axios.post(
    //   `${APIs.hostAPI}backoffice/webdoctor/saveSurvey`,
    //   JSON.stringify(params), {
    //   headers: {
    //     'content-type': 'application/json',
    //     'x-auth-token': token
    //   }
    // }).then(res => {
    //   console.log('saveSurvey Res :', res?.data)
    //   setSurvey(res?.data?.idSurvey || '')
    // }).catch(err => {
    //   console.log('Err:', err)
    // })
  }

  const callAPIChiamadottore = () => {
    if (passingData?.id) {
      setLoading(true)
      // axios({
      //   method: 'get',
      //   url: `${APIs.hostAPI}backoffice/chiamadottore/${passingData?.id}`,
      //   headers: {
      //     'content-type': 'application/json',
      //     'x-auth-token': token
      //   }
      // }).then(res => {
      //   console.log('res: ' ,res)
      //   setLoading(false)
      //   setErrCallBack(res?.data)
      //   if (checkErr(res?.data?.esito)) {
      //     setShowNoti(true)
      //     return
      //   }
      //   const slots = res?.data?.slot || []
      //   if (slots.length > 0) {
      //     NavigationService.navigate(Routes.VIDEOS_CALL_SCREEN, {
      //       data: slots[0],
      //       survey: survey
      //     })
      //   }
      // }).catch(err => {
      //   console.log('Err: ', err)
      //   setLoading(false)
      // })
    }
  }

  const _onPressRighttNavi = () => {
    if (viewType === Routes.ANAMNESIS_SCREEN) {
      return NavigationService.navigate(Routes.VIDEOS_CALL_SCREEN, {
        data: dataDoc,
        survey: survey
      })
    }
    callAPIChiamadottore()
  }

  const getContentNoti = () => {
    if (_.isEmpty(errCallBack)) {return ''}
    if (_.includes(['2', 2], errCallBack?.esito)) {
      return Translate(languageRedux).timecallerr
    } else if (_.includes(['3', 3], errCallBack?.esito)) {
      return Translate(languageRedux).timecallerr1
    } else if (errCallBack?.esito === 4) {
      return Translate(languageRedux).MSG_NO_DOCTORS_FOUND
    }
    return ''
  }

  return (
    <View style={styles.container}>
      <Header
        textCenter={Translate(languageRedux).videocall}
        iconLeft={icHeader.ic_close}
        textRight={Translate(languageRedux).CONFIRM}
        textRightColor={color3777EE}
        onPressRight={_onPressRighttNavi}
        onPressLeft={() => NavigationService.goBack()}
      />
      <ScrollView>{renderBody()}</ScrollView>
      {isLoading && <LoadingView />}
      <NotificationView
        isShow={isShowNoti}
        status={STATUS_NOTIFY.ERROR}
        content={getContentNoti()}
        setShow={(val) => {
          setShowNoti(val)
          setErrCallBack()
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  ctnTitle: {
    marginTop: 20,
    marginBottom: 8,
    marginHorizontal: 20
  },
  ctnTextPlease: {
    marginHorizontal: 20
  },
  ctnInfo: {
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
  ctnRecomDoc: {
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 20
  },
  ctnButton: {
    marginTop: 16,
    marginBottom: 42,
    marginHorizontal: 20
  }
})

