import React from 'react'
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import HTML from 'react-native-render-html'

import { color040404, colorFFFFFF } from 'constants/colors'
import Translate from '../../../../translate'

import icHeader from '../../../../../assets/images/header'

import Header from '../../../healthProfile/components/Header'

export default function DetailViewProfile({ route }) {

  const languageRedux = useSelector(state => state.common.language)
  const passingData = route?.params?.data


  const renderBody = () => {
    return (
      <View style={styles.paddingBottom}>
        <Image source={{uri: `data:image;base64,${passingData?.image?.base64}`}} style={styles.imageStyle} />
        <View style={styles.content}>
          <HTML source={{ html: passingData?.page }} />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        source={icHeader.ic_left}
        title={passingData?.name}
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
  imageStyle: {
    height: 219,
    width: '100%'
  },
  content: {
    marginHorizontal: 20
  },
  paddingBottom: {
    paddingBottom: 48
  }
})
