import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native'
import { color363636, color3777EE, colorFFFFFF } from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import Translate from '../../../../translate'
import { convertDMMMYYYY } from '../../../../constants/DateHelpers'
// import Routes from 'navigation/Routes'
// import NavigationService from 'navigation'
// import { saveDataHosSur } from 'actions/common'
import icHealthProfile from '../../../../../assets/images/health_profile'
import Info from '../../../healthProfile/components/Info'
import * as StateLocal from '../../../../state_local'

export default function Hospitalization() {

  const languageRedux = StateLocal.userinfo?.language_id || 'en_US'
  const hospitalization = StateLocal.hospitalization || []
  const lsCountryRedux = StateLocal.lsCountry || []
  const [show, setShow] = useState(false)
  const lsHospitalRedux = StateLocal.medicalDataHospitalization || []
  const lsSubSurgeryRedux = StateLocal.medicalDataSubInterventi || []
  const lsSurgeryRedux = StateLocal.medicalDataSurgery || []
  const [lsName, setLSName] = useState([])
  const [load, setLoad] = useState(1)

  useEffect(() => {
    getData()
    setTimeout(() => {
      if (load < 10) {
        setLoad(load + 1)
      }
    }, 500)
  }, [load, hospitalization])

  const getData = () => {
    var listName = []
      for (var i = 0; i <= hospitalization.length - 1; i++) {
        var item = {}
        if (hospitalization[i].type === 1) {
          var j = lsHospitalRedux.filter(
            val => val?.id === hospitalization[i].hospitalizationId.toString(),
          )
          if (j.length > 0) {
            var nameHos = j[0].name
            var idHos = Number(j[0].id)
          }
          var countryName = lsCountryRedux.filter((val) => val.value === hospitalization[i].country || '')
          if (countryName.length > 0) {
            var country = countryName[0].text || ''
          }
          item['id'] = idHos
          item['name'] = nameHos
          item['since'] = hospitalization[i].hospDate
          item['type'] = 1
          item['note'] = hospitalization[i].remarks
          item['isEmergency'] = hospitalization[i].onEmergencyLogin
          item['country'] = country
          item['hospital'] = hospitalization[i].hospital
          item['itemID'] = hospitalization[i].id
          item['surgerySubCategoryId'] = hospitalization[i].surgerySubCategoryId
          if (hospitalization[i].hospitalizationId === 1 || 47 || 48) {
            item['other'] = hospitalization[i].other
          }
          listName.push(item)
        }
        if (hospitalization[i].type === 0) {
          var j = lsSubSurgeryRedux.filter(
            val => val?.id === hospitalization[i].surgerySubCategoryId.toString(),
          )
          var countryName = lsCountryRedux.filter((val) => val.value === hospitalization[i].country || '')
          if (countryName.length > 0) {
            var country = countryName[0].text || ''
          }
          if (j.length > 0) {
            var nameSub = j[0].name
            var idSur = Number(j[0].idOpt)
            var idSub = Number(j[0].id)
            var idSurgery = idSur.toString() || ''
          }
          var surgeryCate = lsSurgeryRedux.filter((val) => val.id === idSurgery)
          if ((surgeryCate || []).length > 0) {
            var name = surgeryCate[0].name || ''
          }
          item['idSubSurgery'] = idSub
          item['name'] = nameSub
          item['surgeryCategory'] = name
          item['idSurgeryCategory'] = idSur
          item['since'] = hospitalization[i].hospDate
          item['type'] = 0
          item['note'] = hospitalization[i].remarks
          item['isEmergency'] = hospitalization[i].onEmergencyLogin
          item['country'] = country
          item['hospital'] = hospitalization[i].hospital
          item['itemID'] = hospitalization[i].id
          item['hospitalizationId'] = hospitalization[i].hospitalizationId
          listName.push(item)
        }
      }
      setLSName(listName)
      // dispatch(saveDataHosSur({datas: listName}))
  }

  const RenderItemLong = ({item, index, data}) => {
    const _onPressItemLong = () => {
      // NavigationService.navigate(Routes.NEW_DETAIL_HOSPITALIZATION_SCREEN, {
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
    const getSince = item?.since ? Translate(languageRedux).date + ' ' + convertDMMMYYYY(item?.since) : ''
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
          {Translate(languageRedux).hospitalization + ' & ' + Translate(languageRedux).surgery} (
          {hospitalization.length})
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
              <RenderItemLong item={item} index={index} data={hospitalization} />
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
