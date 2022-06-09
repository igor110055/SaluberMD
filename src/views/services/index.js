import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import { useSelector } from 'react-redux'

import { colorFFFFFF, color040404, color5C5D5E, color3777EE } from 'constants/colors'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import Translate from '../../translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'

import icHeader from '../../../assets/images/header'
import icService from '../../../assets/images/services'

import Header from 'components/Header'

export default function Services() {
  const languageRedux = useSelector(state => state.common.language)
  const countNotiRedux = useSelector(state => state.common.countNoti)

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
            {Translate(languageRedux).SERVICES}
          </Text>
          <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginHori20]}>
            lorem ipsum dolor sit.
          </Text>
        </View>
        <RenderItem
          icon={icService.tn_clinic}
          text={Translate(languageRedux).CLINIC_APPOINTMENT}
          description={Translate(languageRedux).LOREM_IPSUM_DOLOR}
          route={() => {NavigationService.navigate(Routes.CLINIC_APPOINTMENT_SCREEN)}}
        />
        <RenderItem
          icon={icService.tn_doctor_home}
          text={Translate(languageRedux).doctorAtHomeTitle}
          description={Translate(languageRedux).LOREM_IPSUM_DOLOR}
          route={() => {NavigationService.navigate(Routes.DOCTOR_AT_HOME_SCREEN)}}
        />
        <RenderItem
          icon={icService.tn_nutritionist}
          text={Translate(languageRedux).NUTRITIONIST}
          description={Translate(languageRedux).LOREM_IPSUM_DOLOR}
          route={() => {NavigationService.navigate(Routes.NUTRITIONIST_1_SCREEN)}}
        />
        <RenderItem
          icon={icService.tn_genetic}
          text={Translate(languageRedux).geneticTestTitle}
          description={Translate(languageRedux).LOREM_IPSUM_DOLOR}
          route={() => {NavigationService.navigate(Routes.GENETIC_TEST_SCREEN)}}
        />
        <RenderItem
          icon={icService.tn_second_opinion}
          text={Translate(languageRedux).medical_2option}
          description={Translate(languageRedux).LOREM_IPSUM_DOLOR}
          route={() => {NavigationService.navigate(Routes.HISTORY_SECOND_OPINION)}}
        />
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
  ctnText: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flex: 1
  },
  marginB8: {
    marginBottom: 8
  },
  ctnIcon: {
    height: 104,
    width: 104,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16
  },
  iconMedicine: {
    height: 104,
    width: 104
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
  }
})
