import * as types from '../generics/actionTypes'

export const saveUserinfo = (userInfo) => {
  return {
    type: types.SAVE_USERINFO,
    userInfo: userInfo
  }
}
