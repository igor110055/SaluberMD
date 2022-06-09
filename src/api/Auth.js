import { createAction } from 'redux-api-middleware'
import * as APIs from './APIs'
import * as defines from '../constants/define'

export const apiPreLogin = (params) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/preLogin`,
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
      'access-control-request-headers': 'X-AUTH-TOKEN',
      'X-Requested-With': 'com.salubermd.saluber'
    },
    body: params,
    types: ['preLogin', 'preLogin1', 'preLogin2']
  })

export const apiAuth = (params) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/auth`,
    method: 'POST',
    headers: {
      Accept: '*/*',
      'access-control-request-headers': 'X-AUTH-TOKEN',
      'Content-Type': 'application/json'
    },
    body: params,
    types: ['auth', 'auth1', 'auth2']
  })


export const apiGetUserInfo = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/getUserInfo`,
    method: 'GET',
    types: ['apiGetUserInfo', 'apiGetUserInfo1', 'apiGetUserInfo2']
  })

export const apiTerms = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/registration/getTermsByInitiative/1`,
    method: 'GET',
    types: ['apiTerms', 'apiTerms1', 'apiTerms2']
  })

export const apiPrivacy = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/registration/getPrivacyByInitiative/1`,
    method: 'GET',
    types: ['apiPrivacy', 'apiPrivacy1', 'apiPrivacy2']
  })

export const apiAllergies = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/medicalData/getAllergies/${defines.language}`,
    method: 'GET',
    types: ['apiAllergies', 'apiAllergies1', 'apiAllergies2']
  })

export const apiDisease = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/medicalData/getDiseases/${defines.language}`,
    method: 'GET',
    types: ['apiDisease', 'apiDisease1', 'apiDisease2']
  })

export const apiHealthProfile = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/medicalData/getAllMedicalFile`,
    method: 'GET',
    types: ['apiHealthProfile', 'apiHealthProfile1', 'apiHealthProfile2']
  })

export const apiCountry = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/util/getCountries`,
    method: 'GET',
    types: ['apiCountry', 'apiCountry1', 'apiCountry2']
  })

export const apiMedicine = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/pillsreminder/getAllPatientReminder`,
    method: 'GET',
    types: ['apiMedicine', 'apiMedicine1', 'apiMedicine2']
  })

export const apiICD10 = (txtSearch) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/disease?chiave=${txtSearch}`,
    method: 'GET',
    types: ['apiMedicine', 'apiMedicine1', 'apiMedicine2']
  })

export const apiUpdatePersonalInfo = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/updatePatientCustomProfile`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiUpdatePersonalInfo', 'apiUpdatePersonalInfo1', 'apiUpdatePersonalInfo2']
  })

export const apiUploadImageUser = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/updateUserImage`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiUploadImageUser', 'apiUploadImageUser1', 'apiUploadImageUser2']
  })

export const apiPostChangePassword = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/changePassword`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiPostChangePassword', 'apiPostChangePassword1', 'apiPostChangePassword2']
  })

export const apiPostResetPassword = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/generatePasswordReset`,
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json'
    },
    types: ['apiPostResetPassword', 'apiPostResetPassword1', 'apiPostResetPassword2']
  })

export const apiPostRegisterPush = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/jws/rc/registerPush`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiPostRegisterPush', 'apiPostRegisterPush1', 'apiPostRegisterPush2']
  })

export const apiPostGetServerByUser = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/shared/getServerByUser`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiPostGetServerByUser', 'apiPostGetServerByUser1', 'apiPostGetServerByUser2']
  })

export const apiPostUnregisterPush = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/jws/rc/unregisterPush`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiPostUnregisterPush', 'apiPostUnregisterPush1', 'apiPostUnregisterPush2']
  })

export const apiGetSummary = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/summary?action=search&chiave=`,
    method: 'GET',
    types: ['apiGetSummary', 'apiGetSummary1', 'apiGetSummary2']
  })

export const apiGetVirtualOffice = (id) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/getVirtualOffice${id ? `/${id}` : ''}`,
    method: 'GET',
    types: ['apiGetVirtualOffice', 'apiGetVirtualOffice1', 'apiGetVirtualOffice2']
  })

export const apiUpdateVirtualOffice = (params) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/updateVirtualOffice`,
    method: 'POST',
    body: JSON.stringify(params),
    types: ['apiUpdateVirtualOffice', 'apiUpdateVirtualOffice1', 'apiUpdateVirtualOffice2']
  })
