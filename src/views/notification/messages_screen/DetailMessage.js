import Header from 'components/Header'
import { color040404, colorFFFFFF } from 'constants/colors'
import NavigationService from 'navigation'
import React from 'react'
import {
  StyleSheet, View, Text, ScrollView, DeviceEventEmitter
} from 'react-native'
import { useSelector } from 'react-redux'
import Translate from 'translate'
import icHeader from 'images/header'
import { border, customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Routes from 'navigation/Routes'

export default function DetailMessage({
  route
}) {
  const passingData = route?.params?.data
  const languageRedux = useSelector(state => state.common.language)

  const renderContent = () => {
    return (
      <ScrollView style={border().borderT}>
        <Text style={[
          customTxt(Fonts.Bold, 16, color040404).txt,
          styles.txtTitle
        ]}>{passingData?.title || ''}</Text>
        <Text style={[
          customTxt(Fonts.Regular, 14, color040404).txt,
          styles.txtMsg
        ]}>{passingData?.message || ''}</Text>
      </ScrollView>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).message}
        iconLeft={icHeader.ic_left}
        // iconRight={icHeader.ic_function}
        onPressLeft={() => {
          setTimeout(() => {
            DeviceEventEmitter.emit(Routes.NOTIFICATION_SCREEN)
          }, 300)
          NavigationService.goBack()
        }}
      />
      {renderContent()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  txtTitle: {
    paddingTop: 30,
    marginLeft: 20,
    marginRight: 20
  },
  txtMsg: {
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 40
  }
})
