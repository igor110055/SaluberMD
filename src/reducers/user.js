import * as types from '../actions/ActionTypes'

const INITIAL_STATE = {
  token: '',
  personal_info: null,
  user_name: [],
  email: [],
  info: [],
  allergies: {},
  chronic_disease: {},
  medications: {},
  dependencies: {},
  hospitalization: {},
  immunizations: {},
  irregular: {},
  prosthesis: {},
  userinfo: {},
  medi: 0,
  pharma: 0,
  permission: null,
  isFaceId: false,
  summary: null,
  lsChat: []
}

const user = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SAVE_TOKEN:
      return {
        ...state,
        token: action.token
      }
    case types.SAVE_PERSONAL_INFO:
      return {
        ...state,
        personal_info: action.personal_info
      }
    case types.SAVE_CHRONIC_DISEASE:
      return {
        ...state,
        chronic_disease: action.chronic_disease
      }
    case types.SAVE_ALLERGIES:
      return {
        ...state,
        allergies: action.allergies
      }
    case types.CHECK_LOGIN:
      return {
        ...state,
        user_name: action.user_name
      }
    case types.SAVE_SIGN_UP:
      return {
        ...state,
        email: action.email
      }
    case types.SAVE_APPOINTMENT:
      return {
        ...state,
        info: action.info
      }
    case types.SAVE_MEDICATION:
      return {
        ...state,
        medications: action.medications
      }
    case types.SAVE_DEPENDENCIES:
      return {
        ...state,
        dependencies: action.dependencies
      }
    case types.SAVE_HOSPITALIZATION:
      return {
        ...state,
        hospitalization: action.hospitalization
      }
    case types.SAVE_IMMUNIZATION:
      return {
        ...state,
        immunizations: action.immunizations
      }
    case types.SAVE_IRREGULAR:
      return {
        ...state,
        irregular: action.irregular
      }
    case types.SAVE_USER_INFO:
      return {
        ...state,
        userinfo: action.userinfo
      }
    case types.SAVE_PROSTHESIS:
      return {
        ...state,
        prosthesis: action.prosthesis
      }
    case types.SAVE_SHOW_MEDI:
      return {
        ...state,
        medi: action.medi
      }
    case types.SAVE_SHOW_PHARMA:
      return {
        ...state,
        pharma: action.pharma
      }
    case types.SAVE_PERMISSION:
      return {
        ...state,
        permission: action.permission
      }
    case types.CHANGE_FACE_ID:
      return {
        ...state,
        isFaceId: action.isFaceId
      }
    case types.SAVE_SUMMARY:
      return {
        ...state,
        summary: action.summary
      }
    case types.SAVE_CHAT:
      return {
        ...state,
        lsChat: action.chat
      }
    default:
      return state
  }
}

export default user
