import React, {useEffect, useState} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList} from 'react-native'
import moment from 'moment'
import Icon from 'react-native-vector-icons/Entypo'

import { color040404, colorA7A8A9, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'

export default function FilterByMonth({onPressCancel, setValueItem, valueItem}) {
  const [listFilter, setListFilter] = useState()
  const [year, setYear] = useState(Number(moment(valueItem).format('YYYY')) || Number(moment().format('YYYY')))

  useEffect(() => {
    listMonth()
    console.log('valueItem: ', valueItem)
  }, [year])

  const listMonth = () => {
    var data = []
    var monthLength = moment().format('M')
    if (year === Number(moment().format('YYYY'))) {
      for (var i = 0; i < monthLength; i++) {
        var month = moment().add(-i, 'months').endOf('day').format('MMM YYYY')
        var item = {}
        item.month = month
        data.push(item)
      }
    } else {
      for (var i = 0; i < 12; i++) {
        var month = moment().add(i, 'months').endOf('day').format('MMM' + ' ' + year)
        var item = {}
        item.month = month
        data.push(item)
      }
    }
    setListFilter(data)
    console.log('months: ', data)
  }

  const RenderItem = ({item}) => {
    const _onPressItem = () => {
      setValueItem(item?.month)
      console.log('item: ', item?.month)
      onPressCancel()
    }
    return (
      <View>
        <TouchableOpacity onPress={_onPressItem} style={styles.ctnItem}>
          <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>{item?.month}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderFlatList = () => {
    return (
      <View style={styles.centerFlatList}>
        <FlatList
          data={listFilter}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const checkYear = () => {
    if (year > moment().format('YYYY')) {
      return moment().format('YYYY')
    } else {
      return year
    }
  }

  const checkDisableIncrease = () => {
    if (year >= moment().format('YYYY')) {
      return true
    } else {
      return false
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressCancel} style={styles.bgOpacity} />
      <View style={styles.floatView}>
        <View style={styles.ctn}>
          <View style={styles.year}>
            <TouchableOpacity onPress={() => {
                setYear(Number(year) - 1)
            }}>
              <Icon name={'chevron-small-left'} size={32} color={colorA7A8A9} />
            </TouchableOpacity>
            <Text style={customTxt(Fonts.SemiBold, 18, color040404).txt}>{checkYear()}</Text>
            <TouchableOpacity disabled={checkDisableIncrease()} onPress={() => {
                setYear(Number(year) + 1)
            }}>
              <Icon name={'chevron-small-right'} size={32} color={colorA7A8A9} />
            </TouchableOpacity>
          </View>
          {renderFlatList()}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'flex-end'
  },
  bgOpacity: {
    width: '100%',
    height: '100%',
    flex: 1,
    position: 'absolute'
  },
  floatView: {
    marginTop: 80,
    marginRight: 20
  },
  ctn: {
    backgroundColor: colorFFFFFF,
    shadowColor: '#000',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 9,
    width: Dimensions.get('window').width - 40
  },
  ctnItem: {
    marginBottom: 8
  },
  year: {
    marginBottom: 12,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  centerFlatList: {
    alignItems: 'center'
  }
})
