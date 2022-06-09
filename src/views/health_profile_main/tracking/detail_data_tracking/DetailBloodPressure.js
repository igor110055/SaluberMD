import React, { useState } from 'react'
import {
  StyleSheet, View, ScrollView, Text, Image, DeviceEventEmitter
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Translate from 'translate'
import Header from 'components/Header'
import { color3777EE, color77BDF8, colorFFFFFF } from 'constants/colors'
import icHeader from '../../../../../assets/images/header'
import LinearGradient from 'react-native-linear-gradient'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import { convertNumberToMMMDDYYYYhhmmA } from 'constants/DateHelpers'
import imgDataTracking from '../../../../../assets/images/data_tracking'
import LoadingView from 'components/LoadingView'
import Routes from 'navigation/Routes'
import NavigationService from 'navigation'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
import DialogCustom from 'components/DialogCustom'
import { apiDeletePresx } from 'api/DataTracking'

export default function DetailBloodPressure({
  route
}) {
  const languageRedux = useSelector(state => state.common.language)
  const passingData = route?.params?.data
  const dispatch = useDispatch()
  const [isLoading, setLoading] = useState(false)
  const [isShowNoti, setShowNoti] = useState()
  const [dataNoti, setDataNoti] = useState()
  const [isDialog, setDialog] = useState(false)

  const callAPIDelete = () => {
    setDialog(false)
    setLoading(true)
    dispatch(apiDeletePresx(passingData?.id)).then(res => {
      setShowNoti(true)
      if (res?.payload?.esito === '0') {
        setDataNoti({
          status: STATUS_NOTIFY.SUCCESS,
          content: Translate(languageRedux).record_rimosso
        })
        setTimeout(() => {
          NavigationService.goBack()
        }, 4000)
        setTimeout(() => {
          DeviceEventEmitter.emit(Routes.LIST_BODY_PRESSURE)
        }, 4500)
      } else {
        setLoading(false)
        setDataNoti({
          status: STATUS_NOTIFY.ERROR,
          content: res?.payload?.motivo || ''
        })
      }
    }).catch(() => {
      setLoading(false)
    })
  }

  const renderContent = () => {
    return (
      <LinearGradient
        colors={[color77BDF8, color3777EE]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        style={styles.contentView}>
        <View style={styles.contentTxt}>
          <Text style={customTxt(Fonts.Bold, 45, colorFFFFFF).txt}>{passingData?.systolic}</Text>
          <Text style={customTxt(Fonts.Regular, 12, colorFFFFFF).txt}>SYS</Text>
          <Text style={customTxt(Fonts.Bold, 45, colorFFFFFF).txt}>/</Text>
          <Text style={customTxt(Fonts.Bold, 45, colorFFFFFF).txt}>{passingData?.diastolic}</Text>
          <Text style={customTxt(Fonts.Regular, 12, colorFFFFFF).txt}>DIA  </Text>
          {passingData?.pulseRate && <Text style={customTxt(Fonts.Bold, 45, colorFFFFFF).txt}> {passingData?.pulseRate}</Text>}
          {passingData?.pulseRate && <Text style={customTxt(Fonts.Regular, 12, colorFFFFFF).txt}>🤍</Text>}
        </View>
        <Text style={[
          styles.txtCenter,
          customTxt(Fonts.Bold, 20, colorFFFFFF).txt
        ]}>{((
          passingData?.pulseRate ?
          Translate(languageRedux).PULSE_RATE_IS_WITHIN_THE_RANGE :
          Translate(languageRedux).NOT_AVALIABLE_IS_WITHIN_THE_RANGE) || '').toUpperCase()}</Text>
        {passingData?.date && <Text style={[
          styles.txtCenter,
          customTxt(Fonts.Medium, 18, colorFFFFFF).txt
        ]}>{convertNumberToMMMDDYYYYhhmmA(passingData?.date)}</Text>}
      </LinearGradient>
    )
  }

  const renderImgTable = () => {
    return (
      <Image
        source={imgDataTracking.ic_bg_bloodpressure}
        style={styles.imgTable}
      />
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).PRESX}
        iconLeft={icHeader.ic_left}
        iconRight={imgDataTracking.ic_delete}
        onPressRight={() => setDialog(true)}
      />
      <ScrollView style={styles.container}>
        {renderContent()}
        {renderImgTable()}
      </ScrollView>
      {
        isDialog && (
          <DialogCustom
            title={Translate(languageRedux).deletevalue_q}
            txtlLeft={Translate(languageRedux).cancel}
            onPressCancel={() => setDialog(false)}
            txtRight={Translate(languageRedux).OK}
            onPressOK={callAPIDelete}
          />
        )
      }
      {isLoading && <LoadingView />}
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
  contentView: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentTxt: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  txtCenter: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center'
  },
  imgTable: {
    width: '100%',
    height: 340,
    resizeMode: 'contain'
  }
})
