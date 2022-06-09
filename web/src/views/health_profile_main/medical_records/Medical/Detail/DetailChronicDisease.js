import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, DeviceEventEmitter, TouchableOpacity, Image } from 'react-native'
import moment from 'moment'
// import RNHTMLtoPDF from 'react-native-html-to-pdf'
// import RNPrint from 'react-native-print'
// import Share from 'react-native-share'

import { colorF0F0F0, colorFFFFFF, colorA7A8A9, color040404, color3777EE } from '../../../../../constants/colors'
import { customTxt } from '../../../../../constants/css'
import Fonts from '../../../../../constants/Fonts'
import Translate from '../../../../../translate'
import NavigationService from '../../../../../routes'
import {convertDMMMYYYY, getDate112000} from '../../../../../constants/DateHelpers'

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
    const languageRedux = ''
    const [isShow, setShow] = useState(false)
    const [edit, setEdit] = useState(false)
    const token = useSelector(state => state.user.token)
    const [revoke, setRevoke] = useState(false)
    const lsDisease = useSelector(state => state.common.disease)
    const lsComplication = useSelector(state => state.common.complication)
    const [isShowDisease, setShowDisease] = useState(false)
    const [isShowComplication, setShowComplication] = useState(false)
    const datePickerRef = React.createRef()
    const [isLoad, setLoading] = useState(true)
    const [detail, setDetail] = useState([])
    const [com, setCom] = useState('')
    const [reload, setReLoad] = useState(1)
    const [emergencyUpdate, setEmergencyUpdate] = useState(detail?.onEmergencyLogin || null)
    const [diseaseID, setDiseaseID] = useState()

    useEffect(() => {
      revoke && deleteDisease()
      convertComplication()
      checkEmergency()
      setTimeout(() => {
        if (reload < 2) {
          setReLoad(reload + 1)
        }
      }, 500)
    }, [revoke, reload, isLoad])

    useEffect(() => {
        callAPIGetDetail()
        setDiseaseID(detail?.diseaseId)
    },[isLoad])

    const callAPIGetDetail = () => {
        // axios({
        //   method: 'get',
        //   url: `${APIs.hostAPI}backoffice/disease/${passingData?.itemID}`,
        //   headers: {
        //     'content-type': 'application/json',
        //     'x-auth-token': token
        //   }
        // })
        //   .then(response => {
        //     console.log('dataDetail: ', response.data)
        //     if (response.data.length === 0) {
        //       console.log('noti: ', 'can not get data')
        //     } else {
        //       console.log('noti: ', 'data has been obtained')
        //       const getList = response.data || []
        //       setDetail(getList)
        //     }
        //     setLoading(false)
        //   })
        //   .catch(error => {
        //     setLoading(false)
        //     console.log(error)
        //   })
    }

    const deleteDisease = () => {
        // axios({
        //   method: 'delete',
        //   url: `${APIs.hostAPI}backoffice/disease/${passingData?.itemID}`,
        //   headers: {
        //     'x-auth-token': token
        //   }
        // })
        //   .then(response => {
        //     console.log('Delete successful', response)
        //   })
        //   .catch(error => {
        //     console.error('There was an error!', error)
        //   })
    }

    const convertComplication = () => {
        var j = lsComplication.filter(
          val => val?.id === detail?.complicationId,
        )
        if (j.length > 0) {
          setCom(j[0].name || '')
        }
    }

    const checkEmergency = () => {
      if (detail?.onEmergencyLogin === 1) {
        setEmergency(true)
      }
      if (detail?.onEmergencyLogin === 0) {
        setEmergency(false)
      }
    }

    const [disease, setDisease] = useState(detail?.name || '')
    const [complication, setComplication] = useState(detail?.complication || '')
    const [since, setSince] = useState(passingData?.since || '')
    const [note, setNote] = useState(passingData?.note || '')
    const [other, setOther] = useState(passingData?.other || '')
    const [isEmergency, setEmergency] = useState(isEmergency || false)

    const renderEdit = () => {
      return (
        <View style={styles.ctnItem}>
          <CustomTextInput
          title={Translate(languageRedux).disease_1}
          value={disease?.name || detail?.name || ''}
          onChangeTxt={(txt) => setDisease(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icHealthProfile.ic_dropdown}
          onPress={() => {
            setShowDisease(true)
            setDiseaseID(disease?.id)
          }}
          />
          {(diseaseID === '1' || disease?.id === '1') && <CustomTextInput
          title={Translate(languageRedux).other}
          value={other || detail?.other || ''}
          onChangeTxt={(txt) => setOther(txt)}
          placeholder={Translate(languageRedux).PH_GENERIC_NAME}
          validate={(other || detail?.other) ? false : true}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          />}
          <CustomTextInput
          title={Translate(languageRedux).complications}
          value={complication?.name || com || ''}
          onChangeTxt={(txt) => setComplication(txt)}
          textinputStyle={customTxt(Fonts.Regular, 16, color040404).txt}
          iconRight={icHealthProfile.ic_dropdown}
          onPress={() => {setShowComplication(true)}}
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
            content={com}
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
        DeviceEventEmitter.emit('update')
        NavigationService.goBack()
    }

    const _onChangeDatePicker = date => {
        setSince(date)
    }

    const html = `
    <h2>${Translate(languageRedux).disease_1}</h2>
    <h1>${detail?.name}</h1>
    <hr class="solid">
    <h2>${Translate(languageRedux).complications}</h2>
    <h1>${com || ''}</h1>
    <hr class="solid">
    <h2>${Translate(languageRedux).since}</h2>
    <h1>${detail?.since ? convertDMMMYYYY(detail?.since) : ''}</h1>
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
    <h1>${com || ''}</h1>
    <hr class="solid">
    <h2>${Translate(languageRedux).since}</h2>
    <h1>${detail?.since ? convertDMMMYYYY(detail?.since) : ''}</h1>
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
      id: passingData?.itemID,
      diseaseId: disease?.id || detail?.diseaseId,
      disease: disease?.name || detail?.name,
      startDate: UTCDate || detail?.startDate,
      complicationId: complication?.id || detail?.complicationId,
      remarks: note,
      other: other,
      isIcd10: passingData?.isIcd10,
      onEmergencyLogin: emergencyUpdate
    }
    axios({
      method: 'put',
      url: `${APIs.hostAPI}backoffice/disease`,
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

  const _onPressLeft = () => {
    NavigationService.goBack()
    setReLoad(1)
  }

  const closeButton = () => {
    setEdit(false)
    setDisease(passingData?.name || '')
    setComplication(passingData?.weaned || '')
    setSince(passingData?.since || '')
    setNote(passingData?.note || '')
    setOther(detail?.other || '')
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
              setComplication(val)
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
