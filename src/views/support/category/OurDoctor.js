import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

import { color040404, color3777EE, colorFFFFFF } from 'constants/colors'
import Translate from '../../../translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import { apiCheckPermission } from 'api/MedicalRecord'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'

import icHeader from '../../../../assets/images/header'

import Header from '../../healthProfile/components/Header'
import LoadingView from '../../../components/LoadingView'
import Button from '../../../components/Button'
import DeviceInfo from 'react-native-device-info'

export default function OurDoctor() {

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
        <View>
          <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginHori20]}>
            {content?.iniziativa?.ourDoctorText}
          </Text>
          <View style={styles.marginHori20}>
            <Button
              text={Translate(languageRedux).VIEW_PROFILES}
              textColor={colorFFFFFF}
              backgroundColor={color3777EE}
              onPress={() => {NavigationService.navigate(Routes.VIEW_PROFILE_DOCTOR_SCREEN)}}
            />
          </View>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <Header
          backgroundColor={colorFFFFFF}
          source={icHeader.ic_left}
          title={Translate(languageRedux).ABOUT_US_SECTION3_TITLE}
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
    marginHori20: {
      marginHorizontal: 20,
      marginTop: 12
    },
    imageStyle: {
      height: 219,
      width: '100%'
    }
  })
