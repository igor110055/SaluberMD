import { color040404, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import React from 'react'
import {
  StyleSheet, View, Text, Image, Dimensions, ScrollView
} from 'react-native'
import { useSelector } from 'react-redux'
import Translate from 'translate'
import imgContact from '../../../../assets/images/contact_us'

export default function AboutUsView() {
  const languageRedux = useSelector(state => state.common.language)

  const renderContentNumber = (img, txt) => {
    return (
      <View style={styles.numberTxtView}>
        <Image source={img} style={styles.imgNumber} />
        <Text style={[
          customTxt(Fonts.Regular, 16, color040404).txt,
          styles.txtContent
        ]}>{txt}</Text>
      </View>
    )
  }

  const renderContentLive = () => {
    const renderContentLive = (txt1, txt2) => {
      return (
        <Text style={[
          customTxt(Fonts.Bold, 16, color040404).txt,
          styles.marginT16
        ]}>{txt1}
          <Text style={[
            customTxt(Fonts.Regular, 16, color040404).txt
          ]}> {txt2}</Text>
        </Text>
      )
    }
    return (
      <View>
        <Text style={[
          customTxt(Fonts.Regular, 16, color040404).txt
        ]}>{Translate(languageRedux).ABOUT_US_DOCTOR_SECTION1_P1}</Text>
        <Text style={[
          customTxt(Fonts.Regular, 16, color040404).txt,
          styles.marginT16
        ]}>{Translate(languageRedux).ABOUT_US_DOCTOR_SECTION1_P2}</Text>
        <Text style={[
          customTxt(Fonts.Bold, 16, color040404).txt,
          styles.marginT16
        ]}>{Translate(languageRedux).ABOUT_US_DOCTOR_SECTION1_P3}</Text>
        {renderContentLive(
          Translate(languageRedux).ABOUT_US_DOCTOR_BENEFIT1,
          Translate(languageRedux).ABOUT_US_DOCTOR_BENEFIT1_DESC
        )}
        {renderContentLive(
          Translate(languageRedux).ABOUT_US_DOCTOR_BENEFIT2,
          Translate(languageRedux).ABOUT_US_DOCTOR_BENEFIT2_DESC
        )}
        {renderContentLive(
          Translate(languageRedux).ABOUT_US_DOCTOR_BENEFIT3,
          Translate(languageRedux).ABOUT_US_DOCTOR_BENEFIT3_DESC
        )}
        {renderContentLive(
          Translate(languageRedux).ABOUT_US_DOCTOR_BENEFIT4,
          Translate(languageRedux).ABOUT_US_DOCTOR_BENEFIT4_DESC
        )}
        {renderContentLive(
          Translate(languageRedux).ABOUT_US_DOCTOR_BENEFIT5,
          Translate(languageRedux).ABOUT_US_DOCTOR_BENEFIT5_DESC
        )}
        {renderContentLive(
          Translate(languageRedux).ABOUT_US_DOCTOR_BENEFIT6,
          Translate(languageRedux).ABOUT_US_DOCTOR_BENEFIT6_DESC
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollStyle}
        contentContainerStyle={styles.contentContainerStyle}
      >
        {/* <Text style={[
          customTxt(Fonts.Bold, 24, color040404).txt,
          styles.marginR20
        ]}>{Translate(languageRedux).ABOUT_SALUBERMD}</Text>
        <Text style={[
          customTxt(Fonts.Regular, 16, color040404).txt,
          styles.marginTxt
        ]}>{Translate(languageRedux).ABOUT1}</Text>
        <Image source={imgContact.ic_video_thumbnail} style={styles.imgStyle} />
        <Text style={[
          customTxt(Fonts.Bold, 24, color040404).txt,
          styles.marintop32
        ]}>{Translate(languageRedux).FOUNDING_PRINCIPLES}</Text>
        <Text style={[
          customTxt(Fonts.Regular, 16, color040404).txt,
          styles.marginTxt
        ]}>{Translate(languageRedux).ABOUT2}</Text>
        <Image source={imgContact.ic_video_thumbnail2} style={styles.imgStyle} />
        {renderContentNumber(imgContact.ic_txt_1, Translate(languageRedux).ABOUT_US_TXT_1)}
        {renderContentNumber(imgContact.ic_txt_2, Translate(languageRedux).ABOUT_US_TXT_2)}
        {renderContentNumber(imgContact.ic_txt_3, Translate(languageRedux).ABOUT_US_TXT_3)}
        {renderContentNumber(imgContact.ic_txt_4, Translate(languageRedux).ABOUT_US_TXT_4)}
        {renderContentNumber(imgContact.ic_txt_5, Translate(languageRedux).ABOUT_US_TXT_5)} */}
        {renderContentLive()}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF,
    paddingLeft: 20
  },
  scrollStyle: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 24
  },
  marginTxt: {
    marginTop: 8,
    marginBottom: 16,
    marginRight: 20
  },
  marginR20: {
    marginRight: 20
  },
  marintop32: {
    marginTop: 32
  },
  imgStyle: {
    width: Dimensions.get('window').width - 40,
    height: 200,
    resizeMode: 'contain'
  },
  contentContainerStyle: {
    paddingBottom: 160
  },
  numberTxtView: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center'
  },
  imgNumber: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
    marginRight: 16
  },
  txtContent: {
    flex: 1,
    marginRight: 20
  },
  marginT16: {
    marginTop: 16
  }
})
