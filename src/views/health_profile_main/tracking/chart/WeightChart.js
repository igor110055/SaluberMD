import { color3777EE } from 'constants/colors'
import React from 'react'
import {
  StyleSheet, View, Text, Dimensions
} from 'react-native'
// import PureChart from 'react-native-pure-chart'
import { BarChart } from 'react-native-chart-kit'
import _ from 'lodash'
import { converNumberToMMMDD } from 'constants/DateHelpers'
import cloneDeep from 'lodash.clonedeep'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from 'translate'
import { useSelector } from 'react-redux'

export default function WeightChart({
  dataChart, indexNumber, dataRange, routeDoctor
}) {
  const languageRedux = useSelector(state => state.common.language)
  const checkIndex = () => {
    if (indexNumber === 10) {
      return 10
    }
    if (indexNumber === 7) {
      return 7
    }
    if (indexNumber === 1) {
      return 31
    }
  }
  var labels30 = []
  _.forEach((dataChart || []), function (val, index) {
    // if (index % 3 === 0 ) {
    //   const convertDate = (val?.datetime || val?.date) ? converNumberToMMMDD(Number(val?.datetime || val?.date)) : ''
    //   labels30.push(convertDate)
    // }
    if (index < 12) {
      if (index % 1 === 0 ) {
        const convertDate = (val?.datetime || val?.date || val?.data) ? converNumberToMMMDD(Number(val?.datetime || val?.date || val?.data)) : ''
        labels30.push(convertDate)
      }
    }
    if (index > 12) {
      if (index % 3 === 0 ) {
        const convertDate = (val?.datetime || val?.date || val?.data) ? converNumberToMMMDD(Number(val?.datetime || val?.date || val?.data)) : ''
        labels30.push(convertDate)
      }
    }
  })
  var labels30Re = labels30.reverse()

  var newData = []
  _.forEach((dataChart || []), function (val, index) {
    if (index < checkIndex()) {
      const convertDate = val?.date || val?.data ? converNumberToMMMDD(Number(val?.date || val?.data)) : ''
      newData.push({
        label: convertDate,
        data: val?.weight || val?.value ? Number((val?.weight || val?.value || '').replace(',', '.')) : 0,
        date: val?.date || Number(val?.data)
      })
    }
  })

  const sortData = (val) => {
    const newData2 = cloneDeep(val)
    return (newData2 || []).sort(function (a, b) { return a.date - b.date })
  }

  const sortDataValueAssending = (val) => {
    const newData2 = cloneDeep(val)
    return (newData2 || []).sort(function (a, b) { return a.data - b.data })
  }

  newData = sortData(newData)

  var dataValue = sortDataValueAssending(newData)

  console.log('newData: ', newData)

  var dataMax = (dataValue || []).length > 0 ? dataValue[(dataValue || []).length - 1]?.data : 0
  var dataMin = (dataValue || []).length > 0 ? dataValue[0]?.data : 0
  var rangeMax = (dataRange || []).length > 0 ? Number(dataRange[0]?.max) : 0
  var rangeMin = (dataRange || []).length > 0 ? Number(dataRange[0]?.min) : 0

  const checkRangeMax = () => {
    var range = dataMax - dataMin
    var margin = (rangeMax - dataMin) * (range / 190)
    console.log('marginMax: ', margin)
    return margin
  }

  const checkRangeMin = () => {
    var range = dataMax - dataMin
    var margin = (rangeMin - dataMin) * (range / 190)
    console.log('marginMin: ', margin)
    return margin
  }

  var labels = []
  var datas = []

  _.forEach(newData, function (val) {
    labels.push(val?.label || '')
    datas.push(val?.data || 0)
  })
  const data = {
    labels: indexNumber === 1 ? labels30Re : labels,
    datasets: [
      {
        data: datas
      }
    ]
  }

  const chartConfig = {
    count: 10,
    backgroundColor: color3777EE,
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    color: (opacity = 1) => `rgba(55, 119, 238, ${opacity})`,
    style: {
      borderRadius: 350
    }
  }

  return (
    <View style={styles.container}>
      <BarChart
        style={styles.graphStyle}
        data={data}
        width={Dimensions.get('window').width - 40}
        height={250}
        withDots={true}
        withVerticalLabels={true}
        chartConfig={{
          count: 10,
          backgroundColor: color3777EE,
          backgroundGradientFrom: '#FFFFFF',
          backgroundGradientFromOpacity: 1,
          backgroundGradientTo: '#FFFFFF',
          backgroundGradientToOpacity: 1,
          color: (opacity = 1) => `rgba(55, 119, 238, ${opacity})`,
          linejoinType: 'miter',
          strokeWidth: 5,
          fillShadowGradientOpacity: 1,
          barPercentage: indexNumber === 1 ? 0.2 : 0.6
        }}
        verticalLabelRotation={-80}
        xLabelsOffset={22}
      />
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
    // width: Dimensions.get('window').width - 80,
    height: 250
  },
  graphStyle: {
    marginTop: 20
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
    marginTop: -(50 + 14 + max),
    marginLeft: 60
  },
  marginMin: {
    marginTop: (max - 14 - min),
    marginLeft: 60
  }
})
