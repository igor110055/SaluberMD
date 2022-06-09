import * as types from './actionTypes'

export const updateObject = (oldObject, initialState, updatedValues) => {
  return Object.assign({}, oldObject, initialState, updatedValues)
}

export const saveUserinfo = (oldObject, initialState, userInfo) => {
  return Object.assign({}, oldObject, initialState, {
    type: types.SAVE_USERINFO,
    userInfo: userInfo
  })
}
