import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, DeviceEventEmitter, Platform, Keyboard, Image } from 'react-native'
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSelector } from 'react-redux'
import axios from 'axios'
import * as APIs from 'api/APIs'
import DocumentPicker from 'react-native-document-picker'
import RNFetchBlob from 'rn-fetch-blob'

import { color040404, color3777EE, colorA7A8A9, colorC1C3C5, colorDDDEE1, colorF0F0F0, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import { convertDMMMYYYY } from 'constants/DateHelpers'
import Translate from 'translate'
import NavigationService from 'navigation'
import { checkWhiteSpace } from 'constants/CheckWhiteSpace'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'

import icHeader from '../../../../assets/images/header'
import icDoc from '../../../../assets/images/document'
import icNA from '../../../../assets/images/new_appointment'

import Header from '../../../components/Header'
import CustomTextInput from '../../healthProfile/components/CustomTextInput'
import CustomDatePicker from '../../../components/CustomDatePicker'
import Button from '../../../components/Button'
import SearchListWithName from '../../../components/SearchListWithName'

export default function NewDocument({route}) {

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [since, setSince] = useState('')
  const [description, setDescription] = useState('')
  const datePickerRef = React.createRef()
  const [tempDatas, setTempDatas] = useState([])
  const [isShow, setShow] = useState(false)
  const token = useSelector(state => state.user.token)
  const [filePath, setFilePath] = useState({})
  const languageRedux = useSelector(state => state.common.language)
  const [pdfBase64, setPDFBase64] = useState()
  const [fileSize, setFileSize] = useState(false)
  const dataCategory = route?.params?.data
  const [dataNoti, setDataNoti] = useState()
  const [isShowNoti, setShowNoti] = useState(false)

  useEffect(() => {
    console.log('dataCategory: ', dataCategory)
  }, [])

  const renderUploadFile = () => {
    return (
      <View style={styles.changePass}>
        <Text style={customTxt(Fonts.SemiBold, 14, color040404).txt}>
          {Translate(languageRedux).UPLOAD_FILE}
        </Text>
        <View style={styles.ctnLayout}>
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
        <View style={{flexDirection: 'row', marginTop: 8, justifyContent: 'center'}}>
          <Image source={icNA.ic_info} style={{height: 18, width: 18, marginRight: 4}} />
          <Text style={[customTxt(Fonts.Regular, 14, color040404).txt]}>
            {Translate(languageRedux).howToDocuments}
          </Text>
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

      if (res?.uri) {
        let dirs = RNFetchBlob.fs.dirs

        if (Platform.OS === 'android') {
          const uriComponents = 'file://' + res.path
          // const fileNameAndExtension = urlComponents[uriComponents.length - 1]
          // const destPath = `${RNFS.TemporaryDirectoryPath}/${fileNameAndExtension}`
          console.log('Platform uri: ', res?.uri)
          const resBase64 = await convertUrltoBase64(uriComponents, res.type)
          console.log('resBase64: ', resBase64)
          if (resBase64) {
            setPDFBase64(resBase64)
          }
        } else {
          const resBase64 = await convertUrltoBase64(res?.uri, res.type)
          console.log('resBase64: ', resBase64)
          if (resBase64) {
            setPDFBase64(resBase64)
          }
        }
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

  const convertUrltoBase64 = async (url, type) => {
    const fs = RNFetchBlob.fs
    let imagePath = null
    let imgBase64 = ''
    console.log('URL: ', url)
    await RNFetchBlob.config({
      fileCache: true
    })
      .fetch('GET', url)
      .then((resp) => {
        imagePath = resp.path()
        console.log('imagePath', imagePath)
        return resp.readFile('base64')
      })
      .then((base64data) => {
        imgBase64 = base64data
        return fs.unlink(imagePath)
      })
    return imgBase64
  }

  const renderTextInput = () => {
    return (
      <View style={styles.marginH20}>
        <CustomTextInput
          title={Translate(languageRedux).title}
          value={title}
          onChangeTxt={txt => setTitle(txt)}
          validate={checkWhiteSpace(title) ? false : true}
          placeholder={Translate(languageRedux).ENTER_DOC_TITLE}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
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
        <CustomTextInput
          title={Translate(languageRedux).report_date}
          value={since ? convertDMMMYYYY(since) : ''}
          onChangeTxt={txt => setSince(txt)}
          validate={since ? false : true}
          iconRight={icDoc.ic_choose_date}
          onPress={() => datePickerRef.current.onPressDate()}
          placeholder={Translate(languageRedux).SELECT_A_DATE}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
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

  const checkDisableAddButton = () => {
    if (checkWhiteSpace(title) && category && since && fileSize) {
      return true
    } else {
      return false
    }
  }

  const renderButton = () => {
    return (
      <View style={styles.marginH20}>
        <Button
          text={Translate(languageRedux).add_new}
          backgroundColor={
            checkDisableAddButton() ? color3777EE : colorF0F0F0
          }
          textColor={checkDisableAddButton() ? colorFFFFFF : colorC1C3C5}
          disabled={checkDisableAddButton() ? false : true}
          onPress={_onPressAdd}
        />
      </View>
    )
  }

  const dateLocal = moment(since).local().format('YYYY-MM-DD')
  const UTCDate = moment(dateLocal).utc().valueOf()

  const addFile = () => {
    if (Platform.OS === 'ios' ? pdfBase64 : true) {
      const body = {
        categoryId: category?.id,
        reportDate: UTCDate,
        title: title,
        descrizione: description,
        file: {
          filetype: filePath?.type,
          filename: filePath?.name,
          filesize: filePath?.size,
          base64: Platform.OS === 'ios' ? pdfBase64 : 'saluber'
        }
      }
      axios({
        method: 'post',
        url: `${APIs.hostAPI}backoffice/disman/uploadFile`,
        headers: {
          'x-auth-token': token
        },
        data: body
      })
        .then(response => {
          console.log('data: ', response.data)
          DeviceEventEmitter.emit('updateDoc')
          NavigationService.goBack()
        })
        .catch(error => {
          console.error('There was an error!', error)
        })
    }
  }

  const _onPressAdd = () => {
    Keyboard.dismiss()
    addFile()
  }

  const _onChangeDatePicker = date => {
    setSince(date)
  }

  const renderBody = () => {
    return (
      <View>
        {renderUploadFile()}
        {renderTextInput()}
        {renderButton()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).NEW_DOCUMENT}
        iconRight={icHeader.ic_close}
        onPressRight={() => { NavigationService.goBack() }}
      />
      <KeyboardAwareScrollView>
        {renderBody()}
      </KeyboardAwareScrollView>
      <CustomDatePicker
        refDatePicker={datePickerRef}
        onChangeDate={_onChangeDatePicker}
        maxDate={new Date()}
        date={since}
      />
      {isShow && (
        <SearchListWithName
          listData={dataCategory}
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
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  floatingView: {
    backgroundColor: colorFFFFFF,
    height: '100%'
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
    marginHorizontal: 20
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
  }
})
