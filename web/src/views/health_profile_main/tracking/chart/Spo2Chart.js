import { color3777EE, color7AA5F5 } from 'constants/colors'
import { converNumberToMMMDD } from 'constants/DateHelpers'
import React from 'react'
import {
  StyleSheet, View
} from 'react-native'
import {
  Chart, HorizontalAxis, VerticalAxis, Line, Area, Tooltip
} from 'react-native-responsive-linechart'

export default function Spo2Chart({
  dataSpo2, indexNumber
}) {
  const ref = React.useRef()

  const getData = () => {
    return (dataSpo2 || []).map((val, index) => {
      return {
        x: index,
        y: val?.spo2 ? Number((val?.spo2 || '').replace('%', '').trim()) : 0
      }
    })
  }

  const getNameTooltip = (idx) => {
    const filterData = getData().filter(val => {
      if (val?.x === (idx)) {
        return val
      }
    })

    if (filterData.length > 0) {
      return filterData[0]
    }
    return null
  }

  const getDates = () => {
    return (dataSpo2 || []).map((val, index) => {
      return {
        index: index,
        str: val?.date ? converNumberToMMMDD(val?.date) : ''
      }
    })
  }

  const getNameDate = (idx) => {
    const getIdxValue = (getDates() || []).filter(val => {
      if (`${val?.index}` === `${(idx.toFixed(0))}`) {
        return val
      }
    })
    if (getIdxValue.length > 0) {
      return getIdxValue[0].str
    }
    return ''
  }

  const getTickCount = () => {
    const countLS = (dataSpo2 || []).length
    // if (countLS < 9) {
    //   return countLS
    // }
    // if (countLS % 2 === 0) {
    //   const countD = (countLS / 2)
    //   return countD > 7 ? 7 : countD
    // }
    // const countD = ((countLS + 1) / 2)
    // return countD > 7 ? 7 : countD
    if (indexNumber === 10) {
      return countLS
    }
    if (indexNumber === 7) {
      return countLS
    }
    if (indexNumber === 1) {
      return 11
    }
  }

  return (
    <View>
      <Chart
        style={styles.chartStyle}
        data={getData()}
        padding={styles.paddingChart}
        xDomain={{ min: 0, max: (dataSpo2 || []).length - 1 }}
        yDomain={{ min: 80, max: 110 }}
        disableTouch={false}
      >
        <VerticalAxis
          tickCount={7}
          theme={{
            labels: {
              formatter: (v) => v.toFixed(0)
            },
            grid: {
              stroke: {
                dashArray: [10, 1]
              }
            }
          }}
        />
        <HorizontalAxis
          tickCount={getTickCount()}
          theme={{
            labels: {
              formatter: (v) => {
                return getNameDate(v)
              },
              label : {
                rotation: indexNumber === 7 ? 0 : -60,
                dy: -25
              }
            },
            grid: {
              stroke: {
                dashArray: [10, 1]
              }
            }
          }}
        />
        <Area
          smoothing="cubic-spline"
          theme={{
            gradient: {
              from: { color: color7AA5F5 },
              to: {
                color: color7AA5F5,
                opacity: 0.2
              }
            }
          }} />
        <Line
          initialTooltipIndex={3}
          ref={ref}
          hideTooltipOnDragEnd
          smoothing="cubic-spline"
          tooltipComponent={
            <Tooltip
              theme={{
                shape: {
                  width: 90,
                  height: 30,
                  opacity: 0.6,
                  rx: 6
                },
                formatter: (val) => {
                  const getDataName = getNameTooltip(val?.x)
                  const getDate = dataSpo2[val?.x || 0]?.date ? converNumberToMMMDD(dataSpo2[val?.x || 0]?.date) : ''
                  const nameTooltip = `${getDate || ''}: ${getDataName?.y || 0}%`
                  return nameTooltip
                }
              }}
            />
          }
          theme={{
            stroke: { color: color7AA5F5, width: 5 },
            scatter: {
              default: {
                width: 8,
                height: 8,
                rx: 4,
                color: color3777EE
              },
              selected: { color: color3777EE, width: 12, height: 12 }
            }
          }}
        />
      </Chart>
    </View>
  )
}

const styles = StyleSheet.create({
  chartStyle: {
    height: 230,
    width: '100%',
    borderColor: null
  },
  paddingChart: {
    left: 40,
    bottom: 45,
    right: 40,
    top: 10
  }
})
