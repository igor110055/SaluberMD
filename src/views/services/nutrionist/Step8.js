import React, {useState} from 'react'
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

export default function Step8({ route }) {
  const languageRedux = useSelector(state => state.common.language)
  const [overeat, setOvereat] = useState(null)
  const [overeatInput, setOvereatInput] = useState()
  const [food, setFood] = useState()
  const [notEat, setNotEat] = useState(null)
  const [isDialog, setDialog] = useState(false)
  const passingData = route?.params?.data

  const renderQ1 = () => {
    return (
      <View>
        <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt]}>
          {Translate(languageRedux).NUTRITIONIST_Q7}
        </Text>
        <TouchableOpacity onPress={() => {
            overeat === false && setOvereat(true) || overeat === null && setOvereat(true)
        }} style={styles.fristLine}>
          <Icon
            name={overeat ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
            size={24}
            color={overeat ? color3777EE : colorDDDEE1}
          />
          <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
            {Translate(languageRedux).Y}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            overeat === true && setOvereat(false) || overeat === null && setOvereat(false)
            setOvereatInput('')
        }} style={styles.fristLine}>
          <Icon
            name={overeat === false ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
            size={24}
            color={overeat === false ? color3777EE : colorDDDEE1}
          />
          <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
          {Translate(languageRedux).N}
          </Text>
        </TouchableOpacity>
        {overeat && <CustomTextInput
          title={Translate(languageRedux).NUTRITIONIST_Q8}
          value={overeatInput}
          onChangeTxt={txt => setOvereatInput(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.heightTextInput]}
          validate={checkWhiteSpace(overeatInput) ? false : true}
          multiline={true}
        />}
      </View>
    )
  }

  const renderQ2 = () => {
    return (
      <View style={styles.marginB12}>
        <CustomTextInput
          title={Translate(languageRedux).NUTRITIONIST_Q9}
          value={food}
          onChangeTxt={txt => setFood(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.heightTextInput]}
          validate={checkWhiteSpace(food) ? false : true}
          multiline={true}
        />
      </View>
    )
  }

  const renderQ3 = () => {
    return (
      <View>
        <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt]}>
          {Translate(languageRedux).NUTRITIONIST_Q10}
        </Text>
        <TouchableOpacity onPress={() => {
            notEat === false && setNotEat(true) || notEat === null && setNotEat(true)
        }} style={styles.fristLine}>
          <Icon
            name={notEat ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
            size={24}
            color={notEat ? color3777EE : colorDDDEE1}
          />
          <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
            {Translate(languageRedux).Y}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            notEat === true && setNotEat(false) || notEat === null && setNotEat(false)
        }} style={styles.fristLine}>
          <Icon
            name={notEat === false ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
            size={24}
            color={notEat === false ? color3777EE : colorDDDEE1}
          />
          <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
          {Translate(languageRedux).N}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const checkDisableButton = () => {
    if (overeat === true) {
      if (overeatInput && food && notEat !== null) {
        return true
      }
    }
    if (overeat === false) {
        if (food && notEat !== null) {
          return true
        }
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
          disabled={!checkDisableButton()}
          style={checkDisableButton() ? styles.buttonNavi : styles.buttonNavi2}
          onPress={() => {
            NavigationService.navigate(Routes.NUTRITIONIST_9_SCREEN, {
              data: {
                concern: passingData?.concern,
                goals: passingData?.goals,
                meals: passingData?.meals,
                breakfast: passingData?.breakfast,
                lunch: passingData?.lunch,
                dinner: passingData?.dinner,
                snacks: passingData?.snacks,
                overeat: overeat ? 1 : 0,
                overeatdesc: overeatInput,
                allergies: food,
                irritable: notEat ? 1 : 0
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
      </KeyboardAwareScrollView>
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
    height: 112
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
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})
