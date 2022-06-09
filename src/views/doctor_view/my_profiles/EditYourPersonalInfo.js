import { color040404, color3777EE, colorBDBDBD, colorC1C3C5, colorF0F0F0, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import React, { useState, useEffect } from 'react'
import {
  Dimensions, TouchableOpacity,
  StyleSheet, View, Text, Image,
  DeviceEventEmitter
} from 'react-native'
import { useSelector } from 'react-redux'
import Translate from 'translate'
import TextInputView from 'views/login_signup/components/TextInputView'
import imgDirect from '../../../../assets/images/direct_call'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CustomTextInput from 'views/healthProfile/components/CustomTextInput'
import imgHome from '../../../../assets/images/home_screen'
import { convertDDMMYYYY } from 'constants/DateHelpers'
import _ from 'lodash'

export default function EditYourPersonalInfoView({
  onPressClose, virtualOffice, onPressEdit,
  onPressGender, genderChanged, onPressSpeciality
}) {
  const summaryRedux = useSelector(state => state.user.summary)
  const languageRedux = useSelector(state => state.common.language)
  const [firstName, setFirstName] = useState(virtualOffice?.name || '')
  const [lastName, setLastName] = useState(virtualOffice?.surname || '')
  const [birthday, setBirthday] = useState((summaryRedux?.birthdate ? convertDDMMYYYY(summaryRedux?.birthdate) : '') || '')
  const [school, setSchool] = useState(virtualOffice?.school || '')
  const [specialty, setSpecialty] = useState('')
  const [lengthPractice, setLengthPractice] = useState(virtualOffice?.lengthpractice || '')
  const [officeAddress, setOfficeAddress] = useState(virtualOffice?.address || '')
  const [phone, setPhone] = useState(virtualOffice?.phone || '')
  const [isChanges, setChanges] = useState(false)
  const [lsSpec, setLsSpec] = useState([])
  const [licenseNumber, setLicenseNumber] = useState(virtualOffice?.licenseNumber || '')

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('EditYourPersonalInfoView', (data) => {
      setChanges(true)
      if (data?.genderChanged && data?.lsSpecialty) {
        setLsSpec(data?.lsSpecialty)
        const getIntSpec = (data?.lsSpecialty || []).filter(val => val?.isSelected === true).map(val => {
          return (Number(val?.value || -1))
        })
        var specStr = ''
        const getLsSpec2 = ((data?.lsSpecialty || []).filter(val => val?.isSelected)).map((val, index) => {
          specStr += `${val?.label} ${(data?.lsSpecialty || []).length === (index + 2) ? ' and ' : ((data?.lsSpecialty || []).length === (index + 1) ? '.' : ', ')}`
          return `${val?.label} ${(data?.lsSpecialty || []).length === (index + 2) ? ' and ' : ((data?.lsSpecialty || []).length === (index + 1) ? '.' : ', ')}`
        })
        console.log('getLsSpec2: ', getLsSpec2)
        setSpecialty(specStr)
        if (
          virtualOffice?.name === firstName &&
          virtualOffice?.surname === lastName &&
          ((summaryRedux?.birthdate ? convertDDMMYYYY(summaryRedux?.birthdate) : '') || '') === birthday &&
          virtualOffice?.lengthpractice === lengthPractice &&
          virtualOffice?.phone === phone &&
          virtualOffice?.address === officeAddress &&
          virtualOffice?.specialization === getIntSpec &&
          genderChanged?.name === data?.genderChanged?.name
        ) {
          setChanges(false)
        } else {
          setChanges(true)
        }
      }
    })
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    if (
      virtualOffice?.name === firstName &&
      virtualOffice?.surname === lastName &&
      ((summaryRedux?.birthdate ? convertDDMMYYYY(summaryRedux?.birthdate) : '') || '') === birthday &&
      virtualOffice?.lengthpractice === lengthPractice &&
      virtualOffice?.phone === phone &&
      virtualOffice?.address === officeAddress
    ) {
      setChanges(false)
    }
  }, [firstName, lastName, birthday, lengthPractice, officeAddress, phone])

  useEffect(() => {
    var specStr = ''
    const getLsSpec2 = (summaryRedux?.specialization || []).map((val, index) => {
      specStr += `${val?.name} ${(summaryRedux?.specialization || []).length === (index + 2) ? ' and ' : ((summaryRedux?.specialization || []).length === (index + 1) ? '.' : ', ')}`
      return `${val?.name} ${(summaryRedux?.specialization || []).length === (index + 2) ? ' and ' : ((summaryRedux?.specialization || []).length === (index + 1) ? '.' : ', ')}`
    })
    console.log('getLsSpec2: ', getLsSpec2)
    setSpecialty(specStr)
    const convertSpec = (getLsSpec2 || []).map(val => {
      return {
        value: val,
        isSelected: true
      }
    })
    console.log('getLsSpec2: ', getLsSpec2)
    console.log('convertSpec: ', convertSpec)
    setLsSpec(convertSpec)
  }, [summaryRedux])

  const renderHeaderView = () => {
    return (
      <View style={styles.headerView}>
        <Text style={[
          customTxt(Fonts.SemiBold, 16, color040404).txt
        ]}>{Translate(languageRedux).EDIT_YOUR_PERSONAL_INFO}</Text>
        <TouchableOpacity style={styles.closeView} onPress={onPressClose}>
          <Image source={imgDirect.ic_close} style={styles.imgClose} />
        </TouchableOpacity>
      </View>
    )
  }

  const renderContent = () => {
    const countSpec = (lsSpec || []).filter(val => val?.isSelected === true).length
    const strCount = countSpec === 0 ? '' : `(${countSpec})`
    return (
      <>
        <View style={styles.rowView}>
          <TextInputView
            title={Translate(languageRedux).FIRST_NAME}
            value={firstName}
            onChangeTxt={(txt) => {
              setFirstName(txt)
              setChanges(true)
            }}
            placeholder={Translate(languageRedux).FIRST_NAME}
            validate={firstName ? false : true}
            style={styles.fullTxtInputLeft}
          />
          <TextInputView
            title={Translate(languageRedux).surname}
            value={lastName}
            onChangeTxt={(txt) => {
              setChanges(true)
              setLastName(txt)
            }}
            placeholder={Translate(languageRedux).surname}
            validate={lastName ? false : true}
            style={styles.fullTxtInputRight}
          />
        </View>
        {/* <View style={styles.rowView}>
          <TextInputView
            title={Translate(languageRedux).birthday_member}
            value={birthday}
            onChangeTxt={(txt) => setBirthday(txt)}
            placeholder={Translate(languageRedux).birthday_member}
            validate={birthday ? false : true}
            style={styles.fullTxtInputLeft}
          />
          <CustomTextInput
            title={Translate(languageRedux).gender1}
            value={genderChanged?.name || ''}
            placeholder={Translate(languageRedux).gender1}
            textStyle={styles.txtStyle}
            onPress={() => {}}
            // onPress={onPressGender}
            iconRight={imgHome.ic_down}
            style={styles.fullTxtInputRight}
          />
        </View> */}
        <CustomTextInput
          title={`${Translate(languageRedux).SPECIALITY} ${strCount}`}
          value={specialty}
          placeholder={Translate(languageRedux).select}
          textStyle={styles.txtStyle}
          onPress={onPressSpeciality}
          iconRight={imgHome.ic_down}
          validate={!specialty}
        />
        <TextInputView
          title={Translate(languageRedux).M_SCHOOL}
          value={school}
          onChangeTxt={(txt) => {
            setChanges(true)
            setSchool(txt)
          }}
          placeholder={Translate(languageRedux).M_SCHOOL}
          validate={school ? false : true}
        />
        <TextInputView
          title={Translate(languageRedux).PRACTICE_LENGTH}
          value={lengthPractice}
          onChangeTxt={(txt) => {
            setChanges(true)
            setLengthPractice(txt)
          }}
          placeholder={Translate(languageRedux).PRACTICE_LENGTH}
          validate={lengthPractice ? false : true}
        />
        {/* //licenseNumber */}
        <TextInputView
          title={Translate(languageRedux).LICENSE_NUMBER}
          value={licenseNumber}
          onChangeTxt={(txt) => {
            setChanges(true)
            setLicenseNumber(txt)
          }}
          placeholder={Translate(languageRedux).LICENSE_NUMBER}
          validate={licenseNumber ? false : true}
        />
        <TextInputView
          title={Translate(languageRedux).OFFICE_ADDRESS}
          value={officeAddress}
          onChangeTxt={(txt) => {
            setChanges(true)
            setOfficeAddress(txt)
          }}
          placeholder={Translate(languageRedux).OFFICE_ADDRESS}
          validate={officeAddress ? false : true}
        />
        <TextInputView
          title={Translate(languageRedux).phone1}
          value={phone}
          onChangeTxt={(txt) => {
            setChanges(true)
            setPhone(txt)
          }}
          placeholder={Translate(languageRedux).phone1}
          validate={phone ? false : true}
        />
      </>
    )
  }

  const checkBT = () => {
    return isChanges && specialty && firstName && lastName && lengthPractice && officeAddress && phone && licenseNumber && school
  }

  const renderSubmitButton = () => {
    return (
      <View style={styles.addBT}>
        <TouchableOpacity
          style={btStyle(checkBT()).btView}
          activeOpacity={checkBT() ? 0 : 1}
          onPress={() => onPressEdit(
            firstName,
            lastName,
            lengthPractice,
            officeAddress,
            phone,
            licenseNumber,
            school
          )}
        >
          <Text style={[
            customTxt(Fonts.SemiBold, 18, colorC1C3C5).txt,
            btStyle(checkBT()).txtBT
          ]}>{Translate(languageRedux).SAVE_CHANGES}</Text>
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
          contentContainerStyle={styles.contentStyle}
        >
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
    marginTop: 16
  },
  textinputNoteStyle: {
    flex: 1,
    height: 120,
    paddingTop: 14,
    paddingBottom: 14
  },
  addBT: {
    marginTop: 16
  },
  rowView: {
    flexDirection: 'row'
  },
  fullTxtInputLeft: {
    flex: 1,
    marginRight: 8
  },
  fullTxtInputRight: {
    flex: 1,
    marginLeft: 8
  },
  contentStyle: {
    paddingBottom: 40
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
