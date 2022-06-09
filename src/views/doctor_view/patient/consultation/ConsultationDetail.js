import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, Platform, Linking, ScrollView, TouchableOpacity, Image, FlatList} from 'react-native'
import { useSelector } from 'react-redux'
import RNFetchBlob from 'rn-fetch-blob'
import Share from 'react-native-share'
import * as APIs from '../../../../api/APIs'
import axios from 'axios'
import _ from 'lodash'

import {color040404, color3777EE, colorF8F8F8, colorFFFFFF, colorA7A8A9, colorF0F0F0} from 'constants/colors'
import Translate from 'translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'

import icHealth from '../../../../../assets/images/health_profile'
import icHeader from '../../../../../assets/images/header'
import icDoc from '../../../../../assets/images/document'

import Header from 'components/Header'
import LoadingView from 'components/LoadingView'
import NewDocumentFloating from '../../../documentlist/components/NewDocumentFloating'

export default function ConsultationDetail({route}) {
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const passingData = route?.params?.data
  const categoryFile = route?.params?.listCategoryFile
  const [isLoad, setLoading] = useState(true)
  const [data, setData] = useState()
  const [base64Referral, setBase64Referral] = useState()
  const [base64Cert, setBase64Cert] = useState()
  const [dataDetail, setDataDetail] = useState()
  const [isShowAddDoc, setShowAddDoc] = useState(false)
  const [statusAddDoc, setStatusAddDoc] = useState()
  const [dataNoti, setDataNoti] = useState()
  const [isShowNoti, setShowNoti] = useState()

  useEffect(() => {
    callAPIGetDetail()
    checkNotiStausAddDocument()
  }, [statusAddDoc])

  useEffect(() => {
    callAPIGetPrescriptionDownload()
    callAPIReferralDownload()
    callAPIGetCertificate()
  }, [])

  const checkNotiStausAddDocument = () => {
    if (_.includes([0, '0'], statusAddDoc)) {
      setDataNoti({
        status: STATUS_NOTIFY.SUCCESS,
        content: 'Add attachment successful'
      })
    }
    if (_.includes([1, '1'], statusAddDoc)) {
      setDataNoti({
        status: STATUS_NOTIFY.ERROR,
        content: 'Add attachment failed'
      })
    }
  }

  const callAPIGetDetail = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/webdoctor/getDetailConsultation/${Number(passingData?.webconferenceId)}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get detail')
        } else {
          console.log('noti: ', 'detail')
          const getList = response?.data || []
          setDataDetail(getList)
        }
      })
      .catch(error => {
        console.log('detailErr: ',  error)
      })
  }

  const callAPIGetCertificate = () => {
    RNFetchBlob.fetch(
      'GET',
      `${APIs.hostAPI}backoffice/certificate/downloadCertificateById/${Number(passingData?.idCert)}`,
      {
        'x-auth-token': token
      },
    )
      .then(res => {
        // setLoading(false)
        let status = res.info().status
        console.log('statusCert: ', res.info().status)

        if (status === 200) {
          let base64Str = res.base64()
          setBase64Cert(base64Str)
        } else {
          // handle other status codes
        }
      })
      .catch((errorMessage, statusCode) => {
        // error handling
        console.log('errorMessage: ', errorMessage)
      })
  }

  const callAPIGetPrescriptionDownload = () => {
    RNFetchBlob.fetch(
      'GET',
      `${APIs.hostAPI}backoffice/prescriptions/getPrescriptionDownload/${Number(passingData?.webconferenceId)}`,
      {
        'x-auth-token': token
      },
    )
      .then(res => {
        // setLoading(false)
        let status = res.info().status
        console.log('status: ', res.info().status)

        if (status === 200) {
          let base64Str = res.base64()
          setData(base64Str)
        } else {
          // handle other status codes
        }
      })
      .catch((errorMessage, statusCode) => {
        // error handling
        console.log('errorMessage: ', errorMessage)
      })
  }

  const callAPIReferralDownload = () => {
    RNFetchBlob.fetch(
      'GET',
      `${APIs.hostAPI}backoffice/webdoctor/downloadReferral/${Number(passingData?.webconferenceId)}`,
      {
        'x-auth-token': token
      },
    )
      .then(res => {
        setLoading(false)
        let status = res.info().status
        console.log('status: ', res.info().status)

        if (status === 200) {
          let base64Str = res.base64()
          setBase64Referral(base64Str)
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

  const renderAddDocument = () => {
    return (
      <TouchableOpacity onPress={() => {
        setShowAddDoc(true)
      }} style={styles.btnAddDoc}>
        <Image source={icDoc.ic_add_document} style={styles.iconStyle} />
        <Text style={[customTxt(Fonts.SemiBold, 16, color3777EE).txt, styles.marginL8]}>
          {Translate(languageRedux).ADD_DOCUMENT}
        </Text>
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

  const renderSOAP = (label1, content) => {
    return (
      <View>
        <View style={styles.marginB8}>
          <Text style={customTxt(Fonts.SemiBold, 14, color040404).txt}>
            {label1}
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

  const RenderItem = ({item}) => {
    return (
      <View>
        {renderDocuments(item?.name)}
      </View>
    )
  }

  const renderListAttachment = () => {
    return (
      <View>
        <FlatList
          data={dataDetail?.attachments || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        <Text
          style={[
            customTxt(Fonts.Bold, 20, color040404).txt,
            styles.marginB16
          ]}>
          Consultation Outcome
        </Text>
        {renderSOAP(Translate(languageRedux).SUBJECTIVE, dataDetail?.consult)}
        {renderSOAP(Translate(languageRedux).OBJECTIVE, dataDetail?.objective)}
        {renderSOAP(Translate(languageRedux).ASSESSMENT, dataDetail?.summary)}
        {renderSOAP(Translate(languageRedux).PLAN, dataDetail?.recommendations)}
        <Text style={[customTxt(Fonts.Bold, 20, color040404).txt, styles.marginB8]}>
          {Translate(languageRedux).documents}
        </Text>
        {((base64Referral || []).length > 0 || (data || []).length > 0 || (base64Cert || []).length > 0) &&
            <View>
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
              {renderListAttachment()}
            </View>
        }
        {renderAddDocument()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        iconLeft={icHeader.ic_left}
        textCenter={Translate(languageRedux).VIDEO_CONSULTATION_INFO}
        backgroundColor={colorFFFFFF}
      />
      <ScrollView>
        {renderBody()}
      </ScrollView>
      {isLoad && <LoadingView />}
      {isShowAddDoc && (
        <View style={[styles.floatView]}>
          <NewDocumentFloating
            onPressCancel={() => {
              setShowAddDoc(false)
            }}
            routeViewFromDoctor={true}
            patientId={passingData?.patientId}
            listCategoryFile={categoryFile}
            setStatus={setStatusAddDoc}
            setShowNotiAdd={setShowNoti}
            webconferenceId={Number(passingData?.webconferenceId)}
          />
        </View>
      )}
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
    backgroundColor: colorF8F8F8
  },
  ctnBody: {
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colorFFFFFF,
    shadowColor: Platform.OS === 'ios' ? '#000' : '#6b6b6b',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3
  },
  ctnPrecription: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colorF8F8F8,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
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
  ctnButton: {
    marginBottom: 12,
    marginTop: 16
  },
  btnAddDoc: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: colorF8F8F8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  marginL8: {
    marginLeft: 8
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
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  }
})
