import React, {useEffect, useState} from 'react'
import {View, Text, StyleSheet } from 'react-native'
import PDFView from 'react-native-view-pdf'
import RNFetchBlob from 'rn-fetch-blob'
import * as APIs from '../../api/APIs'
import {useSelector} from 'react-redux'

import icHeader from '../../../assets/images/header'

import Header from 'components/Header'
import LoadingView from 'components/LoadingView'

export default function PdfView({route}) {
  const passingData = route?.params?.data
  const passingId = route?.params?.id
  const passingItem = route?.params?.check
  const token = useSelector(state => state.user.token)
  const [base64, setBase64] = useState()
  const [isLoad, setLoading] = useState(true)

  useEffect(() => {
    console.log('passingData: ', passingData)
    console.log('passingItem: ', passingItem)
    callAPIReferralDownload(passingId)
  }, [])

  const checkUrl = () => {
    if (passingItem?.referral) {
      return 'backoffice/downloadFreeReferralById'
    }
    if (passingItem?.prescription) {
      return 'backoffice/downloadFreePrescriptionById'
    } else {
      return 'backoffice/certificate/downloadCertificateById'
    }
  }

  const callAPIReferralDownload = (id) => {
    RNFetchBlob.fetch(
      'GET',
      `${APIs.hostAPI}${checkUrl()}/${Number(id)}`,
      {
        'x-auth-token': token
      },
    )
      .then(res => {
        let status = res.info().status

        if (status === 200) {
          let base64Str = res.base64()
          // console.log('res: ', base64Str)
          setBase64(base64Str)
          setLoading(false)
        } else {
          // handle other status codes
          setLoading(false)
        }
      })
      .catch((errorMessage, statusCode) => {
        // error handling
        setLoading(false)
      })
  }

  const resources = {base64: passingData || base64}

  return (
    <View style={styles.container}>
      <Header
        iconLeft={icHeader.ic_left}
      />
      <PDFView
        fadeInDuration={250.0}
        style={styles.container}
        resource={resources['base64']}
        resourceType={'base64'}
        onLoad={() => console.log(`PDF rendered from`)}
        onError={error => console.log('Cannot render PDF', error)}
      />
      {isLoad && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
