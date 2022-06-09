import Header from 'components/Header'
import { color0B40B1, color3777EE, colorFFFFFF } from 'constants/colors'
import React, { useEffect, useState } from 'react'
import {
  StyleSheet, View, Text, FlatList, RefreshControl, DeviceEventEmitter
} from 'react-native'
import icHeader from '../../../../../assets/images/header'
import NewMesurement from './NewMesurement'
import NoDataView from 'components/NoDataView'
import NavigationService from 'navigation'
import { border } from 'constants/css'
import { convertNumberToDDMMMYYYYHHmm } from 'constants/DateHelpers'
import { useDispatch, useSelector } from 'react-redux'
import { apiGetHeartRateValues } from 'api/DataTracking'
import Routes from 'navigation/Routes'
import Translate from 'translate'
import LoadingView from 'components/LoadingView'
import cloneDeep from 'lodash.clonedeep'
import PlusButtonFloating from 'views/visit/PlusButtonFloating'
import imgDataTracking from '../../../../../assets/images/data_tracking'
import FilterView from '../filter/FilterView'
import { LsEntry, LsShow } from 'constants/define'
import HeartRateChart from '../chart/HeartRateChart'
import SOSButton from 'views/home_screen/components/SOSButton/SOSButton'
import icVisit from '../../../../../assets/images/visit'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'
import imgNoData from '../../../../../assets/images/nodata'
import { saveTrackingHeartRate } from 'actions/common'
import icServices from '../../../../../assets/images/services'
import HeaderTrackingNew from '../../../doctor_view/patient/tracking/HeaderTrackingNew'

