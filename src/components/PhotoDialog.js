import React from 'react'
import {
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  TouchableOpacity
} from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'
import ActionSheet from 'react-native-actionsheet'
import _ from 'lodash'

export default function PhotoDialog({actionSheetRef, title, callbackPhoto}) {
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given')
      } else {
        console.log('Camera permission denied')
      }
    } catch (err) {
      console.warn(err)
    }
  }
  const _onPressChange = async (index) => {
    const options = {
      width: 500,
      hight: 500,
      multiple: true,
      cropping: false,
      compressImageMaxWidth: 500,
      compressImageMaxHeight: 500,
      compressImageQuality: 1,
      maxFiles: 1,
      mediaType: 'photo',
      forceJpg: true,
      includeBase64: true
    }

    switch (index) {
      case 0:
        await requestCameraPermission()
        ImagePicker.openCamera(options).then((image) => {
          if (_.isEmpty(image)) {return}
          let source = {
            uri: image.path,
            data: 'data:image/jpg;base64,' + image.data,
            type: image.mime,
            res: image
          }
          callbackPhoto([source])
        })
        return
      case 1:
        ImagePicker.openPicker(options).then((images) => {
          if (_.isEmpty(images) && !_.isArray(images)) {return}
          const sources = images.map((image) => {
            return {
              uri: image.path,
              data: 'data:image/jpg;base64,' + image.data,
              type: image.mime,
              res: image
            }
          })
          callbackPhoto(sources)
        })
        return
      default:
        return
    }
  }

  return (
    <TouchableOpacity style={styles.container} onPress={_onPressChange}>
      <ActionSheet
        ref={actionSheetRef}
        title={'Choose Photo'}
        options={[
          'Take Photo',
          'Choose from library',
          'Cancel'
        ]}
        cancelButtonIndex={2}
        destructiveButtonIndex={3}
        onPress={(index) => _onPressChange(index, 1)}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: 0.1
  }
})
