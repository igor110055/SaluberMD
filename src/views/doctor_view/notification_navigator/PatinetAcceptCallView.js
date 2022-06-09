import React, { useState, useEffect } from 'react'
import {
  StyleSheet, View, Text, Image, TouchableOpacity,
  ScrollView, Platform
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { color040404, color3777EE, color5C5D5E, colorDDDEE1, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import NavigationService from 'navigation'
import Translate from 'translate'
import { apiGetCallInfo, apiGetNotificationCheck, apiPostAcceptCall } from './apis'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
import Routes from 'navigation/Routes'
import imgVideocall from '../../../../assets/images/video_call'
import LoadingView from 'components/LoadingView'
import DeviceInfo from 'react-native-device-info'
import { apiGetHasEprescribing, apiPostEndCall, apiPostSendPosition } from 'api/VideoCall'
import Geolocation from '@react-native-community/geolocation'
import { apiGetVirtualOffice } from 'api/Auth'
import SoundPlayer from 'react-native-sound-player'

export default function PatinetAcceptCallView({ route }) {
  const passingData = route?.params?.notification || ''
  const [dataNoti, setDataNotiPassing] = useState()
  const dispatch = useDispatch()
  const languageRedux = useSelector(state => state.common.language)
  const [doctor, setDoctor] = useState()
  const [isLoading, setLoading] = useState(true)
  const [isShowNoti, setShowNoti] = useState()
  const [dataNotiView, setDataNoti] = useState()
  const [imgAvt, setImgAvt] = useState()

  useEffect(() => {
    console.log('notificaiton: ', dataNoti)
    console.log('idReq: ', dataNoti?.idReq)
    getDataNotiPassing()
  }, [])

  useEffect(() => {
    if (dataNoti?.idReq) {
      callAPINotificationCheck()
      callAPI()
    }
  }, [dataNoti])

  const getDataNotiPassing = async () => {
    try {
      const getDataPassing = await JSON.parse(JSON.parse(JSON.stringify(passingData)))
      setDataNotiPassing(getDataPassing)
    } catch (error) { }
  }

  const callAPI = () => {
    dispatch(apiGetHasEprescribing())
    callAPIPosition()

    dispatch(apiGetCallInfo(dataNoti?.idReq)).then(res => {
      console.log('apiGetSurveyIdReq: ', res?.payload)
      setLoading(false)
      if (res?.payload?.esito === '0') {
        setDoctor(res?.payload?.data)
        callAPIGetAvatarDoc(res?.payload?.data?.userId)
      } else {
        NavigationService.navigateAndReset(Routes.DRAWER_NAVIGATION)
      }
    }).catch(() => {
      setLoading(false)
    })
  }

  const callAPIPosition = () => {
    Geolocation.getCurrentPosition(info => {
      console.log('info: ', info)
      const params = {
        accuracy: info?.coords?.accuracy,
        latitude: info?.coords?.latitude,
        longitude: info?.coords?.longitude
      }
      dispatch(apiPostSendPosition(params)).then(res => {
        console.log('res: ', res?.payload)
      })
    })
  }

  const callAPIGetAvatarDoc = (userId) => {
    dispatch(apiGetVirtualOffice(userId)).then(res => {
      console.log('res: ', res?.payload)
      if (res?.payload?.virtualoffice?.image) {
        setImgAvt(res?.payload?.virtualoffice?.image)
      }
    })
  }

  const callAPINotificationCheck = async () => {
    var manufacturer = ''
    DeviceInfo.getManufacturer().then(res => {
      manufacturer = res
    })
    var serial = ''
    DeviceInfo.getSerialNumber().then(res => {
      serial = res
    })
    const udidv4 = await DeviceInfo.getUniqueId()
    const params = {
      deviceInfo: {
        available: true,
        cordova: '9.1.0',
        isVirtual: false,
        manufacturer: manufacturer,
        model: DeviceInfo.getModel(),
        platform: Platform.OS,
        serial: serial,
        uuid: udidv4,
        version: DeviceInfo.getVersion()
      },
      notification: passingData
    }
    console.log('param: ', params)
    dispatch(apiGetNotificationCheck(params)).then(res => {
      console.log('apiGetCategoryListByPatinet: ', res)
    })
  }

  const onPressEndCall = () => {
    SoundPlayer.stop()
    const onPressHome = () => {
      NavigationService.navigateAndReset(Routes.DRAWER_NAVIGATION)
    }
    if (dataNoti?.idReq) {
      dispatch(apiPostEndCall(dataNoti?.idReq)).then(res => {
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
    } else {
      setLoading(false)
    }
  }

  const onPressAcceptCall = () => {
    SoundPlayer.stop()
    if (dataNoti?.idReq) {
      dispatch(apiPostAcceptCall(dataNoti?.idReq)).then(res => {
        if (res?.payload?.esito === '0') {
          NavigationService.navigate(Routes.PATINET_VIDEO_CALL_SCREEN, {
            data: res?.payload,
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
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }

  const renderImgLoader = () => {
    return (
      <View style={styles.ctnImgLoader}>
        <Image source={imgAvt ? { uri: imgAvt } : imgVideocall.img_loader} style={styles.imgLoader} />
        <Text
          style={[customTxt(Fonts.Bold, 18, color3777EE).txt, styles.marginT8]}>
          {doctor?.name || ''}
        </Text>
      </View>
    )
  }

  const renderCell = (title, text) => {
    return (
      <View style={styles.ctnCell}>
        <View style={styles.textStyle}>
          <Text style={customTxt(Fonts.Regular, 14, color5C5D5E).txt}>{title}</Text>
          <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginT4]}>{text}</Text>
        </View>
      </View>
    )
  }

  const renderSummary = () => {
    var specStr = ''
    const getLsSpec = (doctor?.specialization || []).map((val, index) => {
      specStr += `${val?.name} ${(doctor?.specialization || []).length === (index + 2) ? ' and ' : ((doctor?.specialization || []).length === (index + 1) ? '.' : ', ')}`
      return `${val?.name} ${(doctor?.specialization || []).length === (index + 2) ? ' and ' : ((doctor?.specialization || []).length === (index + 1) ? '.' : ', ')}`
    })
    console.log('getlsspec2: ', getLsSpec)
    return (
      <View style={styles.ctnSummary}>
        <View style={styles.centerTitleView}>
          <Text style={[customTxt(Fonts.Bold, 16, color040404).txt]}>
            {Translate(languageRedux).DOCTOR_SUMMARY}
          </Text>
        </View>
        {renderCell(
          Translate(languageRedux).SPECIALTY,
          specStr,
        )}
        {renderCell(
          Translate(languageRedux).PRACTICE_LENGTH,
          doctor?.lengthPractice
        )}
        {renderCell(
          Translate(languageRedux).M_SCHOOL,
          doctor?.school
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
      </ScrollView>
      {renderButton()}
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
    justifyContent: 'space-between'
  },
  imgLoader: {
    height: 180,
    width: 180,
    borderRadius: 90,
    overflow: 'hidden'
  },
  ctnImgLoader: {
    alignItems: 'center',
    marginTop: 40,
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
