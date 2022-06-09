import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions, DeviceEventEmitter } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { color3777EE, colorA7A8A9, colorFFFFFF } from 'constants/colors'
import Translate from '../../../translate'
import icHeader from '../../../../assets/images/header'
import Header from 'components/Header'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Fonts from 'constants/Fonts'
import LoadingView from 'components/LoadingView'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
import PersonalInfoView from './PersonalInfo'
import ConsultingView from './Consulting'
import AccountDoctorView from './Account'
import HoursDonationView from './HoursDonation'
// import imgMyProfiles from '../../../../assets/images/my_profiles_doc'
import { apiGetUserInfo, apiGetVirtualOffice, apiUpdateVirtualOffice, apiUploadImageUser } from 'api/Auth'
import EditYourPersonalInfoView from './EditYourPersonalInfo'
import PhotoDialog from 'components/PhotoDialog'
import { saveUserinfo } from 'actions/user'
import EditAccountInfo from './EditAccountInfo'
import { useNavigation } from '@react-navigation/native'
import SearchListWithName from 'components/SearchListWithName'
import * as defines from '../../../constants/define'
import AsyncStorage from '@react-native-community/async-storage'
import { saveLanguage } from 'actions/common'
import { apiGetSpecialty } from 'api/Common'
import _ from 'lodash'
import MultupleChooseView from './components/MultupleChooseView'
import SignatureView from './SignatureView'
import NewFeeView from './NewFeeView'
import { apiGetFees } from 'api/Fees'

const Tab = createMaterialTopTabNavigator()

