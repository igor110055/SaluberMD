import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, ImageBackground, Dimensions, TouchableOpacity, Image } from 'react-native'
import img from '../../../assets/img/bg'
import CSS, { customTxt } from '../../constants/css'
import icLogin from '../../../assets/images/login_signup'
import { color00379D, color040404, color3777EE, colorC1C3C5, colorF0F0F0, colorFFFFFF } from '../../constants/colors'
import Translate from '../../translate'
import Fonts from '../../constants/Fonts'
import TextInputView from './components/TextInputView'
import _ from 'lodash'
import Button from '../../components/Button'

function ForgotPasswordView({ navigation }) {
  const [username, setUsername] = useState('')

  const renderTopNavi = () => {
    const _onPressBack = () => {
      navigation.goBack()
    }
    return (
      <View style={[CSS.shadown, styles.topNaviView]}>
        <TouchableOpacity onPress={_onPressBack}>
          <Image source={icLogin.ic_back} style={styles.imgBack} />
        </TouchableOpacity>
      </View>
    )
  }

  const renderTextInput = () => {
    return (
      <View>
        <TextInputView
          title={Translate().EMAIL_OR_USERNAME}
          value={username}
          onChangeTxt={(txt) => setUsername(txt.trim())}
          placeholder={Translate().EMAIL_OR_USERNAME}
          validate={username ? false : true}
        />
      </View>
    )
  }

  const _onPress = () => {
    navigation.goBack()
  }

  const renderButton = () => {
    return (
      <View style={styles.outsideLoginView}>
        <Button
          disabled={(username) ? false : true}
          onPress={_onPress}
          text={Translate().SEND_BTN}
          textColor={(username) ? colorFFFFFF : colorC1C3C5}
          backgroundColor={(username) ? color3777EE : colorF0F0F0}
        />
      </View>
    )
  }

  const renderContent = () => {
    return (
      <View style={styles.contentView}>
        <TouchableOpacity
          delayLongPress={1000 * 2}
          activeOpacity={1}
          style={styles.centerView}>
          <Text style={[
            styles.txtTitle,
            customTxt(Fonts.SemiBold, 24, color040404).txt
          ]}>{Translate().MSG_WELCOME_BACK}!</Text>
          {renderTextInput()}
            {renderButton()}
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ImageBackground style={styles.contain} source={img.ic_bg}>
      <View style={styles.loginView}>
        {renderTopNavi()}
        {renderContent()}
      </View>
    </ImageBackground>
  )
}

export default ForgotPasswordView

const styles = StyleSheet.create({
  contain: {
    width: '100%',
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginView: {
    width: 500,
    backgroundColor: 'white',
    borderRadius: 12
  },
  topNaviView: {
    top: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 20,
    shadowColor: color00379D,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 2,
      height: 4
    },
    elevation: 1100
  },
  imgBack: {
    width: 48,
    height: 48
  },
  contentView: {
    marginTop: 54
  },
  txtTitle: {
    marginTop: 8
  },
  centerView: {
    marginLeft: 20,
    marginRight: 20
  },
  outsideLoginView: {
    marginTop: 20,
    marginBottom: 20
  }
})
