import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, DeviceEventEmitter } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'
import Icon from 'react-native-vector-icons/Feather'
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import RNPrint from 'react-native-print'
import Share from 'react-native-share'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { colorFFFFFF, colorA7A8A9, color040404, colorF0F0F0, color3777EE, color5C5D5E } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from '../../../../translate'
import { apiGetUserInfo } from 'api/Auth'
import { saveUserinfo } from 'actions/user'
import NavigationService from 'navigation'

import icHeader from '../../../../../assets/images/header'
import icHealthProfile from '../../../../../assets/images/health_profile'
import icVisit from '../../../../../assets/images/visit'
import icHome from '../../../../../assets/images/home_screen'


import Header from '../../../../components/Header'
import FunctionButton from './FunctionButton'
import CustomTextInput from '../../../healthProfile/components/CustomTextInput'
import LoadingView from '../../../../components/LoadingView'
import SearchListWithName from '../../../../components/SearchListWithName'
import SOSButton from '../../../home_screen/components/SOSButton/SOSButton'
import NewEmergency from './components/NewEmergency'
import DialogCustom from '../../../../components/DialogCustom'

export default function EmergencyContact() {

  const dispatch = useDispatch()
  const userinfo = useSelector(state => state.user.userinfo)
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const [isShow, setShow] = useState(false)
  const [isShowDelete, setShowDelete] = useState(false)
  const [edit, setEdit] = useState(false)
  const [isLoad, setLoading] = useState(false)
  const [relationship1, setRelationship1] = useState()
  const [relationship2, setRelationship2] = useState()
  const [relationship3, setRelationship3] = useState()
  const [relationship4, setRelationship4] = useState()
  const [relationship5, setRelationship5] = useState()
  const [isShowRela, setShowRela] = useState(false)
  const [isShowRela2, setShowRela2] = useState(false)
  const [isShowRela3, setShowRela3] = useState(false)
  const [isShowRela4, setShowRela4] = useState(false)
  const [isShowRela5, setShowRela5] = useState(false)
  const [isShowNew, setShowNew] = useState(false)
  const [show1, setShow1] = useState(false)
  const [show2, setShow2] = useState(false)
  const [show3, setShow3] = useState(false)
  const [show4, setShow4] = useState(false)
  const [show5, setShow5] = useState(false)
  const emergency = userinfo?.emergencyContacts || []
  const [block1, setBlock1] = useState(emergency.length > 0 ? true : false)
  const [block2, setBlock2] = useState(emergency.length > 1 ? true : false)
  const [block3, setBlock3] = useState(emergency.length > 2 ? true : false)
  const [block4, setBlock4] = useState(emergency.length > 3 ? true : false)
  const [block5, setBlock5] = useState(emergency.length > 4 ? true : false)
  const [isDelete, setDelete] = useState(false)
  const [isNoti, setNoti] = useState(false)
  const [reload, setReload] = useState(false)

  const listRela = [
    { 'name': Translate(languageRedux).FATHER, 'value': 'FATHER' },
    { 'name': Translate(languageRedux).MOTHER, 'value': 'MOTHER' },
    { 'name': Translate(languageRedux).WIFE, 'value': 'WIFE' },
    { 'name': Translate(languageRedux).HUSBAND, 'value': 'HUSBAND' },
    { 'name': Translate(languageRedux).SON, 'value': 'SON' },
    { 'name': Translate(languageRedux).DAUGHTER, 'value': 'DAUGHTER' },
    { 'name': Translate(languageRedux).other, 'value': 'OTHER' }
  ]

  useEffect(() => {
    callAPIUserinfo()
    convertRela()

    DeviceEventEmitter.addListener('add', () => {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    })
  }, [isLoad])

  useEffect(() => {
    // setValue()
  }, [reload])

  const callAPIUserinfo = () => {
    dispatch(apiGetUserInfo()).then(res => {
      // console.log('res: ', res?.payload)
      const getuserInfo = res?.payload?.user
      if (getuserInfo) {
        Promise.all([
          dispatch(saveUserinfo(getuserInfo))
        ])
      }
      setLoading(false)
    }).catch((err) => {
      console.log('err: ', err)
      setLoading(false)
    })
  }

  const convertRela = () => {
    if (block1 === false) {
      setRelationship1('')
    }
    if (block2 === false) {
      setRelationship2('')
    }
    if (block3 === false) {
      setRelationship3('')
    }
    if (block4 === false) {
      setRelationship4('')
    }
    if (block5 === false) {
      setRelationship5('')
    }
    if (emergency.length > 0) {
      var i = listRela.filter(val => val.value === userinfo?.emergencyContacts[0].relationship)
      setRelationship1(i[0].name || '')
    }
    if (emergency.length > 1) {
      var i = listRela.filter(val => val.value === userinfo?.emergencyContacts[1].relationship)
      setRelationship2(i[0].name || '')
    }
    if (emergency.length > 2) {
      var i = listRela.filter(val => val.value === userinfo?.emergencyContacts[2].relationship)
      setRelationship3(i[0].name || '')
    }
    if (emergency.length > 3) {
      var i = listRela.filter(val => val.value === userinfo?.emergencyContacts[3].relationship)
      setRelationship4(i[0].name || '')
    }
    if (emergency.length > 4) {
      var i = listRela.filter(val => val.value === userinfo?.emergencyContacts[4].relationship)
      setRelationship5(i[0].name || '')
    }
  }

  const setValue = () => {
    if (emergency.length > 0) {
      setBlock1(true)
      setFirstName1(firstName1)
      setLastName1(lastName1)
      setPhone1(phoneN1)
      setEmail1(emailN1)
    }
    if (emergency.length > 1) {
      setBlock2(true)
      setFirstName2(firstName2)
      setLastName2(lastName2)
      setPhone2(phoneN2)
      setEmail2(emailN2)
    }
    if (emergency.length > 2) {
      setBlock3(true)
      setFirstName3(firstName3)
      setLastName3(lastName3)
      setPhone3(phoneN3)
      setEmail3(emailN3)
    }
    if (emergency.length > 3) {
      setBlock4(true)
      setFirstName4(firstName4)
      setLastName4(lastName4)
      setPhone4(phoneN4)
      setEmail4(emailN4)
    }
    if (emergency.length > 4) {
      setBlock5(true)
      setFirstName5(firstName5)
      setLastName5(lastName5)
      setPhone5(phoneN5)
      setEmail5(emailN5)
    }
  }

  const firstName1 = emergency.length > 0 ? userinfo?.emergencyContacts[0].firstName : ''
  const lastName1 = emergency.length > 0 ? userinfo?.emergencyContacts[0].lastName : ''
  const emailN1 = emergency.length > 0 ? userinfo?.emergencyContacts[0].email : ''
  const phoneN1 = emergency.length > 0 ? userinfo?.emergencyContacts[0].phone : ''

  const firstName2 = emergency.length > 1 ? userinfo?.emergencyContacts[1].firstName : ''
  const lastName2 = emergency.length > 1 ? userinfo?.emergencyContacts[1].lastName : ''
  const phoneN2 = emergency.length > 1 ? userinfo?.emergencyContacts[1].phone : ''
  const emailN2 = emergency.length > 1 ? userinfo?.emergencyContacts[1].email : ''

  const firstName3 = emergency.length > 2 ? userinfo?.emergencyContacts[2].firstName : ''
  const lastName3 = emergency.length > 2 ? userinfo?.emergencyContacts[2].lastName : ''
  const phoneN3 = emergency.length > 2 ? userinfo?.emergencyContacts[2].phone : ''
  const emailN3 = emergency.length > 2 ? userinfo?.emergencyContacts[2].email : ''

  const firstName4 = emergency.length > 3 ? userinfo?.emergencyContacts[3].firstName : ''
  const lastName4 = emergency.length > 3 ? userinfo?.emergencyContacts[3].lastName : ''
  const phoneN4 = emergency.length > 3 ? userinfo?.emergencyContacts[3].phone : ''
  const emailN4 = emergency.length > 3 ? userinfo?.emergencyContacts[3].email : ''

  const firstName5 = emergency.length > 4 ? userinfo?.emergencyContacts[4].firstName : ''
  const lastName5 = emergency.length > 4 ? userinfo?.emergencyContacts[4].lastName : ''
  const phoneN5 = emergency.length > 4 ? userinfo?.emergencyContacts[4].phone : ''
  const emailN5 = emergency.length > 4 ? userinfo?.emergencyContacts[4].email : ''

  const [firstname1, setFirstName1] = useState(firstName1 || '')
  const [lastname1, setLastName1] = useState(lastName1 || '')
  const [rela1, setRela1] = useState(relationship1 || '')
  const [phone1, setPhone1] = useState(phoneN1 || '')
  const [email1, setEmail1] = useState(emailN1 || '')

  const [firstname2, setFirstName2] = useState(firstName2 || '')
  const [lastname2, setLastName2] = useState(lastName2 || '')
  const [rela2, setRela2] = useState(relationship2 || '')
  const [phone2, setPhone2] = useState(phoneN2 || '')
  const [email2, setEmail2] = useState(emailN2 || '')

  const [firstname3, setFirstName3] = useState(firstName3 || '')
  const [lastname3, setLastName3] = useState(lastName3 || '')
  const [rela3, setRela3] = useState(relationship3 || '')
  const [phone3, setPhone3] = useState(phoneN3 || '')
  const [email3, setEmail3] = useState(emailN3 || '')

  const [firstname4, setFirstName4] = useState(firstName4 || '')
  const [lastname4, setLastName4] = useState(lastName4 || '')
  const [rela4, setRela4] = useState(relationship4 || '')
  const [phone4, setPhone4] = useState(phoneN4 || '')
  const [email4, setEmail4] = useState(emailN4 || '')

  const [firstname5, setFirstName5] = useState(firstName5 || '')
  const [lastname5, setLastName5] = useState(lastName5 || '')
  const [rela5, setRela5] = useState(relationship5 || '')
  const [phone5, setPhone5] = useState(phoneN5 || '')
  const [email5, setEmail5] = useState(emailN5 || '')

  const renderEdit = () => {
    return (
      <View style={styles.ctnItem}>
        {(block1) && <View>
          <View style={styles.marginB8}>
            <Icon name={'user'} size={24} color={color040404} />
            <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginL8]}>
              {firstName1} {lastName1}
            </Text>
            {emergency.length > 0 && <Text style={[customTxt(Fonts.SemiBold, 14, color5C5D5E).txt, styles.marginL8]}>
              ({convertRela1()})
            </Text>}
            <TouchableOpacity
              onPress={() => {
                setBlock1(false)
                setDelete(true)
              }}
              style={styles.deleteIcon}>
              <Image source={icHealthProfile.ic_delete} style={styles.iconStyle} />
            </TouchableOpacity>
          </View>
          <CustomTextInput
            title={Translate(languageRedux).FIRST_NAME}
            value={firstname1 || ''}
            onChangeTxt={txt => setFirstName1(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            validate={firstname1 ? false : true}
          />
          <CustomTextInput
            title={Translate(languageRedux).surname}
            value={lastname1 || ''}
            onChangeTxt={txt => setLastName1(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            validate={lastname1 ? false : true}
          />
          <CustomTextInput
            title={Translate(languageRedux).RELATIONSHIP}
            value={rela1?.name || relationship1}
            onChangeTxt={txt => setRela1(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            iconRight={icHealthProfile.ic_dropdown}
            onPress={() => {
              setShowRela(true)
            }}
            validate={relationship1 || rela1?.name ? false : true}
          />
          <CustomTextInput
            title={Translate(languageRedux).PHONE}
            value={phone1 || ''}
            onChangeTxt={txt => setPhone1(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            validate={phone1 ? false : true}
            keyboardType={'phone-pad'}
          />
          <CustomTextInput
            title={Translate(languageRedux).EMAIL}
            value={email1 || ''}
            onChangeTxt={txt => setEmail1(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            autoCapitalize={'none'}
          />
        </View>}
        {(block2) && <View>
          <View style={styles.distance} />
          <View style={styles.marginB8}>
            <Icon name={'user'} size={24} color={color040404} />
            <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginL8]}>
              {firstName2} {lastName2}
            </Text>
            {emergency.length > 1 && <Text style={[customTxt(Fonts.SemiBold, 14, color5C5D5E).txt, styles.marginL8]}>
              ({convertRela2()})
            </Text>}
            <TouchableOpacity
              onPress={() => {
                setBlock2(false)
                setDelete(true)
              }}
              style={styles.deleteIcon}>
              <Image source={icHealthProfile.ic_delete} style={styles.iconStyle} />
            </TouchableOpacity>
          </View>
          <CustomTextInput
            title={Translate(languageRedux).FIRST_NAME}
            value={firstname2 || ''}
            onChangeTxt={txt => setFirstName2(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            validate={firstname2 ? false : true}
          />
          <CustomTextInput
            title={Translate(languageRedux).surname}
            value={lastname2 || ''}
            onChangeTxt={txt => setLastName2(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            validate={lastname2 ? false : true}
          />
          <CustomTextInput
            title={Translate(languageRedux).RELATIONSHIP}
            value={rela2?.name || relationship2}
            onChangeTxt={txt => setRela2(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            iconRight={icHealthProfile.ic_dropdown}
            onPress={() => {
              setShowRela2(true)
            }}
            validate={relationship2 || rela2?.name ? false : true}
          />
          <CustomTextInput
            title={Translate(languageRedux).PHONE}
            value={phone2 || ''}
            onChangeTxt={txt => setPhone2(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            validate={phone2 ? false : true}
            keyboardType={'phone-pad'}
          />
          <CustomTextInput
            title={Translate(languageRedux).EMAIL}
            value={email2 || ''}
            onChangeTxt={txt => setEmail2(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            autoCapitalize={'none'}
          />
        </View>}
        {(block3) && <View>
          <View style={styles.distance} />
          <View style={styles.marginB8}>
            <Icon name={'user'} size={24} color={color040404} />
            <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginL8]}>
              {firstName3} {lastName3}
            </Text>
            {emergency.length > 2 && <Text style={[customTxt(Fonts.SemiBold, 14, color5C5D5E).txt, styles.marginL8]}>
              ({convertRela3()})
            </Text>}
            <TouchableOpacity
              onPress={() => {
                setBlock3(false)
                setDelete(true)
              }}
              style={styles.deleteIcon}>
              <Image source={icHealthProfile.ic_delete} style={styles.iconStyle} />
            </TouchableOpacity>
          </View>
          <CustomTextInput
            title={Translate(languageRedux).FIRST_NAME}
            value={firstname3 || ''}
            onChangeTxt={txt => setFirstName3(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            validate={firstname3 ? false : true}
          />
          <CustomTextInput
            title={Translate(languageRedux).surname}
            value={lastname3 || ''}
            onChangeTxt={txt => setLastName3(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            validate={lastname3 ? false : true}
          />
          <CustomTextInput
            title={Translate(languageRedux).RELATIONSHIP}
            value={rela3?.name || relationship3}
            onChangeTxt={txt => setRela3(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            iconRight={icHealthProfile.ic_dropdown}
            onPress={() => {
              setShowRela3(true)
            }}
            validate={relationship3 || rela3?.name ? false : true}
          />
          <CustomTextInput
            title={Translate(languageRedux).PHONE}
            value={phone3 || ''}
            onChangeTxt={txt => setPhone3(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            validate={phone3 ? false : true}
            keyboardType={'phone-pad'}
          />
          <CustomTextInput
            title={Translate(languageRedux).EMAIL}
            value={email3 || ''}
            onChangeTxt={txt => setEmail3(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            autoCapitalize={'none'}
          />
        </View>}
        {(block4) && <View>
          <View style={styles.distance} />
          <View style={styles.marginB8}>
            <Icon name={'user'} size={24} color={color040404} />
            <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginL8]}>
              {firstName4} {lastName4}
            </Text>
            {emergency.length > 3 && <Text style={[customTxt(Fonts.SemiBold, 14, color5C5D5E).txt, styles.marginL8]}>
              ({convertRela4()})
            </Text>}
            <TouchableOpacity
              onPress={() => {
                setBlock4(false)
                setDelete(true)
              }}
              style={styles.deleteIcon}>
              <Image source={icHealthProfile.ic_delete} style={styles.iconStyle} />
            </TouchableOpacity>
          </View>
          <CustomTextInput
            title={Translate(languageRedux).FIRST_NAME}
            value={firstname4 || ''}
            onChangeTxt={txt => setFirstName4(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            validate={firstname4 ? false : true}
          />
          <CustomTextInput
            title={Translate(languageRedux).surname}
            value={lastname4 || ''}
            onChangeTxt={txt => setLastName4(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            validate={lastname4 ? false : true}
          />
          <CustomTextInput
            title={Translate(languageRedux).RELATIONSHIP}
            value={rela4?.name || relationship4}
            onChangeTxt={txt => setRela4(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            iconRight={icHealthProfile.ic_dropdown}
            onPress={() => {
              setShowRela4(true)
            }}
            validate={relationship4 || rela4?.name ? false : true}
          />
          <CustomTextInput
            title={Translate(languageRedux).PHONE}
            value={phone4 || ''}
            onChangeTxt={txt => setPhone4(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            validate={phone4 ? false : true}
            keyboardType={'phone-pad'}
          />
          <CustomTextInput
            title={Translate(languageRedux).EMAIL}
            value={email4 || ''}
            onChangeTxt={txt => setEmail4(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            autoCapitalize={'none'}
          />
        </View>}
        {(block5) && <View>
          <View style={styles.distance} />
          <View style={styles.marginB8}>
            <Icon name={'user'} size={24} color={color040404} />
            <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginL8]}>
              {firstName5} {lastName5}
            </Text>
            {emergency.length > 4 && <Text style={[customTxt(Fonts.SemiBold, 14, color5C5D5E).txt, styles.marginL8]}>
              ({convertRela5()})
            </Text>}
            <TouchableOpacity
              onPress={() => {
                setBlock5(false)
                setDelete(true)
              }}
              style={styles.deleteIcon}>
              <Image source={icHealthProfile.ic_delete} style={styles.iconStyle} />
            </TouchableOpacity>
          </View>
          <CustomTextInput
            title={Translate(languageRedux).FIRST_NAME}
            value={firstname5 || ''}
            onChangeTxt={txt => setFirstName5(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            validate={firstname5 ? false : true}
          />
          <CustomTextInput
            title={Translate(languageRedux).surname}
            value={lastname5 || ''}
            onChangeTxt={txt => setLastName5(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            validate={lastname5 ? false : true}
          />
          <CustomTextInput
            title={Translate(languageRedux).RELATIONSHIP}
            value={rela5?.name || relationship5}
            onChangeTxt={txt => setRela5(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            iconRight={icHealthProfile.ic_dropdown}
            onPress={() => {
              setShowRela5(true)
            }}
            validate={relationship5 || rela5?.name ? false : true}
          />
          <CustomTextInput
            title={Translate(languageRedux).PHONE}
            value={phone5 || ''}
            onChangeTxt={txt => setPhone5(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            validate={phone5 ? false : true}
            keyboardType={'phone-pad'}
          />
          <CustomTextInput
            title={Translate(languageRedux).EMAIL}
            value={email5 || ''}
            onChangeTxt={txt => setEmail5(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            autoCapitalize={'none'}
          />
        </View>}
      </View>
    )
  }

  const convertRela1 = () => {
    if (emergency.length > 0) {
      var i = listRela.filter(val => val.value === userinfo?.emergencyContacts[0].relationship)
      return i[0].name || ''
    }
  }
  const convertRela2 = () => {
    if (emergency.length > 1) {
      var i = listRela.filter(val => val.value === userinfo?.emergencyContacts[1].relationship)
      return i[0].name || ''
    }
  }
  const convertRela3 = () => {
    if (emergency.length > 2) {
      var i = listRela.filter(val => val.value === userinfo?.emergencyContacts[2].relationship)
      return i[0].name || ''
    }
  }
  const convertRela4 = () => {
    if (emergency.length > 3) {
      var i = listRela.filter(val => val.value === userinfo?.emergencyContacts[3].relationship)
      return i[0].name || ''
    }
  }
  const convertRela5 = () => {
    if (emergency.length > 4) {
      var i = listRela.filter(val => val.value === userinfo?.emergencyContacts[4].relationship)
      return i[0].name || ''
    }
  }

  const RenderItem = ({ category, content }) => {
    return (
      <View style={styles.ctnItem}>
        <Text style={customTxt(Fonts.SemiBold, 12, colorA7A8A9).txt}>
          {category}
        </Text>
        <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginT8]}>
          {content}
        </Text>
        <View style={styles.divider} />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View>
        {emergency.length > 0 && <TouchableOpacity onPress={() => {
          show1 && setShow1(false)
          show1 === false && setShow1(true)
        }}
          style={styles.ctnContact}>
          <View style={styles.flexRox}>
            <Icon name={'user'} size={24} color={color040404} />
            <View style={styles.ctnLabel}>
              <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginL8]}>
                {firstName1} {lastName1}
              </Text>
              <Text style={[customTxt(Fonts.SemiBold, 14, color5C5D5E).txt, styles.marginL8]}>
                ({convertRela1()})
              </Text>
            </View>
          </View>
          <Image source={show1 ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>}
        {show1 && <View>
          <RenderItem category={Translate(languageRedux).FIRST_NAME} content={firstName1} />
          <RenderItem category={Translate(languageRedux).surname} content={lastName1} />
          <RenderItem category={Translate(languageRedux).RELATIONSHIP} content={convertRela1()} />
          <RenderItem category={Translate(languageRedux).PHONE} content={phoneN1} />
          <RenderItem category={Translate(languageRedux).EMAIL} content={emailN1} />
        </View>}
        <View style={styles.distance} />

        {emergency.length > 1 && <TouchableOpacity onPress={() => {
          show2 && setShow2(false)
          show2 === false && setShow2(true)
        }} style={styles.ctnContact}>
          <View style={styles.flexRox}>
            <Icon name={'user'} size={24} color={color040404} />
            <View style={styles.ctnLabel}>
              <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginL8]}>
                {firstName2} {lastName2}
              </Text>
              <Text style={[customTxt(Fonts.SemiBold, 14, color5C5D5E).txt, styles.marginL8]}>
                ({convertRela2()})
              </Text>
            </View>
          </View>
          <Image source={show2 ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>}
        {show2 && <View>
          <RenderItem category={Translate(languageRedux).FIRST_NAME} content={firstName2} />
          <RenderItem category={Translate(languageRedux).surname} content={lastName2} />
          <RenderItem category={Translate(languageRedux).RELATIONSHIP} content={convertRela2()} />
          <RenderItem category={Translate(languageRedux).PHONE} content={phoneN2} />
          <RenderItem category={Translate(languageRedux).EMAIL} content={emailN2} />
        </View>}
        <View style={styles.distance} />

        {emergency.length > 2 && <TouchableOpacity onPress={() => {
          show3 && setShow3(false)
          show3 === false && setShow3(true)
        }} style={styles.ctnContact}>
          <View style={styles.flexRox}>
            <Icon name={'user'} size={24} color={color040404} />
            <View style={styles.ctnLabel}>
              <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginL8]}>
                {firstName3} {lastName3}
              </Text>
              <Text style={[customTxt(Fonts.SemiBold, 14, color5C5D5E).txt, styles.marginL8]}>
                ({convertRela3()})
              </Text>
            </View>
          </View>
          <Image source={show3 ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>}
        {show3 && <View>
          <RenderItem category={Translate(languageRedux).FIRST_NAME} content={firstName3} />
          <RenderItem category={Translate(languageRedux).surname} content={lastName3} />
          <RenderItem category={Translate(languageRedux).RELATIONSHIP} content={convertRela3()} />
          <RenderItem category={Translate(languageRedux).PHONE} content={phoneN3} />
          <RenderItem category={Translate(languageRedux).EMAIL} content={emailN3} />
        </View>}
        <View style={styles.distance} />

        {emergency.length > 3 && <TouchableOpacity onPress={() => {
          show4 && setShow4(false)
          show4 === false && setShow4(true)
        }} style={styles.ctnContact}>
          <View style={styles.flexRox}>
            <Icon name={'user'} size={24} color={color040404} />
            <View style={styles.ctnLabel}>
              <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginL8]}>
                {firstName4} {lastName4}
              </Text>
              <Text style={[customTxt(Fonts.SemiBold, 14, color5C5D5E).txt, styles.marginL8]}>
                ({convertRela4()})
              </Text>
            </View>
          </View>
          <Image source={show4 ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>}
        {show4 && <View>
          <RenderItem category={Translate(languageRedux).FIRST_NAME} content={firstName4} />
          <RenderItem category={Translate(languageRedux).surname} content={lastName4} />
          <RenderItem category={Translate(languageRedux).RELATIONSHIP} content={convertRela4()} />
          <RenderItem category={Translate(languageRedux).PHONE} content={phoneN4} />
          <RenderItem category={Translate(languageRedux).EMAIL} content={emailN4} />
        </View>}
        <View style={styles.distance} />

        {emergency.length > 4 && <TouchableOpacity onPress={() => {
          show5 && setShow5(false)
          show5 === false && setShow5(true)
        }} style={styles.ctnContact}>
          <View style={styles.flexRox}>
            <Icon name={'user'} size={24} color={color040404} />
            <View style={styles.ctnLabel}>
              <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginL8]}>
                {firstName5} {lastName5}
              </Text>
              <Text style={[customTxt(Fonts.SemiBold, 14, color5C5D5E).txt, styles.marginL8]}>
                ({convertRela5()})
              </Text>
            </View>
          </View>
          <Image source={show5 ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>}
        {show5 && <View>
          <RenderItem category={Translate(languageRedux).FIRST_NAME} content={firstName5} />
          <RenderItem category={Translate(languageRedux).surname} content={lastName5} />
          <RenderItem category={Translate(languageRedux).RELATIONSHIP} content={convertRela5()} />
          <RenderItem category={Translate(languageRedux).PHONE} content={phoneN5} />
          <RenderItem category={Translate(languageRedux).EMAIL} content={emailN5} />
        </View>}
      </View>
    )
  }

  const checkBodyEachOne = () => {
    if (block1 === false) {
      setShow1(false)
      var delItem = userinfo?.emergencyContacts.shift()
      return userinfo?.emergencyContacts
    }
    if (block2 === false) {
      setShow2(false)
      var delItem = userinfo?.emergencyContacts.splice(1, 1)
      return userinfo?.emergencyContacts
    }
    if (block3 === false) {
      setShow3(false)
      var delItem = userinfo?.emergencyContacts.splice(2, 1)
      return userinfo?.emergencyContacts
    }
    if (block4 === false) {
      setShow4(false)
      var delItem = userinfo?.emergencyContacts.splice(3, 1)
      return userinfo?.emergencyContacts
    }
    if (block5 === false) {
      setShow5(false)
      var delItem = userinfo?.emergencyContacts.pop()
      return userinfo?.emergencyContacts
    }
  }

  const _onPressDeleteEachOne = () => {
    const body = checkBodyEachOne()
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/webdoctor/updateEmergencyContacts`,
      headers: {
        'x-auth-token': token
      },
      data: body
    })
      .then(response => {
        console.log('data: ', response.data)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
    setLoading(true)
  }

  const checkBody = () => {
    if (block1 && block2 === false && block3 === false && block4 === false && block5 === false) {
      return [{
        firstName: firstname1,
        lastName: lastname1,
        email: email1,
        relationship: rela1?.value || userinfo?.emergencyContacts[0].relationship,
        phone: phone1,
        address: ''
      }]
    }
    if (block2 && block3 === false && block4 === false && block5 === false) {
      return [
        {
          firstName: firstname1,
          lastName: lastname1,
          email: email1,
          relationship: rela1?.value || userinfo?.emergencyContacts[0].relationship,
          phone: phone1,
          address: ''
        },
        {
          firstName: firstname2,
          lastName: lastname2,
          email: email2,
          relationship: rela2?.value || userinfo?.emergencyContacts[1].relationship,
          phone: phone2,
          address: ''
        }
      ]
    }
    if (block3 && block4 === false && block5 === false) {
      return [
        {
          firstName: firstname1,
          lastName: lastname1,
          email: email1,
          relationship: rela1?.value || userinfo?.emergencyContacts[0].relationship,
          phone: phone1,
          address: ''
        },
        {
          firstName: firstname2,
          lastName: lastname2,
          email: email2,
          relationship: rela2?.value || userinfo?.emergencyContacts[1].relationship,
          phone: phone2,
          address: ''
        },
        {
          firstName: firstname3,
          lastName: lastname3,
          email: email3,
          relationship: rela3?.value || userinfo?.emergencyContacts[2].relationship,
          phone: phone3,
          address: ''
        }
      ]
    }
    if (block4 && block5 === false) {
      return [
        {
          firstName: firstname1,
          lastName: lastname1,
          email: email1,
          relationship: rela1?.value || userinfo?.emergencyContacts[0].relationship,
          phone: phone1,
          address: ''
        },
        {
          firstName: firstname2,
          lastName: lastname2,
          email: email2,
          relationship: rela2?.value || userinfo?.emergencyContacts[1].relationship,
          phone: phone2,
          address: ''
        },
        {
          firstName: firstname3,
          lastName: lastname3,
          email: email3,
          relationship: rela3?.value || userinfo?.emergencyContacts[2].relationship,
          phone: phone3,
          address: ''
        },
        {
          firstName: firstname4,
          lastName: lastname4,
          email: email4,
          relationship: rela4?.value || userinfo?.emergencyContacts[3].relationship,
          phone: phone4,
          address: ''
        }
      ]
    }
    if (block5) {
      return [
        {
          firstName: firstname1,
          lastName: lastname1,
          email: email1,
          relationship: rela1?.value || userinfo?.emergencyContacts[0].relationship,
          phone: phone1,
          address: ''
        },
        {
          firstName: firstname2,
          lastName: lastname2,
          email: email2,
          relationship: rela2?.value || userinfo?.emergencyContacts[1].relationship,
          phone: phone2,
          address: ''
        },
        {
          firstName: firstname3,
          lastName: lastname3,
          email: email3,
          relationship: rela3?.value || userinfo?.emergencyContacts[2].relationship,
          phone: phone3,
          address: ''
        },
        {
          firstName: firstname4,
          lastName: lastname4,
          email: email4,
          relationship: rela4?.value || userinfo?.emergencyContacts[3].relationship,
          phone: phone4,
          address: ''
        },
        {
          firstName: firstname5,
          lastName: lastname5,
          email: email5,
          relationship: rela5?.value || userinfo?.emergencyContacts[4].relationship,
          phone: phone5,
          address: ''
        }
      ]
    }
  }

  const cleanCache = () => {
    setLoading(true)
    setDelete(false)
    if (block1 === false) {
      setFirstName1(firstName2 || '')
      setLastName1(lastName2 || '')
      setRela1(relationship2 || '')
      setPhone1(phoneN2 || '')
      setEmail1(emailN2 || '')
    }
    if (block2 === false) {
      setFirstName2(firstName3 || '')
      setLastName2(lastName3 || '')
      setRela2(relationship3 || '')
      setPhone2(phoneN3 || '')
      setEmail2(emailN3 || '')
    }
    if (block3 === false) {
      setFirstName3(firstName4 || '')
      setLastName3(lastName4 || '')
      setRela3(relationship4 || '')
      setPhone3(phoneN4 || '')
      setEmail3(emailN4 || '')
    }
    if (block4 === false) {
      setFirstName4(firstName5 || '')
      setLastName4(lastName5 || '')
      setRela4(relationship5 || '')
      setPhone4(phoneN5 || '')
      setEmail4(emailN5 || '')
    }
    if (block5 === false) {
      setFirstName5('')
      setLastName5('')
      setRela5('')
      setPhone5('')
      setEmail5('')
    }
  }

  const updateEmergencyContact = () => {
    const body = isDelete ? checkBodyEachOne() : checkBody()
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/webdoctor/updateEmergencyContacts`,
      headers: {
        'x-auth-token': token
      },
      data: body
    })
      .then(response => {
        console.log('data: ', response.data)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
    cleanCache()
  }

  const renderPlusButton = () => {
    return (
      <SOSButton
        source={icVisit.ic_plus}
        backgroundColor={color3777EE}
        onPress={() => {
          if (block1 === false) {
            setBlock1(true)
          }
          if (block2 === false && block1) {
            setBlock2(true)
          }
          if (block3 === false && block1 && block2) {
            setBlock3(true)
          }
          if (block4 === false && block1 && block2 && block3) {
            setBlock4(true)
          }
          if (block5 === false && block1 && block2 && block3 && block4) {
            setBlock5(true)
          }
          if (block5 && block1 && block2 && block3 && block4) {
            setNoti(true)
          }
        }}
      />
    )
  }

  const checkRightDisable = () => {
    if (edit) {
      if (block1 && block2 === false && block3 === false && block4 === false && block5 === false) {
        if (firstname1 && lastname1 && (rela1?.name || relationship1) && phone1) {
          return false
        }
        else {
          return true
        }
      }
      if (block2 && block3 === false && block4 === false && block5 === false) {
        if (firstname1 && lastname1 && (rela1?.name || relationship1) && phone1 &&
          firstname2 && lastname2 && (rela2?.name || relationship2) && phone2) {
          return false
        }
        else {
          return true
        }
      }
      if (block3 && block4 === false && block5 === false) {
        if (firstname1 && lastname1 && (rela1?.name || relationship1) && phone1 &&
          firstname2 && lastname2 && (rela2?.name || relationship2) && phone2 &&
          firstname3 && lastname3 && (rela3?.name || relationship3) && phone3) {
          return false
        }
        else {
          return true
        }
      }
      if (block4 && block5 === false) {
        if (firstname1 && lastname1 && (rela1?.name || relationship1) && phone1 &&
          firstname2 && lastname2 && (rela2?.name || relationship2) && phone2 &&
          firstname3 && lastname3 && (rela3?.name || relationship3) && phone3 &&
          firstname4 && lastname4 && (rela4?.name || relationship4) && phone4) {
          return false
        }
        else {
          return true
        }
      }
      if (block5) {
        if (firstname1 && lastname1 && (rela1?.name || relationship1) && phone1 &&
          firstname2 && lastname2 && (rela2?.name || relationship2) && phone2 &&
          firstname3 && lastname3 && (rela3?.name || relationship3) && phone3 &&
          firstname4 && lastname4 && (rela4?.name || relationship4) && phone4 &&
          firstname5 && lastname5 && (rela5?.name || relationship5) && phone5) {
          return false
        }
        else {
          return true
        }
      }
    }
  }

  const html = `
  <h1>${Translate(languageRedux).contact} 1</h1>
  <h2>${Translate(languageRedux).FIRST_NAME}</h2>
  <h1>${firstName1}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).surname}</h2>
  <h1>${lastName1}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
  <h1>${convertRela1()}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).PHONE}</h2>
  <h1>${phoneN1}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).EMAIL}</h2>
  <h1>${emailN1 || ''}</h1>
  <hr class="solid">
  `
  const html2 = `
  <h1>${Translate(languageRedux).contact} 1</h1>
  <h2>${Translate(languageRedux).FIRST_NAME}</h2>
  <h1>${firstName1}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).surname}</h2>
  <h1>${lastName1}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
  <h1>${convertRela1()}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).PHONE}</h2>
  <h1>${phoneN1}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).EMAIL}</h2>
  <h1>${emailN1 || ''}</h1>
  <hr class="solid">
  <h1>${Translate(languageRedux).contact} 2</h1>
  <h2>${Translate(languageRedux).FIRST_NAME}</h2>
  <h1>${firstName2}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).surname}</h2>
  <h1>${lastName2}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
  <h1>${convertRela2()}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).PHONE}</h2>
  <h1>${phoneN2}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).EMAIL}</h2>
  <h1>${emailN2 || ''}</h1>
  <hr class="solid">
  `
  const html3 = `
  <h1>${Translate(languageRedux).contact} 1</h1>
  <h2>${Translate(languageRedux).FIRST_NAME}</h2>
  <h1>${firstName1}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).surname}</h2>
  <h1>${lastName1}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
  <h1>${convertRela1()}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).PHONE}</h2>
  <h1>${phoneN1}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).EMAIL}</h2>
  <h1>${emailN1 || ''}</h1>
  <hr class="solid">
  <h1>${Translate(languageRedux).contact} 2</h1>
  <h2>${Translate(languageRedux).FIRST_NAME}</h2>
  <h1>${firstName2}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).surname}</h2>
  <h1>${lastName2}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
  <h1>${convertRela2()}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).PHONE}</h2>
  <h1>${phoneN2}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).EMAIL}</h2>
  <h1>${emailN2 || ''}</h1>
  <hr class="solid">
  <h1>${Translate(languageRedux).contact} 3</h1>
  <h2>${Translate(languageRedux).FIRST_NAME}</h2>
  <h1>${firstName3}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).surname}</h2>
  <h1>${lastName3}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
  <h1>${convertRela3()}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).PHONE}</h2>
  <h1>${phoneN3}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).EMAIL}</h2>
  <h1>${emailN3 || ''}</h1>
  <hr class="solid">
  `
  const html4 = `
  <h1>${Translate(languageRedux).contact} 1</h1>
  <h2>${Translate(languageRedux).FIRST_NAME}</h2>
  <h1>${firstName1}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).surname}</h2>
  <h1>${lastName1}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
  <h1>${convertRela1()}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).PHONE}</h2>
  <h1>${phoneN1}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).EMAIL}</h2>
  <h1>${emailN1 || ''}</h1>
  <hr class="solid">
  <h1>${Translate(languageRedux).contact} 2</h1>
  <h2>${Translate(languageRedux).FIRST_NAME}</h2>
  <h1>${firstName2}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).surname}</h2>
  <h1>${lastName2}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
  <h1>${convertRela2()}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).PHONE}</h2>
  <h1>${phoneN2}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).EMAIL}</h2>
  <h1>${emailN2 || ''}</h1>
  <hr class="solid">
  <h1>${Translate(languageRedux).contact} 3</h1>
  <h2>${Translate(languageRedux).FIRST_NAME}</h2>
  <h1>${firstName3}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).surname}</h2>
  <h1>${lastName3}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
  <h1>${convertRela3()}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).PHONE}</h2>
  <h1>${phoneN3}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).EMAIL}</h2>
  <h1>${emailN3 || ''}</h1>
  <hr class="solid">
  <h1>${Translate(languageRedux).contact} 4</h1>
  <h2>${Translate(languageRedux).FIRST_NAME}</h2>
  <h1>${firstName4}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).surname}</h2>
  <h1>${lastName4}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
  <h1>${convertRela4()}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).PHONE}</h2>
  <h1>${phoneN4}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).EMAIL}</h2>
  <h1>${emailN4 || ''}</h1>
  <hr class="solid">
  `
  const html5 = `
  <h1>${Translate(languageRedux).contact} 1</h1>
  <h2>${Translate(languageRedux).FIRST_NAME}</h2>
  <h1>${firstName1}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).surname}</h2>
  <h1>${lastName1}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
  <h1>${convertRela1()}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).PHONE}</h2>
  <h1>${phoneN1}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).EMAIL}</h2>
  <h1>${emailN1 || ''}</h1>
  <hr class="solid">
  <h1>${Translate(languageRedux).contact} 2</h1>
  <h2>${Translate(languageRedux).FIRST_NAME}</h2>
  <h1>${firstName2}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).surname}</h2>
  <h1>${lastName2}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
  <h1>${convertRela2()}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).PHONE}</h2>
  <h1>${phoneN2}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).EMAIL}</h2>
  <h1>${emailN2 || ''}</h1>
  <hr class="solid">
  <h1>${Translate(languageRedux).contact} 3</h1>
  <h2>${Translate(languageRedux).FIRST_NAME}</h2>
  <h1>${firstName3}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).surname}</h2>
  <h1>${lastName3}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
  <h1>${convertRela3()}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).PHONE}</h2>
  <h1>${phoneN3}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).EMAIL}</h2>
  <h1>${emailN3 || ''}</h1>
  <hr class="solid">
  <h1>${Translate(languageRedux).contact} 4</h1>
  <h2>${Translate(languageRedux).FIRST_NAME}</h2>
  <h1>${firstName4}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).surname}</h2>
  <h1>${lastName4}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
  <h1>${convertRela4()}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).PHONE}</h2>
  <h1>${phoneN4}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).EMAIL}</h2>
  <h1>${emailN4 || ''}</h1>
  <hr class="solid">
  <h1>${Translate(languageRedux).contact} 5</h1>
  <h2>${Translate(languageRedux).FIRST_NAME}</h2>
  <h1>${firstName5}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).surname}</h2>
  <h1>${lastName5}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
  <h1>${convertRela5()}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).PHONE}</h2>
  <h1>${phoneN5}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).EMAIL}</h2>
  <h1>${emailN5 || ''}</h1>
  <hr class="solid">
  `
  const _onPressPrinttoPDF = async () => {
    const results = await RNHTMLtoPDF.convert({
      html: html,
      fileName: Translate(languageRedux).EMERGENCY_CONTACT,
      base64: true
    })
    await RNPrint.print({ filePath: results.filePath })
  }

  const _onPressPrinttoPDF2 = async () => {
    const results = await RNHTMLtoPDF.convert({
      html: html2,
      fileName: Translate(languageRedux).EMERGENCY_CONTACT,
      base64: true
    })
    await RNPrint.print({ filePath: results.filePath })
  }

  const _onPressPrinttoPDF3 = async () => {
    const results = await RNHTMLtoPDF.convert({
      html: html3,
      fileName: Translate(languageRedux).EMERGENCY_CONTACT,
      base64: true
    })
    await RNPrint.print({ filePath: results.filePath })
  }

  const _onPressPrinttoPDF4 = async () => {
    const results = await RNHTMLtoPDF.convert({
      html: html4,
      fileName: Translate(languageRedux).EMERGENCY_CONTACT,
      base64: true
    })
    await RNPrint.print({ filePath: results.filePath })
  }

  const _onPressPrinttoPDF5 = async () => {
    const results = await RNHTMLtoPDF.convert({
      html: html5,
      fileName: Translate(languageRedux).EMERGENCY_CONTACT,
      base64: true
    })
    await RNPrint.print({ filePath: results.filePath })
  }

  const checkPrint = () => {
    if (block1 && block2 === false && block3 === false && block4 === false && block5 === false) {
      return _onPressPrinttoPDF
    }
    if (block2 && block3 === false && block4 === false && block5 === false) {
      return _onPressPrinttoPDF2
    }
    if (block3 && block4 === false && block5 === false) {
      return _onPressPrinttoPDF3
    }
    if (block4 && block5 === false) {
      return _onPressPrinttoPDF4
    }
    if (block5) {
      return _onPressPrinttoPDF5
    }
  }

  const _onPressShare = async () => {
    const checkShare = () => {
      if (block1 && block2 === false && block3 === false && block4 === false && block5 === false) {
        return results.base64
      }
      if (block2 && block3 === false && block4 === false && block5 === false) {
        return results2.base64
      }
      if (block3 && block4 === false && block5 === false) {
        return results3.base64
      }
      if (block4 && block5 === false) {
        return results4.base64
      }
      if (block5) {
        return results5.base64
      }
    }
    const results = await RNHTMLtoPDF.convert({
      html: html,
      fileName: Translate(languageRedux).EMERGENCY_CONTACT,
      base64: true
    })
    const results2 = await RNHTMLtoPDF.convert({
      html: html2,
      fileName: Translate(languageRedux).EMERGENCY_CONTACT,
      base64: true
    })
    const results3 = await RNHTMLtoPDF.convert({
      html: html3,
      fileName: Translate(languageRedux).EMERGENCY_CONTACT,
      base64: true
    })
    const results4 = await RNHTMLtoPDF.convert({
      html: html4,
      fileName: Translate(languageRedux).EMERGENCY_CONTACT,
      base64: true
    })
    const results5 = await RNHTMLtoPDF.convert({
      html: html5,
      fileName: Translate(languageRedux).EMERGENCY_CONTACT,
      base64: true
    })
    let options = {
      url: `data:application/pdf;base64,${checkShare()}`,
      fileName: Translate(languageRedux).EMERGENCY_CONTACT
    }
    Share.open(options)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        err && console.log(err)
      })
  }

  const pressBackFromEdit = () => {
    setEdit(false)
    setBlock1(emergency.length > 0 ? true : false)
    setBlock2(emergency.length > 1 ? true : false)
    setBlock3(emergency.length > 2 ? true : false)
    setBlock4(emergency.length > 3 ? true : false)
    setBlock5(emergency.length > 4 ? true : false)
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={
          edit
            ? Translate(languageRedux).EDIT_EMERGENCY_CONTACT
            : Translate(languageRedux).EMERGENCY_CONTACT
        }
        iconLeft={edit ? icHeader.ic_close : icHeader.ic_left}
        iconRight={edit === false && icHeader.ic_function}
        textRight={edit === true && Translate(languageRedux).btnsave}
        textRightColor={checkRightDisable() ? colorF0F0F0 : color3777EE}
        onPressLeft={() => {
          edit ? pressBackFromEdit() : NavigationService.goBack()
        }}
        onPressRight={() => {
          edit === true && updateEmergencyContact()
          edit === true && setLoading(true)
          edit === true && setEdit(false)
          edit === false && setShow(true)
        }}
        rightDisabled={checkRightDisable()}
      />
      <KeyboardAwareScrollView style={styles.marginT20}>
        {edit ? renderEdit() : renderBody()}
      </KeyboardAwareScrollView>
      {edit && emergency.length <= 4 && renderPlusButton()}
      {isShow && (
        <View style={styles.floatView}>
          <FunctionButton
            onPressCancel={() => {
              setShow(false)
            }}
            onPressEdit={() => {
              setEdit(true)
              setLoading(true)
              isShow === true && setShow(false)
            }}
            onPressPrint={checkPrint()}
            onPressShare={_onPressShare}
          />
        </View>
      )}
      {isShowRela && (
        <SearchListWithName
          listData={listRela}
          title={Translate(languageRedux).CHOOSE_RELA}
          itemSelected={rela1}
          onItemClick={val => {
            setRela1(val)
            setShowRela(false)
          }}
          onPressRight={() => {
            setShowRela(false)
          }}
        />
      )}
      {isShowRela2 && (
        <SearchListWithName
          listData={listRela}
          title={Translate(languageRedux).CHOOSE_RELA}
          itemSelected={rela2}
          onItemClick={val => {
            setRela2(val)
            setShowRela2(false)
          }}
          onPressRight={() => {
            setShowRela2(false)
          }}
        />
      )}
      {isShowRela3 && (
        <SearchListWithName
          listData={listRela}
          title={Translate(languageRedux).CHOOSE_RELA}
          itemSelected={rela3}
          onItemClick={val => {
            setRela3(val)
            setShowRela3(false)
          }}
          onPressRight={() => {
            setShowRela3(false)
          }}
        />
      )}
      {isShowRela4 && (
        <SearchListWithName
          listData={listRela}
          title={Translate(languageRedux).CHOOSE_RELA}
          itemSelected={rela4}
          onItemClick={val => {
            setRela4(val)
            setShowRela4(false)
          }}
          onPressRight={() => {
            setShowRela4(false)
          }}
        />
      )}
      {isShowRela5 && (
        <SearchListWithName
          listData={listRela}
          title={Translate(languageRedux).CHOOSE_RELA}
          itemSelected={rela5}
          onItemClick={val => {
            setRela5(val)
            setShowRela5(false)
          }}
          onPressRight={() => {
            setShowRela5(false)
          }}
        />
      )}
      {isShowNew === true && (
        <View style={[styles.floatView]}>
          <NewEmergency
            onPressCancel={() => {
              setShowNew(false)
            }}
          />
        </View>
      )}
      {isShowDelete &&
        <DialogCustom
          title={'Are you sure want to delete ?'}
          txtlLeft={Translate(languageRedux).cancel}
          onPressCancel={() => { setShowDelete(false) }}
          txtRight={Translate(languageRedux).delete}
          onPressOK={_onPressDeleteEachOne}
        />}
      {isNoti &&
        <DialogCustom
          title={Translate(languageRedux).MESSAGE_WHEN_ADD_5_MORE}
          txtlLeft={Translate(languageRedux).OK}
          onPressCancel={() => { setNoti(false) }}
        />}
      {isLoad && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  marginT20: {
    marginTop: 20,
    marginBottom: 42
  },
  ctnItem: {
    marginHorizontal: 20,
    marginBottom: 16
  },
  marginT8: {
    marginTop: 8,
    marginBottom: 16
  },
  divider: {
    height: 1,
    backgroundColor: colorF0F0F0
  },
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  ctnContact: {
    marginHorizontal: 20,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  marginB8: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  distance: {
    marginTop: 20
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  flexRox: {
    flexDirection: 'row'
  },
  marginL8: {
    marginLeft: 8
  },
  ctnLabel: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  deleteIcon: {
    flex: 1,
    alignItems: 'flex-end'
  }
})
