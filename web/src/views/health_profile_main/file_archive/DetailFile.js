import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, DeviceEventEmitter, TouchableOpacity, Platform, Linking } from 'react-native'
// import { useSelector } from 'react-redux'
// import axios from 'axios'
// import * as APIs from '../../../api/APIs'
// import DocumentPicker from 'react-native-document-picker'
// import RNFetchBlob from 'rn-fetch-blob'
import moment from 'moment'
// import RNHTMLtoPDF from 'react-native-html-to-pdf'
// import RNPrint from 'react-native-print'
// import Share from 'react-native-share'

import { colorFFFFFF, colorF0F0F0, color3777EE, colorA7A8A9, color040404, colorDDDEE1 } from '../../../constants/colors'
import { customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'
import Translate from '../../../translate'
import NavigationService from '../../../routes'
import { convertBirthdate, getDate112000, convertDMMMYYYY } from '../../../constants/DateHelpers'

import icHeader from '../../../../assets/images/header'
import icHealthProfile from '../../../../assets/images/health_profile'
import icDoc from '../../../../assets/images/document'

import Header from '../../../components/Header'
import FunctionButton from '../medical_records/PersonalInfo/FunctionButton'
import CustomTextInput from '../../healthProfile/components/CustomTextInput'
// import SearchListWithName from '../../../components/SearchListWithName'
import LoadingView from '../../../components/LoadingView'
// import CustomDatePicker from 'components/CustomDatePicker'

export default function DetailFile({ route }) {

  const passingData = route?.params?.data
  const languageRedux = ''//useSelector(state => state.common.language)
  const lsCategoryFile = []//useSelector(state => state.common.listCategoryFile)
  const [isShow, setShow] = useState(false)
  const [isLoad, setLoading] = useState(true)
  const [edit, setEdit] = useState(false)
  const [revoke, setRevoke] = useState(false)
  const datePickerRef = React.createRef()
  const [isShowCategory, setShowCategory] = useState(false)
  const [pdfBase64, setPDFBase64] = useState()
  const [data, setData] = useState()

  useEffect(() => {
    revoke && deleteFile()
  }, [revoke])

  useEffect(() => {
    callAPIDetail()
  }, [])

  const _onPressPrintImage = async () => {
    // const results = await RNHTMLtoPDF.convert({
    //   html: `
    //   <img src='data:image;base64,${data}' alt='${Translate(languageRedux).title}'>
    //   <hr class="solid">
    //   <h1>${Translate(languageRedux).title}</h1>
    //   <h2>${passingData?.name}</h2>
    //   <hr class="solid">
    //   <h1>${Translate(languageRedux).category}</h1>
    //   <h2>${passingData?.categoryName}</h2>
    //   <hr class="solid">
    //   <h1>${Translate(languageRedux).report_date}</h1>
    //   <h2>${convertBirthdate(date)}</h2>
    //   <hr class="solid">
    //   <h1>${Translate(languageRedux).description}</h1>
    //   <h2>${description}</h2>
    //   `,
    //   fileName: title,
    //   base64: true
    // })
    // await RNPrint.print({ filePath: results.filePath })
  }

  const _onPressPrintFile = async () => {
    // const results = await RNHTMLtoPDF.convert({
    //   html: `
    //   <img src='data:application/pdf;base64,${data}' alt='${Translate(languageRedux).title}'>
    //   `,
    //   fileName: title,
    //   base64: true
    // })
    // await RNPrint.print({ filePath: results.filePath })
  }

  const _onPressShare = () => {
    // let options = {
    //   url: `data:image;base64,${data}`,
    //   filename: title
    // }
    // Share.open(options)
    //   .then(res => {
    //     console.log(res)
    //     if (Platform.OS === 'ios') {
    //       Linking.openURL('photos-redirect://')
    //     } else if (Platform.OS === 'android') {
    //       Linking.openURL('content://media/internal/images/media')
    //     }
    //   })
    //   .catch(err => {
    //     err && console.log(err)
    //   })
  }

  const deleteFile = () => {
    // axios({
    //   method: 'delete',
    //   url: `${APIs.hostAPI}backoffice/disman/deleteFile/${passingData?.id}`,
    //   headers: {
    //     'x-auth-token': token
    //   }
    // })
    //   .then(response => {
    //     console.log('Delete successful', response)
    //   })
    //   .catch(error => {
    //     console.error('There was an error!', error)
    //   })
  }

  const callAPIDetail = () => {
    // axios({
    //   method: 'get',
    //   url: `${APIs.hostAPI}backoffice/disman/getBase64Doc/${passingData?.id}`,
    //   headers: {
    //     'content-type': 'application/json',
    //     'x-auth-token': token
    //   }
    // })
    //   .then(response => {
    //     // console.log('data: ', response.data)
    //     if (response.data.length === 0) {
    //       console.log('noti: ', 'can not get data')
    //     } else {
    //       console.log('noti: ', 'data has been obtained (document)')
    //       const getList = response.data.base64Doc || []
    //       setData(getList)
    //       // console.log('data: ', data)
    //     }
    //     setLoading(false)
    //   })
    //   .catch(error => {
    //     setLoading(false)
    //     console.log(error)
    //   })
  }

  const [title, setTitle] = useState(passingData?.title || '')
  const [categoryName, setCategoryName] = useState(passingData?.categoryName || '')
  const [date, setDate] = useState(passingData?.reportDate)
  const [description, setDescription] = useState(passingData?.description || '')
  const [filePath, setFilePath] = useState()

  const renderUploadFile = () => {
    return (
      <View>
        <Text style={customTxt(Fonts.SemiBold, 14, color040404).txt}>
          {Translate(languageRedux).UPLOAD_FILE}
        </Text>
        <View style={styles.ctnLayout}>
            <View style={styles.flex1}>
              <Text numberOfLines={2} style={customTxt(Fonts.Regular, 16, color040404).txt}>
                {filePath ? filePath?.name : passingData?.filename}
              </Text>
            </View>
          <TouchableOpacity onPress={_onPressUploadFile} style={styles.changeButton}>
            <Text style={customTxt(Fonts.SemiBold, 16, colorFFFFFF).txt}>
              {Translate(languageRedux).CHANGE}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const _onPressUploadFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles]
      })
      console.log('res : ', res)
      console.log('res : ' + JSON.stringify(res))
      console.log('URI : ' + res.uri)
      console.log('Type : ' + res.type)
      console.log('File Name : ' + res.name)
      console.log('File Size : ' + res.size)
      setFilePath(res)

      if (res?.uri) {
        const resBase64 = await convertUrltoBase64(res?.uri)
        console.log('resBase64: ', resBase64)
        setPDFBase64(resBase64)
      }

    } catch (err) {
      console.log('err : ', err)
      // User cancelled the picker, exit any dialogs or menus and move on
    }
  }

  const convertUrltoBase64 = async (url) => {
    // const fs = RNFetchBlob.fs
    // let imagePath = null
    // let imgBase64 = ''
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
    // return imgBase64
  }

  const renderEdit = () => {
    return (
      <View style={styles.ctnItem}>
        {renderUploadFile()}
        <CustomTextInput
          title={Translate(languageRedux).title}
          value={title || ''}
          onChangeTxt={(txt) => setTitle(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
        <CustomTextInput
          title={Translate(languageRedux).category}
          value={categoryName?.name || categoryName || ''}
          onChangeTxt={(txt) => setCategoryName(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          onPress={() => {setShowCategory(true)}}
          iconRight={icDoc?.ic_dropdown}
        />
        <CustomTextInput
          title={Translate(languageRedux).report_date}
          value={date ? convertDMMMYYYY(date) : ''}
          onChangeTxt={(txt) => setDate(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icDoc.ic_choose_date}
          onPress={() => {datePickerRef.current.onPressDate()}}
        />
        <CustomTextInput
          title={Translate(languageRedux).description}
          value={description || ''}
          onChangeTxt={(txt) => setDescription(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
      </View>
    )
  }

  const RenderItem = ({category, content}) => {
    return (
      <View style={styles.ctnItem}>
        <Text style={customTxt(Fonts.SemiBold, 12, colorA7A8A9).txt}>
          {category}
        </Text>
        <Text
          style={[
            customTxt(Fonts.Regular, 16, color040404).txt,
            styles.marginT8
          ]}>
          {content}
        </Text>
        <View style={styles.divider} />
      </View>
    )
  }

  const renderFileName = () => {
    return (
      <View style={styles.ctnItem}>
        <View style={styles.fileName}>
          <Image source={icHealthProfile.ic_file} style={styles.iconFile} />
          <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginL16]}>
            {passingData?.filename}
          </Text>
        </View>
        <View style={styles.divider} />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View>
        {renderFileName()}
        <RenderItem
          category={Translate(languageRedux).title}
          content={passingData?.title}
        />
        <RenderItem
          category={Translate(languageRedux).category}
          content={passingData?.categoryName}
        />
        <RenderItem
          category={Translate(languageRedux).report_date}
          content={convertDMMMYYYY(Number(passingData?.reportDate))}
        />
        <RenderItem
          category={Translate(languageRedux).description}
          content={passingData?.description}
        />
      </View>
    )
  }

  const _onPressDeleteFile = () => {
    setRevoke(true)
    DeviceEventEmitter.emit('update')
    NavigationService.goBack()
  }

  const _onChangeDatePicker = date => {
    setDate(date)
  }

  const onPressClose = () => {
    setEdit(false)
    setFilePath()
    setTitle(passingData?.name)
    setCategoryName(passingData?.category)
    setDate(Number(passingData?.insertDate))
    setDescription(passingData?.description)
  }

  const dateLocal = moment(date).local().format('YYYY-MM-DD')
  const UTCDate = moment(dateLocal).utc().valueOf()

  const updateFile = () => {
    const body = {
      categoryId: categoryName?.id || passingData?.idCategory,
      reportDate: UTCDate,
      description: description,
      name: title,
      id: passingData?.id,
      file: {
        filetype: filePath?.type,
        filename: filePath?.name,
        filesize: filePath?.size,
        base64: pdfBase64
      }
    }
    // axios({
    //   method: 'put',
    //   url: `${APIs.hostAPI}backoffice/disman/updateDocApp`,
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
    DeviceEventEmitter.emit('update')
    NavigationService.goBack()
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={
          edit
            ? Translate(languageRedux).EDIT_DOCUMENT
            : Translate(languageRedux).FILE_DETAILS
        }
        iconLeft={edit ? icHeader.ic_close : icHeader.ic_left}
        iconRight={edit === false && icHeader.ic_function}
        textRight={edit === true && Translate(languageRedux).btnsave}
        textRightColor={color3777EE}
        onPressLeft={() => {
          edit ? onPressClose() : NavigationService.goBack()
        }}
        onPressRight={() => {
          edit === true && updateFile()
          edit === true && setLoading(true)
          edit === true && setEdit(false)
          edit === false && setShow(true)
        }}
      />
      <ScrollView style={styles.marginT20}>
        {edit ? renderEdit() : renderBody()}
      </ScrollView>
      {/* <CustomDatePicker
        refDatePicker={datePickerRef}
        onChangeDate={_onChangeDatePicker}
        maxDate={new Date()}
      /> */}
      {isShow && (
        <View style={styles.floatView}>
          <FunctionButton
            onPressCancel={() => {
              setShow(false)
            }}
            onPressEdit={() => {
              setEdit(true)
              isShow === true && setShow(false)
            }}
            onPressDelete={_onPressDeleteFile}
            onPressDownLoad={_onPressShare}
            onPressPrint={passingData?.fileType === 'application/pdf'
            ? _onPressPrintFile : _onPressPrintImage}
            onPressShare={_onPressShare}
          />
        </View>
      )}
      {/* {isShowCategory && (
        <SearchListWithName
          listData={lsCategoryFile}
          title={Translate(languageRedux).CHOOSE_CATEGORY}
          itemSelected={categoryName}
          onItemClick={val => {
            setCategoryName(val)
            setShowCategory(false)
          }}
          onPressRight={() => {
            setShowCategory(false)
          }}
        />
      )} */}
      {isLoad && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  marginT20: {
    marginTop: 20
  },
  ctnItem: {
    marginHorizontal: 20,
    marginBottom: 16
  },
  marginT8: {
    marginTop: 8,
    marginBottom: 16
  },
  divider: {
    height: 1,
    backgroundColor: colorF0F0F0
  },
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  emergencyView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  imgEmergency: {
    width: 24,
    height: 24,
    marginTop: 24,
    marginRight: 16,
    marginBottom: 24
  },
  iconFile: {
    height: 32,
    width: 32
  },
  fileName: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center'
  },
  marginL16: {
    marginLeft: 16
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
  flex1: {
    flex: 1
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
  }
})
