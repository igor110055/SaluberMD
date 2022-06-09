import React from 'react'
import {
  StyleSheet, View
} from 'react-native'
import CustomButtonAutoSize from './CustomButtonAutoSize'

export default function CustomNextBT({
  textButton, isActive, onPress, disabled
}) {
  return (
    <View style={styles.contain}>
      <CustomButtonAutoSize
        textButton={textButton}
        isActive={isActive}
        onPress={onPress}
        disabled={disabled}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  contain: {
    alignItems: 'flex-end'
  }
})
