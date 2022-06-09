import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Translate from '../../../translate'
import { color040404, colorFFFFFF } from '../../../constants/colors'
import { customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'

export default function SortDropdown({
  onPressCancel, onPressLastUpdate,
  onPressName, onPressReportDate
}) {

  const languageRedux = ''//useSelector(state => state.common.language)

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.bgOpacity} onPress={onPressCancel} />
      <View style={styles.floatView}>
        <View style={styles.ctn}>
          <TouchableOpacity onPress={onPressLastUpdate} style={styles.ctnLine}>
            <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
              {Translate(languageRedux).LAST_UPLOAD}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressName} style={styles.ctnLastLine}>
            <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
              {Translate(languageRedux).name}
            </Text>
          </TouchableOpacity>
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
    marginRight: 20,
    marginTop: 110
  },
  ctnLine: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center'
  },
  ctnLastLine: {
    flexDirection: 'row',
    alignItems: 'center'
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
    elevation: 9
  }
})
