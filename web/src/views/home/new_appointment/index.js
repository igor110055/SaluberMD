import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, Dimensions, RefreshControl, ScrollView } from 'react-native'

import * as APIs from '../../../apis'
import axios from 'axios'
// import { useSelector, useDispatch } from 'react-redux'

import { color0B40B1, color3777EE, color5C5D5E, colorDDDEE1, colorF0F0F0, colorF8F8F8, colorFFFFFF } from '../../../constants/colors'
import { customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'
import { convertDMMMYYYY, getDate112000 } from '../../../constants/DateHelpers'
import NavigationService from '../../../routes'
// import { saveLSSpeciality } from '../../../actions/common'
import Translate from '../../../translate'

import icHeader from '../../../../assets/images/header'
import icStatusBar from '../../../../assets/images/new_appointment'

import Header from '../../../components/Header'
// import CustomDatePicker from '../../../components/CustomDatePicker'
import LoadingView from '../../../components/LoadingView'
import WhoIsFor from './components/WhoIsFor'
import Description from './components/Description'
import ChooseSpeciality from './components/ChooseSpeciality'
import Provider from './components/Provider'
import Slot from './components/Slot'
import Confirm from './components/Confirm'
import { apiGetListSpecial } from './apis'
// import DialogCustom from '../../../components/DialogCustom'
import * as StateLocal from '../../../state_local'

export default function NewAppointment({ route }) {
  const tabsPassingData = route?.params?.tabs || 0
  const isMyChildPassing = route?.params?.isMyChild || null
  const nameChildPassing = route?.params?.nameChild || null
  const talkAbout = route?.params?.talkAbout || ''
  const birthdayChildPassing = route?.params?.birthdayChild || null
  const [indexTabs, setIndexTabs] = useState(tabsPassingData)
  const languageRedux = ''//useSelector(state => state.common.language)
  const getTitleNavi = `${Translate(languageRedux).NEW_APPOINTMENT} (${indexTabs + 1}/6)`
  const [isMyChild, setMyChild] = useState(isMyChildPassing)
  const [nameChild, setNameChild] = useState(nameChildPassing)
  const [birthdayChild, setBirthdayChild] = useState(birthdayChildPassing)
  const [description, setDescription] = useState(talkAbout)
  const [speciality, setSpeciality] = useState()
  const [provider, setProvider] = useState()
  const [slot, setSlot] = useState()
  const [requestDate, setRequestDate] = useState()
  const [session, setSession] = useState()
  const [checkRequest, setCheckRequest] = useState()
  const [isDialog, setDialog] = useState(false)

  const [refreshing, setRefresh] = useState(false)
  const [toggleReload, setToggleReload] = useState(1)
  const datePickerRef = React.createRef()
  const reportDatePickerRef = React.createRef()
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    callAPIListSpecial()
  }, [])

  useEffect(() => {
    console.log('name: ', nameChildPassing)
    console.log('Date: ', birthdayChildPassing)
    console.log('Des: ', talkAbout)
  }, [])

  const callAPIListSpecial = () => {
    apiGetListSpecial().then(async res => {
      if (res) {
        const parseData = await res.json()
        console.log('parseData: ', parseData)
        const getData = parseData?.specialization || []
        StateLocal.listSpeciality = getData
      }
    })
  }

  const renderStatusBar = () => {
    const lineColor = { borderColor: indexTabs - 1 >= 0 ? color3777EE : colorF0F0F0 }
    const marginLeft20 = { marginLeft: indexTabs - 1 >= 1 ? 0 : 20 }
    return (
      <View style={styles.ctnTopBar}>
        <View style={styles.ctnStatusBar}>
          <View style={[styles.ctnCircle, marginLeft20]}>
            {indexTabs - 1 >= 1 && (
              <View style={[styles.lineStyle, lineColor]} />
            )}
            {indexTabs === 0 && (
              <Image
                source={icStatusBar.ic_during_step}
                style={styles.iconStyle}
              />
            )}
            {indexTabs - 1 >= 0 && (
              <Image
                source={icStatusBar.ic_done_step}
                style={styles.iconStyle}
              />
            )}
            <View style={[styles.lineStyle2, lineColor]} />
          </View>
          <View style={styles.ctnCircle2}>
            {indexTabs === 0 && (
              <Image
                source={icStatusBar.ic_next_step}
                style={styles.iconStyle}
              />
            )}
            {indexTabs - 1 < 4 && indexTabs - 1 >= 0 && (
              <Image
                source={icStatusBar.ic_during_step}
                style={styles.iconStyle}
              />
            )}
            {indexTabs === 5 && (
              <Image
                source={icStatusBar.ic_done_step}
                style={styles.iconStyle}
              />
            )}
          </View>
          <View style={styles.ctnCircle3}>
            {indexTabs - 1 < 4 && <View style={styles.lineStyle2} />}
            {indexTabs === 5 && <View style={[styles.lineStyle2, lineColor]} />}
            {indexTabs - 1 < 4 && (
              <Image
                source={icStatusBar.ic_next_step}
                style={styles.iconStyle}
              />
            )}
            {indexTabs === 5 && (
              <Image
                source={icStatusBar.ic_during_step}
                style={styles.iconStyle}
              />
            )}
            {indexTabs - 1 < 3 && <View style={styles.lineStyle} />}
          </View>
        </View>
        {/* Name Step */}
        {renderNameStatusBar()}
      </View>
    )
  }

  const renderNameStatusBar = () => {
    if (indexTabs === 0) {
      return (
        <View style={styles.ctnTextBar}>
          <Text style={[customTxt(Fonts.SemiBold, 12, color5C5D5E).txt, styles.titleLeftStyle]}>
            {Translate(languageRedux).WHO_IS_FOR}
          </Text>
          <Text style={[customTxt(Fonts.SemiBold, 12, colorDDDEE1).txt, styles.titleCenterStyle]}>
            {Translate(languageRedux).description}
          </Text>
          <Text style={[customTxt(Fonts.SemiBold, 12, colorDDDEE1).txt, styles.titleRightStyle]}>
            {Translate(languageRedux).SPECIALITY}
          </Text>
        </View>
      )
    }
    if (indexTabs === 1) {
      return (
        <View style={styles.ctnTextBar}>
          <Text style={[customTxt(Fonts.SemiBold, 12, color5C5D5E).txt, styles.titleLeftStyle]}>
            {Translate(languageRedux).WHO_IS_FOR}
          </Text>
          <Text style={[customTxt(Fonts.SemiBold, 12, color5C5D5E).txt, styles.titleCenterStyle]}>
            {Translate(languageRedux).description}
          </Text>
          <Text style={[customTxt(Fonts.SemiBold, 12, colorDDDEE1).txt, styles.titleRightStyle]}>
            {Translate(languageRedux).SPECIALITY}
          </Text>
        </View>
      )
    }
    if (indexTabs === 2) {
      return (
        <View style={styles.ctnTextBar}>
          <Text style={[customTxt(Fonts.SemiBold, 12, color5C5D5E).txt, styles.titleLeftStyle]}>
            {Translate(languageRedux).description}
          </Text>
          <Text style={[customTxt(Fonts.SemiBold, 12, color5C5D5E).txt, styles.titleCenterStyle]}>
            {Translate(languageRedux).SPECIALITY}
          </Text>
          <Text style={[customTxt(Fonts.SemiBold, 12, colorDDDEE1).txt, styles.titleRightStyle]}>
            {Translate(languageRedux).PROVIDER}
          </Text>
        </View>
      )
    }
    if (indexTabs === 3) {
      return (
        <View style={styles.ctnTextBar}>
          <Text style={[customTxt(Fonts.SemiBold, 12, color5C5D5E).txt, styles.titleLeftStyle]}>
            {Translate(languageRedux).SPECIALITY}
          </Text>
          <Text style={[customTxt(Fonts.SemiBold, 12, color5C5D5E).txt, styles.titleCenterStyle]}>
            {Translate(languageRedux).PROVIDER}
          </Text>
          <Text style={[customTxt(Fonts.SemiBold, 12, colorDDDEE1).txt, styles.titleRightStyle]}>
            {Translate(languageRedux).SLOT}
          </Text>
        </View>
      )
    }
    if (indexTabs === 4) {
      return (
        <View style={styles.ctnTextBar}>
          <Text style={[customTxt(Fonts.SemiBold, 12, color5C5D5E).txt, styles.titleLeftStyle]}>
            {Translate(languageRedux).PROVIDER}
          </Text>
          <Text style={[customTxt(Fonts.SemiBold, 12, color5C5D5E).txt, styles.titleCenterStyle]}>
            {Translate(languageRedux).SLOT}
          </Text>
          <Text style={[customTxt(Fonts.SemiBold, 12, colorDDDEE1).txt, styles.titleRightStyle]}>
            {Translate(languageRedux).CONFIRM}
          </Text>
        </View>
      )
    }
    if (indexTabs === 5) {
      return (
        <View style={styles.ctnTextBar}>
          <Text style={[customTxt(Fonts.SemiBold, 12, color5C5D5E).txt, styles.titleLeftStyle]}>
            {Translate(languageRedux).PROVIDER}
          </Text>
          <Text style={[customTxt(Fonts.SemiBold, 12, color5C5D5E).txt, styles.titleCenterStyle]}>
            {Translate(languageRedux).SLOT}
          </Text>
          <Text style={[customTxt(Fonts.SemiBold, 12, color5C5D5E).txt, styles.titleRightStyle]}>
            {Translate(languageRedux).CONFIRM}
          </Text>
        </View>
      )
    }
  }

  const rendernContent = () => {
    switch (indexTabs) {
      case 0:
        return (
          <WhoIsFor
            value={isMyChild}
            setValue={val => {
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
        )
      case 1:
        return (
          <Description
            value={description}
            setValue={val => {
              setDescription(val)
            }}
            onPressNext={_onPressNextTabs}
          />
        )
      case 2:
        return (
          <ChooseSpeciality
            onPressNext={_onPressNextTabs}
            valueSpeciality={speciality}
            setValueSpeciality={setSpeciality}
          />
        )
      case 3:
        return (
          <Provider
            onPressNext={_onPressNextTabs}
            valueDoctor={provider}
            setValueDoctor={setProvider}
            specialityID={speciality?.id}
            specialityName={speciality?.name}
            toggleReload={toggleReload}
            date={requestDate}
            setDate={(val) => setRequestDate(val)}
            onPressCalendar={_onPressRequestDate}
            valueSession={session}
            setValueSession={(val) => setSession(val)}
            onPressNextRequest={_onPressNextRequest}
            setCheckRequest={(val) => setCheckRequest(val)}
            setLoad={(val) => setLoading(val)}
          />
        )
      case 4:
        return (
          <Slot
            onPressNext={_onPressNextTabs}
            valueTime={slot}
            setValueTime={setSlot}
            doctorID={provider?.id}
            setLoad={(val) => setLoading(val)}
            toggleReload={toggleReload}
          />
        )
      case 5:
        return (
          <Confirm
            specialityName={speciality?.name}
            doctorName={provider?.nome + ' ' + provider?.cognome}
            date={convertDMMMYYYY(slot?.endsAt)}
            timeStart={slot?.startsAt}
            timeEnd={slot?.endsAt}
            description={description}
            checkRequest={checkRequest}
            timeStartRequest={session?.timeStart}
            timeEndRequest={session?.timeEnd}
            dateRequest={requestDate}
            specialityID={speciality?.id}
            slotID={slot?.id}
            doctorID={provider?.id}
            timeSlot={slot?.timeSlot}
            daySliceId={session?.daySliceId}
            onPressConfirm={_onPressConfirm}
            forWho={isMyChild}
            childName={nameChild}
            childBirthdate={birthdayChild}
          />
        )
    }
  }

  const _onPressBirthday = () => {
    datePickerRef.current.onPressDate()
  }

  const _onPressRequestDate = () => {
    reportDatePickerRef.current.onPressDate()
  }

  const _onPressNextTabs = () => {
    setTimeout(() => {
      setIndexTabs(indexTabs + 1)
    }, 500)
  }

  const _onPressConfirm = () => {
    setIndexTabs(0)
    setMyChild(null)
    setNameChild()
    setBirthdayChild()
    setDescription()
    setSpeciality()
    setCheckRequest()
    setRequestDate()
    setSession()
    setProvider()
    setSlot()
  }

  const _onPressNextRequest = () => {
    setTimeout(() => {
      setIndexTabs(indexTabs + 2)
    }, 500)
  }

  const _onRefresh = () => {
    setRefresh(true)
    setToggleReload(Math.random())
    setTimeout(() => {
      setRefresh(false)
    }, 3000)
  }

  const _onChangeDatePicker = date => {
    setBirthdayChild(date)
  }

  const _onChangeReportDatePicker = date => {
    setRequestDate(date)
  }

  const _onPressBack = () => {
    if (indexTabs === 0) {
      return
    }
    if ((indexTabs - 1) === 0) {
      // setMyChild(null)
      // setNameChild()
      // setBirthdayChild()
      // setDescription()
    }
    else if ((indexTabs - 1) === 1) {
      // setDescription()
    }
    else if ((indexTabs - 1) === 2) {
      // setSpeciality()
      // setCheckRequest()
      // setRequestDate()
      // setSession()
    }
    else if ((indexTabs - 1) === 3) {
      // setProvider()
    }
    else if ((indexTabs - 1) === 4) {
      // setSlot()
    }
    return checkRequestTab()
  }

  const checkRequestTab = () => {
    if ((indexTabs - 1) === 4 && checkRequest === 1) {
      setIndexTabs(indexTabs - 2)
    } else {
      setIndexTabs(indexTabs - 1)
    }
  }

  const _onPressCancelExit = () => {
    setDialog(false)
  }

  const _onPressExit = () => {
    NavigationService.goBack()
  }

  const _onPressRight = () => {
    if (indexTabs === 0) {
      NavigationService.goBack()
    } else {
      setDialog(true)
    }
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={getTitleNavi}
        textRight={Translate(languageRedux).CANCEL_BTN}
        textRightColor={color3777EE}
        onPressRight={_onPressRight}
        iconLeft={indexTabs === 0 ? null : icHeader.ic_left}
        onPressLeft={_onPressBack}
      />
      {renderStatusBar()}
      <ScrollView>
        {rendernContent()}
      </ScrollView>
      {/* <CustomDatePicker
        refDatePicker={datePickerRef}
        onChangeDate={_onChangeDatePicker}
        maxDate={new Date()}
        date={birthdayChild || getDate112000()}
      />
      <CustomDatePicker
        refDatePicker={reportDatePickerRef}
        onChangeDate={_onChangeReportDatePicker}
        date={requestDate}
        minDate={new Date()}
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
      {isLoading && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: colorF8F8F8
  },
  ctnTopBar: {
    height: 80,
    backgroundColor: colorFFFFFF
  },
  ctnStatusBar: {
    flexDirection: 'row',
    width: Dimensions.get('window').width
  },
  ctnTextBar: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 8
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  ctnCircle: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  ctnCircle2: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  ctnCircle3: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  lineStyle: {
    height: 1,
    width: 20,
    borderWidth: 1,
    borderColor: colorF0F0F0
  },
  lineStyle2: {
    height: 1,
    width: (Dimensions.get('window').width - 112) / 2,
    borderWidth: 1,
    borderColor: colorF0F0F0
  },
  containerBox: {
    flex: 1,
    backgroundColor: colorFFFFFF,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9
  },
  title: {
    marginTop: 16,
    marginHorizontal: 16
  },
  descriptionRadio: {
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 24
  },
  marginB16: {
    marginBottom: 16
  },
  ctnInputMyChild: {
    marginHorizontal: 16,
    backgroundColor: colorFFFFFF
  },
  layoutNetxtBtn: {
    marginTop: 16,
    alignItems: 'flex-end',
    marginBottom: 16
  },
  netxBtn: {
    height: 48,
    width: 117,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12
  },
  descriptionInput: {
    height: 144,
    width: '100%',
    borderRadius: 12,
    borderWidth: 1
  },
  marginH16: {
    marginHorizontal: 16,
    marginTop: 24
  },
  textInput: {
    paddingHorizontal: 16,
    paddingTop: 12
  },
  marginR16: {
    marginRight: 16
  },
  titleLeftStyle: {
    flex: 1,
    marginLeft: 20
  },
  titleCenterStyle: {
    flex: 1,
    textAlign: 'center'
  },
  titleRightStyle: {
    flex: 1,
    marginRight: 20,
    textAlign: 'right'
  }
})
