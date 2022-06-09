import { createAction } from 'redux-api-middleware'
import * as APIs from './APIs'

export const apiGetVersion = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/jws/rc/check/11`,
    method: 'POST',
    types: ['apiCheckVer', 'apiCheckVer1', 'apiCheckVer2']
  })
