import { createAction } from 'redux-api-middleware'
import * as APIs from './APIs'

//CorX Data
export const apiGetPatientECG = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/getPatientECG/0`,
    method: 'GET',
    types: ['apiGetPatientECG', 'apiGetPatientECG1', 'apiGetPatientECG2']
  })

// Weight
export const apiGetMisurazioniScalx = (value, patientToken, patientId, device) => {
  if (patientToken) {
    return (
      createAction({
        endpoint: `${APIs.hostAPI}backoffice/scalx/getMisurazioniScalx/${value}?patientId=${patientId}&device=${device}`,
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'x-auth-token': patientToken
        },
        types: ['apiGetMisurazioniScalx', 'apiGetMisurazioniScalx1', 'apiGetMisurazioniScalx2']
      })
    )
  }
  return (
    createAction({
      endpoint: `${APIs.hostAPI}backoffice/scalx/getMisurazioniScalx/${value}?device=${device}`,
      method: 'GET',
      types: ['apiGetMisurazioniScalx', 'apiGetMisurazioniScalx1', 'apiGetMisurazioniScalx2']
    })
  )
}
export const apiPostWeight = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/wellness/addWeight`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiPostWeight', 'apiPostWeight1', 'apiPostWeight2']
  })

export const apiDeleteWeight = (id) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/scalx/delete/${id}`,
    method: 'DELETE',
    types: ['apiDeleteWeight', 'apiDeleteWeight1', 'apiDeleteWeight2']
  })

// blood pressure
export const apiGetMisurazioniPresx = (value, patientToken, patientId, device) => {
  if (patientToken) {
    return (
      createAction({
        endpoint: `${APIs.hostAPI}backoffice/presx/getMisurazioniPresx/${value}?patientId=${patientId}&device=${device}`,
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'x-auth-token': patientToken
        },
        types: ['apiGetMisurazioniPresx', 'apiGetMisurazioniPresx1', 'apiGetMisurazioniPresx2']
      })
    )
  }
  return (
    createAction({
      endpoint: `${APIs.hostAPI}backoffice/presx/getMisurazioniPresx/${value}?device=${device}`,
      method: 'GET',
      types: ['apiGetMisurazioniPresx', 'apiGetMisurazioniPresx1', 'apiGetMisurazioniPresx2']
    })
  )
}

export const apiPostPresx = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/presx/savePresxData`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiPostPresx', 'apiPostPresx1', 'apiPostPresx2']
  })

export const apiDeletePresx = (id) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/presx/delete/${id}`,
    method: 'DELETE',
    types: ['apiDeletePresx', 'apiDeletePresx1', 'apiDeletePresx2']
  })

//Spo2
export const apiGetSpo2Values = (number, patientToken, patientId, device) => {
  if (patientToken) {
    return (
      createAction({
        endpoint: `${APIs.hostAPI}backoffice/webecg/getSpo2Values/${number}?patientId=${patientId}&device=${device}`,
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'x-auth-token': patientToken
        },
        types: ['apiGetSpo2Values', 'apiGetSpo2Values1', 'apiGetSpo2Values2']
      })
    )
  }
  return (
    createAction({
      endpoint: `${APIs.hostAPI}backoffice/webecg/getSpo2Values/${number}?device=${device}`,
      method: 'GET',
      types: ['apiGetSpo2Values', 'apiGetSpo2Values1', 'apiGetSpo2Values2']
    })
  )
}

export const apiPostSpo2Values = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webecg/addNewSpo2`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiPostSpo2Values', 'apiPostSpo2Values1', 'apiPostSpo2Values2']
  })

//Body temperature
export const apiGetTempValues = (value, patientToken, patientId, device) => {
  if (patientToken) {
    return (
      createAction({
        endpoint: `${APIs.hostAPI}backoffice/kiosk/getTemperatureValues/${value}?patientId=${patientId}&device=${device}`,
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'x-auth-token': patientToken
        },
        types: ['apiGetTempValues', 'apiGetTempValues1', 'apiGetTempValues2']
      })
    )
  }
  return (
    createAction({
      endpoint: `${APIs.hostAPI}backoffice/kiosk/getTemperatureValues/${value}?device=${device}`,
      method: 'GET',
      types: ['apiGetTempValues', 'apiGetTempValues1', 'apiGetTempValues2']
    })
  )
}


