import React, { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  DeviceEventEmitter, Dimensions, Image, Platform, ScrollView
} from 'react-native'
import { useSelector } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../api/APIs'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
import _,{ cloneDeep } from 'lodash'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { colorFFFFFF, color040404, color3777EE, colorC1C3C5, colorF0F0F0, color000000 } from 'constants/colors'
import Translate from '../../../translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import { convertDMMMYYYY, convertNumberTime, converLocalToSever } from 'constants/DateHelpers'
import { checkWhiteSpace } from 'constants/CheckWhiteSpace'

import icHeader from '../../../../assets/images/header'
import icDoc from '../../../../assets/images/document'
import icTools from '../../../../assets/images/tools'

import CustomTextInput from '../../healthProfile/components/CustomTextInput'
import CustomDatePicker from 'components/CustomDatePicker'
import SearchForPill from './SearchForPill'
import Button from 'components/Button'
import CustomTimePikerAndroid from 'components/CustomTimePikerAndroid'

export default function NewReminderPill({onPressCancel, setStatus, setShowNotiAdd}) {

  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const [drugName, setDrugName] = useState()
  const [dosage, setDosage] = useState()
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [times, setTimes] = useState('1')
  const pickerStartDate = React.createRef()
  const pickerEndDate = React.createRef()
  const pickerTime = React.createRef()
  const [listDrug, setListDrug] = useState([])
  const [isShow, setShow] = useState(false)
  const [reloadFlat, setReloadFlat] = useState(1)
  const [itemSelected, setItemSelected] = useState()
  const [isShowTime, setShowTime] = useState(false)
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    howManyTimes()
    renderTimes()
  }, [times])

  useEffect(() => {
    callAPIDrug()
  }, [drugName])

  const callAPIDrug = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/pillsreminder/drugs?chiave=${drugName}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.items || []
          setListDrug(getList)
        }
        console.log('listDrug: ', listDrug)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const renderInput = () => {
    return (
      <View style={styles.ctnInphut}>
        <CustomTextInput
          title={Translate(languageRedux).drug_name}
          value={drugName}
          onChangeTxt={(txt) => setDrugName(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          validate={checkWhiteSpace(drugName) ? false : true}
          onPressIn={() => { setShow(true) }}
          autoCapitalize={'none'}
        />
        <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt, styles.marginT16]}>
          {Translate(languageRedux).schedule}
        </Text>
        <CustomTextInput
          title={Translate(languageRedux).dateStart}
          value={startDate ? convertDMMMYYYY(startDate) : ''}
          onChangeTxt={(txt) => setStartDate(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          validate={startDate ? false : true}
          iconRight={icDoc.ic_choose_date}
          onPress={() => { pickerStartDate.current.onPressDate() }}
          textStyle={customTxt(Fonts.Regular, 14, color040404).txt}
        />
        <CustomTextInput
          title={Translate(languageRedux).endDate}
          value={endDate ? convertDMMMYYYY(endDate) : ''}
          onChangeTxt={(txt) => setEndDate(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          validate={endDate ? false : true}
          iconRight={icDoc.ic_choose_date}
          onPress={() => { pickerEndDate.current.onPressDate() }}
          textStyle={customTxt(Fonts.Regular, 14, color040404).txt}
        />
        <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt, styles.marginT16]}>
          {Translate(languageRedux).times}
        </Text>
        {renderTimes()}
        <CustomTextInput
          title={Translate(languageRedux).dosage}
          value={dosage}
          onChangeTxt={(txt) => setDosage(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.dosageStyle]}
          validate={checkWhiteSpace(dosage) ? false : true}
          multiline={true}
        />
      </View>
    )
  }

  const TimeItem = ({ item }) => {
    const _onPressSetTimeIos = () => {
      pickerTime.current.onPressDate()
      setShowTime(true)
      setItemSelected(item)
    }
    const _onPressSetTimeAndroid = () => {
      setShowTime(true)
      setItemSelected(item)
    }
    return (
      <View>
        <View style={styles.ctnTimes}>
          <View style={styles.ctnTextTime}>
            <Text style={[customTxt(Fonts.Regular, 14, color040404).txt]}>
              {(item?.index || 0) + 1}
            </Text>
            <Icon name={'circle-thin'} size={6} color={color040404} />
            <Text style={[customTxt(Fonts.Regular, 14, color040404).txt]}>
              {Translate(languageRedux).at}
            </Text>
          </View>
          <View style={styles.flex2}>
            <CustomTextInput
              value={item?.value ? convertNumberTime(item?.value) : ''}
              textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
              iconRight={icTools.ic_clock}
              onPress={Platform.OS === 'ios' ? _onPressSetTimeIos : _onPressSetTimeAndroid}
              validate={item?.value ? false : true}
              placeholder={Translate(languageRedux).select}
            />
          </View>
        </View>
      </View>
    )
  }


  const [list, setList] = useState([
    {
      index: 0,
      value: null,
      valueRep: null
    }
  ])

  const howManyTimes = () => {
    var data = []
    for (var i = 0; i <= times - 1; i++) {
      const item = {
        index: i,
        value: null,
        valueUTC: null
      }
      data.push(item)
    }
    setList(data)
  }

  const renderFlatlist = () => {
    return (
      <View>
        <FlatList
          data={list}
          extraData={reloadFlat} //Cập nhật lại cái list
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TimeItem item={item} />
          )}
        />
      </View>
    )
  }

  const renderTimes = () => {
    return (
      <View>
        <View style={styles.ctnTimes}>
          <View style={styles.flex1}>
            <CustomTextInput
              value={times}
              onChangeTxt={txt => {
                const getNumber = txt || 1
                if (getNumber > 0) {
                  setTimes(txt)
                }
              }}
              textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
              validate={checkWhiteSpace(times) ? false : true}
              keyboardType={'phone-pad'}
            />
          </View>
        </View>
        {renderFlatlist()}
      </View>
    )
  }

  const renderAddButton = () => {
    return (
      <View style={styles.ctnInphut}>
        <Button
          text={Translate(languageRedux).add_new}
          backgroundColor={checkDisableSave() ? colorF0F0F0 : color3777EE}
          textColor={checkDisableSave() ? colorC1C3C5 : colorFFFFFF}
          disabled={checkDisableSave()}
          onPress={_onPressSave}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.paddingB48}>
        {renderInput()}
        {renderAddButton()}
      </View>
    )
  }

  const _onChangeStartDate = date => {
    setStartDate(date)
  }

  const _onChangeEndDate = date => {
    setEndDate(date)
  }

  const _onChangeTime = date => {
    const getNumber = Number(itemSelected.index) || 0

    var newData = cloneDeep(list)
    var valueChange = newData[getNumber]
    console.log('change: ', valueChange)
    valueChange.value = date
    for (var i = 0; i <= newData.length; i++) {
      var sliceTime = newData.length > 0 ? newData[0]?.value.slice(11, 13) : null
      console.log('sliceTime: ', sliceTime)
      var hour7 = Number(sliceTime)
      var time = newData.length > 0 ? _.replace(newData[0]?.value, newData[0]?.value.slice(11, 13), hour7) : null
      console.log('timeRep: ', timeUTC)
    }
    valueChange.valueRep = timeUTC
    newData = [
      ...newData
    ]
    setList(newData)
    console.log('new data: ', newData)

    var data = []
    for (var i = 0; i <= newData.length; i++) {
      var timeUTC = newData.length > 0 ? newData[i]?.value : null
      const item = {
        value: timeUTC
      }
      data.push(item)
    }
    setListUTC(data)
    console.log('UTC: ', data)

    var dataREP = ''
    newData.map((val, index) => {
      const str = `'${index}'` + `:{'hour':'${val?.value}'}` + (index === newData.length - 1 ? '' : ',')
      dataREP = dataREP + str
    })
    console.log('data convert: ', JSON.stringify(dataREP))
    setListREP(`{${dataREP}}`)
    setReloadFlat(Math.random())
  }

  const [listUTC, setListUTC] = useState()
  const [listREP, setListREP] = useState('')
  const startDatedateLocal = moment(startDate).local().format('YYYY-MM-DD')
  const startDateUTC = moment(startDatedateLocal).utc().valueOf()
  const endDatedateLocal = moment(endDate).local().format('YYYY-MM-DD')
  const endDateUTC = moment(endDatedateLocal).utc().valueOf()

  const _onPressSave = () => {
    const body = {
      drugName: drugName,
      dosage: dosage,
      times: times,
      from: startDateUTC,
      to: endDateUTC,
      utc: listUTC,
      rep: listREP,
      timezoneOffset: 0,
      type: {
        id: 1,
        name: 'Pills'
      }
    }
    console.log('BODY: ', body)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/pillsreminder/addPatientReminder`,
      headers: {
        'x-auth-token': token
      },
      data: body
    })
      .then(response => {
        console.log('dataAddPill: ', response.data)
        setShowNotiAdd(true)
        setStatus(response.data)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
      setTimeout(() => {
        DeviceEventEmitter.emit('reminder')
      }, 1000)
      onPressCancel()
  }

  const [check, setCheck] = useState(false) // check validate of time value

  useEffect(() => {
    checkTimeDisable()
  }, [times, list])

  const checkTimeDisable = () => {
    var listNull = list.filter((val) => val?.value === null)
    console.log('listNull: ', listNull)
    if ((listNull || []).length === 0) {
      setCheck(true)
    } else {
      setCheck(false)
    }
  }

  const checkDisableSave = () => {
    if (checkWhiteSpace(drugName) && checkWhiteSpace(dosage) &&
      startDate && endDate && check) {
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
            <Text style={customTxt(Fonts.SemiBold, 18, color040404).txt}>
              {Translate(languageRedux).myreminders}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.marginR16}
            onPress={onPressCancel}>
            <Image source={icHeader.ic_close} style={styles.iconStyleFloat} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const _onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShowTime(Platform.OS === 'ios')
    setDate(currentDate)
    var convertTimeStamp = moment(selectedDate).utc().valueOf()
    var convertLocalTime = converLocalToSever(convertTimeStamp)
    console.log('convertLocalTime: ', convertLocalTime)

    const getNumber = Number(itemSelected.index) || 0

    var newData = cloneDeep(list)
    var valueChange = newData[getNumber]
    console.log('change: ', valueChange)
    valueChange.value = convertTimeStamp
    valueChange.valueUTC = convertLocalTime
    for (var i = 0; i <= newData.length; i++) {
      var sliceTime = newData.length > 0 ? newData[0]?.valueUTC.slice(11, 13) : null
      console.log('sliceTime: ', sliceTime)
      var hour7 = Number(sliceTime)
      var timeUTC = newData.length > 0 ? _.replace(newData[0]?.valueUTC, newData[0]?.valueUTC.slice(11, 13), hour7) : null
      console.log('timeRep: ', timeUTC)
    }
    valueChange.valueRep = timeUTC
    newData = [
      ...newData
    ]
    setList(newData)
    console.log('new data: ', newData)

    var data = []
    for (var i = 0; i <= newData.length; i++) {
      var timeUTC = newData.length > 0 ? newData[i]?.valueUTC : null
      const item = {
        value: timeUTC
      }
      data.push(item)
    }

    setListUTC(data)

    var dataREP = ''
    newData.map((val, index) => {
      const str = `'${index}'` + `:{'hour':'${val?.valueUTC}'}` + (index === newData.length - 1 ? '' : ',')
      dataREP = dataREP + str
    })
    console.log('data convert: ', JSON.stringify(dataREP))
    setListREP(`{${dataREP}}`)
    setReloadFlat(Math.random())
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.bgOpacity} onPress={onPressCancel} />
      {Platform.OS === 'ios' && <View style={styles.fullView}>
        {renderTop()}
        <KeyboardAwareScrollView>{renderBody()}</KeyboardAwareScrollView>
      </View>}
      {Platform.OS === 'android' &&
      <ScrollView contentContainerStyle={styles.floatingViewAndroid}>
        {renderTop()}
        {renderBody()}
      </ScrollView>}
      <CustomDatePicker
        refDatePicker={pickerStartDate}
        onChangeDate={_onChangeStartDate}
        minDate={new Date()}
      />
      <CustomDatePicker
        refDatePicker={pickerEndDate}
        onChangeDate={_onChangeEndDate}
        minDate={new Date()}
      />
      {Platform.OS === 'ios' && (
        <CustomDatePicker
          refDatePicker={pickerTime}
          onChangeDate={_onChangeTime}
          mode={'time'}
        />
      )}
      {isShowTime && Platform.OS === 'android' && (
        <CustomTimePikerAndroid value={date} onChange={_onChange} />
      )}
      {isShow && (
        <SearchForPill
          listData={listDrug}
          title={Translate(languageRedux).pills}
          itemSelected={drugName}
          setTxtSearch={txt => {
            setDrugName(txt)
          }}
          valueSearch={drugName}
          onItemClick={val => {
            setDrugName(val?.name)
            setShow(false)
          }}
          onPressRight={() => {
            setShow(false)
          }}
          hideSearchText={true}
        />
      )}
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
    height: Dimensions.get('window').height - 50
  },
  ctnInphut: {
    marginHorizontal: 20,
    marginBottom: 16
  },
  marginT16: {
    marginTop: 16
  },
  marginT0: {
    marginTop: 0
  },
  ctnTextTime: {
    marginRight: 8,
    flex: 0.5,
    flexDirection: 'row'
  },
  marginR8: {
    marginRight: 8,
    flex: 0.5
  },
  flex2: {
    flex: 2
  },
  ctnTimes: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  paddingB48: {
    paddingBottom: 48
  },
  dosageStyle: {
    height: 72
  },
  ctnTitle: {
    height: 56,
    flexDirection: 'row'
  },
  iconStyleFloat: {
    height: 24,
    width: 24,
    marginRight: 16,
    marginLeft: 16
  },
  ctnSOS: {
    flex: 4,
    alignItems: 'center',
    marginTop: 18
  },
  marginR16: {
    flex: 1,
    alignItems: 'flex-end',
    marginTop: 18
  },
  flex1: {
    flex: 1
  },
  floatingViewAndroid: {
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    top: 52
  }
})
