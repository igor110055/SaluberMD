import React, { useEffect, useState } from 'react'
import {
  StyleSheet, View, Text, Image,
  ScrollView, TouchableOpacity,
  StatusBar, Dimensions, Platform
} from 'react-native'
import {
  color040404, color2F80ED, color3777EE, colorFFFFFF,
  colorA7A8A9, colorF5455B, colorF8F8F8
} from '../../constants/colors'
import { border, customTxt } from '../../constants/css'
import Fonts from '../../constants/Fonts'
import imgAccount from '../../../assets/images/account'
import { Switch } from 'react-native-switch'
import PhotoDialog from '../../components/PhotoDialog'
import TouchID from 'react-native-touch-id'
import NavigationService from '../../navigation'
import Routes from '../../navigation/Routes'
import PopupChangePassword from './components/PopupChangePassword'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import { STORAGE_KEY } from '../../constants/define'
import Header from '../../components/Header'
import { apiGetUserInfo, apiPostUnregisterPush } from '../../api/Auth'
import imgHealthProfile from '../../../assets/images/health_profile'
import { saveFaceId, saveToken, saveUserinfo } from '../../actions/user'
import LoadingView from '../../components/LoadingView'
import Translate from '../../translate'
import imgLoginSignup from '../../../assets/images/login_signup'
import SearchListWithName from '../../components/SearchListWithName'
import * as defines from '../../constants/define'
import { saveLanguage, saveLSAppoitment, saveLSRequestAppoitment } from '../../actions/common'
import _ from 'lodash'
import DialogCustom from '../../components/DialogCustom'
import Icon from 'react-native-vector-icons/AntDesign'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
import { apiCheckPermission } from 'api/MedicalRecord'
import axios from 'axios'
import * as APIs from '../../api/APIs'
import DeviceInfo from 'react-native-device-info'
import imgMember from '../../../assets/images/members'
import imgHeader from '../../../assets/images/header'
import { apiPOSTSwitchToMainUser } from 'api/Member'

