import * as APIs from '../../apis'

export const apiUserInfo = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/webdoctor/getUserInfo`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiCheckPermission = async (body) => {
  return await fetch(`${APIs.hostAPI}backoffice/jws/rc/check/11`, {
    method: 'POST',
    headers: APIs.header,
    body: JSON.stringify(body)
  })
}

export const apiListAppointment = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/listappointment`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiListPharmacies = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/getFavouritesFarmacy`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiGetMagazine = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/getHealthAndNutritionArticles`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiPostCheckBMP = async (param) => {
  return await fetch(`${APIs.hostAPI}backoffice/emoji/checkBMP`, {
    method: 'POST',
    headers: APIs.header,
    body: JSON.stringify(param)
  })
}

export const apiGetOnlineDoctors = async (id) =>{
  return await fetch(`${APIs.hostAPI}backoffice/webdoctor/getOnlineDoctors/${id}`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiPostSaveSurvey = async (param) => {
  return await fetch(`${APIs.hostAPI}backoffice/webdoctor/saveSurvey`, {
    method: 'POST',
    headers: APIs.header,
    body: JSON.stringify(param)
  })
}

export const apiCallDoctor = async (id, room) => {
  return await fetch(`${APIs.hostAPI}backoffice/videocall/callDoctor/${id}/${room}`, {
    method: 'POST',
    headers: APIs.header
  })
}

export const apiGetHasEprescribing = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/disman/hasEprescribing`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiGetCheckStatusCall = async (id) => {
  return await fetch(`${APIs.hostAPI}backoffice/videocall/checkStatusCall/${id}`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiGetCountries = async (id) => {
  return await fetch(`${APIs.hostAPI}backoffice/util/getCountries`, {
    method: 'GET',
    headers: APIs.header
  })
}