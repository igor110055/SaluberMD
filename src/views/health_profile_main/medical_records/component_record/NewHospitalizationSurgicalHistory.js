import React from 'react'
import {
  StyleSheet, View, Text, Image, TouchableOpacity
} from 'react-native'
import { useSelector } from 'react-redux'
import Translate from 'translate'
import CustomTextInput from 'views/healthProfile/components/CustomTextInput'
import { color040404, color363636 } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import { convertDMMMYYYY } from 'constants/DateHelpers'
import icHealthProfile from '../../../../../assets/images/health_profile'
import imgDoc from '../../../../../assets/images/document'
import imgHealth from '../../../../../assets/images/health_profile'

export default function NewHospitalizationSurgicalHistory({
  type, onPressType,
  surgeryCategory, onPressSurgeryCategory,
  nameType, onPressNameType,
  other, setOther,
  since, onPressSince,
  country, onPressCountry,
  note, setNote,
  isEmergency, setEmergency
}) {
  const languageRedux = useSelector(state => state.common.language)

  const renderTextInput = () => {
    const isSurgery = type?.name === Translate(languageRedux).surgeryCategory
    const getTypeName = isSurgery ?
      Translate(languageRedux).surgeryCategory :
      Translate(languageRedux).hospitalization
    return (
      <>
        <CustomTextInput
          title={Translate(languageRedux).type}
          value={type?.name || ''}
          onChangeTxt={() => { }}
          placeholder={Translate(languageRedux).PH_MEDICATION}
          textStyle={styles.txtStyle}
          onPress={onPressType}
          validate={type ? false : true}
          iconRight={imgHealth.ic_dropdown}
        />
        {
          type?.name && (
            <CustomTextInput
              title={getTypeName}
              value={isSurgery ? (surgeryCategory?.name || '') : (nameType?.name || '')}
              onChangeTxt={() => { }}
              placeholder={Translate(languageRedux).PH_MEDICATION}
              textStyle={styles.txtStyle}
              onPress={isSurgery ? onPressSurgeryCategory : onPressNameType}
              validate={isSurgery ? !(surgeryCategory?.name) : !(nameType?.id)}
              iconRight={imgHealth.ic_dropdown}
            />
          )
        }
        {
          type?.name === Translate(languageRedux).surgeryCategory && (
            <CustomTextInput
              title={Translate(languageRedux).surgery}
              value={nameType?.name || ''}
              onChangeTxt={() => { }}
              placeholder={Translate(languageRedux).PH_MEDICATION}
              textStyle={styles.txtStyle}
              onPress={onPressNameType}
              validate={nameType?.id ? false : true}
              iconRight={imgHealth.ic_dropdown}
            />
          )
        }
        {(type?.id === 1 && nameType?.id === 1) && <CustomTextInput
          title={Translate(languageRedux).other}
          value={other}
          onChangeTxt={(txt) => setOther(txt)}
          placeholder={Translate(languageRedux).PH_MEDICATION}
          textStyle={styles.txtStyle}
          validate={!other}
        />}
        <CustomTextInput
          title={Translate(languageRedux).date}
          value={since ? convertDMMMYYYY(since) : ''}
          onChangeTxt={() => { }}
          placeholder={Translate(languageRedux).SELECT_A_DATE}
          textStyle={styles.txtStyle}
          onPress={onPressSince}
          iconRight={imgDoc.ic_choose_date}
          validate={!since}
        />
        <CustomTextInput
          title={Translate(languageRedux).COUNTRY}
          value={country}
          onChangeTxt={() => { }}
          placeholder={Translate(languageRedux).COUNTRY}
          onPress={onPressCountry}
          textStyle={styles.txtStyle}
          iconRight={imgHealth.ic_dropdown}
        />
        <CustomTextInput
          title={Translate(languageRedux).remarks}
          value={note}
          onChangeTxt={(txt) => setNote(txt)}
          placeholder={Translate(languageRedux).remarks}
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
        <Text
          style={[
            customTxt(Fonts.Regular, 14, color040404).txt,
            styles.marginR20
          ]}>{Translate(languageRedux).Emergency}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={[
        customTxt(Fonts.SemiBold, 18, color363636).txt
      ]} >{Translate(languageRedux).New_Hospitalization_Surgical_History}</Text>
      <Text style={[
        customTxt(Fonts.Regular, 16, color363636).txt,
        styles.marginT8
      ]}>{Translate(languageRedux).STEP1_QS}</Text>
      {renderTextInput()}
      {renderShowEmergency()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    paddingBottom: 16,
    borderRadius: 16
  },
  txtStyle: {
    marginTop: 24
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
  marginT8: {
    marginTop: 8
  },
  marginR20: {
    marginRight: 20
  },
  textinputNoteStyle: {
    flex: 1,
    height: 70,
    paddingTop: 14,
    paddingBottom: 14
  }
})
