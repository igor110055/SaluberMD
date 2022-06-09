import { createAction } from 'redux-api-middleware'
import * as APIs from './APIs'

export const apiGetFees = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/getFees`,
    method: 'GET',
    types: ['apiGetFees', 'apiGetFees1', 'apiGetFees2']
  })

export const apiGetIniziative = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/util/getUserIniziative`,
    method: 'GET',
    types: ['apiGetIniziative', 'apiGetIniziative1', 'apiGetIniziative2']
  })

export const apiGetCurrencies = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/util/getCurrencies`,
    method: 'GET',
    types: ['apiGetCurrencies', 'apiGetCurrencies1', 'apiGetCurrencies2']
  })

export const apiGetVisitType = (id) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/getVisitTypes/${id}`,
    method: 'GET',
    types: ['apiGetVisitType', 'apiGetVisitType1', 'apiGetVisitType2']
  })

export const apiPostFees = (params) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/addFee`,
    method: 'POST',
    body: JSON.stringify(params),
    types: ['apiPostFees', 'apiPostFees1', 'apiPostFees2']
  })

export const apiPutFees = (params) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/updateFee`,
    method: 'PUT',
    body: JSON.stringify(params),
    types: ['apiPutFees', 'apiPutFees1', 'apiPutFees2']
  })
