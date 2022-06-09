import { createAction } from 'redux-api-middleware'
import * as APIs from './APIs'

export const apiGetCheckPayment = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/videocall/checkPayment`,
    method: 'GET',
    types: ['apiGetCheckPayment', 'apiGetCheckPayment1', 'apiGetCheckPayment2']
  })

export const apiGetLegalDisclaimer = (idmedico) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/getLegalDisclaimer/1/${idmedico}`,
    method: 'GET',
    types: ['apiGetLegalDisclaimer', 'apiGetLegalDisclaimer1', 'apiGetLegalDisclaimer2']
  })

export const apiPostSaveAgreedDisclaimer = (heades) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/saveAgreedDisclaimer`,
    method: 'POST',
    headers: heades,
    types: ['apiPostSaveAgreedDisclaimer', 'apiPostSaveAgreedDisclaimer1', 'apiPostSaveAgreedDisclaimer2']
  })

export const apiGetPaypalURL = (currency) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/getPaypalScriptURL/${currency}`,
    method: 'GET',
    types: ['apiGetPaypalURL', 'apiGetPaypalURL1', 'apiGetPaypalURL2']
  })

export const apiGetMPayRetrieveCards = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/mpay/retrieveCards`,
    method: 'GET',
    types: ['apiGetMPayRetrieveCards', 'apiGetMPayRetrieveCards1', 'apiGetMPayRetrieveCards2']
  })

export const apiGetRetrievePaymentMethods = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/mpay/retrievePaymentMethods`,
    method: 'GET',
    types: ['apiGetRetrievePaymentMethods', 'apiGetRetrievePaymentMethods1', 'apiGetRetrievePaymentMethods2']
  })

export const apiPostCreateOrderMPAY = (params) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/mpay/createOrder`,
    method: 'POST',
    body: JSON.stringify(params),
    types: ['apiPostCreateOrder', 'apiPostCreateOrder1', 'apiPostCreateOrder2']
  })

export const apiGetCheckOrderStatusMPAY = (id) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/mpay/checkOrderStatus/${id}`,
    method: 'GET',
    types: ['apiGetCheckOrderStatusMPAY', 'apiGetCheckOrderStatusMPAY1', 'apiGetCheckOrderStatusMPAY2']
  })
