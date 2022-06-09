import { Dimensions, Platform } from 'react-native'

export const validateEmail = (text) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
  if (reg.test(text) === false) {
    console.log('Email is Not Correct')
    return false
  }
  else {
    console.log('Email is Correct')
    return true
  }
}

export const validatePassword = (text) => {
  let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
  if (reg.test(text) === false) {
    console.log('Pass is Not Correct')
    return false
  }
  else {
    console.log('Pass is Correct')
    return true
  }
}

export const isIphoneX = Platform.OS === 'ios' ? Dimensions.get('window').height > 736 : false

export const utils = () => {

}
