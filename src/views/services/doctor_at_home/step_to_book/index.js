import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { colorF8F8F8 } from 'constants/colors'
import Translate from '../../../../translate'
import NavigationService from 'navigation'
import { getDate112000 } from 'constants/DateHelpers'
import { apiGetUserInfo } from 'api/Auth'
import { saveUserinfo } from 'actions/user'

import CustomDatePicker from 'components/CustomDatePicker'
import LoadingView from 'components/LoadingView'
import SearchListWithName from 'components/SearchListWithName'
import DialogCustom from 'components/DialogCustom'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'

export default function BookDoctorAtHome() {
  const languageRedux = useSelector(state => state.common.language)
  const [isMyChild, setMyChild] = useState(null)
  const [nameChild, setNameChild] = useState()
  const [birthdayChild, setBirthdayChild] = useState()
  const [assistanceType, setAssistanceType] = useState()
  const [description, setDescription] = useState()
  const [isLoad, setLoading] = useState(false)
  const [isShowCountry, setShowCountry] = useState(false)
  const lsCountryRedux = useSelector(state => state.common.country)
  const [country, setCountry] = useState()
  const datePickerRef = React.createRef()
  const dispatch = useDispatch()
  const [userInfo, setUserInfo] = useState([])
  const [isDialog, setDialog] = useState(false)

  useEffect(() => {
    callAPIGetUserinfo()
  }, [])

  useEffect(() => {
    convertCountry()
  }, [userInfo])

  const callAPIGetUserinfo = () => {
    setLoading(true)
    dispatch(apiGetUserInfo()).then(res => {
        console.log('res:', res.payload)
        const getuserInfo = res?.payload?.user
        if (getuserInfo) {
          setUserInfo(getuserInfo)
          Promise.all([
            dispatch(saveUserinfo(getuserInfo))
          ])
        }
        setLoading(false)
    }).catch(err => {
        console.log('err: ', err)
        setLoading(false)
    })
  }

  const convertCountry = () => {
    var i = lsCountryRedux.filter((val) => val.value === userInfo?.country)
    if (i.length > 0) {
        setCountry(i[0].text)
    }
    if (i.length < 0) {
        setCountry('')
    }
  }

  const renderBody = () => {
    return (
      <View style={styles.shadow}>
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
          valueSpeciality={assistanceType}
          setValueSpeciality={setAssistanceType}
        />
        <Step3
          value={description}
          setValue={val => {
            setDescription(val)
          }}
        />
        <Step4
          setLoading={(val) => setLoading(val)}
          setShowCountry={(val) => setShowCountry(val)}
          country={country || country?.text}
          setCountry={(val) => setCountry(val)}
          subject={isMyChild}
          doctorType={assistanceType?.id}
          description={description}
          countryValue={country?.value}
        />
      </View>
    )
  }

  const _onPressBirthday = () => {
    datePickerRef.current.onPressDate()
  }

  const _onChangeDatePicker = date => {
    setBirthdayChild(date)
  }

  const _onPressCancelExit = () => {
    setDialog(false)
  }

  const _onPressExit = () => {
    NavigationService.goBack()
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
      {isShowCountry && (
        <SearchListWithName
          listData={lsCountryRedux}
          title={Translate(languageRedux).CHOOSE_COUNTRY}
          itemSelected={country}
          onItemClick={val => {
            setCountry(val?.text)
            setShowCountry(false)
          }}
          onPressRight={() => {
            setShowCountry(false)
          }}
          isText={true}
        />
      )}
      {
        isDialog && (
          <DialogCustom
            title={Translate(languageRedux).ARE_YOU_SURE_TO_EXIT}
            content={Translate(languageRedux).ALL_INFO_ENTERED_WILL_BE_DELETED}
            txtlLeft={Translate(languageRedux).cancel}
            onPressCancel={_onPressCancelExit}
            txtRight={Translate(languageRedux).CONFIRM}
            onPressOK={_onPressExit}
          />
        )
      }
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
