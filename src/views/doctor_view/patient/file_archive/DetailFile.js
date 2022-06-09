import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Platform } from 'react-native'
import { useSelector } from 'react-redux'

import { colorFFFFFF, color040404, colorF0F0F0, colorA7A8A9 } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from 'translate'
import NavigationService from 'navigation'
import { convertDMMMYYYY } from 'constants/DateHelpers'
import icHealthProfile from '../../../../../assets/images/health_profile'
import icHeader from '../../../../../assets/images/header'
import Header from 'components/Header'
import { ScrollView } from 'react-native-gesture-handler'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'
import LoadingView from 'components/LoadingView'
import { getUrlPDF, openFile } from '../../../../constants/utils'
import FileViewer from 'react-native-file-viewer'
import PDFView from 'react-native-view-pdf'

export default function DetailFile({ route }) {
  const languageRedux = useSelector(state => state.common.language)
  const passingData = route?.params?.data
  const patientToken = route?.params?.patientToken
  const [base64Data, setBase64data] = useState()
  const [isLoading, setLoading] = useState(false)
  const [isShowPopupp, setShowPopup] = useState(false)
  const [base64Image, setBase64Image] = useState()
  const [isShowPDF, setShowPDF] = useState(false)

  useEffect(() => {
    callAPIDetail()
  }, [])

  const getTypeFile = () => {
    const nameFile = passingData?.filename || ''
    const subStringName = nameFile.split('.',)

    if (subStringName.length > 1) {
      return checkTypeFile((subStringName[1] || '').toLowerCase(), passingData?.dettagli?.contentTyp)
    } else if (passingData?.dettagli?.contentType) {
      return checkTypeFile(passingData?.dettagli?.contentType)
    }
  }

  const checkTypeFile = async (type, contentType) => {
    const getType = passingData?.dettagli?.fileType
    switch (type) {
      case 'pdf':
      case 'application/pdf':
        const dataBase64Convert = `data:${getType ? getType : 'application/pdf'};base64,${(base64Data || '').replace('dataapplication/pdfbase64', '')}`
        console.log('data base 64: ', dataBase64Convert)
        // return null
        if (Platform.OS === 'ios') {
          return getUrlPDF(dataBase64Convert, passingData?.filename, getType, contentType).then(res => {
            try {
              console.log('URI: ', res)
              return openFile(res?.uri)
            } catch (error) { }
          })
        } else {
          return setShowPDF(true)
        }
      case 'doc':
        const dataBase64DocConvert = `data:${getType ? getType : 'application/msword'};base64,${base64Data}`
        return getUrlPDF(dataBase64DocConvert, passingData?.filename, getType).then(async res => {
          try {
            try {
              await FileViewer.open(res?.uri)
            } catch (e) {
              // error
            }
          } catch (error) { }
        })
      case 'docx':
        const dataBase64DocxConvert = `data:${getType ? getType : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'};base64,${base64Data}`
        return getUrlPDF(dataBase64DocxConvert, passingData?.filename, getType).then(async res => {
          try {
            try {
              await FileViewer.open(res?.uri)
            } catch (e) {
              // error
            }
          } catch (error) { }
        })
      case 'xls':
      case 'xlt':
      case 'xla':
        const dataBase64XlsConvert = `data:${getType ? getType : 'application/vnd.ms-excel'};base64,${base64Data}`
        return getUrlPDF(dataBase64XlsConvert, passingData?.filename, getType).then(async res => {
          try {
            try {
              await FileViewer.open(res?.uri)
            } catch (e) {
              // error
            }
          } catch (error) { }
        })
      case 'xlsx':
        const dataBase64XlsxcConvert = `data:${getType ? getType : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'};base64,${base64Data}`
        return getUrlPDF(dataBase64XlsxcConvert, passingData?.filename, getType).then(async res => {
          try {
            try {
              await FileViewer.open(res?.uri)
            } catch (e) {
              // error
            }
          } catch (error) { }
        })
      case 'ppt':
      case 'pot':
      case 'pps':
      case 'ppa':
        const dataBase64pptConvert = `data:${getType ? getType : 'application/vnd.ms-powerpoint'};base64,${base64Data}`
        return getUrlPDF(dataBase64pptConvert, passingData?.filename, getType).then(async res => {
          try {
            try {
              await FileViewer.open(res?.uri)
            } catch (e) {
              // error
            }
          } catch (error) { }
        })
      case 'png':
        const imgPNG = `${base64Data}`.replace('dataimage/pngbase64', '')
        return setBase64Image({ uri: `data:${getType ? getType : 'image/png'};base64,${imgPNG}` })
      case 'image/png':
      case 'jpg':
        const imgJPEG1 = `${base64Data}`.replace('dataimage/jpegbase64', '')
        return setBase64Image({ uri: `data:${getType ? getType : 'image/jpeg'};base64,${imgJPEG1}` })
      case 'jpeg':
        const imgJPEG = `${base64Data}`.replace('dataimage/jpegbase64', '')
        return setBase64Image({ uri: `data:${getType ? getType : 'image/jpeg'};base64,${imgJPEG}` })
      case 'gif':
      case 'image/heic':
      case 'heic':
        return setBase64Image({ uri: `data:${getType ? getType : 'image/jpeg'};base64,${base64Data}` })
      default:
        break
    }
  }

  const _onPressOpenFile = async () => {
    setShowPopup(true)
    getTypeFile()
  }

  const callAPIDetail = () => {
    setLoading(true)
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/disman/getBase64Doc/${passingData?.id}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': patientToken
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (document)')
          const getList = response.data.base64Doc || []
          setBase64data(getList)
        }
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        console.log(error)
      })
  }

  const renderFileName = () => {
    return (
      <TouchableOpacity style={styles.ctnItem} onPress={_onPressOpenFile}>
        <View style={styles.fileName}>
          <Image source={icHealthProfile.ic_file} style={styles.iconFile} />
          <Text
            style={[
              customTxt(Fonts.Regular, 16, color040404).txt,
              styles.marginL16
            ]}>
            {passingData?.filename}
          </Text>
        </View>
        <View style={styles.divider} />
      </TouchableOpacity>
    )
  }

  const RenderItem = ({ category, content }) => {
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

  const renderBody = () => {
    return (
      <View>
        {renderFileName()}
        <RenderItem
          category={Translate(languageRedux).title}
          content={passingData?.title || passingData?.filename}
        />
        <RenderItem
          category={Translate(languageRedux).category}
          content={passingData?.categoryName}
        />
        <RenderItem
          category={Translate(languageRedux).report_date}
          content={convertDMMMYYYY(Number(passingData?.insertDate))}
        />
        <RenderItem
          category={Translate(languageRedux).description}
          content={passingData?.description}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).FILE_DETAILS}
        iconLeft={icHeader.ic_left}
        onPressLeft={() => { NavigationService.goBack() }}
      />
      <ScrollView>{renderBody()}</ScrollView>
      {
        base64Image && isShowPopupp && (
          <View style={styles.imageView}>
            <Image
              source={base64Image}
              style={styles.imgIcon}
            />
            <TouchableOpacity onPress={() => setShowPopup(false)} style={styles.closeView}>
              <Image source={icHeader.ic_close} style={styles.iconFile} />
            </TouchableOpacity>
          </View>

        )
      }
      {
        base64Data && isShowPDF && (
          <View style={styles.imageView}>
            <PDFView
              resource={base64Data}
              resourceType="base64"
              style={styles.container}
            />
            <TouchableOpacity onPress={() => setShowPDF(false)} style={styles.closeView}>
              <Image source={icHeader.ic_close} style={styles.iconFile} />
            </TouchableOpacity>
          </View>

        )
      }
      {isLoading && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  ctnItem: {
    marginHorizontal: 20,
    marginBottom: 16
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
  divider: {
    height: 1,
    backgroundColor: colorF0F0F0
  },
  marginT8: {
    marginTop: 8,
    marginBottom: 8
  },
  imageView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff'
  },
  closeView: {
    position: 'absolute',
    top: 40,
    right: 10,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgIcon: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode: 'contain'
  }
})
