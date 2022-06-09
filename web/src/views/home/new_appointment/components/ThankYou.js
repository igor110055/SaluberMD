import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, StyleSheet, Image, ScrollView, TouchableOpacity, Linking, Platform, Dimensions } from 'react-native'
import moment from 'moment'
import * as AddCalendarEvent from 'react-native-add-calendar-event'

import { color040404, color333333, color3777EE, color5C5D5E, colorBDBDBD, colorDDDEE1, colorFFFFFF } from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import NavigationService from '../../../../routes'
import Routes from '../../../../routes/Routes'
import Translate from '../../../../translate'
import { convertNumberTime12, convertDateTime, converToUTC } from '../../../../constants/DateHelpers'

import icHeader from '../../../../../assets/images/header'
import icNA from '../../../../../assets/images/new_appointment'

import Button from '../../../../components/Button'
import { apiPostAddSlotRequest, apiPostNewAppointment } from '../../../visit/apis'
import { userinfo, dataAppointment } from '../../../../state_local'

export default function ThankYou() {
  const languageRedux = ''//useSelector(state => state.common.language)
  const [idRequest, setIdRequest] = useState()

  useEffect(() => {
    console.log('dataAppointment: ', dataAppointment)
    dataAppointment?.checkRequest !== 1 && takeAppointment()
    dataAppointment?.checkRequest === 1 && takeRequest()
  }, [])

  const UTCChildBirthdate = moment(dataAppointment?.childBirthdate).utc().valueOf()

  const takeAppointment = () => {
    const body = {
      answer1: dataAppointment?.forWho ? 'My child' : 'Me',
      answer2: dataAppointment?.description,
      childname: dataAppointment?.childName,
      childbirthdate: UTCChildBirthdate,
      slot: {
        id: dataAppointment?.slotID,
        doctorId: dataAppointment?.doctorId,
        bookingDate: null,
        patientId: null,
        encPatientId: null,
        timeSlot: dataAppointment?.timeSlot,
        user: null,
        doctor: null,
        startsAt: dataAppointment?.timeStart,
        endsAt: dataAppointment?.timeEnd,
        title: '',
        timezone: -420,
        description: null,
        jointApp: null,
        fee: null,
        currency: null,
        legal: null,
        sessionPlace: null,
        departmetnCode: null,
        doctorCode: null,
        sessionId: null,
        specializationId: dataAppointment?.specialityID
      }
    }
    console.log('BODY: ', body)
    apiPostNewAppointment(body)
  }

  const dateLocal = moment(dataAppointment?.dateRequest).local().format('YYYY-MM-DD')
  const UTCDate = moment(dateLocal).utc().valueOf()

  const takeRequest = () => {
    const body = {
      subject: dataAppointment?.forWho ? 'My child' : 'Me',
      childname: dataAppointment?.childName,
      childbirthdate: UTCChildBirthdate,
      description: dataAppointment?.description,
      date: UTCDate,
      daySliceId: dataAppointment?.daySliceId,
      patientId: userinfo?.id,
      daySlice: {
        startTime: {
          hour: 8,
          minute: 0,
          second: 0,
          nano: 0
        },
        endTime: {
          hour: 12,
          minute: 59,
          second: 0,
          nano: 0
        }
      },
      insertDate: null,
      bookingDate: null,
      id: null,
      doctorTimeSlotId: null,
      tz: -420,
      specializationId: dataAppointment?.specialityID
    }
    apiPostAddSlotRequest(body).then(async res => {
      const parseData = await res.json()
      console.log('data: ', parseData)
      setIdRequest(parseData?.id)
    }).catch(error => {
      console.error('There was an error!', error)
    })
  }

  const _onPressClose = () => {
    NavigationService.navigate(Routes.DRAWER_NAVIGATION)
  }

  const renderHeader = () => {
    return (
      <View>
        <TouchableOpacity onPress={_onPressClose}>
          <Image source={icHeader.ic_close} style={styles.iconStyle} />
        </TouchableOpacity>
        <Text style={customTxt(Fonts.SemiBold, 24, color040404).txt}>
          {Translate(languageRedux).THANK_YOU}
        </Text>
        <View style={styles.title}>
          <Text style={customTxt(Fonts.SemiBold, 18, color040404).txt}>
            {dataAppointment?.checkRequest === 1
              ? Translate(languageRedux).TITLE_SUCCESSFULLY_REGISTERED_REQUEST
              : Translate(languageRedux).TITLE_SUCCESSFULLY_REGISTERED_APPOINTMENT}
          </Text>
        </View>
        <Text style={customTxt(Fonts.Regular, 16, color5C5D5E).txt}>
          {dataAppointment?.checkRequest === 1
            ? Translate(languageRedux).DESCRIPTION_SUCCESSFULLY_REGISTERED_REQUEST
            : Translate(languageRedux).DESCRIPTION_SUCCESSFULLY_REGISTERED_APPOINTMENT}
        </Text>
      </View>
    )
  }

  const renderBoxAppointment = () => {
    return (
      <View>
        <View style={styles.boxAppointment}>
          <View style={styles.flex1}>
            {dataAppointment?.checkRequest !== 1 && <Text style={[customTxt(Fonts.Regular, 12, color333333).txt, styles.doctorName]}>
              Doc. {dataAppointment?.doctor}
            </Text>}
            {dataAppointment?.checkRequest === 1 && <Text style={[customTxt(Fonts.Regular, 12, color3777EE).txt, styles.doctorName]}>
              {Translate(languageRedux).TO_CONFIRM}</Text>}
            {dataAppointment?.checkRequest !== 1 && <View style={styles.dateTime}>
              <Text style={customTxt(Fonts.Bold, 17, color040404).txt}>
                {convertNumberTime12(dataAppointment?.timeStart)}
                {' - '}
              </Text>
              <Text style={customTxt(Fonts.Bold, 17, color040404).txt}>
                {convertNumberTime12(dataAppointment?.timeEnd)}
                {' | '}
              </Text>
              <Text style={customTxt(Fonts.Bold, 15, colorBDBDBD).txt}>
                {dataAppointment?.date}
              </Text>
            </View>}
            {dataAppointment?.checkRequest === 1 && <View style={styles.dateTime}>
              <Text style={customTxt(Fonts.Bold, 17, color040404).txt}>
                {dataAppointment?.timeStartRequest}{' - '}{dataAppointment?.timeEndRequest}
                {' | '}
              </Text>
              <Text style={customTxt(Fonts.Bold, 15, colorBDBDBD).txt}>
                {convertDateTime(dataAppointment?.dateRequest)}
              </Text>
            </View>}
            <Text
              style={[
                customTxt(Fonts.SemiBold, 12, color5C5D5E).txt,
                styles.speciality
              ]}>
              {dataAppointment?.speciality}
            </Text>
          </View>
          {dataAppointment?.checkRequest !== 1 && <TouchableOpacity onPress={_onPressExportCalendar}
            style={styles.exportIcon}>
            <Image source={icNA.ic_calendar_plus} style={styles.iconStyle} />
          </TouchableOpacity>}
        </View>
      </View>
    )
  }

  const _onPressExportCalendar = () => {
    const eventConfig = {
      title: 'Appointment',
      startDate: converToUTC(dataAppointment?.timeStart),
      endDate: converToUTC(dataAppointment?.timeEnd),
      notes: `We confirm your appointment with the doctor ${dataAppointment?.doctor || ''},

see attached .ics file

SaluberMD`
    }

    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then((eventInfo) => {
        console.log('eventInfo:', eventInfo)
        if (eventInfo?.action === 'SAVED') {
          console.log('OK: ')
          if (Platform.OS === 'ios') {
            Linking.openURL('calshow:')
          } else if (Platform.OS === 'android') {
            Linking.openURL('content://com.android.calendar/time/')
          }
        }
      }).catch(() => {
        console.log('false')
      })
  }

  const renderDocument = () => {
    return (
      <View>
        <Text
          style={[
            customTxt(Fonts.SemiBold, 16, color040404).txt,
            styles.ctnRecomDoc
          ]}>
          {Translate(languageRedux).RECOMMENDED_DOCUMENTS}
        </Text>
        <Text style={customTxt(Fonts.Regular, 16, color333333).txt}>
          {Translate(languageRedux).DESCRIPTION_RECOMMENDED_DOCUMENTS}
        </Text>
        <View style={styles.button}>
          {dataAppointment?.checkRequest !== 1 && <Button
            text={Translate(languageRedux).UPLOAD_DOCUMENT}
            textColor={colorFFFFFF}
            backgroundColor={color3777EE}
            onPress={() => {
              NavigationService.navigate(Routes.DOCUMENT_LIST_SCREEN, {
                id: dataAppointment?.slotID
              })
            }}
          />}
          {dataAppointment?.checkRequest === 1 && <Button
            text={Translate(languageRedux).UPLOAD_DOCUMENT}
            textColor={colorFFFFFF}
            backgroundColor={color3777EE}
            onPress={() => {
              NavigationService.navigate(Routes.DOCUMENT_LIST_SCREEN, {
                id: idRequest,
                typeView: 'request'
              })
            }}
          />}
          <View style={styles.marginT16} />
          <Button
            text={Translate(languageRedux).GO_TO_APPOINTMENTS}
            textColor={color3777EE}
            onPress={() => { NavigationService.navigateAndReset(Routes.VISITS_SCREEN) }}
          />
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.marginHori20}>
        {renderHeader()}
        {renderBoxAppointment()}
        {renderDocument()}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: colorFFFFFF
  },
  iconStyle: {
    height: 24,
    width: 24,
    marginBottom: 12
  },
  marginHori20: {
    marginHorizontal: 20
  },
  title: {
    marginTop: 12,
    marginBottom: 8
  },
  boxAppointment: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    borderRadius: 12,
    backgroundColor: colorFFFFFF,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  doctorName: {
    marginTop: 16,
    marginHorizontal: 16
  },
  dateTime: {
    flexDirection: 'row',
    marginTop: 8,
    marginLeft: 16,
    alignItems: 'center'
  },
  speciality: {
    marginTop: 8,
    marginLeft: 16,
    marginBottom: 16
  },
  ctnRecomDoc: {
    marginTop: 24,
    marginBottom: 8
  },
  button: {
    marginTop: 24
  },
  marginT16: {
    marginTop: 16
  },
  exportIcon: {
    marginTop: 16,
    marginRight: 16,
    width: 24
  },
  flex1: {
    flex: 1
  }
})
