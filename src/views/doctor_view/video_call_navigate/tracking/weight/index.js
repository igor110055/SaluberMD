// import React, {useState, useEffect} from 'react'
// import {View, Text, StyleSheet, ScrollView, FlatList} from 'react-native'
// import { useSelector } from 'react-redux'

// import {colorFFFFFF} from 'constants/colors'
// import {convertDMMMYYYY} from 'constants/DateHelpers'
// import { border } from 'constants/css'
// import Translate from 'translate'
// import { LsShow } from 'constants/define'

// import icHeader from '../../../../../../assets/images/header'
// import icTracking from '../../../../../../assets/images/data_tracking'

// import Header from 'components/Header'
// import FilterView from '../FilterView'
// import WeightChart from '../../../../health_profile_main/tracking/chart/WeightChart'

// export default function ListWeightDoctorView() {
//   const languageRedux = useSelector(state => state.common.language)
//   const surveyPatient = useSelector(state => state.common.surveyPatient)
//   const dataWeight = surveyPatient?.weight
//   const [isFilter, setFilter] = useState(false)
//   const [valShow, setValShow] = useState(LsShow(languageRedux).data[0])
//   const [tenItem, setTenItem] = useState()
//   const [sevenItem, setSevenItem] = useState()
//   const [thirtyItem, setThirtyItem] = useState()

//   useEffect(() => {
//     get10Item()
//     get7Days()
//     get30Days()
//   }, [])

//   const get10Item = () => {
//     var data = []
//     for (var i = 0; i < 10; i++) {
//       var item = {}
//       item.value = dataWeight[i]?.value
//       item.data = dataWeight[i]?.data
//       item.metric = dataWeight[i]?.metric
//       data.push(item)
//     }
//     setTenItem(data)
//   }

//   const get7Days = () => {
//     var data = []
//     for (var i = 0; i < 7; i++) {
//       var item = {}
//       item.value = dataWeight[i]?.value
//       item.data = dataWeight[i]?.data
//       item.metric = dataWeight[i]?.metric
//       data.push(item)
//     }
//     setSevenItem(data)
//   }

//   const get30Days = () => {
//     var data = []
//     for (var i = 0; i < 30; i++) {
//       var item = {}
//       item.value = dataWeight[i]?.value
//       item.data = dataWeight[i]?.data
//       item.metric = dataWeight[i]?.metric
//       data.push(item)
//     }
//     setThirtyItem(data)
//   }

//   const checkData = () => {
//     if (valShow?.value === 1000) {
//       return dataWeight || []
//     }
//     if (valShow?.value === 7) {
//       return sevenItem || []
//     }
//     if (valShow?.value === 10) {
//       return tenItem || []
//     }
//     if (valShow?.value === 1) {
//       return thirtyItem || []
//     }
//   }

//   const renderCell = (item) => {
//     return (
//       <View
//       style={[
//         styles.cellView,
//         border().border
//       ]}>
//         <View style={styles.txtCellView}>
//           <Text>{(item?.value || '0').replace(',', '.')} {item?.metric}</Text>
//           <View style={styles.rightImg}>
//             <Text>{item?.data ? convertDMMMYYYY(Number(item?.data)) : ''}</Text>
//           </View>
//         </View>
//       </View>
//     )
//   }

//   const renderBody = () => {
//     return (
//       <View>
//         <FlatList
//         data={checkData()}
//         keyExtractor={(item, index) => index.toString()}
//         key={'#DetailDataTracking'}
//         renderItem={({ item }) => renderCell(item)}
//         contentContainerStyle={styles.flatlistContent}
//         />
//       </View>
//     )
//   }

//   return (
//     <View style={styles.container}>
//       {isFilter === false && <Header
//         backgroundColor={colorFFFFFF}
//         textCenter={Translate(languageRedux).SCALX}
//         iconLeft={icHeader.ic_left}
//         iconRight={icTracking.ic_filters}
//         onPressRight={() => {setFilter(true)}}
//       />}
//       {
//         (checkData() || []).length > 0 && valShow?.value !== 1000 && (
//           <View style={styles.paddingBottom20}>
//             <WeightChart
//               dataChart={checkData()}
//               indexNumber={valShow?.value}
//             />
//           </View>
//         )
//       }
//       {isFilter === false && <ScrollView>{renderBody()}</ScrollView>}
//       {isFilter && <FilterView
//         onPressRightNavi={() => setFilter(false)}
//         valShow={valShow}
//         setValShow={(val) => {
//           setValShow(val)
//         }}
//         onPressShow={val => {
//           setValShow(val)
//         }}
//       />}
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colorFFFFFF
//   },
//   cellView: {
//     marginTop: 20,
//     marginLeft: 20,
//     marginRight: 20,
//     borderRadius: 12,
//     justifyContent: 'center'
//   },
//   txtCellView: {
//     flexDirection: 'row',
//     margin: 16,
//     justifyContent: 'space-between',
//     alignItems: 'center'
//   },
//   rightImg: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center'
//   },
//   flatlistContent: {
//     paddingBottom: 120
//   },
//   paddingBottom20: {
//     paddingBottom: 20
//   }
// })

