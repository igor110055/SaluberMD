import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import RNPrint from 'react-native-print'
import Share from 'react-native-share'
import _ from 'lodash'
import moment from 'moment'

import { color040404, color3777EE, colorA7A8A9, colorF0F0F0, colorFFFFFF } from '../../../../constants/colors'
import NavigationService from '../../../../navigation'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import { getDate112000, convertDatePushSever, convertDMMMYYYY } from '../../../../constants/DateHelpers'
import Translate from '../../../../translate'
import { apiGetUserInfo } from 'api/Auth'
import { saveUserinfo } from 'actions/user'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'

import icHeader from '../../../../../assets/images/header'
import icHealthProfile from '../../../../../assets/images/health_profile'
import icDoc from '../../../../../assets/images/document'

import Header from '../../../../components/Header'
import FunctionButton from './FunctionButton'
import CustomTextInput from '../../../healthProfile/components/CustomTextInput'
import SearchListWithName from '../../../../components/SearchListWithName'
import CustomDatePicker from '../../../../components/CustomDatePicker'
import LoadingView from '../../../../components/LoadingView'

export default function PersonalDetails() {
  const dispatch = useDispatch()
  const userinfo = useSelector(state => state.user.userinfo)
  const permission = useSelector(state => state.user.permission)
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const [isShow, setShow] = useState(false)
  const [edit, setEdit] = useState(false)
  const [isShowGender, setShowGender] = useState(false)
  const datePickerRef = React.createRef()
  const [isLoad, setLoad] = useState(false)
  const [dataNoti, setDataNoti] = useState()
  const [isShowNoti, setShowNoti] = useState(false)

  useEffect(() => {
    callAPIUserinfo()
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
      setLoad(false)
    }).catch((err) => {
      console.log('err: ', err)
      setLoad(false)
    })
  }

  const GENDERS = [
    { name: Translate(languageRedux).male, id: 0 },
    { name: Translate(languageRedux).female, id: 1 },
    { name: Translate(languageRedux).I_WOULD_RATHER_NOT_SAY, id: 2 }
  ]

  const getGender = () => {
    if (userinfo?.gender === 0) {
      return Translate(languageRedux).male
    }
    if (userinfo?.gender === 1) {
      return Translate(languageRedux).female
    }
    if (userinfo?.gender === 2) {
      return Translate(languageRedux).I_WOULD_RATHER_NOT_SAY
    }
  }

  const RenderItem = ({category, content}) => {
    return (
      <View style={styles.ctnItem}>
        <Text style={customTxt(Fonts.SemiBold, 12, colorA7A8A9).txt}>{category}</Text>
        <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginT8]}>{content}</Text>
        <View style={styles.divider} />
      </View>
    )
  }

  const [firstName, setFirstName] = useState(userinfo?.nome || '')
  const [lastName, setLastName] = useState(userinfo?.cognome || '')
  const [gender, setGender] = useState(getGender())
  const [birthdate, setBirthdate] = useState()
  const [placeOfBirth, setPlaceOfBirth] = useState(userinfo?.placeOfBirth || '')
  const [fiscalCode, setFiscalCode] = useState(userinfo?.cf || '')
  const [midname, setMidname] = useState(userinfo?.middleName || '')

  var utcBirthday = moment(userinfo?.birthdate).utc().valueOf()

  useEffect(() => {
    setBirthdate(utcBirthday)
  }, [utcBirthday])

  const renderEdit = () => {
    return (
      <View style={styles.ctnItem}>
        <CustomTextInput
          title={Translate(languageRedux).FIRST_NAME}
          value={firstName || ''}
          onChangeTxt={(txt) => setFirstName(txt)}
          validate={firstName ? false : true}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
        {userinfo?.country === 'US' && <CustomTextInput
          title={Translate(languageRedux).middlename}
          value={midname || ''}
          onChangeTxt={(txt) => setMidname(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />}
        <CustomTextInput
          title={Translate(languageRedux).surname}
          value={lastName || ''}
          onChangeTxt={(txt) => setLastName(txt)}
          validate={lastName ? false : true}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
        <CustomTextInput
          title={Translate(languageRedux).gender_member}
          value={gender?.name || gender}
          onChangeTxt={(txt) => setGender(txt)}
          validate={gender ? false : true}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icHealthProfile.ic_dropdown}
          onPress={() => {
            setShowGender(true)
          }}
        />
        <CustomTextInput
          title={Translate(languageRedux).birthdate}
          value={birthdate ? convertDMMMYYYY(birthdate) : ''}
          onChangeTxt={(txt) => setBirthdate(txt)}
          validate={birthdate ? false : true}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icDoc.ic_choose_date}
          onPress={() => {datePickerRef.current.onPressDate()}}
        />
        <CustomTextInput
          title={Translate(languageRedux).placeOfBirth}
          value={placeOfBirth || ''}
          onChangeTxt={(txt) => setPlaceOfBirth(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
        {permission?.iniziativa?.cfmandatory === '1' && <CustomTextInput
          title={Translate(languageRedux).cf}
          value={fiscalCode || ''}
          onChangeTxt={(txt) => setFiscalCode(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />}
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View>
        <RenderItem
          category={Translate(languageRedux).FIRST_NAME}
          content={userinfo?.nome}
        />
        {userinfo?.country === 'US' && (
          <RenderItem
            category={Translate(languageRedux).middlename}
            content={userinfo?.middleName}
          />
        )}
        <RenderItem
          category={Translate(languageRedux).surname}
          content={userinfo?.cognome}
        />
        <RenderItem
          category={Translate(languageRedux).gender_member}
          content={getGender()}
        />
        <RenderItem
          category={Translate(languageRedux).birthdate}
          content={convertDMMMYYYY(userinfo?.birthdate)}
        />
        <RenderItem
          category={Translate(languageRedux).placeOfBirth}
          content={userinfo?.placeOfBirth}
        />
        {permission?.iniziativa?.cfmandatory === '1' && (
          <RenderItem
            category={Translate(languageRedux).cf}
            content={userinfo?.cf}
          />
        )}
      </View>
    )
  }

  const checkGender = () => {
    if (gender?.id === undefined) {
      return userinfo?.gender
    } else {
      return gender?.id
    }
  }

  const updatePersonalInfo = () => {
    const body = {
      nome: firstName,
      cognome: lastName,
      language_id: userinfo?.language_id,
      gender: checkGender(),
      birthdate: convertDatePushSever(birthdate),
      country: userinfo?.country,
      city: userinfo?.city,
      phone1: userinfo?.phone1,
      address: userinfo?.address,
      medicphone: userinfo?.medicphone,
      medicemail: userinfo?.medicemail,
      medicname1: userinfo?.medicname1,
      height: userinfo?.height,
      weight: userinfo?.weight,
      email: userinfo?.email,
      state: userinfo?.state,
      smoker: userinfo?.smoker,
      cf: fiscalCode ? fiscalCode : (userinfo?.cf === null ? '' : userinfo?.cf),
      prefix: userinfo?.prefix,
      suffix: userinfo?.suffix,
      middleName: midname || userinfo?.middleName,
      address2: userinfo?.address2,
      mobile: userinfo?.mobile,
      has2fa: userinfo?.has2fa,
      placeOfBirth: placeOfBirth,
      weightUnit: userinfo?.weightUnit,
      heightUnit: userinfo?.heightUnit
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
    setLoad(true)
  }

  const _onPressPrinttoPDF = async () => {
    const results = await RNHTMLtoPDF.convert({
      html: `
      <h2>${Translate(languageRedux).FIRST_NAME}</h2>
      <h1>${userinfo?.nome}</h1>
      <hr class="solid">
      <h2>${Translate(languageRedux).surname}</h2>
      <h1>${userinfo?.cognome}</h1>
      <hr class="solid">
      <h2>${Translate(languageRedux).gender_member}</h2>
      <h1>${getGender()}</h1>
      <hr class="solid">
      <h2>${Translate(languageRedux).birthdate}</h2>
      <h1>${convertDMMMYYYY(userinfo?.birthdate)}</h1>
      <hr class="solid">
      <h2>${Translate(languageRedux).placeOfBirth}</h2>
      <h1>${userinfo?.placeOfBirth}</h1>
      <hr class="solid">
      `,
      fileName: Translate(languageRedux).personalinfo,
      base64: true
    })
    await RNPrint.print({ filePath: results.filePath })
  }

  const _onPressShare = async () => {
    const results = await RNHTMLtoPDF.convert({
      html: `
      <h2>${Translate(languageRedux).surname}</h2>
      <h1>${userinfo?.nome}</h1>
      <hr class="solid">
      <h2>${Translate(languageRedux).surname}</h2>
      <h1>${userinfo?.cognome}</h1>
      <hr class="solid">
      <h2>${Translate(languageRedux).gender_member}</h2>
      <h1>${getGender()}</h1>
      <hr class="solid">
      <h2>${Translate(languageRedux).birthdate}</h2>
      <h1>${convertDMMMYYYY(userinfo?.birthdate)}</h1>
      <hr class="solid">
      <h2>${Translate(languageRedux).placeOfBirth}</h2>
      <h1>${userinfo?.placeOfBirth}</h1>
      <hr class="solid">
      `,
      fileName: Translate(languageRedux).personalinfo,
      base64: true
    })
    let options = {
      url: `data:application/pdf;base64,${results.base64}`,
      fileName: Translate(languageRedux).personalinfo
    }
    Share.open(options)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        err && console.log(err)
      })
  }

  const _onChangeDatePicker = date => {
    setBirthdate(date)
  }

  const checkBackEdit = () => {
    setEdit(false)
    setFirstName(userinfo?.nome)
    setLastName(userinfo?.cognome)
    setGender(getGender())
    setBirthdate(utcBirthday)
    setPlaceOfBirth(userinfo?.placeOfBirth)
    setFiscalCode(userinfo?.cf)
    setMidname(userinfo?.middleName)
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={
          edit
            ? Translate(languageRedux).EDIT_PERSONAL_INFO
            : Translate(languageRedux).personalinfo
        }
        iconLeft={edit ? icHeader.ic_close : icHeader.ic_left}
        iconRight={edit === false && icHeader.ic_function}
        textRight={edit === true && Translate(languageRedux).btnsave}
        textRightColor={color3777EE}
        onPressLeft={() => {
          edit ? checkBackEdit() : NavigationService.goBack()
        }}
        onPressRight={() => {
          edit === true && updatePersonalInfo()
          edit === true && setLoad(true)
          edit === true && setEdit(false)
          edit === false && setShow(true)
        }}
      />
      <ScrollView style={styles.marginT20}>
        {edit ? renderEdit() : renderBody()}
      </ScrollView>
      <CustomDatePicker
        refDatePicker={datePickerRef}
        onChangeDate={_onChangeDatePicker}
        maxDate={new Date()}
        date={getDate112000()}
      />
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
            onPressPrint={_onPressPrinttoPDF}
            onPressShare={_onPressShare}
          />
        </View>
      )}
      {isShowGender && (
        <SearchListWithName
          listData={GENDERS}
          title={`${Translate(languageRedux).select} ${
            Translate(languageRedux).gender1
          }`}
          itemSelected={gender}
          onItemClick={val => {
            setGender(val)
            setShowGender(false)
          }}
          onPressRight={() => {
            setShowGender(false)
          }}
          hideSearchText={true}
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
