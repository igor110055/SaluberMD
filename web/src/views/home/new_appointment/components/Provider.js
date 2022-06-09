import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native'

// import * as APIs from '../../../../apis'
import axios from 'axios'
import moment from 'moment'
import { useSelector } from 'react-redux'

import { color040404, color333333, color3777EE, color5C5D5E, colorDDDEE1, colorF8F8F8, colorFFFFFF } from '../../../../constants/colors'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import { convertCalenderDMMM, convertNumberTime12, convertDMMMYYYY } from '../../../../constants/DateHelpers'
import Translate from '../../../../translate'

import icDoc from '../../../../../assets/images/document'

import CustomTextInput from '../../../healthProfile/components/CustomTextInput'
import CustomNextBT from '../../direct_call/component_direct_call/CustomNextBT'
import { apiGetFindoctor, apiGetFindslotTimezone } from '../../../visit/apis'

export default function Provider({
  specialityID, specialityName, setValueDoctor, valueDoctor,
  onPressNext, toggleReload, date, onPressCalendar, setDate,
  valueSession, setValueSession, onPressNextRequest, setCheckRequest,
  setLoad
}) {
  const [lsDoctor, setLSDoctor] = useState([])
  const [lsSlot, setLSSlot] = useState([])
  const [doctorID, setDoctorID] = useState()
  const languageRedux = 'en_US'//useSelector(state => state.common.language)
  const [show, setShow] = useState(false)

  useEffect(() => {
    callAPIDoctorBySpeciality()
    callAPISlotOfDoctor()
  }, [toggleReload, doctorID])

  const callAPIDoctorBySpeciality = () => {
    setLoad(true)
    apiGetFindoctor(specialityID).then(async res => {
      if (res) {
        const parseData = await res.json()
        const getData = parseData?.dottori || []
        setLoad(false)
        setShow(true)
        if ((getData || []).length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          if (getData.length > 0) {
            setLSDoctor(getData)
          }
        }
      }
    }).catch(error => {
      setLoad(false)
      console.log(error)
    })
  }

  const callAPISlotOfDoctor = () => {
    setLoad(true)
    if (!doctorID) { return }
    apiGetFindslotTimezone(doctorID, (new Date()).getTimezoneOffset()).then(async res => {
      setLoad(false)
      const parseData = await res.json()
      console.log('data: ', parseData)
      if ((parseData || []).length === 0) {
        console.log('noti: ', 'can not get data')
      } else {
        console.log('noti: ', 'data has been obtained')
        const getList = parseData?.slots || []
        if (getList.length > 0) {
          setLSSlot(getList)
        }
      }
    }).catch(error => {
      setLoad(false)
      console.log(error)
    })
  }

  const RenderItem = ({ item, index }) => {

    const name = item.nome ? item.nome : ''
    const lastName = item.cognome ? item.cognome : ''
    const doctorName = 'Doc. ' + name + ' ' + lastName
    setDoctorID(item.id)

    const isActiveDoctor = () => {
      return item === valueDoctor
    }

    var dn = moment().format('D')
    var mn = moment().format('M')
    var d = moment(lsSlot[0]?.startsAt).format('D')
    var m = moment(lsSlot[0]?.startsAt).format('M')
    const earliestDate = lsSlot[0]?.startsAt ? convertCalenderDMMM(lsSlot[0]?.startsAt) : ''
    const checkDay = () => {
      if (mn === m) {
        if (d - dn === 1) {
          return (
            <Text style={[customTxt(Fonts.Regular, 12).txt, colorTextSpeciality]}>Tomorrow, {earliestDate}</Text>
          )
        }
        if (d - dn === 0) {
          return <Text style={[customTxt(Fonts.Regular, 12).txt, colorTextSpeciality]}>Today, {earliestDate}</Text>
        } else {
          return <Text style={[customTxt(Fonts.Regular, 12).txt, colorTextSpeciality]}>{earliestDate}</Text>
        }
      }
    }

    const renderTimeSlot = () => {
      const convertTimeStart1 = lsSlot[0]?.startsAt ? convertNumberTime12(lsSlot[0]?.startsAt) : ''
      const convertTimeStart2 = lsSlot[1]?.startsAt ? convertNumberTime12(lsSlot[1]?.startsAt) : ''
      const convertTimeStart3 = lsSlot[2]?.startsAt ? convertNumberTime12(lsSlot[2]?.startsAt) : ''
      return (
        <View style={styles.flexRow}>
          {lsSlot[0] && <TouchableOpacity style={[styles.boxTimeSlot, colorBorderTimeSlot]}>
            <View style={styles.marginHori16}>
              <Text style={[customTxt(Fonts.SemiBold, 12).txt, colorTextTimeSlot]}>
                {convertTimeStart1}
              </Text>
            </View>
          </TouchableOpacity>}
          <View style={styles.marginR8} />
          {lsSlot[1] && <TouchableOpacity style={[styles.boxTimeSlot, colorBorderTimeSlot]}>
            <View style={styles.marginHori16}>
              <Text style={[customTxt(Fonts.SemiBold, 12).txt, colorTextTimeSlot]}>
                {convertTimeStart2}
              </Text>
            </View>
          </TouchableOpacity>}
          <View style={styles.marginR8} />
          {lsSlot[2] && <TouchableOpacity style={[styles.boxTimeSlot, colorBorderTimeSlot]}>
            <View style={styles.marginHori16}>
              <Text style={[customTxt(Fonts.SemiBold, 12).txt, colorTextTimeSlot]}>
                {convertTimeStart3}
              </Text>
            </View>
          </TouchableOpacity>}
          <View style={styles.marginR8} />
          {lsSlot[3] && <TouchableOpacity style={[styles.boxTimeSlot, colorBorderTimeSlot]}>
            <View style={styles.marginHori16}>
              <Text style={[customTxt(Fonts.SemiBold, 12).txt, colorTextTimeSlot]}>
                More
              </Text>
            </View>
          </TouchableOpacity>}
        </View>
      )
    }

    const colorTextDocName = { color: isActiveDoctor() ? colorFFFFFF : color040404 }
    const colorTextSpeciality = { color: isActiveDoctor() ? colorFFFFFF : color5C5D5E }
    const colorTextTimeSlot = { color: isActiveDoctor() ? colorFFFFFF : color3777EE }
    const colorBorderTimeSlot = { borderColor: isActiveDoctor() ? colorFFFFFF : color3777EE }

    return (
      <View>
        <TouchableOpacity onPress={() => {
          setValueDoctor(item)
          onPressNext()
        }} style={isActiveDoctor() ? styles.boxAlready2 : styles.boxAlready1}>
          <View style={styles.marginHori16}>
            <View style={styles.docName}>
              <Text style={[customTxt(Fonts.SemiBold, 16).txt, colorTextDocName]}>
                {doctorName}
              </Text>
            </View>
            <Text style={[customTxt(Fonts.SemiBold, 12).txt, colorTextSpeciality]}>
              {specialityName}
            </Text>
            <View style={styles.nextTime}>
              <Text style={[customTxt(Fonts.Regular, 12).txt, colorTextSpeciality]}>
                {Translate(languageRedux).NEXT_AVAILABILITIES}: {checkDay()}
              </Text>
            </View>
            <View style={styles.timeSlots}>
              {renderTimeSlot()}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const renderAlreadyConsulted = () => {
    return (
      <View>
        <ScrollView>
          <View style={styles.title}>
            <Text style={customTxt(Fonts.SemiBold, 18, color333333).txt}>
              {Translate(languageRedux).CHOOSE_A_PROVIDER}
            </Text>
          </View>
          <View style={styles.descriptionRadio}>
            <Text style={customTxt(Fonts.Regular, 16, color5C5D5E).txt}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.
            </Text>
          </View>
        </ScrollView>
        <View style={styles.ctnAlready}>
          <Text style={customTxt(Fonts.SemiBold, 14, color040404).txt}>
            List Of Doctor
          </Text>
          <FlatList
            data={lsDoctor}
            extraData={toggleReload}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <RenderItem item={item} index={index} />
            )}
          />
        </View>
      </View>
    )
  }

  const data = [
    {
      'id': 0,
      'session': Translate(languageRedux).IN_THE_MORNING,
      'timeStart': '8:00',
      'timeEnd': '12:59',
      'daySliceId': 1
    },
    {
      'id': 1,
      'session': Translate(languageRedux).IN_THE_AFTERNOON,
      'timeStart': '13:00',
      'timeEnd': '19:59',
      'daySliceId': 2
    },
    {
      'id': 2,
      'session': Translate(languageRedux).OVERTIME,
      'timeStart': '20:00',
      'timeEnd': '7:59',
      'daySliceId': 3
    }
  ]

  const renderBoxSlotRequest = () => {
    const RenderItem = ({ item, index }) => {
      const isActiveDoctor = () => {
        return item?.id === valueSession?.id
      }
      const colorTextSession = { color: isActiveDoctor() ? colorFFFFFF : color040404 }
      const colorTextTime = { color: isActiveDoctor() ? colorFFFFFF : color5C5D5E }
      return (
        <View>
          <TouchableOpacity onPress={() => { setValueSession(item) }}
            style={isActiveDoctor() ? styles.boxSlotRequest2 : styles.boxSlotRequest1}>
            <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, colorTextSession, styles.txtSession]}>{item.session}</Text>
            <View style={styles.timeSlice}>
              <Text style={[customTxt(Fonts.Regular, 12, color5C5D5E).txt, colorTextTime]}>{item?.timeStart}{' - '}</Text>
              <Text style={[customTxt(Fonts.Regular, 12, color5C5D5E).txt, colorTextTime]}>{item?.timeEnd}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <View style={styles.ctnSession}>
        <FlatList
          data={data}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderNoDoctorAvailable = () => {
    return (
      <View>
        <View style={styles.title}>
          <Text style={customTxt(Fonts.SemiBold, 18, color333333).txt}>
            {Translate(languageRedux).NO_DOCTOR_AVAILABLE}
          </Text>
        </View>
        <View style={styles.descriptionRadio}>
          <Text style={customTxt(Fonts.Regular, 16, color5C5D5E).txt}>
            {Translate(languageRedux).NO_DOCTOR_DESCRIPTION}
          </Text>
        </View>
        <View style={styles.chooseSession}>
          <CustomTextInput
            title={Translate(languageRedux).CHOOSE_YOUR_AVAILABILITY}
            value={date ? convertDMMMYYYY(date) : ''}
            onChangeTxt={txt => setDate(txt)}
            validate={date ? false : true}
            iconRight={icDoc.ic_choose_date}
            onPress={onPressCalendar}
            placeholder={'Select Date'}
          />
        </View>
        {renderBoxSlotRequest()}
        <View style={styles.nextButton}>
          <CustomNextBT
            textButton={'Next'}
            isActive={valueSession && date}
            onPress={() => {
              if (valueSession && date) {
                onPressNextRequest()
                setCheckRequest(1)
              }
            }}
          />
        </View>
      </View>
    )
  }

  const checkProvider = () => {
    if (lsDoctor.length > 0) {
      return <View>{show && renderAlreadyConsulted()}</View>
    } else {
      return <View>{show && renderNoDoctorAvailable()}</View>
    }
  }

  return (
    <ScrollView style={styles.containerBox}>
      {checkProvider()}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  containerBox: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: colorFFFFFF,
    marginTop: 20,
    marginBottom: 42,
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
  ctnAlready: {
    marginHorizontal: 16
  },
  marginHori16: {
    marginHorizontal: 16
  },
  boxAlready1: {
    height: 136,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colorDDDEE1
  },
  boxAlready2: {
    height: 136,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: color3777EE,
    backgroundColor: color3777EE
  },
  docName: {
    marginTop: 16,
    marginBottom: 4
  },
  nextTime: {
    marginTop: 12
  },
  timeSlots: {
    marginTop: 8
  },
  boxTimeSlot: {
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: color3777EE
  },
  marginR8: {
    marginRight: 8
  },
  flexRow: {
    flexDirection: 'row'
  },
  chooseSession: {
    marginHorizontal: 16,
    marginBottom: 16
  },
  boxSlotRequest1: {
    height: 76,
    width: 95,
    borderRadius: 12,
    backgroundColor: colorF8F8F8,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  boxSlotRequest2: {
    height: 76,
    width: 95,
    borderRadius: 12,
    backgroundColor: color3777EE,
    borderWidth: 1,
    borderColor: color3777EE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  txtSession: {
    marginBottom: 4
  },
  ctnSession: {
    alignItems: 'center'
  },
  nextButton: {
    marginRight: 16,
    marginBottom: 16
  },
  timeSlice: {
    flexDirection: 'row'
  }
})
