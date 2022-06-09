import React, { useState, useEffect } from 'react'
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, ScrollView, Platform} from 'react-native'
import { useSelector } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {color000000, color040404, color3777EE, colorC1C3C5, colorF0F0F0, colorFFFFFF} from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from 'translate'
import {checkWhiteSpace} from 'constants/CheckWhiteSpace'
import {convertDMMMYYYY, converLocalToSever} from 'constants/DateHelpers'

import icHeader from '../../../../../assets/images/header'
import icDoc from '../../../../../assets/images/document'

import Button from 'components/Button'
import CustomTextInput from '../../../healthProfile/components/CustomTextInput'
import CustomDatePicker from 'components/CustomDatePicker'

export default function AddComment({onPressClose, patientId, paramId, setShowNotiAdd, setStatus}) {
  const languageRedux = useSelector(state => state.common.language)
  const [date, setDate] = useState()
  const [comment, setComment] = useState()
  const datePickerRef = React.createRef()
  const token = useSelector(state => state.user.token)

  useEffect(() => {
    setDate(new Date())
  }, [])

  const renderTop = () => {
    return (
      <View>
        <View style={styles.ctnTitle}>
          <View style={styles.flex1} />
          <View style={styles.ctnSOS}>
            <Text style={customTxt(Fonts.SemiBold, 18, color040404).txt}>
              {Translate(languageRedux).commenti}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.marginR16}
            onPress={onPressClose}>
            <Image source={icHeader.ic_close} style={styles.iconStyleFloat} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        <CustomTextInput
          title={Translate(languageRedux).date}
        //   onChangeTxt={(txt) => setDate(txt)}
          value={date ? convertDMMMYYYY(date) : ' '}
          validate={date ? false : true}
          iconRight={icDoc.ic_choose_date}
          onPress={() => datePickerRef.current.onPressDate()}
        />
        <CustomTextInput
          title={Translate(languageRedux).commenti}
          value={comment}
          onChangeTxt={(txt) => setComment(txt)}
          validate={checkWhiteSpace(comment) ? false : true}
          multiline={true}
          textinputStyle={styles.txtComment}
        />
        <Button
          text={Translate(languageRedux).add_new}
          viewStyle={styles.marginT32}
          textColor={(checkWhiteSpace(comment) && date) ? colorFFFFFF : colorC1C3C5}
          backgroundColor={(checkWhiteSpace(comment) && date) ? color3777EE : colorF0F0F0}
          disabled={(checkWhiteSpace(comment) && date) ? false : true}
          onPress={_onPressSend}
        />
      </View>
    )
  }

  const _onPressSend = () => {
    const body = {
      date: converLocalToSever(date),
      comment: comment,
      patientId: patientId,
      param: paramId
    }
    console.log('body: ', body)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/disman/setDoctorComment`,
      headers: {
        'x-auth-token': token
      },
      data: body
    })
      .then(response => {
        setShowNotiAdd(true)
        console.log('data: ', response)
        setStatus(response.data)
        onPressClose()
      })
      .catch(error => {
        console.error('There was an error!', error)
        onPressClose()
      })
  }

  const _onChangeDatePicker = (date) => {
    setDate(date)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.bgOpacity}
        onPress={onPressClose}
      />
      <ScrollView style={styles.fullView}>
        {renderTop()}
        <KeyboardAwareScrollView>{renderBody()}</KeyboardAwareScrollView>
      </ScrollView>
      <CustomDatePicker
        refDatePicker={datePickerRef}
        onChangeDate={_onChangeDatePicker}
        maxDate={new Date()}
        // minDate={new Date()}
        date={date || new Date()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'flex-end'
  },
  bgOpacity: {
    width: '100%',
    height: '100%',
    flex: 1,
    position: 'absolute',
    backgroundColor: color000000,
    opacity: 0.7
  },
  fullView: {
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    top: 64,
    height: Dimensions.get('window').height - 64
  },
  ctnTitle: {
    flexDirection: 'row',
    paddingVertical: 16,
    marginBottom: 16
  },
  iconStyleFloat: {
    height: 24,
    width: 24,
    marginRight: 16,
    marginLeft: 16
  },
  ctnSOS: {
    flex: 4,
    alignItems: 'center'
  },
  marginR16: {
    flex: 1,
    alignItems: 'flex-end'
  },
  flex1: {
    flex: 1
  },
  ctnBody: {
    marginHorizontal: 16
  },
  txtComment: {
    height: 102
  },
  marginT32: {
    marginTop: 32
  }
})
