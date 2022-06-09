import React, {useEffect, useState} from 'react'
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList, ScrollView} from 'react-native'
import { useSelector } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../../../api/APIs'
import _ from 'lodash'

import {color000000, colorFFFFFF, color040404, color848586, colorA7A8A9, color333333, colorDDDEE1, colorF0F0F0, color38A169, color3777EE} from 'constants/colors'
import Translate from 'translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import { convertDMMMYYYY, convertNumberTime, convertToUTC, addDate } from 'constants/DateHelpers'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'

import icHeader from '../../../../../../assets/images/header'
import imgAgenda from '../../../../../../assets/images/agenda'

import Button from 'components/Button'
import LoadingView from 'components/LoadingView'

export default function TodaySlot({ onPressClose, dataPassing,
  onPressAddNewAvailability, reloadAdd, setRoute, routeFromAgenda,
  handleBookAppointment }) {
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const [dataRequest, setDataRequest] = useState()
  const [listIdSlot, setListIdSlot] = useState()
  const [isLoad, setLoading] = useState(true)
  const [dataNoti, setDataNoti] = useState()
  const [isShowNoti, setShowNoti] = useState()
  const [reload, setReload] = useState(1)
  const [dayPassing, setDayPassing] = useState(convertDMMMYYYY(dataPassing?.date || dataPassing?.startsAt))
  const [isFilterDay, setFilterDay] = useState(false)

  useEffect(() => {
    console.log('data: ', dataPassing)
    routeFromAgenda ? callAPIListSlot() : callAPIListSlotDay()
  }, [reload, reloadAdd])

  useEffect(() => {
    getListIdSlot()
  }, [dataRequest])

  const callAPIListSlotDay = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/listAgenda/${dataPassing?.date}/${dataPassing?.daySliceId}/-7`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        setLoading(false)
        console.log('dataRequest: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.slots || []
          setDataRequest(getList)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const callAPIListSlot = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/appointment?action=search`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        setLoading(false)
        console.log('dataRequest2: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.slot || []
          if (isFilterDay) {
            var listFilterByDay = getList.filter(
              val =>
                convertDMMMYYYY(val?.startsAt) === dayPassing &&
                val?.patientId === 0,
            )
            setDataRequest(listFilterByDay)
          } else {
            var listFilterByDay = getList.filter(
              val =>
                convertDMMMYYYY(val?.startsAt) === convertDMMMYYYY(dataPassing?.startsAt) &&
                val?.patientId === 0,
            )
            setDataRequest(listFilterByDay)
          }
          setFilterDay(false)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const getListIdSlot = () => {
    if ((dataRequest || []).length > 0) {
      var data = []
      for (var i = 0; i < (dataRequest || []).length; i++) {
        if (dataRequest[i]?.patientId === null) {
          var item = {}
          item.id = dataRequest[i]?.id
          data.push(item)
        }
      }
    }
    setListIdSlot(data)
  }

  const _onPresPreviousDay = () => {
    setLoading(true)
    setFilterDay(true)
    setDayPassing(convertDMMMYYYY(addDate(dayPassing, -1)))
    setTimeout(() => {
      setReload(Math.random())
    }, 500)
  }

  const _onPresNextDay = () => {
    setLoading(true)
    setFilterDay(true)
    setDayPassing(convertDMMMYYYY(addDate(dayPassing, +1)))
    setTimeout(() => {
      setReload(Math.random())
    }, 500)
  }

  const checkDisableButtonPrevious = () => {
    if (dayPassing === convertDMMMYYYY()) {
      return false
    } else {
      return true
    }
  }

  const renderTop = () => {
    return (
      <View>
        <View style={styles.ctnTitle}>
          <View style={styles.flex1} />
          <View style={styles.ctnSOS}>
            {routeFromAgenda && checkDisableButtonPrevious() && (
              <TouchableOpacity onPress={_onPresPreviousDay}>
                <Image
                  source={imgAgenda.ic_previous_agenda}
                  style={styles.previousIcon}
                />
              </TouchableOpacity>
            )}
            <Text style={customTxt(Fonts.SemiBold, 18, color040404).txt}>
              {dayPassing}
            </Text>
            {routeFromAgenda && (
              <TouchableOpacity onPress={_onPresNextDay}>
                <Image
                  source={imgAgenda.ic_next_agenda}
                  style={styles.nextIcon}
                />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.marginR16} onPress={onPressClose}>
            <Image source={icHeader.ic_close} style={styles.iconStyleFloat} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const BoxAppointment = ({day, timeStart, timeEnd, onPress,
    firstName, lastName}) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.ctnBoxAppointment}>
        <View style={styles.flexRow}>
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
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.center}>
            <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>
              56 years old
            </Text>
            <Text style={customTxt(Fonts.SemiBold, 16, color333333).txt}>
              {firstName} {lastName}
            </Text>
          </View>
        </View>
        <View style={styles.line3Box}>
          <View>
            <Text style={customTxt(Fonts.Regular, 12, color040404).txt}>
              Blood pres.
            </Text>
            <View style={styles.boxStatus}>
              <Text style={customTxt(Fonts.SemiBold, 12, color848586).txt}>
                Average
              </Text>
            </View>
          </View>
          <View style={styles.marginL16}>
            <Text style={customTxt(Fonts.Regular, 12, color040404).txt}>
              Weight
            </Text>
            <View style={styles.boxStatus}>
              <Text style={customTxt(Fonts.SemiBold, 12, color848586).txt}>
                Average
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const BoxSlot = ({day, timeStart, timeEnd, timeSlot, onPress}) => {
    return (
      <View style={styles.boxSlot}>
        <View style={styles.flexRow}>
          <View>
            <Text
              style={[
                customTxt(Fonts.Regular, 12, colorA7A8A9).txt,
                styles.marginB4
              ]}>
              {day}
            </Text>
            <View style={styles.flexRow}>
              <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
                {timeStart}
              </Text>
              <Text style={customTxt(Fonts.SemiBold, 16, colorA7A8A9).txt}>
                {' '}
                {'-'} {timeEnd}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View>
            <Text
              style={[
                customTxt(Fonts.Regular, 12, colorA7A8A9).txt,
                styles.marginB4
              ]}>
              {timeSlot} {Translate(languageRedux).minutes}
            </Text>
            <Text style={customTxt(Fonts.SemiBold, 16, color38A169).txt}>
              {Translate(languageRedux).FREE_SLOT}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onPress} style={styles.buttonBook}>
          <Text style={customTxt(Fonts.SemiBold, 16, color3777EE).txt}>Book</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const RenderItem = ({item, index}) => {
    const convertDate = item?.startDate ? convertDMMMYYYY(item?.startDate) : ''
    const convertTimeStart = item?.startDate ? convertNumberTime(item?.startDate) : ''
    const convertTimeEnd = item?.endDate ? convertNumberTime(item?.endDate) : ''
    const convertDate2 = item?.startsAt ? convertDMMMYYYY(item?.startsAt) : ''
    const convertTimeStart2 = item?.startsAt ? convertNumberTime(item?.startsAt) : ''
    const convertTimeEnd2 = item?.endsAt ? convertNumberTime(item?.endsAt) : ''
    const _onPressBook = () => {
        setReload(Math.random())
        setLoading(true)
        const body = {
          startDate: convertToUTC(item?.startDate) || '',
          endDate: convertToUTC(item?.endDate) || '',
          timeSlot: item?.timeSlot || '',
          patientId: dataPassing?.patientId || '',
          id: dataPassing?.requestId || '',
          slotId: item?.id || '',
          daySliceId: dataPassing?.daySliceId || '',
          tz: -420
        }
        axios({
            method: 'post',
            url: `${APIs.hostAPI}backoffice/bookRequestSlot`,
            headers: {
              'content-type': 'application/json',
              'x-auth-token': token
            },
            data: body
          })
            .then(response => {
              setLoading(false)
              console.log('data: ', response.data)
              setShowNoti(true)
              if (_.includes([0, '0'], response?.data?.esito)) {
                setDataNoti({
                  status: STATUS_NOTIFY.SUCCESS,
                  content: response?.data?.motivo
                })
              }
              if (_.includes([1, '1'], response?.data?.esito)) {
                setDataNoti({
                  status: STATUS_NOTIFY.ERROR,
                  content: response?.data?.motivo
                })
              }
            })
            .catch(error => {
              setLoading(false)
              console.error('There was an error!', error)
            })
    }
    
    return (
      <View>
        {!routeFromAgenda && (item?.patientId !== null ? (
          <BoxAppointment
            day={convertDate}
            lastName={item?.user?.name || ''}
            firstName={item?.user?.surname || ''}
            timeStart={convertTimeStart}
            timeEnd={convertTimeEnd}
          />
        ) : (
          <BoxSlot
            day={convertDate}
            timeStart={convertTimeStart}
            timeEnd={convertTimeEnd}
            timeSlot={item?.timeSlot}
            onPress={_onPressBook}
          />
        ))}
        {routeFromAgenda &&
          <BoxSlot
            day={convertDate2}
            timeStart={convertTimeStart2}
            timeEnd={convertTimeEnd2}
            timeSlot={item?.timeSlot}
            onPress={() => handleBookAppointment(item)}
          />
        }
      </View>
    )
  }

  const renderListAppointment = () => {
    return (
      <View>
        <FlatList
          data={dataRequest}
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
      <View style={styles.ctnBody}>
        {renderListAppointment()}
        <View style={styles.ctnButtonAddNewAvail}>
          <Button
            backgroundColor={color3777EE}
            textColor={colorFFFFFF}
            text={Translate(languageRedux).ADD_NEW_AVAILABILITY}
            onPress={() => {
              onPressAddNewAvailability()
              setRoute(true)
            }}
          />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.bgOpacity}
        onPress={onPressClose}
      />
      <View style={styles.fullView}>
        {renderTop()}
        <ScrollView>
          {renderBody()}
        </ScrollView>
      </View>
      <NotificationView
        isShow={isShowNoti}
        setShow={() => setShowNoti(false)}
        status={dataNoti?.status || STATUS_NOTIFY.ERROR}
        content={dataNoti?.content || ''}
      />
      {isLoad && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'flex-end'
  },
  bgOpacity: {
    width: '100%',
    height: '100%',
    flex: 1,
    position: 'absolute',
    backgroundColor: color000000,
    opacity: 0.7
  },
  fullView: {
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    height: Dimensions.get('window').height - 64
  },
  ctnTitle: {
    flexDirection: 'row',
    paddingVertical: 16,
    marginBottom: 16
  },
  iconStyleFloat: {
    height: 24,
    width: 24,
    marginRight: 16,
    marginLeft: 16
  },
  ctnSOS: {
    flex: 4,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  marginR16: {
    flex: 1,
    alignItems: 'flex-end'
  },
  flex1: {
    flex: 1
  },
  ctnBody: {
    marginHorizontal: 20,
    paddingBottom: 42
  },
  boxSlot: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  ctnBoxAppointment: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colorDDDEE1
  },
  flexRow: {
    flexDirection: 'row'
  },
  divider: {
    borderWidth: 1,
    borderColor: colorF0F0F0,
    marginHorizontal: 16
  },
  line2Box: {
    marginTop: 8
  },
  line3Box: {
    marginTop: 10,
    flexDirection: 'row'
  },
  marginB4: {
    marginBottom: 4
  },
  buttonBook: {
    borderWidth: 1,
    borderColor: color3777EE,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  boxStatus: {
    backgroundColor: colorF0F0F0,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 4
  },
  marginL16: {
    marginLeft: 16
  },
  ctnButtonAddNewAvail: {
    marginTop: 16,
    marginBottom: 32
  },
  previousIcon: {
    height: 24,
    width: 24,
    marginRight: 12
  },
  nextIcon: {
    height: 24,
    width: 24,
    marginLeft: 12
  }
})
