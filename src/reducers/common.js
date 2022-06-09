import * as types from '../actions/ActionTypes'

const INITIAL_STATE = {
  isLoading: false,
  isConnect: true,
  allergies: [],
  disease: [],
  medication: [],
  dependency: [],
  surgery: [],
  hospitalization: [],
  subsurgery: [],
  immunization: [],
  irregular: [],
  prosthesis: [],
  mediform: [],
  country: [],
  complication: [],
  language: 'en_US',
  pharmacy: [],
  medicine: [],
  lsLanguage: [],
  listKG: [],
  listLB: [],
  listCM: [],
  listFT: [],
  appointment: [],
  historyappointment: [],
  lsRequest: [],
  dataDocument: [],
  listSpeciality: [],
  dataAppointment: [],
  listCategoryFile: [],
  detailDisease: [],
  lsComplicazioni: [], //apiHealthProfile
  lsAllergie: [],
  lsMedicine: [],
  lsFormaMedicine: [],
  lsDipendenze: [],
  lsSurgery: [],
  lsSubSurgery: [],
  lsHospital: [],
  lsImmunization: [],
  lsIrregular: [],
  lsProsthetics: [],
  lsDisease: [],
  dataDisease: [],
  dataMedi: [],
  dataAllergy: [],
  dataDepen: [],
  dataImmu: [],
  dataIrre: [],
  dataPros: [],
  dataHosSur: [],
  countNoti: null,
  listSpecialtySelected: [],
  base64Signature: null,
  dataSignUpDr2: [],
  dataSignUpDr3: [],
  surveyPatient: null,
  dataNoti: null,
  listHistoryAppDoctor: [],
  trackingBreathingVolumes: [],
  trackingWeight: [],
  trackingBloodPressure: [],
  trackingSpo2: [],
  trackingBodyTemperature: [],
  trackingHeartRate: []
}

