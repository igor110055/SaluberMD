import React, { useState } from 'react'
import {View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, FlatList} from 'react-native'
import { useSelector } from 'react-redux'
import _, { cloneDeep } from 'lodash'

import Translate from 'translate'
import { color040404, colorFFFFFF, color3777EE, colorF0F0F0 } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import {convertDMMMYYYY, convertNumberTime} from 'constants/DateHelpers'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'

import icHeader from '../../../../../assets/images/header'

export default function SearchScreen({route}) {
  const languageRedux = useSelector(state => state.common.language)
  const passingData = route?.params?.data
  const [txtSearch, setSearch] = useState()
  const [lsSearch, setLSSearch] = useState()

  const renderTextInputSearch = () => {
    return (
      <View style={styles.textInputSearch}>
        <TouchableOpacity onPress={() => {
          NavigationService.goBack()
        }}>
          <Image source={icHeader.ic_left} style={styles.iconStyle} />
        </TouchableOpacity>
        <TextInput
          value={txtSearch}
          onChangeText={_onPressSearch}
          placeholder={Translate(languageRedux).SEARCH_IN_HISTORY}
          style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.styleText]}
        />
      </View>
    )
  }

  const sortData = (newDatas) => {
    const newSort = newDatas.sort(function (a, b) {
      var dateA = ''
      var dateB = ''
      dateA = (a.title || '').toLowerCase()
      dateB = (b.title || '').toLowerCase()
      return dateB - dateA
    })
    return newSort
  }

  const _onPressSearch = (txt) => {
    setSearch(txt)
    if (_.isEmpty(txt)) {
      setLSSearch([])
      return
    }

    var data = []
    const cloneDB = cloneDeep(passingData)
    _.forEach(cloneDB, val => {
        if (_.includes((val?.patient || '').toLowerCase(), (txt || '-').toLowerCase())) {
          data.push(val)
        }
    })
    const sortNewData = sortData(cloneDeep(data))
    setLSSearch(sortNewData)
  }

  const RenderItem = ({item, index, data}) => {
    const _onPressItem = () => {
      NavigationService.navigate(Routes.DETAIL_HISTORY_APPOINTMENT_DOCTOR, {
        data: item
      })
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
    const convertTime = item?.date ? convertNumberTime(Number(item?.date)) : ''
    const dateTime = convertDate + ' ' + Translate(languageRedux).at + ' ' + convertTime

    return (
      <View>
        <BoxHistory
          name={item?.patient}
          time={dateTime}
          status={'Completed'}
        />
      </View>
    )
  }

  const renderFlatListHistory = () => {
    return (
      <View style={styles.flatList}>
        <FlatList
          data={lsSearch}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} data={lsSearch} />
          )}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        {renderTextInputSearch()}
        {renderFlatListHistory()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView>{renderBody()}</ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  ctnBody: {
    paddingBottom: 48
  },
  textInputSearch: {
    backgroundColor: colorFFFFFF,
    height: 100,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 16,
    paddingHorizontal: 20
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  styleText: {
    marginLeft: 16,
    width: '100%'
  },
  boxHistory: {
    backgroundColor: colorFFFFFF,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colorF0F0F0
  },
  flatList: {
    marginHorizontal: 20,
    marginTop: 16
  }
})
