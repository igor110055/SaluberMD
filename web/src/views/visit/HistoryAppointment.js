import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl, ScrollView } from 'react-native'
// import * as APIs from '../../api/APIs'

// import axios from 'axios'
import { color040404, color0B40B1, color5C5D5E, colorF8F8F8, colorFFFFFF } from '../../constants/colors'
import LoadingView from '../../components/LoadingView'
import Fonts from '../../constants/Fonts'
import { customTxt } from '../../constants/css'
import { convertDMMMYYYY, convertNumberTime } from '../../constants/DateHelpers'
import NavigationService from '../../routes'
import Routes from '../../routes/Routes'
import { apiGetVisitHistoryApp } from './apis'
import * as StateLocal from '../../state_local'

export default function HistoryAppointment() {
  const [isLoading, setLoading] = useState(false)
  const lsHisAppointmentRedux = StateLocal.lsHisAppointment
  const [lsHisAppointment, setLSHisAppointment] = useState(lsHisAppointmentRedux || [])
  // const dispatch = useDispatch()
  const token = ''//useSelector(state => state.user.token)
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)

  useEffect(() => {
    callAPIListHistoryAppointment()
  }, [])

  useEffect(() => {
    callAPIListHistoryAppointment()
  }, [toggleReload])

  const callAPIListHistoryAppointment = () => {
    apiGetVisitHistoryApp().then(async res => {
      const parseData = await res.json()
      setLoading(false)
      setRefresh(false)
      console.log('data: ', parseData)
      if ((parseData || []).length === 0) {
        console.log('noti: ', 'can not get data')
      } else {
        console.log('noti: ', 'data has been obtained')
        const getPro = parseData?.visits || []
        setLSHisAppointment(getPro)
        StateLocal.lsHisAppointment = getPro
      }
    }).catch(error => {
      setLoading(false)
      setRefresh(false)
      console.log(error)
    })
  }

  const BoxHistoryAppointment = ({ docName, time, specail, onPress }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.ctnNoti}>
        <View style={styles.ctnText}>
          {/* DOCTOR NAME */}
          {time && <View>
            <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
              {time}
            </Text>
          </View>}
          {/* TIME and DAY */}
          {docName && <View style={styles.ctnDayTime}>
            <Text style={customTxt(Fonts.SemiBold, 18, color040404).txt}>
              Doc. {docName}
            </Text>
          </View>}
          {/* SPECIAL */}
          {specail && <View style={styles.ctnSpecial}>
            <Text style={customTxt(Fonts.SemiBold, 12, color5C5D5E).txt}>
              {specail}
            </Text>
          </View>}
        </View>
      </TouchableOpacity>
    )
  }

  const renderFlatlist = () => {
    const RenderItem = ({ item, index }) => {
      const convertDate = item?.date ? convertDMMMYYYY(item?.date) : ''
      const convertTime = item?.date ? convertNumberTime(item?.date) : ''
      const DateTime = (convertDate && convertTime) ? (convertDate + ', ' + convertTime) : ''

      const _onPressItem = () => {
        NavigationService.navigate(Routes.DETAIL_CONSULTATION_SCREEN, {
          data: item,
          index: index
        })
      }

      return (
        <View style={styles.margiB16}>
          <BoxHistoryAppointment
            docName={item?.doctor || ''}
            time={DateTime}
            // specail={item?.specializationName}
            onPress={_onPressItem}
          />
        </View>
      )
    }

    return (
      <FlatList
        data={lsHisAppointment}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <RenderItem item={item} index={index} />
        )}
      />
    )
  }

  const renderBody = () => {
    return (
      <View>
        {renderFlatlist()}
      </View>
    )
  }

  const _onRefresh = () => {
    setRefresh(true)
    setToggleReload(Math.random())
    setTimeout(() => {
      setRefresh(false)
    }, 3000)
  }

  return (
    <View style={styles.flex}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={_onRefresh}
            tintColor={color0B40B1}
          />
        }
        style={styles.container}>{renderBody()}</ScrollView>
      {isLoading && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  container: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: 20
  },
  ctnNoti: {
    borderRadius: 12,
    backgroundColor: colorFFFFFF,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 9
  },
  ctnText: {
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 16
  },
  ctnDayTime: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center'
  },
  ctnSpecial: {
    marginTop: 8
  },
  margiB16: {
    marginBottom: 16
  }
})
