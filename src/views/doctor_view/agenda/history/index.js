import React, {useState, useEffect} from 'react'
import {
  StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity, RefreshControl,
  Image
} from 'react-native'
import { useSelector } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'

import {color040404, color0B40B1, color3777EE, colorDDDEE1, colorF0F0F0, colorFFFFFF, colorE53E3E} from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import {convertDMMMYYYY, convertNumberTime} from 'constants/DateHelpers'
import Translate from 'translate'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'

import icGlobal from '../../../../../assets/images/global'
import icDoc from '../../../../../assets/images/document'

import FilterByMonth from './FilterByMonth'
import Button from 'components/Button'

export default function HistoryAgendaScreen({dataHistory, pageNumber, setPageNumber, setReloadList}) {
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)
  const [isFilterMonth, setFilterMonth] = useState(false)
  const [valueSort, setValueSort] = useState()
  const [listFilterByMonth, setListFilterByMonth] = useState()
  useEffect(() => {
    filterListHistoryByMonth()
  }, [valueSort])

  const filterListHistoryByMonth = () => {
    var listFilter = dataHistory.filter((val) => moment(Number(val?.date)).format('MMM YYYY') === valueSort)
    setListFilterByMonth(listFilter)
  }

  const RenderItem = ({item, index, data}) => {
    const _onPressItem = () => {
      if (item?.summarySaved === 1) {
        NavigationService.navigate(Routes.DETAIL_HISTORY_APPOINTMENT_DOCTOR, {
          data: item
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

    const convertDate = item?.date ? convertDMMMYYYY(Number(item?.date)) : ''
    const convertStartTime = item?.startCallDate ? convertNumberTime(Number(item?.startCallDate)) : ''
    const convertEndTime = item?.endCallDate ? convertNumberTime(Number(item?.endCallDate)) : ''
    const dateTime = convertDate + ' ' + Translate(languageRedux).at + ' ' + convertStartTime + ' - ' + convertEndTime
    var today = moment().format('YYYY-MM-DD')
    var hourPlus2 = Number(moment(Number(item?.endCallDate)).add(+2, 'hours').format('HHmm'))
    var hour = Number(moment().format('HHmm'))
    var minuteNow = Number(moment().format('mm'))
    var hourNow = Number(moment().format('HH'))
    var hour2 = Number(moment(Number(item?.endCallDate)).add(+2, 'hours').format('HH'))
    const checkMinuteLeft = () => {
      if (hour2 - hourNow === 2) {
        return 60 - minuteNow + 60
      }
      if (hour2 - hourNow === 1) {
        return 60 - minuteNow
      }
    }
    const checkStatus = () => {
      if (item?.summarySaved === 1) {
        return Translate(languageRedux).COMPLETED
      } else {
        if (moment(Number(item?.startCallDate)).format('YYYY-MM-DD') === today) {
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
          name={item?.patient}
          time={dateTime}
          status={checkStatus()}
        />
      </View>
    )
  }

  const checkDataList = () => {
    if ((valueSort || []).length > 0) {
      return listFilterByMonth
    } else {
      return dataHistory
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
          <TouchableOpacity onPress={() => { setFilterMonth(true) }} style={styles.textinputStyle}>
            <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
              {(valueSort || []).length > 0 ? valueSort : Translate(languageRedux).ORDER}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={_onPressInputSort} style={styles.icDropView}>
            <Image
              source={(valueSort || []).length > 0 ? icGlobal.ic_clear_black : icDoc.ic_dropdown}
              style={styles.iconSortInput}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => {
          NavigationService.navigate(Routes.SEARCH_HISTORY_APPOINTMENT_DOCTOR, {
            data: dataHistory
          })
        }} style={styles.buttonSearch}>
          <Image source={icDoc.ic_search} style={styles.iconStyle} />
        </TouchableOpacity>
      </View>
    )
  }

  const renderButtonLoadMore = () => {
    return (
      <View style={styles.ctnLoadMore}>
        <Button
          text={Translate(languageRedux).BTN_LOAD_MORE}
          textColor={color3777EE}
          viewStyle={styles.buttonLoadMore}
          onPress={() => {
            setPageNumber(pageNumber + 1)
            // setLoading(true)
          }}
        />
      </View>
    )
  }

  const checkShowLoadMoreBtn = () => {
    if ((dataHistory || []).length >= 20 && (dataHistory || []).length > 0) {
      return true
    } else {
      return false
    }
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        {renderFilterandSearch()}
        {renderFlatListHistory()}
        {checkShowLoadMoreBtn() && renderButtonLoadMore()}
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
  icDropView: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -45
  },
  iconSortInput: {
    height: 24,
    width: 24
  },
  buttonLoadMore: {
    borderColor: color3777EE,
    borderWidth: 1
  },
  ctnLoadMore: {
    marginHorizontal: 100,
    marginTop: 20
  }
})
