import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'
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

import Header from '../../../../components/Header'
import FunctionButton from './FunctionButton'
import CustomTextInput from '../../../healthProfile/components/CustomTextInput'
import LoadingView from '../../../../components/LoadingView'

import RNHTMLtoPDF from 'react-native-html-to-pdf'
import RNPrint from 'react-native-print'
import Share from 'react-native-share'

export default function ContactInfo() {

  const dispatch = useDispatch()
  const userinfo = useSelector(state => state.user.userinfo)
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const [isShow, setShow] = useState(false)
  const [edit, setEdit] = useState(false)
  const [isLoad, setLoading] = useState(false)
  const [phone, setPhone] = useState(userinfo?.phone1)
  const [email, setEmail] = useState(userinfo?.email)
  const [dataNoti, setDataNoti] = useState()
  const [isShowNoti, setShowNoti] = useState(false)

  useEffect(() => {
    phoneSlice()
    callAPIUserinfo()
  }, [isLoad])

  const callAPIUserinfo = () => {
    dispatch(apiGetUserInfo())
      .then(res => {
        // console.log('res: ', res?.payload)
        const getuserInfo = res?.payload?.user
        if (getuserInfo) {
          Promise.all([dispatch(saveUserinfo(getuserInfo))])
        }
        setLoading(false)
      })
      .catch(err => {
        console.log('err: ', err)
        setLoading(false)
      })
  }

  const phoneSlice = () => {
    if ((phone || []).length === 9) {
      setPhone(/\D/g, '')
      let phoneNumber = phone
      const match = phoneNumber.match(/^(\d{1,3})(\d{0,3})(\d{0,4})(\d{0,6})$/)
      if (match) {
        phoneNumber = `${match[1]}${match[2] ? ' ' : ''}${match[2]}${match[3] ? ' ' : ''}${match[3]}${match[4] ? ' ' : ''}${match[4]}`
      }
      phoneNumber
      setPhone(phoneNumber)
      return
    }
  }

  const renderEdit = () => {
    return (
      <View style={styles.ctnItem}>
      <CustomTextInput
        title={Translate(languageRedux).EMAIL}
        value={email || ''}
        onChangeTxt={(txt) => setEmail(txt)}
        textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        autoCapitalize={'none'}
      />
      <CustomTextInput
        title={Translate(languageRedux).PHONE}
        value={phone || ''}
        onChangeTxt={(txt) => setPhone(txt)}
        textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        keyboardType={'phone-pad'}
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

  const renderBody = () => {
    return (
      <View>
       <RenderItem category={Translate(languageRedux).EMAIL} content={userinfo?.email} />
       <RenderItem category={Translate(languageRedux).PHONE} content={userinfo?.phone1} />
      </View>
    )
  }

  const updateContactInfo = () => {
    const body = {
      nome: userinfo?.nome,
      cognome: userinfo?.cognome,
      language_id: userinfo?.language_id,
      gender: userinfo?.gender,
      birthdate: userinfo?.birthdate,
      country: userinfo?.country,
      city: userinfo?.city,
      phone1: phone || userinfo?.phone1,
      address: userinfo?.address,
      medicphone: userinfo?.medicphone,
      medicemail: userinfo?.medicemail,
      medicname1: userinfo?.medicname1,
      height: userinfo?.height,
      weight: userinfo?.weight,
      email: email || userinfo?.email,
      state: userinfo?.state,
      smoker: userinfo?.smoker,
      cf: userinfo?.cf === null ? '' : userinfo?.cf,
      prefix: userinfo?.prefix,
      suffix: userinfo?.suffix,
      middleName: userinfo?.middleName,
      address2: userinfo?.address2,
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
      country: userinfo?.country,
      city: userinfo?.city,
      phone1: '',
      address: userinfo?.address,
      medicphone: userinfo?.medicphone,
      medicemail: userinfo?.medicemail,
      medicname1: userinfo?.medicname1,
      height: userinfo?.height,
      weight: userinfo?.weight,
      email: '',
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
  }

  const _onPressPrinttoPDF = async () => {
      const results = await RNHTMLtoPDF.convert({
        html: `
        <h2>${Translate(languageRedux).EMAIL}</h2>
        <h1>${userinfo?.email}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).PHONE}</h2>
        <h1>${userinfo?.phone1}</h1>
        <hr class="solid">
        `,
        fileName: Translate(languageRedux).CONTACT_INFO,
        base64: true
      })

      await RNPrint.print({ filePath: results.filePath })
  }

  const _onPressShare = async () => {
    const results = await RNHTMLtoPDF.convert({
      html: `
      <h2>${Translate(languageRedux).EMAIL}</h2>
      <h1>${userinfo?.email}</h1>
      <hr class="solid">
      <h2>${Translate(languageRedux).PHONE}</h2>
      <h1>${userinfo?.phone1}</h1>
      <hr class="solid">
      `,
      fileName: Translate(languageRedux).CONTACT_INFO,
      base64: true
    })
    let options = {
      url: `data:application/pdf;base64,${results.base64}`,
      fileName: Translate(languageRedux).CONTACT_INFO
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
    setEmail(userinfo?.email)
    setPhone(userinfo?.phone1)
  }

  return (
    <View style={styles.container}>
        <Header
          backgroundColor={colorFFFFFF}
          textCenter={
            edit
              ? Translate(languageRedux).EDIT_CONTACT_INFO
              : Translate(languageRedux).CONTACT_INFO
          }
          iconLeft={edit ? icHeader.ic_close : icHeader.ic_left}
          iconRight={edit === false && icHeader.ic_function}
          textRight={edit === true && Translate(languageRedux).btnsave}
          textRightColor={color3777EE}
          onPressLeft={() => {
            edit ? checkBackEdit() : NavigationService.goBack()
          }}
          onPressRight={() => {
            edit === true && updateContactInfo()
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

