import React, { useState } from 'react'
import {
  StyleSheet, View, ScrollView, Dimensions, TouchableOpacity, Text
} from 'react-native'
import { useSelector } from 'react-redux'
// import CustomDatePicker from '../../../components/CustomDatePicker'
import Header from '../../../components/Header'
import { color0B40B1, color3777EE, colorF8F8F8, colorFFFFFF } from '../../../constants/colors'
import { getDate112000 } from '../../../constants/DateHelpers'
import NavigationService from '../../../routes'
import Translate from '../../../translate'
import CustomLineTabs from './component_direct_call/CustomLineTabs'
import Step1View from './direct_call_tabs/Step1View'
import Step2View from './direct_call_tabs/Step2View'
import imgHeader from '../../../../assets/images/header'
import Step3View from './direct_call_tabs/Step3View'
// import DialogCustom from '../../../components/DialogCustom'
import Step4View from './direct_call_tabs/Step4View'
import SearchingForDoctorView from './SearchingForDoctorView'
import LoadingView from '../../../components/LoadingView'
import Routes from '../../../routes/Routes'
// import { dispatch } from 'jest-circus/build/state'
// import { apiGetCheckPayment } from 'api/Payment'

export default function VisitsDirectCallView({ navigation }) {
  const languageRedux = 'en_US'//useSelector(state => state.common.language)
  const [indexTabs, setIndexTabs] = useState(0)
  const lsTabs = [
    Translate(languageRedux).WHO_IS_FOR,
    Translate(languageRedux).description,
    Translate(languageRedux).PROVIDER,
    Translate(languageRedux).CONFIRM
  ]
  const getTitleNavi = `${Translate(languageRedux).direct_call} (${indexTabs + 1}/4)`
  const [isMyChild, setMyChild] = useState(null)
  const [nameChild, setNameChild] = useState()
  const [birthdayChild, setBirthdayChild] = useState()
  const datePickerRef = React.createRef()
  const [talkAbout, setTalkAbout] = useState()
  const [indexProvider, setIndexProvider] = useState(0)
  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)
  const [doctor, setDoctor] = useState()
  const [isDialog, setDialog] = useState(false)
  const [isDialogSearching, setDialogSearching] = useState(false)
  const [lsDoctor, setLsDoctor] = useState([])
  const [isLoading, setLoading] = useState()

  const _onPressPreviewNavi = () => {
    if (indexTabs === 0) {
      return
    }
    return setIndexTabs(indexTabs - 1)
  }

  const _onPressRightNavi = () => {
    if (indexTabs === 0) {
      return NavigationService.goBack()
    }
    setDialog(true)
  }

  const _onPressBirthday = () => {
    datePickerRef.current.onPressDate()
  }

  const _onPressNextTabs = () => {
    setTimeout(() => {
      setIndexTabs(indexTabs + 1)
    }, 500)
  }

  const callAPICheckPayment = () => {
    // NavigationService.navigate(Routes.PAYMENT_SCREEN)
    // dispatch(apiGetCheckPayment())
  }

  const _onPressConfirm = () => {
    setDialogSearching(true)
  }


  const renderContent = () => {
    switch (indexTabs) {
      case 0:
        return <Step1View
          value={isMyChild}
          setValue={(val) => {
            setMyChild(val)
            if (!val) {
              setNameChild()
              setBirthdayChild()
              _onPressNextTabs()
            }
          }}
          name={nameChild}
          setName={setNameChild}
          onPressBirthday={_onPressBirthday}
          birthday={birthdayChild}
          onPressNext={_onPressNextTabs}
        />
      case 1:
        return <Step2View
          value={talkAbout}
          setValue={(val) => {
            setTalkAbout(val)
          }}
          onPressNext={_onPressNextTabs}
          setLoading={(val) => setLoading(val)}
        />
      case 2:
        return <Step3View
          value={indexProvider}
          setValue={(val) => {
            setIndexProvider(val)
          }}
          onPressNext={() => {}}
          refreshing={refreshing}
          setRefresh={(val) => setRefresh(val)}
          toggleReload={toggleReload}
          valueDoctor={doctor}
          setValueDoctor={(val) => {
            console.log('val: ', val)
            if (val?.valuePricing !== '0.00') {
              // NavigationService.navigate(Routes.PAYMENT_SCREEN, {doctor: val})
            } else {
              setDoctor(val)
              _onPressNextTabs()
            }
          }}
          setLsDoctor={(val) => setLsDoctor(val)}
          setLoading={(val) => setLoading(val)}
        />
      case 3:
        return <Step4View
          valueDoctor={doctor}
          valueTalkAbout={talkAbout}
          onPress={_onPressConfirm}
        />
      default:
        return null
    }
  }

  const _onChangeDatePicker = (date) => {
    setBirthdayChild(date)
  }

  const _onRefresh = () => {
    setRefresh(true)
    setToggleReload(Math.random())
  }

  const _onPressCancelExit = () => {
    setDialog(false)
  }

  const _onPressExit = () => {
    // NavigationService.goBack()
  }

  // const _onPressAnamnesis = (DoctorCallBack) => {
  //   NavigationService.navigate(Routes.ANAMNESIS_SCREEN, {
  //     nameChild: nameChild,
  //     birthdayChild: birthdayChild,
  //     talkAbout: talkAbout,
  //     dataDoc: DoctorCallBack,
  //     viewType: Routes.ANAMNESIS_SCREEN
  //   })
  // }

  const _onPressVideoCall = (valueVideoCall, valDoc) => {
    return navigation.navigate(Routes.DIRECT_CALL_WEB_SCREEN)
  }

  return (
    <View style={styles.container}>
      <Header
        textCenter={getTitleNavi}
        backgroundColor={colorFFFFFF}
        iconLeft={indexTabs === 0 ? null : imgHeader.ic_left}
        onPressLeft={_onPressPreviewNavi}
        textRight={Translate(languageRedux).CANCEL_BTN}
        textRightColor={color3777EE}
        onPressRight={_onPressRightNavi}
      />
      <CustomLineTabs
        index={indexTabs}
        listTabs={lsTabs}
      />
      <ScrollView>
        {renderContent()}
      </ScrollView>
      {/* <CustomDatePicker
        refDatePicker={datePickerRef}
        onChangeDate={_onChangeDatePicker}
        maxDate={new Date()}
        date={birthdayChild || getDate112000()}
      /> */}
      {/* {
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
      } */}
      {
        isDialogSearching && (
          <SearchingForDoctorView
            isMyChild={isMyChild}
            doctor={doctor}
            lsDoctor={lsDoctor}
            typeFreeView={indexProvider === 1}
            setDialog={(val) => {
              setDialogSearching(val)
              if (!val) {
                setDialog(true)
              }
            }}
            onPressVideoCall={() => {
              _onPressVideoCall()
              NavigationService.navigate(Routes.DIRECT_CALL_WEB_SCREEN)
            }}
            nameChild={nameChild}
            birthdayChild={birthdayChild}
            talkAbout={talkAbout}
            onPressDismiss={() => {
              NavigationService.navigate(Routes.DIRECT_CALL_WEB_SCREEN)
            }}
          />
        )
      }
      <TouchableOpacity onPress={() => {
        NavigationService.navigate(Routes.DIRECT_CALL_WEB_SCREEN)
      }}>
        <Text>video call view</Text>
      </TouchableOpacity>
      {isLoading && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: colorF8F8F8
  }
})
