import React, { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, ScrollView, Linking,
  TouchableOpacity, Alert, Platform, Image, DeviceEventEmitter
} from 'react-native'
import axios from 'axios'
import * as APIs from '../../../api/APIs'
import { useSelector } from 'react-redux'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import Icon from 'react-native-vector-icons/Feather'
import IconWeb from 'react-native-vector-icons/MaterialCommunityIcons'
import _ from 'lodash'

import { colorFFFFFF, colorDDDEE1, color5C5D5E, color040404, color3777EE } from 'constants/colors'
import Translate from '../../../translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'

import icHeader from '../../../../assets/images/header'
import icPharma from '../../../../assets/images/home_screen'

import Header from '../../healthProfile/components/Header'
import LoadingView from 'components/LoadingView'
import Button from 'components/Button'

export default function DetailClinic({ route }) {
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const passingData = route?.params?.data
  const [isLoad, setLoading] = useState(true)
  const [detail, setDetail] = useState([])
  const [load, setLoad] = useState(1)
  const [dataNoti, setDataNoti] = useState()
  const [isShowNoti, setShowNoti] = useState()

  useEffect(() => {
    callAPIStructureDetail()
    setTimeout(() => {
      if (load < 3) {
        setLoad(load + 1)
      }
    }, 500)
  }, [load])

  const callAPIStructureDetail = () => {
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/jws/rc/schedaStruttura/${passingData?.id}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        console.log('Structure: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.result || []
          if ((getList || []).length > 0) {
            setDetail(getList[0])
          }
        }
        console.log('detail: ', detail)
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }

  const lat = Number(detail?.lat || 0.0)
  const lon = Number(detail?.lon || 0.0)


  const mapView = () => {
    return (
      <View style={styles.ctnLayoutMap}>
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
            detail?.lat && detail?.lon && (
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

  const renderBoxInfo = () => {
    const _onPressMap = () => {
      var url = `https://www.google.com/maps/place/${lat},${lon}`
      Linking.openURL(url)
    }
    const _onPressPhone = () => {
      let phoneNumber = ''
      console.log('phone: ', detail?.telefono)
      if (Platform.OS === 'android') {
        phoneNumber = `tel:${+detail?.telefono}`
      }
      else {
        phoneNumber = `tel:${+detail?.telefono}`
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
    const _onPressWeb = () => {
      var url = `https://${detail?.sito}/`
      Linking.openURL(url)
    }
    return (
      <View style={styles.content}>
        <View style={styles.topBox}>
          <Text style={customTxt(Fonts.Bold, 18, color040404).txt}>
            {detail?.descrizione}
          </Text>
          <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginT4]}>
            {detail?.indirizzo}
          </Text>
          {(detail?.partita_iva || []).length > 0 && <Text style={[customTxt(Fonts.Regular, 12, color5C5D5E).txt]}>
            {detail?.partita_iva}
          </Text>}
          {(detail?.fax || []).length > 0 && detail?.fax !== 'null' &&
            <Text style={[customTxt(Fonts.Regular, 12, color5C5D5E).txt]}>
              {detail?.fax}
            </Text>}
        </View>
        <View style={styles.divider} />
        <View style={styles.bottomBox}>
          <TouchableOpacity onPress={_onPressMap} style={styles.ctnDirectMap}>
            <Icon name={'map-pin'} size={24} color={color040404} />
            <View style={styles.betweenDistance} />
            <Text style={customTxt(Fonts.Regular, 16, color3777EE).txt}>
              {Translate(languageRedux).DIRECT_MAP}
            </Text>
          </TouchableOpacity>
          {(detail?.telefono || []).length > 0 && <TouchableOpacity onPress={_onPressPhone} style={styles.phone}>
            <Image source={icPharma.ic_phone} style={styles.iconStyle} />
            <View style={styles.betweenDistance} />
            <Text style={customTxt(Fonts.Regular, 16, color3777EE).txt}>{detail?.telefono}</Text>
          </TouchableOpacity>}
          {(detail?.sito || []).length > 0 && <TouchableOpacity onPress={_onPressWeb} style={styles.ctnDirectMap}>
            <IconWeb name={'web'} size={24} color={color040404} />
            <View style={styles.betweenDistance} />
            <Text style={customTxt(Fonts.Regular, 16, color3777EE).txt}>
              {detail?.sito}
            </Text>
          </TouchableOpacity>}
        </View>
      </View>
    )
  }

  const renderButtonAdd = () => {
    return (
      <View style={styles.ctnButtonAdd}>
        <Button
          text={Translate(languageRedux).appuntamento_clinica}
          textColor={colorFFFFFF}
          backgroundColor={color3777EE}
          onPress={_onPressRequest}
        />
      </View>
    )
  }

  const _onPressRequest = () => {
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/richiediapp/${passingData?.id}`,
      headers: {
        'x-auth-token': token
      }
    })
      .then(response => {
        console.log('data: ', response.data)
        if (_.includes([0, '0'], response?.data?.esito)) {
          setLoading(false)
          setShowNoti(true)
          setDataNoti({
            status: STATUS_NOTIFY.SUCCESS,
            content: response?.data?.motivo
          })
          DeviceEventEmitter.emit('requestclinic')
          setTimeout(() => {
            DeviceEventEmitter.emit(Routes.CLINIC_APPOINTMENT_SCREEN, { history: true })
          }, 1000)
          NavigationService.navigate(Routes.CLINIC_APPOINTMENT_SCREEN)
        }
        if (_.includes([1, '1'], response?.data?.esito)) {
          setDataNoti({
            status: STATUS_NOTIFY.ERROR,
            content: 'Request failed'
          })
        }
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
  }

  const renderBody = () => {
    return (
      <View style={styles.paddingBottom48}>
        {mapView()}
        {renderBoxInfo()}
        {renderButtonAdd()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        source={icHeader.ic_left}
        title={Translate(languageRedux).dettaglio_struttura}
      />
      <ScrollView>{load === 3 && renderBody()}</ScrollView>
      {isLoad && <LoadingView />}
      <NotificationView
        isShow={isShowNoti}
        setShow={() => setShowNoti(false)}
        status={dataNoti?.status || STATUS_NOTIFY.ERROR}
        content={dataNoti?.content || ''}
      />
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
  ctnLayoutMap: {
    marginHorizontal: 20,
    shadowColor: '#A7A7A7',
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 9
  },
  paddingBottom48: {
    paddingBottom: 48
  },
  content: {
    marginHorizontal: 20,
    marginTop: 16
  },
  topBox: {
    marginTop: 16,
    marginBottom: 16
  },
  marginT4: {
    marginTop: 4
  },
  divider: {
    borderWidth: 0.5,
    borderColor: colorDDDEE1
  },
  bottomBox: {
    marginBottom: 16,
    marginTop: 16
  },
  betweenDistance: {
    width: 10
  },
  ctnDirectMap: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  phone: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 16
  },
  ctnButtonAdd: {
    marginHorizontal: 20,
    marginTop: 16
  }
})
