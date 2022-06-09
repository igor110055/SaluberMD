import React from 'react'
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native'

import Header from '../../components/Header'
import icHeader from '../../../assets/images/header'
import { color040404, color363636, color5C5D5E, colorA7A8A9, colorEAF1FF, colorF0F0F0, colorF8F8F8, colorFFFFFF } from '../../constants/colors'
import NavigationService from '../../routes'
import { customTxt } from '../../constants/css'
import Fonts from '../../constants/Fonts'
import Translate from '../../translate'
import { useSelector } from 'react-redux'
import {convertDMMMYYYY, convertNumberTime} from '../../constants/DateHelpers'
import icVisit from '../../../assets/images/visit'

export default function DetialAppointment({route}) {

    const languageRedux = 'en_US'//useSelector(state => state.common.language)
    const passingData = route?.params?.data

    const renderBox = () => {
        const convertDate = passingData?.date ? convertDMMMYYYY(passingData?.date) : ''
        const convertTime = passingData?.date ? convertNumberTime(passingData?.date) : ''
        const DateTime = (convertDate && convertTime) ? (convertDate + ', ' + convertTime) : ''
        return (
          <View style={styles.ctnDocName}>
            {/* DOCTOR NAME */}
            <View style={styles.marginB8}>
              <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
                {Translate(languageRedux).DOCTOR}
              </Text>
            </View>
            <View style={styles.marginB8}>
              <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
                Doc.{' '}{passingData?.doctor}</Text>
            </View>
            <View style={styles.divider}/>
            {/* DATE and TIME */}
            <View style={styles.marginB8}>
              <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
                {Translate(languageRedux).appointment}
              </Text>
            </View>
            <View style={styles.marginB16}>
              <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>{DateTime}</Text>
            </View>
            <View style={styles.divider}/>
            {/* WHO IS THIS FOR */}
            <View style={styles.marginB8}>
              <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
                {Translate(languageRedux).WHO_IS_FOR}
              </Text>
            </View>
            <View style={styles.marginB16}>
              <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
                {passingData?.risposta1}
              </Text>
            </View>
            <View style={styles.divider}/>
            {/* DESCRIPTION */}
            <View style={styles.marginB8}>
              <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
                {Translate(languageRedux).description}
              </Text>
            </View>
            <View style={styles.marginB16}>
              <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
                {passingData?.about}
              </Text>
            </View>
            <View style={styles.divider}/>
            {/* DOCUMENT */}
            <View style={styles.ctnRecomDoc}>
              <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
                {Translate(languageRedux).Result_of_the_consultation}
              </Text>
            </View>
            <View style={styles.ctnButton}>
              {passingData?.hasSoap !== '1' && <View style={styles.info}>
                <View style={styles.ctnIcon}>
                  <Image source={icVisit.ic_info} style={styles.iconStyle}/>
                </View>
                <View style={styles.ctnText}>
                  <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
                    {Translate(languageRedux).TITLE_AFTER_VIDEO_CALL}
                  </Text>
                </View>
              </View>}
              {passingData?.hasSoap === '1' && <View>
                {/* SUBJECTIVE */}
                <View style={styles.marginB8}>
                  <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
                    {passingData?.hasSoap === '1' ?
                    Translate(languageRedux).SUBJECTIVE :
                    Translate(languageRedux).CONSULT}
                  </Text>
                </View>
                <View style={styles.marginB16}>
                  <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
                    {passingData?.consult}
                  </Text>
                </View>
                <View style={styles.divider}/>
                {/* Objective */}
                {passingData?.hasSoap === '1' && <View>
                  <View style={styles.marginB8}>
                    <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
                      {Translate(languageRedux).OBJECTIVE}
                    </Text>
                  </View>
                  <View style={styles.marginB16}>
                    <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
                      {passingData?.doctorObjective}
                    </Text>
                  </View>
                  <View style={styles.divider}/>
                </View>}
                {/* ASSESSMENT */}
                <View style={styles.marginB8}>
                  <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
                    {passingData?.hasSoap === '1' ?
                    Translate(languageRedux).ASSESSMENT :
                    Translate(languageRedux).DIAGNOSIS}
                  </Text>
                </View>
                <View style={styles.marginB16}>
                  <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
                    {passingData?.diagnosis}
                  </Text>
                </View>
                <View style={styles.divider}/>
                {/* PLAN */}
                <View style={styles.marginB8}>
                  <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
                    {passingData?.hasSoap === '1' ?
                    Translate(languageRedux).PLAN  :
                    Translate(languageRedux).RECOMMENDATION}
                  </Text>
                </View>
                <View style={styles.marginB16}>
                  <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
                    {passingData?.recommendations}
                  </Text>
                </View>
                <View style={styles.divider}/>
              </View>}
            </View>
          </View>
        )
    }

    const renderBody = () => {
        return (
          <View style={styles.ctnBody}>
            {renderBox()}
          </View>
        )
    }

    return (
      <View style={styles.flex}>
        <Header
          backgroundColor={colorFFFFFF}
          iconLeft={icHeader.ic_left}
          onPressLeft={() => NavigationService.goBack()}
          textCenter={Translate(languageRedux).consultation}
        />
        <ScrollView>{renderBody()}</ScrollView>
      </View>
    )
}

const styles = StyleSheet.create({
  flex: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: colorF8F8F8
  },
  ctnBody: {
    marginTop: 15,
    marginBottom: 42,
    marginHorizontal: 20,
    borderRadius: 16,
    backgroundColor: colorFFFFFF,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 9
  },
  ctnDocName: {
    marginHorizontal: 16,
    marginTop: 16
  },
  marginB8: {
    marginBottom: 8
  },
  marginB16: {
    marginBottom: 16
  },
  divider: {
    width: '100%',
    borderWidth: 1,
    borderColor: colorF0F0F0,
    marginBottom: 16
  },
  ctnRecomDoc: {
  },
  ctnButton: {
    marginTop: 16,
    marginBottom: 16
   },
  info: {
    height: 84,
    width: '100%',
    backgroundColor: colorEAF1FF,
    borderRadius: 12
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  ctnIcon: {
    marginTop: 16,
    marginLeft: 16,
    marginBottom: 8
  },
  ctnText: {
    marginLeft: 16,
    marginBottom: 16
  }
})