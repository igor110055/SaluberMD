import { createAction } from 'redux-api-middleware'
import * as APIs from './APIs'
import * as defines from '../constants/define'
import DeviceInfo from 'react-native-device-info'

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

export const apiPharmacy = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/getFavouritesFarmacy`,
    method: 'GET',
    types: ['apiPharmacy', 'apiPharmacy1', 'apiPharmacy2']
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

export const apiCheckPermission = (params) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/jws/rc/check/11`,
    method: 'POST',
    body: JSON.stringify(params),
    types: ['apiCheckPermission', 'apiCheckPermission1', 'apiCheckPermission2']
  })

export const apiPostDisease = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/disease`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiPostDisease', 'apiPostDisease1', 'apiPostDisease2']
  })

export const apiPostAllergy = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/allergy`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiPostAllergy', 'apiPostAllergy1', 'apiPostAllergy2']
  })

export const apiPostMedication = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/medication`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiPostMedication', 'apiPostMedication1', 'apiPostMedication2']
  })

export const apiPostDependency = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/dependency`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiPostDependency', 'apiPostDependency1', 'apiPostDapiPostDependency2isease2']
  })

export const apiPostHospitalization = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/hospitalization`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiPostHospitalization', 'apiPostHospitalization1', 'apiPostHospitalization2']
  })

export const apiPostImmunization = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/immunization`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiPostImmunization', 'apiPostImmunization1', 'apiPostImmunization2']
  })

export const apiPostIrregular = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/test`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiPostIrregular', 'apiPostIrregular1', 'apiPostIrregular2']
  })

export const apiPostProthesis = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/prothesis`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiPostProthesis', 'apiPostProthesis1', 'apiPostProthesis2']
  })
