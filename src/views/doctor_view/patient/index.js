import React, { useState, useEffect } from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList, TextInput} from 'react-native'
import { useSelector } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../api/APIs'
import moment from 'moment'
import _, { cloneDeep } from 'lodash'

import {color040404, color333333, color3777EE, color848586, colorA7A8A9,
  colorDDDEE1, colorF0F0F0, colorF8F8F8, colorFFFFFF, colorC6F6D5, colorFED7D7, colorE53E3E, color2F855A} from 'constants/colors'
import Translate from 'translate'
import NavigationService from 'navigation'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import { convertDMMMYYYY } from 'constants/DateHelpers'
import Routes from 'navigation/Routes'

import icHeader from '../../../../assets/images/header'
import icDoc from '../../../../assets/images/document'
import icGlobal from '../../../../assets/images/global'

import Header from 'components/Header'
import SortList from './SortList'

export default function PatientDoctorView() {
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const [listPatient, setListPatient] = useState()
  const [listSortAZ, setListSortAZ] = useState()
  const [sortLabel, setSortLabel] = useState(true)
  const [isShowSort, setShowSort] = useState(false)
  const [valueSort, setValueSort] = useState()
  const [isSearch, setShowSearch] = useState(false)
  const [txtSearch, setSearch] = useState()
  const [lsSearch, setLSSearch] = useState()

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

  const label = [
    {
      label: Translate(languageRedux).BY_CONSULTATIONS,
      id: 0
    },
    {
      label: Translate(languageRedux).BY_LAST_NAME,
      id: 1
    }
  ]

  useEffect(() => {
    setValueSort(label[0])
    callAPIListPatient()
  }, [])

  const callAPIListPatient = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/webdoctor/getPatientVisited`,
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
          console.log('noti: ', 'data has been obtained (getPatientVisited)')
          const getList = response.data.visits || []
          convertData(getList)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const sortByDate = ((a, b) => {
    return a?.lastVisit - b?.lastVisit
  })

  const convertData = (dataConvert) => {
    if ((dataConvert || []).length > 0) {
      var data = []
      for (var i = 0; i < (dataConvert || []).length; i++) {
        var item = {}
        var convertDate = moment(dataConvert[i]?.lastVisit).utc().valueOf()
        item.lastVisit = convertDate
        item.birthdate = dataConvert[i]?.birthdate
        item.name = dataConvert[i]?.name
        item.surname = dataConvert[i]?.surname
        item.token = dataConvert[i]?.token
        item.id = dataConvert[i]?.patientId
        item.patientImage = dataConvert[i]?.patientImage
        item.lastDataTracking = JSON.parse(dataConvert[i]?.lastData)
        data.push(item)
      }
      console.log('data: ', data)
      setListPatient(data)
      sortData(data)
    }
  }

  const renderSortLine = () => {
    return (
      <View style={styles.ctnTop}>
        <TouchableOpacity onPress={() => {
          setShowSort(true)
        }} style={styles.blockFilter}>
          <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
            {valueSort?.label}
          </Text>
          <Image source={icDoc.ic_dropdown} style={styles.iconStyle} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          setShowSearch(!isSearch)
          setSearch('')
          setLSSearch(checkDataReverse())
        }} style={styles.search}>
          <Image source={icDoc.ic_search} style={styles.iconStyle} />
        </TouchableOpacity>
      </View>
    )
  }

  const renderSearchInput = () => {
    return (
      <View style={styles.searchInput}>
        <TextInput
          style={[
            customTxt(Fonts.Regular, 14, color040404).txt,
            styles.textInput
          ]}
          placeholder={Translate(languageRedux).SEARCH_FOR_DOCUMENT}
          placeholderTextColor={colorA7A8A9}
          autoCapitalize={'none'}
          value={txtSearch}
          onChangeText={_onPressSearch}
        />
      </View>
    )
  }

  const _onPressSearch = (txt) => {
    setSearch(txt)
    if (_.isEmpty(txt)) {
      const cloneDB = cloneDeep(checkDataReverse())
      setLSSearch(cloneDB)
      return
    }

    var data = []
    const cloneDB = cloneDeep(checkDataReverse())
    _.forEach(cloneDB, val => {
      if (_.includes((val?.surname || '').toLowerCase(), (txt || '-').toLowerCase())) {
        data.push(val)
      }
    })
    setLSSearch(data)
  }

  const BoxAppointment = ({day, timeStart, timeEnd, age, onPress,
    firstName, lastName, lastMeasurement, statusColorSPO2, bgStatusSPO2, statusSPO2,
    statusEKG, statusBP, statusW, bgStatusEKG, bgStatusBP, bgStatusW,
    statusColorEKG, statusColorBP, statusColorW}) => {
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
        {lastMeasurement && <View style={styles.line2Box}>
          <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>
            Last measurement
          </Text>
          <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
            {lastMeasurement}
          </Text>
        </View>}
        <View style={styles.line3Box}>
          <View style={styles.marginR4}>
            <Text style={customTxt(Fonts.Regular, 12, color040404).txt}>
              {Translate(languageRedux).DEVICE_SPO2}
            </Text>
            <View style={[styles.boxStatus, txtBgStatus]}>
              <Text
                style={[customTxt(Fonts.SemiBold, 12, statusColorSPO2).txt]}>
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
          <View style={styles.marginR4}>
            <Text style={customTxt(Fonts.Regular, 12, color040404).txt}>
              {Translate(languageRedux).SCALX}
            </Text>
            <View style={[styles.boxStatus, txtBgStatusW]}>
              <Text style={customTxt(Fonts.SemiBold, 12, statusColorW).txt}>
                {statusW}
              </Text>
            </View>
          </View>
          <View style={styles.marginR4}>
            <Text style={customTxt(Fonts.Regular, 12, color040404).txt}>
              {Translate(languageRedux).DEVICE_BLOOD_PRESSURE}
            </Text>
            <View style={[styles.boxStatus, txtBgStatusBP]}>
              <Text
                style={[
                  customTxt(Fonts.SemiBold, 12, statusColorBP).txt,
                  styles.textAlignCenter
                ]}>
                {statusBP}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const sortData = (newDatas) => {
    const sortNewData = newDatas.sort((a, b) => a.surname.localeCompare(b.surname))
    setListSortAZ(sortNewData)
  }

  const renderFlatListPatient = () => {
    const RenderItem = ({item}) => {
      const checkLastMeasurement = () => {
        var data = []
        for (var i = 0; i < (item?.lastDataTracking?.BLOOD_PRESSURE || []).length; i++) {
          var itemList = {}
          var time = moment(item?.lastDataTracking?.BLOOD_PRESSURE[i]?.date).utc().valueOf()
          itemList.date = time
          data.push(itemList)
        }
        for (var i = 0; i < (item?.lastDataTracking?.HEART_RATE || []).length; i++) {
          var itemList = {}
          var time = moment(item?.lastDataTracking?.HEART_RATE[i]?.date).utc().valueOf()
          itemList.date = time
          data.push(itemList)
        }
        for (var i = 0; i < (item?.lastDataTracking?.SPO2 || []).length; i++) {
          var itemList = {}
          var time = moment(item?.lastDataTracking?.SPO2[i]?.date).utc().valueOf()
          itemList.date = time
          data.push(itemList)
        }
        for (var i = 0; i < (item?.lastDataTracking?.TEMPERATURE || []).length; i++) {
          var itemList = {}
          var time = moment(item?.lastDataTracking?.TEMPERATURE[i]?.date).utc().valueOf()
          itemList.date = time
          data.push(itemList)
        }
        for (var i = 0; i < (item?.lastDataTracking?.WEIGHT || []).length; i++) {
          var itemList = {}
          var time = moment(item?.lastDataTracking?.WEIGHT[i]?.date).utc().valueOf()
          itemList.date = time
          data.push(itemList)
        }
        const sortByDateLasr = ((a, b) => {
          return b.date - a.date
        })
        const sortDataLast = data.sort(sortByDateLasr)
        console.log('sortData: ', sortDataLast)
        if ((sortDataLast || []).length > 0) {
          return convertDMMMYYYY(sortDataLast[0]?.date)
        }
      }
      const getAge = () => {
        var yearPatient = moment(item?.birthdate).format('YYYY')
        var yearNow = moment().format('YYYY')
        var agePatient = Number(yearNow) - Number(yearPatient)
        return agePatient
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
      return (
        <View>
          <BoxAppointment
            day={Translate(languageRedux).lastvisit}
            timeStart={convertDMMMYYYY(item?.lastVisit)}
            firstName={item?.name}
            lastName={item?.surname}
            age={getAge()}
            onPress={() => {
              NavigationService.navigate(Routes.PATIENT_DETAIL_SCREEN, {
                data: item,
                token: item?.token
              })
            }}
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
            lastMeasurement={checkLastMeasurement()}
        />
        </View>
      )
    }
    return (
      <View>
        <FlatList
          data={checkNe() || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const checkNe = () => {
    if (isSearch) {
      return lsSearch
    } else {
      return checkDataReverse()
    }
  }

  const checkDataReverse = () => {
    if (valueSort?.id === 0) {
      if ((listPatient || []).length > 0) {
        var data = cloneDeep(listPatient)
        var sortNewData = data.sort(sortByDate)
        var cloneData = cloneDeep(sortNewData)
        var dataReverse = cloneData.reverse()
        if (sortLabel) {
          return dataReverse
        }
        else {
          console.log('thuan')
          return sortNewData
        }
      }
    } else {
      if ((listSortAZ || []).length > 0) {
        var data = cloneDeep(listSortAZ)
        var dataReverse = data.reverse()
        if (sortLabel) {
          return listSortAZ
        }
        else {
          return dataReverse
        }
      }
    }
  }

  const _onPressAscending = () => {
    setSortLabel(!sortLabel)
  }

  const renderListPatient = () => {
    return (
      <View>
        <View style={styles.ctnCountPatient}>
          <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
            {(listPatient || []).length} {Translate(languageRedux).ACTIVE_PATIENTS}
          </Text>
          <TouchableOpacity onPress={_onPressAscending} style={styles.flexRow}>
            <Text style={customTxt(Fonts.SemiBold, 16, color3777EE).txt}>
              {sortLabel ? Translate(languageRedux).ASCENDING : Translate(languageRedux).DESCENDING}
            </Text>
            <Image source={icGlobal.ic_down_blue} style={styles.iconStyle} />
          </TouchableOpacity>
        </View>
        {renderFlatListPatient()}
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        {renderSortLine()}
        {isSearch && renderSearchInput()}
        {renderListPatient()}
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_menudrawer}
        textCenter={Translate(languageRedux).PATIENT_LIST}
        onPressLeft={() => NavigationService.openDrawer()}
      />
      <ScrollView>{renderBody()}</ScrollView>
      {isShowSort && (
        <View style={styles.floatView}>
          <SortList
            onPressCancel={() => {
              setShowSort(false)
            }}
            dataList={label}
            valueItem={valueSort}
            setValueItem={setValueSort}
            onPressItem={() => {
              setSortLabel(true)
            }}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  ctnBody: {
    marginTop: 16,
    marginHorizontal: 20,
    paddingBottom: 100
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  ctnCountPatient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  flexRow: {
    flexDirection: 'row'
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
  ctnTop: {
    flexDirection: 'row',
    marginBottom: 16
  },
  blockFilter: {
    flex: 3,
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colorDDDEE1,
    backgroundColor: colorFFFFFF,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 8
  },
  search: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colorDDDEE1,
    backgroundColor: colorFFFFFF,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  searchInput: {
    height: 56,
    width: '100%',
    borderRadius: 12,
    backgroundColor: colorFFFFFF,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    flexDirection: 'row',
    marginBottom: 16
  },
  textInput: {
    marginLeft: 8
  },
  textAlignCenter: {
    textAlign: 'center'
  }
})
