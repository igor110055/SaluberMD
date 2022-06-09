import { createAction } from 'redux-api-middleware'
import * as APIs from '../../../../api/APIs'

//CorX Data
export const apiGetPatientECG = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/getPatientECG/0`,
    method: 'GET',
    types: ['apiGetPatientECG', 'apiGetPatientECG1', 'apiGetPatientECG2']
  })

// Weight
export const apiGetWeightDr = (value, patientId) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/scalx/getMisurazioniScalx/${value}?patientId=${patientId}`,
    method: 'GET',
    types: ['apiGetMisurazioniScalx', 'apiGetMisurazioniScalx1', 'apiGetMisurazioniScalx2']
  })

// blood pressure
export const apiGetBloodPressDr = (value, patientId) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/presx/getMisurazioniPresx/${value}?patientId=${patientId}`,
    method: 'GET',
    types: ['apiGetMisurazioniPresx', 'apiGetMisurazioniPresx1', 'apiGetMisurazioniPresx2']
  })

//Spo2
export const apiGetSpo2Dr = (number, patientId) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webecg/getSpo2Values/${number}?patientId=${patientId}`,
    method: 'GET',
    types: ['apiGetSpo2Values', 'apiGetSpo2Values1', 'apiGetSpo2Values2']
  })

//Body temperature
export const apiGetTempDr = (value, patientId) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/kiosk/getTemperatureValues/${value}?patientId=${patientId}`,
    method: 'GET',
    types: ['apiGetTempValues', 'apiGetTempValues1', 'apiGetTempValues2']
  })

//Heart rate
export const apiGetListExams = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/kiosk/getListExams`,
    method: 'GET',
    types: ['apiGetMisurazioniPresx', 'apiGetMisurazioniPresx1', 'apiGetMisurazioniPresx2']
  })

//Heart rate
export const apiGetHeartRateDr = (number, patientId) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/kiosk/getHeartRateValues/${number}?patientId=${patientId}`,
    method: 'GET',
    types: ['apiGetHeartRateValues', 'apiGetHeartRateValues1', 'apiGetHeartRateValues2']
  })

//Vital Care Kit
export const apiGetExams = (number) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/kiosk/getExams`,
    method: 'GET',
    types: ['apiGetExams', 'apiGetExams1', 'apiGetExams2']
  })

//CorX Data
export const apiCorXData = (value, patientId) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/getPatientECG/${value}?patientId=${patientId}`,
    method: 'GET',
    types: ['apiGetExams', 'apiGetExams1', 'apiGetExams2']
  })

//Breathing Volumes  backoffice/disman/getPatientAirxMeasure
export const apiGetBreathingVolumesDr = (value) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/disman/getBreathRate/${value}`,
    method: 'GET',
    types: ['apiGetBreathingVolumes', 'apiGetBreathingVolumes1', 'apiGetBreathingVolumes2']
  })

export const apiGetBreathingVolumesDoctor = (value, patientId) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/wellness/getRespiratoryRate/${value}?patientId=${patientId}`,
    method: 'GET',
    types: ['apiPostBreathingVolumesWellness', 'apiPostBreathingVolumesWellness1', 'apiPostBreathingVolumesWellness2']
  })
