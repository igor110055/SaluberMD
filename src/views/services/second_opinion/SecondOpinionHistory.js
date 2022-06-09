import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, ScrollView, FlatList, DeviceEventEmitter, RefreshControl} from 'react-native'
import {useSelector} from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../api/APIs'

import {colorFFFFFF, color3777EE, color0B40B1} from 'constants/colors'
import { convertDMMMYYYY } from 'constants/DateHelpers'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'

import LoadingView from 'components/LoadingView'
import BoxHistory from './BoxHistory'

export default function SecondOpinionHistory() {
  const token = useSelector(state => state.user.token)
  const [isLoad, setLoading] = useState(true)
  const [listHistory, setListHistory] = useState([])
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)
  const [reload, setReload] = useState(1)
  const [listFile, setListFile] = useState([])

  useEffect(() => {
    callAPIListHistory()
    saveListFile()
    DeviceEventEmitter.addListener('secondopinion', () => {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 10000)
    })
  }, [isLoad, toggleReload])

  useEffect(() => {
    callAPIListHistory()
    saveListFile()
    setTimeout(() => {
      if (reload < 3) {
        setReload(reload + 1)
      }
    }, 500)
  }, [refreshing, reload])

  const callAPIListHistory = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/secondopinion/getSurvey`,
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
          const getList = response.data.data || []
          setListHistory(getList)
          console.log('lengt: ', (getList || []).length)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const saveListFile = () => {
    var data = []
    for (var i = 0; i <= (listHistory || []).length - 1; i++) {
      for (var j = 0; j <= (listHistory[i]?.files).length - 1; j++) {
        var item = {}
        item.fileName = (listHistory[i]?.files).length > 0 ? listHistory[i]?.files[j]?.fileName : ''
        item.id = listHistory[i]?.id
        data.push(item)
      }
    }
    setListFile(data)
    console.log('listFile: ', listFile)
  }

  const RenderItem = ({item, index}) => {
    const checkFile = () => {
      for (var i = 0; i <= (listFile || []).length - 1; i++) {
        if (item?.id === listFile[i]?.id) {
          return (
            <View>
              <Text style={[customTxt(Fonts.Regular, 16, color3777EE).txt, styles.marginL32]}>
                {listFile[i]?.fileName}
              </Text>
            </View>
          )
        }
      }
    }
    return (
      <View style={styles.marginB16}>
        <BoxHistory
          special={item?.specializationName}
          date={convertDMMMYYYY(item?.requestDate)}
          who={item?.answer1}
          question={item?.question}
          backgroundColor={colorFFFFFF}
          attachmentName={checkFile()}
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
  },
  marginL32: {
    marginLeft: 32
  }
})
