import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { apiGetHasEprescribing } from 'api/VideoCall'
import { color040404, color3777EE, color5C5D5E, colorDDDEE1, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import NavigationService from 'navigation'
import Translate from 'translate'
import { apiGetCategoryListByPatinet, apiGetSurveyIdReq, apiPostAcceptCall, apiPostDecline } from './apis'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
import Routes from 'navigation/Routes'
import { convertDMMMYYYY } from 'constants/DateHelpers'
import SoundPlayer from 'react-native-sound-player'
import imgVideocall from '../../../../assets/images/video_call'

import LoadingView from 'components/LoadingView'
import { saveDataNoti, saveSurveyPatient } from 'actions/common'

export default function NotificationNavigator({ route }) {
  const passingData = route?.params?.notification || ''
  const [dataNoti, setDataNotiPassing] = useState()
  const dispatch = useDispatch()
  const languageRedux = useSelector(state => state.common.language)
  const [dataSurvey, setSurvey] = useState()
  const [isLoading, setLoading] = useState(true)
  const [isShowNoti, setShowNoti] = useState()
  const [dataNotiView, setDataNoti] = useState()
  const [imgAvt, setImgAvt] = useState()

  useEffect(() => {
    getDataNotiPassing()
  }, [])

  useEffect(() => {
    if (dataNoti?.idReq) {
      console.log('datanoti: ', dataNoti)
      Promise.all([
        dispatch(saveDataNoti(dataNoti))
      ])
      callAPI()
    }
  }, [dataNoti])

  const getDataNotiPassing = async () => {
    try {
      const getData = await JSON.parse(JSON.parse(JSON.stringify(passingData)))
      setDataNotiPassing(getData)
    } catch (error) { }
  }

  const callAPI = () => {
    dispatch(apiGetHasEprescribing())
    dispatch(apiGetSurveyIdReq(dataNoti?.idReq)).then(res => {
      console.log('apiGetSurveyIdReq: ', res?.payload)
      Promise.all([
        dispatch(saveSurveyPatient(res?.payload))
      ])
      setSurvey(res?.payload)
      if (res?.payload?.user?.userImage) {
        var base64 = `data:image/png;base64,${res?.payload?.user?.userImage}`
        setImgAvt({ uri: base64 })
      }
      setLoading(false)
      if (res?.payload?.user?.id) {
        callAPICategoryListByPatinet(res?.payload?.user?.id)
      }
    }).catch(() => {
      setLoading(false)
    })
  }

  const callAPICategoryListByPatinet = (id) => {
    dispatch(apiGetCategoryListByPatinet(id)).then(res => {
      console.log('apiGetCategoryListByPatinet: ', res)
    })
  }

  const onPressEndCall = () => {
    SoundPlayer.stop()
    const onPressHome = () => {
      NavigationService.navigateAndReset(Routes.DRAWER_NAVIGATION_DOCTOR)
    }
    if (dataNoti?.idReq) {
      dispatch(apiPostDecline(dataNoti?.idReq)).then(res => {
        if (res?.payload?.esito === '0') {
          setTimeout(() => {
            onPressHome()
          }, 1000)
        } else {
          setLoading(false)
          setDataNoti({
            status: STATUS_NOTIFY.ERROR,
            content: res?.payload?.motivo || 'error'
          })
          setTimeout(() => {
            setShowNoti(true)
            console.log('data: ', dataNoti)
          }, 500)

          setTimeout(() => {
            onPressHome()
          }, 4000)
        }
      }).catch(() => {
        setTimeout(() => {
          onPressHome()
        }, 1000)
      })
    }
  }

  const onPressAcceptCall = () => {
    SoundPlayer.stop()

    console.log('dataNoti?.idReq: ', dataNoti)
    if (dataNoti?.idReq) {
      dispatch(apiPostAcceptCall(dataNoti?.idReq)).then(res => {
        if (res?.payload?.esito === '0') {
          NavigationService.navigate(Routes.VIDEO_CALL_NAVIGATE, {
            data: res?.payload,
            dataSurvey: dataSurvey,
            idReq: dataNoti?.idReq
          })
        } else {
          setLoading(false)
          setDataNoti({
            status: STATUS_NOTIFY.ERROR,
            content: res?.payload?.motivo || 'error'
          })
          setTimeout(() => {
            setShowNoti(true)
            console.log('data: ', dataNoti)
          }, 500)
        }
      }).catch(() => {

      })
    }
  }

  const renderImgLoader = () => {
    return (
      <View style={styles.ctnImgLoader}>
        <Image source={imgAvt ? imgAvt : imgVideocall.img_loader} style={styles.imgLoader} />
        <Text
          style={[customTxt(Fonts.Bold, 18, color3777EE).txt, styles.marginT8]}>
          {dataSurvey?.user?.nome || ''} {dataSurvey?.user?.cognome || ''}
        </Text>
      </View>
    )
  }

  const renderCell = (title, text, icon) => {
    return (
      <View style={styles.ctnCell}>
        {/* <Image source={icon} style={styles.iconStyle} /> */}
        <View style={styles.textStyle}>
          <Text style={customTxt(Fonts.Regular, 14, color5C5D5E).txt}>{title}</Text>
          <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginT4]}>{text}</Text>
        </View>
      </View>
    )
  }

  const doctorFee = dataSurvey?.survey?.doctorFee

  const renderSummary = () => {
    return (
      <View style={styles.ctnSummary}>
        <View style={styles.centerTitleView}>
          <Text style={[customTxt(Fonts.Bold, 16, color040404).txt]}>
            {Translate(languageRedux).PATIENT_SUMMARY}
          </Text>
        </View>
        {renderCell(
          Translate(languageRedux).PATIENT,
          dataSurvey?.survey?.subject || '',
        )}
        {renderCell(
          Translate(languageRedux).name_member,
          dataSurvey?.survey?.name || '',
        )}
        {renderCell(
          Translate(languageRedux).birthday_member,
          convertDMMMYYYY(dataSurvey?.survey?.childbirthdate) || '',
        )}
        {renderCell(
          Translate(languageRedux).SPECIALTY,
          dataSurvey?.survey?.specialtyName === null
            ? Translate(languageRedux).direct_call
            : dataSurvey?.survey?.specialtyName || '',
        )}
        {renderCell(
          Translate(languageRedux).DURATION_AND_PRICE,
          doctorFee?.timeslot +
          ' ' +
          Translate(languageRedux).minutes +
          ' - ' +
          doctorFee?.fee +
          ' ' +
          doctorFee?.currency,
        )}
      </View>
    )
  }

  const renderButton = () => {
    return (
      <View style={styles.btCallView}>
        <TouchableOpacity onPress={onPressEndCall}>
          <Image source={imgVideocall.ic_button_cancel_call} style={styles.buttonStyle} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressAcceptCall}>
          <Image source={imgVideocall.ic_button_accept_call} style={styles.buttonStyle} />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {renderImgLoader()}
        {renderSummary()}
        {renderButton()}
      </ScrollView>
      {
        isLoading && <LoadingView />
      }
      <NotificationView
        isShow={isShowNoti}
        setShow={() => setShowNoti(false)}
        status={dataNotiView?.status || STATUS_NOTIFY.ERROR}
        content={dataNotiView?.content || ''}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF,
    paddingLeft: 20,
    paddingRight: 20
  },
  centerTitleView: {
    alignItems: 'center',
    marginBottom: 16
  },
  btCallView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50
  },
  imgLoader: {
    height: 180,
    width: 180,
    borderRadius: 90
  },
  ctnImgLoader: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24
  },
  ctnSummary: {
    borderWidth: 1,
    borderColor: colorDDDEE1,
    borderRadius: 16,
    padding: 16,
    paddingBottom: 0
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  ctnCell: {
    flexDirection: 'row',
    marginBottom: 16
  },
  textStyle: {
    marginLeft: 8
  },
  marginT4: {
    marginTop: 4
  },
  buttonStyle: {
    height: 140,
    width: 140
  },
  marginT8: {
    marginTop: 8
  }
})
