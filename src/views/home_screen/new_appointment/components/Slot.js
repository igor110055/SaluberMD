import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Platform } from 'react-native'

import * as APIs from '../../../../api/APIs'
import axios from 'axios'
import moment from 'moment'
import { useSelector } from 'react-redux'

import { colorFFFFFF, color333333, color5C5D5E, colorDDDEE1, colorF8F8F8, color040404, color3777EE, colorEAF1FF } from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import { convertNumberTime12, convertDateTime, convertDMMMYYYY } from '../../../../constants/DateHelpers'

import icHealth from '../../../../../assets/images/health_profile'
import icNA from '../../../../../assets/images/new_appointment'
import icHome from '../../../../../assets/images/home_screen'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import Translate from 'translate'
import _ from 'lodash'

export default function Slot({
  valueTime, setValueTime, onPressNext, doctorID, setLoad, toggleReload,
  onPressRequest, setRequest
}) {

  const token = useSelector(state => state.user.token)
  const [lsSlot, setLSSlot] = useState([])
  const [listDate, setListDate] = useState([])
  const [lsFilter, setLSFilter] = useState([])
  const [valueDate, setValueDate] = useState()
  const [showList, setShowList] = useState(false)
  const [loading, setLoading] = useState(false)
  const languageRedux = useSelector(state => state.common.language)

  useEffect(() => {
    callAPISlotOfDoctor()
    console.log('doctorID: ', doctorID)
  },[toggleReload, loading])

  const checkDate = (data) => {
    var monthNow = Number(moment().format('M'))
    var dayNow = Number(moment().format('D'))
    const listRe = data[data.length - 1]
    const monthBook = Number(moment(listRe?.startsAt).format('M'))
    const lastdayBook = Number(moment(listRe?.startsAt).format('D'))
    var list = []
    if (monthNow === monthBook) {
      for (dayNow; dayNow <= Number(lastdayBook); dayNow++) {
        var item = {}
        var j = moment().format(`M/${dayNow}/YYYY`)
        item.date = j
        item.id = Math.random(1)
        var listFilter = data.filter((val) => convertDateTime(val.startsAt) === convertDateTime(j))
        if (listFilter.length > 0) {
          list.push(item)
        }
      }
      setListDate(list)
      console.log('list: ', list)
      console.log('Thuan1')
    }
    if (monthNow < monthBook) {
      if (_.includes([1, 3, 5, 7, 8, 10, 12], monthNow)) {
        for (dayNow; dayNow <= 31; dayNow++) {
          var item = {}
          var j = moment().format(`M/${dayNow}/YYYY`)
          item.date = j
          item.id = Math.random(1)
          var listFilter = data.filter((val) => convertDateTime(val.startsAt) === convertDateTime(j))
          if (listFilter.length > 0) {
            list.push(item)
          }
        }
        for (var i = 1; i <= Number(lastdayBook); i++) {
          var item = {}
          var j = moment().format(`${monthBook}/${i}/YYYY`)
          item.date = j
          item.id = Math.random(1)
          var listFilter = data.filter((val) => convertDateTime(val.startsAt) === convertDateTime(j))
          if (listFilter.length > 0) {
            list.push(item)
          }
        }
        console.log('Thuan2')
      }
      else {
        for (dayNow; dayNow <= 30; dayNow++) {
          var item = {}
          var j = moment().format(`M/${dayNow}/YYYY`)
          item.date = j
          item.id = Math.random(1)
          console.log('J:', j)
          var listFilter = data.filter((val) => convertDateTime(val.startsAt) === convertDateTime(j))
          if (listFilter.length > 0) {
            list.push(item)
          }
        }
        for (var i = 1; i <= Number(lastdayBook); i++) {
          var item = {}
          var j = moment().format(`${monthBook}/${i}/YYYY`)
          item.date = j
          item.id = Math.random(1)
          console.log('J2:', j)
          var listFilter = data.filter((val) => convertDateTime(val.startsAt) === convertDateTime(j))
          if (listFilter.length > 0) {
            list.push(item)
          }
        }
        console.log('Thuan3')
      }
      setListDate(list)
    }
    console.log('list: ', list)
  }

  const checkDateAndroid = (data) => {
    var monthNow = Number(moment().format('M'))
    var dayNow = Number(moment().format('D'))
    const listRe = data[data.length - 1]
    const monthBook = Number(moment(listRe?.startsAt).format('M'))
    const monthBook3 = moment(listRe?.startsAt).format('MMM')
    const lastdayBook = Number(moment(listRe?.startsAt).format('D'))
    var list = []
    if (monthNow === monthBook) {
      for (dayNow; dayNow <= Number(lastdayBook); dayNow++) {
        var item = {}
        var j = moment().format(`${dayNow} MMM YYYY`)
        item.date = j
        item.id = Math.random(1)
        var listFilter = data.filter((val) => moment(val.startsAt).format('D MMM YYYY') === j)
        if (listFilter.length > 0) {
          list.push(item)
        }
      }
      setListDate(list)
      console.log('list: ', list)
      console.log('Thuan1')
    }
    if (monthNow < monthBook) {
      if (_.includes([1, 3, 5, 7, 8, 10, 12], monthNow)) {
        for (dayNow; dayNow <= 31; dayNow++) {
          var item = {}
          var j = moment().format(`${dayNow} MMM YYYY`)
          item.date = j
          item.id = Math.random(1)
          var listFilter = data.filter((val) => moment(val.startsAt).format('D MMM YYYY') === j)
          if (listFilter.length > 0) {
            list.push(item)
          }
        }
        for (var i = 1; i <= Number(lastdayBook); i++) {
          var item = {}
          var dayFilter = _.concat(i, monthBook3, moment().format('YYYY'))
          var dayFilter2 = _.replace(dayFilter, ',', ' ')
          var dayFilter3 = _.replace(dayFilter2, ',', ' ')
          item.date = dayFilter3
          item.id = Math.random(1)
          var listFilter = data.filter((val) => moment(val.startsAt).format('D MMM YYYY') === dayFilter3)
          if (listFilter.length > 0) {
            list.push(item)
          }
        }
        console.log('Thuan2')
      }
      else {
        for (dayNow; dayNow <= 30; dayNow++) {
          var item = {}
          var j = moment().format(`${dayNow} MMM YYYY`)
          item.date = j
          item.id = Math.random(1)
          var listFilter = data.filter((val) => moment(val.startsAt).format('D MMM YYYY') === j)
          if (listFilter.length > 0) {
            list.push(item)
          }
        }
        for (var i = 1; i <= Number(lastdayBook); i++) {
          var item = {}
          var dayFilter = _.concat(i, monthBook3, moment().format('YYYY'))
          var dayFilter2 = _.replace(dayFilter, ',', ' ')
          var dayFilter3 = _.replace(dayFilter2, ',', ' ')
          item.date = dayFilter3
          item.id = Math.random(1)
          var listFilter = data.filter((val) => moment(val.startsAt).format('D MMM YYYY') === dayFilter3)
          if (listFilter.length > 0) {
            list.push(item)
          }
        }
        console.log('Thuan3')
      }
      setListDate(list)
      console.log('Thuan4')
    }
    console.log('list: ', list)
  }

  const getTimeZone = () => {
    var date = new Date()
    var offsetInHours = date.getTimezoneOffset()
    return offsetInHours
  }

  const callAPISlotOfDoctor = () => {
    setLoad(true)
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/findslot/${doctorID}/${getTimeZone()}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        setLoad(false)
        console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.slots || []
          if (getList.length > 0) {
            setLSSlot(getList)
            Platform.OS === 'ios' ? checkDate(getList) : checkDateAndroid(getList)
            setLoading(true)
          }
        }
      })
      .catch(error => {
        setLoad(false)
        console.log(error)
      })
  }

  const renderListDate = () => {
    const RenderItem = ({item, index}) => {
      const isActiveDoctor = () => {
        return item === valueDate
      }
      const _onPressChooseDate = () => {
        var listFilter = lsSlot.filter(val =>
          Platform.OS === 'ios'
            ? convertDateTime(val.startsAt) === convertDateTime(item?.date)
            : moment(val.startsAt).format('D MMM YYYY') === item?.date,
        )
        setValueDate(item)
        showList === false && setShowList(true)
        isActiveDoctor() && showList === true && setShowList(false)
        setLSFilter(listFilter)
      }
      return (
        <View>
          <TouchableOpacity onPress={_onPressChooseDate} style={styles.timeDate}>
            <View>
              <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt]}>
                {Platform.OS === 'ios' ? convertDateTime(item?.date) : item?.date}
              </Text>
            </View>
            <View>
              <Image source={(isActiveDoctor() && showList === true) ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle}/>
            </View>
          </TouchableOpacity>
          {(isActiveDoctor() && showList === true) && renderFlatListBoxSlot()}
        </View>
      )
    }
    return (
      <View>
        <FlatList
          data={listDate}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }
  const renderFlatListBoxSlot = () => {

    const RenderItem = ({item, index}) => {
      const convertTimeStart = item?.startsAt ? convertNumberTime12(item?.startsAt) : ''
      const convertTimeEnd = item?.endsAt ? convertNumberTime12(item?.endsAt) : ''
      const isActiveDoctor = () => {
        return item === valueTime
      }
      const _onPressChooseSlot = () => {
        setValueTime(item)
        onPressNext()
      }
      const textColor = {color: isActiveDoctor() ? colorFFFFFF : color040404 }
      return (
        <View style={styles.marginB8}>
          <TouchableOpacity onPress={_onPressChooseSlot}
          style={isActiveDoctor() ? styles.boxSlot2 : styles.boxSlot1}>
            <Text style={[customTxt(Fonts.Regular, 16).txt, textColor]}>{convertTimeStart} - {convertTimeEnd}</Text>
            <Image source={isActiveDoctor() ? icHealth.ic_right_white : icHealth.ic_right} style={styles.iconStyle} />
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <View>
        <FlatList
          data={lsFilter}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderContact = () => {
    return (
      <View style={styles.stickyView}>
      <View style={styles.ctnContactBox}>
        <View style={styles.icon}>
          <Image source={icNA.ic_info} style={styles.iconStyle} />
        </View>
        <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.textStyle]}>
          {Translate(languageRedux).CONTENT_STEP_SLOT}
        </Text>
        <View style={styles.ctnButton}>
          <TouchableOpacity onPress={() => {
            setRequest(true)
            onPressRequest()
          }} style={styles.styleButton}>
            <Text style={customTxt(Fonts.SemiBold, 14, color3777EE).txt}>
              {Translate(languageRedux).REQUEST}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
    )
  }

  return (
    <View style={styles.containerBox}>
      <View style={styles.title}>
        <Text style={customTxt(Fonts.SemiBold, 18, color333333).txt}>
          {Translate(languageRedux).CHOOSE_A_PROVIDER}
        </Text>
      </View>
      <View style={styles.descriptionRadio}>
        <Text style={customTxt(Fonts.Regular, 16, color5C5D5E).txt}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.
        </Text>
      </View>
      <View style={styles.ctnBoxSlot}>
        {renderListDate()}
        {renderContact()}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  containerBox: {
    flex: 1,
    backgroundColor: colorFFFFFF,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9,
    marginBottom: 42
  },
  title: {
    marginTop: 16,
    marginHorizontal: 16
  },
  descriptionRadio: {
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 24
  },
  boxSlot1: {
    height: 56,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    backgroundColor: colorF8F8F8,
    borderRadius: 12,
    paddingVertical: 16,
    paddingLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  boxSlot2: {
    height: 56,
    borderWidth: 1,
    borderColor: color3777EE,
    backgroundColor: color3777EE,
    borderRadius: 12,
    paddingVertical: 16,
    paddingLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  ctnBoxSlot: {
    marginHorizontal: 16
  },
  marginB8: {
    marginBottom: 8
  },
  iconStyle: {
    height: 24,
    width: 24,
    marginRight: 16
  },
  ctnContactBox: {
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: colorEAF1FF,
    borderRadius: 12
  },
  icon: {
    marginLeft: 16,
    marginTop: 16
  },
  textStyle: {
    marginHorizontal: 16,
    marginTop: 8
  },
  ctnButton: {
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 16
  },
  styleButton: {
    height: 40,
    width: 120,
    borderWidth: 1,
    borderColor: color3777EE,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  timeDate: {
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})
