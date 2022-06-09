import * as APIs from '../../apis'

export const apiGetDetail = async (id) => {
  return await fetch(`${APIs.hostAPI}backoffice/getSurvey/${id}`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiGetFindoctor = async (specialityID) => {
  return await fetch(`${APIs.hostAPI}backoffice/findoctor/${specialityID}`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiGetFindslotTimezone = async (doctorID, timezone) => {
  return await fetch(`${APIs.hostAPI}backoffice/findslot/${doctorID}/${timezone}`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiPostNewAppointment = async (param) => {
  return await fetch(`${APIs.hostAPI}backoffice/newAppointment`, {
    method: 'POST',
    body: JSON.stringify(param),
    headers: APIs.header
  })
}

export const apiPostAddSlotRequest = async (param) => {
  return await fetch(`${APIs.hostAPI}backoffice/addSlotRequest`, {
    method: 'POST',
    body: JSON.stringify(param),
    headers: APIs.header
  })
}

export const apiGetListappointment = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/listappointment`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiGetRequestsByPatientId = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/getRequestsByPatientId`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiGetVisitHistoryApp = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/webdoctor/getVisitHistoryApp/0`, {
    method: 'GET',
    headers: APIs.header
  })
}

