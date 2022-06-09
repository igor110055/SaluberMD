import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native'
import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../api/APIs'
import { ScrollView } from 'react-native-gesture-handler'
import _ from 'lodash'

import { color040404, color3777EE, color5C5D5E, colorDDDEE1, colorF8F8F8, colorFFFFFF } from 'constants/colors'
import Translate from 'translate'
import NavigationService from 'navigation'
import { border, customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'

import icHeader from '../../../../assets/images/header'
import imgDirectCall from '../../../../assets/images/direct_call'

import LoadingView from 'components/LoadingView'
import Header from 'components/Header'
import PopupInputDescription from './PopupInputDescription'
import DialogCustom from 'components/DialogCustom'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
import Routes from 'navigation/Routes'

export default function TransferCall() {
  const languageRedux = useSelector(state => state.common.language)
  const dataNoti = useSelector(state => state.common.dataNoti)
  const [listOnline, setListOnline] = useState()
  const [isLoad, setLoading] = useState(false)
  const token = useSelector(state => state.user.token)
  const [valueDoctor, setValueDoctor] = useState()
  const [isDialog, setDialog] = useState(false)
  const [description, setDescription] = useState()
  const [isBusy, setBusy] = useState()
  const [isShowNoti, setShowNoti] = useState()
  const [noti, setNoti] = useState()

  useEffect(() => {
    callAPIListOnlineDoctorTransfer()
  },[])

  useEffect(() => {
    valueDoctor && callAPICheckDoctorBusy()
  },[valueDoctor])

  const callAPIListOnlineDoctorTransfer = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/videocall/getOnlineDoctorsTransfer`,
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
          const getList = response.data.medici || []
          setListOnline(getList)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const callAPICheckDoctorBusy = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/videocall/isBusy/${valueDoctor?.idmedico}`,
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
          console.log('doctorBusy: ', 'data has been obtained')
          const getList = response.data || []
          setBusy(getList?.busy)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const RenderDoctorCell = ({ item }) => {
    const getListSpecialization = item?.specialization || []
    var getNameSpecialization = getListSpecialization.map((val, index) => {
      if (index === getListSpecialization.length - 1) {
        return `${val?.name}`
      }
      return `${val?.name}, `
    })

    if (_.isEmpty(getNameSpecialization)) {
      getNameSpecialization = ''
    }

    const isActiveDoctor = () => {
      return item === valueDoctor
    }

    return (
      <TouchableOpacity
        onPress={() => {
          setValueDoctor(item)
          setDialog(true)
        }}
        style={[
          styles.itemDoctorView,
          isActiveDoctor() ? styles.bgActive : border(colorDDDEE1).border
        ]}>
        <Image style={styles.imgAvatar} source={imgDirectCall.ic_avatar} />
        <View style={styles.txtChooseCell}>
          <Text
            numberOfLines={1}
            style={[
              customTxt(Fonts.Medium, 16, color040404).txt,
              isActiveDoctor() ? styles.txtActive : null
            ]}>
            {item?.name || ''}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              customTxt(Fonts.Regular, 12, color5C5D5E).txt,
              styles.txtSpecialization,
              isActiveDoctor() ? styles.txtActive : null
            ]}>
            {getNameSpecialization}
          </Text>
        </View>
        <Image
          source={
            isActiveDoctor()
              ? imgDirectCall.ic_right_white
              : imgDirectCall.ic_right_gray
          }
          style={styles.iconStyle}
        />
      </TouchableOpacity>
    )
  }

  const renderLsDoctor = () => {
    return (
      <View>
        {(listOnline || []).length === 0 ? <Text>{Translate(languageRedux).nodatafound}</Text> : null}
        <FlatList
          data={listOnline}
        //   extraData={toggleReload}
          key={'#flatlistDoctor'}
          keyExtractor={(item, index) => index.toString()}
        //   refreshControl={
        //     <RefreshControl
        //       refreshing={load}
        //       tintColor={color0B40B1}
        //     />
        //   }
          renderItem={({ item }) =>
            <RenderDoctorCell
              item={item}
            />
          }
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        {renderLsDoctor()}
      </View>
    )
  }

  const callApiTransferCall = () => {
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/videocall/transferCall/${dataNoti?.idReq}/${valueDoctor?.idmedico}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        setLoading(false)
        console.log('TransferCall: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          setShowNoti(true)
          if (_.includes([0, '0'], response?.data?.esito)) {
            setNoti({
              status: STATUS_NOTIFY.SUCCESS,
              content: Translate(languageRedux).NOTI_SUCCESS_TRANSFER_CALL
            })
            callAPIEndCall()
          }
          if (_.includes([1, '1'], response?.data?.esito)) {
            setNoti({
              status: STATUS_NOTIFY.ERROR,
              content: 'Error'
            })
            callAPIEndCall()
          }
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const callAPIEndCall = () => {
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/videocall/endCall/${dataNoti?.idReq}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(res => {
        console.log('connectSession: ', res)
        NavigationService.navigate(Routes.POST_CALL_SCREEN)
      })
      .catch(err => {
        console.log('connect err :', err)
        NavigationService.navigate(Routes.POST_CALL_SCREEN)
      })
  }

  const _onPressSend = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/webdoctor/setDescriptionTransfer/${dataNoti?.idReq}/${description}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then((response) => {
        setLoading(false)
        console.log('ResSendDes: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          setDescription('')
          setDialog(false)
          callApiTransferCall()
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_left}
        textCenter={Translate(languageRedux).CALL_TRANSFER_INFO}
        textCenterColor={color040404}
        onPressLeft={() => {
          NavigationService.goBack()
        }}
      />
      <ScrollView>{renderBody()}</ScrollView>
      {
        isDialog && isBusy === 0 &&
        <PopupInputDescription
          onPressCancel={() => {
            setDialog(false)
            setDescription('')
          }}
          valueInput={description}
          setValueInput={setDescription}
          onPressSend={_onPressSend}
        />
      }
      {
        isBusy === 1 &&
        <DialogCustom
          title={Translate(languageRedux).INFO_BTN}
          content={Translate(languageRedux).doctorbusy1}
          // txtlLeft={Translate(languageRedux).HISTORY}
          onPressCancel={() => {
            setBusy(0)
          }}
        />
      }
      {isLoad && <LoadingView />}
      <NotificationView
        isShow={isShowNoti}
        setShow={() => setShowNoti(false)}
        status={noti?.status || STATUS_NOTIFY.ERROR}
        content={noti?.content || ''}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  ctnBody: {
    marginHorizontal: 20
  },
  itemDoctorView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colorF8F8F8,
    paddingRight: 16,
    borderRadius: 12,
    marginBottom: 8
  },
  bgActive: {
    backgroundColor: color3777EE
  },
  imgAvatar: {
    width: 68,
    height: 68,
    marginTop: 4,
    marginLeft: 4,
    marginBottom: 4,
    marginRight: 12
  },
  txtChooseCell: {
    flex: 1
  },
  txtActive: {
    color: colorFFFFFF
  },
  txtSpecialization: {
    marginTop: 4
  },
  iconStyle: {
    width: 24,
    height: 24
  }
})
