import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList} from 'react-native'
import { useSelector } from 'react-redux'

import Translate from 'translate'
import { color040404, color848586, colorA7A8A9, colorF0F0F0, colorFFFFFF } from 'constants/colors'
import { customTxt } from 'constants/css'
import Fonts from 'constants/Fonts'
import { convertDMMMYYYY } from 'constants/DateHelpers'
import NavigationService from 'navigation'
import Routes from 'navigation/Routes'

import icHome from '../../../../../assets/images/home_screen'
import icHealth from '../../../../../assets/images/health_profile'

export default function MedicalRecords({dataPersonal, gender, dataDisease,
dataAllergy, dataMedication, dataDependency, dataImmunization,
dataIrregular, dataProsthesis, dataHosnSur}) {
  const languageRedux = useSelector(state => state.common.language)
  const [openPersonal, setOpenPersonal] = useState(true)
  const [showDepen, setShowDepen] = useState(false)
  const [showDisease, setShowDisease] = useState(false)
  const [showAllergy, setShowAllergy] = useState(false)
  const [showMedication, setShowMedication] = useState(false)
  const [showHos, setShowHos] = useState(false)
  const [showImmu, setShowImmu] = useState(false)
  const [showIrre, setShowIrre] = useState(false)
  const [showPros, setShowPros] = useState(false)

  const renderCell = (title, content, isDivider) => {
    return (
      <View style={styles.ctnCell}>
        <Text style={customTxt(Fonts.Regular, 12, color040404).txt}>
          {title}
        </Text>
        <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginT8]}>
          {content}
        </Text>
        {isDivider && <View style={styles.divider} />}
      </View>
    )
  }

  const renderPersonalInfo = () => {
    return (
      <View style={styles.ctnPersonalInfo}>
        {openPersonal === false && (
          <TouchableOpacity
            onPress={() => {
              setOpenPersonal(!openPersonal)
            }}
            style={styles.title}>
            <Text style={customTxt(Fonts.Bold, 18, color040404).txt}>
              Personal Information
            </Text>
            <Image source={icHome.ic_down} style={styles.iconStyle} />
          </TouchableOpacity>
        )}
        {openPersonal && <View>
          <TouchableOpacity
            onPress={() => {
              setOpenPersonal(!openPersonal)
            }}
            style={styles.title}>
            <Text style={customTxt(Fonts.Bold, 18, color040404).txt}>
              Personal Information
            </Text>
            <Image source={icHome.ic_up} style={styles.iconStyle} />
          </TouchableOpacity>
          <View style={styles.line} />
          {renderCell(
            Translate(languageRedux).name_member,
            dataPersonal?.nome || dataPersonal?.name || '',
            true
          )}
          {renderCell(
            Translate(languageRedux).surname,
            dataPersonal?.cognome || dataPersonal?.surname || '',
            true
          )}
          {renderCell(
            Translate(languageRedux).gender_member,
            gender || '',
            true
          )}
          {renderCell(
            Translate(languageRedux).birthdate,
            convertDMMMYYYY(dataPersonal?.birthdate) || '',
            true
          )}
          {renderCell(
            Translate(languageRedux).placeOfBirth,
            dataPersonal?.placeOfBirth || '',
            true
          )}
          {renderCell(
            Translate(languageRedux).cf,
            dataPersonal?.codice_fiscale || dataPersonal?.cf || '',
            false
          )}
        </View>}
      </View>
    )
  }

  const RenderItem = ({item, index, data, depen, date, checkOnPressItem}) => {
    const checkOther = () => {
      if (
        (item.medicineId ||
          item?.allergyId ||
          item?.dependencyId ||
          item?.immunizationId ||
          item?.testId ||
          item?.prosthesisId) === 1
      ) {
        return item?.other
      }
      if (item?.type === 1) {
        return item?.hospitalizationName
      }
      if (item?.type === 0) {
        return item?.surgerySubCategoryName
      }
      else {
        return (
          item?.name ||
          item?.allergy ||
          item?.medicineName ||
          item?.dependency ||
          item?.immunizationName ||
          item?.testName ||
          item?.prosthesisName
        )
      }
    }
    const checkLabelDate = () => {
      if (date) {
        return Translate(languageRedux).date
      } else {
        return Translate(languageRedux).since
      }
    }
    const checkFieldDate = () => {
      if (depen) {
        return item?.yearStarted
      }
      if (item?.testDate) {
        return convertDMMMYYYY(item?.testDate)
      }
      if (item?.hospDate) {
        return convertDMMMYYYY(item?.hospDate)
      }
      if (item?.immunizationDate) {
        return convertDMMMYYYY(item?.immunizationDate)
      } else if (item?.startDate || item?.since) {
        return convertDMMMYYYY(item?.startDate || item?.since)
      }
    }
    const _onPressItem = () => {
      if (checkOnPressItem === 0) {
        NavigationService.navigate(Routes.DISEASE_DOCTOR_VIEW, {
          data: item
        })
      }
      if (checkOnPressItem === 1) {
        NavigationService.navigate(Routes.ALLERGY_DOCTOR_VIEW, {
          data: item
        })
      }
      if (checkOnPressItem === 2) {
        NavigationService.navigate(Routes.MEDICATION_DOCTOR_VIEW, {
          data: item
        })
      }
      if (checkOnPressItem === 3) {
        NavigationService.navigate(Routes.DEPENDENCY_DOCTOR_VIEW, {
          data: item
        })
      }
      if (checkOnPressItem === 4) {
        NavigationService.navigate(Routes.IMMUNIZATION_DOCTOR_VIEW, {
          data: item
        })
      }
      if (checkOnPressItem === 5) {
        NavigationService.navigate(Routes.IRREGULAR_DOCTOR_VIEW, {
          data: item
        })
      }
      if (checkOnPressItem === 6) {
        NavigationService.navigate(Routes.PROSTHETIC_DOCTOR_VIEW, {
          data: item
        })
      }
      if (checkOnPressItem === 7) {
        NavigationService.navigate(Routes.HOSPITAL_SURGERY_DOCTOR_VIEW, {
          data: item
        })
      }
      else {
        return
      }
    }
    return (
      <View>
        <TouchableOpacity onPress={_onPressItem} style={styles.ctnItemDisease}>
          <View style={styles.infoItem}>
            {(item?.startDate || item?.since !== null) && <Text style={[customTxt(Fonts.Regular, 12, color040404).txt, styles.marginB8]}>
              {checkLabelDate()}{' '}
              {checkFieldDate()}
            </Text>}
            <Text numberOfLines={1} style={customTxt(Fonts.SemiBold, 16, colorA7A8A9).txt}>
              {checkOther()}
            </Text>
            {item?.remarks !== null && item?.remarks !== '' && (
              <Text numberOfLines={1} style={[customTxt(Fonts.SemiBold, 12, color848586).txt, styles.marginT8]}>
                {item?.remarks}
              </Text>
            )}
          </View>
          <Image source={icHealth.ic_right_blue} style={styles.iconStyle} />
        </TouchableOpacity>
        {index !== (data || []).length - 1 && <View style={styles.line} />}
      </View>
    )
  }

  const renderDisease = () => {
    return (
      <View style={styles.ctnBlock}>
        <TouchableOpacity onPress={() => {
          setShowDisease(!showDisease)
        }} style={styles.title}>
          <Text style={customTxt(Fonts.Bold, 18, color040404).txt}>
          {Translate(languageRedux).disease}{' '}({(dataDisease || []).length})
          </Text>
          <Image source={showDisease ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>
        {showDisease && <FlatList
          data={dataDisease}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} data={dataDisease} checkOnPressItem={0} />
          )}
        />}
      </View>
    )
  }

  const renderAllergy = () => {
    return (
      <View style={styles.ctnBlock}>
        <TouchableOpacity onPress={() => {
          setShowAllergy(!showAllergy)
        }} style={styles.title}>
          <Text style={customTxt(Fonts.Bold, 18, color040404).txt}>
          {Translate(languageRedux).allergie}{' '}({(dataAllergy || []).length})
          </Text>
          <Image source={showAllergy ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>
        {showAllergy && <FlatList
          data={dataAllergy}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} data={dataAllergy} checkOnPressItem={1} />
          )}
        />}
      </View>
    )
  }

  const renderMedication = () => {
    return (
      <View style={styles.ctnBlock}>
        <TouchableOpacity onPress={() => {
          setShowMedication(!showMedication)
        }} style={styles.title}>
          <Text style={customTxt(Fonts.Bold, 18, color040404).txt}>
          {Translate(languageRedux).farmaci}{' '}({(dataMedication || []).length})
          </Text>
          <Image source={showMedication ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>
        {showMedication && <FlatList
          data={dataMedication}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} data={dataMedication} checkOnPressItem={2} />
          )}
        />}
      </View>
    )
  }

  const renderDependency = () => {
    return (
      <View style={styles.ctnBlock}>
        <TouchableOpacity onPress={() => {
          setShowDepen(!showDepen)
        }} style={styles.title}>
          <Text style={customTxt(Fonts.Bold, 18, color040404).txt}>
          {Translate(languageRedux).dependencies}{' '}({(dataDependency || []).length})
          </Text>
          <Image source={showDepen ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>
        {showDepen && <FlatList
          data={dataDependency}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} data={dataDependency} depen={true} checkOnPressItem={3} />
          )}
        />}
      </View>
    )
  }

  const renderImmunization = () => {
    return (
      <View style={styles.ctnBlock}>
        <TouchableOpacity onPress={() => {
          setShowImmu(!showImmu)
        }} style={styles.title}>
          <Text style={customTxt(Fonts.Bold, 18, color040404).txt}>
          {Translate(languageRedux).immunizationmenu}{' '}({(dataImmunization || []).length})
          </Text>
          <Image source={showImmu ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>
        {showImmu && <FlatList
          data={dataImmunization}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} data={dataImmunization} date={true} checkOnPressItem={4} />
          )}
        />}
      </View>
    )
  }

  const renderIrregular = () => {
    return (
      <View style={styles.ctnBlock}>
        <TouchableOpacity onPress={() => {
          setShowIrre(!showIrre)
        }} style={styles.title}>
          <Text style={customTxt(Fonts.Bold, 18, color040404).txt}>
          {Translate(languageRedux).irregulartest}{' '}({(dataIrregular || []).length})
          </Text>
          <Image source={showIrre ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>
        {showIrre && <FlatList
          data={dataIrregular}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} data={dataIrregular} date={true} checkOnPressItem={5} />
          )}
        />}
      </View>
    )
  }

  const renderProsthesis = () => {
    return (
      <View style={styles.ctnBlock}>
        <TouchableOpacity onPress={() => {
          setShowPros(!showPros)
        }} style={styles.title}>
          <Text style={customTxt(Fonts.Bold, 18, color040404).txt}>
          {Translate(languageRedux).protesi}{' '}({(dataProsthesis || []).length})
          </Text>
          <Image source={showPros ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>
        {showPros && <FlatList
          data={dataProsthesis}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} data={dataProsthesis} checkOnPressItem={6} />
          )}
        />}
      </View>
    )
  }

  const renderHosnSur = () => {
    return (
      <View style={styles.ctnBlock}>
        <TouchableOpacity onPress={() => {
          setShowHos(!showHos)
        }} style={styles.title}>
          <Text style={customTxt(Fonts.Bold, 18, color040404).txt}>
          {Translate(languageRedux).HOSPITALIZATION_SURGICAL}{' '}({(dataHosnSur || []).length})
          </Text>
          <Image source={showHos ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>
        {showHos && <FlatList
          data={dataHosnSur}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} data={dataHosnSur} date={true} checkOnPressItem={7} />
          )}
        />}
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.container}>
        {renderPersonalInfo()}
        {(dataDisease || []).length > 0 && renderDisease()}
        {(dataAllergy || []).length > 0 && renderAllergy()}
        {(dataMedication || []).length > 0 && renderMedication()}
        {(dataDependency || []).length > 0 && renderDependency()}
        {(dataHosnSur || []).length > 0 && renderHosnSur()}
        {(dataImmunization || []).length > 0 && renderImmunization()}
        {(dataIrregular || []).length > 0 && renderIrregular()}
        {(dataProsthesis || []).length > 0 && renderProsthesis()}
      </View>
    )
  }

  return (
    <View>
      <ScrollView>{renderBody()}</ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100
  },
  ctnPersonalInfo: {
    backgroundColor: colorFFFFFF,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 9
  },
  ctnBlock: {
    backgroundColor: colorFFFFFF,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 9
  },
  iconStyle: {
    height: 24,
    width: 24
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16
  },
  line: {
    marginTop: 16,
    borderWidth: 0.75,
    borderColor: colorF0F0F0,
    marginHorizontal: 16
  },
  marginT8: {
    marginTop: 8
  },
  marginB8: {
    marginBottom: 8
  },
  ctnCell: {
    marginTop: 16,
    marginHorizontal: 16
  },
  ctnItemDisease: {
    marginTop: 24,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  divider: {
    borderWidth: 1,
    borderColor: colorF0F0F0,
    marginTop: 16
  },
  infoItem: {
    justifyContent: 'center',
    flex: 1
  }
})
