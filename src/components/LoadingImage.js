import React, { useState } from 'react'
import { StyleSheet, Image, View } from 'react-native'
import ImageProgress from 'react-native-image-progress'
import Progress from 'react-native-progress'
import images from '../../assets/images'

export default function LoadingImage({
  image, style, uriImg, no_image,
  viewStyle
}) {
  const [avatarVisibility, setAvatarVisibility] = useState(true)
  const [isSuccess, setSuccess] = useState(false)

  return (
    <View style={[styles.imgView, viewStyle]}>
      <Image
        source={no_image ? (isSuccess ? null : no_image) : images.ic_no_image}
        style={[styles.fullView, style]}
      />
      {(image || uriImg) && avatarVisibility ? (
        <ImageProgress
          source={uriImg}
          style={[styles.imgProgress, style]}
          indicator={Progress}
          onError={event => {
            setAvatarVisibility(false)
            if (event.nativeEvent?.error) {
              setSuccess(false)
            } else {
              setSuccess(true)
            }
          }}
        />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  imgView: {
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#F4F8FA'
  },
  imgProgress: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0
  },
  fullView: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  }
})
