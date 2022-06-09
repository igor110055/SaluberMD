import Header from 'components/Header'
import { color0B40B1, colorFFFFFF } from 'constants/colors'
import React, { useEffect, useState } from 'react'
import {
  StyleSheet, View, Text, FlatList, RefreshControl
} from 'react-native'
import icHeader from '../../../../../../assets/images/header'
import NoDataView from 'components/NoDataView'
import { border } from 'constants/css'
import { convertNumberToDDMMMYYYYHHmm } from 'constants/DateHelpers'
import { useDispatch, useSelector } from 'react-redux'
import Translate from 'translate'
import LoadingView from 'components/LoadingView'
import cloneDeep from 'lodash.clonedeep'
import imgDataTracking from '../../../../../../assets/images/data_tracking'
import FilterView from '../../../../health_profile_main/tracking/filter/FilterView'
import { LsEntry, LsShow } from 'constants/define'
import BodyTemperatureChart from '../../../../health_profile_main/tracking/chart/BodyTemperatureChart'
import { apiGetTempDr } from '../api'

export default function ListBodyTemperature() {
  const [data, setData] = useState([])
  const dispatch = useDispatch()
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)
  const languageRedux = useSelector(state => state.common.language)
  const [isLoading, setLoading] = useState(true)
  const [isFilter, setFilter] = useState(false)
  const [valShow, setValShow] = useState(LsShow(languageRedux).data[0])
  const [valEntry, setValEntry] = useState(LsEntry(languageRedux).data[2])
  const [unit, setUnit] = useState()
  const surveyPatient = useSelector(state => state.common.surveyPatient)
  var patientId = surveyPatient?.user?.id || 0

  useEffect(() => {
    callAPITemp()
  }, [toggleReload, valShow])

  const callAPITemp = () => {
    setData([])
    dispatch(apiGetTempDr(valShow?.value || 10, patientId)).then(res => {
      console.log('apiGetTempValues:', res)
      const ls = res?.payload?.data || []
      setData(ls)
      setUnit(res?.payload?.unit)
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
          <Text>{(item?.temp || 0).replace(',', '.')} º{item?.type || ''}</Text>
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
        data={data || []}
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
    const newData = cloneDeep(data)
    return newData.sort(function(a,b) {return a?.date - b?.date})
  }

  const _onPressRightNavi = () => {
    setFilter(true)
  }

  return (
    <View style={styles.container}>
      {(data || []).length === 0 && <NoDataView />}
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).TEMPERATURE}
        iconLeft={icHeader.ic_left}
        iconRight={imgDataTracking.ic_filters}
        onPressRight={_onPressRightNavi}
      />
      {
        (data.length > 1 && valShow.value !== 1000) && (
          <View style={styles.viewChar}>
            <BodyTemperatureChart
              dataTemp={sortData()}
              valShow={valShow}
              unit={unit}
            />
          </View>
        )
      }
      {contentView()}
      {
        isFilter && (
          <FilterView
            onPressRightNavi={() => setFilter(false)}
            valShow={valShow}
            setValShow={val => setValShow(val)}
            onPressShow={val => {
              setValShow(val)
            }}
            valEntry={valEntry}
            setValEntry={val => setValEntry(val)}
            onPressEntry={val => {
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
    height: 240,
    overflow: 'hidden'
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
