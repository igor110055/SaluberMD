import React from 'react'
import { StyleSheet, View, Text, Dimensions } from 'react-native'

export default function AccountView() {
  return (
    <View style={styles.container}>
      <Text>AccountView</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: Dimensions.get('window').height
  }
})
