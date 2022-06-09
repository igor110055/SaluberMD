import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView, FlatList, Platform} from 'react-native'
import { useSelector } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../api/APIs'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {color000000, colorFFFFFF, color040404, color3777EE, colorDDDEE1, colorF0F0F0, colorC1C3C5} from 'constants/colors'
import Translate from 'translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'

import icDoc from '../../../../assets/images/document'
import icHeader from '../../../../assets/images/header'

import CustomTextInput from '../../healthProfile/components/CustomTextInput'
import Button from 'components/Button'
import SearchListWithName from 'components/SearchListWithName'

export default function Drug({onPressCancel, setValueItem, patientId,
  routeAction, onPressAddAction, isActionView}) {
  const token = useSelector(state => state.user.token)
  const languageRedux = useSelector(state => state.common.language)
  const [country, setCountry] = useState()
  const [mediName, setMediName] = useState()
  const [quantity, setQuantity] = useState()
  const [indication, setIndication] = useState()
  const [listDrug, setListDrug] = useState([])
  const dataNoti = useSelector(state => state.common.dataNoti)
  const [listSelected, setListSelected] = useState([])
  const [listCountry, setListCountry] = useState([])
  const [isShowCountry, setShowCountry] = useState(false)
  const [mediNameInput, setMediNameInput] = useState()

  useEffect(() => {
    callAPIDrug()
  }, [mediNameInput])

  useEffect(() => {
    callAPICountry()
  }, [])

  useEffect(() => {
    setCountry('')
    setMediName('')
    setMediNameInput()
    setQuantity('')
    setIndication('')
    setListDrug([])
    setListSelected([])
  }, [isActionView])

  const callAPIDrug = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/webdoctor/drugs?chiave=${mediNameInput}&idReq=${dataNoti?.idReq || patientId}&isWebconference=true`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.drugs || []
          setListDrug(getList)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const callAPICountry = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/util/getCountries`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.country || []
          setListCountry(getList)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const renderTop = () => {
    return (
      <View>
        <View style={styles.ctnTitle}>
          <View style={styles.flex1} />
          <View style={styles.ctnSOS}>
            <Text style={customTxt(Fonts.SemiBold, 18, color040404).txt}>
              {Translate(languageRedux).NEW_MEDICINE}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.marginR16}
            onPress={onPressCancel}>
            <Image source={icHeader.ic_close} style={styles.iconStyleFloat} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const RenderItem = ({item}) => {
    const _onPressItem = () => {
      var selectID = [...listSelected]
        if (selectID.includes(item)) {
          selectID = selectID.filter((val) => val?.drugId !== item?.drugId)
        }
        else {
          selectID.push(item)
        }
      setListSelected(selectID)
      setMediNameInput()
      setMediName(item?.name)
      setListDrug([])
    }
    return (
      <TouchableOpacity onPress={_onPressItem} style={styles.checkBox}>
        <Icon
          name={listSelected.includes(item) ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
          size={24}
          color={listSelected.includes(item) ? color3777EE : colorDDDEE1}
        />
        <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginL8]}>
          {item?.name}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderFlatlistDrug = () => {
    return (
      <View style={styles.ctnList}>
        <FlatList
          data={listDrug}
          extraData={listDrug || listSelected}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const RenderItemSelected = ({item}) => {
    const _onPressItem = () => {
      var selectID = [...listSelected]
        if (selectID.includes(item)) {
          selectID = selectID.filter((val) => val?.drugId !== item?.drugId)
        }
        else {
          selectID.push(item)
        }
      setListSelected(selectID)
      setMediName('')
    }
    return (
      <TouchableOpacity onPress={_onPressItem} style={styles.checkBox}>
        <Icon
          name={'checkbox-marked-circle-outline'}
          size={24}
          color={color3777EE}
        />
        <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginL8]}>
          {item?.name}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderFlatlistSelected = () => {
    return (
      <View style={styles.ctnList}>
        <FlatList
          data={listSelected}
          extraData={listSelected}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItemSelected item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderTextInput = () => {
    return (
      <View>
        <CustomTextInput
          title={Translate(languageRedux).COUNTRY}
          value={country?.text}
          onChangeTxt={(txt) => setCountry(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icDoc.ic_dropdown}
          onPress={() => { setShowCountry(true) }}
        />
        <CustomTextInput
          title={Translate(languageRedux).MEDICINE_NAME}
          value={mediName}
          onChangeTxt={(txt) => {
            setMediName(txt)
            setMediNameInput(txt)
          }}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
        <View>
          {(listDrug || []).length > 0  && renderFlatlistDrug()}
          {(listSelected || []).length > 0  && renderFlatlistSelected()}
        </View>
        <CustomTextInput
          title={Translate(languageRedux).quantity}
          value={quantity}
          onChangeTxt={(txt) => setQuantity(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
        <CustomTextInput
          title={Translate(languageRedux).indication}
          value={indication}
          onChangeTxt={(txt) => setIndication(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.txtTextInput]}
        />
      </View>
    )
  }

  const _onPressAdd = () => {
    setValueItem({
      drugId: listSelected[0]?.drugId,
      name: listSelected[0]?.name,
      selected: true,
      quantity: quantity,
      indication: indication
    })
    onPressCancel()
  }

  const _onPressAddActionView = () => {
    setValueItem({
      drugId: listSelected[0]?.drugId,
      name: listSelected[0]?.name,
      selected: true,
      quantity: quantity,
      indication: indication
    })
    onPressAddAction()
  }

  const checkDisable = () => {
    if (country && mediName && quantity && indication) {
      return false
    } else {
      return true
    }
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        {renderTextInput()}
        <View style={styles.ctnButton}>
          <Button
            text={Translate(languageRedux).add_new}
            textColor={checkDisable() ? colorC1C3C5 : colorFFFFFF}
            backgroundColor={checkDisable() ? colorF0F0F0 : color3777EE}
            onPress={routeAction ? _onPressAddActionView : _onPressAdd}
            disabled={checkDisable()}
          />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.bgOpacity}
        onPress={onPressCancel}
      />
      {Platform.OS === 'ios' && <View style={styles.fullView}>
        {renderTop()}
        <KeyboardAwareScrollView>
          {renderBody()}
        </KeyboardAwareScrollView>
      </View>}
      {Platform.OS === 'android' &&
        <ScrollView contentContainerStyle={styles.floatingViewAndroid}>
          {renderTop()}
          <ScrollView contentContainerStyle={styles.paddingB42}>
            {renderBody()}
          </ScrollView>
        </ScrollView>}
      {
        isShowCountry && (
          <SearchListWithName
            listData={listCountry}
            title={Translate(languageRedux).CHOOSE_COUNTRY}
            itemSelected={country}
            onItemClick={(val) => {
              setCountry(val)
              setShowCountry(false)
            }}
            onPressRight={() => {
              setShowCountry(false)
            }}
            isText={true}
          />
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'flex-end'
  },
  bgOpacity: {
    width: '100%',
    height: '100%',
    flex: 1,
    position: 'absolute',
    backgroundColor: color000000,
    opacity: 0.7
  },
  fullView: {
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    height: Dimensions.get('window').height - 64
  },
  ctnTitle: {
    height: 56,
    flexDirection: 'row'
  },
  iconStyleFloat: {
    height: 24,
    width: 24,
    marginRight: 16,
    marginLeft: 16
  },
  ctnSOS: {
    flex: 4,
    alignItems: 'center',
    marginTop: 18
  },
  marginR16: {
    flex: 1,
    alignItems: 'flex-end',
    marginTop: 18
  },
  flex1: {
    flex: 1
  },
  ctnBody: {
    marginHorizontal: 16
  },
  txtTextInput: {
    height: 72
  },
  ctnButton: {
    marginTop: 32
  },
  checkBox: {
    flexDirection: 'row',
    alignContent: 'center',
    marginBottom: 8
  },
  marginL8: {
    marginLeft: 8
  },
  ctnList: {
    marginTop: 16,
    marginBottom: 16
  },
  floatingViewAndroid: {
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    top: Dimensions.get('window').height < 800 ? 0 : 64,
    height: Dimensions.get('window').height - 64
  },
  paddingB42: {
    paddingBottom: 42
  }
})
