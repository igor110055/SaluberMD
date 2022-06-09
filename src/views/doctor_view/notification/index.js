import React, { useEffect, useState } from 'react'
import {
  View, StyleSheet, TouchableOpacity, Text, FlatList,
  RefreshControl, ActivityIndicator, DeviceEventEmitter
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import Header from '../../../components/Header'
import {
  color040404, color2F80ED, color3777EE, color5C5D5E,
  colorE53E3E, colorEB5757, colorF8F8F8, colorFFFFFF
} from 'constants/colors'
import NavigationService from 'navigation'
import Translate from '../../../translate'
import icHeader from '../../../../assets/images/header'
import LoadingView from 'components/LoadingView'
import DialogCustom from 'components/DialogCustom'
import { apiCountNotification, apiGetNotificationDoctor, apiPutReadNotificaiton } from 'api/Notification'
import _ from 'lodash'
import { border, customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import { convertNumberToMMMDDYYYYhhmmA } from 'constants/DateHelpers'
import NoDataView from 'components/NoDataView'
import imgNoData from '../../../../assets/images/nodata'
import Routes from 'navigation/Routes'
import { saveCountNoti } from 'actions/common'

export default function NotificationDoctorView() {
  const dispatch = useDispatch()
  const languageRedux = useSelector(state => state.common.language)
  const [isLoad, setLoading] = useState(true)
  const [isDialog, setDialog] = useState(false)

  const [toggleReload, setToggleReload] = useState(1)
  const [page, setPage] = useState(0)
  const [isLoadmore, setLoadmore] = useState(false)
  const [preventLoadmore, setPreventLoadmore] = useState(false)
  const [refreshing, setRefresh] = useState(false)
  const [data, setData] = useState([])
  const [updateList, setUpdateList] = useState(1)
  const permissionRedux = useSelector(state => state.user.permission)

  useEffect(() => {
    callAPI()
  }, [toggleReload])

  const callAPI = () => {
    dispatch(apiGetNotificationDoctor(page)).then(res => {
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

  const callAPIRead = (dataItem) => {
    if (_.isEmpty(dataItem?.id)) {
      return
    }
    setLoading(true)
    dispatch(apiPutReadNotificaiton(dataItem?.id)).then(res => {
      console.log('apiPutReadNotificaiton: ', res)
      if (res?.payload?.esito === '0') {
        const updateData = dataItem
        updateData.read = '1'

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
    })
  }

  const callAPICountNoti = () => {
    dispatch(apiCountNotification()).then(res => {
      const dataNoti = res?.payload?.total || null
      Promise.all([
        dispatch(saveCountNoti(dataNoti))
      ])
    })
  }

  const onPressDetail = (item) => {
    callAPIRead(item)
    onPressNotificationAction(item)
  }

  const onPressNotificationAction = (dataNoti) => {
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
    if (permissionRedux?.isDoctor) {
      switch (dataNoti?.customData) {
        case 'action:54':
          setTimeout(() => {
            DeviceEventEmitter.emit(Routes.AGENDA_DOCTOR_VIEW, { appointment: true })
          }, 1000)
          setTimeout(() => {
            NavigationService.navigate(Routes.AGENDA_DOCTOR_VIEW)
          }, 500)
          return NavigationService.popToRoot()
        default:
          if (_.includes(dataNoti?.customData, 'action:57')) {
            setTimeout(() => {
              DeviceEventEmitter.emit(Routes.AGENDA_DOCTOR_VIEW, { appointment: true })
            }, 1000)
            setTimeout(() => {
              NavigationService.navigate(Routes.AGENDA_DOCTOR_VIEW)
            }, 500)
            return NavigationService.popToRoot()
          } else if (_.includes(dataNoti?.customData, 'action:54,webConferenceId')) {
            setTimeout(() => {
              DeviceEventEmitter.emit(Routes.AGENDA_DOCTOR_VIEW, { history: true })
            }, 1000)
            setTimeout(() => {
              NavigationService.navigate(Routes.AGENDA_DOCTOR_VIEW)
            }, 500)
            return NavigationService.popToRoot()
          }
          break
      }
    } else {
      switch (dataNoti?.customData || '0') {
        case 'action:22':
        case '22':
          return NavigationService.navigate(Routes.CHANGE_PASSWORD_SCREEN)
        case 'action:50':
        case '50':
          return NavigationService.navigate(Routes.HEALTH_PROFILE_TRACKING_SCREEN)
        case 'action:51':
        case '51'://DETAIL_REMINDER_VIEW   , {data: data}
          return NavigationService.navigate(Routes.MEDICINE_REMINDER_SCREEN)
        case 'action:52':
        case '52':
          setTimeout(() => {
            DeviceEventEmitter.emit(Routes.NOTIFICATION_SCREEN, { tabs: 1 })
          }, 500)
          return NavigationService.navigate(Routes.NOTIFICATION_SCREEN)
        case 'action:53':
        case 'action:54':
        case '53': case '54':
          return NavigationService.navigate(Routes.VISIT_MAIN_SCREEN)
        case 'action:58':
        case '58':
          setTimeout(() => {
            DeviceEventEmitter.emit(Routes.VISIT_MAIN_SCREEN, { tabs: 1 })
          }, 500)
          return NavigationService.navigate(Routes.VISIT_MAIN_SCREEN)
        default:
          return NavigationService.navigate(Routes.DETAIL_NOTIFICATION_DOCTOR_SCREEN, { data: dataNoti })
      }
    }
  }

  const renderCell = (item, idx) => {
    const bgColor = item?.read === '0' ? { backgroundColor: colorEB5757 } : { backgroundColor: color2F80ED }
    return (
      <TouchableOpacity
        onPress={() => onPressDetail(item)}
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
            ]}>{item?.date ? convertNumberToMMMDDYYYYhhmmA(Number(item?.date)) : ''}</Text>
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

  const renderListData = () => {
    return (
      <View style={styles.container}>
        {data.length > 0 ? null : (
          <NoDataView
            imageSource={imgNoData.img_nodata_pharmacies}
            text={Translate(languageRedux).ALERT_NO_DATA}
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
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).NOTIFICATIONS_TITLE}
        iconLeft={icHeader.ic_left}
        onPressLeft={() => {
          NavigationService.goBack()
        }}
      />
      {renderListData()}
      {isLoadmore && !preventLoadmore ? (
        <ActivityIndicator size="small" />
      ) : null}
      {isLoad && <LoadingView />}
      {
        isDialog && (
          <DialogCustom
            title={Translate(languageRedux).ALERT}
            content={Translate(languageRedux).DELETE_NOTIFICATION_MSG}
            txtlLeft={Translate(languageRedux).cancel}
            onPressCancel={() => setDialog(false)}
            txtRight={Translate(languageRedux).delete_record}
            styleRightView={styles.styleRightView}
            onPressOK={() => { }}
          />
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  styleRightView: {
    backgroundColor: colorE53E3E
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
    flexDirection: 'row',
    alignItems: 'center'
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
