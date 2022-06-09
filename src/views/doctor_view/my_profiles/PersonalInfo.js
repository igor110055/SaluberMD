import { color040404, color3777EE, colorF0F0F0, colorF8F8F8, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import { convertDDMMYYYY } from 'constants/DateHelpers'
import Fonts from 'constants/Fonts'
import React, { useEffect, useState } from 'react'
import {
  StyleSheet, View, Text, Image, ScrollView
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import Translate from 'translate'
import imgAccount from '../../../../assets/images/account'
import imgAvatar from '../../../../assets/images/account'
import _ from 'lodash'

export default function PersonalInfoView({
  virtualOffice, onPressEdit, onPressPhoto, lsSpecialty
}) {
  const languageRedux = useSelector(state => state.common.language)
  const userinfoRedux = useSelector(state => state.user.userinfo)
  const summaryRedux = useSelector(state => state.user.summary)
  const [imgAvt, setImgAvt] = useState()

  const GENDERS = [
    { name: Translate(languageRedux).male, id: 0 },
    { name: Translate(languageRedux).female, id: 1 },
    { name: Translate(languageRedux).I_WOULD_RATHER_NOT_SAY, id: 2 }
  ]
  const [strSpec, setStrSpec] = useState(false)

  useEffect(() => {
    if (virtualOffice && lsSpecialty) {
      convertSpec()
    }
  }, [virtualOffice, lsSpecialty])

  useEffect(() => {
    if (userinfoRedux?.userImage) {
      var base64 = `data:image/png;base64,${userinfoRedux?.userImage}`
      setImgAvt({ uri: base64 })
    }
  }, [userinfoRedux])

  const convertSpec = () => {
    const lsData = virtualOffice?.specializations || []
    const newData = (lsSpecialty || []).map(val => {
      if (_.includes(lsData, Number(val?.value || '-1'))) {
        return {
          label: val?.label,
          value: val?.value,
          isSelected: true
        }
      } else {
        return {
          label: val?.label,
          value: val?.value
        }
      }
    })

    const getLsSpec = (newData || []).filter(val1 => val1.isSelected).map((val, index) => {
      return `${val?.label} ${(newData || []).filter(val1 => val1.isSelected).length === (index + 2) ? ' and ' : ((newData || []).filter(val1 => val1.isSelected).length === (index + 1) ? '.' : ', ')}`
    })
    console.log('getLsSpec', getLsSpec)
    setStrSpec(getLsSpec)
  }

  const renderTop = () => {
    return (
      <View style={styles.topView}>
        <TouchableOpacity
          style={styles.ctnAvatar}
          onPress={onPressPhoto}
        >
          <View style={styles.avtView}>
            <Image source={imgAvt || imgAccount.ic_profile_avatar} style={styles.imgAvt} />
          </View>
          <View
            style={styles.ctnIconChangeAvt}>
            <Image source={imgAvatar.ic_camera} style={styles.iconChangeAvtStyle} />
          </View>
        </TouchableOpacity>
        <View style={styles.centerTopView}>
          <Text style={[
            customTxt(Fonts.SemiBold, 16, color040404).txt
          ]}>{Translate(languageRedux).doctorupdate} {userinfoRedux?.nome}</Text>
          <Text style={[
            customTxt(Fonts.Regular, 12, color040404).txt,
            styles.txtSpect
          ]}>{(strSpec || '')}</Text>
        </View>
        <TouchableOpacity
          style={styles.editView}
          onPress={onPressEdit}
        >
          <Text style={[
            customTxt(Fonts.Bold, 14, color3777EE).txt
          ]}>{Translate(languageRedux).EDIT_INFO}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderContent = (title, content, isHiden) => {
    return (
      <View style={styles.contanteCenterView}>
        <Text style={[
          customTxt(Fonts.Regular, 12, color040404).txt
        ]}>{title}</Text>
        <Text style={[
          customTxt(Fonts.SemiBold, 16, color040404).txt,
          styles.txtContentCenter
        ]}>{content}</Text>
        {
          !isHiden && <View style={styles.lineFull} />
        }
      </View>
    )
  }

  const renderCenterView = () => {
    var getGender = Number(summaryRedux?.gender || 0)
    if (getGender > 3 || getGender < 0) {
      getGender = 2
    }
    return (
      <View>
        <Text style={[
          customTxt(Fonts.Bold, 18, color040404).txt,
          styles.txtPeronalInfo
        ]}>{Translate(languageRedux).datipersonali}</Text>
        {renderContent(
          Translate(languageRedux).birthday,
          summaryRedux?.birthdate ? convertDDMMYYYY(summaryRedux?.birthdate) : ''
        )}
        {renderContent(
          Translate(languageRedux).gender_member,
          summaryRedux?.gender ? GENDERS[getGender].name : ''
        )}
        {renderContent(
          Translate(languageRedux).SPECIALITY,
          strSpec || ''
        )}
        {renderContent(
          Translate(languageRedux).M_SCHOOL,
          virtualOffice?.school || ''
        )}
        {renderContent(
          Translate(languageRedux).LICENSE_NUMBER,
          virtualOffice?.licenseNumber || ''
        )}
        {renderContent(
          Translate(languageRedux).PRACTICE_LENGTH,
          virtualOffice?.lengthpractice ? `${virtualOffice?.lengthpractice}` : '',
          true
        )}
      </View>
    )
  }

  const renderBottomView = () => {
    return (
      <View>
        <Text style={[
          customTxt(Fonts.Bold, 18, color040404).txt,
          styles.txtPeronalInfo
        ]}>{Translate(languageRedux).CONTACT_INFO}</Text>
        {renderContent(
          Translate(languageRedux).OFFICE_ADDRESS,
          virtualOffice?.address || ''
        )}
        {renderContent(
          Translate(languageRedux).PHONE,
          virtualOffice?.phone || '',
          true
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
        <ScrollView
          style={styles.scrollStyle}
          contentContainerStyle={styles.contentContainerStyle}
        >
          <View style={styles.insideView}>
            {renderTop()}
            <View style={styles.lineFull} />
            {renderCenterView()}
            <View style={styles.lineFull} />
            {renderBottomView()}
          </View>
        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorF8F8F8
  },
  scrollStyle: {
    borderRadius: 12,
    backgroundColor: 'transparent',
    paddingTop: 16,
    paddingLeft: 16
  },
  insideView: {
    backgroundColor: colorFFFFFF,
    marginRight: 20,
    borderRadius: 12,
    overflow: 'hidden'
  },
  contentContainerStyle: {
    paddingBottom: 60
  },
  topView: {
    flexDirection: 'row',
    backgroundColor: colorFFFFFF
  },
  avtView: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden'
  },
  imgAvt: {
    width: 40,
    height: 40,
    resizeMode: 'stretch',
    borderRadius: 20
  },
  centerTopView: {
    flex: 1,
    marginTop: 16,
    marginBottom: 16,
    justifyContent: 'space-between'
  },
  editView: {
    marginTop: 16,
    marginRight: 16,
    justifyContent: 'center',
    alignContent: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: color3777EE
  },
  lineFull: {
    width: '100%',
    height: 1,
    backgroundColor: colorF0F0F0
  },
  txtPeronalInfo: {
    marginTop: 16,
    marginLeft: 16
  },
  contanteCenterView: {
    marginTop: 16,
    marginLeft: 16,
    marginRight: 16
  },
  txtContentCenter: {
    marginTop: 8,
    marginBottom: 16
  },
  txtSpect: {
    marginRight: 16
  },
  iconChangeAvtStyle: {
    height: 16,
    width: 16,
    resizeMode: 'stretch'
  },
  ctnAvatar: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 20,
    overflow: 'hidden'
  },
  ctnIconChangeAvt: {
    height: 24,
    width: 24,
    backgroundColor: colorFFFFFF,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    marginLeft: -22
  }
})
