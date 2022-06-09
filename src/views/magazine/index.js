import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, FlatList, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

import { color040404, color3777EE, color5C5D5E, colorF8F8F8, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'
import Translate from '../../translate'
import { apiGetMagazine } from 'api/Magazine'

import icHeader from '../../../assets/images/header'
import icGlobal from '../../../assets/images/global'

import Header from '../../components/Header'
import LoadingView from '../../components/LoadingView'

export default function Magazine() {

  const languageRedux = useSelector(state => state.common.language)
  const [isLoad, setLoading] = useState(true)
  const [data, setData] = useState()
  const dispatch = useDispatch()
  const countNotiRedux = useSelector(state => state.common.countNoti)

  useEffect(() => {
    callAPIMagazine()
  }, [])

  const callAPIMagazine = () => {
    dispatch(apiGetMagazine())
      .then(res => {
        console.log('magazine: ', res?.payload)
        const getData = res?.payload
        if (getData) {
          const sortByDate = ((a, b) => {
            return b.insertDate - a.insertDate
          })
          const sortData = getData.sort(sortByDate)
          setData(sortData)
        }
        setLoading(false)
      })
      .catch(err => {
        console.log('err: ', err)
        setLoading(false)
      })
  }

  const RenderItem = ({item, index}) => {
    const checkType = () => {
      if (item?.section === 0) {
        return Translate(languageRedux).HEALTH_INDEX
      }
      if (item?.section === 1) {
        return Translate(languageRedux).nutrition
      }
    }
    const _onPressItem = () => {
      NavigationService.navigate(Routes.DETAIL_MAGAZINE_SCREEN, {
        data: item,
        index: index
      })
    }
    return (
      <TouchableOpacity onPress={_onPressItem} style={styles.ctnItem}>
        <Image
        source={item?.image?.base64 ? {uri: `data:image;base64,${item?.image?.base64}`} : icGlobal.ic_thumbnail}
        style={styles.thumbnail} />
        <View style={styles.ctnContent}>
          <Text style={customTxt(Fonts.SemiBold, 12, color3777EE).txt}>{checkType()}</Text>
          <Text numberOfLines={3} style={[customTxt(Fonts.Bold, 14, color040404).txt, styles.marginT8]}>
            {item?.name}</Text>
          <Text numberOfLines={2} style={[customTxt(Fonts.Regular, 14, color5C5D5E).txt, styles.marginT8]}>
            {item?.description}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  const renderFlatlist = () => {
    return (
      <View>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        <View style={styles.titleTop}>
          <Text style={[customTxt(Fonts.Bold, 24, color040404).txt, styles.marginHori20]}>{Translate(languageRedux).MAGAZINE}</Text>
          <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginHori20]}>Explore latest articles lorem ipsum dolor sit.</Text>
        </View>
        {renderFlatlist()}
      </View>
    )
  }

  const _onPressNotificaion = () => {
    return NavigationService.navigate(Routes.NOTIFICATION_SCREEN)
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        iconLeft={icHeader.ic_menudrawer}
        iconRight={icHeader.ic_noti}
        onPressLeft={() => {
          NavigationService.openDrawer()
        }}
        onPressRight={_onPressNotificaion}
        notiRight={countNotiRedux}
      />
      <ScrollView>{renderBody()}</ScrollView>
      {isLoad && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  ctnBody: {
    paddingBottom: 48
  },
  titleTop: {
    backgroundColor: colorFFFFFF,
    paddingBottom: 16
  },
  marginHori20: {
    marginHorizontal: 20
  },
  ctnItem: {
    height: 168,
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    marginHorizontal: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9
  },
  thumbnail: {
    height: 136,
    width: 92,
    borderRadius: 8
  },
  ctnContent: {
    marginLeft: 16,
    flex: 1
  },
  marginT8: {
    marginTop: 8
  }
})