export default function ListHeartRate({route}) {
  const passingToken = route?.params?.patientToken
  const [isNew, setNew] = useState()
  const dispatch = useDispatch()
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)
  const languageRedux = useSelector(state => state.common.language)
  const [isLoading, setLoading] = useState(true)
  const [isPlusButton, setPlusButton] = useState(false)
  const [isFilter, setFilter] = useState(false)
  const [valShow, setValShow] = useState(LsShow(languageRedux).data[0])
  const [valEntry, setValEntry] = useState(LsEntry(languageRedux).data[0])
  const token = useSelector(state => state.user.token)
  const passingRoute = route?.params?.route
  const patientId = route?.params?.patientId
  const [dataRange, setDataRange] = useState()
  const [reloadGetRange, setReloadGetRange] = useState(1)
  const [data, setData] = useState([])
  const [reload, setReload] = useState(1)

  useEffect(() => {
    callAPI()
  }, [toggleReload, reload])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.LIST_HEART_RATE, () => {
      setToggleReload(Math.random())
    })
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    callAPIGetThreshold()
  }, [reloadGetRange])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('reloadGetRange', () => {
      setReloadGetRange(Math.random())
    })
    return () => subscription.remove()
  }, [])

  const callAPIGetThreshold = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/disman/getPatientThresholdValues/${patientId}/4`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        // setLoading(false)
        console.log('callAPIGetThreshold: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (callAPIGetThreshold)')
          const getList = response?.data?.data || []
          setDataRange(getList)
        }
      })
      .catch((error) => {
        // setLoading(false)
        console.log(error)
      })
  }

  const callAPI = () => {
    setLoading(true)
    dispatch(apiGetHeartRateValues(valShow?.value || 10, passingToken, patientId, valEntry?.value)).then(res => {
      console.log('apiGetHeartRateValues:', res)
      const ls = res?.payload?.data || []
      setData(ls)
      Promise.all([
        dispatch(saveTrackingHeartRate(ls))
      ])
      setLoading(false)
      setRefresh(false)
    }).catch(() => {
      setRefresh(false)
      setLoading(false)
    })
  }

  const renderCell = (item) => {
    return (
      <View style={[
        styles.cellView,
        border().border
      ]}>
        <View style={styles.txtCellView}>
          <Text>{item?.value || 0} bpm</Text>
          <Text>{item?.date ? convertNumberToDDMMMYYYYHHmm(item?.date) : ''}</Text>
        </View>
      </View>
    )
  }

  const _onRefresh = () => {
    setRefresh(true)
    setToggleReload(Math.random())
  }

  const contentView = () => {
    return (
      <FlatList
        data={data}
        extraData={data}
        keyExtractor={(item, index) => index.toString()}
        key={'#DetailDataTracking'}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={_onRefresh}
            tintColor={color0B40B1}
          />
        }
        renderItem={({ item }) => renderCell(item)}
        contentContainerStyle={styles.flatlistContent}
      />
    )
  }

  const sortData = () => {
    const newData = cloneDeep(data)
    return newData.sort(function(a,b) {return Number(a?.date) - Number(b?.date)})
  }

  const _onPressRightNavi = () => {
    setFilter(true)
  }

  const _onPressNew = () => {
    setPlusButton(true)
  }

  const renderPlusButton = () => {
    if (isFilter) {return null}
    return (
      <SOSButton
        source={icVisit.ic_plus}
        backgroundColor={color3777EE}
        onPress={_onPressNew}
      />
    )
  }

  return (
    <View style={styles.container}>
      {(data || []).length === 0 && (
        <NoDataView
          imageSource={imgNoData.img_nodata_tracking}
          text={Translate(languageRedux).TRACKING_NO_DATA}
          noDataViewStyle={styles.ctnNoDataImg}
        />
      )}
      {passingRoute ? <HeaderTrackingNew
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).DEVICE_HEART_RATE}
        iconLeft={icHeader.ic_left}
        iconRight={icHeader.ic_noti}
        onPressRight={() => {NavigationService.navigate(Routes.SET_RANGE_SCREEN, {data: patientId, id: 4})}}
        iconRight2={icServices.ic_message}
        onPressRight2={() => {NavigationService.navigate(Routes.ALL_NOTE_SCREEN, {data: patientId, id: 2})}}
      /> : <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).DEVICE_HEART_RATE}
        iconLeft={icHeader.ic_left}
        iconRight={imgDataTracking.ic_filters}
        onPressRight={_onPressRightNavi}
      />}
      {(data || []).length > 1 && valShow.value !== 1000 && (
        <View style={styles.viewChar}>
          <HeartRateChart
            data={sortData()}
            indexNumber={valShow.value}
            dataRange={dataRange}
            routeDoctor={passingRoute}
          />
        </View>
      )}
      {contentView()}
      {!passingRoute && renderPlusButton()}
      {isPlusButton === true && (
        <View style={[styles.floatView]}>
          <PlusButtonFloating
            onPressCancel={() => {
              setPlusButton(false)
            }}
            onPressAppointment={() => {
              setPlusButton(false)
              return NavigationService.navigate(Routes.ADD_HEART_RATE_SCREEN)
            }}
            onPressDirectCall={() => {
              setPlusButton(false)
              setNew(true)
            }}
            titleDirectCall={Translate(languageRedux).find_devices}
            imgDirectCall={imgDataTracking.ic_find_bluetooth}
            titleAppointment={Translate(languageRedux).MANUAL_INPUT}
            imgAppointment={imgDataTracking.ic_add}
          />
        </View>
      )}
      {isNew && (
        <NewMesurement
          setNew={() => setNew(false)}
          title={Translate(languageRedux).DEVICE_HEART_RATE}
        />
      )}
      {isFilter && (
        <FilterView
          onPressRightNavi={() => setFilter(false)}
          valShow={valShow}
          setValShow={val => {
            setValShow(val)
            setReload(Math.random())
          }}
          valEntry={valEntry}
          setValEntry={val => {
            setValEntry(val)
            setReload(Math.random())
          }}
        />
      )}
      {isLoading && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  viewChar: {
    width: '100%',
    height: 300
  },
  cellView: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 12
  },
  txtCellView: {
    flexDirection: 'row',
    margin: 16,
    justifyContent: 'space-between'
  },
  flatlistContent: {
    paddingBottom: 120
  },
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  ctnNoDataImg: {
    top: 48
  }
})
