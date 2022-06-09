import * as types from './ActionTypes'

export const saveToken = token => dispatch => {
  dispatch({
    type: types.SAVE_TOKEN,
    token
  })
}

export const savePersonalInfo = personal_info => dispatch => {
  dispatch({
    type: types.SAVE_PERSONAL_INFO,
    personal_info
  })
}

export const saveAllergies = allergies => dispatch => {
  dispatch({
    type: types.SAVE_ALLERGIES,
    allergies
  })
}


export const checkLogin = user_name => dispatch => {
  dispatch({
    type: types.CHECK_LOGIN,
    user_name
  })
}

export const saveSignUp = email => dispatch => {
  dispatch({
    type: types.SAVE_SIGN_UP,
    email
  })
}

export const saveAppointment = info => dispatch => {
  dispatch({
    type: types.SAVE_APPOINTMENT,
    info
  })
}

export const saveChronicDisease = chronic_disease => dispatch => {
  dispatch({
    type: types.SAVE_CHRONIC_DISEASE,
    chronic_disease
  })
}

export const saveMedications = medications => dispatch => {
  dispatch({
    type: types.SAVE_MEDICATION,
    medications
  })
}

export const saveDependencies = dependencies => dispatch => {
  dispatch({
    type: types.SAVE_DEPENDENCIES,
    dependencies
  })
}

export const saveHospitalization = hospitalization => dispatch => {
  dispatch({
    type: types.SAVE_HOSPITALIZATION,
    hospitalization
  })
}

export const saveImmunizations = immunizations => dispatch => {
  dispatch({
    type: types.SAVE_IMMUNIZATION,
    immunizations
  })
}

export const saveIrregular = irregular => dispatch => {
  dispatch({
    type: types.SAVE_IRREGULAR,
    irregular
  })
}

export const saveProsthesis = prosthesis => dispatch => {
  dispatch({
    type: types.SAVE_PROSTHESIS,
    prosthesis
  })
}

export const saveUserinfo = userinfo => dispatch => {
  dispatch({
    type: types.SAVE_USER_INFO,
    userinfo
  })
}

export const saveShowMedi = medi => dispatch => {
  dispatch({
    type: types.SAVE_SHOW_MEDI,
    medi
  })
}

export const saveShowPharma = pharma => dispatch => {
  dispatch({
    type: types.SAVE_SHOW_PHARMA,
    pharma
  })
}

export const savePermission = permission => dispatch => {
  dispatch({
    type: types.SAVE_PERMISSION,
    permission
  })
}

export const saveFaceId = isFaceId => dispatch => {
  dispatch({
    type: types.CHANGE_FACE_ID,
    isFaceId
  })
}

export const saveSummary = summary => dispatch => {
  dispatch({
    type: types.SAVE_SUMMARY,
    summary
  })
}

export const saveChat = chat => dispatch => {
  dispatch({
    type: types.SAVE_CHAT,
    chat
  })
}