const common = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SAVE_IS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading
      }
    case types.SAVE_LS_ALLERGI:
      return {
        ...state,
        allergies: action.allergies
      }
    case types.SAVE_LS_DISEASE:
      return {
        ...state,
        disease: action.disease
      }
    case types.SAVE_LS_MEDICATION:
      return {
        ...state,
        medication: action.medication
      }
    case types.SAVE_LS_DEPENDENCY:
      return {
        ...state,
        dependency: action.dependency
      }
    case types.SAVE_LS_SURGERY:
      return {
        ...state,
        surgery: action.surgery
      }
    case types.SAVE_LS_HOSPITALIZATION:
      return {
        ...state,
        hospitalization: action.hospitalization
      }
    case types.SAVE_LS_SUB_SURGERY:
      return {
        ...state,
        subsurgery: action.subsurgery
      }
    case types.SAVE_LS_IMMUNIZATION:
      return {
        ...state,
        immunization: action.immunization
      }
    case types.SAVE_LS_IRREGULAR:
      return {
        ...state,
        irregular: action.irregular
      }
    case types.SAVE_LS_PROSTHESIS:
      return {
        ...state,
        prosthesis: action.prosthesis
      }
    case types.SAVE_LS_MEDI_FORM:
      return {
        ...state,
        mediform: action.mediform
      }
    case types.SAVE_LS_COUNTRY:
      return {
        ...state,
        country: action.country
      }
    case types.SAVE_LS_COMPLICATION_DISEASE:
      return {
        ...state,
        complication: action.complication
      }
    case types.SAVE_LANGUAGE:
      return {
        ...state,
        language: action.language
      }
    case types.SAVE_LS_PHARMA:
      return {
        ...state,
        pharmacy: action.pharmacy
      }
    case types.SAVE_LS_MEDI:
      return {
        ...state,
        medicine: action.medicine
      }
    case types.SAVE_LS_LANGUAGE:
      return {
        ...state,
        lsLanguage: action.lsLanguage
      }
    case types.SAVE_LS_KG:
      return {
        ...state,
        listKG: action.listKG
      }
    case types.SAVE_LS_LB:
      return {
        ...state,
        listLB: action.listLB
      }
    case types.SAVE_LS_CM:
      return {
        ...state,
        listCM: action.listCM
      }
    case types.SAVE_LS_APPOINTMENT:
      return {
        ...state,
        appointment: action.appointment
      }
    case types.SAVE_LS_HISTORY_APPOINTMENT:
      return {
        ...state,
        historyappointment: action.historyappointment
      }
    case types.SAVE_LS_REQUEST_APPOINTMENT:
      return {
        ...state,
        lsRequest: action.lsRequest
      }
    case types.SAVE_DATA_NEW_DOC:
      return {
        ...state,
        dataDocument: action.dataDocument
      }
    case types.SAVE_LIST_SPECIALITY:
      return {
        ...state,
        listSpeciality: action.listSpeciality
      }
    case types.SAVE_DATA_NEW_APPOINTMENT:
      return {
        ...state,
        dataAppointment: action.dataAppointment
      }
    case types.SAVE_LIST_CATEGORY_FILE:
      return {
        ...state,
        listCategoryFile: action.listCategoryFile
      }
    case types.SAVE_LIST_DETAIL_DISEASE:
      return {
        ...state,
        detailDisease: action.detailDisease
      }
    case types.SAVE_LIST_HEALTH_PROFILE:
      console.log('action: ', action.healthProfile)
      return {
        ...state,
        lsComplicazioni: action.healthProfile?.complicazioni || [],
        lsAllergie: action.healthProfile?.allergie || [],
        lsMedicine: action.healthProfile?.medicine || [],
        lsFormaMedicine: action.healthProfile?.formaMedicine || [],
        lsDipendenze: action.healthProfile?.dipendenze || [],
        lsSurgery: action.healthProfile?.interventi || [],
        lsSubSurgery: action.healthProfile?.subInterventi || [],
        lsHospital: action.healthProfile?.ospedalizzazioni || [],
        lsImmunization: action.healthProfile?.vaccini || [],
        lsIrregular: action.healthProfile?.test || [],
        lsProsthetics: action.healthProfile?.protesi || [],
        lsDisease: action.healthProfile?.malattie || []
      }
    case types.SAVE_DATA_DISEASE:
      return {
        ...state,
        dataDisease: action.dataDisease
      }
    case types.SAVE_DATA_MEDI:
      return {
        ...state,
        dataMedi: action.dataMedi
      }
    case types.SAVE_DATA_ALLERGY:
      return {
        ...state,
        dataAllergy: action.dataAllergy
      }
    case types.SAVE_DATA_DEPEN:
      return {
        ...state,
        dataDepen: action.dataDepen
      }
    case types.SAVE_DATA_IMMU:
      return {
        ...state,
        dataImmu: action.dataImmu
      }
    case types.SAVE_DATA_IRRE:
      return {
        ...state,
        dataIrre: action.dataIrre
      }
    case types.SAVE_DATA_PROS:
      return {
        ...state,
        dataPros: action.dataPros
      }
    case types.SAVE_DATA_HOSSUR:
      return {
        ...state,
        dataHosSur: action.dataHosSur
      }
    case types.SAVE_COUNT_NOTI:
      return {
        ...state,
        countNoti: action.noti
      }
    case types.LIST_SPECAILTY_SELECTED:
      return {
        ...state,
        listSpecialtySelected: action.listSpecialtySelected
      }
    case types.SAVE_BASE64_SIGNATURE:
      return {
        ...state,
        base64Signature: action.base64Signature
      }
    case types.SAVE_DATA_SIGNUP_DR_2:
      return {
        ...state,
        dataSignUpDr2: action.dataSignUpDr2
      }
    case types.SAVE_DATA_SIGNUP_DR_3:
      return {
        ...state,
        dataSignUpDr3: action.dataSignUpDr3
      }
    case types.SAVE_SURVEY_PATIENT:
      return {
        ...state,
        surveyPatient: action.surveyPatient
      }
    case types.SAVE_DATA_NOTI:
      return {
        ...state,
        dataNoti: action.dataNoti
      }
    case types.SAVE_LIST_HISTORY_APPOINTMENT_DOCTOR:
      return {
        ...state,
        listHistoryAppDoctor: action.listHistoryAppDoctor
      }
      case types.SAVE_TRACKING_BREATHING_VOLUMES:
      return {
        ...state,
        trackingBreathingVolumes: action.trackingBreathingVolumes
      }
      case types.SAVE_TRACKING_WEIGHT:
      return {
        ...state,
        trackingWeight: action.trackingWeight
      }
      case types.SAVE_TRACKING_BLOODPRESSURE:
      return {
        ...state,
        trackingBloodPressure: action.trackingBloodPressure
      }
      case types.SAVE_TRACKING_SPO2:
      return {
        ...state,
        trackingSpo2: action.trackingSpo2
      }
      case types.SAVE_TRACKING_BODY_TEMPERATURE:
      return {
        ...state,
        trackingBodyTemperature: action.trackingBodyTemperature
      }
      case types.SAVE_TRACKING_HEARTRATE:
      return {
        ...state,
        trackingHeartRate: action.trackingHeartRate
      }
    default:
      return state
  }
}

export default common
