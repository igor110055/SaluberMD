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
import CustomDatePicker from '../../../../../components/CustomDatePicker'
import LoadingView from '../../../../../components/LoadingView'

export default function DetailChronicDisease({ route }) {

    const passingData = route?.params?.data
    const languageRedux = useSelector(state => state.common.language)
    const [isShow, setShow] = useState(false)
    const [edit, setEdit] = useState(false)
    const token = useSelector(state => state.user.token)
    const [revoke, setRevoke] = useState(false)
    const lsDisease = useSelector(state => state.common.lsDisease)
    const lsComplication = useSelector(state => state.common.lsComplicazioni)
    const [isShowDisease, setShowDisease] = useState(false)
    const [isShowComplication, setShowComplication] = useState(false)
    const datePickerRef = React.createRef()
    const [isLoad, setLoading] = useState(true)
    const [detail, setDetail] = useState([])
    const [diseaseID, setDiseaseID] = useState()
    const [isIcd10, setIcd10] = useState()
    const [complicationIdUpdate, setComplicationIdUpdate] = useState()
    const [dataNoti, setDataNoti] = useState()
    const [isShowNoti, setShowNoti] = useState(false)
    const [reload, setReload] = useState(1)

    useEffect(() => {
      revoke && deleteDisease()
    }, [revoke])

    useEffect(() => {
      callAPIGetDetail()
    },[reload])

    const callAPIGetDetail = () => {
        axios({
          method: 'get',
          url: `${APIs.hostAPI}backoffice/disease/${passingData?.id}`,
          headers: {
            'content-type': 'application/json',
            'x-auth-token': token
          }
        })
          .then(response => {
            console.log('dataDetail: ', response.data)
            setLoading(false)
            if (response.data.length === 0) {
              console.log('noti: ', 'can not get data')
            } else {
              console.log('noti: ', 'data has been obtained')
              const getList = response.data || []
              setDetail(getList)
              setDiseaseID(getList?.diseaseId)
              setIcd10(getList?.isIcd10)
            }
          })
          .catch(error => {
            setLoading(false)
            console.log(error)
          })
    }

    const deleteDisease = () => {
        axios({
          method: 'delete',
          url: `${APIs.hostAPI}backoffice/disease/${passingData?.id}`,
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
            DeviceEventEmitter.emit('updateDisease')
            setTimeout(() => {
              NavigationService.goBack()
            }, 1000)
          })
          .catch(error => {
            setLoading(false)
            console.error('There was an error!', error)
          })
    }

    const [disease, setDisease] = useState()
    const [complication, setComplication] = useState()
    const [since, setSince] = useState()
    const [note, setNote] = useState()
    const [other, setOther] = useState()
    const [isEmergency, setEmergency] = useState()

    useEffect(() => {
      setDisease(detail?.name)
      setComplication(detail?.complicationName)
      setSince(detail?.startDate)
      setNote(detail?.remarks)
      setOther(detail?.other)
      setEmergency(detail?.onEmergencyLogin)
    }, [detail])

    const renderEdit = () => {
      return (
        <View style={styles.ctnItem}>
          <CustomTextInput
            title={Translate(languageRedux).disease_1}
            value={disease?.name || detail?.name || ''}
            onChangeTxt={txt => setDisease(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            iconRight={icHealthProfile.ic_dropdown}
            onPress={() => {
              setShowDisease(true)
              setDiseaseID(disease?.id)
            }}
          />
          {(diseaseID === '1') && <CustomTextInput
          title={Translate(languageRedux).other}
          value={other || detail?.other || ''}
          onChangeTxt={(txt) => setOther(txt)}
          placeholder={Translate(languageRedux).PH_GENERIC_NAME}
          validate={(other || detail?.other) ? false : true}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          />}
          <CustomTextInput
            title={Translate(languageRedux).complications}
            value={complication}
            onChangeTxt={txt => setComplication(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            iconRight={icHealthProfile.ic_dropdown}
            onPress={() => {
              setShowComplication(true)
            }}
          />
          <CustomTextInput
            title={Translate(languageRedux).since}
            value={since ? convertDMMMYYYY(since) : ''}
            onChangeTxt={txt => setSince(txt)}
            textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
            iconRight={icDoc.ic_choose_date}
            onPress={() => {
              datePickerRef.current.onPressDate()
            }}
            placeholder={Translate(languageRedux).SELECT_A_DATE}
          />
          <CustomTextInput
            title={Translate(languageRedux).note}
            value={note || ''}
            onChangeTxt={txt => setNote(txt)}
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
                source={isEmergency ? icHealthProfile.ic_checkbox : icHealthProfile.ic_emptybox}
              />
            </TouchableOpacity>
            <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>Show on emergency</Text>
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

    const renderBody = () => {
      return (
        <View>
          <RenderItem
            category={Translate(languageRedux).disease_1}
            content={detail?.name}
          />
          {detail?.diseaseId === '1' && <RenderItem
            category={Translate(languageRedux).other}
            content={detail?.other}
          />}
          <RenderItem
            category={Translate(languageRedux).complications}
            content={detail?.complicationName}
          />
          <RenderItem
            category={Translate(languageRedux).since}
            content={detail?.startDate ? convertDMMMYYYY(detail?.startDate) : ''}
          />
          <RenderItem
            category={Translate(languageRedux).note}
            content={detail?.remarks}
          />
        </View>
      )
    }

    const _onPressDeleteDisease = () => {
      setRevoke(true)
      setLoading(true)
    }

    const _onChangeDatePicker = date => {
      setSince(date)
    }

    const html = `
    <h2>${Translate(languageRedux).disease_1}</h2>
    <h1>${detail?.name}</h1>
    <hr class="solid">
    <h2>${Translate(languageRedux).complications}</h2>
    <h1>${detail?.complicationName || ''}</h1>
    <hr class="solid">
    <h2>${Translate(languageRedux).since}</h2>
    <h1>${detail?.startDate ? convertDMMMYYYY(detail?.startDate) : ''}</h1>
    <hr class="solid">
    <h2>${Translate(languageRedux).note}</h2>
    <h1>${detail?.remarks || ''}</h1>
    <hr class="solid">
    `
    const htmlOther = `
    <h2>${Translate(languageRedux).disease_1}</h2>
    <h1>${detail?.name}</h1>
    <hr class="solid">
    <h2>${Translate(languageRedux).other}</h2>
    <h1>${detail?.other}</h1>
    <hr class="solid">
    <h2>${Translate(languageRedux).complications}</h2>
    <h1>${detail?.complicationName || ''}</h1>
    <hr class="solid">
    <h2>${Translate(languageRedux).since}</h2>
    <h1>${detail?.startDate ? convertDMMMYYYY(detail?.startDate) : ''}</h1>
    <hr class="solid">
    <h2>${Translate(languageRedux).note}</h2>
    <h1>${detail?.remarks || ''}</h1>
    <hr class="solid">
    `
    const _onPressPrinttoPDF = async () => {
      const results = await RNHTMLtoPDF.convert({
        html: html,
        fileName: Translate(languageRedux).disease_1,
        base64: true
      })
      await RNPrint.print({filePath: results.filePath})
    }

    const _onPressPrinttoPDFWithOther = async () => {
      const results = await RNHTMLtoPDF.convert({
        html: htmlOther,
        fileName: Translate(languageRedux).disease_1,
        base64: true
      })
      await RNPrint.print({filePath: results.filePath})
    }

    const _onPressShare = async () => {
      const results = await RNHTMLtoPDF.convert({
        html: html,
        fileName: Translate(languageRedux).disease_1,
        base64: true
      })
      const results2 = await RNHTMLtoPDF.convert({
        html: htmlOther,
        fileName: Translate(languageRedux).disease_1,
        base64: true
      })
      let options = {
        url: `data:application/pdf;base64,${detail?.allergyId === 1 ? results2.base64 : results.base64}`,
        fileName: Translate(languageRedux).disease_1
      }
      Share.open(options)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          err && console.log(err)
        })
    }

  const dateLocal = moment(since).local().format('YYYY-MM-DD')
  const UTCDate = moment(dateLocal).utc().valueOf()

  const _onPressUpdateDetailAllergy = () => {
    const body = {
      id: detail?.id,
      diseaseId: disease?.id || detail?.diseaseId,
      disease: disease?.name || detail?.name,
      startDate: UTCDate || detail?.startDate,
      complicationId: complicationIdUpdate || detail?.complicationId,
      remarks: note,
      other: other,
      isIcd10: isIcd10,
      onEmergencyLogin: isEmergency ? 1 : 0
    }
    console.log('body: ', body)
    axios({
      method: 'put',
      url: `${APIs.hostAPI}backoffice/disease`,
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
        DeviceEventEmitter.emit('updateDisease')
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
  }

  const _onPressLeft = () => {
    NavigationService.goBack()
  }

  const closeButton = () => {
    setEdit(false)
    setDisease(detail?.name || '')
    setComplication(detail?.complicationName || '')
    setSince(detail?.startDate || '')
    setNote(detail?.remarks || '')
    setOther(detail?.other || '')
    setDiseaseID(detail?.diseaseId)
  }

    return (
      <View style={styles.container}>
        <Header
          backgroundColor={colorFFFFFF}
          textCenter={
            edit
              ? Translate(languageRedux).EDIT_CHRONIC_DISEASE
              : Translate(languageRedux).CHRONIC_DISEASE
          }
          iconLeft={edit ? icHeader.ic_close : icHeader.ic_left}
          iconRight={edit === false && icHeader.ic_function}
          textRight={edit === true && Translate(languageRedux).btnsave}
          textRightColor={color3777EE}
          onPressLeft={() => {
            edit ? closeButton() : _onPressLeft()
          }}
          onPressRight={() => {
            edit === true && _onPressUpdateDetailAllergy()
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
        {isShowDisease && (
          <SearchListWithName
            listData={lsDisease}
            title={Translate(languageRedux).CHOOSE_DISEASE}
            itemSelected={disease}
            onItemClick={val => {
              setDisease(val)
              setDiseaseID(val?.id)
              setShowDisease(false)
            }}
            onPressRight={() => {
              setShowDisease(false)
            }}
          />
        )}
        {isShowComplication && (
          <SearchListWithName
            listData={lsComplication}
            title={Translate(languageRedux).CHOOSE_COMPLICATION}
            itemSelected={complication}
            onItemClick={val => {
              setComplication(val?.name)
              setComplicationIdUpdate(val?.id)
              setShowComplication(false)
            }}
            onPressRight={() => {
              setShowComplication(false)
            }}
          />
        )}
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
              onPressDelete={_onPressDeleteDisease}
              onPressPrint={detail?.diseaseId === '1'
              ? _onPressPrinttoPDFWithOther : _onPressPrinttoPDF}
              onPressShare={_onPressShare}
            />
          </View>
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
