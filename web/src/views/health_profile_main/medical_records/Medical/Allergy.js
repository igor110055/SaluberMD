import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native'
import { color363636, color3777EE, colorFFFFFF } from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import Translate from '../../../../translate'
import { convertDMMMYYYY } from '../../../../constants/DateHelpers'
import Routes from '../../../../routes/Routes'
import NavigationService from '../../../../routes'
import icHealthProfile from '../../../../../assets/images/health_profile'
import Info from '../../../healthProfile/components/Info'
import * as StateLocal from '../../../../state_local'

export default function Allergy() {

  const languageRedux = StateLocal.userinfo?.language_id || 'en_US'
  const allergies = StateLocal.allergies || []
  const [showAllergy, setShowAllgery] = useState(false)
  const lsAllergiRedux = StateLocal.medicalDataAllergies || []
  const [lsName, setLSName] = useState([])
  const [load, setLoad] = useState(1)

  useEffect(() => {
    console.log('allergies: ', allergies)
    getData()
    setTimeout(() => {
      if (load < 6) {
        setLoad(load + 1)
      }
    }, 500)
  }, [load, allergies])

  const getData = () => {
    var listName = []
      for (var i = 0; i <= allergies.length - 1; i++) {
        var item = {}
        var j = lsAllergiRedux.filter(
          val => val?.id === allergies[i].allergyId.toString(),
        )
        if (j.length > 0) {
          var nameAllery = j[0].name
          var idAllery = Number(j[0].id)
        }
        item['id'] = idAllery
        item['name'] = nameAllery
        item['since'] = allergies[i].since
        item['genericName'] = allergies[i].genericName
        item['note'] = allergies[i].remarks
        item['isEmergency'] = allergies[i].onEmergencyLogin
        item['itemID'] = allergies[i].id
        if (allergies[i].allergyId === 1) {
          item['other'] = allergies[i].other
        }
        listName.push(item)
      }
      setLSName(listName)
      // dispatch(saveDataAllergy({datas: listName}))
  }

  const RenderItemLong = ({item, index, data}) => {
    const _onPressItemLong = () => {
      // NavigationService.navigate(Routes.NEW_DETAIL_ALLERGY_SCREEN, {
      //   data: item,
      //   index: index
      // })
    }
    const checkName = () => {
      if (item.id === 1) {
        return item?.other
      } else {
        return item?.name
      }
    }
    const getSince = item?.since ? Translate(languageRedux).since + ' ' + convertDMMMYYYY(item?.since) : ''
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
    borderBottomLeftRadius: showAllergy ? 0 : 16,
    borderBottomRightRadius: showAllergy ? 0 : 16
  }

  return (
    <View>
      <TouchableOpacity
      onPress={() => {
        showAllergy === false && setShowAllgery(true)
        showAllergy === true && setShowAllgery(false)
      }}
      style={[styles.ctnCategory, txtBorder]}>
        <Text
          style={[
            customTxt(Fonts.SemiBold, 18, colorFFFFFF).txt,
            styles.marginL16
          ]}>
          {Translate(languageRedux).patientAllergy} (
          {allergies.length})
        </Text>
        <View>
          <Image
            source={
                showAllergy
                ? icHealthProfile.ic_up_white
                : icHealthProfile.ic_down_white
            }
            style={[styles.iconStyle, styles.marginR16]}
          />
        </View>
      </TouchableOpacity>
      {showAllergy === true && (
        <View style={styles.shadow}>
          <FlatList
            data={lsName}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <RenderItemLong item={item} index={index} data={allergies} />
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
    elevation: 9,
    height: 70
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
  }
})
