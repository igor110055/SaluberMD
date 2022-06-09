import Header from 'components/Header'
import { color3777EE, color5C5D5E, colorEAF1FF, colorFFFFFF } from 'constants/colors'
import React, { useEffect, useState } from 'react'
import {
  StyleSheet, View, Text, Dimensions, NativeModules, NativeEventEmitter,
  Image,
  DeviceEventEmitter
} from 'react-native'
import icHeader from '../../../../../assets/images/header'
import { useDispatch, useSelector } from 'react-redux'
import Translate from 'translate'
import Fonts from 'constants/Fonts'
import BleManager from 'react-native-ble-manager'
import { MaterialIndicator } from 'react-native-indicators'
import { customTxt } from 'constants/css'
import _ from 'lodash'
const BleManagerModule = NativeModules.BleManager
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule)
import icDataTracking from '../../../../../assets/images/data_tracking'
import CustomButtonFillFix from 'views/home_screen/direct_call/component_direct_call/CustomButtonFillFix'
import { apiSaveDeviceSpO2, apiSaveDeviceTemperature } from 'api/DataTracking'
import NotificationView, { STATUS_NOTIFY } from 'components/NotificationView'
import LoadingView from 'components/LoadingView'
import Routes from '../../../../navigation/Routes'
import { WaveIndicator } from 'react-native-indicators'

