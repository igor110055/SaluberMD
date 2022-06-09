import React, { useEffect, useState } from 'react'
import { View, StyleSheet, DeviceEventEmitter } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Header from '../../components/Header'
import { color3777EE, colorA7A8A9, colorE53E3E, colorF8F8F8, colorFFFFFF } from 'constants/colors'
import NavigationService from 'navigation'
import Fonts from 'constants/Fonts'
import Translate from '../../translate'
import icHeader from '../../../assets/images/header'
import icHealthProfile from '../../../assets/images/health_profile'
import LoadingView from '../../components/LoadingView'
import DialogCustom from 'components/DialogCustom'

const Tab = createMaterialTopTabNavigator()

import AlertView from './alert_screen'
import MessageView from './messages_screen'
import { apiCountNotification, apiDeleteNotificationWithType } from 'api/Notification'
import Routes from 'navigation/Routes'
import { saveCountNoti } from 'actions/common'

export default function NotificationMain() {
  const dispatch = useDispatch()
  const languageRedux = useSelector(state => state.common.language)
  const [isLoad, setLoading] = useState(false)
  const [isDialog, setDialog] = useState(false)
  const [indexTab, setIndexTab] = useState(0)

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.NOTIFICATION_SCREEN, (param) => {
      if (param?.tabs === 0) {
        setIndexTab(0)
      } else if (param?.tabs === 1) {
        setIndexTab(1)
      }
    })

    return () => subscription.remove()
  }, [])

  const _onPressDelete = () => {
    setLoading(true)
    setDialog(false)
    dispatch(apiDeleteNotificationWithType(indexTab)).then(res => {
      setLoading(false)
      callAPICountNoti()
      DeviceEventEmitter.emit(Routes.NOTIFICATION_SCREEN, {tabs: 3})
    }).catch(() => {
      setLoading(false)
    })
  }

  const callAPICountNoti = () => {
    dispatch(apiCountNotification()).then(res => {
      const dataNoti = res?.payload?.total  || null
      Promise.all([
        dispatch(saveCountNoti(dataNoti))
      ])
    })
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).NOTIFICATIONS_TITLE}
        iconLeft={icHeader.ic_left}
        iconRight={icHealthProfile.ic_delete}
        onPressLeft={() => {
          NavigationService.popToRoot()
        }}
        onPressRight={() => setDialog(true)}
      />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: color3777EE,
          tabBarInactiveTintColor: colorA7A8A9,
          tabBarLabelStyle: {
            fontSize: 16,
            textTransform: 'none',
            fontFamily: Fonts.Medium
          },
          tabBarStyle: {
            // height: 52,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16
          },
          tabBarIndicatorStyle: {
            height: 4,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16
          }
        }}>
        <Tab.Screen
          name={'Alert'}
          options={{ tabBarLabel: Translate(languageRedux).ALERT || '' }}
          component={AlertView}
        />
        <Tab.Screen
          name={'Messages'}
          options={{ tabBarLabel: Translate(languageRedux).message || '' }}
          component={MessageView}
        />
      </Tab.Navigator>
      {isLoad && <LoadingView />}
      {
        isDialog && (
          <DialogCustom
            title={indexTab === 0 ? Translate(languageRedux).ALERT : Translate(languageRedux).message}
            content={Translate(languageRedux).DELETE_NOTIFICATION_MSG}
            txtlLeft={Translate(languageRedux).cancel}
            onPressCancel={() => setDialog(false)}
            txtRight={Translate(languageRedux).delete_record}
            styleRightView={styles.styleRightView}
            onPressOK={_onPressDelete}
          />
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  styleRightView: {
    backgroundColor: colorE53E3E
  }
})
