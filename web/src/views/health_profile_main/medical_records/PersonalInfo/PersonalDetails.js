import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
// import RNHTMLtoPDF from 'react-native-html-to-pdf'
// import RNPrint from 'react-native-print'
// import Share from 'react-native-share'

import { color040404, color3777EE, colorA7A8A9, colorF0F0F0, colorFFFFFF } from '../../../../constants/colors'
import NavigationService from '../../../../routes'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import { getDate112000, convertDatePushSever, convertDMMMYYYY } from '../../../../constants/DateHelpers'
import Translate from '../../../../translate'
// import { apiGetUserInfo } from 'api/Auth'
// import { saveUserinfo } from 'actions/user'

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

  const userinfo = {}
  const languageRedux = ''
  const token = useSelector(state => state.user.token)
  const [isShow, setShow] = useState(false)
  const [edit, setEdit] = useState(false)
  const [isShowGender, setShowGender] = useState(false)
  const datePickerRef = React.createRef()
  const [isLoad, setLoad] = useState(false)
  const [version, setVersion] = useState([])

  useEffect(() => {
    callAPIUserinfo()
  },[isLoad])

  const callAPIUserinfo = () => {
    // dispatch(apiGetUserInfo()).then(res => {
    //   console.log('res: ', res?.payload)
    //   const getuserInfo = res?.payload?.user
    //   if (getuserInfo) {
    //     Promise.all([
    //       dispatch(saveUserinfo(getuserInfo))
    //     ])
    //   }
    //   setLoad(false)
    // }).catch((err) => {
    //   console.log('err: ', err)
    //   setLoad(false)
    // })
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
  const [birthdate, setBirthdate] = useState(convertDMMMYYYY(userinfo?.birthdate) || '')
  const [placeOfBirth, setPlaceOfBirth] = useState(userinfo?.placeOfBirth || '')
  const [fiscalCode, setFiscalCode] = useState('')
  const [midname, setMidname] = useState(userinfo?.middleName || '')

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
        <CustomTextInput
          title={Translate(languageRedux).cf}
          value={fiscalCode || ''}
          onChangeTxt={(txt) => setFiscalCode(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View>
        <RenderItem category={Translate(languageRedux).FIRST_NAME} content={userinfo?.nome} />
        {userinfo?.country === 'US' &&
          <RenderItem category={Translate(languageRedux).middlename}
          content={userinfo?.middleName} />}
        <RenderItem category={Translate(languageRedux).surname} content={userinfo?.cognome} />
        <RenderItem category={Translate(languageRedux).gender_member} content={getGender()} />
        <RenderItem category={Translate(languageRedux).birthdate} content={convertDMMMYYYY(userinfo?.birthdate)} />
        <RenderItem category={Translate(languageRedux).placeOfBirth} content={userinfo?.placeOfBirth} />
        <RenderItem category={Translate(languageRedux).cf} />
      </View>
    )
  }

  const checkGender = () => {
    if (gender?.id === null) {
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
      gender: gender?.id || userinfo?.gender,
      birthdate: convertDatePushSever(birthdate) || userinfo?.birthdate,
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
      has2fa: 0,
      placeOfBirth: placeOfBirth,
      weightUnit: userinfo?.weightUnit,
      heightUnit: userinfo?.heightUnit
    }
    const bodyUS = {
      nome: firstName,
      cognome: lastName,
      language_id: userinfo?.language_id,
      gender: gender?.id,
      birthdate: convertDatePushSever(birthdate),
      country: userinfo?.country,
      city: userinfo?.city,
      phonecode: userinfo?.phonecode,
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
      cf: userinfo?.cf,
      prefix: userinfo?.prefix,
      suffix: userinfo?.suffix,
      middleName: midname,
      address2: userinfo?.address2,
      mobile: userinfo?.mobile,
      has2fa: 0,
      placeOfBirth: placeOfBirth,
      weightUnit: userinfo?.weightUnit,
      heightUnit: userinfo?.heightUnit
    }
    // axios({
    //   method: 'post',
    //   url: `${APIs.hostAPI}backoffice/webdoctor/updatePatientCustomProfile`,
    //   headers: {
    //     'x-auth-token': token
    //   },
    //   data: userinfo.country === 'US' ? bodyUS : body
    // })
    //   .then(response => {
    //     console.log('data: ', response.data)
    //   })
    //   .catch(error => {
    //     console.error('There was an error!', error)
    //   })
    // setLoad(true)
  }

  const _onPressPrinttoPDF = async () => {
    // const results = await RNHTMLtoPDF.convert({
    //   html: `
    //   <h2>${Translate(languageRedux).FIRST_NAME}</h2>
    //   <h1>${userinfo?.nome}</h1>
    //   <hr class="solid">
    //   <h2>${Translate(languageRedux).surname}</h2>
    //   <h1>${userinfo?.cognome}</h1>
    //   <hr class="solid">
    //   <h2>${Translate(languageRedux).gender_member}</h2>
    //   <h1>${getGender()}</h1>
    //   <hr class="solid">
    //   <h2>${Translate(languageRedux).birthdate}</h2>
    //   <h1>${convertDMMMYYYY(userinfo?.birthdate)}</h1>
    //   <hr class="solid">
    //   <h2>${Translate(languageRedux).placeOfBirth}</h2>
    //   <h1>${userinfo?.placeOfBirth}</h1>
    //   <hr class="solid">
    //   `,
    //   fileName: Translate(languageRedux).personalinfo,
    //   base64: true
    // })
    // await RNPrint.print({ filePath: results.filePath })
  }

  const _onPressShare = async () => {
    // const results = await RNHTMLtoPDF.convert({
    //   html: `
    //   <h2>${Translate(languageRedux).surname}</h2>
    //   <h1>${userinfo?.nome}</h1>
    //   <hr class="solid">
    //   <h2>${Translate(languageRedux).surname}</h2>
    //   <h1>${userinfo?.cognome}</h1>
    //   <hr class="solid">
    //   <h2>${Translate(languageRedux).gender_member}</h2>
    //   <h1>${getGender()}</h1>
    //   <hr class="solid">
    //   <h2>${Translate(languageRedux).birthdate}</h2>
    //   <h1>${convertDMMMYYYY(userinfo?.birthdate)}</h1>
    //   <hr class="solid">
    //   <h2>${Translate(languageRedux).placeOfBirth}</h2>
    //   <h1>${userinfo?.placeOfBirth}</h1>
    //   <hr class="solid">
    //   `,
    //   fileName: Translate(languageRedux).personalinfo,
    //   base64: true
    // })
    // let options = {
    //   url: `data:application/pdf;base64,${results.base64}`,
    //   fileName: Translate(languageRedux).personalinfo
    // }
    // Share.open(options)
    //   .then(res => {
    //     console.log(res)
    //   })
    //   .catch(err => {
    //     err && console.log(err)
    //   })
  }

  const _onChangeDatePicker = date => {
    setBirthdate(date)
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
          edit ? setEdit(false) : NavigationService.goBack()
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
