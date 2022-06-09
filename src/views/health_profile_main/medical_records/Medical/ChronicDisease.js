import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native'
import { useSelector } from 'react-redux'

import { color363636, color3777EE, colorFFFFFF } from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import Translate from '../../../../translate'
import { convertDMMMYYYY } from '../../../../constants/DateHelpers'
import Routes from 'navigation/Routes'
import NavigationService from 'navigation'

import icHealthProfile from '../../../../../assets/images/health_profile'

import Info from '../../../healthProfile/components/Info'

export default function ChronicDisease({dataList}) {
  const languageRedux = useSelector(state => state.common.language)
  const [showChronic, setShowChronic] = useState(false)

  const RenderItemLong = ({item, index, data}) => {
    const _onPressItemLong = () => {
      NavigationService.navigate(Routes.NEW_DETAIL_DISEASE_SCREEN, {
        data: item
      })
    }
    const checkName = () => {
      if (item.diseaseId === '1') {
        return item?.other
      } else {
        return item?.disease
      }
    }
    const getSince = item.startDate ? Translate(languageRedux).since + ' ' + convertDMMMYYYY(item.startDate) : ''
    return (
      <View>
        <Info
          title={checkName()}
          subTitle={getSince}
          titleColor={color363636}
          subTitleColor={color3777EE}
          borderBottomLeftRadius={(index === (data || []).length - 1) ? 16 : 0}
          borderBottomRightRadius={(index === (data || []).length - 1) ? 16 : 0}
          onPress={_onPressItemLong}
        />
      </View>
    )
  }

  const txtBorder = {
    borderBottomLeftRadius: showChronic ? 0 : 16,
    borderBottomRightRadius: showChronic ? 0 : 16
  }

  return (
    <View>
      <TouchableOpacity
      onPress={() => {
        showChronic === false && setShowChronic(true)
        showChronic === true && setShowChronic(false)
      }}
      style={[styles.ctnCategory, txtBorder]}>
        <Text
          style={[
            customTxt(Fonts.SemiBold, 18, colorFFFFFF).txt,
            styles.marginL16
          ]}>
          {Translate(languageRedux).CHRONIC_DISEASE} (
          {dataList.length})
        </Text>
        <View>
          <Image
            source={
              showChronic
                ? icHealthProfile.ic_up_white
                : icHealthProfile.ic_down_white
            }
            style={[styles.iconStyle, styles.marginR16]}
          />
        </View>
      </TouchableOpacity>
      {showChronic === true && (
        <View style={styles.shadow}>
          <FlatList
            data={dataList || []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <RenderItemLong item={item} index={index} data={dataList} />
            )}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  ctnCategory: {
    height: 56,
    backgroundColor: color3777EE,
    marginHorizontal: 20,
    marginBottom: 0,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9,
    borderRadius: 16
  },
  marginL16: {
    marginLeft: 16,
    flex: 1
  },
  marginR16: {
    marginRight: 16
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  flexRow: {
    flexDirection: 'row'
  },
  viewName: {
    backgroundColor: colorFFFFFF,
    marginHorizontal: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9
  },
  nameStyle: {
    marginVertical: 24,
    marginHorizontal: 16
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9
  },
  flex1: {
    flex: 1
  }
})
