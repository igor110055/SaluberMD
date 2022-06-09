import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'

import { color040404, colorFFFFFF } from 'constants/colors'
import Translate from '../../../../translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'

import icHeader from '../../../../../assets/images/header'
import icHealthProfile from '../../../../../assets/images/health_profile'
import icDirect from '../../../../../assets/images/direct_call'

import Header from '../../../healthProfile/components/Header'
import LoadingView from '../../../../components/LoadingView'

export default function ViewProfile() {

  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const [isLoad, setLoading] = useState(true)
  const [data, setData] = useState(true)

  useEffect(() => {
    callAPIOurDoctor()
  }, [])

  const callAPIOurDoctor = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/article/tips/2`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getData = response.data || []
          setData(getData)
        }
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        console.log(error)
      })
  }

  const RenderItem = ({item, index}) => {
    const _onPressItem = () => {
      NavigationService.navigate(Routes.DETAIL_VIEW_PROFILE_DOCTOR_SCREEN, {
        data: item,
        index: index
      })
    }
    return (
      <TouchableOpacity onPress={_onPressItem} style={styles.ctnLine}>
        <View style={styles.nameDoctor}>
          {!item?.image?.base64 ? <Image source={icDirect.ic_avatar} style={styles.avatarDoctor} /> :
          <Image source={{uri: `data:image;base64,${item?.image?.base64}`}} style={styles.avatarDoctor} />}
          <Text style={[customTxt(Fonts.Bold, 14, color040404).txt, styles.marginL12]}>{item?.name}</Text>
        </View>
        <Image source={icHealthProfile.ic_right} style={styles.iconStyle} />
      </TouchableOpacity>
    )
  }

  const renderListDoctor = () => {
    return (
      <View style={styles.ctnList}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.paddingBottom}>
        {renderListDoctor()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        source={icHeader.ic_left}
        title={Translate(languageRedux).ABOUT_US_SECTION3_TITLE}
      />
      <ScrollView>{renderBody()}</ScrollView>
      {isLoad && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  imageStyle: {
    height: 219,
    width: '100%'
  },
  ctnLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8
  },
  avatarDoctor: {
    height: 60,
    width: 60,
    borderRadius: 30
  },
  nameDoctor: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  marginL12: {
    marginLeft: 12
  },
  ctnList: {
    marginHorizontal: 20
  },
  paddingBottom: {
    paddingBottom: 48
  }
})
