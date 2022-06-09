import { color040404, color3777EE, colorBDBDBD, colorC1C3C5, colorF0F0F0, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import React, { useState, useEffect } from 'react'
import {
  Dimensions, TouchableOpacity,
  StyleSheet, View, Text, Image,
  ScrollView,
  DeviceEventEmitter
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Translate from 'translate'
import imgDirect from '../../../../assets/images/direct_call'
import CustomTextInput from 'views/healthProfile/components/CustomTextInput'
import imgHome from '../../../../assets/images/home_screen'
import SearchListWithName from 'components/SearchListWithName'
import { apiGetCurrencies, apiGetFees, apiGetIniziative, apiGetVisitType, apiPostFees, apiPutFees } from 'api/Fees'
import TextInputView from 'views/login_signup/components/TextInputView'
import _ from 'lodash'

export default function NewFeeView({
  onPressClose, dataEdit
}) {
  const languageRedux = useSelector(state => state.common.language)
  const [innitiative, setInnitiative] = useState()
  const [lsInnitiative, setLsInnitiative] = useState([])
  const [type, setType] = useState()
  const [lsType, setLsType] = useState([])
  const [duration, setDuration] = useState()
  const [lsDuration] = useState([
    {
      id: 15,
      name: '15'
    },
    {
      id: 30,
      name: '30'
    }
    // ,
    // {
    //   id: 45,
    //   name: '45'
    // },
    // {
    //   id: 60,
    //   name: '60'
    // }
  ])
  const [price, setPrice] = useState()
  const [currency, setCurrency] = useState()
  const [lsCurrency, setLsCurrency] = useState([])
  const [isShowPopup, setShowPopup] = useState(false)
  const TYPE_POPUP = {
    INNITIATIVE: 'INNITIATIVE',
    TYPE: 'TYPE',
    DURATION: 'DURATION',
    CURRENCY: 'CURRENCY'
  }
  const [typePopup, setTypePopup] = useState(TYPE_POPUP.INNITIATIVE)
  const dispatch = useDispatch()
  const [lsFees, setLsFees] = useState([])

  useEffect(() => {
    callAPIInizaitive()
    callAPICureencies()
    callAPIFees()
    if (dataEdit) {
      setPrice(dataEdit?.fee)
      const getlsDuration = (lsDuration || []).filter(val => val?.name === dataEdit?.timeslot)
      setDuration(getlsDuration.length > 0 ? getlsDuration[0] : null)
    }
  }, [])

  useEffect(() => {
    if (innitiative) {
      callAPIGetVisit()
    }
  }, [innitiative])

  useEffect(() => {
    if (dataEdit) {
      const getLsInni = (lsInnitiative || []).filter(val => val?.value === dataEdit?.id)
      setInnitiative(getLsInni.length > 0 ? getLsInni[0] : null)
      const getLsCurrency = (lsCurrency || []).filter(val => val?.name === dataEdit?.currency)
      setCurrency(getLsCurrency.length > 0 ? getLsCurrency[0] : null)
    }
  }, [lsInnitiative, lsCurrency])

  const callAPIInizaitive = () => {
    dispatch(apiGetIniziative()).then(res => {
      console.log('apiGetIniziative: ', res?.payload)
      setLsInnitiative(res?.payload?.iniziative || [])
    })
  }

  const callAPICureencies = () => {
    dispatch(apiGetCurrencies()).then(res => {
      console.log('apiGetCurrencies: ', res?.payload)
      setLsCurrency(res?.payload?.currencies || [])
    })
  }

  const callAPIFees = () => {
    dispatch(apiGetFees()).then(res => {
      if (res?.payload?.esito === '0') {
        console.log('lsFee: ', res?.payload)
        setLsFees(res?.payload?.initiatives || [])
      }
    })
  }

  const callAPIGetVisit = () => {
    dispatch(apiGetVisitType(innitiative?.value || dataEdit?.id)).then(res => {
      console.log('apiGetVisitType', res?.payload)
      const getLs = res?.payload?.visitTypes || []
      const newLs = getLs.map(val => {
        return {
          id: val?.id,
          visitTypeId: `${val?.id}`,
          type: val?.type,
          name: val?.type,
          initiative: innitiative?.value
        }
      })
      console.log('newLs: ', newLs)
      var listFee = lsFees.filter(val => val?.id === innitiative?.value)
      console.log('listFee: ', listFee)
      var listFilter = _.differenceBy(newLs, listFee, 'visitTypeId')
      console.log('listFilter: ', listFilter)
      setLsType(listFilter)
      if (dataEdit) {
        const lsTypes = (newLs || []).filter(val => val?.visitTypeId === dataEdit?.visitTypeId)
        setType(lsTypes.length > 0 ? lsTypes[0] : null)
      }
    })
  }

  const callAPIPostFee = () => {
    if (dataEdit) {
      const params = {
        'fee': (price || '').replace(',', '.'),
        'currency': currency?.name,
        'timeslot': duration?.id,
        'initiativeId': `${innitiative?.value}`,
        'visitTypeId': type?.id,
        'feeFlag': true,
        feeId: dataEdit?.feeId
      }
      console.log('parmas: ', params)
      dispatch(apiPutFees(params)).then(() => {
        onPressClose()
        DeviceEventEmitter.emit('CONSULTING')
      })
    } else {
      const params = {
        'fee': (price || '').replace(',', '.'),
        'currency': currency?.name,
        'timeslot': duration?.id,
        'initiativeId': `${innitiative?.value}`,
        'visitTypeId': type?.id,
        'feeFlag': true
      }
      console.log('parmas: ', params)
      dispatch(apiPostFees(params)).then(() => {
        onPressClose()
        DeviceEventEmitter.emit('CONSULTING')
      })
    }
  }

  const renderHeaderView = () => {
    return (
      <View style={styles.headerView}>
        <Text style={[
          customTxt(Fonts.SemiBold, 16, color040404).txt
        ]}>{dataEdit ? Translate(languageRedux).FEES_MANAGEMENT : Translate(languageRedux).NEW_FEE}</Text>
        <TouchableOpacity style={styles.closeView} onPress={onPressClose}>
          <Image source={imgDirect.ic_close} style={styles.imgClose} />
        </TouchableOpacity>
      </View>
    )
  }

  const onPressInnitiative = () => {
    if (!dataEdit) {
      setTypePopup(TYPE_POPUP.INNITIATIVE)
      setTimeout(() => {
        setShowPopup(true)
      }, 300)
    }
  }

  const onPressType = () => {
    if (!dataEdit) {
      setTimeout(() => {
        setShowPopup(true)
      }, 300)
      setTypePopup(TYPE_POPUP.TYPE)
    }
  }

  const onPressDuration = () => {
    setTimeout(() => {
      setShowPopup(true)
    }, 300)
    setTypePopup(TYPE_POPUP.DURATION)
  }

  const onPressCurrency = () => {
    setTimeout(() => {
      setShowPopup(true)
    }, 300)
    setTypePopup(TYPE_POPUP.CURRENCY)
  }

  const renderContent = () => {
    return (
      <>
        <CustomTextInput
          title={Translate(languageRedux).INNITIATIVE}
          value={innitiative?.name || ''}
          placeholder={Translate(languageRedux).select}
          textStyle={styles.txtStyle}
          onPress={onPressInnitiative}
          iconRight={dataEdit ? null : imgHome.ic_down}
          validate={!innitiative}
          textinputStyle={customTxt(Fonts.Regular, 16, dataEdit ? 'gray' : color040404).txt}
        />
        {
          innitiative && (
            <CustomTextInput
              title={Translate(languageRedux).type}
              value={type?.type}
              placeholder={Translate(languageRedux).select}
              textStyle={styles.txtStyle}
              onPress={onPressType}
              iconRight={dataEdit ? null : imgHome.ic_down}
              validate={!type}
              textinputStyle={customTxt(Fonts.Regular, 16, dataEdit ? 'gray' : color040404).txt}
            />
          )
        }
        <CustomTextInput
          title={Translate(languageRedux).slotime}
          value={duration?.name}
          placeholder={Translate(languageRedux).select}
          textStyle={styles.txtStyle}
          onPress={onPressDuration}
          iconRight={imgHome.ic_down}
          validate={!duration}
        />
        <View style={styles.rowView}>
          <TextInputView
            title={Translate(languageRedux).price_per_visit}
            value={price}
            onChangeTxt={(txt) => {
              setPrice(txt)
            }}
            placeholder={Translate(languageRedux).price}
            validate={price ? false : true}
            style={styles.fullTxtInputLeft}
          />
          <CustomTextInput
            title={Translate(languageRedux).currency}
            value={currency?.name || ''}
            placeholder={Translate(languageRedux).currency}
            textStyle={styles.txtStyle}
            onPress={onPressCurrency}
            validate={!currency}
            iconRight={imgHome.ic_down}
            style={styles.fullTxtInputRight}
          />
        </View>
      </>
    )
  }

  const checkBT = () => {
    return innitiative && type && price && currency && duration
  }

  const onPressSave = () => {
    callAPIPostFee()
  }

  const renderSubmitButton = () => {
    return (
      <View style={styles.addBT}>
        <TouchableOpacity
          style={btStyle(checkBT()).btView}
          activeOpacity={checkBT() ? 0 : 1}
          onPress={onPressSave}
        >
          <Text style={[
            customTxt(Fonts.SemiBold, 18, colorC1C3C5).txt,
            btStyle(checkBT()).txtBT
          ]}>{dataEdit ? Translate(languageRedux).SAVE_CHANGES : Translate(languageRedux).TXT_ADD}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const getDataSearch = () => {
    if (typePopup === TYPE_POPUP.TYPE) {
      return lsType || []
    } else if (typePopup === TYPE_POPUP.DURATION) {
      return lsDuration || []
    } else if (typePopup === TYPE_POPUP.CURRENCY) {
      return lsCurrency || []
    }
    return lsInnitiative || []
  }

  const getItemSelectSearch = () => {
    if (typePopup === TYPE_POPUP.TYPE) {
      return type
    } else if (typePopup === TYPE_POPUP.DURATION) {
      return duration
    } else if (typePopup === TYPE_POPUP.CURRENCY) {
      return currency
    }
    return innitiative
  }

  const getTitleSearch = () => {
    if (typePopup === TYPE_POPUP.TYPE) {
      return `${Translate(languageRedux).select} ${Translate(languageRedux).type}`
    } else if (typePopup === TYPE_POPUP.DURATION) {
      return `${Translate(languageRedux).select} ${Translate(languageRedux).duration}`
    } else if (typePopup === TYPE_POPUP.CURRENCY) {
      return `${Translate(languageRedux).select} ${Translate(languageRedux).currency}`
    }
    return `${Translate(languageRedux).select} ${Translate(languageRedux).INNITIATIVE}`
  }

  const onPressItem = (val) => {
    setShowPopup(false)
    if (typePopup === TYPE_POPUP.TYPE) {
      return setType(val)
    } else if (typePopup === TYPE_POPUP.DURATION) {
      return setDuration(val)
    } else if (typePopup === TYPE_POPUP.CURRENCY) {
      return setCurrency(val)
    }
    return setInnitiative(val)
  }

  return (
    <View style={styles.flexView}>
      <View style={styles.outsideView} />
      <View style={styles.contentView}>
        {renderHeaderView()}
        <ScrollView
          style={styles.scrollView}
        >
          {renderContent()}
          {renderSubmitButton()}
        </ScrollView>
      </View>
      {
        isShowPopup && (
          <SearchListWithName
            listData={getDataSearch()}
            title={getTitleSearch()}
            isSortNumber={typePopup === TYPE_POPUP.DURATION}
            itemSelected={getItemSelectSearch()}
            onItemClick={onPressItem}
            onPressRight={() => { setShowPopup(false) }}
            hideSearchText={true}
          />
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  flexView: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  outsideView: {
    flex: 1,
    backgroundColor: color040404,
    opacity: 0.4
  },
  contentView: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    backgroundColor: colorFFFFFF,
    top: 64,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
    overflow: 'hidden'
  },
  headerView: {
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeView: {
    position: 'absolute',
    width: 56,
    height: 56,
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgClose: {
    width: 24,
    height: 24
  },
  scrollView: {
    padding: 20
  },
  txtStyle: {
    marginTop: 16
  },
  textinputNoteStyle: {
    flex: 1,
    height: 120,
    paddingTop: 14,
    paddingBottom: 14
  },
  addBT: {
    marginTop: 16
  },
  rowView: {
    flexDirection: 'row'
  },
  fullTxtInputLeft: {
    flex: 1,
    marginRight: 8
  },
  fullTxtInputRight: {
    flex: 1,
    marginLeft: 8
  }
})

const btStyle = (isActive) => StyleSheet.create({
  btView: {
    backgroundColor: isActive ? color3777EE : colorF0F0F0,
    borderRadius: 12,
    height: 48,
    minWidth: 117,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  txtBT: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 24,
    marginRight: 24,
    color: isActive ? colorFFFFFF : colorBDBDBD
  }
})
