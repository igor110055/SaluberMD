import React, { useEffect, useRef, useState } from 'react'
import {
  StyleSheet, View, Dimensions, ImageBackground,
  StatusBar, Image, TouchableOpacity, AppState
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { apiCallDoctor, apiGetHasEprescribing } from '../../../api/VideoCall'
import { OTSession, OTPublisher, OTSubscriber } from 'opentok-react-native'
import NavigationService from '../../../navigation'
import axios from 'axios'
import imgVideoCall from '../../../../assets/images/video_call'
import imgDirectCall from '../../../../assets/images/direct_call'
import LoadingView from '../../../components/LoadingView'
import { colorE5E5E5, colorFFFFFF } from '../../../constants/colors'
import * as APIs from '../../../api/APIs'
import Routes from '../../../navigation/Routes'
import { WaveIndicator } from 'react-native-indicators'
import PopupChatVideoCallView from 'components/PopupChatVideoCallView'
import { convertToUTC } from 'constants/DateHelpers'
import { saveChat } from 'actions/user'
import _ from 'lodash'

export default function VideoCallView({ route }) {
  const passingData = route?.params?.data
  const idSurvey = route?.params?.survey
  const valueVideoCall = route?.params?.valueVideoCall || null
  const dispatch = useDispatch()
  const [resCallDoc, setResCallDoc] = useState()
  const token = useSelector(state => state.user.token)
  const [isShowMorAction, setShowMoreAction] = useState(true)
  const [refresh, setRefresh] = useState(1)
  const [isLoading, setLoading] = useState(false)
  const [isVoice, setVoice] = useState(true)
  const [isCamera, setCamera] = useState(true)
  const [isFrontCamera, setFrontCamera] = useState(true)
  const [isChangeScreem, setChangeScreen] = useState(true)
  const [isChat, setChat] = useState(false)
  const [isConnectSession, setConnectSession] = useState(false)
  const [isWaitCall, setWaitCall] = useState(true)
  const lsChatRedux = useSelector(state => state.user.lsChat)
  const userinfo = useSelector(state => state.user.userinfo)

  useEffect(() => {
    callAPIHasEprescribibng()
    if (valueVideoCall) {
      setResCallDoc(valueVideoCall)
    } else {
      callAPICallDoctor()
    }
    callAPIVisual()
  }, [])

  useEffect(() => {
    if (resCallDoc?.sessionId && resCallDoc?.token) {
      Promise.all([
        loginEvent(resCallDoc?.sessionId, (resCallDoc?.apiKey || '').toString()),
        connectSession(resCallDoc?.token, resCallDoc?.sessionId)
      ])
    }
  }, [resCallDoc])

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setShowMoreAction(false)
    }, 10000)

    return () => clearTimeout(timeOut)
  }, [refresh])

  useEffect(() => {
    AppState.addEventListener('change', _handlerChange)

    return () => AppState.removeEventListener('change', _handlerChange)
  }, [])

  const callAPIHasEprescribibng = () => {
    dispatch(apiGetHasEprescribing()).then(res => {
      console.log('res: ', res)
    }).catch(() => {
      console.log('err callAPIHasEprescribibng')
    })
  }

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

  const callAPICallDoctor = () => {
    console.log('passingData?.idmedico', passingData)
    console.log('idSurvey', idSurvey)
    if (passingData && idSurvey) {
      console.log('Call doctor: ', passingData)
      dispatch(apiCallDoctor(idSurvey, passingData?.idmedico || (passingData?.doctorId || ''))).then(res => {
        console.log('res: ', res)
        setResCallDoc(res?.payload)
      }).catch(err => {
        console.log('err: ', err)
      })
    }
  }

  const callAPIVisual = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/webdoctor/getVirtualOffice/${passingData?.idmedico || (passingData?.id || '')}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token,
        'X-TB-VERSION': 1,
        'X-TB-CONNECTIONID': '80811da0-c117-4665-a7ad-d5e8d77f67ef',
        'X-TB-CLIENT-VERSION': 'js-2.20.2'
      }
    })
  }

  const loginEvent = (sessionId, apiKey) => {
    const param = {
      action: 'Connect',
      apiServer: 'https://anvil.opentok.com',
      buildHash: '20ba7b157',
      clientInstanceId: '1c5cb117-e1b8-4630-9ca0-10cfae01a53f',
      clientSystemTime: 1629365896762,
      clientVersion: 'js-2.20.2',
      connectionId: '80811da0-c117-4665-a7ad-d5e8d77f67ef',
      guid: '09008229-1cfd-49b1-9503-6b8ce8e2beeb',
      logVersion: '2',
      partnerId: apiKey,
      payload: null,
      sessionId: sessionId,
      source: 'file:///android_asset/www/index.html',
      variation: 'Attempt',
      version: 'v2.20.2'
    }
    axios({
      method: 'post',
      url: 'https://hlg.tokbox.com/prod/logging/ClientEvent',
      data: JSON.stringify(param)
    })
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

      // setTimeout(() => {
      //   Promise.all(callAPICheckNoAnswer())
      // }, 1000 * (60 * 2))
    }).catch(err => {
      console.log('connect err :', err)
    })
  }

  // const callAPICheckNoAnswer = () => {
  //   dispatch(apiGetSendNoAnswerNotification(passingData?.idmedico)).then(res => {
  //     if (_.includes([0, '0'], res?.payload?.esito)) {
  //       console.log('End call')
  //       setLoading(true)
  //       Promise.all([callAPIEndCall()])
  //       setTimeout(() => {
  //         setResCallDoc()
  //       }, 300)
  //       setTimeout(() => {
  //         setLoading(false)
  //         NavigationService.goBack()
  //         setTimeout(() => {
  //           DeviceEventEmitter.emit(Routes.ANAMNESIS_SCREEN, { noAnswerCall: true })
  //         }, 500)
  //       }, 2000)
  //     }
  //   }).catch(() => {

  //   })
  // }

  const callAPIEndCall = () => {
    dispatch(saveChat([]))
    if (resCallDoc?.idReq) {
      axios({
        method: 'post',
        url: `${APIs.hostAPI}backoffice/videocall/endCall/${resCallDoc?.idReq}`,
        headers: {
          'content-type': 'application/json',
          'x-auth-token': token
        }
      }).then(res => {
        console.log('connectSession: ', res)
      }).catch(err => {
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
    }, 2000)
  }

  var lsMsg = []

  const sessionEventHandlers = {
    connectionCreated: (event) => {
      console.log('connectionCreated!', event)
      setConnectSession(true)
      setWaitCall(false)
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

  const otSessionRef = useRef(OTSession)
  const [signal, setSignal] = useState()

  const renderContentVideoCall = () => {
    console.log('resCallDoc', resCallDoc)
    if (resCallDoc?.apiKey && resCallDoc?.sessionId && resCallDoc?.token) {
      const renderSession = () => {
        return (
          <OTSubscriber
            style={!isChangeScreem ? styles.sessionPublisherView : styles.subscriberView}
            properties={{
              subscribeToAudio: true,
              subscribeToVideo: true
            }}
            eventHandlers={sessionEventHandlers}
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
              apiKey={`${resCallDoc?.apiKey || ''}`}
              sessionId={resCallDoc?.sessionId || ''}
              token={resCallDoc?.token || ''}
              eventHandlers={sessionEventHandlers}
              ref={otSessionRef}
              signal={signal}
            >
              {
                !isChangeScreem ?
                  renderPublisher() :
                  renderSession()
              }
              <View style={styles.sessionView}>
                {
                  isChangeScreem ?
                    renderPublisher() :
                    renderSession()
                }
              </View>
            </OTSession>
          </View>
        </TouchableOpacity>
      )
    }
    return null
  }

  const renderImageWaiting = () => {
    const renderIndicator = () => {
      return (
        <View style={styles.indicatorStyle}>
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

  const _onPressChat = () => {
    setChat(!isChat)
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

  const renderLSBt = () => {
    return (
      <View style={styleQuiz(isWaitCall).lsBTView}>
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
          isShowMorAction &&
          renderBt(
            imgVideoCall.ic_chat,
            _onPressChat)
        }
        {
          isShowMorAction &&
          renderBt(imgVideoCall.ic_front_camera, _onPressFrontCamera)
        }
        {renderBt(imgVideoCall.ic_end_call, _onPressEndcall)}
      </View>
    )
  }

  const fullViewBG = () => {
    return (
      <TouchableOpacity
        style={styles.bgFullView}
        activeOpacity={1}
        onPress={() => {
          setRefresh(Math.random())
          setShowMoreAction(true)
        }}
      />
    )
  }

  const renderChangeScreen = () => {
    if (!isShowMorAction) {
      return null
    }
    return (
      <TouchableOpacity
        onPress={() => setChangeScreen(!isChangeScreem)}
        style={styles.changeScreenView}>
        <Image source={imgDirectCall.ic_change_screen} style={styles.imgChangeScreen} />
      </TouchableOpacity>
    )
  }

  const renderQuiz = () => {
    if (isWaitCall) {
      return (
        <ImageBackground
          source={imgDirectCall.ic_bg_quiz}
          style={styles.quizStyles}
        />
      )
    }
    return null
  }

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
    console.log('Ls data : ', newData)
    dispatch(saveChat(lsMsg || []))
  }

  return (
    <ImageBackground
      style={styles.container}
      source={imgVideoCall.ic_bg_waiting}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white" />
      {fullViewBG()}
      {renderImageWaiting()}
      {resCallDoc && renderContentVideoCall()}
      {renderQuiz()}
      {renderCloseView()}
      {/* {renderChangeScreen()} */}
      {renderLSBt()}
      {isLoading && <LoadingView />}
      {
        isChat && (
          <PopupChatVideoCallView
            isShow={isChat}
            setShow={(val) => setChat(val)}
            onPressSend={(val) => onPressSendChat(val)}
          />
        )
      }
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bgFullView: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    top: 0,
    left: 0
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
    backgroundColor: colorE5E5E5,
    overflow: 'hidden'
  },
  sessionPublisherView: {
    width: 80,
    height: 120
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
    bottom: 20 + 304,
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
  indicatorStyle: {
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
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 4,
    left: 0,
    bottom: 0
  }
})

const styleQuiz = (isConnect) => StyleSheet.create({
  quizStyles: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: isConnect ? 20 : Dimensions.get('window').height / 4,
    left: 0,
    bottom: 0
  },
  lsBTView: {
    flexDirection: 'row',
    position: 'absolute',
    width: Dimensions.get('window').width,
    bottom: !isConnect ? 20 : (Dimensions.get('window').height / 4) + 20,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
