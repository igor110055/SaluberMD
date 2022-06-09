import Header from 'components/Header'
import { color0B40B1, color3777EE, colorFFFFFF } from 'constants/colors'
import React, { useEffect, useState } from 'react'
import {
  StyleSheet, View, Text, FlatList, RefreshControl, DeviceEventEmitter
} from 'react-native'
import SOSButton from 'views/home_screen/components/SOSButton/SOSButton'
import icVisit from '../../../../../assets/images/visit'
import icHeader from '../../../../../assets/images/header'
import icTracking from '../../../../../assets/images/data_tracking'
import NewMesurement from './NewMesurement'
import NoDataView from 'components/NoDataView'
import { border } from 'constants/css'
import { converNumberToMMMDDYYYY } from 'constants/DateHelpers'
import { useDispatch, useSelector } from 'react-redux'
import { apiPostBreathingVolumesWellness } from 'api/DataTracking'
import Routes from 'navigation/Routes'
import Translate from 'translate'
import LoadingView from 'components/LoadingView'
import imgDataTracking from '../../../../../assets/images/data_tracking'
import PlusButtonFloating from 'views/visit/PlusButtonFloating'
import NavigationService from 'navigation'
import BreathingVolumeChart from '../chart/BreathingVolumeChart'
import cloneDeep from 'lodash.clonedeep'
import FilterView from '../filter/FilterView'
import { LsEntry, LsShow } from 'constants/define'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'

export default function ListBreathingVolumes() {
  const [data, setData] = useState([])
  const [isNew, setNew] = useState()
  const dispatch = useDispatch()
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)
  const languageRedux = useSelector(state => state.common.language)
  const [isLoading, setLoading] = useState(true)
  const [isPlusButton, setPlusButton] = useState(false)
  const [isFilter, setFilter] = useState(false)
  const [valShow, setValShow] = useState(LsShow(languageRedux).data[0])
  const [valEntry, setValEntry] = useState(LsEntry(languageRedux).data[2])
  const [listAll, setListAll] = useState()
  const token = useSelector(state => state.user.token)
  const [dataManual, setDataManual] = useState()

  useEffect(() => {
    callAPIListAll()
    callAPI()
    callAPIListManual()
  }, [toggleReload, valShow])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.LIST_BREATHING_VOLUMES, () => {
      setToggleReload(Math.random())
    })
    return () => subscription.remove()
  }, [])

  const callAPI = () => {
    setData([])
    dispatch(apiPostBreathingVolumesWellness(valShow?.value || 10)).then(res => {
      console.log('apiGetBreathingVolumes:', res)
      const ls = res?.payload?.data || []
      setData(ls)
      setLoading(false)
      setRefresh(false)
    }).catch(() => {
      setRefresh(false)
      setLoading(false)
    })
  }

  const callAPIListManual = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/wellness/getRespiratoryRate/${valShow?.value}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        // setLoading(false)
        console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.data || []
          setDataManual(getList)
        }
      })
      .catch((error) => {
        // setLoading(false)
        console.log(error)
      })
  }

  const callAPIListAll = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/wellness/getRespiratoryRateExpand/0`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        // setLoading(false)
        console.log('AllData: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.data || []
          setListAll(getList)
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

  const renderCell = (item) => {
    return (
      <View style={[
        styles.cellView,
        border().border
      ]}>
        <View style={styles.txtCellView}>
          <Text>{item?.value || 0} / min</Text>
          <Text>{item?.date ? converNumberToMMMDDYYYY(item?.date) : ''}</Text>
        </View>
      </View>
    )
  }

  const _onRefresh = () => {
    setRefresh(true)
    setToggleReload(Math.random())
  }

  const checkData = () => {
    if (valShow?.value === 1000 && valEntry?.value === 1) {
      return listAll || []
    }
    if (valEntry?.value === 2) {
      return data || []
    }
    else {
      return dataManual || []
    }
  }

  const contentView = () => {
    return (
      <FlatList
        data={checkData()}
        extraData={toggleReload}
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
    const newData = cloneDeep(checkData())
    return newData.sort(function(a,b) {return a?.date - b?.date})
  }

  return (
    <View style={styles.container}>
      {(checkData() || []).length === 0 && <NoDataView />}
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).ARIAX}
        iconLeft={icHeader.ic_left}
        iconRight={icTracking.ic_filters}
        onPressRight={() => {
          setFilter(true)
        }}
      />
      {
        (checkData() || []).length > 1 && valShow?.value !== 1000 && (
          <BreathingVolumeChart
            data={sortData()}
            indexNumber={valShow?.value}
          />
        )
      }
      {contentView()}
      {renderPlusButton()}
      {isPlusButton === true && (
        <View style={[styles.floatView]}>
          <PlusButtonFloating
            onPressCancel={() => {
              setPlusButton(false)
            }}
            onPressAppointment={() => {
              setPlusButton(false)
              return NavigationService.navigate(Routes.ADD_BREATHING_VOLUMES_SCREEN)
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
        </View>)
      }
      {
        isNew && (
          <NewMesurement
            setNew={() => setNew(false)}
            title={Translate(languageRedux).DEVICE_SPO2}
          />
        )
      }
      {
        isFilter && (
          <FilterView
            onPressRightNavi={() => setFilter(false)}
            valShow={valShow}
            setValShow={val => setValShow(val)}
            onPressShow={val => {
              console.log('Val show: ', val)
              setValShow(val)
            }}
            valEntry={valEntry}
            setValEntry={val => setValEntry(val)}
            onPressEntry={val => {
              console.log('Val entry: ', val)
              setValEntry(val)
            }}
          />
        )
      }
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
  }
})
