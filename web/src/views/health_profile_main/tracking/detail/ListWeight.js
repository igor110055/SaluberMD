import Header from 'components/Header'
import { color0B40B1, color3777EE, colorFFFFFF } from 'constants/colors'
import React, { useEffect, useState } from 'react'
import {
  StyleSheet, View, Text, FlatList, RefreshControl, DeviceEventEmitter,
  TouchableOpacity, Image, ScrollView
} from 'react-native'
import SOSButton from 'views/home_screen/components/SOSButton/SOSButton'
import icVisit from '../../../../../assets/images/visit'
import icHeader from '../../../../../assets/images/header'
import NewMesurement from './NewMesurement'
import NoDataView from 'components/NoDataView'
import { border } from 'constants/css'
import { convertNumberToDDMMMYYYYHHmm } from 'constants/DateHelpers'
import { useDispatch, useSelector } from 'react-redux'
import { apiGetMisurazioniScalx } from 'api/DataTracking'
import Routes from 'navigation/Routes'
import Translate from 'translate'
import LoadingView from 'components/LoadingView'
import WeightChart from '../chart/WeightChart'
import NavigationService from 'navigation'
import PlusButtonFloating from 'views/visit/PlusButtonFloating'
import imgDataTracking from '../../../../../assets/images/data_tracking'
import imgDirectCall from '../../../../../assets/images/direct_call'
import FilterView from '../filter/FilterView'
import { LsEntry, LsShow } from 'constants/define'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'

export default function ListWeight() {
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
  const [reload, setReload] = useState(1)
  const [dataManual, setDataManual] = useState()

  useEffect(() => {
    callAPI()
    callAPIListManual()
    callAPIListAll()
  }, [toggleReload])

  useEffect(() => {
    callAPIListManual()
  }, [reload])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.LIST_WEIGHT, () => {
      setToggleReload(Math.random())
    })
    return () => subscription.remove()
  }, [])

  const callAPI = () => {
    setData([])
    dispatch(apiGetMisurazioniScalx(valShow?.value || 10)).then(res => {
      console.log('apiGetMisurazioniScalx:', res)
      const ls = res?.payload?.rilevazioni || []
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
      url: `${APIs.hostAPI}backoffice/wellness/getWeightValues/${valShow?.value}`,
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
      url: `${APIs.hostAPI}backoffice/wellness/getWeightExpand/0`,
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

  const _onPressDetail = (item) => {
    return NavigationService.navigate(Routes.DETAIL_WEIGHT_SCREEN, {
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
          <Text style={styles.container}>{(item?.weight || '0').replace(',', '.')} {item?.unit}</Text>
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

  const renderBody = () => {
    return (
      <View>
        {contentView()}
      </View>
    )
  }

  const _onPressRightNavi = () => {
    setFilter(true)
  }

  return (
    <View style={styles.container}>
      {(checkData() || []).length === 0 && <NoDataView />}
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).SCALX}
        iconLeft={icHeader.ic_left}
        iconRight={imgDataTracking.ic_filters}
        onPressRight={_onPressRightNavi}
      />
      {
        (checkData() || []).length > 0 && valShow?.value !== 1000 && (
          <View style={styles.paddingBottom20}>
            <WeightChart
              dataChart={checkData()}
              indexNumber={valShow?.value}
            />
          </View>
        )
      }
      <ScrollView>{renderBody()}</ScrollView>
      {renderPlusButton()}
      {isPlusButton === true && (
        <View style={[styles.floatView]}>
          <PlusButtonFloating
            onPressCancel={() => {
              setPlusButton(false)
            }}
            onPressAppointment={() => {
              setPlusButton(false)
              return NavigationService.navigate(Routes.ADD_WEIGHT_SCREEN)
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
            title={Translate(languageRedux).SCALX}
          />
        )
      }
      {
        isFilter && (
          <FilterView
            onPressRightNavi={() => setFilter(false)}
            valShow={valShow}
            setValShow={(val) => {
              setValShow(val)
              setReload(Math.random())
            }}
            onPressShow={val => {
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
  paddingBottom20: {
    paddingBottom: 20
  }
})
