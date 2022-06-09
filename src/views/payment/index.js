import React, { useEffect, useState, useRef } from 'react'
import {
  View, StyleSheet, ScrollView, Text,
  TouchableOpacity, Dimensions, Image, Platform,
  FlatList, Linking, DeviceEventEmitter
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import Header from '../../components/Header'
import { color040404, color3777EE, colorDDDEE1, colorE53E3E, colorF0F0F0, colorF8F8F8, colorFFFFFF } from 'constants/colors'
import NavigationService from 'navigation'
import Fonts from 'constants/Fonts'
import Translate from '../../translate'
import icHeader from '../../../assets/images/header'
import LoadingView from '../../components/LoadingView'
import { apiGetCheckOrderStatusMPAY, apiGetLegalDisclaimer, apiGetMPayRetrieveCards, apiGetPaypalURL, apiGetRetrievePaymentMethods, apiPostCreateOrderMPAY, apiPostSaveAgreedDisclaimer } from 'api/Payment'
import HTML from 'react-native-render-html'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
// import { requestOneTimePayment, requestBillingAgreement } from 'react-native-paypal'
import { WebView } from 'react-native-webview'
import { customTxt } from 'constants/css'
import imgPaypal from '../../../assets/images/payment'
import axios from 'axios'
import * as APIs from '../../api/APIs'
import useScript from 'react-script-hook'
import RenderHTML from 'react-native-render-html'
import _ from 'lodash'
import imgHealth from '../../../assets/images/health_profile'
import imgHome from '../../../assets/images/home_screen'
import CustomNextBT from 'views/home_screen/direct_call/component_direct_call/CustomNextBT'
import RNFetchBlob from 'rn-fetch-blob'
import { launchImageLibrary } from 'react-native-image-picker'
import CameraRoll from '@react-native-community/cameraroll'
import Routes from 'navigation/Routes'
import { Files } from 'react-native-android-files'
import DocumentPicker from 'react-native-document-picker'

export default function PaymentView({ route }) {
  const passingdata = route?.params?.doctor
  const dispatch = useDispatch()
  const languageRedux = useSelector(state => state.common.language)
  const [isLoading, setLoading] = useState(false)
  const [legalDisclaimer, setLegalDisclaimer] = useState()
  const [isShowNoti, setShowNoti] = useState()
  const [dataNoti, setDataNoti] = useState()
  const scrollRef = useRef()
  const [isActiveBt, setActiveBt] = useState(false)
  const [urlPaypal, setUrlPaypal] = useState()
  const [isTouchPaypal, setTouchPaypal] = useState(false)
  const [isTouchCredit, setTouchCredit] = useState(false)
  const token = useSelector(state => state.user.token)
  const [isSurvey, setIdSurvey] = useState()
  const webviewRef = useRef()
  const [sent, setSent] = useState(false)
  const allergiesRedux = useSelector(state => state.common.dataAllergy)
  const medicationRedux = useSelector(state => state.common.dataMedi)
  const diseasesRedux = useSelector(state => state.common.dataDisease)
  const permissionRedux = useSelector(state => state.user.permission)
  const [lsRetrievePayment, setLsRetrievePayment] = useState([])
  const [itemRetrievePayment, setItemRetrievePayment] = useState()
  const [itemProceedPayment, setItemProceedPayment] = useState()

  useEffect(() => {
    console.log('data: ', passingdata)
    callAPIPayment()
    // callAPIOrder()
    callAPIGetSurvey()
  }, [])

  const callAPIPayment = () => {
    if (permissionRedux?.iniziativa?.paymentPlatform === 'MPAY') {
      setLoading(true)
      dispatch(apiGetMPayRetrieveCards()).then(res => {
        console.log('resLegalDisclaimer: ', res)
        setLegalDisclaimer(res?.payload)
        setLoading(false)
        setTimeout(() => {
          callAPIRetrievePaymentMethods()
        }, 500)
        if (res?.payload?.esito !== '0') {
          setShowNoti(true)
          setDataNoti({
            status: STATUS_NOTIFY.ERROR,
            content: res?.payload?.motivo || ''
          })
        }
      }).catch(() => {
        setLoading(false)
      })

    } else {
      if (passingdata?.idmedico || permissionRedux?.iniziativa?.HAS_WALLET === '1') {
        setLoading(true)
        dispatch(apiGetLegalDisclaimer(passingdata?.idmedico)).then(res => {
          console.log('resLegalDisclaimer: ', res)
          setLegalDisclaimer(res?.payload)
          setLoading(false)
          if (res?.payload?.esito !== '0') {
            setShowNoti(true)
            setDataNoti({
              status: STATUS_NOTIFY.ERROR,
              content: res?.payload?.motivo || ''
            })
          }
        }).catch(() => {
          setLoading(false)
        })
      }

      if (permissionRedux?.iniziativa?.HAS_WALLET === '1') {
        //https://react.salubermd.com/backoffice/wallet/checkWalletBeforeDirectCall/0.01
      }
    }
  }

  const callAPIRetrievePaymentMethods = () => {
    setLoading(true)
    dispatch(apiGetRetrievePaymentMethods()).then(res => {
      setLoading(false)
      if (res?.payload?.esito === '0') {
        if (permissionRedux?.iniziativa?.HAS_WALLET === '1') {
          setLsRetrievePayment(res?.payload?.paymentTypes || [])
        } else {
          const getData = res?.payload?.paymentTypes || []
          const checkWallet = getData.filter(val => !(_.includes(val?.paymentName, 'Wallet')))
          setLsRetrievePayment(checkWallet)
        }
      } else {
        setShowNoti(true)
        setDataNoti({
          status: STATUS_NOTIFY.ERROR,
          content: res?.payload?.motivo || ''
        })
      }
    }).catch(error => {
      setLoading(false)
    })
  }

  const callAPIGetSurvey = async () => {
    var params = {
      'idQuestionario': -1,
      'idMedico': -1,
      'medications': (medicationRedux?.datas || []).map(val => {
        return {
          'id': val?.id,
          'nameCurrentValue': val?.other,
          'genericName': val?.genericName,
          'dosage': val?.dosage,
          'medicationId': val?.medicineId
        }
      }),
      'allergies': (allergiesRedux?.datas || []).map(val => {
        return {
          'id': val?.id,
          'nameCurrentValue': val?.genericName,
          'other': val?.other || null,
          'allergyId': val?.allergyId
        }
      }),
      'diseases': (diseasesRedux?.datas || []).map(val => {
        return {
          'id': val?.id,
          'nameCurrentValue': val?.name,
          'other': val?.other || null,
          'diseaseId': val?.diseaseId
        }
      }),
      'complaints': [],
      'files': [],
      'answer1': 'Me',
      'answer2': 'talkAbout',
      'auth': 'true'
    }

    // if (nameChild) {
    //   params = {
    //     ...params,
    //     childname: nameChild,
    //     childbirthdate: `${convertYYYYMMDD(birthdayChild)}T17:00:00.000Z`
    //   }
    // }

    console.log('paramsss:', params)

    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/webdoctor/saveSurvey`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      },
      data: JSON.stringify(params)
    }).then(res => {
      console.log('saveSurvey Res :', res?.data)
      setIdSurvey(res?.data?.idSurvey)
    }).catch(err => {
      console.log('Err:', err)
    })
  }

  const _onPressSave = () => {
    const body = {
      surveyId: isSurvey,
      privacyId: legalDisclaimer?.id
    }
    console.log('BODY: ', body)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/webdoctor/saveAgreedDisclaimer`,
      headers: {
        'x-auth-token': token
      },
      data: body
    })
      .then(response => {
        console.log('data: ', response.data)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })

    dispatch(apiGetPaypalURL(passingdata?.currency || 'EUR')).then(res => {
      console.log('GetPaypulUrl: ', res?.payload?.url)
      var url = res?.payload?.url
      if (url) {
        Promise.all([
          setUrlPaypal(url)
          // setUrlPaypal('https://www.paypal.com/sdk/js?intent=authorize&client-id=Ad0K6H9O4nejuhDwmLz3JFzt4njdYGfLoencrgW_nfjZ1Q0TNL-i3mfdUO-R3q42YcG7nVDUYGz_gd5Y&currency=USD&locale=it_IT')
        ])
      }
      // console.log('urlPaypal: ', urlPaypal)
    })
  }
  // referer: 'https://www.paypal.com/smart/buttons?
  //style.layout=vertical&
  //style.color=gold&
  //style.shape=rect&
  //style.tagline=false&
  //components.0=buttons&
  //locale.lang=en&
  //locale.country=US&
  //sdkMeta=eyJ1cmwiOiJodHRwczovL3d3dy5wYXlwYWwuY29tL3Nkay9qcz9pbnRlbnQ9YXV0aG9yaXplJmNsaWVudC1pZD1BYTk1U0Q5NGktNnBmZkhoQ2ctd1Z1dEpQQkp1UllGdmxQRm5HYUUwcVU4ZGxJYlpXMmZ1TmswUzhSUDZUU25URFlyUzZyWFAtQzRjLXhQQSZjdXJyZW5jeT1FVVImbG9jYWxlPWVuX1VTIiwiYXR0cnMiOnsiZGF0YS11aWQiOiJ1aWRfd2VjYW56ZWtuZnljdnZzaXN1cmZkdnhuZWdodGxsIn19&
  //clientID=Aa95SD94i-6pffHhCg-wVutJPBJuRYFvlPFnGaE0qU8dlIbZW2fuNk0S8RP6TSnTDYrS6rXP-C4c-xPA&
  //sdkCorrelationID=f7155461115f6&
  //storageID=uid_5b1b00735a_mdk6nta6mzk&
  //sessionID=uid_7732f74647_mtu6mjy6ndg&
  //buttonSessionID=uid_df166240fd_mtu6mjy6ndg&
  //env=production
  //&fundingEligibility=eyJwYXlwYWwiOnsiZWxpZ2libGUiOnRydWUsInZhdWx0YWJsZSI6ZmFsc2V9LCJwYXlsYXRlciI6eyJlbGlnaWJsZSI6ZmFsc2UsIm1lcmNoYW50Q29uZmlnSGFzaCI6IjM1OTE0YjVkYzk4M2RmZGVmOWMwNzI0NjBlN2EwYTBhMjUxYzdmYTMiLCJwcm9kdWN0cyI6eyJwYXlJbjQiOnsiZWxpZ2libGUiOmZhbHNlLCJ2YXJpYW50IjpudWxsfSwicGF5bGF0ZXIiOnsiZWxpZ2libGUiOmZhbHNlLCJ2YXJpYW50IjpudWxsfX19LCJjYXJkIjp7ImVsaWdpYmxlIjp0cnVlLCJicmFuZGVkIjp0cnVlLCJpbnN0YWxsbWVudHMiOmZhbHNlLCJ2ZW5kb3JzIjp7InZpc2EiOnsiZWxpZ2libGUiOnRydWUsInZhdWx0YWJsZSI6dHJ1ZX0sIm1hc3RlcmNhcmQiOnsiZWxpZ2libGUiOnRydWUsInZhdWx0YWJsZSI6dHJ1ZX0sImFtZXgiOnsiZWxpZ2libGUiOnRydWUsInZhdWx0YWJsZSI6dHJ1ZX0sImRpc2NvdmVyIjp7ImVsaWdpYmxlIjpmYWxzZSwidmF1bHRhYmxlIjp0cnVlfSwiaGlwZXIiOnsiZWxpZ2libGUiOmZhbHNlLCJ2YXVsdGFibGUiOmZhbHNlfSwiZWxvIjp7ImVsaWdpYmxlIjpmYWxzZSwidmF1bHRhYmxlIjp0cnVlfSwiamNiIjp7ImVsaWdpYmxlIjpmYWxzZSwidmF1bHRhYmxlIjp0cnVlfX0sImd1ZXN0RW5hYmxlZCI6ZmFsc2V9LCJ2ZW5tbyI6eyJlbGlnaWJsZSI6ZmFsc2V9LCJpdGF1Ijp7ImVsaWdpYmxlIjpmYWxzZX0sImNyZWRpdCI6eyJlbGlnaWJsZSI6ZmFsc2V9LCJhcHBsZXBheSI6eyJlbGlnaWJsZSI6ZmFsc2V9LCJzZXBhIjp7ImVsaWdpYmxlIjpmYWxzZX0sImlkZWFsIjp7ImVsaWdpYmxlIjpmYWxzZX0sImJhbmNvbnRhY3QiOnsiZWxpZ2libGUiOmZhbHNlfSwiZ2lyb3BheSI6eyJlbGlnaWJsZSI6ZmFsc2V9LCJlcHMiOnsiZWxpZ2libGUiOmZhbHNlfSwic29mb3J0Ijp7ImVsaWdpYmxlIjpmYWxzZX0sIm15YmFuayI6eyJlbGlnaWJsZSI6ZmFsc2V9LCJwMjQiOnsiZWxpZ2libGUiOmZhbHNlfSwiemltcGxlciI6eyJlbGlnaWJsZSI6ZmFsc2V9LCJ3ZWNoYXRwYXkiOnsiZWxpZ2libGUiOmZhbHNlfSwicGF5dSI6eyJlbGlnaWJsZSI6ZmFsc2V9LCJibGlrIjp7ImVsaWdpYmxlIjpmYWxzZX0sInRydXN0bHkiOnsiZWxpZ2libGUiOmZhbHNlfSwib3h4byI6eyJlbGlnaWJsZSI6ZmFsc2V9LCJtYXhpbWEiOnsiZWxpZ2libGUiOmZhbHNlfSwiYm9sZXRvIjp7ImVsaWdpYmxlIjpmYWxzZX0sIm1lcmNhZG9wYWdvIjp7ImVsaWdpYmxlIjpmYWxzZX19
  //&platform=mobile&experiment.enableVenmo=false&experiment.disablePaylater=false&flow=purchase
  //&currency=EUR&intent=authorize&commit=true&vault=false
  //&renderedButtons.0=paypal&renderedButtons.1=card&debug=false&applePaySupport=false&supportsPopups=false&supportedNativeBrowser=false&allowBillingPayments=true',
  // var param = { 'purchase_units': [{ 'amount': { 'value': '0.01', 'currency_code': 'EUR' } }], 'intent': 'AUTHORIZE', 'application_context': {} }
  const callAPIOrder = () => {
    // axios({
    //   method: 'post',
    //   url: ' https://www.paypal.com/xoplatform/logger/api/logger',
    //   headers: {
    //     Accept: '*/*',
    //     'Content-Type': 'application/json',
    //     'x-requested-with': 'com.salubermd.saluber',
    //     'paypal-debug-id': 'f7436658ed757'
    //   }
    //   // data: body
    // })
    //   .then(response => {
    //     console.log('Logger: ', response?.data)
    //   })
    //   .catch(error => {
    //     console.error('There was an error!', error)
    //   })
    // return fetch('https://www.paypal.com/v2/checkout/orders', {
    //   method: 'POST',
    //   headers: {
    //     Accept: '*/*',
    //     'Content-Type': 'application/json',
    //     'x-requested-with': 'com.salubermd.saluber',
    //     'paypal-debug-id': 'f7436658ed757'
    //   }
    //   // body: body
    // }).then(res => {
    //   console.log('checkOrder: ', res)
    // }).catch(() => {

    // })
    const body = {
      purchase_units:
        [
          {
            amount:
            {
              value: passingdata?.valuePricing,
              currency_code: passingdata?.currency
            }
          }
        ],
      intent: 'AUTHORIZE',
      application_context: {}
    }
    axios({
      method: 'post',
      url: 'https://www.paypal.com/v2/checkout/orders',
      headers: {
        'authority': 'www.paypal.com',
        'x-requested-with': 'com.salubermd.saluber',
        'origin': 'https://www.paypal.com',
        'prefer': 'return=representation',
        'Authorization': 'Bearer ' + 'A21AAOF7A8wkKJsoMiwBivZfTRIdFA_EdiXFFlR-tlDAoDrnURMAh43ysN5gU6nu3eNI4b5oz-58yB0Mdi42QnqBomKGbDpkw'
      },
      data: body
    })
      .then(response => {
        console.log('checkOrder: ', response?.data)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })

    axios({
      method: 'post',
      url: 'https://www.paypal.com/graphql?UpdateClientConfig',
      headers: {
        'authority': 'www.paypal.com',
        'x-requested-with': 'com.salubermd.saluber',
        'origin': 'https://www.paypal.com',
        'prefer': 'return=representation',
        'Authorization': 'Bearer ' + 'A21AAOF7A8wkKJsoMiwBivZfTRIdFA_EdiXFFlR-tlDAoDrnURMAh43ysN5gU6nu3eNI4b5oz-58yB0Mdi42QnqBomKGbDpkw'
      },
      data: body
    })
      .then(response => {
        console.log('UpdateClientConfig: ', response?.data)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })

    axios({
      method: 'post',
      url: 'https://www.paypal.com/graphql?GetCheckoutDetails',
      headers: {
        'authority': 'www.paypal.com',
        'x-requested-with': 'com.salubermd.saluber',
        'origin': 'https://www.paypal.com',
        'prefer': 'return=representation',
        'Authorization': 'Bearer ' + 'A21AAOF7A8wkKJsoMiwBivZfTRIdFA_EdiXFFlR-tlDAoDrnURMAh43ysN5gU6nu3eNI4b5oz-58yB0Mdi42QnqBomKGbDpkw'
      },
      data: body
    })
      .then(response => {
        console.log('GetCheckoutDetails: ', response?.data)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
  }

  const _onPressPay = async () => {
    // return await requestBillingAgreement()
    // return requestOneTimePayment(
    //   // token,
    //   'Aa95SD94i-6pffHhCg-wVutJPBJuRYFvlPFnGaE0qU8dlIbZW2fuNk0S8RP6TSnTDYrS6rXP-C4c-xPA',
    //   // 'Aa95SD94i-6pffHhCg-wVutJPBJuRYFvlPFnGaE0qU8dlIbZW2fuNk0S8RP6TSnTDYrS6rXP-C4c-xPA',
    //   // '5sXyQ1uuZlevcqlUM4PpMqgf3fUmttDLvRYokujcRPDaVf9plraYzXAUOoZZDvInu4_lus32WVroN1OHdMeTSAmWj0r0JKyt5cORV0',
    //   // 'A21AANFGsY5iM8L4B88mXyQ9xkLQvgRI8j4dAwZf0r8zGggPFj0AGtdbIMpx_2dxGeVTwYlq8yehsgqWolMkSKGSt1QkcaBTA',
    //   {
    //     amount: passingdata?.valuePricing || '0.00', // required
    //     // any PayPal supported currency (see here: https://developer.paypal.com/docs/integration/direct/rest/currency-codes/#paypal-account-payments)
    //     currency: passingdata?.currency || 'EUR',
    //     // any PayPal supported locale (see here: https://braintree.github.io/braintree_ios/Classes/BTPayPalRequest.html#/c:objc(cs)BTPayPalRequest(py)localeCode)
    //     localeCode: languageRedux,
    //     shippingAddressRequired: false,
    //     userAction: 'commit', // display 'Pay Now' on the PayPal review page
    //     // one of 'authorize', 'sale', 'order'. defaults to 'authorize'. see details here: https://developer.paypal.com/docs/api/payments/v1/#payment-create-request-body
    //     intent: 'authorize'
    //   }
    // )
  }

  const uri = 'https://www.paypal.com/smart/buttons?'
  const v1 = 'style.layout=vertical&style.color=gold&style.shape=rect&style.tagline=false&components.0=buttons&locale.lang=en&locale.country=US&sdkMeta=eyJ1cmwiOiJodHRwczovL3d3dy5wYXlwYWwuY29tL3Nkay9qcz9pbnRlbnQ9YXV0aG9yaXplJmNsaWVudC1pZD1BYTk1U0Q5NGktNnBmZkhoQ2ctd1Z1dEpQQkp1UllGdmxQRm5HYUUwcVU4ZGxJYlpXMmZ1TmswUzh'
  const v2 = 'SUDZUU25URFlyUzZyWFAtQzRjLXhQQSZjdXJyZW5jeT1FVVImbG9jYWxlPWVuX1VTIiwiYXR0cnMiOnsiZGF0YS11aWQiOiJ1aWRfd2VjYW56ZWtuZnljdnZzaXN1cmZkdnhuZWdodGxsIn19&clientID=Aa95SD94i-6pffHhCg-wVutJPBJuRYFvlPFnGaE0qU8dlIbZW2fuNk0S8RP6TSnTDYrS6rXP-C4c-xPA&sdkCorrelationID=f7155461115f6&storageID=uid_5b1b00735a_mdk6nta6mzk&sessionID=uid_7732f74647_mtu6mjy6ndg&buttonSessionID=uid_df166240fd_mtu6mjy6ndg&env=production&fundingEligibility=eyJwYXlwYWwiOnsiZWxpZ2libGUiOnRydWUsInZhdWx0YWJsZSI6ZmFsc2V9LCJwYXlsYXRlciI6eyJlbGlnaWJsZSI6ZmFsc2UsIm1lcmNoYW50Q29uZmlnSGFzaCI6IjM1OTE0YjVkYzk4M2RmZGVmOWMwNzI0NjBlN2EwYTBhMjUxYzdmYTMiLCJwcm9kdWN0cyI6eyJwYXlJbjQiOnsiZWxpZ2libGUiOmZhbHNlLCJ2YXJpYW50IjpudWxsfSwicGF5bGF0ZXIiOnsiZWxpZ2libGUiOmZhbHNlLCJ2YXJpYW50IjpudWxsfX19LCJjYXJkIjp7ImVsaWdpYmxlIjp0cnVlLCJicmFuZGVkIjp0cnVlLCJpbnN0YWxsbWVudHMiOmZhbHNlLCJ2ZW5kb3JzIjp7InZpc2EiOnsiZWxpZ2libGUiOnRydWUsInZhdWx0YWJsZSI6dHJ1ZX0sIm1hc3RlcmNhcmQiOnsiZWxpZ2libGUiOnRydWUsInZhdWx0YWJsZSI6dHJ1ZX0sImFtZXgiOnsiZWxpZ2libGUiOnRydWUsInZhdWx0YWJsZSI6dHJ1ZX0sImRpc2NvdmVyIjp7ImVsaWdpYmxlIjpmYWxzZSwidmF1bHRhYmxlIjp0cnVlfSwiaGlwZXIiOnsiZWxpZ2libGUiOmZhbHNlLCJ2YXVsdGFibGUiOmZhbHNlfSwiZWxvIjp7ImVsaWdpYmxlIjpmYWxzZSwidmF1bHRhYmxlIjp0cnVlfSwiamNiIjp7ImVsaWdpYmxlIjpmYWxzZSwidmF1bHRhYmxlIjp0cnVlfX0sImd1ZXN0RW5hYmxlZCI6ZmFsc2V9LCJ2ZW5tbyI6eyJlbGlnaWJsZSI6ZmFsc2V9LCJpdGF1Ijp7ImVsaWdpYmxlIjpmYWxzZX0sImNyZWRpdCI6eyJlbGlnaWJsZSI6ZmFsc2V9LCJhcHBsZXBheSI6eyJlbGlnaWJsZSI6ZmFsc2V9LCJzZXBhIjp7ImVsaWdpYmxlIjpmYWxzZX0sImlkZWFsIjp7ImVsaWdpYmxlIjpmYWxzZX0sImJhbmNvbnRhY3QiOnsiZWxpZ2libGUiOmZhbHNlfSwiZ2lyb3BheSI6eyJlbGlnaWJsZSI6ZmFsc2V9LCJlcHMiOnsiZWxpZ2libGUiOmZhbHNlfSwic29mb3J0Ijp7ImVsaWdpYmxlIjpmYWxzZX0sIm15YmFuayI6eyJlbGlnaWJsZSI6ZmFsc2V9LCJwMjQiOnsiZWxpZ2libGUiOmZhbHNlfSwiemltcGxlciI6eyJlbGlnaWJsZSI6ZmFsc2V9LCJ3ZWNoYXRwYXkiOnsiZWxpZ2libGUiOmZhbHNlfSwicGF5dSI6eyJlbGlnaWJsZSI6ZmFsc2V9LCJibGlrIjp7ImVsaWdpYmxlIjpmYWxzZX0sInRydXN0bHkiOnsiZWxpZ2libGUiOmZhbHNlfSwib3h4byI6eyJlbGlnaWJsZSI6ZmFsc2V9LCJtYXhpbWEiOnsiZWxpZ2libGUiOmZhbHNlfSwiYm9sZXRvIjp7ImVsaWdpYmxlIjpmYWxzZX0sIm1lcmNhZG9wYWdvIjp7ImVsaWdpYmxlIjpmYWxzZX19&platform=mobile&experiment.enableVenmo=false&experiment.disablePaylater=false&flow=purchase&currency=EUR&intent=authorize&commit=true&vault=false&renderedButtons.0=paypal&renderedButtons.1=card&debug=false&applePaySupport=false&supportsPopups=false&supportedNativeBrowser=false&allowBillingPayments=true'


  function onMessage(e) {
    let data = e.nativeEvent.data
    console.log(data)
    let payment = JSON.parse(data)
    if (payment.status === 'COMPLETED') {
      alert(Translate(languageRedux).PAYMENT_SUCCESS)
    } else {
      alert(Translate(languageRedux).PAYMENT_UNSUCCESSFUL)
    }
  }

  const PolicyHTML = require('./paypal_view.html')

  var source = {
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <script type="text/javascript" src="GetUrlPaypal.js"></script>
        <script src="${urlPaypal?.url}"></script>
        <script>paypal.Buttons().render('body');</script>
    </body>
    </html>`
  }

  const scripts = `
  <script src="https://www.paypal.com/sdk/js?intent=authorize&client-id=Ad0K6H9O4nejuhDwmLz3JFzt4njdYGfLoencrgW_nfjZ1Q0TNL-i3mfdUO-R3q42YcG7nVDUYGz_gd5Y&currency=USD&locale=en_VN"></script>
  `

  // let scriptUrl = 'https://www.paypal.com/sdk/js?client-id=Ad0K6H9O4nejuhDwmLz3JFzt4njdYGfLoencrgW_nfjZ1Q0TNL-i3mfdUO-R3q42YcG7nVDUYGz_gd5Y&intent=authorize&currency=USD'
  // const node = document.createElement('script')
  // node.src = scriptUrl
  // node.type = 'text/javascript'

  const patchPostMessageFunction = function () {
    var originalPostMessage = window.postMessage

    var patchedPostMessage = function (message, targetOrigin, transfer) {
      originalPostMessage(message, targetOrigin, transfer)
    }

    patchedPostMessage.toString = function () {
      return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
    }

    window.postMessage = patchedPostMessage
  }

  var patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();'

  function handleNavigation(event) {
    console.log(event)
  }

  function handleMessage(event) {
    let data = event?.nativeEvent?.data
    console.log('Event log : ', JSON.stringify(event?.nativeEvent))
    try {
      data = JSON.parse(data)
      if (data.status === 'success') {
        alert(data.reference)
      } else {
        alert('Failed, ' + data.message)
      }
    } catch (error) {}
  }

  const generateOnMessageFunction = data =>
    `(function() {
    window.WebViewBridge.onMessage(${JSON.stringify(data)});
  })()`

  function passValues() {
    let data = {
      url: urlPaypal
    }
    // alert('Alert cua payment js' + JSON.stringify(data))
    webviewRef?.current?.postMessage(JSON.stringify(data))
    webviewRef?.current?.injectJavaScript(generateOnMessageFunction(JSON.stringify(data)))
  }

  const _onPressProceedPayment = () => {
    const params = {
      'initiativeId': permissionRedux?.iniziativa?.initiativeId,
      'doctorId': passingdata?.idmedico,
      'surveyId': isSurvey,
      'prescriptionId': -1,
      'creditCardTokenKey': '',
      'paymentServiceId': 1,
      'paymentId': itemRetrievePayment?.paymentId
    }
    setLoading(true)
    dispatch(apiPostCreateOrderMPAY(params)).then(res => {
      setLoading(false)
      console.log('res apiPostCreateOrderMPAY: ', res?.payload)
      setItemProceedPayment(res?.payload)
    }).catch(() => {
      setLoading(false)
    })
  }

  const onPressCloseMPAY = () => {
    if (itemProceedPayment?.orderId) {
      setLoading(true)
      dispatch(apiGetCheckOrderStatusMPAY(itemProceedPayment?.orderId)).then(res => {
        setItemRetrievePayment()
        setItemProceedPayment()
        setTimeout(() => {
          setLoading(false)
        }, 500)

        if (res?.payload?.esito === '0') {
          setTimeout(() => {
            DeviceEventEmitter.emit(Routes.PAYMENT_SCREEN, { index: 3 })
          }, 100)
          NavigationService.popToRoot()
        } else {
          setShowNoti(true)
          setDataNoti({
            status: STATUS_NOTIFY.ERROR,
            content: res?.payload?.motivo || ''
          })
        }
      }).catch(err => {
        console.log('Err apiGetCheckOrderStatusMPAY: ', err)
        setItemRetrievePayment()
        setItemProceedPayment()
      })
    }
  }

  const _onPressDownloadQRCode = async () => {
    const { dirs } = RNFetchBlob.fs
    const dirToSave = Platform.OS === 'ios' ? dirs.CacheDir : dirs.DownloadDir
    const path = `${dirToSave}/qrcodeMPAY.png`
    setLoading(true)
    try {
      if (Platform.OS === 'ios') {
        await RNFetchBlob.config({
          fileCache: true,
          useDownloadManager: true,
          appendExt: 'jpg',
          path: path,
          addAndroidDownloads: {
            useDownloadManager: true, // true will use native manager and be shown on notification bar.
            notification: true,
            path: `${dirToSave}/me_${Math.floor((new Date()).getTime() + (new Date()).getSeconds() / 2)}.jpg`,
            mime: 'image/jpeg',
            description: 'Downloading'
          }
        }).fetch('GET', `data:'image/jpeg';base64,${itemProceedPayment?.qrImage}`)
          .then(async (resp) => {
            if (Platform.OS === 'android') {
              RNFetchBlob.android.actionViewIntent(resp.path(), 'image/jpeg')
            }
            console.log('new resp : ', resp)
            console.log(('path: ', resp.path()))
            try {
              await CameraRoll.save(resp.path(), {
                type: 'photo'
              })
            } catch (error) {
              console.log('Error save image')
            }
          })
      } else {
        // try {
        //   await CameraRoll.save(`data:'image/jpeg';base64,${itemProceedPayment?.qrImage}`, {
        //     type: 'photo'
        //   })
        // } catch (error) {
        //   console.log('Error save image')
        // }
        const imgURL = { uri: `data:'image/jpeg';base64,${itemProceedPayment?.qrImage}` }
        console.log('Android download: ')
        RNFetchBlob.fs.writeFile(path, itemProceedPayment?.qrImage, 'base64').then(res => {
          console.log('Android base 64: ', res)
          console.log('Android base 64: ', path)
          console.log(('path 64: ', res.path()))
        }).catch(err => {
          console.log('Error read file: ', err)
          console.log('read file: ', `file://${path}`)
          Linking.openURL(`file://${path}`)
        })


        try {
          await CameraRoll.save(imgURL, {
            type: 'photo'
          })
        } catch (error) {

        }

      }
      // const data = await RNFetchBlob.fs.writeFile(path, itemProceedPayment?.qrImage, 'base64')
      // console.log(('data: ', data))

      setTimeout(() => {
        if (Platform.OS === 'ios') {
          Linking.openURL('photos-redirect://')
        } else if (Platform.OS === 'android') {
          console.log('read file 1: ', `file://${path}`)
          // Files.getPath().then((pth) => {
          //   console.log('path file get', pth)
          // }).catch((err) => {
          //   console.log(err)
          // })

          DocumentPicker.pick({
            type: [DocumentPicker.types.allFiles]
          })

          Linking.openURL(`file://${path}`)
          // if (Linking.canOpenURL('content://com.android.providers.downloads.documents/document')) {
          //   Linking.openURL('content://com.android.providers.downloads.documents/document')
          // } else {
          //   console.log('Can t open: content://com.android.providers.downloads.documents/document')
          // }
        }

        setLoading(false)
      }, 1000)
    } catch (error) {
      console.log(error.message)
      setLoading(false)
    }
  }

  const _onPressConfirm = () => {
    onPressCloseMPAY()
  }

  const renderMPAYView = () => {
    return (
      <View style={styles.paypalView}>
        <Text style={customTxt(Fonts.Medium, 14, color040404).txt}>You'll be preauthorized for an amount of {passingdata?.currency} {passingdata?.valuePricing}</Text>
        <Text style={[
          customTxt(Fonts.Medium, 14, color040404).txt,
          styles.txtContentVideo
        ]}>You'll be changed at the end of the videocall</Text>
        {
          (lsRetrievePayment || []).length > 0 && (
            <View
              style={styles.flatlistMPAYView}
            >
              <FlatList
                data={lsRetrievePayment || []}
                key={'#1renderMPAYView'}
                styl={styles.flatlistMPAY}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity style={styles.itemMPAYView} onPress={() => {
                      setItemRetrievePayment(item)
                      setItemProceedPayment()
                    }}>
                      <View style={styles.imgCheck}>
                        {
                          itemRetrievePayment === item && (<Image source={imgHealth.ic_check} style={styles.imgCheck} />)
                        }
                      </View>
                      <Text>{item?.paymentName}</Text>
                    </TouchableOpacity>
                  )
                }}
              />
            </View>
          )
        }
        {
          (lsRetrievePayment || []).length > 0 && itemRetrievePayment?.paymentId && !itemProceedPayment?.qrImage && (
            <CustomNextBT
              textButton={(Translate(languageRedux).PROCEED_PAYMENT || '').toUpperCase()}
              isActive={true}
              disabled={false}
              onPress={_onPressProceedPayment}
              stylesText={styles.proceedPaymentText}
            />
          )
        }
        {
          itemProceedPayment?.qrImage && (
            <View style={styles.promptPayView}>
              <CustomNextBT
                textButton={(Translate(languageRedux).download || '').toUpperCase()}
                isActive={true}
                disabled={false}
                onPress={_onPressDownloadQRCode}
              />
              <CustomNextBT
                textButton={(Translate(languageRedux).CONFIRM_PAYMENT || '').toUpperCase()}
                isActive={true}
                disabled={false}
                onPress={_onPressConfirm}
              />
            </View>
          )
        }
        {
          itemProceedPayment?.endpoint && (
            <View style={styles.fullOutsideView}>
              <WebView
                ref={webviewRef}
                style={styles.webMPAYView}
                source={{ uri: itemProceedPayment?.endpoint }}
              />
              <TouchableOpacity style={styles.closeView} onPress={onPressCloseMPAY}>
                <Image source={imgHome.ic_close} style={styles.imgClose} />
              </TouchableOpacity>
            </View>
          )
        }
      </View>
    )
  }
  //PROCEED_PAYMENT
  const renderPaypalView = () => {
    console.log(`SSSS ${uri}${v1}${v2}`)
    webviewRef?.current?.injectJavaScript('window.ReactNativeWebView.postMessage(document.body.innerHTML)',)
    return (
      <View style={styles.paypalView}>
        <Text style={customTxt(Fonts.Medium, 14, color040404).txt}>You'll be preauthorized for an amount of {passingdata?.currency} {passingdata?.valuePricing}</Text>
        <Text style={[
          customTxt(Fonts.Medium, 14, color040404).txt,
          styles.txtContentVideo
        ]}>You'll be changed at the end of the videocall</Text>
        {
          Platform.OS === 'ios' ? (
            <WebView
              ref={webviewRef}
              style={styles.webview}
              source={PolicyHTML}
              originWhitelist={['*']}
              mixedContentMode={'always'}
              useWebKit={Platform.OS === 'ios'}
              onError={() => { alert('Error Occured') }}
              onLoadStart={() => passValues()}
              onLoadEnd={() => passValues()}
              thirdPartyCookiesEnabled={true}
              scrollEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              injectedJavaScript={patchPostMessageJsCode}
              allowUniversalAccessFromFileURLs={true}
              onMessage={(event) => handleMessage(event)}
              onNavigationStateChange={(event) => handleNavigation(event)}
              javaScriptEnabled={true}
            />
          )
            : (
              <WebView
                ref={webviewRef}
                originWhitelist={['*']}
                style={styles.webview}
                source={{uri: 'file:///android_asset/paypal_view.html'}}
                mixedContentMode={'always'}
                useWebKit={Platform.OS === 'ios'}
                onError={() => { alert('Error Occured') }}
                onLoadStart={() => passValues()}
                onLoadEnd={() => passValues()}
                thirdPartyCookiesEnabled={true}
                scrollEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                allowUniversalAccessFromFileURLs={true}
                onMessage={(event) => handleMessage(event)}
                onNavigationStateChange={(event) => handleNavigation(event)}
                javaScriptEnabled={true}
              />
            )
        }

        {/* <TouchableOpacity
          onPress={() => {
            setTouchPaypal(true)
            setTouchCredit(false)
          }}
          style={[
            styles.btPaymanet,
            styles.bgColor1
          ]}
        >
          <Image source={imgPaypal.ic_paypal} style={styles.imgPaypal} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.btPaymanet,
            styles.btColor2
          ]}
          onPress={() => {
            callAPIOrder()
            setTouchPaypal(false)
            setTouchCredit(true)
          }}>
          <Text style={customTxt(Fonts.Bold, 20, colorFFFFFF).txt}>Debit or Credit Card</Text>
        </TouchableOpacity> */}
        {/* <WebView
          style={styles.webview}
          source={{ uri: `${uri}${v1}${v2}` }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          overScrollMode="never"
          scalesPageToFit={true}
          contentMode={'mobile'}
          setBuiltInZoomControls={false}
          setDisplayZoomControls={false}
          nestedScrollEnabled={false}
          onMessage={onMessage}
          onNavigationStateChange={(data) => {
            console.log('data:', data)
          }}
        /> */}
      </View>
    )
  }

  const renderPaypal = () => {
    return (
      <WebView
        style={styles.webview}
        // source={{ uri: 'https://www.paypal.com/checkoutnow?sessionID=uid_1a2638dd78_mdi6nda6mdy&buttonSessionID=uid_bedf0b758e_mdi6nda6mdc&stickinessID=uid_91d23672f1_mdk6nta6nda&fundingSource=paypal&buyerCountry=VN&locale.x=en_US&commit=true&clientID=Aa95SD94i-6pffHhCg-wVutJPBJuRYFvlPFnGaE0qU8dlIbZW2fuNk0S8RP6TSnTDYrS6rXP-C4c-xPA&env=production&sdkMeta=eyJ1cmwiOiJodHRwczovL3d3dy5wYXlwYWwuY29tL3Nkay9qcz9pbnRlbnQ9YXV0aG9yaXplJmNsaWVudC1pZD1BYTk1U0Q5NGktNnBmZkhoQ2ctd1Z1dEpQQkp1UllGdmxQRm5HYUUwcVU4ZGxJYlpXMmZ1TmswUzhSUDZUU25URFlyUzZyWFAtQzRjLXhQQSZjdXJyZW5jeT1FVVImbG9jYWxlPWVuX1VTIiwiYXR0cnMiOnsiZGF0YS11aWQiOiJ1aWRfd2VjYW56ZWtuZnljdnZzaXN1cmZkdnhuZWdodGxsIn19&xcomponent=1&version=5.0.271&token=1L714753241996030' }}
        source={PolicyHTML}
        onMessage={onMessage}
        onNavigationStateChange={(data) => {
          console.log('data:', data)
        }}
      />
    )
  }

  const renderCredit = () => {
    return (
      <WebView
        style={styles.webview}
        // source={{ uri: 'https://www.paypal.com/smart/card-fields?sessionID=uid_855de9f3fb_mtm6mze6ntg&buttonSessionID=uid_ff6b962ba9_mtm6nde6mda&locale.x=en_VN&commit=true&env=production&sdkMeta=eyJ1cmwiOiJodHRwczovL3d3dy5wYXlwYWwuY29tL3Nkay9qcz9pbnRlbnQ9YXV0aG9yaXplJmNsaWVudC1pZD1BYTk1U0Q5NGktNnBmZkhoQ2ctd1Z1dEpQQkp1UllGdmxQRm5HYUUwcVU4ZGxJYlpXMmZ1TmswUzhSUDZUU25URFlyUzZyWFAtQzRjLXhQQSZjdXJyZW5jeT1FVVImbG9jYWxlPWVuX1ZOIiwiYXR0cnMiOnsiZGF0YS11aWQiOiJ1aWRfd2VjYW56ZWtuZnljZ2FhaXN1cmZkdnhuZWdodGxsIn19&disable-card=&token=6MN91108S5232332X' }}
        source={{ uri: 'https://www.paypalobjects.com/css' }}
        onMessage={onMessage}
        onNavigationStateChange={(data) => {
          console.log('data:', data)
        }}
      />
    )
  }

  const renderTerm = () => {
    return (
      <ScrollView
        ref={scrollRef}
        onMomentumScrollEnd={({ nativeEvent }) => {
          setActiveBt(true)
        }}
        style={styles.htmlStyle}>
        <HTML source={{ html: legalDisclaimer?.text }} />
      </ScrollView>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).payment}
        iconLeft={icHeader.ic_left}
        onPressLeft={() => {
          setTimeout(() => {
            DeviceEventEmitter.emit(Routes.PAYMENT_SCREEN)
          }, 100)
          NavigationService.popToRoot()
        }}
        textRight={urlPaypal ? null : (permissionRedux?.iniziativa?.paymentPlatform === 'MPAY' ? null : Translate(languageRedux).AGREE_BTN)}
        textRightColor={!isActiveBt ? colorF0F0F0 : color3777EE}
        onPressRight={_onPressSave}
      />
      {
        permissionRedux?.iniziativa?.paymentPlatform !== 'MPAY' && isTouchPaypal ?
          (renderPaypal())
          :
          null
      }
      {
        permissionRedux?.iniziativa?.paymentPlatform !== 'MPAY' && isTouchCredit ?
          (renderCredit())
          : null
      }
      {
        permissionRedux?.iniziativa?.paymentPlatform !== 'MPAY' && !isTouchPaypal && !isTouchCredit && (
          urlPaypal ? renderPaypalView() : (renderTerm())
        )
      }
      {
        permissionRedux?.iniziativa?.paymentPlatform === 'MPAY' && (
          renderMPAYView()
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
    backgroundColor: colorF8F8F8
  },
  paypalView: {
    flex: 1,
    alignItems: 'center',
    marginRight: 20,
    marginLeft: 20
  },
  styleRightView: {
    backgroundColor: colorE53E3E
  },
  htmlStyle: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 30
  },
  txtContentVideo: {
    marginTop: 20
  },
  webview: {
    alignItems: 'center',
    marginTop: 10,
    width: Dimensions.get('window').width,
    height: 400
  },
  webMPAYView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    marginLeft: -20
  },
  btPaymanet: {
    width: '100%',
    height: 46,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4
  },
  bgColor1: {
    backgroundColor: '#ffc439'
  },
  btColor2: {
    backgroundColor: '#2C2E2F'
  },
  imgPaypal: {
    width: 100,
    height: 40,
    resizeMode: 'contain'
  },
  flatlistMPAYView: {
    width: Dimensions.get('window').width - 80,
    marginTop: 30,
    padding: 20,
    borderRadius: 8,
    borderColor: colorDDDEE1,
    borderWidth: 1
  },
  flatlistMPAY: {
    flex: 1
  },
  itemMPAYView: {
    flexDirection: 'row',
    marginBottom: 25,
    alignItems: 'center'
  },
  imgCheck: {
    width: 12,
    height: 12,
    marginRight: 10
  },
  fullOutsideView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 0,
    left: 0
  },
  closeView: {
    width: 40,
    height: 40,
    position: 'absolute',
    top: 0,
    right: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imgClose: {
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },
  promptPayView: {
    alignItems: 'center'
  },
  proceedPaymentText: {
    marginLeft: 20,
    marginRight: 20,
    fontSize: 16
  }
})
