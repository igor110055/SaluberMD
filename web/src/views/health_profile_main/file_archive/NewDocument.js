import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, DeviceEventEmitter, ScrollView } from 'react-native'
import moment from 'moment'
// import DocumentPicker from 'react-native-document-picker'
// import RNFetchBlob from 'rn-fetch-blob'

import { color040404, color3777EE, colorA7A8A9, colorC1C3C5, colorDDDEE1, colorF0F0F0, colorFFFFFF } from '../../../constants/colors'
import { customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'
import { convertDMMMYYYY } from '../../../constants/DateHelpers'
import Translate from '../../../translate'
import NavigationService from '../../../routes'
import { checkWhiteSpace } from '../../../constants/CheckWhiteSpace'

import icHeader from '../../../../assets/images/header'
import icDoc from '../../../../assets/images/document'

import Header from '../../../components/Header'
import CustomTextInput from '../../healthProfile/components/CustomTextInput'
import CustomDatePicker from '../../../components/CustomDatePicker'
import Button from '../../../components/Button'
// import SearchListWithName from '../../../components/SearchListWithName'

export default function NewDocument() {

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [since, setSince] = useState('')
  const [description, setDescription] = useState('')
  const datePickerRef = React.createRef()
  const [tempDatas, setTempDatas] = useState([])
  const lsCategoryFile = []//useSelector(state => state.common.listCategoryFile)
  const [isShow, setShow] = useState(false)
  const token = useSelector(state => state.user.token)
  const [filePath, setFilePath] = useState({})
  const languageRedux = useSelector(state => state.common.language)
  const [pdfBase64, setPDFBase64] = useState()

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

      if (res?.uri) {
        const resBase64 = await convertUrltoBase64(res?.uri)
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

  const convertUrltoBase64 = async (url) => {
    const fs = RNFetchBlob.fs
    let imagePath = null
    let imgBase64 = ''
    // await RNFetchBlob.config({
    //   fileCache: true
    // })
    // .fetch('GET', url)
    // .then((resp)=> {
    //   imagePath = resp.path()
    //   console.log('imagePath', imagePath)
    //   return resp.readFile('base64')
    // })
    // .then((base64data) => {
    //   imgBase64 = 'data:image/png;base64,' + base64data
    //   return fs.unlink(imagePath)
    // })
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

  const renderButton = () => {
    return (
      <View style={styles.marginH20}>
        <Button
          text={Translate(languageRedux).add_new}
          backgroundColor={
            checkWhiteSpace(title) && category && since ? color3777EE : colorF0F0F0
          }
          textColor={checkWhiteSpace(title) && category && since ? colorFFFFFF : colorC1C3C5}
          disabled={checkWhiteSpace(title) && category && since ? false : true}
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
    // axios({
    //   method: 'post',
    //   url: `${APIs.hostAPI}backoffice/disman/uploadFile`,
    //   headers: {
    //     'x-auth-token': token
    //   },
    //   data: body
    // })
    //   .then(response => {
    //     console.log('data: ', response.data)
    //   })
    //   .catch(error => {
    //     console.error('There was an error!', error)
    //   })
  }

  const _onPressAdd = () => {
    addFile()
    DeviceEventEmitter.emit('update')
    NavigationService.goBack()
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
      <ScrollView>
        {renderBody()}
      </ScrollView>
      <CustomDatePicker
        refDatePicker={datePickerRef}
        onChangeDate={_onChangeDatePicker}
        maxDate={new Date()}
        date={since}
      />
      {/* {isShow && (
        <SearchListWithName
          listData={lsCategoryFile}
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
        />)} */}
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
