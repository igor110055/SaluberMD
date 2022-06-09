import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import axios from 'axios'
import * as APIs from '../../../api/APIs'

import { color040404, color3777EE, colorC1C3C5, colorF0F0F0, colorFFFFFF } from 'constants/colors'
import NavigationService from 'navigation'
import Translate from '../../../translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'

import icHeader from '../../../../assets/images/header'

import Header from 'components/Header'
import LoadingView from 'components/LoadingView'

export default function SettingUnit() {

  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const [height, setHeight] = useState()
  const [weight, setWeight] = useState()
  const [tem, setTem] = useState(null)
  const [data, setData] = useState()
  const [isLoad, setLoading] = useState(true)

  useEffect(() => {
    callAPIGetUnit()
  }, [])

  useEffect(() => {
    setHeight(data?.heightUnit)
    setWeight(data?.weightUnit)
    setTem(data?.isCelsius)
  }, [data])

  const callAPIGetUnit = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/getUnitStatus`,
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
          const getList = response.data || []
          setData(getList)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }

  const RenderItem = ({ label, unit1, unit2, choose, setChoose }) => {
    return (
      <View style={styles.ctnHeight}>
        <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.nameUnit]}>
          {label}
        </Text>
        <View style={styles.ctnUnit}>
          <TouchableOpacity
            onPress={() => {
              choose === 0 && setChoose(1)
            }}
            style={choose === 1 ? styles.unit : styles.unitOff}>
            <Text style={customTxt(Fonts.Bold, 14, (choose === 1 ? colorFFFFFF : colorC1C3C5)).txt}>
              {unit1}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              choose === 1 && setChoose(0)
            }}
            style={[(choose === 0 ? styles.unit : styles.unitOff), styles.marginL8]}>
            <Text style={customTxt(Fonts.Bold, 14, (choose === 0 ? colorFFFFFF : colorC1C3C5)).txt}>
              {unit2}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderTemperature = () => {
    return (
      <View style={styles.ctnHeight}>
        <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.nameUnit]}>
          {Translate(languageRedux).DEVICE_TEMPERATURE}
        </Text>
        <View style={styles.ctnUnit}>
          <TouchableOpacity
            onPress={() => {
              tem === 0 && setTem(1)
            }}
            style={tem === 1 ? styles.unitTem : styles.unitOffTem}>
            <View style={styles.height15}>
              <Icon name={'circle-thin'} size={7} color={tem === 1 ? colorFFFFFF : colorC1C3C5} />
            </View>
            <Text style={customTxt(Fonts.Bold, 14, (tem === 1 ? colorFFFFFF : colorC1C3C5)).txt}>
              C
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              tem === 1 && setTem(0)
            }}
            style={[(tem === 0 ? styles.unitTem : styles.unitOffTem), styles.marginL8]}>
            <View style={styles.height15}>
              <Icon name={'circle-thin'} size={7} color={tem === 0 ? colorFFFFFF : colorC1C3C5} />
            </View>
            <Text style={customTxt(Fonts.Bold, 14, (tem === 0 ? colorFFFFFF : colorC1C3C5)).txt}>
              F
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View>
        <RenderItem
          label={Translate(languageRedux).height}
          unit1={Translate(languageRedux).cm}
          unit2={Translate(languageRedux).FEET}
          choose={height}
          setChoose={(val) => {
            setHeight(val)
          }}
        />
        <RenderItem
          label={Translate(languageRedux).weight}
          unit1={Translate(languageRedux).kg}
          unit2={Translate(languageRedux).POUNDS}
          choose={weight}
          setChoose={(val) => {
            setWeight(val)
          }}
        />
        {renderTemperature()}
      </View>
    )
  }

  const _onPressSave = () => {
    const body = {
      isCelsius: tem,
      weightUnit: weight,
      weight: 80,
      heightUnit: height,
      height: 180
    }
    console.log('BODY: ', body)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/settingUnitStatus`,
      headers: {
        'x-auth-token': token
      },
      data: body
    })
      .then(response => {
        console.log('data: ', response.data)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
    NavigationService.goBack()
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).unit}
        iconLeft={icHeader.ic_left}
        textRight={Translate(languageRedux).btnsave}
        textRightColor={color3777EE}
        onPressLeft={() => {
          NavigationService.goBack()
        }}
        onPressRight={_onPressSave}
      />
      <ScrollView>{renderBody()}</ScrollView>
      {isLoad && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  ctnHeight: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  ctnUnit: {
    flexDirection: 'row'
  },
  unit: {
    height: 30,
    width: 63,
    backgroundColor: color3777EE,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  unitOff: {
    height: 30,
    width: 63,
    backgroundColor: colorF0F0F0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colorC1C3C5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nameUnit: {
  },
  marginL8: {
    marginLeft: 8
  },
  unitTem: {
    height: 30,
    width: 63,
    backgroundColor: color3777EE,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  unitOffTem: {
    height: 30,
    width: 63,
    backgroundColor: colorF0F0F0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colorC1C3C5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  height15: {
    height: 15,
    marginRight: 2
  }
})
