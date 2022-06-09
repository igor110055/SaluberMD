import React, { useState, useEffect } from 'react'
import { View, Text, StatusBar, StyleSheet, DeviceEventEmitter } from 'react-native'

import { colorFFFFFF, color3777EE, color040404, colorA7A8A9, colorF8F8F8, colorF0F0F0 } from '../../constants/colors'
import Fonts from '../../constants/Fonts'
import Header from './components/Header'
import TextInputCustomize from './components/TextInputCustomize'
import icHeader from '../../../assets/images/header'
import { customTxt } from '../../constants/css'
import { useSelector } from 'react-redux'
import NavigationService from '../../navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SearchListWithName from '../../components/SearchListWithName'
import LoadingView from '../../components/LoadingView'
import { concat } from 'lodash'
import Translate from '../../translate'
import axios from 'axios'
import * as APIs from '../../api/APIs'
import Routes from 'navigation/Routes'

export default function PersonalInfoScreen({route}) {
  const personalInfo = useSelector(state => state.user.personal_info)
  const lsCountryRedux = useSelector(state => state.common.country)
  const [country, setCountry] = useState()
  const [city, setCity] = useState()
  const [address, setAddress] = useState()
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [phone, setPhone] = useState()
  const [height, setHeight] = useState()
  const [weight, setWeight] = useState()
  const [cen, setCen] = useState(true)
  const [feet, setFeet] = useState()
  const [kg, setKg] = useState(true)
  const [lb, setLb] = useState()
  const [state, setState] = useState()
  const [isLoading, setLoading] = useState(true)
  const [isShowCountry, setShowCountry] = useState(false)
  const [isShowState, setShowState] = useState(false)
  const [isShowLSKG, setShowLSKG] = useState(false)
  const [isShowLSLBS, setShowLSLBS] = useState(false)
  const [isShowLSCM, setShowLSCM] = useState(false)
  const [isShowLSFT, setShowLSFT] = useState(false)
  const listKG = useSelector(state => state.common.listKG)
  const listLB = useSelector(state => state.common.listLB)
  const listCM = useSelector(state => state.common.listCM)
  const [w, setW] = useState('')
  const [ft, setFt] = useState('')
  const [inch, setInch] = useState('')
  const languageRedux = useSelector(state => state.common.language)
  const userinfo = useSelector(state => state.user.userinfo)
  const token = useSelector(state => state.user.token)
  const [weightToSV, setWeightToSV] = useState('')
  const [heighttoSV, setHeightToSV] = useState('')
  const [reload, setReload] = useState(1)
  const [load, setLoad] = useState(1)

  useEffect(() => {
    convertCountry()
    setCity(userinfo?.city || '')
    setAddress(userinfo?.address || '')
    setEmail(userinfo?.medicemail || '')
    setPhone(userinfo?.medicphone || '')
    setName(userinfo?.medicname1 || '')
    setState(userinfo?.state || '')
    checkHeight()
    setTimeout(() => {
      if (load < 4) {
        setLoad(load + 1)
        console.log('thuan')
        setLoading(true)
      }
      setLoading(false)
    }, 1000)
  }, [load])

  useEffect(() => {
    phoneSlice()
  }, [phone])

  useEffect(() => {
    sliceWeight()
    sliceHeight()
  }, [weight, height, reload])

  const checkHeight = () => {
    if (userinfo?.height !== null) {
      if (userinfo?.heightUnit === 1) {
        setHeight(userinfo?.height + 'cm' || '')
        setCen(true)
      }
      if (userinfo?.heightUnit === 0) {
        if ((userinfo?.height || []).length === 2) {
          var h1 = Number(userinfo?.height)
          var h2 = Math.floor(h1 * 0.033)
          var h3 = (h1 * 0.033).toString().slice(2, 5)
          var h4 = concat('0', h3).join('.')
          setHeight(h2 + ' ' + 'ft' + ' ' + Math.round(h4 * 12).toString() + ' ' + 'in')
        }
        if ((userinfo?.height || []).length === 3) {
          var h1 = Number(userinfo?.height)
          var h2 = Math.floor(h1 * 0.033)
          var h3 = (h1 * 0.033).toString().slice(2, 5)
          var h4 = concat('0', h3).join('.')
          setHeight(h2 + ' ' + 'ft' + ' ' + Math.round(h4 * 12).toString() + ' ' + 'in')
        }
        setFeet(true)
      }
    } else {
      setHeight('')
    }
    if (userinfo?.weight !== null) {
      if (userinfo?.weightUnit === 1) {
        setWeight(userinfo?.weight + 'kg' || '')
        setKg(true)
      }
      if (userinfo?.weightUnit === 0) {
        if ((userinfo?.weight || []).length === 2) {
          var w1 = Number(userinfo?.weight)
          setWeight(Math.round(w1 * 2).toString() + 'lbs')
        }
        if ((userinfo?.weight || []).length === 3) {
          var w3 = Number(userinfo?.weight)
          setWeight(Math.round(w3 * 2).toString() + 'lbs')
        }
        setLb(true)
      }
    } else {
      setWeight('')
    }
    console.log('height: ', height)
    console.log('weight: ', weight)
  }

  const convertCountry = () => {
    var i = lsCountryRedux.filter((val) => val.value === userinfo?.country)
    if ((i || []).length > 0) {
        setCountry(i[0].text)
    }
    if ((i || []).length < 0) {
        setCountry('')
    }
  }

  const phoneSlice = () => {
    if ((userinfo?.medicphone || []).length === 9) {
      setPhone(/\D/g, '')
      let phoneNumber = userinfo?.medicphone
      const match = phoneNumber.match(/^(\d{1,3})(\d{0,3})(\d{0,4})(\d{0,6})$/)
      if (match) {
        phoneNumber = `${match[1]}${match[2] ? ' ' : ''}${match[2]}${match[3] ? ' ' : ''}${match[3]}${match[4] ? ' ' : ''}${match[4]}`
      }
      phoneNumber
      setPhone(phoneNumber)
      return
    }
  }

  // render ADDRESS
  const renderAddress = () => {
    return (
      <View style={styles.ctnAddress}>
        <View style={styles.titleLayout}>
          <View style={styles.ctnTitle}>
            <Text style={customTxt(Fonts.SemiBold, 18, color040404).txt}>{Translate(languageRedux).address}</Text>
          </View>
        </View>
        <TextInputCustomize
          title={Translate(languageRedux).COUNTRY}
          onChangeText={(text) => setCountry(text)}
          value={country?.text || country}
          onPress={() => setShowCountry(true)}
          placeholder={Translate(languageRedux).COUNTRY}
        />
        {((country?.value || userinfo?.country) !== 'US') && <TextInputCustomize
          title={Translate(languageRedux).city}
          placeholder={'eg. London'}
          onChangeText={(text) => setCity(text)}
          value={city}
        />}
        {((country?.value || userinfo?.country) === 'US') && <TextInputCustomize
          title={Translate(languageRedux).state}
          onChangeText={(text) => setCity(text)}
          value={state?.label || state}
          onPress={() => setShowState(true)}
        />}
        <TextInputCustomize
          title={Translate(languageRedux).address}
          placeholder={'eg. Piazza Duomo 1'}
          onChangeText={(text) => setAddress(text)}
          value={address}
        />
      </View>
    )
  }
  // render FAMILY PHYSICIAN
  const renderFamilyPhysician = () => {
    return (
      <View style={styles.ctnFamilyPhysician}>
        <View style={styles.titleLayout}>
          <View style={styles.ctnTitle}>
            <Text style={customTxt(Fonts.SemiBold, 18, color040404).txt}>Family Physician</Text>
          </View>
        </View>
        <TextInputCustomize
          title={Translate(languageRedux).name}
          placeholder={'eg. John Doe'}
          onChangeText={(text) => setName(text)}
          value={name}
        />
        <TextInputCustomize
          title={Translate(languageRedux).EMAIL}
          autoCapitalize={'none'}
          placeholder={'eg. johndoe@email.com'}
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInputCustomize
          title={Translate(languageRedux).PHONE}
          autoCapitalize={'none'}
          placeholder={'123 456 789'}
          onChangeText={(text) => setPhone(text)}
          value={phone}
          keyboardType={'phone-pad'}
        />
        {/* {((country?.value || personalInfo?.valueCountry) !== 'US') && ((country?.value || personalInfo?.valueCountry) !== 'VN') &&
        ((country?.value || personalInfo?.valueCountry) !== 'IT') &&
          <TextInputPhoneNumber
            title={Translate(languageRedux).PHONE}
            onChangeText={(text) => setPhone(text)}
            value={phone}
            onPressPhoneCode={() => typeRefPhoneCode.current.open()}
            phoneCode={phoneCode}
            placeholder="123 456 789"
          />}
        {((country?.value || personalInfo?.valueCountry) === 'IT') && <TextInputPhoneNumber
          title={Translate(languageRedux).PHONE}
          onChangeText={(text) => setPhone(text)}
          value={phone}
          onPressPhoneCode={() => typeRefPhoneCode.current.open()}
          phoneCode={'+39'}
          placeholder="123 456 789"
          onPressIn={() => { setPhoneCode('+39') }}
        />}
        {((country?.value || personalInfo?.valueCountry) === 'US') && <TextInputPhoneNumber
          title={Translate(languageRedux).PHONE}
          onChangeText={(text) => setPhone(text)}
          value={phone}
          onPressPhoneCode={() => typeRefPhoneCode.current.open()}
          phoneCode={'+1'}
          placeholder="123 456 789"
          onPressIn={() => { setPhoneCode('+1') }}
        />}
        {((country?.value || personalInfo?.valueCountry) === 'VN') && <TextInputPhoneNumber
          title={Translate(languageRedux).PHONE}
          onChangeText={(text) => setPhone(text)}
          value={phone}
          onPressPhoneCode={() => typeRefPhoneCode.current.open()}
          phoneCode={'+84'}
          placeholder="123 456 789"
          onPressIn={() => { setPhoneCode('+84') }}
        />} */}
      </View>
    )
  }
  // render PHYSICAL CHARACTERISTICS
  const renderPhysicalChara = () => {
    return (
      <View style={styles.ctnPhysicalChara}>
        <View style={styles.titleLayout}>
          <View style={styles.ctnTitle}>
            <Text style={customTxt(Fonts.SemiBold, 18, color040404).txt}>Physical Characteristics</Text>
          </View>
        </View>
        <TextInputCustomize
          title={Translate(languageRedux).height}
          placeholder={'E.g: 1.88'}
          onChangeText={(text) => setHeight(text)}
          value={height}
          onPressCm={_onPressCm}
          onPressFt={_onPressFt}
          cenColor={cen ? color3777EE : colorA7A8A9}
          feetColor={feet ? color3777EE : colorA7A8A9}
          onPress={_onPressHeight}
        />
        <TextInputCustomize
          title={Translate(languageRedux).weight}
          placeholder={'E.g: 78'}
          onChangeText={(text) => setWeight(text)}
          value={weight}
          onPressKg={_onPressKg}
          onPressLb={_onPressLb}
          kgColor={kg ? color3777EE : colorA7A8A9}
          lbColor={lb ? color3777EE : colorA7A8A9}
          onPress={_onPressWeight}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        {renderAddress()}
        {renderPhysicalChara()}
        {renderFamilyPhysician()}
      </View>
    )
  }

  const _onPressHeight = () => {
    cen && setShowLSCM(true)
    feet && setShowLSFT(true)
  }

  const _onPressWeight = () => {
    kg && setShowLSKG(true)
    lb && setShowLSLBS(true)
  }

  const sliceHeight = () => {
    if ((height || []).length > 0) {
      if (((height || []).length === 9) && feet) {
        var h1 = height.slice(0, 1)
        var h2 = height.slice(5, 6)
        setFt(h1)
        setInch(h2)
        setHeightToSV(Math.round(h1 * 30.5) + Math.round(h2 * 2.5))
      }
      if (((height || []).length === 10) && feet) {
        var h1 = height.slice(0, 1)
        var h2 = height.slice(5, 8)
        setFt(h1)
        setInch(h2)
        setHeightToSV(Math.round(h1 * 30.5) + Math.round(h2 * 2.5))
      }
      if (((height || []).length === 4) && cen) {
        var h1 = height.slice(0, 2)
        var h2 = Math.floor(h1 * 0.033)
        var h3 = (h1 * 0.033).toString().slice(2, 5)
        var h4 = concat('0', h3).join('.')
        console.log(h1)
        setFt(h2)
        setInch(h4)
        setHeightToSV(h1)
      }
      if (((height || []).length === 5) && cen) {
        var h1 = height.slice(0, 3)
        var h2 = Math.floor(h1 * 0.033)
        var h3 = (h1 * 0.033).toString().slice(2, 5)
        var h4 = concat('0', h3).join('.')
        setFt(h2)
        setInch(h4)
        setHeightToSV(h1)
      }
    }
  }
  const _onPressCm = () => {
    setCen('cm')
    setFeet('')
    setHeight('')
    setHeight((Math.round(ft * 30.5) + Math.round(inch * 2.5)).toString() + 'cm')
  }
  const _onPressFt = () => {
    setFeet('ft')
    setCen('')
    setHeight('')
    setHeight(ft + ' ' + 'ft' + ' ' + Math.round(inch * 12).toString() + ' ' + 'in')
  }

  const sliceWeight = () => {
    if ((weight || []).length > 0) {
      if ((weight || []).length === 4 && kg) {
        var w1 = weight.slice(0, 2)
        setW(w1)
        setWeightToSV(w1)
      }
      if (((weight || []).length === 5) && lb) {
        var w2 = weight.slice(0, 2)
        setW(w2)
        setWeightToSV(Math.round(w2 * 0.5))
      }
      if (((weight || []).length === 5) && kg) {
        var w3 = weight.slice(0, 3)
        setW(w3)
        setWeightToSV(w3)
      }
      if (((weight || []).length === 6) && lb) {
        var w4 = weight.slice(0, 3)
        setW(w4)
        setWeightToSV(Math.round(w4 * 0.5))
      }
    }
  }
  const _onPressKg = () => {
    setKg('kg')
    setLb('')
    setWeight('')
    setWeight(Math.round(w * 0.5).toString() + 'kg')
  }
  const _onPressLb = () => {
    setLb('lb')
    setKg('')
    setWeight('')
    setWeight(Math.round(w * 2).toString() + 'lbs')
  }

  const _onPressSubmit = () => {
    setLoading(true)
    const body = {
      'nome': userinfo?.nome || '',
      'cognome': userinfo?.cognome || '',
      'birthdate': userinfo?.birthdate || '',
      'country': country?.value || userinfo?.country,
      'midname': userinfo?.midname || '',
      'placeOfBirth': userinfo?.placeOfBirth || '',
      'language_id': userinfo?.language_id || '',
      'gender': userinfo?.gender || 2,
      'city': city || '',
      'phonecode': userinfo?.phonecode,
      'phone1': userinfo?.phone1 || '',
      'address': address || '',
      'medicphone': phone || '',
      'medicemail': email || '',
      'medicname1': name || '',
      'height': heighttoSV || '',
      'weight': weightToSV || '',
      'email': email || '',
      'state': state || '',
      'smoker': userinfo?.smoker || 0,
      'cf': userinfo?.cf === null ? '' : userinfo?.cf,
      'prefix': userinfo?.prefix || 0,
      'suffix': userinfo?.suffix || 0,
      'address2': userinfo?.address2 || null,
      'mobile': userinfo?.mobile || '',
      'has2fa': userinfo?.has2fa || 0,
      'weightUnit': kg ? 1 : 0,
      'heightUnit': cen ? 1 : 0
    }
    console.log('body: ', body)
    axios({
      method: 'post',
      url: `${APIs.hostAPI}backoffice/webdoctor/updatePatientCustomProfile`,
      headers: {
        'x-auth-token': token
      },
      data: body
    })
      .then(response => {
        console.log('data: ', response.data)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
    DeviceEventEmitter.emit('updatePersonal')
    setTimeout(() => {
      setLoading(false)
      NavigationService.goBack()
    }, 5000)
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white"/>
      <Header
        backgroundColor={colorFFFFFF}
        title={Translate(languageRedux).datipersonali}
        buttonText={Translate(languageRedux).SUBMIT}
        onPressSubmit={_onPressSubmit}
        disabled={false}
        backgroundColorButton={color3777EE}
        textButtonColor={colorFFFFFF}
        source={icHeader.ic_left}
      />
      <KeyboardAwareScrollView>{renderBody()}</KeyboardAwareScrollView>
      {
        isShowCountry && (
          <SearchListWithName
            listData={lsCountryRedux}
            title={Translate(languageRedux).CHOOSE_COUNTRY}
            itemSelected={country}
            onItemClick={(val) => {
              setCountry(val)
              setShowCountry(false)
            }}
            onPressRight={() => {
              setShowCountry(false)
            }}
            isText={true}
          />
        )
      }
      {/* {
        isShowProvince && (
          <SearchListWithName
            listData={lsProvince}
            title={'Choose Province'}
            itemSelected={province}
            onItemClick={(val) => {
              setProvince(val)
              setShowProvince(false)
            }}
            onPressRight={() => {
              setShowProvince(false)
            }}
          />
        )
      } */}
      {
        isShowState && (
          <SearchListWithName
            listData={Translate(languageRedux).US_STATES}
            title={Translate(languageRedux).CHOOSE_STATE}
            itemSelected={state}
            onItemClick={(val) => {
              setState(val)
              setReload(Math.random())
              setShowState(false)
            }}
            onPressRight={() => {
              setShowState(false)
            }}
            isLabel={true}
          />
        )
      }
      {
        isShowLSKG && kg && (
          <SearchListWithName
            listData={listKG}
            title={Translate(languageRedux).SELECT_WEIGHT}
            itemSelected={weight}
            onItemClick={(val) => {
              setWeight(val?.name)
              setReload(Math.random())
              setShowLSKG(false)
            }}
            onPressRight={() => {
              setShowLSKG(false)
            }}
          />
        )
      }
      {
        isShowLSLBS && lb && (
          <SearchListWithName
            listData={listLB}
            title={Translate(languageRedux).SELECT_WEIGHT}
            itemSelected={weight}
            onItemClick={(val) => {
              setWeight(val?.name)
              setReload(Math.random())
              setShowLSLBS(false)
            }}
            onPressRight={() => {
              setShowLSLBS(false)
            }}
          />
        )
      }
      {
        isShowLSCM && cen && (
          <SearchListWithName
            listData={listCM}
            title={Translate(languageRedux).SELECT_HEIGHT}
            itemSelected={height}
            onItemClick={(val) => {
              setHeight(val?.name)
              setReload(Math.random())
              setShowLSCM(false)
            }}
            onPressRight={() => {
              setShowLSCM(false)
            }}
          />
        )
      }
      {
        isShowLSFT && feet && (
          <SearchListWithName
            listData={listFT}
            title={Translate(languageRedux).SELECT_HEIGHT}
            itemSelected={height}
            onItemClick={(val) => {
              setHeight(val?.name)
              setReload(Math.random())
              setShowLSFT(false)
            }}
            onPressRight={() => {
              setShowLSFT(false)
            }}
          />
        )
      }
      {isLoading && <LoadingView />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  ctnBody: {
    marginHorizontal: 20
  },
  ctnAddress: {
    flex: 1,
    width: '100%',
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9
  },
  ctnFamilyPhysician: {
    flex: 1,
    width: '100%',
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    marginTop: 21,
    marginBottom: 48,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9
  },
  ctnPhysicalChara: {
    flex: 1,
    width: '100%',
    backgroundColor: colorFFFFFF,
    borderRadius: 16,
    marginTop: 21,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 9
  },
  ctnTitle: {
    height: 24,
    marginLeft: 16
  },
  titleLayout: {
    borderBottomWidth: 1,
    borderBottomColor: colorF0F0F0,
    height: 56,
    justifyContent: 'center',
    marginBottom: 16
  },
  imgCheck: {
    height: 24,
    width: 24
  },
  imgStyle: {
    width: 12,
    height: 6
  },
  viewCheck: {
    position: 'absolute',
    width: 20,
    height: '100%',
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const lsProvince = [
  { 'name': 'Agrigento' },
  { 'name': 'Alessandria' },
  { 'name': 'Ancona' },
  { 'name': 'Aosta' },
  { 'name': 'Arezzo' },
  { 'name': 'Ascoli Piceno' },
  { 'name': 'Asti' },
  { 'name': 'Avellino' },
  { 'name': 'Bari' },
  { 'name': 'Barletta-Andria-Trani' },
  { 'name': 'Belluno' },
  { 'name': 'Benevento' },
  { 'name': 'Bergamo' },
  { 'name': 'Biella' },
  { 'name': 'Bologna' },
  { 'name': 'Bolzano' },
  { 'name': 'Brescia' },
  { 'name': 'Brindisi' },
  { 'name': 'Cagliari' },
  { 'name': 'Caltanissetta' },
  { 'name': 'Campobasso' },
  { 'name': 'Carbonia-Iglesias' },
  { 'name': 'Caserta' },
  { 'name': 'Catania' },
  { 'name': 'Catanzaro' },
  { 'name': 'Chieti' },
  { 'name': 'Como' },
  { 'name': 'Cosenza' },
  { 'name': 'Cremona' },
  { 'name': 'Crotone' },
  { 'name': 'Cuneo' },
  { 'name': 'Enna' },
  { 'name': 'Fermo' },
  { 'name': 'Ferrara' },
  { 'name': 'Florence' },
  { 'name': 'Foggia' },
  { 'name': 'Forlì-Cesena' },
  { 'name': 'Frosinone' },
  { 'name': 'Genoa' },
  { 'name': 'Gorizia' },
  { 'name': 'Grosseto' },
  { 'name': 'Imperia' },
  { 'name': 'Isernia' },
  { 'name': 'L`Aquila' },
  { 'name': 'La Spezia' },
  { 'name': 'Latina' },
  { 'name': 'Lecce' },
  { 'name': 'Lecco' },
  { 'name': 'Livorno' },
  { 'name': 'Lodi' },
  { 'name': 'Lucca' },
  { 'name': 'Macerata' },
  { 'name': 'Mantua' },
  { 'name': 'Massa-Carrara' },
  { 'name': 'Matera' },
  { 'name': 'Medio Campidano' },
  { 'name': 'Messina' },
  { 'name': 'Milan' },
  { 'name': 'Modena' },
  { 'name': 'Monza e Brianza' },
  { 'name': 'Naples' },
  { 'name': 'Novara' },
  { 'name': 'Nuoro' },
  { 'name': 'Ogliastra' },
  { 'name': 'Olbia-Tempio' },
  { 'name': 'Oristano' },
  { 'name': 'Padua' },
  { 'name': 'Palermo' },
  { 'name': 'Parma' },
  { 'name': 'Pavia' },
  { 'name': 'Perugia' },
  { 'name': 'Pesaro e Urbino' },
  { 'name': 'Pescara' },
  { 'name': 'Piacenza' },
  { 'name': 'Pisa' },
  { 'name': 'Pistoia' },
  { 'name': 'Pordenone' },
  { 'name': 'Potenza' },
  { 'name': 'Prato' },
  { 'name': 'Ragusa' },
  { 'name': 'Ravenna' },
  { 'name': 'Reggio di Calabria' },
  { 'name': 'Reggio nell`Emilia' },
  { 'name': 'Rieti' },
  { 'name': 'Rimini' },
  { 'name': 'Rome' },
  { 'name': 'Rovigo' },
  { 'name': 'Salerno' },
  { 'name': 'Sassari' },
  { 'name': 'Savona' },
  { 'name': 'Siena' },
  { 'name': 'Sondrio' },
  { 'name': 'Syracuse' },
  { 'name': 'Taranto' },
  { 'name': 'Teramo' },
  { 'name': 'Terni' },
  { 'name': 'Trapani' },
  { 'name': 'Trento' },
  { 'name': 'Treviso' },
  { 'name': 'Trieste' },
  { 'name': 'Turin' },
  { 'name': 'Udine' },
  { 'name': 'Varese' },
  { 'name': 'Venice' },
  { 'name': 'Verbano-Cusio-Ossola' },
  { 'name': 'Vercelli' },
  { 'name': 'Verona' },
  { 'name': 'Vibo Valentia' },
  { 'name': 'Vicenza' },
  { 'name': 'Viterbo' }
]

const lsState = [
  { 'name': 'Alabama' },
  { 'name': 'Alaska' },
  { 'name': 'Arizona' },
  { 'name': 'Arkansas' },
  { 'name': 'California' },
  { 'name': 'Colorado' },
  { 'name': 'Connecticut' },
  { 'name': 'Delaware' },
  { 'name': 'Washington' },
  { 'name': 'Florida' },
  { 'name': 'Georgia' },
  { 'name': 'Hawaii' },
  { 'name': 'Idaho' },
  { 'name': 'Illinois' },
  { 'name': 'Indiana' },
  { 'name': 'Iowa' },
  { 'name': 'Kansas' },
  { 'name': 'Kentucky' },
  { 'name': 'Louisiana' },
  { 'name': 'Maine' },
  { 'name': 'Maryland' },
  { 'name': 'Massachusetts' },
  { 'name': 'Michigan' },
  { 'name': 'Minnesota' },
  { 'name': 'Mississippi' },
  { 'name': 'Missouri' },
  { 'name': 'Montana' },
  { 'name': 'Nebraska' },
  { 'name': 'Nevada' },
  { 'name': 'New Hampshire' },
  { 'name': 'New Jersey' },
  { 'name': 'New Mexico' },
  { 'name': 'New York' },
  { 'name': 'North Carolina' },
  { 'name': 'North Dakota' },
  { 'name': 'Ohio' },
  { 'name': 'Oklahoma' },
  { 'name': 'Oregon' },
  { 'name': 'Pennsylvania' },
  { 'name': 'Rhode Island' },
  { 'name': 'South Carolina' },
  { 'name': 'South Dakota' },
  { 'name': 'Tennessee' },
  { 'name': 'Texas' },
  { 'name': 'Utah' },
  { 'name': 'Vermont' },
  { 'name': 'Virginia' },
  { 'name': 'Washington' }
]

const listFT = [
  {'name': '4 ft 0 in'},
  { 'name': '4 ft 1 in' },
  { 'name': '4 ft 2 in' },
  { 'name': '4 ft 3 in' },
  { 'name': '4 ft 4 in' },
  { 'name': '4 ft 5 in' },
  { 'name': '4 ft 6 in' },
  { 'name': '4 ft 7 in' },
  { 'name': '4 ft 8 in' },
  { 'name': '4 ft 9 in' },
  { 'name': '4 ft 10 in' },
  { 'name': '4 ft 11 in' },
  { 'name': '5 ft 0 in' },
  { 'name': '5 ft 1 in' },
  { 'name': '5 ft 2 in' },
  { 'name': '5 ft 3 in' },
  { 'name': '5 ft 4 in' },
  { 'name': '5 ft 5 in' },
  { 'name': '5 ft 6 in' },
  { 'name': '5 ft 7 in' },
  { 'name': '5 ft 8 in' },
  { 'name': '5 ft 9 in' },
  { 'name': '5 ft 10 in' },
  { 'name': '5 ft 11 in' },
  { 'name': '6 ft 0 in' },
  { 'name': '6 ft 1 in' },
  { 'name': '6 ft 2 in' },
  { 'name': '6 ft 3 in' },
  { 'name': '6 ft 4 in' },
  { 'name': '6 ft 5 in' },
  { 'name': '6 ft 6 in' },
  { 'name': '6 ft 7 in' },
  { 'name': '6 ft 8 in' },
  { 'name': '6 ft 9 in' },
  { 'name': '6 ft 10 in' },
  { 'name': '6 ft 11 in' },
  { 'name': '7 ft 0 in' },
  { 'name': '7 ft 1 in' },
  { 'name': '7 ft 2 in' },
  { 'name': '7 ft 3 in' },
  { 'name': '7 ft 4 in' },
  { 'name': '7 ft 5 in' },
  { 'name': '7 ft 6 in' },
  { 'name': '7 ft 7 in' },
  { 'name': '7 ft 8 in' },
  { 'name': '7 ft 9 in' },
  { 'name': '7 ft 10 in' },
  { 'name': '7 ft 11 in' }
]
