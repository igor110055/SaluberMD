import { apiCountNotification, apiGetNotificaitonType, apiPutReadNotificaiton } from 'api/Notification'
import LoadingView from 'components/LoadingView'
import NoDataView from 'components/NoDataView'
import { color040404, color2F80ED, color3777EE, color5C5D5E, colorEB5757, colorFFFFFF } from 'constants/colors'
import React, { useEffect, useState } from 'react'
import {
  StyleSheet, View, FlatList, Text, ActivityIndicator,
  RefreshControl, TouchableOpacity, DeviceEventEmitter
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import { convertDMMMYYYYHmm } from 'constants/DateHelpers'
import { border, customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import cloneDeep from 'lodash.clonedeep'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import { isIphoneX } from 'constants/utils'
import { saveCountNoti } from 'actions/common'
import imgNoData from '../../../../assets/images/nodata'
import Translate from 'translate'

export default function MessageScreen({ navigation }) {
  const dispatch = useDispatch()
  const [toggleReload, setToggleReload] = useState(1)
  const [isLoading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [isLoadmore, setLoadmore] = useState(false)
  const [preventLoadmore, setPreventLoadmore] = useState(false)
  const [refreshing, setRefresh] = useState(false)
  const [data, setData] = useState([])
  const [updateList, setUpdateList] = useState(1)
  const languageRedux = useSelector(state => state.common.language)

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      DeviceEventEmitter.emit(Routes.NOTIFICATION_SCREEN, { tabs: 1 })
    })

    return unsubscribe
  }, [navigation])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.NOTIFICATION_SCREEN, () => {
      setPage(0)
      setToggleReload(Math.random())
      setUpdateList(Math.random())
    })

    return () => subscription.remove()
  }, [])

  useEffect(() => {
    callAPI()
  }, [toggleReload])

  const callAPI = () => {
    dispatch(apiGetNotificaitonType(page, 1)).then(res => {
      setRefresh(false)
      setLoadmore(false)
      setLoading(false)
      console.log('res: ', res)

      const getMsg = res?.payload?.notifiche || []

      if (page === 0 && _.isEmpty(getMsg)) {
        setPreventLoadmore(true)
        setData([])
        return
      } else if (_.isEmpty(getMsg)) {
        setPreventLoadmore(true)
        return
      }

      if (page === 0) {
        setData(getMsg)
      } else {
        var newData = data
        getMsg.forEach((val) => {
          if (_.findIndex(data, { id: val?.id }) === -1) {
            newData = _.concat(newData, val)
          }
        })
        setData(newData)
      }
    }).catch(() => {
      setRefresh(false)
      setLoadmore(false)
      setLoading(false)
    })
  }

  const getDetailNotification = (dataItem) => {
    switch (dataItem?.title) {
      case 'New document':
        setTimeout(() => {
          DeviceEventEmitter.emit(Routes.HEALTH_PROFILE_TRACKING_SCREEN, { file: true })
        }, 300)
        return NavigationService.navigate(Routes.HEALTH_PROFILE_TRACKING_SCREEN)
      default:
        return NavigationService.navigate(Routes.DETAIL_MESSAGE_SCREEN, { data: dataItem })
    }
  }

  const callAPIRead = (dataItem, idx) => {
    if (_.isEmpty(dataItem?.id)) {
      return
    }
    if (dataItem?.read === '1') {
      getDetailNotification(dataItem)
    } else {
      setLoading(true)
      dispatch(apiPutReadNotificaiton(dataItem?.id)).then(res => {
        console.log('apiPutReadNotificaiton: ', res)
        getDetailNotification(dataItem)
        if (res?.payload?.esito === '0') {
          const updateData = dataItem
          updateData.read = '1'
          var newData = cloneDeep(data)
          newData = [
            ...newData,
            newData[idx] = updateData
          ]
          setData(newData)
          setTimeout(() => {
            setUpdateList(Math.random())
            setLoading(false)
            // return NavigationService.navigate(Routes.DETAIL_MESSAGE_SCREEN, {data: updateData})
          }, 200)
        } else {
          setLoading(false)
        }
        callAPICountNoti()
      }).catch(() => {
        setLoading(false)
        getDetailNotification(dataItem)
      })
    }
  }

  const callAPICountNoti = () => {
    dispatch(apiCountNotification()).then(res => {
      const dataNoti = res?.payload?.total || null
      Promise.all([
        dispatch(saveCountNoti(dataNoti))
      ])
    })
  }

  const _onRefresh = () => {
    setPreventLoadmore(false)
    setPage(0)
    setRefresh(true)
    setToggleReload(Math.random())
    setUpdateList(Math.random())
  }

  const _loadMore = () => {
    if (!preventLoadmore) {
      setPage(page + 1)
      setLoadmore(true)
      setToggleReload(Math.random())
      setUpdateList(Math.random())
    }
  }

  const _onPressRead = (item, idx) => {
    callAPIRead(item, idx)
  }

  const renderCell = (item, idx) => {
    const bgColor = item?.read === '0' ? { backgroundColor: colorEB5757 } : { backgroundColor: color2F80ED }
    return (
      <TouchableOpacity
        onPress={() => _onPressRead(item, idx)}
        style={[
          styles.cellView,
          border().borderB
        ]}>
        <View style={styles.txtCell}>
          <Text
            numberOfLines={1}
            style={[
              customTxt(Fonts.Regular, 14, color5C5D5E).txt,
              styles.txtDate
            ]}>{item?.date ? convertDMMMYYYYHmm(Number(item?.date)) : ''}</Text>
          <View style={styles.topCellView}>
            <Text
              numberOfLines={1}
              style={[
                customTxt(Fonts.Bold, 16, color040404).txt,
                styles.txtCell
              ]}>{item?.title ? item?.title : ''}</Text>
            <View style={[
              styles.readView,
              bgColor
            ]}
            />
          </View>
          <Text
            numberOfLines={2}
            style={[
              customTxt(Fonts.Regular, 14, color040404).txt,
              styles.txtContent
            ]}>{item?.message ? item?.message : ''}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const onPressNotification = (dataNoti) => {
    // type:6 - action:53, action:54 -> Appointment
    // type:6 - action:50 -> changes medical data (doctor changed in post call - disease, allergy, ...) ~ Change patient info
    // type:4 - action:52 -> send message
    // type:null - action:51 -> add or update reminder
    // type:58 - action:58 -> send prescription
    // type:100 - action:100 -> prepare question (domanda table)
    // type:22 - action:22 -> Password expiring
    // type:null - action:603 -> video call - doctor has choosen or waiting
    // type:602 - action:602 -> video call - doctor is available
    // type:null - action:601 -> video call - doctor no answer
    // type:600 - action:600 -> send notification new video call to the physicians
    switch (dataNoti?.customData || '0') {
      case '22':
        return NavigationService.navigate(Routes.CHANGE_PASSWORD_SCREEN)
      case '50':
        return NavigationService.navigate(Routes.HEALTH_PROFILE_TRACKING_SCREEN)
      case '51'://DETAIL_REMINDER_VIEW   , {data: data}
        return NavigationService.navigate(Routes.DETAIL_REMINDER_VIEW)
      case '52':
        setTimeout(() => {
          DeviceEventEmitter.emit(Routes.NOTIFICATION_SCREEN, { tabs: 1 })
        }, 500)
        return NavigationService.navigate(Routes.NOTIFICATION_SCREEN)
      case 'action:53':
      case 'action:54':
      case '53': case '54':
        return NavigationService.navigate(Routes.VISIT_MAIN_SCREEN)
      case '58':
        setTimeout(() => {
          DeviceEventEmitter.emit(Routes.VISIT_MAIN_SCREEN, { tabs: 1 })
        }, 500)
        return NavigationService.navigate(Routes.VISIT_MAIN_SCREEN)
      default:
        break
    }
  }

  const renderListData = () => {
    return (
      <View style={styles.container}>
        {data.length > 0 ? null : (
          <NoDataView
            imageSource={imgNoData.img_nodata_message}
            text={Translate(languageRedux).MESSAGE}
            noDataViewStyle={styles.ctnNoDataImg}
          />
        )}
        <FlatList
          style={styles.container}
          key={'#1AlertScreen'}
          data={data}
          extraData={updateList}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={_onRefresh}
              tintColor={color3777EE}
            />
          }
          renderItem={({ item, index }) => renderCell(item, index)}
          contentContainerStyle={styles.paddingB40}
          onEndReached={_loadMore}
          onEndReachedThreshold={0}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {renderListData()}
      {isLoadmore && !preventLoadmore ? (
        <ActivityIndicator size="small" />
      ) : null}
      {isLoading && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: isIphoneX ? 20 : 0
  },
  cellView: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: colorFFFFFF
  },
  txtCell: {
    flex: 1,
    marginRight: 20
  },
  txtDate: {
    flex: 1,
    marginTop: 5,
    marginBottom: 6
  },
  txtContent: {
    paddingBottom: 5
  },
  paddingB40: {
    paddingBottom: 20
  },
  topCellView: {
    flexDirection: 'row'
  },
  readView: {
    width: 20,
    height: 10,
    borderRadius: 5
  },
  ctnNoDataImg: {
    top: 48
  }
})
