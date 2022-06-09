import React, {useState} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import {useSelector} from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import IconNavi from 'react-native-vector-icons/Feather'

import {colorFFFFFF, color040404, color3777EE, colorF0F0F0, colorC1C3C5} from 'constants/colors'
import Translate from '../../../translate'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import {customTxt} from 'constants/css'
import Fonts from 'constants/Fonts'
import {checkWhiteSpace} from 'constants/CheckWhiteSpace'

import icHeader from '../../../../assets/images/header'

import Header from 'components/Header'
import CustomTextInput from '../../healthProfile/components/CustomTextInput'
import CustomNextBT from '../../home_screen/direct_call/component_direct_call/CustomNextBT'
import DialogView from 'components/DialogView'

export default function Step7({ route }) {
  const languageRedux = useSelector(state => state.common.language)
  const [breakfast, setBreakfast] = useState()
  const [lunch, setLunch] = useState()
  const [dinner, setDinner] = useState()
  const [snack, setSnack] = useState()
  const [isDialog, setDialog] = useState(false)
  const passingData = route?.params?.data

  const renderTextInput = () => {
    return (
      <View>
        <CustomTextInput
          title={Translate(languageRedux).NUTRITIONIST_Q3}
          value={breakfast}
          onChangeTxt={txt => setBreakfast(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.heightTextInput]}
          validate={checkWhiteSpace(breakfast) ? false : true}
          multiline={true}
        />
        <CustomTextInput
          title={Translate(languageRedux).NUTRITIONIST_Q4}
          value={lunch}
          onChangeTxt={txt => setLunch(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.heightTextInput]}
          validate={checkWhiteSpace(lunch) ? false : true}
          multiline={true}
        />
        <CustomTextInput
          title={Translate(languageRedux).NUTRITIONIST_Q5}
          value={dinner}
          onChangeTxt={txt => setDinner(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.heightTextInput]}
          validate={checkWhiteSpace(dinner) ? false : true}
          multiline={true}
        />
        <CustomTextInput
          title={Translate(languageRedux).NUTRITIONIST_Q6}
          value={snack}
          onChangeTxt={txt => setSnack(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.heightTextInput]}
          validate={checkWhiteSpace(snack) ? false : true}
          multiline={true}
        />
      </View>
    )
  }

  const checkDisable = () => {
    if (breakfast && lunch && dinner && snack) {
      return true
    }
    else {
      return false
    }
  }

  const renderButtonNext = () => {
    return (
      <View style={styles.flexRow}>
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
            NavigationService.navigate(Routes.NUTRITIONIST_8_SCREEN, {
              data: {
                concern: passingData?.concern,
                goals: passingData?.goals,
                meals: passingData?.meals,
                breakfast: breakfast,
                lunch: lunch,
                dinner: dinner,
                snacks: snack
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

  const renderBody = () => {
    return (
      <View style={styles.paddingBottom}>
        {renderTextInput()}
      </View>
    )
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
      <KeyboardAwareScrollView>
        {renderBody()}
        {renderButtonNext()}
      </KeyboardAwareScrollView>
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
    height: 112
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
    paddingBottom: 42
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    paddingBottom: 42
  }
})
