import React, { useState } from 'react'
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native'
import Icon from 'react-native-vector-icons/Octicons'
import {useSelector} from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../api/APIs'

import {colorFFFFFF, color3777EE, color040404, color5C5D5E, colorDDDEE1} from 'constants/colors'
import Translate from '../../../translate'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import { convertDMMMYYYY } from 'constants/DateHelpers'

import icHeader from '../../../../assets/images/header'
import icService from '../../../../assets/images/services'

import Header from 'components/Header'
import Button from 'components/Button'
import DialogView from 'components/DialogView'

export default function Step3({ route }) {
  const languageRedux = useSelector(state => state.common.language)
  const dataSlot = route?.params?.data
  const dataDoctor = route?.params?.passingData
  const token = useSelector(state => state.user.token)
  const userinfo = useSelector(state => state.user.userinfo)
  const [isDialog, setDialog] = useState(false)

  const renderTop = () => {
    return (
      <View style={styles.ctnTop}>
        <Icon name={'checklist'} size={40} color={color3777EE} />
        <Text style={customTxt(Fonts.Bold, 20, color040404).txt}>{Translate(languageRedux).confirm_app}</Text>
      </View>
    )
  }

  const renderSummary = () => {
    return (
      <View style={styles.ctnList}>
        {/* DOCTOR */}
        <View>
          <View style={styles.flexRow}>
            <Image source={icService.ic_user_check} style={styles.iconStyle} />
            <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginL8]}>
              {Translate(languageRedux).DOCTOR}
            </Text>
            </View>
            <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginL16]}>
              {dataDoctor?.nome ? dataDoctor?.nome : ''}{' '}{dataDoctor?.cognome ? dataDoctor?.cognome : ''}
            </Text>
        </View>
        {/* DATE */}
        <View>
          <View style={styles.structure}>
            <Image source={icService.ic_calendar_black} style={styles.iconStyle} />
            <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginL8]}>
              {Translate(languageRedux).DATE_AND_TIME}
            </Text>
            </View>
            <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginL16]}>
              {dataSlot?.startsAt ? convertDMMMYYYY(dataSlot?.startsAt) : ''}
            </Text>
        </View>
        {/* DURATION */}
        <View>
          <View style={styles.structure}>
            <Image source={icService.ic_clock} style={styles.iconStyle} />
            <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginL8]}>
              {Translate(languageRedux).duration}
            </Text>
            </View>
            <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginL16]}>
              {dataDoctor?.timeslot ? dataDoctor?.timeslot : ''}{' '}{Translate(languageRedux).minutes}
            </Text>
        </View>
        {/* PRICE */}
        <View>
          <View style={styles.structure}>
            <Image source={icService.ic_dollar} style={styles.iconStyle} />
            <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginL8]}>
              {Translate(languageRedux).price}
            </Text>
            </View>
            <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginL16]}>
              {dataDoctor?.currency ? dataDoctor?.currency : ''}{dataDoctor?.fee ? dataDoctor?.fee : ''}
            </Text>
        </View>
      </View>
    )
  }

  const renderButton = () => {
    return (
      <View>
        <Button
          backgroundColor={color3777EE}
          text={Translate(languageRedux).prenota}
          textColor={colorFFFFFF}
          onPress={_onPressBookNow}
        />
      </View>
    )
  }

  const getTimeZone = () => {
    var date = new Date()
    var offsetInHours = date.getTimezoneOffset()
    return offsetInHours
  }

  const _onPressBookNow = () => {
    const body = {
      answer1: '',
      answer2: '',
      childname: '',
      childbirthdate: '',
      slot: {
        id: dataSlot?.id,
        doctorId: dataDoctor?.id,
        bookingDate: null,
        patientId: null,
        encPatientId: null,
        timeSlot: dataDoctor?.timeslot,
        user: null,
        doctor: null,
        startsAt: dataSlot?.startsAt,
        endsAt: dataSlot?.endsAt,
        title: '',
        timezone: getTimeZone(),
        description: null,
        jointApp: null,
        fee: null,
        currency: null,
        sessionPlace: null,
        departmetnCode: null,
        doctorCode: null,
        sessionId: null,
        specializationId: userinfo?.specialization
      }
    }
    console.log('BODY: ', body)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/newAppointment`,
      headers: {
        'x-auth-token': token
      },
      data: body
    })
    .then(response => {
      console.log('data: ', response.data)
      if (response.data?.esito === '0') {
        NavigationService.navigate(Routes.NUTRITIONIST_4_SCREEN)
      }
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
  }

  const renderBody = () => {
    return (
      <View style={styles.paddingBottom}>
        {renderTop()}
        {renderSummary()}
        {renderButton()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_left}
        textCenter={Translate(languageRedux).nutritionist}
        textCenterColor={color040404}
        onPressLeft={() => {
          NavigationService.goBack()
        }}
        onPressRight={() => {setDialog(true)}}
        iconRight={icHeader.ic_close}
      />
      <ScrollView>{renderBody()}</ScrollView>
      <DialogView
        isShow={isDialog}
        onPressCancel={() => setDialog(false)}
        title={Translate(languageRedux).WARNING_TITLE_NOTIFICATION}
        content={Translate(languageRedux).HOME_WARNING_MESSAGE}
        txt1={Translate(languageRedux).N}
        txt2={Translate(languageRedux).Y}
        onPressOK={() => {
          NavigationService.navigate(Routes.SERVICES_SCREEN)
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  paddingBottom: {
    paddingBottom: 48,
    marginHorizontal: 20
  },
  ctnTop: {
    alignItems: 'center'
  },
  ctnLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  marginL8: {
    marginLeft: 8
  },
  ctnList: {
    marginVertical: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    borderRadius: 16
  },
  answer: {
    flex: 1,
    marginLeft: 8
  },
  width2: {
    width: 2
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  structure: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  marginL16: {
    marginLeft: 32,
    marginTop: 4
  },
  marginT4: {
    marginTop: 4
  }
})
