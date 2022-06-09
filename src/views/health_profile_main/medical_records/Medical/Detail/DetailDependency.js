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
import {convertYear, getDate112000} from '../../../../../constants/DateHelpers'
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

export default function DetailDependency({ route }) {

  const passingData = route?.params?.data
  const languageRedux = useSelector(state => state.common.language)
  const lsDepenRedux = useSelector(state => state.common.lsDipendenze)
  const [isShow, setShow] = useState(false)
  const [edit, setEdit] = useState(false)
  const token = useSelector(state => state.user.token)
  const [revoke, setRevoke] = useState(false)
  const datePickerRef = React.createRef()
  const [isLoad, setLoading] = useState(true)
  const [detail, setDetail] = useState([])
  const [isShowDepen, setShowDepen] = useState(false)
  const [isShowWeanedOff, setShowWeanedOff] = useState(false)
  const [depenID, setDepenID] = useState()
  const [dataNoti, setDataNoti] = useState()
  const [isShowNoti, setShowNoti] = useState(false)
  const [reload, setReload] = useState(1)
  const lsType = [
    {'name': Translate(languageRedux).no, 'id': 0},
    {'name': Translate(languageRedux).yes, 'id': 1}
  ]

  useEffect(() => {
    revoke && deleteDepen()
  },[revoke])

  useEffect(() => {
    callAPIGetDetail()
  },[reload])

  const callAPIGetDetail = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/dependency/${passingData?.id}`,
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
          setDepenID(getList?.dependencyId)
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
      url: `${APIs.hostAPI}backoffice/dependency/${passingData?.id}`,
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
        DeviceEventEmitter.emit('updateDepen')
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

  const [dependency, setDependency] = useState()
  const [weanedOff, setWeanedOff] = useState()
  const [yearStart, setYearStart] = useState()
  const [dailyUse, setDailyUse] = useState()
  const [note, setNote] = useState()
  const [isEmergency, setEmergency] = useState()
  const [other, setOther] = useState()

  useEffect(() => {
    setDependency(detail?.dependency)
    setYearStart(detail?.yearStarted)
    setNote(detail?.remarks)
    setOther(detail?.other)
    setDailyUse(detail?.daily_use)
    setNote(detail?.remarks)
    checkEmergency()
  }, [detail])

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
        }}
        />
        {(depenID === 1) && <CustomTextInput
          title={Translate(languageRedux).other}
          value={other}
          onChangeTxt={(txt) => setOther(txt)}
          placeholder={Translate(languageRedux).PH_GENERIC_NAME}
          validate={(other || detail?.other) ? false : true}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
        />}
        <CustomTextInput
          title={Translate(languageRedux).weanedoff}
          value={weanedOff?.name || checkWeanned() || ''}
          onChangeTxt={(txt) => setWeanedOff(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icHealthProfile.ic_dropdown}
          onPress={() => {setShowWeanedOff(true)}}
        />
        <CustomTextInput
          title={Translate(languageRedux).annoinizio}
          value={yearStart}
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
          content={detail?.dependency}
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
    if (detail?.weaned_off === Translate(languageRedux).no) {
      return 0
    }
    if (detail?.weaned_off === Translate(languageRedux).yes) {
      return 1
    }
  }

  const _onPressUpdateDetailDepen = () => {
    const body = {
      id: detail?.id,
      dependencyId: dependency?.id || detail?.dependencyId,
      yearStarted: convertYear(yearStart),
      weaned_off: getWeanedOff(),
      since: UTCDate || detail?.since,
      daily_use: dailyUse,
      remarks: note,
      onEmergencyLogin: isEmergency ? 1 : 0,
      other: other
    }
    console.log('body: ', body)
    axios({
      method: 'put',
      url: `${APIs.hostAPI}backoffice/dependency`,
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
        DeviceEventEmitter.emit('updateDepen')
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
  }

  const _onChangeDatePicker = date => {
    setYearStart(date)
  }

  const _onPressDeleteMedi = () => {
    setRevoke(true)
    setLoading(true)
  }

  const closeButton = () => {
    setEdit(false)
    setDependency(detail?.dependency || '')
    checkWeanned()
    setYearStart(detail?.since || '')
    setDailyUse(detail?.daily_use || '')
    setNote(detail?.remarks || '')
    setOther(detail?.other || '')
    setDepenID(detail?.dependencyId)
    checkEmergency()
  }

  const html = `
  <h2>${Translate(languageRedux).dipendenza}</h2>
  <h1>${detail?.dependency}</h1>
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
  <h1>${detail?.dependency}</h1>
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
              setDepenID(val?.id)
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
