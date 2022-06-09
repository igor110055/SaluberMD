import React, {useState, useEffect} from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList, TextInput } from 'react-native'
import { useSelector } from 'react-redux'
import _, {cloneDeep} from 'lodash'

import {color000000, color040404, colorA7A8A9, colorDDDEE1, colorF0F0F0, colorFFFFFF} from 'constants/colors'
import Translate from 'translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'

import icHeader from '../../../../assets/images/header'
import icTrash from '../../../../assets/images/video_call'

export default function Symptoms({onPressCancel, setValueItem, valueItem}) {
  const languageRedux = useSelector(state => state.common.language)
  const surveyPatient = useSelector(state => state.common.surveyPatient)
  const [selectedItem, setSelectedItem] = useState([])
  const [txtSearch, setSearch] = useState()
  const [lsSearch, setLSSearch] = useState(cloneDeep(surveyPatient?.symptoms))
  const [checkList, setCheckList] = useState([])
  const [item, setItem] = useState()
  const [itemDelete, setItemDelete] = useState()

  useEffect(() => {
    setSelectedItem(valueItem)
  }, [valueItem])

  useEffect(() => {
    checkListFunction()
  }, [item])

  useEffect(() => {
    backItemSelected()
  }, [itemDelete])

  const checkListFunction = () => {
    if ((checkList || []).length === 0) {
      var listFilter = lsSearch.filter((val) => val?.id !== item?.id)
      setCheckList(listFilter)
    }
    if ((checkList || []).length > 0) {
      var listFilter = checkList.filter((val) => val?.id !== item?.id)
      setCheckList(listFilter)
    }
    console.log('checkList: ', checkList)
  }

  const backItemSelected = () => {
    var listFilter = surveyPatient?.symptoms.filter((val) => val?.id === itemDelete?.id)
    var list = _.concat(listFilter, checkList)
    const sortById = ((a, b) => {
      return Number(a.id) - Number(b.id)
    })
    const sortData = list.sort(sortById)
    setCheckList(sortData)
  }

  const RenderItem = ({ item }) => {
    const _onPressItem = () => {
      setItem(item)
      var selectID = [...selectedItem]
        if (selectID.includes(item)) {
          selectID = selectID.filter((val) => val?.id !== item?.id)
        }
        else {
          selectID.push(item)
        }
      setSelectedItem(selectID)
      setValueItem(selectID)
    }
    return (
      <TouchableOpacity onPress={_onPressItem} style={styles.checkBox}>
        <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginL8]}>
          {item?.nameCurrentValue}
        </Text>
      </TouchableOpacity>
    )
  }

  const checkDataList = () => {
    if ((checkList || []).length === 0) {
      return lsSearch
    }
    if ((checkList || []).length > 0) {
      return checkList
    }
  }

  const renderFlatlistSymptom = () => {
    return (
      <View style={styles.ctnList}>
        <FlatList
          data={checkDataList()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const RenderItemSelected = ({item}) => {
    const _onPressItem = () => {
      setItemDelete(item)
      var selectID = [...selectedItem]
        if (selectID.includes(item)) {
          selectID = selectID.filter((val) => val?.id !== item?.id)
        }
        else {
          selectID.push(item)
        }
      setSelectedItem(selectID)
      setValueItem(selectID)
    }
    return (
      <TouchableOpacity onPress={_onPressItem} style={styles.checkBoxSelected}>
        <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginL8]}>
          {item?.nameCurrentValue}
        </Text>
        <Image source={icTrash.ic_trash} style={styles.iconStyle} />
      </TouchableOpacity>
    )
  }

  const renderFlatlistSelected = () => {
    return (
      <View style={styles.ctnList}>
        <FlatList
          data={selectedItem}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItemSelected item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderTop = () => {
    return (
      <View>
        <View style={styles.ctnTitle}>
          <View style={styles.flex1} />
          <View style={styles.ctnSOS}>
            <Text style={customTxt(Fonts.SemiBold, 18, color040404).txt}>
              {Translate(languageRedux).symptoms}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.marginR16}
            onPress={onPressCancel}>
            <Image source={icHeader.ic_close} style={styles.iconStyleFloat} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const sortData = (newDatas) => {
    const newSort = newDatas.sort(function (a, b) {
      var dateA = ''
      var dateB = ''
      dateA = (a.nameCurrentValue || '').toLowerCase()
      dateB = (b.nameCurrentValue || '').toLowerCase()
      return dateB - dateA
    })
    return newSort
  }

  const _onPressSearch = (txt) => {
    setSearch(txt)
    if (_.isEmpty(txt)) {
      const cloneDB = cloneDeep(surveyPatient?.symptoms)
      const sortNewData = sortData(cloneDeep(cloneDB))
      setLSSearch(sortNewData)
      return
    }

    var data = []
    const cloneDB = cloneDeep(surveyPatient?.symptoms)
    _.forEach(cloneDB, val => {
        if (_.includes((val?.nameCurrentValue || '').toLowerCase(), (txt || '-').toLowerCase())) {
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

  const renderBody = () => {
    return (
      <View>
        {renderFlatlistSymptom()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.bgOpacity}
        onPress={onPressCancel}
      />
      <ScrollView style={styles.fullView}>
        <View style={styles.ctnSearchInput}>
          {renderTop()}
          {renderSearchInput()}
          {(selectedItem || []).length > 0 && renderFlatlistSelected()}
          {(selectedItem || []).length > 0 && <View style={styles.line} />}
          {renderBody()}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'flex-end'
  },
  bgOpacity: {
    width: '100%',
    height: '100%',
    flex: 1,
    position: 'absolute',
    backgroundColor: color000000,
    opacity: 0.7
  },
  fullView: {
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    height: Dimensions.get('window').height - 50
  },
  ctnTitle: {
    height: 56,
    flexDirection: 'row'
  },
  iconStyleFloat: {
    height: 24,
    width: 24,
    marginRight: 16,
    marginLeft: 16
  },
  ctnSOS: {
    flex: 4,
    alignItems: 'center',
    marginTop: 18
  },
  marginR16: {
    flex: 1,
    alignItems: 'flex-end',
    marginTop: 18
  },
  flex1: {
    flex: 1
  },
  checkBox: {
    flexDirection: 'row',
    alignContent: 'center',
    marginBottom: 8
  },
  marginL8: {
    marginLeft: 8
  },
  ctnList: {
    marginTop: 28,
    marginBottom: 20
  },
  searchInput: {
    marginTop: 10,
    height: 56,
    width: '100%',
    borderRadius: 12,
    backgroundColor: colorFFFFFF,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    flexDirection: 'row',
    marginBottom: 10
  },
  textInput: {
    marginLeft: 8
  },
  ctnSearchInput: {
    marginHorizontal: 16
  },
  line: {
    height: 1,
    borderWidth: 0.75,
    borderColor: colorF0F0F0
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  checkBoxSelected: {
    flexDirection: 'row',
    alignContent: 'center',
    marginBottom: 8,
    justifyContent: 'space-between'
  }
})
