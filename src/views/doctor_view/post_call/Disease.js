import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, ScrollView, FlatList, Dimensions, TouchableOpacity, Image, Platform} from 'react-native'
import { useSelector } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../api/APIs'
import _ from 'lodash'

import {color000000, color040404, color3777EE, colorF0F0F0, colorFFFFFF} from 'constants/colors'
import Translate from 'translate'
import Fonts from 'constants/Fonts'
import { customTxt } from 'constants/css'

import icHeader from '../../../../assets/images/header'
import icTrash from '../../../../assets/images/video_call'

import CustomTextInput from '../../healthProfile/components/CustomTextInput'

export default function Disease({onPressCancel, setValueItem, valueItem}) {
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const [disease, setDisease] = useState()
  const [listDisease, setListDisease] = useState([])
  const [listSelected, setListSelected] = useState([])
  const [checkList, setCheckList] = useState([])
  const [item, setItem] = useState()
  const [itemDelete, setItemDelete] = useState()

  useEffect(() => {
    setListSelected(valueItem || [])
  }, [valueItem])

  useEffect(() => {
    callAPIDisease()
    setCheckList([])
  }, [disease])

  useEffect(() => {
    checkListFunction()
  }, [item])

  useEffect(() => {
    backItemSelected()
  }, [itemDelete])

  const checkListFunction = () => {
    if ((checkList || []).length === 0) {
      var listFilter = listDisease.filter((val) => val?.diseaseId !== item?.diseaseId)
      setCheckList(listFilter)
    }
    if ((checkList || []).length > 0) {
      var listFilter = checkList.filter((val) => val?.diseaseId !== item?.diseaseId)
      setCheckList(listFilter)
    }
    console.log('checkList: ', checkList)
  }

  const backItemSelected = () => {
    var listFilter = listDisease.filter((val) => val?.id === itemDelete?.id)
    var list = _.concat(listFilter, checkList)
    const sortById = ((a, b) => {
      return Number(a.diseaseId) - Number(b.diseaseId)
    })
    const sortData = list.sort(sortById)
    setCheckList(sortData)
  }

  const callAPIDisease = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/webdoctor/disease?chiave=${disease}`,
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
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.disease || []
          setListDisease(getList)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const RenderItem = ({item}) => {
    const _onPressItem = () => {
      setItem(item)
      var selectID = [...listSelected]
        if (selectID.includes(item)) {
          selectID = selectID.filter((val) => val?.diseaseId !== item?.diseaseId)
        }
        else {
          selectID.push(item)
        }
      setListSelected(selectID)
      setValueItem(selectID)
    }
    return (
      <TouchableOpacity onPress={_onPressItem} style={styles.checkBox}>
        <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
          {item?.name}
        </Text>
      </TouchableOpacity>
    )
  }

  const checkDataList = () => {
    if ((checkList || []).length === 0) {
      return listDisease
    }
    if ((checkList || []).length > 0) {
      return checkList
    }
  }

  const renderFlatlistDisease = () => {
    return (
      <View style={styles.ctnList}>
        <FlatList
          data={checkDataList()}
          extraData={listDisease}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderSearchInput = () => {
    return (
      <View style={styles.searchInput}>
        <CustomTextInput
          value={disease}
          onChangeTxt={(txt) => setDisease(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          autoCapitalize={'none'}
          placeholder={Translate(languageRedux).searchdisease}
        />
      </View>
    )
  }

  const RenderItemSelected = ({item}) => {
    const _onPressItem = () => {
      setItemDelete(item)
      var selectID = [...listSelected]
        if (selectID.includes(item)) {
          selectID = selectID.filter((val) => val?.diseaseId !== item?.diseaseId)
        }
        else {
          selectID.push(item)
        }
      setListSelected(selectID)
      setValueItem(selectID)
    }
    return (
      <TouchableOpacity onPress={_onPressItem} style={styles.checkBox}>
        <View style={styles.ctnName}>
          <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
            {item?.name}
          </Text>
        </View>
        <View style={styles.ctnIconTrash}>
          <Image source={icTrash.ic_trash} style={styles.iconStyle} />
        </View>
      </TouchableOpacity>
    )
  }

  const renderFlatlistSelected = () => {
    return (
      <View style={styles.ctnList}>
        <FlatList
          data={listSelected}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItemSelected item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        {renderFlatlistDisease()}
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
              {Translate(languageRedux).disease_1}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.marginR16}
            onPress={onPressCancel}>
            <Text style={customTxt(Fonts.SemiBold, 14, color3777EE).txt}>
              {Translate(languageRedux).DONE_BTN}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.bgOpacity}
        onPress={onPressCancel}
      />
      {Platform.OS === 'ios' && <View style={styles.fullView}>
        <View style={styles.marginHori16}>
          {renderTop()}
          {renderSearchInput()}
          {(listSelected || []).length > 0 && renderFlatlistSelected()}
          {(listSelected || []).length > 0 && <View style={styles.line} />}
        </View>
        <ScrollView style={styles.ctnSearchInput}>
          {renderBody()}
        </ScrollView>
      </View>}
      {Platform.OS === 'android' && <ScrollView style={styles.floatingViewAndroid}>
        <View style={styles.marginHori16}>
          {renderTop()}
          {renderSearchInput()}
          {(listSelected || []).length > 0 && renderFlatlistSelected()}
          {(listSelected || []).length > 0 && <View style={styles.line} />}
        </View>
        <ScrollView style={styles.ctnSearchInput}>
          {renderBody()}
        </ScrollView>
      </ScrollView>}
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
    height: Dimensions.get('window').height - 64
  },
  ctnBody: {
    marginTop: 16
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
    marginBottom: 8,
    justifyContent: 'space-between'
  },
  marginL8: {
    marginLeft: 8
  },
  ctnList: {
    marginTop: 16,
    marginBottom: 16
  },
  ctnSearchInput: {
    marginHorizontal: 16,
    marginBottom: 20,
    marginTop: 20
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  ctnIconTrash: {
    flex: 1,
    alignItems: 'flex-end'
  },
  ctnName: {
    flex: 6
  },
  line: {
    height: 1,
    borderWidth: 0.75,
    borderColor: colorF0F0F0
  },
  floatingViewAndroid: {
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    top: 64,
    height: Dimensions.get('window').height - 64
  },
  marginHori16: {
    marginHorizontal: 16
  }
})
