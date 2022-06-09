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
// import BloodPressureChart from '../../../../health_profile_main/tracking/chart/BloodPressureChart'

// export default function ListPressureDoctorView() {
//   const languageRedux = useSelector(state => state.common.language)
//   const surveyPatient = useSelector(state => state.common.surveyPatient)
//   const dataPressure = surveyPatient?.pressure
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
//       item.systolic = dataPressure[i]?.systolic
//       item.diastolic = dataPressure[i]?.diastolic
//       item.date = dataPressure[i]?.data
//       data.push(item)
//     }
//     setTenItem(data)
//   }

//   const get7Days = () => {
//     var data = []
//     for (var i = 0; i < 7; i++) {
//       var item = {}
//       item.systolic = dataPressure[i]?.systolic
//       item.diastolic = dataPressure[i]?.diastolic
//       item.date = dataPressure[i]?.data
//       data.push(item)
//     }
//     setSevenItem(data)
//   }

//   const get30Days = () => {
//     var data = []
//     for (var i = 0; i < 30; i++) {
//       var item = {}
//       item.systolic = dataPressure[i]?.systolic
//       item.diastolic = dataPressure[i]?.diastolic
//       item.date = dataPressure[i]?.data
//       data.push(item)
//     }
//     setThirtyItem(data)
//   }

//   const checkData = () => {
//     if (valShow?.value === 1000) {
//       return dataPressure || []
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
//           <Text>{item?.systolic || 0}/{item?.diastolic || 0} {item?.deviceSelectedUnit || 'mmhg'}</Text>
//           <View style={styles.rightImg}>
//             <Text>{item?.date ? convertDMMMYYYY(Number(item?.date)) : ''}</Text>
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
//             <BloodPressureChart
//                 dataChart={checkData()}
//                 idx={valShow.value}
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
  TouchableOpacity, Image
} from 'react-native'
import icHeader from '../../../../../../assets/images/header'
import NoDataView from 'components/NoDataView'
import { border } from 'constants/css'
import { convertNumberToDDMMMYYYYHHmm } from 'constants/DateHelpers'
import { useDispatch, useSelector } from 'react-redux'
import Routes from 'navigation/Routes'
import Translate from 'translate'
import LoadingView from 'components/LoadingView'
import BloodPressureChart from '../../../../health_profile_main/tracking/chart/BloodPressureChart'
import imgDataTracking from '../../../../../../assets/images/data_tracking'
import NavigationService from 'navigation'
import { LsEntry, LsShow } from 'constants/define'
import FilterView from '../../../../health_profile_main/tracking/filter/FilterView'
import imgDirectCall from '../../../../../../assets/images/direct_call'
import { apiGetBloodPressDr } from '../api'

export default function ListBodyPressure() {
  const [data, setData] = useState([])
  const dispatch = useDispatch()
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)
  const languageRedux = useSelector(state => state.common.language)
  const [isLoading, setLoading] = useState(true)
  const [isFilter, setFilter] = useState(false)
  const [valShow, setValShow] = useState(LsShow(languageRedux).data[0])
  const [valEntry, setValEntry] = useState(LsEntry(languageRedux).data[2])
  const surveyPatient = useSelector(state => state.common.surveyPatient)
  var patientId = surveyPatient?.user?.id || 0

  useEffect(() => {
    callAPI()
  }, [toggleReload, valShow])

  const callAPI = () => {
    setData([])
    dispatch(apiGetBloodPressDr(valShow?.value || 10, patientId)).then(res => {
      console.log('apiGetMisurazioniPresx:', res)
      const ls = res?.payload?.rilevazioni || []
      setData(ls)
      setLoading(false)
      setRefresh(false)
    }).catch(() => {
      setRefresh(false)
      setLoading(false)
    })
  }

  const _onPressDetail = (item) => {
    NavigationService.navigate(Routes.DETAIL_BLOOD_PRESSURE_SCREEN, {
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
          <Text>{item?.systolic || 0}/{item?.diastolic || 0} {item?.deviceSelectedUnit || 'mmhg'}</Text>
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

  const contentView = () => {
    return (
      <FlatList
        data={data || []}
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

  const _onPressRightNavi = () => {
    setFilter(true)
  }

  return (
    <View style={styles.container}>
      {(data || []).length === 0 && <NoDataView />}
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).PRESX}
        iconLeft={icHeader.ic_left}
        iconRight={imgDataTracking.ic_filters}
        onPressRight={_onPressRightNavi}
      />
      {
        (data || []).length > 1 && valShow?.value !== 1000 && (
          <BloodPressureChart
            dataChart={data}
            idx={valShow.value}
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
  }
})

