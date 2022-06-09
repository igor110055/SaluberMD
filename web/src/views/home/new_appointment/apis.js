import * as APIs from '../../../apis'

export const apiGetListSpecial = async (id) => {
  return await fetch(`${APIs.hostAPI}backoffice/findspeciality`, {
    method: 'GET',
    headers: APIs.header
  })
}

