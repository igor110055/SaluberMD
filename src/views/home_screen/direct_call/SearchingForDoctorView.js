import React, { useState, useEffect, useRef } from 'react'
import {
  StyleSheet, View, Text, Dimensions, Image,
  AppState, TouchableOpacity, DeviceEventEmitter
} from 'react-native'
import Header from '../../../components/Header'
import { color040404, color2C64CD, color3777EE, colorE5E5E5, colorEAF1FF, colorFFFFFF } from '../../../constants/colors'
import imgDirectCall from '../../../../assets/images/direct_call'
import { customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'
import _ from 'lodash'
import Translate from '../../../translate'
import { useDispatch, useSelector } from 'react-redux'
import CustomButtonFillFix from './component_direct_call/CustomButtonFillFix'
import { WaveIndicator } from 'react-native-indicators'
import { convertToUTC, convertYYYYMMDD } from 'constants/DateHelpers'
import axios from 'axios'
import * as APIs from '../../../api/APIs'
import { apiCallDoctor, apiGetCheckStatusCall, apiGetHasEprescribing } from 'api/VideoCall'
import { OTSession, OTPublisher, OTSubscriber } from 'opentok-react-native'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import imgVideoCall from '../../../../assets/images/video_call'
import LoadingView from 'components/LoadingView'
import Swiper from 'react-native-swiper'
import PopupChatVideoCallView from 'components/PopupChatVideoCallView'
import DialogCustom from 'components/DialogCustom'
import { saveChat } from 'actions/user'

export default function SearchingForDoctorView({
  lsDoctor, doctor, typeFreeView, setDialog,
  onPressVideoCall, nameChild, birthdayChild,
  talkAbout, isMyChild, onPressDismiss, onPressCancel,
  doctorId
}) {
  const languageRedux = useSelector(state => state.common.language)
  const [doctorFinding, setDoctorFinding] = useState((lsDoctor || []).length > 0 ? lsDoctor[0] : null)
  const [reload, setReload] = useState(1)
  const token = useSelector(state => state.user.token)
  const dispatch = useDispatch()
  const [resCallDoc, setResCallDoc] = useState()
  const chronic_disease = useSelector(state => state.user.chronic_disease)
  const allergies = useSelector(state => state.user.allergies)
  const medications = useSelector(state => state.user.medications)
  const [isActiveDoctor, setActiveDoctor] = useState(false)
  const otSessionRef = useRef(OTSession)
  const [indexFree, setIndexFree] = useState(1)
  const [isConnectSession, setConnectSession] = useState(false)
  const [isShowMorAction, setShowMoreAction] = useState(true)
  const [refresh, setRefresh] = useState(1)
  const [isLoading, setLoading] = useState(false)
  const [isVoice, setVoice] = useState(true)
  const [isCamera, setCamera] = useState(true)
  const [isFrontCamera, setFrontCamera] = useState(true)
  const [isChangeScreem, setChangeScreen] = useState(true)
  const [isWaitCall, setWaitCall] = useState(false)

  const refSwiper = React.createRef()
  const [isChat, setChat] = useState(false)
  const [isCancel, setCancel] = useState(false)
  const [isDialogDrBusy, setDialogDrBusy] = useState(false)
  const [reloadStatus, setReloadStatus] = useState()
  const [dataTransfer, setDataTransfer] = useState()
  const [toggleReload, setToggleReload] = useState(1)
  const [isTransfer, setTransfer] = useState(false)
  const allergiesRedux = useSelector(state => state.common.dataAllergy)
  const medicationRedux = useSelector(state => state.common.dataMedi)
  const diseasesRedux = useSelector(state => state.common.dataDisease)
  const lsChatRedux = useSelector(state => state.user.lsChat)
  const userinfo = useSelector(state => state.user.userinfo)
  const [base64Image, setBase64Image] = useState()

  useEffect(() => {
    getVirtualOffice()
  }, [])

  const getVirtualOffice = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/webdoctor/getVirtualOffice/${doctorId}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getBase64 = response?.data?.virtualoffice?.image || []
          setBase64Image(getBase64)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    if (typeFreeView) {
      if (reload !== 1 && (lsDoctor || []).length > 0) {
        if (indexFree <= ((lsDoctor || []).length) - 1) {
          setDoctorFinding(lsDoctor[indexFree])
          setTimeout(() => {
            setIndexFree(indexFree + 1)
          }, 200)
        } else if (indexFree > ((lsDoctor || []).length) - 1) {
          setDoctorFinding()
        }
      }
    }
  }, [reload])

  useEffect(() => {
    setTimeout(() => {
      if (isActiveDoctor === false && typeFreeView && resCallDoc) {
        setReload(Math.floor(Math.random() * 100))
      } else if (isActiveDoctor === false && !typeFreeView && resCallDoc) {
        console.log('Cancel')
        setCancel(true)
        setReload(2)
        callAPIEndCall()
        setDoctorFinding()
      }
    }, 1000 * 150)
  }, [resCallDoc])

  useEffect(() => {
    const timeInterval = setInterval(() => {
      if (resCallDoc) {
        callAPICheckConnect(resCallDoc)
        connectSession(resCallDoc?.token, resCallDoc?.sessionId)
      }
    }, 2000)

    if (isCancel) {
      clearInterval(timeInterval)
    }

    if (isActiveDoctor) {
      clearInterval(timeInterval)
    }
    return () => clearInterval(timeInterval)
  }, [resCallDoc, isActiveDoctor])

  useEffect(() => {
    if (doctorFinding) {
      setTimeout(() => {
        callAPIGetSurvey()
      }, 3000)
    }
  }, [doctorFinding])

  useEffect(() => {
    AppState.addEventListener('change', _handlerChange)

    return () => AppState.removeEventListener('change', _handlerChange)
  }, [])

  useEffect(() => {
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
    setTimeout(() => {
      callAPIEndCall()
    }, 2000)
    setDialog(false)
    onPressDismiss(true)
  }

  const callAPIGetSurvey = async () => {
    const getLsMedicaltion = (medicationRedux?.datas || []).map(val => {
      return {
        'id': val?.id,
        'nameCurrentValue': val?.other,
        'genericName': val?.genericName,
        'dosage': val?.dosage,
        'medicationId': val?.medicineId
      }
    })
    console.log('getLsMedicaltion: ', getLsMedicaltion)
    const getLsAllergies = (allergiesRedux?.datas || []).map(val => {
      return {
        'id': val?.id,
        'nameCurrentValue': val?.genericName,
        'other': val?.other || null,
        'allergyId': val?.allergyId
      }
    })
    console.log('getLsAllergies: ', getLsAllergies)
    const getLsDiseases = (diseasesRedux?.datas || []).map(val => {
      return {
        'id': val?.id,
        'nameCurrentValue': val?.name,
        'other': val?.other || null,
        'diseaseId': val?.diseaseId
      }
    })
    console.log('getLsDiseases: ', getLsDiseases)
    var params = {
      'idQuestionario': -1,
      'idMedico': -1,
      'medications': getLsMedicaltion || [],
      'allergies': getLsAllergies || [],
      'diseases': getLsDiseases || [],
      'complaints': [],
      'files': [],
      'answer1': 'Me',
      'answer2': talkAbout,
      'auth': 'true'
    }

    if (nameChild) {
      params = {
        ...params,
        childname: nameChild,
        childbirthdate: `${convertYYYYMMDD(birthdayChild)}T17:00:00.000Z`
      }
    }

    console.log('paramsss:', params)

    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/webdoctor/saveSurvey`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      },
      data: JSON.stringify(params)
    }).then(res => {
      console.log('saveSurvey Res :', res?.data)
      callAPIHasEprescribibng()
      callAPICallDoctor(res?.data?.idSurvey)
      callAPIVisual()
    }).catch(err => {
      console.log('Err:', err)
    })
  }

  const callAPICallDoctor = (idSurvey) => {
    dispatch(apiCallDoctor(idSurvey, (doctor || doctorFinding)?.idmedico)).then(res => {
      console.log('res: ', res)
      setResCallDoc(res?.payload)
      setTimeout(() => {
        check1000ms(res?.payload)
        if (res?.payload?.esito === '1') {
          setDialogDrBusy(true)
        }
      }, 1000)
    }).catch(err => {
      console.log('err: ', err)
    })
  }

  const callAPIHasEprescribibng = () => {
    dispatch(apiGetHasEprescribing()).then(res => {
      console.log('res: ', res)
    }).catch(() => {
      console.log('err callAPIHasEprescribibng')
    })
  }

  const callAPIVisual = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/webdoctor/getVirtualOffice/${(doctor || doctorFinding)?.idmedico}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token,
        'X-TB-VERSION': 1,
        'X-TB-CONNECTIONID': '80811da0-c117-4665-a7ad-d5e8d77f67ef',
        'X-TB-CLIENT-VERSION': 'js-2.20.2'
      }
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
    }).catch(err => {
      console.log('connect err :', err)
    })
  }

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
        console.log('APIEndCall: ', res)
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
      if (isTransfer) {
        console.log('Transfer')
      } else {
        if (!resCallDoc) {
          NavigationService.navigate(Routes.STAR_RATING_SCREEN)
        }
      }
    }, 1000 * 40)
  }

  const check1000ms = (dataCall) => {
    setTimeout(() => {
      callAPICheckConnect(dataCall)
    }, 1000)
  }

  useEffect(() => {
    setTimeout(() => {
      callAPICheckConnect(resCallDoc)
      setReloadStatus(Math.random())
    }, 1000)
  }, [reloadStatus])

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
          setTransfer(true)
          setDataTransfer(getList)
          dispatch(apiCallDoctor(getList?.surveyid, getList?.idmedico)).then(res => {
            setTimeout(() => {
              check1000ms(res?.payload)
              if (res?.payload?.esito === '1') {
                setDialogDrBusy(true)
              }
            }, 1000)

            if (res?.payload?.idReq) {
              setTimeout(() => {
                setResCallDoc(res?.payload)
              }, 500)

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

  const callAPICheckConnect = (dataCall) => {
    if (dataCall) {
      dispatch(apiGetCheckStatusCall(dataCall?.idReq)).then(res => {
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

  const renderTextCenter = (
    title, content
  ) => {
    return (
      <View style={styles.textContentView}>
        <Text style={[
          customTxt(Fonts.Bold, 20, color3777EE).txt,
          styles.titleContentStyle
        ]}>{title}</Text>
        <Text style={[
          customTxt(Fonts.Regular, 16, color040404).txt,
          styles.textContentStyle
        ]}>{content}</Text>
      </View>
    )
  }

  const renderFindingYourDoctor = () => {
    const renderIndicator = () => {
      return (
        <View style={styles.indicatorStyle}>
          <WaveIndicator
            color={colorEAF1FF}
            size={304}
            count={5}
            waveFactor={0.7}
            waveMode={'outline'}
          />
        </View>
      )
    }
    return (
      <View style={styles.topCenter}>
        {renderIndicator()}
        <Image source={imgDirectCall.ic_find_doctor} style={styles.imgFindStyle} />
      </View>
    )
  }

  const getSpecialization = (valDoctor) => {
    const getListSpecialization = valDoctor?.specialization || []
    var getNameSpecialization = getListSpecialization.map((val, index) => {
      if (index === getListSpecialization.length - 1) {
        return `${val}`
      }
      return `${val}, `
    })
    return getNameSpecialization
  }

  const renderCallDoctorView = () => {
    return (
      <View style={styles.topCenter}>
        <View style={styles.avatarView}>
          <Image style={styles.imgAvatar} source={base64Image ? {uri: base64Image} : imgDirectCall.ic_avatar_doctor} />
        </View>
        <Text
          numberOfLines={1}
          style={[
            customTxt(Fonts.Bold, 18, color040404).txt,
            styles.txtNameDoctor,
            styles.marginT16
          ]}>{doctor?.name || (doctorFinding?.name || '')}</Text>
        <Text
          numberOfLines={1}
          style={[
            customTxt(Fonts.Regular, 14, color040404).txt,
            styles.txtNameDoctor
          ]}>{getSpecialization(doctor || doctorFinding) || ''}</Text>
      </View>
    )
  }

  const renderNotAvailableDoctor = () => {
    return (
      <View style={styles.topCenter}>
        <Image style={styles.imgNotAvailable} source={imgDirectCall.ic_not_available} />
      </View>
    )
  }

  const renderContent = () => {
    if ((doctor || doctorFinding) && isActiveDoctor) {
      return renderCallDoctorView()
    } else if (typeFreeView && reload !== 1 && _.isEmpty(doctorFinding)) {
      return renderNotAvailableDoctor()
    } else if (!typeFreeView && reload !== 1 && _.isEmpty(doctorFinding)) {
      return renderNotAvailableDoctor()
    }
    return renderFindingYourDoctor()
  }

  const renderTextContent = () => {
    if ((doctor || doctorFinding) && isActiveDoctor) {
      return renderTextCenter(
        Translate(languageRedux).FOUND_YOU_A_DOCTOR,
        Translate(languageRedux).LET_GO_VIDEO_NOW
      )
    } else if (typeFreeView && reload !== 1 && _.isEmpty(doctorFinding)) {
      return renderTextCenter(
        Translate(languageRedux).THE_DOCTOR_IS_NOT_AVAILABLE,
        Translate(languageRedux).PLEEASE_TRY_AGAIN_TAKE_APPOINTMENT
      )
    } else if (!typeFreeView && reload !== 1 && _.isEmpty(doctorFinding)) {
      return renderTextCenter(
        Translate(languageRedux).THE_DOCTOR_IS_NOT_AVAILABLE,
        Translate(languageRedux).PLEEASE_TRY_AGAIN_TAKE_APPOINTMENT
      )
    }
    return renderTextCenter(
      `${Translate(languageRedux).FINDING_YOUR_DOCTOR}...`,
      Translate(languageRedux).FINDING_YOUR_DOCTOR_CONTENT
    )
  }

  const renderBottomView = () => {
    if ((doctor || doctorFinding) && isActiveDoctor) {
      return (
        <View style={styles.bottomView}>
          <CustomButtonFillFix
            title={Translate(languageRedux).GO_TO_THE_VIDEO_CALL}
            btStyle={styles.bt1Style}
            onPress={() => {
              setConnectSession(true)
              setWaitCall(true)
              // onPressVideoCall(resCallDoc, ((doctor || doctorFinding)))
            }}
          />
          {/* {
            typeFreeView &&
            <CustomButtonFillFix
              title={Translate(languageRedux).TRY_ANOTHER_DOCTOR}
              btStyle={[
                styles.bt1Style,
                styles.bt2Style
              ]}
              txtStyle={styles.txtBt2Style}
              onPress={() => setReload(Math.floor(Math.random() * 100))}
            />
          } */}
        </View>
      )
    } else if (reload !== 1 && _.isEmpty(doctorFinding)) {
      return (
        <View style={styles.bottomView}>
          <CustomButtonFillFix
            title={Translate(languageRedux).TAKE_AN_APPOINTMENT}
            btStyle={styles.bt1Style}
            onPress={() => {
              setDialog(false)
              NavigationService.navigate(Routes.NEW_APPOINTMENT_SCREEN, {
                tabs: 2,
                isMyChild: isMyChild,
                nameChild: nameChild,
                birthdayChild: birthdayChild,
                talkAbout: talkAbout
              })
            }}
          />
          <CustomButtonFillFix
            title={Translate(languageRedux).DISMISS}
            btStyle={[
              styles.bt1Style,
              styles.bt2Style
            ]}
            txtStyle={styles.txtBt2Style}
            onPress={_onPressPreviewNavi}
          />
        </View>
      )
    }
    return null
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
    console.log('Ls data : ', newData)
    dispatch(saveChat(lsMsg || []))
  }

  const renderContentVideoCall = () => {
    if (resCallDoc?.apiKey && resCallDoc?.sessionId && resCallDoc?.token) {
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
              apiKey={`${resCallDoc?.apiKey || ''}`}
              sessionId={resCallDoc?.sessionId || ''}
              token={resCallDoc?.token || ''}
              eventHandlers={sessionEventHandlers}
              ref={otSessionRef}
              signal={signal}
            >
              <View style={styles.fullPositionView}>
                {
                  !isChangeScreem ?
                    renderPublisher() :
                    renderSession()
                }
              </View>
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

  // const renderChangeScreen = () => {
  //   if (!isShowMorAction) {
  //     return null
  //   }
  //   return (
  //     <TouchableOpacity
  //       onPress={() => setChangeScreen(!isChangeScreem)}
  //       style={styles.changeScreenView}>
  //       <Image source={imgDirectCall.ic_change_screen} style={styles.imgChangeScreen} />
  //     </TouchableOpacity>
  //   )
  // }

  const renderQuiz = () => {
    return (
      // <ImageBackground
      //   source={imgDirectCall.ic_bg_quiz}
      //   style={styles.quizStyles}
      // />
      <View
        style={styles.quizStyles}
      >
        <Swiper
          ref={refSwiper}
          style={styles.wrapper}
          loop={true}
          autoplay={true}
          autoplayTimeout={2}
          autoplayDirection={true}
          scrollEnabled={true}
          showsPagination={false}
          onIndexChanged={(index) => {
            console.log('Index view: ', index)
          }}
          showsButtons={false}
          nextButton={
            <View />
          }
          prevButton={
            <View />
          }
        >
          <Image style={styles.imgQuiz} source={imgDirectCall.ic_bg_quiz} />
          <Image style={styles.imgQuiz} source={imgDirectCall.ic_bg_quiz} />
          <Image style={styles.imgQuiz} source={imgDirectCall.ic_bg_quiz} />
        </Swiper>
      </View>
    )
  }

  return (
    <View style={styles.contain}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={isConnectSession ? null : imgDirectCall.ic_close}
        onPressLeft={() => {
          _onPressPreviewNavi()
          setTimeout(() => {
            NavigationService.navigateAndReset(Routes.DRAWER_NAVIGATION)
          }, 200)
        }}
        textCenter={' '}
      />
      {!isConnectSession && (renderContent())}
      {!isConnectSession && renderTextContent()}
      {!isConnectSession && renderBottomView()}
      {
        (resCallDoc) && (
          <View style={styleSession(isConnectSession).fullPositionView}>
            {(isConnectSession) && fullViewBG()}
            {(isConnectSession) && renderImageWaiting()}
            {renderContentVideoCall()}
            {isWaitCall && renderQuiz()}
            {(isConnectSession) && renderCloseView()}
            {/* {(isWaitCall || isConnectSession) && renderChangeScreen()} */}
            {(isConnectSession) && renderLSBt()}
          </View>
        )
      }
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
      {
        isDialogDrBusy && (
          <DialogCustom
            title={Translate(languageRedux).INFO_BTN}
            content={Translate(languageRedux).doctorbusy1}
            txtlLeft={Translate(languageRedux).cancel}
            onPressCancel={() => { onPressCancel() }}
            txtRight={Translate(languageRedux).homepage}
            onPressOK={_onPressPreviewNavi}
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
    backgroundColor: colorE5E5E5,
    overflow: 'hidden',
    zIndex: 1,
    elevation: 1000
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
    left: 0
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
