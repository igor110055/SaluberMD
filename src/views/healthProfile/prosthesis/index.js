import React, { useEffect, useState } from 'react'
import {
  StyleSheet, View, Text, TouchableOpacity,
  Image, FlatList, DeviceEventEmitter, StatusBar
} from 'react-native'
import {
  color040404,
  color363636,
  color3777EE,
  color5C5D5E,
  color828282,
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
import Header from '../components/Header'
import RadioButton from '../components/RadioButton'
import { useSelector, useDispatch } from 'react-redux'
import _, {cloneDeep} from 'lodash'
import NavigationService from '../../../navigation'
import Routes from '../../../navigation/Routes'
import { convertDMMMYYYY, getDate112000, convertDateDDMMYYYYToSever } from '../../../constants/DateHelpers'
import CustomDatePicker from '../../../components/CustomDatePicker'
import icHeader from '../../../../assets/images/header'
import icHealthProfile from '../../../../assets/images/health_profile'
import LoadingView from '../../../components/LoadingView'
import { apiHealthProfile } from '../../../api/Auth'
import { saveLSProsthesis } from '../../../actions/common'
import SearchListWithName from '../../../components/SearchListWithName'
import icDoc from '../../../../assets/images/document'
import imgHealth from '../../../../assets/images/health_profile'
import axios from 'axios'
import * as APIs from '../../../api/APIs'
import { apiPostProthesis } from 'api/MedicalRecord'
import Translate from 'translate'

export default function ProsthesisView() {
  const prosthesis = useSelector(state => state.user.prosthesis)
  const [isAnswer, setAnswer] = useState((dataPros?.datas || []).length > 0 ? true : false)
  const [isNew, setNew] = useState(false)
  const [prosthesi, setProsthesis] = useState('')
  const [since, setSince] = useState()
  const [note, setNote] = useState('')
  const [isEmergency, setEmergency] = useState(false)
  const [tempDatas, setTemp] = useState(prosthesis?.datas || [])
  const dispatch = useDispatch()
  const [reloadFlatlist, setReloadFlatlist] = useState(1)
  const datePickerRef = React.createRef()
  const lsProsthesisRedux = useSelector(state => state.common.prosthesis)
  const [lsProsthesis, setLSProsthesis] = useState(lsProsthesisRedux || [])
  const [isLoading, setLoading] = useState(false)
  const [other, setOther] = useState()
  const [isShowPros, setShowPros] = useState(false)
  const dataPros = useSelector(state => state.common.dataPros)
  const [list, setList] = useState()
  const [listDelete, setListDelete] = useState()
  const [listUpdate, setListUpdate] = useState()
  const token = useSelector(state => state.user.token)
  const languageRedux = useSelector(state => state.common.language)

  useEffect(() => {
    // if (isAnswer && tempDatas.length === 0) {
    //   setNew(true)
    // }
    setList(cloneDeep(dataPros?.datas))
    callAPIProsthesis()
  }, [])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.PROSTHESIS_SCREEN, params => {
      console.log('Call back data: ', params?.newData)
      console.log('dataDelete: ', params?.dataDelete)
      var dataTemp = params?.newData.filter((val) => val?.isNew === true)
      var dataUpdate = params?.newData.filter((val) => val?.isUpdate === true)
      setTemp(dataTemp)
      setList(params?.newData)
      setListDelete(params?.dataDelete)
      setListUpdate(dataUpdate)
      setReloadFlatlist(Math.random())
      if ((params || []).length === 0) {
        resetValueAdd()
        setTimeout(() => {
          setNew(true)
        }, 200)
      }
    })

    return () => subscription.remove()
  }, [])

  const callAPIProsthesis = () => {
    if (lsProsthesisRedux.length > 0) {return}
    setLoading(true)
    dispatch(apiHealthProfile()).then(res => {
      console.log('Res: ', res)
      const getPro = res?.payload?.protesi || []
      if (getPro.length > 0) {
        setLSProsthesis(getPro)
        Promise.all([
          dispatch(saveLSProsthesis(getPro))
        ])
      }
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }

  const renderQuestion = () => {
    if (!(_.isEmpty(tempDatas))) {
      return null
    }

    const _onPressRadio = (val) => {
      if (val) {
        setNew(true)
      } else {
        setNew(false)
        resetValueAdd()
      }
      setAnswer(val)
    }

    const borderBottom = {
      borderBottomLeftRadius: isNew === true ? 0 : 16,
      borderBottomRightRadius: isNew === true ? 0 : 16
    }

    return (
      <View style={[styles.questionView, borderBottom]}>
        <Text style={[
          customTxt(Fonts.SemiBold, 18, color363636).txt
        ]} >{Translate(languageRedux).PROS_TITLE}</Text>
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
          title={Translate(languageRedux).PROSTHESIS}
          value={prosthesi?.name}
          onChangeTxt={(txt) => setProsthesis(txt)}
          placeholder={Translate(languageRedux).PH_PROSTHESIS}
          textStyle={styles.txtStyle}
          onPress={() => setShowPros(true)}
          validate={prosthesi?.name ? false : true}
          iconRight={imgHealth.ic_dropdown}
        />
        {prosthesi?.id === 1 && <CustomTextInput
          title={Translate(languageRedux).other}
          value={other}
          onChangeTxt={(txt) => setOther(txt)}
          placeholder={Translate(languageRedux).PH_PROSTHESIS}
          textStyle={styles.txtStyle}
          validate={other ? false : true}
        />}
        <CustomTextInput
          title={Translate(languageRedux).since}
          value={since ? convertDMMMYYYY(since) : ''}
          onChangeTxt={() => {}}
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
    setProsthesis()
    setSince()
    setNote()
    setEmergency(false)
    setNew(false)
  }

  const _onPressAdd = () => {
    if (_.isEmpty(prosthesi)) {return}
    const params = {
      name: prosthesi?.name,
      id: prosthesi?.id,
      other: other,
      since,
      note,
      isEmergency,
      isNew: true
    }

    const newData = _.concat(tempDatas, params)
    setTemp(newData)
    const newDataFlatlist = _.concat(list, params)
    setList(newDataFlatlist)
    setTimeout(() => {
      resetValueAdd()
    }, 100)
  }

  const checkBTAdd = () => {
    if (_.isEmpty(prosthesi?.name) && prosthesi?.id !== 1) {
      return false
    }
    if (prosthesi?.id === 1 && _.isEmpty(other)) {
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

  const renderNewItem = () => {
    const borderTop = {
      borderTopLeftRadius: isNew === true && 0,
      borderTopRightRadius: isNew === true && 0
    }
    return (
      <View style={[
        styles.questionView,
        styles.marginT16,
        styles.paddingB48,
        borderTop]}>
        <Text style={[
          customTxt(Fonts.SemiBold, 18, color363636).txt
        ]}>{Translate(languageRedux).NEW_PROS}</Text>
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

    if (isAnswer && tempDatas.length === 0) {
      return
    }
    setLoading(true)
    _.forEach(tempDatas, function (value) {
      var param = {
        prosthesisId: value?.id || '',
        since: convertDateDDMMYYYYToSever(value?.since) || '',
        remarks: value?.note || '',
        other: value?.other || '',
        onEmergencyLogin: value?.isEmergency ? 1 : 0
      }
      console.log('params: ', param)
      setTimeout(() => {
        dispatch(apiPostProthesis(param)).then(res => {
          console.log('Res param', res)
          resetValueAdd()
        }).catch((err) => {
          console.log('Err: ', err)
        })
      }, 400)
    })
    _.forEach(listDelete, function (value) {
      axios({
        method: 'delete',
        url: `${APIs.hostAPI}backoffice/prothesis/${value?.id}`,
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
        prosthesisId: value?.id || '',
        since: convertDateDDMMYYYYToSever(value?.since) || '',
        remarks: value?.note || '',
        other: value?.other || '',
        onEmergencyLogin: value?.isEmergency ? 1 : 0
      }
      axios({
        method: 'put',
        url: `${APIs.hostAPI}backoffice/prothesis`,
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

  const renderList = () => {
    // if (_.isEmpty(tempDatas)) {
    //   return null
    // }

    const renderFlatlist = () => {

      const RenderItem = ({ item, index }) => {

        const _onPressItem = () => {
          NavigationService.navigate(Routes.DETAIL_PROSTHESIS_SCREEN, {
            data: item,
            index: index,
            lsData: list,
            lsDelete: listDelete
          })
        }

        return (
          <TouchableOpacity
            onPress={_onPressItem}
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
                  customTxt(Fonts.Regular, 12, color5C5D5E).txt
                ]}
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
            <RenderItem
              item={item}
              index={index}
            />
          }
        />
      )
    }
    const borderBottom2 = {
      borderBottomLeftRadius: !isNew ? 16 : 0,
      borderBottomRightRadius: !isNew ? 16 : 0
    }
    return (
      <View style={styles.lsAllerigeView}>
        <View style={[styles.questionView, borderBottom2]}>
          <Text style={[
            customTxt(Fonts.SemiBold, 16, color363636).txt
          ]}>{Translate(languageRedux).PROS_TITLE}</Text>
          <Text style={[
            customTxt(Fonts.Regular, 16, color5C5D5E).txt,
            styles.marginT8
          ]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.</Text>
          <View style={styles.txtStyle}>
            {renderFlatlist()}
          </View>
        {
          !isNew && (
            <TouchableOpacity
            style={[
              styles.addAllerigeBT
            ]}
            onPress={() => setNew(true)}
          >
            <Text style={[
              styles.txtAddAllerige,
              customTxt(Fonts.SemiBold, 18, color3777EE).txt
            ]}>{Translate(languageRedux).ADD_NEW_PROS}</Text>
          </TouchableOpacity>
          )
        }
        </View>
      </View>
    )
  }

  const _onChangeDatePicker = (date) => {
    setSince(date)
  }

  const checkBTSubmit = () => {
    if (isAnswer === null) {
      return true
    }
    if (isAnswer && (tempDatas || []).length === 0) {
      return true
    }
    return false
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white"/>
      <Header
        backgroundColor={colorFFFFFF}
        title={Translate(languageRedux).PROS_TITLE}
        source={icHeader.ic_left}
        dispatch={checkBTSubmit()}
        buttonText={Translate(languageRedux).SUBMIT}
        backgroundColorButton={!checkBTSubmit() ? color3777EE : colorF0F0F0}
        textButtonColor={!checkBTSubmit() ? colorFFFFFF : colorC1C3C5}
        onPressSubmit={_onPressRight}
      />
      <KeyboardAwareScrollView style={styles.shadow}>
        {(dataPros?.datas || []).length === 0 && isShowPros === false && isLoading === false && renderQuestion()}
        {((dataPros?.datas || []).length > 0 || (tempDatas || []).length > 0) && isShowPros === false && isLoading === false && renderList()}
        {isNew && isShowPros === false && isLoading === false && renderNewItem()}
      </KeyboardAwareScrollView>
      <CustomDatePicker
        refDatePicker={datePickerRef}
        onChangeDate={_onChangeDatePicker}
        maxDate={new Date()}
        date={since || getDate112000()}
      />
      {
        isShowPros && (
          <SearchListWithName
            listData={lsProsthesis}
            title={Translate(languageRedux).CHOOSE_PROSTHESIS}
            itemSelected={prosthesi}
            onItemClick={(val) => {
              setProsthesis(val)
              setShowPros(false)
            }}
            onPressRight={() => {
              setShowPros(false)
            }}
            lsHiden={tempDatas}
          />
        )
      }
      {isLoading && <LoadingView />}
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
