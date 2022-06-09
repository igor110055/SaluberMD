import React, { useState } from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import {useSelector} from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IconNavi from 'react-native-vector-icons/Feather'

import {colorFFFFFF, color040404, color3777EE, colorDDDEE1, colorF56565, colorF0F0F0, colorC1C3C5} from 'constants/colors'
import Translate from '../../../translate'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import {customTxt} from 'constants/css'
import Fonts from 'constants/Fonts'
import {checkWhiteSpace} from 'constants/CheckWhiteSpace'
import { convertDMMMYYYY, converLocalToSever } from 'constants/DateHelpers'

import icHeader from '../../../../assets/images/header'
import icDoc from '../../../../assets/images/document'

import Header from 'components/Header'
import CustomTextInput from '../../healthProfile/components/CustomTextInput'
import CustomNextBT from '../../home_screen/direct_call/component_direct_call/CustomNextBT'
import CustomDatePicker from 'components/CustomDatePicker'
import DialogView from 'components/DialogView'

export default function Step11({ route }) {
  const languageRedux = useSelector(state => state.common.language)
  const [date, setDate] = useState()
  const [time, setTime] = useState('')
  const [timeAnswer, setTimeAnswer] = useState()
  const [medication, setMedication] = useState()
  const datePickerRef = React.createRef()
  const [isDialog, setDialog] = useState(false)
  const passingData = route?.params?.data

  const renderBody = () => {
    return (
      <View style={styles.paddingBottom}>
        {/* Date of last physical */}
        <View style={styles.ctnDateofLast}>
          <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt]}>
            {Translate(languageRedux).NUTRITIONIST_Q15}
          </Text>
          <TouchableOpacity onPress={() => {
            datePickerRef.current.onPressDate()
          }} style={date ? styles.boxDate : styles.boxDate2}>
            <Text style={[customTxt(Fonts.Regular, 14, color040404).txt]}>
                {date ? convertDMMMYYYY(date) : ''}
            </Text>
            <Image source={icDoc.ic_choose_date} style={styles.iconStyle} />
          </TouchableOpacity>
        </View>
        {/* How many time */}
        <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt, styles.marginB8]}>
          {Translate(languageRedux).NUTRITIONIST_Q16}
        </Text>
        <CustomTextInput
          value={time}
          onChangeTxt={txt => setTime(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt]}
          validate={checkWhiteSpace(time) ? false : true}
          keyboardType={'phone-pad'}
        />
        {time !== '' && <View>
          <View style={styles.marginT12} />
          <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt]}>
            {Translate(languageRedux).NUTRITIONIST_Q16_BIS}
          </Text>
          <CustomTextInput
            value={timeAnswer}
            onChangeTxt={txt => setTimeAnswer(txt)}
            textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.heightTextInput]}
            // validate={checkWhiteSpace(timeAnswer) ? false : true}
            multiline={true}
          />
        </View>}
        {/* Do you take medication */}
        <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt, styles.marginT12]}>
          {Translate(languageRedux).NUTRITIONIST_Q17}
        </Text>
        <CustomTextInput
          value={medication}
          onChangeTxt={txt => setMedication(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.heightTextInput]}
          validate={checkWhiteSpace(medication) ? false : true}
          multiline={true}
        />
      </View>
    )
  }

  const checkDisable = () => {
    if (medication && date && time) {
      return true
    }
    else {
      return false
    }
  }

  const renderButtonNext = () => {
    return (
      <View style={styles.flexBtnNavi}>
        {/* <CustomNextBT
          textButton={Translate(languageRedux).NEXT}
          isActive={medication && date && time}
          disabled={medication && date && time ? false : true}
          onPress={() => {
            NavigationService.navigate(Routes.NUTRITIONIST_12_SCREEN, {
              data: {
                concern: passingData?.concern,
                goals: passingData?.goals,
                meals: passingData?.meals,
                breakfast: passingData?.breakfast,
                lunch: passingData?.lunch,
                dinner: passingData?.dinner,
                snacks: passingData?.snacks,
                overeat: passingData?.overeat,
                overeatdesc: passingData?.overeatdesc,
                allergies: passingData?.allergies,
                irritable: passingData?.irritable,
                height: passingData?.height,
                weight: passingData?.weight,
                exercise: passingData?.exercise,
                smoker: passingData?.smoker,
                smokerdesc: passingData?.smokerdesc,
                alcohol: passingData?.alcohol,
                alcoholdesc: passingData?.alcoholdesc,
                coffee: passingData?.coffee,
                coffeedesc: passingData?.coffeedesc,
                physical: date + '.000Z',
                antibiotics: time,
                antibioticsdesc: timeAnswer,
                medications: medication
              }
            })
          }}
        /> */}
        <TouchableOpacity
          style={styles.buttonNavi}
          onPress={() => {
            NavigationService.goBack()
          }}
          >
          <IconNavi
            name={'arrow-left'}
            size={24}
            color={colorFFFFFF}
          />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!checkDisable()}
          style={checkDisable() ? styles.buttonNavi : styles.buttonNavi2}
          onPress={() => {
            NavigationService.navigate(Routes.NUTRITIONIST_12_SCREEN, {
              data: {
                concern: passingData?.concern,
                goals: passingData?.goals,
                meals: passingData?.meals,
                breakfast: passingData?.breakfast,
                lunch: passingData?.lunch,
                dinner: passingData?.dinner,
                snacks: passingData?.snacks,
                overeat: passingData?.overeat,
                overeatdesc: passingData?.overeatdesc,
                allergies: passingData?.allergies,
                irritable: passingData?.irritable,
                height: passingData?.height,
                weight: passingData?.weight,
                exercise: passingData?.exercise,
                smoker: passingData?.smoker,
                smokerdesc: passingData?.smokerdesc,
                alcohol: passingData?.alcohol,
                alcoholdesc: passingData?.alcoholdesc,
                coffee: passingData?.coffee,
                coffeedesc: passingData?.coffeedesc,
                physical: date + '.000Z',
                antibiotics: time,
                antibioticsdesc: timeAnswer,
                medications: medication
              }
            })
          }}
          >
          <IconNavi
            name={'arrow-right'}
            size={24}
            color={checkDisable() ? colorFFFFFF : colorC1C3C5}
          />
        </TouchableOpacity>
      </View>
    )
  }

  const _onChangeDatePicker = (date) => {
    setDate(date)
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).nutritionist}
        textCenterColor={color040404}
        onPressRight={() => {setDialog(true)}}
        iconRight={icHeader.ic_close}
      />
      <KeyboardAwareScrollView>
        {renderBody()}
      </KeyboardAwareScrollView>
      <CustomDatePicker
        refDatePicker={datePickerRef}
        onChangeDate={_onChangeDatePicker}
        date={date}
        mode={'date'}
        maxDate={new Date()}
      />
      <DialogView
        isShow={isDialog}
        onPressCancel={() => setDialog(false)}
        title={Translate(languageRedux).WARNING_TITLE_NOTIFICATION}
        content={Translate(languageRedux).HOME_WARNING_MESSAGE}
        txt1={Translate(languageRedux).N}
        txt2={Translate(languageRedux).Y}
        onPressOK={() => {
          NavigationService.navigate(Routes.SERVICES_SCREEN)
        }}
      />
      <View style={styles.ctnButtonNavi}>
        {renderButtonNext()}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  paddingBottom: {
    paddingBottom: 48,
    marginHorizontal: 20
  },
  heightTextInput: {
    height: 112,
    marginTop: 12
  },
  marginL8: {
    marginLeft: 8
  },
  marginB8: {
    marginBottom: 8
  },
  marginT12: {
    marginTop: 12
  },
  ctnDateofLast: {
    marginBottom: 12
  },
  boxDate: {
    height: 48,
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colorDDDEE1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    justifyContent: 'space-between',
    marginTop: 8
  },
  boxDate2: {
    height: 48,
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colorF56565,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    justifyContent: 'space-between',
    marginTop: 8
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  buttonNavi: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: color3777EE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4687FF',
    shadowOffset: {
      width: 0,
      height: 16
    },
    shadowOpacity: 0.24,
    shadowRadius: 32,
    elevation: 9
  },
  buttonNavi2: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: colorF0F0F0,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4687FF',
    shadowOffset: {
      width: 0,
      height: 16
    },
    shadowOpacity: 0.24,
    shadowRadius: 32,
    elevation: 9
  },
  ctnButtonNavi: {
    marginBottom: 42,
    marginHorizontal: 20
  },
  flexBtnNavi: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})
