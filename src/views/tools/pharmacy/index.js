import React, { useState, useEffect} from 'react'
import { View, Text, StyleSheet, FlatList, ScrollView, DeviceEventEmitter } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Switch } from 'react-native-switch'
import axios from 'axios'
import * as APIs from '../../../api/APIs'

import { colorF8F8F8, colorFFFFFF, color040404, color2F80ED, color3777EE } from 'constants/colors'
import NavigationService from 'navigation'
import Translate from '../../../translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import { saveShowPharma } from 'actions/user'
import Routes from 'navigation/Routes'

import icHeader from '../../../../assets/images/header'
import icVisit from '../../../../assets/images/visit'
import imgNoData from '../../../../assets/images/nodata'

import Header from '../../../components/Header'
import LoadingView from '../../../components/LoadingView'
import EachBox from '../components/EachBox'
import DialogCustom from '../../../components/DialogCustom'
import SOSButton from '../../home_screen/components/SOSButton/SOSButton'
import NoDataView from 'components/NoDataView'

export default function Pharmacy() {

  const dispatch = useDispatch()
  const languageRedux = useSelector(state => state.common.language)
  const showPharma = useSelector(state => state.user.pharma)
  const token = useSelector(state => state.user.token)
  const [isEnabledSwitch, setEnabledSwitch] = useState(showPharma === 0 ? false : true)
  const [isLoad, setLoading] = useState(true)
  const [lsPharmacies, setLSPharmacies] = useState([])
  const [idPharma, setIdPharma] = useState()
  const [deleteStatus, setDeleteStatus] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    callAPIListPharmacies()
    deleteStatus && deletePharmacy()
    DeviceEventEmitter.addListener('addPharmacy', () => {
      setLoading(true)
      // setReLoad(Math.random())
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    })
    console.log('showPharma: ', showPharma)
  }, [isLoad, deleteStatus])

  const callAPIListPharmacies = () => {
    axios({
        method: 'get',
        url: `${APIs.hostAPI}backoffice/getFavouritesFarmacy`,
        headers: {
          'content-type': 'application/json',
          'x-auth-token': token
        }
      })
      .then((response) => {
        setLoading(false)
        console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.farmacie || []
          setLSPharmacies(getList)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const deletePharmacy = () => {
    axios({
      method: 'delete',
      url: `${APIs.hostAPI}backoffice/deleteFavorite/${idPharma}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
    .then(response => {
      setLoading(false)
      setDeleteStatus(false)
      console.log('Delete successful', response)
    })
    .catch(error => {
      setLoading(false)
      setDeleteStatus(false)
      console.error('There was an error!', error)
    })
  }

  const saveShowHomepage = (check) => {
    const body = {
      showPharmacy: check
    }
    console.log('BODY: ', body)
    setLoading(true)
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
        setLoading(false)
      })
      .catch(error => {
        console.error('There was an error!', error)
        setLoading(false)
      })
    DeviceEventEmitter.emit('checkShow')
  }

  const _onPressSwitch = () => {
    if (showPharma === 0) {
      saveShowHomepage(1)
      Promise.all([
        dispatch(saveShowPharma(1))
      ])
    }
    if (showPharma === 1) {
      saveShowHomepage(0)
      Promise.all([
        dispatch(saveShowPharma(0))
      ])
    }
    setEnabledSwitch(!isEnabledSwitch)
  }

  const renderShowInSwitch = () => {
    return (
      <View style={styles.ctnTop}>
        <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginL20]}>
          {Translate(languageRedux).SHOW_IN_HOMEPAGE}
        </Text>
        <View style={styles.marginR20}>
          <Switch
            onValueChange={_onPressSwitch}
            value={isEnabledSwitch}
            renderActiveText={false}
            renderInActiveText={false}
            backgroundActive={color2F80ED}
            circleSize={24}
            circleBorderWidth={0}
          />
        </View>
      </View>
    )
  }

  const RenderItem = ({item, index, data}) => {
    const _onPressItem = () => {
      NavigationService.navigate(Routes.MAP_VIEW, {
        data: item,
        index: index
      })
    }
    return (
      <View>
        <EachBox
          title={item?.name}
          subTitle={item?.address}
          borderBottomLeftRadius={(index === (data || []).length - 1) ? 16 : 0}
          borderBottomRightRadius={(index === (data || []).length - 1) ? 16 : 0}
          borderTopLeftRadius={(index === 0) ? 16 : 0}
          borderTopRightRadius={(index === 0) ? 16 : 0}
          onPressDelete={() => {
            setIdPharma(item?.id)
            setShowDelete(true)
          }}
          onPress={_onPressItem}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View>
        {(lsPharmacies || []).length > 0 &&
          <FlatList
            data={lsPharmacies}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <RenderItem item={item} index={index} data={lsPharmacies} />
            )}
          />
        }
      </View>
    )
  }

  const renderPlusButton = () => {
    return (
      <SOSButton
        source={icVisit.ic_plus}
        backgroundColor={color3777EE}
        onPress={() => {
          NavigationService.navigate(Routes.ADD_PHARMACY_SCREEN)
        }}
      />
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
      {renderShowInSwitch()}
      {(lsPharmacies || []).length === 0 && (
        <NoDataView
          imageSource={imgNoData.img_nodata_pharmacies}
          text={Translate(languageRedux).FAVORITE_PHARMACY_NO_DATA}
          noDataViewStyle={styles.ctnNoDataImg}
        />
      )}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {renderBody()}
      </ScrollView>
      {renderPlusButton()}
      {showDelete &&
        <DialogCustom
          title={Translate(languageRedux).deleteMessage}
          txtlLeft={Translate(languageRedux).cancel}
          onPressCancel={() => {setShowDelete(false)}}
          txtRight={Translate(languageRedux).delete}
          onPressOK={() => {
            setDeleteStatus(true)
            setShowDelete(false)
          }}
        />}
      {isLoad && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  ctnTop: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: colorFFFFFF,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 21
  },
  marginL20: {
    marginLeft: 20
  },
  marginR20: {
    marginRight: 20
  },
  contentContainer: {
    paddingBottom: 100
  }
})
