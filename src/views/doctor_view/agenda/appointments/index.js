import React, {useEffect, useState} from 'react'
import {View, Text, StyleSheet, ScrollView, RefreshControl, FlatList, Image, TouchableOpacity} from 'react-native'
import { useSelector } from 'react-redux'
import moment from 'moment'

import Translate from 'translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import { color040404, color0B40B1, color2F855A, color333333, color848586, colorA7A8A9, colorC6F6D5, colorE53E3E, colorF0F0F0, colorFED7D7, colorFFFFFF } from 'constants/colors'
import { convertDMMMYYYY, convertNumberTime } from 'constants/DateHelpers'

import icDoc from '../../../../../assets/images/document'
import icHome from '../../../../../assets/images/home_screen'

import CustomTextInput from '../../../healthProfile/components/CustomTextInput'
import SortList from './SortList'
import TodaySlot from './accpect_request_appointment/TodaySlot'
import Routes from 'navigation/Routes'
import NavigationService from 'navigation'

export default function AppointmentAgendaScreen({onPressRequestAppointment, setValueItemRequest,
dataRequestAppointment, dataAppointment, setReloadAppointment}) {
  const languageRedux = useSelector(state => state.common.language)
  const [refreshing, setRefresh] = useState(false)
  const [isShowSort, setShowSort] = useState(false)
  const [isShowRequest, setShowRequest] = useState(true)
  const [isShowScheduled, setShowScheduled] = useState(true)
  const [isDate, setDate] = useState(true)
  const [isName, setName] = useState(false)
  const [listSortName, setListSortName] = useState()
  const [isToday, setToday] = useState(false)
  const [listRequestPending, setListRequestPending] = useState()

  const typeStatus = {
    growing: 'growing', //tăng trưởng
    fluctuating: 'fluctuating', // dao động
    stable: 'stable', // ổn định
    decreasing: 'decreasing', // giảm
    fever: 'fever',
    low: 'low',
    normal: 'normal'
  }

  const bgColor = (status) => {
    switch (status) {
      case typeStatus.growing:
      case typeStatus.normal:
        return colorC6F6D5
      case typeStatus.decreasing:
      case typeStatus.fever:
        return colorF0F0F0
      case typeStatus.low:
      case typeStatus.toohot:
        return colorFED7D7
      default:
        return colorF0F0F0
    }
  }

  const txtColor = (status) => {
    switch (status) {
      case typeStatus.growing:
      case typeStatus.normal:
        return color2F855A
      case typeStatus.decreasing:
      case typeStatus.fever:
      case typeStatus.low:
        return color848586
      case typeStatus.toohot:
        return colorE53E3E
      default:
        return color848586
    }
  }

  useEffect(() => {
    filterListByName()
  }, [isName, isDate])

  useEffect(() => {
  }, [refreshing])

  useEffect(() => {
    filterRequestPending()
  }, [dataRequestAppointment])

  const filterListByName = () => {
    if ((dataAppointment || []).length > 0) {
      const sortNewData = dataAppointment.sort((a, b) => `${a?.user?.cognome}`.localeCompare(`${b?.user?.cognome}`))
      setListSortName(sortNewData)
    }
  }

  const filterRequestPending = () => {
    if ((dataRequestAppointment || []).length > 0) {
      const listFilter = dataRequestAppointment.filter((val) => val?.doctorTimeSlotId === null)
      setListRequestPending(listFilter)
    }
  }

  const BoxAppointment = ({day, timeStart, timeEnd, age, onPress,
    firstName, lastName, lastMeasurement, timeRequest, statusColorSPO2,
    bgStatusSPO2, statusSPO2, statusEKG, statusBP, statusW, bgStatusEKG,
    bgStatusBP, bgStatusW, statusColorEKG, statusColorBP, statusColorW}) => {
    const txtBgStatus = { backgroundColor: bgStatusSPO2 }
    const txtBgStatusEKG = { backgroundColor: bgStatusEKG }
    const txtBgStatusBP = { backgroundColor: bgStatusBP }
    const txtBgStatusW = { backgroundColor: bgStatusW }
    return (
      <TouchableOpacity onPress={onPress} style={styles.ctnBoxAppointment}>
        <View style={styles.line1Box}>
          <View>
            <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>
              {day}
            </Text>
            <View style={styles.flexRow}>
              {(timeStart || []).length > 0 && (
                <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
                  {timeStart}
                </Text>
              )}
              {(timeEnd || []).length > 0 && (
                <Text style={customTxt(Fonts.SemiBold, 16, colorA7A8A9).txt}>
                  {' '}
                  {'-'} {timeEnd}
                </Text>
              )}
              {(timeRequest || []).length > 0 && (
                <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
                  {timeRequest}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.center}>
            <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>
              {age} {Translate(languageRedux).years} {Translate(languageRedux).OLD}
            </Text>
            <Text style={customTxt(Fonts.SemiBold, 16, color333333).txt}>
              {firstName} {lastName}
            </Text>
          </View>
        </View>
        <View style={styles.line2Box}>
          <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>
            Last measurement
          </Text>
          <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
            2 week ago
          </Text>
        </View>
        <View style={styles.line3Box}>
          <View>
            <Text style={customTxt(Fonts.Regular, 12, color040404).txt}>
              {Translate(languageRedux).DEVICE_SPO2}
            </Text>
            <View style={[styles.boxStatus, txtBgStatus]}>
              <Text style={[customTxt(Fonts.SemiBold, 12, statusColorSPO2).txt]}>
                {statusSPO2}
              </Text>
            </View>
          </View>
          {/* <View>
            <Text style={customTxt(Fonts.Regular, 12, color040404).txt}>
              {Translate(languageRedux).DEVICE_EKG}
            </Text>
            <View style={[styles.boxStatus, txtBgStatusEKG]}>
              <Text style={customTxt(Fonts.SemiBold, 12, statusColorEKG).txt}>
                {statusEKG}
              </Text>
            </View>
          </View> */}
          <View>
            <Text style={customTxt(Fonts.Regular, 12, color040404).txt}>
              {Translate(languageRedux).DEVICE_BLOOD_PRESSURE}
            </Text>
            <View style={[styles.boxStatus, txtBgStatusBP]}>
              <Text style={[customTxt(Fonts.SemiBold, 12, statusColorBP).txt, styles.textAlignCenter]}>
                {statusBP}
              </Text>
            </View>
          </View>
          <View>
            <Text style={customTxt(Fonts.Regular, 12, color040404).txt}>
              {Translate(languageRedux).SCALX}
            </Text>
            <View style={[styles.boxStatus, txtBgStatusW]}>
              <Text style={customTxt(Fonts.SemiBold, 12, statusColorW).txt}>
                {statusW}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const RenderItem = ({item}) => {
    const convertDate = item?.startsAt ? convertDMMMYYYY(item?.startsAt) : ''
    const convertTimeStart = item?.startsAt ? convertNumberTime(item?.startsAt) : ''
    const convertTimeEnd = item?.endsAt ? convertNumberTime(item?.endsAt) : ''
    // check Today Tomorrow
    var today = moment().format('YYYY-MM-DD')
    var tomorrow = moment().add(1, 'days').endOf('day').format('YYYY-MM-DD')
    const checkDay = () => {
      if (moment(item?.startsAt).format('YYYY-MM-DD') === today) {
        return <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>{Translate(languageRedux).TODAY}</Text>
      }
      if (moment(item?.startsAt).format('YYYY-MM-DD') === tomorrow) {
        return <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>{Translate(languageRedux).TOMORROW}</Text>
      }
      else {
        return <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>{convertDate}</Text>
      }
    }
    const _onPressItem = () => {
      NavigationService.navigate(Routes.CONSULTATION_LOBBY_SCREEN, {
        data: item
      })
    }
    const checkStatusSpo2 = () => {
      if ((item?.lastDataTracking?.SPO2 || []).length > 1) {
        if (Number(item?.lastDataTracking?.SPO2[0]?.value) > 94) {
          return typeStatus.growing
        } else if (Number(item?.lastDataTracking?.SPO2[0]?.value) < 94) {
          return typeStatus.decreasing
        }
        return typeStatus.stable
      }
      return typeStatus.stable
    }
    const checkStatusBloodPressure = () => {
      if ((item?.lastDataTracking?.BLOOD_PRESSURE || []).length > 1) {
        if (Number(item?.lastDataTracking?.BLOOD_PRESSURE[0]?.systolic) - Number(item?.lastDataTracking?.BLOOD_PRESSURE[1]?.systolic) > 10) {
          return typeStatus.growing
        } else if (Number(item?.lastDataTracking?.BLOOD_PRESSURE[1]?.systolic) - Number(item?.lastDataTracking?.BLOOD_PRESSURE[0]?.systolic) > 10) {
          return typeStatus.decreasing
        }
        return typeStatus.stable
      }
      return Translate(languageRedux).NO_DATA
    }
    const checkStatusWeight = () => {
      if ((item?.lastDataTracking?.WEIGHT || []).length > 1) {
        if (Number(item?.lastDataTracking?.WEIGHT[0]?.value) > Number(item?.lastDataTracking?.WEIGHT[1]?.value) + 1) {
          return typeStatus.growing
        } else if (Number(item?.lastDataTracking?.WEIGHT[0]?.value) < Number(item?.lastDataTracking?.WEIGHT[1]?.value) - 1) {
          return typeStatus.decreasing
        }
        return typeStatus.stable
      }
      return Translate(languageRedux).NO_DATA
    }
    const renderAge = () => {
      var yearNow = moment().format('YYYY')
      var yearUser = moment(item?.user?.birthdate).format('YYYY')
      return yearNow - yearUser
    }
    return (
      <View>
        <BoxAppointment
          day={checkDay()}
          lastName={item?.user?.cognome || ''}
          firstName={item?.user?.nome || ''}
          timeStart={convertTimeStart}
          timeEnd={convertTimeEnd}
          onPress={_onPressItem}
          statusSPO2={
            (item?.lastDataTracking?.SPO2 || []).length > 0
              ? `${item?.lastDataTracking?.SPO2[0]?.value}%`
              : Translate(languageRedux).NO_DATA
          }
          bgStatusSPO2={bgColor(checkStatusSpo2())}
          statusColorSPO2={txtColor(checkStatusSpo2())}
          statusBP={checkStatusBloodPressure()}
          bgStatusBP={bgColor(checkStatusBloodPressure())}
          statusColorBP={txtColor(checkStatusBloodPressure())}
          statusW={checkStatusWeight()}
          bgStatusW={bgColor(checkStatusWeight())}
          statusColorW={txtColor(checkStatusWeight())}
          age={renderAge()}
        />
      </View>
    )
  }

  const checkListFilter = () => {
    if (isDate) {
      return dataAppointment || []
    }
    if (isName) {
      return listSortName || []
    }
  }

  const renderListAppointment = () => {
    return (
      <View style={styles.marginT12}>
        <FlatList
          data={checkListFilter()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const checkValueText = () => {
    if (isDate) {
      return Translate(languageRedux).date || ''
    }
    if (isName) {
      return Translate(languageRedux).name || ''
    }
  }

  const renderDropdownFilter = () => {
    return (
      <View style={styles.marginT12}>
        <CustomTextInput
          textinputStyle={[styles.textinputStyle, customTxt(Fonts.Regular, 16 , color040404).txt]}
          iconRight={icDoc.ic_dropdown}
          placeholder={Translate(languageRedux).ORDER}
          onPress={() => { setShowSort(true) }}
          value={checkValueText()}
        />
      </View>
    )
  }

  const renderScheduledAppointment = () => {
    return (
      <View>
        <TouchableOpacity onPress={() =>{setShowScheduled(!isShowScheduled)}} style={styles.title}>
          <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
            {Translate(languageRedux).SCHEDULED_APPOINTMENTS}{' '}({(dataAppointment || []).length})
          </Text>
          <Image source={isShowScheduled ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>
        {isShowScheduled && renderDropdownFilter()}
        {isShowScheduled && renderListAppointment()}
      </View>
    )
  }

  const renderListRequestAppointment = () => {
    const RenderItemRequest = ({item, index}) => {
      const timeRequest1 = item?.slices.slice(0,5)
      const timeRequest2 = item?.slices.slice(9,14)
      // check Today
      var today = moment().format('YYYY-MM-DD')
      const checkDay = () => {
        if (item?.date === today) {
          if (item?.daySliceId === 1) {
            return <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>{Translate(languageRedux).TODAY} AM</Text>
          }
          if (item?.daySliceId === 2) {
            return <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>{Translate(languageRedux).TODAY} PM</Text>
          }
          if (item?.daySliceId === 3) {
            return <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>
              {Translate(languageRedux).TODAY} {Translate(languageRedux).OVER_TIME}
              </Text>
          }
        } else {
          return <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>{convertDMMMYYYY(item?.date)}</Text>
        }
      }
      const _onPressItem = () => {
        onPressRequestAppointment()
        setValueItemRequest(item)
      }
      const checkStatusSpo2 = () => {
        if ((item?.lastDataTracking?.SPO2 || []).length > 1) {
          if (Number(item?.lastDataTracking?.SPO2[0]?.value) > 94) {
            return typeStatus.growing
          } else if (Number(item?.lastDataTracking?.SPO2[0]?.value) < 94) {
            return typeStatus.decreasing
          }
          return typeStatus.stable
        }
        return typeStatus.stable
      }
      const checkStatusBloodPressure = () => {
        if ((item?.lastDataTracking?.BLOOD_PRESSURE || []).length > 1) {
          if (Number(item?.lastDataTracking?.BLOOD_PRESSURE[0]?.systolic) - Number(item?.lastDataTracking?.BLOOD_PRESSURE[1]?.systolic) > 10) {
            return typeStatus.growing
          } else if (Number(item?.lastDataTracking?.BLOOD_PRESSURE[1]?.systolic) - Number(item?.lastDataTracking?.BLOOD_PRESSURE[0]?.systolic) > 10) {
            return typeStatus.decreasing
          }
          return typeStatus.stable
        }
        return Translate(languageRedux).NO_DATA
      }
      const checkStatusWeight = () => {
        if ((item?.lastDataTracking?.WEIGHT || []).length > 1) {
          if (Number(item?.lastDataTracking?.WEIGHT[0]?.value) > Number(item?.lastDataTracking?.WEIGHT[1]?.value) + 1) {
            return typeStatus.growing
          } else if (Number(item?.lastDataTracking?.WEIGHT[0]?.value) < Number(item?.lastDataTracking?.WEIGHT[1]?.value) - 1) {
            return typeStatus.decreasing
          }
          return typeStatus.stable
        }
        return Translate(languageRedux).NO_DATA
      }
      const renderAge = () => {
        var yearNow = moment().format('YYYY')
        var yearUser = moment(item?.patientBirthdate).format('YYYY')
        return yearNow - yearUser
      }
      return (
        <View>
          <BoxAppointment
            day={checkDay()}
            firstName={item?.patientName || ''}
            timeRequest={timeRequest1 + ' - ' + timeRequest2}
            onPress={_onPressItem}
            statusSPO2={
              (item?.lastDataTracking?.SPO2 || []).length > 0
                ? `${item?.lastDataTracking?.SPO2[0]?.value}%`
                : Translate(languageRedux).NO_DATA
            }
            bgStatusSPO2={bgColor(checkStatusSpo2())}
            statusColorSPO2={txtColor(checkStatusSpo2())}
            statusBP={checkStatusBloodPressure()}
            bgStatusBP={bgColor(checkStatusBloodPressure())}
            statusColorBP={txtColor(checkStatusBloodPressure())}
            statusW={checkStatusWeight()}
            bgStatusW={bgColor(checkStatusWeight())}
            statusColorW={txtColor(checkStatusWeight())}
            age={renderAge()}
          />
        </View>
      )
    }
    return (
      <View style={styles.marginT12}>
        <FlatList
          data={listRequestPending || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItemRequest item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderRequestAppointment = () => {
    return (
      <View>
        <TouchableOpacity onPress={() =>{setShowRequest(!isShowRequest)}} style={styles.title}>
          <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
            {Translate(languageRedux).appointment_requests}{' '}({(listRequestPending || []).length})
          </Text>
          <Image source={isShowRequest ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>
        {isShowRequest && renderListRequestAppointment()}
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        {(listRequestPending || []).length > 0 && renderRequestAppointment()}
        {(dataAppointment || []).length > 0 && renderScheduledAppointment()}
      </View>
    )
  }

  const _onRefresh = () => {
    setRefresh(true)
    setReloadAppointment(Math.random())
    setTimeout(() => {
      setRefresh(false)
    }, 3000)
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={_onRefresh}
            tintColor={color0B40B1}
          />
        }>
        {renderBody()}
      </ScrollView>
      {isShowSort && (
        <View style={styles.floatView}>
          <SortList
            onPressCancel={() => {
              setShowSort(false)
            }}
            onPressDate={() => {
              setDate(true)
              setName(false)
              setShowSort(false)
            }}
            onPressName={() => {
              setDate(false)
              setName(true)
              setShowSort(false)
            }}
          />
        </View>
      )}
      {isToday && (
        <TodaySlot
          onPressCancel={() => {
            setToday(false)
          }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  ctnBody: {
    marginHorizontal: 20,
    marginTop: 16,
    paddingBottom: 100
  },
  ctnBoxAppointment: {
    backgroundColor: colorFFFFFF,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12
  },
  line1Box: {
    flexDirection: 'row'
  },
  flexRow: {
    flexDirection: 'row'
  },
  divider: {
    width: 1,
    borderWidth: 1,
    borderColor: colorF0F0F0,
    marginHorizontal: 8
  },
  line2Box: {
    marginTop: 8
  },
  line3Box: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  boxStatus: {
    backgroundColor: colorF0F0F0,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 4
  },
  marginT12: {
    marginTop: 12
  },
  center: {
    justifyContent: 'center'
  },
  textinputStyle: {
    backgroundColor: colorFFFFFF
  },
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  textAlignCenter: {
    textAlign: 'center'
  }
})
