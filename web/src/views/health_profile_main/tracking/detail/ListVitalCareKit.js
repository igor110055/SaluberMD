import Header from 'components/Header'
import { color040404, colorFFFFFF } from 'constants/colors'
import React, { useEffect, useState } from 'react'
import {
  StyleSheet, View, Text, DeviceEventEmitter, ScrollView,
  Image
} from 'react-native'
import icHeader from '../../../../../assets/images/header'
import imgMedical from '../../../../../assets/images/medical_record'
import NoDataView from 'components/NoDataView'
import { border, customTxt } from 'constants/css'
import { useDispatch, useSelector } from 'react-redux'
import { apiGetExams } from 'api/DataTracking'
import Routes from 'navigation/Routes'
import Translate from 'translate'
import LoadingView from 'components/LoadingView'
import Fonts from 'constants/Fonts'
import _ from 'lodash'

export default function ListVitalCareKit() {
  const [data, setData] = useState([])
  const dispatch = useDispatch()
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)
  const languageRedux = useSelector(state => state.common.language)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    callAPI()
  }, [toggleReload])

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(Routes.LIST_BODY_PRESSURE, () => {
      setToggleReload(Math.random())
    })
    return () => subscription.remove()
  }, [])

  const callAPI = () => {
    setData([])
    dispatch(apiGetExams()).then(res => {
      console.log('apiGetExams:', res)
      const ls = res?.payload?.esami
      setData(ls)
      setLoading(false)
      setRefresh(false)
    }).catch(() => {
      setRefresh(false)
      setLoading(false)
    })
  }

  const renderCell = (item) => {
    const exams = item?.exams || []
    if (exams.length === 0) {return null}
    return (
      <View style={[
        styles.cellView,
        border().border
      ]}>
        <View style={styles.txtCellView}>
          <Text style={[
            customTxt(Fonts.Regular, 14, color040404).txt,
            styles.txtTitle
          ]}>{item?.exams[0].name || ''}</Text>
          <Image
            style={styles.imgRadio}
            source={imgMedical.ic_radio_off}
          />
        </View>
      </View>
    )
  }

  const _onRefresh = () => {
    setRefresh(true)
    setToggleReload(Math.random())
  }

  const contentView = () => {
    return <ScrollView contentContainerStyle={styles.flatlistContent}>
      {renderCell(data?.['Blood Pressure'])}
      {renderCell(data?.CRP)}
      {renderCell(data?.Spirometry)}
      {renderCell(data?.['Pulse Oximetry'])}
      {renderCell(data?.['Heart Rate'])}
      {renderCell(data?.Otoscopy)}
      {renderCell(data?.['Pneumological check-up'])}
      {renderCell(data?.Temperature)}
      {renderCell(data?.['Thyroid Function Tests'])}
      {renderCell(data?.['ABPM (HOLTER)'])}
      {renderCell(data?.['CBC Tests'])}
      {renderCell(data?.ECG)}
      {renderCell(data?.['Metabolic check-up'])}
      {renderCell(data?.['Gastrointestinal check-up'])}
      {renderCell(data?.Videodermatoscopy)}
      {renderCell(data?.['Cardiopathic test'])}
      {renderCell(data?.['Menopause check-up'])}
      {renderCell(data?.['Diabetes check-up'])}
      {renderCell(data?.['Rheumatoid arthritis'])}
      {renderCell(data?.['Stool Test'])}
      {renderCell(data?.['Urine tests'])}
      {renderCell(data?.PSA)}
    </ScrollView>
  }

  return (
    <View style={styles.container}>
      {(_.isEmpty(data)) && <NoDataView />}
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).kiosk}
        iconLeft={icHeader.ic_left}
      />
      <Text
        style={[
          styles.txtDevice,
          customTxt(Fonts.Medium, 16, color040404).txt
        ]}>{Translate(languageRedux).devices}</Text>
      {contentView()}
      {isLoading && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  txtDevice: {
    marginLeft: 15
  },
  viewChar: {
    width: '100%',
    height: 240
  },
  cellView: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 12
  },
  txtCellView: {
    flexDirection: 'row',
    margin: 16,
    justifyContent: 'space-between'
  },
  flatlistContent: {
    paddingBottom: 40
  },
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  txtTitle: {
    flex: 1
  },
  imgRadio: {
    width: 24,
    height: 24
  }
})
