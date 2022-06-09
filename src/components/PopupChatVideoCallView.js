import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
  TextInput,
  Keyboard,
  DeviceEventEmitter,
  Platform
} from 'react-native'
import imgDirectCall from '../../assets/images/direct_call'
import Fonts from 'constants/Fonts'
import * as colors from '../constants/colors'
import { border, customTxt } from '../constants/css'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { converDateLocalHHmm, convertToUTC } from 'constants/DateHelpers'
import { useSelector } from 'react-redux'

export default function PopupChatVideoCallView({
  isShow,
  setShow,
  onPressSend,
  lsData
}) {
  const [isKeyboard, setKeyboard] = React.useState(false)
  const [txt, setTxt] = useState()
  const permissionRedux = useSelector(state => state.user.permission)
  const lsChatRedux = useSelector(state => state.user.lsChat)
  const userinfo = useSelector(state => state.user.userinfo)
  const [lsChat, setLsChat] = useState([])

  useEffect(() => {
    console.log('lsChatRedux: ', lsChatRedux)
    setLsChat(lsChatRedux || [])
  }, [lsChatRedux])

  useEffect(() => {
    const keyboardShow = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboard(true)
    })

    const keyboardHide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboard(false)
    })

    return () => {
      keyboardShow.remove()
      keyboardHide.remove()
    }
  }, [])

  const _onPressClose = () => {
    setShow(false)
  }

  const _onPressSend = () => {
    onPressSend(txt)
    setTimeout(() => {
      setTxt()
      Keyboard.dismiss()
    }, 200)
  }

  const renderCell = (val, index) => {
    const checkTime = () => {
      if ((lsChat || []).length > index) {
        return val?.time === lsChat[index + 1]?.time
      }
    }
    if (val?.auth === userinfo?.username) {
      return (
        <View style={styles.msgCellView}>
          <View style={styles.bgMsg}>
            <Text
              numberOfLines={0}
              style={[
                customTxt(Fonts.Medium, 14, colors.color040404).txt,
                styles.txtMsg
              ]}>{val?.data}</Text>
          </View>
          {
            !checkTime() && (
              <Text style={[
                customTxt(Fonts.Medium, 10, colors.color040404).txt,
                styles.txtTime
              ]}>{val?.time ? converDateLocalHHmm(val?.time) : ''}</Text>
            )
          }
        </View>
      )
    }
    return (
      <View style={styles.msgAuthCellView}>
        <View style={styles.bgMsg}>
          <Text
            numberOfLines={0}
            style={[
              customTxt(Fonts.Medium, 14, colors.color040404).txt,
              styles.txtMsg
            ]}>{val?.data || ''}</Text>
        </View>
        {
          !checkTime() && (
            <Text style={[
              customTxt(Fonts.Medium, 10, colors.color040404).txt,
              styles.txtTime
            ]}>{val?.time ? converDateLocalHHmm(val?.time) : ''}</Text>
          )
        }
      </View>
    )
  }

  const renderView = () => {
    if (isShow) {
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.flex0} />
          <SafeAreaView style={styles.containerView}>
            <View style={[styles.headerView, border().borderB]}>
              <TouchableOpacity
                onPress={_onPressClose}
                style={styles.btCloseView}
              >
                <Image source={imgDirectCall.ic_close} style={styles.imgCloseStyle} />
              </TouchableOpacity>
              <View style={styles.titleHeaderView}>
                <Text style={[
                  customTxt(Fonts.SemiBold, 18, colors.color040404).txt,
                  styles.txtheader
                ]}>Chat</Text>
              </View>
            </View>
            <View style={styles.flex1}>
              <KeyboardAwareScrollView>
                <FlatList
                  style={styleKeyboard(isKeyboard, Platform.OS === 'ios').msgView}
                  data={lsChat || []}
                  extraData={lsChat || []}
                  keyExtractor={(item, index) => index.toString()}
                  key={'#2'}
                  renderItem={({ item, index }) => renderCell(item, index)}
                />
                <View style={[styles.txtInputView, border().borderT]}>
                  <TextInput
                    style={[
                      styles.textInput,
                      border(colors.color3777EE).border
                    ]}
                    value={txt}
                    onChangeText={(val) => setTxt(val)}
                    returnKeyType={'done'}
                  />
                  <TouchableOpacity
                    onPress={_onPressSend}
                    style={styles.btSend}>
                    <Image style={styles.imgSend} source={imgDirectCall.ic_send} />
                  </TouchableOpacity>
                </View>
              </KeyboardAwareScrollView>
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
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  flex0: {
    flex: 0
  },
  flex1: {
    flex: 1
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  titleHeaderView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtheader: {
    marginLeft: -50
  },
  containerView: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  btCloseView: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgCloseStyle: {
    width: 24,
    height: 24
  },
  txtInputView: {
    flexDirection: 'row',
    left: 0,
    paddingTop: 15,
    paddingLeft: 10,
    paddingRight: 5,
    marginBottom: 20

  },
  textInput: {
    flex: 1,
    height: 46,
    marginLeft: 5,
    marginRight: 5,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 12
  },
  btSend: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgSend: {
    width: 26,
    height: 26,
    resizeMode: 'contain'
  },
  msgCellView: {
    alignItems: 'flex-end',
    marginLeft: 60
  },
  msgAuthCellView: {
    marginRight: 80
  },
  bgMsg: {
    minWidth: 20,
    backgroundColor: colors.colorEAF1FF,
    marginTop: 10,
    marginRight: 20,
    marginLeft: 20,
    borderRadius: 20
  },
  txtMsg: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10
  },
  txtTime: {
    marginRight: 30,
    marginLeft: 30
  }
})

const styleKeyboard = (kb, platformiOS) => StyleSheet.create({
  msgView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - (kb ? (platformiOS ? 260 : 430) : 200) + (platformiOS ? 0 : 40)
  }
})
