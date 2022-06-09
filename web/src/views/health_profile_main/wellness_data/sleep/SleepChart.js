import React from 'react'
import {View, Text, StyleSheet, Dimensions} from 'react-native'
import { StackedBarChart } from 'react-native-chart-kit'
import _, {cloneDeep} from 'lodash'
import {useSelector} from 'react-redux'

import { converNumberToMMMDD } from 'constants/DateHelpers'
import Translate from 'translate'
import { color3777EE } from 'constants/colors'

export default function SleepChart({
    dataChart, indexNumber
}) {
  const languageRedux = useSelector(state => state.common.language)
  const checkIndex = (index) => {
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
    if (index < 12) {
      if (index % 1 === 0 ) {
        const convertDate = (val?.datetime || val?.date) ? converNumberToMMMDD(Number(val?.datetime || val?.date)) : ''
        labels30.push(convertDate)
      }
    }
    if (index > 12) {
      if (index % 3 === 0 ) {
        const convertDate = (val?.datetime || val?.date) ? converNumberToMMMDD(Number(val?.datetime || val?.date)) : ''
        labels30.push(convertDate)
      }
    }
  })
  var labels30Re = labels30.reverse()
  var newData = []
  _.forEach((dataChart || []), function (val, index) {
    if (index < checkIndex()) {
    const convertDate = (val?.datetime || val?.date) ? converNumberToMMMDD(Number(val?.datetime || val?.date)) : ''
      newData.push({
        label: convertDate,
        data: [
          val?.type1 > 0 && Number(val?.type1),
          val?.type4 > 0 && Number(val?.type4),
          val?.type3 > 0 && Number(val?.type3),
          val?.type2 > 0 && Number(val?.type2)
        ],
        date: Number(val?.date) || Number(val?.datetime)
      })
    }
  })
  console.log('newData: ', newData)
  var legend = [
    Translate(languageRedux).SONNO,
    Translate(languageRedux).DORMIVEGLIA,
    Translate(languageRedux).DEEP_SLEEP_TIME,
    Translate(languageRedux).LIGHT_SLEEP_TIME]
  var datas = []
  var labels = []

  _.forEach(newData, function (val) {
    labels.push(val?.label || '')
    datas.push(val?.data || 0)
  })
  var labelsRe = labels.reverse()
  const data = {
    labels: indexNumber === 1 ? labels30Re : labelsRe,
    legend: legend,
    data: datas,
    barColors: ['#eb4d4b', '#fdcb6e', '#0984e3', '#27ae60']
  }
  return (
    <View style={styles.container}>
      <StackedBarChart
        style={styles.graphStyle}
        data={data}
        width={Dimensions.get('window').width - 40}
        height={250}
        withDots={true}
        withVerticalLabels={true}
        chartConfig={{
        //   count: 10,
        //   backgroundColor: color3777EE,
          backgroundGradientFrom: '#FFFFFF',
        //   backgroundGradientFromOpacity: 1,
          backgroundGradientTo: '#FFFFFF',
        //   backgroundGradientToOpacity: 1,
          color: (opacity = 1) => `rgba(55, 119, 238, ${opacity})`,
          // linejoinType: 'miter',
          // strokeWidth: 5,
          // fillShadowGradientOpacity: 1
          barPercentage: indexNumber === 1 ? 0.2 : 0.6,
          verticalLabelsHeightPercentage: -80
        }}
        yLabelsOffset={10}
        hideLegend={true}
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
