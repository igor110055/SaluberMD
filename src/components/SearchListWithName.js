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
import Fonts from '../constants/Fonts'
import {
  color333333, color363636, colorE0E0E0, colorF2F2F2, colorFFFFFF
} from '../constants/colors'
import { border, customTxt } from '../constants/css'
import imgHealth from '../../assets/images/health_profile'
import imgHeader from '../../assets/images/header'
import _, { cloneDeep } from 'lodash'
import Translate from '../translate'
import { useSelector } from 'react-redux'
import LoadingView from './LoadingView'
import NoDataView from './NoDataView'
import { ScrollView } from 'react-native-gesture-handler'

const SearchListWithName = ({
  listData, title, itemSelected, onItemClick,
  renderItemComponent, onPressRight,
  hideSearchText, lsHiden, isText,
  isItem, setTxtSearch,
  refreshing, isLabel, isValue,
  isSortNumber, isTag, listItemSelected
}) => {
  const [txtSearch, setSearch] = useState('')
  const [lsSearch, setLsSearch] = useState(cloneDeep(listData || []))
  const languageRedux = useSelector(state => state.common.language)
  const [reload, setReload] = useState(1)

  useEffect(() => {
    const sortNewData = sortData(cloneDeep(listData))
    setLsSearch(Platform.OS === 'ios' ? sortNewData : listData)
  }, [listItemSelected])

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
    const sortNewData = isLabel ? cloneDeep(data) : sortData(cloneDeep(data))
    setLsSearch(sortNewData)
  }

  const sortData = (newDatas) => {
    if (isSortNumber) {
      return newDatas
    } else {
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

  const checkItem = (item) => {
    if (_.findIndex(lsHiden, { id: item?.id }) > -1) {
      return false
    }
    return true
  }

  const renderFlatList = () => {
    return (
      <FlatList
        data={lsSearch}
        key={'#1SearchListWithName'}
        extraData={reload}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          if (renderItemComponent) {
            return renderItemComponent(item)
          }

          if (isItem) {
            return (
              <TouchableOpacity
                activeOpacity={checkItem(item) ? 0 : 1}
                onPress={() => {
                  if (checkItem(item)) {
                    onItemClick(item)
                  }
                }}
                style={[
                  styles.itemStyle,
                  checkItem(item) ? null : styles.opacity4
                ]}>
                <Text style={[
                  customTxt(Fonts.Regular, 14, color333333).txt,
                  styles.txt
                ]}>{item || ''}</Text>
                {
                  (itemSelected || '') === (item || '-') && (
                    <View style={styles.viewCheck}>
                      <Image style={styles.imgCheck} source={imgHealth.ic_check} />
                    </View>
                  )
                }
              </TouchableOpacity>
            )
          }

          if (isText) {
            return (
              <TouchableOpacity
                activeOpacity={checkItem(item) ? 0 : 1}
                onPress={() => {
                  if (checkItem(item)) {
                    onItemClick(item)
                  }
                }}
                style={[
                  styles.itemStyle,
                  checkItem(item) ? null : styles.opacity4
                ]}>
                <Text style={[
                  customTxt(Fonts.Regular, 14, color333333).txt,
                  styles.txt
                ]}>{item?.text || ''}</Text>
                {
                  (itemSelected?.text || '') === (item?.text || '-') && (
                    <View style={styles.viewCheck}>
                      <Image style={styles.imgCheck} source={imgHealth.ic_check} />
                    </View>
                  )
                }
              </TouchableOpacity>
            )
          }
          if (isLabel) {
            return (
              <TouchableOpacity
                activeOpacity={checkItem(item) ? 0 : 1}
                onPress={() => {
                  if (checkItem(item)) {
                    onItemClick(item)
                  }
                }}
                style={[
                  styles.itemStyle,
                  checkItem(item) ? null : styles.opacity4
                ]}>
                <Text style={[
                  customTxt(Fonts.Regular, 14, color333333).txt,
                  styles.txt
                ]}>{item?.label || ''}</Text>
                {
                  (itemSelected?.label || '') === (item?.label || '-') && (
                    <View style={styles.viewCheck}>
                      <Image style={styles.imgCheck} source={imgHealth.ic_check} />
                    </View>
                  )
                }
              </TouchableOpacity>
            )
          }
          if (isValue) {
            console.log('ls data: ', listData)
            return (
              <TouchableOpacity
                activeOpacity={checkItem(item) ? 0 : 1}
                onPress={() => {
                  if (checkItem(item)) {
                    onItemClick(item)
                  }
                }}
                style={[
                  styles.itemStyle,
                  checkItem(item) ? null : styles.opacity4
                ]}>
                <Text style={[
                  customTxt(Fonts.Regular, 14, color333333).txt,
                  styles.txt
                ]}>{item?.value || ''}</Text>
                {
                  (itemSelected?.value || '') === (item?.value || '-') && (
                    <View style={styles.viewCheck}>
                      <Image style={styles.imgCheck} source={imgHealth.ic_check} />
                    </View>
                  )
                }
              </TouchableOpacity>
            )
          }
          return (
            <TouchableOpacity
              activeOpacity={checkItem(item) ? 0 : 1}
              onPress={() => {
                if (checkItem(item)) {
                  onItemClick(item)
                }
              }}
              style={[
                styles.itemStyle,
                checkItem(item) ? null : styles.opacity4
              ]}>
              <Text style={[
                customTxt(Fonts.Regular, 14, color333333).txt,
                styles.txt
              ]}>{item?.name || ''}</Text>
              {
                isTag ?
                listItemSelected.includes(item?.id) && (
                  <View style={styles.viewCheck}>
                    <Image style={styles.imgCheck} source={imgHealth.ic_check} />
                  </View>
                )
                :
                (itemSelected?.name || '') === (item?.name || '-') && (
                  <View style={styles.viewCheck}>
                    <Image style={styles.imgCheck} source={imgHealth.ic_check} />
                  </View>
                )
              }
            </TouchableOpacity>
          )
        }}
        contentContainerStyle={styles.paddingB100}
      />
    )
  }

  return (
    <View style={styles.flatlistView}>
      <TouchableOpacity style={styles.bgView} onPress={onPressRight} />
      <View style={styles.fullView}>
        {lsSearch.length === 0 && <NoDataView />}
        {renderHeader()}
        {!hideSearchText && renderSearchTxt()}
        <ScrollView>
        {renderFlatList()}
        </ScrollView>
      </View>
      {refreshing ? <LoadingView /> : null}
    </View>
  )
}

export default SearchListWithName

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
    width: '100%',
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
  },
  opacity4: {
    opacity: 0.4
  }
})
