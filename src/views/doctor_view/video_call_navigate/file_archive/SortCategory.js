import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native'

import { color040404, color3777EE, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'

export default function SortCategory({onPressCancel, listCategory,
    setValueItem, valueItem, onPressChoose, onPressAllFiles}) {

  const RenderItem = ({item}) => {
    const isActiveDoctor = () => {
        return item?.name === valueItem
    }
    const colorText = {color: isActiveDoctor() ? color3777EE : color040404}
    return (
      <TouchableOpacity onPress={() => {
        setValueItem(item?.name)
        onPressChoose()
        onPressCancel()
      }} style={styles.ctnLine}>
        <Text style={[customTxt(Fonts.Regular, 16).txt, colorText]}>
          {item?.name}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.bgOpacity} onPress={onPressCancel} />
      <View style={styles.floatView}>
        <View style={styles.ctn}>
          <TouchableOpacity onPress={onPressAllFiles} style={styles.ctnLine}>
            <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
              All Files
            </Text>
          </TouchableOpacity>
          <FlatList
            data={listCategory}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <RenderItem item={item} />
            )}
          />
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
    alignItems: 'flex-start'
  },
  bgOpacity: {
    width: '100%',
    height: '100%',
    flex: 1,
    position: 'absolute'
  },
  floatView: {
    marginLeft: 20,
    marginTop: 75
  },
  ctn: {
    backgroundColor: colorFFFFFF,
    shadowColor: '#000',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 40,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 9
  },
  ctnLine: {
    marginBottom: 16,
    alignItems: 'center'
  }
})
