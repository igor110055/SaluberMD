import * as APIs from '../../apis'

export const apiPreLogin = async (body) => {
  return await fetch(`${APIs.hostAPI}backoffice/preLogin`, {
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
      'access-control-request-headers': 'X-AUTH-TOKEN',
      'X-Requested-With': 'com.salubermd.saluber'
    },
    body: body
  })
}

export const apiAuth = async (body) => {
  return await fetch(`${APIs.hostAPI}backoffice/auth`, {
    method: 'POST',
    headers: {
      Accept: '*/*',
      'access-control-request-headers': 'X-AUTH-TOKEN',
      'Content-Type': 'application/json'
    },
    body: body
  })
}
