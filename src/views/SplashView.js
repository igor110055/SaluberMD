import React, { useEffect } from 'react'
import {
  StatusBar,
  StyleSheet,
  ImageBackground,
  Platform
} from 'react-native'
import imgLoginSignUp from '../../assets/images/login_signup'
import NavigationService from '../navigation'
import Routes from '../navigation/Routes'
import { useDispatch } from 'react-redux'
import { savePermission, saveToken } from '../actions/user'
import AsyncStorage from '@react-native-community/async-storage'
import { STORAGE_KEY } from '../constants/define'
import { saveLanguage, saveLsCM, saveLsKG, saveLsLanguage, saveLsLB } from '../actions/common'
import * as Translate from '../constants/define'
import { apiGetLanguages } from '../api/Common'
import * as defines from '../constants/define'
import { apiCheckPermission } from 'api/MedicalRecord'
// import * as APIs from 'api/APIs'
import DeviceInfo from 'react-native-device-info'

export default function SplashView() {
  const dispatch = useDispatch()

  useEffect(() => {
    getLsLanguage()
    getToken()
    weightLSKG()
    weightLSLBS()
    heightLSCM()
  }, [])

  const weightLSKG = () => {
    var list = []
    for (var i = 20; i <= 300; i++) {
      var item = {}
      item.name = i + 'kg'
      item.value = i
      list.push(item)
    }
    Promise.all([
      dispatch(saveLsKG(list))
    ])
  }

  const weightLSLBS = () => {
    var list = []
    for (var i = 20; i <= 300; i++) {
      var item = {}
      item.name = i + 'lbs'
      item.value = i
      list.push(item)
    }
    Promise.all([
      dispatch(saveLsLB(list))
    ])
  }

  const heightLSCM = () => {
    var list = []
    for (var i = 70; i <= 250; i++) {
      var item = {}
      item.name = i + 'cm'
      item.value = i
      list.push(item)
    }
    Promise.all([
      dispatch(saveLsCM(list))
    ])
  }

  const getLsLanguage = () => {
    dispatch(apiGetLanguages()).then(res => {
      const getData = res?.payload?.lingue || []
      if (getData.length > 0) {
        Promise.all([
          dispatch(saveLsLanguage(getData))
        ])
      } else {
        Promise.all([
          dispatch(saveLsLanguage(defines.LANGUAGE))
        ])
      }
    }).catch(() => {
      Promise.all([
        dispatch(saveLsLanguage(defines.LANGUAGE))
      ])
    })
  }


  const getToken = async () => {
    const getTokenLocal = await AsyncStorage.getItem(STORAGE_KEY.TOKEN)
    const getLanguage = await AsyncStorage.getItem(STORAGE_KEY.LANGUAGE)
    // const isFace = await AsyncStorage.getItem(STORAGE_KEY.IS_FACE_ID)
    // const server = (await AsyncStorage.getItem(STORAGE_KEY.SERVER)) || null

    Translate.language = getLanguage || getLanguageDevice()
    // APIs.hostAPI = APIs.hostAPIStaging
    // if (APIs.hostAPIDev === server) {
    //   APIs.hostAPI = APIs.hostAPIDev
    // } else if (APIs.hostAPIStaging === server) {
    //   APIs.hostAPI = APIs.hostAPIStaging
    // } else {
    //   APIs.hostAPI = APIs.hostAPILive
    // }

    if (getTokenLocal) {
      Promise.all([
        dispatch(saveToken(`${getTokenLocal}` || '')),
        dispatch(saveLanguage(getLanguage))
      ])

      setTimeout(() => {
        callAPIPermission()
      }, 3000)

      // if (isFace === 'true') {
      //   setTimeout(() => {
      //     NavigationService.navigateAndReset(Routes.WAITING_FACE_ID_SCREEN)
      //   }, 2000)
      // } else {
      //   // setTimeout(() => {
      //   //   NavigationService.navigateAndReset(Routes.DRAWER_NAVIGATION)
      //   // }, 3000)
      //   setTimeout(() => {
      //     callAPIPermission()
      //   }, 3000)
      // }
    } else {
      setTimeout(() => {
        Promise.all([
          dispatch(saveLanguage(getLanguage))
        ])
        NavigationService.navigateAndReset(Routes.LOGIN_SIGN_UP_SCREEN)
      }, 3000)
    }
  }

  const callAPIPermission = async () => {
    // const isFace = await AsyncStorage.getItem(STORAGE_KEY.IS_FACE_ID)
    const params = {
      build: DeviceInfo.getBuildNumber(),
      isIOS: Platform.OS === 'ios',
      uuid: DeviceInfo.getUniqueId(),
      version: DeviceInfo.getVersion()
    }
    dispatch(apiCheckPermission(params)).then(res => {
      console.log('callAPICheckPermission Res payload: ', res?.payload)
      Promise.all([
        dispatch(savePermission(res?.payload))
      ])
      // if (isFace === 'true') {
      //   setTimeout(() => {
      //     NavigationService.navigateAndReset(Routes.WAITING_FACE_ID_SCREEN)
      //   }, 3000)
      //   return
      // } else {
        if (res?.payload?.isDoctor === true) {
          setTimeout(() => {
            NavigationService.navigateAndReset(Routes.DRAWER_NAVIGATION_DOCTOR)
          }, 3000)
        }
        else {
          setTimeout(() => {
            NavigationService.navigateAndReset(Routes.DRAWER_NAVIGATION)
          }, 3000)
        }
      // }
    }).catch(() => {
      setTimeout(() => {
        NavigationService.navigateAndReset(Routes.LOGIN_SIGN_UP_SCREEN)
      }, 3000)
    })
  }

  const getLanguageDevice = async () => {
    // await getLanguages().then(languages => {
    //   console.log('Language: ', languages) // ['en-US', 'en']
    //   if ((languages || []).length > 1) {
    //     return languages[1]
    //   }
    return 'en_US'
    // })
  }

  return (
    <ImageBackground style={styles.container} source={imgLoginSignUp.ic_splashview}>
      <StatusBar barStyle={'light-content'} backgroundColor="black" />
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
