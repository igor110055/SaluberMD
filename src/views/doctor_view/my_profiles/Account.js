import { color040404, color3777EE, colorF8F8F8, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import React, { useState } from 'react'
import {
  StyleSheet, View, Text, Image, Dimensions, ScrollView, TouchableOpacity
} from 'react-native'
import { useSelector } from 'react-redux'
import Translate from 'translate'
import TextInputBottomLine from './components/TextInputBottomLine'

export default function AccountDoctorView({
  virtualOffice, setEditView, language
}) {
  const languageRedux = useSelector(state => state.common.language)
  const userinfoRedux = useSelector(state => state.user.userinfo)

  // action
  const onPressEditInfo = () => {
    setEditView(true)
  }

  // Render
  const renderTop = () => {
    return (
      <View style={styles.topView}>
        <Text style={[
          customTxt(Fonts.Bold, 18, color040404).txt
        ]}>{Translate(languageRedux).ACCOUNT_DETAILS}</Text>
        <TouchableOpacity
          style={styles.editInfoView}
          onPress={onPressEditInfo}
        >
          <Text style={[
            customTxt(Fonts.Bold, 14, color3777EE).txt
          ]}>{Translate(languageRedux).EDIT_INFO}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderCenter = (val) => {
    return (
      <View>
        <TextInputBottomLine
          title={Translate(languageRedux).USERNAME}
          value={userinfoRedux?.username || ''}
          isView={true}
          onChangeTxt={() => {}}
        />
        <TextInputBottomLine
          title={Translate(languageRedux).email1}
          value={virtualOffice?.email || ''}
          isView={true}
          onChangeTxt={() => {}}
        />
        <TextInputBottomLine
          title={Translate(languageRedux).PASSWORD}
          value={'********'}
          isView={true}
          onChangeTxt={() => {}}
        />
        <TextInputBottomLine
          title={Translate(languageRedux).LANGUAGE_TYPE}
          value={language?.name}
          isView={true}
          isHidenLine={true}
          onChangeTxt={() => {}}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollStyle}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <View style={styles.insideView}>
          {renderTop()}
          {renderCenter()}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  scrollStyle: {
    borderRadius: 12,
    paddingTop: 16,
    paddingLeft: 16
  },
  insideView: {
    backgroundColor: colorFFFFFF,
    marginRight: 20,
    borderRadius: 12,
    overflow: 'hidden'
  },
  contentContainerStyle: {
    paddingBottom: 60
  },
  topView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginLeft: 16
  },
  editInfoView: {
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: color3777EE
  }
})
