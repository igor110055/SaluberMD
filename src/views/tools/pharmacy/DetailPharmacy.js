import React, { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, ScrollView, Image,
  Linking, Platform, Alert, TouchableOpacity,
  DeviceEventEmitter
} from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import axios from 'axios'
import * as APIs from '../../../api/APIs'
import { useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/Feather'

import { color040404, color363636, color3777EE, color5C5D5E, colorDDDEE1, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from '../../../translate'
import NavigationService from 'navigation'

import icHeader from '../../../../assets/images/header'
import icPharma from '../../../../assets/images/home_screen'

import Header from '../../../components/Header'
import LoadingView from 'components/LoadingView'
import Button from 'components/Button'
import Routes from 'navigation/Routes'

export default function MapViewScreen({ route }) {

  const languageRedux = useSelector(state => state.common.language)
  const passingData = route?.params?.data
  const token = useSelector(state => state.user.token)
  const [isLoad, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [load, setLoad] = useState(1)
  const checkData = data || []

  useEffect(() => {
    callAPIGetDetail()
    setTimeout(() => {
      if (load < 3) {
        setLoad(load + 1)
      }
    }, 500)
  }, [load])

  const callAPIGetDetail = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/getfarmacia/${passingData?.id}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        // console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.result || []
          if (getList.length > 0) {
            setData(getList)
          }
        }
        console.log('data: ', data)
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }

  const lat = checkData.length ? Number(data[0]?.lat) : 0.0
  const lon = checkData.length ? Number(data[0]?.lon) : 0.0

  const mapView = () => {
    return (
      <View style={styles.marginHori20}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}>
          {
            lat && lon && (
              <Marker
                coordinate={{
                  latitude: lat || 0.0,
                  longitude: lon || 0.0
                }}
              />
            )
          }
        </MapView>
      </View>
    )
  }

  const name = checkData.length > 0 ? data[0]?.biz_name : ''
  const address = checkData.length > 0 ? data[0]?.address : ''
  const website = checkData.length > 0 ? data[0]?.sito : ''
  const email = checkData.length > 0 ? data[0]?.email : ''
  const phone = checkData.length > 0 ? data[0]?.telefono : ''

  const renderContent = () => {
    const _onPressPhone = () => {
      let phoneNumber = ''
      console.log('phone: ', passingData?.biz_phone)
      if (Platform.OS === 'android') {
        phoneNumber = `tel:${+passingData?.biz_phone}`
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
      var url = `https://www.google.com/maps/place/${lat},${lon}`
      Linking.openURL(url)
    }
    return (
      <View style={styles.content}>
        <View style={styles.topBox}>
          <Text style={customTxt(Fonts.SemiBold, 14, color363636).txt}>{name}</Text>
          <Text style={[customTxt(Fonts.Regular, 12, color5C5D5E).txt, styles.marginT8]}>
            {address}
          </Text>
          {(website || []).length > 0 && <Text style={[customTxt(Fonts.Regular, 12, color5C5D5E).txt]}>
            {website}
          </Text>}
          {(email || []).length > 0 && <Text style={[customTxt(Fonts.Regular, 12, color5C5D5E).txt]}>
            {email}
          </Text>}
        </View>
        <View style={styles.divider} />
        <View style={styles.bottomBox}>
          <TouchableOpacity onPress={_onPressMap} style={styles.ctnDirectMap}>
            <Icon name={'map-pin'} size={24} color={color040404} />
            <View style={styles.betweenDistance} />
            <Text style={customTxt(Fonts.Regular, 14, color363636).txt}>
              {Translate(languageRedux).DIRECT_MAP}
            </Text>
          </TouchableOpacity>
          {(phone || []).length > 0 && <TouchableOpacity onPress={_onPressPhone} style={styles.phone}>
            <Image source={icPharma.ic_phone} style={styles.iconStyle} />
            <View style={styles.betweenDistance} />
            <Text style={customTxt(Fonts.Regular, 14, color363636).txt}>{phone}</Text>
          </TouchableOpacity>}
        </View>
      </View>
    )
  }

  const renderButtonAdd = () => {
    return (
      <View style={styles.ctnButtonAdd}>
        <Button
          text={Translate(languageRedux).addFavourite}
          textColor={colorFFFFFF}
          backgroundColor={color3777EE}
          onPress={_onPressAdd}
        />
      </View>
    )
  }

  const _onPressAdd = () => {
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/addPharmacyFavourites/${passingData?.id}`,
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
    DeviceEventEmitter.emit('addPharmacy')
    NavigationService.navigate(Routes.PHARMACIES_SCREEN)
  }

  const renderBody = () => {
    return (
      <View style={styles.paddingBottom48}>
        {mapView()}
        {renderContent()}
        {renderButtonAdd()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        iconLeft={icHeader.ic_left}
        textCenter={Translate(languageRedux).dettaglio_struttura}
      />
      <ScrollView>{load === 3 && renderBody()}</ScrollView>
      {isLoad && <LoadingView />}
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
    marginTop: 16
  },
  marginT8: {
    marginTop: 4
  },
  ctnButtonAdd: {
    marginHorizontal: 20,
    marginTop: 16
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
  },
  paddingBottom48: {
    paddingBottom: 48
  }
})
