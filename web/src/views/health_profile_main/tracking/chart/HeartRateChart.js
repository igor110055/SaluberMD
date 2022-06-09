import { colorE53E3E, colorFFFFFF } from 'constants/colors'
import { converNumberToMMMDD } from 'constants/DateHelpers'
import cloneDeep from 'lodash.clonedeep'
import React from 'react'
import {
  StyleSheet, View
} from 'react-native'
import {
  Chart, HorizontalAxis, VerticalAxis, Line, Area, Tooltip
} from 'react-native-responsive-linechart'
import _ from 'lodash'

export default function HeartRateChart({
  data, indexNumber
}) {
  console.log('HeartRateChart: ', data)
  const ref = React.useRef()
  var countData = 0
  var lsDataCompare = []

  _.forEach((data || []), function (val, key) {
    const convertDate = val?.date ? converNumberToMMMDD(val?.date) : ''
    if (key > 0) {
      const convertDatePrev = data[key - 1].date ? converNumberToMMMDD(data[key - 1].date) : ''
      const checkDate = convertDatePrev === convertDate
      if (!checkDate) {
        countData = countData + 1
        lsDataCompare = [
          ...lsDataCompare,
          {
            data: [{
              x: countData,
              y: val?.value ? Number((val?.value || '0')) : 0
            }],
            index: key,
            count: countData,
            date: convertDate
          }
        ]
      } else {
        var newData = cloneDeep(lsDataCompare)
        newData[countData].data = _.concat(newData[countData].data, {
          x: countData,
          y: val?.value ? Number((val?.value || '0')) : 0
        })
        lsDataCompare = newData
      }
    } else {
      lsDataCompare = [{
        data: [{
          x: countData,
          y: val?.value ? Number((val?.value || '0')) : 0
        }],
        index: key,
        count: countData,
        date: convertDate
      }]
    }
  })

  const getDatas = () => {
    var countData2 = 0
    return (data || []).map((val, index) => {
      const convertDate = val?.date ? converNumberToMMMDD(val?.date) : ''
      if (index > 0) {
        const convertDatePrev = data[index - 1].date ? converNumberToMMMDD(data[index - 1].date) : ''
        const checkDate = convertDatePrev === convertDate
        if (!checkDate) {
          countData2 = countData2 + 1
        }
        return {
          x: countData2,
          y: val?.value ? Number((val?.value || '0')) : 0
        }
      }
      return {
        x: countData2,
        y: val?.value ? Number((val?.value || '0')) : 0
      }
    })
  }

  const getNameTooltip = (idx) => {
    const filterData = getDatas().filter(val => {
      if (val?.x === (idx)) {
        return val
      }
    })

    if (filterData.length > 0) {
      return filterData[0]
    }
    return ''
  }

  const getNameDate = (idx) => {
    const getIdxValue = lsDataCompare.filter(val => {
      if (`${val?.count}` === `${(idx.toFixed(0))}`) {
        return val
      }
    })

    if (getIdxValue.length > 0) {
      return getIdxValue[0].date
    }
    return ''
  }

  const getTickCount = () => {
    const countLS = lsDataCompare.length
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
        data={getDatas()}
        padding={styles.paddingChart}
        xDomain={{ min: 0, max: lsDataCompare.length - 1 }}
        yDomain={{ min: 10, max: 110 }}
        disableTouch={false}
      >
        <VerticalAxis
          tickCount={11}
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
          theme={{
            gradient: {
              from: { color: colorFFFFFF, opacity: 0 },
              to: {
                color: colorFFFFFF,
                opacity: 0
              }
            }
          }} />
        <Line
          initialTooltipIndex={4}
          ref={ref}
          hideTooltipOnDragEnd
          smoothing="cubic-spline"
          // tooltipComponent={
          //   <Tooltip
          //     theme={{
          //       shape: {
          //         width: 90,
          //         height: 30,
          //         opacity: 0.6,
          //         rx: 6
          //       },
          //       formatter: (val) => {
          //         const getDataName = getNameTooltip(val?.x)
          //         console.log('getname: ', getDataName)
          //         const getDate = data[val?.x || 0]?.date ? converNumberToMMMDD(data[val?.x || 0]?.date) : ''
          //         const nameTooltip = `${getDate || ''}: ${getDataName?.y || 0}`
          //         return nameTooltip
          //       }
          //     }}
          //   />
          // }
          theme={{
            stroke: { color: colorFFFFFF, opacity: 0, width: 5 },
            scatter: {
              default: {
                width: 8,
                height: 8,
                rx: 4,
                color: colorE53E3E
              },
              selected: { color: colorE53E3E, width: 12, height: 12 }
            }
          }}
        />
      </Chart>
    </View>
  )
}

const styles = StyleSheet.create({
  chartStyle: {
    height: 300,
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
