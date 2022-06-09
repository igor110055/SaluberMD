import React from 'react'
import {
  View, Text, StyleSheet, ScrollView, Image, Linking,
  Platform, Alert, TouchableOpacity
} from 'react-native'
// import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { useSelector } from 'react-redux'

import { color040404, colorFFFFFF, colorDDDEE1, color5C5D5E, color363636 } from '../../../constants/colors'
import { customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'
import Translate from '../../../translate'

import icHeader from '../../../../assets/images/header'
import icPharma from '../../../../assets/images/home_screen'

import Header from '../../../components/Header'

export default function MapViewScreen({ route }) {

  const passingData = route?.params?.data
  const languageRedux = ''//useSelector(state => state.common.language)

  const mapView = () => {
    return (
      <View style={styles.marginHori20}>
        {/* <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: Number(passingData?.lat) || 0.0,
            longitude: Number(passingData?.lon) || 0.0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}>
          {
            passingData?.lat && passingData?.lon && (
              <Marker
                coordinate={{
                  latitude: Number(passingData?.lat) || 0.0,
                  longitude: Number(passingData?.lon) || 0.0
                }}
              />
            )
          }
        </MapView> */}
      </View>
    )
  }

  const renderContent = () => {
    const _onPressPhone = () => {
      let phoneNumber = ''
      console.log('phone: ', passingData?.biz_phone)
      if (Platform.OS === 'android') {
        phoneNumber = `telprompt:${+passingData?.biz_phone}`
      }
      else {
        phoneNumber = `tel:${+passingData?.biz_phone}`
      }
      Linking.openURL(phoneNumber)
        .then(supported => {
          if (!supported) {
            Alert.alert('Phone number is not available')
          } else {
            return Linking.openURL(phoneNumber)
          }
        })
        .catch(err => console.log(err))
    }
    const _onPressMap = () => {
      var url = `https://www.google.com/maps/place/${passingData?.lat},${passingData?.lon}`
      Linking.openURL(url)
    }
    return (
      <View style={styles.content}>
        <View style={styles.topBox}>
          <Text style={customTxt(Fonts.SemiBold, 14, color040404).txt}>{passingData?.name}</Text>
          {passingData?.address && <Text style={[customTxt(Fonts.Regular, 12, color5C5D5E).txt, styles.marginT4]}>
            {passingData?.address}
          </Text>}
          {passingData?.e_city && <Text style={[customTxt(Fonts.Regular, 12, color5C5D5E).txt]}>
            {passingData?.e_city}
          </Text>}
          {passingData?.e_zip_full && <Text style={[customTxt(Fonts.Regular, 12, color5C5D5E).txt]}>
            {passingData?.e_zip_full}
          </Text>}
        </View>
        <View style={styles.divider} />
        <View style={styles.bottomBox}>
          <TouchableOpacity onPress={_onPressMap} style={styles.ctnDirectMap}>
            {/* <Icon name={'map-pin'} size={24} color={color040404} /> */}
            <View style={styles.betweenDistance} />
            <Text style={customTxt(Fonts.Regular, 14, color363636).txt}>
              {Translate(languageRedux).DIRECT_MAP}
            </Text>
          </TouchableOpacity>
          {passingData?.biz_phone && <TouchableOpacity onPress={_onPressPhone} style={styles.phone}>
            <Image source={icPharma.ic_phone} style={styles.iconStyle} />
            <View style={styles.betweenDistance} />
            <Text style={customTxt(Fonts.Regular, 14, color363636).txt}>{passingData?.biz_phone}</Text>
          </TouchableOpacity>}
        </View>
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View>
        {mapView()}
        {renderContent()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        iconLeft={icHeader.ic_left}
        textCenter={Translate(languageRedux).dettaglio_struttura}
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
  map: {
    height: 192,
    width: '100%',
    borderRadius: 12
  },
  content: {
    marginHorizontal: 20,
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colorDDDEE1
  },
  iconStyle: {
    height: 24,
    width: 24,
    marginRight: 8
  },
  phone: {
    flexDirection: 'row',
    marginTop: 8
  },
  marginT4: {
    marginTop: 4
  },
  marginHori20: {
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20
    },
    shadowOpacity: 0.08,
    shadowRadius: 40,
    elevation: 9
  },
  topBox: {
    marginTop: 16,
    marginHorizontal: 32,
    marginBottom: 16
  },
  divider: {
    borderWidth: 0.5,
    borderColor: colorDDDEE1
  },
  bottomBox: {
    marginBottom: 16,
    marginTop: 16,
    marginHorizontal: 32
  },
  betweenDistance: {
    width: 10
  },
  ctnDirectMap: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})
