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
import { apiHealthProfile } from '../../../api/Auth'
import LoadingView from '../../../components/LoadingView'
import { saveLSHospitalization, saveLSSurgery } from '../../../actions/common'
import SearchListWithName from '../../../components/SearchListWithName'
import Translate from '../../../translate'
import icDoc from '../../../../assets/images/document'
import imgHealth from '../../../../assets/images/health_profile'
import axios from 'axios'
import * as APIs from '../../../api/APIs'
import { apiPostHospitalization } from 'api/MedicalRecord'

export default function HospitalizationsView() {
  const hospitalization = useSelector(state => state.user.hospitalization)
  const [isAnswer, setAnswer] = useState((dataHosSur?.datas || []).length > 0 ? true : false)
  const [isNew, setNew] = useState(false)
  const [type, setType] = useState('')
  const [hospital, setHospitalization] = useState('')
  const getCountries = useSelector(state => state.common.country)
  const [country, setCountry] = useState('')
  const [since, setSince] = useState()
  const [note, setNote] = useState('')
  const [isEmergency, setEmergency] = useState(false)
  const [tempDatas, setTemp] = useState(hospitalization?.datas || [])
  const dispatch = useDispatch()
  const [reloadFlatlist, setReloadFlatlist] = useState(1)
  const datePickerRef = React.createRef()
  const [surgeryCategory, setSurgeryCategory] = useState()
  const [surgery, setSurgery] = useState()
  const lsSurgeryRedux = useSelector(state => state.common.surgery)
  const [lsSurgery, setLSSurgery] = useState(lsSurgeryRedux || [])
  const lsHospitalRedux = useSelector(state => state.common.hospitalization)
  const [lsHospital, setLSHospital] = useState(lsHospitalRedux || [])
  const lsSubSurgeryRedux = useSelector(state => state.common.subsurgery)
  const [isLoading, setLoading] = useState(false)
  const [other, setOther] = useState()
  const [otherAccident, setOtherAccident] = useState()
  const [otherCancer, setOtherCancer] = useState()
  const [isShowType, setShowType] = useState(false)
  const [isShowSurgeryCate, setShowSurgeryCate] = useState(false)
  const [isShowSurgery, setShowSurgery] = useState(false)
  const [isShowHospital, setShowHospital] = useState(false)
  const dataHosSur = useSelector(state => state.common.dataHosSur)
  const [list, setList] = useState()
  const [listDelete, setListDelete] = useState()
  const [listUpdate, setListUpdate] = useState()
  const token = useSelector(state => state.user.token)
  const lsType = [
    { 'name': Translate(languageRedux).surgery, 'id': 0 },
    { 'name': Translate(languageRedux).ricovero, 'id': 1 }
  ]
  const [isShowCountry, setShowCountry] = useState(false)
  const languageRedux = useSelector(state => state.common.language)

  useEffect(() => {
    // if (isAnswer && tempDatas.length === 0) {
    //   setNew(true)
    // }
    setList(cloneDeep(dataHosSur?.datas))
    callAPISurgery()
    callAPIHospital()
  }, [])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.HOSPITALIZATION_SCREEN, params => {
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

  const callAPISurgery = () => {
    if (lsSurgeryRedux.length > 0) { return }
    setLoading(true)
    dispatch(apiHealthProfile()).then(res => {
      console.log('Res: ', res)
      const getSurgery = res?.payload?.interventi || []
      if (getSurgery.length > 0) {
        setLSSurgery(getSurgery)
        Promise.all([
          dispatch(saveLSSurgery(getSurgery))
        ])
      }
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }

  const callAPIHospital = () => {
    if (lsHospitalRedux.length > 0) { return }
    setLoading(true)
    dispatch(apiHealthProfile()).then(res => {
      console.log('Res: ', res)
      const getHos = res?.payload?.ospedalizzazioni || []
      if (getHos.length > 0) {
        setLSHospital(getHos)
        Promise.all([
          dispatch(saveLSHospitalization(getHos))
        ])
      }
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }

  // list Sub Surgery
  var lsGeneral = lsSubSurgeryRedux.filter((val) => val?.idOpt === '1')
  var lsGAI = lsSubSurgeryRedux.filter((val) => val?.idOpt === '2')
  var lsBreast = lsSubSurgeryRedux.filter((val) => val?.idOpt === '3')
  var lsHeart = lsSubSurgeryRedux.filter((val) => val?.idOpt === '4')
  var lsVascular = lsSubSurgeryRedux.filter((val) => val?.idOpt === '5')
  var lsChest = lsSubSurgeryRedux.filter((val) => val?.idOpt === '6')
  var lsOrtopedic = lsSubSurgeryRedux.filter((val) => val?.idOpt === '7')
  var lsOAG = lsSubSurgeryRedux.filter((val) => val?.idOpt === '8')
  var lsUrological = lsSubSurgeryRedux.filter((val) => val?.idOpt === '9')
  var lsNeuro = lsSubSurgeryRedux.filter((val) => val?.idOpt === '10')
  var lsOthorr = lsSubSurgeryRedux.filter((val) => val?.idOpt === '11')
  var lsEye = lsSubSurgeryRedux.filter((val) => val?.idOpt === '12')
  var lsDental = lsSubSurgeryRedux.filter((val) => val?.idOpt === '13')

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
        ]}>{Translate(languageRedux).QUESTION_HOSPITAL_HPW}</Text>
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
          title={Translate(languageRedux).type}
          value={type?.name}
          onChangeTxt={() => { }}
          placeholder={Translate(languageRedux).SELECT_HOS_OR_SUR}
          textStyle={styles.txtStyle}
          onPress={() => setShowType(true)}
          validate={type?.name ? false : true}
          iconRight={imgHealth.ic_dropdown}
        />
        {
          type?.id === 0 &&
          (
            <>
              <CustomTextInput
                title={Translate(languageRedux).surgeryCategory}
                value={surgeryCategory?.name}
                onChangeTxt={(txt) => {
                  setSurgeryCategory(txt)
                }}
                placeholder={Translate(languageRedux).PH_GENERIC_NAME}
                textStyle={styles.txtStyle}
                onPress={() => setShowSurgeryCate(true)}
                validate={surgeryCategory?.name ? false : true}
                iconRight={imgHealth.ic_dropdown}
              />
              <CustomTextInput
                title={Translate(languageRedux).surgery}
                value={surgery?.name}
                onChangeTxt={(txt) => {
                  setSurgery(txt)
                }}
                placeholder={Translate(languageRedux).PH_GENERIC_NAME}
                textStyle={styles.txtStyle}
                onPress={() => setShowSurgery(true)}
                validate={surgery?.name ? false : true}
                iconRight={imgHealth.ic_dropdown}
              />
            </>
          )
        }
        {
          type?.id === 1 &&
          (
            <CustomTextInput
              title={Translate(languageRedux).ricovero}
              value={hospital?.name}
              onChangeTxt={(txt) => {
                setHospitalization(txt)
              }}
              placeholder={Translate(languageRedux).PH_GENERIC_NAME}
              textStyle={styles.txtStyle}
              onPress={() => setShowHospital(true)}
              validate={hospital?.name ? false : true}
              iconRight={imgHealth.ic_dropdown}
            />
          )
        }
        {hospital?.id === '1' && type?.id === 0 && <CustomTextInput
          title={Translate(languageRedux).other}
          value={other}
          onChangeTxt={(txt) => setOther(txt)}
          placeholder={Translate(languageRedux).PH_GENERIC_NAME}
          textStyle={styles.txtStyle}
          validate={other ? false : true}
        />}
        {hospital?.id === '47' && type?.id === 0 && <CustomTextInput
          title={Translate(languageRedux).OTHER_ACCIDENT}
          value={otherAccident}
          onChangeTxt={(txt) => setOtherAccident(txt)}
          placeholder={Translate(languageRedux).PH_GENERIC_NAME}
          textStyle={styles.txtStyle}
          validate={otherAccident ? false : true}
        />}
        {hospital?.id === '48' && type?.id === 0 && <CustomTextInput
          title={Translate(languageRedux).OTHER_CANCER_TREATMENT}
          value={otherCancer}
          onChangeTxt={(txt) => setOtherCancer(txt)}
          placeholder={Translate(languageRedux).PH_GENERIC_NAME}
          textStyle={styles.txtStyle}
          validate={otherCancer ? false : true}
        />}
        <CustomTextInput
          title={Translate(languageRedux).date}
          value={since ? convertDMMMYYYY(since) : ''}
          onChangeTxt={() => { }}
          placeholder={Translate(languageRedux).SELECT_A_DATE}
          textStyle={styles.txtStyle}
          onPress={() => datePickerRef.current.onPressDate()}
          validate={since ? false : true}
          iconRight={icDoc.ic_choose_date}
        />
        <CustomTextInput
          title={Translate(languageRedux).ricettario}
          value={country?.text || ''}
          onChangeTxt={(txt) => setCountry(txt)}
          placeholder={Translate(languageRedux).select_country}
          textStyle={styles.txtStyle}
          onPress={() => setShowCountry(true)}
          iconRight={imgHealth.ic_dropdown}
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
    setHospitalization()
    setType()
    setCountry()
    setSurgery()
    setSurgeryCategory()
    setSince()
    setNote()
    setEmergency(false)
    setNew(false)
  }

  const _onPressAdd = () => {
    const isCheck = (type?.id === 0 ? (surgery && surgeryCategory) : hospital) && type && since
    if (!isCheck) { return }
    const params = {
      name: type?.id === 0 ? surgery?.name : hospital?.name,
      id: type?.id === 0 ? surgery?.id : hospital?.id,
      other: other,
      otherAccident: otherAccident,
      otherCancer: otherCancer,
      type: type?.name,
      typeID: type?.id,
      country: country?.text,
      valueCountry: country?.value,
      surgeryCategory: surgeryCategory?.name,
      surgeryCategoryId: surgeryCategory?.id,
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

  const renderAddButton = () => {
    const checkButton = () => {
      if (hospital?.id === 1) {
        return type && since && hospital && other
      }
      if (hospital?.id === 47) {
        return type && since && hospital && otherAccident
      }
      if (hospital?.id === 48) {
        return type && since && hospital && otherCancer
      } else {
        return type && since && hospital
      }
    }
    const isCheck = type?.id === 0 ? surgery && surgeryCategory && type && since : null
    return (
      <View style={styles.addBT}>
        <TouchableOpacity
          style={addStyle(type?.id === 0 ? isCheck : checkButton()).addView}
          activeOpacity={(type?.id === 0 ? isCheck : checkButton()) ? 0 : 1}
          onPress={(_onPressAdd)}
        >
          <Text style={[
            customTxt(Fonts.SemiBold, 18, colorC1C3C5).txt,
            addStyle(type?.id === 0 ? isCheck : checkButton()).txtAdd
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
        ]} >{Translate(languageRedux).NEW_HOS_AND_SUR}</Text>
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
      const checkParam = () => {
        if (value?.typeID === 1) {
          var param = {
            hospitalizationId: value?.id || '',
            type: 1,
            hospDate: convertDateDDMMYYYYToSever(value?.since) || '',
            country: value?.valueCountry || '',
            remarks: value?.note || '',
            onEmergencyLogin: value?.isEmergency ? 1 : 0
          }
        }
        if (value?.typeID === 0) {
          var param = {
            select: value?.surgeryCategoryId,
            surgerySubCategoryId: value?.id,
            type: 0,
            hospDate: convertDateDDMMYYYYToSever(value?.since) || '',
            country: value?.valueCountry || '',
            remarks: value?.note || '',
            onEmergencyLogin: value?.isEmergency ? 1 : 0,
            other: value?.other || ''
          }
        }
        return param
      }
      console.log('params: ', checkParam())
      setTimeout(() => {
        dispatch(apiPostHospitalization(checkParam())).then(res => {
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
        url: `${APIs.hostAPI}backoffice/hospitalization/${value?.id}`,
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
        hospitalizationId: value?.hospitalizationId || '',
        surgerySubCategoryId: value?.surgerySubCategoryId || '',
        type: value?.typeID || '',
        hospDate: convertDateDDMMYYYYToSever(value?.since) || '',
        country: value?.valueCountry || '',
        hospital: value?.hospital || '',
        remarks: value?.note || '',
        other: value?.other || '',
        onEmergencyLogin: value?.isEmergency ? 1 : 0
      }
      axios({
        method: 'put',
        url: `${APIs.hostAPI}backoffice/hospitalization`,
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
          NavigationService.navigate(Routes.DETAIL_HOSPITALIZATION_SCREEN,
            {
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
              {item.id === 1 && <Text
                numberOfLines={1}
                style={[
                  styles.titleAlliergie,
                  customTxt(Fonts.SemiBold, 16, color040404).txt
                ]}
              >{item?.other}</Text>}
              {item.id === 47 && <Text
                numberOfLines={1}
                style={[
                  styles.titleAlliergie,
                  customTxt(Fonts.SemiBold, 16, color040404).txt
                ]}
              >{item?.name}</Text>}
              {item.id === 48 && <Text
                numberOfLines={1}
                style={[
                  styles.titleAlliergie,
                  customTxt(Fonts.SemiBold, 16, color040404).txt
                ]}
              >{item?.name}</Text>}
              {item.id !== 1 && item.id !== 47 && item.id !== 48 && <Text
                numberOfLines={1}
                style={[
                  styles.titleAlliergie,
                  customTxt(Fonts.SemiBold, 16, color040404).txt
                ]}
              >{item?.name}</Text>}
              <Text
                numberOfLines={1}
                style={[
                  customTxt(Fonts.Regular, 12, color5C5D5E).txt
                ]}
              >{Translate(languageRedux).date}{' '}{item?.since ? convertDMMMYYYY(item?.since) : ''}</Text>
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
          ]} >{Translate(languageRedux).HOSPITALIZATION_SURGICAL}</Text>
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
                ]}>{Translate(languageRedux).ADD_NEW_HOS}</Text>
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
      <StatusBar barStyle={'dark-content'} backgroundColor="white" />
      <Header
        backgroundColor={colorFFFFFF}
        title={Translate(languageRedux).HOSPITALIZATION_SURGICAL}
        source={icHeader.ic_left}
        disabled={checkBTSubmit()}
        buttonText={Translate(languageRedux).SUBMIT}
        backgroundColorButton={!checkBTSubmit() ? color3777EE : colorF0F0F0}
        textButtonColor={!checkBTSubmit() ? colorFFFFFF : colorC1C3C5}
        onPressSubmit={_onPressRight}
      />
      <KeyboardAwareScrollView style={styles.shadow}>
        {(dataHosSur?.datas || []).length === 0 &&
          isShowType === false &&
          isShowSurgeryCate === false &&
          isShowHospital === false &&
          isShowSurgery === false &&
          isShowCountry === false &&
          isLoading === false &&
          renderQuestion()}
        {((dataHosSur?.datas || []).length > 0 ||
          (tempDatas || []).length > 0) &&
          isShowType === false &&
          isShowSurgeryCate === false &&
          isShowHospital === false &&
          isShowSurgery === false &&
          isShowCountry === false &&
          isLoading === false &&
          renderList()}
        {isNew &&
          isShowType === false &&
          isShowSurgeryCate === false &&
          isShowHospital === false &&
          isShowSurgery === false &&
          isShowCountry === false &&
          isLoading === false &&
          renderNewItem()}
      </KeyboardAwareScrollView>
      <CustomDatePicker
        refDatePicker={datePickerRef}
        onChangeDate={_onChangeDatePicker}
        maxDate={new Date()}
        date={since || getDate112000()}
      />
      {isShowType && (
        <SearchListWithName
          listData={lsType}
          title={Translate(languageRedux).CHOOSE_TYPE}
          itemSelected={type}
          onItemClick={val => {
            setType(val)
            setShowType(false)
          }}
          onPressRight={() => {
            setShowType(false)
          }}
        />
      )}
      {isShowSurgeryCate && (
        <SearchListWithName
          listData={lsSurgery}
          title={Translate(languageRedux).CHOOSE_SURGERY_CATEGORY}
          itemSelected={surgeryCategory}
          onItemClick={val => {
            setSurgeryCategory(val)
            setShowSurgeryCate(false)
          }}
          onPressRight={() => {
            setShowSurgeryCate(false)
          }}
        />
      )}
      {isShowHospital && (
        <SearchListWithName
          listData={lsHospital}
          title={Translate(languageRedux).CHOOSE_HOSPITALIZATION}
          itemSelected={hospital}
          onItemClick={val => {
            setHospitalization(val)
            setShowHospital(false)
          }}
          onPressRight={() => {
            setShowHospital(false)
          }}
        />
      )}
      {surgeryCategory?.id === '1' && isShowSurgery === true && (
        <SearchListWithName
          listData={lsGeneral}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={val => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />
      )}
      {surgeryCategory?.id === '2' && isShowSurgery === true && (
        <SearchListWithName
          listData={lsGAI}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={val => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />
      )}
      {surgeryCategory?.id === '3' && isShowSurgery === true && (
        <SearchListWithName
          listData={lsBreast}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={val => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />
      )}
      {surgeryCategory?.id === '4' && isShowSurgery === true && (
        <SearchListWithName
          listData={lsHeart}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={val => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />
      )}
      {surgeryCategory?.id === '5' && isShowSurgery === true && (
        <SearchListWithName
          listData={lsVascular}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={val => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />
      )}
      {surgeryCategory?.id === '6' && isShowSurgery === true && (
        <SearchListWithName
          listData={lsChest}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={val => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />
      )}
      {surgeryCategory?.id === '7' && isShowSurgery === true && (
        <SearchListWithName
          listData={lsOrtopedic}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={val => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />
      )}
      {surgeryCategory?.id === '8' && isShowSurgery === true && (
        <SearchListWithName
          listData={lsOAG}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={val => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />
      )}
      {surgeryCategory?.id === '9' && isShowSurgery === true && (
        <SearchListWithName
          listData={lsUrological}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={val => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />
      )}
      {surgeryCategory?.id === '10' && isShowSurgery === true && (
        <SearchListWithName
          listData={lsNeuro}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={val => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />
      )}
      {surgeryCategory?.id === '11' && isShowSurgery === true && (
        <SearchListWithName
          listData={lsOthorr}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={val => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />
      )}
      {surgeryCategory?.id === '12' && isShowSurgery === true && (
        <SearchListWithName
          listData={lsEye}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={val => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />
      )}
      {surgeryCategory?.id === '13' && isShowSurgery === true && (
        <SearchListWithName
          listData={lsDental}
          title={Translate(languageRedux).CHOOSE_SURGERY}
          itemSelected={surgery}
          onItemClick={val => {
            setSurgery(val)
            setShowSurgery(false)
          }}
          onPressRight={() => {
            setShowSurgery(false)
          }}
        />
      )}
      {isShowCountry && (
        <SearchListWithName
          listData={getCountries}
          title={`${Translate(languageRedux).select} ${
            Translate(languageRedux).ricettario
          }`}
          itemSelected={country}
          onItemClick={val => {
            setCountry(val)
            setShowCountry(false)
          }}
          onPressRight={() => {
            setShowCountry(false)
          }}
          isText={true}
        />
      )}
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
