import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, FlatList, ScrollView,
  RefreshControl, DeviceEventEmitter, Linking, Alert} from 'react-native'
import {useSelector} from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../api/APIs'
import _ from 'lodash'

import {color0B40B1, color3777EE, colorF8F8F8, colorFFFFFF} from 'constants/colors'
import Translate from '../../../translate'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import { convertDMMMYYYY } from 'constants/DateHelpers'

import icService from '../../../../assets/images/services'

import BoxHistory from './BoxHistory'
import LoadingView from 'components/LoadingView'

export default function ClinicHistory() {
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const [isLoad, setLoading] = useState(true)
  const [listHistory, setListHistory] = useState([])
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)

  useEffect(() => {
    callAPIListHistory()
    DeviceEventEmitter.addListener('requestclinic', () => {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    })
  }, [isLoad])

  useEffect(() => {
    callAPIListHistory()
  }, [refreshing])

  const callAPIListHistory = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/getClinicAppointmentRequests`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        setLoading(false)
        console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.clinicRequests || []
          setListHistory(getList)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const RenderItem = ({item, index}) => {
    const _onPressWeb = () => {
      var url = `https://${item?.website}/`
      Linking.openURL(url)
    }
    const _onPressPhone = () => {
      let phoneNumber = _.replace(item.phone, '-', '')
      console.log('phone: ', phoneNumber)
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
    return (
      <View style={styles.marginB16}>
        <BoxHistory
          name={item?.description}
          date={convertDMMMYYYY(item?.insertDate)}
          address={item?.address}
          website={item?.website}
          onPressWeb={_onPressWeb}
          phone={item?.phone}
          onPressPhone={_onPressPhone}
          backgroundColor={colorFFFFFF}
          border
        />
      </View>
    )
  }

  const renderFlatlist = () => {
    return (
      <View style={styles.ctnListHistory}>
        <FlatList
          data={listHistory}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.paddingB48}>
        {renderFlatlist()}
      </View>
    )
  }

  const _onRefresh = () => {
    setRefresh(true)
    setToggleReload(Math.random())
    setTimeout(() => {
      setRefresh(false)
    }, 5000)
  }

  return (
    <View style={styles.container}>
      <ScrollView
       refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={_onRefresh}
          tintColor={color0B40B1}
        />
       }
      >{renderBody()}</ScrollView>
      {isLoad && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  paddingB48: {
    paddingBottom: 48
  },
  marginB16: {
    marginBottom: 16
  },
  ctnListHistory: {
    marginTop: 16,
    marginHorizontal: 20
  }
})
