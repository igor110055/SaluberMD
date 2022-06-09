import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, DeviceEventEmitter } from 'react-native'
import {
  createDrawerNavigator,
  DrawerContentScrollView
} from '@react-navigation/drawer'
import Fonts from '../../constants/Fonts'
import {
  colorFFFFFF,
  color040404,
  color3777EE,
  colorF0F0F0,
  colorF8F8F8
} from '../../constants/colors'
import { useNavigation } from '@react-navigation/native'
import NavigationService from '../../navigation'
import Routes from '../../navigation/Routes'
import { customTxt } from '../../constants/css'
import iconDrawerMenu from '../../../assets/images/drawer_menu'
import AccountScreen from '../account'
import imgAccount from '../../../assets/images/account'
import Home_Screen from '../home_screen'
import { useSelector } from 'react-redux'
import icHome from '../../../assets/images/home_screen'
import Translate from '../../translate'
import VisitScreen from '../visit'
import healthProfileMain from '../health_profile_main'
import SupportScreen from '../support'
import MagazineScreen from '../magazine'
import ToolsScreen from '../tools'
import ServicesScreen from '../services'

const Drawer = createDrawerNavigator()

function Home() {
  return (
    <View style={styles.container}>
      {Home_Screen()}
    </View>
  )
}

function Visit() {
  return (
    <View style={styles.container}>
      {VisitScreen()}
    </View>
  )
}

function HealthProfile() {
  return (
    <View style={styles.ctnScreen}>
      {healthProfileMain()}
    </View>
  )
}

function Service() {
  return (
    <View style={styles.ctnScreen}>
      {ServicesScreen()}
    </View>
  )
}

function Tools() {
  return (
    <View style={styles.ctnScreen}>
      {ToolsScreen()}
    </View>
  )
}

function Magazine() {
  return (
    <View style={styles.ctnScreen}>
      {MagazineScreen()}
    </View>
  )
}

function Support() {
  return (
    <View style={styles.ctnScreen}>
      {SupportScreen()}
    </View>
  )
}

function CustomDrawerContent(props) {
  const username = useSelector(state => state.user.user_name)
  const email = useSelector(state => state.user.email)
  const userinfo = useSelector(state => state.user.userinfo)
  const languageRedux = useSelector(state => state.common.language)
  const navigation = useNavigation()
  const [imgAvt, setImgAvt] = useState()

  useEffect(() => {
    if (userinfo?.userImage) {
      var base64 = `data:image/png;base64,${userinfo?.userImage}`
      setImgAvt({uri: base64})
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
                  source={imgAvt || imgAccount.ic_profile_avatar}
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
                    NavigationService.navigate(Routes.ACCOUNT_SCREEN)
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
          {/* VISIT */}
          <TouchableOpacity
            onPress={() => {
              NavigationService.navigate(Routes.VISIT_MAIN_SCREEN)
            }}
            style={styles.ctnList}>
            <View style={styles.ctnIcon}>
              <Image
                source={iconDrawerMenu.ic_visit}
                style={styles.iconStyle}
              />
            </View>
            <Text style={customTxt(Fonts.Bold, 14, color040404).txt}>
              Visits
            </Text>
          </TouchableOpacity>
          <View style={styles.dividerBodyDrawer} />
          {/* HEALTH PROFILE */}
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate(Routes.HEALTH_PROFILE_TRACKING_SCREEN)
            }}
            style={styles.ctnList}>
            <View style={styles.ctnIcon}>
              <Image
                source={iconDrawerMenu.ic_healthprofile}
                style={styles.iconStyle}
              />
            </View>
            <Text style={customTxt(Fonts.Bold, 14, color040404).txt}>
              Health Profile
            </Text>
          </TouchableOpacity>
          <View style={styles.divider2} />
          {/* BUTTON BOTTOM */}
          <View>
            {/* SERVICE */}
            <TouchableOpacity
            onPress={() => {
              props.navigation.navigate(Routes.SERVICES_SCREEN)
            }}
            style={styles.ctnList}>
              <View style={styles.ctnIcon}>
                <Image
                  source={iconDrawerMenu.ic_service}
                  style={styles.iconStyle}
                />
              </View>
              <Text style={customTxt(Fonts.Bold, 14, color040404).txt}>
                Services
              </Text>
            </TouchableOpacity>
            <View style={styles.dividerBodyDrawer} />
            {/* TOOLS */}
            <TouchableOpacity
            onPress={() => {
              props.navigation.navigate(Routes.TOOLS_SCREEN)
            }}
            style={styles.ctnList}>
              <View style={styles.ctnIcon}>
                <Image
                  source={iconDrawerMenu.ic_tool}
                  style={styles.iconStyle}
                />
              </View>
              <Text style={customTxt(Fonts.Bold, 14, color040404).txt}>
                Tools
              </Text>
            </TouchableOpacity>
            <View style={styles.dividerBodyDrawer} />
            {/* MAGAZINE */}
            <TouchableOpacity
            onPress={() => {
              props.navigation.navigate(Routes.MAGAZINE_SCREEN)
            }}
            style={styles.ctnList}>
              <View style={styles.ctnIcon}>
                <Image
                  source={iconDrawerMenu.ic_magazine}
                  style={styles.iconStyle}
                />
              </View>
              <Text style={customTxt(Fonts.Bold, 14, color040404).txt}>
                Magazine
              </Text>
            </TouchableOpacity>
            <View style={styles.dividerBodyDrawer} />
            {/* SUPPORT */}
            <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('Support')
            }}
            style={styles.ctnList}>
              <View style={styles.ctnIcon}>
                <Image
                  source={iconDrawerMenu.ic_support}
                  style={styles.iconStyle}
                />
              </View>
              <Text style={customTxt(Fonts.Bold, 14, color040404).txt}>
                Support
              </Text>
            </TouchableOpacity>
            <View style={styles.divider2} />
          </View>
          <View style={styles.lastBottom} />
        </View>
      </DrawerContentScrollView>
    </View>
  )
}

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator
      initialRouteName={'Home'}
      drawerContent={props => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: colorFFFFFF
      }}>
      <Drawer.Screen name={'Home'} component={Home} />
      <Drawer.Screen name={'Visit'} component={Visit} />
      <Drawer.Screen name={Routes.HEALTH_PROFILE_TRACKING_SCREEN} component={HealthProfile} />
      <Drawer.Screen name={Routes.SERVICES_SCREEN} component={Service} />
      <Drawer.Screen name={Routes.TOOLS_SCREEN} component={Tools} />
      <Drawer.Screen name={Routes.MAGAZINE_SCREEN} component={Magazine} />
      <Drawer.Screen name={'Support'} component={Support} />
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
    flex: 1,
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
