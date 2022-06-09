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
import { apiGetSpo2Values } from 'api/DataTracking'
import Routes from 'navigation/Routes'
import Translate from 'translate'

export default function DetailDataTracking({ route }) {
  const title = route?.params?.title
  const [data, setData] = useState(route?.params?.data)
  const [isNew, setNew] = useState()
  const dispatch = useDispatch()
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)
  const languageRedux = useSelector(state => state.common.language)

  useEffect(() => {
    callAPISpo2()
  }, [toggleReload])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.DETAIL_DATA_TRACKING_SCREEN, () => {
      setToggleReload(Math.random())
    })
    return () => subscription.remove()
  }, [])

  const callAPISpo2 = () => {
    if (Translate(languageRedux).DEVICE_SPO2 !== title) {
      return
    }
    dispatch(apiGetSpo2Values()).then(res => {
      console.log('apiGetSpo2Values:', res)
      const ls = res?.payload?.data || []
      setData(ls)
      setRefresh(false)
    }).catch(() => {setRefresh(false)})
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
    console.log('renderCell: ', item)
    return (
      <View style={[
        styles.cellView,
        border().border
      ]}>
        <View style={styles.txtCellView}>
          <Text>{item?.spo2 || 0} %</Text>
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
      />
    )
  }

  return (
    <View style={styles.container}>
      {(data || []).length === 0 && <NoDataView />}
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={title}
        iconLeft={icHeader.ic_left}
      />
      {contentView()}
      {renderPlusButton()}
      {
        isNew && (
          <NewMesurement
            setNew={() => setNew(false)}
            title={title}
          />
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
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
  }
})
