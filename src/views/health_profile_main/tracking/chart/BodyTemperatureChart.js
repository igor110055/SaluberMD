import { color3777EE, color7AA5F5 } from 'constants/colors'
import { converNumberToMMMDD } from 'constants/DateHelpers'
import React from 'react'
import {
  StyleSheet, View, Text
} from 'react-native'
import {
  Chart, HorizontalAxis, VerticalAxis, Line, Area, Tooltip
} from 'react-native-responsive-linechart'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from 'translate'
import { useSelector } from 'react-redux'

export default function BodyTemperatureChart({
  dataTemp, valShow, unit, dataRange, routeDoctor
}) {
  const languageRedux = useSelector(state => state.common.language)
  const ref = React.useRef()
  var rangeMax = (dataRange || []).length > 0 ? Number(dataRange[0]?.max) : 0
  var rangeMin = (dataRange || []).length > 0 ? Number(dataRange[0]?.min) : 0

  const checkRangeMax = () => {
    var margin = (195 / 8) * (rangeMax - 34)
    return margin
  }

  const checkRangeMin = () => {
    var margin = (195 / 8) * (rangeMin - 34)
    return margin
  }

  const getData = () => {
    return (dataTemp || []).map((val, index) => {
      return {
        x: index,
        y: val?.temp ? Number((val?.temp || '').replace(',', '.').trim()).toFixed(2) : 0
      }
    })
  }

  const getType = (idx) => {
    const filterType = (dataTemp || []).filter((val, index) => {
      if (index === idx) {
        return val
      }
    })

    if (filterType.length > 0) {
      return 'º' + filterType[0].type
    }

    return ''
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
    return (dataTemp || []).map((val, index) => {
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
    const countLS = (dataTemp || []).length
    return countLS > 8 ? 8 : countLS
  }

  return (
    <View>
      <Chart
        style={styles.chartStyle}
        data={getData()}
        padding={styles.paddingChart}
        xDomain={{ min: 0, max: (dataTemp || []).length - 1 }}
        yDomain={{ min: unit === 'C' ? 34 : 70, max: unit === 'C' ? 42 : 130 }}
        disableTouch={false}
      >
        <VerticalAxis
          tickCount={unit === 'C' ? 9 : 6}
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
                  width: 100,
                  height: 30,
                  opacity: 0.6,
                  rx: 6
                },
                formatter: (val) => {
                  const getDataName = getNameTooltip(val?.x)
                  const getDate = dataTemp[val?.x || 0]?.date ? converNumberToMMMDD(dataTemp[val?.x || 0]?.date) : ''
                  const nameTooltip = `${getDate || ''}: ${getDataName?.y || 0}${getType(val?.x)}`
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
  chartStyle: {
    height: 230,
    width: '100%',
    borderColor: null
  },
  paddingChart: {
    left: 30,
    bottom: 20,
    right: 20,
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

const styleRange = (max, min) => StyleSheet.create({
  marginMax: {
    marginTop: -(37 + max),
    marginLeft: 30
  },
  marginMin: {
    marginTop: max - 14 - min,
    marginLeft: 30
  }
})
