import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native'

import { color040404, colorFFFFFF } from '../../constants/colors'
import icVisit from '../../../assets/images/visit'
import { customTxt } from '../../constants/css'
import Fonts from '../../constants/Fonts'

export default function FunctionButtonFloating({onPressCancel,
  onPressReschedule, onPressRevoke, onPressExportCalendar}) {
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.bgOpacity} onPress={onPressCancel} />
            <View style={styles.floatView}>
                <View style={styles.ctn}>
                    {onPressReschedule && <TouchableOpacity onPress={onPressReschedule} style={styles.ctnLine}>
                        <Image source={icVisit.ic_reschedule} style={styles.iconStyle}/>
                        <View style={styles.marginR12}/>
                        <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>Reschedule</Text>
                    </TouchableOpacity>}
                    {onPressRevoke && <TouchableOpacity onPress={onPressRevoke} style={styles.ctnExport}>
                        <Image source={icVisit.ic_revoke} style={styles.iconStyle}/>
                        <View style={styles.marginR12}/>
                        <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>Revoke</Text>
                    </TouchableOpacity>}
                    {onPressReschedule && onPressRevoke && onPressExportCalendar && <View style={styles.marginB24}/>}
                    {onPressExportCalendar && <TouchableOpacity onPress={onPressExportCalendar} style={styles.ctnExport}>
                        <Image source={icVisit.ic_appointment} style={styles.iconStyle}/>
                        <View style={styles.marginR12}/>
                        <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>Export Calendar</Text>
                    </TouchableOpacity>}
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'flex-end'
  },
  bgOpacity: {
    width: '100%',
    height: '100%',
    flex: 1,
    position: 'absolute'
  },
  floatView: {
    marginRight: 20,
    marginTop: 55
  },
  iconStyle: {
    height: 20,
    width: 20
  },
  marginR12: {
    marginRight: 12
  },
  marginB24: {
    marginBottom: 24
  },
  ctn: {
    backgroundColor: colorFFFFFF,
    shadowColor: '#000',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 9
  },
  ctnLine: {
    flexDirection: 'row',
    marginBottom: 24
  },
  ctnExport: {
    flexDirection: 'row'
  }
})