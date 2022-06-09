import React, { useEffect, useState } from 'react'
import { View, StyleSheet, DeviceEventEmitter } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

import { color040404, color3777EE, colorA7A8A9, colorDDDEE1, colorFFFFFF } from 'constants/colors'
import Translate from '../../../translate'
import NavigationService from 'navigation'
import Fonts from 'constants/Fonts'
import Routes from 'navigation/Routes'

import icHeader from '../../../../assets/images/header'

import Header from 'components/Header'

const Tab = createMaterialTopTabNavigator()

import GeneticTestHistory from './GeneticTestHistory'
import AddRequestTest from './AddRequestTest'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
import LoadingView from 'components/LoadingView'

export default function GeneticTest() {
  const languageRedux = useSelector(state => state.common.language)
  const navigation = useNavigation()
  const [dataNoti, setDataNoti] = useState()
  const [isShowNoti, setShowNoti] = useState()
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.GENETIC_TEST_SCREEN, params => {
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
        textCenter={Translate(languageRedux).geneticTestTitle}
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
          component={() => {
            return <AddRequestTest
              setShowNoti={val => {setShowNoti(val)}}
              setDataNoti={val => setDataNoti(val)}
              setLoading={val => setLoading(val)}
            />
          }}
        />
        <Tab.Screen
          name={'History'}
          options={{ tabBarLabel: Translate(languageRedux).HISTORY || '' }}
          component={GeneticTestHistory}
        />
      </Tab.Navigator>
      {isLoading && <LoadingView />}
      <NotificationView
        isShow={isShowNoti}
        setShow={() => setShowNoti(false)}
        status={dataNoti?.status || STATUS_NOTIFY.ERROR}
        content={dataNoti?.content || ''}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  }
})