export default function MyPrifilesDoctorView() {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const summaryRedux = useSelector(state => state.user.summary)
  const languageRedux = useSelector(state => state.common.language)
  const [isLoading, setLoading] = useState(true)
  const [dataNoti, setDataNoti] = useState()
  const [isShowNoti, setShowNoti] = useState(false)
  const [isPopup, setShowPopup] = useState(false)
  const [virtualOffice, setVirtualOffice] = useState()
  const [isPopupEdit, setPopupEdit] = useState(false)
  const photoDialogRef = React.createRef()
  const [isEdit, setEditView] = useState(false)
  const [showLanguage, setShowLanguage] = useState()
  const [language, setLanguage] = useState()
  const getLsLanguage = useSelector(state => state.common.lsLanguage)
  const [lsSpecialty, setLsSpecialty] = useState([])
  //change your personal info
  const [genderChanged, setGenderChange] = useState()
  const [isShowGender, setShowGender] = useState(false)
  const GENDERS = [
    { name: Translate(languageRedux).male, id: 0 },
    { name: Translate(languageRedux).female, id: 1 },
    { name: Translate(languageRedux).I_WOULD_RATHER_NOT_SAY, id: 2 }
  ]

  // speciality
  const [isShowSpeciality, setShowSpeciality] = useState(false)
  const [isUpdate, setUpdate] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)
  const [isNewFees, setShowNew] = useState(false)
  const [dataEditFees, setDataEditFees] = useState()

  const [fees, setFees] = useState([])
  const [refreshing, setRefresh] = useState(false)
  const userInfo = useSelector(state => state.user.userinfo)

  useEffect(() => {
    callAPIGetVirtual()
    const getName = (getLsLanguage || []).filter(val => val?.value === userInfo?.language_id)
    setLanguage({
      'name': getName.length > 0 ? getName[0].name : '',
      'value': languageRedux,
      'idOpt': '1',
      'attr': null
    })
  }, [toggleReload])

  useEffect(() => {
    var getGender = Number(summaryRedux?.gender || 0)
    if (getGender > 3 || getGender < 0) {
      getGender = 2
    }
    setGenderChange(GENDERS[getGender])
    setLsSpecialty(convertLsSpecialty(lsSpecialty))
  }, [virtualOffice, isPopupEdit])

  useEffect(() => {
    setTimeout(() => {
      callAPIGetSpecialty()
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    }, 1000)
  }, [virtualOffice])

  //** Function */
  const callAPIGetVirtual = () => {
    setLoading(true)
    dispatch(apiGetVirtualOffice()).then(res => {
      if (res?.payload?.virtualoffice) {
        setVirtualOffice(res?.payload?.virtualoffice)
        console.log('apiGetVirtualOffice: ', res?.payload?.virtualoffice)
      }

      setTimeout(() => {
        setLoading(false)
      }, 2000)
    }).catch(() => {
      setLoading(false)
    })
  }

  const callAPIGetSpecialty = () => {
    dispatch(apiGetSpecialty()).then(res => {
      const getLS = res?.payload?.specialty || []
      if (getLS.length > 0) {
        setLsSpecialty(convertLsSpecialty(getLS))
      }
    })
  }

  const convertLsSpecialty = (data) => {
    const lsData = virtualOffice?.specializations || []
    const newData = (data || []).map(val => {
      if (_.includes(lsData, Number(val?.value || '-1'))) {
        return {
          label: val?.label,
          value: val?.value,
          isSelected: true
        }
      } else {
        return {
          label: val?.label,
          value: val?.value
        }
      }
    })
    return newData
  }

  const callAPIUpdateVirtualOffice = (email, locale, firstName, lastName, lengthPractice, officeAddress, phone, signature, licenseNumber, school) => {
    const getLSSpecializations = (lsSpecialty.filter(val => val?.isSelected)).map(val2 => {
      return Number(val2?.value)
    })
    const getLSSpecializationsName = (lsSpecialty.filter(val => val?.isSelected)).map(val2 => {
      return val2?.label
    })
    const params = {
      address: officeAddress || virtualOffice?.address,
      background: virtualOffice?.background,
      btnpicture: virtualOffice?.btnpicture,
      cf: virtualOffice?.cf,
      country: virtualOffice?.country,
      email: email || virtualOffice?.email,
      heightUnit: virtualOffice?.heightUnit,
      idspecialization: virtualOffice?.idspecialization,
      lengthpractice: lengthPractice || virtualOffice?.lengthpractice,
      licenseNumber: licenseNumber || virtualOffice?.licenseNumber,
      locale: locale || virtualOffice?.locale,
      name: firstName || virtualOffice?.name,
      npi: virtualOffice?.npi,
      phone: phone || virtualOffice?.phone,
      providerId: virtualOffice?.providerId,
      school: school || virtualOffice?.school,
      signature: signature || virtualOffice?.signature,
      signaturealt: virtualOffice?.signaturealt,
      specializationName: getLSSpecializationsName || virtualOffice?.specializationName,
      specializations: getLSSpecializations || virtualOffice?.specializations,
      stateslicense: virtualOffice?.stateslicense,
      strongAuthentication: virtualOffice?.strongAuthentication,
      surname: lastName || virtualOffice?.surname,
      timezone: (new Date()).getTimezoneOffset(),
      weightUnit: virtualOffice?.weightUnit
    }
    console.log('params: ', params)
    setLoading(true)
    dispatch(apiUpdateVirtualOffice(params)).then(res => {
      console.log('res: ', res?.payload)
      setLoading(false)
      if (res?.payload?.esito === '0') {
        setEditView(false)
        setPopupEdit(false)
        defines.language = locale
        Promise.all([
          dispatch(saveLanguage(locale)),
          AsyncStorage.setItem(defines.STORAGE_KEY.LANGUAGE, locale)
        ])

        setDataNoti({
          status: STATUS_NOTIFY.SUCCESS,
          content: Translate(languageRedux).confirmation_success
        })
        setTimeout(() => {
          setShowNoti(true)
          setToggleReload(Math.random())
        }, 500)
      } else {
        setDataNoti({
          status: STATUS_NOTIFY.ERROR,
          content: res?.payload?.motivo || 'error'
        })
        setTimeout(() => {
          setShowNoti(true)
        }, 500)
      }
    })
  }

  // const _onPress = () => {
  //   setShowPopup(!isPopup)
  // }

  const _callbackPhototo = (res) => {
    if ((res || []).length > 0) {
      callAPIUploadImage(res[0])
    }
  }

  const callAPIUploadImage = (img) => {
    if (img?.res?.data) {
      const param = {
        'filetype': img?.type || 'image/jpeg',
        'filename': img?.res?.filename || '20211025_1428_saluberMD.png',
        'filesize': img?.res?.size || 100,
        'base64': img?.res?.data
      }
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

  const callAPIGetUserinfo = () => {
    dispatch(apiGetUserInfo()).then(res => {
      console.log('apiGetUserInfo:', res.payload)
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

  useEffect(() => {
    callAPIFees()
  }, [refreshing])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('CONSULTING', () => {
      setLoading(true)
      callAPIFees()
    })

    return () => subscription.remove()
  }, [])

  const callAPIFees = () => {
    dispatch(apiGetFees()).then(res => {
      console.log('apiGetFees: ', res?.payload)
      setRefresh(false)
      if (res?.payload?.esito === '0') {
        setFees(res?.payload?.initiatives || [])
      } else {
        setDataNoti({
          status: STATUS_NOTIFY.ERROR,
          content: res?.payload?.motivo || 'error'
        })
        setTimeout(() => {
          setShowNoti(true)
        }, 500)
      }
      setTimeout(() => {
        setLoading(false)
      }, 2000)
    }).catch(() => {
      setLoading(false)
      setRefresh(false)
    })
  }

  //******renderView

  // const renderHoursDonation = () => {
  //   return (
  //     <TouchableOpacity style={styles.hoursView} onPress={_onPress}>
  //       <Image source={imgMyProfiles.ic_clock} style={styles.imgHoursDonation} />
  //       <Text style={[
  //         customTxt(Fonts.Bold, 14, colorFFFFFF).txt
  //       ]}>{Translate(languageRedux).HOURS_DONATION}</Text>
  //     </TouchableOpacity>
  //   )
  // }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_left}
        textCenter={Translate(languageRedux).PATIENT_PROFILE_OPT1}
        onPressLeft={() => {
          navigation.goBack()
        }}
      />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: color3777EE,
          tabBarInactiveTintColor: colorA7A8A9,
          tabBarLabelStyle: {
            fontSize: 14,
            textTransform: 'none',
            fontFamily: Fonts.SemiBold
          },
          tabBarStyle: {
            height: 52,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16
          },
          tabBarIndicatorStyle: {
            height: 4,
            width: 76,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            marginHorizontal: ((Dimensions.get('window').width) / 3 - 76) / 2
          }
        }}>
        <Tab.Screen
          name={'PersonalInfoView'}
          options={{ tabBarLabel: Translate(languageRedux).datipersonali || '' }}
          component={() => <PersonalInfoView
            virtualOffice={virtualOffice}
            onPressEdit={() => setPopupEdit(true)}
            onPressPhoto={_onPressPhoto}
            lsSpecialty={lsSpecialty}
          />
          }
        />
        <Tab.Screen
          name={'ConsultingView'}
          options={{ tabBarLabel: Translate(languageRedux).CONSULTING || '' }}
          component={() => <ConsultingView
            virtualOffice={virtualOffice}
            onPressUpdate={() => setUpdate(true)}
            onPressNewFee={() => setShowNew(true)}
            onPressEdit={(val) => {
              setDataEditFees(val)
              setTimeout(() => {
                setShowNew(true)
              }, 300)
            }}
            fees={fees}
            refreshing={refreshing}
            setRefresh={val => setRefresh(val)}
          />}
        />
        <Tab.Screen
          name={'AccountDoctorView'}
          options={{ tabBarLabel: Translate(languageRedux).ACCOUNT || '' }}
          component={() => <AccountDoctorView
            virtualOffice={virtualOffice}
            isEdit={isEdit}
            setEditView={val => setEditView(val)}
            language={language}
          />}
        />
      </Tab.Navigator>
      {/* {
        isDropDuration && (
          <SearchListWithName
            listData={duration}
            title={`${Translate(languageRedux).SELECT_AN_OPTION}`}
            itemSelected={selectedDuration}
            onItemClick={(val) => {
              setSelectedDuration(val)
              setDropDuration(false)
            }}
            onPressRight={() => {
              setDropDuration(false)
            }}
            hideSearchText={true}
            isValue={true}
          />
        )
      } */}
      {/* {renderHoursDonation()} */}
      {
        isPopup && (
          <HoursDonationView
            onPressClose={() => setShowPopup(false)}
          />
        )
      }
      {
        isPopupEdit && (
          <EditYourPersonalInfoView
            onPressClose={() => setPopupEdit(false)}
            virtualOffice={virtualOffice}
            onPressEdit={(firstName, lastName, lengthPractice, officeAddress, phone, licenseNumber, school) => {
              callAPIUpdateVirtualOffice(null, null, firstName, lastName, lengthPractice, officeAddress, phone, null ,licenseNumber, school)
            }}
            onPressGender={() => setShowGender(true)}
            genderChanged={genderChanged}
            onPressSpeciality={() => setShowSpeciality(true)}
          />
        )
      }
      {
        isEdit && (
          <EditAccountInfo
            onPressClose={() => setEditView(false)}
            virtualOffice={virtualOffice}
            setShowLanguage={() => setShowLanguage(true)}
            language={language}
            onPressEdit={(email) => {
              callAPIUpdateVirtualOffice(email, language?.value)
            }}
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
              setShowLanguage(false)
            }}
            onPressRight={() => {
              setShowLanguage(false)
            }}
          />
        )
      }
      {
        isShowGender && (
          <SearchListWithName
            listData={GENDERS}
            title={`${Translate(languageRedux).select} ${Translate(languageRedux).gender1}`}
            itemSelected={genderChanged}
            onItemClick={(val) => {
              DeviceEventEmitter.emit('EditYourPersonalInfoView', { genderChanged: val, lsSpecialty: lsSpecialty })
              setGenderChange(val)
              setShowGender(false)
            }}
            onPressRight={() => { setShowGender(false) }}
            hideSearchText={true}
          />
        )
      }
      {
        isShowSpeciality && (
          <MultupleChooseView
            title={Translate(languageRedux).SPECIALITY}
            lsData={lsSpecialty || []}
            onPressRight={() => setShowSpeciality(false)}
            isLabel={true}
            onPressSave={(val) => {
              setLsSpecialty(val)
              setShowSpeciality(false)
              DeviceEventEmitter.emit('EditYourPersonalInfoView', { genderChanged: genderChanged, lsSpecialty: val })
            }}
          />
        )
      }
      {
        isUpdate && (<SignatureView
          onPressClose={() => setUpdate(false)}
          onOK={val => {
            console.log('val : ', val)
            callAPIUpdateVirtualOffice(null, null, null, null, null, null, null, val)
            setUpdate(false)
          }}
          signBase64={virtualOffice?.signature}
        />
        )
      }
      {
        isNewFees && (
          <NewFeeView
            onPressClose={() => {
              setShowNew(false)
              setDataEditFees()
            }}
            dataEdit={dataEditFees}
          />
        )
      }
      {isLoading && <LoadingView />}
      <NotificationView
        isShow={isShowNoti}
        setShow={() => setShowNoti(false)}
        status={dataNoti?.status || STATUS_NOTIFY.ERROR}
        content={dataNoti?.content || ''}
      />
      <PhotoDialog
        actionSheetRef={photoDialogRef}
        callbackPhoto={_callbackPhototo}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  hoursView: {
    position: 'absolute',
    flexDirection: 'row',
    right: 16,
    bottom: 60,
    backgroundColor: color3777EE,
    borderRadius: 20,
    alignItems: 'center',
    paddingRight: 12
  },
  imgHoursDonation: {
    width: 20,
    height: 20,
    marginTop: 10,
    marginLeft: 12,
    marginRight: 8,
    marginBottom: 9
  }
})
