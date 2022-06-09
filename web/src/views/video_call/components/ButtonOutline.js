import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { color3777EE } from '../../../constants/colors'
import { customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'

export default function ButtonOutline({text, onPress}) {
    return (
        <View>
            <TouchableOpacity onPress={onPress} style={styles.container}>
                <Text style={customTxt(Fonts.SemiBold, 18, color3777EE).txt}>{text}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      height: 48,
      borderWidth: 1,
      borderColor: color3777EE,
      borderRadius: 12,
      justifyContent:'center',
      alignItems:'center'
    }
})