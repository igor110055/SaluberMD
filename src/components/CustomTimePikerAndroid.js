import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'


export default function CustomTimePikerAndroid({
  value, onChange, minimumDate
}) {
  return (
    <View>
      <DateTimePicker
        testID="dateTimePicker"
        value={value}
        mode={'time'}
        is24Hour={true}
        display={'spinner'}
        onChange={onChange}
        minimumDate={minimumDate}
      />
    </View>
  )
}
