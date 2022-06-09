import React, { useState, useEffect } from 'react'
import {View, Text, StyleSheet, ScrollView, FlatList, DeviceEventEmitter, RefreshControl} from 'react-native'
import {useSelector} from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../api/APIs'

import {colorF8F8F8, colorFFFFFF, color3777EE, color0B40B1} from 'constants/colors'
import Translate from '../../../translate'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import { convertDMMMYYYY } from 'constants/DateHelpers'

import icHeader from '../../../../assets/images/header'
import icVisit from '../../../../assets/images/visit'

import Header from '../../healthProfile/components/Header'
import SOSButton from '../../home_screen/components/SOSButton/SOSButton'
import BoxHistory from './BoxHistory'
import LoadingView from 'components/LoadingView'

export default function DoctorAtHomeHistory() {
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const [isLoad, setLoading] = useState(true)
  const [listHistory, setListHistory] = useState([])
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)
  const [reload, setReload] = useState(1)

  useEffect(() => {
    callAPIListHistory()
    DeviceEventEmitter.addListener('doctorathome', () => {
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
      url: `${APIs.hostAPI}backoffice/doctorAtHome`,
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
          const getList = response.data || []
          const sortNewList = getList.reverse()
          setListHistory(sortNewList)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const RenderItem = ({item, index}) => {
    return (
      <View style={styles.marginB16}>
        <BoxHistory
          reportDate={convertDMMMYYYY(item?.date)}
          type={item?.doctorType}
          description={item?.description}
          patientName={item?.subject}
          backgroundColor={colorFFFFFF}
          address={item?.address}
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
      <View style={styles.paddingBottom}>
        {renderFlatlist()}
      </View>
    )
  }

  const _onRefresh = () => {
    setRefresh(true)
    setToggleReload(Math.random())
    setTimeout(() => {
      setRefresh(false)
    }, 3000)
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
  paddingBottom: {
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
