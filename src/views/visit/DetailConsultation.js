import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Platform } from 'react-native'
import * as APIs from '../../api/APIs'
import Share from 'react-native-share'

import Header from '../../components/Header'
import icHeader from '../../../assets/images/header'
import { color040404, color5C5D5E, colorA7A8A9, colorEAF1FF, colorF0F0F0, colorF8F8F8, colorFFFFFF } from '../../constants/colors'
import NavigationService from '../../navigation'
import { customTxt } from '../../constants/css'
import Fonts from '../../constants/Fonts'
import Translate from '../../translate'
import { useSelector } from 'react-redux'
import { convertDMMMYYYY, convertNumberTime } from '../../constants/DateHelpers'
import icVisit from '../../../assets/images/visit'
import LoadingView from 'components/LoadingView'
import RNFetchBlob from 'rn-fetch-blob'
import icHealth from '../../../assets/images/health_profile'
import Routes from 'navigation/Routes'
import DocumentPicker from 'react-native-document-picker'
import CameraRoll from '@react-native-community/cameraroll'

export default function DetialAppointment({ route }) {

  const languageRedux = useSelector(state => state.common.language)
  const passingData = route?.params?.data
  const token = useSelector(state => state.user.token)
  const [isLoad, setLoading] = useState(true)
  const [data, setData] = useState()
  const [base64Referral, setBase64Referral] = useState()

  useEffect(() => {
    callAPIGetPrescriptionDownload()
    callAPIReferralDownload()
  }, [])

  const callAPIGetPrescriptionDownload = () => {
    RNFetchBlob.fetch(
      'GET',
      `${APIs.hostAPI}backoffice/prescriptions/getPrescriptionDownload/${passingData?.webconferenceId}`,
      {
        'x-auth-token': token
      },
    )
      .then(res => {
        setLoading(false)
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
        setLoading(false)
        let status = res.info().status

        if (status === 200) {
          let base64Str = res.base64()
          // console.log('base64Str: ', base64Str)
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

    const { dirs } = RNFetchBlob.fs
    const dirToSave = Platform.OS === 'ios' ? dirs.CacheDir : dirs.DownloadDir
    const path = `${dirToSave}/shareReferral.pdf`

    const imgURL = { uri: `data:application/pdf;base64,${base64Referral}` }

    console.log('options: ', options)

    if (Platform.OS === 'android') {
      // Linking.openURL('content://media/internal/images/media')
      RNFetchBlob.fs.writeFile(path, base64Referral, 'base64').then(res2 => {
        console.log('Android base 64: ', res2)
        console.log('Android base 64: ', path)
        console.log(('path 64: ', res2.path()))
      }).catch(err => {
        console.log('Error read file: ', err)
        console.log('read file: ', `file://${path}`)
        Linking.openURL(`file://${path}`)
      })

      console.log('imgURL: ', imgURL)

      setTimeout(() => {
        try {
          CameraRoll.save(imgURL, {
            type: 'photo'
          })
        } catch (error) {
        }
        DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles]
        })
      }, 1000)
    } else {
      Share.open(options)
      .then(async res => {
        console.log(res)
        if (Platform.OS === 'ios') {
          Linking.openURL('photos-redirect://')
        } else if (Platform.OS === 'android') {
          // Linking.openURL('content://media/internal/images/media')
          RNFetchBlob.fs.writeFile(path, base64Referral, 'base64').then(res2 => {
            console.log('Android base 64: ', res2)
            console.log('Android base 64: ', path)
            console.log(('path 64: ', res2.path()))
          }).catch(err => {
            console.log('Error read file: ', err)
            console.log('read file: ', `file://${path}`)
            Linking.openURL(`file://${path}`)
          })

          console.log('imgURL: ', imgURL)

          setTimeout(() => {
            try {
              CameraRoll.save(imgURL, {
                type: 'photo'
              })
            } catch (error) {
            }
            DocumentPicker.pick({
              type: [DocumentPicker.types.allFiles]
            })
          }, 1000)
        }
      })
      .catch(err => {
        err && console.log(err)
      })
    }
  }

  const _onPressShareReferral = async () => {
    let options = {
      url: `data:image;base64,${base64Referral}`,
      filename: 'title'
    }

    const { dirs } = RNFetchBlob.fs
    const dirToSave = Platform.OS === 'ios' ? dirs.CacheDir : dirs.DownloadDir
    const path = `${dirToSave}/shareReferral.png`

    const imgURL = { uri: `data:image;base64,${base64Referral}` }
    console.log('Android download: ')
    RNFetchBlob.fs.writeFile(path, base64Referral, 'base64').then(res => {
      console.log('Android base 64: ', res)
      console.log('Android base 64: ', path)
      console.log(('path 64: ', res.path()))
    }).catch(err => {
      console.log('Error read file: ', err)
      console.log('read file: ', `file://${path}`)
      Linking.openURL(`file://${path}`)
    })

    console.log('imgURL: ', imgURL)

    Share.open(options)
      .then(async res => {
        console.log(res)
        if (Platform.OS === 'ios') {
          Linking.openURL('photos-redirect://')
        } else if (Platform.OS === 'android') {
          // Linking.openURL('content://media/internal/images/media')
          try {
            await CameraRoll.save(imgURL, {
              type: 'photo'
            })
          } catch (error) {
          }
          DocumentPicker.pick({
            type: [DocumentPicker.types.allFiles]
          })
        }
      })
      .catch(err => {
        err && console.log(err)
      })
  }

  const _onPressPrescription = () => {
    NavigationService.navigate(Routes.PDF_VIEW, {
      data: data
    })
  }

  const renderPrecription = () => {
    return (
      <TouchableOpacity onPress={_onPressPrescription} style={styles.ctnPrecription}>
        <View>
          <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginB4]}>
            {Translate(languageRedux).prescription}
          </Text>
          <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
            Lorem ipsum dolor sit amet, consectetur...
          </Text>
        </View>
        <TouchableOpacity onPress={_onPressShare} style={styles.ctnIconDownLoad}>
          <Image source={icHealth.ic_download} style={styles.iconStyle} />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  const _onPressReferral = () => {
    NavigationService.navigate(Routes.PDF_VIEW, {
      data: base64Referral
    })
  }

  const renderReferral = () => {
    return (
      <TouchableOpacity onPress={_onPressReferral} style={styles.ctnPrecription}>
        <View>
          <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginB4]}>
            {Translate(languageRedux).REFERRAL}
          </Text>
          <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
            Lorem ipsum dolor sit amet, consectetur...
          </Text>
        </View>
        <TouchableOpacity onPress={_onPressShareReferral} style={styles.ctnIconDownLoad}>
          <Image source={icHealth.ic_download} style={styles.iconStyle} />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  const checkDocument = () => {
    if (
      passingData?.consult === null &&
      passingData?.doctorObjective === null &&
      passingData?.diagnosis === null &&
      passingData?.recommendations === null &&
      passingData?.prescriptionSent === '0' &&
      passingData?.referralSent === '0'
    ) {
      return true
    } else {
      return false
    }
  }

  const renderBox = () => {
    const convertDate = passingData?.date ? convertDMMMYYYY(passingData?.date) : ''
    const convertTime = passingData?.date ? convertNumberTime(passingData?.date) : ''
    const DateTime = (convertDate && convertTime) ? (convertDate + ', ' + convertTime) : ''
    return (
      <View style={styles.ctnDocName}>
        {/* DOCTOR NAME */}
        <View style={styles.marginB8}>
          <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
            {Translate(languageRedux).DOCTOR}
          </Text>
        </View>
        <View style={styles.marginB8}>
          <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
            Doc. {passingData?.doctor}
          </Text>
        </View>
        <View style={styles.divider} />
        {/* DATE and TIME */}
        <View style={styles.marginB8}>
          <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
            {Translate(languageRedux).appointment}
          </Text>
        </View>
        <View style={styles.marginB16}>
          <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
            {DateTime}
          </Text>
        </View>
        <View style={styles.divider} />
        {/* WHO IS THIS FOR */}
        <View style={styles.marginB8}>
          <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
            {Translate(languageRedux).WHO_IS_FOR}
          </Text>
        </View>
        <View style={styles.marginB16}>
          <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
            {passingData?.risposta1}
          </Text>
        </View>
        <View style={styles.divider} />
        {/* DESCRIPTION */}
        <View style={styles.marginB8}>
          <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
            {Translate(languageRedux).description}
          </Text>
        </View>
        <View style={styles.marginB16}>
          <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
            {passingData?.about}
          </Text>
        </View>
        <View style={styles.divider} />
        {/* DOCUMENT */}
        <View style={styles.ctnRecomDoc}>
          <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
            {Translate(languageRedux).Result_of_the_consultation}
          </Text>
        </View>
        <View style={styles.ctnButton}>
          {passingData?.hasSoap !== '1' && (
            <View style={styles.info}>
              <View style={styles.ctnIcon}>
                <Image source={icVisit.ic_info} style={styles.iconStyle} />
              </View>
              <View style={styles.ctnText}>
                <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
                  {Translate(languageRedux).TITLE_AFTER_VIDEO_CALL}
                </Text>
              </View>
            </View>
          )}
          {checkDocument() && (
            <View style={styles.draft}>
              <Image
                source={icVisit.ic_info}
                style={[styles.iconStyle, styles.marginB8]}
              />
              <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
                {Translate(languageRedux).NOT_DOCUMENT_HISTORY}
              </Text>
            </View>
          )}
          {passingData?.hasSoap === '1' && (
            <View>
              {/* SUBJECTIVE */}
              {passingData?.consult !== null && (
                <View>
                  <View style={styles.marginB8}>
                    <Text
                      style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
                      {passingData?.hasSoap === '1'
                        ? Translate(languageRedux).SUBJECTIVE
                        : Translate(languageRedux).CONSULT}
                    </Text>
                  </View>
                  <View style={styles.marginB16}>
                    {passingData?.consult !== null ? (
                      <Text
                        style={
                          customTxt(Fonts.Regular, 16, color040404).txt
                        }>
                        {passingData?.consult}
                      </Text>
                    ) : (
                      <Text
                        style={
                          customTxt(Fonts.Regular, 16, colorA7A8A9).txt
                        }>
                        {Translate(languageRedux).NONE}
                      </Text>
                    )}
                  </View>
                  <View style={styles.divider} />
                </View>
              )}
              {/* Objective */}
              {passingData?.hasSoap === '1' &&
                passingData?.doctorObjective !== null && (
                  <View>
                    <View style={styles.marginB8}>
                      <Text
                        style={
                          customTxt(Fonts.Regular, 12, color5C5D5E).txt
                        }>
                        {Translate(languageRedux).OBJECTIVE}
                      </Text>
                    </View>
                    <View style={styles.marginB16}>
                      {passingData?.doctorObjective !== null ? (
                        <Text
                          style={
                            customTxt(Fonts.Regular, 16, color040404).txt
                          }>
                          {passingData?.doctorObjective}
                        </Text>
                      ) : (
                        <Text
                          style={
                            customTxt(Fonts.Regular, 16, colorA7A8A9).txt
                          }>
                          {Translate(languageRedux).NONE}
                        </Text>
                      )}
                    </View>
                    <View style={styles.divider} />
                  </View>
                )}
              {/* ASSESSMENT */}
              {passingData?.diagnosis !== null && (
                <View>
                  <View style={styles.marginB8}>
                    <Text
                      style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
                      {passingData?.hasSoap === '1'
                        ? Translate(languageRedux).ASSESSMENT
                        : Translate(languageRedux).DIAGNOSIS}
                    </Text>
                  </View>
                  <View style={styles.marginB16}>
                    {passingData?.diagnosis !== null ? (
                      <Text
                        style={
                          customTxt(Fonts.Regular, 16, color040404).txt
                        }>
                        {passingData?.diagnosis}
                      </Text>
                    ) : (
                      <Text
                        style={
                          customTxt(Fonts.Regular, 16, colorA7A8A9).txt
                        }>
                        {Translate(languageRedux).NONE}
                      </Text>
                    )}
                  </View>
                  <View style={styles.divider} />
                </View>
              )}
              {/* PLAN */}
              {passingData?.recommendations !== null && (
                <View>
                  <View style={styles.marginB8}>
                    <Text
                      style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
                      {passingData?.hasSoap === '1'
                        ? Translate(languageRedux).PLAN
                        : Translate(languageRedux).RECOMMENDATION}
                    </Text>
                  </View>
                  <View style={styles.marginB16}>
                    {passingData?.recommendations !== null ? (
                      <Text
                        style={
                          customTxt(Fonts.Regular, 16, color040404).txt
                        }>
                        {passingData?.recommendations}
                      </Text>
                    ) : (
                      <Text
                        style={
                          customTxt(Fonts.Regular, 16, colorA7A8A9).txt
                        }>
                        {Translate(languageRedux).NONE}
                      </Text>
                    )}
                  </View>
                  <View style={styles.divider} />
                </View>
              )}
            </View>
          )}
          <View style={styles.marginB8}>
            {passingData?.prescriptionSent === '1' && renderPrecription()}
          </View>
          <View>
            {passingData?.referralSent === '1' && renderReferral()}
          </View>
        </View>
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        {renderBox()}
      </View>
    )
  }

  return (
    <View style={styles.flex}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_left}
        onPressLeft={() => NavigationService.goBack()}
        textCenter={Translate(languageRedux).consultation}
      />
      <ScrollView>{renderBody()}</ScrollView>
      {isLoad && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  ctnBody: {
    marginTop: 15,
    marginBottom: 42,
    marginHorizontal: 20,
    borderRadius: 16,
    backgroundColor: colorFFFFFF,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 9
  },
  ctnDocName: {
    marginHorizontal: 16,
    marginTop: 16
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
  ctnRecomDoc: {
  },
  ctnButton: {
    marginTop: 16,
    marginBottom: 16
  },
  info: {
    height: 84,
    width: '100%',
    backgroundColor: colorEAF1FF,
    borderRadius: 12
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  ctnIcon: {
    marginTop: 16,
    marginLeft: 16,
    marginBottom: 8
  },
  ctnText: {
    marginLeft: 16,
    marginBottom: 16
  },
  ctnPrecription: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colorF8F8F8,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  marginB4: {
    marginBottom: 4
  },
  ctnIconDownLoad: {
    justifyContent: 'center'
  },
  draft: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: colorEAF1FF
  }
})
