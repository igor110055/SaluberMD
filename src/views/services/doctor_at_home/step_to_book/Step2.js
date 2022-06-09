import React, {useState} from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, FlatList } from 'react-native'

import { useSelector } from 'react-redux'
import _, { cloneDeep } from 'lodash'

import { color040404, color333333, color3777EE, color5C5D5E, colorA7A8A9, colorDDDEE1, colorF8F8F8, colorFFFFFF } from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import Translate from '../../../../translate'

import icDoc from '../../../../../assets/images/document'
import icHealth from '../../../../../assets/images/health_profile'
import icNA from '../../../../../assets/images/new_appointment'

import DialogView from '../../../../components/DialogView'

export default function Step2({valueSpeciality,
setValueSpeciality}) {
    const languageRedux = useSelector(state => state.common.language)

    const dataAssistance = [
        {
            id: 1,
            name: Translate(languageRedux).doctorAtHomeQuestion2Answer1
        },
        {
            id: 2,
            name: Translate(languageRedux).doctorAtHomeQuestion2Answer2
        },
        {
            id: 3,
            name: Translate(languageRedux).doctorAtHomeQuestion2Answer3
        }
    ]

    const renderFlatlistSpecial = () => {
      const RenderItem = ({item, index}) => {

        const isActiveDoctor = () => {
          return item?.id === valueSpeciality?.id
        }

        const colorText = {color: isActiveDoctor() ? colorFFFFFF : colorA7A8A9}

        return (
          <View style={styles.layoutSpecialBox}>
            <TouchableOpacity onPress={() => {
              setValueSpeciality(item)
              console.log('type: ', item)
            }}
            style={isActiveDoctor() ? styles.ctnSpecialBox2 : styles.ctnSpecialBox}>
              <View style={styles.specialName}>
                <Text style={[customTxt(Fonts.SemiBold, 16).txt, colorText]}>
                  {item?.name}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )
      }
      return (
        <View style={styles.flatList}>
          <FlatList
            data={dataAssistance}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <RenderItem item={item} index={index} />
            )}
          />
        </View>
      )
    }

  return (
    <View>
      <View style={styles.containerBox}>
        <View style={styles.title}>
          <Text style={customTxt(Fonts.SemiBold, 16, color333333).txt}>
          {Translate(languageRedux).doctorAtHomeQuestion2}
          </Text>
        </View>
        {/* {renderSearchTextInput()} */}
        {renderFlatlistSpecial()}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  containerBox: {
    flex: 1,
    backgroundColor: colorFFFFFF,
    marginHorizontal: 20
  },
  marginHori16: {
    marginHorizontal: 16
  },
  title: {
    // marginTop: 16,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  marginR16: {
    marginRight: 16
  },
  searchInput: {
    height: 48,
    width: '100%',
    borderRadius: 12,
    backgroundColor: colorFFFFFF,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    flexDirection: 'row'
  },
  searchIcon: {
    paddingVertical: 16,
    marginLeft: 16
  },
  clearIcon: {
    paddingVertical: 16,
    marginLeft: -80
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  textInput: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 12
  },
  ctnSpecialBox: {
    height: 48,
    width: '100%',
    backgroundColor: colorF8F8F8,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ctnSpecialBox2: {
    alignItems: 'center',
    height: 56,
    width: '100%',
    backgroundColor: color3777EE,
    borderRadius: 12,
    justifyContent: 'center'
  },
  layoutSpecialBox: {
    marginHorizontal: 16,
    marginBottom: 8
  },
  flatList: {
    marginTop: 16
  }
})
