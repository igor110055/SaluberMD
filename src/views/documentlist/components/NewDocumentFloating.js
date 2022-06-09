import React, { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  TextInput, Dimensions, DeviceEventEmitter, Platform
} from 'react-native'
import { useSelector } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../api/APIs'
import DocumentPicker from 'react-native-document-picker'
import RNFetchBlob from 'rn-fetch-blob'
import moment from 'moment'
import _ from 'lodash'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { color000000, color040404, color3777EE, colorA7A8A9,
  colorC1C3C5, colorDDDEE1, colorF0F0F0, colorFFFFFF, colorF56565 } from '../../../constants/colors'
import { customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'
import { convertDMMMYYYY } from '../../../constants/DateHelpers'
import { checkWhiteSpace } from 'constants/CheckWhiteSpace'
import Translate from '../../../translate'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'

import icHeader from '../../../../assets/images/header'
import icDoc from '../../../../assets/images/document'

import CustomTextInput from '../../healthProfile/components/CustomTextInput'
import CustomDatePicker from '../../../components/CustomDatePicker'
import Button from '../../../components/Button'
import SearchListWithName from '../../../components/SearchListWithName'
import { ScrollView } from 'react-native-gesture-handler'

export default function NewDocumentFloating({ onPressCancel, routeViewFromDoctor, patientId,
  listCategoryFile, setStatus, setShowNotiAdd, webconferenceId}) {

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [since, setSince] = useState('')
  const [description, setDescription] = useState('')
  const datePickerRef = React.createRef()
  const [tempDatas, setTempDatas] = useState([])
  const lsCategoryFile = useSelector(state => state.common.listCategoryFile)
  const [isShow, setShow] = useState(false)
  const token = useSelector(state => state.user.token)
  const [filePath, setFilePath] = useState()
  const [pdfBase64, setPDFBase64] = useState()
  const languageRedux = useSelector(state => state.common.language)
  const [dataNoti, setDataNoti] = useState()
  const [isShowNoti, setShowNoti] = useState()
  const [fileSize, setFileSize] = useState(false)

  useEffect(() => {
    console.log('routeViewFromDoctor: ', routeViewFromDoctor)
    console.log('webconferenceId: ', webconferenceId)
    routeViewFromDoctor && setStatus()
  }, [])

  const renderTop = () => {
    return (
      <View>
        <View style={styles.ctnTitle}>
          <View style={styles.flex1} />
          <View style={styles.ctnSOS}>
            <Text style={customTxt(Fonts.SemiBold, 18, color000000).txt}>
              {Translate(languageRedux).NEW_DOCUMENT}
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

  const renderUploadFile = () => {
    return (
      <View style={styles.changePass}>
        <Text style={customTxt(Fonts.SemiBold, 14, color040404).txt}>
          {Translate(languageRedux).UPLOAD_FILE}
        </Text>
        <View style={(filePath?.name || []).length > 0 ? styles.ctnLayout : styles.ctnLayout2}>
          <View style={styles.flex1}>
            <Text
              numberOfLines={2}
              style={customTxt(Fonts.Regular, 16, color040404).txt}>
              {(filePath?.name || []).length > 0
                ? filePath?.name
                : Translate(languageRedux).UPLOAD_DOC_PLACEHOLDER}
            </Text>
          </View>
          <TouchableOpacity
            onPress={_onPressUpload}
            style={styles.changeButton}>
            <Text style={customTxt(Fonts.SemiBold, 16, colorFFFFFF).txt}>
              {(filePath?.name || []).length > 0
                ? Translate(languageRedux).CHANGE
                : Translate(languageRedux).UPLOAD}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const _onPressUpload = () => {
    handleUploadFile()
  }

  const handleUploadFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles]
      })
      console.log('res : ' + JSON.stringify(res))
      console.log('URI : ' + res.uri)
      console.log('Type : ' + res.type)
      console.log('File Name : ' + res.name)
      console.log('File Size : ' + res.size)
      console.log('Base64 : ' + res.base64)
      setFilePath(res)
      fileSizeFunction(res?.size)

      if ((res?.uri || []).length > 0) {
        const resBase64 = Platform.OS === 'ios' ? convertUrltoBase64(res?.uri) : convertUrltoBase64Android(res?.uri)
        console.log('resBase64: ', resBase64)
        setPDFBase64(resBase64)
      }

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('err : ', err)
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err
      }
    }
  }

  const fileSizeFunction = (size) => {
    var sizeMB = size / (1024 * 1024)
    console.log('sizeMB: ', sizeMB)
    if (sizeMB <= 5) {
      setFileSize(true)
    } else {
      setShowNoti(true)
      setDataNoti({
        status: STATUS_NOTIFY.ERROR,
        content: Translate(languageRedux).removeLargeFiles
      })
    }
  }

  const convertUrltoBase64 = async (url) => {
    const fs = RNFetchBlob.fs
    let imagePath = null
    let imgBase64 = ''
    RNFetchBlob.fetch('GET', url)
    .then((resp) => {
      console.log('resp: ', resp)
      let base64Str = resp?.base64('base64')
      console.log('base64', base64Str)
      imgBase64 = base64Str
    })
    .then((base64data) => {
      return fs.unlink(imagePath)
    })
    return imgBase64
  }

  const convertUrltoBase64Android = async (url) => {
    const fs = RNFetchBlob.fs
    const base64 = RNFetchBlob.base64
    let imagePath = null
    let imgBase64 = ''
    let task = RNFetchBlob.axios({
      method: 'get',
      url: url
    })
    task.then((resp) => {
      imagePath = resp.path()
      let base64Str = resp?.base64('base64')
      console.log('base64', base64Str)
      console.log('imagePath', imagePath)
      imgBase64 = base64Str
    })
    .then((base64data) => {
      return fs.unlink(imagePath)
    })
    .catch((errorMessage, statusCode) => {
      console.log('errorMessage', errorMessage)
      console.log('statusCode', statusCode)
    })
    return imgBase64
  }

  const renderTextInput = () => {
    return (
      <View style={styles.marginH20}>
        {routeViewFromDoctor === false && <CustomTextInput
          title={Translate(languageRedux).title}
          value={title}
          onChangeTxt={txt => setTitle(txt)}
          validate={checkWhiteSpace(title) ? false : true}
          placeholder={Translate(languageRedux).ENTER_DOC_TITLE}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />}
        <CustomTextInput
          title={Translate(languageRedux).category}
          value={category?.name}
          onChangeTxt={txt => setCategory(txt)}
          validate={category ? false : true}
          iconRight={icDoc.ic_dropdown}
          onPress={() => { setShow(true) }}
          placeholder={Translate(languageRedux).SELECT_A_CATEGORY}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
        {routeViewFromDoctor === false && <CustomTextInput
          title={Translate(languageRedux).report_date}
          value={since ? convertDMMMYYYY(since) : ''}
          onChangeTxt={txt => setSince(txt)}
          validate={since ? false : true}
          iconRight={icDoc.ic_choose_date}
          onPress={() => datePickerRef.current.onPressDate()}
          placeholder={Translate(languageRedux).SELECT_A_DATE}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />}
        <View style={styles.ctnDes}>
          <Text style={customTxt(Fonts.SemiBold, 14, color040404).txt}>
            {Translate(languageRedux).description}
          </Text>
          <View style={styles.ctnTextInput}>
            <TextInput
              style={[
                customTxt(Fonts.Regular, 16, color040404).txt,
                styles.textInputFloat
              ]}
              multiline={true}
              value={description}
              onChangeText={text => setDescription(text)}
            />
          </View>
        </View>
      </View>
    )
  }

  const renderButton = () => {
    return (
      <View style={styles.marginH20}>
        <Button
          text={Translate(languageRedux).add_new}
          backgroundColor={
            (
              routeViewFromDoctor
                ? filePath && category && fileSize
                : checkWhiteSpace(title) && category && since && filePath && fileSize
            )
              ? color3777EE
              : colorF0F0F0
          }
          textColor={
            (
              routeViewFromDoctor
                ? filePath && category && fileSize
                : checkWhiteSpace(title) && category && since && filePath && fileSize
            )
              ? colorFFFFFF
              : colorC1C3C5
          }
          disabled={
            (
              routeViewFromDoctor
                ? filePath && category && fileSize
                : checkWhiteSpace(title) && category && since && filePath && fileSize
            )
              ? false
              : true
          }
          onPress={_onPressAdd}
        />
      </View>
    )
  }

  const dateLocal = moment(since).local().format('YYYY-MM-DD')
  const UTCDate = moment(dateLocal).utc().valueOf()

  const addFile = () => {
    const body = {
      categoryId: category?.id,
      reportDate: UTCDate,
      title: title,
      descrizione: description,
      file: {
        filetype: filePath?.type,
        filename: filePath?.name,
        filesize: filePath?.size,
        base64: pdfBase64
      }
    }
    const bodyFromDoctor = {
      categoryId: category?.id,
      descrizione: description,
      file: {
        filetype: filePath?.type,
        filename: filePath?.name,
        filesize: filePath?.size,
        base64: pdfBase64
      },
      patientId: patientId
    }
    const bodyAddAttachment = {
      categoryId: category?.id,
      webconferenceId: webconferenceId,
      descrizione: description,
      file: {
        filetype: filePath?.type,
        filename: filePath?.name,
        filesize: filePath?.size,
        base64: pdfBase64
      },
      patientId: patientId
    }
    console.log('body: ', routeViewFromDoctor ? (webconferenceId ? bodyAddAttachment : bodyFromDoctor) : body)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/disman/uploadFile`,
      headers: {
        'x-auth-token': token
      },
      data: routeViewFromDoctor ? (webconferenceId ? bodyAddAttachment : bodyFromDoctor) : body
    })
      .then(response => {
        console.log('data: ', response.data)
        setShowNoti(true)
        setShowNotiAdd(true)
        if (_.includes([0, '0'], response?.data?.esito)) {
          setStatus(response?.data?.esito)
          setDataNoti({
            status: STATUS_NOTIFY.SUCCESS,
            content: 'Add document successful'
          })
        }
        if (_.includes([1, '1'], response?.data?.esito)) {
          setStatus(response?.data?.esito)
          setDataNoti({
            status: STATUS_NOTIFY.ERROR,
            content: 'Add document failed'
          })
        }
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
    DeviceEventEmitter.emit('document')
  }

  const _onPressAdd = () => {
    addFile()
    onPressCancel()
  }

  const _onChangeDatePicker = date => {
    setSince(date)
  }

  return (
    <View style={styles.containerFloat}>
      <TouchableOpacity
        style={styles.bgOpacity}
        onPress={onPressCancel}
      />
      {Platform.OS === 'ios' && <View style={styles.floatingView}>
        {renderTop()}
        <KeyboardAwareScrollView>
          {renderUploadFile()}
          {renderTextInput()}
          {renderButton()}
        </KeyboardAwareScrollView>
      </View>}
      {Platform.OS === 'android' &&
      <ScrollView contentContainerStyle={styles.floatingViewAndroid}>
        {renderTop()}
        {renderUploadFile()}
        {renderTextInput()}
        {renderButton()}
      </ScrollView>}
      <CustomDatePicker
          refDatePicker={datePickerRef}
          onChangeDate={_onChangeDatePicker}
          maxDate={new Date()}
          date={since}
      />
      {isShow && (
        <SearchListWithName
          listData={routeViewFromDoctor ? listCategoryFile : lsCategoryFile}
          title={Translate(languageRedux).LIST_CATEGORY_FILES}
          itemSelected={category}
          onItemClick={(val) => {
            setCategory(val)
            setShow(false)
          }}
          onPressRight={() => {
            setShow(false)
          }}
          lsHiden={tempDatas}
        />)}
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
  containerFloat: {
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
  floatingView: {
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    height: Dimensions.get('window').height - 50
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
  flex1: {
    flex: 1
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
  changePass: {
    marginTop: 16,
    marginHorizontal: 20
  },
  ctnLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    width: '100%',
    marginTop: 4,
    borderRadius: 12,
    paddingLeft: 16,
    color: colorA7A8A9,
    borderColor: colorDDDEE1,
    borderWidth: 1,
    justifyContent: 'space-between'
  },
  ctnLayout2: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    width: '100%',
    marginTop: 4,
    borderRadius: 12,
    paddingLeft: 16,
    color: colorA7A8A9,
    borderColor: colorF56565,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1
  },
  changeButton: {
    height: 48,
    backgroundColor: color3777EE,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    borderColor: color3777EE,
    paddingHorizontal: 8
  },
  marginH20: {
    marginHorizontal: 20,
    marginBottom: 42
  },
  ctnTextInput: {
    height: 72,
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    marginTop: 4
  },
  textInputFloat: {
    width: '100%',
    marginTop: 12,
    paddingLeft: 16,
    paddingRight: 16
  },
  ctnDes: {
    marginVertical: 16
  },
  floatingViewAndroid: {
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    height: Dimensions.get('window').height,
    top: 52
  }
})
