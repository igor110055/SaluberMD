import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, Image, DeviceEventEmitter} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios'
import * as APIs from '../../../api/APIs'
import _ from 'lodash'

import { color040404, color3777EE, color5C5D5E, colorC1C3C5, colorF0F0F0, colorFFFFFF } from 'constants/colors'
import Translate from '../../../translate'
import { customTxt } from 'constants/css'
import { apiGetUserInfo } from 'api/Auth'
import imgGenetic from '../../../../assets/images/genetic_test'
import icDoc from '../../../../assets/images/document'
import NavigationService from 'navigation'
import Fonts from 'constants/Fonts'
import { STATUS_NOTIFY } from 'components/NotificationView'

import CustomTextInput from '../../healthProfile/components/CustomTextInput'
import SearchListWithName from 'components/SearchListWithName'
import Button from 'components/Button'
import Routes from 'navigation/Routes'

export default function AddRequestTest({
  setShowNoti, setDataNoti, setLoading
}) {
  const languageRedux = useSelector(state => state.common.language)
  const lsCountryRedux = useSelector(state => state.common.country)
  const [address, setAddress] = useState()
  const [zipCode, setZipCode] = useState()
  const [city, setCity] = useState()
  const [country, setCountry] = useState()
  const [countryValue, setCountryValue] = useState()
  const [phone, setPhone] = useState()
  const [note, setNote] = useState()
  const dispatch = useDispatch()
  const [userInfo, setUserInfo] = useState([])
  const [isShowCountry, setShowCountry] = useState(false)
  const token = useSelector(state => state.user.token)

  useEffect(() => {
    callAPIGetUserinfo()
  }, [])

  useEffect(() => {
    convertCountry()
    setAddress(userInfo?.address || '')
    setZipCode(userInfo?.zipCode || '')
    setCity(userInfo?.city || '')
    setPhone(userInfo?.phone1 || '')
  }, [userInfo])

  const convertCountry = () => {
    var i = lsCountryRedux.filter((val) => val.value === userInfo?.country)
    if ((i || []).length > 0) {
        setCountry(i[0].text)
    }
    if ((i || []).length < 0) {
        setCountry('')
    }
  }

  const callAPIGetUserinfo = () => {
    dispatch(apiGetUserInfo()).then(res => {
        console.log('res:', res.payload)
        const getuserInfo = res?.payload?.user
        if (getuserInfo) {
          setUserInfo(getuserInfo)
        }
        setLoading(false)
    }).catch(err => {
        console.log('err: ', err)
        setLoading(false)
    })
  }

  const renderTextInput = () => {
    return (
      <View style={styles.ctnTextInput}>
        <CustomTextInput
          title={Translate(languageRedux).address2}
          value={address}
          onChangeTxt={txt => setAddress(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt]}
          validate={address ? false : true}
        />
        <CustomTextInput
          title={Translate(languageRedux).zipCode}
          value={zipCode}
          onChangeTxt={txt => setZipCode(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt]}
          validate={zipCode ? false : true}
        />
        <CustomTextInput
          title={Translate(languageRedux).city}
          value={city}
          onChangeTxt={txt => setCity(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt]}
          validate={city ? false : true}
        />
        <CustomTextInput
          title={Translate(languageRedux).phone1}
          value={phone}
          onChangeTxt={txt => setPhone(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt]}
          validate={phone ? false : true}
        />
        <CustomTextInput
          title={Translate(languageRedux).country1}
          value={country}
          onChangeTxt={txt => setCountry(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt]}
          validate={country ? false : true}
          iconRight={icDoc?.ic_dropdown}
          onPress={() => {
            setShowCountry(true)
          }}
        />
        <CustomTextInput
          title={Translate(languageRedux).note}
          value={note}
          onChangeTxt={txt => setNote(txt)}
          textinputStyle={[
            customTxt(Fonts.Regular, 16, color040404).txt,
            styles.heightNote
          ]}
          multiline={true}
        />
      </View>
    )
  }

  const renderContent = () => {
    return (
      <View style={styles.ctnContent}>
        {/* <Image source={imgGenetic.step1} style={styles.imgCover} /> */}
        <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt, styles.marginT20]}>
          {Translate(languageRedux).geneticTestHeader1}
        </Text>
        <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginT4]}>
          {Translate(languageRedux).geneticTestHeader2}
        </Text>
        <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt, styles.marginT24]}>
          {Translate(languageRedux).geneticTestHeader3}
        </Text>
        <View style={styles.ctnStep}>
          <Image source={imgGenetic.step1} style={styles.img1} />
          <View style={styles.flex1}>
            <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt]}>
             {Translate(languageRedux).geneticTestStep1}
            </Text>
            <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginT4]}>
             {Translate(languageRedux).geneticTestStep1Subtitle}
            </Text>
          </View>
        </View>
        <View style={styles.ctnStep}>
          <Image source={imgGenetic.step2} style={styles.img1} />
          <View style={styles.flex1}>
            <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt]}>
             {Translate(languageRedux).geneticTestStep2}
            </Text>
            <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginT4]}>
             {Translate(languageRedux).geneticTestStep2Subtitle}
            </Text>
          </View>
        </View>
        <View style={styles.ctnStep}>
          <Image source={imgGenetic.step3} style={styles.img1} />
          <View style={styles.flex1}>
            <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt]}>
             {Translate(languageRedux).geneticTestStep3}
            </Text>
            <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginT4]}>
             {Translate(languageRedux).geneticTestStep3Subtitle}
            </Text>
          </View>
        </View>
        <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt, styles.marginT24]}>
          {Translate(languageRedux).geneticTestProduct}
        </Text>
        <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginT8]}>
          {Translate(languageRedux).geneticTestSection1}
        </Text>
        <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginT8]}>
          {Translate(languageRedux).geneticTestSection2}
        </Text>
        <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginT8]}>
          {Translate(languageRedux).geneticTestSection3}
        </Text>
        <Text style={[customTxt(Fonts.Bold, 14, color040404).txt, styles.marginT20]}>
          {Translate(languageRedux).geneticTestSection4}
        </Text>
      </View>
    )
  }

  const checkDisable = () => {
    if (address && zipCode && city && phone && country) {
      return true
    } else {
      return false
    }
  }

  const renderButton = () => {
    return (
      <View style={styles.ctnTextInput}>
        <Button
          backgroundColor={checkDisable() ? color3777EE : colorF0F0F0}
          text={Translate(languageRedux).geneticTestRequestBtn}
          textColor={checkDisable() ? colorFFFFFF : colorC1C3C5}
          onPress={_onPressSendRequest}
        />
      </View>
    )
  }

  const _onPressSendRequest = () => {
    const body = {
      address: address,
      phone: phone,
      cap: zipCode,
      city: city,
      country: countryValue,
      note: note
    }
    console.log('BODY: ', body)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/gt/geneticTest`,
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
            content: Translate(languageRedux).record_inserito
          })
          DeviceEventEmitter.emit('genetictest')
          setTimeout(() => {
            DeviceEventEmitter.emit(Routes.GENETIC_TEST_SCREEN, { history: true })
          }, 1000)
          NavigationService.navigate(Routes.GENETIC_TEST_SCREEN)
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
      })
  }

  const renderBody = () => {
    return (
      <View style={styles.paddingB48}>
        {renderContent()}
        {renderTextInput()}
        {renderButton()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
          {renderBody()}
      </KeyboardAwareScrollView>
      {isShowCountry && (
        <SearchListWithName
          listData={lsCountryRedux}
          title={Translate(languageRedux).CHOOSE_COUNTRY}
          itemSelected={country}
          onItemClick={val => {
            setCountry(val?.text)
            setCountryValue(val?.value)
            setShowCountry(false)
          }}
          onPressRight={() => {
            setShowCountry(false)
          }}
          isText={true}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  paddingB48: {
    paddingBottom: 48
  },
  ctnContent: {
    marginHorizontal: 20
  },
  imgCover: {
    width: '100%',
    height: 220,
    borderRadius: 12
  },
  marginT16: {
    marginTop: 16
  },
  marginT4: {
    marginTop: 4
  },
  marginT8: {
    marginTop: 8
  },
  marginT20: {
    marginTop: 20
  },
  marginT24: {
    marginTop: 24
  },
  img1: {
    height: 72,
    width: 72,
    borderRadius: 36,
    marginRight: 16
  },
  ctnStep: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16
  },
  flex1: {
    flex: 1
  },
  heightNote: {
    height: 72
  },
  ctnTextInput: {
    marginHorizontal: 20,
    marginTop: 20
  }
})
