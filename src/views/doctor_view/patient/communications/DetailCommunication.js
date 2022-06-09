import React from 'react'
import {View, Text, StyleSheet, ScrollView, FlatList} from 'react-native'
import {useSelector} from 'react-redux'

import {color040404, color848586, colorF0F0F0, colorFFFFFF} from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from 'translate'
import { convertDMMMYYYY } from 'constants/DateHelpers'

import icHeader from '../../../../../assets/images/header'

import Header from 'components/Header'

export default function DetailCommunication({route}) {
  const languageRedux = useSelector(state => state.common.language)
  const passingData = route?.params?.data

  const renderTag = () => {
    const RenderItem = ({item}) => {
      return (
        <View style={styles.ctnItem}>
          <Text style={customTxt(Fonts.SemiBold, 12, color848586).txt}>
            {item?.name}
          </Text>
        </View>
      )
    }
    return (
      <View style={styles.ctnList}>
        <FlatList
          data={passingData?.tags}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        <Text style={customTxt(Fonts.Bold, 20, color040404).txt}>
          {passingData?.subject ? passingData?.subject : Translate(languageRedux).CONSULTATION_REQUEST}
        </Text>
        <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginT8]}>
          {convertDMMMYYYY(passingData?.insertDate || passingData?.date || passingData?.prescriptionDate)}
        </Text>
        {renderTag()}
        <Text style={[customTxt(Fonts.Regular, 12, color040404).txt, styles.marginT8]}>
          {Translate(languageRedux).description}
        </Text>
        <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginT8]}>
          {passingData?.description || passingData?.referral || passingData?.text}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        iconLeft={icHeader.ic_left}
        backgroundColor={colorFFFFFF}
        textCenter={' '}
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
  ctnBody: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 42
  },
  marginT8: {
    marginTop: 8
  },
  ctnItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colorF0F0F0,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4
  },
  ctnList: {
    marginTop: 24,
    marginBottom: 16
  }
})
