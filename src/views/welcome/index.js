import React, {useEffect} from 'react'
import {
  View, Text, StatusBar, Image, StyleSheet, ScrollView
} from 'react-native'
import {
  colorFFFFFF, color040404, color3777EE, color363636
} from '../../constants/colors'
import Fonts from '../../constants/Fonts'
import imgHealthProfile from '../../../assets/images/health_profile'
import Button from '../../components/Button'
import Header from '../../components/Header'
import NavigationService from '../../navigation'
import Routes from '../../navigation/Routes'
import { customTxt } from '../../constants/css'
import Language from '../../translate'
import { useSelector } from 'react-redux'
import Translate from '../../translate'
import { useDispatch } from 'react-redux'
import {saveLsCM, saveLsKG, saveLsLB} from 'actions/common'

export default function WelcomeScreen() {

  const languageRedux = useSelector(state => state.common.language)
  const dispatch = useDispatch()

  useEffect(() => {
    console.log('languageRedux', languageRedux)
    weightLSKG()
    weightLSLBS()
    heightLSCM()
  }, [languageRedux])

  const weightLSKG = () => {
    var list = []
    for (var i = 20; i <= 300; i++) {
      var item = {}
      item.name = i + 'kg'
      item.value = i
      list.push(item)
    }
    Promise.all([
      dispatch(saveLsKG(list))
    ])
  }

  const weightLSLBS = () => {
    var list = []
    for (var i = 20; i <= 300; i++) {
      var item = {}
      item.name = i + 'lbs'
      item.value = i
      list.push(item)
    }
    Promise.all([
      dispatch(saveLsLB(list))
    ])
  }

  const heightLSCM = () => {
    var list = []
    for (var i = 70; i <= 250; i++) {
      var item = {}
      item.name = i + 'cm'
      item.value = i
      list.push(item)
    }
    Promise.all([
      dispatch(saveLsCM(list))
    ])
  }

  const renderBody = () => {
    return (
      <View style={styles.containerBody}>
        <View style={styles.containerImg}>
          <Image
            source={imgHealthProfile.ic_welcome}
            style={styles.styleImg}
          />
        </View>
        <View style={styles.containerContent1}>
          <Text
            style={
              customTxt(Fonts.SemiBold, 18, color363636).txt
            }>{Translate(languageRedux).TITLE_WELCOME_SCREEN}</Text>
        </View>
        <View style={styles.containerContent2}>
          <Text
            style={
              customTxt(Fonts.Regular, 16, color363636).txt
            }>{Translate(languageRedux).CONTENT_WELCOME_SCREEN}</Text>
        </View>
      </View>
    )
  }

  const renderBottom = () => {
    return (
      <View style={styles.containerBottom}>
        <View style={styles.ctnStartButton}>
          <Button
            text={Translate(languageRedux).start}
            backgroundColor={color3777EE}
            textColor={colorFFFFFF}
            onPress={() => {
              NavigationService.navigate(Routes.HEALTHPROFILE_SCREEN, {signUp: true})
            }}
          />
        </View>
        <View style={styles.ctnComplieButton}>
          <Button
            text={Translate(languageRedux).COMPLIE_IT_LATER}
            backgroundColor={colorFFFFFF}
            textColor={color3777EE}
            onPress={() => {
              NavigationService.navigate(Routes.DRAWER_NAVIGATION)
            }}
          />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white"/>
      <Header
        textCenter={Language().txtHealthProfile}
        backgroundColor={colorFFFFFF}
        textColor={color040404}
      />
      <ScrollView>
        {renderBody()}
        {renderBottom()}
      </ScrollView>
      {/* {renderBottom()} */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  containerBody: {
    flex: 1
  },
  containerContent1: {
    flex: 1,
    marginTop: 16,
    marginHorizontal: 20
  },
  containerImg: {
    flex: 1,
    justifyContent: 'center'
  },
  containerContent2: {
    flex: 1,
    marginTop: 16,
    marginHorizontal: 20
  },
  containerBottom: {
    marginHorizontal: 20,
    flex: 1,
    marginTop: 76
  },
  styleImg: {
    width: '100%',
    height: 300
  },
  ctnStartButton: {
    marginBottom: 8,
    width: '100%'
  },
  ctnComplieButton: {
    width: '100%',
    marginBottom: 50
  }
})
