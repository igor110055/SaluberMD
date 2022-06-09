import { createAction } from 'redux-api-middleware'
import * as APIs from './APIs'

export const apiGetAppointmentActionSearch = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/appointment?action=search`,
    method: 'GET',
    types: ['apiGetAppointmentActionSearch', 'apiGetAppointmentActionSearch1', 'apiGetAppointmentActionSearch3']
  })

export const apiGetAppointmentMonth = (date) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/appointmentsByMonth?date=${date}`,
    method: 'GET',
    types: ['apiGetAppointmentMonth', 'apiGetAppointmentMonth1', 'apiGetAppointmentMonth2']
  })

export const apiGetSlotDuration = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/app/getSlotDuration`,
    method: 'GET',
    types: ['apiGetSlotDuration', 'apiGetSlotDuration1', 'apiGetSlotDuration2']
  })

export const apiPostAppointment = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/appointment`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiGetSlotDuration', 'apiGetSlotDuration1', 'apiGetSlotDuration2']
  })

export const apiDeleteAllAppointment = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/delete/appointment`,
    method: 'PUT',
    body: JSON.stringify(body),
    types: ['apiDeleteAllAppointment', 'apiDeleteAllAppointment1', 'apiDeleteAllAppointment2']
  })

export const apiDeleteAppointment = (id, body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/appointment/${id}`,
    method: 'DELETE',
    body: JSON.stringify(body),
    types: ['apiDeleteAppointment', 'apiDeleteAppointment1', 'apiDeleteAppointment2']
  })

export const apiGenerateUrlAppointment = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/kiosk/generateUrlAppointment`,
    method: 'GET',
    types: ['apiGenerateUrlAppointment', 'apiGenerateUrlAppointment1', 'apiGenerateUrlAppointment2']
  })

export const apiPostAppointmentSeries = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/appointmentSeries`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiPostAppointmentSeries', 'apiPostAppointmentSeries1', 'apiPostAppointmentSeries2']
  })
