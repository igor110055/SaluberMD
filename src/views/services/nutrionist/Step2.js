import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ScrollView} from 'react-native'
import {useSelector} from 'react-redux'
import axios from 'axios'
import * as APIs from '../../../api/APIs'
import moment from 'moment'

import {color040404, color3777EE, colorDDDEE1, colorF8F8F8, colorFFFFFF, color5C5D5E, colorF0F0F0, colorC1C3C5} from 'constants/colors'
import Translate from '../../../translate'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import { convertNumberTime12, convertDateTime } from 'constants/DateHelpers'

import icHeader from '../../../../assets/images/header'
import icHealth from '../../../../assets/images/health_profile'
import icHome from '../../../../assets/images/home_screen'

import Header from 'components/Header'
import LoadingView from 'components/LoadingView'
import DialogView from 'components/DialogView'
import Button from 'components/Button'

export default function Step2({ route }) {
  const languageRedux = useSelector(state => state.common.language)
  const passingData = route.params.data
  const token = useSelector(state => state.user.token)
  const [lsSlot, setLSSlot] = useState([])
  const [listDate, setListDate] = useState([])
  const [lsFilter, setLSFilter] = useState([])
  const [valueDate, setValueDate] = useState()
  const [showList, setShowList] = useState(false)
  const [loading, setLoading] = useState(true)
  const [valueTime, setValueTime] = useState()
  const [isDialog, setDialog] = useState(false)

  useEffect(() => {
    callAPISlotOfDoctor()
    checkDate()
  },[loading])

  const checkDate = () => {
    var monthNow = moment().format('M')
    var dayNow = moment().format('D')
    const listRe = lsSlot[lsSlot.length - 1]
    const monthBook = moment(listRe?.startsAt).format('M')
    const lastdayBook = moment(listRe?.startsAt).format('D')
    var list = []
    if (monthNow === monthBook) {
      for (dayNow; dayNow <= Number(lastdayBook); dayNow++) {
        var item = {}
        var j = moment().format(`M/${dayNow}/YYYY`)
        item["date"] = j
        item["id"] = Math.random(1)
        var listFilter = lsSlot.filter((val) => convertDateTime(val.startsAt) === convertDateTime(j))
        if (listFilter.length > 0) {
          list.push(item)
        }
      }
      setListDate(list)
      console.log('list: ', list)
    }
    if (monthNow < monthBook) {
      if (monthNow === 1 || 3 || 5 || 7 || 8 || 10 || 12) {
        for (dayNow; dayNow <= 31; dayNow++) {
          var item = {}
          var j = moment().format(`M/${dayNow}/YYYY`)
          item["date"] = j
          item["id"] = Math.random(1)
          var listFilter = lsSlot.filter((val) => convertDateTime(val.startsAt) === convertDateTime(j))
          if (listFilter.length > 0) {
            list.push(item)
          }
        }
        for (var i = 1; i <= Number(lastdayBook); i++) {
          var item = {}
          var j = moment().format(`${monthBook}/${i}/YYYY`)
          item["date"] = j
          item["id"] = Math.random(1)
          var listFilter = lsSlot.filter((val) => convertDateTime(val.startsAt) === convertDateTime(j))
          if (listFilter.length > 0) {
            list.push(item)
          }
        }
      }
      else {
        for (dayNow; dayNow <= 30; dayNow++) {
          var item = {}
          var j = moment().format(`M/${dayNow}/YYYY`)
          item["date"] = j
          item["id"] = Math.random(1)
          var listFilter = lsSlot.filter((val) => convertDateTime(val.startsAt) === convertDateTime(j))
          if (listFilter.length > 0) {
            list.push(item)
          }
        }
        for (var i = 1; i <= Number(lastdayBook); i++) {
          var item = {}
          var j = moment().format(`${monthBook}/${i}/YYYY`)
          item["date"] = j
          item["id"] = Math.random(1)
          var listFilter = lsSlot.filter((val) => convertDateTime(val.startsAt) === convertDateTime(j))
          if (listFilter.length > 0) {
            list.push(item)
          }
        }
      }
      setListDate(list)
    }
    console.log('list: ', list)
  }

  const getTimeZone = () => {
    var date = new Date()
    var offsetInHours = date.getTimezoneOffset()
    return offsetInHours
  }

  const callAPISlotOfDoctor = () => {
    axios({
      method: 'get',
      url: `${APIs.hostAPI}backoffice/findslot/${passingData?.id}/${getTimeZone()}`,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': token
      }
    })
      .then(response => {
        console.log('data: ', response.data)
        if (response.data.length === 0) {
          console.log('noti: ', 'can not get data')
        } else {
          console.log('noti: ', 'data has been obtained')
          const getList = response.data.slots || []
          if (getList.length > 0) {
            setLSSlot(getList)
            setLoading(false)
          }
        }
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
      })
  }

  const renderListDate = () => {
    const RenderItem = ({item, index}) => {
      const isActiveDoctor = () => {
        return item === valueDate
      }
      const _onPressChooseDate = () => {
        var listFilter = lsSlot.filter((val) => convertDateTime(val.startsAt) === convertDateTime(item?.date))
        setValueDate(item)
        showList === false && setShowList(true)
        isActiveDoctor() && showList === true && setShowList(false)
        setLSFilter(listFilter)
      }
      return (
        <View>
          <TouchableOpacity onPress={_onPressChooseDate} style={styles.timeDate}>
            <View>
              <Text style={[customTxt(Fonts.SemiBold, 14, color040404).txt]}>
                {convertDateTime(item?.date)}
              </Text>
            </View>
            <View>
              <Image source={(isActiveDoctor() && showList === true) ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle}/>
            </View>
          </TouchableOpacity>
          {(isActiveDoctor() && showList === true) && renderFlatListBoxSlot()}
        </View>
      )
    }
    return (
      <View>
        <FlatList
          data={listDate}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderFlatListBoxSlot = () => {

    const RenderItem = ({item, index}) => {
      const convertTimeStart = item?.startsAt ? convertNumberTime12(item?.startsAt) : ''
      const convertTimeEnd = item?.endsAt ? convertNumberTime12(item?.endsAt) : ''
      const isActiveDoctor = () => {
        return item === valueTime
      }
      const _onPressChooseSlot = () => {
        setValueTime(item)
        // setTimeout(() => {
        //   NavigationService.navigate(Routes.NUTRITIONIST_3_SCREEN, {
        //     data: item,
        //     passingData: passingData
        //   })
        // }, 500)
      }
      const textColor = {color: isActiveDoctor() ? colorFFFFFF : color040404 }
      return (
        <View style={styles.marginB8}>
          <TouchableOpacity onPress={_onPressChooseSlot}
          style={isActiveDoctor() ? styles.boxSlot2 : styles.boxSlot1}>
            <Text style={[customTxt(Fonts.Regular, 16).txt, textColor]}>{convertTimeStart} - {convertTimeEnd}</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <View>
        <FlatList
          data={lsFilter}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderTitle = () => {
    return (
      <View style={styles.ctnTitle}>
        <Text style={[customTxt(Fonts.Bold, 14, color040404).txt]}>
          {Translate(languageRedux).choosedate}
        </Text>
      </View>
    )
  }

  const renderBoxDoctor = () => {
    return (
      <View style={styles.boxDoctor}>
        <Text style={customTxt(Fonts.Bold, 14, colorFFFFFF).txt}>{passingData?.nome}{' '}{passingData?.cognome}</Text>
        <View style={styles.fee}>
          <Text style={customTxt(Fonts.Regular, 14, colorFFFFFF).txt}>{passingData?.currency}</Text>
          <Text style={customTxt(Fonts.Regular, 14, colorFFFFFF).txt}>{passingData?.fee}{' - '}</Text>
          <Text style={customTxt(Fonts.Regular, 14, colorFFFFFF).txt}>{passingData?.timeslot}{' '}</Text>
          <Text style={customTxt(Fonts.Regular, 14, colorFFFFFF).txt}>
            {Translate(languageRedux).minutes}
          </Text>
        </View>
      </View>
    )
  }

  const renderButtonNext = () => {
    return (
      <View style={styles.ctnButton}>
        <Button
          text={Translate(languageRedux).NEXT}
          backgroundColor={valueTime ? color3777EE : colorF0F0F0}
          textColor={valueTime ? colorFFFFFF : colorC1C3C5}
          disabled={valueTime ? false : true}
          onPress={() => {
            NavigationService.navigate(Routes.NUTRITIONIST_3_SCREEN, {
               data: valueTime,
               passingData: passingData
            })
          }}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.paddingBottom}>
        {renderBoxDoctor()}
        {renderTitle()}
        {renderListDate()}
        {renderButtonNext()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_left}
        textCenter={Translate(languageRedux).nutritionist}
        textCenterColor={color040404}
        onPressLeft={() => {
          NavigationService.goBack()
        }}
        onPressRight={() => {setDialog(true)}}
        iconRight={icHeader.ic_close}
      />
      <ScrollView>{renderBody()}</ScrollView>
      <DialogView
        isShow={isDialog}
        onPressCancel={() => setDialog(false)}
        title={Translate(languageRedux).WARNING_TITLE_NOTIFICATION}
        content={Translate(languageRedux).HOME_WARNING_MESSAGE}
        txt1={Translate(languageRedux).N}
        txt2={Translate(languageRedux).Y}
        onPressOK={() => {
          NavigationService.navigate(Routes.SERVICES_SCREEN)
        }}
      />
      {loading && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  paddingBottom: {
    paddingBottom: 48,
    marginHorizontal: 20
  },
  timeDate: {
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  boxSlot1: {
    height: 56,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    backgroundColor: colorF8F8F8,
    borderRadius: 12,
    paddingVertical: 16,
    paddingLeft: 16,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  boxSlot2: {
    height: 56,
    borderWidth: 1,
    borderColor: color3777EE,
    backgroundColor: color3777EE,
    borderRadius: 12,
    paddingVertical: 16,
    paddingLeft: 16,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  marginB8: {
    marginBottom: 8
  },
  iconStyle: {
    height: 24,
    width: 24,
    marginRight: 16
  },
  ctnTitle: {
    marginBottom: 8
  },
  marginL8: {
    marginLeft: 8
  },
  boxDoctor: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: color3777EE,
    shadowColor: '#4687FF',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.24,
    shadowRadius: 4,
    elevation: 9,
    marginBottom: 16
  },
  fee: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center'
  },
  ctnButton: {
    marginTop: 20
  }
})
