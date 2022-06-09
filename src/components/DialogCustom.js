import React from 'react'
import {
  StyleSheet, View, Text,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import {
  color000000, color040404, color363636,
  color3777EE, colorF0F0F0, colorFFFFFF
} from '../constants/colors'
import { customTxt } from '../constants/css'
import Fonts from '../constants/Fonts'

export default function DialogCustom({
  title, content,
  txtlLeft, txtRight,
  styleLeftView, styleRightView,
  onPressCancel, onPressOK,
  onPressLeft
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.bgOpacity} onPress={onPressCancel} />
      <View style={styles.logoutView}>
        <View>
          <Text
            style={[
              styles.txtThankyou,
              customTxt(Fonts.SemiBold, 16, color040404).txt
            ]}>
            {title}
          </Text>
          {
            content && (
              <Text
                style={[
                  styles.txtYouCan,
                  customTxt(Fonts.Regular, 16, color363636).txt
                ]}>
                {content}
              </Text>
            )
          }
        </View>
        <View style={styles.ctnButton}>
          <TouchableOpacity
            onPress={onPressLeft ? onPressLeft : onPressCancel}
            style={[
              styles.ctnCancel,
              styleLeftView
            ]}
          >
            <Text style={customTxt(Fonts.SemiBold, 16, color3777EE).txt}>
              {txtlLeft}
            </Text>
          </TouchableOpacity>
          {
            txtRight && (
              <TouchableOpacity
                onPress={onPressOK}
                style={[
                  styles.ctnOK,
                  styleRightView
                ]}>
                <Text style={customTxt(Fonts.SemiBold, 16, colorFFFFFF).txt}>
                  {txtRight}
                </Text>
              </TouchableOpacity>
            )
          }
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0
  },
  fullView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bgOpacity: {
    width: '100%',
    height: '100%',
    flex: 1,
    position: 'absolute',
    backgroundColor: color000000,
    opacity: 0.7
  },
  logoutView: {
    width: 300,
    marginLeft: 24,
    marginRight: 24,
    backgroundColor: colorFFFFFF,
    borderRadius: 16
  },
  txtThankyou: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center'
  },
  txtYouCan: {
    marginTop: 8,
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center'
  },
  ctnOK: {
    flex: 1,
    height: 44,
    borderBottomRightRadius: 16,
    backgroundColor: color3777EE,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ctnCancel: {
    flex: 1,
    height: 44,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: colorFFFFFF,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colorF0F0F0
  },
  ctnButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 21
  }
})

