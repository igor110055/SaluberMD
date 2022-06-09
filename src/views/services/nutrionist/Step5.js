import React, {useState} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import {useSelector} from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IconNavi from 'react-native-vector-icons/Feather'

import {colorFFFFFF, color040404, colorDDDEE1, color3777EE, colorC1C3C5, colorF0F0F0} from 'constants/colors'
import Translate from '../../../translate'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import { checkWhiteSpace } from 'constants/CheckWhiteSpace'

import icHeader from '../../../../assets/images/header'

import Header from 'components/Header'
import CustomTextInput from '../../healthProfile/components/CustomTextInput'
import DialogView from 'components/DialogView'

export default function Step5({ route }) {
  const languageRedux = useSelector(state => state.common.language)
  const [weightLoss, setWeightLoss] = useState(false)
  const [weightGain, setWeightGain] = useState(false)
  const [energy, setEnergy] = useState(false)
  const [betterSleep, setBetterSleep] = useState(false)
  const [digestion, setDigestion] = useState(false)
  const [digestionInput, setDigestionInput] = useState()
  const [other, setOther] = useState(false)
  const [otherInput, setOtherInput] = useState()
  const [isDialog, setDialog] = useState(false)
  const passingData = route?.params?.data

  const renderCheckBox = () => {
    return (
      <View>
        <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginB8]}>
          {Translate(languageRedux).NUTRITIONIST_Q1}
        </Text>
        {/* Weight loss */}
        <TouchableOpacity onPress={() => {
            setWeightLoss(!weightLoss)
        }} style={styles.fristLine}>
          <Icon
            name={weightLoss ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
            size={24}
            color={weightLoss ? color3777EE : colorDDDEE1}
           />
          <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
            {Translate(languageRedux).NUTRITIONIST_SUB1}
          </Text>
        </TouchableOpacity>
        {/* Weight gain */}
        <TouchableOpacity onPress={() => {
            setWeightGain(!weightGain)
        }} style={styles.line}>
          <Icon
            name={weightGain ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
            size={24}
            color={weightGain ? color3777EE : colorDDDEE1}
           />
          <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
            {Translate(languageRedux).NUTRITIONIST_SUB2}
          </Text>
        </TouchableOpacity>
        {/* Energy / Fatigue */}
        <TouchableOpacity onPress={() => {
            setEnergy(!energy)
        }} style={styles.line}>
          <Icon
            name={energy ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
            size={24}
            color={energy ? color3777EE : colorDDDEE1}
           />
          <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
            {Translate(languageRedux).NUTRITIONIST_SUB3}
          </Text>
        </TouchableOpacity>
        {/* Better sleep */}
        <TouchableOpacity onPress={() => {
            setBetterSleep(!betterSleep)
        }} style={styles.line}>
          <Icon
            name={betterSleep ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
            size={24}
            color={betterSleep ? color3777EE : colorDDDEE1}
           />
          <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
            {Translate(languageRedux).NUTRITIONIST_SUB4}
          </Text>
        </TouchableOpacity>
        {/* Digestion issues */}
        <TouchableOpacity onPress={() => {
            setDigestion(!digestion)
        }} style={styles.lineDigestion}>
          <View style={styles.ctnDigestion}>
            <Icon
              name={digestion ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
              size={24}
              color={digestion ? color3777EE : colorDDDEE1}
            />
            <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
              {Translate(languageRedux).NUTRITIONIST_SUB5}
            </Text>
          </View>
          {digestion && <CustomTextInput
            value={digestionInput}
            onChangeTxt={txt => setDigestionInput(txt)}
            textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt]}
            multiline={true}
          />}
        </TouchableOpacity>
        {/* Other */}
        <TouchableOpacity onPress={() => {
            setOther(!other)
        }} style={styles.lineDigestion}>
          <View style={styles.ctnDigestion}>
            <Icon
              name={other ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
              size={24}
              color={other ? color3777EE : colorDDDEE1}
            />
            <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
              {Translate(languageRedux).other}
            </Text>
          </View>
          {other && <CustomTextInput
            value={otherInput}
            onChangeTxt={txt => setOtherInput(txt)}
            textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt]}
            multiline={true}
          />}
        </TouchableOpacity>
      </View>
    )
  }

  const checkDisable = () => {
    if (weightLoss || weightGain || energy || betterSleep || digestion || other) {
      return true
    }
    else {
      return false
    }
  }

  const renderButtonNext = () => {
    return (
      <View style={styles.flexRow}>
        {/* <CustomNextBT
          textButton={Translate(languageRedux).NEXT}
          isActive={weightLoss || weightGain || energy || betterSleep || digestion || other}
          disabled={weightLoss || weightGain || energy || betterSleep || digestion || other ? false : true}
          onPress={() => {
            NavigationService.navigate(Routes.NUTRITIONIST_6_SCREEN, {
              data: {
                concern: passingData,
                goals: [
                  weightLoss && {id: '1', nameCurrentValue: ''},
                  weightGain && {id: '2', nameCurrentValue: ''},
                  energy && {id: '3', nameCurrentValue: ''},
                  betterSleep && {id: '4', nameCurrentValue: ''},
                  digestion && {id: '5', nameCurrentValue: digestionInput},
                  other && {id: '6', nameCurrentValue: otherInput}
                ]
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
            NavigationService.navigate(Routes.NUTRITIONIST_6_SCREEN, {
              data: {
                concern: passingData,
                goals: [
                  weightLoss && {id: '1', nameCurrentValue: ''},
                  weightGain && {id: '2', nameCurrentValue: ''},
                  energy && {id: '3', nameCurrentValue: ''},
                  betterSleep && {id: '4', nameCurrentValue: ''},
                  digestion && {id: '5', nameCurrentValue: digestionInput},
                  other && {id: '6', nameCurrentValue: otherInput}
                ]
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
        {renderCheckBox()}
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
  marginB8: {
    marginBottom: 8
  },
  marginL8: {
    marginLeft: 8
  },
  fristLine: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8
  },
  lineDigestion: {
    paddingVertical: 8
  },
  ctnDigestion: {
    flexDirection: 'row',
    alignItems: 'center'
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
