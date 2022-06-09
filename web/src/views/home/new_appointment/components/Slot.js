import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native'
import moment from 'moment'
import { colorFFFFFF, color333333, color5C5D5E, colorDDDEE1, colorF8F8F8, color040404, color3777EE, colorEAF1FF } from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import { convertNumberTime12, convertDateTime } from '../../../../constants/DateHelpers'

import icHealth from '../../../../../assets/images/health_profile'
import icNA from '../../../../../assets/images/new_appointment'
import icHome from '../../../../../assets/images/home_screen'
import Routes from '../../../../routes/Routes'
import { apiGetFindslotTimezone } from '../../../visit/apis'


export default function Slot({
  valueTime, setValueTime, onPressNext, doctorID, setLoad, toggleReload
}) {

  const [lsSlot, setLSSlot] = useState([])
  const [listDate, setListDate] = useState([])
  const [lsFilter, setLSFilter] = useState([])
  const [valueDate, setValueDate] = useState()
  const [showList, setShowList] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    callAPISlotOfDoctor()
    console.log('doctorID: ', doctorID)
  },[toggleReload, loading])

  const checkDate = (data) => {
    var monthNow = moment().format('M')
    var dayNow = moment().format('D')
    console.log('check date data: ',data)
    console.log('check dayNow: ',dayNow)
    const listRe = data[data.length - 1]
    const monthBook = moment(listRe?.startsAt).format('M')
    const lastdayBook = moment(listRe?.startsAt).format('D')
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
    }
    if (monthNow < monthBook) {
      if (monthNow === 1 || 3 || 5 || 7 || 8 || 10 || 12) {
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
      }
      else {
        for (dayNow; dayNow <= 30; dayNow++) {
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
      }
      setListDate(list)
    }
    console.log('list: ', list)
  }

  const callAPISlotOfDoctor = () => {
    setLoad(true)
    apiGetFindslotTimezone(doctorID, (new Date()).getTimezoneOffset()).then(async res => {
      setLoad(false)
      const parseData = await res.json()
      console.log('data: ', parseData)
      if ((parseData?.slots || []).length === 0) {
        console.log('noti: ', 'can not get data')
      } else {
        const getList = parseData?.slots || []
        console.log('getList: ', getList)
        if (getList.length > 0) {
          setLSSlot(getList)
          setTimeout(() => {
            checkDate(getList)
          }, 500)
          // setLoading(true)
        }
      }
    }).catch(error => {
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
        var listFilter = lsSlot.filter((val) => convertDateTime(val.startsAt) === convertDateTime(item?.date))
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
                {convertDateTime(item?.date)}
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
          Did not find a slot corresponding to your needs? Contact us for a specific request.
        </Text>
        <View style={styles.ctnButton}>
          <TouchableOpacity onPress={() => {
            // NavigationService.navigate(Routes.CONTACT_US_SCREEN)
          }} style={styles.styleButton}>
            <Text style={customTxt(Fonts.SemiBold, 14, color3777EE).txt}>Contact</Text>
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
          Choose a provider
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
      {/* {renderContact()} */}
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
