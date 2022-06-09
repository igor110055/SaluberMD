import React, { useState, useEffect } from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image,
ScrollView, Platform, FlatList, TextInput} from 'react-native'
import {useSelector} from 'react-redux'
import _, {cloneDeep} from 'lodash'

import {color040404, colorA7A8A9, colorDDDEE1, colorF0F0F0, colorFFFFFF} from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from 'translate'
import { convertDMMMYYYY } from 'constants/DateHelpers'
import Routes from 'navigation/Routes'
import NavigationService from 'navigation'

import icDoc from '../../../../../assets/images/document'
import icHeader from '../../../../../assets/images/header'

import SortByCategory from './SortByCategory'

export default function Communications({dataReferral, dataPrescription, dataMedical, dataMessage}) {
  const languageRedux = useSelector(state => state.common.language)
  const [isShowSort, setShowSort] = useState()
  const [valueSort, setValueSort] = useState()
  const [txtSearch, setSearch] = useState()
  const [lsSearch, setLSSearch] = useState()
  const [isSearch, setShowSearch] = useState(false)

  useEffect(() => {
    setValueSort(labelSort[0])
  }, [])

  const labelSort = [
    {
      label: Translate(languageRedux).message,
      value: 0
    },
    {
      label: Translate(languageRedux).REFERRAL,
      value: 1
    },
    {
      label: Translate(languageRedux).prescription,
      value: 2
    },
    {
      label: Translate(languageRedux).medical_certificate,
      value: 3
    }
  ]

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
          setLSSearch(checkData())
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

  const _onPressSearch = (txt) => {
    setSearch(txt)
    if (_.isEmpty(txt)) {
      const cloneDB = cloneDeep(checkData())
      setLSSearch(cloneDB)
      return
    }

    var data = []
    const cloneDB = cloneDeep(checkData())
    _.forEach(cloneDB, val => {
      if (_.includes((val?.referral || val?.prescription || val?.description || val?.subject || '').toLowerCase(), (txt || '-').toLowerCase())) {
        data.push(val)
      }
    })
    setLSSearch(data)
  }

  const renderTag = (dataMess) => {
    const RenderItem = ({item, index, data}) => {
      return (
        <View>
          <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
            {item?.name}{index === (data || []).length - 1 ? null : ', '}
          </Text>
        </View>
      )
    }
    return (
      <View>
        <FlatList
          data={dataMess}
          horizontal={true}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} data={dataMess} />
          )}
        />
      </View>
    )
  }

  const viewPDFFile = (id, item) => {
    NavigationService.navigate(Routes.PDF_VIEW, {
      id: id,
      check: item
    })
  }

  const RenderItem = ({item, index}) => {
    return (
      <TouchableOpacity onPress={() => {
        item?.subject
        ? NavigationService.navigate(Routes.DETAIL_COMMUNICATION_SCREEN, {
          data: item
        })
        : viewPDFFile(item?.id, item)
      }} style={styles.ctnItem}>
        <View style={styles.paddingH16}>
          <Text style={[customTxt(Fonts.Regular, 12, colorA7A8A9).txt, styles.marginB4]}>
            {convertDMMMYYYY(item?.date || item?.prescriptionDate || item?.insertDate)}
          </Text>
          {item?.referral !== null && (
            <Text style={customTxt(Fonts.Bold, 14, color040404).txt}>
              {item?.referral || item?.prescription || item?.file || item?.subject}
            </Text>
          )}
          {renderTag(item?.tags)}
        </View>
      </TouchableOpacity>
    )
  }

  const checkData = () => {
    if (valueSort?.value === 1) {
      return dataReferral
    }
    if (valueSort?.value === 2) {
      return dataPrescription
    }
    if (valueSort?.value === 3) {
      return dataMedical
    }
    if (valueSort?.value === 0) {
      return dataMessage
    }
    else {
      return []
    }
  }

  const checkNe = () => {
    if (isSearch) {
      return lsSearch
    } else {
      return checkData()
    }
  }

  const checkTitle = () => {
    if (valueSort?.value === 1) {
      return Translate(languageRedux).ALL_REFERRAL
    }
    if (valueSort?.value === 2) {
      return Translate(languageRedux).ALL_PRESCRIPTION
    }
    if (valueSort?.value === 3) {
      return Translate(languageRedux).ALL_MEDICAL_CERTIFICATE
    } else {
      return Translate(languageRedux).ALL_MESSAGE
    }
  }

  const renderFlatlist = () => {
    return (
      <View style={styles.ctnList}>
        <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginB16]}>
          {checkTitle()} ({(checkData() || []).length})
        </Text>
        <FlatList
          data={checkNe()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        {renderSortLine()}
        {isSearch && renderSearchInput()}
        {renderFlatlist()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {renderBody()}
      </ScrollView>
      {isShowSort && (
        <View style={styles.floatView}>
          <SortByCategory
            onPressCancel={() => {
              setShowSort(false)
            }}
            dataList={labelSort}
            valueItem={valueSort}
            setValueItem={setValueSort}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  ctnBody: {
    paddingHorizontal: 16,
    paddingBottom: 42,
    paddingTop: 16
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
  ctnList: {
    borderRadius: 12,
    backgroundColor: colorFFFFFF,
    shadowColor: Platform.OS === 'ios' ? '#000' : '#6b6b6b',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3
  },
  ctnItem: {
    paddingVertical: 18,
    borderTopWidth: 1,
    borderColor: colorF0F0F0
  },
  marginB4: {
    marginBottom: 4
  },
  marginB16: {
    margin: 16
  },
  paddingH16: {
    paddingHorizontal: 16
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
  }
})
