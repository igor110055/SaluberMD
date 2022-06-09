import { colorE53E3E, colorFFFFFF } from 'constants/colors'
import { converNumberToMMMDD } from 'constants/DateHelpers'
import cloneDeep from 'lodash.clonedeep'
import React from 'react'
import {
  StyleSheet, View, Text
} from 'react-native'
import {
  Chart, HorizontalAxis, VerticalAxis, Line, Area
} from 'react-native-responsive-linechart'
import _ from 'lodash'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from 'translate'
import { useSelector } from 'react-redux'

export default function HeartRateChart({
  data, indexNumber, dataRange, routeDoctor
}) {
  const languageRedux = useSelector(state => state.common.language)
  console.log('HeartRateChart: ', data)
  const ref = React.useRef()
  var countData = 0
  var lsDataCompare = []
  var rangeMax = (dataRange || []).length > 0 ? Number(dataRange[0]?.max) : 0
  var rangeMin = (dataRange || []).length > 0 ? Number(dataRange[0]?.min) : 0
  const sortDataValueAssending = (val) => {
    const newData2 = cloneDeep(val)
    return (newData2 || []).sort(function (a, b) { return a?.value - b?.value })
  }
  var dataValue = sortDataValueAssending(data)
  var dataMax = (dataValue || []).length > 0 ? dataValue[(dataValue || []).length - 1]?.value : 0
  var dataMin = (dataValue || []).length > 0 ? dataValue[0]?.value : 0
  var rangeY = (Number(dataMax) - Number(dataMin)) / 10
  const checkRangeMax = () => {
    var margin = (245 / 10) * ((rangeMax - Number(dataMin)) / rangeY)
    return margin
  }

  const checkRangeMin = () => {
    var margin = (245 / 10) * ((rangeMin - Number(dataMin)) / rangeY)
    return margin
  }

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

  const checkShowRangeMax = () => {
    if (routeDoctor && (dataRange || []).length > 0 && rangeMax <= Number(dataMax)) {
      return true
    } else {
      return false
    }
  }

  const checkShowRangeMin = () => {
    if (routeDoctor && (dataRange || []).length > 0 && rangeMin >= Number(dataMin)) {
      return true
    } else {
      return false
    }
  }

  return (
    <View>
      <Chart
        style={styles.chartStyle}
        data={getDatas()}
        padding={styles.paddingChart}
        xDomain={{ min: 0, max: lsDataCompare.length }}
        yDomain={{ min: Number(dataMin), max: Number(dataMax) }}
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
      {checkShowRangeMax() && (
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
      {checkShowRangeMin() && (
        <View style={styleRange(checkRangeMax(), checkRangeMin(), checkShowRangeMax()).marginMin}>
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

const styleRange = (max, min, check) => StyleSheet.create({
  marginMax: {
    marginTop: -(45 + 15 + max),
    marginLeft: 40
  },
  marginMin: {
    marginTop: check ? (max - 15 - min) : -(45 + 15 + min),
    marginLeft: 40
  }
})
