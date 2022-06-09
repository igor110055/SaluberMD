import React, {useEffect, useState} from 'react'
import {View, Text, StyleSheet, ScrollView, DeviceEventEmitter, Image, FlatList} from 'react-native'
import { useSelector } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'
import _ from 'lodash'

import {color040404, color3777EE, color5C5D5E, colorDDDEE1, colorFFFFFF} from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from '../../../../translate'
import Routes from 'navigation/Routes'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'

import icHeader from '../../../../../assets/images/header'
import icService from '../../../../../assets/images/services'

import Button from 'components/Button'
import NavigationService from 'navigation'
import Header from 'components/Header'
import LoadingView from 'components/LoadingView'

export default function Step6({ route }) {
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const [listFile, setListFile] = useState()
  const [isLoad, setLoading] = useState(false)
  const passingData = route?.params?.data
  const [dataNoti, setDataNoti] = useState()
  const [isShowNoti, setShowNoti] = useState()

  useEffect(() => {
    console.log('subject: ', passingData?.subject)
    console.log('childname: ', passingData?.childname)
    console.log('childbirthdate: ', passingData?.childbirthdate)
    console.log('specializationID: ', passingData?.specializationID)
    console.log('getSpecialName: ', passingData?.getSpecialName)
    console.log('question: ', passingData?.question)
    console.log('files: ', passingData?.files)
  }, [])

  useEffect(() => {
    var item = passingData?.files.shift()
    setListFile(passingData?.files)
  },[])

  const RenderItem = ({item}) => {
    return (
      <View>
        <Text style={[customTxt(Fonts.Regular, 16, color3777EE).txt]}>
          {item?.filename}
        </Text>
      </View>
    )
  }

  const renderFlatlist = () => {
    return (
      <View style={styles.marginL16}>
        <FlatList
          data={listFile}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderList = () => {
    return (
      <View style={styles.ctnList}>
        {/* For who */}
        <View>
          <View style={styles.flexRow}>
            <Image source={icService.ic_user_check} style={styles.iconStyle} />
            <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginL8]}>
              {Translate(languageRedux).WHO_IS_FOR}
            </Text>
          </View>
            <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginL16]}>
              {passingData?.subject ? Translate(languageRedux).SEE_A_DOCTOR_Q1_A2 :
              Translate(languageRedux).SEE_A_DOCTOR_Q1_A1}
            </Text>
        </View>
        {/* Speciality */}
        <View>
          <View style={styles.structure}>
            <Image source={icService.ic_tag} style={styles.iconStyle} />
            <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginL8]}>
              {Translate(languageRedux).SPECIALTY}
            </Text>
          </View>
            <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginL16]}>
              {passingData?.getSpecialName?.name}
            </Text>
        </View>
        {/* Attachments */}
        <View>
          <View style={styles.structure}>
            <Image source={icService.ic_attachment} style={styles.iconStyle} />
            <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginL8]}>
              {Translate(languageRedux).attachment}
            </Text>
          </View>
          {renderFlatlist()}
        </View>
        {/* Concerns */}
        <View>
          <View style={styles.structure}>
            <Image source={icService.ic_message} style={styles.iconStyle} />
            <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginL8]}>
              {Translate(languageRedux).quesito}
            </Text>
          </View>
            <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginL16]}>
              {passingData?.question}
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
          textColor={colorFFFFFF}
          text={Translate(languageRedux).SEND_BTN}
          onPress={_onPressSend}
        />
      </View>
    )
  }

  const _onPressSend = () => {
    setLoading(true)
    const body = {
        files: listFile,
        answer1: passingData?.subject ?
        Translate(languageRedux).SEE_A_DOCTOR_Q1_A2 :
        Translate(languageRedux).SEE_A_DOCTOR_Q1_A1,
        childname: passingData?.childname === undefined ? '' : passingData?.childname,
        childbirthdate: passingData?.childbirthdate === undefined ? '' : passingData?.childbirthdate,
        specializzazione: passingData?.getSpecialName?.id,
        getSpecialtyName: passingData?.getSpecialName,
        question: passingData?.question
      }
      console.log('BODY: ', body)
      axios({
        method: 'post',
        url: `${APIs.hostAPI}backoffice/secondopinion/saveSurvey`,
        headers: {
          'x-auth-token': token
        },
        data: body
      })
        .then(response => {
          console.log('data: ', response.data)
          if (_.includes([0, '0'], response?.data?.esito)) {
            setLoading(false)
            setShowNoti(true)
            setDataNoti({
              status: STATUS_NOTIFY.SUCCESS,
              content: Translate(languageRedux).second_opinion_msg
            })
            DeviceEventEmitter.emit('secondopinion')
            setTimeout(() => {
              DeviceEventEmitter.emit(Routes.HISTORY_SECOND_OPINION, { history: true })
            }, 1000)
            NavigationService.navigate(Routes.HISTORY_SECOND_OPINION)
          }
          if (_.includes([1, '1'], response?.data?.esito)) {
            setDataNoti({
              status: STATUS_NOTIFY.ERROR,
              content: 'Request failed'
            })
          }
        })
        .catch(error => {
          console.error('There was an error!', error)
          setLoading(false)
        })
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnContent}>
        {renderList()}
        {renderButton()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_left}
        onPressLeft={() => {
          NavigationService.goBack()
        }}
        textCenter={Translate(languageRedux).secondOpinion}
        textCenterColor={color040404}
      />
      <ScrollView>{renderBody()}</ScrollView>
      {isLoad && <LoadingView />}
      <NotificationView
        isShow={isShowNoti}
        setShow={() => setShowNoti(false)}
        status={dataNoti?.status || STATUS_NOTIFY.ERROR}
        content={dataNoti?.content || ''}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  ctnContent: {
    padding: 16
  },
  ctnList: {
    marginBottom: 32,
    padding: 16,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    borderRadius: 16
  },
  ctnLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
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
  marginL8: {
    marginLeft: 8
  },
  marginL16: {
    marginLeft: 32,
    marginTop: 4
  }
})
