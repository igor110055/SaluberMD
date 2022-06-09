import React, {useEffect} from 'react'
import {View, Text, StyleSheet, DeviceEventEmitter} from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import {useSelector} from 'react-redux'
import { useNavigation } from '@react-navigation/native'

import {color040404, color3777EE, colorA7A8A9, colorDDDEE1, colorFFFFFF} from 'constants/colors'
import Translate from '../../../translate'
import NavigationService from 'navigation'
import Fonts from 'constants/Fonts'
import Routes from 'navigation/Routes'

import icHeader from '../../../../assets/images/header'

import Header from 'components/Header'

const Tab = createMaterialTopTabNavigator()

import ClinicHistory from './ClinicHistory'
import AddRequestClinic from './AddRequestClinic'

export default function ClinicAppointment() {
  const languageRedux = useSelector(state => state.common.language)
  const navigation = useNavigation()

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.CLINIC_APPOINTMENT_SCREEN, params => {
      if (params?.history) {
        navigation.navigate('History')
      }
    })
    return () => subscription.remove()
  }, [])

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_left}
        onPressLeft={() => {
          NavigationService.navigate(Routes.SERVICES_SCREEN)
        }}
        textCenter={Translate(languageRedux).appuntamento_clinica}
        textCenterColor={color040404}
      />
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
            borderBottomColor: colorDDDEE1,
            borderBottomWidth: 0.75
          },
          tabBarIndicatorStyle: {
            height: 4,
            width: 120,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            marginHorizontal: 40
          }
        }}>
        <Tab.Screen
          name={'AddRequest'}
          options={{ tabBarLabel: Translate(languageRedux).NEW_REQUEST || '' }}
          component={AddRequestClinic}
        />
        <Tab.Screen
          name={'History'}
          options={{ tabBarLabel: Translate(languageRedux).HISTORY || '' }}
          component={ClinicHistory}
        />
      </Tab.Navigator>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  }
})
