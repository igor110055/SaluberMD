import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, ScrollView, FlatList} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import {color000000, color040404, color3777EE, colorDDDEE1, colorFFFFFF} from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from 'translate'
import { saveListSpecialtySelected } from 'actions/common'

import icHeader from '../../../../../assets/images/header'

export default function ChooseSpecialtyView({ onPressCancel, listSpecialty }) {
  const languageRedux = useSelector(state => state.common.language)
  const [selectedItem, setSelectedItem] = useState([])
  const listSpecialtySelected = useSelector(state => state.common.listSpecialtySelected)
  const dispatch = useDispatch()

  useEffect(() => {
    checkListChooseItem()
  }, [selectedItem])

  useEffect(() => {
    checkItemSelected()
  }, [])

  const checkItemSelected = () => {
    var list = []
    for (var i = 0; i <= (listSpecialtySelected || []).length - 1; i++) {
      var idItemSelected = listSpecialtySelected[i]?.id
      var item = listSpecialty.filter(val => val?.id === idItemSelected)
      var thuan = item[0]
      list.push(thuan)
    }
    setSelectedItem(list)
    console.log('list: ', list)
  }

  const renderTop = () => {
    return (
      <View>
        <View style={styles.ctnTitle}>
          <View style={styles.flex1} />
          <View style={styles.ctnSOS}>
            <Text style={customTxt(Fonts.SemiBold, 18, color040404).txt}>
              {Translate(languageRedux).CHOOSE_SPECIALTY}
            </Text>
          </View>
          <TouchableOpacity style={styles.marginR16} onPress={onPressCancel}>
            <Image source={icHeader.ic_close} style={styles.iconStyleFloat} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const RenderItem = ({item}) => {
    const _onPressItem = () => {
      var selectID = [...selectedItem]
        if (selectID.includes(item)) {
          selectID = selectID.filter((val) => val?.id !== item?.id)
        }
        else {
          selectID.push(item)
        }
      setSelectedItem(selectID)
    }
    return (
      <TouchableOpacity onPress={_onPressItem} style={styles.checkBox}>
        <Icon
          name={selectedItem.includes(item) ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
          size={24}
          color={selectedItem.includes(item) ? color3777EE : colorDDDEE1}
        />
        <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginL8]}>
          {item?.name}
        </Text>
      </TouchableOpacity>
    )
  }

  const checkListChooseItem = () => {
    var list = []
    for (var i = 0; i <= (selectedItem || []).length - 1; i++) {
      var item = {}
      item.id = selectedItem[i]?.id
      list.push(item)
    }
    Promise.all([
      dispatch(saveListSpecialtySelected(list))
    ])
    console.log('selectIdAfter: ', list)
  }

  const renderFlatlist = () => {
    return (
      <View style={styles.ctnList}>
        <FlatList
          data={listSpecialty}
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
        {renderTop()}
        {renderFlatlist()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.bgOpacity}
        onPress={onPressCancel}
      />
      <View style={styles.fullView}>
        <ScrollView>
          {renderBody()}
        </ScrollView>
      </View>
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
  ctnBody: {
    paddingBottom: 48
  },
  ctnList: {
    marginHorizontal: 20
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
  }
})
