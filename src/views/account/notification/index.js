import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, ScrollView, Platform} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../api/APIs'
import { Switch } from 'react-native-switch'

import {color040404, color2F80ED, color3777EE, colorA7A8A9, colorDDDEE1, colorFFFFFF} from 'constants/colors'
import NavigationService from 'navigation'
import Translate from 'translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import { apiCheckPermission } from 'api/MedicalRecord'

import icHeader from '../../../../assets/images/header'

import Header from 'components/Header'
import LoadingView from 'components/LoadingView'
import DeviceInfo from 'react-native-device-info'

export default function NotiSetting() {
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const dispatch = useDispatch()
  const [permission, setPermission] = useState()
  const [isLoad, setLoading] = useState(true)
  const [statusNoti, setStatusNoti] = useState(true)
  const [reload, setReLoad] = useState(1)
  const [switchWellness, setSwitchWellness] = useState()
  const [switchPill, setSwitchPill] = useState()
  const [switchDM, setSwitchDM] = useState()

  useEffect(() => {
    callAPICheckPermission()
    callAPIGetStatusNoti()
    setTimeout(() => {
        if (reload < 3) {
          setReLoad(reload + 1)
        }
      }, 500)
    setSwitchWellness(statusNoti[0]?.wellness === 1 ? true : false)
    setSwitchPill(statusNoti[0]?.pills === 1 ? true : false)
    setSwitchDM(statusNoti[0]?.dm === 1 ? true : false)
  }, [reload])

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
    //   setLoading(false)
    }).catch(() => {
    //   setLoading(false)
    })
  }

  const callAPIGetStatusNoti = () => {
    axios({
        method: 'get',
        url: `${APIs.hostAPI}backoffice/webdoctor/getNotificationStatus`,
        headers: {
          'content-type': 'application/json',
          'x-auth-token': token
        }
      })
      .then((response) => {
        console.log('statusNoti: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.notifiche || []
          setStatusNoti(getList)
          console.log('wellness: ', statusNoti[0]?.wellness)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const _onPressSwitchWellness = () => {
    setSwitchWellness(!switchWellness)
  }

  const renderSwitchWellness = () => {
    return (
      <View style={styles.ctnTop}>
        <Text style={[customTxt(Fonts.Regular, 16, color040404).txt]}>
          {Translate(languageRedux).WELLNESS}
        </Text>
        <View>
          <Switch
            onValueChange={_onPressSwitchWellness}
            value={switchWellness}
            renderActiveText={false}
            renderInActiveText={false}
            backgroundActive={color2F80ED}
            circleSize={24}
            circleBorderWidth={0}
          />
        </View>
      </View>
    )
  }

  const _onPressSwitchPill = () => {
    setSwitchPill(!switchPill)
  }

  const renderSwitchPill = () => {
    return (
      <View style={styles.ctnTop}>
        <Text style={[customTxt(Fonts.Regular, 16, color040404).txt]}>
          {Translate(languageRedux).pills}
        </Text>
        <View>
          <Switch
            onValueChange={_onPressSwitchPill}
            value={switchPill}
            renderActiveText={false}
            renderInActiveText={false}
            backgroundActive={color2F80ED}
            circleSize={24}
            circleBorderWidth={0}
          />
        </View>
      </View>
    )
  }

  const _onPressSwitchDM = () => {
    setSwitchDM(!switchDM)
  }

  const renderSwitchDM = () => {
    return (
      <View style={styles.ctnTop}>
        <Text style={[customTxt(Fonts.Regular, 16, color040404).txt]}>
          {Translate(languageRedux).diseasemanagement}
        </Text>
        <View>
          <Switch
            onValueChange={_onPressSwitchDM}
            value={switchDM}
            renderActiveText={false}
            renderInActiveText={false}
            backgroundActive={color2F80ED}
            circleSize={24}
            circleBorderWidth={0}
          />
        </View>
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginB12]}>
          {Translate(languageRedux).CONTENT_NOTI_SETTING}
        </Text>
        <Text style={customTxt(Fonts.Regular, 14, colorA7A8A9).txt}>
          {Translate(languageRedux).category}
        </Text>
        {
          !(permission?.isDoctor) && renderSwitchWellness()
        }
        {permission?.iniziativa?.pillsreminder === '1' && !(permission?.isDoctor) && renderSwitchPill()}
        {renderSwitchDM()}
      </View>
    )
  }

  const _onPressSave = () => {
    setLoading(true)
    const body = {
      videocall: statusNoti[0]?.videocall,
      pills: switchPill ? 1 : 0,
      wellness: switchWellness ? 1 : 0,
      dm: switchDM ? 1 : 0
    }
    console.log('BODY: ', body)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/webdoctor/saveNotificationStatus/`,
      headers: {
        'x-auth-token': token
      },
      data: body
    })
      .then(response => {
        console.log('data: ', response.data)
        setLoading(false)
        NavigationService.goBack()
      })
      .catch(error => {
        console.error('There was an error!', error)
        setLoading(false)
      })
    // NavigationService.goBack()
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).NOTIFICATIONS_TITLE}
        iconLeft={icHeader.ic_left}
        textRight={Translate(languageRedux).btnsave}
        textRightColor={color3777EE}
        onPressLeft={() => {
          NavigationService.goBack()
        }}
        onPressRight={_onPressSave}
      />
      <ScrollView>{reload === 3 && renderBody()}</ScrollView>
      {isLoad && <LoadingView />}
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
  ctnTop: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: colorFFFFFF,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 21,
    borderBottomWidth: 1,
    borderBottomColor: colorDDDEE1
  },
  marginB12: {
    marginBottom: 12
  }
})
