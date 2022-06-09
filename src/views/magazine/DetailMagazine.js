import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import HTML from 'react-native-render-html'
import Share from 'react-native-share'
import RNHTMLtoPDF from 'react-native-html-to-pdf'

import { color040404, color5C5D5E, colorFFFFFF } from 'constants/colors'
import Translate from '../../translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'

import icHeader from '../../../assets/images/header'
import icHealthProfile from '../../../assets/images/health_profile'

import Header from '../../components/Header'

export default function DetailMagazine({ route }) {

  const passingData = route?.params?.data
  const languageRedux = useSelector(state => state.common.language)

  const _onPressShare = async () => {
    let options1 = {
      html: passingData?.page || null,
      fileName: passingData?.name || '',
      directory: 'Documents',
      base64: true
    }
    let fileConvert = await RNHTMLtoPDF.convert(options1)
    let options = {
      url: `data:image;base64,${fileConvert?.base64}`
    }
    Share.open(options)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        err && console.log(err)
      })
  }

  const checkType = () => {
    if (passingData?.section === 0) {
      return Translate(languageRedux).HEALTH_INDEX
    }
    if (passingData?.section === 1) {
      return Translate(languageRedux).nutrition
    }
  }

  const renderContent = () => {
    return (
      <View>
        <Image source={{uri: `data:image;base64,${passingData?.image?.base64}`}} style={styles.imageStyle} />
        <Text style={[customTxt(Fonts.Bold, 16, color040404).txt, styles.ctnTitle]}>{passingData?.name || ''}</Text>
        <Text style={[customTxt(Fonts.Bold, 12, color5C5D5E).txt, styles.ctnTitle]}>{passingData?.description || ''}</Text>
        <View style={styles.marginHori20}>
          <HTML source={{ html: passingData?.page }} />
        </View>
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View>
        {renderContent()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={checkType()}
        iconLeft={icHeader.ic_left}
        iconRight={icHealthProfile.ic_function_right}
        onPressRight={_onPressShare}
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
  iconStyle: {
    height: 24,
    width: 24
  },
  ctnIconTop: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  marginHori20: {
    marginHorizontal: 20
  },
  marginT8: {
    marginTop: 8
  },
  ctnTitle: {
    marginHorizontal: 20,
    marginTop: 8
  }
})
