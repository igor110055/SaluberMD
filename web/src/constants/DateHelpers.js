import moment from 'moment'
import 'moment'
import { extendMoment } from 'moment-range'

export function getDate112000() {
  return moment('2000-01-01T00:00:00').format('YYYY-MM-DDTHH:mm:ss')
}

export function convertStringToDate(date) {
  return moment(date).format('YYYY-MM-DDTHH:mm:ss')
}

export function getDateNow() {
  return moment(new Date()).format('DD/MM/YYYY')
}

export function convertDay(date) {
  return moment(date).format('D')
}

export function convertYear(date) {
  return moment(date).format('YYYY')
}

export function convertYYYYMMDD(date) {
  return moment(date).format('YYYY-MM-DD')
}

export function convertCalenderDDMMYYYY(date) {
  return moment(date).format('DD.MM.YYYY')
}

export function convertCalenderDMMM(date) {
  return moment(new Date(date)).format('D MMM')
}

export function convertNumberTime(date) {
  return moment(date).format('HH:mm')
}

export function convertNumberTime12(date) {
  return moment(date).format('H:mm')
}

export function convertDateTime(date) {
  return moment(date).format('D MMM, dddd')
}

export function convertDateForDocument(date) {
  return moment(date).format('MMMM D, YYYY')
}

export function convertBirthdate(date) {
  return moment(date).format('D MMMM YYYY')
}

export function convertDatePushSever(date) {
  return moment.utc(date).format('YYYY-MM-DD')
}

export function getRangeOfDates(start, end, key, arr = [start.startOf(key)]) {
  if (!start || !end) {
    return []
  }
  const next = moment(start).add(1, key).startOf(key)
  if (next.isAfter(end, key)) {
    return arr.concat(next)
  }
  return getRangeOfDates(next, end, key, arr.concat(next))
}

export function startOfMonth(month) {
  return moment(month).startOf('month')
}

export function subtractNumberMonth(num, month) {
  return moment(month).subtract(num, 'months')
}

export function addNumberMonth(num, month) {
  return moment(month).add(num, 'months')
}

export function subtractNumberDay(num, day) {
  return moment(day).subtract(num, 'days')
}

export function addNumberDay(num, day) {
  return moment(day).add(num, 'days')
}

export function ranageDate(startDate, endDate) {
  const momentRange = extendMoment(moment)
  const strStart = convertYYYYMMDD(startDate)
  const strEnd = convertYYYYMMDD(endDate)
  return momentRange.range(strStart, strEnd)
}

export function convertDateDDMMYYYYToSever(date) {
  return moment.utc(date).format('YYYY-MM-DDT00:00:00.sss') + 'Z'
}

export function convertDateDDMMYYYYMMssToSever(date) {
  const local = moment(date).format('YYYY-MM-DDTHH:mm:ss.sssZ')
  return moment.utc(local).format('YYYY-MM-DDTHH:mm:ss.sss') + 'Z'
}

export function convertDateHH(date) {
  const local = moment(date).format('YYYY-MM-DDTHH:mm:ss.sssZ')
  return moment(local).format('HH')
}

export function convertDatemm(date) {
  const local = moment(date).format('YYYY-MM-DDTHH:mm:ss.sssZ')
  return moment(local).format('mm')
}

export function converToUTC(date) {
  return moment.utc(date).format('YYYY-MM-DDTHH:mm:ss.sssZ')
}

export function converLocalToSever(date) {
  return moment(date).local().format('YYYY-MM-DDTHH:mm:ss.sss') + 'Z'
}

export function converToLocal(date) {
  return moment(date).local().format('YYYY-MM-DDTHH:mm:ss.sssZ')
}

export function convertNumberToDDMMMYYYYHHmm(date) {
  const data = converToLocal(Number(date))
  return moment(data).format('DD MMM YYYY - HH:mm')
}

export function convertNumberToDDMMMYYYY(date) {
  const data = converToLocal(Number(date))
  return moment(data).format('DD MMM YYYY')
}

export function convertDateToDDMMMYYYYHHmm(date) {
  return moment(date).format('DD MMM YYYY - HH:mm')
}

export function converNumberToMMMDD(date) {
  const data = converToLocal(Number(date))
  return moment(data).format('MMM-DD')
}

export function converNumberToDD(date) {
  const data = converToLocal(Number(date))
  return moment(data).format('DD')
}

export function converNumberToMMMDDYYYY(date) {
  const data = converToLocal(Number(date))
  return moment(data).format('MMM DD YYYY')
}

export function convertNumberToMMMDDYYYYhhmmA(date) {
  const data = converToLocal(Number(date))
  return moment(data).format('MMM DD, YYYY, hh:mm A')
}
export function convertDateTohhmmA(date) {
  return moment(date).format('hh:mm A')
}

export function convertNumberTohhmmA(date) {
  const data = converToLocal(Number(date))
  return moment(data).format('hh:mm A')
}

export function convertTimeLocalYYYYMMDDHHmmToSever(date) {
  return moment(date).format('YYYY-MM-DD=HH=mm')
}

export function getDateToSever(date) {
  const convertLocal = moment(date).local()
  return new Date(convertLocal).getTime()
}

export function convertToSkip(date) {
  return moment.utc(date).format('YYYY-MM-DD=HH=mm')
}

export function convertMMMDYYYY(date) {
  return moment(date).format('MMM D, YYYY')
}

export function convertDMMMYYYY(date) {
  return moment(date).format('D MMM YYYY')
}

export function convertToUTC(date) {
  return moment(date).utc().format('YYYY-MM-DDTHH:mm:ss.sss') + 'Z'
}

export function convertDMMMYYYYHmm(date) {
  return moment(date).format('D MMM YYYY H:mm')
}
