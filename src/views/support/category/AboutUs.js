import React, { useState, useEffect } from 'react'
import { View, Platform, StyleSheet, ScrollView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import HTML from 'react-native-render-html'

import { colorFFFFFF } from 'constants/colors'
import Translate from '../../../translate'
import { apiCheckPermission } from 'api/MedicalRecord'

import icHeader from '../../../../assets/images/header'

import Header from '../../healthProfile/components/Header'
import LoadingView from '../../../components/LoadingView'
import DeviceInfo from 'react-native-device-info'

export default function AboutUs() {

  const languageRedux = useSelector(state => state.common.language)
  const dispatch = useDispatch()
  const [isLoad, setLoading] = useState(true)
  const [content, setContent] = useState()

  useEffect(() => {
    callAPICheckPermission()
  }, [])

  const callAPICheckPermission = () => {
    const params = {
      build: DeviceInfo.getBuildNumber(),
      isIOS: Platform.OS === 'ios',
      uuid: DeviceInfo.getUniqueId(),
      version: DeviceInfo.getVersion()
    }
    dispatch(apiCheckPermission(params)).then(res => {
      console.log('callAPICheckPermission Res: ', res)
      setContent(res?.payload)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }

  const renderContent = () => {
    return (
      <View style={styles.ctnContent}>
        <HTML source={{ html: content?.iniziativa?.howItWorksText }} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        source={icHeader.ic_left}
        title={Translate(languageRedux).ABOUT_US_TITLE}
      />
      <ScrollView>{renderContent()}</ScrollView>
      {isLoad && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  ctnContent: {
    marginHorizontal: 12
  }
})
