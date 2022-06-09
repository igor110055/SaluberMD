import { createAction } from 'redux-api-middleware'
import * as APIs from './APIs'

export const apiGetMagazine = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/getHealthAndNutritionArticles`,
    method: 'GET',
    types: ['apiGetMagazine', 'apiGetMagazine1', 'apiGetMagazine2']
})
