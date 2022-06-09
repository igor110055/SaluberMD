import { createAction } from 'redux-api-middleware'
import * as APIs from '../../../api/APIs'

export const apiGetNotificationCheck = (param) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/notificationCheck`,
    method: 'POST',
    body: JSON.stringify(param),
    types: ['apiGetNotificationCheck', 'apiGetNotificationCheck1', 'apiGetNotificationCheck2']
  })

export const apiGetSurveyIdReq = (idReq) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/getSurvey/${idReq}`,
    method: 'GET',
    types: ['apiGetSurvey', 'apiGetSurvey1', 'apiGetSurvey2']
  })

export const apiGetCategoryListByPatinet = (userId) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/kiosk/getCategoryListByPatinet/${userId}`,
    method: 'GET',
    types: ['apiGetCategoryListByPatinet', 'apiGetCategoryListByPatinet1', 'apiGetCategoryListByPatinet2']
  })

export const apiPostDecline = (idReq) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/videocall/decline/${idReq}`,
    method: 'POST',
    types: ['apiPostDecline', 'apiPostDecline1', 'apiPostDecline2']
  })

export const apiPostAcceptCall = (idReq) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/videocall/accept/${idReq}`,
    method: 'POST',
    types: ['apiPostAcceptCall', 'apiPostAcceptCall1', 'apiPostAcceptCall2']
  })

export const apiGetSurveyBOIdReq = (idReq) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/getSurveyBO/${idReq}`,
    method: 'GET',
    types: ['apiGetSurveyBO', 'apiGetSurveyBO1', 'apiGetSurveyBO2']
  })

export const apiGetCallInfo = (idReq) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/getCallInfo/${idReq}`,
    method: 'GET',
    types: ['apiGetCallInfo', 'apiGetCallInfo1', 'apiGetCallInfo2']
  })
