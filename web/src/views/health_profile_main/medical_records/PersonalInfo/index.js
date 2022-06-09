import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native'
import { color3777EE, color363636, colorFFFFFF } from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import { convertYear } from '../../../../constants/DateHelpers'
// import NavigationService from 'navigation'
// import Routes from 'navigation/Routes'
import Translate from '../../../../translate'

import icHealthProfile from '../../../../../assets/images/health_profile'
import Info from '../../../healthProfile/components/Info'
import * as StateLocal from '../../../../state_local'
import { apiUserInfo } from '../../../home/apis'

export default function PersonalInfo() {

  var userinfo = StateLocal.userinfo
  const languageRedux = ''
  const lsCountryRedux = StateLocal.lsCountry
  const [show, setShow] = useState(true)

  useEffect(() => {
    callAPIUserinfo()
    convertCountry()
  }, [])

  const callAPIUserinfo = () => {
    apiUserInfo().then(async res => {
      const parseData = await res.json()
      const getuserInfo = parseData?.user
      StateLocal.userinfo = getuserInfo
      userinfo = getuserInfo
    })
  }

  const convertCountry = () => {
    var i = lsCountryRedux.filter((val) => val.value === userinfo?.country)
    return (
      <Text style={customTxt(Fonts.SemiBold, 12, color3777EE).txt}>{i[0]?.text || ''}</Text>
    )
  }

  const getSubPersonal = () => {
    const getName = () => {
      return (
        <Text style={customTxt(Fonts.SemiBold, 12, color3777EE).txt}>
          {userinfo?.nome + ' ' + userinfo?.cognome}
        </Text>
      )
    }
    const checkGender = () => {
      if (userinfo?.gender === 0) {
        return (
          <Text style={customTxt(Fonts.SemiBold, 12, color3777EE).txt}>{', '}{Translate(languageRedux).male}</Text>
        )
      }
      if (userinfo?.gender === 1) {
        return (
          <Text style={customTxt(Fonts.SemiBold, 12, color3777EE).txt}>{', '}{Translate(languageRedux).female}</Text>
        )
      }
    }
    const getAge = () => {
      const yearBorn = convertYear(userinfo?.birthdate)
      const yearNow = convertYear()
      const age = yearNow - yearBorn
      return <Text style={customTxt(Fonts.SemiBold, 12, color3777EE).txt}>{', ' + age} y.o.</Text>
    }
    return (
      <View style={styles.flexRow}>
        {getName()}
        {checkGender()}
        {getAge()}
      </View>
    )
  }

  const getSubAddress = () => {
    const getAddress = userinfo?.address ? userinfo?.address : ''
    const getCity = userinfo?.city ? userinfo?.city : ''
    const getCountry = convertCountry()
    return (
      <View style={styles.flexRow}>
        {(userinfo?.address || []).length > 0 &&
          <Text style={customTxt(Fonts.SemiBold, 12, color3777EE).txt}>{getAddress}{', '}</Text>}
        {(userinfo?.city || []).length > 0 &&
          <Text style={customTxt(Fonts.SemiBold, 12, color3777EE).txt}>{getCity}{', '}</Text>}
        {lsCountryRedux && <Text style={customTxt(Fonts.SemiBold, 12, color3777EE).txt}>{getCountry}</Text>}
      </View>
    )
  }

  const getSubContact = () => {
    const getEmail = userinfo?.email ? userinfo?.email : ''
    const getPhone = userinfo?.phone1 ? userinfo?.phone1 : ''
    return (
      <View style={styles.flexRow}>
        <Text style={customTxt(Fonts.SemiBold, 12, color3777EE).txt}>{getEmail}</Text>
        {(userinfo?.phone1 || []).length > 0 && <View>
          <Text style={customTxt(Fonts.SemiBold, 12, color3777EE).txt}>{', '}{getPhone}</Text>
        </View>}
      </View>
    )
  }

  const getSubEmergency = () => {
    const emergency = userinfo?.emergencyContacts || []
    const firstName1 = emergency.length > 0 ? userinfo?.emergencyContacts[0].firstName : ''
    const lastName1 = emergency.length > 0 ? userinfo?.emergencyContacts[0].lastName : ''
    const firstName2 = emergency.length > 1 ? userinfo?.emergencyContacts[1].firstName : ''
    const lastName2 = emergency.length > 1 ? userinfo?.emergencyContacts[1].lastName : ''
    const convertRela1 = () => {
      if (emergency.length > 0) {
        var i = listRela.filter(val => val.value === userinfo?.emergencyContacts[0].relationship)
        return i[0].name || ''
      }
    }
    const convertRela2 = () => {
      if (emergency.length > 1) {
        var i = listRela.filter(val => val.value === userinfo?.emergencyContacts[1].relationship)
        return i[0].name || ''
      }
    }
    return (
      <View style={styles.flexRow}>
        {emergency.length > 0 && (
          <Text style={customTxt(Fonts.SemiBold, 12, color3777EE).txt}>
            {firstName1} {lastName1} ({convertRela1()})
          </Text>
        )}
        {emergency.length > 1 && (
          <Text style={customTxt(Fonts.SemiBold, 12, color3777EE).txt}>, </Text>
        )}
        {emergency.length > 1 && (
          <Text style={customTxt(Fonts.SemiBold, 12, color3777EE).txt}>
            {firstName2} {lastName2} ({convertRela2()})
          </Text>
        )}
      </View>
    )
  }

  const getSubFamilyPhysician = () => {
    const getDoctor = userinfo?.medicname1 ? userinfo?.medicname1 : ''
    return (
      <View>
        {(userinfo?.medicname1 || []).length > 0 && <Text style={customTxt(Fonts.SemiBold, 12, color3777EE).txt}>
          Doc. {getDoctor}</Text>}
      </View>
    )
  }

  const dataPersonal = [
    {
      id: 0,
      title: 'Personal Details',
      subtitle: getSubPersonal()
    },
    {
      id: 1,
      title: 'Address',
      subtitle: getSubAddress()
    },
    {
      id: 2,
      title: 'Contact Info',
      subtitle: getSubContact()
    },
    {
      id: 3,
      title: 'Emergency Contact',
      subtitle: getSubEmergency()
    },
    {
      id: 4,
      title: 'Family Physician',
      subtitle: getSubFamilyPhysician(),
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16
    }
  ]

  const renderItem = ({ item, index }) => {
    const _onPressItem = () => {
      switch (item?.title) {
        case dataPersonal[0].title:
          return NavigationService.navigate(Routes.PERSONAL_DETAILS_SCREEN)
        case dataPersonal[1].title:
          return NavigationService.navigate(Routes.ADDRESS_SCREEN)
        case dataPersonal[2].title:
          return NavigationService.navigate(Routes.CONTACT_INFO_SCREEN)
        case dataPersonal[3].title:
          return NavigationService.navigate(Routes.EMERGENCY_CONTACT_SCREEN)
        case dataPersonal[4].title:
          return NavigationService.navigate(Routes.FAMILY_PHYSICIAN_SCREEN)
        default:
          return null
      }
    }
    return (
      <View>
        <Info
          titleColor={color363636}
          subTitleColor={color3777EE}
          title={item.title}
          subTitle={item.subtitle}
          onPress={_onPressItem}
          borderBottomLeftRadius={item.borderBottomLeftRadius}
          borderBottomRightRadius={item.borderBottomRightRadius}
        />
      </View>
    )
  }

  const personalInfo = () => {
    const borderBottom = {
      borderBottomLeftRadius: show ? 0 : 16,
      borderBottomRightRadius: show ? 0 : 16
    }
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            show === false && setShow(true)
            show === true && setShow(false)
          }}
          style={[styles.ctnCategory, borderBottom]}>
          <Text
            style={[
              customTxt(Fonts.SemiBold, 18, colorFFFFFF).txt,
              styles.marginL16
            ]}>
            {Translate(languageRedux).personalinfo}
          </Text>
          <View>
            <Image
              source={show ? icHealthProfile.ic_up_white : icHealthProfile.ic_down_white}
              style={[styles.iconStyle, styles.marginR16]}
            />
          </View>
        </TouchableOpacity>
        {show && <View style={styles.shadow}>
          <FlatList
            data={dataPersonal}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
        </View>}
      </View>
    )
  }

  return (
    <View>
      {personalInfo()}
    </View>
  )
}

const styles = StyleSheet.create({
  ctnCategory: {
    height: 56,
    backgroundColor: color3777EE,
    marginHorizontal: 20,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    marginBottom: 0,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9
  },
  marginL16: {
    marginLeft: 16
  },
  marginR16: {
    marginRight: 16
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  flexRow: {
    flexDirection: 'row'
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9
  }
})

const listRela = [
  { 'name': 'Father', 'value': 'FATHER' },
  { 'name': 'Mother', 'value': 'MOTHER' },
  { 'name': 'Wife', 'value': 'WIFE' },
  { 'name': 'Husband', 'value': 'HUSBAND' },
  { 'name': 'Son', 'value': 'SON' },
  { 'name': 'Daughter', 'value': 'DAUGHTER' },
  { 'name': 'Other', 'value': 'OTHER' }
]
