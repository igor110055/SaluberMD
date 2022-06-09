import { Dimensions, Platform } from 'react-native'
import FileViewer from 'react-native-file-viewer'
import RNFetchBlob from 'rn-fetch-blob'

export const validateEmail = (text) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
  if (reg.test(text) === false) {
    console.log('Email is Not Correct')
    return false
  }
  else {
    console.log('Email is Correct')
    return true
  }
}

export const validatePassword = (text) => {
  let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
  if (reg.test(text) === false) {
    console.log('Pass is Not Correct')
    return false
  }
  else {
    console.log('Pass is Correct')
    return true
  }
}

export const isIphoneX = Platform.OS === 'ios' ? Dimensions.get('window').height > 736 : false

export const getUrlPDF = async (uri, filename, typefile, contentType) => {
  let imagePath = null
  const { dirs } = RNFetchBlob.fs
  const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir
  return await RNFetchBlob.config({
    fileCache: true,
    useDownloadManager: true,
    appendExt: typefile || 'pdf',
    path: `${dirToSave}/${filename || `test.${typefile || 'pdf'}`}`,
    addAndroidDownloads: {
      useDownloadManager: true, // true will use native manager and be shown on notification bar.
      notification: true,
      path: `${dirToSave}/me_${Math.floor((new Date()).getTime() + (new Date()).getSeconds() / 2)}.${typefile || 'pdf'}`,
      mime: contentType,
      description: 'Downloading'
    }
  }).fetch('GET', uri)
    .then((resp) => {
      if (Platform.OS === 'android') {
        RNFetchBlob.android.actionViewIntent(resp.path(), contentType)
      }
      console.log('new resp : ', resp)

      imagePath = resp.path()
      const checkIos = Platform.OS === 'ios' ? imagePath.replace('file://', '') : imagePath
      imagePath = checkIos
      console.log('imagePath', { uri: checkIos })
      return { uri: checkIos }
    })
}



export const openFile = (urlFile) => {
  FileViewer.open(urlFile, { showOpenWithDialog: true })
    .then(() => {
      // success
    })
    .catch(error => {
      // error
    })
}
