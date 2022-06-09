import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native'
import { color363636, color3777EE, colorFFFFFF } from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import Translate from '../../../../translate'
// import Routes from 'navigation/Routes'
// import NavigationService from 'navigation'
// import { saveDataDepen } from 'actions/common'
import icHealthProfile from '../../../../../assets/images/health_profile'
import Info from '../../../healthProfile/components/Info'
import * as StateLocal from '../../../../state_local'

export default function Dependency() {

  const languageRedux = StateLocal.userinfo?.language_id || 'en_US'
  const dependencies = StateLocal.dependency || []
  const [show, setShow] = useState(false)
  const lsDepenRedux = StateLocal.medicalDataDependencies || []
  const [lsName, setLSName] = useState([])
  const [load, setLoad] = useState(1)

  useEffect(() => {
    getData()
    setTimeout(() => {
      if (load < dependencies.length) {
        setLoad(load + 1)
      }
    }, 500)
  }, [load, dependencies])

  const getData = () => {
    var listName = []
      for (var i = 0; i <= dependencies.length - 1; i++) {
        var item = {}
        var j = lsDepenRedux.filter(
          val => val?.id === dependencies[i].dependencyId.toString(),
        )
        if (j.length > 0) {
          var nameDepen = j[0].name
          var idDepen = Number(j[0].id)
        }
        const checkWeanned = () => {
          if (dependencies[i].weaned_off === 0) {
            return 'No'
          }
          if (dependencies[i].weaned_off === 1) {
            return 'Yes'
          }
        }
        item['id'] = idDepen
        item['name'] = nameDepen
        item['since'] = dependencies[i].since
        item['dependency'] = dependencies[i].dependency
        item['note'] = dependencies[i].remarks
        item['isEmergency'] = dependencies[i].onEmergencyLogin
        item['yearStarted'] = dependencies[i].yearStarted
        item['weaned'] = checkWeanned()
        item['dailyUse'] = dependencies[i].daily_use
        item['itemID'] = dependencies[i].id
        if (dependencies[i].dependencyId === 1) {
          item['other'] = dependencies[i].other
        }
        listName.push(item)
      }
      setLSName(listName)
      // dispatch(saveDataDepen({datas: listName}))
  }

  const RenderItemLong = ({item, index, data}) => {
    const _onPressItemLong = () => {
      // NavigationService.navigate(Routes.NEW_DETAIL_DEPENDENCY_SCREEN, {
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
    const getSince = item?.yearStarted ? Translate(languageRedux).since + ' ' + item?.yearStarted : ''
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
    borderBottomLeftRadius: show ? 0 : 16,
    borderBottomRightRadius: show ? 0 : 16
  }

  return (
    <View>
      <TouchableOpacity
      onPress={() => {
        show === false && setShow(true)
        show === true && setShow(false)
      }}
      style={[styles.ctnCategory, txtBorder]}>
        <Text
          style={[
            customTxt(Fonts.SemiBold, 18, colorFFFFFF).txt,
            styles.marginL16
          ]}>
          {Translate(languageRedux).dependencies} (
          {dependencies.length})
        </Text>
        <View>
          <Image
            source={
                show
                ? icHealthProfile.ic_up_white
                : icHealthProfile.ic_down_white
            }
            style={[styles.iconStyle, styles.marginR16]}
          />
        </View>
      </TouchableOpacity>
      {show === true && (
        <View style={styles.shadow}>
          <FlatList
            data={lsName}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <RenderItemLong item={item} index={index} data={dependencies} />
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
