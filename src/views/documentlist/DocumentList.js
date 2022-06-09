import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  RefreshControl,
  DeviceEventEmitter
} from 'react-native'

import axios from 'axios'
import * as APIs from '../../api/APIs'
import _ from 'lodash'

import Header from './components/Header'
import {
  color040404,
  color0B40B1,
  color363636,
  color3777EE,
  color5C5D5E,
  colorA7A8A9,
  colorDDDEE1,
  colorEAF1FF,
  colorF8F8F8,
  colorFFFFFF
} from '../../constants/colors'
import icHeader from '../../../assets/images/header'
import icDoc from '../../../assets/images/document'
import icVisit from '../../../assets/images/visit'
import { customTxt } from '../../constants/css'
import Fonts from '../../constants/Fonts'
import SOSButton from '../home_screen/components/SOSButton/SOSButton'
import { useSelector, useDispatch } from 'react-redux'
import NewDocumentFloating from './components/NewDocumentFloating'
import LoadingView from '../../components/LoadingView'
import { apiGetCategoryFile, apiGetDocument } from '../../api/Document'
import { saveListCategoryFile } from '../../actions/common'
import { convertDMMMYYYY } from '../../constants/DateHelpers'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import Translate from '../../translate'

export default function DocumentList({ route }) {
  const dispatch = useDispatch()
  const languageRedux = useSelector(state => state.common.language)
  const [isShow, setShow] = useState(false)
  const [loading, setLoading] = useState(true)
  const lsCategoryFile = useSelector(state => state.common.listCategoryFile)
  const token = useSelector(state => state.user.token)
  const [lsDocument, setLSDocument] = useState([])
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)
  const passingData = route?.params
  const [listDocumnets, setListDocuments] = useState()
  const [selectedItem, setSelectedItem] = useState()
  const typeView = route?.params?.typeView
  const [reload, setReload] = useState(1)

  useEffect(() => {
    callAPIListCategoryFile()
    callAPIListDocument()
    console.log('typeView: ', typeView)
  }, [toggleReload, reload])

  useEffect(() => {
    checkDocuments()
  }, [selectedItem])

  useEffect(() => {
    checkItemSelected()
  }, [lsDocument])

  useEffect(() => {
    setLoading(true)
    const subscription = DeviceEventEmitter.addListener('document', () => {
      setReload(Math.random())
    })
    return () => subscription.remove()
  }, [])

  const checkItemSelected = () => {
    var list = []
    for (var i = 0; i <= (passingData.data || []).length - 1; i++) {
      var idItemSelected = passingData.data[i]?.id.toString()
      var item = lsDocument.filter(val => val?.id === idItemSelected)
      var thuan = item[0]
      list.push(thuan)
    }
    setSelectedItem(list)
    console.log('list: ', list)
  }

  const callAPIListCategoryFile = () => {
    if (lsCategoryFile.length > 0) { return }
    dispatch(apiGetCategoryFile()).then(res => {
      console.log('Res: ', res)
      const getList = res?.payload?.categorie || []
      if (getList.length > 0) {
        Promise.all([
          dispatch(saveListCategoryFile(getList))
        ])
      }
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }

  const callAPIListDocument = () => {
    dispatch(apiGetDocument()).then(res => {
      console.log('documenti: ', res)
      const getList = res?.payload?.documenti || []
      setLSDocument(getList)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }

  const renderPlusButton = () => {
    return (
      <SOSButton
        source={isShow ? icVisit.ic_x : icVisit.ic_plus}
        backgroundColor={color3777EE}
        onPress={() => {
          setShow(true)
        }}
      />
    )
  }

  const renderSearchTextInput = () => {
    return (
      <View>
        <View style={styles.searchInput}>
          <View style={styles.searchIcon}>
            <Image source={icDoc.ic_search} style={styles.iconStyle} />
          </View>
          <TextInput
            style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.textInput]}
            placeholder={Translate(languageRedux).SEARCH}
            placeholderTextColor={colorA7A8A9}
          />
        </View>
      </View>
    )
  }

  const renderFlatlistFile = () => {
    const RenderItem = ({ item, index }) => {
      const _onPressSelection = () => {
        var selectID = [...selectedItem]
        if (selectID.includes(item)) {
          selectID = selectID.filter((val) => val?.id !== item?.id)
        }
        else {
          selectID.push(item)
        }
        setSelectedItem(selectID)
      }
      return (
        <TouchableOpacity onPress={_onPressSelection}
          style={selectedItem.includes(item) ? styles.boxDocument2 : styles.boxDocument}>
          <View style={styles.nameDoc}>
            <Text numberOfLines={1} style={customTxt(Fonts.Medium, 16, color040404).txt}>{item?.title || item?.name}</Text>
            <View style={styles.marginB4} />
            <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>{convertDMMMYYYY(Number(item?.insertDate))}</Text>
          </View>
          <View style={styles.checkBox}>
            <Image source={selectedItem.includes(item) ? icDoc.ic_active_box : icDoc.ic_empty_box} style={styles.iconStyle} />
          </View>
        </TouchableOpacity>
      )
    }
    return (
      <View style={styles.marginT14}>
        <FlatList
          data={lsDocument}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const _onRefresh = () => {
    setRefresh(true)
    setToggleReload(Math.random())
    setTimeout(() => {
      setRefresh(false)
    }, 3000)
  }

  const checkDocuments = () => {
    var list = []
    for (var i = 0; i <= (selectedItem || []).length - 1; i++) {
      var item = {}
      item.id = selectedItem[i]?.id
      list.push(item)
    }
    setListDocuments(list)
    console.log('selectIdAfter: ', list)
  }

  const _onPressSave = () => {
    const body = {
      slotId: passingData?.id,
      documents: listDocumnets
    }
    console.log('BODY: ', body)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/addAppointmentDocuments`,
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
    DeviceEventEmitter.emit(Routes.DETAIL_APPOINTMENT_SCREEN)
    DeviceEventEmitter.emit('updateDocAna')
    NavigationService.goBack()
  }

  const _onPressSaveRequest = () => {
    const body = {
      slotRequestId: passingData?.id,
      documents: listDocumnets
    }
    console.log('BODY: ', body)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/addSlotRequestDocuments`,
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
    DeviceEventEmitter.emit(Routes.DETAIL_WAITING_SCREEN)
    NavigationService.goBack()
  }

  return (
    <View style={styles.flex}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_close}
        textCenter={Translate(languageRedux).DOCUMENT_LIST}
        textButtonRight={Translate(languageRedux).btnsave}
        backgroundColorRight={color3777EE}
        textRightColor={colorFFFFFF}
        onPressRight={typeView === 'request' ? _onPressSaveRequest : _onPressSave}
        textRight={Translate(languageRedux).btnsave}
      />
      <ScrollView
        style={styles.textTop}
        contentContainerStyle={styles.paddingB100}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={_onRefresh}
            tintColor={color0B40B1}
          />
        }>
        <Text style={customTxt(Fonts.SemiBold, 20, color363636).txt}>
          {Translate(languageRedux).TITLE_DOCUMENT_LIST}
        </Text>
        <View style={styles.marginB8} />
        <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
        {renderSearchTextInput()}
        {renderFlatlistFile()}
      </ScrollView>
      {isShow === false && renderPlusButton()}
      {isShow && (
        <View style={[styles.floatView]}>
          <NewDocumentFloating
            onPressCancel={() => {
              setShow(false)
            }}
            routeViewFromDoctor={false}
          />
        </View>
      )}
      {loading && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  buttonSave: {
    backgroundColor: 'gray'
  },
  marginB8: {
    marginBottom: 8
  },
  marginT14: {
    marginTop: 14
  },
  marginB4: {
    marginBottom: 4
  },
  paddingB100: {
    paddingBottom: 100
  },
  textTop: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: 20
  },
  searchInput: {
    marginTop: 16,
    height: 56,
    width: '100%',
    borderRadius: 12,
    backgroundColor: colorFFFFFF,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    flexDirection: 'row'
  },
  textInput: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 12
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  searchIcon: {
    paddingVertical: 16,
    marginLeft: 16
  },
  boxDocument: {
    height: 72,
    width: '100%',
    backgroundColor: colorFFFFFF,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  boxDocument2: {
    height: 72,
    width: '100%',
    backgroundColor: colorEAF1FF,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  nameDoc: {
    marginTop: 14,
    marginLeft: 14,
    flex: 1
  },
  checkBox: {
    paddingVertical: 24,
    marginRight: 16
  },
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  }
})
