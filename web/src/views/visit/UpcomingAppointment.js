import React, { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, FlatList, ScrollView
} from 'react-native'
import {
  color040404,
  color3777EE,
  color5C5D5E,
  colorBDBDBD,
  colorF8F8F8,
  colorFFFFFF
} from '../../constants/colors'
import Fonts from '../../constants/Fonts'
import { customTxt } from '../../constants/css'
import BoxAppointment from '../home/components/VisitsWidget/BoxAppointment'
import { convertNumberTime, convertDMMMYYYY } from '../../constants/DateHelpers'
import { concat } from 'lodash'
import moment from 'moment'
import NavigationService from '../../routes'
import Routes from '../../routes/Routes'
import NoDataView from '../../components/NoDataView'
import Translate from '../../translate'
import { apiGetListappointment, apiGetRequestsByPatientId } from './apis'
import * as StateLocal from '../../state_local'

export default function UpcomingAppointment() {
  const lsAppointmentRedux = StateLocal.lsAppointment || []
  const [lsAppointment, setLSAppointment] = useState(lsAppointmentRedux || [])
  const lsRequestRedux = StateLocal.lsRequest || []
  const [lsRequest, setLSRequest] = useState(lsRequestRedux || [])
  const [reload, setReload] = useState(1)
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)
  const languageRedux = 'en_US'//useSelector(state => state.common.language)
  useEffect(() => {
    setInterval(() => {
      setReload(Math.random())
    }, 60000)
  }, [])

  useEffect(() => {
    callAPIListAppointment()
    callAPIListRequestAppointment()
  }, [])

  useEffect(() => {
    callAPIListAppointment()
    callAPIListRequestAppointment()
  }, [refreshing])

  const callAPIListAppointment = () => {
    apiGetListappointment().then(async res => {
      const parseData = await res.json()
      // setLoading(false)
      setRefresh(false)
      console.log('data: ', parseData)
      if ((parseData || []).length === 0) {
        console.log('noti: ', 'can not get data')
      } else {
        console.log('noti: ', 'data has been obtained')
        const getPro = parseData?.slot || []
        const sortByDate = ((a, b) => {
          return a.startsAt - b.startsAt
        })
        const sortData = getPro.sort(sortByDate)
        setLSAppointment(sortData)
        StateLocal.lsAppointment = sortData
      }
    }).catch(() => {
      setRefresh(false)
    })
  }

  const callAPIListRequestAppointment = () => {
    apiGetRequestsByPatientId().then(async res => {
      const parseData = await res.json()
      setRefresh(false)
      console.log('data: ', parseData)
      if ((parseData || []).length === 0) {
        console.log('noti: ', 'can not get data')
      } else {
        console.log('noti: ', 'data has been obtained')
        const getReq = parseData?.requests || []
        setLSRequest(getReq)
        StateLocal.lsRequest = getReq
      }
    }).catch(() => {
      setRefresh(false)
    })
  }

  const renderAppointmentFlatlist = () => {

    const RenderItem = ({ item, index }) => {
      const convertTimeStart = item?.startsAt ? convertNumberTime(item?.startsAt) : ''
      const convertTimeEnd = item?.endsAt ? convertNumberTime(item?.endsAt) : ''
      const converTime = convertTimeStart + ' - ' + convertTimeEnd
      const convertDate = item?.startsAt ? convertDMMMYYYY(item?.startsAt) : ''

      // check Starting in 5 minutes
      var hn = moment().format('H')
      var minutesNow = moment().format('m')
      var bookTime = convertTimeStart
      var hb = bookTime.slice(0, 2)
      var minutesBook = bookTime.slice(3, 5)
      const check5Minutes = () => {
        if (d === dn) {
          if (hb - hn === 1) {
            if (minutesBook - minutesNow <= -55) {
              return true
            }
          }
          if (hb - hn === 0) {
            if (minutesBook - minutesNow <= 5) {
              return true
            }
          }
        }
      }
      const checkText5M = () => {
        if (d === dn) {
          if (hb - hn === 0) {
            if (minutesBook - minutesNow <= 0) {
              return <Text>{Translate(languageRedux).STARTING_NOW}</Text>
            }
            if (minutesBook - minutesNow <= 5 && minutesBook - minutesNow > 0) {
              return <Text>{Translate(languageRedux).STARTING_IN} {minutesBook - minutesNow} minutes</Text>
            }
          }
          if (hb - hn === 1) {
            if (minutesBook - minutesNow === -55) {
              return <Text>{Translate(languageRedux).START_5M}</Text>
            }
            if (minutesBook - minutesNow === -56) {
              return <Text>{Translate(languageRedux).START_4M}</Text>
            }
            if (minutesBook - minutesNow === -57) {
              return <Text>{Translate(languageRedux).START_3M}</Text>
            }
            if (minutesBook - minutesNow === -58) {
              return <Text>{Translate(languageRedux).START_2M}</Text>
            }
            if (minutesBook - minutesNow === -59) {
              return <Text>{Translate(languageRedux).START_1M}</Text>
            }
          }
        }
      }
      // check Today Tomorrow
      var dn = moment().format('D')
      var mn = moment().format('M')
      var d = moment(item?.startsAt).format('D')
      var m = moment(item?.startsAt).format('M')
      const checkDay = () => {
        if (mn === m) {
          if (d - dn === 1) {
            return <Text style={customTxt(Fonts.SemiBold, 18, colorBDBDBD).txt}>{Translate(languageRedux).TOMORROW}</Text>
          }
          if (d - dn === 0) {
            return <Text style={customTxt(Fonts.SemiBold, 18, colorBDBDBD).txt}>{Translate(languageRedux).TODAY}</Text>
          }
          else {
            return <Text style={customTxt(Fonts.SemiBold, 18, colorBDBDBD).txt}>{convertDate}</Text>
          }
        }
      }

      const _onPressItem = () => {
        NavigationService.navigate(Routes.DETAIL_APPOINTMENT_SCREEN, {
          data: item,
          index: index,
          lsAppointment: lsAppointmentRedux
        })
      }

      const _onPress5Minutes = () => {
        NavigationService.navigate(Routes.ANAMNESIS_SCREEN, {
          data: lsAppointmentRedux[index]
        })
      }

      return (
        <View style={styles.marginB16}>
          <BoxAppointment
            docName={'Doc. ' + item.doctor?.nome + ' ' + item.doctor?.cognome}
            time={check5Minutes() ? checkText5M() : converTime}
            viewStyle={styles.shadow}
            day={check5Minutes() ? null : checkDay()}
            specail={item?.doctor?.specializationStr}
            docNameColor={check5Minutes() ? colorFFFFFF : color040404}
            timeColor={check5Minutes() ? colorFFFFFF : color040404}
            specailColor={check5Minutes() ? colorFFFFFF : color040404}
            backgroundColor={check5Minutes() ? color3777EE : colorFFFFFF}
            onPress={check5Minutes() ? _onPress5Minutes : _onPressItem}
          />
        </View>
      )
    }

    let sortByDate = ((a, b) => {
      return a.startsAt - b.startsAt
    })

    return (
      <View>
        <FlatList
          data={lsAppointment.sort(sortByDate)}
          extraData={reload}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderRequestAppointmentFlatlist = () => {

    const RenderItem = ({ item, index }) => {
      const sliceDay = () => {
        var t1 = item?.daySlice.slice(0, 5)
        var t2 = item?.daySlice.slice(9, 14)
        var time = concat(t1, ' - ', t2)
        return time
      }
      const convertDate = item?.date ? convertDMMMYYYY(item?.date) : ''

      const _onPressWaiting = () => {
        NavigationService.navigate(Routes.DETAIL_WAITING_SCREEN, {
          data: item,
          index: index,
          lsRequest: lsRequestRedux
        })
      }

      return (
        <View style={styles.marginB16}>
          <BoxAppointment
            docName={Translate(languageRedux).WAITING_FOR_CONFIRMATION}
            time={sliceDay()}
            day={convertDate}
            viewStyle={styles.shadow}
            specail={item?.name}
            docNameColor={color3777EE}
            timeColor={color040404}
            specailColor={color5C5D5E}
            backgroundColor={colorFFFFFF}
            onPress={_onPressWaiting}
          />
        </View>
      )
    }

    return (
      <View>
        <FlatList
          data={lsRequest}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View>
        {renderAppointmentFlatlist()}
        {renderRequestAppointmentFlatlist()}
      </View>
    )
  }

  return (
    <View style={styles.flex}>
      {(lsAppointment || []).length === 0 && (lsRequest || []).length === 0 && <NoDataView />}
      <ScrollView
        style={styles.container}>{renderBody()}
      </ScrollView>
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
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 9
  },
  marginB16: {
    marginBottom: 16
  }
})
