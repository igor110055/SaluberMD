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

// export default function ListBreathDoctorView() {
//     const languageRedux = useSelector(state => state.common.language)
//     const surveyPatient = useSelector(state => state.common.surveyPatient)
//     const dataWeight = surveyPatient?.weight
//     const [isFilter, setFilter] = useState(false)
//     const [valShow, setValShow] = useState(LsShow(languageRedux).data[0])
//     const [tenItem, setTenItem] = useState()
//     const [sevenItem, setSevenItem] = useState()
//     const [thirtyItem, setThirtyItem] = useState()

//     useEffect(() => {
//       get10Item()
//       get7Days()
//       get30Days()
//     }, [])

//     const get10Item = () => {
//       var data = []
//       for (var i = 0; i < 10; i++) {
//         var item = {}
//         item.value = dataWeight[i]?.value
//         item.data = dataWeight[i]?.data
//         item.metric = dataWeight[i]?.metric
//         data.push(item)
//       }
//       setTenItem(data)
//     }

//     const get7Days = () => {
//       var data = []
//       for (var i = 0; i < 7; i++) {
//         var item = {}
//         item.value = dataWeight[i]?.value
//         item.data = dataWeight[i]?.data
//         item.metric = dataWeight[i]?.metric
//         data.push(item)
//       }
//       setSevenItem(data)
//     }

//     const get30Days = () => {
//       var data = []
//       for (var i = 0; i < 30; i++) {
//         var item = {}
//         item.value = dataWeight[i]?.value
//         item.data = dataWeight[i]?.data
//         item.metric = dataWeight[i]?.metric
//         data.push(item)
//       }
//       setThirtyItem(data)
//     }

//     const checkData = () => {
//       if (valShow?.value === 1000) {
//         return dataWeight || []
//       }
//       if (valShow?.value === 7) {
//         return sevenItem || []
//       }
//       if (valShow?.value === 10) {
//         return tenItem || []
//       }
//       if (valShow?.value === 1) {
//         return thirtyItem || []
//       }
//     }

//     const renderCell = item => {
//       return (
//         <View style={[styles.cellView, border().border]}>
//           <View style={styles.txtCellView}>
//             <Text>
//               {(item?.value || '0').replace(',', '.')} {item?.metric}
//             </Text>
//             <View style={styles.rightImg}>
//               <Text>
//                 {item?.data ? convertDMMMYYYY(Number(item?.data)) : ''}
//               </Text>
//             </View>
//           </View>
//         </View>
//       )
//     }

//     const renderBody = () => {
//       return (
//         <View>
//           <FlatList
//             data={checkData()}
//             keyExtractor={(item, index) => index.toString()}
//             key={'#DetailDataTracking'}
//             renderItem={({item}) => renderCell(item)}
//             contentContainerStyle={styles.flatlistContent}
//           />
//         </View>
//       )
//     }

//     return (
//       <View style={styles.container}>
//         <Text></Text>
//       </View>
//     )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colorFFFFFF
//   },
//   viewChar: {
//     width: '100%',
//     height: 240
//   },
//   cellView: {
//     marginTop: 20,
//     marginLeft: 20,
//     marginRight: 20,
//     borderRadius: 12
//   },
//   txtCellView: {
//     flexDirection: 'row',
//     margin: 16,
//     justifyContent: 'space-between'
//   },
//   flatlistContent: {
//     paddingBottom: 120
//   },
//   floatView: {
//     width: '100%',
//     height: '100%',
//     position: 'absolute'
//   }
// })

import Header from 'components/Header'
import { color0B40B1, colorFFFFFF } from 'constants/colors'
import React, { useEffect, useState } from 'react'
import {
  StyleSheet, View, Text, FlatList, RefreshControl
} from 'react-native'
import icHeader from '../../../../../../assets/images/header'
import icTracking from '../../../../../../assets/images/data_tracking'
import NoDataView from 'components/NoDataView'
import { border } from 'constants/css'
import { converNumberToMMMDDYYYY } from 'constants/DateHelpers'
import { useDispatch, useSelector } from 'react-redux'
import Translate from 'translate'
import LoadingView from 'components/LoadingView'
import BreathingVolumeChart from '../../../../health_profile_main/tracking/chart/BreathingVolumeChart'
import cloneDeep from 'lodash.clonedeep'
import FilterView from '../../../../health_profile_main/tracking/filter/FilterView'
import { LsEntry, LsShow } from 'constants/define'
import axios from 'axios'
import * as APIs from '../../../../../api/APIs'
import { apiGetBreathingVolumesDoctor } from '../api'

export default function ListBreathingVolumes() {
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
  const [dataManual, setDataManual] = useState()
  const surveyPatient = useSelector(state => state.common.surveyPatient)
  var patientId = surveyPatient?.user?.id || 0

  useEffect(() => {
    callAPIListAll()
    callAPI()
    callAPIListManual()
  }, [toggleReload, valShow])

  const callAPI = () => {
    setData([])
    dispatch(apiGetBreathingVolumesDoctor(valShow?.value || 10, patientId)).then(res => {
      console.log('apiGetBreathingVolumes:', res)
      const ls = res?.payload?.data || []
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
      url: `${APIs.hostAPI}backoffice/wellness/getRespiratoryRate/${valShow?.value}?patientId=${patientId}`,
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
      url: `${APIs.hostAPI}backoffice/wellness/getRespiratoryRateExpand/0?patientId=${patientId}`,
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

  const renderCell = (item) => {
    return (
      <View style={[
        styles.cellView,
        border().border
      ]}>
        <View style={styles.txtCellView}>
          <Text>{item?.value || 0} / min</Text>
          <Text>{item?.date ? converNumberToMMMDDYYYY(item?.date) : ''}</Text>
        </View>
      </View>
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

  const sortData = () => {
    const newData = cloneDeep(checkData())
    return newData.sort(function(a,b) {return a?.date - b?.date})
  }

  return (
    <View style={styles.container}>
      {(checkData() || []).length === 0 && <NoDataView />}
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).ARIAX}
        iconLeft={icHeader.ic_left}
        iconRight={icTracking.ic_filters}
        onPressRight={() => {
          setFilter(true)
        }}
      />
      {
        (checkData() || []).length > 1 && valShow?.value !== 1000 && (
          <BreathingVolumeChart
            data={sortData()}
            indexNumber={valShow?.value}
          />
        )
      }
      {contentView()}
      {
        isFilter && (
          <FilterView
            onPressRightNavi={() => setFilter(false)}
            valShow={valShow}
            setValShow={val => setValShow(val)}
            onPressShow={val => {
              console.log('Val show: ', val)
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
    borderRadius: 12
  },
  txtCellView: {
    flexDirection: 'row',
    margin: 16,
    justifyContent: 'space-between'
  },
  flatlistContent: {
    paddingBottom: 120
  },
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  }
})
