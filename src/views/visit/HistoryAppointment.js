import React, {useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ScrollView,
  Platform,
  Image
} from 'react-native'
import {
  color040404,
  color0B40B1,
  color3777EE,
  color5C5D5E,
  colorF8F8F8,
  colorFFFFFF
} from '../../constants/colors'
import {useSelector} from 'react-redux'
import Fonts from '../../constants/Fonts'
import {customTxt} from '../../constants/css'
import {convertDMMMYYYY, convertNumberTime} from '../../constants/DateHelpers'
import NavigationService from '../../navigation'
import Routes from '../../navigation/Routes'
import NoDataView from 'components/NoDataView'
import imgNoData from '../../../assets/images/nodata'
import icVisit from '../../../assets/images/visit'
import Translate from 'translate'
import Button from 'components/Button'

export default function HistoryAppointment({listHistory, setReload, onPressLoadMore,
listHistoryFirst}) {
  const [refreshing, setRefresh] = useState(false)
  const languageRedux = useSelector(state => state.common.language)

  const BoxHistoryAppointment = ({docName, time, specail,
    onPress, prescriptionSent, referralSent}) => {
    return (
      <View>
        <TouchableOpacity onPress={onPress} style={styles.ctnNoti}>
          <View style={styles.ctnText}>
            {/* DOCTOR NAME */}
            {time && (
              <View>
                <Text style={customTxt(Fonts.Regular, 12, color5C5D5E).txt}>
                  {time}
                </Text>
              </View>
            )}
            {/* TIME and DAY */}
            {docName && (
              <View style={styles.ctnDayTime}>
                <Text style={customTxt(Fonts.SemiBold, 18, color040404).txt}>
                  Doc. {docName}
                </Text>
              </View>
            )}
            {/* SPECIAL */}
            {specail && (
              <View style={styles.ctnSpecial}>
                <Text style={customTxt(Fonts.SemiBold, 12, color5C5D5E).txt}>
                  {specail}
                </Text>
              </View>
            )}
          </View>
          {(prescriptionSent === '1' || referralSent === '1') && <View style={styles.ctnIcon}>
            <Image source={icVisit.ic_history_document} style={styles.iconStyle} />
          </View>}
        </TouchableOpacity>
      </View>
    )
  }

  const renderFlatlist = () => {
    const RenderItem = ({item, index}) => {
      const convertDate = item?.date ? convertDMMMYYYY(item?.date) : ''
      const convertTime = item?.date ? convertNumberTime(item?.date) : ''
      const DateTime =
        convertDate && convertTime ? convertDate + ', ' + convertTime : ''

      const _onPressItem = () => {
        NavigationService.navigate(Routes.DETAIL_CONSULTATION_SCREEN, {
          data: item,
          index: index
        })
      }

      return (
        <View style={styles.margiB16}>
          <BoxHistoryAppointment
            docName={item?.doctor || ''}
            time={DateTime}
            // specail={item?.specializationName}
            prescriptionSent={item?.prescriptionSent}
            referralSent={item?.referralSent}
            onPress={_onPressItem}
          />
        </View>
      )
    }

    return (
      <View>
        <FlatList
          data={listHistory || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderButtonLoadMore = () => {
    return (
      <View style={styles.ctnLoadMore}>
        <Button
          text={Translate(languageRedux).BTN_LOAD_MORE}
          textColor={color3777EE}
          viewStyle={styles.buttonLoadMore}
          onPress={onPressLoadMore}
        />
      </View>
    )
  }

  const checkShowLoadMoreBtn = () => {
    if ((listHistory || []).length >= 20 && (listHistoryFirst || []).length > 0) {
      return true
    } else {
      return false
    }
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        {renderFlatlist()}
        {checkShowLoadMoreBtn() && renderButtonLoadMore()}
      </View>
    )
  }

  const _onRefresh = () => {
    setRefresh(true)
    setReload(Math.random())
    setTimeout(() => {
      setRefresh(false)
    }, 3000)
  }

  return (
    <View style={styles.flex}>
      {(listHistory || []).length === 0 && (
        <NoDataView
          imageSource={imgNoData.img_nodata_history}
          text={Translate(languageRedux).HISTORY_APPOINTMENT_NO_DATA}
          noDataViewStyle={styles.ctnNoDataImg}
        />
      )}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={_onRefresh}
            tintColor={color0B40B1}
          />
        }
        style={styles.container}>
        {renderBody()}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  container: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: 20
  },
  ctnNoti: {
    borderRadius: 12,
    backgroundColor: colorFFFFFF,
    shadowColor: Platform.OS === 'ios' ? '#000' : '#6b6b6b',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  ctnText: {
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 16
  },
  ctnDayTime: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center'
  },
  ctnSpecial: {
    marginTop: 8
  },
  margiB16: {
    marginBottom: 16
  },
  ctnNoDataImg: {
    top: 48
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  ctnIcon: {
    paddingRight: 16,
    paddingTop: 16
  },
  buttonLoadMore: {
    borderColor: color3777EE,
    borderWidth: 1
  },
  ctnBody: {
    paddingBottom: 120
  },
  ctnLoadMore: {
    marginHorizontal: 100,
    marginTop: 20
  }
})
