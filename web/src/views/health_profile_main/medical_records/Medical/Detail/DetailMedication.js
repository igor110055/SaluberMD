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

export default function DetailMedication({ route }) {

  const passingData = route?.params?.data
  const languageRedux = useSelector(state => state.common.language)
  const lsMediRedux = useSelector(state => state.common.medication)
  const lsMediFormRedux = useSelector(state => state.common.mediform)
  const [isShow, setShow] = useState(false)
  const [edit, setEdit] = useState(false)
  const token = useSelector(state => state.user.token)
  const [revoke, setRevoke] = useState(false)
  const datePickerRef = React.createRef()
  const [isLoad, setLoading] = useState(true)
  const [detail, setDetail] = useState([])
  const [emergencyUpdate, setEmergencyUpdate] = useState(detail?.onEmergencyLogin || null)
  const [mediName, setMediName] = useState('')
  const [mediFormName, setMediFormName] = useState('')
  const [isShowMedi, setShowMedi] = useState(false)
  const [isShowMediForm, setShowMediForm] = useState(false)
  const [mediID, setMediID] = useState()

  useEffect(() => {
    revoke && deleteMedi()
    checkEmergency()
  },[revoke, isLoad])

  useEffect(() => {
    callAPIGetDetail()
    convertMedi()
    setMediID(detail?.medicineId)
  },[isLoad])

  const callAPIGetDetail = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/medication/${passingData?.itemID}`,
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

  const deleteMedi = () => {
    axios({
      method: 'delete',
      url: `${APIs.hostAPI}backoffice/medication/${passingData?.itemID}`,
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

  const checkEmergency = () => {
    if (detail?.onEmergencyLogin === 1) {
      setEmergency(true)
    }
    if (detail?.onEmergencyLogin === 0) {
      setEmergency(false)
    }
  }

  const [medication, setMedication] = useState(passingData?.name || '')
  const [dosage, setDosage] = useState(passingData?.dosage || '')
  const [genericName, setGenericName] = useState(passingData?.genericName || '')
  const [since, setSince] = useState(passingData?.since || '')
  const [mediForm, setMediForm] = useState(passingData?.medicationForm || '')
  const [note, setNote] = useState(passingData?.note || '')
  const [isEmergency, setEmergency] = useState(isEmergency || false)
  const [other, setOther] = useState(passingData?.other || '')

  const renderEdit = () => {
    return (
      <View style={styles.ctnItem}>
        <CustomTextInput
          title={Translate(languageRedux).farmaco}
          value={medication?.name || medication || ''}
          onChangeTxt={(txt) => setMediForm(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icHealthProfile.ic_dropdown}
          onPress={() => {
            setShowMedi(true)
            setMediID(medication?.id)
        }}
        />
        {(mediID === 1 || medication?.id === 1) && <CustomTextInput
          title={Translate(languageRedux).other}
          value={other || detail?.other || ''}
          onChangeTxt={(txt) => setOther(txt)}
          placeholder={Translate(languageRedux).PH_GENERIC_NAME}
          validate={(other || detail?.other) ? false : true}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />}
        <CustomTextInput
          title={Translate(languageRedux).dosage}
          value={dosage}
          onChangeTxt={(txt) => setDosage(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
        <CustomTextInput
          title={Translate(languageRedux).genericName}
          value={genericName}
          onChangeTxt={(txt) => setGenericName(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />
        <CustomTextInput
          title={Translate(languageRedux).since}
          value={since ? convertDMMMYYYY(since) : ''}
          onChangeTxt={(txt) => setSince(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icDoc.ic_choose_date}
          onPress={() => {datePickerRef.current.onPressDate()}}
          placeholder={Translate(languageRedux).SELECT_A_DATE}
        />
        <CustomTextInput
          title={Translate(languageRedux).formafarmaco}
          value={mediForm?.name || mediForm || ''}
          onChangeTxt={(txt) => setMediForm(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icHealthProfile.ic_dropdown}
          onPress={() => {setShowMediForm(true)}}
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

  const convertMedi = () => {
    const idMedi = detail?.medicineId ? detail?.medicineId : null
    var j = lsMediRedux.filter(
      val => val?.id === idMedi,
    )
    if (j.length > 0) {
      setMediName(j[0].name || '')
    }
    const idForm = detail?.medicationId ? detail?.medicationId : null
    var i = lsMediFormRedux.filter(
      val => val?.id === idForm,
    )
    if (i.length > 0) {
      setMediFormName(i[0].name || '')
    }
  }

  const renderBody = () => {
    return (
      <View>
        <RenderItem
          category={Translate(languageRedux).farmaco}
          content={mediName}
        />
        {detail?.medicineId === 1 && <RenderItem
          category={Translate(languageRedux).other}
          content={detail?.other}
        />}
        <RenderItem
          category={Translate(languageRedux).dosage}
          content={detail?.dosage}
        />
        <RenderItem
          category={Translate(languageRedux).genericName}
          content={detail?.genericName}
        />
        <RenderItem
          category={Translate(languageRedux).since}
          content={detail?.since ? convertDMMMYYYY(detail?.since) : ''}
        />
        <RenderItem
          category={Translate(languageRedux).formafarmaco}
          content={mediFormName}
        />
        <RenderItem
          category={Translate(languageRedux).note}
          content={detail?.remarks}
        />
      </View>
    )
  }

  const _onChangeDatePicker = date => {
    setSince(date)
  }

  const dateLocal = moment(since).local().format('YYYY-MM-DD')
  const UTCDate = moment(dateLocal).utc().valueOf()

  const _onPressUpdateDetailMedi = () => {
    const body = {
      id: passingData?.itemID,
      medicineId: medication?.id || detail?.medicineId,
      medicationId: mediForm?.id || detail?.medicationId,
      dosage: dosage,
      since: UTCDate || detail?.since,
      genericName: genericName,
      remarks: note,
      onEmergencyLogin: emergencyUpdate,
      other: other
    }
    axios({
      method: 'put',
      url: `${APIs.hostAPI}backoffice/medication`,
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
    DeviceEventEmitter.emit('updateMedication')
  }

  const _onPressDeleteMedi = () => {
    setRevoke(true)
    DeviceEventEmitter.emit('update')
    NavigationService.goBack()
  }

  const closeButton = () => {
    setEdit(false)
    setMedication(passingData?.name || '')
    setDosage(passingData?.dosage || '')
    setGenericName(passingData?.genericName || '')
    setSince(passingData?.since || '')
    setMediForm(passingData?.medicationForm || '')
    setNote(passingData?.note || '')
    setOther(detail?.other || '')
    setEmergency(passingData?.onEmergencyLogin || false)
  }

  const html = `
  <h2>${Translate(languageRedux).farmaco}</h2>
  <h1>${mediName}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).dosage}</h2>
  <h1>${detail?.dosage || ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).genericName}</h2>
  <h1>${detail?.genericName || ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).since}</h2>
  <h1>${detail?.since ? convertDMMMYYYY(detail?.since) : ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).formafarmaco}</h2>
  <h1>${mediFormName || ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).note}</h2>
  <h1>${detail?.remarks || ''}</h1>
  <hr class="solid">
  `

  const htmlOther = `
  <h2>${Translate(languageRedux).farmaco}</h2>
  <h1>${mediName}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).other}</h2>
  <h1>${detail?.other}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).dosage}</h2>
  <h1>${detail?.dosage || ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).genericName}</h2>
  <h1>${detail?.genericName || ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).since}</h2>
  <h1>${detail?.since ? convertDMMMYYYY(detail?.since) : ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).formafarmaco}</h2>
  <h1>${mediFormName || ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).note}</h2>
  <h1>${detail?.remarks || ''}</h1>
  <hr class="solid">
  `

  const _onPressPrinttoPDF = async () => {
    const results = await RNHTMLtoPDF.convert({
      html: html,
      fileName: Translate(languageRedux).farmaco,
      base64: true
    })
    await RNPrint.print({filePath: results.filePath})
  }

  const _onPressPrinttoPDFWithOther = async () => {
    const results = await RNHTMLtoPDF.convert({
      html: htmlOther,
      fileName: Translate(languageRedux).farmaco,
      base64: true
    })
    await RNPrint.print({filePath: results.filePath})
  }

  const _onPressShare = async () => {
    const results = await RNHTMLtoPDF.convert({
      html: html,
      fileName: Translate(languageRedux).farmaco,
      base64: true
    })
    const results2 = await RNHTMLtoPDF.convert({
      html: htmlOther,
      fileName: Translate(languageRedux).farmaco,
      base64: true
    })
    let options = {
      url: `data:application/pdf;base64,${detail?.medicineId === 1 ? results2.base64 : results.base64}`,
      fileName: Translate(languageRedux).farmaco
    }
    Share.open(options)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        err && console.log(err)
      })
  }

  return (
    <View style={styles.container}>
      <Header
          backgroundColor={colorFFFFFF}
          textCenter={
            edit
              ? Translate(languageRedux).EDIT_MEDICATION
              : Translate(languageRedux).farmaco
          }
          iconLeft={edit ? icHeader.ic_close : icHeader.ic_left}
          iconRight={edit === false && icHeader.ic_function}
          textRight={edit === true && Translate(languageRedux).btnsave}
          textRightColor={color3777EE}
          onPressLeft={() => {
            edit ? closeButton() : NavigationService.goBack()
          }}
          onPressRight={() => {
            edit === true && _onPressUpdateDetailMedi()
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
              onPressDelete={_onPressDeleteMedi}
              onPressPrint={detail?.medicineId === 1
              ? _onPressPrinttoPDFWithOther : _onPressPrinttoPDF}
              onPressShare={_onPressShare}
            />
          </View>
      )}
      {isShowMedi && (
          <SearchListWithName
            listData={lsMediRedux}
            title={Translate(languageRedux).CHOOSE_MEDICATION}
            itemSelected={medication}
            onItemClick={val => {
              setMedication(val)
              setShowMedi(false)
            }}
            onPressRight={() => {
              setShowMedi(false)
            }}
          />
      )}
      {isShowMediForm && (
          <SearchListWithName
            listData={lsMediFormRedux}
            title={Translate(languageRedux).CHOOSE_MEDICATION_FORM}
            itemSelected={mediForm}
            onItemClick={val => {
              setMediForm(val)
              setShowMediForm(false)
            }}
            onPressRight={() => {
              setShowMediForm(false)
            }}
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
