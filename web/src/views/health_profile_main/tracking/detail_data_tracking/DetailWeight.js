import React, { useState } from 'react'
import {
  StyleSheet, View, ScrollView, Text, Dimensions, DeviceEventEmitter
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Translate from 'translate'
import Header from 'components/Header'
import { color040404, color2567F6, color3777EE, color77BDF8, color7EF94C, colorCDCBCB, colorE53222, colorFFFFFF } from 'constants/colors'
import icHeader from '../../../../../assets/images/header'
import LinearGradient from 'react-native-linear-gradient'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import { convertNumberToMMMDDYYYYhhmmA } from 'constants/DateHelpers'
import imgDataTracking from '../../../../../assets/images/data_tracking'
import { apiDeleteWeight } from 'api/DataTracking'
import LoadingView from 'components/LoadingView'
import Routes from 'navigation/Routes'
import NavigationService from 'navigation'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
import DialogCustom from 'components/DialogCustom'

export default function DetailWeight({
  route
}) {
  const languageRedux = useSelector(state => state.common.language)
  const passingData = route?.params?.data
  const dispatch = useDispatch()
  const [isLoading, setLoading] = useState(false)
  const [isShowNoti, setShowNoti] = useState()
  const [dataNoti, setDataNoti] = useState()
  const [isDialog, setDialog] = useState(false)

  const callAPIDelete = () => {
    setDialog(false)
    setLoading(true)
    dispatch(apiDeleteWeight(passingData?.id)).then(res => {
      setShowNoti(true)
      if (res?.payload?.esito === '0') {
        setDataNoti({
          status: STATUS_NOTIFY.SUCCESS,
          content: Translate(languageRedux).record_rimosso
        })
        setTimeout(() => {
          NavigationService.goBack()
        }, 4000)
        setTimeout(() => {
          DeviceEventEmitter.emit(Routes.LIST_WEIGHT)
        }, 4500)
      } else {
        setLoading(false)
        setDataNoti({
          status: STATUS_NOTIFY.ERROR,
          content: res?.payload?.motivo || ''
        })
      }
    }).catch(() => {
      setLoading(false)
    })
  }

  const getBMI = () => {
    if (passingData?.bmi > 18.5 && passingData?.bmi < 25) {
      return Translate(languageRedux).normalWeight
    } else if (passingData?.bmi > 25 && passingData?.bmi < 30) {
      return Translate(languageRedux).preobesity
    } else if (passingData?.bmi > 30 && passingData?.bmi < 35) {
      return Translate(languageRedux).obesity1
    } else if (passingData?.bmi > 35 && passingData?.bmi < 40) {
      return Translate(languageRedux).obesity2
    } else if (passingData?.bmi > 40) {
      return Translate(languageRedux).obesity3
    }
    return Translate(languageRedux).underweight
  }

  const renderColor = () => {
    const getMRL = () => {
      if (passingData?.bmi > 18.5 && passingData?.bmi < 25) {
        return 140
      } else if (passingData?.bmi > 25 && passingData?.bmi < 30) {
        return 190
      } else if (passingData?.bmi > 30 && passingData?.bmi < 35) {
        return 240
      } else if (passingData?.bmi > 35 && passingData?.bmi < 40) {
        return 282
      } else if (passingData?.bmi > 40) {
        return 282
      }
      return 0
    }
    return (
      <LinearGradient
        colors={[color2567F6, color2567F6, color7EF94C, color7EF94C, colorE53222, colorE53222]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        style={styles.colorBMI}>
        <View style={[
          styles.radiusView,
          stylesCustom(getMRL()).marginLView
        ]} />
      </LinearGradient>
    )
  }

  const renderTxtColor = () => {
    return (
      <View style={styles.txtColor}>
        <Text style={customTxt(Fonts.Medium, 14, colorFFFFFF).txt}>{Translate(languageRedux).underweight}</Text>
        <Text style={customTxt(Fonts.Medium, 14, colorFFFFFF).txt}>{Translate(languageRedux).normalWeight}</Text>
        <Text style={customTxt(Fonts.Medium, 14, colorFFFFFF).txt}>{Translate(languageRedux).overweight}</Text>
      </View>
    )
  }

  const renderContent = () => {
    return (
      <LinearGradient
        colors={[color77BDF8, color3777EE]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        style={styles.contentView}>
        <View style={styles.contentTxt}>
          <Text style={customTxt(Fonts.Bold, 45, colorFFFFFF).txt}>{passingData?.weight || 0}</Text>
          {passingData?.unit && <Text style={customTxt(Fonts.Regular, 12, colorFFFFFF).txt}>{passingData?.unit}</Text>}
        </View>
        <Text style={[
          styles.txtCenter,
          customTxt(Fonts.Regular, 20, colorFFFFFF).txt
        ]}>BMI {passingData?.bmi || 0}, <Text style={customTxt(Fonts.Bold, 20, colorFFFFFF).txt}>{getBMI()}</Text></Text>
        {renderColor()}
        {renderTxtColor()}
        {passingData?.date && <Text style={[
          styles.txtCenter,
          customTxt(Fonts.Medium, 18, colorFFFFFF).txt
        ]}>{convertNumberToMMMDDYYYYhhmmA(passingData?.date)}</Text>}
      </LinearGradient>
    )
  }

  const renderImgTable = () => {
    const renderCell = (title, content) => {
      return (
        <View style={styles.cellView}>
          <Text style={customTxt(Fonts.Medium, 16, color040404).txt}>{title}</Text>
          <Text style={customTxt(Fonts.Medium, 16, color3777EE).txt}>{content}</Text>
        </View>
      )
    }

    return (
      <View>
        {renderCell(
          Translate(languageRedux).fat,
          '%'
        )}
        {renderCell(
          Translate(languageRedux).muscles,
          '%'
        )}
        {renderCell(
          Translate(languageRedux).water,
          '%'
        )}
        {renderCell(
          Translate(languageRedux).bones,
          passingData?.unit || ''
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).SCALX}
        iconLeft={icHeader.ic_left}
        iconRight={imgDataTracking.ic_delete}
        onPressRight={() => setDialog(true)}
      />
      <ScrollView style={styles.container}>
        {renderContent()}
        {renderImgTable()}
      </ScrollView>
      {
        isDialog && (
          <DialogCustom
            title={Translate(languageRedux).deletevalue_q}
            txtlLeft={Translate(languageRedux).cancel}
            onPressCancel={() => setDialog(false)}
            txtRight={Translate(languageRedux).OK}
            onPressOK={callAPIDelete}
          />
        )
      }
      {isLoading && <LoadingView />}
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
  contentView: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentTxt: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  txtCenter: {
    marginTop: 20
  },
  cellView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  colorBMI: {
    width: 300,
    height: 20,
    marginTop: 20,
    borderRadius: 10
  },
  txtColor: {
    flexDirection: 'row',
    width: Dimensions.get('window').width - 40,
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20
  },
  radiusView: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colorCDCBCB,
    paddingTop: 10
  }
})

const stylesCustom = (ml) => StyleSheet.create({
  marginLView: {
    marginLeft: ml || 0
  }
})
