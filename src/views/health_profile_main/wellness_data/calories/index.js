import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, ScrollView, FlatList, DeviceEventEmitter} from 'react-native'
import {useSelector} from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'

import {color040404, color363636, color3777EE, colorDDDEE1, colorFFFFFF} from 'constants/colors'
import Translate from 'translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import {convertDMMMYYYYHmm, convertNumberToDDMMMYYYYHHmm} from 'constants/DateHelpers'
import { border } from 'constants/css'

import icHeader from '../../../../../assets/images/header'
import icDataTracking from '../../../../../assets/images/data_tracking'
import icVisit from '../../../../../assets/images/visit'
import imgNoData from '../../../../../assets/images/nodata'

import Header from 'components/Header'
import StepChartComponent from '../step/StepChart'
import FilterWellness from '../FilterWellness'
import SOSButton from '../../../home_screen/components/SOSButton/SOSButton'
import PlusButtonFloating from '../../../visit/PlusButtonFloating'
import LoadingView from 'components/LoadingView'
import NewMesurement from '../../tracking/detail/NewMesurement'
import NoDataView from 'components/NoDataView'

export default function Calories() {
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const [isLoad, setLoading] = useState(true)
  const [isFilter, setFilter] = useState(false)
  const [showPlus, setShowPlus] = useState(false)
  const [isNew, setNew] = useState(false)
  const [reload, setReload] = useState(1)
  const [listData, setListData] = useState()
  const [listSource, setListSource] = useState()
  const [source, setSource] = useState()
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

  const convertListSource = () => {
    var data = []
    if (listSource === null) {return}
    for (var i = 0; i <= (listSource || []).length - 1; i++) {
      var item = {}
      item.name = listSource.slice(i, i + 1).toString()
      data.push(item)
    }
    console.log('data convert: ', data)
    setSource(data)
  }

  const dataSource = {
    name: Translate(languageRedux).source,
    data: source
  }

  const [valShow, setValShow] = useState(dataShow?.data[0])
  const [valSource, setValSource] = useState((dataSource?.data || []).length > 0 ? dataSource?.data[0] : '')

  useEffect(() => {
    callAPIList()
    callAPIListSource()
    callAPIListAll()
    callAPILast()
    DeviceEventEmitter.addListener('calories', () => {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    })
  }, [reload, isLoad])

  useEffect(() => {
    callAPIList()
    convertListSource()
    setTimeout(() => {
      if (load < 3) {
        setLoad(load + 1)
      }
    }, 500)
  }, [load])

  const callAPIList = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/wellness/getCalories/${valShow?.value}/${valSource?.name || 'CORX'}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        // setLoading(false)
        console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.data || []
          setListData(getList)
        }
      })
      .catch((error) => {
        // setLoading(false)
        console.log(error)
      })
  }

  const callAPIListAll = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/wellness/getCaloriesExpand/0`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        // setLoading(false)
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
        // setLoading(false)
        console.log(error)
      })
  }

  const callAPIListSource = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/wellness/getSourceName`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        // setLoading(false)
        // console.log('listSource: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.data || []
          setListSource(getList)
        }
      })
      .catch((error) => {
        // setLoading(false)
        console.log(error)
      })
  }

  const callAPILast = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/wellness/getCalories/0/${valSource?.name || 'CORX'}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        setLoading(false)
        console.log('lastMea: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.last || []
          setLastMea(getList)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
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
            {lastMea?.value || 0}
          </Text>
        </View>
      </View>
    )
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
            {item?.value || '0'}{' '}{Translate(languageRedux).kcal}
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

  const renderBody = () => {
    return (
      <View style={styles.paddingB48}>
        {(listData || []).length > 0 &&
        valShow?.value !== 0 &&
        <StepChartComponent
          dataChart={listData}
          indexNumber={valShow?.value}
        />}
        {lastMea?.date && valShow?.value !== 0 && renderLastMeasure()}
        {renderList()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        textCenter={Translate(languageRedux).calories}
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
      {isFilter === false && renderPlusButton()}
      {showPlus && (
        <View style={[styles.floatView]}>
          <PlusButtonFloating
            onPressCancel={() => {
              setShowPlus(false)
            }}
            onPressAppointment={() => {
              setShowPlus(false)
              return NavigationService.navigate(Routes.ADD_CALORIES_SCREEN)
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
        </View>
      )}
      {isNew && (
        <NewMesurement
          setNew={() => setNew(false)}
          title={Translate(languageRedux).SCALX}
        />
      )}
      {isFilter && (
        <FilterWellness
          onPressRightNavi={() => setFilter(false)}
          dataShow={dataShow}
          setValShow={val => {
            setValShow(val)
            setReload(Math.random())
            setLoading(true)
          }}
          valShow={valShow}
          dataSource={dataSource}
          valEntry={valSource || {name: 'CORX'}}
          setValEntry={val => {
            setValSource(val)
            setLoading(true)
            setReload(Math.random())
          }}
          isShowSource={valShow?.value === 0 ? false : true}
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
    paddingVertical: 16,
    marginTop: 30
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
  ctnNoDataImg: {
    top: 48
  }
})
