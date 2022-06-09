import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, DeviceEventEmitter, TouchableOpacity, Image } from 'react-native'
import { useSelector } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../../../api/APIs'
import moment from 'moment'
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import RNPrint from 'react-native-print'
import Share from 'react-native-share'
import _ from 'lodash'

import { colorF0F0F0, colorFFFFFF, colorA7A8A9, color040404, color3777EE } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from '../../../../../translate'
import NavigationService from 'navigation'
import {convertDMMMYYYY, getDate112000} from '../../../../../constants/DateHelpers'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'

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
  const lsHospitalRedux = useSelector(state => state.common.lsHospital)
  const lsSubSurgeryRedux = useSelector(state => state.common.lsSubSurgery)
  const lsSurgeryRedux = useSelector(state => state.common.lsSurgery)
  const [isShow, setShow] = useState(false)
  const [edit, setEdit] = useState(false)
  const token = useSelector(state => state.user.token)
  const [revoke, setRevoke] = useState(false)
  const datePickerRef = React.createRef()
  const [isLoad, setLoading] = useState(true)
  const [detail, setDetail] = useState([])
  const [isShowType, setShowType] = useState(false)
  const [hosID, setHosID] = useState()
  const [typeID, setTypeID] = useState()
  const [isShowHospital, setShowHospital] = useState(false)
  const [isShowSurCate, setShowSurCate] = useState(false)
  const [isShowSubSur, setShowSubSur] = useState(false)
  const [isShowCountry, setShowCountry] = useState(false)
  const [dataNoti, setDataNoti] = useState()
  const [isShowNoti, setShowNoti] = useState(false)
  const [reload, setReload] = useState(1)
  const lsType = [
    { 'name': 'Surgery', 'id' : 0 },
    { 'name': 'Hospitalization', 'id' : 1 }
  ]

  useEffect(() => {
    revoke && deleteHosnSur()
  },[revoke])

  useEffect(() => {
    callAPIGetDetail()
  },[reload])

  const callAPIGetDetail = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/hospitalization/${passingData?.id}`,
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
          setHosID(getList?.hospitalizationId)
          setTypeID(getList?.type)
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
      url: `${APIs.hostAPI}backoffice/hospitalization/${passingData?.id}`,
      headers: {
        'x-auth-token': token
      }
    })
      .then(response => {
        setLoading(false)
        setShowNoti(true)
        console.log('data: ', response.data)
        if (_.includes([0, '0'], response?.data?.esito)) {
          setDataNoti({
            status: STATUS_NOTIFY.SUCCESS,
            content: response?.data?.motivo
          })
        }
        if (_.includes([1, '1'], response?.data?.esito)) {
          setDataNoti({
            status: STATUS_NOTIFY.ERROR,
            content: response?.data?.motivo
          })
        }
        DeviceEventEmitter.emit('updateHos')
        setTimeout(() => {
          NavigationService.goBack()
        }, 1000)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
  }

  const checkEmergency = () => {
    if (detail?.onEmergencyLogin === 1) {
      setEmergency(true)
    }
    if (detail?.onEmergencyLogin === 0) {
      setEmergency(false)
    }
  }

  const [type, setType] = useState()
  const [hospitalization, setHospitalization] = useState()
  const [surgeryCategory, setSurgeryCategory] = useState()
  const [surgery, setSurgery] = useState()
  const [country, setCountry] = useState()
  const [since, setSince] = useState()
  const [note, setNote] = useState()
  const [isEmergency, setEmergency] = useState()
  const [other, setOther] = useState()
  const [otherAccident, setOtherAccident] = useState(passingData?.other || '')
  const [otherCancer, setOtherCancer] = useState(passingData?.other || '')

  useEffect(() => {
    convetType()
    setHospitalization(detail?.hospitalizationName || '')
    setSurgeryCategory(detail?.surgeryCategoryName || '')
    setSurgery(detail?.surgerySubCategoryName || '')
    setCountry(detail?.country || '')
    setSince(detail?.hospDate)
    setNote(detail?.remarks)
    setOther(detail?.other)
    checkEmergency()
  }, [detail])

  const renderEdit = () => {
    return (
      <View style={styles.ctnItem}>
        <CustomTextInput
          title={Translate(languageRedux).type}
          value={type || convetType() || ''}
          onChangeTxt={(txt) => setType(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icHealthProfile.ic_dropdown}
          onPress={() => {
            setShowType(true)
        }}
        />
        {(typeID === 1) && <CustomTextInput
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
        {(typeID === 0) && <CustomTextInput
          title={Translate(languageRedux).surgeryCategory}
          value={surgeryCategory?.name || surgeryCategory || ''}
          onChangeTxt={(txt) => setSurgeryCategory(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icHealthProfile.ic_dropdown}
          onPress={() => {setShowSurCate(true)}}
          validate={surgeryCategory ? false : true}
        />}
        {(typeID === 0) && <CustomTextInput
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
          value={country?.text || convertCountry() || ''}
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
          }
          if (isEmergency === false) {
            setEmergency(true)
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

  const convertCountry = () => {
    const value = detail?.country ? detail?.country : null
    var cn = lsCountryRedux.filter((val) => val.value === value || '')
    if (cn.length > 0) {
      return cn[0].text || ''
    } else {
      return ''
    }
  }

  const renderBody = () => {
    return (
      <View>
        <RenderItem
          category={Translate(languageRedux).type}
          content={convetType()}
        />
        {detail?.type === 1 && (
          <RenderItem
            category={Translate(languageRedux).hospitalization}
            content={detail?.hospitalizationName}
          />
        )}
        {detail?.type === 0 && (
          <RenderItem
            category={Translate(languageRedux).surgeryCategory}
            content={detail?.surgeryCategoryName}
          />
        )}
        {detail?.type === 0 && (
          <RenderItem
            category={Translate(languageRedux).surgery}
            content={detail?.surgerySubCategoryName}
          />
        )}
        {detail?.hospitalizationId === 1 && (
          <RenderItem
            category={Translate(languageRedux).other}
            content={detail?.other}
          />
        )}
        {detail?.hospitalizationId === 47 && (
          <RenderItem
            category={Translate(languageRedux).OTHER_ACCIDENT}
            content={detail?.other}
          />
        )}
        {detail?.hospitalizationId === 48 && (
          <RenderItem
            category={Translate(languageRedux).OTHER_CANCER_TREATMENT}
            content={detail?.other}
          />
        )}
        <RenderItem
          category={Translate(languageRedux).date}
          content={
            detail?.hospDate ? convertDMMMYYYY(detail?.hospDate) : ''
          }
        />
        <RenderItem
          category={Translate(languageRedux).COUNTRY}
          content={convertCountry()}
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
  <h1>${detail?.surgeryCategoryName}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).surgery}</h2>
  <h1>${detail?.surgerySubCategoryName}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).since}</h2>
  <h1>${detail?.hospDate ? convertDMMMYYYY(detail?.hospDate) : ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).COUNTRY}</h2>
  <h1>${convertCountry() || ''}</h1>
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
  <h1>${detail?.hospitalizationName}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).since}</h2>
  <h1>${detail?.hospDate ? convertDMMMYYYY(detail?.hospDate) : ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).COUNTRY}</h2>
  <h1>${convertCountry() || ''}</h1>
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
  <h1>${detail?.hospitalizationName}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).other}</h2>
  <h1>${detail?.other}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).since}</h2>
  <h1>${detail?.hospDate ? convertDMMMYYYY(detail?.hospDate) : ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).COUNTRY}</h2>
  <h1>${convertCountry() || ''}</h1>
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
  <h1>${detail?.hospitalizationName}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).OTHER_CANCER_TREATMENT}</h2>
  <h1>${detail?.other || ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).since}</h2>
  <h1>${detail?.hospDate ? convertDMMMYYYY(detail?.hospDate) : ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).COUNTRY}</h2>
  <h1>${convertCountry() || ''}</h1>
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
  <h1>${detail?.hospitalizationName}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).OTHER_ACCIDENT}</h2>
  <h1>${detail?.other || ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).since}</h2>
  <h1>${detail?.hospDate ? convertDMMMYYYY(detail?.hospDate) : ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).COUNTRY}</h2>
  <h1>${convertCountry() || ''}</h1>
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
      if ((detail?.type === 1) && detail?.hospitalizationId !== 1
      && detail?.hospitalizationId !== 47 && detail?.hospitalizationId !== 48) {
        return results2.base64
      }
      if ((detail?.type === 1) && detail?.hospitalizationId === 1) {
        return resultsOther.base64
      }
      if ((detail?.type === 1) && detail?.hospitalizationId === 47) {
        return resultsOtherAccident.base64
      }
      if ((detail?.type === 1) && detail?.hospitalizationId === 48) {
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
    setLoading(true)
  }

  const dateLocal = moment(since).local().format('YYYY-MM-DD')
  const UTCDate = moment(dateLocal).utc().valueOf()
  const checkTypeUpdate = () => {
    if (type === Translate(languageRedux).hospitalization) {
      return 1
    }
    if (type === Translate(languageRedux).surgery) {
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
      id: detail?.id,
      hospitalizationId: hospitalization?.id || detail?.hospitalizationId,
      surgerySubCategoryId: surgery?.id || detail?.surgerySubCategoryId,
      type: checkTypeUpdate(),
      hospDate: UTCDate || detail?.hospDate,
      country: country?.value || detail?.country,
      hospital: detail?.hospital,
      remarks: note,
      onEmergencyLogin: isEmergency ? 1 : 0,
      other: other
    }
    console.log('body: ', body)
    axios({
      method: 'put',
      url: `${APIs.hostAPI}backoffice/hospitalization`,
      headers: {
        'x-auth-token': token
      },
      data: body
    })
      .then(response => {
        setReload(Math.random())
        setShowNoti(true)
        console.log('data: ', response.data)
        if (_.includes([0, '0'], response?.data?.esito)) {
          setDataNoti({
            status: STATUS_NOTIFY.SUCCESS,
            content: response?.data?.motivo
          })
        }
        if (_.includes([1, '1'], response?.data?.esito)) {
          setDataNoti({
            status: STATUS_NOTIFY.ERROR,
            content: response?.data?.motivo
          })
        }
        DeviceEventEmitter.emit('updateHos')
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
  }

  const closeButton = () => {
    setEdit(false)
    convetType()
    setType(type?.name)
    setHospitalization(detail?.hospitalizationName || '')
    setSurgeryCategory(detail?.surgeryCategoryName || '')
    setSurgery(detail?.surgerySubCategoryName || '')
    setCountry(detail?.country || '')
    setSince(detail?.hospDate)
    setNote(detail?.remarks)
    setOther(detail?.other)
    setTypeID(detail?.type)
    setHosID(detail?.hospitalizationId)
    checkEmergency()
  }

  const checkListSurgery = () => {
    var i = lsSubSurgeryRedux.filter(
      val => val.surgeryCategoryId === surgeryCategory?.id
    )
    return i
  }

  const checkPrint = () => {
    if ((typeID === 1) && detail?.hospitalizationId !== 1
    && detail?.hospitalizationId !== 47 && detail?.hospitalizationId !== 48) {
      return _onPressPrintHos
    }
    if ((typeID === 1) && detail?.hospitalizationId === 1) {
      return _onPressPrintOther
    }
    if ((typeID === 1) && detail?.hospitalizationId === 47) {
      return _onPressPrintOtherAccident
    }
    if ((typeID === 1) && detail?.hospitalizationId === 48) {
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
              setType(val?.name)
              setTypeID(val?.id)
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
              setHosID(val?.id)
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
      <NotificationView
        isShow={isShowNoti}
        setShow={() => setShowNoti(false)}
        status={dataNoti?.status || STATUS_NOTIFY.ERROR}
        content={dataNoti?.content || ''}
      />
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
