import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

import { color040404, colorFFFFFF } from 'constants/colors'
import Translate from '../../../translate'
import { apiCheckPermission } from 'api/MedicalRecord'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'

import icHeader from '../../../../assets/images/header'

import Header from '../../healthProfile/components/Header'
import LoadingView from '../../../components/LoadingView'
import DeviceInfo from 'react-native-device-info'

export default function Pricing() {

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
          <View style={styles.title}>
            <Text style={customTxt(Fonts.Bold, 25, color040404).txt}>
              {content?.iniziativa?.valuePricing} {Translate(languageRedux).PRICING_SECTION1_TITLE}
            </Text>
          </View>
          <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginB16]}>
            {Translate(languageRedux).PRICING_SECTION1_P1}
          </Text>
          <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginB16]}>
            {Translate(languageRedux).PRICING_SECTION1_P2}
          </Text>
          <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
            {Translate(languageRedux).PRICING_SECTION1_P3}
          </Text>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <Header
          backgroundColor={colorFFFFFF}
          source={icHeader.ic_left}
          title={Translate(languageRedux).PRICING_TITLE}
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
    marginHorizontal: 20
  },
  title: {
    alignItems: 'center',
    marginBottom: 20
  },
  marginB16: {
    marginBottom: 16
  }
})
