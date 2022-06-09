import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, DeviceEventEmitter, Platform } from 'react-native'
import {
  createDrawerNavigator,
  DrawerContentScrollView
} from '@react-navigation/drawer'
import Fonts from 'constants/Fonts'
import {
  colorFFFFFF,
  color040404,
  color3777EE,
  colorF0F0F0,
  colorF8F8F8
} from 'constants/colors'
import { useNavigation } from '@react-navigation/native'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import { customTxt } from 'constants/css'
import iconDrawerMenu from '../../../../assets/images/drawer_menu'
import imgAccount from '../../../../assets/images/account'
import imgVisit from '../../../../assets/images/visit'
import { useDispatch, useSelector } from 'react-redux'
import icHome from '../../../../assets/images/home_screen'
import Translate from 'translate'
import HomeDoctor from '../home_view'
import AccountScreen from '../../account'
import AgendaScreen from '../agenda'
import PatientScreen from '../patient'
import ContactUsScreen from '../contact_us'
import MyProfilesView from '../my_profiles'
import DialogCustom from 'components/DialogCustom'
import AsyncStorage from '@react-native-community/async-storage'
import { STORAGE_KEY } from 'constants/define'
import { saveLSAppoitment, saveLSRequestAppoitment } from 'actions/common'
import { saveUserinfo } from 'actions/user'
import DeviceInfo from 'react-native-device-info'
import { apiPostUnregisterPush } from 'api/Auth'

const Drawer = createDrawerNavigator()

function Home() {
  return (
    <View style={styles.container}>
      {HomeDoctor()}
    </View>
  )
}

function Agenda() {
  return (
    <View style={styles.container}>
      {AgendaScreen()}
    </View>
  )
}

function Patient() {
  return (
    <View style={styles.container}>
      {PatientScreen()}
    </View>
  )
}

function ContactUs() {
  return (
    <View style={styles.container}>
      {ContactUsScreen()}
    </View>
  )
}

function MyProfiles() {
  return (
    <View style={styles.container}>
      {MyProfilesView()}
    </View>
  )
}

