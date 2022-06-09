import Header from 'components/Header'
import { color040404, color3777EE, color5C5D5E, colorFFFFFF } from 'constants/colors'
import React, { useEffect, useState } from 'react'
import {
  StyleSheet, View, Text, Image, Dimensions,
  FlatList
} from 'react-native'
import icDataTracking from '../../../../../assets/images/data_tracking'
import icHeader from '../../../../../assets/images/header'
import { useSelector } from 'react-redux'
import Translate from 'translate'
import CustomButtonFillFix from 'views/home_screen/direct_call/component_direct_call/CustomButtonFillFix'
import { border, customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import BleManager from 'react-native-ble-manager'
import { NativeModules, NativeEventEmitter } from 'react-native'
import _ from 'lodash'

export default function NewMesurement({
  setNew
}) {
  const languageRedux = useSelector(state => state.common.language)
  const [lsDevice, setLsDevice] = useState([])
  const [isSearch, setSearch] = useState(true)

  useEffect(() => {
    onPressScanDevice()
  }, [])

  const onPressScanDevice = () => {
    ls = []
    setLsDevice([])
    BleManager.scan([], 10, true).then(() => {
      // Success code
      console.log('Scan started: ')
    })

    setTimeout(() => {
      console.log('Scan Stop')
      setSearch(false)
    }, 1000 * 5)
  }

  var ls = []
  useEffect(() => {
    const BleManagerModule = NativeModules.BleManager
    const bleManagerEmitter = new NativeEventEmitter(BleManagerModule)

    const disciverOeripheral = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', (args) => {
      // The id: args.id
      // The name: args.name
      console.log('BleManagerDiscoverPeripheral: ', args)
      const filter = ls.filter(val => val?.id === args?.id)
      if (filter.length === 0) {
        if (!(_.isEmpty(args.name))) {
          ls.push(args)
          console.log('addDevice: ', ls)
          setLsDevice(ls)
        }
      }
    })

    return () => disciverOeripheral.remove()
  }, [])

  const renderCell = (item) => {
    return (
      <View style={[
        styles.cellView,
        border().borderB
      ]}>
        <Text style={customTxt(Fonts.Medium, 14, color040404).txt}>{item?.name}</Text>
      </View>
    )
  }

  const renderLsDevice = () => {
    return (
      <FlatList
        style={styles.flatlist}
        data={lsDevice}
        extraData={lsDevice}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => renderCell(item)}
      />
    )
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={Translate(languageRedux).NEW_MESUREMENT}
        iconRight={icHeader.ic_close}
        onPressRight={setNew}
      />
      {
        lsDevice.length > 0 ?
          renderLsDevice()
          : (
            <>
              <Image source={icDataTracking.ic_bluetooth} style={styles.imgBLue} />
              <View style={styles.centerView}>
                <Text style={
                  customTxt(Fonts.Bold, 20, color3777EE).txt
                }>{Translate(languageRedux).FIND_YOUR_DEVICE}</Text>
                <Text style={[
                  customTxt(Fonts.Regular, 14, color5C5D5E).txt,
                  styles.txtContentCenter
                ]}>{Translate(languageRedux).POWER_ON_YOUR}</Text>
              </View>
            </>
          )
      }
      <View style={styles.bottomView}>
        <CustomButtonFillFix
          title={Translate(languageRedux).find_devices}
          btStyle={[
            styles.btStyle,
            isSearch ? styles.opacity4 : null
          ]}
          onPress={onPressScanDevice}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    top: 0,
    left: 0,
    backgroundColor: colorFFFFFF,
    alignItems: 'center'
  },
  imgBLue: {
    width: 304,
    height: 304,
    resizeMode: 'contain'
  },
  centerView: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 32,
    paddingLeft: 20,
    paddingRight: 20
  },
  txtContentCenter: {
    marginTop: 16,
    textAlign: 'center'
  },
  bottomView: {
    width: '100%',
    padding: 20
  },
  btStyle: {
    width: '100%',
    height: 48,
    marginBottom: 20
  },
  opacity4: {
    opacity: 0.4
  },
  flatlist: {
    flex: 1,
    width: '100%'
  },
  cellView: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    paddingBottom: 20
  }
})
