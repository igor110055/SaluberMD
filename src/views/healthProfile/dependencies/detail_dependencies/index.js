import React, { useEffect, useState } from 'react'
import {
  StyleSheet, View, Text, TouchableOpacity,
  Image,
  DeviceEventEmitter
} from 'react-native'
import {
  color040404,
  color3777EE,
  color828282,
  colorC1C3C5,
  colorF0F0F0,
  colorF2F2F2,
  colorF5455B,
  colorF8F8F8,
  colorFFFFFF
} from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import CustomTextInput from '../../components/CustomTextInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Header from '../../components/Header'
import _ from 'lodash'
import NavigationService from '../../../../navigation'
import Routes from '../../../../navigation/Routes'
import CustomDatePicker from '../../../../components/CustomDatePicker'
import { convertYear, getDate112000 } from '../../../../constants/DateHelpers'
import icHeader from '../../../../../assets/images/header'
import icHealthProfile from '../../../../../assets/images/health_profile'
import { useSelector } from 'react-redux'
import SearchListWithName from '../../../../components/SearchListWithName'
import Translate from 'translate'
import imgHealth from '../../../../../assets/images/health_profile'
import icDoc from '../../../../../assets/images/document'

export default function DetailDependency({ route }) {
  const passingData = route?.params?.data
  const [dependency, setDependency] = useState({name: passingData?.name || '', id: passingData?.id})
  const [weaned, setWeaned] = useState(passingData?.weaned || '')
  const [dailyUse, setDailyUse] = useState(passingData?.dailyUse || '')
  const [since, setSince] = useState(passingData?.since || getDate112000())
  const [note, setNote] = useState(passingData?.note || '')
  const [isEmergency, setEmergency] = useState(passingData?.isEmergency || false)
  const indexData = route?.params?.index
  const lsData = route?.params?.lsData || []
  const lsDelete = route?.params?.lsDelete || []
  const [isMiss, setMiss] = useState(false)
  const [isMissWeaned, setMissWeaned] = useState(false)
  const datePickerRef = React.createRef()
  const [other, setOther] = useState(passingData?.other || '')
  const lsDepen = useSelector(state => state.common.dependency)
  const [isShowDepen, setShowDepen] = useState(false)
  const [isShowWean, setShowWean] = useState(false)
  const tempHiden = route?.params?.tempHiden
  const languageRedux = useSelector(state => state.common.language)

  useEffect(() => {
    console.log('Passing data: ', passingData)
    console.log('lsData: ', lsData)
  }, [])

  const renderTextInput = () => {
    return (
      <>
        <CustomTextInput
          title={Translate(languageRedux).dipendenza}
          value={dependency?.name}
          onChangeTxt={(txt) => {
            setMiss(false)
            setDependency(txt)
          }}
          placeholder={Translate(languageRedux).PH_DEPENDENCY}
          validate={isMiss}
          onPress={() => setShowDepen(true)}
          iconRight={imgHealth.ic_dropdown}
        />
        {dependency?.id === 1 && <CustomTextInput
          title={Translate(languageRedux).other}
          value={other}
          onChangeTxt={(txt) => setOther(txt)}
          placeholder={Translate(languageRedux).PH_DEPENDENCY}
          textStyle={styles.txtStyle}
          validate={other ? false : true}
        />}
        <CustomTextInput
          title={Translate(languageRedux).weanedoff}
          value={weaned?.name || passingData?.weaned}
          onChangeTxt={() => {
            setMissWeaned(false)
          }}
          placeholder={Translate(languageRedux).PH_WEANEDOFF}
          textStyle={styles.txtStyle}
          validate={isMissWeaned}
          onPress={() => setShowWean(true)}
          iconRight={imgHealth.ic_dropdown}
        />
        <CustomTextInput
          title={Translate(languageRedux).annoinizio}
          value={since ? convertYear(since) : ''}
          onChangeTxt={() => {}}
          placeholder={Translate(languageRedux).SELECT_A_DATE}
          textStyle={styles.txtStyle}
          onPress={() => datePickerRef.current.onPressDate()}
          iconRight={icDoc.ic_choose_date}
        />
        <CustomTextInput
          title={Translate(languageRedux).dailyuse}
          value={dailyUse}
          onChangeTxt={(txt) => setDailyUse(txt)}
          textStyle={styles.txtStyle}
        />
        <CustomTextInput
          title={Translate(languageRedux).note}
          value={note}
          onChangeTxt={(txt) => setNote(txt)}
          placeholder={Translate(languageRedux).INSERT_ANY_OTHER_INFO}
          textStyle={styles.txtStyle}
          textinputStyle={[styles.textinputNoteStyle]}
          multiline={true}
        />
      </>
    )
  }

  const renderShowEmergency = () => {
    return (
      <View style={styles.emergencyView}>
        <TouchableOpacity onPress={() => setEmergency(!isEmergency)}>
          <Image
            style={styles.imgEmergency}
            source={isEmergency ? icHealthProfile.ic_checkbox : icHealthProfile.ic_emptybox}
          />
        </TouchableOpacity>
        <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>{Translate(languageRedux).Emergency}</Text>
      </View>
    )
  }

  const _onPressDelete = () => {
    var newData = []
    var dataDelete = []
    const deleteItem = (lsData || []).forEach(function (value, index) {
      if (index !== indexData) {
        newData.push(value)
      }
      if (index === indexData) {
        var item = {}
        item.id = value?.itemID
        dataDelete.push(item)
      }
    })
    var listDelete = _.concat(lsDelete, dataDelete)
    console.log(deleteItem)
    console.log('Run newData: ', newData)
    DeviceEventEmitter.emit(Routes.DEPENDENCIES_SCREEN,
      {newData: newData, dataDelete: listDelete})
    NavigationService.goBack()
  }

  const renderDelete = () => {
    return (
      <TouchableOpacity
        style={styles.deleteView}
        activeOpacity={dependency ? 0 : 1}
        onPress={_onPressDelete}
      >
        <Text style={[
          customTxt(Fonts.SemiBold, 18, colorF5455B).txt,
          styles.txtDelete
        ]}>Delete Dependency</Text>
      </TouchableOpacity>
    )
  }

  const renderNew = () => {
    return (
      <View style={[
        styles.questionView
      ]}>
        {renderTextInput()}
        {renderShowEmergency()}
      </View>
    )
  }

  const _onPressRight = () => {
    if (_.isEmpty(dependency)) {
      setMiss(true)
      return
    } else if (_.isEmpty(weaned)) {
      setMissWeaned(true)
      return
    }
    const callBackBD = {
      name: dependency?.name || '',
      id: dependency?.id,
      other: other,
      weaned: weaned?.name || passingData?.weaned,
      weanedID: weaned?.id || passingData?.weaned === Translate(languageRedux).Y ? 1 : 0,
      dailyUse: dailyUse || '',
      since: since || getDate112000,
      note: note || '',
      isEmergency: isEmergency || false,
      isUpdate: true,
      itemID: passingData?.itemID
    }

    lsData[indexData] = callBackBD
    DeviceEventEmitter.emit(Routes.DEPENDENCIES_SCREEN, {newData: lsData, dataDelete: lsDelete})
    NavigationService.goBack()
  }

  const _onChangeDatePicker = (date) => {
    setSince(date)
  }

  const lsType = [
    {'name': Translate(languageRedux).N, 'id': 0},
    {'name': Translate(languageRedux).Y, 'id': 1}
  ]

  const checkButtonSave = () => {
    if (dependency?.id === 1 && other) {
      return false
    }
    if (dependency?.id !== 1 && dependency?.name) {
      return false
    }
    else {
      return true
    }
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        title={Translate(languageRedux).dependencies}
        onPressSubmit={_onPressRight}
        source={icHeader.ic_left}
        buttonText={Translate(languageRedux).btnsave}
        backgroundColorButton={checkButtonSave() ? colorF0F0F0 : color3777EE}
        textButtonColor={checkButtonSave() ? colorC1C3C5 : colorFFFFFF}
        disabled={checkButtonSave()}
      />
      <KeyboardAwareScrollView>
        {renderNew()}
        {renderDelete()}
      </KeyboardAwareScrollView>
      <CustomDatePicker
        refDatePicker={datePickerRef}
        onChangeDate={_onChangeDatePicker}
        maxDate={new Date()}
        date={getDate112000()}
      />
      {
        isShowDepen && (
          <SearchListWithName
            listData={lsDepen}
            title={Translate(languageRedux).CHOOSE_DEPENDENCY}
            itemSelected={dependency}
            onItemClick={(val) => {
              setDependency(val)
              setShowDepen(false)
            }}
            onPressRight={() => {
              setShowDepen(false)
            }}
          />
        )
      }
      {
        isShowWean && (
          <SearchListWithName
            listData={lsType}
            title={Translate(languageRedux).CHOOSE_WEANED_OFF}
            itemSelected={weaned}
            onItemClick={(val) => {
              setWeaned(val)
              setShowWean(false)
            }}
            onPressRight={() => {
              setShowWean(false)
            }}
            lsHiden={tempHiden}
          />
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  questionView: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 24,
    backgroundColor: colorFFFFFF,
    padding: 16,
    paddingBottom: 32,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9
  },
  marginT8: {
    marginTop: 8
  },
  txtStyle: {
    marginTop: 24
  },
  textinputNoteStyle: {
    flex: 1,
    height: 70,
    paddingTop: 14,
    paddingBottom: 14
  },
  emergencyView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  imgEmergency: {
    width: 24,
    height: 24,
    marginTop: 24,
    marginRight: 16,
    marginBottom: 24
  },
  madatoryInfoView: {
    alignItems: 'center',
    marginTop: 8
  },
  paddingB48: {
    marginBottom: 48
  },
  imgDetail: {
    width: 24,
    height: 24
  },
  allerigeView: {
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: colorF2F2F2,
    alignItems: 'center',
    paddingTop: 16,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 13,
    marginBottom: 8
  },
  itemAllerigeView: {
    flex: 1
  },
  titleAlliergie: {
    marginBottom: 12
  },
  addAllerigeBT: {
    minWidth: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtAddAllerige: {
    paddingTop: 15,
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 15
  },
  lsAllerigeView: {
    justifyContent: 'center'
  },
  deleteView: {
    borderRadius: 4,
    minWidth: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    paddingBottom: 40
  },
  txtDelete: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 24,
    marginRight: 24
  }
})
