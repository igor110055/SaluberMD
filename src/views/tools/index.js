import React, {useState, useEffect} from 'react'
import { View, Platform, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

import { color040404, color3777EE, color5C5D5E, colorEAF1FF, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import Translate from '../../translate'
import { apiCheckPermission } from 'api/MedicalRecord'

import icHeader from '../../../assets/images/header'
import icTools from '../../../assets/images/tools'

import Header from '../../components/Header'
import LoadingView from '../../components/LoadingView'
import DeviceInfo from 'react-native-device-info'

export default function Tools() {
  const languageRedux = useSelector(state => state.common.language)
  const countNotiRedux = useSelector(state => state.common.countNoti)
  const dispatch = useDispatch()
  const [checkPer, setCheckPer] = useState()
  const [isLoad, setLoading] = useState(true)

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
      setCheckPer(res?.payload?.iniziativa)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }

  const RenderItem = ({icon, text, description, route}) => {
    return (
      <TouchableOpacity onPress={route} style={styles.ctnItem}>
        <View style={styles.item}>
          <View style={styles.ctnIcon}>
            <Image source={icon} style={styles.iconMedicine} />
          </View>
          <View style={styles.ctnText}>
            <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginB8]}>
              {text}
            </Text>
            <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt]}>
              {description}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        <View style={styles.titleTop}>
          <Text style={[customTxt(Fonts.Bold, 24, color040404).txt, styles.marginHori20]}>
            {Translate(languageRedux).TOOLS}
          </Text>
          <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginHori20]}>
            
          </Text>
        </View>
        <RenderItem
          icon={icTools.ic_medicine}
          text={Translate(languageRedux).myreminders}
          description={Translate(languageRedux).SET_REMINDER}
          route={() => {NavigationService.navigate(Routes.MEDICINE_REMINDER_SCREEN)}}
        />
        <RenderItem
          icon={icTools.ic_pharmacy}
          text={Translate(languageRedux).pharmacies}
          route={() => {NavigationService.navigate(Routes.PHARMACIES_SCREEN)}}
        />
        {checkPer?.hasSurveys === '1' && <RenderItem
          icon={icTools.ic_survey}
          text={Translate(languageRedux).SURVEYS}
          route={() => {NavigationService.navigate(Routes.SURVEYS_SCREEN)}}
        />}
      </View>
    )
  }

  const _onPressNotificaion = () => {
    return NavigationService.navigate(Routes.NOTIFICATION_SCREEN)
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_menudrawer}
        iconRight={icHeader.ic_noti}
        onPressLeft={() => {
          NavigationService.openDrawer()
        }}
        onPressRight={_onPressNotificaion}
        notiRight={countNotiRedux}
      />
      <ScrollView>{renderBody()}</ScrollView>
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
    paddingBottom: 48
  },
  titleTop: {
    backgroundColor: colorFFFFFF,
    paddingBottom: 25
  },
  marginHori20: {
    marginHorizontal: 20
  },
  ctnItem: {
    marginHorizontal: 20,
    marginBottom: 16
  },
  item: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    shadowColor: color3777EE,
    shadowOffset: {
      width: 0,
      height: 20
    },
    shadowOpacity: 0.08,
    shadowRadius: 40,
    elevation: 9
  },
  ctnIcon: {
    backgroundColor: colorEAF1FF,
    height: 104,
    width: 104,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16
  },
  iconMedicine: {
    height: 72,
    width: 74
  },
  ctnText: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flex: 1
  },
  marginB8: {
    marginBottom: 8
  }
})
