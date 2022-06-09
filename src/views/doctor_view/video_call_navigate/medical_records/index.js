import React, {useState} from 'react'
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList} from 'react-native'
import { useSelector } from 'react-redux'

import {color040404, colorA7A8A9, colorF0F0F0, colorFFFFFF} from 'constants/colors'
import Translate from 'translate'
import Fonts from 'constants/Fonts'
import { customTxt } from 'constants/css'
import {convertDMMMYYYY} from 'constants/DateHelpers'

import icHome from '../../../../../assets/images/home_screen'

export default function MedicalRecords() {
  const languageRedux = useSelector(state => state.common.language)
  const surveyPatient = useSelector(state => state.common.surveyPatient)
  const [openPersonal, setOpenPersonal] = useState(true)
  const [showDepen, setShowDepen] = useState(false)
  const [showDisease, setShowDisease] = useState(false)
  const [showAllergy, setShowAllergy] = useState(false)
  const [showMedication, setShowMedication] = useState(false)
  const [showHos, setShowHos] = useState(false)
  const [showSur, setShowSur] = useState(false)
  const [showImmu, setShowImmu] = useState(false)
  const [showIrre, setShowIrre] = useState(false)
  const [showPros, setShowPros] = useState(false)

  const getGender = () => {
    if (surveyPatient?.user?.gender === 0) {
      return Translate(languageRedux).male
    }
    if (surveyPatient?.user?.gender === 1) {
      return Translate(languageRedux).female
    }
    if (surveyPatient?.user?.gender === 2) {
      return Translate(languageRedux).I_WOULD_RATHER_NOT_SAY
    }
  }

  const renderCell = (title, content) => {
    return (
      <View style={styles.ctnCell}>
        <Text style={customTxt(Fonts.Regular, 12, colorA7A8A9).txt}>
          {title}
        </Text>
        <Text style={[customTxt(Fonts.Regular, 16, color040404).txt, styles.marginT8]}>
          {content}
        </Text>
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
            surveyPatient?.user?.nome || '',
          )}
          {renderCell(
            Translate(languageRedux).surname,
            surveyPatient?.user?.cognome || '',
          )}
          {renderCell(
            Translate(languageRedux).gender_member,
            getGender() || '',
          )}
          {renderCell(
            Translate(languageRedux).birthdate,
            convertDMMMYYYY(surveyPatient?.user?.data_nascita) || '',
          )}
          {renderCell(
            Translate(languageRedux).placeOfBirth,
            surveyPatient?.user?.placeOfBirth || '',
          )}
          {renderCell(
            Translate(languageRedux).cf,
            surveyPatient?.user?.codice_fiscale || '',
          )}
        </View>}
      </View>
    )
  }

  const RenderItem = ({item}) => {
    return (
      <View style={styles.marginT16}>
        <Text style={customTxt(Fonts.SemiBold, 16, colorA7A8A9).txt}>
          {item?.nameCurrentValue}
        </Text>
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
          {Translate(languageRedux).disease}{' '}({(surveyPatient?.patientDiseases || []).length})
          </Text>
          <Image source={showDisease ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>
        {showDisease && <View style={styles.line} />}
        {showDisease && <FlatList
          data={surveyPatient?.patientDiseases}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
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
          {Translate(languageRedux).allergie}{' '}({(surveyPatient?.patientAllergies || []).length})
          </Text>
          <Image source={showAllergy ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>
        {showAllergy && <View style={styles.line} />}
        {showAllergy && <FlatList
          data={surveyPatient?.patientAllergies}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
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
          {Translate(languageRedux).farmaci}{' '}({(surveyPatient?.patientMedications || []).length})
          </Text>
          <Image source={showMedication ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>
        {showMedication && <View style={styles.line} />}
        {showMedication && <FlatList
          data={surveyPatient?.patientMedications}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
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
          {Translate(languageRedux).dependencies}{' '}({(surveyPatient?.patientDependencies || []).length})
          </Text>
          <Image source={showDepen ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>
        {showDepen && <View style={styles.line} />}
        {showDepen && <FlatList
          data={surveyPatient?.patientDependencies}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
          )}
        />}
      </View>
    )
  }

  const renderHospitalization = () => {
    return (
      <View style={styles.ctnBlock}>
        <TouchableOpacity onPress={() => {
          setShowHos(!showHos)
        }} style={styles.title}>
          <Text style={customTxt(Fonts.Bold, 18, color040404).txt}>
          {Translate(languageRedux).ricovero}{' '}({(surveyPatient?.patientHospitalizations || []).length})
          </Text>
          <Image source={showHos ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>
        {showHos && <View style={styles.line} />}
        {showHos && <FlatList
          data={surveyPatient?.patientHospitalizations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
          )}
        />}
      </View>
    )
  }

  const renderSurgery = () => {
    return (
      <View style={styles.ctnBlock}>
        <TouchableOpacity onPress={() => {
          setShowSur(!showSur)
        }} style={styles.title}>
          <Text style={customTxt(Fonts.Bold, 18, color040404).txt}>
          {Translate(languageRedux).surgery}{' '}({(surveyPatient?.patientSurgeries || []).length})
          </Text>
          <Image source={showSur ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>
        {showSur && <View style={styles.line} />}
        {showSur && <FlatList
          data={surveyPatient?.patientSurgeries}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
          )}
        />}
      </View>
    )
  }

  const renderImmu = () => {
    return (
      <View style={styles.ctnBlock}>
        <TouchableOpacity onPress={() => {
          setShowImmu(!showImmu)
        }} style={styles.title}>
          <Text style={customTxt(Fonts.Bold, 18, color040404).txt}>
          {Translate(languageRedux).immunizationmenu}{' '}({(surveyPatient?.patientImmunizations || []).length})
          </Text>
          <Image source={showImmu ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>
        {showImmu && <View style={styles.line} />}
        {showImmu && <FlatList
          data={surveyPatient?.patientImmunizations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
          )}
        />}
      </View>
    )
  }

  const renderIrre = () => {
    return (
      <View style={styles.ctnBlock}>
        <TouchableOpacity onPress={() => {
          setShowIrre(!showIrre)
        }} style={styles.title}>
          <Text style={customTxt(Fonts.Bold, 18, color040404).txt}>
          {Translate(languageRedux).irregulartest}{' '}({(surveyPatient?.patientTests || []).length})
          </Text>
          <Image source={showIrre ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>
        {showIrre && <View style={styles.line} />}
        {showIrre && <FlatList
          data={surveyPatient?.patientTests}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
          )}
        />}
      </View>
    )
  }

  const renderPros = () => {
    return (
      <View style={styles.ctnBlock}>
        <TouchableOpacity onPress={() => {
          setShowPros(!showPros)
        }} style={styles.title}>
          <Text style={customTxt(Fonts.Bold, 18, color040404).txt}>
          {Translate(languageRedux).protesi}{' '}({(surveyPatient?.patientProsthesis || []).length})
          </Text>
          <Image source={showPros ? icHome.ic_up : icHome.ic_down} style={styles.iconStyle} />
        </TouchableOpacity>
        {showPros && <View style={styles.line} />}
        {showPros && <FlatList
          data={surveyPatient?.patientProsthesis}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
          )}
        />}
      </View>
    )
  }

  const renderBody = () => {
    return (
      <View style={styles.ctnBody}>
        {renderPersonalInfo()}
        {(surveyPatient?.patientDiseases || []).length > 0 && renderDisease()}
        {(surveyPatient?.patientAllergies || []).length > 0 && renderAllergy()}
        {(surveyPatient?.patientMedications || []).length > 0 && renderMedication()}
        {(surveyPatient?.patientDependencies || []).length > 0 && renderDependency()}
        {(surveyPatient?.patientHospitalizations || []).length > 0 && renderHospitalization()}
        {(surveyPatient?.patientSurgeries || []).length > 0 && renderSurgery()}
        {(surveyPatient?.patientImmunizations || []).length > 0 && renderImmu()}
        {(surveyPatient?.patientTests || []).length > 0 && renderIrre()}
        {(surveyPatient?.patientProsthesis || []).length > 0 && renderPros()}
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
  ctnBody: {
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
    borderColor: colorF0F0F0
  },
  marginT8: {
    marginTop: 8
  },
  ctnCell: {
    marginTop: 16,
    marginHorizontal: 16
  },
  marginT16: {
    marginTop: 16,
    marginHorizontal: 16
  }
})
