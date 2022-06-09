import * as types from './ActionTypes'

export function saveLSAllergi(allergies) {
  return {
    type: types.SAVE_LS_ALLERGI,
    allergies
  }
}

export function saveLSDisease(disease) {
  return {
    type: types.SAVE_LS_DISEASE,
    disease
  }
}

export function saveLSMedication(medication) {
  return {
    type: types.SAVE_LS_MEDICATION,
    medication
  }
}

export function saveLSDependency(dependency) {
  return {
    type: types.SAVE_LS_DEPENDENCY,
    dependency
  }
}

export function saveLSSurgery(surgery) {
  return {
    type: types.SAVE_LS_SURGERY,
    surgery
  }
}

export function saveLSHospitalization(hospitalization) {
  return {
    type: types.SAVE_LS_HOSPITALIZATION,
    hospitalization
  }
}

export function saveLSSubSurgery(subsurgery) {
  return {
    type: types.SAVE_LS_SUB_SURGERY,
    subsurgery
  }
}

export function saveLSImmunization(immunization) {
  return {
    type: types.SAVE_LS_IMMUNIZATION,
    immunization
  }
}

export function saveLSIrregular(irregular) {
  return {
    type: types.SAVE_LS_IRREGULAR,
    irregular
  }
}

export function saveLSProsthesis(prosthesis) {
  return {
    type: types.SAVE_LS_PROSTHESIS,
    prosthesis
  }
}

export function saveLSMediForm(mediform) {
  return {
    type: types.SAVE_LS_MEDI_FORM,
    mediform
  }
}

export function saveLSCountry(country) {
  return {
    type: types.SAVE_LS_COUNTRY,
    country
  }
}

export function saveLSComplication(complication) {
  return {
    type: types.SAVE_LS_COMPLICATION_DISEASE,
    complication
  }
}

export function saveLanguage(language) {
  return {
    type: types.SAVE_LANGUAGE,
    language
  }
}

export function saveLSPharma(pharmacy) {
  return {
    type: types.SAVE_LS_PHARMA,
    pharmacy
  }
}

export function saveLSMedi(medicine) {
  return {
    type: types.SAVE_LS_MEDI,
    medicine
  }
}

export function saveLsLanguage(lsLanguage) {
  return {
    type: types.SAVE_LS_LANGUAGE,
    lsLanguage
  }
}

export function saveLsKG(listKG) {
  return {
    type: types.SAVE_LS_KG,
    listKG
  }
}

export function saveLsLB(listLB) {
  return {
    type: types.SAVE_LS_LB,
    listLB
  }
}

export function saveLsCM(listCM) {
  return {
    type: types.SAVE_LS_CM,
    listCM
  }
}

export function saveLSAppoitment(appointment) {
  return {
    type: types.SAVE_LS_APPOINTMENT,
    appointment
  }
}

export function saveLSHistoryAppoitment(historyappointment) {
  return {
    type: types.SAVE_LS_HISTORY_APPOINTMENT,
    historyappointment
  }
}

export function saveLSRequestAppoitment(lsRequest) {
  return {
    type: types.SAVE_LS_REQUEST_APPOINTMENT,
    lsRequest
  }
}

export function saveDataNewDoc(dataDocument) {
  return {
    type: types.SAVE_DATA_NEW_DOC,
    dataDocument
  }
}

export function saveLSSpeciality(listSpeciality) {
  return {
    type: types.SAVE_LIST_SPECIALITY,
    listSpeciality
  }
}

export function saveDataNewAppointment(dataAppointment) {
  return {
    type: types.SAVE_DATA_NEW_APPOINTMENT,
    dataAppointment
  }
}

export function saveListCategoryFile(listCategoryFile) {
  return {
    type: types.SAVE_LIST_CATEGORY_FILE,
    listCategoryFile
  }
}

export function saveListDetailDisease(detailDisease) {
  return {
    type: types.SAVE_LIST_DETAIL_DISEASE,
    detailDisease
  }
}

export function saveListHealthProfile(healthProfile) {
  return {
    type: types.SAVE_LIST_HEALTH_PROFILE,
    healthProfile
  }
}

export function saveDataDisease(dataDisease) {
  return {
    type: types.SAVE_DATA_DISEASE,
    dataDisease
  }
}

export function saveDataMedi(dataMedi) {
  return {
    type: types.SAVE_DATA_MEDI,
    dataMedi
  }
}

export function saveDataAllergy(dataAllergy) {
  return {
    type: types.SAVE_DATA_ALLERGY,
    dataAllergy
  }
}

export function saveDataDepen(dataDepen) {
  return {
    type: types.SAVE_DATA_DEPEN,
    dataDepen
  }
}

export function saveDataImmu(dataImmu) {
  return {
    type: types.SAVE_DATA_IMMU,
    dataImmu
  }
}

export function saveDataIrre(dataIrre) {
  return {
    type: types.SAVE_DATA_IRRE,
    dataIrre
  }
}

export function saveDataPros(dataPros) {
  return {
    type: types.SAVE_DATA_PROS,
    dataPros
  }
}

export function saveDataHosSur(dataHosSur) {
  return {
    type: types.SAVE_DATA_HOSSUR,
    dataHosSur
  }
}

export function saveCountNoti(noti) {
  return {
    type: types.SAVE_COUNT_NOTI,
    noti
  }
}

export function saveListSpecialtySelected(listSpecialtySelected) {
  return {
    type: types.LIST_SPECAILTY_SELECTED,
    listSpecialtySelected
  }
}

export function saveBase64Signature(base64Signature) {
  return {
    type: types.SAVE_BASE64_SIGNATURE,
    base64Signature
  }
}

export function saveDataSignUpDr2(dataSignUpDr2) {
  return {
    type: types.SAVE_DATA_SIGNUP_DR_2,
    dataSignUpDr2
  }
}

export function saveDataSignUpDr3(dataSignUpDr3) {
  return {
    type: types.SAVE_DATA_SIGNUP_DR_3,
    dataSignUpDr3
  }
}

export function saveSurveyPatient(surveyPatient) {
  return {
    type: types.SAVE_SURVEY_PATIENT,
    surveyPatient
  }
}

export function saveDataNoti(dataNoti) {
  return {
    type: types.SAVE_DATA_NOTI,
    dataNoti
  }
}

export function saveListHistoryAppointmentDoctor(listHistoryAppDoctor) {
  return {
    type: types.SAVE_LIST_HISTORY_APPOINTMENT_DOCTOR,
    listHistoryAppDoctor
  }
}

export function saveTrackingBreathingVolumes(trackingBreathingVolumes) {
  return {
    type: types.SAVE_TRACKING_BREATHING_VOLUMES,
    trackingBreathingVolumes
  }
}

export function saveTrackingWeight(trackingWeight) {
  return {
    type: types.SAVE_TRACKING_WEIGHT,
    trackingWeight
  }
}

export function saveTrackingBloodPressure(trackingBloodPressure) {
  return {
    type: types.SAVE_TRACKING_BLOODPRESSURE,
    trackingBloodPressure
  }
}

export function saveTrackingSPO2(trackingSpo2) {
  return {
    type: types.SAVE_TRACKING_SPO2,
    trackingSpo2
  }
}

export function saveTrackingBodyTemperature(trackingBodyTemperature) {
  return {
    type: types.SAVE_TRACKING_BODY_TEMPERATURE,
    trackingBodyTemperature
  }
}

export function saveTrackingHeartRate(trackingHeartRate) {
  return {
    type: types.SAVE_TRACKING_HEARTRATE,
    trackingHeartRate
  }
}
