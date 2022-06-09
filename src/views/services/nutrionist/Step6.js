import React, { useState } from 'react'
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList} from 'react-native'
import {useSelector} from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IconNavi from 'react-native-vector-icons/Feather'

import {colorFFFFFF, color040404, color3777EE, colorDDDEE1, colorF0F0F0, colorC1C3C5} from 'constants/colors'
import Translate from '../../../translate'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import {customTxt} from 'constants/css'
import Fonts from 'constants/Fonts'

import icHeader from '../../../../assets/images/header'

import Header from 'components/Header'
import DialogView from 'components/DialogView'

export default function Step6({ route }) {
  const languageRedux = useSelector(state => state.common.language)
  const [value, setValue] = useState()
  const [isDialog, setDialog] = useState(false)
  const passingData = route?.params?.data

  const data = [
    {
      id: 1
    },
    {
      id: 2
    },
    {
      id: 3
    },
    {
      id: 4
    },
    {
      id: 5
    },
    {
      id: 6
    },
    {
      id: 7
    }
  ]

  const RenderItem = ({item}) => {
    const isActiveDoctor = () => {
      return item?.id === value
    }
    const _onPressItem = () => {
      setValue(item?.id)
    }
    return (
      <View>
        <TouchableOpacity onPress={_onPressItem} style={styles.fristLine}>
        <Icon
          name={isActiveDoctor() ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
          size={24}
          color={isActiveDoctor() ? color3777EE : colorDDDEE1}
        />
        <Text style={[customTxt(Fonts.Regular, 14, color040404).txt, styles.marginL8]}>
          {item?.id}
        </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderFlatlist = () => {
    return (
      <View>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderButtonNext = () => {
    return (
      <View style={styles.flexRow}>
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
          disabled={value ? false : true}
          style={value ? styles.buttonNavi : styles.buttonNavi2}
          onPress={() => {
            NavigationService.navigate(Routes.NUTRITIONIST_7_SCREEN, {
              data: {
                concern: passingData?.concern,
                goals: passingData?.goals,
                meals: value
              }
            })
          }}
          >
          <IconNavi
            name={'arrow-right'}
            size={24}
            color={value ? colorFFFFFF : colorC1C3C5}
          />
        </TouchableOpacity>
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.paddingBottom}>
        <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginB8]}>
          {Translate(languageRedux).NUTRITIONIST_Q2}
        </Text>
        {renderFlatlist()}
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
      <ScrollView>{renderBody()}</ScrollView>
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
  marginL8: {
    marginLeft: 8
  },
  marginB8: {
    marginBottom: 8
  },
  fristLine: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8
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
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})