function CustomDrawerDoctor(props) {
  const username = useSelector(state => state.user.user_name)
  const email = useSelector(state => state.user.email)
  const userinfo = useSelector(state => state.user.userinfo)
  const languageRedux = useSelector(state => state.common.language)
  const navigation = useNavigation()
  const [imgAvt, setImgAvt] = useState()
  const [isDialog, setDialog] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    console.log('avatarChange')
    if (userinfo?.userImage) {
      var base64 = `data:image/png;base64,${userinfo?.userImage}`
      setImgAvt({ uri: base64 })
    } else {
      setImgAvt()
    }
  }, [userinfo])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.MAGAZINE_SCREEN, params => {
      if (params?.magazine) {
        navigation.navigate('Magazine')
      }
    })
    return () => subscription.remove()
  }, [])

  const _onPressClose = () => {
    NavigationService.closeDrawer()
  }

  const _onPressCancel = () => {
    setDialog(false)
  }

  const _onPressLogout = async () => {
    setDialog(false)
    setLoading(true)
    Promise.all([
      AsyncStorage.setItem(STORAGE_KEY.TOKEN, ''),
      dispatch(saveLSAppoitment([])),
      dispatch(saveLSRequestAppoitment([])),
      dispatch(saveUserinfo([]))
    ])

    const isEnabledSwitch = await AsyncStorage.getItem(STORAGE_KEY.IS_FACE_ID)
    const udidv4 = await DeviceInfo.getUniqueId() || ''
    console.log('Token callAPIRegisterDevice: ', udidv4)
    const getDeviceToken = await AsyncStorage.getItem(STORAGE_KEY.DEVICE_TOKEN)
    const param = {
      'deviceUUID': udidv4,
      'platform': Platform.OS === 'ios' ? 'ios' : 'pushy',
      'token': getDeviceToken
    }
    console.log('Token param: ', param)
    dispatch(apiPostUnregisterPush(param)).then(res => {
      return NavigationService.navigateAndReset(isEnabledSwitch === 'true' ? Routes.WAITING_FACE_ID_SCREEN : Routes.LOGIN_SCREEN)
    }).catch(() => {
      return NavigationService.navigateAndReset(isEnabledSwitch === 'true' ? Routes.WAITING_FACE_ID_SCREEN : Routes.LOGIN_SCREEN)
    })
  }

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        {/* DRAWER */}
        <View style={styles.lineDivider}>
          <View style={styles.ctnDrawer}>
            {/* TOP DRAWER */}
            <TouchableOpacity onPress={_onPressClose} style={styles.closeButton}>
              <Image source={icHome.ic_close} style={styles.iconStyle} />
            </TouchableOpacity>
            <View style={styles.row}>
              <View style={styles.ctnAvatar}>
                <Image
                  style={styles.imgStyle}
                  source={imgAvt ? imgAvt : imgAccount.ic_profile_avatar}
                />
              </View>
              {/* CONTENT TOP DRAWER */}
              <View style={styles.ctnTopContent}>
                {userinfo?.username && (
                  <Text style={customTxt(Fonts.SemiBold, 12, color040404).txt}>
                    {Translate(languageRedux).MSG_WELCOME_BACK}
                  </Text>
                )}
                <View style={{ height: 4 }} />
                <Text style={customTxt(Fonts.Bold, 20, color040404).txt}>
                  {userinfo?.nome || ''}
                </Text>
                {email?.email && !username?.username && (
                  <Text style={customTxt(Fonts.Bold, 20, color040404).txt}>
                    {email?.email}
                  </Text>
                )}
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate(Routes.ACCOUNT_SCREEN)
                    // NavigationService.navigate(Routes.ACCOUNT_SCREEN)
                  }}
                  style={styles.ctnTextAccount}>
                  <Text
                    style={
                      customTxt(Fonts.SemiBold, 12, color3777EE).txt
                    }>{Translate(languageRedux).ACCOUNT}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.divider} />
        {/* BODY DRAWER */}
        <View style={styles.ctnBodyDrawer}>
          {/* 3 MAIN BUTTON */}
          {/* HOME */}
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('Home')
            }}
            style={styles.ctnList}>
            <View style={styles.ctnIcon}>
              <Image source={iconDrawerMenu.ic_home} style={styles.iconStyle} />
            </View>
            <Text style={customTxt(Fonts.Bold, 14, color040404).txt}>Home</Text>
          </TouchableOpacity>
          <View style={styles.dividerBodyDrawer} />
          {/* AGENDA */}
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate(Routes.AGENDA_DOCTOR_VIEW)
            }}
            style={styles.ctnList}>
            <View style={styles.ctnIcon}>
              <Image
                source={iconDrawerMenu.ic_agenda}
                style={styles.iconStyle}
              />
            </View>
            <Text style={customTxt(Fonts.Bold, 14, color040404).txt}>
              {Translate(languageRedux).AGENDA}
            </Text>
          </TouchableOpacity>
          <View style={styles.dividerBodyDrawer} />
          {/* PATIENT */}
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate(Routes.PATIENT_SCREEN)
            }}
            style={styles.ctnList}>
            <View style={styles.ctnIcon}>
              <Image
                source={iconDrawerMenu.ic_visit}
                style={styles.iconStyle}
              />
            </View>
            <Text style={customTxt(Fonts.Bold, 14, color040404).txt}>
              {Translate(languageRedux).PATIENT}
            </Text>
          </TouchableOpacity>
          <View style={styles.dividerBodyDrawer} />
          {/* Contact Us */}
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate(Routes.CONTACT_US_DOCTOR_SCREEN)
            }}
            style={styles.ctnList}>
            <View style={styles.ctnIcon}>
              <Image
                source={imgVisit.ic_drcall}
                style={styles.iconStyle}
              />
            </View>
            <Text style={customTxt(Fonts.Bold, 14, color040404).txt}>
              {Translate(languageRedux).CONTACT_US_TITLE}
            </Text>
          </TouchableOpacity>
          <View style={styles.dividerBodyDrawer} />
          <View style={styles.lastBottom} />
        </View>
      </DrawerContentScrollView>
      {/* Log out */}
      {/* <TouchableOpacity
        onPress={() => {
          setDialog(true)
        }}
        style={styles.ctnList2}>
        <View style={styles.ctnIcon}>
          <Image
            source={iconDrawerMenu.ic_log_out}
            style={styles.iconStyle}
          />
        </View>
        <Text style={customTxt(Fonts.Bold, 14, color3777EE).txt}>
          {Translate(languageRedux).logout1}
        </Text>
      </TouchableOpacity> */}
      {
        isDialog && (
          <DialogCustom
            title={Translate(languageRedux).ARE_YOU_SURE_WANT_TO_LOG_OUT}
            txtlLeft={Translate(languageRedux).cancel}
            onPressCancel={_onPressCancel}
            txtRight={Translate(languageRedux).LOGOUT_BTN}
            onPressOK={_onPressLogout}
          />
        )
      }
    </View>
  )
}

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator
      initialRouteName={'Home'}
      drawerContent={props => <CustomDrawerDoctor {...props} />}
      drawerStyle={{
        backgroundColor: colorFFFFFF
      }}>
      <Drawer.Screen name={'Home'} component={Home} />
      <Drawer.Screen name={Routes.AGENDA_DOCTOR_VIEW} component={Agenda} />
      <Drawer.Screen name={Routes.PATIENT_SCREEN} component={Patient} />
      <Drawer.Screen name={Routes.CONTACT_US_DOCTOR_SCREEN} component={ContactUs} />
      <Drawer.Screen name={Routes.MY_PROFILES_DOCTOR_SCREEN} component={MyProfiles} />
      {/* <Drawer.Screen name={Routes.SERVICES_SCREEN} component={Service} /> */}
      {/* <Drawer.Screen name={Routes.TOOLS_SCREEN} component={Tools} /> */}
      {/* <Drawer.Screen name={Routes.MAGAZINE_SCREEN} component={Magazine} /> */}
      {/* <Drawer.Screen name={'Support'} component={Support} /> */}
      <Drawer.Screen name={Routes.ACCOUNT_SCREEN} component={AccountScreen} />
    </Drawer.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  ctnScreen: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  ctnDrawer: {
    marginLeft: 20,
    marginBottom: 20,
    width: '100%'
  },
  lineDivider: {
    borderBottomColor: colorF0F0F0,
    borderBottomWidth: 1,
    backgroundColor: colorFFFFFF
  },
  ctnAvatar: {
    justifyContent: 'center'
  },
  ctnTopContent: {
    marginLeft: 16,
    justifyContent: 'center'
  },
  ctnBodyDrawer: {
    backgroundColor: colorFFFFFF
  },
  imgStyle: {
    height: 64,
    width: 64,
    borderRadius: 30
  },
  ctnTextAccount: {
    marginTop: 4
  },
  ctnList: {
    height: 73,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20
  },
  ctnList2: {
    position: 'absolute',
    height: 73,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    left: 0,
    bottom: 0
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  ctnIcon: {
    marginRight: 12,
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: colorF8F8F8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row'
  },
  closeButton: {
    marginBottom: 24
  },
  divider: {
    height: 8,
    backgroundColor: colorF8F8F8
  },
  divider2: {
    borderBottomWidth: 1,
    borderBottomColor: colorF0F0F0
  },
  dividerBodyDrawer: {
    marginLeft: 72,
    borderBottomWidth: 1,
    borderBottomColor: colorF0F0F0
  },
  lastBottom: {
    backgroundColor: colorF8F8F8,
    height: '100%'
  }
})
