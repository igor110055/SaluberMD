import React, { useState, useEffect, useRef } from 'react'
import {
  StyleSheet, View, Dimensions, Image,
  AppState, TouchableOpacity
} from 'react-native'
import Header from '../../../components/Header'
import { color2C64CD, color3777EE, colorFFFFFF } from '../../../constants/colors'
import imgDirectCall from '../../../../assets/images/direct_call'
import { useDispatch, useSelector } from 'react-redux'
import { WaveIndicator } from 'react-native-indicators'
import { convertToUTC } from 'constants/DateHelpers'
import axios from 'axios'
import * as APIs from '../../../api/APIs'
import { apiCallDoctor, apiGetCheckStatusCall } from 'api/VideoCall'
import { OTSession, OTPublisher, OTSubscriber } from 'opentok-react-native'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import imgVideoCall from '../../../../assets/images/video_call'
import LoadingView from 'components/LoadingView'
import PopupChatVideoCallView from 'components/PopupChatVideoCallView'
import { saveChat } from 'actions/user'
import _ from 'lodash'

export default function PatinetVideoCallView({ route }) {
  const token = useSelector(state => state.user.token)
  const idReq = route?.params?.idReq
  const dispatch = useDispatch()
  const [resCallDoc, setResCallDoc] = useState(route?.params?.data)
  const [isActiveDoctor, setActiveDoctor] = useState(true)
  const otSessionRef = useRef(OTSession)
  const [isConnectSession, setConnectSession] = useState(true)
  const [isShowMorAction, setShowMoreAction] = useState(true)
  const [refresh, setRefresh] = useState(1)
  const [isLoading, setLoading] = useState(false)
  const [isVoice, setVoice] = useState(true)
  const [isCamera, setCamera] = useState(true)
  const [isFrontCamera, setFrontCamera] = useState(true)
  const [isChangeScreem] = useState(true)//setChangeScreen
  const [isWaitCall, setWaitCall] = useState(false)

  const [isChat, setChat] = useState(false)
  const [reloadStatus, setReloadStatus] = useState()
  const getDataPassing = route?.params?.data
  const userinfo = useSelector(state => state.user.userinfo)

  useEffect(() => {
    console.log('getDataPassing: ', getDataPassing)
  }, [])

  useEffect(() => {
    AppState.addEventListener('change', _handlerChange)
    return () => AppState.removeEventListener('change', _handlerChange)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (isActiveDoctor === false) {
        callAPIEndCall()
      }
    }, 1000 * 150)
    return () => {
      if (otSessionRef?.current) {
        otSessionRef?.current?.disconnectSession()
      }
    }
  }, [])

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setShowMoreAction(false)
    }, 10000)

    return () => clearTimeout(timeOut)
  }, [refresh])

  const _handlerChange = (state) => {
    if (state === 'active') {
      console.log('active appp')
      if (resCallDoc?.sessionId && resCallDoc?.token) {
        connectSession(resCallDoc?.token, resCallDoc?.sessionId)
      }
    } else {
      console.log('bg app appp')
    }
  }

  const _onPressPreviewNavi = () => {
    callAPIEndCall()

    setTimeout(() => {
      NavigationService.navigateAndReset(Routes.DRAWER_NAVIGATION)
    }, 2000)
  }

  const connectSession = (tokenSession, session) => {
    axios({
      method: 'get',
      url: `https://api-standard.opentok.com/session/${session}?extended=true`,
      headers: {
        'content-type': 'application/json',
        'X-OPENTOK-AUTH': tokenSession
      }
    }).then(res => {
      console.log('connectSession: ', res)
    }).catch(err => {
      console.log('connect err :', err)
    })
  }

  const callAPIEndCall = () => {
    dispatch(saveChat([]))
    if (idReq) {
      axios({
        method: 'post',
        url: `${APIs.hostAPI}backoffice/videocall/endCall/${idReq}`,
        headers: {
          'content-type': 'application/json',
          'x-auth-token': token
        }
      }).then(res => {
        console.log('APIEndCall: ', res)
        // setLoading(false)
      }).catch(err => {
        setLoading(false)
        console.log('connect err :', err)
      })
    }
  }

  const _onPressEndcall = () => {
    setLoading(true)
    callAPIEndCall()
    setTimeout(() => {
      setResCallDoc()
    }, 300)
    setTimeout(() => {
      setLoading(false)
      NavigationService.navigate(Routes.STAR_RATING_SCREEN)
    }, 1000 * 40)
  }

  useEffect(() => {
    setTimeout(() => {
      callAPICheckConnect()
      setReloadStatus(Math.random())
    }, 1000)
  }, [reloadStatus])


  const callAPICheckConnect = () => {
    if (idReq) {
      dispatch(apiGetCheckStatusCall(idReq)).then(res => {
        console.log('res: ', res)
        setTimeout(() => {
          if (res?.payload?.status === '0') {
            setActiveDoctor(false)
          }
        }, 1000 * (150))
        if (res?.payload?.status === '1') {
          setActiveDoctor(true)
        }
        if (res?.payload?.status === '2') {
          setActiveDoctor(false)
          apiGetDoctorTranferId()
        }
      }).catch(() => {
        console.log('Err: callAPICheckConnect')
      })
    }
  }

  var lsMsg = []

  useEffect(() => {
    otSessionRef?.current?.sessionHelper?.session?.on('signal', (event) => {
      console.log('i got', event)
    })
  }, [])

  const sessionEventHandlers = {
    connectionCreated: (event) => {
      console.log('connectionCreated!', event)
      setConnectSession(true)
      setWaitCall(false)
    },
    streamCreated: (event) => {
      console.log('streamCreated!', event)
    },
    connectionDestroyed: (event) => {
      console.log('connectionDestroyed!', event)
      _onPressEndcall()
    },
    signal: (event) => {
      if (event?.data) {
        const copyDataRedux = _.cloneDeep(lsMsg)
        var newData = [
          ...copyDataRedux,
          {
            data: event?.data || '',
            auth: event?.type,
            time: convertToUTC(new Date()),
            type: event?.type
          }
        ]
        console.log('Ls data : ', newData)
        lsMsg = newData
        dispatch(saveChat(lsMsg || []))
      }
    }
  }

  const apiGetDoctorTranferId = () => {
    setResCallDoc()
    callAPIEndCall()
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/videocall/getDoctorTranferId/${resCallDoc?.idReq}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.medico || []
          dispatch(apiCallDoctor(getList?.surveyid, getList?.idmedico)).then(res => {
            // console.log('apiCallDoctor: ', res)
            if (res?.payload?.idReq) {
              setTimeout(() => {
                NavigationService.navigateAndReset(Routes.DRAWER_NAVIGATION)
                setTimeout(() => {
                  NavigationService.navigate(Routes.PATINET_VIDEO_CALL_SCREEN, {
                    data: res?.payload,
                    idReq: res?.payload?.idReq
                  })
                }, 1000)
              }, 500)
            } else {
              NavigationService.navigate(Routes.STAR_RATING_SCREEN)
            }
          }).catch(() => {
            console.log('err: apiCallDoctor')
            NavigationService.navigate(Routes.STAR_RATING_SCREEN)
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  const fullViewBG = () => {
    return (
      <TouchableOpacity
        style={styles.fullPositionView}
        activeOpacity={1}
        onPress={() => {
          setRefresh(Math.random())
          setShowMoreAction(true)
        }}
      />
    )
  }

  const renderImageWaiting = () => {
    const renderIndicator = () => {
      return (
        <View style={styles.indicator2Style}>
          <WaveIndicator
            color={colorFFFFFF}
            size={200}
            count={5}
            waveFactor={0.7}
            waveMode={'outline'}
          />
        </View>
      )
    }
    return (
      <View style={styles.viewWaiting}>
        {renderIndicator()}
        <Image style={styles.imgWaiting} source={imgVideoCall.ic_load_call} />
      </View>
    )
  }

  const renderCloseView = () => {
    return (
      <TouchableOpacity style={styles.imgCloseView} onPress={_onPressEndcall}>
        <Image style={styles.imgClose} source={imgVideoCall.ic_close} />
      </TouchableOpacity>
    )
  }

  const renderBt = (
    img, onPress
  ) => {
    return (
      <TouchableOpacity
        onPress={onPress}>
        <Image style={styles.imgBtBottom} source={img} />
      </TouchableOpacity>
    )
  }

  const _onPressCamera = () => {
    setCamera(!isCamera)
  }

  const _onPressVoice = () => {
    setVoice(!isVoice)
  }

  const _onPressFrontCamera = () => {
    setFrontCamera(!isFrontCamera)
  }

  const _onPressChat = () => {
    setChat(!isChat)
  }

  const renderLSBt = () => {
    return (
      <View style={styleSession(!isWaitCall).lsBTView}>
        {
          isShowMorAction &&
          renderBt(
            isCamera ? imgVideoCall.ic_camera : imgVideoCall.ic_hide_camera,
            _onPressCamera
          )
        }
        {
          isShowMorAction &&
          renderBt(
            isVoice ? imgVideoCall.ic_unvoice : imgVideoCall.ic_voice,
            _onPressVoice
          )
        }
        {
          (isShowMorAction && isConnectSession) &&
          renderBt(imgVideoCall.ic_chat, _onPressChat)
        }
        {
          isShowMorAction &&
          renderBt(imgVideoCall.ic_front_camera, _onPressFrontCamera)
        }
        {renderBt(imgVideoCall.ic_end_call, _onPressEndcall)}
      </View>
    )
  }

  const [signal] = useState()

  const onPressSendChat = (val) => {
    otSessionRef.current?.signal({
      data: val,
      auth: userinfo?.username,
      time: convertToUTC(new Date()),
      type: userinfo?.username
    })
    otSessionRef?.current?.sessionHelper?.session?.signal({
      auth: userinfo?.username,
      data: val,
      time: convertToUTC(new Date()),
      type: userinfo?.username
    })

    const copyDataRedux = _.cloneDeep(lsMsg)
    var newData = [
      ...copyDataRedux,
      {
        data: val || '',
        auth: userinfo?.username,
        time: convertToUTC(new Date()),
        type: userinfo?.username
      }
    ]
    lsMsg = newData
    dispatch(saveChat(lsMsg || []))
  }

  const renderContentVideoCall = () => {
    const dataCall = resCallDoc ? resCallDoc : getDataPassing
    if (dataCall?.apiKey && dataCall?.sessionId && dataCall?.token) {
      const renderSession = () => {
        return (
          <OTSubscriber
            style={!isChangeScreem ? styles.sessionPublisherView : styles.subscriberView}
            properties={{
              subscribeToAudio: true,
              subscribeToVideo: true
            }}
          />
        )
      }

      const renderPublisher = () => {
        return (
          <OTPublisher
            style={isChangeScreem ? styles.sessionPublisherView : styles.subscriberView}
            properties={{
              publishAudio: isVoice,
              publishVideo: isCamera,
              cameraPosition: isFrontCamera ? 'front' : 'back'
            }}
          />
        )
      }

      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setRefresh(Math.random())
            setShowMoreAction(true)
          }}
          style={styles.container}>
          <View style={styles.container}>
            <OTSession
              apiKey={`${dataCall?.apiKey || ''}`}
              sessionId={dataCall?.sessionId || ''}
              token={dataCall?.token || ''}
              eventHandlers={sessionEventHandlers}
              ref={otSessionRef}
              signal={signal}
            >
              <View style={styles.fullPositionView}>
                {renderSession()}
              </View>
              <View style={styles.sessionView}>
                {renderPublisher()}
              </View>
            </OTSession>
          </View>
        </TouchableOpacity>
      )
    }
    return null
  }

  return (
    <View style={styles.contain}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={isConnectSession ? null : imgDirectCall.ic_close}
        onPressLeft={_onPressPreviewNavi}
        textCenter={' '}
      />
      <View style={styleSession(isConnectSession).fullPositionView}>
        {(isConnectSession) && fullViewBG()}
        {(isConnectSession) && renderImageWaiting()}
        {renderContentVideoCall()}
        {(isConnectSession) && renderCloseView()}
        {(isConnectSession) && renderLSBt()}
      </View>
      {isLoading && <LoadingView />}
      {
        (isConnectSession && isChat) && (
          <PopupChatVideoCallView
            isShow={isChat}
            setShow={(val) => setChat(val)}
            onPressSend={(val) => onPressSendChat(val)}
          />
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contain: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: colorFFFFFF
  },
  topCenter: {
    width: '100%',
    height: 304,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarView: {
    width: 176,
    height: 176,
    borderRadius: 176 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9AE6B4'
  },
  imgAvatar: {
    width: 160,
    height: 160,
    borderRadius: 160 / 2,
    overflow: 'hidden'
  },
  txtNameDoctor: {
    height: 24,
    marginLeft: 20,
    marginRight: 20
  },
  marginT16: {
    marginTop: 16
  },
  textContentView: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleContentStyle: {
    marginTop: 16
  },
  textContentStyle: {
    marginTop: 16,
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center'
  },
  bottomView: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 26
  },
  bt1Style: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 16
  },
  bt2Style: {
    backgroundColor: colorFFFFFF
  },
  txtBt2Style: {
    color: color3777EE
  },
  imgFindStyle: {
    width: 304,
    height: 304
  },
  indicatorStyle: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgNotAvailable: {
    width: 176,
    height: 176
  },
  subscriberView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  sessionView: {
    width: 80,
    height: 120,
    position: 'absolute',
    top: 76,
    right: 20,
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 1000,
    elevation: 1000
  },
  sessionPublisherView: {
    width: 80,
    height: 120,
    position: 'absolute',
    top: 76,
    right: 20,
    borderRadius: 12,
    overflow: 'hidden'
  },
  viewWaiting: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    alignItems: 'center'
  },
  imgWaiting: {
    marginTop: 148,
    width: 180,
    height: 180
  },
  lsBTView: {
    flexDirection: 'row',
    position: 'absolute',
    width: Dimensions.get('window').width,
    bottom: 20 + (Dimensions.get('window').height / 4),
    left: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgBtBottom: {
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
    marginLeft: 12,
    marginRight: 12
  },
  imgCloseView: {
    position: 'absolute',
    width: 64,
    height: 64,
    top: 40,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgClose: {
    width: 24,
    height: 24
  },
  indicator2Style: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 148 / 2,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  changeScreenView: {
    position: 'absolute',
    top: 60,
    right: 4
  },
  imgChangeScreen: {
    width: 32,
    height: 32
  },
  quizStyles: {
    position: 'absolute',
    width: '100%',
    height: Dimensions.get('window').height / 4,
    left: 0,
    bottom: 0
  },
  fullPositionView: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    top: 0,
    left: 0,
    backgroundColor: 'red'
  },
  imgQuiz: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch'
  }
})

const styleSession = (isConnect) => StyleSheet.create({
  fullPositionView: {
    position: 'absolute',
    width: isConnect ? Dimensions.get('window').width : 0,
    height: isConnect ? Dimensions.get('window').height : 0,
    top: 0,
    left: 0,
    backgroundColor: color2C64CD
  },
  lsBTView: {
    flexDirection: 'row',
    position: 'absolute',
    width: Dimensions.get('window').width,
    bottom: 20 + (isConnect ? 20 : (Dimensions.get('window').height / 4)),
    left: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
