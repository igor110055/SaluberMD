import { createAction } from 'redux-api-middleware'
import * as APIs from './APIs'

export const apiGetLanguages = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/util/getAllLingue`,
    method: 'GET',
    types: ['apiGetLanguages', 'apiGetLanguages1', 'apiGetLanguages2']
  })

export const apiGetDiseases = (en) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/medicalData/getDiseases/${en || 'en_US'}`,
    method: 'GET',
    types: ['apiGetLanguages', 'apiGetLanguages1', 'apiGetLanguages2']
  })

export const apiGetSpecialty = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/getSpecialty`,
    method: 'GET',
    types: ['apiGetSpecialty', 'apiGetSpecialty1', 'apiGetSpecialty2']
  })

export const apiGetTicket = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/getTickets`,
    method: 'GET',
    types: ['apiGetTicket', 'apiGetTicket1', 'apiGetTicket2']
  })

export const apiPostTicket = (params) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/ticket`,
    method: 'POST',
    body: JSON.stringify(params),
    types: ['apiPostTicket', 'apiPostTicket1', 'apiPostTicket2']
  })
