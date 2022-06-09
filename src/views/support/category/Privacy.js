import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import HTML from 'react-native-render-html'
import axios from 'axios'
import * as APIs from '../../../api/APIs'

import { colorFFFFFF } from 'constants/colors'
import Translate from '../../../translate'

import icHeader from '../../../../assets/images/header'

import Header from '../../healthProfile/components/Header'
import LoadingView from '../../../components/LoadingView'
import { ScrollView } from 'react-native-gesture-handler'

export default function Privacy() {

    const languageRedux = useSelector(state => state.common.language)
    const token = useSelector(state => state.user.token)
    const [isLoad, setLoading] = useState(true)
    const [content, setContent] = useState()

    useEffect(() => {
      callAPIListDisease()
    }, [])

    const callAPIListDisease = () => {
        axios({
          method: 'get',
          url: `${APIs.hostAPI}backoffice/getUserPrivacy`,
          headers: {
            'content-type': 'application/json',
            'x-auth-token': token
          }
        })
          .then(response => {
            // console.log('data: ', response.data)
            if (response.data.length === 0) {
              console.log('noti: ', 'can not get data')
            } else {
              console.log('noti: ', 'data has been obtained')
              const getList = response.data.text || []
              if (getList.length > 0) {
                setContent(getList)
              }
            }
            setLoading(false)
          })
          .catch(error => {
            setLoading(false)
            console.log(error)
          })
      }

    const renderContent = () => {
      return (
        <View style={styles.ctnContent}>
          <HTML source={{ html: content }} />
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <Header
          backgroundColor={colorFFFFFF}
          source={icHeader.ic_left}
          title={Translate(languageRedux).PRIVACY}
        />
        <ScrollView>{renderContent()}</ScrollView>
        {isLoad && <LoadingView />}
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  ctnContent: {
    marginHorizontal: 20
  }
})
