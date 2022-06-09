import React, { useState, useEffect } from 'react'
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, DeviceEventEmitter} from 'react-native'
import { useSelector } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'
import _ from 'lodash'

import {color040404, color3777EE, colorC1C3C5, colorDDDEE1, colorF0F0F0, colorFFFFFF} from 'constants/colors'
import Translate from 'translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import NavigationService from 'navigation'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'

import icHeader from '../../../../../assets/images/header'
import icDoc from '../../../../../assets/images/document'

import Header from 'components/Header'
import Button from 'components/Button'
import LoadingView from 'components/LoadingView'
import SearchListWithName from 'components/SearchListWithName'

export default function SetRange({route}) {
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const paramId = route?.params?.id
  const patientId = route?.params?.data
  const [minValue, setMinValue] = useState()
  const [maxValue, setMaxValue] = useState()
  const [acceptValue, setAcceptValue] = useState()
  const [isLoad, setLoading] = useState(true)
  const [isShowMin, setShowMin] = useState(false)
  const [isShowMax, setShowMax] = useState(false)
  const [isShowAcceptRange, setShowAcceptRange] = useState(false)
  const [listMinBP, setListMinBP] = useState()
  const [listMaxBP, setListMaxBP] = useState()
  const [listAcceptableRange, setListAcceptableRange] = useState()
  const [dataNoti, setDataNoti] = useState()
  const [isShowNoti, setShowNoti] = useState()
  const idGetRangeSPO2 = route?.params?.idGetRange

  useEffect(() => {
    callAPIRange()
    listAcceptalbeRange()
  }, [])

  const listAcceptalbeRange = () => {
    var data = []
    for (var i = 0; i <= 50; i = i + 5) {
      var item = {}
      item.label = i.toString()
      item.value = i
      data.push(item)
    }
    if ((data || []).length > 0) {
      setListAcceptableRange(data)
    }
  }

  const checkParamId = () => {
    if (paramId === 13) {
      return idGetRangeSPO2
    } else {
      return paramId
    }
  }

  const callAPIRange = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/disman/getThresholdsLevels/${checkParamId()}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (callAPIRange)')
          console.log('dataRange: ', response.data)
          const getList = response.data.valori || []
          filterListMin(getList)
          filterListMax(getList)
          setLoading(false)
        }
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
      })
  }

  const filterListMin = (dataRange) => {
    var data = []
    for (var i = 0; i < (dataRange || []).length; i++) {
      var item = {}
      item.label = dataRange[i]?.min
      if (item.label) {
        data.push(item)
      }
    }
    if ((data || []).length > 0) {
      setListMinBP(data)
    }
  }

  const filterListMax = (dataRange) => {
    var data = []
    for (var i = 0; i < (dataRange || []).length; i++) {
      var item = {}
      item.label = dataRange[i]?.max
      if (item.label) {
        data.push(item)
      }
    }
    if ((data || []).length > 0) {
      setListMaxBP(data)
    }
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        <View style={styles.ctnLine}>
          <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
            {Translate(languageRedux).MIN}
          </Text>
          <TouchableOpacity onPress={() => {setShowMin(true)}} style={styles.ctnText}>
            <Text style={[customTxt(Fonts.Regular, 16, color040404).txt]}>{minValue}</Text>
            <Image source={icDoc.ic_dropdown} style={styles.iconStyle} />
          </TouchableOpacity>
        </View>
        <View style={styles.ctnLine}>
          <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
            {Translate(languageRedux).MAX}
          </Text>
          <TouchableOpacity onPress={() => {setShowMax(true)}} style={styles.ctnText}>
            <Text style={[customTxt(Fonts.Regular, 16, color040404).txt]}>{maxValue}</Text>
            <Image source={icDoc.ic_dropdown} style={styles.iconStyle} />
          </TouchableOpacity>
        </View>
        <View style={styles.ctnLine2}>
          <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
            {Translate(languageRedux).ACCEPTABLE_RANGE}
          </Text>
          <TouchableOpacity onPress={() => {setShowAcceptRange(true)}} style={styles.ctnText}>
            <Text style={[customTxt(Fonts.Regular, 16, color040404).txt]}>{acceptValue?.label}</Text>
            <Image source={icDoc.ic_dropdown} style={styles.iconStyle} />
          </TouchableOpacity>
        </View>
        <Button
          text={Translate(languageRedux).SET_BTN}
          backgroundColor={(minValue && maxValue) ? color3777EE : colorF0F0F0}
          textColor={(minValue && maxValue) ? colorFFFFFF : colorC1C3C5}
          onPress={_onPressSet}
          disabled={(minValue && maxValue) ? false : true}
        />
      </View>
    )
  }

  const _onPressSet = () => {
    setLoading(true)
    const body = {
      min: minValue,
      max: maxValue,
      accept: acceptValue?.value,
      patientId: patientId,
      param: paramId
    }
    console.log('body: ', body)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/disman/setTreshold`,
      headers: {
        'x-auth-token': token
      },
      data: body
    })
      .then(response => {
        setLoading(false)
        console.log('data: ', response?.data)
        setShowNoti(true)
        if (_.includes([0, '0'], response?.data?.esito)) {
          setDataNoti({
            status: STATUS_NOTIFY.SUCCESS,
            content: 'Successful'
          })
        }
        if (_.includes([1, '1'], response?.data?.esito)) {
          setDataNoti({
            status: STATUS_NOTIFY.ERROR,
            content: 'Failed'
          })
        }
        setTimeout(() => {
          DeviceEventEmitter.emit('reloadGetRange')
          NavigationService.goBack()
        }, 1000)
      })
      .catch(error => {
        console.error('There was an error!', error)
        NavigationService.goBack()
      })
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).setTreshold}
        iconLeft={icHeader.ic_left}
        onPressLeft={() => {
          NavigationService.goBack()
        }}
      />
      <ScrollView>{renderBody()}</ScrollView>
      {
        isShowMin && (
          <SearchListWithName
            listData={listMinBP}
            // title={Translate(languageRedux).CHOOSE_PROSTHESIS}
            itemSelected={minValue}
            onItemClick={(val) => {
              console.log('val: ', val?.label)
              setMinValue(val?.label)
              setShowMin(false)
            }}
            onPressRight={() => {
              setShowMin(false)
            }}
            isLabel={true}
            hideSearchText={true}
          />
        )
      }
      {
        isShowMax && (
          <SearchListWithName
            listData={listMaxBP}
            // title={Translate(languageRedux).CHOOSE_PROSTHESIS}
            itemSelected={maxValue}
            onItemClick={(val) => {
              console.log('val: ', val?.label)
              setMaxValue(val?.label)
              setShowMax(false)
            }}
            onPressRight={() => {
              setShowMax(false)
            }}
            isLabel={true}
            hideSearchText={true}
          />
        )
      }
      {
        isShowAcceptRange && (
          <SearchListWithName
            listData={listAcceptableRange}
            // title={Translate(languageRedux).CHOOSE_PROSTHESIS}
            itemSelected={acceptValue}
            onItemClick={(val) => {
              console.log('val: ', val)
              setAcceptValue(val)
              setShowAcceptRange(false)
            }}
            onPressRight={() => {
              setShowAcceptRange(false)
            }}
            isLabel={true}
            hideSearchText={true}
          />
        )
      }
      {isLoad && <LoadingView />}
      <NotificationView
        isShow={isShowNoti}
        setShow={() => setShowNoti(false)}
        status={dataNoti?.status || STATUS_NOTIFY.ERROR}
        content={dataNoti?.content || ''}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  ctnBody: {
    marginHorizontal: 16
  },
  ctnLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  ctnLine2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  txtTextInput: {
    width: 100
  },
  ctnText: {
    borderWidth: 1,
    borderColor: colorDDDEE1,
    borderRadius: 12,
    height: 52,
    width: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12
  },
  iconStyle: {
    height: 24,
    width: 24,
    marginLeft: 12
  },
  marginL12: {
    marginLeft: 12
  }
})
