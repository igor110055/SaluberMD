import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, FlatList, TouchableOpacity, Linking, Platform } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'

import { color040404, color3777EE, colorA7A8A9, colorF0F0F0, colorF8F8F8, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import Translate from '../../translate'

import icHeader from '../../../assets/images/header'
import icSupport from '../../../assets/images/support'
import icHealthProfile from '../../../assets/images/health_profile'
import { apiCheckPermission } from 'api/MedicalRecord'

import Header from '../../components/Header'
import Button from '../../components/Button'
import LoadingView from '../../components/LoadingView'
import DeviceInfo from 'react-native-device-info'

export default function Support() {
  const languageRedux = useSelector(state => state.common.language)
  const dispatch = useDispatch()
  const [isLoad, setLoading] = useState(true)
  const [check, setCheck] = useState(true)
  const countNotiRedux = useSelector(state => state.common.countNoti)

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
      setCheck(res?.payload)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }

  const data = [
    {
      title: Translate(languageRedux).ABOUT_US_TITLE,
      icon: icSupport.ic_about_us,
      route: Routes.ABOUT_US_SCREEN,
      id: 0
    },
    {
      title: Translate(languageRedux).PRICING_TITLE,
      route: Routes.PRICING_SCREEN,
      check: check?.iniziativa?.hasPayment,
      id: 1
    },
    {
      title: Translate(languageRedux).ABOUT_US_SECTION3_TITLE,
      icon: icSupport.ic_our_dc,
      route: Routes.OUR_DOCTOR_SCREEN,
      id: 2
    },
    {
      title: Translate(languageRedux).FAQs,
      icon: icSupport.ic_faqs,
      route: Routes.FAQS_SCREEN,
      link: `https://faqitit.salubermd.com/faq_itit.html`,
      id: 3
    },
    {
      title: Translate(languageRedux).PRIVACY,
      icon: icSupport.ic_lock,
      route: Routes.PRIVACY_SCREEN,
      id: 4
    },
    {
      title: Translate(languageRedux).TERMS_TITLE,
      icon: icSupport.ic_lock,
      route: Routes.TERM_OF_USE_SCREEN,
      id: 5
    },
    {
      title: Translate(languageRedux).HEALTH_PROFILE_WIZARD,
      icon: icSupport.ic_hp_wizard,
      route: Routes.HEALTHPROFILE_SCREEN,
      typeView: 'support',
      id: 6
    }
  ]

  const RenderItem = ({item, index}) => {
    const _onPressItem = () => {
      NavigationService.navigate(item?.route, {
        data: item,
        index: index
      })
    }
    return (
      <View>
        {/* Check Pricing */}
        {(item?.id === 1 && item?.check === '1') && <View>
        <TouchableOpacity
        onPress={() => {NavigationService.navigate(item?.route)}}
        style={styles.ctnItem}>
          <View style={styles.ctnIcon}>
            <Icon name={'pricetag-outline'} size={24} color={color3777EE} />
          </View>
          <View style={styles.ctnTitle}>
            <Text style={customTxt(Fonts.Bold, 14, color040404).txt}>
              {item?.title}
            </Text>
            <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>
            </Text>
          </View>
          <View style={styles.ctnRightIcon}>
            <Image source={icHealthProfile.ic_right} style={styles.iconStyle} />
          </View>
        </TouchableOpacity>
        <View style={styles.line} />
        </View>}
        {/* Check FAQs */}
        {item?.id === 3 && <View>
        <TouchableOpacity
        onPress={() => {Linking.openURL(item?.link)}}
        style={styles.ctnItem}>
          <View style={styles.ctnIcon}>
            <Image source={item?.icon} style={styles.iconStyle} />
          </View>
          <View style={styles.ctnTitle}>
            <Text style={customTxt(Fonts.Bold, 14, color040404).txt}>
              {item?.title}
            </Text>
            <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>
            </Text>
          </View>
          <View style={styles.ctnRightIcon}>
            <Image source={icHealthProfile.ic_right} style={styles.iconStyle} />
          </View>
        </TouchableOpacity>
        <View style={styles.line} />
        </View>}
        {/* Others Category */}
        {item?.id !== 1 && item?.id !== 3 && <View>
        <TouchableOpacity
        onPress={_onPressItem}
        style={styles.ctnItem}>
          <View style={styles.ctnIcon}>
            <Image source={item?.icon} style={styles.iconStyle} />
          </View>
          <View style={styles.ctnTitle}>
            <Text style={customTxt(Fonts.Bold, 14, color040404).txt}>
              {item?.title}
            </Text>
            <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>
            </Text>
          </View>
          <View style={styles.ctnRightIcon}>
            <Image source={icHealthProfile.ic_right} style={styles.iconStyle} />
          </View>
        </TouchableOpacity>
        <View style={styles.line} />
        </View>}
      </View>
    )
  }

  const renderListCategory = () => {
    return (
      <View>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderContactButton = () => {
    return (
      <View style={styles.ctnContactButton}>
        <Button
          backgroundColor={color3777EE}
          text={Translate(languageRedux).CONTACT_US_BTN}
          textColor={colorFFFFFF}
          onPress={() => {NavigationService.navigate(Routes.CONTACT_US_SCREEN)}}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View>
        <Text style={[customTxt(Fonts.Bold, 24, color040404).txt, styles.ctnSupport]}>{Translate(languageRedux).SUPPORT}</Text>
        <View>
          {renderListCategory()}
        </View>
        <View style={styles.layoutButton}>
          {renderContactButton()}
        </View>
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
      <ScrollView>
        {renderBody()}
      </ScrollView>
      {isLoad && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  ctnSupport: {
    marginHorizontal: 20,
    marginBottom: 12
  },
  ctnItem: {
    height: 73,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  ctnIcon: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: colorF8F8F8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  ctnTitle: {
    flex: 4
  },
  ctnRightIcon: {
    flex: 1,
    alignItems: 'flex-end'
  },
  line: {
    height: 1,
    backgroundColor: colorF0F0F0
  },
  ctnContactButton: {
    marginHorizontal: 20
  },
  layoutButton: {
    height: 200,
    justifyContent:'flex-end',
    paddingBottom: 50
  }
})
