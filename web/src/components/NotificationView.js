import React from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView
} from 'react-native'

import img from '../../assets/images/global'
import Fonts from '../constants/Fonts'
import imgPhone from '../../assets/images/header'
import * as colors from '../constants/colors'
import { customTxt } from '../constants/css'

export const STATUS_NOTIFY = {
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
  ERROR: 'ERROR'
}

export default function NotificationView({
  imgLeft,
  imgRight,
  styleImgLeft,
  styleImgRight,
  title,
  content,
  styleTitle,
  styleContent,
  style,
  styleContainer,
  status,
  isShow,
  setShow
}) {

  const _onPressClose = () => {
    setShow(false)
  }

  const statusStyle = () => {
    switch (status) {
      case STATUS_NOTIFY.SUCCESS:
        return {
          icon: imgRight || img.ic_success,
          title: title || 'Success',
          colorTitle: styleTitle?.color || colors.color27A600
        }
      case STATUS_NOTIFY.WARNING:
        return {
          icon: imgRight || img.ic_warning,
          title: title || 'Warning',
          colorTitle: styleTitle?.color || colors.colorEE8F00
        }
      case STATUS_NOTIFY.ERROR:
        return {
          icon: imgRight || img.ic_error,
          title: title || 'Failure',
          colorTitle: styleTitle?.color || colors.colorA31F1F
        }
      default:
        return {
          icon: '',
          title: '',
          colorTitle: ''
        }
    }
  }

  const renderView = () => {
    if (isShow) {
      setTimeout(() => {
        setShow(false)
      }, 4000)
      return (
        <View style={styles.container}>
          <SafeAreaView>
            <View style={[styles.containerView, style]}>
              <TouchableOpacity
                onPress={_onPressClose}
                style={styles.imgCloseContainer}>
                <Image
                  style={[styles.imgClose, styleImgRight]}
                  source={imgLeft || imgPhone.ic_close}
                />
              </TouchableOpacity>
              <View style={[styles.contentContainer, styleContainer]}>
                <Image
                  style={[styles.img, styles.marginL18, styleImgLeft]}
                  source={statusStyle().icon}
                />
                <View style={[styles.marginL18, styles.fleX1]}>
                  <Text
                    style={[
                      styles.marginT8,
                      customTxt(Fonts.Regular, 14).txt,
                      styleContent
                    ]}>
                    {content}
                  </Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </View>
      )
    }
    return null
  }

  return (
    <>
      {renderView()}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  },
  containerView: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    paddingBottom: 14,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4
  },
  contentContainer: {
    flexDirection: 'row',
    marginTop: 24
  },
  marginL18: {
    marginLeft: 18
  },
  marginT8: {
    marginTop: 2,
    marginRight: 20
  },
  img: {
    width: 23,
    height: 23
  },
  imgCloseContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1
  },
  imgClose: {
    margin: 15,
    width: 12,
    height: 12
  },
  fleX1: {
    flex: 1
  }
})
