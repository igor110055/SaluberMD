import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image, DeviceEventEmitter} from 'react-native'
import { useSelector } from 'react-redux'
import {
  color040404,
  color3777EE,
  color5C5D5E,
  colorF0F0F0,
  colorFFFFFF
} from '../../../../constants/colors'
import {customTxt} from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import Translate from '../../../../translate'
import icHome from '../../../../../assets/images/home_screen'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'

export default function MagazineWidget({
  title, description, base64, category, data
}) {
  const languageRedux = useSelector(state => state.common.language)
  const _onPressSeeAll = () => {
    setTimeout(() => {
      DeviceEventEmitter.emit(Routes.MAGAZINE_SCREEN, { magazine: true })
    }, 200)
    NavigationService.navigate(Routes.MAGAZINE_SCREEN)
  }
  const _onPressView = () => {
    NavigationService.navigate(Routes.DETAIL_MAGAZINE_SCREEN, {
      data: data
    })
  }
  return (
    <View style={styles.container}>
      <View style={styles.containerBox}>
        <View style={styles.ctnCategory}>
          <View style={styles.marginL16}>
            <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
              {Translate(languageRedux).LASTEST_ARTICLE}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={_onPressView} style={styles.ctnCover}>
            <Image source={base64 ? {uri: `data:image;base64,${base64}`} : icHome.ic_article} style={styles.coverStyle}/>
        </TouchableOpacity>
        <Text style={[customTxt(Fonts.SemiBold, 12, color3777EE).txt, styles.ctnType]}>{category}</Text>
        <TouchableOpacity onPress={_onPressView} style={styles.ctnTitle}>
            <Text style={customTxt(Fonts.Bold, 14, color040404).txt}>{title}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_onPressView} style={styles.ctnContent}>
          <Text
          numberOfLines={3}
            style={[
              customTxt(Fonts.Regular, 14, color5C5D5E).txt,
              styles.styleContent
            ]}>
            {description}
          </Text>
        </TouchableOpacity>
        <View style={styles.button}>
          <View style={styles.ctnButtonLayout}>
            <TouchableOpacity onPress={_onPressSeeAll} style={[styles.ctnButton]}>
              <Text style={customTxt(Fonts.Bold, 14, color3777EE).txt}>
                {Translate(languageRedux).SEE_ALL_ARTICLES}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 16
  },
  containerBox: {
    flex: 1,
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9
  },
  ctnCategory: {
    height: 48,
    justifyContent:'center',
    borderBottomWidth: 1,
    borderBottomColor: colorF0F0F0
  },
  marginL16: {
    marginLeft: 16
  },
  ctnContent: {
    marginTop: 8,
    marginHorizontal: 16
  },
  ctnButton: {
    height: 40,
    width: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: color3777EE
  },
  ctnButtonLayout: {
    marginHorizontal: 16,
    alignItems: 'center'
  },
  ctnButton2: {
    height: 40,
    width: 174,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: color3777EE
  },
  button: {
    marginTop: 16,
    marginBottom: 16
  },
  ctnCover: {
    marginTop: 16,
    marginHorizontal: 16
  },
  coverStyle: {
    height: 164,
    width: '100%',
    borderRadius: 12
  },
  ctnTitle: {
    marginTop: 8,
    marginHorizontal: 16
  },
  ctnType: {
    marginLeft: 16,
    marginTop: 16
  }
})
