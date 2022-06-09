import React, { useEffect } from 'react'
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList, ScrollView} from 'react-native'
import { useSelector } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'

import {color000000, color040404, color3777EE, colorDDDEE1, colorF8F8F8, colorFFFFFF} from 'constants/colors'
import Translate from 'translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'

import icHeader from '../../../../../assets/images/header'
import icCall from '../../../../../assets/images/video_call'

import Button from 'components/Button'

export default function PrescriptionList({onPressClose, listData,
    onPressCloseTop, setListData, patientId, setShowNotiAdd, setStatus}) {
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)

  useEffect(() => {
    console.log('listData: ', listData)
  }, [listData])

  const _onPressCloseTop = () => {
    onPressCloseTop()
    setListData([])
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
            onPress={_onPressCloseTop}>
            <Image source={icHeader.ic_close} style={styles.iconStyleFloat} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const RenderItemListSelected = ({item, index}) => {
    const _onPressItemSelectedDrug = () => {
      var selectID = [...listData]
        if (selectID.includes(item)) {
          selectID = selectID.filter((val) => val?.drugId !== item?.drugId)
        }
        else {
          selectID.push(item)
        }
        setListData(selectID)
    }
    return (
      <View>
        <View style={styles.ctnItemSelected}>
          <View style={styles.flex1}>
            <Text numberOfLines={1} style={customTxt(Fonts.Bold, 14, color040404).txt}>
              {item?.name}
            </Text>
            <View style={styles.quantity}>
              <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
                {Translate(languageRedux).quantity}:{' '}
              </Text>
              <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
                {item?.quantity}
              </Text>
            </View>
            <View style={styles.quantity}>
              <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
                {Translate(languageRedux).indication}:{' '}
              </Text>
              <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
                {item?.indication}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={_onPressItemSelectedDrug}>
            <Image source={icCall.ic_trash} style={styles.iconStyle} />
          </TouchableOpacity>
        </View>
        {(index !== (listData || []).length - 1) && <View style={styles.line} />}
      </View>
    )
  }

  const renderFlatlistSelected = () => {
    return (
      <View style={styles.ctnListDrug}>
        <FlatList
          data={listData || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItemListSelected
              item={item}
              index={index}
              data={listData || []}
            />
          )}
        />
      </View>
    )
  }

  const renderButton = () => {
    return (
      <View>
        <Button
          text={Translate(languageRedux).ADD_MORE}
          textColor={colorFFFFFF}
          backgroundColor={color3777EE}
          viewStyle={styles.marginB16}
          onPress={_onPressAddMore}
        />
        <Button
          text={Translate(languageRedux).SEND_BTN}
          textColor={colorFFFFFF}
          backgroundColor={color3777EE}
          onPress={_onPressSendPrescription}
        />
      </View>
    )
  }

  const _onPressAddMore = () => {
    onPressClose()
  }

  const _onPressSendPrescription = () => {
    const body = {
      drugs: listData,
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
        onPressCloseTop()
      })
      .catch(error => {
        console.error('There was an error!', error)
        onPressCloseTop()
      })
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        {renderFlatlistSelected()}
        {renderButton()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.bgOpacity} onPress={onPressClose} />
        <ScrollView contentContainerStyle={styles.fullView}>
          {renderTop()}
          {renderBody()}
        </ScrollView>
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
    height: Dimensions.get('window').height - 64,
    top: 64
  },
  floatingViewAndroid: {
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    top: Dimensions.get('window').height < 800 ? 0 : 64,
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
    marginHorizontal: 20
  },
  marginB16: {
    marginBottom: 16
  },
  ctnItemSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  line: {
    borderWidth: 0.75,
    borderColor: colorDDDEE1,
    marginHorizontal: 16
  },
  ctnListDrug: {
    marginBottom: 16,
    backgroundColor: colorF8F8F8,
    borderRadius: 16
  },
  quantity: {
    flexDirection: 'row',
    marginTop: 8,
    flex: 1,
    width: '70%'
  }
})
