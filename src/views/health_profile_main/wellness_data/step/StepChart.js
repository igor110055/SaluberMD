import React from 'react'
import {View, Text, StyleSheet, Dimensions} from 'react-native'
import { BarChart } from 'react-native-chart-kit'
import _, {cloneDeep} from 'lodash'

import { converNumberToMMMDD } from 'constants/DateHelpers'
import { color3777EE } from 'constants/colors'

export default function StepChart({
    dataChart, indexNumber
}) {
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
    if (index % 3 === 0 ) {
      const convertDate = (val?.datetime || val?.date) ? converNumberToMMMDD(Number(val?.datetime || val?.date)) : ''
      labels30.push(convertDate)
    }
  })
  var labels30Re = labels30.reverse()

  var newData = []
  _.forEach((dataChart || []), function (val, index) {
    if (index < checkIndex()) {
      const convertDate = (val?.datetime || val?.date) ? converNumberToMMMDD(Number(val?.datetime || val?.date)) : ''
      newData.push({
        label: convertDate,
        data: Number(val?.value),
        date: Number(val?.date) || Number(val?.datetime)
      })
    }
  })

  const sortData = (val) => {
    const newData2 = cloneDeep(val)
    return (newData2 || []).sort(function (a, b) { return a.date - b.date })
  }

  newData = sortData(newData)

  console.log('newData: ', newData)

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
          strokeWidth: 20,
          fillShadowGradientOpacity: 1,
          barPercentage: indexNumber === 1 ? 0.2 : 0.6
        }}
        verticalLabelRotation={-80}
        xLabelsOffset={22}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width - 80,
    height: 250
  },
  graphStyle: {
    marginTop: 20
  }
})
