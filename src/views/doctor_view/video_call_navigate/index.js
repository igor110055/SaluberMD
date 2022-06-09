import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import Translate from 'translate'
import { color3777EE, colorA7A8A9, colorF8F8F8, colorFFFFFF } from 'constants/colors'
import Fonts from 'constants/Fonts'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import { apiCheckStatusCall } from 'api/VideoCall'

import icHeader from '../../../../assets/images/header'

import HeaderVideoCall from './HeaderVideoCall'
import ConsultationInfo from './consultation_info'
import MedicalRecords from './medical_records'
import Tracking from './tracking'
import FileArchive from './file_archive'
import JoinButton from './JoinButton'
import VideoCallDoctor from '../video_call_doctor'
import DialogCustom from 'components/DialogCustom'
import LoadingView from 'components/LoadingView'

const Tab = createMaterialTopTabNavigator()

export default function VideoCallNavigate({ route }) {
  const languageRedux = useSelector(state => state.common.language)
  const passingData = route?.params?.data
  // const dataNoti = useSelector(state => state.common.dataNoti)
  const isJoinDoctor = route?.params?.isJoin || false
  const [isJoin, setJoin] = useState(isJoinDoctor || false)
  const dispatch = useDispatch()
  const [isDialog, setDialog] = useState(false)
  const [isLoad, setLoading] = useState(false)

  const _onPressJoin = () => {
    setLoading(true)
    dispatch(apiCheckStatusCall(route?.params?.idReq)).then(res => {
      console.log('apiCheckStatusCall: ', res)
      if (res?.payload?.status === '1') {
        setLoading(false)
        setJoin(true)
      } else {
        setLoading(false)
        setDialog(true)
      }
    }).catch(() => {
      setLoading(false)
      console.log('Err: callAPICheckConnect')
    })
  }

  const renderJoinButton = () => {
    return (
      <View style={styles.ctnButtonJoin}>
        <JoinButton
          onPress={_onPressJoin}
        />
      </View>
    )
  }

  const renderVideoCallDoctor = () => {
    return (
      <VideoCallDoctor
        idReq={route?.params?.idReq || ''}
        apiKey={passingData?.apiKey || ''}
        sessionId={passingData?.sessionId || ''}
        token={passingData?.token || ''}
      />
    )
  }

  const _onPresOK = () => {
    NavigationService.navigate(Routes.DRAWER_NAVIGATION_DOCTOR)
  }

  return (
    <View style={styles.container}>
      <HeaderVideoCall
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_left}
      />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: color3777EE,
          tabBarInactiveTintColor: colorA7A8A9,
          tabBarLabelStyle: {
            fontSize: 11,
            textTransform: 'none',
            fontFamily: Fonts.SemiBold,
            width:'100%',
            marginRight: 5
          },
          tabBarStyle: {
            height: 52,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16
          },
          tabBarIndicatorStyle: {
            height: 4,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16
          },
          tabBarScrollEnabled: true
        }}>
        <Tab.Screen
          name={'Consultation Info'}
          options={{ tabBarLabel: Translate(languageRedux).CONSULTATION_INFO || '' }}
          component={ConsultationInfo}
        />
        <Tab.Screen
          name={'Medical Records'}
          options={{ tabBarLabel: Translate(languageRedux).MEDICAL_RECORDS || '' }}
          component={MedicalRecords}
        />
        <Tab.Screen
          name={'Tracking'}
          options={{ tabBarLabel: Translate(languageRedux).TRACKING || '' }}
          component={Tracking}
        />
        <Tab.Screen
          name={'Files Archive'}
          options={{ tabBarLabel: Translate(languageRedux).FILE_ARCHIVE || '' }}
          component={FileArchive}
        />
      </Tab.Navigator>
      {!isJoin && renderJoinButton()}
      {isJoin && renderVideoCallDoctor()}
      {
        isDialog && (
          <DialogCustom
            title={Translate(languageRedux).INFO_BTN}
            content={Translate(languageRedux).MSG_PATIENT_CANCELED_CALL}
            txtlLeft={Translate(languageRedux).OK}
            onPressCancel={_onPresOK}
          />
        )
      }
      {isLoad && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  ctnButtonJoin: {
    alignItems: 'center'
  }
})
