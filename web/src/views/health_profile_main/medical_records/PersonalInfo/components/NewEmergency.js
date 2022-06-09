import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, KeyboardAvoidingView, DeviceEventEmitter } from 'react-native'
import { color000000, color040404, color3777EE, colorA7A8A9, colorC1C3C5, colorDDDEE1, colorF0F0F0, colorFFFFFF } from '../../../../../constants/colors'
import { customTxt } from '../../../../../constants/css'
import Fonts from '../../../../../constants/Fonts'
import Translate from '../../../../../translate'
import icHeader from '../../../../../../assets/images/header'
import icDoc from '../../../../../../assets/images/document'
import CustomTextInput from '../../../../healthProfile/components/CustomTextInput'
import Button from '../../../../../components/Button'
import SearchListWithName from '../../../../../components/SearchListWithName'

export default function NewEmergency({onPressCancel}) {

    const languageRedux = ''
    const userinfo = {}//useSelector(state => state.user.userinfo)
    const [isShow, setShow] = useState(false)
    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [rela, setRela] = useState()
    const [phone, setPhone] = useState()
    const [email, setEmail] = useState()
    const emergency = userinfo?.emergencyContacts || []
    const [block1, setBlock1] = useState(emergency.length > 0 ? true : false)
    const [block2, setBlock2] = useState(emergency.length > 1 ? true : false)
    const [block3, setBlock3] = useState(emergency.length > 2 ? true : false)
    const [block4, setBlock4] = useState(emergency.length > 3 ? true : false)
    const [block5, setBlock5] = useState(emergency.length > 4 ? true : false)
    const listRela = [
      {name: Translate(languageRedux).FATHER, value: 'FATHER'},
      {name: Translate(languageRedux).MOTHER, value: 'MOTHER'},
      {name: Translate(languageRedux).WIFE, value: 'WIFE'},
      {name: Translate(languageRedux).HUSBAND, value: 'HUSBAND'},
      {name: Translate(languageRedux).SON, value: 'SON'},
      {name: Translate(languageRedux).DAUGHTER, value: 'DAUGHTER'},
      {name: Translate(languageRedux).other, value: 'OTHER'}
    ]

    useEffect(() => {

    },[])

    const renderTop = () => {
      return (
        <View>
          <View style={styles.ctnTitle}>
            <View style={styles.flex1} />
            <View style={styles.ctnSOS}>
              <Text style={customTxt(Fonts.SemiBold, 18, color000000).txt}>
                {Translate(languageRedux).NEW_EMERGENCY_CONTACT}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.marginR16}
              onPress={onPressCancel}>
              <Image source={icHeader.ic_close} style={styles.iconStyleFloat} />
            </TouchableOpacity>
          </View>
        </View>
      )
    }

      const renderTextInput = () => {
        return (
          <View style={styles.marginH20}>
            <CustomTextInput
              title={Translate(languageRedux).FIRST_NAME}
              value={firstName}
              validate={firstName ? false : true}
              onChangeTxt={txt => setFirstName(txt)}
              textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            />
            <CustomTextInput
              title={Translate(languageRedux).surname}
              value={lastName}
              validate={lastName ? false : true}
              onChangeTxt={txt => setLastName(txt)}
              textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            />
            <CustomTextInput
              title={Translate(languageRedux).RELATIONSHIP}
              value={rela?.name}
              onChangeTxt={txt => setRela(txt)}
              iconRight={icDoc.ic_dropdown}
              onPress={() => {setShow(true)}}
              textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
              validate={rela?.name ? false : true}
            />
            <CustomTextInput
              title={Translate(languageRedux).PHONE}
              value={phone}
              onChangeTxt={txt => setPhone(txt)}
              textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
              validate={phone ? false : true}
            />
            <CustomTextInput
              title={Translate(languageRedux).EMAIL}
              value={email}
              onChangeTxt={txt => setEmail(txt)}
              autoCapitalize={'none'}
              textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            />
          </View>
        )
      }

      const renderButton = () => {
        return (
          <View style={styles.marginH20}>
            <Button
              text={Translate(languageRedux).add_new}
              backgroundColor={firstName && rela && phone ? color3777EE : colorF0F0F0}
              textColor={firstName && rela && phone ? colorFFFFFF : colorC1C3C5}
              disabled={firstName && rela && phone ? false : true}
              onPress={_onPressAdd}
            />
          </View>
        )
      }

      const checkBody = () => {
        if (emergency.length === 0) {
          return [
            {
              firstName: firstName,
              lastName: lastName,
              email: email,
              relationship: rela?.value,
              phone: phone,
              address: ''
            }
          ]
        }
        if (block1 && block2 === false && block3 === false && block4 === false && block5 === false) {
          return [
            userinfo?.emergencyContacts[0],
            {
              firstName: firstName,
              lastName: lastName,
              email: email,
              relationship: rela?.value,
              phone: phone,
              address: ''
            }
          ]
        }
        if (block2 && block3 === false && block4 === false && block5 === false) {
          return [
            userinfo?.emergencyContacts[0],
            userinfo?.emergencyContacts[1],
            {
              firstName: firstName,
              lastName: lastName,
              email: email,
              relationship: rela?.value,
              phone: phone,
              address: ''
            }
          ]
        }
        if (block3 && block4 === false && block5 === false) {
          return [
            userinfo?.emergencyContacts[0],
            userinfo?.emergencyContacts[1],
            userinfo?.emergencyContacts[2],
            {
              firstName: firstName,
              lastName: lastName,
              email: email,
              relationship: rela?.value,
              phone: phone,
              address: ''
            }
          ]
        }
        if (block4 && block5 === false) {
          return [
            userinfo?.emergencyContacts[0],
            userinfo?.emergencyContacts[1],
            userinfo?.emergencyContacts[2],
            userinfo?.emergencyContacts[3],
            {
              firstName: firstName,
              lastName: lastName,
              email: email,
              relationship: rela?.value,
              phone: phone,
              address: ''
            }
          ]
        }
      }

      const addEmergencyContact = () => {
        const body = checkBody()
        // axios({
        //   method: 'post',
        //   url: `${APIs.hostAPI}backoffice/webdoctor/updateEmergencyContacts`,
        //   headers: {
        //     'x-auth-token': token
        //   },
        //   data: body
        // })
        //   .then(response => {
        //     console.log('data: ', response.data)
        //   })
        //   .catch(error => {
        //     console.error('There was an error!', error)
        //   })
      }

      const _onPressAdd = () => {
        addEmergencyContact()
        onPressCancel()
        DeviceEventEmitter.emit('add')
      }

    return (
      <View style={styles.containerFloat}>
        <TouchableOpacity
          style={styles.bgOpacity}
          onPress={onPressCancel}
        />
        <View style={styles.floatingView}>
          {renderTop()}
          <KeyboardAvoidingView>
            {renderTextInput()}
            {renderButton()}
          </KeyboardAvoidingView>
        </View>
        {isShow && (
          <SearchListWithName
            listData={listRela}
            title={Translate(languageRedux).CHOOSE_RELA}
            itemSelected={rela}
            onItemClick={val => {
              setRela(val)
              setShow(false)
            }}
            onPressRight={() => {
              setShow(false)
            }}
          />
        )}
      </View>
    )
}

