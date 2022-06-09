import { color040404, color3777EE, colorBDBDBD, colorC1C3C5, colorE2E2E2, colorF0F0F0, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import React, { useEffect, useState } from 'react'
import {
  Dimensions, TouchableOpacity,
  StyleSheet, View, Text, Image, DeviceEventEmitter
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Translate from 'translate'
import TextInputView from 'views/login_signup/components/TextInputView'
import imgDirect from '../../../../assets/images/direct_call'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CustomTextInput from 'views/healthProfile/components/CustomTextInput'
import imgHome from '../../../../assets/images/home_screen'
import { apiPostTicket } from 'api/Common'
import { STATUS_NOTIFY } from 'components/NotificationView'

export default function NewTicketView({
  onPressClose, onPressCategory, onPressPriority,
  dataCategory, dataPriority, setLoading, setDataNoti,
  setShowNoti
}) {

  const languageRedux = useSelector(state => state.common.language)
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState(dataCategory)
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState(dataPriority)
  const dispatch = useDispatch()

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('NewTicketView', (data) => {
      if (data) {
        setCategory(data?.category)
        setPriority(data?.priority)
      }
    })
    return () => subscription.remove()
  }, [])

  const renderHeaderView = () => {
    return (
      <View style={styles.headerView}>
        <Text style={[
          customTxt(Fonts.SemiBold, 16, color040404).txt
        ]}>{Translate(languageRedux).SUBMIT_A_TICKET}</Text>
        <TouchableOpacity style={styles.closeView} onPress={onPressClose}>
          <Image source={imgDirect.ic_close} style={styles.imgClose} />
        </TouchableOpacity>
      </View>
    )
  }

  const renderContent = () => {
    return (
      <>
        <TextInputView
          title={Translate(languageRedux).subject_so}
          value={subject}
          onChangeTxt={(txt) => setSubject(txt)}
          placeholder={Translate(languageRedux).subject_so}
          validate={!subject}
        />
        <CustomTextInput
          title={Translate(languageRedux).descrizione}
          value={description}
          onChangeTxt={(txt) => setDescription(txt)}
          placeholder={Translate(languageRedux).descrizione}
          textStyle={styles.txtStyle}
          textinputStyle={[styles.textinputNoteStyle]}
          multiline={true}
          validate={!description}
        />
        {/* <CustomTextInput
          title={Translate(languageRedux).category}
          value={category?.name || ''}
          placeholder={Translate(languageRedux).SELECT_AN_OPTION}
          textStyle={styles.txtStyle}
          onPress={onPressCategory}
          iconRight={imgHome.ic_down}
        /> */}
        <CustomTextInput
          title={Translate(languageRedux).priority}
          value={priority?.name || ''}
          placeholder={Translate(languageRedux).SELECT_AN_OPTION}
          textStyle={styles.txtStyle}
          onPress={onPressPriority}
          iconRight={imgHome.ic_down}
        />
      </>
    )
  }

  const checkBT = () => {
    return subject && description
  }

  const _onPressSubmit = () => {
    const params = {
      'subject': subject,
      'content': description,
      'typeId': category?.value || '-1',
      'priority': priority?.value || '1'
    }
    setLoading(true)
    dispatch(apiPostTicket(params)).then(res => {
      console.log('res: ', res)
      if (res?.payload?.result === '0') {
        setDataNoti({
          status: STATUS_NOTIFY.SUCCESS,
          content: res?.payload?.reason || 'error'
        })
        setTimeout(() => {
          setShowNoti(true)
          onPressClose()
          setLoading(false)
        }, 500)
      } else {
        setDataNoti({
          status: STATUS_NOTIFY.ERROR,
          content: res?.payload?.reason || 'error'
        })
        setTimeout(() => {
          setShowNoti(true)
          setLoading(false)
        }, 500)
      }
    }).catch(() => {
      setLoading(false)
    })
  }

  const renderSubmitButton = () => {

    return (
      <View style={styles.addBT}>
        <TouchableOpacity
          style={btStyle(checkBT()).btView}
          activeOpacity={checkBT() ? 0 : 1}
          onPress={_onPressSubmit}
        >
          <Text style={[
            customTxt(Fonts.SemiBold, 18, colorC1C3C5).txt,
            btStyle(checkBT()).txtBT
          ]}>{Translate(languageRedux).SUBMIT}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.flexView}>
      <View style={styles.outsideView} />
      <View style={styles.contentView}>
        {renderHeaderView()}
        <KeyboardAwareScrollView
          style={styles.scrollView}
        >
          <Text style={[
            customTxt(Fonts.Regular, 14, color040404).txt
          ]}>{Translate(languageRedux).SUBMIT_CONTENT_TICKET}</Text>
          {renderContent()}
          {renderSubmitButton()}
        </KeyboardAwareScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  flexView: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  outsideView: {
    flex: 1,
    backgroundColor: color040404,
    opacity: 0.4
  },
  contentView: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    backgroundColor: colorFFFFFF,
    top: 64,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
    overflow: 'hidden'
  },
  headerView: {
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeView: {
    position: 'absolute',
    width: 56,
    height: 56,
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgClose: {
    width: 24,
    height: 24
  },
  scrollView: {
    padding: 20
  },
  txtStyle: {
    marginTop: 24
  },
  textinputNoteStyle: {
    flex: 1,
    height: 120,
    paddingTop: 14,
    paddingBottom: 14
  },
  addBT: {
    marginTop: 16
  }
})

const btStyle = (isActive) => StyleSheet.create({
  btView: {
    backgroundColor: isActive ? color3777EE : colorF0F0F0,
    borderRadius: 12,
    height: 48,
    minWidth: 117,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  txtBT: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 24,
    marginRight: 24,
    color: isActive ? colorFFFFFF : colorBDBDBD
  }
})
