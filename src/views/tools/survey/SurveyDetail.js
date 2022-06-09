import React from 'react'
import {View, Text, StyleSheet, Dimensions, ScrollView} from 'react-native'
import { useSelector } from 'react-redux'
import { WebView } from 'react-native-webview'

import { color040404, colorF0F0F0, colorFFFFFF } from 'constants/colors'
import Translate from '../../../translate'
import NavigationService from 'navigation'

import icHeader from '../../../../assets/images/header'

import Header from 'components/Header'

export default function SurveyDetail({ route }) {
  const languageRedux = useSelector(state => state.common.language)
  const passingData = route?.params?.data

  const renderPaypal = () => {
    return (
      <WebView
        style={styles.webview}
        source={{ uri: passingData ? passingData : null}}
      />
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.paddingBottom}>
        {renderPaypal()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_left}
        textCenter={Translate(languageRedux).SURVEYS}
        textCenterColor={color040404}
        onPressLeft={() => {
          NavigationService.goBack()
        }}
      />
      <ScrollView>{renderBody()}</ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  bgOpacity: {
    width: '100%',
    height: '100%',
    flex: 1,
    position: 'absolute',
    backgroundColor: colorF0F0F0,
    opacity: 0.7
  },
  fullView: {
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    height: Dimensions.get('window').height - 50
  },
  webview: {
    alignItems: 'center',
    marginTop: 10,
    width: Dimensions.get('window').width,
    height: 1200
  },
  paddingBottom: {
    marginBottom: 48
  }
})
