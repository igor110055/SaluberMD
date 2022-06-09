import Header from 'components/Header'
import { customTxt } from 'constants/css'
import { convertNumberToMMMDDYYYYhhmmA } from 'constants/DateHelpers'
import Fonts from 'constants/Fonts'
import React, { useEffect } from 'react'
import {
  StyleSheet, View, Text, ScrollView
} from 'react-native'

import icHeader from '../../../../assets/images/header'
import { color040404, colorFFFFFF } from '../../../constants/colors'

export default function DetailNotificationView({ route }) {
  const data = route?.params?.data

  useEffect(() => {
    console.log('data: ', data)
  }, [])

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_left}
        textCenter={' '}
      />
      <ScrollView>
        <Text style={[
          customTxt(Fonts.Bold, 20, color040404).txt,
          styles.txtTitle
        ]}>{data?.title || ''}</Text>
        <Text style={[
          customTxt(Fonts.Regular, 14, color040404).txt,
          styles.txtDate
        ]}>{data?.date ? convertNumberToMMMDDYYYYhhmmA(data?.date) : ''}</Text>
        <Text style={[
          customTxt(Fonts.Regular, 16, color040404).txt,
          styles.txtTitle
        ]}>{data?.message || ''}</Text>
      </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  txtTitle: {
    margin: 20
  },
  txtDate: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20
  }
})
