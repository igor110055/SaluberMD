import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, ScrollView, FlatList} from 'react-native'
import { useSelector } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../../api/APIs'
import _ from 'lodash'

import {colorFFFFFF, colorA7A8A9, color333333, colorF0F0F0, color040404, color3777EE} from 'constants/colors'
import {convertDMMMYYYY} from 'constants/DateHelpers'
import Translate from 'translate'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import NavigationService from 'navigation'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'

import icHeader from '../../../../../assets/images/header'
import icVisit from '../../../../../assets/images/visit'

import Header from 'components/Header'
import LoadingView from 'components/LoadingView'
import SOSButton from '../../../home_screen/components/SOSButton/SOSButton'
import AddComment from './AddComment'

export default function AllNote({route}) {
  const languageRedux = useSelector(state => state.common.language)
  const token = useSelector(state => state.user.token)
  const [listNote, setListNote] = useState()
  const [isLoad, setLoading] = useState(true)
  const passingData = route?.params?.data
  const passingId = route?.params?.id
  const [isShow, setShow] = useState(false)
  const [statusAdd, setStatusAdd] = useState()
  const [dataNoti, setDataNoti] = useState()
  const [isShowNoti, setShowNoti] = useState()

  useEffect(() => {
    callAPINote()
  }, [statusAdd])

  useEffect(() => {
    checkNotiStausAdd()
  }, [statusAdd])

  const checkNotiStausAdd = () => {
    if (_.includes([0, '0'], statusAdd?.esito)) {
      setDataNoti({
        status: STATUS_NOTIFY.SUCCESS,
        content: 'Add comment successful'
      })
    }
    if (_.includes([1, '1'], statusAdd?.esito)) {
      setDataNoti({
        status: STATUS_NOTIFY.ERROR,
        content: 'Add comment failed'
      })
    }
  }

  const callAPINote = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/disman/getDoctorComment/${passingData}/${passingId}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained (callAPINote)')
          console.log('dataNote: ', response.data)
          const getList = response.data.data || []
          Promise.all(setListNote(getList))
          setLoading(false)
        }
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
      })
  }

  const RenderItem = ({item}) => {
    return (
      <View>
        <View style={styles.ctnItem}>
          <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>
            {convertDMMMYYYY(Number(item?.date))}
          </Text>
          <Text
            style={[
              customTxt(Fonts.Regular, 14, color333333).txt,
              styles.marginT4
            ]}>
            {item?.comment}
          </Text>
        </View>
        <View style={styles.divider} />
      </View>
    )
  }

  const renderNoDataView = () => {
    return (
      <View style={styles.noDataView}>
        <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.textCenter]}>
          {Translate(languageRedux).NO_DATA_NOTE}
        </Text>
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        {(listNote || []).length > 0 && <FlatList
          data={listNote}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
        />}
        {(listNote || []).length === 0 && renderNoDataView()}
      </View>
    )
  }

  const renderPlusButton = () => {
    return (
      <SOSButton
        source={isShow ? icVisit.ic_x : icVisit.ic_plus}
        backgroundColor={color3777EE}
        onPress={() => {
          setShow(!isShow)
          setStatusAdd()
        }}
      />
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).ALL_NOTE}
        iconRight={icHeader.ic_close}
        onPressRight={() => {
          NavigationService.goBack()
        }}
      />
      <ScrollView>{renderBody()}</ScrollView>
      {!isShow && renderPlusButton()}
      {isShow && (
        <AddComment
          onPressClose={() => {
            setShow(false)
          }}
          patientId={passingData}
          paramId={passingId}
          setStatus={setStatusAdd}
          setShowNotiAdd={setShowNoti}
        />
      )}
      <NotificationView
        isShow={isShowNoti}
        setShow={() => setShowNoti(false)}
        status={dataNoti?.status || STATUS_NOTIFY.ERROR}
        content={dataNoti?.content || ''}
      />
      {isLoad && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  ctnItem: {
    marginHorizontal: 16,
    paddingVertical: 18
  },
  marginT4: {
    marginTop: 4
  },
  ctnBody: {
    paddingBottom: 120
  },
  divider: {
    borderWidth: 0.75,
    borderColor: colorF0F0F0
  },
  noDataView: {
    marginTop: 141,
    alignItems: 'center',
    marginHorizontal: 20
  },
  textCenter: {
    textAlign: 'center'
  }
})
