import NoDataView from 'components/NoDataView'
import { color040404, color3777EE, colorFFFFFF } from 'constants/colors'
import { border, customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import React, { useEffect, useState } from 'react'
import {
  StyleSheet, View, Dimensions, TouchableOpacity,
  FlatList, Text, Image, Linking, Platform
} from 'react-native'
import { useSelector } from 'react-redux'
import Translate from 'translate'
import _ from 'lodash'
import imgGlobal from '../../../../assets/images/global'
import icFloat from '../../../../assets/images/home_screen'
import SwipeUpDownModal from 'react-native-swipe-modal-up-down'

export default function EmergencyContactView({
  setShow
}) {
  const languageRedux = useSelector(state => state.common.language)
  const userinfo = useSelector(state => state.user.userinfo)
  const [isTouch, setTouch] = useState(false)
  const [time, setTime] = useState(10)
  const lsContact = userinfo.emergencyContacts || []

  useEffect(() => {
    if (lsContact.length === 1) {
      setTouch(true)
      callEmergencyNumber(lsContact[0]?.phone)
    }

    setTimeout(() => {
      if (!isTouch && lsContact.length > 0) {
        callEmergencyNumber(lsContact[0]?.phone)
      }
    }, (1000 * 10))
  }, [])

  useEffect(() => {
    var times = 10
    const countDown = setInterval(() => {
      if (times < 0) {
        return
      }
      const newTime = times - 1
      times = newTime
      if (times < 0) {
        return () => clearInterval(countDown)
      }
      setTime(times < 0 ? 0 : times)
    }, 1000)

    if (isTouch) {
      return () => clearInterval(countDown)
    }

    if (times === 0 || times < 0) {
      if (!isTouch && lsContact.length > 0) {
        callEmergencyNumber(lsContact[0]?.phone)
      }
      return () => clearInterval(countDown)
    }

    return () => clearInterval(countDown)
  }, [])

  const callEmergencyNumber = (phoneNumber) => {
    setTouch(true)
    if (phoneNumber) {
      const convertPhone = (phoneNumber || '').replace('(', '').replace(')', '').replace(' ', '')
      if (Platform.OS !== 'android') {
        return Linking.openURL(`telprompt:${convertPhone}`)
      }
      Linking.openURL(`tel:${convertPhone}`)
    }
  }

  const renderCell = (val) => {
    const renderText = (item, title) => {
      if (_.isEmpty(item)) {
        return null
      }
      return (
        <Text style={[
          customTxt(Fonts.Regular, 14, color040404).txt,
          styles.txtRelationship
        ]}>{title}: <Text style={customTxt(Fonts.Bold, 14, color040404).txt}>
            {(item || '').toLowerCase()}
          </Text>
        </Text>
      )
    }
    return (
      <View style={[
        styles.cellView,
        border().border
      ]}>
        <Text style={[
          customTxt(Fonts.Regular, 14, color040404).txt,
          styles.txtName
        ]}>{Translate(languageRedux).name}:
          <Text style={customTxt(Fonts.Bold, 16, color040404).txt}>
            {' '} {val?.firstName || ''} {val?.lastName || ''}
          </Text>
        </Text>
        {renderText(val?.email, Translate(languageRedux).email1)}
        {renderText(val?.relationship, Translate(languageRedux).RELATIONSHIP)}
        {renderText(val?.address, Translate(languageRedux).address)}
        <TouchableOpacity style={styles.phoneView} onPress={() => callEmergencyNumber(val?.phone)}>
          <Image source={imgGlobal.ic_phone} style={styles.imgPhone} />
          {!(_.isEmpty(val?.phone)) && <Text style={[
            customTxt(Fonts.SemiBold, 16, color3777EE).txt
          ]}>{val?.phone || ''}</Text>}
        </TouchableOpacity>
      </View>
    )
  }

  const renderListContact = () => {
    return (
      <View style={styles.flexView}>
        <View style={[
          border().borderB,
          styles.titleView
        ]}>
          <Text
            style={[
              customTxt(Fonts.Bold, 16, color040404).txt,
              styles.txtTitle
            ]}>{Translate(languageRedux).CALL_YOUR_EMERGENCY_CONTACT}</Text>
          <TouchableOpacity onPress={() => setShow(false)} style={styles.marginR16}>
            <Image source={icFloat.ic_close} style={styles.iconStyle} />
          </TouchableOpacity>
        </View>
        {renderCountdown()}
        {lsContact.length === 0 && <NoDataView />}
        <FlatList
          data={lsContact}
          style={styles.flatList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => renderCell(item)}
        />
      </View>
    )
  }

  const renderCountdown = () => {
    const getText = 'Please select the emergency contact you want to call. If there is no contact picked up after 10s we will call your first emergency contact.'
    const renderText = () => {
      return (
        <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
          {getText}
        </Text>
      )
    }
    if (time === 0) {
      return null
    }
    return (
      <View style={styles.countDownView}>
        {renderText()}
        <Text style={[
          customTxt(Fonts.Bold, 20, color040404).txt,
          styles.txtTime
        ]}>{time} {<Text
          style={customTxt(Fonts.Regular, 14, color040404).txt}
        >s</Text>}</Text>
      </View>
    )
  }

  const renderSwipe = () => {
    return (
      <SwipeUpDownModal
        modalVisible={true}
        PressToanimate={false}
        ContentModal={renderListContact()}
        ContentModalStyle={styles.Modal}
        HeaderContent={
          <TouchableOpacity style={styles.containerHeader} onPress={() => setShow(false)}/>
        }
        onClose={() => {
          setShow(false)
        }}
      />
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setShow(false)}
        style={[
          styles.container,
          styles.bgBlack
        ]}
      />
      {renderSwipe()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'flex-end'
  },
  bgBlack: {
    backgroundColor: color040404,
    opacity: 0.4
  },
  centerView: {
    backgroundColor: colorFFFFFF,
    width: 300,
    height: 220,
    borderRadius: 8
  },
  flexView: {
    width: '100%',
    height: Dimensions.get('window').height * (3 / 4),
    backgroundColor: colorFFFFFF,
    alignItems: 'center',
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
    overflow: 'hidden'
  },
  titleView: {
    width: '100%'
  },
  txtTitle: {
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20
  },
  flatList: {
    flex: 1,
    width: Dimensions.get('window').width
  },
  cellView: {
    flex: 1,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 8
  },
  txtName: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 20,
    marginBottom: 10
  },
  txtRelationship: {
    marginLeft: 10,
    marginRight: 20,
    marginBottom: 5
  },
  phoneView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  imgPhone: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginLeft: 10,
    marginRight: 10
  },
  iconStyle: {
    height: 24,
    width: 24,
    marginRight: 16,
    marginLeft: 16
  },
  marginR16: {
    position: 'absolute',
    marginTop: 15,
    right: 0
  },
  countDownView: {
    margin: 20,
    marginBottom: 0
  },
  txtTime: {
    width: Dimensions.get('window').width - 40,
    textAlign: 'center',
    marginTop: 5
  },
  containerHeader: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimensions.get('window').height * (1 / 4) - 40
  },
  Modal: {
    height: Dimensions.get('window').height * (3 / 4),
    backgroundColor: colorFFFFFF,
    alignItems: 'center',
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
    overflow: 'hidden',
    marginTop: Dimensions.get('window').height * (1 / 4)
  }
})
