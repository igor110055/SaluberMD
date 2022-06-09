import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView,
  Linking, Platform, DeviceEventEmitter, Image, TouchableOpacity, FlatList } from 'react-native'
import * as APIs from '../../api/APIs'
import axios from 'axios'
import * as AddCalendarEvent from 'react-native-add-calendar-event'

import Header from '../../components/Header'
import icHeader from '../../../assets/images/header'
import {
  color040404,
  color363636,
  color5C5D5E,
  colorA7A8A9,
  colorF0F0F0,
  colorF8F8F8,
  colorFFFFFF
} from '../../constants/colors'
import NavigationService from '../../navigation'
import { customTxt } from '../../constants/css'
import Fonts from '../../constants/Fonts'
import ButtonOutline from '../video_call/components/ButtonOutline'
import Translate from '../../translate'
import { useSelector } from 'react-redux'
import {
  convertCalenderDMMM,
  convertNumberTime,
  converToUTC
} from '../../constants/DateHelpers'
import FunctionButtonFloating from './FunctionButtonFloating'
import Routes from '../../navigation/Routes'
import LoadingView from 'components/LoadingView'
import icHealthProfile from '../../../assets/images/health_profile'
import { convertDMMMYYYY } from 'constants/DateHelpers'

export default function DetialAppointment({ route }) {

  const languageRedux = useSelector(state => state.common.language)
  const passingData = route?.params?.data
  const [isShow, setShow] = useState(false)
  const [isRevoke, setRevoke] = useState(false)
  const token = useSelector(state => state.user.token)
  const [isLoad, setLoading] = useState(true)
  const [detail, setDetail] = useState([])

  useEffect(() => {
    isRevoke && revokeAppointment()
  }, [isRevoke])

  useEffect(() => {
    callAPIGetDetail()
  }, [])

  useEffect(() => {
    callAPIGetDetail()
    DeviceEventEmitter.addListener(Routes.DETAIL_APPOINTMENT_SCREEN, () => {
      setLoading(true)
      // setReLoad(Math.random())
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    })
  }, [isLoad])

  const revokeAppointment = () => {
    axios({
      method: 'delete',
      url: `${APIs.hostAPI}backoffice/listappointment/${passingData?.id}`,
      headers: {
        'x-auth-token': token
      }
    })
      .then(response => {
        console.log('Delete successful', response)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
  }

  const callAPIGetDetail = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/getSurvey/${passingData?.id}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        setLoading(false)
        console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getData = response.data.survey || []
          setDetail(getData)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const RenderItem = ({item, index}) => {
    const _onPressItem = () => {
      NavigationService.navigate(Routes.DETAIL_FILE_SCREEN, {
        data: item,
        index: index
      })
    }
    return (
      <TouchableOpacity onPress={_onPressItem} style={styles.ctnBoxDocument}>
        <View style={styles.content}>
          <Text numberOfLines={1} style={[customTxt(Fonts.SemiBold, 16, color040404).txt, styles.titleDocument]}>
            {item?.title}
          </Text>
          <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
            {convertDMMMYYYY(item?.insertDate)}
          </Text>
        </View>
        <View style={styles.icon}>
          <Image source={icHealthProfile.ic_right} style={styles.iconStyle} />
        </View>
      </TouchableOpacity>
    )
  }

  const renderFlatlistDoc = () => {
    return (
      <View>
        <FlatList
          data={detail?.documents}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderBox = () => {
    const convertTimeStart = passingData?.startsAt ? convertNumberTime(passingData?.startsAt) : ''
    const convertTimeEnd = passingData?.endsAt ? convertNumberTime(passingData?.endsAt) : ''
    const converTime = convertTimeStart + ' - ' + convertTimeEnd
    const convertDate = passingData?.startsAt ? convertDMMMYYYY(passingData?.startsAt) : ''

    return (
      <View style={styles.ctnDocName}>
        {/* DOCTOR NAME */}
        <View style={styles.marginB8}>
          <Text style={customTxt(Fonts.SemiBold, 12, colorA7A8A9).txt}>
            {Translate(languageRedux).DOCTOR}
          </Text>
        </View>
        <View style={styles.marginB8}>
          <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
            Doc. {passingData?.doctor?.nome} {passingData?.doctor?.cognome}
          </Text>
        </View>
        {passingData?.doctor?.specializationStr && <View style={styles.marginB16}>
          <Text style={customTxt(Fonts.Regular, 12, color363636).txt}>
            {passingData?.doctor?.specializationStr}
          </Text>
        </View>}
        <View style={styles.divider} />
        {/* DATE and TIME */}
        <View style={styles.marginB8}>
          <Text style={customTxt(Fonts.SemiBold, 12, colorA7A8A9).txt}>
            {Translate(languageRedux).appointment}
          </Text>
        </View>
        <View style={styles.marginB16}>
          <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
            {convertDate}, {converTime}
          </Text>
        </View>
        <View style={styles.divider} />
        {/* WHO IS THIS FOR */}
        <View style={styles.marginB8}>
          <Text style={customTxt(Fonts.SemiBold, 12, colorA7A8A9).txt}>
            {Translate(languageRedux).WHO_IS_FOR}
          </Text>
        </View>
        <View style={styles.marginB16}>
          <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
            {detail?.subject}
          </Text>
        </View>
        <View style={styles.divider} />
        {/* DESCRIPTION */}
        <View style={styles.marginB8}>
          <Text style={customTxt(Fonts.SemiBold, 12, colorA7A8A9).txt}>
            {Translate(languageRedux).description}
          </Text>
        </View>
        <View style={styles.marginB16}>
          <Text style={customTxt(Fonts.Regular, 16, color040404).txt}>
            {detail?.description}
          </Text>
        </View>
        <View style={styles.divider} />
        {/* DOCUMENT */}
        <View style={styles.ctnRecomDoc}>
          <Text style={customTxt(Fonts.SemiBold, 16, color040404).txt}>
            {Translate(languageRedux).RECOMMENDED_DOCUMENTS}
          </Text>
        </View>
        {(detail?.documents || []).length === 0 && <View style={styles.ctnTextPlease}>
          <Text style={customTxt(Fonts.Regular, 16, color5C5D5E).txt}>
            {Translate(languageRedux).DESCRIPTION_RECOMMENDED_DOCUMENTS}
          </Text>
        </View>}
        {(detail?.documents || []).length > 0 && renderFlatlistDoc()}
        <View style={styles.ctnButton}>
          <ButtonOutline
            text={(detail?.documents || []).length > 0 ?
            Translate(languageRedux).EDIT_DOCUMENT_LIST : Translate(languageRedux).UPLOAD_DOCUMENT}
            onPress={() => {
              NavigationService.navigate(Routes.DOCUMENT_LIST_SCREEN, {
                id: passingData?.id,
                data: detail?.documents
              })
            }}
          />
        </View>
      </View>
    )
  }

  const renderBody = () => {
    return <View style={styles.ctnBody}>{renderBox()}</View>
  }

  const _onPressRevoke = () => {
    setRevoke(true)
    NavigationService.goBack()
  }

  const _onPressExportCalendar = () => {
    const eventConfig = {
      title: Translate(languageRedux).appointment,
      startDate: converToUTC(passingData?.startsAt),
      endDate: converToUTC(passingData?.endsAt),
      notes: `We confirm your appointment with the doctor ${passingData?.doctor?.nome || ''} ${passingData?.doctor?.cognome || ''},

see attached .ics file

SaluberMD`
    }

    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then((eventInfo) => {
        console.log('eventInfo:', eventInfo)
        if (eventInfo?.action === 'SAVED') {
          console.log('OK: ')
          if (Platform.OS === 'ios') {
            Linking.openURL('calshow:')
          } else if (Platform.OS === 'android') {
            Linking.openURL('content://com.android.calendar/time/')
          }
        }
      }).catch(() => {
        console.log('false')
      })
  }

  return (
    <View style={styles.flex}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_left}
        iconRight={icHeader.ic_function}
        onPressLeft={() => NavigationService.goBack()}
        textCenter={Translate(languageRedux).appointment}
        onPressRight={() => {
          setShow(true)
        }}
      />
      <ScrollView>{renderBody()}</ScrollView>
      {isShow === true && (
        <View style={[styles.floatView]}>
          <FunctionButtonFloating
            onPressCancel={() => {
              setShow(false)
            }}
            onPressExportCalendar={_onPressExportCalendar}
            onPressReschedule={true}
            onPressRevoke={_onPressRevoke}
          />
        </View>
      )}
      {isLoad && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  ctnBody: {
    marginTop: 15,
    marginBottom: 42,
    marginHorizontal: 20,
    borderRadius: 16,
    backgroundColor: colorFFFFFF,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 9
  },
  ctnDocName: {
    marginHorizontal: 16,
    marginTop: 16
  },
  marginB8: {
    marginBottom: 8
  },
  marginB16: {
    marginBottom: 16
  },
  divider: {
    width: '100%',
    borderWidth: 1,
    borderColor: colorF0F0F0,
    marginBottom: 16
  },
  ctnRecomDoc: {
    marginBottom: 8
  },
  ctnButton: {
    marginTop: 8,
    marginBottom: 16
  },
  floatView: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  ctnBoxDocument: {
    height: 72,
    backgroundColor: colorF8F8F8,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  titleDocument: {
    marginBottom: 4
  },
  content: {
    marginVertical: 14,
    marginLeft: 16,
    flex: 1
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  icon: {
    justifyContent: 'center',
    marginRight: 16
  }
})
