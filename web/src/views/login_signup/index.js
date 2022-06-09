import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Dimensions
} from 'react-native'
import img from '../../../assets/img/bg'
import Routes from '../../routes/Routes'

function LoginSignUpView({ navigation }) {
  const _onPressLogin = () => {
    navigation.navigate(Routes.LOGIN_SCREEN)
  }

  const _onPressSignUp = () => {
    navigation.navigate(Routes.SIGN_UP_SCREEN)
  }

  const renderButton = () => {
    return (
      <View style={styles.lsBtView}>
        <TouchableOpacity
          onPress={_onPressLogin}
          style={[styles.buttonView, styles.loginStyle]}>
          <Text style={styles.txtLogin}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={_onPressSignUp}
          style={[styles.buttonView, styles.signUpView]}>
          <Text style={styles.txtSignUp}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ImageBackground
      source={img.ic_bg_login}
      style={styles.container}>
      {renderButton()}
    </ImageBackground>
  )
}

export default LoginSignUpView

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: Dimensions.get('window').height,
    justifyContent: 'flex-end',
    alignItems: 'center',
    resizeMode: 'contain'
  },
  lsBtView: {
    marginBottom: 40
  },
  buttonView: {
    width: 300,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 8
  },
  loginStyle: {
    backgroundColor: '#3777EE'
  },
  txtLogin: {
    color: 'white',
    fontWeight: '600'
  },
  signUpView: {
    backgroundColor: 'white'
  },
  txtSignUp: {
    color: '#3777EE',
    fontWeight: '600'
  }
})