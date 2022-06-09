import { createAction } from 'redux-api-middleware'
import * as APIs from './APIs'

export const apiGetAllergy = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/allergy`,
    method: 'GET',
    types: ['apiGetAllergy', 'apiGetAllergy1', 'apiGetAllergy2']
  })

export const apiPOSTAllergy = (param) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/allergy`,
    method: 'POST',
    body: JSON.stringify(param),
    types: ['apiGetAllergy', 'apiGetAllergy1', 'apiGetAllergy2']
  })

export const apiGetAllergyWithId = (id) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/allergy/${id}`,
    method: 'GET',
    types: ['apiGetAllergyWithId', 'apiGetAllergyWithId1', 'apiGetAllergyWithId2']
  })