export default function Account({ }) {
  const userinfo = useSelector(state => state.user.userinfo)
  const [isEnabledSwitch, setEnabledSwitch] = useState(false)
  const photoDialogRef = React.createRef()
  const [imgAvt, setImgAvt] = useState()
  const [isFaceID, setFaceID] = useState(0)
  const [isChangePass, setChangePass] = useState(false)
  const [currentPass, setCurrentPass] = useState()
  const [newPass, setNewPass] = useState()
  const [confirmPass, setConfirmPass] = useState()
  const dispatch = useDispatch()
  const [isDialog, setDialog] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const languageRedux = useSelector(state => state.common.language)
  const [language, setLanguage] = useState()
  const [showLanguage, setShowLanguage] = useState(false)
  const getLsLanguage = useSelector(state => state.common.lsLanguage)
  const [isShowNoti, setShowNoti] = useState()
  const [dataNoti, setDataNoti] = useState()
  const [permission, setPermission] = useState()
  const token = useSelector(state => state.user.token)
  const [oldToken, setOldToken] = useState('')

  useEffect(() => {
    if (userinfo?.userImage) {
      var base64 = `data:image/png;base64,${userinfo?.userImage}`
      setImgAvt({ uri: base64 })
    }
  }, [userinfo])

  useEffect(() => {
    const optionalConfigObject = {
      unifiedErrors: false, // use unified error messages (default false)
      passcodeFallback: false // if true is passed, itwill allow isSupported to return an error if the device is not enrolled in touch id/face id etc. Otherwise, it will just tell you what method is supported, even if the user is not enrolled.  (default false)
    }
    getIsFaceId()
    callAPIGetUserinfo()
    checkFaceID()

    TouchID.isSupported(optionalConfigObject)
      .then(biometryType => {
        if (biometryType === 'FaceID') {
          setFaceID(2)
          console.log('Face ID')
        } else {
          setFaceID(1)
          console.log('Touch ID')
        }
      })
      .catch(error => {
        console.log(error)
        setFaceID(0)
      })
  }, [])

  useEffect(() => {
    const filterIndex = _.findIndex(defines.LANGUAGE, { value: languageRedux })
    if (filterIndex > 0) {
      setLanguage(defines.LANGUAGE[filterIndex])
    }
  }, [getLsLanguage])

  const checkFaceID = async () => {
    const isFace = await AsyncStorage.getItem(STORAGE_KEY.IS_FACE_ID)
    setEnabledSwitch(isFace === 'true')
  }

  const updateLanguageID = (id) => {
    axios({
      method: 'put',
      url: `${APIs.hostAPI}backoffice/updateLanguage/${id}`,
      headers: {
        'x-auth-token': token
      }
    })
      .then(response => {
        console.log('data: ', response.data)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
  }

  const getIsFaceId = async () => {
    const isFace = await AsyncStorage.getItem(STORAGE_KEY.IS_FACE_ID)
    if (isFace === 'true') {
      setEnabledSwitch(true)
    } else {
      setEnabledSwitch(false)
    }

    const getold = await AsyncStorage.getItem(STORAGE_KEY.OLD_TOKEN)
    setOldToken(getold || '')
  }

  const callAPIGetUserinfo = () => {
    // setLoading(true)
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

  useEffect(() => {
    callAPICheckPermission()
  }, [])

  const callAPICheckPermission = () => {
    const params = {
      build: DeviceInfo.getBuildNumber(),
      isIOS: Platform.OS === 'ios',
      uuid: DeviceInfo.getUniqueId(),
      version: DeviceInfo.getVersion()
    }
    dispatch(apiCheckPermission(params)).then(res => {
      console.log('callAPICheckPermission Res: ', res)
      setPermission(res?.payload)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }

  const renderContent = () => {

    const renderUploadPicture = () => {
      return (
        <View style={[
          styles.avtView,
          border(null, 2).borderB
        ]}>
          <Image
            source={imgAvt ? imgAvt : imgAccount.ic_profile_avatar}
            style={styles.imgAvt}
          />
          <View style={styles.rightUserName}>
            <Text
              numberOfLines={1}
              style={[
                customTxt(Fonts.SemiBold, 20, color040404).txt,
                styles.styleUsername
              ]}>{userinfo?.nome || ''} {userinfo?.cognome}</Text>
            <Text
              onPress={() => {
                if (permission?.isDoctor === true) {
                  return NavigationService.navigate(Routes.MY_PROFILES_DOCTOR_SCREEN)
                } else {
                  return NavigationService.navigate(Routes.PROFILE_INFO_SCREEN)
                }
              }}
              style={[
                customTxt(Fonts.Medium, 12, color3777EE).txt
              ]}>{Translate(languageRedux).VIEW_MY_PROFILE}</Text>
          </View>
        </View>
      )
    }

    const HeaderView = ({ title }) => {
      return (
        <View style={styles.headerView}>
          <Text style={[
            customTxt(Fonts.SemiBold, 12, colorA7A8A9).txt
          ]}>{title}</Text>
        </View>
      )
    }

    const _onPressSwitch = () => {
      if (isFaceID === 0) {
        setShowNoti(true)
        setDataNoti({
          status: STATUS_NOTIFY.WARNING,
          content: Translate(languageRedux).DEVICE_IS_NOT_SUPPORTED
        })
        return
      }
      if (!isEnabledSwitch) {
        TouchID.authenticate(`Confirm ${isFaceID === 1 ? 'fingerprint' : 'face ID'} to continue`).then(() => {
          // setUser(userSave)
          // setPass(passSave)
          setEnabledSwitch(true)
          Promise.all([
            dispatch(saveFaceId(true)),
            AsyncStorage.setItem(STORAGE_KEY.IS_FACE_ID, 'true')
          ])
        }).catch(err => {
          console.log('Err: ', err)
          setEnabledSwitch(false)
        })
      } else {
        Promise.all([
          dispatch(saveFaceId(false)),
          AsyncStorage.setItem(STORAGE_KEY.IS_FACE_ID, 'false')
        ])
      }
      setEnabledSwitch(!isEnabledSwitch)
    }

    const CustomTouchSetting = ({
      title, content, renderComponent, icon, onPress, name
    }) => {
      return (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={onPress ? 0 : 1}
          style={[
            styles.settingTouchV,
            border(null, 2).borderB
          ]}>
          <View style={styles.centerSettingV}>
            <View style={styles.ctnIcon}>
              {icon && <Image style={styles.imgFingerprint} source={icon} />}
              {name && <Icon name={name} size={24} color={color3777EE} />}
            </View>
            <View style={styles.flex1}>
              <Text style={[
                customTxt(Fonts.Bold, 14, color040404).txt,
                styles.txtSettingTitle
              ]}>{title}</Text>
              {
                content && (
                  <Text style={[
                    customTxt(Fonts.Regular, 12, colorA7A8A9).txt
                  ]}>{content}</Text>
                )
              }
            </View>
            {renderComponent ? renderComponent() : null}
          </View>
        </TouchableOpacity>
      )
    }

    const renderFingerFaceID = () => {
      return (
        <Switch
          onValueChange={_onPressSwitch}
          value={isEnabledSwitch}
          renderActiveText={false}
          renderInActiveText={false}
          backgroundActive={color2F80ED}
        />
      )
    }

    const renderRightNextView = () => {
      return (
        <Image source={imgHealthProfile.ic_right} style={styles.imgRight} />
      )
    }

    const _onPressLanguage = () => {
      setShowLanguage(true)
    }

    const _onPressUnit = () => {
      NavigationService.navigate(Routes.SETTING_UNIT_SCREEN)
    }

    const _onPressNoti = () => {
      NavigationService.navigate(Routes.NOTI_SETTING_SCREEN)
    }

    const _onPressViewAllMembers = () => {
      NavigationService.navigate(Routes.ALL_MEMBERS_VIEW)
    }

    const _onPressBackMain = async () => {
      setLoading(true)
      dispatch(apiPOSTSwitchToMainUser({
        jwt: oldToken
      })).then(res => {
        console.log('res: ', res?.payload)
        if (res?.payload?.esito === '0') {
          Promise.all([
            AsyncStorage.setItem(STORAGE_KEY.TOKEN, `${oldToken}`),
            AsyncStorage.setItem(STORAGE_KEY.IS_FACE_ID, 'false'),
            dispatch(saveToken(`${oldToken}`)),
            AsyncStorage.setItem(STORAGE_KEY.OLD_TOKEN, '')
          ])

          setShowNoti(true)
          setDataNoti({
            esito: '0',
            motivo: Translate(languageRedux).MSG_WELCOME_BACK
          })

          setTimeout(() => {
            setLoading(false)
            NavigationService.navigateAndReset(Routes.SPLASH_SCREEN)
          }, 1000)
        } else {
          setLoading(false)
          setShowNoti(true)
          setDataNoti({
            esito: '1',
            motivo: Translate(languageRedux).MSG_LOGIN_ERROR
          })
        }
      })
    }

    const renderSettings = () => {
      return (
        <>
          <HeaderView title={Translate(languageRedux).SETTINGS} />
          <CustomTouchSetting
            title={Translate(languageRedux).BIOMETRICS_AUTHENTICATION}
            content={Translate(languageRedux).FINGERPRINT_FACE_ID_IRIS}
            icon={imgLoginSignup.ic_touchid}
            renderComponent={renderFingerFaceID}
          />
          <CustomTouchSetting
            title={Translate(languageRedux).LANGUAGE_TYPE}
            content={language?.name || Translate(languageRedux).SAME_AS_HEALTH_PROFILE}
            icon={imgAccount.ic_language}
            renderComponent={renderRightNextView}
            onPress={_onPressLanguage}
          />
          {/* <CustomTouchSetting
            title={Translate(languageRedux).date}
            content={'DD.MM.YYYY'}
            icon={imgAccount.ic_calendar}
            renderComponent={renderRightNextView}
          /> */}
          <CustomTouchSetting
            title={Translate(languageRedux).unit}
            content={'Height, Weight, Temperature'}
            name={'setting'}
            renderComponent={renderRightNextView}
            onPress={_onPressUnit}
          />
          {permission?.iniziativa?.notificationsSettings === '1' && !permission?.isDoctor && <CustomTouchSetting
            title={Translate(languageRedux).NOTIFICATIONS_TITLE}
            content={'On/Off'}
            name={'bells'}
            renderComponent={renderRightNextView}
            onPress={_onPressNoti}
          />}
          {/* {!permission?.isDoctor && permission?.iniziativa?.familyMember === '1' && <CustomTouchSetting
            title={Translate(languageRedux).sub_members}
            content={null}
            icon={imgMember.ic_team_3}
            renderComponent={renderRightNextView}
            onPress={_onPressViewAllMembers}
          />}
          {!permission?.isDoctor && oldToken !== '' && <CustomTouchSetting
            title={Translate(languageRedux).MAIN_USER}
            content={null}
            icon={imgHeader.ic_left}
            onPress={_onPressBackMain}
          />} */}
          {/* <HeaderView title={Translate(languageRedux).txtSupport} />
          <CustomTouchSetting
            title={Translate(languageRedux).txtFAQs}
            icon={imgAccount.ic_faq}
          />
          <CustomTouchSetting
            title={Translate(languageRedux).txtHelpCenter}
            icon={imgAccount.ic_help}
          /> */}
          {/* <HeaderView title={`${Translate(languageRedux).APP_VERSION}: ${DeviceInfo.getVersion()}(${DeviceInfo.getBuildNumber()})`} /> */}
        </>
      )
    }

    return (
      <View style={[
        styles.container,
        border().borderT
      ]}>
        <ScrollView>
          {renderUploadPicture()}
          {renderSettings()}
        </ScrollView>
      </View>
    )
  }

  const onPressDialogLogout = async () => {
    setDialog(true)
  }

  const renderLogoutView = () => {
    return (
      <View style={[
        styles.logoutView
      ]}>
        <TouchableOpacity
          onPress={onPressDialogLogout}
          style={[
            styles.toLogout,
            border(colorF5455B).border
          ]}
        >
          <Text style={[
            customTxt(Fonts.Bold, 16, colorF5455B).txt,
            styles.txtLogout
          ]}>{Translate(languageRedux).LOGOUT_BTN}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const _callbackPhototo = (res) => {
    console.log('res: ', res)
    setImgAvt(res)
  }

  const _onPressCancelChange = () => {
    setChangePass(false)
  }

  const _onPressChange = () => {
    setChangePass(false)
  }

  const _onPressCancel = () => {
    setDialog(false)
  }

  const _onPressLogout = async () => {
    setDialog(false)
    setLoading(true)
    Promise.all([
      AsyncStorage.setItem(STORAGE_KEY.TOKEN, ''),
      AsyncStorage.setItem(STORAGE_KEY.OLD_TOKEN, ''),
      dispatch(saveLSAppoitment([])),
      dispatch(saveLSRequestAppoitment([])),
      dispatch(saveUserinfo([]))
    ])

    const udidv4 = await DeviceInfo.getUniqueId()
    console.log('Token callAPIRegisterDevice: ', udidv4)
    const getDeviceToken = await AsyncStorage.getItem(STORAGE_KEY.DEVICE_TOKEN)
    const param = {
      'deviceUUID': udidv4,
      'platform': Platform.OS === 'ios' ? 'ios' : 'pushy',
      'token': getDeviceToken
    }
    console.log('Token param: ', param)
    dispatch(apiPostUnregisterPush(param)).then(res => {
      return NavigationService.navigate(isEnabledSwitch ? Routes.WAITING_FACE_ID_SCREEN : Routes.LOGIN_SCREEN)
    }).catch(() => {
      return NavigationService.navigate(isEnabledSwitch ? Routes.WAITING_FACE_ID_SCREEN : Routes.LOGIN_SCREEN)
    })
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white" />
      <Header
        textCenter={Translate(languageRedux).ACCOUNT}
        backgroundColor={colorFFFFFF}
        iconLeft={imgAccount.ic_menu_black}
        onPressLeft={() => NavigationService.openDrawer()}
      />
      {renderContent()}
      {renderLogoutView()}
      <PhotoDialog
        actionSheetRef={photoDialogRef}
        callbackPhoto={_callbackPhototo}
      />
      {
        isChangePass ?
          <PopupChangePassword
            onPressCancel={_onPressCancelChange}
            onPressConfirm={_onPressChange}
            currentPass={currentPass}
            setCurrentPass={(txt) => setCurrentPass(txt)}
            newPass={newPass}
            setNewPass={(txt) => setNewPass(txt)}
            confirmPass={confirmPass}
            setConfirmPass={(txt) => setConfirmPass(txt)}
          />
          : null
      }
      {
        isDialog && (
          <DialogCustom
            title={Translate(languageRedux).ARE_YOU_SURE_WANT_TO_LOG_OUT}
            txtlLeft={Translate(languageRedux).cancel}
            onPressCancel={_onPressCancel}
            txtRight={Translate(languageRedux).LOGOUT_BTN}
            onPressOK={_onPressLogout}
          />
        )
      }
      {
        showLanguage && (
          <SearchListWithName
            listData={getLsLanguage}
            title={`${Translate(languageRedux).select} ${Translate(languageRedux).LANGUAGE_TYPE}`}
            itemSelected={language}
            onItemClick={(val) => {
              setLanguage(val)
              updateLanguageID(val?.value)
              setShowLanguage(false)
              defines.language = val?.value
              Promise.all([
                dispatch(saveLanguage(val?.value)),
                AsyncStorage.setItem(STORAGE_KEY.LANGUAGE, val?.value)
              ])
            }}
            onPressRight={() => {
              setShowLanguage(false)
            }}
          />
        )
      }
      {isLoading && <LoadingView />}
      <NotificationView
        isShow={isShowNoti}
        setShow={() => setShowNoti(false)}
        status={dataNoti?.esito === '1' ? STATUS_NOTIFY.ERROR : STATUS_NOTIFY.SUCCESS}
        content={dataNoti?.motivo || ''}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  logoutView: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  toLogout: {
    width: Dimensions.get('window').width - 40,
    height: 56,
    backgroundColor: colorFFFFFF,
    marginBottom: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12
  },
  txtLogout: {
    fontWeight: '600'
  },
  avtView: {
    flexDirection: 'row',
    backgroundColor: colorFFFFFF
  },
  imgAvt: {
    width: 56,
    height: 56,
    borderRadius: 56 / 2,
    overflow: 'hidden',
    marginTop: 24,
    marginLeft: 20,
    marginBottom: 24
  },
  btStyle: {
    backgroundColor: color2F80ED,
    borderRadius: 4,
    overflow: 'hidden'
  },
  txtButotn: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 24,
    marginRight: 24
  },
  rowView: {
    flexDirection: 'row'
  },
  rightUserName: {
    flex: 1,
    marginLeft: 16,
    marginTop: 24
  },
  styleUsername: {
    marginTop: 8
  },
  usernameView: {
    marginTop: 16,
    marginLeft: 20,
    marginRight: 20,
    paddingBottom: 16
  },
  txtName: {
    marginTop: 12,
    marginBottom: 20,
    height: 24
  },
  languageButton: {
    flexDirection: 'row',
    marginTop: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  txtLanguage: {
    flex: 1,
    marginTop: 13,
    marginBottom: 13,
    marginLeft: 20,
    marginRight: 20,
    height: 24
  },
  imgDropDown: {
    width: 12,
    height: 8,
    resizeMode: 'contain',
    marginRight: 21
  },
  headerView: {
    height: 40,
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20
  },
  imgFingerprint: {
    width: 24,
    height: 24
  },
  ctnIcon: {
    height: 40,
    width: 40,
    backgroundColor: colorF8F8F8,
    borderRadius: 20,
    marginTop: 17,
    marginLeft: 20,
    marginBottom: 16,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  settingTouchV: {
    backgroundColor: colorFFFFFF,
    justifyContent: 'space-between'
  },
  centerSettingV: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20
  },
  flex1: {
    flex: 1
  },
  imgRight: {
    width: 24,
    height: 24
  },
  txtSettingTitle: {
    marginTop: 2,
    marginBottom: 3
  }
})
