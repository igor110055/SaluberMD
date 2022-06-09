import { createAction } from 'redux-api-middleware'
import * as APIs from './APIs'

export const apiGetAllMembers = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/family/getAllMembers`,
    method: 'GET',
    types: ['apiGetAllMembers', 'apiGetAllMembers1', 'apiGetAllMembers2']
  })

export const apiGetParentId = (id) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/family/getParentId/${id}`,
    method: 'GET',
    types: ['apiGetParentId', 'apiGetParentId1', 'apiGetParentId2']
  })

export const apiGetSharedCodeByUserId = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/shared/getSharedCodeByUserId`,
    method: 'GET',
    types: ['getSharedCodeByUserId', 'getSharedCodeByUserId1', 'getSharedCodeByUserId2']
  })

export const apiGetServerByCode = (params) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/shared/getServerByCode`,
    method: 'POST',
    body: JSON.stringify(params),
    types: ['apiGetServerByCode', 'apiGetServerByCode1', 'apiGetServerByCode2']
  })

export const apiPutEnterApp = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/enterApp`,
    method: 'PUT',
    body: JSON.stringify({}),
    types: ['apiPutEnterApp', 'apiPutEnterApp1', 'apiPutEnterApp2']
  })

export const apiPOSTSwitchToMainUser = (param) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/family/switchToMainUser`,
    method: 'POST',
    body: JSON.stringify(param),
    types: ['apiPOSTSwitchToMainUser', 'apiPOSTSwitchToMainUser1', 'apiPOSTSwitchToMainUser2']
  })
