import React, { useState } from 'react'
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native'
import {useSelector} from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'
import _ from 'lodash'

import {
  color040404,
  color3777EE,
  colorA7A8A9,
  colorC1C3C5,
  colorE53E3E,
  colorF0F0F0,
  colorFFFFFF
} from 'constants/colors'
import Translate from 'translate'
import Fonts from 'constants/Fonts'
import { customTxt } from 'constants/css'
import { convertDMMMYYYY, convertNumberTime } from 'constants/DateHelpers'
import {checkWhiteSpace} from 'constants/CheckWhiteSpace'
import { STATUS_NOTIFY } from 'components/NotificationView'

import CustomTextInput from '../../../healthProfile/components/CustomTextInput'
import Button from 'components/Button'

export default function ConsultationInfo({ data, setLoading, setShowNoti,
  setDataNoti, onPressDelete, onPressChange }) {
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const [subject, setSubject] = useState()
  const [message, setMessage] = useState()

  const renderCell = (title, content) => {
    return (
      <View style={styles.ctnCell}>
        <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
          {title}
        </Text>
        <Text style={[customTxt(Fonts.Regular, 18, color040404).txt, styles.marginT8]}>
          {content}
        </Text>
      </View>
    )
  }

  const renderConsultationRequest = () => {
    return (
      <View style={styles.ctnConRequest}>
        <Text style={customTxt(Fonts.Bold, 22, color040404).txt}>
          {Translate(languageRedux).CONSULTATION_REQUEST}
        </Text>
        {data?.subject !== 'Me' && renderCell(Translate(languageRedux).PATIENT, data?.childName)}
        {data?.subject !== 'Me' && renderCell(Translate(languageRedux).name_member, data?.user?.nome + ' ' + data?.user?.cognome || '')}
        {renderCell(Translate(languageRedux).SPECIALTY, data?.specializationName || '')}
        <View style={styles.line} />
        {renderCell(Translate(languageRedux).motivazione, data?.reason || '')}
      </View>
    )
  }

  const renderAppointmentDetail = () => {
    return (
      <View style={styles.ctnAppointmentDetail}>
        <View style={styles.headerAppointmentDetail}>
          <Text style={[customTxt(Fonts.Regular, 12, colorFFFFFF).txt, styles.marginB4]}>
            {Translate(languageRedux).APPOINTMENT_DETAIL}
          </Text>
          <View style={[styles.flexRow, styles.marginB4]}>
            <Text style={customTxt(Fonts.SemiBold, 16, colorFFFFFF).txt}>
              {convertDMMMYYYY(data?.startsAt) || ''} | {convertNumberTime(data?.startsAt) || ''}
            </Text>
            <Text style={customTxt(Fonts.SemiBold, 16, colorA7A8A9).txt}>
              {' '}-{' '}{convertNumberTime(data?.endsAt) || ''}
            </Text>
          </View>
        </View>
        <View style={styles.sendMessage}>
          <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
            {Translate(languageRedux).sendmessage}
          </Text>
          <CustomTextInput
            textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginT8]}
            placeholder={Translate(languageRedux).subject}
            onChangeTxt={(val) => setSubject(val)}
            value={subject}
            validate={checkWhiteSpace(subject) ? false : true}
          />
          <CustomTextInput
            textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.yourMesTextInput]}
            placeholder={Translate(languageRedux).PLACEHOLDER_TEXTINPUT_CONTACT_US}
            multiline={true}
            onChangeTxt={(val) => setMessage(val)}
            value={message}
            validate={checkWhiteSpace(message) ? false : true}
          />
        </View>
        <View style={styles.ctnSendButton}>
          <Button
            text={Translate(languageRedux).SEND_BTN}
            disabled={checkDisableBtnSend()}
            backgroundColor={checkDisableBtnSend() ? colorF0F0F0 : color3777EE}
            textColor={checkDisableBtnSend() ? colorC1C3C5 : colorFFFFFF}
            onPress={_onPressSendMessage}
          />
        </View>
        {renderEditAppointment()}
      </View>
    )
  }

  const checkDisableBtnSend = () => {
    if (subject && message) {
      return false
    } else {
      return true
    }
  }

  const _onPressSendMessage = () => {
    const body = {
      patientId: data?.user?.id,
      slotId: data?.idSlot,
      subject: subject,
      text: message
    }
      axios({
          method: 'post',
          url: `${APIs.hostAPI}backoffice/disman/sendMessageToPatient/${data?.user?.id}`,
          headers: {
            'content-type': 'application/json',
            'x-auth-token': token
          },
          data: body
        })
          .then(response => {
            setLoading(false)
            console.log('data: ', response.data)
            setShowNoti(true)
            if (_.includes([0, '0'], response?.data?.esito)) {
              setDataNoti({
                status: STATUS_NOTIFY.SUCCESS,
                content: Translate(languageRedux).messagesent
              })
            }
            if (_.includes([1, '1'], response?.data?.esito)) {
              setDataNoti({
                status: STATUS_NOTIFY.ERROR,
                content: response?.data?.motivo
              })
            }
          })
          .catch(error => {
            setLoading(false)
            console.error('There was an error!', error)
          })
  }

  const renderEditAppointment = () => {
    return (
      <View style={styles.editAppointment}>
        <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
          {Translate(languageRedux).EDIT_APPOINTMENT}
        </Text>
        <View style={styles.ctnButtonEdit}>
          <TouchableOpacity onPress={onPressChange} style={styles.buttonChange}>
            <Text style={customTxt(Fonts.SemiBold, 16, colorE53E3E).txt}>
              {Translate(languageRedux).CHANGE}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressDelete} style={styles.buttonDelete}>
            <Text style={customTxt(Fonts.SemiBold, 16, colorFFFFFF).txt}>
              {Translate(languageRedux).cancel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.paddingBottomBody}>
        {renderConsultationRequest()}
        {renderAppointmentDetail()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView>{renderBody()}</ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 20,
    bottom: 42,
    marginHorizontal: 20
  },
  marginT8: {
    marginTop: 8
  },
  ctnCell: {
    marginTop: 16
  },
  marginB4: {
    marginBottom: 4
  },
  paddingBottomBody: {
    paddingBottom: 68
  },
  ctnConRequest: {
    backgroundColor: colorFFFFFF,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 9
  },
  line: {
    marginVertical: 16,
    borderWidth: 0.75,
    borderColor: colorF0F0F0
  },
  ctnAppointmentDetail: {
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 9,
    backgroundColor: colorFFFFFF,
    borderRadius: 12
  },
  headerAppointmentDetail: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: color040404,
    padding: 16
  },
  flexRow: {
    flexDirection: 'row'
  },
  sendMessage: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: colorFFFFFF,
    padding: 16
  },
  yourMesTextInput: {
    height: 120,
    marginTop: 8
  },
  ctnSendButton: {
    marginHorizontal: 16
  },
  editAppointment: {
    marginTop: 16,
    marginBottom: 26,
    marginHorizontal: 16
  },
  buttonDelete: {
    borderWidth: 1,
    paddingHorizontal: 44,
    paddingVertical: 12,
    borderColor: colorE53E3E,
    borderRadius: 12,
    backgroundColor: colorE53E3E
  },
  buttonChange: {
    borderWidth: 1,
    paddingHorizontal: 44,
    paddingVertical: 12,
    borderColor: colorE53E3E,
    borderRadius: 12
  },
  ctnButtonEdit: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between'
  }
})
