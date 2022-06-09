import * as APIs from '../../apis'
import * as StateLocal from '../../state_local'

export const apiGetDisease = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/disease`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiGetListDisease = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/medicalData/getDiseases/${StateLocal.userinfo?.language_id || 'en_US'}`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiGetComplicationDisease = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/medicalData/getAll`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiGetAllergy = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/allergy`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiGetListAllergy = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/medicalData/getAllergies/${StateLocal.userinfo?.language_id || 'en_US'}`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiGetAllMedicine = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/medicalData/getAllMedicine`, {
    method: 'GET',
    headers: APIs.header
  })
}


export const apiGetMedication = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/medication`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiGetListDependencies = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/medicalData/getDependencies/${StateLocal.userinfo?.language_id || 'en_US'}`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiGetDependency = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/dependency`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiGetListImmunizations = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/medicalData/getImmunizations/${StateLocal.userinfo?.language_id || 'en_US'}`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiGetImmunizations= async () => {
  return await fetch(`${APIs.hostAPI}backoffice/immunization`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiGetListIrre = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/medicalData/getTests/${StateLocal.userinfo?.language_id || 'en_US'}`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiGetIrregular = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/test`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiGetListProsthesis = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/medicalData/getProsthesis/${StateLocal.userinfo?.language_id || 'en_US'}`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiGetProsthesis = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/prothesis`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiGetListHospitalizations = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/medicalData/getHospitalizations/${StateLocal.userinfo?.language_id || 'en_US'}`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiGetHospitalizations = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/hospitalization`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiGetListCategoryFile = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/util/getCategorieFiles`, {
    method: 'GET',
    headers: APIs.header
  })
}

export const apiGetListDocument = async () => {
  return await fetch(`${APIs.hostAPI}backoffice/disman/getFiles`, {
    method: 'GET',
    headers: APIs.header
  })
}

