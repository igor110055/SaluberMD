import React, { useEffect, useState } from 'react'
import {
  StyleSheet, View, Text, TouchableOpacity,
  Image,
  DeviceEventEmitter
} from 'react-native'
import {
  color040404,
  color3777EE,
  color828282,
  colorC1C3C5,
  colorF0F0F0,
  colorF2F2F2,
  colorF5455B,
  colorF8F8F8,
  colorFFFFFF
} from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import CustomTextInput from '../../components/CustomTextInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Header from '../../components/Header'
import icHealthProfile from '../../../../../assets/images/health_profile'
import icHeader from '../../../../../assets/images/header'
import _ from 'lodash'
import NavigationService from '../../../../navigation'
import Routes from '../../../../navigation/Routes'
import CustomDatePicker from '../../../../components/CustomDatePicker'
import { convertDMMMYYYY, getDate112000 } from '../../../../constants/DateHelpers'
import { useSelector } from 'react-redux'
import SearchListWithName from '../../../../components/SearchListWithName'
import moment from 'moment'
import imgHealth from '../../../../../assets/images/health_profile'
import icDoc from '../../../../../assets/images/document'
import Translate from 'translate'

export default function DetailAllergie({ route }) {
  const passingData = route?.params?.data
  const [allergy, setAllergy] = useState({name: passingData?.name || '', id: passingData?.id})
  const [genericName, setGenericName] = useState(passingData?.genericName || '')
  const [since, setSince] = useState(passingData?.since || getDate112000())
  const [note, setNote] = useState(passingData?.note || '')
  const [isEmergency, setEmergency] = useState(passingData?.isEmergency || false)
  const indexData = route?.params?.index
  const lsData = route?.params?.lsData || []
  const lsDelete = route?.params?.lsDelete || []
  const [isMissAllergy, setMissAllergy] = useState(false)
  const datePickerRef = React.createRef()
  const lsAllergi = useSelector(state => state.common.allergies)
  const [isShowAllergies, setShowAllergies] = useState(false)
  const [other, setOther] = useState(passingData?.other || '')
  const tempHiden = route?.params?.tempHiden
  const languageRedux = useSelector(state => state.common.language)

  useEffect(() => {
    console.log('Passing data: ', passingData)
    console.log('lsData: ', lsData)
  }, [])

  const renderTextInput = () => {
    return (
      <>
        <CustomTextInput
          title={Translate(languageRedux).allergia}
          value={allergy?.name || ''}
          onChangeTxt={(txt) => {
            setMissAllergy(false)
            setAllergy(txt)
          }}
          placeholder={Translate(languageRedux).PH_GENERIC_NAME}
          validate={isMissAllergy}
          onPress={() => setShowAllergies(true)}
          iconRight={imgHealth.ic_dropdown}
        />
        {
          allergy?.id === 1 && (
            <CustomTextInput
              title={Translate(languageRedux).other}
              value={other}
              onChangeTxt={(txt) => setOther(txt)}
              placeholder={Translate(languageRedux).PH_GENERIC_NAME}
              textStyle={styles.txtStyle}
              validate={other ? false : true}
            />
          )
        }
        <CustomTextInput
          title={Translate(languageRedux).genericName}
          value={genericName}
          onChangeTxt={(txt) => setGenericName(txt)}
          placeholder={Translate(languageRedux).PH_GENERIC_NAME}
          textStyle={styles.txtStyle}
        />
        <View>
          <CustomTextInput
            title={Translate(languageRedux).since}
            value={since ? convertDMMMYYYY(since) : ''}
            onChangeTxt={(txt) => setSince(txt)}
            placeholder={Translate(languageRedux).SELECT_A_DATE}
            textStyle={styles.txtStyle}
            iconRight={icDoc.ic_choose_date}
          />
          <TouchableOpacity style={styles.fullView} onPress={() => datePickerRef.current.onPressDate()} />
        </View>
        <CustomTextInput
          title={Translate(languageRedux).note}
          value={note}
          onChangeTxt={(txt) => setNote(txt)}
          placeholder={Translate(languageRedux).INSERT_ANY_OTHER_INFO}
          textStyle={styles.txtStyle}
          textinputStyle={[styles.textinputNoteStyle]}
          multiline={true}
        />
      </>
    )
  }

  const renderShowEmergency = () => {
    return (
      <View style={styles.emergencyView}>
        <TouchableOpacity onPress={() => setEmergency(!isEmergency)}>
          <Image
            style={styles.imgEmergency}
            source={isEmergency ? icHealthProfile.ic_checkbox : icHealthProfile.ic_emptybox}
          />
        </TouchableOpacity>
        <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>Show on emergency</Text>
      </View>
    )
  }

  const _onPressDelete = () => {
    var newData = []
    var dataDelete = []
    const deleteItem = (lsData || []).forEach(function (value, index) {
      if (index !== indexData) {
        newData.push(value)
      }
      if (index === indexData) {
        var item = {}
        item.id = value?.itemID
        dataDelete.push(item)
      }
    })
    var listDelete = _.concat(lsDelete, dataDelete)
    console.log(deleteItem)
    console.log('Run newData: ', newData)
    setTimeout(() => {
      DeviceEventEmitter.emit(Routes.MEDICAL_RECORD_SCREEN,
        {newData: newData, dataDelete: listDelete})
    }, (200))
    NavigationService.goBack()
  }

  const renderMandatoryInfo = () => {
    return (
      <View style={styles.madatoryInfoView}>
        <Text style={customTxt(Fonts.Regular, 12, color828282).txt}>Mandatory info*</Text>
      </View>
    )
  }

  const renderDeleteAllergy = () => {
    return (
      <TouchableOpacity
        style={styles.deleteView}
        activeOpacity={allergy ? 0 : 1}
        onPress={_onPressDelete}
      >
        <Text style={[
          customTxt(Fonts.SemiBold, 18, colorF5455B).txt,
          styles.txtDelete
        ]}>Delete Allergy</Text>
      </TouchableOpacity>
    )
  }

  const renderNewAllergy = () => {
    return (
      <View style={[
        styles.questionView
      ]}>
        {renderTextInput()}
        {renderShowEmergency()}
        {renderMandatoryInfo()}
      </View>
    )
  }

  const _onPressRight = () => {
    if (_.isEmpty(allergy)) {
      setMissAllergy(true)
      return
    }
    const callBackBD = {
      name: allergy?.name || '',
      id: allergy?.id,
      other: other,
      genericName: genericName || '',
      since: since || '',
      note: note || '',
      isEmergency: isEmergency || false,
      isUpdate: true,
      itemID: passingData?.itemID
    }

    lsData[indexData] = callBackBD
    DeviceEventEmitter.emit(Routes.MEDICAL_RECORD_SCREEN, {newData: lsData, dataDelete: lsDelete})
    NavigationService.goBack()
  }

  const _onChangeDatePicker = (date) => {
    setSince(date)
  }

  const checkBTSubmit = () => {
    if (_.isEmpty(allergy?.name) && allergy?.id !== 1) {
      return true
    }
    if (allergy?.id === 1 && _.isEmpty(other)) {
      return true
    }
    return false
  }

  const dateLocal = moment(since).local().format('YYYY-MM-DD')
  const UTCDate = moment(dateLocal).utc().valueOf()
  const checkEmergency = () => {
    if (isEmergency === true) {
      return 1
    }
    if (isEmergency === false) {
      return 0
    }
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        title={Translate(languageRedux).allergie}
        disabled={checkBTSubmit()}
        onPressSubmit={_onPressRight}
        source={icHeader.ic_left}
        buttonText={Translate(languageRedux).btnsave}
        backgroundColorButton={!checkBTSubmit() ? color3777EE : colorF0F0F0}
        textButtonColor={!checkBTSubmit() ? colorFFFFFF : colorC1C3C5}
      />
      <KeyboardAwareScrollView>
        {renderNewAllergy()}
        {renderDeleteAllergy()}
      </KeyboardAwareScrollView>
      <CustomDatePicker
        refDatePicker={datePickerRef}
        onChangeDate={_onChangeDatePicker}
        maxDate={new Date()}
        date={getDate112000()}
      />
      {
        isShowAllergies && (
          <SearchListWithName
            listData={lsAllergi}
            title={Translate(languageRedux).CHOOSE_ALLERGY}
            itemSelected={allergy}
            onItemClick={(val) => {
              setAllergy(val)
              setOther('')
              setShowAllergies(false)
            }}
            onPressRight={() => {
              setShowAllergies(false)
            }}
            lsHiden={tempHiden}
          />
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  questionView: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 24,
    backgroundColor: colorFFFFFF,
    padding: 16,
    paddingBottom: 32,
    borderRadius: 8
  },
  marginT8: {
    marginTop: 8
  },
  txtStyle: {
    marginTop: 24
  },
  textinputNoteStyle: {
    flex: 1,
    height: 70,
    paddingTop: 14,
    paddingBottom: 14
  },
  emergencyView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  imgEmergency: {
    width: 24,
    height: 24,
    marginTop: 24,
    marginRight: 16,
    marginBottom: 24
  },
  madatoryInfoView: {
    alignItems: 'center',
    marginTop: 8
  },
  paddingB48: {
    marginBottom: 48
  },
  imgDetail: {
    width: 24,
    height: 24
  },
  allerigeView: {
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: colorF2F2F2,
    alignItems: 'center',
    paddingTop: 16,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 13,
    marginBottom: 8
  },
  itemAllerigeView: {
    flex: 1
  },
  titleAlliergie: {
    marginBottom: 12
  },
  addAllerigeBT: {
    minWidth: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtAddAllerige: {
    paddingTop: 15,
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 15
  },
  lsAllerigeView: {
    justifyContent: 'center'
  },
  deleteView: {
    borderRadius: 4,
    minWidth: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    paddingBottom: 40
  },
  txtDelete: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 24,
    marginRight: 24
  },
  fullView: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  }
})
