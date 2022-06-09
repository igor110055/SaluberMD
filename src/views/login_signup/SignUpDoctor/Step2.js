import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {color040404, color3777EE, colorC1C3C5, colorF0F0F0, colorFFFFFF} from 'constants/colors'
import Translate from 'translate'
import NavigationService from 'navigation'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Routes from 'navigation/Routes'
import PhotoDialog from 'components/PhotoDialog'
import {convertDMMMYYYY, getDate112000, convertDateDDMMYYYYToSever} from 'constants/DateHelpers'
import { checkWhiteSpace } from 'constants/CheckWhiteSpace'
import { saveDataSignUpDr2 } from 'actions/common'

import icHeader from '../../../../assets/images/header'
import icDoc from '../../../../assets/images/document'

import Header from 'components/Header'
import CustomTextInput from '../../healthProfile/components/CustomTextInput'
import Button from 'components/Button'
import SearchListWithName from 'components/SearchListWithName'
import CustomDatePicker from 'components/CustomDatePicker'

export default function Step2({ route }) {
  const languageRedux = useSelector(state => state.common.language)
  const [firstName, setFirstName] = useState()
  const [lastName, setLastName] = useState()
  const [birthday, setBirthday] = useState()
  const [gender, setGender] = useState()
  const [officeAddress, setOfficeAddress] = useState()
  const [country, setCountry] = useState()
  const [city, setCity] = useState()
  const [phone, setPhone] = useState()
  const [isShowGender, setShowGender] = useState(false)
  const [isShowCountry, setShowCountry] = useState(false)
  const photoDialogRef = React.createRef()
  const [imgProfile, setImgProfile] = useState()
  const passingData = route?.params?.data
  const datePickerRef = React.createRef()
  const [listCountries, setListCountries] = useState([])
  const dispatch = useDispatch()
  const dataSignUpDr2 = useSelector(state => state.common.dataSignUpDr2)

  useEffect(() => {
    setListCountries(Translate(languageRedux).COUNTRIES)
    console.log('dataSignUpDr2: ', dataSignUpDr2)
    setFirstName(dataSignUpDr2?.firstName || '')
    setLastName(dataSignUpDr2?.lastName || '')
    setBirthday(dataSignUpDr2?.birthday ? convertDMMMYYYY(dataSignUpDr2?.birthday) : '')
    setGender(dataSignUpDr2?.gender || '')
    setOfficeAddress(dataSignUpDr2?.officeAddress || '')
    setCountry(dataSignUpDr2?.country || '')
    setCity(dataSignUpDr2?.city || '')
    setPhone(dataSignUpDr2?.phone || '')
    setImgProfile(dataSignUpDr2?.imgProfile)
  }, [])

  const GENDERS = [
    { name: Translate(languageRedux).male, id: 0 },
    { name: Translate(languageRedux).female, id: 1 },
    { name: Translate(languageRedux).I_WOULD_RATHER_NOT_SAY, id: 2 }
  ]

  const renderUpload = () => {
    return (
      <View>
        <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt, styles.marginB8]}>
          {Translate(languageRedux).SIGNUP_STEP2}
        </Text>
        {imgProfile && <View>
          <Image source={imgProfile ? imgProfile : icDoc.ic_upload} style={styles.imgStyle} />
        </View>}
        <TouchableOpacity onPress={() => {
          photoDialogRef.current.show()
        }} style={styles.ctnButtonUpload}>
          <Image source={icDoc.ic_upload} style={styles.iconStyle} />
        </TouchableOpacity>
      </View>
    )
  }

  const renderTextInput = () => {
    return (
      <View>
        <CustomTextInput
          title={Translate(languageRedux).FIRST_NAME}
          onChangeTxt={(txt) => setFirstName(txt)}
          value={firstName}
          validate={checkWhiteSpace(firstName) ? false : true}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
        <CustomTextInput
          title={Translate(languageRedux).surname}
          onChangeTxt={txt => setLastName(txt)}
          value={lastName}
          validate={checkWhiteSpace(lastName) ? false : true}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
        <CustomTextInput
          title={Translate(languageRedux).birthday}
          onChangeTxt={txt => setBirthday(txt)}
          value={birthday ? convertDMMMYYYY(birthday) : ''}
          validate={birthday ? false : true}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          onPress={() => {datePickerRef.current.onPressDate()}}
          iconRight={icDoc.ic_choose_date}
        />
        <CustomTextInput
          title={Translate(languageRedux).GENDER}
          onChangeTxt={txt => setGender(txt)}
          value={gender?.name || gender}
          validate={gender ? false : true}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icDoc.ic_dropdown}
          onPress={() => {
            setShowGender(true)
          }}
        />
        <CustomTextInput
          title={Translate(languageRedux).OFFICE_ADDRESS}
          onChangeTxt={txt => setOfficeAddress(txt)}
          value={officeAddress}
          validate={checkWhiteSpace(officeAddress) ? false : true}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
        <CustomTextInput
          title={Translate(languageRedux).COUNTRY}
          onChangeTxt={txt => setCountry(txt)}
          value={country?.label || country}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icDoc.ic_dropdown}
          validate={country ? false : true}
          onPress={() => {
            setShowCountry(true)
          }}
        />
        <CustomTextInput
          title={Translate(languageRedux).city}
          onChangeTxt={txt => setCity(txt)}
          value={city}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
        <CustomTextInput
          title={Translate(languageRedux).PHONE}
          onChangeTxt={txt => setPhone(txt)}
          value={phone}
          validate={checkWhiteSpace(phone) ? false : true}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          keyboardType={'phone-pad'}
        />
      </View>
    )
  }

  const checkDisable = () => {
    if (checkWhiteSpace(firstName) && checkWhiteSpace(lastName) && birthday
    && gender && checkWhiteSpace(officeAddress) && checkWhiteSpace(phone) && country) {
      return false
    }
    else {
      return true
    }
  }

  const renderButtonNext = () => {
    return (
      <View style={styles.marginT40}>
        <Button
          text={Translate(languageRedux).NEXT}
          textColor={checkDisable() ? colorC1C3C5 : colorFFFFFF}
          backgroundColor={checkDisable() ? colorF0F0F0 : color3777EE}
          disabled={checkDisable()}
          onPress={() => {
            NavigationService.navigate(Routes.SIGN_UP_DOCTOR_3, {
              data: {
                userName: passingData?.userName,
                email: passingData?.email,
                password: passingData?.password,
                language: passingData?.language,
                listCurrency: passingData?.listCurrency,
                currency: passingData?.currency,
                fee: passingData?.fee,
                slot: passingData?.slot,
                firstName: firstName,
                lastName: lastName,
                birthday: convertDateDDMMYYYYToSever(birthday),
                gender: gender,
                officeAddress: officeAddress,
                country: country,
                city: city,
                phone: phone,
                registrationCode: passingData?.registrationCode,
                imgProfile: imgProfile
              }
            })
          }}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        {renderUpload()}
        {renderTextInput()}
        {renderButtonNext()}
      </View>
    )
  }

  const _callbackPhototo = (res) => {
    if ((res || []).length > 0) {
      console.log('res: ', res[0])
      setImgProfile(res[0])
      // callAPIUploadImage(res[0])
    }
  }

  const _onChangeDatePicker = date => {
    setBirthday(date)
  }

  return (
    <View style={styles.container}>
      <Header
        textCenter={Translate(languageRedux).SIGNUP_BTN}
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_left}
        onPressLeft={() => {
          var data = {
            firstName: firstName,
            lastName: lastName,
            birthday: convertDateDDMMYYYYToSever(birthday),
            gender: gender || dataSignUpDr2?.gender,
            officeAddress: officeAddress,
            country: country || dataSignUpDr2?.country,
            city: city,
            phone: phone,
            imgProfile: imgProfile
          }
          Promise.all([
            dispatch(saveDataSignUpDr2(data))
          ])
          setTimeout(() => {
            NavigationService.goBack()
          }, 500)
        }}
      />
      <KeyboardAwareScrollView>
        {renderBody()}
      </KeyboardAwareScrollView>
      <PhotoDialog
        actionSheetRef={photoDialogRef}
        callbackPhoto={_callbackPhototo}
      />
      <CustomDatePicker
        refDatePicker={datePickerRef}
        onChangeDate={_onChangeDatePicker}
        maxDate={new Date()}
        date={getDate112000()}
      />
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
      {
        isShowCountry && (
          <SearchListWithName
            listData={listCountries}
            title={Translate(languageRedux).CHOOSE_COUNTRY}
            itemSelected={country}
            onItemClick={(val) => {
              setCountry(val)
              setShowCountry(false)
            }}
            onPressRight={() => {
              setShowCountry(false)
            }}
            isLabel={true}
          />
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  ctnBody: {
    paddingBottom: 48,
    marginHorizontal: 20
  },
  marginT40: {
    marginTop: 40
  },
  ctnButtonUpload: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderColor: color3777EE,
    marginTop: 12
  },
  marginB8: {
    marginBottom: 8
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  imgStyle: {
    height: 200,
    width: '100%'
  }
})
