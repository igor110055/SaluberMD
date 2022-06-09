import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import icClose from '../../../../../assets/images/home_screen'
import { color040404, color3777EE, color5C5D5E, colorF5455B, colorF8F8F8, colorFFFFFF } from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import Button from '../../../../components/Button'
import NavigationService from '../../../../routes'
import { useDispatch, useSelector } from 'react-redux'
import { apiGenerateTokenEmergencyLogin } from 'api/Notification'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
import { hostAPI } from '../../../../apis'
import LoadingView from '../../../../components/LoadingView'
import Translate from '../../../../translate'

export default function ShareYourMedicalRecord() {
  const languageRedux = 'en_US'//useSelector(state => state.common.language)
  var times = 60 * 10
  const [countDown, setCountDown] = useState(times)
  const dispatch = useDispatch()
  const [codeShare, setCodeShare] = useState('')
  const [isLoading, setLoading] = useState(true)
  const [isNoti, setShowNoti] = useState(false)
  const [dataNoti, setDataNoti] = useState()

  useEffect(() => {
    callAPI()
    const countDownSubscription = setInterval(() => {
      if (times < 0 || times === 0) {
        return () => clearInterval(countDownSubscription)
      }
      times = times - 1
      setCountDown(times)
    }, 1000)

    if (times === 0 || times < 0) {
      _onPressShare()
      return () => clearInterval(countDownSubscription)
    }

    return () => clearInterval(countDownSubscription)
  }, [])

  const callAPI = () => {
    dispatch(apiGenerateTokenEmergencyLogin()).then(res => {
      console.log('apiGenerateTokenEmergencyLogin: ', res)
      setLoading(false)
      if (res?.payload?.esito === '1') {
        setDataNoti({
          status: STATUS_NOTIFY.ERROR,
          content: res?.payload?.motivo || 'error'
        })
        setTimeout(() => {
          setShowNoti(true)
          console.log('data: ', dataNoti)
        }, 500)
      }

      setCodeShare(res?.payload?.data || '')
    }).catch(() => {
      setLoading(false)
    })
  }

  const _onPressShare = () => {
    Linking.openURL(`mailto:?subject=Emergency Login Access Code&body=${hostAPI}backoffice/emergencyMedicalFile?token=${codeShare}`)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fullView}>
        <TouchableOpacity
          onPress={() => { NavigationService.goBack() }}>
          <Image source={icClose.ic_close} style={styles.iconStyle} />
        </TouchableOpacity>
        <View style={styles.ctnTitle}>
          <Text style={customTxt(Fonts.SemiBold, 24, color040404).txt}>{Translate(languageRedux).SHARE_YOUR_MEDICAL_RECORD}</Text>
        </View>
        <Text style={customTxt(Fonts.Regular, 16, color5C5D5E).txt}>{Translate(languageRedux).sendtoken2}</Text>
        <View style={styles.marginV24}>
          <Text style={customTxt(Fonts.Bold, 14, colorF5455B).txt}>
            The code will expire in {`${countDown / 60}`.substring(0, 1)} mins {countDown % 60} seconds</Text>
        </View>
        <View style={styles.ctnCodeButton}>
          <Text style={[customTxt(Fonts.Bold, 24, color5C5D5E).txt, styles.ctnCode]}>{codeShare || ''}</Text>
          <TouchableOpacity style={styles.ctnCopy}>
            <Text style={[customTxt(Fonts.SemiBold, 16, colorFFFFFF).txt, styles.copyStyle]}>Copy</Text>
          </TouchableOpacity>
        </View>
        <Button
          backgroundColor={color3777EE}
          text={'Share'}
          textColor={colorFFFFFF}
          onPress={_onPressShare}
        />
      </View>
      {isLoading && <LoadingView />}
      <NotificationView
        status={dataNoti?.status || STATUS_NOTIFY.ERROR}
        isShow={isNoti}
        setShow={(val) => setShowNoti(val)}
        content={dataNoti?.content || ''}
        style={styles.stylesView}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  fullView: {
    marginHorizontal: 20
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  ctnTitle: {
    marginTop: 12,
    marginBottom: 12
  },
  marginV24: {
    marginTop: 24,
    marginBottom: 24
  },
  ctnCodeButton: {
    height: 56,
    backgroundColor: colorF8F8F8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: color3777EE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  ctnCode: {
    marginLeft: 16
  },
  ctnCopy: {
    backgroundColor: color3777EE,
    height: 56,
    justifyContent: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12
  },
  copyStyle: {
    marginHorizontal: 10
  },
  stylesView: {
    marginTop: 40
  }
})
