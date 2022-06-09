import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native'
import { color363636, color3777EE, colorFFFFFF } from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import Translate from '../../../../translate'
import { convertDMMMYYYY } from '../../../../constants/DateHelpers'
// import Routes from 'navigation/Routes'
// import NavigationService from 'navigation'
// import { saveDataMedi } from 'actions/common'
import icHealthProfile from '../../../../../assets/images/health_profile'
import Info from '../../../healthProfile/components/Info'
import * as StateLocal from '../../../../state_local'

export default function Medication() {

  const languageRedux = StateLocal.userinfo?.language_id || 'en_US'
  const medications = StateLocal.medications || []
  const [show, setShow] = useState(false)
  const lsMediRedux = StateLocal.medicalDataMedicine || []
  const [lsName, setLSName] = useState([])
  const [load, setLoad] = useState(1)
  const lsMediFormRedux =  StateLocal.medicalMediForm || []

  useEffect(() => {
    getData()
    setTimeout(() => {
      if (load < 10) {
        setLoad(load + 1)
      }
    }, 500)
  }, [load, medications])

  const getData = () => {
    var listName = []
      for (var i = 0; i <= medications.length - 1; i++) {
        var item = {}
        var j = lsMediRedux.filter(
          val => val?.id === medications[i].medicineId,
        )
        var k = lsMediFormRedux.filter(
          val => val?.id === medications[i].medicationId
        )
        if (j.length > 0) {
          var nameMedi = j[0].name
          var idMedi = j[0].id
        }
        if (k.length > 0) {
          var nameMediForm = k[0].name
          var idMediForm = k[0].id
        }
        item['id'] = idMedi
        item['name'] = nameMedi
        item['since'] = medications[i].since
        item['genericName'] = medications[i].genericName
        item['note'] = medications[i].remarks
        item['isEmergency'] = medications[i].onEmergencyLogin
        item['medicationForm'] = nameMediForm
        item['idMediForm'] = idMediForm
        item['dosage'] = medications[i].dosage
        item['itemID'] = medications[i].id
        if (medications[i].medicineId === 1) {
          item['other'] = medications[i].other
        }
        listName.push(item)
      }
      setLSName(listName)
      // dispatch(saveDataMedi({datas: listName}))
  }

  const RenderItemLong = ({item, index, data}) => {
    const _onPressItemLong = () => {
      // NavigationService.navigate(Routes.NEW_DETAIL_MEDICATION_SCREEN, {
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
          {Translate(languageRedux).farmaci} ({medications.length})
        </Text>
        <View>
          <Image
            source={
              show ? icHealthProfile.ic_up_white : icHealthProfile.ic_down_white
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
              <RenderItemLong item={item} index={index} data={medications} />
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
  },
  flex1: {
    flex: 1
  }
})
