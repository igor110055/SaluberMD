import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Platform
} from 'react-native'
import Fonts from '../../../../constants/Fonts'
import {
  color333333, color363636, color3777EE, colorBDBDBD, colorC1C3C5, colorE0E0E0, colorF0F0F0, colorF2F2F2, colorFFFFFF
} from '../../../../constants/colors'
import { border, customTxt } from '../../../../constants/css'
import imgHeader from '../../../../../assets/images/header'
import imgMedical from '../../../../../assets/images/medical_record'
import _, { cloneDeep } from 'lodash'
import Translate from '../../../../translate'
import { useSelector } from 'react-redux'
import LoadingView from '../../../../components/LoadingView'
import NoDataView from '../../../../components/NoDataView'

const MultupleChooseView = ({
  lsData, title, onPressSave,
  renderItemComponent, onPressRight,
  hideSearchText, lsHiden, isText,
  isItem, setTxtSearch,
  refreshing, isLabel, isValue
}) => {
  const [txtSearch, setSearch] = useState('')
  const [listData, setChangeListData] = useState(lsData)
  const [lsSearch, setLsSearch] = useState(cloneDeep(listData || []))
  const languageRedux = useSelector(state => state.common.language)
  const [reload, setReload] = useState(1)
  const [isChange, setChange] = useState(false)

  useEffect(() => {
    const sortNewData =
      Platform.OS === 'ios'
        ? sortData(cloneDeep(listData))
        : cloneDeep(listData)
    setLsSearch(sortNewData)
  }, [])

  const renderHeader = () => {
    return (
      <View style={[styles.headerView, border().borderB]}>
        <View style={styles.buttonHeader} />
        <View style={styles.txtHeaderView}>
          <Text style={[
            customTxt(Fonts.SemiBold, 16, color363636).txt
          ]}>{title}</Text>
        </View>
        <TouchableOpacity
          onPress={onPressRight}
          style={styles.buttonHeader}
        >
          <Image source={imgHeader.ic_close} style={styles.iconR} />
        </TouchableOpacity>
      </View>
    )
  }

  const _onPressSearch = (txt) => {
    setSearch(txt)
    if (setTxtSearch) {
      setTxtSearch(txt)
    }
    if (_.isEmpty(txt)) {
      const cloneDB = cloneDeep(listData)
      const sortNewData = sortData(cloneDeep(cloneDB))
      setLsSearch(sortNewData)
      return
    }

    var data = []
    const cloneDB = cloneDeep(listData)

    _.forEach(cloneDB, val => {
      if (isItem) {
        if (_.includes((val || '').toLowerCase(), (txt || '-').toLowerCase())) {
          data.push(val)
        }
      } else if (isText) {
        if (_.includes((val?.text || '').toLowerCase(), (txt || '-').toLowerCase())) {
          data.push(val)
        }
      } else if (isLabel) {
        if (_.includes((val?.label || '').toLowerCase(), (txt || '-').toLowerCase())) {
          data.push(val)
        }
      } else {
        if (_.includes((val?.name || '').toLowerCase(), (txt || '-').toLowerCase())) {
          data.push(val)
        }
      }
    })
    const sortNewData = Platform.OS === 'ios' ? sortData(cloneDeep(data)) : cloneDeep(data)
    setLsSearch(sortNewData)
  }

  const sortData = (newDatas) => {
    const newSort = (newDatas || []).sort(function (a, b) {
      var dateA = ''
      var dateB = ''
      if (isText) {
        dateA = (a.text || '').toLowerCase()
        dateB = (b.text || '').toLowerCase()
      } else {
        dateA = (a.name || '').toLowerCase()
        dateB = (b.name || '').toLowerCase()
      }
      return dateB - dateA
    })
    setTimeout(() => {
      setReload(Math.random())
    }, 400)
    return newSort
  }

  const renderSearchTxt = () => {
    return (
      <View style={[
        styles.bgSearch
      ]}>
        <TextInput
          style={styles.txtInput}
          placeholder={Translate(languageRedux).START_TYPING}
          returnKeyType={'search'}
          clearButtonMode={'while-editing'}
          autoCapitalize={'none'}
          onChangeText={_onPressSearch}
          onSubmitEditing={() => {

          }}
          value={txtSearch}
        />
      </View>
    )
  }

  const touchItem = (value, index) => {
    var newData = listData
    newData[index] = {
      label: value?.label,
      text: value?.text,
      name: value?.name,
      value: value?.value,
      isSelected: !value?.isSelected
    }
    setChangeListData(newData)
    setLsSearch(newData)
    setTimeout(() => {
      setReload(Math.random())
    }, 200)
  }

  const renderFlatList = () => {
    if (lsSearch.length === 0) {
      return <NoDataView />
    }
    return (
      <FlatList
        data={lsSearch}
        key={'#1MultupleChooseView'}
        extraData={reload}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          if (renderItemComponent) {
            return renderItemComponent(item)
          }

          if (isItem) {
            return (
              <TouchableOpacity
                onPress={() => {
                  setChange(true)
                  touchItem(item, index)
                }}
                style={[
                  styles.itemStyle
                ]}>
                <Text style={[
                  customTxt(Fonts.Regular, 14, color333333).txt,
                  styles.txt
                ]}>{item || ''}</Text>
                <View style={styles.viewCheck}>
                  <Image style={styles.imgCheck} source={item?.isSelected ? imgMedical.ic_check_box_on : imgMedical.ic_check_box_off} />
                </View>
              </TouchableOpacity>
            )
          }

          if (isText) {
            return (
              <TouchableOpacity
                onPress={() => {
                  setChange(true)
                  touchItem(item, index)
                }}
                style={[
                  styles.itemStyle
                ]}>
                <Text style={[
                  customTxt(Fonts.Regular, 14, color333333).txt,
                  styles.txt
                ]}>{item?.text || ''}</Text>
                <View style={styles.viewCheck}>
                  <Image style={styles.imgCheck} source={item?.isSelected ? imgMedical.ic_check_box_on : imgMedical.ic_check_box_off} />
                </View>
              </TouchableOpacity>
            )
          }
          if (isLabel) {
            return (
              <TouchableOpacity
                onPress={() => {
                  setChange(true)
                  touchItem(item, index)
                }}
                style={[
                  styles.itemStyle
                ]}>
                <Text style={[
                  customTxt(Fonts.Regular, 14, color333333).txt,
                  styles.txt
                ]}>{item?.label || ''}</Text>
                <View style={styles.viewCheck}>
                  <Image style={styles.imgCheck} source={item?.isSelected ? imgMedical.ic_check_box_on : imgMedical.ic_check_box_off} />
                </View>
              </TouchableOpacity>
            )
          }
          if (isValue) {
            return (
              <TouchableOpacity
                onPress={() => {
                  setChange(true)
                  touchItem(item, index)
                }}
                style={[
                  styles.itemStyle
                ]}>
                <Text style={[
                  customTxt(Fonts.Regular, 14, color333333).txt,
                  styles.txt
                ]}>{item?.value || ''}</Text>
                <View style={styles.viewCheck}>
                  <Image style={styles.imgCheck} source={item?.isSelected ? imgMedical.ic_check_box_on : imgMedical.ic_check_box_off} />
                </View>
              </TouchableOpacity>
            )
          }
          return (
            <TouchableOpacity
              onPress={() => {
                setChange(true)
                touchItem(item, index)
              }}
              style={[
                styles.itemStyle
              ]}>
              <Text style={[
                customTxt(Fonts.Regular, 14, color333333).txt,
                styles.txt
              ]}>{item?.name || ''}</Text>
              <View style={styles.viewCheck}>
                <Image style={styles.imgCheck} source={item?.isSelected ? imgMedical.ic_check_box_on : imgMedical.ic_check_box_off} />
              </View>
            </TouchableOpacity>
          )
        }}
        contentContainerStyle={styles.paddingB100}
      />
    )
  }

  const checkBT = () => {
    return isChange
  }

  const renderButton = () => {
    return (
      <TouchableOpacity
        style={btStyle(checkBT()).btView}
        activeOpacity={checkBT() ? 0 : 1}
        onPress={() => onPressSave(listData)}
      >
        <Text style={[
          customTxt(Fonts.SemiBold, 18, colorC1C3C5).txt,
          btStyle(checkBT()).txtBT
        ]}>{Translate(languageRedux).btnsave}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.flatlistView}>
      <TouchableOpacity style={styles.bgView} onPress={onPressRight} />
      <View style={styles.fullView}>
        {renderHeader()}
        {!hideSearchText && renderSearchTxt()}
        {renderFlatList()}
        {renderButton()}
      </View>
      {refreshing ? <LoadingView /> : null}
    </View>
  )
}

