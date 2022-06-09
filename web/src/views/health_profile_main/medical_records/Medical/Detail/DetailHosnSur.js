import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, DeviceEventEmitter, TouchableOpacity, Image } from 'react-native'
import { useSelector } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../../../api/APIs'
import moment from 'moment'
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import RNPrint from 'react-native-print'
import Share from 'react-native-share'

import { colorF0F0F0, colorFFFFFF, colorA7A8A9, color040404, color3777EE } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from '../../../../../translate'
import NavigationService from 'navigation'
import {convertDMMMYYYY, getDate112000} from '../../../../../constants/DateHelpers'

import icHeader from '../../../../../../assets/images/header'
import icHealthProfile from '../../../../../../assets/images/health_profile'
import icDoc from '../../../../../../assets/images/document'

import Header from '../../../../../components/Header'
import FunctionButton from '../../PersonalInfo/FunctionButton'
import CustomTextInput from '../../../../healthProfile/components/CustomTextInput'
import SearchListWithName from '../../../../../components/SearchListWithName'
import LoadingView from 'components/LoadingView'
import CustomDatePicker from 'components/CustomDatePicker'

export default function DetailHosnSur({ route }) {

  const passingData = route?.params?.data
  const languageRedux = useSelector(state => state.common.language)
  const lsCountryRedux = useSelector(state => state.common.country)
  const lsHospitalRedux = useSelector(state => state.common.hospitalization)
  const lsSubSurgeryRedux = useSelector(state => state.common.subsurgery)
  const lsSurgeryRedux = useSelector(state => state.common.surgery)
  const [isShow, setShow] = useState(false)
  const [edit, setEdit] = useState(false)
  const token = useSelector(state => state.user.token)
  const [revoke, setRevoke] = useState(false)
  const datePickerRef = React.createRef()
  const [isLoad, setLoading] = useState(true)
  const [detail, setDetail] = useState([])
  const [emergencyUpdate, setEmergencyUpdate] = useState(detail?.onEmergencyLogin || null)
  const [subSurName, setSubSurName] = useState('')
  const [surCate, setSurCate] = useState('')
  const [countryName, setCountryName] = useState('')
  const [hosName, setHosName] = useState('')
  const [isShowType, setShowType] = useState(false)
  const [hosID, setHosID] = useState()
  const [typeID, setTypeID] = useState()
  const [isShowHospital, setShowHospital] = useState(false)
  const [isShowSurCate, setShowSurCate] = useState(false)
  const [isShowSubSur, setShowSubSur] = useState(false)
  const [isShowCountry, setShowCountry] = useState(false)
  const lsType = [
    { 'name': 'Surgery', 'id' : 0 },
    { 'name': 'Hospitalization', 'id' : 1 }
  ]

  useEffect(() => {
    revoke && deleteHosnSur()
    // checkEmergency()
  },[revoke, isLoad])

  useEffect(() => {
    callAPIGetDetail()
    convertSubSurgery()
    convertCountry()
    converHospitalization()
    setHosID(detail?.hospitalizationId)
    setTypeID(detail?.type)
  },[isLoad])

  const callAPIGetDetail = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/hospitalization/${passingData?.itemID}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        console.log('dataDetail: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data || []
          setDetail(getList)
        }
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        console.log(error)
      })
  }

  const deleteHosnSur = () => {
    axios({
      method: 'delete',
      url: `${APIs.hostAPI}backoffice/hospitalization/${passingData?.itemID}`,
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
  }

  const [type, setType] = useState('')
  const [hospitalization, setHospitalization] = useState(passingData?.name || '')
  const [surgeryCategory, setSurgeryCategory] = useState(passingData?.surgeryCategory || '')
  const [surgery, setSurgery] = useState(passingData?.name || '')
  const [country, setCountry] = useState(passingData?.country || '')
  const [since, setSince] = useState(passingData?.since || '')
  const [note, setNote] = useState(passingData?.note || '')
  const [isEmergency, setEmergency] = useState(isEmergency || false)
  const [other, setOther] = useState(passingData?.other || '')
  const [otherAccident, setOtherAccident] = useState(passingData?.other || '')
  const [otherCancer, setOtherCancer] = useState(passingData?.other || '')

  const renderEdit = () => {
    return (
      <View style={styles.ctnItem}>
        <CustomTextInput
          title={Translate(languageRedux).type}
          value={type?.name || convetType() || ''}
          onChangeTxt={(txt) => setType(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icHealthProfile.ic_dropdown}
          onPress={() => {
            setShowType(true)
            setTypeID(type?.id || typeID)
        }}
        />
        {((typeID === 1 || type?.id === 1) && type?.id !== 0) && <CustomTextInput
          title={Translate(languageRedux).hospitalization}
          value={hospitalization?.name || hospitalization || ''}
          onChangeTxt={(txt) => setHospitalization(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icHealthProfile.ic_dropdown}
          onPress={() => {
            setShowHospital(true)
            setHosID(hospitalization?.id)
          }}
          validate={hospitalization ? false : true}
        />}
        {((hosID === 1 || hospitalization?.id === '1') && type?.id !== 0) && <CustomTextInput
          title={Translate(languageRedux).other}
          value={other || detail?.other || ''}
          onChangeTxt={(txt) => setOther(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          validate={(other || detail?.other ? false : true)}
          onPress={() => {}}
        />}
        {((hosID === 47 || hospitalization?.id === '47') && type?.id !== 0) && <CustomTextInput
          title={Translate(languageRedux).OTHER_ACCIDENT}
          value={otherAccident || detail?.other || ''}
          onChangeTxt={(txt) => setOtherAccident(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          validate={(otherAccident || detail?.other ? false : true)}
          onPress={() => {}}
        />}
        {((hosID === 48 || hospitalization?.id === '48') && type?.id !== 0) && <CustomTextInput
          title={Translate(languageRedux).OTHER_CANCER_TREATMENT}
          value={otherCancer || detail?.other || ''}
          onChangeTxt={(txt) => setOtherCancer(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          validate={(otherCancer || detail?.other ? false : true)}
          onPress={() => {}}
        />}
        {((typeID === 0 || type?.id === 0) && type?.id !== 1) && <CustomTextInput
          title={Translate(languageRedux).surgeryCategory}
          value={surgeryCategory?.name || surgeryCategory || ''}
          onChangeTxt={(txt) => setSurgeryCategory(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icHealthProfile.ic_dropdown}
          onPress={() => {setShowSurCate(true)}}
          validate={surgeryCategory ? false : true}
        />}
        {((typeID === 0 || type?.id === 0) && type?.id !== 1) && <CustomTextInput
          title={Translate(languageRedux).surgery}
          value={surgery?.name || surgery || ''}
          onChangeTxt={(txt) => setSurgery(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icHealthProfile.ic_dropdown}
          onPress={() => {setShowSubSur(true)}}
          validate={surgery ? false : true}
        />}
        <CustomTextInput
          title={Translate(languageRedux).date}
          value={since ? convertDMMMYYYY(since) : ''}
          onChangeTxt={(txt) => setSince(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icDoc.ic_choose_date}
          onPress={() => {datePickerRef.current.onPressDate()}}
          placeholder={Translate(languageRedux).SELECT_A_DATE}
        />
        <CustomTextInput
          title={Translate(languageRedux).COUNTRY}
          value={country?.text || country || ''}
          onChangeTxt={(txt) => setCountry(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icHealthProfile.ic_dropdown}
          onPress={() => {setShowCountry(true)}}
        />
        <CustomTextInput
          title={Translate(languageRedux).note}
          value={note || ''}
          onChangeTxt={(txt) => setNote(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
        <View>{renderShowEmergency()}</View>
      </View>
    )
  }

  const renderShowEmergency = () => {
    return (
      <View style={styles.emergencyView}>
        <TouchableOpacity onPress={() => {
          if (isEmergency === true) {
            setEmergency(false)
            setEmergencyUpdate(1)
          }
          if (isEmergency === false) {
            setEmergency(true)
            setEmergencyUpdate(0)
          }
        }}>
          <Image
            style={styles.imgEmergency}
            source={
              isEmergency
                ? icHealthProfile.ic_checkbox
                : icHealthProfile.ic_emptybox
            }
          />
        </TouchableOpacity>
        <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
          {Translate(languageRedux).Emergency}
        </Text>
      </View>
    )
  }

  const RenderItem = ({category, content}) => {
    return (
      <View style={styles.ctnItem}>
        <Text style={customTxt(Fonts.SemiBold, 12, colorA7A8A9).txt}>
          {category}
        </Text>
        <Text
          style={[
            customTxt(Fonts.Regular, 16, color040404).txt,
            styles.marginT8
          ]}>
          {content}
        </Text>
        <View style={styles.divider} />
      </View>
    )
  }

  const convetType = () => {
    if (detail?.type === 1) {
      return Translate(languageRedux).hospitalization
    }
    if (detail?.type === 0) {
        return Translate(languageRedux).surgery
      }
  }

  const convertSubSurgery = () => {
    const id = detail?.surgerySubCategoryId ? detail?.surgerySubCategoryId.toString() : null
    var j = lsSubSurgeryRedux.filter(val => val?.id === id)
    if (j.length > 0) {
      setSubSurName(j[0].name || '')
      var idOpt = j[0].idOpt
    }
    var surgeryCate = lsSurgeryRedux.filter((val) => val.id === idOpt)
    if (surgeryCate.length > 0) {
      setSurCate(surgeryCate[0].name || '')
    }
  }

  const converHospitalization = () => {
    const id = detail?.hospitalizationId ? detail?.hospitalizationId.toString() : null
    var j = lsHospitalRedux.filter(
      val => val?.id === id,
    )
    if (j.length > 0) {
      setHosName(j[0].name || '')
    }
  }

  const convertCountry = () => {
    const value = detail?.country ? detail?.country : null
    var cn = lsCountryRedux.filter((val) => val.value === value || '')
    if (cn.length > 0) {
      setCountryName(cn[0].text || '')
    }
  }

  const renderBody = () => {
    return (
      <View>
        <RenderItem
          category={Translate(languageRedux).type}
          content={convetType()}
        />
        {(typeID === 1 || type?.id === 1) && <RenderItem
          category={Translate(languageRedux).hospitalization}
          content={hosName}
        />}
        {(typeID === 0 || type?.id === 0) && <RenderItem
          category={Translate(languageRedux).surgeryCategory}
          content={surCate}
        />}
        {(typeID === 0 || type?.id === 0) && <RenderItem
          category={Translate(languageRedux).surgery}
          content={subSurName}
        />}
        {detail?.hospitalizationId === 1 && <RenderItem
          category={Translate(languageRedux).other}
          content={detail?.other}
        />}
        {detail?.hospitalizationId === 47 && <RenderItem
          category={Translate(languageRedux).OTHER_ACCIDENT}
          content={detail?.other}
        />}
        {detail?.hospitalizationId === 48 && <RenderItem
          category={Translate(languageRedux).OTHER_CANCER_TREATMENT}
          content={detail?.other}
        />}
        <RenderItem
          category={Translate(languageRedux).date}
          content={detail?.hospDate ? convertDMMMYYYY(detail?.hospDate) : ''}
        />
        <RenderItem
          category={Translate(languageRedux).COUNTRY}
          content={countryName}
        />
        <RenderItem
          category={Translate(languageRedux).note}
          content={detail?.remarks}
        />
      </View>
    )
  }

  const htmlSurgery = `
  <h2>${Translate(languageRedux).type}</h2>
  <h1>${convetType()}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).surgeryCategory}</h2>
  <h1>${surCate}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).surgery}</h2>
  <h1>${subSurName}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).since}</h2>
  <h1>${detail?.hospDate ? convertDMMMYYYY(detail?.hospDate) : ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).COUNTRY}</h2>
  <h1>${countryName || ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).note}</h2>
  <h1>${detail?.remarks || ''}</h1>
  <hr class="solid">
  `
  const htmlHos = `
  <h2>${Translate(languageRedux).type}</h2>
  <h1>${convetType()}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).hospitalization}</h2>
  <h1>${hosName}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).since}</h2>
  <h1>${detail?.hospDate ? convertDMMMYYYY(detail?.hospDate) : ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).COUNTRY}</h2>
  <h1>${countryName || ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).note}</h2>
  <h1>${detail?.remarks || ''}</h1>
  <hr class="solid">
  `
  const htmlOther = `
  <h2>${Translate(languageRedux).type}</h2>
  <h1>${convetType()}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).hospitalization}</h2>
  <h1>${hosName}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).other}</h2>
  <h1>${detail?.other}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).since}</h2>
  <h1>${detail?.hospDate ? convertDMMMYYYY(detail?.hospDate) : ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).COUNTRY}</h2>
  <h1>${countryName || ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).note}</h2>
  <h1>${detail?.remarks || ''}</h1>
  <hr class="solid">
  `
  const htmlOtherCancer = `
  <h2>${Translate(languageRedux).type}</h2>
  <h1>${convetType()}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).hospitalization}</h2>
  <h1>${hosName}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).OTHER_CANCER_TREATMENT}</h2>
  <h1>${detail?.other || ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).since}</h2>
  <h1>${detail?.hospDate ? convertDMMMYYYY(detail?.hospDate) : ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).COUNTRY}</h2>
  <h1>${countryName || ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).note}</h2>
  <h1>${detail?.remarks || ''}</h1>
  <hr class="solid">
  `
  const htmlOtherAccident = `
  <h2>${Translate(languageRedux).type}</h2>
  <h1>${convetType()}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).hospitalization}</h2>
  <h1>${hosName}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).OTHER_ACCIDENT}</h2>
  <h1>${detail?.other || ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).since}</h2>
  <h1>${detail?.hospDate ? convertDMMMYYYY(detail?.hospDate) : ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).COUNTRY}</h2>
  <h1>${countryName || ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).note}</h2>
  <h1>${detail?.remarks || ''}</h1>
  <hr class="solid">
  `

  const _onPressPrintSur = async () => {
    const results = await RNHTMLtoPDF.convert({
      html: htmlSurgery,
      fileName: Translate(languageRedux).surgeryCategory,
      base64: true
    })
    await RNPrint.print({filePath: results.filePath})
  }

  const _onPressPrintHos = async () => {
    const results = await RNHTMLtoPDF.convert({
      html: htmlHos,
      fileName: Translate(languageRedux).hospitalization,
      base64: true
    })
    await RNPrint.print({filePath: results.filePath})
  }

  const _onPressPrintOther = async () => {
    const results = await RNHTMLtoPDF.convert({
      html: htmlOther,
      fileName: Translate(languageRedux).hospitalization,
      base64: true
    })
    await RNPrint.print({filePath: results.filePath})
  }

  const _onPressPrintOtherCancer = async () => {
    const results = await RNHTMLtoPDF.convert({
      html: htmlOtherCancer,
      fileName: Translate(languageRedux).hospitalization,
      base64: true
    })
    await RNPrint.print({filePath: results.filePath})
  }

  const _onPressPrintOtherAccident = async () => {
    const results = await RNHTMLtoPDF.convert({
      html: htmlOtherAccident,
      fileName: Translate(languageRedux).hospitalization,
      base64: true
    })
    await RNPrint.print({filePath: results.filePath})
  }

  const _onPressShare = async () => {
    const checkShare = () => {
      if ((typeID === 1 || type?.id === 1) && detail?.hospitalizationId !== 1
      && detail?.hospitalizationId !== 47 && detail?.hospitalizationId !== 48) {
        return results2.base64
      }
      if ((typeID === 1 || type?.id === 1) && detail?.hospitalizationId === 1) {
        return resultsOther.base64
      }
      if ((typeID === 1 || type?.id === 1) && detail?.hospitalizationId === 47) {
        return resultsOtherAccident.base64
      }
      if ((typeID === 1 || type?.id === 1) && detail?.hospitalizationId === 48) {
        return resultsOtherCancer.base64
      }
      else {
        return results.base64
      }
    }
    const results = await RNHTMLtoPDF.convert({
      html: htmlSurgery,
      fileName: Translate(languageRedux).surgeryCategory,
      base64: true
    })
    const results2 = await RNHTMLtoPDF.convert({
      html: htmlHos,
      fileName: Translate(languageRedux).hospitalization,
      base64: true
    })
    const resultsOther = await RNHTMLtoPDF.convert({
      html: htmlOther,
      fileName: Translate(languageRedux).hospitalization,
      base64: true
    })
    const resultsOtherCancer = await RNHTMLtoPDF.convert({
      html: htmlOtherCancer,
      fileName: Translate(languageRedux).hospitalization,
      base64: true
    })
    const resultsOtherAccident = await RNHTMLtoPDF.convert({
      html: htmlOtherAccident,
      fileName: Translate(languageRedux).hospitalization,
      base64: true
    })
    let options = {
      url: `data:application/pdf;base64,${checkShare()}`,
      fileName: (typeID === 1 || type?.id === 1) ? Translate(languageRedux).hospitalization : Translate(languageRedux).surgeryCategory
    }
    Share.open(options)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        err && console.log(err)
      })
  }

  const _onChangeDatePicker = date => {
    setSince(date)
  }

  const _onPressDeleteHosnSur = () => {
    setRevoke(true)
    DeviceEventEmitter.emit('update')
    NavigationService.goBack()
  }

  const dateLocal = moment(since).local().format('YYYY-MM-DD')
  const UTCDate = moment(dateLocal).utc().valueOf()
  const checkTypeUpdate = () => {
    if (type?.name === Translate(languageRedux).hospitalization) {
      return 1
    }
    if (type?.name === Translate(languageRedux).surgery) {
      return 0
    }
    if (detail?.type === 1) {
      return 1
    }
    if (detail?.type === 0) {
      return 0
    }
  }

  const _onPressUpdateDetail = () => {
    const body = {
      id: passingData?.itemID,
      hospitalizationId: hospitalization?.id || detail?.hospitalizationId,
      surgerySubCategoryId: surgery?.id || detail?.surgerySubCategoryId,
      type: checkTypeUpdate(),
      hospDate: UTCDate || detail?.hospDate,
      country: country?.value || detail?.country,
      hospital: detail?.hospital,
      remarks: note,
      onEmergencyLogin: emergencyUpdate,
      other: other
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
    DeviceEventEmitter.emit('update')
  }

  const closeButton = () => {
    if (detail?.type === 0) {
      setEdit(false)
      setType(passingData?.type || '')
      setSurgeryCategory(passingData?.surgeryCategory || '')
      setSurgery(passingData?.name || '')
      setSince(passingData?.since || '')
      setCountry(passingData?.country || '')
      setNote(passingData?.note || '')
      setEmergency(passingData?.onEmergencyLogin || false)
    }
    if (detail?.type === 1) {
      setEdit(false)
      setType(passingData?.type || '')
      setHospitalization(passingData?.name || '')
      setSince(passingData?.since || '')
      setCountry(passingData?.country || '')
      setNote(passingData?.note || '')
      setEmergency(passingData?.onEmergencyLogin || false)
      setOther(passingData?.other || '')
      setOtherAccident(passingData?.other || '')
      setOtherCancer(passingData?.other || '')
    }
  }

  const checkListSurgery = () => {
    var i = lsSubSurgeryRedux.filter(
      val => val.idOpt === surgeryCategory?.id
    )
    return i
  }

  const checkPrint = () => {
    if ((typeID === 1 || type?.id === 1) && detail?.hospitalizationId !== 1
    && detail?.hospitalizationId !== 47 && detail?.hospitalizationId !== 48) {
      return _onPressPrintHos
    }
    if ((typeID === 1 || type?.id === 1) && detail?.hospitalizationId === 1) {
      return _onPressPrintOther
    }
    if ((typeID === 1 || type?.id === 1) && detail?.hospitalizationId === 47) {
      return _onPressPrintOtherAccident
    }
    if ((typeID === 1 || type?.id === 1) && detail?.hospitalizationId === 48) {
      return _onPressPrintOtherCancer
    }
    else {
      return _onPressPrintSur
    }
  }

  return (
    <View style={styles.container}>
      <Header
          backgroundColor={colorFFFFFF}
          textCenter={
            edit
              ? Translate(languageRedux).EDIT_HOSPITALIZATION_SURGICAL
              : Translate(languageRedux).HOSPITALIZATION_SURGICAL
          }
          iconLeft={edit ? icHeader.ic_close : icHeader.ic_left}
          iconRight={edit === false && icHeader.ic_function}
          textRight={edit === true && Translate(languageRedux).btnsave}
          textRightColor={color3777EE}
          onPressLeft={() => {
            edit ? closeButton() : NavigationService.goBack()
          }}
          onPressRight={() => {
            edit === true && _onPressUpdateDetail()
            edit === true && setLoading(true)
            edit === true && setEdit(false)
            edit === false && setShow(true)
          }}
      />
      <ScrollView style={styles.marginT20}>
        {edit ? renderEdit() : renderBody()}
      </ScrollView>
      <CustomDatePicker
          refDatePicker={datePickerRef}
          onChangeDate={_onChangeDatePicker}
          maxDate={new Date()}
          date={getDate112000()}
      />
      {isShow && (
          <View style={styles.floatView}>
            <FunctionButton
              onPressCancel={() => {
                setShow(false)
              }}
              onPressEdit={() => {
                setEdit(true)
                isShow === true && setShow(false)
              }}
              onPressDelete={_onPressDeleteHosnSur}
              onPressPrint={checkPrint()}
              onPressShare={_onPressShare}
            />
          </View>
      )}
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
      {isShowHospital && (
          <SearchListWithName
            listData={lsHospitalRedux}
            title={Translate(languageRedux).CHOOSE_HOSPITALIZATION}
            itemSelected={hospitalization}
            onItemClick={val => {
              setHospitalization(val)
              setShowHospital(false)
            }}
            onPressRight={() => {
              setShowHospital(false)
            }}
          />
      )}
      {isShowSurCate && (
          <SearchListWithName
            listData={lsSurgeryRedux}
            title={Translate(languageRedux).CHOOSE_SURGERY_CATEGORY}
            itemSelected={surgeryCategory}
            onItemClick={val => {
              setSurgeryCategory(val)
              setShowSurCate(false)
            }}
            onPressRight={() => {
              setShowSurCate(false)
            }}
          />
      )}
      {isShowSubSur && (
          <SearchListWithName
            listData={checkListSurgery()}
            title={Translate(languageRedux).CHOOSE_SURGERY}
            itemSelected={surgery}
            onItemClick={val => {
              setSurgery(val)
              setShowSubSur(false)
            }}
            onPressRight={() => {
              setShowSubSur(false)
            }}
          />
      )}
      {isShowCountry && (
          <SearchListWithName
            listData={lsCountryRedux}
            title={Translate(languageRedux).CHOOSE_COUNTRY}
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
      {isLoad && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  marginT20: {
    marginTop: 20
  },
  ctnItem: {
    marginHorizontal: 20,
    marginBottom: 16
  },
  marginT8: {
    marginTop: 8,
    marginBottom: 16
  },
  divider: {
    height: 1,
    backgroundColor: colorF0F0F0
  },
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
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
  }
})