import Header from 'components/Header'
import { color0B40B1, colorFFFFFF } from 'constants/colors'
import React, { useEffect, useState } from 'react'
import {
  StyleSheet, View, Text, FlatList, RefreshControl,
  TouchableOpacity, Image, ScrollView
} from 'react-native'
import icHeader from '../../../../../../assets/images/header'
import NoDataView from 'components/NoDataView'
import { border } from 'constants/css'
import { convertNumberToDDMMMYYYYHHmm } from 'constants/DateHelpers'
import { useDispatch, useSelector } from 'react-redux'
import Routes from 'navigation/Routes'
import Translate from 'translate'
import LoadingView from 'components/LoadingView'
import WeightChart from '../../../../health_profile_main/tracking/chart/WeightChart'
import NavigationService from 'navigation'
import imgDataTracking from '../../../../../../assets/images/data_tracking'
import imgDirectCall from '../../../../../../assets/images/direct_call'
import FilterView from '../../../../health_profile_main/tracking/filter/FilterView'
import { LsEntry, LsShow } from 'constants/define'
import axios from 'axios'
import * as APIs from '../../../../../api/APIs'
import { apiGetWeightDr } from '../api'

export default function ListWeight() {
  const [data, setData] = useState([])
  const dispatch = useDispatch()
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)
  const languageRedux = useSelector(state => state.common.language)
  const [isLoading, setLoading] = useState(true)
  const [isFilter, setFilter] = useState(false)
  const [valShow, setValShow] = useState(LsShow(languageRedux).data[0])
  const [valEntry, setValEntry] = useState(LsEntry(languageRedux).data[2])
  const [listAll, setListAll] = useState()
  const token = useSelector(state => state.user.token)
  const [reload, setReload] = useState(1)
  const [dataManual, setDataManual] = useState()
  const surveyPatient = useSelector(state => state.common.surveyPatient)
  var patientId = surveyPatient?.user?.id || 0

  useEffect(() => {
    callAPI()
    callAPIListManual()
    callAPIListAll()
  }, [toggleReload])

  useEffect(() => {
    callAPI()
    callAPIListManual()
    callAPIListAll()
  }, [reload])

  const callAPI = () => {
    setData([])
    dispatch(apiGetWeightDr(valShow?.value || 10, patientId)).then(res => {
      console.log('apiGetMisurazioniScalx:', res)
      const ls = res?.payload?.rilevazioni || []
      setData(ls)
      setLoading(false)
      setRefresh(false)
    }).catch(() => {
      setRefresh(false)
      setLoading(false)
    })
  }

  const callAPIListManual = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/wellness/getWeightValues/${valShow?.value}?patientId=${patientId}`,
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
          setDataManual(getList)
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
      url: `${APIs.hostAPI}backoffice/wellness/getWeightExpand/0?patientId=${patientId}`,
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

  const _onPressDetail = (item) => {
    return NavigationService.navigate(Routes.DETAIL_WEIGHT_SCREEN, {
      data: item
    })
  }

  const renderCell = (item) => {
    return (
      <TouchableOpacity
        onPress={() => _onPressDetail(item)}
      style={[
        styles.cellView,
        border().border
      ]}>
        <View style={styles.txtCellView}>
          <Text style={styles.container}>{(item?.weight || '0').replace(',', '.')} {item?.unit}</Text>
          <View style={styles.rightImg}>
            <Text>{item?.date ? convertNumberToDDMMMYYYYHHmm(item?.date) : ''}</Text>
            <Image source={imgDirectCall.ic_right_gray} style={styles.imgRight}/>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const _onRefresh = () => {
    setRefresh(true)
    setToggleReload(Math.random())
  }

  const checkData = () => {
    if (valShow?.value === 1000 && valEntry?.value === 1) {
      return listAll || []
    }
    if (valEntry?.value === 2) {
      return data || []
    }
    else {
      return dataManual || []
    }
  }

  const contentView = () => {
    return (
      <FlatList
        data={checkData()}
        extraData={toggleReload}
        keyExtractor={(item, index) => index.toString()}
        key={'#DetailDataTracking'}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={_onRefresh}
            tintColor={color0B40B1}
          />
        }
        renderItem={({ item }) => renderCell(item)}
        contentContainerStyle={styles.flatlistContent}
      />
    )
  }

  const renderBody = () => {
    return (
      <View>
        {contentView()}
      </View>
    )
  }

  const _onPressRightNavi = () => {
    setFilter(true)
  }

  return (
    <View style={styles.container}>
      {(checkData() || []).length === 0 && <NoDataView />}
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).SCALX}
        iconLeft={icHeader.ic_left}
        iconRight={imgDataTracking.ic_filters}
        onPressRight={_onPressRightNavi}
      />
      {
        (checkData() || []).length > 0 && valShow?.value !== 1000 && (
          <View style={styles.paddingBottom20}>
            <WeightChart
              dataChart={checkData()}
              indexNumber={valShow?.value}
            />
          </View>
        )
      }
      <ScrollView>{renderBody()}</ScrollView>
      {
        isFilter && (
          <FilterView
            onPressRightNavi={() => setFilter(false)}
            valShow={valShow}
            setValShow={(val) => {
              setValShow(val)
              setReload(Math.random())
            }}
            onPressShow={val => {
              setValShow(val)
            }}
            valEntry={valEntry}
            setValEntry={val => setValEntry(val)}
            onPressEntry={val => {
              console.log('Val entry: ', val)
              setValEntry(val)
            }}
          />
        )
      }
      {isLoading && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  viewChar: {
    width: '100%',
    height: 240
  },
  cellView: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 12,
    justifyContent: 'center'
  },
  txtCellView: {
    flexDirection: 'row',
    margin: 16,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  flatlistContent: {
    paddingBottom: 120
  },
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
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
  paddingBottom20: {
    paddingBottom: 20
  }
})

