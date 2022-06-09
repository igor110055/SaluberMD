import Header from 'components/Header'
import { color0B40B1, color3777EE, colorFFFFFF } from 'constants/colors'
import React, { useEffect, useState } from 'react'
import {
  StyleSheet, View, Text, FlatList, RefreshControl, DeviceEventEmitter,
  TouchableOpacity, Image
} from 'react-native'
import SOSButton from 'views/home_screen/components/SOSButton/SOSButton'
import icVisit from '../../../../../assets/images/visit'
import icHeader from '../../../../../assets/images/header'
import NewMesurement from './NewMesurement'
import NoDataView from 'components/NoDataView'
import { border } from 'constants/css'
import { convertNumberToDDMMMYYYYHHmm } from 'constants/DateHelpers'
import { useDispatch, useSelector } from 'react-redux'
import { apiGetMisurazioniPresx } from 'api/DataTracking'
import Routes from 'navigation/Routes'
import Translate from 'translate'
import LoadingView from 'components/LoadingView'
import PlusButtonFloating from 'views/visit/PlusButtonFloating'
import BloodPressureChart from '../chart/BloodPressureChart'
import imgDataTracking from '../../../../../assets/images/data_tracking'
import NavigationService from 'navigation'
import { LsEntry, LsShow } from 'constants/define'
import FilterView from '../filter/FilterView'
import imgDirectCall from '../../../../../assets/images/direct_call'
import imgNoData from '../../../../../assets/images/nodata'
import { saveTrackingBloodPressure } from 'actions/common'
import icServices from '../../../../../assets/images/services'
import HeaderTrackingNew from '../../../doctor_view/patient/tracking/HeaderTrackingNew'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'

export default function ListBodyPressure({route}) {
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
  const passingRoute = route?.params?.route
  const patientId = route?.params?.patientId
  const [dataRange, setDataRange] = useState()
  const [reloadGetRange, setReloadGetRange] = useState(1)
  const token = useSelector(state => state.user.token)
  const [data, setData] = useState([])
  const [reload, setReload] = useState(1)

  useEffect(() => {
    callAPI()
  }, [toggleReload, reload])

  useEffect(() => {
    callAPIGetThreshold()
  }, [reloadGetRange])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('reloadGetRange', () => {
      setReloadGetRange(Math.random())
    })
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.LIST_BODY_PRESSURE, () => {
      setToggleReload(Math.random())
    })
    return () => subscription.remove()
  }, [])

  const callAPI = () => {
    dispatch(apiGetMisurazioniPresx(valShow?.value || 10, passingToken, patientId, valEntry?.value)).then(res => {
      console.log('apiGetMisurazioniPresx:', res)
      const ls = res?.payload?.rilevazioni || []
      setData(ls)
      Promise.all([
        dispatch(saveTrackingBloodPressure(ls))
      ])
      setLoading(false)
      setRefresh(false)
    }).catch(() => {
      setRefresh(false)
      setLoading(false)
    })
  }

  const callAPIGetThreshold = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/disman/getPatientThresholdValues/${patientId}/3`,
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

  const _onPressDetail = (item) => {
    NavigationService.navigate(Routes.DETAIL_BLOOD_PRESSURE_SCREEN, {
      data: item
    })
  }

  const renderCell = (item) => {
    return (
      <TouchableOpacity
        onPress={() => _onPressDetail(item)}
        style={[
          styles.cellView,
          border().border
        ]}>
        <View style={styles.txtCellView}>
          <Text>{item?.systolic || 0}/{item?.diastolic || 0} {item?.deviceSelectedUnit || 'mmhg'}</Text>
          <View style={styles.rightImg}>
            <Text>{item?.date ? convertNumberToDDMMMYYYYHHmm(item?.date) : ''}</Text>
            <Image source={imgDirectCall.ic_right_gray} style={styles.imgRight}/>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const _onRefresh = () => {
    setRefresh(true)
    setToggleReload(Math.random())
  }

  const contentView = () => {
    return (
      <FlatList
        data={data || []}
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

  const _onPressRightNavi = () => {
    setFilter(true)
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
      {passingRoute ? (
        <HeaderTrackingNew
          backgroundColor={colorFFFFFF}
          textCenter={Translate(languageRedux).PRESX}
          iconLeft={icHeader.ic_left}
          iconRight={icHeader.ic_noti}
          onPressRight={() => {NavigationService.navigate(Routes.SET_RANGE_SCREEN, {data: patientId, id: 3})}}
          iconRight2={icServices.ic_message}
          onPressRight2={() => {NavigationService.navigate(Routes.ALL_NOTE_SCREEN, {data: patientId, id: 3})}}
        />
      ) : (
        <Header
          backgroundColor={colorFFFFFF}
          textCenter={Translate(languageRedux).PRESX}
          iconLeft={icHeader.ic_left}
          iconRight={imgDataTracking.ic_filters}
          onPressRight={_onPressRightNavi}
        />
      )}
      {(data || []).length > 1 && valShow?.value !== 1000 && (
        <BloodPressureChart
          dataChart={data}
          idx={valShow.value}
          dataRange={dataRange}
          routeDoctor={passingRoute}
        />
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
              return NavigationService.navigate(
                Routes.ADD_BLOOD_PRESSURE_SCREEN,
              )
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
          title={Translate(languageRedux).PRESX}
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
    height: 240
  },
  cellView: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 12,
    justifyContent: 'center'
  },
  txtCellView: {
    flexDirection: 'row',
    margin: 16,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  flatlistContent: {
    paddingBottom: 120
  },
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  rightImg: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  imgRight: {
    width: 24,
    height: 24,
    resizeMode: 'contain'
  },
  ctnNoDataImg: {
    top: 48
  }
})
