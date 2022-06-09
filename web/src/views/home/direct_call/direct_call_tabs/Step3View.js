import React, { useEffect, useState } from 'react'
import {
  StyleSheet, View, Text, TouchableOpacity, Image,
  FlatList, RefreshControl
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import {
  color040404, colorDDDEE1, colorF8F8F8, colorFFFFFF,
  color333333, color3777EE, color5C5D5E, color0B40B1
} from '../../../../constants/colors'
import { border, customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'
import Translate from '../../../../translate'
import imgDirectCall from '../../../../../assets/images/direct_call'
// import { apiGetOnlineDoctors } from '../../../../api/VideoCall'
import _ from 'lodash'
import { apiGetOnlineDoctors } from '../../apis'

export default function Step3View({
  value, setValue, onPressNext,
  refreshing, setRefresh, toggleReload,
  valueDoctor, setValueDoctor,
  setLsDoctor,
  setLoading
}) {
  const languageRedux = ''//useSelector(state => state.common.language)
  // const dispatch = useDispatch()
  const [doctors, setDoctors] = useState([])
  const [load, setLoad] = useState(false)

  useEffect(() => {
    callAPILSOnlineDoctors()
  }, [toggleReload])

  const callAPILSOnlineDoctors = () => {
    if (!refreshing) {
      setLoad(true)
    }
    setLoading(true)
    apiGetOnlineDoctors('1').then(async res => {
      console.log('Res: ', res)
      const parseData = await res.json()
      setDoctors(parseData?.medici || [])
      setLsDoctor(parseData?.medici || [])
      setRefresh(false)
      setLoad(false)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }).catch(err => {
      console.log('err: ', err)
      setRefresh(false)
      setLoad(false)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    })
  }

  const renderChooseCell = (title, onPress, isActive) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.chooseCellView,
          isActive ? styles.bgActive : border(colorDDDEE1).border
        ]}
      >
        <Text style={[
          styles.txtChooseCell,
          isActive ? styles.txtActive : styles.txtUnactive
        ]}>{title}</Text>
        <Image
          source={isActive ? imgDirectCall.ic_right_white : imgDirectCall.ic_right_gray}
          style={styles.iconStyle}
        />
      </TouchableOpacity>
    )
  }

  const _onPressAnyFree = () => {
    setValue(1)
    setDoctors([])
    setLsDoctor(doctors)
    setTimeout(() => {
      onPressNext()
    }, 500)
  }

  const _onPressChooseOneOfYourDoctors = () => {
    setValue(2)
  }

  const renderAProvider = () => {
    return (
      <View>
        {renderChooseCell(
          Translate(languageRedux).ANY_FREE_PROVIDER,
          () => _onPressAnyFree(),
          value === 1
        )}
        {renderChooseCell(
          Translate(languageRedux).CHOOSE_ONE_OF_YOUR_DOCTORS,
          () => _onPressChooseOneOfYourDoctors(),
          value === 2
        )}
      </View>
    )
  }

  const RenderDoctorCell = ({ item }) => {
    const getListSpecialization = item?.specialization || []
    var getNameSpecialization = getListSpecialization.map((val, index) => {
      if (index === getListSpecialization.length - 1) {
        return `${val}`
      }
      return `${val}, `
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
          onPressNext()
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
            ]}
          >{item?.name || ''}</Text>
          <Text
            numberOfLines={1}
            style={[
              customTxt(Fonts.Regular, 12, color5C5D5E).txt,
              styles.txtSpecialization,
              isActiveDoctor() ? styles.txtActive : null
            ]}
          >{getNameSpecialization}</Text>
        </View>
        <Image
          source={isActiveDoctor() ? imgDirectCall.ic_right_white : imgDirectCall.ic_right_gray}
          style={styles.iconStyle}
        />
      </TouchableOpacity>
    )
  }

  const renderLsDoctor = () => {
    return (
      <View>
        {doctors.length === 0 ? <Text>{Translate(languageRedux).nodatafound}</Text> : null}
        <FlatList
          data={doctors}
          extraData={toggleReload}
          key={'#flatlistDoctor'}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={load}
              tintColor={color0B40B1}
            />
          }
          renderItem={({ item }) =>
            <RenderDoctorCell
              item={item}
            />
          }
        />
      </View>
    )
  }

  const renderChooseADoctor = () => {
    if (value === 2) {
      return (
        <View>
          <Text style={[
            styles.txtADoctor,
            customTxt(Fonts.Bold, 14, color040404).txt
          ]}>{Translate(languageRedux).choosetransferdoctor}</Text>
          {renderLsDoctor()}
        </View>
      )
    }
    return null
  }

  return (
    <View style={[styles.questionView]}>
      <Text style={[
        customTxt(Fonts.Bold, 18, color333333).txt
      ]} >{Translate(languageRedux).CHOOSE_A_PROVIDER}</Text>
      <Text style={[
        customTxt(Fonts.Regular, 16, color5C5D5E).txt,
        styles.contentView
      ]}>{Translate(languageRedux).STEP1_QS}</Text>
      {renderAProvider()}
      {renderChooseADoctor()}
    </View>
  )
}

const styles = StyleSheet.create({
  questionView: {
    padding: 20,
    margin: 16,
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    overflow: 'hidden'
  },
  contentView: {
    marginTop: 8,
    marginBottom: 16
  },
  chooseCellView: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: colorF8F8F8,
    alignItems: 'center',
    padding: 16
  },
  txtChooseCell: {
    flex: 1
  },
  iconStyle: {
    width: 24,
    height: 24
  },
  bgActive: {
    backgroundColor: color3777EE
  },
  txtActive: {
    color: colorFFFFFF
  },
  txtUnactive: {
    color: color040404
  },
  txtADoctor: {
    marginTop: 16,
    marginBottom: 8
  },
  imgAvatar: {
    width: 68,
    height: 68,
    marginTop: 4,
    marginLeft: 4,
    marginBottom: 4,
    marginRight: 12
  },
  itemDoctorView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colorF8F8F8,
    paddingRight: 16,
    borderRadius: 12
  },
  txtSpecialization: {
    marginTop: 4
  }
})
