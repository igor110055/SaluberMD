import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image} from 'react-native'
import {useSelector} from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../api/APIs'

import {color040404, color3777EE, color5C5D5E, colorDDDEE1, colorF8F8F8, colorFFFFFF} from 'constants/colors'
import Translate from '../../../translate'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'

import icHeader from '../../../../assets/images/header'
import icHealth from '../../../../assets/images/health_profile'

import Header from 'components/Header'
import LoadingView from 'components/LoadingView'
import NoDoctorAvailable from './NoDoctorAvailable'

export default function Step1() {
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const userinfo = useSelector(state => state.user.userinfo)
  const [isLoad, setLoading] = useState(true)
  const [listDoctor, setListDoctor] = useState([])
  const [isChoose, setChoose] = useState()

  useEffect(() => {
    callAPIListDoctor()
  }, [])

  const callAPIListDoctor = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}/backoffice/findNutritionist/${userinfo?.specialization}`,
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
          const getList = response.data.dottori || []
          setListDoctor(getList)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const RenderItem = ({item}) => {
    const _onPressItem = () => {
      setChoose(item)
      setTimeout(() => {
        NavigationService.navigate(Routes.NUTRITIONIST_2_SCREEN, {
          data: item
        })
      }, 500)
    }
    const txtNameDocColor = {color: isChoose ? colorFFFFFF : color040404}
    const txtInfoColor = {color: isChoose ? colorFFFFFF : color5C5D5E}
    return (
      <TouchableOpacity onPress={_onPressItem} style={isChoose ? styles.boxDoctor2 : styles.boxDoctor}>
        <View>
          <Text style={[customTxt(Fonts.Bold, 14, color040404).txt, txtNameDocColor]}>{item?.nome}{' '}{item?.cognome}</Text>
          <View style={styles.fee}>
            <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, txtInfoColor]}>{item?.currency}</Text>
            <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, txtInfoColor]}>{item?.fee}{' - '}</Text>
            <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, txtInfoColor]}>{item?.timeslot}{' '}</Text>
            <Text style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, txtInfoColor]}>
              {Translate(languageRedux).minutes}
            </Text>
          </View>
        </View>
        <View>
          <Image source={icHealth.ic_right} style={styles.iconStyle} />
        </View>
      </TouchableOpacity>
    )
  }

  const renderFlatlist = () => {
    return (
      <View>
        <FlatList
          data={listDoctor}
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
        <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.ctnTitle]}>
            {Translate(languageRedux).selectnutritionist}
        </Text>
        {renderFlatlist()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {(listDoctor || []).length > 0 && <View>
        <Header
          backgroundColor={colorFFFFFF}
          iconLeft={icHeader.ic_left}
          textCenter={Translate(languageRedux).nutritionist}
          textCenterColor={color040404}
          onPressLeft={() => {
            NavigationService.goBack()
          }}
        />
        <ScrollView>{renderBody()}</ScrollView>
      </View>}
      {(listDoctor || []).length === 0 && <NoDoctorAvailable />}
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
    paddingBottom: 48,
    marginHorizontal: 20
  },
  boxDoctor: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: colorFFFFFF,
    shadowColor: '#4687FF',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.24,
    shadowRadius: 4,
    elevation: 9,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  boxDoctor2: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: color3777EE,
    shadowColor: '#4687FF',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.24,
    shadowRadius: 4,
    elevation: 9,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  fee: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center'
  },
  ctnTitle: {
    marginBottom: 16
  },
  iconStyle: {
    height: 24,
    width: 24
  }
})
