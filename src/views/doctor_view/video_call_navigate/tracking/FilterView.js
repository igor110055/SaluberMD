import Header from 'components/Header'
import { color040404, color3777EE, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import React from 'react'
import {
  Dimensions, Text, Image,
  StyleSheet, View, TouchableOpacity, ScrollView,
  FlatList
} from 'react-native'
import { useSelector } from 'react-redux'
import Translate from 'translate'
import CustomButtonFillFix from 'views/home_screen/direct_call/component_direct_call/CustomButtonFillFix'
import icHeader from '../../../../../assets/images/header'
import { LsShow, LsEntry } from 'constants/define'
import imgMedicalR from '../../../../../assets/images/medical_record'

export default function FilterView({
  onPressRightNavi,
  valShow, setValShow,
  valEntry, setValEntry
}) {
  const languageRedux = useSelector(state => state.user.language)

  const _onPressItem = (item, type) => {
    if (type === 0) {
      return setValShow(item)
    }
    return setValEntry(item)
  }

  const renderCell = (item, itemSelect, type) => {
    return (
      <TouchableOpacity
        onPress={() => _onPressItem(item, type)}
        style={styles.rowCell}>
        <Image
          source={itemSelect?.name === item?.name ? imgMedicalR.ic_radio_on : imgMedicalR.ic_radio_off}
          style={styles.imgRadio}
        />
        <Text>{item?.name || ''}</Text>
      </TouchableOpacity>
    )
  }

  const lsShowView = (data, itemSelect, type) => {
    return (
      <View style={styles.lsShowView}>
        <Text style={[
          customTxt(Fonts.Bold, 14, color040404).txt,
          styles.txtTtile
        ]}>{data?.name || ''}</Text>
        <FlatList
          data={data?.data || []}
          key={'#1lsShowView'}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) =>
            renderCell(
              item,
              itemSelect,
              type
            )
          }
        />
      </View>
    )
  }

  const _onPressReset = () => {
    setValShow(LsShow(languageRedux).data[0])
    setValEntry(LsEntry(languageRedux).data[0])
  }

  return (
    <View style={styles.container}>
      <Header
        textCenter={Translate(languageRedux).filter}
        iconRight={icHeader.ic_close}
        onPressRight={onPressRightNavi}
      />
      <View style={styles.centerView}>
        <ScrollView>
          {lsShowView(LsShow(languageRedux), valShow, 0)}
        </ScrollView>
      </View>
      <View style={styles.bottomView}>
        <CustomButtonFillFix
          title={Translate(languageRedux).RESET_ALL_FILTERS}
          btStyle={styles.btStyle}
          txtStyle={customTxt(Fonts.Bold, 18, color3777EE).txt}
          onPress={_onPressReset}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    top: 0,
    left: 0,
    backgroundColor: colorFFFFFF
  },
  centerView: {
    flex: 1
  },
  bottomView: {
    padding: 20
  },
  btStyle: {
    backgroundColor: colorFFFFFF
  },
  lsShowView: {
    margin: 20
  },
  txtTtile: {
    marginBottom: 12
  },
  rowCell: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center'
  },
  imgRadio: {
    width: 24,
    height: 24,
    marginRight: 16
  }
})
