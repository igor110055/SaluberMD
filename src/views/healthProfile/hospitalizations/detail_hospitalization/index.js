import React, { useEffect, useState } from 'react'
import {
  StyleSheet, View, Text, TouchableOpacity,
  Image,
  DeviceEventEmitter
} from 'react-native'
import {
  color040404,
  color3777EE,
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
import _ from 'lodash'
import NavigationService from '../../../../navigation'
import Routes from '../../../../navigation/Routes'
import CustomDatePicker from '../../../../components/CustomDatePicker'
import { convertDMMMYYYY, getDate112000 } from '../../../../constants/DateHelpers'
import icHeader from '../../../../../assets/images/header'
import icHealthProfile from '../../../../../assets/images/health_profile'
import { useSelector } from 'react-redux'
import SearchListWithName from '../../../../components/SearchListWithName'
import imgHealth from '../../../../../assets/images/health_profile'
import icDoc from '../../../../../assets/images/document'
import Translate from 'translate'

export default function DetailHospitalization({ route }) {
  const passingData = route?.params?.data
  const [hospital, setHospitalization] = useState({ name: passingData?.name || '', id: passingData?.id })
  const [type, setType] = useState()
  const getCountries = useSelector(state => state.common.country)
  const [country, setCountry] = useState({text: (passingData?.country || ''), value: passingData?.valueCountry})
  const [since, setSince] = useState(passingData?.since || getDate112000())
  const [note, setNote] = useState(passingData?.note || '')
  const [isEmergency, setEmergency] = useState(passingData?.isEmergency || false)
  const indexData = route?.params?.index
  const lsData = route?.params?.lsData || []
  const lsDelete = route?.params?.lsDelete || []
  const datePickerRef = React.createRef()
  const [surgeryCategory, setSurgeryCategory] = useState(passingData?.surgeryCategory || '')
  const [surgery, setSurgery] = useState({ name: passingData?.name || '' })
  const [other, setOther] = useState(passingData?.other || '')
  const [otherAccident, setOtherAccident] = useState(passingData?.otherAccident || '')
  const [otherCancer, setOtherCancer] = useState(passingData?.otherCancer || '')
  const lsSurgery = useSelector(state => state.common.surgery)
  const lsHospital = useSelector(state => state.common.hospitalization)
  const lsSubSurgery = useSelector(state => state.common.subsurgery)
  const [isShowType, setShowType] = useState(false)
  const [isShowSurgeryCate, setShowSurgeryCate] = useState(false)
  const [isShowSurgery, setShowSurgery] = useState(false)
  const [isShowHospital, setShowHospital] = useState(false)
  const [typeID, setTypeID] = useState(passingData?.type || 0)
  const [surgeryCateID, setSurgeryCateID] = useState()
  const lsType = [
    { 'name': Translate(languageRedux).surgery, 'id' : 0 },
    { 'name': Translate(languageRedux).ricovero, 'id' : 1 }
  ]
  const [isShowCountry, setShowCountry] = useState(false)
  const languageRedux = useSelector(state => state.common.language)

  useEffect(() => {
    console.log('Passing data: ', passingData)
    console.log('lsData: ', lsData)
    // setTypeID(passingData?.type)
    setSurgeryCateID(passingData?.idSurgeryCategory)
    deleteName()
  }, [typeID])

  // list Sub Surgery
  var lsGeneral = lsSubSurgery.filter((id) => id.idOpt === '1')
  var lsGAI = lsSubSurgery.filter((id) => id.idOpt === '2')
  var lsBreast = lsSubSurgery.filter((id) => id.idOpt === '3')
  var lsHeart = lsSubSurgery.filter((id) => id.idOpt === '4')
  var lsVascular = lsSubSurgery.filter((id) => id.idOpt === '5')
  var lsChest = lsSubSurgery.filter((id) => id.idOpt === '6')
  var lsOrtopedic = lsSubSurgery.filter((id) => id.idOpt === '7')
  var lsOAG = lsSubSurgery.filter((id) => id.idOpt === '8')
  var lsUrological = lsSubSurgery.filter((id) => id.idOpt === '9')
  var lsNeuro = lsSubSurgery.filter((id) => id.idOpt === '10')
  var lsOthorr = lsSubSurgery.filter((id) => id.idOpt === '11')
  var lsEye = lsSubSurgery.filter((id) => id.idOpt === '12')
  var lsDental = lsSubSurgery.filter((id) => id.idOpt === '13')

  const converTypeID = () => {
    if (passingData?.type === 1) {
      return Translate(languageRedux).ricovero
    }
    if (passingData?.type === 0) {
      return Translate(languageRedux).surgery
    }
  }

  const deleteName = () => {
    if (typeID !== passingData?.type) {
      setHospitalization('')
      setSurgery('')
    }
  }

  const renderTextInput = () => {
    return (
      <>
        <CustomTextInput
          title={Translate(languageRedux).type}
          value={type?.name || converTypeID()}
          onChangeTxt={(txt) => {
            setType(txt)
          }}
          placeholder={Translate(languageRedux).SELECT_HOS_OR_SUR}
          textStyle={styles.txtStyle}
          validate={type || converTypeID() ? false : true}
          onPress={() => setShowType(true)}
          iconRight={imgHealth.ic_dropdown}
        />
        {
          typeID === 0 &&
          (
            <>
              <CustomTextInput
                title={Translate(languageRedux).surgeryCategory}
                value={surgeryCategory?.name || passingData?.surgeryCategory}
                onChangeTxt={(txt) => {
                  setSurgeryCategory(txt)
                }}
                placeholder={Translate(languageRedux).PH_GENERIC_NAME}
                textStyle={styles.txtStyle}
                validate={surgeryCategory ? false : true}
                onPress={() => setShowSurgeryCate(true)}
                iconRight={imgHealth.ic_dropdown}
              />
              <CustomTextInput
                title={Translate(languageRedux).surgery}
                value={surgery?.name}
                onChangeTxt={(txt) => {
                  setSurgery(txt)
                }}
                placeholder={Translate(languageRedux).PH_GENERIC_NAME}
                textStyle={styles.txtStyle}
                validate={surgery?.name ? false : true}
                onPress={() => setShowSurgery(true)}
                iconRight={imgHealth.ic_dropdown}
              />
            </>
          )
        }
        {
          typeID === 1 &&
          (
            <CustomTextInput
              title={Translate(languageRedux).ricovero}
              value={hospital?.name}
              onChangeTxt={(txt) => {
                setHospitalization(txt)
              }}
              placeholder={Translate(languageRedux).PH_GENERIC_NAME}
              textStyle={styles.txtStyle}
              validate={hospital?.name ? false : true}
              onPress={() => setShowHospital(true)}
              iconRight={imgHealth.ic_dropdown}
            />
          )
        }
        {hospital?.id === 1 && typeID === 1 && <CustomTextInput
          title={Translate(languageRedux).other}
          value={other}
          onChangeTxt={(txt) => setOther(txt)}
          placeholder={Translate(languageRedux).PH_GENERIC_NAME}
          textStyle={styles.txtStyle}
          validate={other ? false : true}
        />}
        {hospital?.id === 47 && typeID === 1 && <CustomTextInput
          title={Translate(languageRedux).OTHER_ACCIDENT}
          value={otherAccident}
          onChangeTxt={(txt) => setOtherAccident(txt)}
          placeholder={Translate(languageRedux).PH_GENERIC_NAME}
          textStyle={styles.txtStyle}
          validate={otherAccident ? false : true}
        />}
        {hospital?.id === 48 && typeID === 1 && <CustomTextInput
          title={Translate(languageRedux).OTHER_CANCER_TREATMENT}
          value={otherCancer}
          onChangeTxt={(txt) => setOtherCancer(txt)}
          placeholder={Translate(languageRedux).PH_GENERIC_NAME}
          textStyle={styles.txtStyle}
          validate={otherCancer ? false : true}
        />}
        <CustomTextInput
          title={Translate(languageRedux).date}
          value={since ? convertDMMMYYYY(since) : ''}
          onChangeTxt={() => { }}
          placeholder={Translate(languageRedux).SELECT_A_DATE}
          textStyle={styles.txtStyle}
          onPress={() => datePickerRef.current.onPressDate()}
          iconRight={icDoc.ic_choose_date}
        />
        <CustomTextInput
          title={Translate(languageRedux).ricettario}
          value={country?.text || ''}
          onChangeTxt={(txt) => setCountry(txt)}
          placeholder={Translate(languageRedux).select_country}
          textStyle={styles.txtStyle}
          onPress={() => setShowCountry(true)}
          iconRight={imgHealth.ic_dropdown}
        />
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
        <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>{Translate(languageRedux).Emergency}</Text>
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
    DeviceEventEmitter.emit(Routes.HOSPITALIZATION_SCREEN,
      {newData: newData, dataDelete: listDelete})
    NavigationService.goBack()
  }

  const renderDelete = () => {
    return (
      <TouchableOpacity
        style={styles.deleteView}
        activeOpacity={hospital ? 0 : 1}
        onPress={_onPressDelete}
      >
        <Text style={[
          customTxt(Fonts.SemiBold, 18, colorF5455B).txt,
          styles.txtDelete
        ]}>{Translate(languageRedux).DELETE_HOS_AND_SUR}</Text>
      </TouchableOpacity>
    )
  }

  const renderNew = () => {
    return (
      <View style={[
        styles.questionView
      ]}>
        {renderTextInput()}
        {renderShowEmergency()}
      </View>
    )
  }

  const _onPressRight = () => {
    const callBackBD = {
      name: typeID === 1 ? (hospital?.name || '') : (surgery?.name || ''),
      hospital: hospital?.name,
      hospitalizationId: hospital?.id,
      surgerySubCategoryId: surgery?.id,
      other: other,
      otherAccident: otherAccident,
      otherCancer: otherCancer,
      type: type?.name,
      typeID: typeID,
      country: country?.text || '',
      valueCountry: country?.value,
      surgeryCategory: surgeryCategory?.name || passingData?.surgeryCategory,
      surgeryCategoryId: surgeryCategory?.id,
      since: since || getDate112000,
      note: note || '',
      isEmergency: isEmergency || false,
      isUpdate: true,
      itemID: passingData?.itemID
    }
    lsData[indexData] = callBackBD
    DeviceEventEmitter.emit(Routes.HOSPITALIZATION_SCREEN, {newData: lsData, dataDelete: lsDelete})
    NavigationService.goBack()
  }

  const _onChangeDatePicker = (date) => {
    setSince(date)
  }

  const checkButtonSave = () => {
      if (hospital?.id === 1 && other) {
        return false
      }
      if (hospital?.id === 47 && otherAccident) {
        return false
      }
      if (hospital?.id === 48 && otherCancer) {
        return false
      }
      if (hospital?.id !== 1 && hospital?.id !== 47 && hospital?.id !== 48 && hospital?.name) {
        return false
      }
      if (surgery?.name && surgeryCategory?.name) {
        return false
      }
      else {
        return true
      }
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        title={Translate(languageRedux).HOSPITALIZATION_SURGICAL}
        onPressSubmit={_onPressRight}
        source={icHeader.ic_left}
        buttonText={Translate(languageRedux).btnsave}
        backgroundColorButton={checkButtonSave() ? colorF0F0F0 : color3777EE}
        textButtonColor={checkButtonSave() ? colorC1C3C5 : colorFFFFFF}
        disabled={checkButtonSave()}
      />
      <KeyboardAwareScrollView>
        {renderNew()}
        {renderDelete()}
      </KeyboardAwareScrollView>
      <CustomDatePicker
        refDatePicker={datePickerRef}
        onChangeDate={_onChangeDatePicker}
        maxDate={new Date()}
        date={getDate112000()}
      />
      {
        isShowType && (
          <SearchListWithName
            listData={lsType}
            title={Translate(languageRedux).CHOOSE_TYPE}
            itemSelected={type}
            onItemClick={(val) => {
              setType(val)
              setTypeID(val?.id)
              setShowType(false)
            }}
            onPressRight={() => {
              setShowType(false)
            }}
          />
        )
      }
      {
        isShowSurgeryCate && (
          <SearchListWithName
            listData={lsSurgery}
            title={Translate(languageRedux).CHOOSE_SURGERY_CATEGORY}
            itemSelected={surgeryCategory}
            onItemClick={(val) => {
              setSurgeryCategory(val)
              setSurgeryCateID(val?.id)
              setShowSurgeryCate(false)
            }}
            onPressRight={() => {
              setShowSurgeryCate(false)
            }}
          />
        )
      }
      {
        isShowHospital && (
          <SearchListWithName
            listData={lsHospital}
            title={Translate(languageRedux).CHOOSE_HOSPITALIZATION}
            itemSelected={hospital}
            onItemClick={(val) => {
              setHospitalization(val)
              setShowHospital(false)
            }}
            onPressRight={() => {
              setShowHospital(false)
            }}
          />
        )
      }
      {surgeryCateID === '1' && isShowSurgery === true &&
        <SearchListWithName
          listData={lsGeneral}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={(val) => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />}
      {surgeryCateID === '2' && isShowSurgery === true &&
        <SearchListWithName
          listData={lsGAI}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={(val) => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />}
      {surgeryCateID === '3' && isShowSurgery === true &&
        <SearchListWithName
          listData={lsBreast}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={(val) => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />}
      {surgeryCateID === '4' && isShowSurgery === true &&
        <SearchListWithName
          listData={lsHeart}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={(val) => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />}
      {surgeryCateID === '5' && isShowSurgery === true &&
        <SearchListWithName
          listData={lsVascular}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={(val) => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />}
      {surgeryCateID === '6' && isShowSurgery === true &&
        <SearchListWithName
          listData={lsChest}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={(val) => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />}
      {surgeryCateID === '7' && isShowSurgery === true &&
        <SearchListWithName
          listData={lsOrtopedic}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={(val) => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />}
      {surgeryCateID === '8' && isShowSurgery === true &&
        <SearchListWithName
          listData={lsOAG}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={(val) => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />}
      {surgeryCateID === '9' && isShowSurgery === true &&
        <SearchListWithName
          listData={lsUrological}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={(val) => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />}
      {surgeryCateID === '10' && isShowSurgery === true &&
        <SearchListWithName
          listData={lsNeuro}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={(val) => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />}
      {surgeryCateID === '11' && isShowSurgery === true &&
        <SearchListWithName
          listData={lsOthorr}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={(val) => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />}
      {surgeryCateID === '12' && isShowSurgery === true &&
        <SearchListWithName
          listData={lsEye}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={(val) => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />}
      {surgeryCateID === '13' && isShowSurgery === true &&
        <SearchListWithName
          listData={lsDental}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={(val) => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />}
        {
        isShowCountry && (
          <SearchListWithName
            listData={getCountries}
            title={`${Translate(languageRedux).select} ${Translate(languageRedux).ricettario}`}
            itemSelected={country}
            onItemClick={(val) => {
              setCountry(val)
              setShowCountry(false)
            }}
            onPressRight={() => {
              setShowCountry(false)
            }}
            isText={true}
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
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9
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
  }
})
