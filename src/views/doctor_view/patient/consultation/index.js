import React, {useEffect, useState} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Image, RefreshControl} from 'react-native'
import { useSelector } from 'react-redux'
import moment from 'moment'

import {color040404, color0B40B1, color3777EE, colorDDDEE1, colorE53E3E, colorF0F0F0, colorFFFFFF} from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import {convertDMMMYYYY, convertNumberTime} from 'constants/DateHelpers'
import Translate from 'translate'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'

import icDoc from '../../../../../assets/images/document'
import icGlobal from '../../../../../assets/images/global'

import FilterByMonth from '../../agenda/history/FilterByMonth'

export default function Consultation({dataHistory, setReloadList, listCategoryFile}) {
  const languageRedux = useSelector(state => state.common.language)
  const [listHistory, setListHistory] = useState()
  const [valueSort, setValueSort] = useState()
  const [isFilterMonth, setFilterMonth] = useState(false)
  const [listFilterByMonth, setListFilterByMonth] = useState()
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)

  useEffect(() => {
    setListHistory(dataHistory)
  }, [])

  useEffect(() => {
    filterListHistoryByMonth()
  }, [valueSort])

  const filterListHistoryByMonth = () => {
    if ((listHistory || []).length > 0) {
      var listFilter = listHistory.filter((val) => moment(Number(val?.startCallTime)).format('MMM YYYY') === valueSort)
      setListFilterByMonth(listFilter)
    }
  }

  const RenderItem = ({item, index, data}) => {
    const _onPressItem = () => {
      if (item?.summarySaved === '1') {
        NavigationService.navigate(Routes.CONSULTATION_DETAIL_SCREEN, {
          data: item,
          listCategoryFile: listCategoryFile
        })
      } else {
        NavigationService.navigate(Routes.POST_CALL_SCREEN, {
          data: item,
          routeDoctor: true
        })
      }
    }
    const BoxHistory = ({name, time, status}) => {
      const borderTopRightRadius = {borderTopRightRadius: (index === 0) ? 12 : 0}
      const borderTopLefttRadius = {borderTopLeftRadius: (index === 0) ? 12 : 0}
      const borderBottomRightRadius = {borderBottomRightRadius: (index === (data || []).length - 1) ? 12 : 0}
      const borderBottomLeftRadius = {borderBottomLeftRadius: (index === (data || []).length - 1) ? 12 : 0}
      return (
        <TouchableOpacity onPress={_onPressItem} style={[styles.boxHistory, borderTopRightRadius,
        borderTopLefttRadius, borderBottomLeftRadius, borderBottomRightRadius]}>
          <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>{name}</Text>
          <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>{time}</Text>
          <Text style={[customTxt(Fonts.SemiBold, 12, color3777EE).txt, styles.marginT4]}>{status}</Text>
        </TouchableOpacity>
      )
    }

    const convertDate = item?.startCallTime ? convertDMMMYYYY(Number(item?.startCallTime)) : ''
    const convertStartTime = item?.startCallTime ? convertNumberTime(Number(item?.startCallTime)) : ''
    const convertEndTime = item?.endCallTime ? convertNumberTime(Number(item?.endCallTime)) : ''
    var today = moment().format('YYYY-MM-DD')
    var yesterday = moment().add(-1, 'days').endOf('day').format('YYYY-MM-DD')
    const checkDay = () => {
      if (moment(Number(item?.startCallTime)).format('YYYY-MM-DD') === today) {
        return <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>{Translate(languageRedux).TODAY}</Text>
      }
      if (moment(Number(item?.startCallTime)).format('YYYY-MM-DD') === yesterday) {
        return <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>{Translate(languageRedux).YESTERDAY}</Text>
      }
      else {
        return <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>{convertDate}</Text>
      }
    }
    var hourPlus2 = Number(moment(Number(item?.endCallTime)).add(+2, 'hours').format('HHmm'))
    var hour = Number(moment().format('HHmm'))
    var minuteNow = Number(moment().format('mm'))
    var hourNow = Number(moment().format('HH'))
    var hour2 = Number(moment(Number(item?.endCallTime)).add(+2, 'hours').format('HH'))
    const checkMinuteLeft = () => {
      if (hour2 - hourNow === 2) {
        return 60 - minuteNow + 60
      }
      if (hour2 - hourNow === 1) {
        return 60 - minuteNow
      }
    }
    const checkStatus = () => {
      if (item?.summarySaved === '1') {
        return Translate(languageRedux).COMPLETED
      } else {
        if (moment(Number(item?.startCallTime)).format('YYYY-MM-DD') === today) {
          if (hour <= hourPlus2) {
            return (
              <Text style={customTxt(Fonts.SemiBold, 12, colorE53E3E).txt}>
                {Translate(languageRedux).DRAFT} |{' '}
                {checkMinuteLeft()} {Translate(languageRedux).MINS_LEFT}
              </Text>
            )
          } else {
            return (
              <Text style={customTxt(Fonts.SemiBold, 12, colorE53E3E).txt}>
                {Translate(languageRedux).DRAFT} |{' '}
                {Translate(languageRedux).OVERDUE}
              </Text>
            )
          }
        } else {
          return (
            <Text style={customTxt(Fonts.SemiBold, 12, colorE53E3E).txt}>
              {Translate(languageRedux).DRAFT} |{' '}
              {Translate(languageRedux).OVERDUE}
            </Text>
          )
        }
      }
    }

    return (
      <View>
        <BoxHistory
          name={checkDay()}
          time={convertStartTime + ' - ' + convertEndTime}
          status={checkStatus()}
        />
      </View>
    )
  }

  const checkDataList = () => {
    if ((valueSort || []).length > 0) {
      return listFilterByMonth
    } else {
      return listHistory
    }
  }

  const renderFlatListHistory = () => {
    return (
      <View>
        <FlatList
          data={checkDataList()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} data={checkDataList()} />
          )}
        />
      </View>
    )
  }

  const _onPressInputSort = () => {
    if ((valueSort || []).length > 0) {
      setValueSort('')
    } else {
      setFilterMonth(true)
    }
  }

  const renderFilterandSearch = () => {
    return (
      <View style={styles.filter}>
        <View style={styles.filterBox}>
          <TouchableOpacity
            onPress={() => {
              setFilterMonth(true)
            }}
            style={styles.textinputStyle}>
            <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
              {(valueSort || []).length > 0
                ? valueSort
                : Translate(languageRedux).ORDER}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={_onPressInputSort}>
            <Image
              source={
                (valueSort || []).length > 0
                  ? icGlobal.ic_clear_black
                  : icDoc.ic_dropdown
              }
              style={styles.iconSortInput}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            NavigationService.navigate(
              Routes.SEARCH_HISTORY_APPOINTMENT_DOCTOR,
              {
                data: listHistory
              },
            )
          }}
          style={styles.buttonSearch}>
          <Image source={icDoc.ic_search} style={styles.iconStyle} />
        </TouchableOpacity>
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        {renderFilterandSearch()}
        {renderFlatListHistory()}
      </View>
    )
  }

  const _onRefresh = () => {
    setRefresh(true)
    setReloadList(Math.random())
    setToggleReload(Math.random())
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
        }
      >
        {renderBody()}
      </ScrollView>
      {isFilterMonth &&
        <FilterByMonth
          onPressCancel={() => { setFilterMonth(false) }}
          setValueItem={setValueSort}
          valueItem={valueSort}
        />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  ctnBody: {
    marginTop: 16,
    marginHorizontal: 20,
    paddingBottom: 100
  },
  boxHistory: {
    backgroundColor: colorFFFFFF,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colorF0F0F0
  },
  marginT4: {
    marginTop: 4
  },
  filter: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center'
  },
  textinputStyle: {
    backgroundColor: colorFFFFFF,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    width: '100%',
    height: 48
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  buttonSearch: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colorDDDEE1,
    backgroundColor: colorFFFFFF,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  filterBox: {
    flex: 3,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  noHistory: {
    padding: 24,
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
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  iconSortInput: {
    height: 24,
    width: 24,
    marginLeft: -32
  }
})
