import React, { useState, useEffect } from 'react'
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList, Platform, ScrollView} from 'react-native'
import { useSelector } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'
import _ from 'lodash'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {color000000, colorFFFFFF, color040404, color3777EE, colorDDDEE1, colorF56565} from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from 'translate'
import {checkWhiteSpace} from 'constants/CheckWhiteSpace'

import icHeader from '../../../../../assets/images/header'
import icDoc from '../../../../../assets/images/document'

import CustomTextInput from '../../../healthProfile/components/CustomTextInput'
import Button from 'components/Button'
import SearchListWithName from 'components/SearchListWithName'

export default function NewMess({onPressClose, patientId, setStatus, setShowNotiAdd}) {
  const languageRedux = useSelector(state => state.common.language)
  const [topic, setTopic] = useState()
  const [message, setMessage] = useState()
  const [tag, setTag] = useState()
  const [listTag, setListTag] = useState()
  const [isSearchListTag, setSearchListTag] = useState(false)
  const token = useSelector(state => state.user.token)
  const [listChoose, setListChoose] = useState([])
  const [listChooseId, setListChooseId] = useState([])
  const [listIdTag, setListIdTag] = useState([])

  useEffect(() => {
    callAPIListTag()
  }, [])

  useEffect(() => {
    checkListTagSelected()
  }, [listChoose])

  const checkListTagSelected = () => {
    var data = []
    for (var i = 0; i < (listChoose || []).length; i++) {
      var item = listChoose[i]?.id
      data.push(item)
    }
    setListIdTag(data)
  }

  const callAPIListTag = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/disman/getSocialTags`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        console.log('tag: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (document)')
          const getList = response.data.socialTags || []
          Promise.all(setListTag(getList))
        }
      })
      .catch(error => {
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
              {Translate(languageRedux).NEW_MESSAGE}
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

  const renderTags = () => {
    const RenderItem = ({item, index, data}) => {
      return (
        <View style={styles.ctnItem}>
          <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
            {item?.name}{index === (data || []).length - 1 ? null : ', '}
          </Text>
        </View>
      )
    }
    return (
      <View>
        <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt, styles.marginT16]}>
          {Translate(languageRedux).ADD_A_TAG}
        </Text>
        <TouchableOpacity onPress={() => {
          setSearchListTag(true)
        }} style={(listChoose || []).length > 0 ? styles.tagsView : styles.tagsView2}>
          <View>
            <FlatList
              data={listChoose}
              horizontal={true}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <RenderItem item={item} index={index} data={listChoose} />
              )}
            />
          </View>
          <Image source={icDoc.ic_dropdown} style={styles.iconStyle} />
        </TouchableOpacity>
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        <CustomTextInput
          title={Translate(languageRedux).TOPIC}
          value={topic}
          onChangeTxt={(txt) => setTopic(txt)}
          validate={checkWhiteSpace(topic) ? false : true}
        />
        <CustomTextInput
          title={Translate(languageRedux).message}
          value={message}
          onChangeTxt={(txt) => setMessage(txt)}
          multiline={true}
          textinputStyle={styles.txtMessage}
          validate={checkWhiteSpace(message) ? false : true}
        />
        {renderTags()}
        <Button
          text={Translate(languageRedux).SEND_BTN}
          textColor={colorFFFFFF}
          backgroundColor={color3777EE}
          viewStyle={styles.marginT32}
          onPress={_onPressSend}
        />
      </View>
    )
  }

  const _onPressSend = () => {
    const body = {
      subject: topic,
      text: message,
      tags: listIdTag
    }
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/disman/sendMessageNew/${patientId}`,
      headers: {
        'x-auth-token': token
      },
      data: body
    })
      .then(response => {
        setShowNotiAdd(true)
        console.log('data: ', response.data)
        setStatus(response.data)
        onPressClose()
      })
      .catch(error => {
        console.error('There was an error!', error)
        onPressClose()
      })
  }

  const checkTagChoosen = (valueItem) => {
    var selectID = [...listChooseId]
    if (_.includes(selectID, valueItem?.id)) {
      selectID = selectID.filter((val) => val !== valueItem?.id)
    } else {
      selectID.push(valueItem?.id)
    }
    setListChooseId(selectID)
    console.log('selectID: ', selectID)
    var dataListId = []
    for (var i = 0; i < (selectID || []).length; i++) {
      var listFilter = listTag.filter((val) => val?.id === selectID[i])
      if ((listFilter || []).length > 0) {
        dataListId.push(listFilter[0])
      }
    }
    setListChoose(dataListId)
    console.log('dataList: ', dataListId)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.bgOpacity} onPress={onPressClose} />
      {Platform.OS === 'ios' && (
        <View style={styles.fullView}>
          {renderTop()}
          <KeyboardAwareScrollView>{renderBody()}</KeyboardAwareScrollView>
        </View>
      )}
      {Platform.OS === 'android' && (
        <ScrollView contentContainerStyle={styles.floatingViewAndroid}>
          {renderTop()}
          <ScrollView contentContainerStyle={styles.paddingB42}>
            {renderBody()}
          </ScrollView>
        </ScrollView>
      )}
      {isSearchListTag && (
        <SearchListWithName
          listData={listTag}
          title={Translate(languageRedux).CHOOSE_A_TAG}
          itemSelected={tag}
          listItemSelected={listChooseId}
          onItemClick={val => {
            checkTagChoosen(val)
            setSearchListTag(false)
          }}
          onPressRight={() => {
            setSearchListTag(false)
          }}
          isTag={true}
        />
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
  ctnBody: {
    marginHorizontal: 16
  },
  txtMessage: {
    height: 108
  },
  marginT32: {
    marginTop: 32
  },
  tagsView: {
    height: 48,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    borderRadius: 12,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    justifyContent: 'space-between'
  },
  tagsView2: {
    height: 48,
    borderWidth: 1,
    borderColor: colorF56565,
    borderRadius: 12,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    justifyContent: 'space-between'
  },
  marginT16: {
    marginTop: 16
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  ctnItem: {
    justifyContent: 'center'
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
