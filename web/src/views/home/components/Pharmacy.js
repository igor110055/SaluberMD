import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native'
import { colorFFFFFF, colorF0F0F0, color040404, colorDDDEE1, color363636, color5C5D5E, color3777EE } from '../../../constants/colors'
import Fonts from '../../../constants/Fonts'
import { customTxt } from '../../../constants/css'
import Translate from '../../../translate'
import icPharma from '../../../../assets/images/home_screen'
import * as StateLocal from '../../../state_local'

export default function Pharmacy() {

  const lsPharmacyRedux = StateLocal?.pharmacys || []

  useEffect(() => {
  }, [lsPharmacyRedux])

  const RenderItem = ({ item, index }) => {
    const _onPressMap = () => {
      // var latitude = item?.lat
      // var longitude = item?.lon
      // var url = `https://www.google.com/maps/place/${latitude},${longitude}`
    }
    const _onPressName = () => {
      // NavigationService.navigate(Routes.MAP_VIEW, {
      //   data: item,
      //   index: index
      // })
    }
    return (
      <View>
        {/* BOX PHARMACY */}
        <View style={styles.ctnBoxPharma}>
          <TouchableOpacity onPress={_onPressName}>
            {/* NAME PHARMACY */}
            <View style={styles.ctnNamePharma}>
              <Text style={customTxt(Fonts.SemiBold, 14, color363636).txt}>
                {item?.name}
              </Text>
            </View>
            {/* ADDRESS */}
            <View style={styles.ctnDes}>
              <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
                {item?.address}
              </Text>
            </View>
            {/* CITY */}
            <View style={styles.ctnDes}>
              <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
                {item?.e_city}
              </Text>
            </View>
            {/* ZIP CODE */}
            {item?.e_zip_full && <View style={styles.ctnDes}>
              <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
                {item?.e_zip_full}
              </Text>
            </View>}
          </TouchableOpacity>
          <View style={styles.divider} />
          {/* TIME OPEN */}
          <TouchableOpacity onPress={_onPressMap} style={styles.ctnOpenTime}>
            {/* <Icon name={'map-pin'} size={24} color={color040404} /> */}
            <View style={styles.betweenDistance} />
            <Text style={customTxt(Fonts.Regular, 14, color363636).txt}>
              {Translate().DIRECT_MAP}
            </Text>
          </TouchableOpacity>
          {/* PHONE */}
          {item?.biz_phone && <TouchableOpacity onPress={() => { }} style={styles.ctnPhone}>
            <Image source={icPharma.ic_phone} style={styles.iconStyle} />
            <View style={styles.betweenDistance} />
            <Text style={customTxt(Fonts.Regular, 14, color363636).txt}>
              {item?.biz_phone}
            </Text>
          </TouchableOpacity>}
        </View>
      </View>
    )
  }

  const renderFlatlist = () => {
    return (
      <View>
        <FlatList
          data={lsPharmacyRedux}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderCategory = () => {
    return (
      <View style={styles.ctnCategory}>
        <View style={styles.marginL16}>
          <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
            {Translate().favourite_pharmacy}
          </Text>
        </View>
      </View>
    )
  }

  const renderButtonAdd = () => {
    return (
      <View>
        <View style={styles.button}>
          <View style={styles.ctnButtonLayout}>
            <TouchableOpacity onPress={() => {
              // NavigationService.navigate(Routes.PHARMACIES_SCREEN)
            }} style={[styles.ctnButton]}>
              <Text style={customTxt(Fonts.Bold, 14, color3777EE).txt}>
                {Translate().addpharmacy}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View>
        {renderCategory()}
        {renderFlatlist()}
        {renderButtonAdd()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerBox}>
        {renderBody()}
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
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colorF0F0F0
  },
  marginL16: {
    marginLeft: 16
  },
  ctnBoxPharma: {
    marginLeft: 16,
    marginRight: 16,
    flex: 1,
    marginTop: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colorDDDEE1
  },
  ctnNamePharma: {
    marginTop: 16,
    marginLeft: 16,
    marginBottom: 4
  },
  ctnOpenTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginLeft: 16,
    marginBottom: 16
  },
  ctnPhone: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginLeft: 16
  },
  ctnFindPharma: {
    alignItems: 'flex-end',
    marginVertical: 16,
    marginRight: 16
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  betweenDistance: {
    width: 10
  },
  ctnDes: {
    marginLeft: 16
  },
  divider: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: colorF0F0F0
  },
  button: {
    marginTop: 16,
    marginBottom: 16
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
  }
})
