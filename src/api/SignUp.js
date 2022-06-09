import { createAction } from 'redux-api-middleware'
import * as APIs from './APIs'

export const apiGetServerByCode = (params) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/shared/getServerByCode`,
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(params),
    types: ['apiGetServerByCode', 'apiGetServerByCode1', 'apiGetServerByCode2']
  })

export const apiPostCheckEmail = (params) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/webdoctor/checkEmailCode`,
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(params),
    types: ['apiGetServerByCode', 'apiGetServerByCode1', 'apiGetServerByCode2']
  })

export const apiPostAddUser = (params) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/demo/addUser`,
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(params),
    types: ['apiPostAddUser', 'apiPostAddUser1', 'apiPostAddUser2']
  })
