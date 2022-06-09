import { apiGetDetailReminder, apiGetReminderReasons, apiPostReminderReject, apiPutReminder, apiPutReminderTaken } from 'api/Reminder'
import CustomDatePicker from 'components/CustomDatePicker'
import Header from 'components/Header'
import LoadingView from 'components/LoadingView'
import NoDataView from 'components/NoDataView'
import SearchListWithName from 'components/SearchListWithName'
import { color040404, color0B40B1, color3777EE, color5C5D5E, colorE53E3E, colorFFFFFF } from 'constants/colors'
import CSS, { border, customTxt } from 'constants/css'
import { convertDateDDMMYYYYMMssToSever, convertNumberTohhmmA, convertTimeLocalYYYYMMDDHHmmToSever, getDateToSever } from 'constants/DateHelpers'
import Fonts from 'constants/Fonts'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import React, { useState, useEffect } from 'react'
import {
  StyleSheet, View, Text, TouchableOpacity, FlatList,
  DeviceEventEmitter, Image, RefreshControl
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Translate from 'translate'
import icHeader from '../../../assets/images/header'
import icReminder from '../../../assets/images/reminder'
import ConfirmView from './components/ConfirmView'
import ScheduleView from './components/ScheduleView'

export default function RemindersView({
  route
}) {
  const languageRedux = useSelector(state => state.common.language)
  const passingData = route?.params?.data || []
  const dispatch = useDispatch()
  const [data, setData] = useState([])
  const [timestamp, setTimestamp] = useState(1634521813682)
  const [isLoading, setLoading] = useState(true)
  const [isSkip, setSkip] = useState(false)
  const [since, setSince] = useState(new Date())
  const datePickerRef = React.createRef()
  const datePickerConfirmRef = React.createRef()
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)
  const [itemUpdate, setItemUpdate] = useState()

  const [isConfirm, setShowConfirm] = useState(false)

  const [lsReason, setLsReason] = useState([])
  const [isShowReason, setShowReason] = useState(false)

  useEffect(() => {
    callAPILsReasons()
  }, [])

  useEffect(() => {
    callAPI()
  }, [toggleReload])

  const callAPI = () => {
    const customData = passingData?.customData || ''
    const getLsCustom = customData.split(',')
    if ((getLsCustom || []).length > 1) {
      const arrId = (getLsCustom[1] || '').trim().split(':')
      if ((arrId || []).length > 1) {
        dispatch(apiGetDetailReminder(arrId[1])).then(res => {
          console.log('apiGetDetailReminder: ', res)
          const getLsData = res?.payload?.medicina || []
          setData(getLsData)
          setTimestamp(res?.payload?.timestamp)
          setTimeout(() => {
            setLoading(false)
            setRefresh(false)
          }, 500)
        }).catch(() => {
          setTimeout(() => {
            setLoading(false)
            setRefresh(false)
          }, 500)
        })
      }
    }
  }

  const callAPILsReasons = () => {
    dispatch(apiGetReminderReasons()).then(res => {
      const getLs = res?.payload?.data || []
      setLsReason(getLs)
    }).catch(() => { })
  }

  const onPressSkip = (item) => {
    setSince(new Date())
    setSkip(true)
    setItemUpdate(item)
  }

  const onPressHaveNot = (item) => {
    setSince(new Date())
    setItemUpdate(item)
    setShowReason(true)
  }

  const onPressConfirm = (item) => {
    setSince(new Date())
    setItemUpdate(item)
    setShowConfirm(true)
  }

  const renderCell = (item) => {
    return (
      <View style={[
        styles.cellView,
        CSS.shadown
      ]}>
        <View style={styles.dateView}>
          <Image source={icReminder.ic_clock_white} style={styles.imgClock} />
          <Text style={[
            customTxt(Fonts.Bold, 16, colorFFFFFF).txt,
            styles.txtDate
          ]}>{timestamp ? convertNumberTohhmmA(timestamp) : ''}</Text>
        </View>
        <View style={[
          styles.medicalView,
          border().borderB
        ]}>
          <Image source={icReminder.ic_medical} style={styles.imgMedical} />
          <View style={styles.contentMedicalView}>
            <Text style={[
              customTxt(Fonts.Bold, 14, color040404).txt,
              styles.txtDrug
            ]}>{item?.drugName || ''}</Text>
            <Text style={[
              customTxt(Fonts.Regular, 14, color5C5D5E).txt,
              styles.txtDrug
            ]}>{item?.dosage || ''}</Text>
          </View>
        </View>
        <View style={styles.medicalView}>
          <TouchableOpacity
            onPress={() => onPressConfirm(item)}
            style={styles.btStyle}
          >
            <Image source={icReminder.ic_tick} style={styles.imgIcon} />
            <Text style={customTxt(Fonts.Bold, 14, color3777EE).txt}>{Translate(languageRedux).DONE_BTN}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btStyle}
            onPress={() => onPressSkip(item)}
          >
            <Image source={icReminder.ic_reload} style={styles.imgIcon} />
            <Text style={customTxt(Fonts.Bold, 14, color5C5D5E).txt}>{Translate(languageRedux).skip_step}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onPressHaveNot(item)}
            style={styles.btStyle}
          >
            <Image source={icReminder.ic_close_blue} style={styles.imgIcon} />
            <Text style={customTxt(Fonts.Bold, 14, colorE53E3E).txt}>{Translate(languageRedux).MISSED_BT}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const _onRefresh = () => {
    setRefresh(true)
    setToggleReload(Math.random())
  }

  const renderContent = () => {
    return (
      <View style={[
        styles.container,
        border().borderT
      ]}>
        {(data || []).length === 0 && <NoDataView />}
        <FlatList
          data={data}
          key={'#1RemindersView'}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={_onRefresh}
              tintColor={color0B40B1}
            />
          }
          renderItem={({ item }) => renderCell(item)}
        />
      </View>
    )
  }

  const _onPressSince = () => {
    if (datePickerRef?.current && isSkip) {
      datePickerRef?.current?.onPressDate()
    }

    if (datePickerConfirmRef?.current && isConfirm) {
      datePickerConfirmRef?.current?.onPressDate()
    }
  }

  const _onChangeDatePicker = (date) => {
    setSince(date)
  }

  const _onPressUpdate = () => {
    const params = {
      answer: itemUpdate?.answer,
      date: convertDateDDMMYYYYMMssToSever(since),
      dosage: itemUpdate?.dosage,
      drugName: itemUpdate?.drugName,
      idMed: itemUpdate?.idMed,
      index: itemUpdate?.index,
      posdate: convertDateDDMMYYYYMMssToSever(since),
      postpone: 1,// không biết là gì
      reminderId: itemUpdate?.reminderId,
      tc: convertTimeLocalYYYYMMDDHHmmToSever(since),
      time: convertDateDDMMYYYYMMssToSever(since),
      timeZone: (new Date()).getTimezoneOffset(),
      type: itemUpdate?.type
    }
    setSkip(false)
    setLoading(true)
    dispatch(apiPutReminder(params)).then(res => {
      setLoading(false)
      if (res?.payload?.esito === '0') {
        setTimeout(() => {
          DeviceEventEmitter.emit(Routes.NOTIFICATION_SCREEN)
        }, 300)
        return NavigationService.goBack()
      }
    }).catch(() => {
      setLoading(false)
    })
  }

  const _onPressHaveNotTakenItYet = (val) => {
    if (itemUpdate) {
      setShowReason(false)
      const param = {
        idMed: itemUpdate?.idMed,
        reasonId: val?.id || 19,
        reminderId: itemUpdate?.reminderId
      }
      setLoading(true)
      dispatch(apiPostReminderReject(param)).then(res => {
        setLoading(false)
        if (res?.payload?.esito === '0') {
          return NavigationService.navigateAndReset(Routes.DRAWER_NAVIGATION)
        }
      }).catch(() => {
        setLoading(false)
      })
    }
  }

  const _onPressConfirm = () => {
    if (itemUpdate?.idMed && itemUpdate?.reminderId) {
      setShowConfirm(false)
      const convertDate = getDateToSever(since)
      setLoading(true)
      dispatch(apiPutReminderTaken(itemUpdate?.idMed, convertDate, itemUpdate?.reminderId)).then(res => {
        setLoading(false)
        if (res?.payload?.esito === '0') {
          return NavigationService.navigateAndReset(Routes.DRAWER_NAVIGATION)
        }
      }).catch(() => {
        setLoading(false)
      })
    }
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).pa}
        iconLeft={icHeader.ic_left}
        onPressLeft={() => {
          setTimeout(() => {
            DeviceEventEmitter.emit(Routes.NOTIFICATION_SCREEN)
          }, 300)
          NavigationService.goBack()
        }}
      />
      {renderContent()}
      {isLoading && <LoadingView />}
      {isSkip && (
        <ScheduleView
          setShow={val => setSkip(val)}
          since={since}
          onPressSince={_onPressSince}
          onPressUpdate={_onPressUpdate}
        />
      )}
      {isConfirm && (
        <ConfirmView
          setShow={val => setShowConfirm(val)}
          since={since}
          onPressSince={_onPressSince}
          onPressUpdate={_onPressConfirm}
        />
      )}
      <CustomDatePicker
        refDatePicker={datePickerRef}
        onChangeDate={_onChangeDatePicker}
        date={since || new Date()}
        mode={'datetime'}
        minDate={new Date()}
      />
      <CustomDatePicker
        refDatePicker={datePickerConfirmRef}
        onChangeDate={_onChangeDatePicker}
        date={since || new Date()}
        mode={'time'}
      />
      {
        isShowReason && (
          <SearchListWithName
            listData={lsReason}
            title={Translate(languageRedux).REASON_FOR_NOT_TAKING_THE_MEDICINE}
            onItemClick={_onPressHaveNotTakenItYet}
            onPressRight={() => {
              setShowReason(false)
            }}
          />
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cellView: {
    flex: 1,
    backgroundColor: colorFFFFFF,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 8
  },
  dateView: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: color3777EE,
    alignItems: 'center',
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    overflow: 'hidden'
  },
  txtDate: {
    paddingRight: 20
  },
  imgClock: {
    width: 20,
    height: 20,
    marginLeft: 20,
    marginRight: 10,
    resizeMode: 'contain'
  },
  imgIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginBottom: 5
  },
  medicalView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  imgMedical: {
    width: 40,
    height: 40,
    margin: 16,
    marginBottom: 20
  },
  contentMedicalView: {
    flex: 1
  },
  btStyle: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 16
  },
  txtDrug: {
    marginRight: 16
  }
})