export const apiPostNewTemp = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webecg/addNewTemp`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiPostNewTemp', 'apiPostNewTemp1', 'apiPostNewTemp2']
  })

//Heart rate
export const apiGetListExams = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/kiosk/getListExams`,
    method: 'GET',
    types: ['apiGetMisurazioniPresx', 'apiGetMisurazioniPresx1', 'apiGetMisurazioniPresx2']
  })

//Heart rate
export const apiGetHeartRateValues = (number, patientToken, patientId, device) => {
  if (patientToken) {
    return (
      createAction({
        endpoint: `${APIs.hostAPI}backoffice/kiosk/getHeartRate/${number}?patientId=${patientId}&device=${device}`,
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'x-auth-token': patientToken
        },
        types: ['apiGetHeartRateValues', 'apiGetHeartRateValues1', 'apiGetHeartRateValues2']
      })
    )
  }
  return (
    createAction({
      endpoint: `${APIs.hostAPI}backoffice/kiosk/getHeartRate/${number}?device=${device}`,
      method: 'GET',
      types: ['apiGetHeartRateValues', 'apiGetHeartRateValues1', 'apiGetHeartRateValues2']
    })
  )
}


export const apiPostHeartRate = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/wellness/addWellnessValue/2`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiPostHeartRate', 'apiPostHeartRate1', 'apiPostHeartRate2']
  })

//Vital Care Kit
export const apiGetExams = (number) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/kiosk/getExams`,
    method: 'GET',
    types: ['apiGetExams', 'apiGetExams1', 'apiGetExams2']
  })
//CorX Data
export const apiCorXData = (value) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/getPatientECG/${value}`,
    method: 'GET',
    types: ['apiGetExams', 'apiGetExams1', 'apiGetExams2']
  })
//Breathing Volumes  backoffice/disman/getPatientAirxMeasure
export const apiGetBreathingVolumes = (value, patientToken) => {
  if (patientToken) {
    return (
      createAction({
        endpoint: `${APIs.hostAPI}backoffice/disman/getBreathRate/${value}`,
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'x-auth-token': patientToken
        },
        types: ['apiGetBreathingVolumes', 'apiGetBreathingVolumes1', 'apiGetBreathingVolumes2']
      })
    )
  }
  return (
    createAction({
      endpoint: `${APIs.hostAPI}backoffice/disman/getBreathRate/${value}`,
      method: 'GET',
      types: ['apiGetBreathingVolumes', 'apiGetBreathingVolumes1', 'apiGetBreathingVolumes2']
    })
  )
}


export const apiPostBreathingVolumesWellness = (value, patientToken) => {
  if (patientToken) {
    return (
      createAction({
        endpoint: `${APIs.hostAPI}backoffice/wellness/getRespiratoryRate/${value}`,
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'x-auth-token': patientToken
        },
        types: ['apiPostBreathingVolumesWellness', 'apiPostBreathingVolumesWellness1', 'apiPostBreathingVolumesWellness2']
      })
    )
  }
  return (
    createAction({
      endpoint: `${APIs.hostAPI}backoffice/wellness/getRespiratoryRate/${value}`,
      method: 'GET',
      types: ['apiPostBreathingVolumesWellness', 'apiPostBreathingVolumesWellness1', 'apiPostBreathingVolumesWellness2']
    })
  )
}

export const apiPostBreathingVolumes = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/wellness/addRespiratoryRate`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiPostBreathingVolumes', 'apiPostBreathingVolumes1', 'apiPostBreathingVolumes2']
  })

export const apiSaveDeviceSpO2 = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/kiosk/saveSpo2`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiSaveDeviceSpO2', 'apiSaveDeviceSpO21', 'apiSaveDeviceSpO22']
  })

  export const apiSaveDeviceTemperature = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/kiosk/saveTemp`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiSaveDeviceTemperature', 'apiSaveDeviceTemperature1', 'apiSaveDeviceTemperature2']
  })
