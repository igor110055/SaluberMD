import { apiGetAllMembers, apiGetParentId, apiGetServerByCode, apiGetSharedCodeByUserId, apiPutEnterApp } from 'api/Member'
import Header from 'components/Header'
import { color0B40B1, color3777EE, colorF0F0F0, colorFFFFFF } from 'constants/colors'
import { border } from 'constants/css'
import NavigationService from 'navigation'
import Routes from '../../../navigation/Routes'
import React, { useEffect, useState } from 'react'
import {
  View, StyleSheet, FlatList, Text, TouchableOpacity,
  Image, RefreshControl, Platform
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Translate from 'translate'
import imgHeader from '../../../../assets/images/header'
import imgMember from '../../../../assets/images/members'
import imgDataTracking from '../../../../assets/images/data_tracking'
import _ from 'lodash'
import SOSButton from 'views/home_screen/components/SOSButton/SOSButton'
import icVisit from '../../../../assets/images/visit'
import * as APIs from '../../../api/APIs'
import AsyncStorage from '@react-native-community/async-storage'
import { STORAGE_KEY } from 'constants/define'
import { savePermission, saveToken } from 'actions/user'
import DeviceInfo from 'react-native-device-info'
import { apiCheckPermission } from 'api/MedicalRecord'
import LoadingView from 'components/LoadingView'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
import DialogCustom from 'components/DialogCustom'

export default function AllMembersView() {
  const languageRedux = useSelector(state => state.common.language)
  const dispatch = useDispatch()
  const [lsMember, setLsMember] = useState([])
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)
  const [isShowPlus, setShowPlus] = useState(false)
  const [parentId, setparentId] = useState()
  const [isLoading, setLoading] = useState(true)
  const [isNoti, setShowNoti] = useState(false)
  const [dataNoti, setDataNoti] = useState()
  const tokenRedux = useSelector(state => state.user.token)
  const [isDialog, setDialog] = useState(false)
  const [itemSelected, setItemSelected] = useState()

  useEffect(() => {
    callAPI()
  }, [toggleReload])

  useEffect(() => {
    if (parentId) {
      callAPIShareCode(itemSelected)
    }
  }, [parentId])

  const callAPI = () => {
    dispatch(apiGetAllMembers()).then(res => {
      var getls = res?.payload?.members || []
      setLoading(false)
      setRefresh(false)
      setLsMember(getls)
    }).catch(() => {
      setRefresh(false)
    })
  }

  const callAPIGetParentId = (item) => {
    setLoading(true)
    dispatch(apiGetParentId(item?.userId)).then(res => {
      setparentId(res?.payload?.parentId)
      Promise.all([
        AsyncStorage.setItem(STORAGE_KEY.OLD_TOKEN, `${tokenRedux}`)
      ])
    }).catch(() => {

    })
  }

  const callAPIShareCode = (item) => {
    dispatch(apiGetSharedCodeByUserId()).then(res => {
      if (res?.payload?.code) {
        callAPIGetServerByCode(res?.payload, item)
      }
    })
  }

  const callAPIGetServerByCode = (params, item) => {
    dispatch(apiGetServerByCode(params)).then(async res => {
      if (res?.payload?.endpoint) {
        APIs.hostAPI = res?.payload?.endpoint + '/'
        await AsyncStorage.setItem(STORAGE_KEY.SERVER, res?.payload?.endpoint + '/')
        callAPIAuth(item)
      }

      if (res?.payload?.esito !== '0') {
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

  const callAPIAuth = async (item) => {
    let param = {
      password: `${item?.name}${parentId}`.replace(/ /g, ''),
      username: `${item?.name}${item?.surname}${parentId}`.replace(/ /g, '').toLowerCase()//.replace(/^\s+|\s+$/g, "") trim string spaces .replace(/ /g, '')
    }
    return await fetch(`${APIs.hostAPI}backoffice/auth`, {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        'access-control-request-headers': 'X-AUTH-TOKEN'
        // 'x-auth-token': tokenRedux
      },
      body: JSON.stringify(param)
    }).then(async function (response) {
      console.log('Res: ', response)
      console.log('response.headers: ', response.headers)
      console.log('X-AUTH-TOKEN:', response.headers.get('x-auth-token'))
      const getToken = response.headers.get('x-auth-token')
      if (response.status !== 200) {
        console.log('Status Code: ' + response.status)
        if ([401, 404].includes(response?.status)) {
          setShowNoti(true)
          setDataNoti({
            esito: 1,
            motivo: Translate(languageRedux).MSG_LOGIN_ERROR
          })
        }
        const errJson = await JSON.parse(response._bodyText)
        setLoading(false)
        setShowNoti(true)
        setDataNoti({
          esito: 1,
          motivo: errJson?.reason || Translate(languageRedux).server_missing
        })
        return
      }
      if (getToken) {
        Promise.all([
          AsyncStorage.setItem(STORAGE_KEY.TOKEN, `${getToken}`),
          AsyncStorage.setItem(STORAGE_KEY.IS_FACE_ID, 'false'),
          dispatch(saveToken(`${getToken}`))
        ])
        Promise.all([
          setTimeout(() => {
            callAPIPermission()
          }, 1000)
        ])
      } else {
        setLoading(false)
      }

      // Examine the text in the response
      response.json().then(function (data) {
        console.log(data)
      })
    }

    ).then((json) => {
      console.log('Json: ', json)
    }).catch((error) => {
      console.error(error)
      setLoading(false)
    })
  }

  const callAPIPermission = () => {
    const params = {
      build: DeviceInfo.getBuildNumber(),
      isIOS: Platform.OS === 'ios',
      uuid: DeviceInfo.getUniqueId(),
      version: DeviceInfo.getVersion()
    }
    dispatch(apiCheckPermission(params)).then(res => {
      Promise.all([
        dispatch(savePermission(res?.payload))
      ])
      callAPIEnterApp()
      // if (res?.payload?.isDoctor === true) {
      //   setTimeout(() => {
      //     setLoading(false)
      //     NavigationService.navigateAndReset(Routes.DRAWER_NAVIGATION_DOCTOR)
      //   }, 3000)
      // } else {
      //   setTimeout(() => {
      //     setLoading(false)
      //     NavigationService.navigateAndReset(Routes.DRAWER_NAVIGATION)
      //   }, 3000)
      // }
    }).catch(() => {
      setLoading(false)
    })
  }

  const callAPIEnterApp = () => {
    dispatch(apiPutEnterApp()).then(() => {
      NavigationService.navigateAndReset(Routes.SPLASH_SCREEN)
    }).catch(() => {
      NavigationService.navigateAndReset(Routes.SPLASH_SCREEN)
    })
  }

  const _onPressItem = (item) => {
    setDialog(true)
    setItemSelected(item)
  }

  const _onPressDialogOK = () => {
    setDialog(false)
    callAPIGetParentId(itemSelected)
  }

  const renderItemMember = (item) => {
    return (
      <TouchableOpacity style={[
        styles.itemMemberView,
        border().borderB
      ]}
        onPress={() => _onPressItem(item)}
      >
        <Image source={imgMember.ic_team_detail} style={styles.imgUser} />
        <View style={styles.nameView}>
          <Text >{item?.name || ''} {item?.surname || ''}</Text>
        </View>
        <TouchableOpacity>
          <Image source={imgDataTracking.ic_delete} style={styles.imgDelete} />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  const onRefresh = () => {
    setRefresh(true)
    setToggleReload(Math.random())
  }

  const renderPlusButton = () => {
    if (isShowPlus) {
      return null
    } else {
      return (
        <SOSButton
          source={isShowPlus ? icVisit.ic_x : icVisit.ic_plus}
          backgroundColor={color3777EE}
          onPress={() => {
            setShowPlus(!isShowPlus)
          }}
        />
      )
    }
  }

  return (
    <View style={styles.container}>
      <Header
        textCenter={Translate(languageRedux).allMembers}
        backgroundColor={colorFFFFFF}
        iconLeft={imgHeader.ic_left}
        onPressLeft={() => NavigationService.goBack()}
      />
      <FlatList
        data={lsMember}
        extraData={lsMember}
        style={styles.flatlist}
        contentContainerStyle={styles.contentContainerStyle}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => renderItemMember(item)}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || false}
            onRefresh={onRefresh}
            tintColor={color0B40B1}
          />
        }
      />
      {renderPlusButton()}
      <NotificationView
        status={_.includes([1, '1'], dataNoti?.esito) ? STATUS_NOTIFY.ERROR : STATUS_NOTIFY.SUCCESS}
        content={dataNoti?.motivo || ''}
        isShow={isNoti || false}
        setShow={(val) => {
          setShowNoti(val)
          if (!val) {
            setDataNoti()
          }
        }}
      />
      {isLoading && <LoadingView />}
      {
        isDialog && (
          <DialogCustom
            title={Translate(languageRedux).WARNING_TITLE_NOTIFICATION}
            content={Translate(languageRedux).switch_member}
            txtlLeft={`${Translate(languageRedux).no}`.toUpperCase()}
            onPressCancel={() => setDialog(false)}
            txtRight={`${Translate(languageRedux).yes}`.toUpperCase()}
            onPressOK={_onPressDialogOK}
          />
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF0F0F0
  },
  itemMemberView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colorFFFFFF
  },
  nameView: {
    flex: 1
  },
  imgUser: {
    width: 20,
    height: 20,
    marginLeft: 10,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10
  },
  imgDelete: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 10,
    marginLeft: 10
  },
  flatlist: {
    marginTop: 2
  },
  contentContainerStyle: {
    paddingBottom: 120
  }
})
