import React, { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, SectionList, Platform, ScrollView,
  TouchableOpacity, Image, TextInput, Linking, FlatList
} from 'react-native'
import { useSelector } from 'react-redux'
import moment from 'moment'
import _, { cloneDeep } from 'lodash'
import Share from 'react-native-share'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'

import {
  color040404, color3777EE, color848586, colorA7A8A9, colorDDDEE1,
  colorF0F0F0, colorF8F8F8, colorFFFFFF, colorEAF1FF
} from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from 'translate'
import { converMMMYYY, convertDMMMYYYY } from 'constants/DateHelpers'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'

import icDoc from '../../../../../assets/images/document'
import icVisit from '../../../../../assets/images/visit'
import icHeader from '../../../../../assets/images/header'
import icHealth from '../../../../../assets/images/health_profile'

import SOSButton from '../../../home_screen/components/SOSButton/SOSButton'
import SortByYear from './SortByYear'
import SortCategory from '../../video_call_navigate/file_archive/SortCategory'

export default function FileArchive({ dataListDoc, dataListCategory, setShow,
  isShow, patientToken, dataDocSuggest }) {
  const languageRedux = useSelector(state => state.common.language)
  const [listSectionData, setListSectionData] = useState([])
  const [isShowSortYear, setShowSortYear] = useState(false)
  const [listYear, setListYear] = useState(false)
  const [year, setYear] = useState()
  const [listFilterData, setListFilterData] = useState()
  const [isSortCate, setShowSortCate] = useState(false)
  const [allFile, setAllFile] = useState(true)
  const [categorySelected, setCategorySelected] = useState()
  const [dataList, setDataList] = useState()
  const [txtSearch, setSearch] = useState()
  const [lsSearch, setLSSearch] = useState()
  const [isSearch, setShowSearch] = useState(false)
  const token = useSelector(state => state.user.token)
  const [itemSelected, setItemSelected] = useState()

  useEffect(() => {
    sortListData()
    checklistYear()
  }, [])

  useEffect(() => {
    filterDataByYear()
  }, [year, listSectionData])

  useEffect(() => {
    sortCategoryFile()
  }, [categorySelected])

  const callAPIDetail = (id) => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/disman/getBase64Doc/${id}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': patientToken
      }
    })
      .then(response => {
        // console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (document)')
          const getList = response.data.base64Doc || []
          console.log('getList: ', getList)
          functionShare(getList)
        }
        // setLoading(false)
      })
      .catch(error => {
        // setLoading(false)
        console.log(error)
      })
  }

  const functionShare = (data) => {
    let options = {
      url: `data:image/png;base64,${data}`,
      filename: 'title'
    }
    Share.open(options)
      .then(res => {
        console.log(res)
        if (Platform.OS === 'ios') {
          Linking.openURL('photos-redirect://')
        } else if (Platform.OS === 'android') {
          Linking.openURL('content://media/internal/images/media')
        }
      })
      .catch(err => {
        err && console.log(err)
      })
  }

  const sortListData = () => {
    if ((dataListDoc || []).length > 0 && (dataListCategory || []).length > 0) {
      var data = []
      for (var i = 0; i <= (dataListDoc || []).length - 1; i++) {
        var item = {}
        var id = Number(dataListDoc[i]?.categoryId)
        var j = dataListCategory.filter(val => val?.id === id)
        if ((j || []).length > 0) {
          var category = j[0]?.name
          var idCategory = j[0]?.id
        }
        item.id = Number(dataListDoc[i]?.id)
        // item.title = dataListDoc[i]?.title
        item.filename = dataListDoc[i]?.name
        item.insertDate = Number(dataListDoc[i]?.date)
        // item.reportDate = Number(dataListDoc[i]?.reportDate)
        item.description = dataListDoc[i]?.description
        item.dettagli = dataListDoc[i]?.dettagli
        item.fileType = dataListDoc[i]?.dettagli?.fileType
        item.categoryName = category
        item.idCategory = idCategory
        // item.titleAZ = _.replace(item['title'], ' ', '_')
        item.medical = dataListDoc[i]?.medical
        data.push(item)
      }
      console.log('listData: ', data)
      if ((data || []).length > 0) {
        setDataList(data)
        sortCategoryFile(data)
      }
    }
  }

  const checklistYear = () => {
    var data = []
    for (var i = 0; i < 5; i++) {
      var yearNow = moment().format('YYYY')
      var item = {}
      item.year = Number(yearNow) - i
      data.push(item)
    }
    if ((data || []).length > 0) {
      setListYear(data)
    }
  }

  const sortCategoryFile = (data) => {
    if ((data || []).length > 0 || (dataList || []).length > 0) {
      var dataSort = (data || dataList).filter((val) => val?.categoryName === categorySelected)
      console.log('dataSort: ', dataSort)
      if (allFile) {
        checkMonth(data || dataList)
      } else {
        checkMonth(dataSort)
      }
    }
  }

  const checkMonth = (dataImport) => {
    if ((dataImport || []).length > 0) {
      var data = []
      for (var i = 0; i <= dataImport.length - 1; i++) {
        if (moment(dataImport[i]?.insertDate).format('M') !== moment(dataImport[i + 1]?.insertDate).format('M')) {
          var item = {}
          item.date = Number(dataImport[i]?.insertDate)
          data.push(item)
        } else {
          var item = {}
          item.date = Number(dataImport[i]?.insertDate)
          data.push(item)
        }
      }
      var dataLength = (data || []).length
      if (dataLength > 1) {
        if (moment(data[0]?.date).format('M') === moment(data[1]?.date).format('M')) {
          var newArrMonth = new Array(data[0])
          sliceDataByMonth(dataImport, newArrMonth)
        } else {
          console.log('thuan2')
          sliceDataByMonth(dataImport, data)
        }
      } else {
        console.log('thuan3')
        sliceDataByMonth(dataImport, data)
      }
      console.log('listMonth: ', data)
    }
  }

  const sliceDataByMonth = (dataImport, dataListMonth) => {
    var data = []
    for (var i = 0; i <= (dataListMonth || []).length - 1; i++) {
      var listFilter = dataImport.filter((val) => moment(Number(val?.insertDate)).format('M') === moment(dataListMonth[i]?.date).format('M'))
      var item = {}
      item.title = converMMMYYY(dataListMonth[i]?.date)
      item.data = listFilter
      item.year = moment(dataListMonth[i]?.date).format('YYYY')
      data.push(item)
    }
    if ((data || []).length > 0) {
      filterDataByYear(data)
      setListSectionData(data)
      console.log('sectionList: ', data)
    }
  }

  const filterDataByYear = (data) => {
    if (year === undefined) {
      var dataFilter = (listSectionData || data).filter((val) => Number(val?.year) === Number(moment().format('YYYY')))
      console.log('dataFilter: ', dataFilter)
      setLSSearch(dataFilter)
      setListFilterData(dataFilter)
    } else {
      var dataFilter = (listSectionData || data).filter((val) => Number(val?.year) === year)
      console.log('dataFilter: ', dataFilter)
      setLSSearch(dataFilter)
      setListFilterData(dataFilter)
    }
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
      const cloneDB = cloneDeep(listFilterData)
      setLSSearch(cloneDB)
      return
    }

    var data = []
    const cloneDB = cloneDeep(listFilterData)
    for (var i = 0; i < (listFilterData || []).length; i++) {
      _.forEach(cloneDB[i]?.data, val => {
        if (_.includes((val?.categoryName || '').toLowerCase(), (txt || '-').toLowerCase())) {
          data.push(val)
        }
        if (_.includes((val?.filename || '').toLowerCase(), (txt || '-').toLowerCase())) {
          data.push(val)
        }
      })
    }
    var dataSort = []
    for (var j = 0; j < (listFilterData || []).length; j++) {
      var item = {}
      item.title = listFilterData[j]?.title
      for (var i = 0; i < (data || []).length; i++) {
        if (moment(Number(data[i]?.insertDate)).format('M') === moment(listFilterData[j]?.title).format('M')) {
          item.data = data[i]
          dataSort.push(item)
        }
      }
    }
    for (var i = 0; i < (dataSort || []).length; i++) {
      var listFilter = dataSort.filter((val) => moment(Number(val?.title)).format('M') === moment(listFilterData[i]?.date).format('M'))
      var item = {}
      item.title = dataSort[i]
      item.data = listFilter
      // data.push(item)
    }
    console.log('dataSort: ', dataSort)
    console.log('searchData: ', data)
    const sortNewData = sortData(cloneDeep(dataSort))
    setLSSearch(dataSort)
  }

  const RenderItem = ({item, suggest}) => {
    const _onPressItem = () => {
      NavigationService.navigate(Routes.DETAIL_FILE_DOCTOR_VIEW, {
        data: item,
        patientToken: patientToken
      })
    }
    return (
      <TouchableOpacity onPress={_onPressItem} style={item?.medical === 0 ? styles.box : (suggest ? styles.box : styles.box2)}>
        <Text
          style={[
            customTxt(Fonts.SemiBold, 16, color040404).txt,
            styles.marginB4
          ]}>
          {item?.title ? item?.title : item?.filename}
        </Text>
        <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>
          {Translate(languageRedux).UPLOAD}{' '}
          {convertDMMMYYYY(Number(item?.insertDate))}
        </Text>
        <View style={styles.lineShare}>
          {(item?.categoryName || []).length > 0 && (
            <View style={styles.typeBox}>
              <Text style={customTxt(Fonts.SemiBold, 12, color848586).txt}>
                {item?.categoryName}
              </Text>
            </View>
          )}
          <View style={styles.flexRow}>
            <TouchableOpacity onPress={() => {
              setItemSelected(item)
              callAPIDetail(item?.id)
            }}>
              <Image
                source={icHealth.ic_share}
                style={[styles.iconStyle, styles.marginR16]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setItemSelected(item)
              callAPIDetail(item?.id)
            }}>
              <Image source={icHealth.ic_download} style={styles.iconStyle} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderSectionListDocumentByMonth = (dataSection) => {
    return (
      <View>
        <SectionList
          sections={dataSection || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
          renderSectionHeader={({ section }) => (
            <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.title]}>
              {section?.title}
            </Text>
          )}
        />
      </View>
    )
  }

  const renderSortLine = () => {
    return (
      <View style={styles.ctnTop}>
        <TouchableOpacity onPress={() => {
          setShowSortCate(true)
        }} style={styles.blockFilter}>
          <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
            {allFile ? 'All files' : categorySelected}
          </Text>
          <Image source={icDoc.ic_dropdown} style={styles.iconStyle} />
        </TouchableOpacity>
        <TouchableOpacity onPress={_onPressYear} style={styles.blockFilterYear}>
          <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
            {year ? year : moment().format('YYYY')}
          </Text>
          <Image source={icDoc.ic_dropdown} style={styles.iconStyle} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          setShowSearch(!isSearch)
          setSearch('')
        }} style={styles.search}>
          <Image source={isSearch ? icHeader.ic_close : icDoc.ic_search} style={styles.iconStyle} />
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

  const _onPressYear = () => {
    setShowSortYear(true)
  }

  const renderFlatlistDoc = () => {
    return (
      <View>
        <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.title]}>
          {Translate(languageRedux).SUGGESTED}
        </Text>
        <FlatList
          data={dataDocSuggest?.documents || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} suggest={true} />
          )}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        {renderSortLine()}
        <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.title, styles.textAlignCenter]}>
          {Translate(languageRedux).CONTENT_FILE_DOCTOR}
        </Text>
        {isSearch && renderSearchInput()}
        {(dataDocSuggest?.documents || []).length > 0 && renderFlatlistDoc()}
        {renderSectionListDocumentByMonth(listFilterData)}
      </View>
    )
  }

  const renderPlusButton = () => {
    return (
      <SOSButton
        source={icVisit.ic_plus}
        backgroundColor={color3777EE}
        onPress={() => { setShow(true) }}
      />
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {(listSectionData || []).length > 0 && renderBody()}
      </ScrollView>
      {isShowSortYear && (
        <View style={styles.floatView}>
          <SortByYear
            onPressCancel={() => {
              setShowSortYear(false)
            }}
            dataListYear={listYear}
            valueItem={year}
            setValueItem={setYear}
          />
        </View>
      )}
      {isSortCate && (
        <View style={styles.floatView2}>
          <SortCategory
            onPressCancel={() => {
              setShowSortCate(false)
            }}
            listCategory={dataListCategory}
            setValueItem={setCategorySelected}
            valueItem={categorySelected}
            onPressChoose={() => { setAllFile(false) }}
            onPressAllFiles={() => {
              setAllFile(true)
              setCategorySelected('')
              setShowSortCate(false)
            }}
          />
        </View>
      )}
      {isShow === false && renderPlusButton()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  ctnBody: {
    padding: 16,
    paddingBottom: 120
  },
  marginHori16: {
    marginHorizontal: 16,
    marginVertical: 16
  },
  marginB4: {
    marginBottom: 4
  },
  box: {
    backgroundColor: colorFFFFFF,
    borderRadius: 12,
    marginBottom: 15,
    padding: 16,
    shadowColor: Platform.OS === 'ios' ? '#000' : '#6b6b6b',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3
  },
  box2: {
    backgroundColor: colorEAF1FF,
    borderRadius: 12,
    marginBottom: 15,
    padding: 16,
    shadowColor: Platform.OS === 'ios' ? '#000' : '#6b6b6b',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3
  },
  typeBox: {
    marginTop: 16,
    borderRadius: 4,
    backgroundColor: colorF0F0F0,
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignSelf: 'flex-start'
  },
  title: {
    marginBottom: 8
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
  iconStyle: {
    height: 24,
    width: 24
  },
  blockFilterYear: {
    flex: 2,
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
  floatView2: {
    width: '100%',
    height: 380,
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
  lineShare: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  flexRow: {
    flexDirection: 'row',
    marginRight: 44
  },
  marginR16: {
    marginRight: 16
  },
  textAlignCenter: {
    textAlign: 'center'
  }
})
