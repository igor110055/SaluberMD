import React from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'

export default function BoxTrackingCompact({
  backgroundColor, source, onPress
}) {

  const txtBackground = { backgroundColor: backgroundColor }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        txtBackground
      ]}>
      <Image source={source} style={styles.iconStyle} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    width: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  iconStyle: {
    height: 32,
    width: 32
  }
})
