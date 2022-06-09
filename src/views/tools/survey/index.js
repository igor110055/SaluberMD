import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, ScrollView, FlatList} from 'react-native'
import { useSelector } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../api/APIs'

import { color040404, colorF8F8F8, colorFFFFFF } from 'constants/colors'
import NavigationService from 'navigation'
import Translate from '../../../translate'
import Routes from 'navigation/Routes'

import icHeader from '../../../../assets/images/header'

import Header from '../../../components/Header'
import LoadingView from '../../../components/LoadingView'
import Info from '../../healthProfile/components/Info'

export default function Surveys() {
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const [listSurvey, setListSurvey] = useState()
  const [isLoad, setLoading] = useState(true)

  useEffect(() => {
    callAPIListSurvey()
  }, [])

  const callAPIListSurvey = () => {
    axios({
        method: 'get',
        url: `${APIs.hostAPI}backoffice/survey/getAllSurveys`,
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
          const getList = response.data.surveys || []
          setListSurvey(getList)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const RenderItem = ({item, index, data}) => {
    const _onPressItem = () => {
      NavigationService.navigate(Routes.SURVEYS_DETAIL_SCREEN, {
        data: item?.url
      })
    }
    return (
      <View>
        <Info
          title={item?.name}
          subTitle={''}
          borderBottomLeftRadius={(index === (data || []).length - 1) ? 16 : 0}
          borderBottomRightRadius={(index === (data || []).length - 1) ? 16 : 0}
          borderTopLeftRadius={(index === 0) ? 16 : 0}
          borderTopRightRadius={(index === 0) ? 16 : 0}
          onPress={_onPressItem}
          titleColor={color040404}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.marginT20}>
        <FlatList
          data={listSurvey || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} data={listSurvey} />
          )}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_left}
        textCenter={Translate(languageRedux).SURVEYS}
        textCenterColor={color040404}
        onPressLeft={() => {
          NavigationService.goBack()
        }}
      />
      <ScrollView>{renderBody()}</ScrollView>
      {isLoad && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  marginT20: {
    marginTop: 20
  }
})
