import React from 'react'
import {
  StyleSheet, View
} from 'react-native'
import CustomButtonAutoSize from './CustomButtonAutoSize'

export default function CustomNextBT({
  textButton, isActive, onPress, disabled,
  stylesView, stylesText
}) {
  return (
    <View style={styles.contain}>
      <CustomButtonAutoSize
        textButton={textButton}
        isActive={isActive}
        onPress={onPress}
        disabled={disabled}
        stylesView={stylesView}
        stylesText={stylesText}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  contain: {
    alignItems: 'flex-end'
  }
})
