import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native'
import { useSelector } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../api/APIs'

import {color040404, color5C5D5E, colorFFFFFF} from 'constants/colors'
import Translate from '../../../translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'

import icDoc from '../../../../assets/images/document'

import CustomTextInput from '../../healthProfile/components/CustomTextInput'
import SearchForPharmacy from '../../tools/pharmacy/SearchForPharmacy'
import LoadingView from 'components/LoadingView'
import Info from '../../healthProfile/components/Info'

export default function AddRequestClinic() {
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const [isLoad, setLoading] = useState(false)
  const [reload, setReload] = useState(1)
  const [listStructureType, setListStructureType] = useState([])
  const [structureType, setStructureType] = useState()
  const [isShowStructure, setShowStructure] = useState(false)
  const [listSample, setListSample] = useState([])
  const [sample, setSample] = useState()
  const [isShowSample, setShowSample] = useState(false)
  const [listCity, setListCity] = useState([])
  const [city, setCity] = useState()
  const [isShowCity, setShowCity] = useState(false)
  const [listStructure, setListStructure] = useState([])

  useEffect(() => {
    callAPIStructureType()
    callAPISample()
    callAPICity()
    callAPIStructure()
  }, [reload])

  const callAPIStructureType = () => {
    setLoading(true)
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/jws/rc/listaGenerica/tipi_struttura`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        console.log('structureType: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.result || []
          setListStructureType(getList)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }

  const callAPISample = () => {
    setLoading(true)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/jws/rc/listaProvince/${structureType?.id}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        console.log('Sample: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.result || []
          setListSample(getList)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }

  const callAPICity = () => {
    setLoading(true)
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/jws/rc/listaCitta/${structureType?.id}/${sample?.id}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        console.log('City: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.result || []
          setListCity(getList)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }

  const callAPIStructure = () => {
    setLoading(true)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/jws/rc/listaStrutture/${city?.id}/${structureType?.id}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        console.log('Structure: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.result || []
          setListStructure(getList)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }

  const renderTextInput = () => {
    return (
      <View style={styles.marginHori20}>
        <CustomTextInput
          title={Translate(languageRedux).tipo_struttura}
          value={structureType?.value}
          onChangeTxt={(txt) => setStructureType(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt]}
          validate={structureType ? false : true}
          onPress={() => { setShowStructure(true) }}
          iconRight={icDoc.ic_dropdown}
          placeholder={Translate(languageRedux).SELECT_STRUCTURE_TYPE}
        />
        <View style={styles.ctnFlexRow}>
          <CustomTextInput
            title={Translate(languageRedux).SAMPLE}
            value={sample?.value}
            onChangeTxt={(txt) => setSample(txt)}
            textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.inputStyle]}
            validate={sample ? false : true}
            onPress={() => { setShowSample(true) }}
            iconRight={icDoc.ic_dropdown}
            placeholder={Translate(languageRedux).SELECT_SAMPLE}
          />
          <CustomTextInput
            title={Translate(languageRedux).city}
            value={city?.value}
            onChangeTxt={(txt) => setCity(txt)}
            textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.inputStyle]}
            validate={city ? false : true}
            onPress={() => { setShowCity(true) }}
            iconRight={icDoc.ic_dropdown}
            placeholder={Translate(languageRedux).SELECT_CITY}
          />
        </View>
      </View>
    )
  }

  const RenderItem = ({ item, index, data }) => {
    const _onPressItem = () => {
      NavigationService.navigate(Routes.DETAIL_CLINIC_SCREEN, {
        data: item,
        index: index
      })
    }
    return (
      <View>
        <Info
          title={item?.value}
          subTitle={item?.value1}
          titleColor={color040404}
          subTitleColor={color5C5D5E}
          borderBottomLeftRadius={(index === (data || []).length - 1) ? 16 : 0}
          borderBottomRightRadius={(index === (data || []).length - 1) ? 16 : 0}
          borderTopLeftRadius={(index === 0) ? 16 : 0}
          borderTopRightRadius={(index === 0) ? 16 : 0}
          onPress={_onPressItem}
        />
      </View>
    )
  }

  const renderFlatlist = () => {
    return (
      <View style={styles.marginT8}>
        <View style={styles.ctnTitle}>
          <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt]}>
            {Translate(languageRedux).AVAILABLE_CLINIC}
          </Text>
        </View>
        <View style={styles.shadow}>
          <FlatList
            data={listStructure}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <RenderItem item={item} index={index} data={listStructure} />
            )}
          />
        </View>
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.paddingBottom48}>
        {renderTextInput()}
        {(listStructure || []).length > 0 && renderFlatlist()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {renderBody()}
      </ScrollView>
      {isShowStructure && (
        <SearchForPharmacy
          listData={listStructureType}
          title={Translate(languageRedux).tipo_struttura}
          itemSelected={structureType}
          onItemClick={val => {
            setStructureType(val)
            setSample('')
            setCity('')
            setShowStructure(false)
            setReload(Math.random())
          }}
          onPressRight={() => {
            setShowStructure(false)
          }}
        />
      )}
      {isShowSample && (
        <SearchForPharmacy
          listData={listSample}
          title={Translate(languageRedux).SAMPLE}
          itemSelected={sample}
          onItemClick={val => {
            setSample(val)
            setCity('')
            setShowSample(false)
            setReload(Math.random())
          }}
          onPressRight={() => {
            setShowSample(false)
          }}
        />
      )}
      {isShowCity && (
        <SearchForPharmacy
          listData={listCity}
          title={Translate(languageRedux).city}
          itemSelected={city}
          onItemClick={val => {
            setCity(val)
            setShowCity(false)
            setReload(Math.random())
          }}
          onPressRight={() => {
            setShowCity(false)
          }}
        />
      )}
      {isLoad && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  paddingBottom48: {
    paddingBottom: 48
  },
  marginHori20: {
    marginHorizontal: 20
  },
  inputStyle: {
    width: 160
  },
  ctnFlexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  marginT8: {
    marginTop: 16,
    marginBottom: 48
  },
  ctnTitle: {
    marginTop: 16,
    marginBottom: 20,
    marginHorizontal: 20
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
