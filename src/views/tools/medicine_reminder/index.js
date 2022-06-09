import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, FlatList, DeviceEventEmitter } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Switch } from 'react-native-switch'
import axios from 'axios'
import * as APIs from '../../../api/APIs'
import _ from 'lodash'

import { color040404, color2F80ED, color3777EE, colorF8F8F8, colorFFFFFF } from 'constants/colors'
import NavigationService from 'navigation'
import Translate from '../../../translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import { saveShowMedi } from 'actions/user'
import Routes from 'navigation/Routes'
import { saveLSMedi } from 'actions/common'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'

import icHeader from '../../../../assets/images/header'
import icVisit from '../../../../assets/images/visit'
import imgNoData from '../../../../assets/images/nodata'

import Header from '../../../components/Header'
import LoadingView from '../../../components/LoadingView'
import EachBox from '../components/EachBox'
import DialogCustom from '../../../components/DialogCustom'
import SOSButton from '../../home_screen/components/SOSButton/SOSButton'
import FunctionButtonPlus from './FunctionButtonPlus'
import NewReminderPill from './NewReminderPill'
import NewReminderExcercise from './NewReminderExcercise'
import NewReminderMeasurement from './NewReminderMeasurement'
import NoDataView from 'components/NoDataView'

export default function MedicineReminder() {

  const dispatch = useDispatch()
  const languageRedux = useSelector(state => state.common.language)
  const showMedi = useSelector(state => state.user.medi)
  const token = useSelector(state => state.user.token)
  const [isEnabledSwitch, setEnabledSwitch] = useState(showMedi === 0 ? false : true)
  const [isLoad, setLoading] = useState(true)
  const [lsReminder, setLSReminder] = useState([])
  const [idRemind, setIdRemind] = useState()
  const [deleteStatus, setDeleteStatus] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showPlusFunction, setShowPlusFunction] = useState(false)
  const [dataNoti, setDataNoti] = useState()
  const [isShowNoti, setShowNoti] = useState(false)
  const [lsReminderType, setLSReminderType] = useState([])
  const [dataReminderType, setDataReminderType] = useState()
  const [isShowPill, setShowPill] = useState(false)
  const [isShowExcercise, setShowExcercise] = useState(false)
  const [isShowMeasurement, setShowMeasurement] = useState(false)
  const [dataNotiPill, setDataNotiPill] = useState()
  const [isShowNotiPill, setShowNotiPill] = useState(false)

  useEffect(() => {
    callAPIListReminder()
    callAPIRemindType()
    deleteStatus && deleteReminder()
    DeviceEventEmitter.addListener('reminder', () => {
      setLoading(true)
      // setReLoad(Math.random())
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    })
    console.log('showMedi: ', showMedi)
  }, [isLoad, deleteStatus])

  useEffect(() => {
    convertReminderType()
  }, [lsReminderType])

  useEffect(() => {
    console.log('dataNotiPill: ', dataNotiPill)
    checkNotiStaus()
  }, [dataNotiPill])

  const checkNotiStaus = () => {
    if (_.includes([0, '0'], dataNotiPill?.esito)) {
      setDataNotiPill({
        status: STATUS_NOTIFY.SUCCESS,
        content: Translate(languageRedux).record_inserito
      })
    }
    if (_.includes([1, '1'], dataNotiPill?.esito)) {
      setDataNotiPill({
        status: STATUS_NOTIFY.ERROR,
        content: dataNotiPill?.motivo
      })
    }
  }

  const convertReminderType = () => {
    var dataExtra = [
      {
        id: 0,
        route: Routes.NEW_REMINDER_PILL_SCREEN,
        nameIcon: 'pill'
      },
      {
        id: 1,
        route: Routes.NEW_REMINDER_EXCERCISE_SCREEN,
        nameIcon: 'run'
      },
      {
        id: 2,
        route: Routes.NEW_REMINDER_MEASUREMENT_SCREEN,
        nameIcon: 'pulse'
      }
    ]
    var data = []
    for (var i = 0; i <= (lsReminderType || []).length - 1; i++) {
      var item = {}
      item.onPress = dataExtra[i]?.route
      item.nameIcon = dataExtra[i]?.nameIcon
      item.name = lsReminderType[i]?.name
      data.push(item)
    }
    console.log('dataReminderType: ', data)
    setDataReminderType(data)
  }

  const callAPIListReminder = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/pillsreminder/getAllPatientReminder`,
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
          const getList = response.data.medicine || []
          const sortByDate = ((a, b) => {
            return b.id - a.id
          })
          setLSReminder(getList.sort(sortByDate))
          Promise.all([
            dispatch(saveLSMedi(getList))
          ])
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const callAPIRemindType = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/pillsreminder/getReminderType`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        setLoading(false)
        console.log('RemindType: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.types || []
          setLSReminderType(getList)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const deleteReminder = () => {
    axios({
      method: 'delete',
      url: `${APIs.hostAPI}backoffice/pillsreminder/deleteReminder/${idRemind}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        setLoading(false)
        setDeleteStatus(false)
        console.log('Delete successful', response)
        setShowNoti(true)
      if (_.includes([0, '0'], response?.data?.esito)) {
        setDataNoti({
          status: STATUS_NOTIFY.SUCCESS,
          content: 'Delete successful'
        })
      }
      setLoading(false)
      if (_.includes([1, '1'], response?.data?.esito)) {
        setDataNoti({
          status: STATUS_NOTIFY.ERROR,
          content: 'Delete failed'
        })
      }
      })
      .catch(error => {
        setLoading(false)
        setDeleteStatus(false)
        console.error('There was an error!', error)
      })
  }

  const saveShowHomepage = (check) => {
    const body = {
      showReminder: check
    }
    console.log('BODY: ', body)
    setLoading(true)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/settingUnitStatus`,
      headers: {
        'x-auth-token': token
      },
      data: body
    })
      .then(response => {
        console.log('data: ', response.data)
        setLoading(false)
      })
      .catch(error => {
        console.error('There was an error!', error)
        setLoading(false)
      })
    DeviceEventEmitter.emit('checkShow')
  }

  const _onPressSwitch = () => {
    if (showMedi === 0) {
      saveShowHomepage(1)
      Promise.all([
        dispatch(saveShowMedi(1))
      ])
    }
    if (showMedi === 1) {
      saveShowHomepage(0)
      Promise.all([
        dispatch(saveShowMedi(0))
      ])
    }
    setEnabledSwitch(!isEnabledSwitch)
  }

  const renderShowInSwitch = () => {
    return (
      <View style={styles.ctnTop}>
        <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginL20]}>
          {Translate(languageRedux).SHOW_IN_HOMEPAGE}
        </Text>
        <View style={styles.marginR20}>
          <Switch
            onValueChange={_onPressSwitch}
            value={isEnabledSwitch}
            renderActiveText={false}
            renderInActiveText={false}
            backgroundActive={color2F80ED}
            circleSize={24}
            circleBorderWidth={0}
          />
        </View>
      </View>
    )
  }

  const RenderItem = ({ item, index, data }) => {
    const _onPressItem = () => {
      NavigationService.navigate(Routes.DETAIL_REMINDER_SCREEN, {
        data: item,
        index: index
      })
    }
    return (
      <View>
        <EachBox
          title={item?.drugName}
          subTitle={item?.dosage}
          borderBottomLeftRadius={(index === (data || []).length - 1) ? 16 : 0}
          borderBottomRightRadius={(index === (data || []).length - 1) ? 16 : 0}
          borderTopLeftRadius={(index === 0) ? 16 : 0}
          borderTopRightRadius={(index === 0) ? 16 : 0}
          onPressDelete={() => {
            setIdRemind(item?.id)
            setShowDelete(true)
          }}
          onPress={_onPressItem}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View>
        {(lsReminder || []).length > 0 && <FlatList
          data={lsReminder}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} data={lsReminder} />
          )}
        />}
      </View>
    )
  }

  const renderPlusButton = () => {
    return (
      <SOSButton
        source={showPlusFunction ? icVisit.ic_x : icVisit.ic_plus}
        backgroundColor={color3777EE}
        onPress={() => {
          setShowPlusFunction(true)
        }}
      />
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_left}
        textCenter={Translate(languageRedux).myreminders}
        textCenterColor={color040404}
        onPressLeft={() => {
          NavigationService.goBack()
        }}
      />
      {renderShowInSwitch()}
      {(lsReminder || []).length === 0 && (
        <NoDataView
          imageSource={imgNoData.img_nodata_medicine_reminder}
          text={Translate(languageRedux).MEDICINE_REMINDER_NO_DATA}
          noDataViewStyle={styles.ctnNoDataImg}
        />
      )}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {renderBody()}
      </ScrollView>
      {showDelete && (
        <DialogCustom
          title={Translate(languageRedux).deleteMessage}
          txtlLeft={Translate(languageRedux).cancel}
          onPressCancel={() => {
            setShowDelete(false)
          }}
          txtRight={Translate(languageRedux).delete}
          onPressOK={() => {
            setDeleteStatus(true)
            setShowDelete(false)
          }}
        />
      )}
      {!isShowPill &&
        !isShowExcercise &&
        !isShowMeasurement &&
        renderPlusButton()}
      {showPlusFunction === true && (
        <View style={[styles.floatView]}>
          <FunctionButtonPlus
            onPressCancel={() => {
              setShowPlusFunction(false)
            }}
            onPressPill={() => {
              setShowPlusFunction(false)
              setShowPill(true)
            }}
            onPressExcercise={() => {
              setShowPlusFunction(false)
              setShowExcercise(true)
            }}
            onPressMeasurement={() => {
              setShowPlusFunction(false)
              setShowMeasurement(true)
            }}
          />
        </View>
      )}
      {isShowPill && (
        <NewReminderPill
          onPressCancel={() => {
            setShowPill(false)
          }}
          setStatus={setDataNotiPill}
          setShowNotiAdd={setShowNotiPill}
        />
      )}
      {isShowExcercise && (
        <NewReminderExcercise
          onPressCancel={() => {
            setShowExcercise(false)
          }}
          setStatus={setDataNotiPill}
          setShowNotiAdd={setShowNotiPill}
        />
      )}
      {isShowMeasurement && (
        <NewReminderMeasurement
          onPressCancel={() => {
            setShowMeasurement(false)
          }}
          setStatus={setDataNotiPill}
          setShowNotiAdd={setShowNotiPill}
        />
      )}
      {isLoad && <LoadingView />}
      <NotificationView
        isShow={isShowNoti}
        setShow={() => setShowNoti(false)}
        status={dataNoti?.status || STATUS_NOTIFY.ERROR}
        content={dataNoti?.content || ''}
      />
      <NotificationView
        isShow={isShowNotiPill}
        setShow={() => setShowNotiPill(false)}
        status={dataNotiPill?.status || STATUS_NOTIFY.ERROR}
        content={dataNotiPill?.content || ''}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  ctnTop: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: colorFFFFFF,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 21
  },
  marginL20: {
    marginLeft: 20
  },
  marginR20: {
    marginRight: 20
  },
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  contentContainer: {
    paddingBottom: 100
  },
  ctnNoDataImg: {
    top: 44
  }
})