export default function NewMesurement({
  setNew, title, tempUnit
}) {
  const languageRedux = useSelector(state => state.common.language)
  const [dataSPO2, setDataSPO2] = useState()
  const [isIndicator, setIndicator] = useState(true)
  const [isFind, setFind] = useState(true)
  const [isConnect, setConnect] = useState(false)
  const dispatch = useDispatch()
  const [dataNoti, setDataNoti] = useState()
  const [isShowNoti, setShowNoti] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [temperature, setTemperature] = useState('')
  const [temperatureSendSV, setTemperatureSendSV] = useState('')
  const [txtErr, setTxtErr] = useState()

  useEffect(() => {
    setTimeout(() => {
      _onPressFind()
    }, 500)
  }, [])

  useEffect(() => {
    BleManager.start({ showAlert: false })
    const sub = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral)
    const sub2 = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral)
    const sub3 = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic)

    return () =>
      Promise.all([
        sub.removeListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral),
        sub2.removeListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral),
        sub3.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic)
      ])
  }, [])

  useEffect(() => {
    if (isConnect && !isIndicator) {
      if (title === Translate(languageRedux).DEVICE_SPO2) {
        // _onPressSave()
      }
    }
  }, [isConnect, isIndicator])

  const handleDisconnectedPeripheral = (data) => {
    console.log('Disconnected from ' + data?.peripheral)
  }

  const handleDiscoverPeripheral = (peripheral) => {
    if (_.includes((peripheral?.name || '').toLowerCase(), 'pc-60f') && title === Translate(languageRedux).DEVICE_SPO2) { // mã định danh tên máy SpO2
      toggleConnectPeripheral(peripheral)
    } else if (_.includes((peripheral?.name || '').toLowerCase(), 'AOJ-20A'.toLowerCase()) && title === Translate(languageRedux).TEMPERATURE) {//AOJ-20A tên máy đo nhiệt kế
      toggleConnectPeripheral(peripheral)
    }
  }

  const handleUpdateValueForCharacteristic = (data) => {
    console.log('Received data from ' + data?.peripheral + ' characteristic ' + data?.characteristic, data?.value)
    if (data?.value) {
      convertData(data?.value)
    }
  }

  const toggleConnectPeripheral = (dt) => {
    if (dt?.id) {
      BleManager.stopScan()
      try {
        BleManager.connect(dt?.id).then(() => {
          console.log('toggleConnectPeripheral connect device : ', dt)
          setConnect(true)
          setFind(false)
          setTimeout(() => {
            setIndicator(false)
          }, 1000 * 35)
          const lsUUIDs = dt?.advertising?.serviceUUIDs || []
          if (lsUUIDs.length > 0) {
            try {
              BleManager.getConnectedPeripherals(lsUUIDs || []).then((results) => {
                if ((results || []).length === 0) {
                  console.log('No connected peripherals')
                }
                console.log('getConnectedPeripherals'.results)
              })

            } catch (error) {

            }

            try {
              BleManager.retrieveServices(dt?.id, [lsUUIDs[0]]).then(async (peripheralData) => {
                console.log('Retrieved peripheral services', peripheralData)

                if (title === Translate(languageRedux).DEVICE_SPO2) {
                  setTimeout(async () => {
                    await BleManager.startNotification(dt?.id, lsUUIDs[0], '6E400003-B5A3-F393-E0A9-E50E24DCCA9E').then(() => {
                      console.log('Started notification on ' + dt.id)
                    }).catch((error) => {
                      console.log('Notification error', error)
                    })
                  }, 500)

                  await BleManager.read(dt?.id, lsUUIDs[0], '6E400003-B5A3-F393-E0A9-E50E24DCCA9E').then(res => {
                    if (res) {
                      console.log('data read: ', res)
                      convertData(res)
                    }
                  })
                } else if (title === Translate(languageRedux).TEMPERATURE) {
                  setTimeout(async () => {
                    await BleManager.startNotification(dt?.id, lsUUIDs[0], 'FFE1').then(() => {
                      console.log('Started notification on ' + dt.id)
                    }).catch((error) => {
                      console.log('Notification error', error)
                    })
                  }, 500)

                  await BleManager.read(dt.id, lsUUIDs[0], 'FFE1').then(res => {
                    if (res) {
                      console.log('data read: ', res)
                      // convertData(res)
                    }
                  })
                }
              })
            } catch (error) {

            }
          }
        }).catch((error) => {
          console.log('Connection error', error)
        })
      } catch (error) {

      }
    }
  }

  const [lsData, setLsData] = useState([])

  const convertData = (readData) => {
    var Buffer = require('buffer/').Buffer
    switch (title) {
      case Translate(languageRedux).DEVICE_SPO2:
        if ((readData || []).length > 11) {
          try {
            var a = Buffer.from(readData)//getCharacter[1].value?.bytes
            var b = a.buffer
            b = buf2hex(b)

            b = b.substring(2, b.length)
            var bytesHex = b.match(/.{1,2}/g)
            if ((bytesHex || []).length < 7) {
              return
            }
            var token = parseInt(bytesHex[1], 16)
            // var len = parseInt(bytesHex[2], 16)
            var type = parseInt(bytesHex[3], 16)
            switch (type) {
              case 1:
                if (token === 15) {
                  var value = { nSpO2: parseInt(bytesHex[4], 16), nPR: parseInt(bytesHex[5], 16), fPI: (parseInt(bytesHex[7], 16) / 10) }
                  if (value?.nSpO2 > 79 && value?.nSpO2 < 101) {
                    setLsData(old => [...old, value])
                    setConnect(true)
                    setDataSPO2(value)
                    setTxtErr()
                  } else {
                    setTxtErr('Out of range. Take reading again')
                  }
                }
                break
              default:
                break
            }
          } catch (error) {

          }

        }
        break
      case Translate(languageRedux).TEMPERATURE:
        try {
          var a = Buffer.from(readData)
          b = a.buffer
          b = buf2hex(b)
          bytesHex = b.match(/.{1,2}/g)
          if ((bytesHex || []).length < 6) {
            return
          }
          var temp = parseInt(bytesHex[4] + bytesHex[5], 16)
          temp = (Math.round(temp * 100) / 10000)
          console.log('temperature111: ', temp)
          if (temp > 32 && temp < 43) {//(mode === 1) {
            if (Number(temp || 0) > 32 && Number(temp || 0) < 45) {
              if (tempUnit === 1) {
                setTemperatureSendSV(temp)
                temp = temp + ' °C'
              } else {
                temp = cToF(temp)
              }
              setConnect(true)
              setTemperature(temp)
              setTxtErr()
              console.log('temperature: ', temp)
            } else {
              setTemperature()
              setTxtErr('Out of range. Take reading again')
            }
          } else {
            setTemperature()
            setTxtErr('Out of range. Take reading again')
          }
        } catch (error) {

        }
        break
      default:
        break
    }
  }

  function cToF(celsius) {
    const cTemp = celsius
    const cToFahr = cTemp * 9 / 5 + 32
    setTemperatureSendSV(cToFahr.toFixed(2))
    return cToFahr.toFixed(2) + ' °F'
  }


  function buf2hex(buffer) { // buffer is an ArrayBuffer
    try {
      return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('')
    } catch (error) { }
  }

  const renderCell = (titleCell, content) => {
    return (
      <View style={styles.centerView}>
        <View style={styles.viewLeft}>
          <Text style={[
            customTxt(Fonts.SemiBold, 20, color3777EE).txt
          ]}>{titleCell}</Text>
        </View>
        <View style={styles.viewRight}>
          <Text style={[
            customTxt(Fonts.Bold, 42, color3777EE).txt
          ]}>{content}</Text>
        </View>
      </View>

    )
  }

  const renderContentFind = () => {
    switch (title) {
      case Translate(languageRedux).DEVICE_SPO2:
        return Translate(languageRedux).POWER_ON_YOUR
      case Translate(languageRedux).TEMPERATURE:
        return Translate(languageRedux).BLUETOOTH_TEMPERATURE
      default:
        return ''
    }
  }

  const renderWaveIndicator = () => {
    return (
      <View style={styles.waveIndicatorStyle}>
        <WaveIndicator
          color={colorEAF1FF}
          size={304}
          count={5}
          waveFactor={0.7}
          waveMode={'outline'}
        />
      </View>
    )
  }

  const renderFilterDevice = () => {
    return (
      <View style={styles.findDeviceView}>
        {renderWaveIndicator()}
        <Image source={icDataTracking.ic_bluetooth} style={styles.imgBLue} />
        <View style={styles.centerFindView}>
          <Text numberOfLines={1} style={
            customTxt(Fonts.Bold, 18, color3777EE).txt
          }>{Translate(languageRedux).FIND_YOUR_DEVICE}</Text>
          <Text style={[
            customTxt(Fonts.Regular, 14, color5C5D5E).txt,
            styles.txtContentCenter
          ]}>{renderContentFind()}</Text>
          {/* {
            isFind && (
              <View style={styles.indicatorView}>
                <MaterialIndicator
                  color={color3777EE}
                  size={30}
                />
              </View>
            )
          } */}
        </View>
        {/* {!isFind && (<View style={styles.bottomView}>
          <CustomButtonFillFix
            title={Translate(languageRedux).find_devices}
            btStyle={[
              styles.btStyle,
              isFind ? styles.opacity4 : null
            ]}
            onPress={_onPressFind}
          />
        </View>)} */}
      </View>
    )
  }

  const _onPressSave = () => {
    setLoading(true)
    dispatch(apiSaveDeviceSpO2(lsData)).then((res) => {
      setLoading(false)
      if (res?.payload?.esito === '0') {
        setTimeout(() => {
          DeviceEventEmitter.emit(Routes.LIST_SPO2_SCREEN)
        }, 500)
        setNew(false)
      } else {
        setShowNoti(true)
        setDataNoti({
          status: STATUS_NOTIFY.ERROR,
          content: res?.payload?.motivo || 'error'
        })
      }
    }).catch(() => {
      setShowNoti(true)
      setLoading(false)
      setDataNoti({
        status: STATUS_NOTIFY.ERROR,
        content: 'Error server'
      })
    })
  }

  const _onPressSaveTemperature = () => {
    const params = {
      name: 'AOJ-20A',
      temp: temperatureSendSV
    }
    setLoading(true)
    dispatch(apiSaveDeviceTemperature(params)).then(res => {
      setLoading(false)
      console.log('res body: ', res)
      if (res?.payload?.esito === '0') {
        setTimeout(() => {
          DeviceEventEmitter.emit(Routes.LIST_BODY_TEMPERATURE)
        }, 500)
        setNew(false)
      } else {
        setShowNoti(true)
        setDataNoti({
          status: STATUS_NOTIFY.ERROR,
          content: res?.payload?.motivo || 'error'
        })
      }
    }).catch(() => {
      setShowNoti(true)
      setLoading(false)
      setDataNoti({
        status: STATUS_NOTIFY.ERROR,
        content: 'Error server'
      })
    })
  }

  const _onPressReMeasurement = () => {
    setTemperature('--')
    setDataSPO2()
    setLsData([])
    _onPressFind()
  }

  const checkRenderConnectDevice = () => {
    switch (title) {
      case Translate(languageRedux).DEVICE_SPO2:
        return (
          <View style={styles.temperatureView}>
            <Text style={[
              customTxt(Fonts.Bold, 18, color3777EE).txt,
              styles.txtTitle
            ]}>{Translate(languageRedux).TO_STOP}</Text>
            <View style={styles.cView}>
              {renderCell('SpO2', `${dataSPO2?.nSpO2 || '--'}%`)}
              {renderCell('HR', `${dataSPO2?.nPR || '--'} bpm`)}
              {renderCell('PI', `${dataSPO2?.fPI || '--'}`)}
              {isIndicator && renderIndicator()}
              {
                txtErr && (
                  <Text style={[
                    customTxt(Fonts.Medium, 20, color3777EE).txt
                  ]}>{txtErr}</Text>
                )
              }
            </View>
            <View style={styles.bottomView}>
              {
                (lsData || []).length > 0 && (
                  <CustomButtonFillFix
                    title={Translate(languageRedux).btnsave}
                    btStyle={[
                      styles.btStyle
                    ]}
                    onPress={_onPressSave}
                  />
                )
              }
              <CustomButtonFillFix
                title={Translate(languageRedux).RE_MEASUREMENT}
                btStyle={[
                  styles.btReMeasurement
                ]}
                txtStyle={[
                  customTxt(Fonts.Bold, 18, color3777EE).txt
                ]}
                onPress={_onPressReMeasurement}
              />
            </View>
          </View>
        )
      case Translate(languageRedux).TEMPERATURE:
        return (
          <View style={styles.temperatureView}>
            {
              !temperature && !txtErr && (
                <Text style={[
                  customTxt(Fonts.Bold, 18, color3777EE).txt,
                  styles.txtTitleTemperatureConnect
                ]}>{Translate(languageRedux).DEVICE_CONNECT_TEMPERATURE}</Text>
              )
            }
            <View style={styles.cView}>
              <Text style={[
                customTxt(Fonts.Bold, 50, color3777EE).txt
              ]}>{temperature || '--'}</Text>
              {
                txtErr && (
                  <Text style={[
                    customTxt(Fonts.Medium, 20, color3777EE).txt
                  ]}>{txtErr}</Text>
                )
              }
            </View>
            <View style={styles.bottomView}>
              <CustomButtonFillFix
                title={Translate(languageRedux).btnsave}
                btStyle={[
                  styles.btStyle
                ]}
                onPress={_onPressSaveTemperature}
              />
              <CustomButtonFillFix
                title={Translate(languageRedux).RE_MEASUREMENT}
                btStyle={[
                  styles.btReMeasurement
                ]}
                txtStyle={[
                  customTxt(Fonts.Bold, 18, color3777EE).txt
                ]}
                onPress={_onPressReMeasurement}
              />
            </View>
          </View>
        )
      default:
        return null
    }
  }

  const renderConnectDevice = () => {
    return checkRenderConnectDevice()
  }

  const renderIndicator = () => {
    return (
      <View style={styles.indicatorStyle}>
        <MaterialIndicator
          color={color3777EE}
          size={30}
        />
        <Text style={[
          styles.txtMerge,
          customTxt(Fonts.Medium, 20, color3777EE).txt
        ]}>{Translate(languageRedux).measure_in_progress}</Text>
      </View>
    )
  }

  const _onPressFind = () => {
    BleManager.checkState()
    BleManager.scan([], 60 * 3, true)
    setTimeout(() => {
      setFind(false)
    }, 60 * 3 * 1000)
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colorFFFFFF}
        textCenter={title || Translate(languageRedux).NEW_MESUREMENT}
        // iconLeft={icHeader.ic_left}
        // onPressLeft={setNew}
        iconRight={icHeader.ic_close}
        onPressRight={() => {
          setNew()
          BleManager.stopScan()
        }}
      />
      {
        isConnect ?
          renderConnectDevice()
          :
          renderFilterDevice()
      }
      {isLoading && <LoadingView />}
      <NotificationView
        isShow={isShowNoti}
        setShow={() => setShowNoti(false)}
        status={dataNoti?.status || STATUS_NOTIFY.ERROR}
        content={dataNoti?.content || ''}
      />
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
    backgroundColor: colorFFFFFF
  },
  bottomView: {
    width: '100%',
    padding: 20,
    marginBottom: 40
  },
  btStyle: {
    width: '100%',
    height: 48,
    marginBottom: 20
  },
  btReMeasurement: {
    backgroundColor: colorFFFFFF
  },
  opacity4: {
    opacity: 0.4
  },
  txtTitle: {
    marginLeft: 30,
    marginRight: 30,
    textAlign: 'center',
    marginBottom: 100
  },
  centerView: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerFindView: {
    flex: 1,
    width: Dimensions.get('window').width - 50,
    alignItems: 'center',
    marginLeft: 24,
    marginRight: 24
  },
  viewLeft: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 10,
    marginLeft: -60,
    marginRight: 40
  },
  viewRight: {
    flex: 1
  },
  indicatorStyle: {
    flex: 1,
    marginTop: 20
  },
  txtMerge: {
    marginTop: 20
  },
  imgBLue: {
    width: 304,
    height: 304,
    resizeMode: 'contain'
  },
  txtContentCenter: {
    marginTop: 16,
    textAlign: 'center'
  },
  findDeviceView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 24,
    marginRight: 24
  },
  temperatureView: {
    flex: 1,
    alignItems: 'center'
  },
  txtTitleTemperatureConnect: {
    textAlign: 'center',
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20
  },
  cView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 24,
    marginRight: 24
  },
  indicatorView: {
    marginTop: 40,
    marginBottom: 100
  },
  waveIndicatorStyle: {
    width: '100%',
    height: 304,
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
