import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, ScrollView} from 'react-native'

import Translate from '../../../translate'
import NavigationService from '../../../routes'
import Routes from '../../../routes/Routes'
import { color38A169 } from '../../../constants/colors'
import {convertNumberToDDMMMYYYY} from '../../../constants/DateHelpers'

import BoxTracking from '../../home/components/DataTrackingWidget/BoxTracking'
import LoadingView from '../../../components/LoadingView'

export default function WellnessData() {
  const languageRedux = ''
  const [isLoad, setLoading] = useState(true)
  const [calories, setCalories] = useState()
  const [step, setStep] = useState()
  const [sleep, setSleep] = useState()

  useEffect(() => {
    callAPILastCalories()
    callAPILastStep()
    callAPILastSleep()
  }, [])

  const callAPILastCalories = () => {
    // axios({
    //   method: 'get',
    //   url: `${APIs.hostAPI}backoffice/wellness/getCalories/0/SaluberMD`,
    //   headers: {
    //     'content-type': 'application/json',
    //     'x-auth-token': token
    //   }
    // })
    //   .then((response) => {
    //     setLoading(false)
    //     console.log('Calories: ', response.data)
    //     if (response.data.length === 0) {
    //       console.log('noti: ', 'can not get data')
    //     } else {
    //       console.log('noti: ', 'data has been obtained')
    //       const getList = response.data.last || []
    //       setCalories(getList)
    //     }
    //   })
    //   .catch((error) => {
    //     setLoading(false)
    //     console.log(error)
    //   })
  }

  const callAPILastStep = () => {
    // axios({
    //   method: 'get',
    //   url: `${APIs.hostAPI}backoffice/wellness/getWellnessStepsValuesTimezone/10/-420/SaluberMD`,
    //   headers: {
    //     'content-type': 'application/json',
    //     'x-auth-token': token
    //   }
    // })
    //   .then((response) => {
    //     setLoading(false)
    //     console.log('Step: ', response.data)
    //     if (response.data.length === 0) {
    //       console.log('noti: ', 'can not get data')
    //     } else {
    //       console.log('noti: ', 'data has been obtained')
    //       const getList = response.data.data || []
    //       setStep(getList)
    //     }
    //   })
    //   .catch((error) => {
    //     setLoading(false)
    //     console.log(error)
    //   })
  }

  const callAPILastSleep = () => {
    // axios({
    //   method: 'get',
    //   url: `${APIs.hostAPI}backoffice/wellness/getSleepValues/10`,
    //   headers: {
    //     'content-type': 'application/json',
    //     'x-auth-token': token
    //   }
    // })
    //   .then((response) => {
    //     setLoading(false)
    //     console.log('Sleep: ', response.data)
    //     if (response.data.length === 0) {
    //       console.log('noti: ', 'can not get data')
    //     } else {
    //       console.log('noti: ', 'data has been obtained')
    //       const getLast = response.data.last || []
    //       setSleep(getLast)
    //     }
    //   })
    //   .catch((error) => {
    //     setLoading(false)
    //     console.log(error)
    //   })
  }

  const renderListContent = () => {
    return (
      <View>
        <BoxTracking
          category={Translate(languageRedux).steps}
          timePerWeek="1 per week"
          iconName={'run'}
          onPress={() => {
            // NavigationService.navigate(Routes.STEPS_SCREEN)
          }}
          txtLastUpdate={(step || []).length > 0 ? `${Translate(languageRedux).LAST_UPDATAE_AT} ${step[0]?.date ?
            convertNumberToDDMMMYYYY(Number(step[0]?.date)) : ''}` : null}
        />
        <BoxTracking
          category={Translate(languageRedux).calories}
          timePerWeek="1 per week"
          iconName={'arm-flex'}
          onPress={() => {
            // NavigationService.navigate(Routes.CALORIES_SCREEN)
          }}
          txtLastUpdate={calories?.date ? `${Translate(languageRedux).LAST_UPDATAE_AT} ${calories?.date ?
            convertNumberToDDMMMYYYY(Number(calories?.date)) : ''}` : null}
        />
        <BoxTracking
          category={Translate(languageRedux).SONNO}
          timePerWeek="1 per week"
          iconName={'power-sleep'}
          onPress={() => {
            // NavigationService.navigate(Routes.SLEEP_SCREEN)
          }}
          txtLastUpdate={sleep?.date ? `${Translate(languageRedux).LAST_UPDATAE_AT} ${sleep?.date ?
            convertNumberToDDMMMYYYY(Number(sleep?.date)) : ''}` : null}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView>{renderListContent()}</ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15
  }
})
