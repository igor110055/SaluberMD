import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native'
import { color363636, color3777EE, colorFFFFFF } from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import Translate from '../../../../translate'
import { convertDMMMYYYY } from '../../../../constants/DateHelpers'
// import Routes from 'navigation/Routes'
// import NavigationService from 'navigation'
// import { saveDataPros } from 'actions/common'

import icHealthProfile from '../../../../../assets/images/health_profile'
import Info from '../../../healthProfile/components/Info'
import * as StateLocal from '../../../../state_local'

export default function Prosthesis() {

  const languageRedux = StateLocal.userinfo?.language_id || 'en_US'
  const prosthesis = StateLocal.prothesis || []
  const [show, setShow] = useState(false)
  const lsProsthesisRedux = StateLocal.medicalDataProsthesis || []
  const [lsName, setLSName] = useState([])
  const [load, setLoad] = useState(1)

  useEffect(() => {
    getData()
    setTimeout(() => {
      if (load < prosthesis.length) {
        setLoad(load + 1)
      }
    }, 500)
  }, [load, prosthesis])

  const getData = () => {
    var listName = []
      for (var i = 0; i <= prosthesis.length - 1; i++) {
        var item = {}
        var j = lsProsthesisRedux.filter(
          val => val?.id === prosthesis[i].prosthesisId.toString(),
        )
        if (j.length > 0) {
          var namePros = j[0].name
          var idPros = Number(j[0].id)
        }
        item['id'] = idPros
        item['name'] = namePros
        item['since'] = prosthesis[i].since
        item['note'] = prosthesis[i].remarks
        item['isEmergency'] = prosthesis[i].onEmergencyLogin
        item['itemID'] = prosthesis[i].id
        if (prosthesis[i].prosthesisId === 1) {
          item['other'] = prosthesis[i].other
        }
        listName.push(item)
      }
      setLSName(listName)
      // dispatch(saveDataPros({datas: listName}))
  }

  const RenderItemLong = ({item, index, data}) => {
    const _onPressItemLong = () => {
      // NavigationService.navigate(Routes.NEW_DETAIL_PROSTHESIS_SCREEN, {
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
          {Translate(languageRedux).PROSTHESIS_MEDICAL_AIDS} (
          {prosthesis.length})
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
              <RenderItemLong item={item} index={index} data={prosthesis} />
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
