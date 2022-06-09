import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'

import { useDispatch, useSelector } from 'react-redux'

import { colorFFFFFF, color333333, color5C5D5E, color040404, colorF0F0F0, color3777EE } from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import { convertNumberTime12, convertDMMMYYYY } from '../../../../constants/DateHelpers'
import Translate from '../../../../translate'

import Button from '../../../../components/Button'
import NavigationService from '../../../../navigation'
import Routes from '../../../../navigation/Routes'
import { saveDataNewAppointment } from '../../../../actions/common'

export default function Confirm({
  specialityName, doctorName, description, date, timeStart,
  timeEnd, checkRequest, timeStartRequest, timeEndRequest,
  dateRequest, specialityID, slotID, doctorID, timeSlot,
  daySliceId, onPressConfirm, forWho, childName, childBirthdate
}) {

  const languageRedux = useSelector(state => state.common.language)

  const dispatch = useDispatch()
  const _onPressConfirm = () => {
    var params = null
    if (checkRequest === 1) {
      params = {
        speciality: specialityName,
        dateRequest: dateRequest,
        timeEndRequest: timeEndRequest,
        timeStartRequest: timeStartRequest,
        checkRequest: checkRequest,
        specialityID: specialityID,
        daySliceId: daySliceId,
        description: description,
        forWho: forWho,
        childName: childName,
        childBirthdate: childBirthdate
      }
    } else {
      params = {
        doctor: doctorName,
        speciality: specialityName,
        date: date,
        timeStart: timeStart,
        timeEnd: timeEnd,
        slotID: slotID,
        doctorId: doctorID,
        timeSlot: timeSlot,
        specialityID: specialityID,
        description: description,
        forWho: forWho,
        childName: childName,
        childBirthdate: childBirthdate
      }
    }
    Promise.all([
      dispatch(saveDataNewAppointment(params))
    ])
    onPressConfirm()
    NavigationService.navigate(Routes.THANKYOU_NEW_APPOINTMENT_SCREEN)
  }
  return (
    <ScrollView style={styles.containerBox}>
      <View style={styles.title}>
        {checkRequest !== 1 && <Text style={customTxt(Fonts.SemiBold, 17, color333333).txt}>
          {Translate(languageRedux).READ_AND_CONFIRM_APPOINTMENT}
        </Text>}
        {checkRequest === 1 && <Text style={customTxt(Fonts.SemiBold, 17, color333333).txt}>
          {Translate(languageRedux).READ_AND_CONFIRM_AVAILABILITY}
        </Text>}
      </View>
      <View style={styles.speciality}>
        <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
          {Translate(languageRedux).SPECIALITY}
        </Text>
        <Text
          style={[
            customTxt(Fonts.Regular, 16, color040404).txt,
            styles.styleSpeciality
          ]}>
          {specialityName}
        </Text>
        <View style={styles.divider} />
      </View>
      {checkRequest !== 1 && <View style={styles.speciality}>
        <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
          {Translate(languageRedux).PROVIDER}
        </Text>
        <Text
          style={[
            customTxt(Fonts.Regular, 16, color040404).txt,
            styles.styleSpeciality
          ]}>
          Doc. {doctorName}
        </Text>
        <View style={styles.divider} />
      </View>}
      {checkRequest !== 1 && <View style={styles.speciality}>
        <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
          {Translate(languageRedux).DATE_AND_TIME}
        </Text>
        <Text
          style={[
            customTxt(Fonts.Regular, 16, color040404).txt,
            styles.styleSpeciality
          ]}>
          {date}, {convertNumberTime12(timeStart)} - {convertNumberTime12(timeEnd)}
        </Text>
        <View style={styles.divider} />
      </View>}
      {checkRequest === 1 && <View style={styles.speciality}>
        <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
          {Translate(languageRedux).DATE_AND_TIME}
        </Text>
        <Text
          style={[
            customTxt(Fonts.Regular, 16, color040404).txt,
            styles.styleSpeciality
          ]}>
          {convertDMMMYYYY(dateRequest)}, {timeStartRequest}{' - '}{timeEndRequest}
        </Text>
        <View style={styles.divider} />
      </View>}
      <View style={styles.speciality}>
        <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
          {Translate(languageRedux).description}
        </Text>
        <Text
          style={[
            customTxt(Fonts.Regular, 16, color040404).txt,
            styles.styleSpeciality
          ]}>
          {description}
        </Text>
        <View style={styles.divider} />
      </View>
      <View style={styles.ctnButton}>
        <Button
          text={checkRequest === 1 ? Translate(languageRedux).CONFIRM_AVAILABILITY : Translate(languageRedux).CONFIRM_APPOINTMENT}
          textColor={colorFFFFFF}
          backgroundColor={color3777EE}
          onPress={_onPressConfirm}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  containerBox: {
    flex: 1,
    backgroundColor: colorFFFFFF,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9,
    marginBottom: 42
  },
  title: {
    marginTop: 16,
    marginHorizontal: 16
  },
  divider: {
    width: '100%',
    borderWidth: 1,
    borderColor: colorF0F0F0
  },
  speciality: {
    marginHorizontal: 16,
    marginTop: 16
  },
  styleSpeciality: {
    marginTop: 8,
    marginBottom: 16
  },
  ctnButton: {
    marginVertical: 16,
    marginHorizontal: 16
  }
})
