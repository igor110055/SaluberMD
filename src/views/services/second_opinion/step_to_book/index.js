import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, Dimensions, Image} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'

import {colorF8F8F8} from 'constants/colors'
import Translate from '../../../../translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import NavigationService from 'navigation'
import { getDate112000 } from 'constants/DateHelpers'
import { saveLSSpeciality } from 'actions/common'

import CustomDatePicker from 'components/CustomDatePicker'
import LoadingView from 'components/LoadingView'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'
import Step6 from './Step6'
import Routes from 'navigation/Routes'

export default function BookSecondOpinion() {
  const languageRedux = useSelector(state => state.common.language)
  const [isMyChild, setMyChild] = useState(null)
  const [nameChild, setNameChild] = useState()
  const [birthdayChild, setBirthdayChild] = useState()
  const [speciality, setSpeciality] = useState()
  const [descriptipn, setDescription] = useState()
  const [dataFile, setDataFile] = useState([])
  const datePickerRef = React.createRef()
  const token = useSelector(state => state.user.token)
  const dispatch = useDispatch()
  const [isLoad, setLoading] = useState(true)
  const [summary, setSummary] = useState(false)
  const [listSpecial, setListSpecial] = useState()

  useEffect(() => {
    callAPIListSpecial()
  }, [])

  const callAPIListSpecial = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/findspeciality`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        console.log('listSpecial: ', response.data)
        if (response.data.length === 0) {
          console.log('specailization: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.specialization || []
          if (getList.length > 0) {
            Promise.all([dispatch(saveLSSpeciality(getList))])
            setListSpecial(getList)
            setLoading(false)
          }
        }
      })
      .catch(error => {
        setLoading(false)
        console.log(error)
      })
  }

  const renderBody = () => {
    return (
      <View>
        <Step1
          value={isMyChild}
          setValue={val => {
            setMyChild(val)
            if (!val) {
              setNameChild()
              setBirthdayChild()
            }
          }}
          name={nameChild}
          setName={setNameChild}
          onPressBirthday={_onPressBirthday}
          birthday={birthdayChild}
        />
        <Step2
          valueSpeciality={speciality}
          setValueSpeciality={setSpeciality}
          listSpecial={listSpecial}
        />
        <Step3 />
        <Step4
          setListDataFile={setDataFile}
          listDataFile={dataFile}
        />
        <Step5
          value={descriptipn}
          setValue={(val) => setDescription(val)}
          subject={isMyChild}
          childname={nameChild}
          childbirthdate={birthdayChild}
          specializationID={speciality?.id}
          getSpecialName={speciality}
          files={dataFile}
          onPressNext={_onPressNext}
        />
        {summary &&
        <Step6
          subject={isMyChild}
          childname={nameChild}
          childbirthdate={birthdayChild}
          specializationID={speciality?.id}
          getSpecialName={speciality}
          question={descriptipn}
          files={dataFile}
        />
        }
      </View>
    )
  }

  const _onPressNext = () => {
    NavigationService.navigate(Routes.SUMMARY_2_OPINION_RQ_SCREEN, {
      data: {
        subject: isMyChild,
        childname: nameChild,
        childbirthdate: birthdayChild,
        specializationID: speciality?.id,
        getSpecialName: speciality,
        question: descriptipn,
        files: dataFile
      }
    })
  }

  const _onPressBirthday = () => {
    datePickerRef.current.onPressDate()
  }

  const _onChangeDatePicker = date => {
    setBirthdayChild(date)
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        {renderBody()}
      </KeyboardAwareScrollView>
      <CustomDatePicker
        refDatePicker={datePickerRef}
        onChangeDate={_onChangeDatePicker}
        maxDate={new Date()}
        date={birthdayChild || getDate112000()}
      />
      {isLoad && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  shadow: {
    shadowColor: '#3777EE',
    shadowOffset: {
      width: 0,
      height: 20
    },
    shadowOpacity: 0.08,
    shadowRadius: 40,
    elevation: 9
  }
})
