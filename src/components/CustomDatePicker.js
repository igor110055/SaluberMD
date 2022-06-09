
import React from 'react'
import { Appearance, StyleSheet, View } from 'react-native'
import DatePicker from 'react-native-datepicker'
import { color0B40B1, color1F2022 } from '../constants/colors'
import Fonts from '../constants/Fonts'

export default function CustomDatePicker({
  onChangeDate,
  maxDate,
  minDate,
  date,
  refDatePicker,
  mode,
  minuteInterval,
  is24Hour
}) {
  const colorScheme = Appearance.getColorScheme()
  return (
    <View>
      <DatePicker
        ref={refDatePicker}
        style={styles.datePickerView}
        date={date}
        mode={mode || 'date'}
        format="YYYY-MM-DDTHH:mm:ss"
        minDate={minDate}
        maxDate={maxDate}
        confirmBtnText="Done"
        cancelBtnText="Cancel"
        onDateChange={onChangeDate}
        androidMode={'calendar'}
        is24Hour={is24Hour}
        minuteInterval={minuteInterval}
        customStyles={{
          datePicker: {
            justifyContent: 'center',
            backgroundColor: colorScheme === 'dark' ? '#222' : 'white'
          },
          disabled: {
            backgroundColor: 'red'
          },
          btnTextCancel: {
            color: color1F2022,
            fontFamily: Fonts.SemiBold,
            fontSize: 16
          },
          btnTextConfirm: {
            color: color0B40B1,
            fontFamily: Fonts.Bold,
            fontSize: 16
          }
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  datePickerView: {
    opacity: 0.0,
    height: 0,
    width: 0,
    fontSize: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginBottom: 0,
    marginRight: 0,
    alignItems: 'center'
  }
})
