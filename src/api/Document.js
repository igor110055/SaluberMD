import { createAction } from 'redux-api-middleware'
import * as APIs from './APIs'

export const apiGetCategoryFile = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/util/getCategorieFiles`,
    method: 'GET',
    types: ['apiGetCategoryFile', 'apiGetCategoryFile1', 'apiGetCategoryFile2']
  })

export const apiPOSTImage = (param) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/image`,
    method: 'POST',
    body: JSON.stringify(param),
    types: ['apiPostImg', 'apiPostImg1', 'apiPostImg2']
  })

export const apiGetDocument = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/disman/getFiles`,
    method: 'GET',
    types: ['apiGetDoc', 'apiGetDoc1', 'apiGetDoc2']
  })
