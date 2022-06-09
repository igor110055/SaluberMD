import React from 'react'
import {
  StyleSheet, View, Dimensions, Text
} from 'react-native'
import { Chart, VerticalAxis, HorizontalAxis, Line, Tooltip } from 'react-native-responsive-linechart'
import _ from 'lodash'
import { color2F855A, color3777EE } from 'constants/colors'
import { converNumberToMMMDD } from 'constants/DateHelpers'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from 'translate'
import { useSelector } from 'react-redux'
import {cloneDeep} from 'lodash'

export default function BloodPressureChart({
  dataChart, idx, dataRange, routeDoctor
}) {
  const languageRedux = useSelector(state => state.common.language)
  var rangeMax = (dataRange || []).length > 0 ? Number(dataRange[0]?.max) : 0
  var rangeMin = (dataRange || []).length > 0 ? Number(dataRange[0]?.min) : 0
  // const sortDataSystolicg = (val) => {
  //   const newData2 = cloneDeep(val)
  //   return (newData2 || []).sort(function (a, b) { return Number(b?.systolic) - Number(a?.systolic) })
  // }
  // var dataSystolic = sortDataSystolicg(dataChart)
  // var dataMaxSystolic = (dataSystolic || []).length > 0 ? dataSystolic[0]?.systolic : 0
  // const sortDataDiastolic = (val) => {
  //   const newData2 = cloneDeep(val)
  //   return (newData2 || []).sort(function (a, b) { return Number(b?.diastolic) - Number(a?.diastolic) })
  // }
  // var dataDiastolic = sortDataSystolicg(dataChart)
  // var dataMaxDiastolic = (dataDiastolic || []).length > 0 ? dataDiastolic[0]?.diastolic : 0
  const checkRangeMax = () => {
    var margin = (220 / 8) * ((rangeMax - 20) / 20)
    return margin
  }
  const checkRangeMin = () => {
    var margin = (220 / 8) * ((rangeMin - 20) / 20)
    return margin
  }
  var data1 = []
  var data2 = []
  var dates = []
  const newData = []

  console.log('BloodDataChart: ', dataChart)

  _.forEach(dataChart, function (val, index) {
    if (index < (idx === 1 ? 30 : idx)) {
      newData.push(val)
    }
  })

  const sortData = () => {
    const newData1 = newData
    return newData1.sort(function (a, b) { return a?.date  - b?.date })
  }

  _.forEach((sortData() || []), function (val, index) {
    data1.push({ x: index, y: Number(val?.systolic || 0) })
    data2.push({ x: index, y: Number(val?.diastolic || 0) })
    dates.push({ x: index, y: val?.date || Number(val?.data) })
  })

  const getNameDate = (idx1) => {
    const getIdxValue = dates.filter(val => {
      if (`${val?.x}` === `${(idx1.toFixed(0))}`) {
        return val
      }
    })
    if (getIdxValue.length > 0) {
      return getIdxValue[0].y
    }
    return ''
  }

  const getTickCount = () => {
    const countLS = dataChart.length
    if (idx === 10) {
      return countLS
    }
    if (idx === 7) {
      return countLS
    }
    if (idx === 1) {
      return 11
    }
  }

  return (
    <View style={styles.container}>
      <Chart
        style={styles.chartStyle}
        xDomain={{ min: 0, max: dates.length - 1}}
        yDomain={{ min: 20, max: 200 }}
        padding={{ left: 30, top: 10, bottom: 45, right: 20 }}
      >
        <VerticalAxis tickValues={[20, 40, 60, 80, 100, 120, 140, 160, 180]} />
        <HorizontalAxis
          tickCount={getTickCount()}
          theme={{
            labels: {
              formatter: (v) => {
                return converNumberToMMMDD(getNameDate(v))
              },
              label : {
                rotation: idx === 7 ? 0 : -60,
                dy: -25
              }
            }
          }}
        />
        <Line
          data={data1}
          smoothing="cubic-spline"
          tooltipComponent={
            <Tooltip
              theme={{
                shape: {
                  width: 40,
                  height: 30,
                  opacity: 0.6,
                  rx: 6
                }
              }}
            />
          }
          theme={{
            stroke: {
              color: color3777EE,
              width: 2
            },
            scatter: {
              default: {
                width: 8,
                height: 8,
                rx: 4,
                color: color3777EE
              }
            }
          }}
        />
        <Line
          data={data2}
          smoothing="cubic-spline"
          tooltipComponent={
            <Tooltip
              theme={{
                shape: {
                  width: 40,
                  height: 30,
                  opacity: 0.6,
                  rx: 6
                }
              }}
            />
          }
          theme={{
            stroke: {
              color: color2F855A,
              width: 2
            },
            scatter: {
              default: {
                width: 8,
                height: 8,
                rx: 4,
                color: color2F855A
              }
            }
          }}
        />
      </Chart>
      {routeDoctor && (dataRange || []).length > 0 && (
        <View style={styleRange(checkRangeMax()).marginMax}>
          <Text
            style={[
              customTxt(Fonts.SemiBold, 14, 'red').txt,
              styles.lineHeight14
            ]}>
            {Translate(languageRedux).MAX} {rangeMax}
          </Text>
          <View style={styles.lineMax} />
        </View>
      )}
      {routeDoctor && (dataRange || []).length > 0 && (
        <View style={styleRange(checkRangeMax(), checkRangeMin()).marginMin}>
          <Text
            style={[
              customTxt(Fonts.SemiBold, 14, '#f0932b').txt,
              styles.lineHeight14
            ]}>
            {Translate(languageRedux).MIN} {rangeMin}
          </Text>
          <View style={styles.lineMin} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: 300,
    // overflow: 'hidden',
    paddingBottom: 40
  },
  chartStyle: {
    // flex: 1
    height: 300
  },
  lineMax: {
    width: '100%',
    height: 1,
    borderWidth: 1,
    borderColor: 'red'
  },
  lineMin: {
    width: '100%',
    height: 1,
    borderWidth: 1,
    borderColor: '#f0932b'
  },
  lineHeight14: {
    lineHeight: 14
  }
})

const styleRange = (max, min) => StyleSheet.create({
  marginMax: {
    marginTop: -(60 + max),
    marginLeft: 30
  },
  marginMin: {
    marginTop: max - 15 - min,
    marginLeft: 30
  }
})
