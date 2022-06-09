import React, { useState, useEffect } from 'react'
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList, TextInput, ScrollView, Platform} from 'react-native'
import { useSelector } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import _, {cloneDeep} from 'lodash'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {color000000, colorFFFFFF, color040404, color3777EE, colorF0F0F0, colorDDDEE1, colorC1C3C5} from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from 'translate'
import {checkWhiteSpace} from 'constants/CheckWhiteSpace'

import icHeader from '../../../../../assets/images/header'
import icTrash from '../../../../../assets/images/video_call'
import icHome from '../../../../../assets/images/home_screen'

import CustomTextInput from '../../../healthProfile/components/CustomTextInput'
import Button from 'components/Button'

export default function NewPrescription({onPressClose, patientId, setShowNotiAdd, setStatus}) {
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const [mediName, setMediName] = useState()
  const [listDrug, setListDrug] = useState([])
  const [listSelected, setListSelected] = useState([])
  const [itemShowMore, setItemShowMore] = useState([])
  const [indicationSelected, setIndicationSelected] = useState([])
  const [indexItem, setIndexItem] = useState(0)
  const [isOther, setOther] = useState(false)
  const [nameOther, setNameOther] = useState()
  const [indicationOther, setIndicationOther] = useState()
  const [quantityOther, setQuantityOther] = useState()
  const [heightMax, setHeightMax] = useState(false)

  useEffect(() => {
    callAPIDrug()
    if ((mediName || []).length === 0) {
      setListDrug([])
    }
  }, [mediName])

  useEffect(() => {
    checkHeight()
  }, [listSelected])

  const checkHeight = () => {
    if ((listSelected || []).length === 0) {
      setHeightMax(false)
    }
  }

  const callAPIDrug = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/webdoctor/drugs?chiave=${mediName}&idReq=${patientId}&isWebconference=true`,
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
          if (mediName === '') {
            setListDrug([])
          } else {
            setListDrug(getList)
          }
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
              {Translate(languageRedux).NEW_PRESCRIPTION}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.marginR16}
            onPress={onPressClose}>
            <Image source={icHeader.ic_close} style={styles.iconStyleFloat} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const RenderItem = ({item}) => {
    const _onPressItem = () => {
      setHeightMax(true)
      var selectID = [...listSelected]
      var selectItem = [...itemShowMore]
      setIndexItem(indexItem + 1)
        if (selectID.includes(item)) {
          selectID = selectID.filter((val) => val?.index !== item?.index)
        }
        else {
          var newData =
            {
              index: indexItem,
              drugId: item?.drugId,
              name: item?.name,
              indication: '',
              quantity: ''
            }
          selectID.push(newData)
          selectItem.push(newData?.index)
        }
      setListSelected(selectID)
      setItemShowMore(selectItem)
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
      <View style={styles.ctnListDrug}>
        <FlatList
          data={listDrug}
          extraData={listDrug}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const RenderItemSelected = ({item, index}) => {
    const _onPressDeleteItem = () => {
      var selectID = [...listSelected]
      if (selectID.includes(item)) {
        selectID = selectID.filter((val) => val?.index !== item?.index)
      } else {
        selectID.push(item)
      }
      setListSelected(selectID)
    }
    const _onPressShowMore = () => {
      var selectID = [...itemShowMore]
      if (selectID.includes(item?.index)) {
        selectID = selectID.filter((val) => val !== item?.index)
      } else {
        selectID.push(item?.index)
      }
      setItemShowMore(selectID)
    }
    const _onPressIndication = () => {
      setIndicationSelected(index)
    }
    return (
      <View>
        <View style={styles.checkBox}>
          <View style={styles.ctnName}>
            <Text style={customTxt(Fonts.SemiBold, 14, color040404).txt}>
              {item?.name || item?.other}
            </Text>
          </View>
          <View style={styles.ctnIconTrash}>
            <TouchableOpacity
              onPress={_onPressShowMore}
              style={styles.ctnIconDrop}>
              <Image source={itemShowMore.includes(item?.index) ? icHome.ic_down : icHome.ic_up} style={styles.iconStyle} />
            </TouchableOpacity>
            <TouchableOpacity onPress={_onPressDeleteItem}>
              <Image source={icTrash.ic_trash} style={styles.iconStyle} />
            </TouchableOpacity>
          </View>
        </View>
        {itemShowMore.includes(item?.index) && <View>
          <View style={styles.ctnIndication}>
            <Text
              style={[
                customTxt(Fonts.Regular, 16, color040404).txt,
                styles.text
              ]}>
              {Translate(languageRedux).indication}
            </Text>
            <View style={styles.textInput}>
              <TextInput
                style={customTxt(Fonts.Regular, 16, color040404).txt}
                value={item?.indication}
                onChangeText={_onChangeIndication}
                onPressIn={_onPressIndication}
              />
            </View>
          </View>
          <View style={styles.ctnIndication}>
            <Text
              style={[
                customTxt(Fonts.Regular, 16, color040404).txt,
                styles.text
              ]}>
              {Translate(languageRedux).quantity}
            </Text>
            <View style={styles.textInput}>
              <TextInput
                style={customTxt(Fonts.Regular, 16, color040404).txt}
                value={item?.quantity}
                onChangeText={_onChangeQuantity}
                onPressIn={_onPressIndication}
              />
            </View>
          </View>
        </View>}
      </View>
    )
  }

  const _onChangeIndication = (text) => {
    const getNumber = Number(indicationSelected) || 0
    console.log('getNumber: ', getNumber)
    var newData = cloneDeep(listSelected)
    var valueChange = newData[getNumber]
    valueChange.indication = text
    newData = [
      ...newData
    ]
    console.log('new data: ', newData)
    setListSelected(newData)
  }

  const _onChangeQuantity = (text) => {
    const getNumber = Number(indicationSelected) || 0
    var newData = cloneDeep(listSelected)
    var valueChange = newData[getNumber]
    valueChange.quantity = text
    newData = [
      ...newData
    ]
    console.log('new data: ', newData)
    setListSelected(newData)
  }

  const renderFlatlistSelected = () => {
    return (
      <View style={styles.ctnList}>
        <FlatList
          data={listSelected}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItemSelected item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderOther = () => {
    return (
      <TouchableOpacity onPress={() => {
        setOther(!isOther)
      }} style={styles.ctnOther}>
        <Icon
          name={isOther ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
          size={24}
          color={isOther ? color3777EE : colorDDDEE1}
        />
        <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginL8]}>
          {Translate(languageRedux).other}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderTextInputOther = () => {
    return (
      <View style={styles.ctnTextInputOther}>
        <CustomTextInput
          title={Translate(languageRedux).name}
          value={nameOther}
          onChangeTxt={(txt) => setNameOther(txt)}
          validate={checkWhiteSpace(nameOther) ? false : true}
        />
        <CustomTextInput
          title={Translate(languageRedux).indication}
          value={indicationOther}
          onChangeTxt={(txt) => setIndicationOther(txt)}
          validate={checkWhiteSpace(indicationOther) ? false : true}
        />
        <CustomTextInput
          title={Translate(languageRedux).quantity}
          value={quantityOther}
          onChangeTxt={(txt) => setQuantityOther(txt)}
          validate={checkWhiteSpace(quantityOther) ? false : true}
          textinputStyle={styles.ctnTextInputOther}
        />
        <Button
          text={Translate(languageRedux).add}
          textColor={(nameOther && indicationOther && quantityOther) ? colorFFFFFF : colorC1C3C5}
          backgroundColor={(nameOther && indicationOther && quantityOther) ? color3777EE : colorF0F0F0}
          onPress={_onPressNew}
        />
      </View>
    )
  }

  const _onPressNew = () => {
    setIndexItem(indexItem + 1)
    var newData = {
      index: indexItem,
      drugId: -1,
      other: nameOther,
      indication: indicationOther,
      quantity: quantityOther,
      selected: true
    }
    var list = [...listSelected]
    var listConcat = _.concat(list, newData)
    console.log('listConcat: ', listConcat)
    setListSelected(listConcat)
    setNameOther('')
    setIndicationOther('')
    setQuantityOther('')
    setOther(!isOther)
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        {(listDrug || []).length > 0 && renderOther()}
        {isOther && renderTextInputOther()}
        <View>
          {(listDrug || []).length > 0  && renderFlatlistDrug()}
        </View>
      </View>
    )
  }

  const renderBodyTop = () => {
    return (
      <View>
        <View style={styles.marginHori16}>
          <CustomTextInput
            title={Translate(languageRedux).MEDICINE_NAME}
            value={mediName}
            onChangeTxt={txt => setMediName(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          />
        </View>
        {(listSelected || []).length > 0 && renderFlatlistSelected()}
        {(listSelected || []).length > 0 && <View style={styles.sendButon}>
          <Button
            text={Translate(languageRedux).send}
            textColor={listSelected ? colorFFFFFF : colorC1C3C5}
            backgroundColor={listSelected ? color3777EE : colorF0F0F0}
            onPress={_onPressSendPrescription}
          />
        </View>}
        {(listSelected || []).length > 0 && <View style={styles.line} />}
      </View>
    )
  }

  const _onPressSendPrescription = () => {
    const body = {
      drugs: listSelected,
      drug_country: 'US',
      symptoms: []
    }
    console.log('body: ', body)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/webdoctor/sendPrescription/${patientId}`,
      headers: {
        'x-auth-token': token
      },
      data: body
    })
      .then(response => {
        setShowNotiAdd(true)
        console.log('data: ', response?.data)
        setStatus(response?.data?.esito)
        onPressClose()
      })
      .catch(error => {
        console.error('There was an error!', error)
        onPressClose()
      })
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.bgOpacity} onPress={onPressClose} />
      {Platform.OS === 'ios' && (
        <View style={styles.fullView}>
          {renderTop()}
          <ScrollView style={stylesHeight(heightMax).heightList}>
            {renderBodyTop()}
          </ScrollView>
          <KeyboardAwareScrollView>{renderBody()}</KeyboardAwareScrollView>
        </View>
      )}
      {Platform.OS === 'android' && (
        <ScrollView contentContainerStyle={styles.floatingViewAndroid}>
          {renderTop()}
          <ScrollView style={stylesHeight(heightMax).heightList}>
            {renderBodyTop()}
          </ScrollView>
          <ScrollView>
            {renderBody()}
          </ScrollView>
        </ScrollView>
      )}
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
    flexDirection: 'row',
    paddingVertical: 16,
    marginBottom: 16
  },
  iconStyleFloat: {
    height: 24,
    width: 24,
    marginRight: 16,
    marginLeft: 16
  },
  ctnSOS: {
    flex: 4,
    alignItems: 'center'
  },
  marginR16: {
    flex: 1,
    alignItems: 'flex-end'
  },
  flex1: {
    flex: 1
  },
  checkBox: {
    flexDirection: 'row',
    alignContent: 'center',
    marginBottom: 8,
    flex: 1
  },
  marginL8: {
    marginLeft: 8,
    flex: 1
  },
  ctnList: {
    marginTop: 16,
    marginBottom: 16,
    marginHorizontal: 16
  },
  ctnBody: {
    marginHorizontal: 16,
    paddingBottom: 42
  },
  ctnName: {
    flex: 6
  },
  ctnIconTrash: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  line: {
    height: 1,
    borderWidth: 0.75,
    borderColor: colorF0F0F0
  },
  ctnIconDrop: {
    marginRight: 12
  },
  textInput: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: colorDDDEE1,
    flex: 2,
    width: '100%'
  },
  ctnIndication: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center'
  },
  text: {
    flex: 1
  },
  ctnListDrug: {
    marginTop: 16,
    paddingBottom: 42
  },
  ctnOther: {
    flexDirection: 'row',
    marginTop: 12
  },
  ctnTextInputOther: {
    marginBottom: 12
  },
  marginHori16: {
    marginHorizontal: 16
  },
  sendButon: {
    marginBottom: 16,
    marginHorizontal: 16
  },
  floatingViewAndroid: {
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    top: Dimensions.get('window').height < 800 ? 0 : 64,
    height: Dimensions.get('window').height - 64
  }
})

const stylesHeight = (h) => StyleSheet.create({
  heightList: {
    height: h ? '100%' : '30%'
  }
})
