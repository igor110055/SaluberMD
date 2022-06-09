import React from 'react'
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity, FlatList } from 'react-native'
import { useSelector } from 'react-redux'

import { color3777EE, colorFFFFFF } from 'constants/colors'
import Translate from '../../../translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'

import icHeader from '../../../../assets/images/header'

import Header from '../../healthProfile/components/Header'

export default function FAQs() {

  const languageRedux = useSelector(state => state.common.language)

  const linkFAQ = `https://faqitit.salubermd.com/faq_itit.html#_Toc45700969`

  const data = [
    {
      content: Translate(languageRedux).FAQ_QUESTION_1
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_2
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_3
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_4
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_5
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_6
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_7
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_8
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_9
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_10
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_11
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_12
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_13
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_14
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_15
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_16
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_17
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_18
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_19
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_20
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_21
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_22
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_23
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_24
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_25
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_26
    },
    {
      content: Translate(languageRedux).FAQ_QUESTION_27
    }
  ]

  const RenderItem = ({item, index}) => {
    return (
      <View style={styles.marginB12}>
        <TouchableOpacity onPress={() =>{
            Linking.openURL(linkFAQ)
        }}>
          <Text style={[customTxt(Fonts.SemiBold, 14, color3777EE).txt, styles.styleLink]}>
            {item?.content}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnContent}>
        <FlatList
         data={data}
         keyExtractor={(item, index) => index.toString()}
         renderItem={({item, index}) => (
         <RenderItem item={item} index={index} />
         )}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        source={icHeader.ic_left}
        title={Translate(languageRedux).FAQs}
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
  ctnContent: {
    marginHorizontal: 20,
    paddingBottom: 42
  },
  styleLink: {
    textDecorationLine: 'underline'
  },
  marginB12: {
    marginBottom: 12
  }
})
