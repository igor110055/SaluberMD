import React, { useEffect, useState } from 'react'
import {
  StyleSheet, View, Text, TouchableOpacity, FlatList, DeviceEventEmitter,
  Image,
  StatusBar
} from 'react-native'
import {
  color040404,
  color363636,
  color3777EE,
  color5C5D5E,
  colorBDBDBD,
  colorC1C3C5,
  colorF0F0F0,
  colorF8F8F8,
  colorFFFFFF
} from '../../../constants/colors'
import { customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'
import CustomTextInput from '../components/CustomTextInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import icHealthProfile from '../../../../assets/images/health_profile'
import Header from '../components/Header'
import icHeader from '../../../../assets/images/header'
import RadioButton from '../components/RadioButton'
import { useSelector, useDispatch } from 'react-redux'
import _, {cloneDeep} from 'lodash'
import NavigationService from '../../../navigation'
import Routes from '../../../navigation/Routes'
import CustomDatePicker from '../../../components/CustomDatePicker'
import {apiHealthProfile} from '../../../api/Auth'
import { convertDMMMYYYY, convertDateDDMMYYYYToSever, getDate112000 } from '../../../constants/DateHelpers'
import LoadingView from '../../../components/LoadingView'
import { saveLSAllergi } from '../../../actions/common'
import SearchListWithName from '../../../components/SearchListWithName'
import { apiPOSTAllergy } from '../../../api/PatientAllergy'
import Translate from 'translate'
import axios from 'axios'
import * as APIs from '../../../api/APIs'
import icDoc from '../../../../assets/images/document'
import imgHealth from '../../../../assets/images/health_profile'

export default function MedicalRecord() {
  const allergies = useSelector(state => state.user?.allergies)
  const [isAnswer, setAnswer] = useState((dataAllergy?.datas || []).length > 0 ? true : false)
  const [isNewAllergy, setNewAllergy] = useState(false)
  const [allergy, setAllergy] = useState('')
  const [genericName, setGenericName] = useState('')
  const [since, setSince] = useState()
  const [note, setNote] = useState('')
  const [isEmergency, setEmergency] = useState(false)
  const [tempAllergies, setTempAllergie] = useState(allergies?.datas || [])
  const dispatch = useDispatch()
  const [reloadFlatlist, setReloadFlatlist] = useState(1)
  const datePickerRef = React.createRef()
  const lsAllergiRedux = useSelector(state => state.common.allergies)
  const [lsAllergi, setLSAllergi] = useState(lsAllergiRedux || [])
  const [isLoading, setLoading] = useState(false)
  const [isShowAllergies, setShowAllergies] = useState(false)
  const [other, setOther] = useState()
  const languageRedux = useSelector(state => state.common.language)
  const dataAllergy = useSelector(state => state.common.dataAllergy)
  const [list, setList] = useState()
  const [listDelete, setListDelete] = useState()
  const [listUpdate, setListUpdate] = useState()
  const token = useSelector(state => state.user.token)

  useEffect(() => {
    // if (isAnswer && _.isEmpty(tempAllergies)) {
    //   setNewAllergy(true)
    // }
    setList(cloneDeep(dataAllergy?.datas))
    callAPIAllergi()
  }, [])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.MEDICAL_RECORD_SCREEN, params => {
      console.log('Call back data: ', params?.newData)
      console.log('dataDelete: ', params?.dataDelete)
      var dataTemp = params?.newData.filter((val) => val?.isNew === true)
      var dataUpdate = params?.newData.filter((val) => val?.isUpdate === true)
      setTempAllergie(dataTemp)
      setList(params?.newData)
      setListDelete(params?.dataDelete)
      setListUpdate(dataUpdate)
      setReloadFlatlist(Math.random())
      if ((params || []).length === 0) {
        resetValueAdd()
        setTimeout(() => {
          setNewAllergy(true)
        }, 200)
      }
    })

    return () => subscription.remove()
  }, [])

  const callAPIAllergi = () => {
    if (lsAllergiRedux.length > 0) { return }
    setLoading(true)
    dispatch(apiHealthProfile()).then(res => {
      console.log('Res: ', res)
      const getAller = res?.payload?.allergie || []
      if (getAller.length > 0) {
        setLSAllergi(getAller)
        Promise.all([
          dispatch(saveLSAllergi(getAller))
        ])
      }
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }

  const renderQuestion = () => {
    if (!(_.isEmpty(tempAllergies))) {
      return null
    }

    const _onPressRadio = (val) => {
      if (val) {
        setNewAllergy(true)
      } else {
        setNewAllergy(false)
        resetValueAdd()
      }
      setAnswer(val)
    }

    const borderBottom = {
      borderBottomLeftRadius: isNewAllergy === true ? 0 : 16,
      borderBottomRightRadius: isNewAllergy === true ? 0 : 16
    }

    return (
      <View style={[styles.questionView, borderBottom]}>
        <Text style={[
          customTxt(Fonts.SemiBold, 18, color363636).txt
        ]} >{Translate(languageRedux).QUESTION_ALLERGY_HPW}</Text>
        <Text style={[
          customTxt(Fonts.Regular, 16, color5C5D5E).txt,
          styles.marginT8
        ]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.</Text>
        <View style={styles.txtStyle}>
          <RadioButton
            value={isAnswer}
            setValue={_onPressRadio}
          />
        </View>
      </View>
    )
  }

  const renderTextInput = () => {
    return (
      <>
        <CustomTextInput
          title={Translate(languageRedux).allergia}
          placeholder={Translate(languageRedux).PH_GENERIC_NAME}
          value={allergy?.name}
          onChangeTxt={(txt) => setAllergy(txt)}
          textStyle={styles.txtStyle}
          onPress={() => setShowAllergies(true)}
          validate={allergy?.id ? false : true}
          iconRight={imgHealth.ic_dropdown}
        />
        {
          allergy?.id === 1 && (
            <CustomTextInput
              title={Translate(languageRedux).other}
              value={other}
              onChangeTxt={(txt) => setOther(txt)}
              placeholder={Translate(languageRedux).PH_GENERIC_NAME}
              textStyle={styles.txtStyle}
              validate={other ? false : true}
            />
          )
        }
        <CustomTextInput
          title={Translate(languageRedux).genericName}
          value={genericName}
          onChangeTxt={(txt) => setGenericName(txt)}
          placeholder={Translate(languageRedux).PH_GENERIC_NAME}
          textStyle={styles.txtStyle}
        />
        <CustomTextInput
          title={Translate(languageRedux).since}
          value={since ? convertDMMMYYYY(since) : ''}
          onChangeTxt={(txt) => setSince(txt)}
          placeholder={Translate(languageRedux).SELECT_A_DATE}
          textStyle={styles.txtStyle}
          onPress={() => datePickerRef.current.onPressDate()}
          iconRight={icDoc.ic_choose_date}
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
      <View style={styles.rmergencyView}>
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

  const resetValueAdd = () => {
    setAllergy()
    setGenericName()
    setSince()
    setNote()
    setEmergency(false)
    setNewAllergy(false)
    setOther()
  }

  const _onPressAdd = () => {
    if (_.isEmpty(allergy)) { return }
    const params = {
      name: allergy?.name,
      id: allergy?.id,
      other: other,
      genericName,
      since,
      note,
      isEmergency,
      lsAllergi,
      isNew: true
    }
    const newData = _.concat(tempAllergies, params)
    setTempAllergie(newData)
    const newDataFlatlist = _.concat(list, params)
    setList(newDataFlatlist)
    setTimeout(() => {
      resetValueAdd()
    }, 100)
  }

  const checkBTAdd = () => {
    if (_.isEmpty(allergy?.name) && allergy?.id !== 1) {
      return false
    }
    if (allergy?.id === 1 && _.isEmpty(other)) {
      return false
    }
    return true
  }

  const renderAddButton = () => {

    return (
      <View style={styles.addBT}>
        <TouchableOpacity
          style={addStyle(checkBTAdd()).addView}
          activeOpacity={checkBTAdd() ? 0 : 1}
          onPress={(_onPressAdd)}
        >
          <Text style={[
            customTxt(Fonts.SemiBold, 18, colorC1C3C5).txt,
            addStyle(checkBTAdd()).txtAdd
          ]}>{Translate(languageRedux).add_new}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderNewAllergy = () => {
    const borderTop = {
      borderTopLeftRadius: isNewAllergy === true && 0,
      borderTopRightRadius: isNewAllergy === true && 0
    }
    return (
      <View style={[
        styles.questionView,
        styles.marginT16,
        styles.paddingB48,
        borderTop]}>
        <Text style={[
          customTxt(Fonts.SemiBold, 18, color363636).txt
        ]} >{Translate(languageRedux).NEW_ALLERGY}</Text>
        <Text style={[
          customTxt(Fonts.Regular, 16, color363636).txt,
          styles.marginT8
        ]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.</Text>
        {renderTextInput()}
        {renderShowEmergency()}
        {renderAddButton()}
      </View>
    )
  }

  const _onPressRight = () => {
    if (isAnswer === null) {
      return
    }

    if (isAnswer && tempAllergies.length === 0) {
      return
    }
    setLoading(true)
    _.forEach(tempAllergies, function (value) {
      var params = {
        allergyId: value?.id || '',
        genericName: value?.genericName || '',
        onEmergencyLogin: value?.isEmergency ? 1 : 0,
        other: value?.other || '',
        remarks: value?.note || '',
        since: value?.since ? convertDateDDMMYYYYToSever(value?.since) : ''
      }
      console.log('params: ', params)
      setTimeout(() => {
        dispatch(apiPOSTAllergy(params)).then(res => {
          console.log('Res param', res)
        }).catch((err) => {
          console.log('Err: ', err)
        })
      }, 400)
    })
    _.forEach(listDelete, function (value) {
      axios({
        method: 'delete',
        url: `${APIs.hostAPI}backoffice/allergy/${value?.id}`,
        headers: {
          'x-auth-token': token
        }
      })
        .then(response => {
          console.log('Delete successful', response)
        })
        .catch(error => {
          console.error('There was an error!', error)
        })
    })
    _.forEach(listUpdate, function (value) {
      const body = {
        id: value?.itemID,
        allergyId: value?.id || '',
        since: value?.since ? convertDateDDMMYYYYToSever(value?.since) : '',
        genericName: value?.genericName || '',
        remarks: value?.note || '',
        onEmergencyLogin: value?.isEmergency ? 1 : 0,
        other: value?.other || ''
      }
      axios({
        method: 'put',
        url: `${APIs.hostAPI}backoffice/allergy`,
        headers: {
          'x-auth-token': token
        },
        data: body
      })
        .then(response => {
          console.log('data: ', response.data)
        })
        .catch(error => {
          console.error('There was an error!', error)
        })
    })
    setTimeout(() => {
      DeviceEventEmitter.emit(Routes.HEALTHPROFILE_SCREEN)
      setLoading(false)
      NavigationService.goBack()
    }, 4000)
}

const renderAllergies = () => {
  // if (_.isEmpty(tempAllergies)) {
  //   return null
  // }


  const _onPressItem = (item, index) => {
    const lsFilter = (_.cloneDeep(tempAllergies)).filter(val => val?.id !== item?.id)
    NavigationService.navigate(Routes.DETAIL_ALLERGIRE_SCREEN, {
      data: item,
      index: index,
      lsData: list,
      lsDelete: listDelete,
      tempHiden: lsFilter
    })
  }


  const renderFlatlistAllergies = () => {

    const RenderItemAllergie = ({ item, index }) => {

      return (
        <TouchableOpacity
          onPress={() => _onPressItem(item, index)}
          style={styles.allerigeView}>
          <View style={styles.itemAllerigeView}>
            <Text
              numberOfLines={1}
              style={[
                styles.titleAlliergie,
                customTxt(Fonts.SemiBold, 16, color040404).txt
              ]}
            >{item?.id === 1 ? item?.other : (item?.name || '')}</Text>
            <Text
              numberOfLines={1}
              style={[
                customTxt(Fonts.Regular, 12, color5C5D5E).txt]}
            >{Translate(languageRedux).since}{' '}{item?.since ? convertDMMMYYYY(item?.since) : ''}</Text>
          </View>
          <Image
            source={icHealthProfile.ic_right}
            style={styles.imgDetail}
          />
        </TouchableOpacity>
      )
    }

    return (
      <FlatList
        data={list || []}
        extraData={reloadFlatlist}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) =>
          <RenderItemAllergie
            item={item}
            index={index}
          />
        }
      />
    )
  }
  const borderBottom2 = {
    borderBottomLeftRadius: !isNewAllergy ? 16 : 0,
    borderBottomRightRadius: !isNewAllergy ? 16 : 0
  }
  return (
    <View style={styles.lsAllerigeView}>
      <View style={[styles.questionView, borderBottom2]}>
        <Text style={[
          customTxt(Fonts.SemiBold, 18, color363636).txt
        ]} >{Translate(languageRedux).allergie}</Text>
        <Text style={[
          customTxt(Fonts.Regular, 16, color5C5D5E).txt,
          styles.marginT8
        ]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.</Text>
        <View style={styles.txtStyle}>
          {renderFlatlistAllergies()}
        </View>
        {
          !isNewAllergy && (
            <TouchableOpacity
              style={[
                styles.addAllerigeBT
              ]}
              onPress={() => setNewAllergy(true)}
            >
              <Text style={[
                styles.txtAddAllerige,
                customTxt(Fonts.SemiBold, 18, color3777EE).txt
              ]}>{Translate(languageRedux).ADD_NEW_ALLERGY}</Text>
            </TouchableOpacity>
          )
        }
      </View>
    </View>
  )
}

const _onChangeDatePicker = (date) => {
  console.log('date picker: ', date)
  setSince(date)
}

const checkBTSubmit = () => {
  if (isAnswer === null) {
    return true
  }
  if (isAnswer && (tempAllergies || []).length === 0) {
    return true
  }
  return false
}

return (
  <View style={styles.container}>
    <StatusBar barStyle={'dark-content'} backgroundColor="white"/>
    <Header
      backgroundColor={colorFFFFFF}
      disabled={checkBTSubmit()}
      title={Translate(languageRedux).allergie}
      source={icHeader.ic_left}
      buttonText={Translate(languageRedux).SUBMIT}
      backgroundColorButton={!checkBTSubmit() ? color3777EE : colorF0F0F0}
      textButtonColor={!checkBTSubmit() ? colorFFFFFF : colorC1C3C5}
      onPressSubmit={_onPressRight}
    />
    <KeyboardAwareScrollView style={styles.shadow}>
      {(dataAllergy?.datas || []).length === 0 && isShowAllergies === false && isLoading === false && renderQuestion()}
      {((dataAllergy?.datas || []).length > 0 || (tempAllergies || []).length > 0) && isShowAllergies === false && isLoading === false && renderAllergies()}
      {isNewAllergy && isShowAllergies === false && isLoading === false && renderNewAllergy()}
    </KeyboardAwareScrollView>
    <CustomDatePicker
      refDatePicker={datePickerRef}
      onChangeDate={_onChangeDatePicker}
      maxDate={new Date()}
      date={since || getDate112000()}
    />
    {isLoading && <LoadingView />}
    {
      isShowAllergies && (
        <SearchListWithName
          listData={lsAllergi}
          title={Translate(languageRedux).CHOOSE_ALLERGY}
          itemSelected={allergy}
          onItemClick={(val) => {
            setAllergy(val)
            setOther('')
            setShowAllergies(false)
          }}
          onPressRight={() => {
            setShowAllergies(false)
          }}
          lsHiden={tempAllergies}
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
    marginBottom: 0,
    backgroundColor: colorFFFFFF,
    padding: 16,
    paddingBottom: 16,
    borderRadius: 16
  },
  marginT8: {
    marginTop: 8
  },
  marginT16: {
    marginTop: 0
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
  rmergencyView: {
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
  addBT: {
    alignItems: 'flex-end'
  },
  paddingB48: {
    marginBottom: 48
  },
  imgDetail: {
    width: 24,
    height: 24
  },
  allerigeView: {
    height: 72,
    flexDirection: 'row',
    borderRadius: 12,
    backgroundColor: colorF8F8F8,
    alignItems: 'center',
    paddingTop: 14,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colorF0F0F0
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
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9
  }
})

const addStyle = (isActive) => StyleSheet.create({
  addView: {
    backgroundColor: isActive ? color3777EE : colorF0F0F0,
    borderRadius: 12,
    height: 48,
    minWidth: 117,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  txtAdd: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 24,
    marginRight: 24,
    color: isActive ? colorFFFFFF : colorBDBDBD
  }
})
