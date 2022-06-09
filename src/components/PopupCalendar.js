import React from 'react'
import { View } from 'react-native'
import CalendarPicker from 'react-native-calendar-picker'
import RBSheet from 'react-native-raw-bottom-sheet'

const PopupCalendar = ({
  refCalendar, onDateChangeDate, isMin, isMax
}) => {
  return (
    <View>
      <RBSheet ref={refCalendar} closeOnPressMask={true} height={340}>
        <View>
          <CalendarPicker
            // weekdays={txtLanguage.weekdays}
            // months={txtLanguage.months}
            previousTitle={'<'}
            nextTitle={'>'}
            // selectMonthTitle={txtLanguage.selectMonthTitle}
            // selectYearTitle={txtLanguage.selectYearTitle}
            todayBackgroundColor="#728ACA"
            selectedDayColor={'#0B40B1'}
            selectedDayTextColor="#FFFFFF"
            minDate={isMin || null}
            maxDate={isMax || null}
            onDateChange={onDateChangeDate}
          />
        </View>
      </RBSheet>
    </View>
  )
}

export default PopupCalendar
