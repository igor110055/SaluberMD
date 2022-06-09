import React, { useState } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Header from '../../components/Header'
import { color3777EE, colorA7A8A9, colorF8F8F8, colorFFFFFF } from '../../constants/colors'
import NavigationService from '../../routes'
import icHeader from '../../../assets/images/header'
import Routes from '../../routes/Routes'
// import SOSButton from '../home_screen/components/SOSButton/SOSButton'
// import PlusButtonFloating from './PlusButtonFloating'
import icVisit from '../../../assets/images/visit'
import Fonts from '../../constants/Fonts'
import Translate from '../../translate'
import MenuBar from '../../components/MenuBar'

const Tab = createMaterialTopTabNavigator()

import HistoryAppointment from './HistoryAppointment'
import UpcomingAppointment from './UpcomingAppointment'

export default function Visit() {
  const [isShow, setShow] = useState(false)
  const typeView = ''
  const languageRedux = 'en_US'//useSelector(state => state.common.language)
  const countNotiRedux = ''//useSelector(state => state.common.countNoti)

  // const renderPlusButton = () => {
  //   return (
  //     <SOSButton
  //       source={isShow ? icVisit.ic_x : icVisit.ic_plus}
  //       backgroundColor={color3777EE}
  //       onPress={() => { setShow(true) }}
  //     />
  //   )
  // }

  const _onPressNotificaion = () => {
    // return NavigationService.navigate(Routes.NOTIFICATION_SCREEN)
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={
          typeView === 'home' ? icHeader.ic_left : icHeader.ic_menudrawer
        }
        iconRight={icHeader.ic_noti}
        onPressRight={_onPressNotificaion}
        notiRight={countNotiRedux}
      />
      <View style={styles.menuView}>
        <MenuBar />
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: color3777EE,
            tabBarInactiveTintColor: colorA7A8A9,
            tabBarLabelStyle: {
              fontSize: 14,
              textTransform: 'none',
              fontFamily: Fonts.SemiBold
            },
            tabBarStyle: {
              height: 52,
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16
            },
            tabBarIndicatorStyle: {
              height: 4,
              width: 76,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              marginHorizontal: ((Dimensions.get('window').width - 300) / 2 - 76) / 2
            }
          }}>
          <Tab.Screen
            name={'Upcoming'}
            options={{ tabBarLabel: Translate(languageRedux).UPCOMING || '' }}
            component={UpcomingAppointment}
          />
          <Tab.Screen
            name={'History'}
            options={{ tabBarLabel: Translate(languageRedux).HISTORY || '' }}
            component={HistoryAppointment}
          />
        </Tab.Navigator>
      </View>
      {/* {renderPlusButton()} */}
      {/* {isShow === true && (
        <View style={[styles.floatView]}>
          <PlusButtonFloating
            onPressCancel={() => {
              setShow(false)
            }}
            onPressAppointment={() => {
              setShow(false)
              NavigationService.navigate(Routes.NEW_APPOINTMENT_SCREEN)
            }}
            onPressDirectCall={() => {
              setShow(false)
              NavigationService.navigate(Routes.VISITS_DIRECT_CALL_SCREEN)
            }}
          />
        </View>)} */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: colorF8F8F8
  },
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  menuView: {
    flex: 1,
    flexDirection: 'row'
  },
  fullView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  }
})
