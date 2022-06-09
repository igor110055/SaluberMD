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

export default function NewAllergies({
  allergies, onPressAllergies,
  other, setOther,
  genericName, setGenericName,
  since, onPressSince,
  note, setNote,
  isEmergency, setEmergency
}) {
  const languageRedux = useSelector(state => state.common.language)

  const renderTextInput = () => {
    return (
      <>
        <CustomTextInput
          title={Translate(languageRedux).allergie}
          value={allergies?.name}
          onChangeTxt={() => {}}
          placeholder={Translate(languageRedux).PH_MEDICATION}
          textStyle={styles.txtStyle}
          onPress={onPressAllergies}
          validate={allergies?.id ? false : true}
          iconRight={imgHealth.ic_dropdown}
        />
        {allergies?.id === 1 && <CustomTextInput
          title={Translate(languageRedux).other}
          value={other}
          onChangeTxt={(txt) => setOther(txt)}
          placeholder={Translate(languageRedux).PH_MEDICATION}
          textStyle={styles.txtStyle}
          validate={other ? false : true}
        />}
        <CustomTextInput
          title={Translate(languageRedux).genericName}
          value={genericName}
          onChangeTxt={(txt) => setGenericName(txt)}
          placeholder={Translate(languageRedux).PH_GENERIC_NAME}
          textStyle={styles.txtStyle}
        />
        <CustomTextInput
          title={Translate(languageRedux).since}
          value={since ? convertDMMMYYYY(since) : ''}
          onChangeTxt={() => {}}
          placeholder={Translate(languageRedux).SELECT_A_DATE}
          textStyle={styles.txtStyle}
          onPress={onPressSince}
          iconRight={imgDoc.ic_choose_date}
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
      ]} >{Translate(languageRedux).NEW_ALLERGY}</Text>
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
