import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, DeviceEventEmitter, FlatList, Dimensions } from 'react-native'
import { useSelector } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'

import {
  colorFFFFFF,
  colorF0F0F0,
  color040404,
  color3777EE,
  color38A169,
  colorDDDEE1,
  colorF2C94C,
  colorC0392B
} from '../../../../constants/colors'
import Fonts from '../../../../constants/Fonts'
import { customTxt } from '../../../../constants/css'
import Translate from '../../../../translate'
import icMedicine from '../../../../../assets/images/home_screen'
import BoxMedicine from './BoxMedicine'

export default function Medicines() {

  const languageRedux = 'en_US'//useSelector(state => state.common.language)
  const [toggle, setToggle] = useState(false)
  const lsMedicineRedux = []//useSelector(state => state.common.medicine)
  const [reload, setReload] = useState(1)
  const [load, setLoad] = useState(1)
  const [lsSort, setLSSort] = useState([])

  useEffect(() => {
    convertData()
  }, [lsMedicineRedux])

  useEffect(() => {
    DeviceEventEmitter.addListener('reminder', () => {
      setReload(Math.random())
    })
  }, [reload])

  useEffect(() => {
    convertData()
    setTimeout(() => {
      if (load < 3) {
        setLoad(load + 1)
      }
    }, 500)
  }, [load, lsMedicineRedux])

  const convertData = () => {
    var data = []
    for (var i = 0; i <= (lsMedicineRedux || []).length - 1; i++) {
      for (var j = 0; j <= (lsMedicineRedux[i]?.hours || []).length - 1; j++) {
        var hours = {}
        hours.status = (lsMedicineRedux[i]?.hours || []).length > 0 ? lsMedicineRedux[i]?.hours[j]?.status?.code : ''
        hours.idDetail = (lsMedicineRedux[i]?.hours || []).length > 0 ? lsMedicineRedux[i]?.hours[j]?.id : ''
        hours.type = lsMedicineRedux[i].type
        hours.drugName = lsMedicineRedux[i].drugName
        hours.dosage = lsMedicineRedux[i].dosage
        hours.id = lsMedicineRedux[i].id
        if (hours.status === 'SKIP') {
          var timeSkip = (lsMedicineRedux[i]?.hours || []).length > 0 ? lsMedicineRedux[i]?.hours[j]?.time : ''
          hours.timeSkip = timeSkip
        }
        hours.time = (lsMedicineRedux[i]?.hours || []).length > 0 ?
        (hours.status === 'SKIP' ? _.replace(lsMedicineRedux[i]?.hours[j]?.status?.timeCheck.slice(11, 16), '=', ':') :
        lsMedicineRedux[i]?.hours[j]?.time) : ''
        hours.idSort = _.replace(hours.time, ':', '')
        data.push(hours)
      }
    }
    const sortByDate = ((a, b) => {
      return a.idSort - b.idSort
    })
    setLSSort(data.sort(sortByDate))
    console.log('lsSort: ', lsSort)
  }

  const renderTop = () => {
    return (
      <TouchableOpacity onPress={_onPressToggle} style={styles.ctnCategory}>
        <View style={styles.marginL16}>
          {toggle === true && <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
            {Translate(languageRedux).Today_reminder}
          </Text>}
          {toggle === false && <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
            {Translate(languageRedux).Next_reminders}
          </Text>}
        </View>
        <View style={styles.ctnIcon}>
          <View>
            {toggle === false && <Image source={icMedicine.ic_down} style={styles.iconStyle} />}
            {toggle === true && <Image source={icMedicine.ic_up} style={styles.iconStyle} />}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const _onPressToggle = () => {
    toggle === false && setToggle(true)
    toggle === true && setToggle(false)
  }

  var now = moment().format('Hmm')

  const RenderItem = ({item, index}) => {
    const checkType = () => {
      if (item?.type === '1') {
        return 'pill'
      }
      if (item?.type === '2') {
        return 'run'
      }
      if (item?.type === '3') {
        return 'pulse'
      }
    }
    const checkIcon = () => {
      if (item?.status === 'TAKEN') {
        return 'checkbox-marked-circle-outline'
      }
      if (item?.status === 'SKIP') {
        return 'clock-time-three-outline'
      }
      if (item?.status === 'REJECT') {
        return 'close-circle-outline'
      }
      if (item?.status === undefined) {
        if (now >= Number(item?.idSort)) {
          return 'help-circle-outline'
        }
      }
    }
    const checkColor = () => {
      if (item?.status === 'TAKEN') {
        return color38A169
      }
      if (item?.status === 'SKIP') {
        return color040404
      }
      if (item?.status === 'REJECT') {
        return colorC0392B
      }
      if (item?.status === undefined) {
        if (now >= Number(item?.idSort)) {
          return colorF2C94C
        }
        if (now < Number(item?.idSort)) {
          return color040404
        }
      }
    }
    const checkBorderColor = () => {
      if (item?.status === 'TAKEN') {
        return color38A169
      }
      if (item?.status === 'SKIP') {
        return colorDDDEE1
      }
      if (item?.status === 'REJECT') {
        return colorC0392B
      }
      if (item?.status === undefined) {
        if (now >= Number(item?.idSort)) {
          return colorF2C94C
        }
        if (now < Number(item?.idSort)) {
          return colorDDDEE1
        }
      }
    }
    return (
      <View>
        <BoxMedicine
          time={item?.time}
          textColor={checkColor()}
          borderColor={checkBorderColor()}
          colorIconType={checkColor()}
          colorIcon={checkColor()}
          iconType={checkType()}
          nameMedi={item?.drugName}
          source={checkIcon()}
          timeSkip={item?.timeSkip}
          onPress={() => {
            // NavigationService.navigate(Routes.DETAIL_REMINDER_VIEW, {
            //   data: item
            // })
          }}
        />
      </View>
    )
  }

  const renderFlatlist = () => {
    return (
      <View>
        <FlatList
          data={lsSort}
          // extraData={reloadFlat} //Cập nhật lại cái list
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <RenderItem item={item} />
          )}
        />
      </View>
    )
  }

  const checkNextReminder = () => {
    var listNextReminder2 = lsSort.filter((val) => val?.status === undefined)
    var listNextReminder1 = lsSort.filter((val) => val?.status === 'SKIP')
    var dataShort = _.concat(listNextReminder1, listNextReminder2)
    const sortByDate = ((a, b) => {
      return a.idSort - b.idSort
    })
    const dataShortSort = dataShort.sort(sortByDate)
    return dataShortSort
  }

  const renderFlatlistNextReminder = () => {
    return (
      <View>
        <FlatList
          data={checkNextReminder()}
          // extraData={reloadFlat} //Cập nhật lại cái list
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <RenderItem item={item} />
          )}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={[styles.containerBox]}>
        {renderTop()}
        {toggle === false && <View>
          {renderFlatlistNextReminder()}
        </View>}
        {toggle === true && <View>
          {renderFlatlist()}
        </View>}
        <View style={styles.button}>
          <View style={styles.ctnButtonLayout}>
            <TouchableOpacity onPress={() => {
              // NavigationService.navigate(Routes.MEDICINE_REMINDER_SCREEN)
            }} style={[styles.ctnButton]}>
              <Text style={customTxt(Fonts.Bold, 14, color3777EE).txt}>
                {Translate(languageRedux).View_All_Reminders}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 16
  },
  containerBox: {
    paddingBottom: 16,
    flex: 1,
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9
  },
  ctnCategory: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colorF0F0F0
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  ctnIcon: {
    marginRight: 16
  },
  marginL16: {
    marginLeft: 16
  },
  button: {
    marginTop: 16
  },
  ctnButtonLayout: {
    marginHorizontal: 16,
    alignItems: 'center'
  },
  ctnButton: {
    height: 40,
    width: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: color3777EE
  }
})
