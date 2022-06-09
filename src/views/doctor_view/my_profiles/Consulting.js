import { color040404, color0B40B1, color3777EE, colorF0F0F0, colorF8F8F8, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import React, {useEffect, useState} from 'react'
import {
  StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, RefreshControl, DeviceEventEmitter
} from 'react-native'
import { useSelector } from 'react-redux'
import Translate from 'translate'
import CSS from '../../../constants/css'
import icon from '../../../../assets/images/video_call'

export default function ConsultingView({
  virtualOffice, onPressUpdate, onPressNewFee,
  onPressEdit,
  fees,
  refreshing, setRefresh
}) {
  const languageRedux = useSelector(state => state.common.language)
  const [base64Signature, setBase64Signature] = useState()

  const onRefresh = () => {
    setRefresh(true)
  }

  useEffect(() => {
    console.log('virtualOffice: ', virtualOffice)
    if (virtualOffice?.signature) {
      var base64 = `${virtualOffice?.signature}`
      setBase64Signature({ uri: base64 })
    }
  }, [virtualOffice])

  //render
  const renderTop = () => {
    return (
      <View style={styles.topView}>
        <Text style={[
          customTxt(Fonts.Bold, 18, color040404).txt
        ]}>{Translate(languageRedux).FEES_MANAGEMENT}</Text>
        <TouchableOpacity
          style={styles.addNewView}
          onPress={onPressNewFee}
        >
          <Text style={[
            customTxt(Fonts.Bold, 14, color3777EE).txt
          ]}>{Translate(languageRedux).ADD_NEW}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderCenter = () => {
    return (
      <View>
        {fees && fees.map(val => {
          return (
            <View style={styles.feesView}>
              <View style={styles.flexView}>
                <Text style={[
                  customTxt(Fonts.SemiBold, 16, color040404).txt
                ]}>{val?.visitTypeName || ''}</Text>
                <Text style={[
                  customTxt(Fonts.Regular, 14, color040404).txt,
                  styles.txtPrice
                ]}>{val?.timeslot ? `${val?.timeslot} ${Translate(languageRedux).MINS}` : ''} - {`${val?.currency || 'EUR'} ${val?.fee || '0.00'}`}</Text>
              </View>
              <View style={styles.btItemView}>
                <TouchableOpacity
                  onPress={() => onPressEdit(val)}
                  style={styles.btIcon}>
                  <Image source={icon.ic_edit} style={styles.iconStyle} />
                </TouchableOpacity>
                {/* <TouchableOpacity
                  onPress={() => onPressDelete(val)}
                  style={styles.btIcon}>
                  <Image source={icon.ic_trash} style={styles.iconStyle} />
                </TouchableOpacity> */}
              </View>
            </View>
          )
        })}
      </View>
    )
  }

  const renderBototm = () => {
    return (
      <View style={[styles.bottomView, CSS.shadown]}>
        <Text style={[
          customTxt(Fonts.Bold, 18, color040404).txt
        ]}>{Translate(languageRedux).YOUR_SIGNATURE}</Text>
        {base64Signature && <Image
          source={base64Signature}
          style={styles.imgSignature}
        />}
        <TouchableOpacity
          style={styles.updateView}
          onPress={onPressUpdate}
        >
          <Text style={[
            customTxt(Fonts.Bold, 14, color3777EE).txt
          ]}>{Translate(languageRedux).update_list}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={[styles.fullView]}>
        <ScrollView
          style={styles.scrollStyle}
          contentContainerStyle={styles.contentContainerStyle}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || false}
              onRefresh={onRefresh}
              tintColor={color0B40B1}
            />
          }
        >
          <View style={styles.insideView}>
            <View style={[styles.topFeesManagement, CSS.shadown]}>
              {renderTop()}
              {renderCenter()}
            </View>
            {renderBototm()}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  fullView: {
    flex: 1,
    marginBottom: 60
  },
  scrollStyle: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: colorF8F8F8
  },
  insideView: {
    backgroundColor: colorF8F8F8,
    overflow: 'hidden'
  },
  topView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginLeft: 16
  },
  addNewView: {
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: color3777EE
  },
  feesView: {
    borderRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: colorF0F0F0,
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  bottomView: {
    paddingTop: 16,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colorFFFFFF
  },
  imgSignature: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: colorF0F0F0,
    borderRadius: 12,
    marginTop: 24
  },
  updateView: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: color3777EE,
    marginTop: 16
  },
  topFeesManagement: {
    backgroundColor: colorFFFFFF,
    margin: 16,
    borderRadius: 12
  },
  txtPrice: {
    marginTop: 8,
    marginBottom: 16
  },
  flexView: {
    flex: 1
  },
  btItemView: {
    flexDirection: 'row'
  },
  iconStyle: {
    width: 20,
    height: 20
  },
  btIcon: {
    padding: 15
  }
})
