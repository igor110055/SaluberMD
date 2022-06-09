import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, ScrollView, Image, FlatList, TouchableOpacity, TextInput} from 'react-native'
import { useSelector } from 'react-redux'
import _, {cloneDeep} from 'lodash'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'

import {color040404, color848586, colorA7A8A9, colorDDDEE1, colorF0F0F0, colorFFFFFF} from 'constants/colors'
import Translate from 'translate'
import Fonts from 'constants/Fonts'
import { customTxt } from 'constants/css'
import {convertDMMMYYYY} from 'constants/DateHelpers'

import icDoc from '../../../../../assets/images/document'
import icDownLoad from '../../../../../assets/images/health_profile'
import icHeader from '../../../../../assets/images/header'

import SortCategory from './SortCategory'

export default function FileArchive() {
  const languageRedux = useSelector(state => state.common.language)
  const surveyPatient = useSelector(state => state.common.surveyPatient)
  const [isSearch, setShowSearch] = useState(false)
  const [lsSearch, setLSSearch] = useState(cloneDeep(surveyPatient?.documents))
  const [txtSearch, setSearch] = useState()
  const [isSortCate, setSortCate] = useState(false)
  const [listCategoryFile, setListCategoryFile] = useState(false)
  const [categorySelected, setCategorySelected] = useState()
  const [dataSortByCate, setDataSortByCate] = useState([])
  const [allFile, setAllFile] = useState(true)
  const token = useSelector(state => state.user.token)

  useEffect(() => {
    callAPIListCategoryFile()
  }, [])

  useEffect(() => {
    sortCategoryFile()
  }, [categorySelected])

  const callAPIListCategoryFile = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/util/getCategorieFiles`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        // console.log('listSubSurgery: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (document)')
          const getList = response.data.categorie || []
          setListCategoryFile(getList)
        }
        // setLoading(false)
      })
      .catch(error => {
        // setLoading(false)
        console.log(error)
      })
  }

  const sortCategoryFile = () => {
    var dataSort = surveyPatient?.documents.filter((val) => val?.categoryName === categorySelected)
    setDataSortByCate(dataSort)
  }

  const renderTop = () => {
    return (
      <View style={styles.ctnTop}>
        <TouchableOpacity onPress={() => { setSortCate(true) }} style={styles.blockFilter}>
          <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
            {allFile ? 'All files' : categorySelected}
          </Text>
          <Image source={icDoc.ic_dropdown} style={styles.iconStyle} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.blockFilterYear}>
          <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>2020</Text>
          <Image source={icDoc.ic_dropdown} style={styles.iconStyle} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          setShowSearch(!isSearch)
          setSearch('')
          setLSSearch(cloneDeep(surveyPatient?.documents))
        }} style={styles.search}>
          <Image source={isSearch ? icHeader.ic_close : icDoc.ic_search} style={styles.iconStyle} />
        </TouchableOpacity>
      </View>
    )
  }

  const sortData = (newDatas) => {
    const newSort = newDatas.sort(function (a, b) {
      var dateA = ''
      var dateB = ''
      dateA = (a.filename || '').toLowerCase()
      dateB = (b.filename || '').toLowerCase()
      return dateB - dateA
    })
    return newSort
  }

  const _onPressSearch = (txt) => {
    setSearch(txt)
    if (_.isEmpty(txt)) {
      const cloneDB = cloneDeep(allFile ? surveyPatient?.documents : dataSortByCate)
      const sortNewData = sortData(cloneDeep(cloneDB))
      setLSSearch(sortNewData)
      return
    }

    var data = []
    const cloneDB = cloneDeep(allFile ? surveyPatient?.documents : dataSortByCate)
    _.forEach(cloneDB, val => {
        if (_.includes((val?.filename || '').toLowerCase(), (txt || '-').toLowerCase())) {
          data.push(val)
        }
        if (_.includes((val?.categoryName || '').toLowerCase(), (txt || '-').toLowerCase())) {
          data.push(val)
        }
    })
    const sortNewData = sortData(cloneDeep(data))
    setLSSearch(sortNewData)
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

  const RenderItem = ({item, index}) => {
    return (
      <View style={styles.boxDocument}>
        <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>{item?.filename}</Text>
        <Text style={[customTxt(Fonts.Regular, 12, colorA7A8A9).txt, styles.marginT8]}>
          {convertDMMMYYYY(item?.insertDate)}
        </Text>
        <View style={styles.category}>
          <View style={styles.typeBox}>
            <Text style={customTxt(Fonts.SemiBold, 12, color848586).txt}>{item?.categoryName}</Text>
          </View>
          <TouchableOpacity>
            <Image source={icDownLoad.ic_download} style={styles.iconStyle} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderListDocument = () => {
    return (
      <View style={styles.ctnListDoc}>
        <FlatList
          data={allFile && isSearch === false ? lsSearch : dataSortByCate}
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
      <View style={styles.ctnBody}>
        {renderTop()}
        {isSearch && renderSearchInput()}
        {renderListDocument()}
      </View>
    )
  }

  return (
    <View>
      <ScrollView>{renderBody()}</ScrollView>
      {isSortCate && (
        <View style={styles.floatView}>
          <SortCategory
            onPressCancel={() => {
              setSortCate(false)
            }}
            listCategory={listCategoryFile}
            setValueItem={setCategorySelected}
            valueItem={categorySelected}
            onPressChoose={() => {setAllFile(false)}}
            onPressAllFiles={() => {
              setAllFile(true)
              setCategorySelected('')
              setSortCate(false)
            }}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  ctnBody: {
    marginTop: 20,
    marginHorizontal: 20,
    paddingBottom: 100
  },
  ctnTop: {
    flexDirection: 'row'
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
  boxDocument: {
    backgroundColor: colorFFFFFF,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16
  },
  marginT8: {
    marginTop: 8
  },
  typeBox: {
    borderRadius: 4,
    backgroundColor: colorF0F0F0,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  category: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between'
  },
  ctnListDoc: {
    marginTop: 16
  },
  searchInput: {
    marginTop: 10,
    height: 56,
    width: '100%',
    borderRadius: 12,
    backgroundColor: colorFFFFFF,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    flexDirection: 'row'
  },
  textInput: {
    marginLeft: 8
  },
  floatView: {
    width: '100%',
    height: 380,
    position: 'absolute'
  }
})
