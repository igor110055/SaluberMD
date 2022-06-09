import React from 'react'
import {View, Text, StyleSheet, ScrollView} from 'react-native'
import { useSelector } from 'react-redux'

import {color040404, colorA7A8A9, colorF0F0F0, colorFFFFFF} from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from 'translate'
import {convertDMMMYYYY} from 'constants/DateHelpers'
import NavigationService from 'navigation'

import icHeader from '../../../../../../assets/images/header'

import Header from 'components/Header'

export default function Diseases({route}) {
    const languageRedux = useSelector(state => state.common.language)
    const passingData = route?.params?.data


    const RenderItem = ({category, content}) => {
      return (
        <View style={styles.ctnItem}>
          <Text style={customTxt(Fonts.SemiBold, 12, colorA7A8A9).txt}>
            {category}
          </Text>
          <Text
            style={[
              customTxt(Fonts.Regular, 16, color040404).txt,
              styles.marginT8
            ]}>
            {content}
          </Text>
          <View style={styles.divider} />
        </View>
      )
    }

    const renderBody = () => {
      return (
        <View>
          <RenderItem
            category={Translate(languageRedux).disease_1}
            content={passingData?.disease}
          />
          {passingData?.diseaseId === '1' && (
            <RenderItem
              category={Translate(languageRedux).other}
              content={passingData?.name}
            />
          )}
          <RenderItem
            category={Translate(languageRedux).complications}
            content={passingData?.complicationName}
          />
          <RenderItem
            category={Translate(languageRedux).since}
            content={
              passingData?.startDate ? convertDMMMYYYY(passingData?.startDate) : ''
            }
          />
          <RenderItem
            category={Translate(languageRedux).note}
            content={passingData?.remarks}
          />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <Header
          textCenter={Translate(languageRedux).CHRONIC_DISEASE}
          iconLeft={icHeader.ic_left}
          onPressLeft={() => {NavigationService.goBack()}}
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
  ctnItem: {
    marginHorizontal: 20,
    marginBottom: 16
  },
  marginT8: {
    marginTop: 8,
    marginBottom: 16
  },
  divider: {
    height: 1,
    backgroundColor: colorF0F0F0
  }
})
