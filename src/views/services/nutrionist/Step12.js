import React, {useState} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import {useSelector} from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import * as APIs from '../../../api/APIs'
import axios from 'axios'

import {colorFFFFFF, color040404, color3777EE, colorDDDEE1, colorA7A8A9, colorF0F0F0} from 'constants/colors'
import Translate from '../../../translate'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import {customTxt} from 'constants/css'
import Fonts from 'constants/Fonts'
import {checkWhiteSpace} from 'constants/CheckWhiteSpace'

import icHeader from '../../../../assets/images/header'

import Header from 'components/Header'
import CustomTextInput from '../../healthProfile/components/CustomTextInput'
import DialogView from 'components/DialogView'
import Button from 'components/Button'

export default function Step12({ route }) {
  const languageRedux = useSelector(state => state.common.language)
  const [isDialog, setDialog] = useState(false)
  const [radio, setRadio] = useState(null)
  const [sometime, setSometime] = useState(false)
  const [constipation, setConstipation] = useState(false)
  const [constipationInput, setConstipationInput] = useState()
  const [diarrhea, setDiarrhea] = useState(false)
  const [diarrheaInput, setDiarrheaInput] = useState()
  const [ibs, setIbs] = useState(false)
  const [ibsInput, setIbsInput] = useState()
  const [bloat, setBloat] = useState(false)
  const [bloatInput, setBloatInput] = useState()
  const [nausea, setNausea] = useState(false)
  const [nauseaInput, setNauseaInput] = useState()
  const [stomach, setStomach] = useState(false)
  const [stomachInput, setStomachInput] = useState()
  const [other, setOther] = useState(false)
  const [otherInput, setOtherInput] = useState(false)
  const passingData = route?.params?.data
  const token = useSelector(state => state.user.token)

  const renderChooseAnswer = () => {
    return (
      <View style={styles.marginB12}>
        <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt]}>
          {Translate(languageRedux).NUTRITIONIST_Q18}
        </Text>
        <TouchableOpacity onPress={() => {
            radio === false && setRadio(true) || radio === null && setRadio(true)
            setSometime(false)
        }} style={styles.fristLine}>
          <Icon
            name={radio ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
            size={24}
            color={radio ? color3777EE : colorDDDEE1}
          />
          <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
            {Translate(languageRedux).Y}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            radio === true && setRadio(false) || radio === null && setRadio(false)
            setSometime(false)
        }} style={styles.fristLine}>
          <Icon
            name={radio === false ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
            size={24}
            color={radio === false ? color3777EE : colorDDDEE1}
          />
          <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
            {Translate(languageRedux).N}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            sometime === false && setSometime(true)
            setRadio(null)
        }} style={styles.fristLine}>
          <Icon
            name={sometime ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
            size={24}
            color={sometime ? color3777EE : colorDDDEE1}
          />
          <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
            {Translate(languageRedux).SOMETIMES}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderTextInput = () => {
    return (
      <View>
        <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt]}>
          {Translate(languageRedux).NUTRITIONIST_Q19}
        </Text>
        {/* constipation */}
        <TouchableOpacity onPress={() => {
            setConstipation(!constipation)
        }} style={styles.line}>
          <View style={styles.ctnLine}>
            <Icon
              name={constipation ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
              size={24}
              color={constipation ? color3777EE : colorDDDEE1}
            />
            <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
              {Translate(languageRedux).NUTRITIONIST_SUB6}
            </Text>
          </View>
          {constipation && <CustomTextInput
            value={constipationInput}
            onChangeTxt={txt => setConstipationInput(txt)}
            textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt]}
          />}
        </TouchableOpacity>
        {/* diarrhea */}
        <TouchableOpacity onPress={() => {
            setDiarrhea(!diarrhea)
        }} style={styles.line}>
          <View style={styles.ctnLine}>
            <Icon
              name={diarrhea ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
              size={24}
              color={diarrhea ? color3777EE : colorDDDEE1}
            />
            <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
              {Translate(languageRedux).NUTRITIONIST_SUB7}
            </Text>
          </View>
          {diarrhea && <CustomTextInput
            value={diarrheaInput}
            onChangeTxt={txt => setDiarrheaInput(txt)}
            textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt]}
          />}
        </TouchableOpacity>
        {/* ibs */}
        <TouchableOpacity onPress={() => {
            setIbs(!ibs)
        }} style={styles.line}>
          <View style={styles.ctnLine}>
            <Icon
              name={ibs ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
              size={24}
              color={ibs ? color3777EE : colorDDDEE1}
            />
            <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
              {Translate(languageRedux).NUTRITIONIST_SUB8}
            </Text>
          </View>
          {ibs && <CustomTextInput
            value={ibsInput}
            onChangeTxt={txt => setIbsInput(txt)}
            textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt]}
          />}
        </TouchableOpacity>
        {/* bloating/gas */}
        <TouchableOpacity onPress={() => {
            setBloat(!bloat)
        }} style={styles.line}>
          <View style={styles.ctnLine}>
            <Icon
              name={bloat ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
              size={24}
              color={bloat ? color3777EE : colorDDDEE1}
            />
            <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
              {Translate(languageRedux).NUTRITIONIST_SUB9}
            </Text>
          </View>
          {bloat && <CustomTextInput
            value={bloatInput}
            onChangeTxt={txt => setBloatInput(txt)}
            textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt]}
          />}
        </TouchableOpacity>
        {/* navusea/vomiting */}
        <TouchableOpacity onPress={() => {
            setNausea(!nausea)
        }} style={styles.line}>
          <View style={styles.ctnLine}>
            <Icon
              name={nausea ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
              size={24}
              color={nausea ? color3777EE : colorDDDEE1}
            />
            <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
              {Translate(languageRedux).NUTRITIONIST_SUB10}
            </Text>
          </View>
          {nausea && <CustomTextInput
            value={nauseaInput}
            onChangeTxt={txt => setNauseaInput(txt)}
            textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt]}
          />}
        </TouchableOpacity>
        {/* stomach pain */}
        <TouchableOpacity onPress={() => {
            setStomach(!stomach)
        }} style={styles.line}>
          <View style={styles.ctnLine}>
            <Icon
              name={stomach ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
              size={24}
              color={stomach ? color3777EE : colorDDDEE1}
            />
            <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
              {Translate(languageRedux).NUTRITIONIST_SUB11}
            </Text>
          </View>
          {stomach && <CustomTextInput
            value={stomachInput}
            onChangeTxt={txt => setStomachInput(txt)}
            textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt]}
          />}
        </TouchableOpacity>
        {/* other */}
        <TouchableOpacity onPress={() => {
            setOther(!other)
        }} style={styles.line}>
          <View style={styles.ctnLine}>
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
          />}
        </TouchableOpacity>
      </View>
    )
  }

  const renderButtonSend = () => {
    return (
      <View style={styles.marginT20}>
        <Button
          backgroundColor={radio === false || radio || sometime ? color3777EE : colorF0F0F0}
          text={Translate(languageRedux).SEND_BTN}
          textColor={radio === false || radio || sometime ? colorFFFFFF : colorA7A8A9}
          disabled={radio === false || radio || sometime ? false : true}
          onPress={_onPressSend}
        />
      </View>
    )
  }

  const _onPressSend = () => {
    const checkConstipated = () => {
      if (radio) {
        return 1
      }
      if (radio === false) {
        return 0
      }
      if (sometime) {
        return 2
      }
    }
    const body = {
      idpt: 9,
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
      physical: passingData?.physical,
      antibiotics: passingData?.antibiotics,
      antibioticsdesc: passingData?.antibioticsdesc,
      medications: passingData?.medications,
      constipated: checkConstipated(),
      issues: [
        {
          id: '1',
          nameCurrentValue: constipationInput ? constipationInput : ''
        },
        {
          id: '2',
          nameCurrentValue: diarrheaInput ? diarrheaInput : ''
        },
        {
          id: '3',
          nameCurrentValue: ibsInput ? ibsInput : ''
        },
        {
          id: '4',
          nameCurrentValue: bloatInput ? bloatInput : ''
        },
        {
          id: '5',
          nameCurrentValue: nauseaInput ? nauseaInput : ''
        },
        {
          id: '5',
          nameCurrentValue: stomachInput ? stomachInput : ''
        },
        {
          id: '5',
          nameCurrentValue: otherInput ? otherInput : ''
        }
      ]
    }
    console.log('BODY: ', body)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/nutrition/saveSurvey`,
      headers: {
        'x-auth-token': token
      },
      data: body
    })
      .then(response => {
        console.log('data: ', response.data)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
    NavigationService.navigate(Routes.SERVICES_SCREEN)
  }

  const renderBody = () => {
    return (
      <View style={styles.paddingBottom}>
        {renderChooseAnswer()}
        {renderTextInput()}
        {renderButtonSend()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_left}
        textCenter={Translate(languageRedux).nutritionist}
        textCenterColor={color040404}
        onPressLeft={() => {
          NavigationService.goBack()
        }}
        textRight={Translate(languageRedux).cancel}
        onPressRight={() => {setDialog(true)}}
        textRightColor={color3777EE}
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
  line: {
    paddingVertical: 8
  },
  ctnLine: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  marginT20: {
    marginTop: 20
  }
})
