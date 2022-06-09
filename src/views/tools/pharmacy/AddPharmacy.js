import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native'
import { useSelector } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../api/APIs'

import { colorFFFFFF, color040404, colorF0F0F0, color5C5D5E } from 'constants/colors'
import Translate from '../../../translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'

import icHeader from '../../../../assets/images/header'
import icDoc from '../../../../assets/images/document'

import Header from '../../../components/Header'
import CustomTextInput from '../../healthProfile/components/CustomTextInput'
import SearchForPharmacy from './SearchForPharmacy'
import LoadingView from 'components/LoadingView'
import Info from '../../healthProfile/components/Info'

export default function AddPharmacy() {

  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const [isLoad, setLoading] = useState(false)
  const [state, setState] = useState('')
  const [listState, setListState] = useState([])
  const [isShowState, setShowState] = useState(false)
  const [city, setCity] = useState('')
  const [listCity, setListCity] = useState([])
  const [isShowCity, setShowCity] = useState(false)
  const [county, setCounty] = useState('')
  const [listCounty, setListCounty] = useState([])
  const [isShowCounty, setShowCounty] = useState(false)
  const [reload, setReload] = useState(1)
  const [listPharmacy, setListPharmacy] = useState([])

  useEffect(() => {
    callAPIState()
    callAPICity()
    callAPICountry()
    callAPIPharmacy()
  }, [reload])

  const callAPIState = () => {
    setLoading(true)
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/getstati`,
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
          const getList = response.data.stati || []
          setListState(getList)
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
      url: `${APIs.hostAPI}backoffice/getcity/${state?.value}`,
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
          const getList = response.data.citt || []
          setListCity(getList)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }

  const callAPICountry = () => {
    setLoading(true)
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/getcounty/${state?.value}/${city?.value}`,
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
          const getList = response.data.county || []
          setListCounty(getList)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }

  const callAPIPharmacy = () => {
    setLoading(true)
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/getallfarmacie/${state?.value}/${city?.value}/${county?.value}`,
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
          const getList = response.data.strutt || []
          setListPharmacy(getList)
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
      <View style={styles.ctnLayout}>
        <View style={styles.ctnStateCityInput}>
          <CustomTextInput
            title={Translate(languageRedux).state}
            value={state?.value}
            onChangeTxt={(txt) => setState(txt)}
            textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.inputStyle]}
            validate={state ? false : true}
            onPress={() => { setShowState(true) }}
            iconRight={icDoc.ic_dropdown}
            placeholder={Translate(languageRedux).SELECT_STATE}
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
        <CustomTextInput
          title={Translate(languageRedux).county}
          value={county?.value}
          onChangeTxt={(txt) => setCounty(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          validate={county ? false : true}
          onPress={() => { setShowCounty(true) }}
          iconRight={icDoc.ic_dropdown}
          placeholder={Translate(languageRedux).SELECT_COUNTY}
        />
      </View>
    )
  }

  const RenderItem = ({ item, index, data }) => {
    const _onPressItem = () => {
      NavigationService.navigate(Routes.DETAIL_PHARMACY_SCREEN, {
        data: item,
        index: index
      })
    }
    return (
      <View>
        <Info
          title={item?.biz_name}
          subTitle={item?.address}
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
            {Translate(languageRedux).AVAILABLE_PHARMACIES}
          </Text>
        </View>
        <View style={styles.shadow}>
          <FlatList
            data={listPharmacy}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <RenderItem item={item} index={index} data={listPharmacy} />
            )}
          />
        </View>
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View>
        {renderTextInput()}
        {county !== '' && renderFlatlist()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_left}
        textCenter={Translate(languageRedux).pharmacies}
        textCenterColor={color040404}
        onPressLeft={() => {
          NavigationService.goBack()
        }}
      />
      <ScrollView>{renderBody()}</ScrollView>
      {isShowState && (
        <SearchForPharmacy
          listData={listState}
          title={Translate(languageRedux).state}
          itemSelected={state}
          onItemClick={val => {
            setState(val)
            setCity('')
            setCounty('')
            setShowState(false)
            setReload(Math.random())
          }}
          onPressRight={() => {
            setShowState(false)
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
            setCounty('')
            setShowCity(false)
            setReload(Math.random())
          }}
          onPressRight={() => {
            setShowCity(false)
          }}
        />
      )}
      {isShowCounty && (
        <SearchForPharmacy
          listData={listCounty}
          title={Translate(languageRedux).country}
          itemSelected={county}
          onItemClick={val => {
            setCounty(val)
            setShowCounty(false)
            setReload(Math.random())
          }}
          onPressRight={() => {
            setShowCounty(false)
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
  ctnLayout: {
    marginHorizontal: 20
  },
  ctnItem: {
    marginBottom: 16
  },
  marginT8: {
    marginTop: 16,
    marginBottom: 48
  },
  divider: {
    height: 1,
    backgroundColor: colorF0F0F0
  },
  marginB8: {
    marginBottom: 8
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  ctnNamePharma: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  flex1: {
    flex: 1
  },
  centerIcon: {
    justifyContent: 'center'
  },
  ctnTitle: {
    marginTop: 16,
    marginBottom: 20,
    marginHorizontal: 20
  },
  inputStyle: {
    width: 160
  },
  ctnStateCityInput: {
    flexDirection: 'row',
    justifyContent: 'space-between'
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
