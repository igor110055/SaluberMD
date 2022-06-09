import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import RNPrint from 'react-native-print'
import Share from 'react-native-share'
import _ from 'lodash'

import { colorFFFFFF, colorA7A8A9, color040404, colorF0F0F0, color3777EE } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from '../../../../translate'
import { apiGetUserInfo } from 'api/Auth'
import { saveUserinfo } from 'actions/user'
import NavigationService from 'navigation'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'

import icHeader from '../../../../../assets/images/header'
import icHealthProfile from '../../../../../assets/images/health_profile'

import Header from '../../../../components/Header'
import FunctionButton from './FunctionButton'
import CustomTextInput from '../../../healthProfile/components/CustomTextInput'
import SearchListWithName from '../../../../components/SearchListWithName'
import LoadingView from '../../../../components/LoadingView'


export default function Address() {

    const dispatch = useDispatch()
    const userinfo = useSelector(state => state.user.userinfo)
    const languageRedux = useSelector(state => state.common.language)
    const token = useSelector(state => state.user.token)
    const lsCountryRedux = useSelector(state => state.common.country)
    const [isShow, setShow] = useState(false)
    const [edit, setEdit] = useState(false)
    const [isShowCountry, setShowCountry] = useState(false)
    const [isShowState, setShowState] = useState(false)
    const [isLoad, setLoading] = useState(false)
    const [address, setAddress] = useState(userinfo?.address || '')
    const [city, setCity] = useState(userinfo?.city || '')
    const [country, setCountry] = useState(userinfo?.country || '')
    const [state, setState] = useState(userinfo?.state)
    const [address2, setAddress2] = useState(userinfo?.address2 || '')
    const [countryNow, setCountryNow] = useState([])
    const [dataNoti, setDataNoti] = useState()
    const [isShowNoti, setShowNoti] = useState(false)
    const [zipCode, setZipCode] = useState(userinfo?.zipCode || '')

    useEffect(() => {
        callAPIUserinfo()
        convertCountry()
    },[isLoad])

    const callAPIUserinfo = () => {
        dispatch(apiGetUserInfo()).then(res => {
          console.log('res: ', res?.payload)
          const getuserInfo = res?.payload?.user
          if (getuserInfo) {
            Promise.all([
              dispatch(saveUserinfo(getuserInfo))
            ])
          }
          setLoading(false)
        }).catch((err) => {
          console.log('err: ', err)
          setLoading(false)
        })
    }

    const renderEdit = () => {
      return (
        <View style={styles.ctnItem}>
        <CustomTextInput
          title={Translate(languageRedux).address}
          value={address || ''}
          onChangeTxt={(txt) => setAddress(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
        {(userinfo?.country === 'US' || country?.value === 'US') && <CustomTextInput
          title={Translate(languageRedux).address + ' 2'}
          value={address2 || ''}
          onChangeTxt={(txt) => setAddress2(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />}
        {((userinfo?.country || country?.value) !== 'US') && <CustomTextInput
          title={Translate(languageRedux).city}
          value={city || ''}
          onChangeTxt={(txt) => setCity(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />}
        {(userinfo?.country === 'US' || country?.value === 'US') && <CustomTextInput
          title={Translate(languageRedux).state}
          value={state?.label || convertState()}
          onChangeTxt={(txt) => setState(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icHealthProfile.ic_dropdown}
          onPress={() => {setShowState(true)}}
        />}
        <CustomTextInput
          title={Translate(languageRedux).zipCode}
          value={zipCode || ''}
          onChangeTxt={(txt) => setZipCode(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
        <CustomTextInput
          title={Translate(languageRedux).COUNTRY}
          value={country?.text || countryNow}
          onChangeTxt={(txt) => setCountry(txt)}
          validate={country ? false : true}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icHealthProfile.ic_dropdown}
          onPress={() => {setShowCountry(true)}}
        />
      </View>
      )
    }

    const RenderItem = ({category, content}) => {
      return (
        <View style={styles.ctnItem}>
          <Text style={customTxt(Fonts.SemiBold, 12, colorA7A8A9).txt}>
            {category}
          </Text>
          <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginT8]}>
            {content}
          </Text>
          <View style={styles.divider} />
        </View>
      )
    }

    const convertCountry = () => {
      var i = lsCountryRedux.filter((val) => val.value === userinfo?.country)
      if (i.length > 0) {
        setCountryNow(i[0].text)
      }
      if (i.length < 0) {
        setCountryNow('')
      }
    }

    const convertState = () => {
      var i = Translate(languageRedux).US_STATES.filter((val) => val.value === userinfo?.state)
      if (i.length > 0) {
        return  i[0].label
      }
      else {
        return ''
      }
    }

    const renderBody = () => {
      return (
        <View>
          <RenderItem
            category={Translate(languageRedux).address}
            content={userinfo?.address}
          />
          {userinfo?.country === 'US' && (
            <RenderItem
              category={Translate(languageRedux).address + ' 2'}
              content={userinfo?.address2}
            />
          )}
          {userinfo?.country !== 'US' && (
            <RenderItem
              category={Translate(languageRedux).city}
              content={userinfo?.city}
            />
          )}
          {userinfo?.country === 'US' && (
            <RenderItem
              category={Translate(languageRedux).state}
              content={convertState()}
            />
          )}
          <RenderItem
            category={Translate(languageRedux).zipCode}
            content={userinfo?.zipCode}
          />
          {countryNow && (
            <RenderItem
              category={Translate(languageRedux).COUNTRY}
              content={countryNow}
            />
          )}
        </View>
      )
    }

    const updateAddress = () => {
        const body = {
          nome: userinfo?.nome,
          cognome: userinfo?.cognome,
          language_id: userinfo?.language_id,
          gender: userinfo?.gender,
          birthdate: userinfo?.birthdate,
          country: country?.value || userinfo?.country,
          city: city || userinfo?.city,
          phone1: userinfo?.phone1,
          address: address,
          medicphone: userinfo?.medicphone,
          medicemail: userinfo?.medicemail,
          medicname1: userinfo?.medicname1,
          height: userinfo?.height,
          weight: userinfo?.weight,
          email: userinfo?.email,
          state: state?.value || userinfo?.state,
          smoker: userinfo?.smoker,
          cf: userinfo?.cf === null ? '' : userinfo?.cf,
          prefix: userinfo?.prefix,
          suffix: userinfo?.suffix,
          middleName: userinfo?.middleName,
          address2: address2,
          mobile: userinfo?.mobile,
          has2fa: 0,
          placeOfBirth: userinfo?.placeOfBirth,
          weightUnit: userinfo?.weightUnit,
          heightUnit: userinfo?.heightUnit,
          emergencyName1: userinfo?.emergencyName1,
          emergencyPhone1: userinfo?.emergencyPhone1,
          emergencyRelationship1: userinfo?.emergencyRelationship1,
          emergencyName2: userinfo?.emergencyName2,
          emergencyPhone2: userinfo?.emergencyPhone2,
          emergencyRelationship2: userinfo?.emergencyRelationship2,
          zipCode: zipCode
        }
        const bodyUS = {
          nome: userinfo?.nome,
          cognome: userinfo?.cognome,
          language_id: userinfo?.language_id,
          gender: userinfo?.gender,
          birthdate: userinfo?.birthdate,
          country: country?.value || userinfo?.country,
          city: userinfo?.city,
          phonecode: userinfo?.phonecode,
          phone1: userinfo?.phone1,
          address: address,
          medicphone: userinfo?.medicphone,
          medicemail: userinfo?.medicemail,
          medicname1: userinfo?.medicname1,
          height: userinfo?.height,
          weight: userinfo?.weight,
          email: userinfo?.email,
          state: state?.value || userinfo?.state,
          smoker: userinfo?.smoker,
          cf: userinfo?.cf === null ? '' : userinfo?.cf,
          prefix: userinfo?.prefix,
          suffix: userinfo?.suffix,
          middleName: userinfo?.middleName,
          address2: address2,
          mobile: userinfo?.mobile,
          has2fa: 0,
          placeOfBirth: userinfo?.placeOfBirth,
          weightUnit: userinfo?.weightUnit,
          heightUnit: userinfo?.heightUnit,
          emergencyName1: userinfo?.emergencyName1,
          emergencyPhone1: userinfo?.emergencyPhone1,
          emergencyRelationship1: userinfo?.emergencyRelationship1,
          emergencyName2: userinfo?.emergencyName2,
          emergencyPhone2: userinfo?.emergencyPhone2,
          emergencyRelationship2: userinfo?.emergencyRelationship2,
          zipCode: zipCode
        }
        console.log('body: ', country?.value === 'US' ? bodyUS : body)
        axios({
          method: 'post',
          url: `${APIs.hostAPI}backoffice/webdoctor/updatePatientCustomProfile`,
          headers: {
            'x-auth-token': token
          },
          data: country?.value === 'US' ? bodyUS : body
        })
          .then(response => {
            setShowNoti(true)
            console.log('data: ', response.data)
            if (_.includes([0, '0'], response?.data?.esito)) {
              setDataNoti({
                status: STATUS_NOTIFY.SUCCESS,
                content: Translate(languageRedux).info_salvate
              })
            }
            if (_.includes([1, '1'], response?.data?.esito)) {
              setDataNoti({
                status: STATUS_NOTIFY.ERROR,
                content: response?.data?.motivo
              })
            }
          })
          .catch(error => {
            console.error('There was an error!', error)
          })
        setLoading(true)
      }

    const _onPressDelete = () => {
        const body = {
          nome: userinfo?.nome,
          cognome: userinfo?.cognome,
          language_id: userinfo?.language_id,
          gender: userinfo?.gender,
          birthdate: userinfo?.birthdate,
          country: country?.value || userinfo?.country,
          city: '',
          phone1: userinfo?.phone1,
          address: null,
          medicphone: userinfo?.medicphone,
          medicemail: userinfo?.medicemail,
          medicname1: userinfo?.medicname1,
          height: userinfo?.height,
          weight: userinfo?.weight,
          email: userinfo?.email,
          state: null,
          smoker: userinfo?.smoker,
          cf: userinfo?.cf === null ? '' : userinfo?.cf,
          prefix: userinfo?.prefix,
          suffix: userinfo?.suffix,
          middleName: userinfo?.middleName,
          address2: null,
          mobile: userinfo?.mobile,
          has2fa: 0,
          placeOfBirth: userinfo?.placeOfBirth,
          weightUnit: userinfo?.weightUnit,
          heightUnit: userinfo?.heightUnit,
          emergencyName1: userinfo?.emergencyName1,
          emergencyPhone1: userinfo?.emergencyPhone1,
          emergencyRelationship1: userinfo?.emergencyRelationship1,
          emergencyName2: userinfo?.emergencyName2,
          emergencyPhone2: userinfo?.emergencyPhone2,
          emergencyRelationship2: userinfo?.emergencyRelationship2,
          zipCode: null
        }
        const bodyUS = {
          nome: userinfo?.nome,
          cognome: userinfo?.cognome,
          language_id: userinfo?.language_id,
          gender: userinfo?.gender,
          birthdate: userinfo?.birthdate,
          country: null,
          city: userinfo?.city,
          phonecode: userinfo?.phonecode,
          phone1: userinfo?.phone1,
          address: null,
          medicphone: userinfo?.medicphone,
          medicemail: userinfo?.medicemail,
          medicname1: userinfo?.medicname1,
          height: userinfo?.height,
          weight: userinfo?.weight,
          email: userinfo?.email,
          state: null,
          smoker: userinfo?.smoker,
          cf: userinfo?.cf,
          prefix: userinfo?.prefix,
          suffix: userinfo?.suffix,
          middleName: userinfo?.middleName,
          address2: null,
          mobile: userinfo?.mobile,
          has2fa: 0,
          placeOfBirth: userinfo?.placeOfBirth,
          weightUnit: userinfo?.weightUnit,
          heightUnit: userinfo?.heightUnit,
          emergencyName1: userinfo?.emergencyName1,
          emergencyPhone1: userinfo?.emergencyPhone1,
          emergencyRelationship1: userinfo?.emergencyRelationship1,
          emergencyName2: userinfo?.emergencyName2,
          emergencyPhone2: userinfo?.emergencyPhone2,
          emergencyRelationship2: userinfo?.emergencyRelationship2
        }
        console.log('body: ', body)
        axios({
          method: 'post',
          url: `${APIs.hostAPI}backoffice/webdoctor/updatePatientCustomProfile`,
          headers: {
            'x-auth-token': token
          },
          data: body
        })
          .then(response => {
            setShowNoti(true)
            console.log('data: ', response.data)
            if (_.includes([0, '0'], response?.data?.esito)) {
              setDataNoti({
                status: STATUS_NOTIFY.SUCCESS,
                content: Translate(languageRedux).utente_salvato
              })
            }
            if (_.includes([1, '1'], response?.data?.esito)) {
              setDataNoti({
                status: STATUS_NOTIFY.ERROR,
                content: response?.data?.motivo
              })
            }
          })
          .catch(error => {
            console.error('There was an error!', error)
          })
        setLoading(true)
        setAddress('')
        setCity('')
      }

      const _onPressPrinttoPDF = async () => {
        const results = await RNHTMLtoPDF.convert({
          html: `
          <h2>${Translate(languageRedux).address}</h2>
          <h1>${userinfo?.address}</h1>
          <hr class="solid">
          <h2>${Translate(languageRedux).city}</h2>
          <h1>${userinfo?.city}</h1>
          <hr class="solid">
          <h2>${Translate(languageRedux).COUNTRY}</h2>
          <h1>${countryNow}</h1>
          <hr class="solid">
          `,
          fileName: Translate(languageRedux).address,
          base64: true
        })
        await RNPrint.print({ filePath: results.filePath })
      }

      const _onPressShare = async () => {
        const results = await RNHTMLtoPDF.convert({
          html: `
          <h2>${Translate(languageRedux).address}</h2>
          <h1>${userinfo?.address}</h1>
          <hr class="solid">
          <h2>${Translate(languageRedux).city}</h2>
          <h1>${userinfo?.city}</h1>
          <hr class="solid">
          <h2>${Translate(languageRedux).COUNTRY}</h2>
          <h1>${countryNow}</h1>
          <hr class="solid">
          `,
          fileName: Translate(languageRedux).address,
          base64: true
        })
        let options = {
          url: `data:application/pdf;base64,${results.base64}`,
          fileName: Translate(languageRedux).address
        }
        Share.open(options)
          .then(res => {
            console.log(res)
          })
          .catch(err => {
            err && console.log(err)
          })
      }

      const checkBackEdit = () => {
        setEdit(false)
        setAddress(userinfo?.address)
        setCity(userinfo?.city)
        setCountry(userinfo?.country)
        setState(userinfo?.state)
        setAddress2(userinfo?.address2)
      }

    return (
      <View style={styles.container}>
        <Header
          backgroundColor={colorFFFFFF}
          textCenter={
            edit
              ? Translate(languageRedux).EDIT_ADDRESS
              : Translate(languageRedux).address
          }
          iconLeft={edit ? icHeader.ic_close : icHeader.ic_left}
          iconRight={edit === false && icHeader.ic_function}
          textRight={edit === true && Translate(languageRedux).btnsave}
          textRightColor={color3777EE}
          onPressLeft={() => {
            edit ? checkBackEdit() : NavigationService.goBack()
          }}
          onPressRight={() => {
            edit === true && updateAddress()
            edit === true && setLoading(true)
            edit === true && setEdit(false)
            edit === false && setShow(true)
          }}
        />
        <ScrollView style={styles.marginT20}>
          {edit ? renderEdit() : renderBody()}
        </ScrollView>
        {isShow && (
          <View style={styles.floatView}>
            <FunctionButton
              onPressCancel={() => {
                setShow(false)
              }}
              onPressEdit={() => {
                setEdit(true)
                isShow === true && setShow(false)
              }}
              onPressDelete={_onPressDelete}
              onPressPrint={_onPressPrinttoPDF}
              onPressShare={_onPressShare}
            />
          </View>
        )}
        {isShowCountry && (
          <SearchListWithName
            listData={lsCountryRedux}
            title={Translate(languageRedux).CHOOSE_COUNTRY}
            itemSelected={country}
            onItemClick={val => {
              setCountry(val)
              setShowCountry(false)
            }}
            onPressRight={() => {
              setShowCountry(false)
            }}
            isText={true}
          />
        )}
        {isShowState && (
          <SearchListWithName
            listData={Translate(languageRedux).US_STATES}
            title={Translate(languageRedux).CHOOSE_STATE}
            itemSelected={state}
            onItemClick={val => {
              console.log('val: ', val)
              setState(val)
              setShowState(false)
            }}
            onPressRight={() => {
              setShowState(false)
            }}
            isLabel={true}
          />
        )}
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
  marginT20: {
    marginTop: 20
  },
  ctnItem: {
    marginHorizontal: 20,
    marginBottom: 16
  },
  marginT8: {
    marginTop: 8,
    marginBottom: 16
  },
  divider: {
    height: 1,
    backgroundColor: colorF0F0F0
  },
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  }
})
