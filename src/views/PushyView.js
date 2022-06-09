import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'

export default class PushyView extends Component {

  componentDidMount() {

  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Aaaaa</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  }
})
