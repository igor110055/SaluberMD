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
import { listSpeciality } from '../../../../state_local'
// import DialogView from '../../../../components/DialogView'

export default function ChooseSpeciality({onPressNext, valueSpeciality,
setValueSpeciality}) {

    const listSpecialRedux = listSpeciality || []
    const [txtSearch, setSearch] = useState()
    const [lsSearch, setLSSearch] = useState(cloneDeep(listSpecialRedux))
    const [isDialog, setDialog] = useState(false)
    const [showClear, setShowClear] = useState(false)
    const languageRedux = ''//useSelector(state => state.common.language)

    const sortData = (newDatas) => {
      const newSort = newDatas.sort(function (a, b) {
        var dateA = ''
        var dateB = ''
        dateA = (a.name || '').toLowerCase()
        dateB = (b.name || '').toLowerCase()
        return dateB - dateA
      })
      return newSort
    }

    const _onPressSearch = (txt) => {
      setSearch(txt)
      setShowClear(true)
      if (_.isEmpty(txt)) {
        const cloneDB = cloneDeep(listSpecialRedux)
        const sortNewData = sortData(cloneDeep(cloneDB))
        setLSSearch(sortNewData)
        setShowClear(false)
        return
      }

      var data = []
      const cloneDB = cloneDeep(listSpecialRedux)
      _.forEach(cloneDB, val => {
          if (_.includes((val?.name || '').toLowerCase(), (txt || '-').toLowerCase())) {
            data.push(val)
          }
      })
      const sortNewData = sortData(cloneDeep(data))
      setLSSearch(sortNewData)
    }

    const renderSearchTextInput = () => {
      return (
        <View style={styles.marginHori16}>
          <View style={styles.searchInput}>
            <View style={styles.searchIcon}>
              <Image source={icDoc.ic_search} style={styles.iconStyle} />
            </View>
            <TextInput
              style={[
                customTxt(Fonts.Regular, 16, color040404).txt,
                styles.textInput
              ]}
              placeholder={'e.g: General pratictioner'}
              placeholderTextColor={colorA7A8A9}
              value={txtSearch}
              onChangeText={_onPressSearch}
              autoCapitalize={'none'}
            />
            {showClear === true && <TouchableOpacity onPress={_onPressClear} style={styles.clearIcon}>
              <Image source={icNA.ic_clear} style={styles.iconStyle} />
            </TouchableOpacity>}
          </View>
        </View>
      )
    }

    const _onPressClear = () => {
      setSearch('')
      setLSSearch(listSpecialRedux)
      setShowClear(false)
    }

    const renderFlatlistSpecial = () => {
      const RenderItem = ({item, index}) => {

        const isActiveDoctor = () => {
          return item === valueSpeciality
        }

        const colorText = {color: isActiveDoctor() ? colorFFFFFF : color333333}

        return (
          <View style={styles.layoutSpecialBox}>
            <TouchableOpacity onPress={() => {
              setValueSpeciality(item)
              onPressNext()
            }}
            style={isActiveDoctor() ? styles.ctnSpecialBox2 : styles.ctnSpecialBox}>
              <View style={styles.specialName}>
                <Text style={[customTxt(Fonts.Regular, 16).txt, colorText]}>
                  {item?.name}
                </Text>
              </View>
              <View style={styles.marginR16}>
                <Image source={isActiveDoctor() ? icHealth.ic_right_white : icHealth.ic_right} style={styles.iconStyle} />
              </View>
            </TouchableOpacity>
          </View>
        )
      }
      return (
        <View style={styles.flatList}>
          <FlatList
            data={lsSearch}
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
          <Text style={customTxt(Fonts.SemiBold, 18, color333333).txt}>
          {Translate(languageRedux).choosespeciality}
          </Text>
          <TouchableOpacity onPress={() => {setDialog(true)}}>
            <Image source={icNA.ic_info} style={styles.iconStyle} />
          </TouchableOpacity>
        </View>
        <View style={styles.descriptionRadio}>
          <Text style={customTxt(Fonts.Regular, 16, color5C5D5E).txt}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.
          </Text>
        </View>
        {renderSearchTextInput()}
        {renderFlatlistSpecial()}
      </View>
      {/* <DialogView
        isShow={isDialog}
        onPressCancel={() => setDialog(false)}
        title={Translate(languageRedux).INFO_BTN}
        content={Translate(languageRedux).CONTENT_INFO_CHOOSE_SPECIALITY}
        txt1={Translate(languageRedux).OK}
      /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  containerBox: {
    flex: 1,
    backgroundColor: colorFFFFFF,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9,
    marginBottom: 42
  },
  marginHori16: {
    marginHorizontal: 16
  },
  title: {
    marginTop: 16,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  marginR16: {
    marginRight: 16
  },
  descriptionRadio: {
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 24
  },
  searchInput: {
    height: 56,
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
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    width: '100%',
    backgroundColor: colorF8F8F8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    justifyContent: 'space-between'
  },
  ctnSpecialBox2: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    width: '100%',
    backgroundColor: color3777EE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: color3777EE,
    justifyContent: 'space-between'
  },
  specialName: {
    paddingVertical: 16,
    paddingLeft: 16
  },
  layoutSpecialBox: {
    marginHorizontal: 16,
    marginBottom: 8
  },
  flatList: {
    marginTop: 16,
    marginBottom: 8
  }
})
