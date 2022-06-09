import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, TextInput, ScrollView, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import { useSelector } from 'react-redux'

import { colorF8F8F8, colorA7A8A9, color040404, colorDDDEE1, colorFFFFFF, color848586, colorF0F0F0, color3777EE, color0B40B1, colorEAF1FF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from '../../../translate'
import {convertDMMMYYYY} from '../../../constants/DateHelpers'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import _, { cloneDeep } from 'lodash'

import icDoc from '../../../../assets/images/document'
import icVisit from '../../../../assets/images/visit'
import icHome from '../../../../assets/images/home_screen'

import SOSButton from '../../home_screen/components/SOSButton/SOSButton'
import SortDropdown from './SortDropdown'

export default function FileArchive({dataListFile, listCategoryFile}) {
  const languageRedux = useSelector(state => state.common.language)
  const [listData, setListData] = useState([])
  const [reload, setReLoad] = useState(1)
  const [refreshing, setRefresh] = useState(false)
  const [txtSearch, setSearch] = useState()
  const [lsSearch, setLSSearch] = useState(cloneDeep(listData))
  const [sortUpload, setSortUpload] = useState(true)
  const [isShowSort, setShowSort] = useState(false)

  useEffect(() => {
    setListData(dataListFile)
    setLSSearch(cloneDeep(dataListFile))
  },[reload, dataListFile])

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
      if (sortUpload === true) {
        const cloneDB = cloneDeep(listData)
        const sortNewData = sortData(cloneDeep(cloneDB))
        setLSSearch(sortNewData)
        return
      }
      if (sortUpload === false) {
        var data = cloneDeep(listData)
        const sortNewData = data.sort((a, b) => a.titleAZ.localeCompare(b.titleAZ))
        setLSSearch(sortNewData)
        return
      }
    }

    var data = []
    const cloneDB = cloneDeep(listData)
    _.forEach(cloneDB, val => {
        if (_.includes((val?.title || '').toLowerCase(), (txt || '-').toLowerCase())) {
          data.push(val)
        }
        if (_.includes((val?.category || '').toLowerCase(), (txt || '-').toLowerCase())) {
          data.push(val)
        }
    })
    const sortNewData = sortData(cloneDeep(data))
    setLSSearch(sortNewData)
  }

  const renderSearchInput = () => {
    return (
      <View>
        <View style={styles.searchInput}>
          <View style={styles.searchIcon}>
            <Image source={icDoc.ic_search} style={styles.iconStyle} />
          </View>
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
        <TouchableOpacity onPress={() => {setShowSort(true)}} style={styles.sortDropdown}>
          <Text style={customTxt(Fonts.SemiBold, 14, color040404).txt}>{checkLabelSort()}</Text>
          <Image source={icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>
      </View>
    )
  }

  const checkLabelSort = () => {
    if (sortUpload === true) {
      return Translate(languageRedux).LAST_UPLOAD
    }
    if (sortUpload === false) {
      return Translate(languageRedux).name
    }
  }

  const _onPressSortAZ = () => {
    if (sortUpload === true) {
      var data = cloneDeep(listData)
      const sortNewData = data.sort((a, b) => a.titleAZ.localeCompare(b.titleAZ))
      setSearch('')
      setLSSearch(sortNewData)
      setSortUpload(false)
    }
    setShowSort(false)
  }

  const _onPressSortLastUpdate = () => {
    if (sortUpload === false) {
      setLSSearch(cloneDeep(listData))
      setSortUpload(true)
    }
    setShowSort(false)
  }

  const RenderItem = ({item, index}) => {
    const _onPressItem = () => {
      NavigationService.navigate(Routes.DETAIL_FILE_SCREEN, {
        data: item,
        index: index
      })
    }
    return (
      <TouchableOpacity onPress={_onPressItem} style={item?.medical === 1 ? styles.boxFileDoctor : styles.box}>
        <View style={styles.marginHori16}>
          <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginB4]}>{item?.title || item?.filename}</Text>
          <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>
          {Translate(languageRedux).UPLOAD} {convertDMMMYYYY(Number(item?.insertDate))}</Text>
          {(item?.categoryName || []).length > 0 && <View style={styles.typeBox}>
            <Text style={customTxt(Fonts.Regular, 12, color848586).txt}>{item?.categoryName}</Text>
          </View>}
        </View>
      </TouchableOpacity>
    )
  }

  const renderListBox = () => {
    return (
      <View>
        <FlatList
          data={lsSearch}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.marginHori20}>
        {renderSearchInput()}
        <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginB15]}>
          {Translate(languageRedux).CONTENT_FILE_DOCTOR}
        </Text>
        {renderListBox()}
      </View>
    )
  }

  const _onPressNewRecord = () => {
    NavigationService.navigate(Routes.NEW_DOCUMENT_SCREEN, {
      data: listCategoryFile
    })
  }

  const renderPlusButton = () => {
    return (
      <SOSButton
        source={icVisit.ic_plus}
        backgroundColor={color3777EE}
        onPress={_onPressNewRecord}
      />
    )
  }

  const _onRefresh = () => {
    setRefresh(true)
    setSortUpload(true)
    setTimeout(() => {
      setRefresh(false)
    }, 3000)
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}
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
      {isShowSort && (
        <View style={styles.floatView}>
          <SortDropdown
            onPressCancel={() => {
              setShowSort(false)
            }}
            onPressName={_onPressSortAZ}
            onPressLastUpdate={_onPressSortLastUpdate}
          />
        </View>
      )}
      {renderPlusButton()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  marginHori20: {
    marginHorizontal: 20
  },
  marginHori16: {
    marginHorizontal: 16,
    marginVertical: 16
  },
  marginB4: {
    marginBottom: 4
  },
  searchInput: {
    marginTop: 20,
    marginBottom: 8,
    height: 56,
    width: '100%',
    borderRadius: 12,
    backgroundColor: colorFFFFFF,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    flexDirection: 'row'
  },
  searchIcon: {
    paddingVertical: 16,
    marginLeft: 16
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  textInput: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 12
  },
  box: {
    backgroundColor: colorFFFFFF,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    marginBottom: 15
  },
  boxFileDoctor: {
    backgroundColor: colorEAF1FF,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    marginBottom: 15
  },
  typeBox: {
    marginTop: 12,
    borderRadius: 4,
    backgroundColor: colorF0F0F0,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  contentContainer: {
    paddingBottom: 90
  },
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  sortIcon: {
    paddingVertical: 16,
    marginLeft: -80
  },
  sortDropdown: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
    alignSelf: 'flex-end'
  },
  marginB15: {
    marginBottom: 15
  }
})
