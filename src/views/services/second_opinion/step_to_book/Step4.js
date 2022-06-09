import React, { useState, useEffect } from 'react'
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image} from 'react-native'
import { useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/Feather'
import DocumentPicker from 'react-native-document-picker'
import RNFetchBlob from 'rn-fetch-blob'
import IconClose from 'react-native-vector-icons/Fontisto'

import {colorFFFFFF, color040404, color3777EE, colorE53E3E} from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from '../../../../translate'

import icDelete from '../../../../../assets/images/reminder'

export default function Step4({onPressNext, setListDataFile, listDataFile}) {
  const languageRedux = useSelector(state => state.common.language)
  const [filePath, setFilePath] = useState()
  const [pdfBase64, setPDFBase64] = useState()
  const [listFile, setListFile] = useState([])

  useEffect(() => {
    convertListFile()
    saveListDataFile()
  }, [filePath])

  const convertListFile = () => {
    var data = [...listFile]
    var item = {}
    item.fileName = filePath?.name
    data.push(item)
    setListFile(data)
  }

  const saveListDataFile = async () => {
    var data = [...listDataFile]
    var item = {}
    item.filename = filePath?.name
    item.filetype = filePath?.type
    item.filesize = filePath?.size
    if (filePath?.uri) {
      const resBase64 = await convertUrltoBase64(filePath?.uri)
      item.base64 = resBase64
    }
    // item.base64 = pdfBase64
    data.push(item)
    setListDataFile(data)
    console.log('data2: ', data)
  }

  const _onPressUploadFile = async () => {
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
        // setPDFBase64(resBase64)
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

  const RenderItem = ({item, index}) => {
    const _onPressDeleteItem = () => {
      const listAfterDelete = listFile.filter((val) => val !== item)
      setListFile(listAfterDelete)
    }
    return (
      <View>
        {item?.fileName !== undefined && <View style={styles.ctnItem}>
          <Text numberOfLines={1} style={[customTxt(Fonts.Regular, 16, color3777EE).txt]}>
            {item?.fileName}
          </Text>
          <TouchableOpacity style={styles.marginL8} onPress={_onPressDeleteItem}>
            {/* <Image source={icDelete.ic_close_blue} style={styles.iconStyle} /> */}
            <IconClose name={'close'} size={19} color={colorE53E3E} />
          </TouchableOpacity>
        </View>}
      </View>
    )
  }

  const renderFlatlist = () => {
    return (
      <View style={styles.ctnFlatlist}>
        <FlatList
          data={listFile}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnContent}>
        <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt]}>
          {Translate(languageRedux).SOP_Q4}
        </Text>
        <View style={styles.ctnButton}>
          <TouchableOpacity onPress={_onPressUploadFile} style={styles.button}>
            <Icon name={'upload'} size={22} color={color3777EE} />
            <Text style={[customTxt(Fonts.Regular, 14, color3777EE).txt, styles.marginL8]}>
              {Translate(languageRedux).SEE_A_DOCTOR_Q4_S1}
            </Text>
          </TouchableOpacity>
        </View>
        {renderFlatlist()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView>{renderBody()}</ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF,
    marginHorizontal: 20
  },
  ctnContent: {
    paddingHorizontal: 16
  },
  ctnButton: {
    marginTop: 8,
    alignItems: 'center'
  },
  marginL8: {
    marginLeft: 8
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderColor: color3777EE
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  ctnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginTop: 8,
    justifyContent: 'space-between'
  },
  ctniconRight: {
    alignItems: 'center',
    marginTop: 16,
    height: 48,
    width: 117,
    backgroundColor: color3777EE,
    alignSelf: 'flex-end',
    borderRadius: 16,
    justifyContent: 'center'
  },
  ctnFlatlist: {
    marginTop: 8
  }
})
