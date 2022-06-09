import React, { useState } from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {useSelector} from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Feather'

import {color040404, color3777EE, colorC1C3C5, colorF0F0F0, colorF8F8F8, colorFFFFFF} from 'constants/colors'
import Translate from '../../../translate'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import { checkWhiteSpace } from 'constants/CheckWhiteSpace'

import icHeader from '../../../../assets/images/header'

import Header from 'components/Header'
import DialogView from 'components/DialogView'
import CustomTextInput from '../../healthProfile/components/CustomTextInput'
import CustomNextBT from '../../home_screen/direct_call/component_direct_call/CustomNextBT'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function Step4() {
  const languageRedux = useSelector(state => state.common.language)
  const [isDialog, setDialog] = useState(true)
  const [isDialog2, setDialog2] = useState(false)
  const [concern, setConcern] = useState()

  const renderTextInput = () => {
    return (
      <View>
        <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginB8]}>
          {Translate(languageRedux).concernlist}
        </Text>
        <CustomTextInput
          value={concern}
          onChangeTxt={txt => setConcern(txt)}
          textinputStyle={[customTxt(Fonts.Regular, 16, color040404).txt, styles.heightTextInput]}
          validate={checkWhiteSpace(concern) ? false : true}
          multiline={true}
        />
      </View>
    )
  }

  const renderButtonNext = () => {
    return (
      <View>
        <TouchableOpacity
          disabled={checkWhiteSpace(concern) ? false : true}
          style={checkWhiteSpace(concern) ? styles.buttonNavi : styles.buttonNavi2}
          onPress={() => {
            NavigationService.navigate(Routes.NUTRITIONIST_5_SCREEN, {
              data: concern
            })
          }}
          >
          <Icon
            name={'arrow-right'}
            size={24}
            color={checkWhiteSpace(concern) ? colorFFFFFF : colorC1C3C5}
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
        iconRight={icHeader.ic_close}
        onPressRight={() => {setDialog2(true)}}
        textRightColor={color3777EE}
      />
      <KeyboardAwareScrollView>
        {renderBody()}
      </KeyboardAwareScrollView>
      <View style={styles.ctnButtonNavi}>
        {renderButtonNext()}
      </View>
      <DialogView
        isShow={isDialog}
        onPressCancel={() => setDialog(false)}
        title={Translate(languageRedux).success}
        content={Translate(languageRedux).prenotato1}
        txt1={Translate(languageRedux).OK}
      />
      <DialogView
        isShow={isDialog2}
        onPressCancel={() => setDialog2(false)}
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
  heightTextInput: {
    height: 112
  },
  marginB8: {
    marginBottom: 8
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
    alignItems: 'flex-end',
    marginRight: 20
  }
})
