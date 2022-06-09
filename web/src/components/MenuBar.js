import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Dimensions, Image, ScrollView, TouchableOpacity } from 'react-native'
import * as StateLocal from '../state_local'
import imgAccount from '../../assets/images/account'
import imgDrawer from '../../assets/images/drawer_menu'
import Translate from '../translate'
import { color040404, color3777EE, colorE5E5E5, colorF0F0F0, colorFFFFFF } from '../constants/colors'
import { customTxt } from '../constants/css'
import Fonts from '../constants/Fonts'
import NavigateServer from '../routes'
import Routes from '../routes/Routes'
import AsyncStorage from '@callstack/async-storage'
import { KEY_STORAGE } from '../constants/storage'

export default function MenuBar() {
  const languageRedux = StateLocal.userinfo?.language_id || 'en_US'
  const [imgAvt, setImgAvt] = useState()

  useEffect(() => {
    if (StateLocal.userinfo?.userImage) {
      var base64 = `data:image/png;base64,${StateLocal.userinfo?.userImage}`
      setImgAvt({ uri: base64 })
    }
  }, StateLocal.userinfo)

  const renderUser = () => {
    return (
      <View style={styles.userView}>
        <Image source={imgAvt || imgAccount.ic_profile_avatar} style={styles.avtImg} />
        <View>
          <Text style={customTxt(Fonts.Regular, 12, color040404).txt}>{Translate(languageRedux).MSG_WELCOME_BACK}!</Text>
          <Text style={customTxt(Fonts.Bold, 20, color040404).txt}>{StateLocal.userinfo?.username || ' '}</Text>
          <Text style={customTxt(Fonts.Regular, 12, color3777EE).txt}>{Translate(languageRedux).VIEW_MY_PROFILE}</Text>
        </View>
      </View>
    )
  }

  const renderCell = (img, title, onPress, isFullLine) => {
    const lineView = {
      width: isFullLine ? '100%' : 228,
      height: 1,
      marginLeft: isFullLine ? 0 : 72,
      backgroundColor: colorF0F0F0
    }
    const bgView = {
      backgroundColor: colorFFFFFF
    }
    return (
      <TouchableOpacity style={bgView} onPress={onPress}>
        <View style={styles.cellView}>
          <Image source={img} style={styles.iconStyle} />
          <Text style={customTxt(Fonts.Bold, 14, color040404).txt}>{title}</Text>
        </View>
        <View style={lineView} />
      </TouchableOpacity>
    )
  }

  const onPressLogout = () => {
    AsyncStorage.setItem(KEY_STORAGE.TOKEN, '')
    NavigateServer.navigateAndReset(Routes.LOGIN_SIGN_UP_SCREEN)
  }

  const onPressHome = () => {
    NavigateServer.navigateAndReset(Routes.HOME_SCREEN)
  }

  const onPressVisits = () => {
    NavigateServer.navigateAndReset(Routes.VISITS_SCREEN)
  }

  const onPressHealthProfile = () => {
    NavigateServer.navigateAndReset(Routes.HEALTH_PROFILE_MAIN)
  }

  const renderDrawer = () => {
    return (
      <ScrollView>
        {renderCell(imgDrawer.ic_home, 'Home' , onPressHome)}
        {renderCell(imgDrawer.ic_visit, 'Visits', onPressVisits)}
        {renderCell(imgDrawer.ic_healthprofile, 'Health Profile', onPressHealthProfile, true)}
        {renderCell(imgDrawer.ic_service, 'Services')}
        {renderCell(imgDrawer.ic_tool, 'Tools')}
        {renderCell(imgDrawer.ic_magazine, 'Magazine')}
        {renderCell(imgDrawer.ic_support, 'Support')}
        {renderCell(imgDrawer.ic_logout, 'Logout', onPressLogout, true)}
      </ScrollView>
    )
  }

  return (
    <View style={styles.container}>
      {renderUser()}
      {renderDrawer()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: Dimensions.get('window').height,
    backgroundColor: colorE5E5E5
  },
  userView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingBottom: 22,
    backgroundColor: colorFFFFFF,
    marginBottom: 8
  },
  avtImg: {
    width: 64,
    height: 64,
    borderRadius: 64 / 2,
    marginRight: 16
  },
  cellView: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center'
  },
  iconStyle: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginLeft: 20,
    marginTop: 17,
    marginBottom: 17,
    marginRight: 12
  }
})
