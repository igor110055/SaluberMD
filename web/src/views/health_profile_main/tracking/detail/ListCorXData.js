import Header from 'components/Header'
import { color0B40B1, color3777EE, colorFFFFFF } from 'constants/colors'
import React, { useEffect, useState } from 'react'
import {
  StyleSheet, View, Text, FlatList, RefreshControl, DeviceEventEmitter
} from 'react-native'
import SOSButton from 'views/home_screen/components/SOSButton/SOSButton'
import icVisit from '../../../../../assets/images/visit'
import icHeader from '../../../../../assets/images/header'
import NewMesurement from './NewMesurement'
import NoDataView from 'components/NoDataView'
import { border } from 'constants/css'
import { convertNumberToDDMMMYYYYHHmm } from 'constants/DateHelpers'
import { useDispatch, useSelector } from 'react-redux'
import { apiCorXData } from 'api/DataTracking'
import Routes from 'navigation/Routes'
import Translate from 'translate'
import LoadingView from 'components/LoadingView'

export default function ListCorXData() {
  const [data, setData] = useState([])
  const [isNew, setNew] = useState()
  const dispatch = useDispatch()
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)
  const languageRedux = useSelector(state => state.common.language)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    callAPI()
  }, [toggleReload])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.LIST_BODY_PRESSURE, () => {
      setToggleReload(Math.random())
    })
    return () => subscription.remove()
  }, [])

  const callAPI = () => {
    setData([])
    dispatch(apiCorXData(0)).then(res => {
      console.log('apiGetMisurazioniPresx:', res)
      const ls = res?.payload?.rilevazioni || []
      setData(ls)
      setLoading(false)
      setRefresh(false)
    }).catch(() => {
      setRefresh(false)
      setLoading(false)
    })
  }

  const _onPressNew = () => {
    setNew(true)
  }

  const renderPlusButton = () => {
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
          <Text>{item?.systolic || 0}/{item?.diastolic || 0} {item?.deviceSelectedUnit || 'mmhg'}</Text>
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

  return (
    <View style={styles.container}>
      {(data || []).length === 0 && <NoDataView />}
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).CORX_DATA}
        iconLeft={icHeader.ic_left}
      />
      {contentView()}
      {renderPlusButton()}
      {
        isNew && (
          <NewMesurement
            setNew={() => setNew(false)}
            title={Translate(languageRedux).DEVICE_SPO2}
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
