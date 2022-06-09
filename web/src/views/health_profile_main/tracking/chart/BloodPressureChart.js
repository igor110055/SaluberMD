import React from 'react'
import {
  StyleSheet, View, Dimensions
} from 'react-native'
import { Chart, VerticalAxis, HorizontalAxis, Line, Tooltip } from 'react-native-responsive-linechart'
import _ from 'lodash'
import { color2F855A, color3777EE } from 'constants/colors'
import { converNumberToMMMDD } from 'constants/DateHelpers'

export default function BloodPressureChart({
  dataChart, idx
}) {
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
        <VerticalAxis tickValues={[20, 40, 90, 120, 140, 160, 180, 200]} />
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: 300,
    overflow: 'hidden',
    marginBottom: 10
  },
  chartStyle: {
    flex: 1
  }
})
