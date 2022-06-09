import React, {useEffect} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, NativeModules, Platform } from 'react-native'
import { useSelector } from 'react-redux'

import { color040404, colorE53E3E, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from '../../../../translate'

import icHealthProfile from '../../../../../assets/images/health_profile'

export default function FunctionButton({onPressCancel,
onPressEdit, onPressPrint, onPressShare, onPressDelete, onPressDownLoad
}) {

  const languageRedux = useSelector(state => state.common.language)
  const [h, setH] = React.useState(0)

  useEffect(() => {
    const { StatusBarManager } = NativeModules
    setH(StatusBarManager.HEIGHT)
  }, [])

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.bgOpacity} onPress={onPressCancel} />
      <View style={heighNavi(h).fullView}>
        <View style={styles.ctn}>
          {onPressEdit && <TouchableOpacity onPress={onPressEdit} style={styles.ctnLine}>
            <Image source={icHealthProfile.ic_edit} style={styles.iconStyle} />
            <View style={styles.marginR12} />
            <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
              {Translate(languageRedux).edit}
            </Text>
          </TouchableOpacity>}
          {onPressDownLoad && <TouchableOpacity onPress={onPressDownLoad} style={styles.ctnLine}>
            <Image source={icHealthProfile.ic_download} style={styles.iconStyle} />
            <View style={styles.marginR12} />
            <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
              {Translate(languageRedux).download}
            </Text>
          </TouchableOpacity>}
          <TouchableOpacity onPress={onPressPrint} style={styles.ctnLine}>
            <Image source={icHealthProfile.ic_print} style={styles.iconStyle} />
            <View style={styles.marginR12} />
            <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
              {Translate(languageRedux).print}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressShare} style={onPressDelete ? styles.ctnLine : styles.ctnLine2}>
            <Image source={icHealthProfile.ic_share} style={styles.iconStyle} />
            <View style={styles.marginR12} />
            <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
              {Translate(languageRedux).SHARE}
            </Text>
          </TouchableOpacity>
          {onPressDelete && <TouchableOpacity onPress={onPressDelete} style={styles.ctnLastLine}>
            <Image source={icHealthProfile.ic_delete} style={styles.iconStyle} />
            <View style={styles.marginR12} />
            <Text style={customTxt(Fonts.Regular, 14, colorE53E3E).txt}>
              {Translate(languageRedux).delete}
            </Text>
          </TouchableOpacity>}
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
    marginTop: 100
  },
  ctnLine: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center'
  },
  ctnLine2: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ctnLastLine: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  marginR12: {
    marginRight: 12
  },
  iconStyle: {
    height: 20,
    width: 20
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

const heighNavi = (h) => StyleSheet.create({
  fullView: {
    marginRight: 20,
    marginTop:Platform.OS === 'android' ? 20 + h : 60 + h
  }
})
