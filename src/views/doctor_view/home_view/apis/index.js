import { createAction } from 'redux-api-middleware'
import * as APIs from '../../../../api/APIs'

export const apiGetOnlineStatus = (uuid) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/videocall/getOnlineStatus/${uuid}`,
    method: 'GET',
    types: ['apiGetOnlineStatus', 'apiGetOnlineStatus1', 'apiGetOnlineStatus2']
  })

export const apiSwitchOnlineStatus = (uuid) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/videocall/switchOnlineStatus/${uuid}`,
    method: 'POST',
    types: ['preLoapiSwitchOnlineStatusgin', 'apiSwitchOnlineStatus1', 'apiSwitchOnlineStatus2']
  })