export default MultupleChooseView

const styles = StyleSheet.create({
  itemView: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 15
  },
  bgView: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'black',
    opacity: 0.4
  },
  flatlistView: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  fullView: {
    flex: 1,
    height: '100%',
    borderRadius: 16,
    marginTop: 44,
    backgroundColor: colorFFFFFF
  },
  headerView: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  buttonHeader: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtHeader: {
    flex: 1
  },
  txtHeaderView: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: Fonts.Bold
  },
  txt: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20
  },
  itemStyle: {
    borderBottomColor: colorE0E0E0,
    borderBottomWidth: 0.2,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 25,
    marginTop: 10
  },
  viewCheck: {
    position: 'absolute',
    width: 20,
    height: '100%',
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgCheck: {
    width: 16,
    height: 16
  },
  iconR: {
    width: 24,
    height: 24
  },
  bgSearch: {
    width: '100%',
    height: 46
  },
  txtInput: {
    flex: 1,
    color: color363636,
    backgroundColor: colorF2F2F2,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    paddingLeft: 15,
    marginRight: 10,
    borderRadius: 44 / 2
  },
  paddingB100: {
    paddingBottom: 100
  }
})

const btStyle = (isActive) => StyleSheet.create({
  btView: {
    backgroundColor: isActive ? color3777EE : colorF0F0F0,
    borderRadius: 12,
    height: 48,
    minWidth: 117,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 40,
    marginLeft: 16,
    marginRight: 16
  },
  txtBT: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 24,
    marginRight: 24,
    color: isActive ? colorFFFFFF : colorBDBDBD
  }
})
