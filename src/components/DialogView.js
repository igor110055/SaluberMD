import React from 'react'
import { StyleSheet, View } from 'react-native'
import Dialog from 'react-native-dialog'
import { color040404, color3777EE } from '../constants/colors'
import { customTxt } from '../constants/css'
import Fonts from '../constants/Fonts'
export default function DialogView({
  isShow, onPressCancel, onPressOK,
  title, content, txt1, txt2,
  txt1Color, txt2Color,
  txt1Style, txt2Style
}) {

  return (
    <View style={styles.container}>
      <Dialog.Container visible={isShow} onBackdropPress={onPressCancel}>
        <Dialog.Title
          style={customTxt(Fonts.SemiBold, 16, color040404).txt}
        >
          {title}
        </Dialog.Title>
        {
          content && (
            <Dialog.Description>
              {content}
            </Dialog.Description>
          )
        }
        <Dialog.Button
          label={txt1 || ''}
          onPress={onPressCancel}
          color={txt1Color || color3777EE}
          style={txt1Style}
        />
        {
          onPressOK && (
            <Dialog.Button
              label={txt2 || ''}
              onPress={onPressOK}
              color={txt2Color || color3777EE}
              style={txt2Style}
            />
          )
        }
      </Dialog.Container>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 0.1
  }
})
