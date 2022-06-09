import React, { useEffect } from 'react'
import { ImageBackground, StyleSheet, Dimensions } from 'react-native'
import imgBg from '../../../assets/img/bg'
import Routes from '../../routes/Routes'
import { KEY_STORAGE } from '../../constants/storage'
import AsyncStorage from '@callstack/async-storage'
import * as defines from '../../constants/define'
import * as APIs from '../../apis'

function SplashView({ navigation }) {

  useEffect(() => {
    getStorage()
  }, [])

  const getStorage = async () => {
    const getTokenLocal = await AsyncStorage.getItem(KEY_STORAGE.TOKEN)
    // const aa = await getTokenKey
    console.log('token local:', getTokenLocal)
    defines.tokenApp = getTokenLocal
    if (getTokenLocal) {
      APIs.header = {
        Accept: '*/*',
        'Content-Type': 'application/json',
        'X-AUTH-TOKEN': getTokenLocal
      }
      setTimeout(() => {
        navigation.navigate(Routes.HOME_SCREEN)
      }, 3000)
    } else {
      setTimeout(() => {
        navigation.navigate(Routes.LOGIN_SIGN_UP_SCREEN)
      }, 3000)
    }
  }

  return (
    <ImageBackground style={styles.container} source={imgBg.ic_bg} />
  )
}

export default SplashView

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: Dimensions.get('window').height
  }
})
