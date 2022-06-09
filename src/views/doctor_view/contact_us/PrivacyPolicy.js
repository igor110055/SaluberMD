import { color040404, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import React from 'react'
import {
  StyleSheet, View, Text, ScrollView
} from 'react-native'
import { useSelector } from 'react-redux'
import Translate from 'translate'
import HTML from 'react-native-render-html'

export default function PrivacyPolicyView() {
  const languageRedux = useSelector(state => state.common.language)
  const permision = useSelector(state => state.user.permission)

  const renderContent = (txt, txt1) => {
    return (
      <View>
        <Text style={[
          customTxt(Fonts.SemiBold, 16, color040404).txt,
          styles.marginTxtTitle
        ]}>{txt}</Text>
        <Text style={[
          customTxt(Fonts.Regular, 16, color040404).txt,
          styles.marginTxtContent
        ]}>{txt1}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollStyle}
        contentContainerStyle={styles.contentContainerStyle}
      >
        {/* <Text style={[
          customTxt(Fonts.Bold, 24, color040404).txt
        ]}>{Translate(languageRedux).PRIVACY_POLICY_TITLE}</Text>
        {renderContent(Translate(languageRedux).PRIVACY_1, Translate(languageRedux).PRIVACY_2)}
        {renderContent(Translate(languageRedux).PRIVACY_3, Translate(languageRedux).PRIVACY_4)}
        {renderContent(Translate(languageRedux).PRIVACY_5, Translate(languageRedux).PRIVACY_6)} */}
        <HTML source={{ html: permision?.iniziativa?.privacyPolicy || '' }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  scrollStyle: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 20,
    paddingRight: 20
  },
  contentContainerStyle: {
    paddingBottom: 160
  },
  marginTxtTitle: {
    marginTop: 8,
    marginBottom: 16
  },
  marginTxtContent: {
    marginBottom: 16
  }
})
