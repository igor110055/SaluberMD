import { createAction } from 'redux-api-middleware'
import * as APIs from './APIs'

export const apiPostSurveyDoctor = (id, params) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/saveSurveyDoctor/${id}`,
    method: 'POST',
    body: JSON.stringify(params),
    types: ['apiPostSurveyDoctor', 'apiPostSurveyDoctor1', 'apiPostSurveyDoctor2']
  })

export const apiGetCallPatient = (id, idPatient) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/videocall/callPatient/${id}/${idPatient}`,
    method: 'GET',
    types: ['apiGetCallPatient', 'apiGetCallPatient1', 'apiGetCallPatient2']
  })
