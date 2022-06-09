import React, { useEffect, useRef, useState } from 'react'
import {
  StyleSheet, View, Dimensions, ImageBackground,
  StatusBar, Image, TouchableOpacity, DeviceEventEmitter
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { OTSession, OTPublisher, OTSubscriber } from 'opentok-react-native'
import NavigationService from '../../../navigation'
import axios from 'axios'
import imgVideoCall from '../../../../assets/images/video_call'
import imgDirectCall from '../../../../assets/images/direct_call'
import LoadingView from '../../../components/LoadingView'
import { color3777EE, colorE5E5E5, colorFFFFFF } from '../../../constants/colors'
import * as APIs from '../../../api/APIs'
import Routes from '../../../navigation/Routes'
import { WaveIndicator } from 'react-native-indicators'
// import PopupChatVideoCallView from 'components/PopupChatVideoCallView'
import Button from 'components/Button'
import PopupChatVideoCallView from 'components/PopupChatVideoCallView'
import { convertToUTC } from 'constants/DateHelpers'
import { saveChat } from 'actions/user'
import Translate from 'translate'
import _ from 'lodash'

export default function VideoCallView({
  apiKey, sessionId, token, idReq
}) {
  const tokenRedux = useSelector(state => state.user.token)
  const [isShowMorAction, setShowMoreAction] = useState(true)
  const [refresh, setRefresh] = useState(1)
  const [isLoading, setLoading] = useState(false)
  const [isVoice, setVoice] = useState(true)
  const [isCamera, setCamera] = useState(true)
  const [isFrontCamera, setFrontCamera] = useState(true)
  const [isChat, setChat] = useState(false)
  const [isWaitCall] = useState(false)
  const [isEnd, setEndCall] = useState(false)
  const [isChangeScreem, setChangeScreen] = useState(true)
  const otSessionRef = useRef(OTSession)
  var lsMsg = []
  const userinfo = useSelector(state => state.user.userinfo)
  const lsChatRedux = useSelector(state => state.user.lsChat)
  const dispatch = useDispatch()
  const languageRedux = useSelector(state => state.common.language)

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setShowMoreAction(false)
    }, 10000)

    return () => clearTimeout(timeOut)
  }, [refresh])

  const connectSession = (tokenSession, session) => {
    // axios({
    //   method: 'get',
    //   url: `https://api-standard.opentok.com/session/${session}?extended=true`,
    //   headers: {
    //     'content-type': 'application/json',
    //     'X-OPENTOK-AUTH': tokenSession
    //   }
    // }).then(res => {
    //   console.log('connectSession: ', res)

    //   // setTimeout(() => {
    //   //   Promise.all(callAPICheckNoAnswer())
    //   // }, 1000 * (60 * 2))
    // }).catch(err => {
    //   console.log('connect err :', err)
    // })
  }

  const callAPIEndCall = () => {
    dispatch(saveChat([]))
    if (idReq) {
      axios({
        method: 'post',
        url: `${APIs.hostAPI}backoffice/videocall/endCall/${idReq}`,
        headers: {
          'content-type': 'application/json',
          'x-auth-token': tokenRedux
        }
      }).then(res => {
        console.log('connectSession: ', res)
        NavigationService.navigate(Routes.POST_CALL_SCREEN)
      }).catch(err => {
        console.log('connect err :', err)
        NavigationService.navigate(Routes.POST_CALL_SCREEN)
      })
    }
  }

  const _onPressEndcall = () => {
    setLoading(true)
    callAPIEndCall()
    setTimeout(() => {
      setEndCall(true)
    }, 300)
    setTimeout(() => {
      setLoading(false)
      NavigationService.navigate(Routes.POST_CALL_SCREEN)
    }, 1000)
  }

  useEffect(() => {
    otSessionRef?.current?.sessionHelper?.session?.on('signal', (event) => {
      console.log('i got', event)
    })
  }, [])

  const sessionEventHandlers = {
    connectionCreated: (event) => {
    },
    streamCreated: (event) => {
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

  const [signal, setSignal] = useState()

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

  const renderContentVideoCall = () => {
    if (apiKey && sessionId && token) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setRefresh(Math.random())
            setShowMoreAction(true)
          }}
          style={styles.flexFull}>
          <View style={styles.flexFull}>
            <OTSession
              apiKey={`${apiKey || ''}`}
              sessionId={sessionId || ''}
              token={token || ''}
              eventHandlers={sessionEventHandlers}
              ref={otSessionRef}
              signal={signal}
            >
              <View style={styles.bgFullView}>
                <OTSubscriber
                  style={isChangeScreem ? styles.subscriberView : styles.subscriberSmallView}
                  properties={{
                    subscribeToAudio: true,
                    subscribeToVideo: true
                  }}
                  eventHandlers={sessionEventHandlers}
                />
              </View>
              <View style={isChangeScreem ? styles.sessionView : styles.sessionSmallView}>
                <OTPublisher
                  style={styles.sessionPublisherView}
                  properties={{
                    publishAudio: isVoice,
                    publishVideo: isCamera,
                    cameraPosition: isFrontCamera ? 'front' : 'back'
                  }
                  }
                />
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

  const renderTransferCallButton = () => {
    return (
      <View style={styles.buttonTransfer}>
        <Button
          text={Translate(languageRedux).transfer_call}
          textColor={color3777EE}
          backgroundColor={colorFFFFFF}
          onPress={() => {
            NavigationService.navigate(Routes.TRANSFER_CALL_SCREEN)
          }}
        />
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

  const renderChangeScreen = () => {
    if (!isShowMorAction) {
      return null
    }
    return (
      <TouchableOpacity
        onPress={() => setChangeScreen(!isChangeScreem)}
        style={isChangeScreem ? styles.changeScreenView : styles.changeSmallView}>
        <Image source={imgDirectCall.ic_change_screen} style={styles.imgChangeScreen} />
      </TouchableOpacity>
    )
  }

  return (
    <ImageBackground
      style={isChangeScreem ? styles.container : styles.smallScreen}
      source={imgVideoCall.ic_bg_waiting}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white" />
      {isChangeScreem && fullViewBG()}
      {isChangeScreem && renderImageWaiting()}
      {!isEnd && renderContentVideoCall()}
      {isChangeScreem && renderQuiz()}
      {isChangeScreem && renderCloseView()}
      {renderChangeScreen()}
      {isChangeScreem && renderLSBt()}
      {renderTransferCallButton()}
      {isChangeScreem && isLoading && <LoadingView />}
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
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 0,
    left: 0
  },
  flexFull: {
    flex: 1
  },
  smallScreen: {
    position: 'absolute',
    width: 80,
    height: 120,
    bottom: 120,
    right: 20,
    borderRadius: 8,
    overflow: 'hidden'
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
    top: 50,
    right: 20,
    borderRadius: 12,
    backgroundColor: colorE5E5E5,
    overflow: 'hidden',
    zIndex: 1000,
    elevation: 1000
  },
  sessionSmallView: {
    right: -200,
    zIndex: 1,
    elevation: 1,
    width: 80,
    height: 120,
    position: 'absolute',
    top: 76,
    borderRadius: 12,
    overflow: 'hidden'
  },
  subscriberSmallView: {
    width: 80,
    height: 120,
    position: 'absolute',
    top: 0,
    left: 0
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
    top: 10,
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
    top: 40,
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
  },
  changeSmallView: {
    position: 'absolute',
    top: 0,
    right: 0
  },
  buttonTransfer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    marginHorizontal: 100
  }
})

const styleQuiz = (isConnect) => StyleSheet.create({
  quizStyles: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: isConnect ? 60 : Dimensions.get('window').height / 4,
    left: 0,
    bottom: 0
  },
  lsBTView: {
    flexDirection: 'row',
    position: 'absolute',
    width: Dimensions.get('window').width,
    bottom: !isConnect ? 100 : (Dimensions.get('window').height / 4) + 100,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
