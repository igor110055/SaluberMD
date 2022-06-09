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
import {convertCalenderDDMMYYYY, convertYear, getDate112000} from '../../../../../constants/DateHelpers'

import icHeader from '../../../../../../assets/images/header'
import icHealthProfile from '../../../../../../assets/images/health_profile'
import icDoc from '../../../../../../assets/images/document'

import Header from '../../../../../components/Header'
import FunctionButton from '../../PersonalInfo/FunctionButton'
import CustomTextInput from '../../../../healthProfile/components/CustomTextInput'
import SearchListWithName from '../../../../../components/SearchListWithName'
import LoadingView from 'components/LoadingView'
import CustomDatePicker from 'components/CustomDatePicker'

export default function DetailDependency({ route }) {

  const passingData = route?.params?.data
  const languageRedux = useSelector(state => state.common.language)
  const lsDepenRedux = useSelector(state => state.common.dependency)
  const [isShow, setShow] = useState(false)
  const [edit, setEdit] = useState(false)
  const token = useSelector(state => state.user.token)
  const [revoke, setRevoke] = useState(false)
  const datePickerRef = React.createRef()
  const [isLoad, setLoading] = useState(true)
  const [detail, setDetail] = useState([])
  const [emergencyUpdate, setEmergencyUpdate] = useState(detail?.onEmergencyLogin || null)
  const [depenName, setDepenName] = useState()
  const [isShowDepen, setShowDepen] = useState(false)
  const [isShowWeanedOff, setShowWeanedOff] = useState(false)
  const [depenID, setDepenID] = useState()
  const lsType = [
    {'name': Translate(languageRedux).no, 'id': 0},
    {'name': Translate(languageRedux).yes, 'id': 1}
  ]

  useEffect(() => {
    revoke && deleteDepen()
    checkEmergency()
  },[revoke, isLoad])

  useEffect(() => {
    callAPIGetDetail()
    convertDepen()
    setDepenID(detail?.dependencyId)
    getWeanedOff()
  },[isLoad])

  const callAPIGetDetail = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/dependency/${passingData?.itemID}`,
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

  const deleteDepen = () => {
    axios({
      method: 'delete',
      url: `${APIs.hostAPI}backoffice/dependency/${passingData?.itemID}`,
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

  const [dependency, setDependency] = useState(passingData?.name || '')
  const [weanedOff, setWeanedOff] = useState(passingData?.weaned)
  const [yearStart, setYearStart] = useState(passingData?.since || '')
  const [dailyUse, setDailyUse] = useState(passingData?.dailyUse || '')
  const [note, setNote] = useState(passingData?.note || '')
  const [isEmergency, setEmergency] = useState(isEmergency || false)
  const [other, setOther] = useState(passingData?.other || '')

  const checkkYearStart = () => {
    if (yearStart) {
      return convertYear(yearStart)
    }
    if (yearStart === '') {
      return convertYear(detail?.since)
    }
    if (yearStart === null && detail?.since === null) {
      return ''
    }
  }

  const renderEdit = () => {
    return (
      <View style={styles.ctnItem}>
        <CustomTextInput
          title={Translate(languageRedux).dipendenza}
          value={dependency?.name || dependency || ''}
          onChangeTxt={(txt) => setDependency(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icHealthProfile.ic_dropdown}
          onPress={() => {
            setShowDepen(true)
            setDepenID(dependency?.id)
        }}
        />
        {(depenID === 1 || dependency?.id === '1') && <CustomTextInput
          title={Translate(languageRedux).other}
          value={other || detail?.other || ''}
          onChangeTxt={(txt) => setOther(txt)}
          placeholder={Translate(languageRedux).PH_GENERIC_NAME}
          validate={(other || detail?.other) ? false : true}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />}
        <CustomTextInput
          title={Translate(languageRedux).weanedoff}
          value={weanedOff?.name || weanedOff || ''}
          onChangeTxt={(txt) => setWeanedOff(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icHealthProfile.ic_dropdown}
          onPress={() => {setShowWeanedOff(true)}}
        />
        <CustomTextInput
          title={Translate(languageRedux).annoinizio}
          value={checkkYearStart()}
          onChangeTxt={(txt) => setYearStart(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icDoc.ic_choose_date}
          onPress={() => {datePickerRef.current.onPressDate()}}
          placeholder={Translate(languageRedux).SELECT_A_DATE}
        />
        <CustomTextInput
          title={Translate(languageRedux).dailyuse}
          value={dailyUse || ''}
          onChangeTxt={(txt) => setDailyUse(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
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

  const convertDepen = () => {
    const id = detail?.dependencyId ? detail?.dependencyId.toString() : null
    var j = lsDepenRedux.filter(
      val => val?.id === id,
    )
    if (j.length > 0) {
        setDepenName(j[0].name || '')
    }
  }

  const checkWeanned = () => {
    if (detail?.weaned_off === 0) {
      return Translate(languageRedux).no
    }
    if (detail?.weaned_off === 1) {
      return Translate(languageRedux).yes
    }
  }

  const renderBody = () => {
    return (
      <View>
        <RenderItem
          category={Translate(languageRedux).dipendenza}
          content={depenName}
        />
        {detail?.dependencyId === 1 && <RenderItem
          category={Translate(languageRedux).other}
          content={detail?.other}
        />}
        <RenderItem
          category={Translate(languageRedux).weanedoff}
          content={checkWeanned()}
        />
        <RenderItem
          category={Translate(languageRedux).annoinizio}
          content={detail?.yearStarted}
        />
        <RenderItem
          category={Translate(languageRedux).dailyuse}
          content={detail?.daily_use}
        />
        <RenderItem
          category={Translate(languageRedux).note}
          content={detail?.remarks}
        />
      </View>
    )
  }

  const dateLocal = moment(yearStart).local().format('YYYY-MM-DD')
  const UTCDate = moment(dateLocal).utc().valueOf()
  const getWeanedOff = () => {
    if (weanedOff?.name === Translate(languageRedux).no) {
      return 0
    }
    if (weanedOff?.name === Translate(languageRedux).yes) {
      return 1
    }
    if (passingData?.weaned === Translate(languageRedux).no) {
      return 0
    }
    if (passingData?.weaned === Translate(languageRedux).yes) {
      return 1
    }
  }

  const _onPressUpdateDetailDepen = () => {
    const body = {
      id: passingData?.itemID,
      dependencyId: dependency?.id || detail?.dependencyId,
      yearStarted: convertYear(yearStart),
      weaned_off: getWeanedOff(),
      since: UTCDate || detail?.since,
      daily_use: dailyUse,
      remarks: note,
      onEmergencyLogin: emergencyUpdate,
      other: other
    }
    axios({
      method: 'put',
      url: `${APIs.hostAPI}backoffice/dependency`,
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

  const _onChangeDatePicker = date => {
    setYearStart(date)
  }

  const _onPressDeleteMedi = () => {
    setRevoke(true)
    DeviceEventEmitter.emit('update')
    NavigationService.goBack()
  }

  const closeButton = () => {
    setEdit(false)
    setDependency(passingData?.name || '')
    setWeanedOff(passingData?.weaned || '')
    setYearStart(passingData?.since || '')
    setDailyUse(passingData?.dailyUse || '')
    setNote(passingData?.note || '')
    setOther(detail?.other || '')
    setEmergency(passingData?.onEmergencyLogin)
  }

  const html = `
  <h2>${Translate(languageRedux).dipendenza}</h2>
  <h1>${depenName}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).weanedoff}</h2>
  <h1>${checkWeanned()}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).annoinizio}</h2>
  <h1>${detail?.yearStarted}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).dailyuse}</h2>
  <h1>${detail?.daily_use || ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).note}</h2>
  <h1>${detail?.remarks || ''}</h1>
  <hr class="solid">
  `

  const htmlOther = `
  <h2>${Translate(languageRedux).dipendenza}</h2>
  <h1>${depenName}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).other}</h2>
  <h1>${detail?.other}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).weanedoff}</h2>
  <h1>${checkWeanned()}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).annoinizio}</h2>
  <h1>${detail?.yearStarted}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).dailyuse}</h2>
  <h1>${detail?.daily_use || ''}</h1>
  <hr class="solid">
  <h2>${Translate(languageRedux).note}</h2>
  <h1>${detail?.remarks || ''}</h1>
  <hr class="solid">
  `

  const _onPressPrinttoPDF = async () => {
    const results = await RNHTMLtoPDF.convert({
      html: html,
      fileName: Translate(languageRedux).dipendenza,
      base64: true
    })
    await RNPrint.print({filePath: results.filePath})
  }

  const _onPressPrinttoPDFWithOther = async () => {
    const results = await RNHTMLtoPDF.convert({
      html: htmlOther,
      fileName: Translate(languageRedux).dipendenza,
      base64: true
    })
    await RNPrint.print({filePath: results.filePath})
  }

  const _onPressShare = async () => {
    const results = await RNHTMLtoPDF.convert({
      html: html,
      fileName: Translate(languageRedux).dipendenza,
      base64: true
    })
    const results2 = await RNHTMLtoPDF.convert({
      html: htmlOther,
      fileName: Translate(languageRedux).dipendenza,
      base64: true
    })
    let options = {
      url: `data:application/pdf;base64,${detail?.dependencyId === 1 ? results2.base64 : results.base64}`,
      fileName: Translate(languageRedux).dipendenza
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
              ? Translate(languageRedux).EDIT_DEPENDENCY
              : Translate(languageRedux).dipendenza
          }
          iconLeft={edit ? icHeader.ic_close : icHeader.ic_left}
          iconRight={edit === false && icHeader.ic_function}
          textRight={edit === true && Translate(languageRedux).btnsave}
          textRightColor={color3777EE}
          onPressLeft={() => {
            edit ? closeButton() : NavigationService.goBack()
          }}
          onPressRight={() => {
            edit === true && _onPressUpdateDetailDepen()
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
              onPressPrint={detail?.dependencyId === 1
              ? _onPressPrinttoPDFWithOther : _onPressPrinttoPDF}
              onPressShare={_onPressShare}
            />
          </View>
      )}
      {isShowDepen && (
          <SearchListWithName
            listData={lsDepenRedux}
            title={Translate(languageRedux).CHOOSE_DEPENDENCY}
            itemSelected={dependency}
            onItemClick={val => {
              setDependency(val)
              setShowDepen(false)
            }}
            onPressRight={() => {
              setShowDepen(false)
            }}
          />
      )}
      {isShowWeanedOff && (
          <SearchListWithName
            listData={lsType}
            title={Translate(languageRedux).CHOOSE_WEANED_OFF}
            itemSelected={weanedOff}
            onItemClick={val => {
              setWeanedOff(val)
              setShowWeanedOff(false)
            }}
            onPressRight={() => {
              setShowWeanedOff(false)
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
