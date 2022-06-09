import { createAction } from 'redux-api-middleware'
import * as APIs from './APIs'

export const apiGetCheckConnection = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/videocall/checkConnection`,
    method: 'GET',
    types: [
      'apiGetCheckConnection',
      'apiGetCheckConnection1',
      'apiGetCheckConnection2'
    ]
  })

export const apiGetIsSubmember = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/family/isSubmember`,
    method: 'GET',
    types: [
      'apiGetIsSubmember',
      'apiGetIsSubmember1',
      'apiGetIsSubmember2'
    ]
  })


//Check when click appointment
export const apiGetChiamadottore = (id) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/chiamadottore/${id}`,
    method: 'GET',
    types: [
      'apiGetChiamadottore',
      'apiGetChiamadottore1',
      'apiGetChiamadottore2'
    ]
  })

export const apiRegisterPush = (params) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/jws/rc/registerPush`,
    method: 'POST',
    body: JSON.stringify(params),
    types: [
      'apiRegisterPush',
      'apiRegisterPush1',
      'apiRegisterPush2'
    ]
  })

export const apiPostSurvey = (params) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/saveSurvey`,
    method: 'POST',
    body: JSON.stringify(params),
    types: [
      'apiGetSurvey',
      'apiGetSurvey1',
      'apiGetSurvey2'
    ]
  })

export const apiGetCheckWhitelist = (id) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/videocall/checkWhitelist`,
    method: 'POST',
    types: [
      'apiPostVideoCallAccept',
      'apiPostVideoCallAccept1',
      'apiPostVideoCallAccept2'
    ]
  })

export const apiPostVideoCallAccept = (id) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/videocall/accept/${id}`,
    method: 'POST',
    types: [
      'apiPostVideoCallAccept',
      'apiPostVideoCallAccept1',
      'apiPostVideoCallAccept2'
    ]
  })

export const apiPostCheckBMP = (param) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/emoji/checkBMP`,
    method: 'POST',
    body: JSON.stringify(param),
    types: [
      'apiPostCheckBMP',
      'apiPostCheckBMP1',
      'apiPostCheckBMP2'
    ]
  })

export const apiGetOnlineDoctors = (id) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/getOnlineDoctors/${id}`,
    method: 'GET',
    types: [
      'apiGetOnlineDoctors',
      'apiGetOnlineDoctors1',
      'apiGetOnlineDoctors2'
    ]
  })

export const apiGetCheckPayment = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/videocall/checkPayment`,
    method: 'GET',
    types: [
      'apiGetCheckPayment',
      'apiGetCheckPayment1',
      'apiGetCheckPayment2'
    ]
  })

export const apiGetHasEprescribing = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/disman/hasEprescribing`,
    method: 'GET',
    types: [
      'apiGetHasEprescribing',
      'apiGetHasEprescribing1',
      'apiGetHasEprescribing2'
    ]
  })

export const apiCallDoctor = (id, room) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/videocall/callDoctor/${id}/${room}`,
    method: 'POST',
    types: [
      'apiCallDoctor',
      'apiCallDoctor1',
      'apiCallDoctor2'
    ]
  })

export const apiCheckStatusCall = (id) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/videocall/checkStatusCall/${id}`,
    method: 'GET',
    types: [
      'apiCheckStatusCall',
      'apiCheckStatusCall1',
      'apiCheckStatusCall2'
    ]
  })

export const apiPostEndCall = (id) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/videocall/endCall/${id}`,
    method: 'POST',
    types: [
      'apiPostEndCall',
      'apiPostEndCall1',
      'apiPostEndCall2'
    ]
  })

export const apiGetSendNoAnswerNotification = (id) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/sendNoAnswerNotification/${id}`,
    method: 'GET',
    types: [
      'apiGetSendNoAnswerNotification',
      'apiGetSendNoAnswerNotification1',
      'apiGetSendNoAnswerNotification2'
    ]
  })

export const apiGetCheckStatusCall = (id) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/videocall/checkStatusCall/${id}`,
    method: 'GET',
    types: [
      'apiGetCheckStatusCall',
      'apiGetCheckStatusCall1',
      'apiGetCheckStatusCall2'
    ]
  })

export const apiPostSendPosition = (params) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/jws/rc/sendPosition`,
    method: 'POST',
    body: JSON.stringify(params),
    types: [
      'apiPostSendPosition',
      'apiPostSendPosition1',
      'apiPostSendPosition2'
    ]
  })




