import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, ScrollView, FlatList, DeviceEventEmitter} from 'react-native'
import {useSelector} from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'

import { colorFFFFFF, color040404, color3777EE, colorDDDEE1, color363636 } from 'constants/colors'
import Translate from 'translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import {convertNumberToDDMMMYYYYHHmm, convertDMMMYYYYHmm} from 'constants/DateHelpers'
import { border } from 'constants/css'

import icHeader from '../../../../../assets/images/header'
import icDataTracking from '../../../../../assets/images/data_tracking'
import icVisit from '../../../../../assets/images/visit'
import imgNoData from '../../../../../assets/images/nodata'

import Header from 'components/Header'
import FilterWellness from '../FilterWellness'
import SOSButton from '../../../home_screen/components/SOSButton/SOSButton'
import PlusButtonFloating from '../../../visit/PlusButtonFloating'
import LoadingView from 'components/LoadingView'
import NewMesurement from '../../tracking/detail/NewMesurement'
import NoDataView from 'components/NoDataView'
import SleepChartComponent from './SleepChart'

export default function SleepChart() {
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const [isLoad, setLoading] = useState(true)
  const [isFilter, setFilter] = useState(false)
  const [showPlus, setShowPlus] = useState(false)
  const [listData, setListData] = useState()
  const [isNew, setNew] = useState(false)
  const [reload, setReload] = useState(1)
  const [load, setLoad] = useState(1)
  const [listAll, setListAll] = useState()
  const [lastMea, setLastMea] = useState()
  const dataShow = {
    name: Translate(languageRedux).SHOW,
    data: [
      {
        name: Translate(languageRedux).tendays,
        value: 10
      },
      {
        name: Translate(languageRedux).sevendays,
        value: 7
      },
      {
        name: Translate(languageRedux).amonth,
        value: 1
      },
      {
        name: Translate(languageRedux).alldata,
        value: 0
      }
    ]
  }

  const [valShow, setValShow] = useState(dataShow?.data[0])

  useEffect(() => {
    callAPIList()
    callAPIListAll()
    DeviceEventEmitter.addListener('sleep', () => {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    })
  }, [reload, isLoad])

  useEffect(() => {
    callAPIList()
    setTimeout(() => {
      if (load < 3) {
        setLoad(load + 1)
      }
    }, 500)
  }, [load])

  const callAPIList = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/wellness/getSleepValues/${valShow?.value}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        setLoading(false)
        console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.data || []
          const getLast = response.data.last || []
          setListData(getList)
          setLastMea(getLast)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const callAPIListAll = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/wellness/getSleepExpand/0`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        setLoading(false)
        console.log('AllData: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.data || []
          setListAll(getList)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const renderPlusButton = () => {
    return (
      <SOSButton
        source={showPlus ? icVisit.ic_x : icVisit.ic_plus}
        backgroundColor={color3777EE}
        onPress={() => {
          setShowPlus(true)
        }}
      />
    )
  }

  const renderCell = (item) => {
    return (
      <View
      style={[
        styles.cellView,
        border().border
      ]}>
        <View style={styles.txtCellView}>
          <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.container]}>
            {item?.totalHour}h : {item?.totalMinute}m
          </Text>
          <View style={styles.rightImg}>
            <Text style={customTxt(Fonts.Regular, 14, color040404).txt}>
              {(item?.date || item?.datetime) ? convertNumberToDDMMMYYYYHHmm(Number(item?.date || item?.datetime)) : ''}
            </Text>
            {/* <Image source={icHealth.ic_right} style={styles.imgRight}/> */}
          </View>
        </View>
      </View>
    )
  }

  // const _onRefresh = () => {
  //   setRefresh(true)
  //   setToggleReload(Math.random())
  // }

  const checkData = () => {
    if (valShow?.value === 0) {
      return listAll
    }
    else {
      return listData
    }
  }

  const renderList = () => {
    return (
      <View style={styles.marginT8}>
        <FlatList
          data={checkData()}
          // extraData={toggleReload}
          keyExtractor={(item, index) => index.toString()}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={refreshing}
          //     onRefresh={_onRefresh}
          //     tintColor={color0B40B1}
          //   />
          // }
          renderItem={({ item }) => renderCell(item)}
          contentContainerStyle={styles.flatlistContent}
        />
      </View>
    )
  }

  const renderLastMeasure = () => {
    return (
      <View style={styles.lastMea}>
        <Text style={customTxt(Fonts.Regular, 14, color363636).txt}>
          {lastMea?.date ? convertDMMMYYYYHmm(Number(lastMea?.date)) : ''}
        </Text>
        <View style={styles.flexRow}>
          <Text style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.marginT8]}>
            {Translate(languageRedux).lastmeasure}:{' '}
          </Text>
          <Text style={[customTxt(Fonts.SemiBold, 20, color3777EE).txt, styles.marginT8]}>
            {lastMea?.totalHour}h : {lastMea?.totalMinute}m
          </Text>
        </View>
      </View>
    )
  }

  const renderCircleInfo = () => {
    return (
      <View style={styles.circleInfo}>
        <View style={styles.lightSleep}>
          <View style={styles.circle1} />
          <Text style={[customTxt(Fonts.Regular, 12, '#27ae60').txt, styles.marginL5]}>
            {Translate(languageRedux).LIGHT_SLEEP_TIME}
          </Text>
        </View>
        <View style={styles.lightSleep}>
          <View style={styles.circle2} />
          <Text style={[customTxt(Fonts.Regular, 12, '#0984e3').txt, styles.marginL5]}>
            {Translate(languageRedux).DEEP_SLEEP_TIME}
          </Text>
        </View>
        <View style={styles.lightSleep}>
          <View style={styles.circle3} />
          <Text style={[customTxt(Fonts.Regular, 12, '#fdcb6e').txt, styles.marginL5]}>
            {Translate(languageRedux).DORMIVEGLIA}
          </Text>
        </View>
        <View style={styles.lightSleep}>
          <View style={styles.circle4} />
          <Text style={[customTxt(Fonts.Regular, 12, '#eb4d4b').txt, styles.marginL5]}>
            {Translate(languageRedux).SONNO}
          </Text>
        </View>
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.paddingB48}>
        {(listData || []).length > 0 &&
        valShow?.value !== 0 &&
        <SleepChartComponent
          dataChart={listData}
          indexNumber={valShow?.value}
        />}
        {(listData || []).length > 0 &&
        valShow?.value !== 0 && renderCircleInfo()}
        {lastMea?.date && valShow?.value !== 0 && renderLastMeasure()}
        {renderList()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        textCenter={Translate(languageRedux).SLEEP}
        textCenterColor={color040404}
        iconLeft={icHeader.ic_left}
        iconRight={icDataTracking.ic_filters}
        onPressRight={() => {
          setFilter(true)
        }}
      />
      {(listData || []).length === 0 && valShow?.value !== 0 && (
        <NoDataView
          imageSource={imgNoData.img_nodata_tracking}
          text={Translate(languageRedux).TRACKING_NO_DATA}
          noDataViewStyle={styles.ctnNoDataImg}
        />
      )}
      <ScrollView>{renderBody()}</ScrollView>
      {renderPlusButton()}
      {showPlus && (
        <View style={[styles.floatView]}>
          <PlusButtonFloating
            onPressCancel={() => {
              setShowPlus(false)
            }}
            onPressAppointment={() => {
              setShowPlus(false)
              return NavigationService.navigate(Routes.ADD_SLEEP_SCREEN)
            }}
            onPressDirectCall={() => {
              setShowPlus(false)
              setNew(true)
            }}
            titleDirectCall={Translate(languageRedux).scan}
            imgDirectCall={icDataTracking.ic_find_bluetooth}
            titleAppointment={Translate(languageRedux).MANUAL_INPUT}
            imgAppointment={icDataTracking.ic_add}
          />
        </View>)
      }
      {
        isNew && (
          <NewMesurement
            setNew={() => setNew(false)}
            title={Translate(languageRedux).SCALX}
          />
        )
      }
      {
        isFilter && (
          <FilterWellness
            onPressRightNavi={() => setFilter(false)}
            dataShow={dataShow}
            setValShow={(val) => {
              setValShow(val)
              setReload(Math.random())
              setLoading(true)
            }}
            valShow={valShow}
          />
        )
      }
      {isLoad && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  paddingB48: {
    paddingBottom: 48,
    marginHorizontal: 16
  },
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  lastMea: {
    marginVertical: 16,
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  marginT8: {
    marginTop: 8
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  cellView: {
    borderRadius: 12,
    justifyContent: 'center',
    marginBottom: 16
  },
  txtCellView: {
    flexDirection: 'row',
    margin: 16,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rightImg: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  imgRight: {
    width: 24,
    height: 24,
    resizeMode: 'contain'
  },
  flatlistContent: {
    paddingBottom: 120
  },
  circleInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28
  },
  marginL5: {
    marginLeft: 5
  },
  lightSleep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12
  },
  circle1: {
    height: 10,
    width: 10,
    backgroundColor: '#27ae60',
    borderRadius: 5
  },
  circle2: {
    height: 10,
    width: 10,
    backgroundColor: '#0984e3',
    borderRadius: 5
  },
  circle3: {
    height: 10,
    width: 10,
    backgroundColor: '#fdcb6e',
    borderRadius: 5
  },
  circle4: {
    height: 10,
    width: 10,
    backgroundColor: '#eb4d4b',
    borderRadius: 5
  },
  ctnNoDataImg: {
    top: 48
  }
})
