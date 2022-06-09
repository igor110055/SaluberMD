import { createAction } from 'redux-api-middleware'
import * as APIs from './APIs'

export const apiGetDetailReminder = (id) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/pillsreminder/getMedicineNameHTs/${id}`,
    method: 'GET',
    types: ['apiGetDetailReminder', 'apiGetDetailReminder1', 'apiGetDetailReminder2']
  })

export const apiPutReminder = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/pillsreminder/reminderNotification/`,
    method: 'PUT',
    body: JSON.stringify(body),
    types: ['apiPutReminder', 'apiPutReminder1', 'apiPutReminder2']
  })

export const apiGetReminderReasons = () =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/pillsreminder/getReasons/1`,
    method: 'GET',
    types: ['apiGetReminderReasons', 'apiGetReminderReasons1', 'apiGetReminderReasons2']
  })

export const apiPostReminderReject = (body) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/pillsreminder/rejectMedicine`,
    method: 'POST',
    body: JSON.stringify(body),
    types: ['apiPostReminderReject', 'apiPostReminderReject1', 'apiPostReminderReject2']
  })

export const apiPutReminderTaken = (idMed, date, reminderId) =>
  createAction({
    endpoint: `${APIs.hostAPI}backoffice/pillsreminder/markAsTaken/${idMed}/${date}/${reminderId}`,
    method: 'PUT',
    types: ['apiPostReminderReject', 'apiPostReminderReject1', 'apiPostReminderReject2']
  })
