import React, { useState, useEffect } from 'react'
import {
  StyleSheet, View, Text, StatusBar, FlatList,
  TouchableOpacity, RefreshControl
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import {
  apiGetCheckConnection, apiGetHasEprescribing, apiGetIsSubmember,
  apiGetOnlineDoctors, apiPostCheckBMP
} from '../../../api/VideoCall'
import Header from '../../../components/Header'
import { color0B40B1, colorFFFFFF } from '../../../constants/colors'
import NavigationService from '../../../navigation'
import * as axios from 'axios'
import { border, customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'
import Routes from '../../../navigation/Routes'
import LoadingView from '../../../components/LoadingView'
import imgVideoCall from '../../../../assets/images/video_call'
import * as APIs from '../../../api/APIs'
import Translate from '../../../translate'
import NoDataView from '../../../components/NoDataView'

export default function VideoCall() {
  const dispatch = useDispatch()
  const [survey, setSurvey] = useState()
  const token = useSelector(state => state.user.token)
  const [doctors, setDoctors] = useState([])
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)
  const [isLoading, setLoading] = useState(true)
  const languageRedux = useSelector(state => state.common.language)
  const allergiesRedux = useSelector(state => state.common.dataAllergy)
  const medicationRedux = useSelector(state => state.common.dataMedi)
  const diseasesRedux = useSelector(state => state.common.dataDisease)

  useEffect(() => {
    callAPICheckConnect()
    callAPIIsSummerber()
    callAPICheckBMP()
    callAPIGetSurvey()
    callAPIHasHasEprescribing()
    callAPILSOnlineDoctors()
  }, [])

  useEffect(() => {
    callAPILSOnlineDoctors()
  }, [toggleReload])

  const callAPICheckConnect = () => {
    dispatch(apiGetCheckConnection()).then(res => {
    }).catch(() => { })
  }

  const callAPIIsSummerber = () => {
    dispatch(apiGetIsSubmember()).then(res => {
    }).catch(err => {
      console.log('err: ', err)
    })
  }

  const callAPICheckBMP = () => {
    var param = {
      textForCheck: 'BMP'
    }
    dispatch(apiPostCheckBMP(param)).then(res => {
      console.log('res => ', res)
    }).catch(() => { })
  }

  const callAPILSOnlineDoctors = () => {
    dispatch(apiGetOnlineDoctors('1')).then(res => {
      // console.log('Res: ', res)
      setDoctors(res?.payload?.medici || [])
      setRefresh(false)
    }).catch(err => {
      console.log('err: ', err)
    })
  }

  const callAPIGetSurvey = async () => {
    const params = {
      'idQuestionario': -1,
      'idMedico': -1,
      'medications': (medicationRedux || []).map(val => {
        return {
          'id': val?.id,
          'nameCurrentValue': val?.other,
          'genericName': val?.genericName,
          'dosage': val?.dosage,
          'medicationId': val?.medicineId
        }
      }),
      'allergies': (allergiesRedux || []).map(val => {
        return {
          'id': val?.id,
          'nameCurrentValue': val?.genericName,
          'other': val?.other || null,
          'allergyId': val?.allergyId
        }
      }),
      'diseases': (diseasesRedux || []).map(val => {
        return {
          'id': val?.id,
          'nameCurrentValue': val?.name,
          'other': val?.other || null,
          'diseaseId': val?.diseaseId
        }
      }),
      'complaints': [],
      'files': [],
      'answer1': 'Me',
      'answer2': 'Talk',
      'auth': 'true'
    }
    console.log('paramsss:', params)

    await axios.post(
      `${APIs.hostAPI}backoffice/webdoctor/saveSurvey`,
      JSON.stringify(params), {
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    }).then(res => {
      console.log('saveSurvey Res :', res?.data)
      setSurvey(res?.data?.idSurvey || '')
    }).catch(err => {
      console.log('Err:', err)
    })
  }

  const callAPIHasHasEprescribing = () => {
    dispatch(apiGetHasEprescribing()).then(res => {
      // console.log('res: ', res)
      setLoading(false)
    }).catch(err => {
      console.log('Err: ', err)
      setLoading(false)
    })
  }

  const _onPressItem = (item) => {
    // NavigationService.navigate(Routes.VIDEOS_CALL_SCREEN, {
    //   data: item,
    //   survey: survey
    // })
    NavigationService.navigate(Routes.ANAMNESIS_SCREEN, {
      dataDoc: item,
      survey: survey,
      viewType: Routes.ANAMNESIS_SCREEN
    })
  }

  const renderItemDoctor = (item) => {
    const getListSpecialization = item?.specialization || []
    const getNameSpecialization = getListSpecialization.map((val, index) => {
      if (index === getListSpecialization.length - 1) {
        return `${val}`
      }
      return `${val}, `
    })
    const getCurrency = `${item?.valuePricing || '0.00'} ${item?.currency || '$'} - ${item?.timeslot || 0} ${Translate(languageRedux).minutes}`

    return (
      <TouchableOpacity
        onPress={() => _onPressItem(item)}
        style={[styles.itemStyle, border().borderB]}>
        <Text style={
          customTxt(Fonts.SemiBold, 16).txt
        }>{'\t'}{item?.name || ''}</Text>
        <Text style={
          customTxt(Fonts.Medium, 14).txt
        }>{getNameSpecialization}</Text>
        <Text>{getCurrency}</Text>
      </TouchableOpacity>
    )
  }

  const _onRefresh = () => {
    setRefresh(true)
    setToggleReload(Math.random())
  }

  const renderLsDoctor = () => {
    return (
      <FlatList
        data={doctors}
        extraData={doctors}
        keyExtractor={(itam, index) => index.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={_onRefresh}
            tintColor={color0B40B1}
          />
        }
        renderItem={({ item }) =>
          <>
            {renderItemDoctor(item)}
          </>
        }
      />
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white"/>
      <Header
        textCenter={Translate(languageRedux).seeaprovider}
        backgroundColor={colorFFFFFF}
        iconLeft={imgVideoCall.ic_left}
        onPressLeft={() => NavigationService.goBack()}
      />
      {(doctors || []).length === 0 ? <NoDataView/> : null}
      {renderLsDoctor()}
      {isLoading && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemStyle: {
    margin: 20,
    padding: 20,
    marginBottom: 0,
    paddingBottom: 20,
    backgroundColor: colorFFFFFF,
    borderRadius: 10
  }
})
