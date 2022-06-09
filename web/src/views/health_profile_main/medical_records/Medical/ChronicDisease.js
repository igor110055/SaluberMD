import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native'
import { color363636, color3777EE, colorFFFFFF } from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import Translate from '../../../../translate'
import { convertDMMMYYYY } from '../../../../constants/DateHelpers'
// import Routes from 'navigation/Routes'
// import NavigationService from 'navigation'

import icHealthProfile from '../../../../../assets/images/health_profile'
import Info from '../../../healthProfile/components/Info'
import * as StateLocal from '../../../../state_local'

export default function ChronicDisease() {

  const languageRedux = StateLocal.userinfo?.language_id || 'en_US'
  const chronic_disease = StateLocal.chronic_disease || []
  const [showChronic, setShowChronic] = useState(false)
  const [lsName, setLSName] = useState([])
  const [load, setLoad] = useState(1)
  const lsComplicationRedux = StateLocal.complication || []

  useEffect(() => {
    getData()
    setTimeout(() => {
      if (load < chronic_disease.length) {
        setLoad(load + 1)
      }
    }, 500)
  }, [load, chronic_disease])

  const getData = () => {
    var listName = []
      for (var i = 0; i <= chronic_disease.length - 1; i++) {
        var item = {}
        var j = lsComplicationRedux.filter(
          val => val?.id === chronic_disease[i].complicationId,
        )
        if (j.length > 0) {
          var complicationName = j[0].name
          var complicationID = j[0].id
        }
        item['id'] = chronic_disease[i].diseaseId
        item['name'] = chronic_disease[i].name
        item['since'] = chronic_disease[i].startDate
        item['note'] = chronic_disease[i].remarks
        item['isEmergency'] = chronic_disease[i].onEmergencyLogin
        item['complication'] = complicationName
        item['complicationID'] = complicationID
        item['itemID'] = chronic_disease[i].id
        item['isIcd10'] = chronic_disease[i].isIcd10
        if (chronic_disease[i].diseaseId === '1') {
          item['other'] = chronic_disease[i].other
        }
        listName.push(item)
      }
      if (listName.length > 0) {
        setLSName(listName)
      }
  }

  const RenderItemLong = ({item, index, data}) => {
    const _onPressItemLong = () => {
      // NavigationService.navigate(Routes.NEW_DETAIL_DISEASE_SCREEN, {
      //   data: item,
      //   index: index
      // })
    }
    const checkName = () => {
      if (item.id === '1') {
        return item?.other
      } else {
        return item?.name
      }
    }
    const getSince = item.since ? Translate(languageRedux).since + ' ' + convertDMMMYYYY(item.since) : ''
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
          {chronic_disease.length})
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
            data={lsName}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <RenderItemLong item={item} index={index} data={chronic_disease} />
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
