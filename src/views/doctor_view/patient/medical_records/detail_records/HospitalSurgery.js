import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, ScrollView} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

import {color040404, colorA7A8A9, colorF0F0F0, colorFFFFFF} from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import Translate from 'translate'
import {convertDMMMYYYY} from 'constants/DateHelpers'
import NavigationService from 'navigation'
import { apiCountry } from '../../../../../api/Auth'

import icHeader from '../../../../../../assets/images/header'

import Header from 'components/Header'
import LoadingView from 'components/LoadingView'

export default function HospitalSurgery({route}) {
    const languageRedux = useSelector(state => state.common.language)
    const passingData = route?.params?.data
    const dispatch = useDispatch()
    const [lsCountry, setLSCountry] = useState()
    const [countryName, setCountryName] = useState()
    const [isLoad, setLoading] = useState(true)

    useEffect(() => {
        callAPICountry()
    }, [])

    const callAPICountry = () => {
        dispatch(apiCountry()).then(res => {
          setLoading(false)
          console.log('Res: ', res)
          const getCountry = res?.payload?.country || []
          if (getCountry.length > 0) {
            Promise.all([setLSCountry(getCountry)])
            convertCountry(getCountry)
          }
        }).catch(() => {
          setLoading(false)
        })
      }

    const RenderItem = ({category, content}) => {
      return (
        <View style={styles.ctnItem}>
          <Text style={customTxt(Fonts.SemiBold, 12, colorA7A8A9).txt}>
            {category}
          </Text>
          <Text
            style={[
              customTxt(Fonts.Regular, 16, color040404).txt,
              styles.marginT8
            ]}>
            {content}
          </Text>
          <View style={styles.divider} />
        </View>
      )
    }

    const convetType = () => {
      if (passingData?.type === 1) {
        return Translate(languageRedux).hospitalization
      }
      if (passingData?.type === 0) {
        return Translate(languageRedux).surgery
        }
    }

    const convertCountry = (data) => {
        const value = passingData?.country ? passingData?.country : null
        var cn = data.filter((val) => val?.value === value || '')
        if (cn.length > 0) {
          Promise.all([setCountryName(cn[0]?.text)])
        }
      }

    const renderBody = () => {
      return (
        <View>
          <RenderItem
            category={Translate(languageRedux).type}
            content={convetType()}
          />
          {passingData?.type === 1 && (
            <RenderItem
              category={Translate(languageRedux).hospitalization}
              content={passingData?.hospitalizationName}
            />
          )}
          {passingData?.type === 0 && (
            <RenderItem
              category={Translate(languageRedux).surgeryCategory}
              content={passingData?.surgeryCategoryName}
            />
          )}
          {passingData?.type === 0 && (
            <RenderItem
              category={Translate(languageRedux).surgery}
              content={passingData?.surgerySubCategoryName}
            />
          )}
          {passingData?.hospitalizationId === 1 && (
            <RenderItem
              category={Translate(languageRedux).other}
              content={passingData?.other}
            />
          )}
          {passingData?.hospitalizationId === 47 && (
            <RenderItem
              category={Translate(languageRedux).OTHER_ACCIDENT}
              content={passingData?.other}
            />
          )}
          {passingData?.hospitalizationId === 48 && (
            <RenderItem
              category={Translate(languageRedux).OTHER_CANCER_TREATMENT}
              content={passingData?.other}
            />
          )}
          <RenderItem
            category={Translate(languageRedux).date}
            content={passingData?.hospDate ? convertDMMMYYYY(passingData?.hospDate) : ''}
          />
          <RenderItem
            category={Translate(languageRedux).COUNTRY}
            content={countryName}
          />
          <RenderItem
            category={Translate(languageRedux).note}
            content={passingData ?.remarks}
          />
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <Header
          textCenter={Translate(languageRedux).HOSPITALIZATION_SURGICAL}
          iconLeft={icHeader.ic_left}
          onPressLeft={() => {NavigationService.goBack()}}
        />
        <ScrollView>{renderBody()}</ScrollView>
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
    marginHorizontal: 20,
    marginBottom: 16
  },
  marginT8: {
    marginTop: 8,
    marginBottom: 16
  },
  divider: {
    height: 1,
    backgroundColor: colorF0F0F0
  }
})
