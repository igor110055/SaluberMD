import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Platform, Linking, DeviceEventEmitter} from 'react-native'
import { useSelector } from 'react-redux'
import RNFetchBlob from 'rn-fetch-blob'
import Share from 'react-native-share'
import * as APIs from '../../../../api/APIs'
import axios from 'axios'
import moment from 'moment'

import {color040404, color363636, colorA7A8A9, colorF0F0F0, colorFFFFFF, colorF8F8F8} from 'constants/colors'
import Translate from 'translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Routes from 'navigation/Routes'
import NavigationService from 'navigation'

import icHeader from '../../../../../assets/images/header'
import icHealth from '../../../../../assets/images/health_profile'
import icAccount from '../../../../../assets/images/account'

import Header from 'components/Header'
import LoadingView from 'components/LoadingView'

export default function DetailHistory({route}) {
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const passingData = route?.params?.data
  const [isLoad, setLoading] = useState(true)
  const [data, setData] = useState()
  const [base64Referral, setBase64Referral] = useState()
  const [base64Cert, setBase64Cert] = useState()
  const [dataInfoPatient, setDataInfoPatient] = useState()

  useEffect(() => {
    callAPIGetInfoPatient()
    callAPICertificateDownload()
    callAPIGetPrescriptionDownload()
    callAPIReferralDownload()
  }, [])

  const callAPIGetInfoPatient = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/webdoctor/getUserInfo`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': passingData?.token
      }
    })
      .then((response) => {
        setLoading(false)
        console.log('dataInfoPatient: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getData = response.data.user || []
          setDataInfoPatient(getData)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const callAPIGetPrescriptionDownload = () => {
    RNFetchBlob.fetch(
      'GET',
      `${APIs.hostAPI}backoffice/prescriptions/getPrescriptionDownload/${passingData?.webconferenceId}`,
      {
        'x-auth-token': token
      },
    )
      .then(res => {
        // setLoading(false)
        let status = res.info().status

        if (status === 200) {
          let base64Str = res.base64()
          // console.log('base64Str: ', base64Str)
          setData(base64Str)
        } else {
          // handle other status codes
        }
      })
      .catch((errorMessage, statusCode) => {
        // error handling
      })
  }

  const callAPIReferralDownload = () => {
    RNFetchBlob.fetch(
      'GET',
      `${APIs.hostAPI}backoffice/webdoctor/downloadReferral/${passingData?.webconferenceId}`,
      {
        'x-auth-token': token
      },
    )
      .then(res => {
        // setLoading(false)
        let status = res.info().status

        if (status === 200) {
          let base64Str = res.base64()
          // console.log('res: ', res)
          setBase64Referral(base64Str)
        } else {
          // handle other status codes
        }
      })
      .catch((errorMessage, statusCode) => {
        // error handling
      })
  }

  const callAPICertificateDownload = () => {
    RNFetchBlob.fetch(
      'GET',
      `${APIs.hostAPI}backoffice/certificate/${passingData?.webconferenceId}`,
      {
        'x-auth-token': token
      },
    )
      .then(res => {
        // setLoading(false)
        let status = res.info().status

        if (status === 200) {
          let base64Str = res.base64()
          // console.log('res: ', res)
          setBase64Cert(base64Str)
        } else {
          // handle other status codes
        }
      })
      .catch((errorMessage, statusCode) => {
        // error handling
      })
  }

  const _onPressShare = () => {
    let options = {
      url: `data:image;base64,${data}`,
      filename: 'title'
    }
    Share.open(options)
      .then(res => {
        console.log(res)
        if (Platform.OS === 'ios') {
          Linking.openURL('photos-redirect://')
        } else if (Platform.OS === 'android') {
          Linking.openURL('content://media/internal/images/media')
        }
      })
      .catch(err => {
        err && console.log(err)
      })
  }

  const _onPressShareReferral = () => {
    let options = {
      url: `data:image;base64,${base64Referral}`,
      filename: 'title'
    }
    Share.open(options)
      .then(res => {
        console.log(res)
        if (Platform.OS === 'ios') {
          Linking.openURL('photos-redirect://')
        } else if (Platform.OS === 'android') {
          Linking.openURL('content://media/internal/images/media')
        }
      })
      .catch(err => {
        err && console.log(err)
      })
  }

  const _onPressShareCertificate = () => {
    let options = {
      url: `data:image;base64,${base64Cert}`,
      filename: 'title'
    }
    Share.open(options)
      .then(res => {
        console.log(res)
        if (Platform.OS === 'ios') {
          Linking.openURL('photos-redirect://')
        } else if (Platform.OS === 'android') {
          Linking.openURL('content://media/internal/images/media')
        }
      })
      .catch(err => {
        err && console.log(err)
      })
  }

  const getGender = () => {
    if (dataInfoPatient?.gender === 0) {
      return Translate(languageRedux).male
    }
    if (dataInfoPatient?.gender === 1) {
      return Translate(languageRedux).female
    }
    if (dataInfoPatient?.gender === 2) {
      return Translate(languageRedux).I_WOULD_RATHER_NOT_SAY
    }
  }

  const getAge = () => {
    var year = moment(dataInfoPatient?.birthdate).format('YYYY')
    var age = Number(moment().format('YYYY')) - Number(year)
    return age
  }

  const renderPatientInfo = () => {
    return (
      <View style={styles.patientView}>
        <View style={styles.gender}>
          {(dataInfoPatient?.userImage || []).length > 0 ? (
            <Image
              source={{uri: `data:image;base64,${dataInfoPatient?.userImage}`}}
              style={styles.avtPatient}
            />
          ) : (
            <Image
              source={icAccount.ic_profile_avatar}
              style={styles.avtPatient}
            />
          )}
          <View style={styles.infoPatient}>
            <View style={styles.gender}>
              <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>
                {getGender()},{' '}
              </Text>
              <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>
                {Translate(languageRedux).age} {getAge()}
              </Text>
            </View>
            <Text style={customTxt(Fonts.SemiBold, 16, colorFFFFFF).txt}>
              {dataInfoPatient?.nome} {dataInfoPatient?.cognome}
            </Text>
          </View>
        </View>
        <View>
          <TouchableOpacity onPress={_onPressSeeViewProfile} style={styles.buttonViewProfile}>
            <Text style={customTxt(Fonts.Bold, 14, colorFFFFFF).txt}>
              {Translate(languageRedux).VIEW_PROFILE}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const _onPressSeeViewProfile = () => {
    setTimeout(() => {
        DeviceEventEmitter.emit(Routes.PATIENT_DETAIL_SCREEN, { medicalrecords: true })
      }, 1000)
    NavigationService.navigate(Routes.PATIENT_DETAIL_SCREEN, {
      data: dataInfoPatient,
      token: passingData?.token,
      historyView: true
    })
  }

  const renderSOAP = (label1, label2, content) => {
    return (
      <View>
        <View style={styles.marginB8}>
          <Text style={customTxt(Fonts.Regular, 12, color040404).txt}>
            {passingData?.hasSoap === '1'
              ? label1
              : label2}
          </Text>
        </View>
        <View style={styles.marginB16}>
          {content !== null && <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
            {content}
          </Text>}
          {content === null && <Text style={customTxt(Fonts.Regular, 16, colorA7A8A9).txt}>
            {Translate(languageRedux).NONE}
          </Text>}
        </View>
        <View style={styles.divider} />
      </View>
    )
  }

  const renderDocuments = (label, onPress, onPressView) => {
    return (
      <TouchableOpacity onPress={onPressView} style={styles.ctnPrecription}>
        <View>
          <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginB4]}>
            {label}
          </Text>
        </View>
        <TouchableOpacity onPress={onPress} style={styles.ctnIconDownLoad}>
          <Image source={icHealth.ic_download} style={styles.iconStyle} />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  const _onPressViewPrescription = () => {
    NavigationService.navigate(Routes.PDF_VIEW, {
      data: data
    })
  }

  const _onPressViewReferral = () => {
    NavigationService.navigate(Routes.PDF_VIEW, {
      data: base64Referral
    })
  }

  const _onPressViewCertificate = () => {
    NavigationService.navigate(Routes.PDF_VIEW, {
      data: base64Cert
    })
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        {renderPatientInfo()}
        {renderSOAP(
          Translate(languageRedux).SUBJECTIVE,
          Translate(languageRedux).CONSULT,
          passingData?.consult,
        )}
        {passingData?.hasSoap === '1' &&
          renderSOAP(
            Translate(languageRedux).OBJECTIVE,
            Translate(languageRedux).OBJECTIVE,
            passingData?.doctorObjective,
          )}
        {renderSOAP(
          Translate(languageRedux).ASSESSMENT,
          Translate(languageRedux).DIAGNOSIS,
          passingData?.diagnosis,
        )}
        {renderSOAP(
          Translate(languageRedux).PLAN,
          Translate(languageRedux).RECOMMENDATION,
          passingData?.recommendations,
        )}
        <View style={styles.marginB8}>
          <Text style={customTxt(Fonts.Regular, 12, color040404).txt}>
            {Translate(languageRedux).documents}
          </Text>
        </View>
        {(base64Referral || []).length > 0 &&
          renderDocuments(
            Translate(languageRedux).REFERRAL,
            _onPressShareReferral,
            _onPressViewReferral,
          )}
        {(data || []).length > 0 &&
          renderDocuments(
            Translate(languageRedux).prescription,
            _onPressShare,
            _onPressViewPrescription,
          )}
        {(base64Cert || []).length > 0 &&
          renderDocuments(
            Translate(languageRedux).medical_certificate,
            _onPressShareCertificate,
            _onPressViewCertificate,
          )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        iconLeft={icHeader.ic_left}
        textCenter={Translate(languageRedux).VIDEO_CONSULTATION_INFO}
      />
      <ScrollView>{renderBody()}</ScrollView>
      {isLoad && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  ctnBody: {
    marginHorizontal: 20,
    marginTop: 16,
    paddingBottom: 42
  },
  patientView: {
    backgroundColor: color363636,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
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
  ctnPrecription: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colorF8F8F8,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  marginB4: {
    marginBottom: 4
  },
  ctnIconDownLoad: {
    justifyContent: 'center'
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  avtPatient: {
    height: 40,
    width: 40,
    borderRadius: 20
  },
  infoPatient: {
    marginLeft: 16
  },
  gender: {
    flexDirection: 'row'
  },
  buttonViewProfile: {
    borderWidth: 1,
    borderColor: colorFFFFFF,
    borderRadius: 8,
    padding: 8
  }
})
