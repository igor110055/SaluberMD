import { color040404, color3777EE, color38A169, color848586, colorA7A8A9, colorDDDEE1, colorE53E3E, colorF0F0F0, colorFED7D7, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import { convertNumberTime, convertMMMDDYYYY, convertYYYYMMDDLocal, subtractDate, addDate } from 'constants/DateHelpers'
import Fonts from 'constants/Fonts'
import React from 'react'
import {
  Dimensions, TouchableOpacity,
  StyleSheet, View, Text, Image, FlatList
} from 'react-native'
import { useSelector } from 'react-redux'
import Translate from 'translate'
import imgDirect from '../../../../../assets/images/direct_call'
import imgVideoCall from '../../../../../assets/images/video_call'
import imgAgenda from '../../../../../assets/images/agenda'

export default function AgendaDetailView({
  onPressClose, date, lsData,
  onPressAdd, onPressDeleteAll,
  onPressPrevious, onPressNext,
  onPressDeleteItem, onPressCopyItem
}) {
  const languageRedux = useSelector(state => state.common.language)

  const renderHeaderView = () => {
    return (
      <View style={styles.headerView}>
        <View style={styles.centerHeaderView}>
          <TouchableOpacity style={styles.imgNext} onPress={onPressPrevious}>
            <Image source={imgAgenda.ic_previous_agenda} style={styles.imgClose} />
          </TouchableOpacity>
          <Text style={[
            customTxt(Fonts.SemiBold, 16, color040404).txt
          ]}>{convertMMMDDYYYY(date)}</Text>
          <TouchableOpacity style={styles.imgNext} onPress={onPressNext}>
            <Image source={imgAgenda.ic_next_agenda} style={styles.imgClose} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.closeView} onPress={onPressClose}>
          <Image source={imgDirect.ic_close} style={styles.imgClose} />
        </TouchableOpacity>
      </View>
    )
  }

  const buttonImgView = (img, onPress) => {
    return (
      <TouchableOpacity style={[styles.imgView]} onPress={onPress}>
        {img && <Image source={img} style={styles.imgStyle} />}
      </TouchableOpacity>
    )
  }

  const renderBloodPres = () => {
    return (
      <View>
        <Text style={[
          customTxt(Fonts.Regular, 12, color040404).txt
        ]}>Blood pres</Text>
        <View style={styles.bgBlood}>
          <Text style={[
            customTxt(Fonts.SemiBold, 12, colorE53E3E).txt
          ]}>Hight</Text>
        </View>
      </View>
    )
  }

  const renderWeight = () => {
    return (
      <View style={styles.weightView}>
        <Text style={[
          customTxt(Fonts.Regular, 12, color040404).txt
        ]}>Weight</Text>
        <View style={[styles.bgBlood, styles.bgColorGray]}>
          <Text style={[
            customTxt(Fonts.SemiBold, 12, color848586).txt
          ]}>Growing</Text>
        </View>
      </View>
    )
  }

  const onPressCopyData = (item) => {
    return onPressCopyItem(item)
  }

  const onPressDelItem = (item) => {
    return onPressDeleteItem(item)
  }

  const renderContentView = () => {
    const itemView = (item) => {
      const startTime = convertNumberTime(item?.startsAt) || ''
      const endTime = convertNumberTime(item?.endsAt) || ''
      return (
        <View style={styles.itemStyleView}>
          <View style={styles.topContentView}>
            <Text style={[
              customTxt(Fonts.SemiBold, 16, color040404).txt
            ]}>{startTime}</Text>
            <Text style={[
              customTxt(Fonts.SemiBold, 16, colorA7A8A9).txt
            ]}>{`- ${endTime}`}</Text>
            <View style={[
              styles.lineView,
              customTxt(Fonts.SemiBold, 16, colorA7A8A9).txt
            ]} />
            {
              item?.user?.nome ?
                <Text style={[
                  customTxt(Fonts.SemiBold, 16, color040404).txt,
                  styles.contentStyleView
                ]}>{item?.user?.nome} {item?.user?.cognome}</Text> :
                <Text style={[
                  customTxt(Fonts.SemiBold, 16, color38A169).txt,
                  styles.contentStyleView
                ]}>{Translate(languageRedux).FREE_SLOT}</Text>
            }
            {/* {!(item?.user?.nome) && buttonImgView(imgAgenda.ic_copy, () => onPressCopyData(item))} */}
            {!(item?.user?.nome) && buttonImgView(imgVideoCall.ic_trash, () => onPressDelItem(item))}
          </View>
          {
            item?.user?.nome && (
              <View style={[styles.topContentView, styles.marginT8]}>
                {renderBloodPres()}
                {renderWeight()}
              </View>
            )
          }
        </View>
      )
    }

    return (
      <View style={styles.contentStyleView}>
        <FlatList
          data={lsData}
          renderItem={({ item }) => itemView(item)}
        />
      </View>
    )
  }

  const renderButton = () => {
    const buttonView = (
      onPress, txt, color
    ) => {
      const bgStyle = {
        backgroundColor: color
      }
      return (
        <TouchableOpacity style={[
          styles.btView,
          color ? bgStyle : null
        ]} onPress={onPress}>
          <Text style={[
            customTxt(Fonts.Bold, 16, colorFFFFFF).txt
          ]}>{txt}</Text>
        </TouchableOpacity>
      )
    }
    return (
      <View style={styles.bottomView}>
        {buttonView(() => onPressAdd(date), Translate(languageRedux).ADD_NEW_AVAILABILITY)}
        {buttonView(onPressDeleteAll, Translate(languageRedux).DELETE_ALL_FREE_SLOTS, colorE53E3E)}
      </View>
    )
  }

  return (
    <View style={styles.flexView}>
      <View style={styles.outsideView} />
      <View style={styles.contentView}>
        {renderHeaderView()}
        {renderContentView()}
        {renderButton()}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  flexView: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  centerHeaderView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  outsideView: {
    flex: 1,
    backgroundColor: color040404,
    opacity: 0.4
  },
  contentView: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    backgroundColor: colorFFFFFF,
    top: 64,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
    overflow: 'hidden'
  },
  headerView: {
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgNext: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10
  },
  closeView: {
    position: 'absolute',
    width: 56,
    height: 56,
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgClose: {
    width: 24,
    height: 24
  },
  btView: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color3777EE,
    height: 48,
    borderRadius: 12
  },
  contentStyleView: {
    flex: 1
  },
  itemStyleView: {
    padding: 16,
    margin: 20,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: colorDDDEE1,
    borderRadius: 12
  },
  topContentView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  marginT8: {
    marginTop: 8
  },
  lineView: {
    height: 30,
    width: 2,
    backgroundColor: colorF0F0F0,
    marginLeft: 16,
    marginRight: 16
  },
  imgView: {
    marginLeft: 16
  },
  imgStyle: {
    width: 20,
    height: 20
  },
  bgBlood: {
    marginTop: 4,
    paddingTop: 3,
    paddingLeft: 16.5,
    paddingRight: 16.5,
    paddingBottom: 5,
    backgroundColor: colorFED7D7,
    borderRadius: 4,
    overflow: 'hidden'
  },
  weightView: {
    marginLeft: 16
  },
  bgColorGray: {
    backgroundColor: colorDDDEE1
  },
  bottomView: {
    marginTop: 20,
    marginBottom: 10
  }
})
