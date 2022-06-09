import React, {useState} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import {useSelector} from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import IconNavi from 'react-native-vector-icons/Feather'

import {colorFFFFFF, color040404, color3777EE, colorDDDEE1, colorF0F0F0, colorC1C3C5} from 'constants/colors'
import Translate from '../../../translate'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import {customTxt} from 'constants/css'
import Fonts from 'constants/Fonts'
import {checkWhiteSpace} from 'constants/CheckWhiteSpace'

import icHeader from '../../../../assets/images/header'
import icDoc from '../../../../assets/images/document'

import Header from 'components/Header'
import CustomTextInput from '../../healthProfile/components/CustomTextInput'
import CustomNextBT from '../../home_screen/direct_call/component_direct_call/CustomNextBT'
import LoadingView from 'components/LoadingView'
import SearchListWithName from 'components/SearchListWithName'
import DialogView from 'components/DialogView'

export default function Step9({ route }) {
  const languageRedux = useSelector(state => state.common.language)
  const userinfo = useSelector(state => state.user.userinfo)
  const [exercise, setExercise] = useState()
  const listKG = useSelector(state => state.common.listKG)
  const listLB = useSelector(state => state.common.listLB)
  const listCM = useSelector(state => state.common.listCM)
  const [isShowHeight, setShowHeight] = useState(false)
  const [height, setHeight] = useState(userinfo?.height)
  const [isShowWeight, setShowWeight] = useState(false)
  const [weight, setWeight] = useState(userinfo?.weight)
  const [isDialog, setDialog] = useState(false)
  const passingData = route?.params?.data

  const renderTop = () => {
    return (
      <View>
        {/* HEIGHT */}
        <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt]}>
          {Translate(languageRedux).height}
        </Text>
        <TouchableOpacity onPress={() => {
          setShowHeight(true)
        }} style={styles.height}>
          <View style={styles.flexRow}>
            <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginR4]}>
              {height}
            </Text>
            <Text style={[customTxt(Fonts.Regular, 14, color040404).txt]}>
              {userinfo?.heightUnit === 1 ? 'cm' : 'feet'}
            </Text>
          </View>
          <Image source={icDoc.ic_dropdown} style={styles.iconStyle} />
        </TouchableOpacity>
        {/* WEIGHT */}
        <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt]}>
          {Translate(languageRedux).weight}
        </Text>
        <TouchableOpacity onPress={() => {
          setShowWeight(true)
        }} style={styles.height}>
          <View style={styles.flexRow}>
            <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginR4]}>
              {weight}
            </Text>
            <Text style={[customTxt(Fonts.Regular, 14, color040404).txt]}>
              {userinfo?.weightUnit === 1 ? 'kg' : 'lbs'}
            </Text>
          </View>
          <Image source={icDoc.ic_dropdown} style={styles.iconStyle} />
        </TouchableOpacity>
      </View>
    )
  }

  const renderTextInput = () => {
    return (
      <View>
        <CustomTextInput
          title={Translate(languageRedux).NUTRITIONIST_Q11}
          value={exercise}
          onChangeTxt={txt => setExercise(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.heightTextInput]}
          validate={checkWhiteSpace(exercise) ? false : true}
          multiline={true}
        />
      </View>
    )
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
          disabled={exercise ? false : true}
          style={exercise ? styles.buttonNavi : styles.buttonNavi2}
          onPress={() => {
            NavigationService.navigate(Routes.NUTRITIONIST_10_SCREEN, {
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
                height: height,
                weight: weight,
                exercise: exercise
              }
            })
          }}
          >
          <IconNavi
            name={'arrow-right'}
            size={24}
            color={exercise ? colorFFFFFF : colorC1C3C5}
          />
        </TouchableOpacity>
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.paddingBottom}>
        {renderTop()}
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
      {isShowHeight && userinfo?.heightUnit === 1 && (
          <SearchListWithName
            listData={listCM}
            title={Translate(languageRedux).SELECT_HEIGHT}
            itemSelected={height}
            onItemClick={(val) => {
              setHeight(val?.value)
              setShowHeight(false)
            }}
            onPressRight={() => {
              setShowHeight(false)
            }}
          />
        )
      }
      {isShowHeight && userinfo?.heightUnit === 0 && (
          <SearchListWithName
            listData={listFT}
            title={Translate(languageRedux).SELECT_HEIGHT}
            itemSelected={height}
            onItemClick={(val) => {
              setHeight(val?.name)
              setShowHeight(false)
            }}
            onPressRight={() => {
              setShowHeight(false)
            }}
          />
        )
      }
      {isShowWeight && userinfo?.weightUnit === 1 && (
          <SearchListWithName
            listData={listKG}
            title={Translate(languageRedux).SELECT_WEIGHT}
            itemSelected={weight}
            onItemClick={(val) => {
              setWeight(val?.value)
              setShowWeight(false)
            }}
            onPressRight={() => {
              setShowWeight(false)
            }}
          />
        )
      }
      {isShowWeight && userinfo?.weightUnit === 0 && (
          <SearchListWithName
            listData={listLB}
            title={Translate(languageRedux).SELECT_WEIGHT}
            itemSelected={weight}
            onItemClick={(val) => {
              setWeight(val?.value)
              setShowWeight(false)
            }}
            onPressRight={() => {
              setShowWeight(false)
            }}
          />
        )
      }
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
  height: {
    marginTop: 4,
    flexDirection: 'row',
    borderBottomColor: colorDDDEE1,
    borderBottomWidth: 1,
    paddingBottom: 4,
    marginBottom: 8,
    justifyContent: 'space-between'
  },
  marginR4: {
    marginRight: 4
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  flexRow: {
    flexDirection: 'row'
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

const listFT = [
  {'name': '4 ft 0 in'},
  { 'name': '4 ft 1 in' },
  { 'name': '4 ft 2 in' },
  { 'name': '4 ft 3 in' },
  { 'name': '4 ft 4 in' },
  { 'name': '4 ft 5 in' },
  { 'name': '4 ft 6 in' },
  { 'name': '4 ft 7 in' },
  { 'name': '4 ft 8 in' },
  { 'name': '4 ft 9 in' },
  { 'name': '4 ft 10 in' },
  { 'name': '4 ft 11 in' },
  { 'name': '5 ft 0 in' },
  { 'name': '5 ft 1 in' },
  { 'name': '5 ft 2 in' },
  { 'name': '5 ft 3 in' },
  { 'name': '5 ft 4 in' },
  { 'name': '5 ft 5 in' },
  { 'name': '5 ft 6 in' },
  { 'name': '5 ft 7 in' },
  { 'name': '5 ft 8 in' },
  { 'name': '5 ft 9 in' },
  { 'name': '5 ft 10 in' },
  { 'name': '5 ft 11 in' },
  { 'name': '6 ft 0 in' },
  { 'name': '6 ft 1 in' },
  { 'name': '6 ft 2 in' },
  { 'name': '6 ft 3 in' },
  { 'name': '6 ft 4 in' },
  { 'name': '6 ft 5 in' },
  { 'name': '6 ft 6 in' },
  { 'name': '6 ft 7 in' },
  { 'name': '6 ft 8 in' },
  { 'name': '6 ft 9 in' },
  { 'name': '6 ft 10 in' },
  { 'name': '6 ft 11 in' },
  { 'name': '7 ft 0 in' },
  { 'name': '7 ft 1 in' },
  { 'name': '7 ft 2 in' },
  { 'name': '7 ft 3 in' },
  { 'name': '7 ft 4 in' },
  { 'name': '7 ft 5 in' },
  { 'name': '7 ft 6 in' },
  { 'name': '7 ft 7 in' },
  { 'name': '7 ft 8 in' },
  { 'name': '7 ft 9 in' },
  { 'name': '7 ft 10 in' },
  { 'name': '7 ft 11 in' }
]
