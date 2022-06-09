import React, { useState } from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import {useSelector} from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IconNavi from 'react-native-vector-icons/Feather'

import {colorFFFFFF, color040404, color3777EE, colorDDDEE1, colorF0F0F0, colorC1C3C5} from 'constants/colors'
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

export default function Step10({ route }) {
  const languageRedux = useSelector(state => state.common.language)
  const [smoke, setSmoke] = useState(null)
  const [smokeInput, setSmokeInput] = useState()
  const [alcohol, setAlcohol] = useState(null)
  const [alcoholInput, setAlcoholInpput] = useState()
  const [cafe, setCafe] = useState(null)
  const [cafeInput, setCafeInput] = useState()
  const [isDialog, setDialog] = useState(false)
  const passingData = route?.params?.data

  const renderQ1 = () => {
    return (
      <View style={styles.marginB12}>
        <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt]}>
          {Translate(languageRedux).NUTRITIONIST_Q12}
        </Text>
        <TouchableOpacity onPress={() => {
            smoke === false && setSmoke(true) || smoke === null && setSmoke(true)
        }} style={styles.fristLine}>
          <Icon
            name={smoke ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
            size={24}
            color={smoke ? color3777EE : colorDDDEE1}
          />
          <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
            {Translate(languageRedux).Y}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            smoke === true && setSmoke(false) || smoke === null && setSmoke(false)
            setSmokeInput('')
        }} style={styles.fristLine}>
          <Icon
            name={smoke === false ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
            size={24}
            color={smoke === false ? color3777EE : colorDDDEE1}
          />
          <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
          {Translate(languageRedux).N}
          </Text>
        </TouchableOpacity>
        {smoke && <CustomTextInput
          value={smokeInput}
          onChangeTxt={txt => setSmokeInput(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.heightTextInput]}
          validate={checkWhiteSpace(smokeInput) ? false : true}
          multiline={true}
        />}
      </View>
    )
  }

  const renderQ3 = () => {
    return (
      <View style={styles.marginB12}>
        <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt]}>
          {Translate(languageRedux).NUTRITIONIST_Q14}
        </Text>
        <TouchableOpacity onPress={() => {
            cafe === false && setCafe(true) || cafe === null && setCafe(true)
        }} style={styles.fristLine}>
          <Icon
            name={cafe ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
            size={24}
            color={cafe ? color3777EE : colorDDDEE1}
          />
          <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
            {Translate(languageRedux).Y}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            cafe === true && setCafe(false) || cafe === null && setCafe(false)
            setCafeInput('')
        }} style={styles.fristLine}>
          <Icon
            name={cafe === false ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
            size={24}
            color={cafe === false ? color3777EE : colorDDDEE1}
          />
          <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
          {Translate(languageRedux).N}
          </Text>
        </TouchableOpacity>
        {cafe && <CustomTextInput
          value={cafeInput}
          onChangeTxt={txt => setCafeInput(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.heightTextInput]}
          validate={checkWhiteSpace(cafeInput) ? false : true}
          multiline={true}
        />}
      </View>
    )
  }

  const renderQ2 = () => {
    return (
      <View style={styles.marginB12}>
        <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt]}>
          {Translate(languageRedux).NUTRITIONIST_Q13}
        </Text>
        <TouchableOpacity onPress={() => {
            alcohol === false && setAlcohol(true) || alcohol === null && setAlcohol(true)
        }} style={styles.fristLine}>
          <Icon
            name={alcohol ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
            size={24}
            color={alcohol ? color3777EE : colorDDDEE1}
          />
          <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
            {Translate(languageRedux).Y}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            alcohol === true && setAlcohol(false) || alcohol === null && setAlcohol(false)
            setAlcoholInpput('')
        }} style={styles.fristLine}>
          <Icon
            name={alcohol === false ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
            size={24}
            color={alcohol === false ? color3777EE : colorDDDEE1}
          />
          <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
            {Translate(languageRedux).N}
          </Text>
        </TouchableOpacity>
        {alcohol && <CustomTextInput
          value={alcoholInput}
          onChangeTxt={txt => setAlcoholInpput(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.heightTextInput]}
          validate={checkWhiteSpace(alcoholInput) ? false : true}
          multiline={true}
        />}
      </View>
    )
  }

  const checkDisableButton = () => {
    if (smoke && alcohol && cafe) {
      if (smokeInput && alcoholInput && cafeInput) {
        return true
      }
    }
    if (smoke === false && alcohol && cafe) {
        if (alcoholInput && cafeInput) {
          return true
        }
    }
    if (smoke && alcohol === false && cafe) {
        if (smokeInput && cafeInput) {
          return true
        }
    }
    if (smoke && alcohol && cafe === false) {
        if (smokeInput && alcoholInput) {
          return true
        }
    }
    if (smoke && alcohol === false && cafe === false) {
        if (smokeInput) {
          return true
        }
    }
    if (smoke === false && alcohol && cafe === false) {
        if (alcoholInput) {
          return true
        }
    }
    if (smoke === false && alcohol === false && cafe) {
        if (cafeInput) {
          return true
        }
    }
    if (smoke === false && alcohol === false && cafe === false) {
        return true
    }
  }

  const renderButtonNext = () => {
    return (
      <View style={styles.flexBtnNavi}>
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
          disabled={!checkDisableButton()}
          style={checkDisableButton() ? styles.buttonNavi : styles.buttonNavi2}
          onPress={() => {
            NavigationService.navigate(Routes.NUTRITIONIST_11_SCREEN, {
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
                smoker: smoke ? 1 : 0,
                smokerdesc: smokeInput,
                alcohol: alcohol ? 1 : 0,
                alcoholdesc: alcoholInput,
                coffee: cafe ? 1 : 0,
                coffeedesc: cafeInput
              }
            })
          }}
          >
          <IconNavi
            name={'arrow-right'}
            size={24}
            color={checkDisableButton() ? colorFFFFFF : colorC1C3C5}
          />
        </TouchableOpacity>
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.paddingBottom}>
        {renderQ1()}
        {renderQ2()}
        {renderQ3()}
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
      <KeyboardAwareScrollView>
        {renderBody()}
      </KeyboardAwareScrollView>
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
  fristLine: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8
  },
  marginL8: {
    marginLeft: 8
  },
  marginB12: {
    marginBottom: 12
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
