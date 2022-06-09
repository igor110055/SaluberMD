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

import Header from '../../../../components/Header'
import FunctionButton from './FunctionButton'
import CustomTextInput from '../../../healthProfile/components/CustomTextInput'
import LoadingView from '../../../../components/LoadingView'

export default function FamilyPhysician() {

  const dispatch = useDispatch()
  const userinfo = useSelector(state => state.user.userinfo)
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const [isShow, setShow] = useState(false)
  const [edit, setEdit] = useState(false)
  const [isLoad, setLoading] = useState(false)
  const [name, setName] = useState(userinfo?.medicname1)
  const [phone, setPhone] = useState(userinfo?.medicphone)
  const [email, setEmail] = useState(userinfo?.medicemail)
  const [dataNoti, setDataNoti] = useState()
  const [isShowNoti, setShowNoti] = useState(false)

  useEffect(() => {
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

  const renderEdit = () => {
    return (
      <View style={styles.ctnItem}>
      <CustomTextInput
        title={Translate(languageRedux).name}
        value={name || ''}
        onChangeTxt={(txt) => setName(txt)}
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
      <CustomTextInput
        title={Translate(languageRedux).EMAIL}
        value={email || ''}
        onChangeTxt={(txt) => setEmail(txt)}
        textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        autoCapitalize={'none'}
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
       <RenderItem category={Translate(languageRedux).name} content={userinfo?.medicname1} />
       <RenderItem category={Translate(languageRedux).PHONE} content={userinfo?.medicphone} />
       <RenderItem category={Translate(languageRedux).EMAIL} content={userinfo?.medicemail} />
      </View>
    )
  }

  const updateFamilyPhysician = () => {
    const body = {
      nome: userinfo?.nome,
      cognome: userinfo?.cognome,
      language_id: userinfo?.language_id,
      gender: userinfo?.gender,
      birthdate: userinfo?.birthdate,
      country: userinfo?.country,
      city: userinfo?.city,
      phone1: userinfo?.phone1,
      address: userinfo?.address,
      medicphone: phone,
      medicemail: email,
      medicname1: name,
      height: userinfo?.height,
      weight: userinfo?.weight,
      email: userinfo?.email,
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
      phone1: userinfo?.phone1,
      address: userinfo?.address,
      medicphone: null,
      medicemail: null,
      medicname1: null,
      height: userinfo?.height,
      weight: userinfo?.weight,
      email: userinfo?.email,
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
    setName('')
    setPhone('')
    setEmail('')
  }

  const _onPressPrinttoPDF = async () => {
    const results = await RNHTMLtoPDF.convert({
      html: `
      <h2>${Translate(languageRedux).name}</h2>
      <h1>${userinfo?.medicname1}</h1>
      <hr class="solid">
      <h2>${Translate(languageRedux).PHONE}</h2>
      <h1>${userinfo?.medicphone}</h1>
      <hr class="solid">
      <h2>${Translate(languageRedux).EMAIL}</h2>
      <h1>${userinfo?.medicemail}</h1>
      <hr class="solid">
      `,
      fileName: Translate(languageRedux).FAMILY_PHYSICIAN,
      base64: true
    })
    await RNPrint.print({ filePath: results.filePath })
  }

  const _onPressShare = async () => {
    const results = await RNHTMLtoPDF.convert({
      html: `
      <h2>${Translate(languageRedux).name}</h2>
      <h1>${userinfo?.medicname1}</h1>
      <hr class="solid">
      <h2>${Translate(languageRedux).PHONE}</h2>
      <h1>${userinfo?.medicphone}</h1>
      <hr class="solid">
      <h2>${Translate(languageRedux).EMAIL}</h2>
      <h1>${userinfo?.medicemail}</h1>
      <hr class="solid">
      `,
      fileName: Translate(languageRedux).FAMILY_PHYSICIAN,
      base64: true
    })
    let options = {
      url: `data:application/pdf;base64,${results.base64}`,
      fileName: Translate(languageRedux).FAMILY_PHYSICIAN
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
    setName(userinfo?.medicname1)
    setPhone(userinfo?.medicphone)
    setEmail(userinfo?.medicemail)
  }

  return (
    <View style={styles.container}>
       <Header
          backgroundColor={colorFFFFFF}
          textCenter={
            edit
              ? Translate(languageRedux).EDIT_FAMILY_PHYSICIAN
              : Translate(languageRedux).FAMILY_PHYSICIAN
          }
          iconLeft={edit ? icHeader.ic_close : icHeader.ic_left}
          iconRight={edit === false && icHeader.ic_function}
          textRight={edit === true && Translate(languageRedux).btnsave}
          textRightColor={color3777EE}
          onPressLeft={() => {
            edit ? checkBackEdit() : NavigationService.goBack()
          }}
          onPressRight={() => {
            edit === true && updateFamilyPhysician()
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
