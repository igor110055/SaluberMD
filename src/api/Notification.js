import { createAction } from 'redux-api-middleware'
import * as APIs from './APIs'

export const apiGetNotificaiton = (page) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/notificationHistoryApp/${page}`,
    method: 'GET',
    types: ['apiGetNotificaiton', 'apiGetNotificaiton1', 'apiGetNotificaiton2']
  })

export const apiPutReadNotificaiton = (id) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/markAsRead/${id}`,
    method: 'PUT',
    types: ['apiPutReadNotificaiton', 'apiPutReadNotificaiton1', 'apiPutReadNotificaiton2']
  })

export const apiDeleteAllNotificaiton = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/hideNotifications`,
    method: 'DELETE',
    types: ['apiDeleteAllNotificaiton', 'apiDeleteAllNotificaiton1', 'apiDeleteAllNotificaiton2']
  })

export const apiGetNotificaitonType = (page, type) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/getNotifications/${page}?section=${type}`,
    method: 'GET',
    types: ['apiGetNotificaitonType', 'apiGetNotificaitonType1', 'apiGetNotificaitonType2']
  })//type == 0 Alert || type === 1 Message

export const apiGenerateTokenEmergencyLogin = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/generateTokenEmergencyLogin`,
    method: 'GET',
    types: ['apiGenerateTokenEmergencyLogin', 'apiGenerateTokenEmergencyLogin1', 'apiGenerateTokenEmergencyLogin2']
  })

export const apiCountNotification = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/countUnreadNotifications`,
    method: 'GET',
    types: ['apiCountNotification', 'apiCountNotification1', 'apiCountNotification2']
  })

export const apiDeleteNotificationWithType = (id) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/hideAlertsOrMessages?section=${id}`,
    method: 'DELETE',
    // body: JSON.stringify(body),
    types: ['apiDeleteNotificationWithType', 'apiDeleteNotificationWithType1', 'apiDeleteNotificationWithType2']
  })


export const apiGetNotificationDoctor = (page) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/notificationHistoryApp/${page}`,
    method: 'GET',
    types: ['apiGetNotificationDoctor', 'apiGetNotificationDoctor1', 'apiGetNotificationDoctor2']
  })