const styles = StyleSheet.create({
  containerFloat: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'flex-end'
  },
  bgOpacity: {
    width: '100%',
    height: '100%',
    flex: 1,
    position: 'absolute',
    backgroundColor: color000000,
    opacity: 0.7
  },
  floatingView: {
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    height: Dimensions.get('window').height - 50
  },
  ctnTitle: {
    height: 56,
    flexDirection: 'row'
  },
  iconStyleFloat: {
    height: 24,
    width: 24,
    marginRight: 16,
    marginLeft: 16
  },
  flex1: {
    flex: 1
  },
  ctnSOS: {
    flex: 4,
    alignItems: 'center',
    marginTop: 18
  },
  marginR16: {
    flex: 1,
    alignItems: 'flex-end',
    marginTop: 18
  },
  changePass: {
    marginTop: 16,
    marginHorizontal: 20
  },
  ctnLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    width: '100%',
    marginTop: 4,
    borderRadius: 12,
    paddingLeft: 16,
    color: colorA7A8A9,
    borderColor: colorDDDEE1,
    borderWidth: 1,
    justifyContent: 'space-between'
  },
  changeButton: {
    height: 48,
    backgroundColor: color3777EE,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    borderColor: color3777EE,
    paddingHorizontal: 8
  },
  marginH20: {
    marginHorizontal: 20,
    marginTop: 16
  },
  ctnTextInput: {
    height: 72,
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    marginTop: 4
  },
  textInputFloat: {
    width: '100%',
    marginTop: 12,
    paddingLeft: 16,
    paddingRight: 16
  },
  ctnDes: {
    marginVertical: 16
  }
})
