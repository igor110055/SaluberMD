import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity, DeviceEventEmitter } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { color3777EE, colorA7A8A9, colorFFFFFF } from 'constants/colors'
import Translate from '../../../translate'
import NavigationService from 'navigation'
import icHeader from '../../../../assets/images/header'
import Header from 'components/Header'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Fonts from 'constants/Fonts'
import LoadingView from 'components/LoadingView'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
// import axios from 'axios'
// import * as APIs from '../../../api/APIs'
// import Routes from 'navigation/Routes'
import AboutUsView from './AboutUs'
import PrivacyPolicyView from './PrivacyPolicy'
import imgContact from '../../../../assets/images/contact_us'
import { customTxt } from 'constants/css'
import NewTicketView from './NewTicket'
import SearchListWithName from 'components/SearchListWithName'
import { apiGetTicket } from 'api/Common'

const Tab = createMaterialTopTabNavigator()

export default function ContactDoctorView() {
  // const dispatch = useDispatch()
  // const userinfoRedux = useSelector(state => state.user.userinfo)
  const languageRedux = useSelector(state => state.common.language)
  const [isLoading, setLoading] = useState(true)
  const [dataNoti, setDataNoti] = useState()
  const [isShowNoti, setShowNoti] = useState(false)
  // const token = useSelector(state => state.user.token)
  const [isPopup, setShowPopup] = useState(false)
  const [isCategory, setShowCategory] = useState(false)
  const [lsCategory, setLsCategory] = useState([])
  const [isPriority, setShowPriority] = useState(false)
  const lsPriority = [
    {
      name: '1',
      value: 1
    },
    {
      name: '2',
      value: 2
    },
    {
      name: '3',
      value: 3
    }
    // ,
    // {
    //   name: '4',
    //   value: 4
    // }
    // , {
    //   name: '5',
    //   value: 5
    // }
  ]
  const [category, setCategory] = useState()
  const [priority, setPrionity] = useState()
  const dispatch = useDispatch()

  useEffect(() => {
    callAPIGetData()
  }, [])

  //** Function */
  const callAPIGetData = () => {
    dispatch(apiGetTicket()).then(res => {
      setLoading(false)
      console.log('apiGetTicket : ', res?.payload)
      console.log('categories : ', res?.payload?.categories)
      if ((res?.payload?.categories || []).length > 0) {
        setLsCategory(res?.payload?.categories || [])
      } else {
        setDataNoti({
          status: STATUS_NOTIFY.ERROR,
          content: res?.payload?.motivo || 'error'
        })
        setTimeout(() => {
          setShowNoti(true)
        }, 500)
      }
    }).catch(() => {
      setLoading(false)
    })
  }
  //******renderView

  const _onPress = () => {
    setShowPopup(!isPopup)
    setCategory()
    setPrionity()
  }

  const renderNewTicket = () => {
    return (
      <TouchableOpacity style={styles.editView} onPress={_onPress}>
        <Image source={imgContact.ic_edit} style={styles.imgEdit} />
        <Text style={[
          customTxt(Fonts.Bold, 14, colorFFFFFF).txt
        ]}>{Translate(languageRedux).new_ticket}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_menudrawer}
        textCenter={Translate(languageRedux).CONTACT_US_TITLE}
        onPressLeft={() => NavigationService.openDrawer()}
      />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: color3777EE,
          tabBarInactiveTintColor: colorA7A8A9,
          tabBarLabelStyle: {
            fontSize: 14,
            textTransform: 'none',
            fontFamily: Fonts.SemiBold
          },
          tabBarStyle: {
            height: 52,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16
          },
          tabBarIndicatorStyle: {
            height: 4,
            width: 76,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            marginHorizontal: ((Dimensions.get('window').width) / 2 - 76) / 2
          }
        }}>
        <Tab.Screen
          name={'AboutUsView'}
          options={{ tabBarLabel: Translate(languageRedux).ABOUT_US_TITLE || '' }}
          component={AboutUsView}
        />
        <Tab.Screen
          name={'PrivacyPolicyView'}
          options={{ tabBarLabel: Translate(languageRedux).PRIVACY_POLICY_TITLE || '' }}
          component={PrivacyPolicyView}
        />
      </Tab.Navigator>
      {renderNewTicket()}
      {
        isPopup && (
          <NewTicketView
            onPressClose={() => setShowPopup(false)}
            onPressCategory={() => setShowCategory(true)}
            onPressPriority={() => setShowPriority(true)}
            dataCategory={category}
            dataPriority={priority}
            setLoading={val => setLoading(val)}
            setDataNoti={val => setDataNoti(val)}
            setShowNoti={val => setShowNoti(val)}
          />
        )
      }
      {
        isCategory && (
          <SearchListWithName
            listData={lsCategory || []}
            title={Translate(languageRedux).category}
            itemSelected={category}
            onItemClick={(val) => {
              setCategory(val)
              setShowCategory(false)
              DeviceEventEmitter.emit('NewTicketView', { category: val, priority: priority })
            }}
            onPressRight={() => setShowCategory(false)}
            hideSearchText={true}
          />
        )
      }
      {
        isPriority && (
          <SearchListWithName
            listData={lsPriority}
            isSortNumber={true}
            title={Translate(languageRedux).priority}
            itemSelected={priority}
            onItemClick={(val) => {
              setPrionity(val)
              DeviceEventEmitter.emit('NewTicketView', { category: category, priority: val })
              setShowPriority(false)
            }}
            onPressRight={() => setShowPriority(false)
            }
            hideSearchText={true}
          />
        )
      }
      {isLoading && <LoadingView />}
      <NotificationView
        isShow={isShowNoti}
        setShow={() => setShowNoti(false)}
        status={dataNoti?.status || STATUS_NOTIFY.ERROR}
        content={dataNoti?.content || ''}
        dataCategory={category}
        dataPriority={priority}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  editView: {
    position: 'absolute',
    flexDirection: 'row',
    right: 16,
    bottom: 60,
    backgroundColor: color3777EE,
    borderRadius: 20,
    alignItems: 'center',
    paddingRight: 12
  },
  imgEdit: {
    width: 20,
    height: 20,
    marginTop: 10,
    marginLeft: 12,
    marginRight: 8,
    marginBottom: 9
  }
})
