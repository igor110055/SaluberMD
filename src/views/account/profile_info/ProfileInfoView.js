import React, { useState, useEffect } from 'react'
import {
  StyleSheet, View, Text, Image, TouchableOpacity, TextInput
} from 'react-native'
import Header from '../../../components/Header'
import { color040404, color363636, color3777EE, colorA7A8A9, colorDDDEE1, colorF0F0F0, colorFFFFFF } from '../../../constants/colors'
import Translate from '../../../translate'
import imgHeader from '../../../../assets/images/header'
import NavigationService from '../../../navigation'
import Routes from '../../../navigation/Routes'
import imgAvatar from '../../../../assets/images/account'
import { customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'
import { useDispatch, useSelector } from 'react-redux'
import CustomTextInput from '../../healthProfile/components/CustomTextInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import PhotoDialog from '../../../components/PhotoDialog'
import { apiGetUserInfo, apiUpdatePersonalInfo, apiUploadImageUser } from 'api/Auth'
import LoadingView from 'components/LoadingView'
import { convertCalenderDDMMYYYY, convertStringToDate, convertYYYYMMDD, getDate112000 } from 'constants/DateHelpers'
import TextInputView from 'views/login_signup/components/TextInputView'
import CustomDatePicker from 'components/CustomDatePicker'
import SearchListWithName from 'components/SearchListWithName'
import { COUNTRIES } from 'views/login_signup/SignUpView'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
import { saveUserinfo } from 'actions/user'

export default function ProfileInfoView() {
  const photoDialogRef = React.createRef()
  const userinfo = useSelector(state => state.user.userinfo)
  const [imgAvt, setImgAvt] = useState()
  const [email, setEmail] = useState(userinfo?.email || '')
  const [password, setPassword] = useState()
  const [firstName, setFirstName] = useState(userinfo?.nome || '')
  const [middleName, setMiddleName] = useState(userinfo?.middleName || '')
  const [lastName, setLastName] = useState(userinfo?.cognome || '')
  const datePickerRef = React.createRef()
  const [birthday, setBirthday] = useState()
  const [birthPlace, setBirthPlace] = useState(userinfo?.placeOfBirth || '')
  const [country, setCountry] = useState()
  const [isShowCountry, setShowCountry] = useState(false)
  const languageRedux = useSelector(state => state.common.language)
  const dispatch = useDispatch()
  const [isLoading, setLoading] = useState(false)
  const [isUpdate, setUpdate] = useState(false)
  const [isNoti, setShowNoti] = useState(false)
  const [dataNoti, setDataNoti] = useState()

  useEffect(() => {
    if (userinfo?.userImage) {
      var base64 = `data:image/png;base64,${userinfo?.userImage}`
      setImgAvt({uri: base64})
    }

    if (userinfo.birthdate) {
      setBirthday(convertStringToDate(userinfo.birthdate))
    }

    if (userinfo?.country) {
      const filter = COUNTRIES.filter(val => val?.value === userinfo?.country)
      if (filter.length > 0) {
        setCountry(filter[0])
      }
    }
  }, [userinfo])

  const callAPIUpdate = () => {
    const param = {
      'nome': firstName,
      'cognome': lastName,
      'birthdate': convertYYYYMMDD(birthday),
      'country': country?.value,
      'midname': middleName,
      'placeOfBirth': birthPlace,
      'language_id': languageRedux,
      'gender': userinfo?.gender || 2,
      'city': userinfo?.city || '',
      'phonecode': '',
      'phone1': userinfo?.phone1 || '',
      'address': userinfo?.address || '',
      'medicphone': userinfo?.medicphone || '',
      'medicemail': userinfo?.medicemail || '',
      'medicname1': userinfo?.medicname1 || '',
      'height': userinfo?.height || '',
      'weight': userinfo?.weight || '',
      'email': email || '',
      'state': userinfo?.state || '',
      'smoker': userinfo?.smoker || 0,
      'cf': userinfo?.cf === null ? '' : userinfo?.cf,
      'prefix': userinfo?.prefix || 0,
      'suffix': userinfo?.suffix || 0,
      'address2': userinfo?.address2 || null,
      'mobile': userinfo?.mobile || '',
      'has2fa': userinfo?.has2fa || 0,
      'weightUnit': userinfo?.weightUnit || 1,
      'heightUnit': userinfo?.heightUnit || 1,
      'workPhone': userinfo?.workPhone || null,
      'zipCode': userinfo?.zipCode || ''
    }
    console.log('param: ', param)
    setLoading(true)
    dispatch(apiUpdatePersonalInfo(param)).then(res => {
      console.log('Res: ', res)
      setLoading(false)
      if (res?.payload?.esito === '1') {
        setDataNoti({
          status: STATUS_NOTIFY.ERROR,
          content: res?.payload?.motivo || 'error'
        })
        setTimeout(() => {
          setShowNoti(true)
        }, 500)
      } else {
        callAPIGetUserinfo()
        setDataNoti({
          status: STATUS_NOTIFY.SUCCESS,
          content: Translate(languageRedux).utente_salvato
        })
        setTimeout(() => {
          setShowNoti(true)
        }, 500)
      }
    }).catch(() => {
      setLoading(false)
    })
  }

  const callAPIGetUserinfo = () => {
    dispatch(apiGetUserInfo()).then(res => {
      console.log('res:', res.payload)
      const getuserInfo = res?.payload?.user
      if (getuserInfo) {
        Promise.all([
          dispatch(saveUserinfo(getuserInfo))
        ])
      }
      setLoading(false)
    }).catch(err => {
      console.log('err: ', err)
      setLoading(false)
    })
  }

  const _onPressPhoto = () => {
    photoDialogRef.current.show()
  }

  const renderChangeAvatar = () => {
    return (
      <View>
        <View style={styles.ctnAvatar}>
          <Image source={imgAvt ? imgAvt : imgAvatar.ic_profile_avatar} style={styles.avtStyle} />
          <TouchableOpacity
            onPress={_onPressPhoto}
            style={styles.ctnIconChangeAvt}>
            <Image source={imgAvatar.ic_camera} style={styles.iconChangeAvtStyle} />
          </TouchableOpacity>
        </View>
        <View style={styles.ctnUserName}>
          <Text style={customTxt(Fonts.Regular, 14, color363636).txt}>{userinfo?.username || ''}</Text>
        </View>
        <View style={styles.divider} />
      </View>
    )
  }

  const renderChangePassInPut = () => {
    return (
      <View style={styles.changePass}>
        <Text style={customTxt(Fonts.SemiBold, 14, color040404).txt}>{Translate(languageRedux).PASSWORD}</Text>
        <View style={styles.ctnLayout}>
          <View style={styles.styleInput}>
            <TextInput
              value={'********'}
              onChangeText={() => setPassword}
              secureTextEntry={true}
              style={[
                styles.txtinputStyle
              ]}
            />
          </View>
          <TouchableOpacity onPress={_onPressChange} style={styles.changeButton}>
            <Text style={[customTxt(Fonts.SemiBold, 16, colorFFFFFF).txt, styles.marginHori14]}>Change</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const _onPressChange = () => {
    NavigationService.navigate(Routes.CHANGE_PASSWORD_SCREEN)
  }

  const renderTextInput = () => {
    return (
      <View style={styles.ctnTextInput}>
        <CustomTextInput
          title={Translate(languageRedux).EMAIL}
          value={email || userinfo?.email}
          onChangeTxt={txt => setEmail(txt)}
          textStyle={styles.txtStyle}
        />
        {renderChangePassInPut()}
        <CustomTextInput
          title={Translate(languageRedux).FIRST_NAME}
          value={firstName}
          onChangeTxt={txt => {
            setUpdate(true)
            setFirstName(txt)
          }}
          textStyle={styles.txtStyle}
        />
        {
          country?.text === 'United States' && <CustomTextInput
            title={Translate(languageRedux).middlename}
            value={middleName}
            onChangeTxt={txt => {
              setUpdate(true)
              setMiddleName(txt)
            }}
            textStyle={styles.txtStyle}
          />
        }
        <CustomTextInput
          title={Translate(languageRedux).surname}
          value={lastName}
          onChangeTxt={txt => {
            setUpdate(true)
            setLastName(txt)
          }}
          textStyle={styles.txtStyle}
        />
        {/* <CustomTextInput
          title={'Birthday'}
          value={birthday}
          onChangeTxt={txt => setBirthday(txt)}
          textStyle={styles.txtStyle}
        /> */}
        <TextInputView
          title={Translate(languageRedux).birthday_member}
          value={birthday ? convertCalenderDDMMYYYY(birthday) : ''}
          placeholder={'DD.MM.YYYY'}
          onPress={() => {
            if (datePickerRef?.current) {
              datePickerRef?.current?.onPressDate()
            }
          }}
        // validate={birthday ? false : true}
        />
        <CustomTextInput
          title={Translate(languageRedux).placeOfBirth}
          value={birthPlace}
          onChangeTxt={txt => {
            setUpdate(true)
            setBirthPlace(txt)
          }}
          textStyle={styles.txtStyle}
        />
        {/* <CustomTextInput
          title={'Country'}
          value={country || userinfo?.country}
          onChangeTxt={txt => setCountry(txt)}
          textStyle={styles.txtStyle}
        /> */}
        <TextInputView
          title={Translate(languageRedux).ricettario}
          value={country?.text || ''}
          onChangeTxt={(txt) => setCountry(txt)}
          placeholder={Translate(languageRedux).select}
          onPressDropDown={() => setShowCountry(true)}
          imgStyle={styles.imgStyle}
          validate={country?.text ? false : true}
        />
      </View>
    )
  }

  const _onPressUpdate = () => {
    // if (isUpdate) {
    callAPIUpdate()
    // }
  }

  const renderSaveButton = () => {
    return (
      <View style={styles.marginHori20}>
        <TouchableOpacity
          onPress={_onPressUpdate}
          style={[
            styles.ctnSaveButton,
            isUpdate ? null : styles.opacity4
          ]}
          activeOpacity={isUpdate ? 1 : 0}>
          <Text style={
            customTxt(Fonts.SemiBold, 18, colorFFFFFF).txt
          }>{Translate(languageRedux).btnsave}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View>
        {renderChangeAvatar()}
        {renderTextInput()}
        {/* {renderSaveButton()} */}
      </View>
    )
  }

  const _callbackPhototo = (res) => {
    if ((res || []).length > 0) {
      console.log('res: ', res[0])
      setImgAvt(res[0])
      callAPIUploadImage(res[0])
    }
  }

  const _onChangeDatePicker = (date) => {
    setUpdate(true)
    setBirthday(date)
  }

  const callAPIUploadImage = (img) => {
    if (img?.res?.data) {
      const param = {
        'filetype': img?.type || 'image/jpeg',
        'filename': img?.res?.filename || '20211025_1428_saluberMD.png',
        'filesize': img?.res?.size || 100,
        'base64': img?.res?.data
      }
      console.log('res: ', img?.res?.filename)
      console.log('Param: ', param)
      setLoading(true)
      dispatch(apiUploadImageUser(param)).then(res => {
        console.log('apiUploadImageUser: ', res)

        if (res?.payload?.esito === '0') {
          setDataNoti({
            status: STATUS_NOTIFY.SUCCESS,
            content: Translate(languageRedux).AVATAR_UPDATE_SUCCESSFUL
          })
          setTimeout(() => {
            setShowNoti(true)
          }, 500)
          Promise.all([
            callAPIGetUserinfo()
          ])
        } else if (res?.type === 'apiUploadImageUser1') {
          setDataNoti({
            status: STATUS_NOTIFY.SUCCESS,
            content: Translate(languageRedux).AVATAR_UPDATE_SUCCESSFUL
          })
          setTimeout(() => {
            setShowNoti(true)
          }, 500)
          Promise.all([
            callAPIGetUserinfo()
          ])
        } else {
          setDataNoti({
            status: STATUS_NOTIFY.ERROR,
            content: res?.payload?.motivo || 'error'
          })
          setTimeout(() => {
            setShowNoti(true)
          }, 500)
          setLoading(false)
        }
      }).catch(() => {
        setLoading(false)
      })
    }
  }

  return (
    <View style={styles.contain}>
      <Header
        textCenter={Translate(languageRedux).PROFILE_INFO}
        backgroundColor={colorFFFFFF}
        iconLeft={imgHeader.ic_left}
        onPressLeft={() => { NavigationService.goBack() }}
        textRight={Translate(languageRedux).btnsave}
        txtRightStyle={customTxt(Fonts.Medium, 16, isUpdate ? color3777EE : colorA7A8A9).txt}
        onPressRight={_onPressUpdate}
      />
      <KeyboardAwareScrollView contentContainerStyle={styles.contentContainerStyles}>
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
        date={birthday || getDate112000()}
      />
      {
        isShowCountry && (
          <SearchListWithName
            listData={COUNTRIES}
            title={`${Translate(languageRedux).select} ${Translate(languageRedux).ricettario}`}
            itemSelected={country}
            onItemClick={(val) => {
              setUpdate(true)
              setCountry(val)
              setShowCountry(false)
            }}
            onPressRight={() => {
              setShowCountry(false)
            }}
            isText={true}
          />
        )
      }
      {isLoading && <LoadingView />}
      <NotificationView
        status={dataNoti?.status || STATUS_NOTIFY.ERROR}
        isShow={isNoti}
        setShow={(val) => setShowNoti(val)}
        content={dataNoti?.content || ''}
        style={styles.stylesView}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  contain: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  ctnAvatar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  avtStyle: {
    height: 80,
    width: 80,
    borderRadius: 40
  },
  iconChangeAvtStyle: {
    height: 16,
    width: 16,
    resizeMode: 'contain'
  },
  ctnIconChangeAvt: {
    height: 24,
    width: 24,
    backgroundColor: colorFFFFFF,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -24
  },
  ctnUserName: {
    alignItems: 'center',
    marginTop: 8
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: colorF0F0F0,
    marginTop: 16
  },
  ctnTextInput: {
    marginHorizontal: 20
  },
  txtStyle: {
    marginTop: 16
  },
  marginHori20: {
    marginHorizontal: 20
  },
  ctnSaveButton: {
    height: 56,
    width: '100%',
    borderRadius: 12,
    backgroundColor: color3777EE,
    marginTop: 90,
    marginBottom: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  opacity4: {
    opacity: 0.4
  },
  changePass: {
    marginTop: 16
  },
  styleInput: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  txtinputStyle: {
    width: '100%',
    color: colorA7A8A9
  },
  changeButton: {
    height: 48,
    backgroundColor: color3777EE,
    marginLeft: -84,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    borderColor: color3777EE
  },
  marginHori14: {
    marginHorizontal: 14
  },
  ctnLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    width: '100%',
    marginTop: 4,
    borderRadius: 12,
    paddingLeft: 10,
    color: colorA7A8A9,
    borderColor: colorDDDEE1,
    borderWidth: 1
  },
  imgStyle: {
    width: 12,
    height: 6
  },
  contentContainerStyles: {
    paddingBottom: 40
  }
})
