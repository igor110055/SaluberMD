import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native'
import Header from '../../components/Header'
import icHeader from '../../../assets/images/header'
import icVideoCall from '../../../assets/images/video_call'
import { color040404, color3777EE, colorA7A8A9, colorC1C3C5, colorDDDEE1, colorF0F0F0, colorFFFFFF } from '../../constants/colors'
import NavigationService from '../../navigation'
import Routes from '../../navigation/Routes'
import { customTxt } from '../../constants/css'
import Fonts from '../../constants/Fonts'
import Button from '../../components/Button'
import { useSelector } from 'react-redux'
import Translate from '../../translate'

export default function StarRatingScreen() {

  const [starAudio1, setStarAudio1] = useState(false)
  const [starAudio2, setStarAudio2] = useState(false)
  const [starAudio3, setStarAudio3] = useState(false)
  const [starAudio4, setStarAudio4] = useState(false)
  const [starAudio5, setStarAudio5] = useState(false)
  const [starVideo1, setStarVideo1] = useState(false)
  const [starVideo2, setStarVideo2] = useState(false)
  const [starVideo3, setStarVideo3] = useState(false)
  const [starVideo4, setStarVideo4] = useState(false)
  const [starVideo5, setStarVideo5] = useState(false)
  const [comment, setComment] = useState()
  const [audioRate, setAudioRate] = useState()
  const [videoRate, setVideoRate] = useState()
  const languageRedux = useSelector(state => state.common.language)

  const renderTop = () => {
    return (
      <View>
        <View style={styles.ctnTitle}>
          <Text style={customTxt(Fonts.SemiBold, 18, color040404).txt}>
            {Translate(languageRedux).TITLE_AFTER_VIDEO_CALL}</Text>
        </View>
        <View style={styles.ctnText}>
          <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
            {Translate(languageRedux).WE_WILL_SEND_RESULTS}</Text>
        </View>
      </View>
    )
  }

  const _onPressStar1 = () => {
    setStarAudio1(true)
    setStarAudio2(false)
    setStarAudio3(false)
    setStarAudio4(false)
    setStarAudio5(false)
    setAudioRate(1)
  }
  const _onPressStar2 = () => {
    setStarAudio1(true)
    setStarAudio2(true)
    setStarAudio3(false)
    setStarAudio4(false)
    setStarAudio5(false)
    setAudioRate(2)
  }
  const _onPressStar3 = () => {
    setStarAudio1(true)
    setStarAudio2(true)
    setStarAudio3(true)
    setStarAudio4(false)
    setStarAudio5(false)
    setAudioRate(3)
  }
  const _onPressStar4 = () => {
    setStarAudio1(true)
    setStarAudio2(true)
    setStarAudio3(true)
    setStarAudio4(true)
    setStarAudio5(false)
    setAudioRate(4)
  }
  const _onPressStar5 = () => {
    setStarAudio1(true)
    setStarAudio2(true)
    setStarAudio3(true)
    setStarAudio4(true)
    setStarAudio5(true)
    setAudioRate(5)
  }

  const renderStarAudio = () => {
    return (
      <View>
        <View style={styles.audio}>
          <Text style={customTxt(Fonts.SemiBold, 14, color040404).txt}>
            {Translate(languageRedux).AUDIO}</Text>
        </View>
        <View style={styles.ctnStar}>
          <TouchableOpacity onPress={_onPressStar1} style={styles.marginR16}>
            {starAudio1 ? <Image source={icVideoCall.ic_star_filled} style={styles.iconStyle} />
              : <Image source={icVideoCall.ic_star} style={styles.iconStyle} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={_onPressStar2} style={styles.marginR16}>
            {starAudio2 ? <Image source={icVideoCall.ic_star_filled} style={styles.iconStyle} />
              : <Image source={icVideoCall.ic_star} style={styles.iconStyle} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={_onPressStar3} style={styles.marginR16}>
            {starAudio3 ? <Image source={icVideoCall.ic_star_filled} style={styles.iconStyle} />
              : <Image source={icVideoCall.ic_star} style={styles.iconStyle} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={_onPressStar4} style={styles.marginR16}>
            {starAudio4 ? <Image source={icVideoCall.ic_star_filled} style={styles.iconStyle} />
              : <Image source={icVideoCall.ic_star} style={styles.iconStyle} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={_onPressStar5} style={styles.marginR16}>
            {starAudio5 ? <Image source={icVideoCall.ic_star_filled} style={styles.iconStyle} />
              : <Image source={icVideoCall.ic_star} style={styles.iconStyle} />}
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const _onPressStarVideo1 = () => {
    setStarVideo1(true)
    setStarVideo2(false)
    setStarVideo3(false)
    setStarVideo4(false)
    setStarVideo5(false)
    setVideoRate(1)
  }

  const _onPressStarVideo2 = () => {
    setStarVideo1(true)
    setStarVideo2(true)
    setStarVideo3(false)
    setStarVideo4(false)
    setStarVideo5(false)
    setVideoRate(2)
  }
  const _onPressStarVideo3 = () => {
    setStarVideo1(true)
    setStarVideo2(true)
    setStarVideo3(true)
    setStarVideo4(false)
    setStarVideo5(false)
    setVideoRate(3)
  }
  const _onPressStarVideo4 = () => {
    setStarVideo1(true)
    setStarVideo2(true)
    setStarVideo3(true)
    setStarVideo4(true)
    setStarVideo5(false)
    setVideoRate(4)
  }
  const _onPressStarVideo5 = () => {
    setStarVideo1(true)
    setStarVideo2(true)
    setStarVideo3(true)
    setStarVideo4(true)
    setStarVideo5(true)
    setVideoRate(5)
  }

  const renderStarVideo = () => {
    return (
      <View>
        <View style={styles.video}>
          <Text style={customTxt(Fonts.SemiBold, 14, color040404).txt}>
            {Translate(languageRedux).VIDEO_CALL_BTN_1}</Text>
        </View>
        <View style={styles.ctnStar}>
          <TouchableOpacity onPress={_onPressStarVideo1} style={styles.marginR16}>
            {starVideo1 ? <Image source={icVideoCall.ic_star_filled} style={styles.iconStyle} />
              : <Image source={icVideoCall.ic_star} style={styles.iconStyle} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={_onPressStarVideo2} style={styles.marginR16}>
            {starVideo2 ? <Image source={icVideoCall.ic_star_filled} style={styles.iconStyle} />
              : <Image source={icVideoCall.ic_star} style={styles.iconStyle} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={_onPressStarVideo3} style={styles.marginR16}>
            {starVideo3 ? <Image source={icVideoCall.ic_star_filled} style={styles.iconStyle} />
              : <Image source={icVideoCall.ic_star} style={styles.iconStyle} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={_onPressStarVideo4} style={styles.marginR16}>
            {starVideo4 ? <Image source={icVideoCall.ic_star_filled} style={styles.iconStyle} />
              : <Image source={icVideoCall.ic_star} style={styles.iconStyle} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={_onPressStarVideo5} style={styles.marginR16}>
            {starVideo5 ? <Image source={icVideoCall.ic_star_filled} style={styles.iconStyle} />
              : <Image source={icVideoCall.ic_star} style={styles.iconStyle} />}
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderCommentandButton = () => {
    return (
      <View>
        <View style={styles.comment}>
          <Text style={customTxt(Fonts.SemiBold, 14, color040404).txt}>
            {Translate(languageRedux).COMMENT}
          </Text>
        </View>
        <View style={styles.ctnTextInput}>
          <TextInput
            style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.textInput]}
            placeholder={Translate(languageRedux).ADD_YOUR_COMMENT_HERE}
            placeholderTextColor={colorA7A8A9}
            multiline={true}
            value={comment}
            onChangeText={(text) => setComment(text)}
          />
        </View>
        <View style={styles.ctnButton}>
          <Button
            text={Translate(languageRedux).SUBMIT}
            textColor={(audioRate && videoRate) ? colorFFFFFF : colorC1C3C5}
            backgroundColor={(audioRate && videoRate) ? color3777EE : colorF0F0F0}
            disabled={(audioRate && videoRate) ? false : true}
            onPress={() => { NavigationService.navigate(Routes.DRAWER_NAVIGATION) }}
          />
          <View style={styles.height8} />
          <Button
            text={Translate(languageRedux).DO_THIS_LATER}
            textColor={color3777EE}
            onPress={() => { NavigationService.navigate(Routes.DRAWER_NAVIGATION) }}
          />
        </View>
      </View>
    )
  }

  const renderStarRating = () => {
    return (
      <View style={styles.ctnStarRating}>
        <View style={styles.ctnQuestion}>
          <Text style={customTxt(Fonts.SemiBold, 14, color040404).txt}>
            {Translate(languageRedux).TITLE_RATING}
          </Text>
        </View>
        <View style={styles.starView}>
          {renderStarAudio()}
          {renderStarVideo()}
          {renderCommentandButton()}
        </View>
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.marginB48}>
        {renderTop()}
        {renderStarRating()}
      </View>
    )
  }

  const _onPressClose = () => {
    NavigationService.navigateAndReset(Routes.DRAWER_NAVIGATION)
  }

  return (
    <View style={styles.container}>
      <Header
        textCenter={'Video Call'}
        iconLeft={icHeader.ic_close}
        onPressLeft={_onPressClose}
      />
      <ScrollView>{renderBody()}</ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  marginB48: {
    marginBottom: 48
  },
  ctnTitle: {
    marginTop: 20,
    marginBottom: 8,
    marginHorizontal: 20
  },
  ctnText: {
    marginHorizontal: 20
  },
  ctnStarRating: {
    flex: 1,
    marginTop: 16,
    marginHorizontal: 20,
    borderRadius: 16,
    backgroundColor: colorFFFFFF,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 9
  },
  ctnQuestion: {
    padding: 16
  },
  audio: {
    marginBottom: 8
  },
  starView: {
    marginHorizontal: 16
  },
  iconStyle: {
    height: 32,
    width: 32
  },
  ctnStar: {
    flexDirection: 'row'
  },
  marginR16: {
    marginRight: 16
  },
  video: {
    marginBottom: 8,
    marginTop: 16
  },
  comment: {
    marginBottom: 4,
    marginTop: 16
  },
  textInput: {
    width: '100%',
    marginTop: 12,
    paddingLeft: 16,
    paddingRight: 16
  },
  ctnTextInput: {
    height: 96,
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colorDDDEE1
  },
  ctnButton: {
    marginTop: 16,
    marginBottom: 16
  },
  height8: {
    height: 8
  },
  ctnAfterRating: {
    flex: 1,
    marginTop: 38,
    marginHorizontal: 20,
    borderRadius: 16,
    backgroundColor: colorFFFFFF,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 9
  },
  ctnTextRateDoc: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 24
  },
  marginHori20: {
    marginHorizontal: 20,
    height: 350,
    justifyContent: 'flex-end'
  },
  ctnRadioButton: {
    marginBottom: 16
  }
})