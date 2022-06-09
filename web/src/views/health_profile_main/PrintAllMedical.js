import React, {useState} from 'react'
import {View, Text} from 'react-native'
// import {useSelector} from 'react-redux'
// import RNHTMLtoPDF from 'react-native-html-to-pdf'
// import RNPrint from 'react-native-print'
// import Share from 'react-native-share'

import Translate from '../../translate'
import {convertBirthdate, convertCalenderDDMMYYYY} from '../../constants/DateHelpers'

export function PrintAllMedical() {
  const languageRedux = ''//useSelector(state => state.common.language)
  const userinfo = ''//useSelector(state => state.user.userinfo)
  const lsCountryRedux = ''//useSelector(state => state.common.country)

  const dataAllergy = ''//useSelector(state => state.common.dataAllergy)
  const dataMedi = ''//useSelector(state => state.common.dataMedi)
  const dataDepen = ''//useSelector(state => state.common.dataDepen)
  const dataImmu = ''//useSelector(state => state.common.dataImmu)
  const dataIrre = ''//useSelector(state => state.common.dataIrre)
  const dataPros = ''//useSelector(state => state.common.dataPros)
  const dataHosSur = ''//useSelector(state => state.common.dataHosSur)

  const emergency = userinfo?.emergencyContacts || []
  const [block1, setBlock1] = useState(emergency.length > 0 ? true : false)
  const [block2, setBlock2] = useState(emergency.length > 1 ? true : false)
  const [block3, setBlock3] = useState(emergency.length > 2 ? true : false)
  const [block4, setBlock4] = useState(emergency.length > 3 ? true : false)
  const [block5, setBlock5] = useState(emergency.length > 4 ? true : false)
  const firstName1 =
    emergency.length > 0 ? userinfo?.emergencyContacts[0].firstName : ''
  const lastName1 =
    emergency.length > 0 ? userinfo?.emergencyContacts[0].lastName : ''
  const emailN1 =
    emergency.length > 0 ? userinfo?.emergencyContacts[0].email : ''
  const phoneN1 =
    emergency.length > 0 ? userinfo?.emergencyContacts[0].phone : ''

  const firstName2 =
    emergency.length > 1 ? userinfo?.emergencyContacts[1].firstName : ''
  const lastName2 =
    emergency.length > 1 ? userinfo?.emergencyContacts[1].lastName : ''
  const phoneN2 =
    emergency.length > 1 ? userinfo?.emergencyContacts[1].phone : ''
  const emailN2 =
    emergency.length > 1 ? userinfo?.emergencyContacts[1].email : ''

  const firstName3 =
    emergency.length > 2 ? userinfo?.emergencyContacts[2].firstName : ''
  const lastName3 =
    emergency.length > 2 ? userinfo?.emergencyContacts[2].lastName : ''
  const phoneN3 =
    emergency.length > 2 ? userinfo?.emergencyContacts[2].phone : ''
  const emailN3 =
    emergency.length > 2 ? userinfo?.emergencyContacts[2].email : ''

  const firstName4 =
    emergency.length > 3 ? userinfo?.emergencyContacts[3].firstName : ''
  const lastName4 =
    emergency.length > 3 ? userinfo?.emergencyContacts[3].lastName : ''
  const phoneN4 =
    emergency.length > 3 ? userinfo?.emergencyContacts[3].phone : ''
  const emailN4 =
    emergency.length > 3 ? userinfo?.emergencyContacts[3].email : ''

  const firstName5 =
    emergency.length > 4 ? userinfo?.emergencyContacts[4].firstName : ''
  const lastName5 =
    emergency.length > 4 ? userinfo?.emergencyContacts[4].lastName : ''
  const phoneN5 =
    emergency.length > 4 ? userinfo?.emergencyContacts[4].phone : ''
  const emailN5 =
    emergency.length > 4 ? userinfo?.emergencyContacts[4].email : ''

  const listRela = [
    {name: Translate(languageRedux).FATHER, value: 'FATHER'},
    {name: Translate(languageRedux).MOTHER, value: 'MOTHER'},
    {name: Translate(languageRedux).WIFE, value: 'WIFE'},
    {name: Translate(languageRedux).HUSBAND, value: 'HUSBAND'},
    {name: Translate(languageRedux).SON, value: 'SON'},
    {name: Translate(languageRedux).DAUGHTER, value: 'DAUGHTER'},
    {name: Translate(languageRedux).other, value: 'OTHER'}
  ]

  const getGender = () => {
    if (userinfo?.gender === 0) {
      return Translate(languageRedux).male
    }
    if (userinfo?.gender === 1) {
      return Translate(languageRedux).female
    }
    if (userinfo?.gender === 2) {
      return Translate(languageRedux).I_WOULD_RATHER_NOT_SAY
    }
  }

  const convertCountry = () => {
    var i = lsCountryRedux.filter(val => val.value === userinfo?.country)
    if (i.length > 0) {
      return i[0].text
    }
    if (i.length < 0) {
      return ''
    }
  }

  const convertRela1 = () => {
    if (emergency.length > 0) {
      var i = listRela.filter(
        val => val.value === userinfo?.emergencyContacts[0].relationship,
      )
      return i[0].name || ''
    }
  }
  const convertRela2 = () => {
    if (emergency.length > 1) {
      var i = listRela.filter(
        val => val.value === userinfo?.emergencyContacts[1].relationship,
      )
      return i[0].name || ''
    }
  }
  const convertRela3 = () => {
    if (emergency.length > 2) {
      var i = listRela.filter(
        val => val.value === userinfo?.emergencyContacts[2].relationship,
      )
      return i[0].name || ''
    }
  }
  const convertRela4 = () => {
    if (emergency.length > 3) {
      var i = listRela.filter(
        val => val.value === userinfo?.emergencyContacts[3].relationship,
      )
      return i[0].name || ''
    }
  }
  const convertRela5 = () => {
    if (emergency.length > 4) {
      var i = listRela.filter(
        val => val.value === userinfo?.emergencyContacts[4].relationship,
      )
      return i[0].name || ''
    }
  }

  const htmlEmer = `
        <h1>${Translate(languageRedux).contact} 1</h1>
        <h2>${Translate(languageRedux).FIRST_NAME}</h2>
        <h1>${firstName1}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).surname}</h2>
        <h1>${lastName1}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
        <h1>${convertRela1()}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).PHONE}</h2>
        <h1>${phoneN1}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).EMAIL}</h2>
        <h1>${emailN1 || ''}</h1>
        <hr class="solid">
        `
  const htmlEmer2 = `
        <h1>${Translate(languageRedux).contact} 1</h1>
        <h2>${Translate(languageRedux).FIRST_NAME}</h2>
        <h1>${firstName1}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).surname}</h2>
        <h1>${lastName1}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
        <h1>${convertRela1()}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).PHONE}</h2>
        <h1>${phoneN1}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).EMAIL}</h2>
        <h1>${emailN1 || ''}</h1>
        <hr class="solid">
        <h1>${Translate(languageRedux).contact} 2</h1>
        <h2>${Translate(languageRedux).FIRST_NAME}</h2>
        <h1>${firstName2}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).surname}</h2>
        <h1>${lastName2}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
        <h1>${convertRela2()}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).PHONE}</h2>
        <h1>${phoneN2}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).EMAIL}</h2>
        <h1>${emailN2 || ''}</h1>
        <hr class="solid">
        `
  const htmlEmer3 = `
        <h1>${Translate(languageRedux).contact} 1</h1>
        <h2>${Translate(languageRedux).FIRST_NAME}</h2>
        <h1>${firstName1}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).surname}</h2>
        <h1>${lastName1}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
        <h1>${convertRela1()}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).PHONE}</h2>
        <h1>${phoneN1}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).EMAIL}</h2>
        <h1>${emailN1 || ''}</h1>
        <hr class="solid">
        <h1>${Translate(languageRedux).contact} 2</h1>
        <h2>${Translate(languageRedux).FIRST_NAME}</h2>
        <h1>${firstName2}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).surname}</h2>
        <h1>${lastName2}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
        <h1>${convertRela2()}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).PHONE}</h2>
        <h1>${phoneN2}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).EMAIL}</h2>
        <h1>${emailN2 || ''}</h1>
        <hr class="solid">
        <h1>${Translate(languageRedux).contact} 3</h1>
        <h2>${Translate(languageRedux).FIRST_NAME}</h2>
        <h1>${firstName3}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).surname}</h2>
        <h1>${lastName3}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
        <h1>${convertRela3()}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).PHONE}</h2>
        <h1>${phoneN3}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).EMAIL}</h2>
        <h1>${emailN3 || ''}</h1>
        <hr class="solid">
        `
  const htmlEmer4 = `
        <h1>${Translate(languageRedux).contact} 1</h1>
        <h2>${Translate(languageRedux).FIRST_NAME}</h2>
        <h1>${firstName1}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).surname}</h2>
        <h1>${lastName1}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
        <h1>${convertRela1()}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).PHONE}</h2>
        <h1>${phoneN1}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).EMAIL}</h2>
        <h1>${emailN1 || ''}</h1>
        <hr class="solid">
        <h1>${Translate(languageRedux).contact} 2</h1>
        <h2>${Translate(languageRedux).FIRST_NAME}</h2>
        <h1>${firstName2}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).surname}</h2>
        <h1>${lastName2}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
        <h1>${convertRela2()}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).PHONE}</h2>
        <h1>${phoneN2}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).EMAIL}</h2>
        <h1>${emailN2 || ''}</h1>
        <hr class="solid">
        <h1>${Translate(languageRedux).contact} 3</h1>
        <h2>${Translate(languageRedux).FIRST_NAME}</h2>
        <h1>${firstName3}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).surname}</h2>
        <h1>${lastName3}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
        <h1>${convertRela3()}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).PHONE}</h2>
        <h1>${phoneN3}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).EMAIL}</h2>
        <h1>${emailN3 || ''}</h1>
        <hr class="solid">
        <h1>${Translate(languageRedux).contact} 4</h1>
        <h2>${Translate(languageRedux).FIRST_NAME}</h2>
        <h1>${firstName4}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).surname}</h2>
        <h1>${lastName4}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
        <h1>${convertRela4()}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).PHONE}</h2>
        <h1>${phoneN4}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).EMAIL}</h2>
        <h1>${emailN4 || ''}</h1>
        <hr class="solid">
        `
  const htmlEmer5 = `
        <h1>${Translate(languageRedux).contact} 1</h1>
        <h2>${Translate(languageRedux).FIRST_NAME}</h2>
        <h1>${firstName1}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).surname}</h2>
        <h1>${lastName1}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
        <h1>${convertRela1()}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).PHONE}</h2>
        <h1>${phoneN1}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).EMAIL}</h2>
        <h1>${emailN1 || ''}</h1>
        <hr class="solid">
        <h1>${Translate(languageRedux).contact} 2</h1>
        <h2>${Translate(languageRedux).FIRST_NAME}</h2>
        <h1>${firstName2}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).surname}</h2>
        <h1>${lastName2}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
        <h1>${convertRela2()}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).PHONE}</h2>
        <h1>${phoneN2}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).EMAIL}</h2>
        <h1>${emailN2 || ''}</h1>
        <hr class="solid">
        <h1>${Translate(languageRedux).contact} 3</h1>
        <h2>${Translate(languageRedux).FIRST_NAME}</h2>
        <h1>${firstName3}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).surname}</h2>
        <h1>${lastName3}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
        <h1>${convertRela3()}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).PHONE}</h2>
        <h1>${phoneN3}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).EMAIL}</h2>
        <h1>${emailN3 || ''}</h1>
        <hr class="solid">
        <h1>${Translate(languageRedux).contact} 4</h1>
        <h2>${Translate(languageRedux).FIRST_NAME}</h2>
        <h1>${firstName4}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).surname}</h2>
        <h1>${lastName4}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
        <h1>${convertRela4()}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).PHONE}</h2>
        <h1>${phoneN4}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).EMAIL}</h2>
        <h1>${emailN4 || ''}</h1>
        <hr class="solid">
        <h1>${Translate(languageRedux).contact} 5</h1>
        <h2>${Translate(languageRedux).FIRST_NAME}</h2>
        <h1>${firstName5}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).surname}</h2>
        <h1>${lastName5}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).RELATIONSHIP}</h2>
        <h1>${convertRela5()}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).PHONE}</h2>
        <h1>${phoneN5}</h1>
        <hr class="solid">
        <h2>${Translate(languageRedux).EMAIL}</h2>
        <h1>${emailN5 || ''}</h1>
        <hr class="solid">
        `
  const checkEmergencyContact = () => {
    if (
      block1 &&
      block2 === false &&
      block3 === false &&
      block4 === false &&
      block5 === false
    ) {
      return htmlEmer
    }
    if (block2 && block3 === false && block4 === false && block5 === false) {
      return htmlEmer2
    }
    if (block3 && block4 === false && block5 === false) {
      return htmlEmer3
    }
    if (block4 && block5 === false) {
      return htmlEmer4
    }
    if (block5) {
      return htmlEmer5
    }
  }

  const allergy = () => {
      var htmlAllergy = [``]
      for (var i = 0; i <= (dataAllergy?.datas || []).length - 1; i++) {
        var item =
        `<h2>${(dataAllergy?.datas || []).length > i ?
        (dataAllergy?.datas[i].name === 'Other' ? dataAllergy?.datas[i].other : dataAllergy?.datas[i].name) : ''}</h2>
        <h2>${dataAllergy?.datas[i].since ? Translate(languageRedux).since : ''}
        ${dataAllergy?.datas[i].since ? convertCalenderDDMMYYYY(dataAllergy?.datas[i].since) : ''}</h2>
        <hr>
        `
        htmlAllergy.push(item)
      }
      return htmlAllergy
  }

  const medication = () => {
    var htmlMedi = [``]
    for (var i = 0; i <= (dataMedi?.datas || []).length - 1; i++) {
      var item =
      `<h2>${(dataMedi?.datas || []).length > i ?
      (dataMedi?.datas[i].name === 'Other' ? dataMedi?.datas[i].other : dataMedi?.datas[i].name) : ''}</h2>
      <h2>${dataMedi?.datas[i].since ? Translate(languageRedux).since : ''}
      ${dataMedi?.datas[i].since ? convertCalenderDDMMYYYY(dataMedi?.datas[i].since) : ''}</h2>
      <hr>
      `
      htmlMedi.push(item)
    }
    return htmlMedi
  }

  const dependency = () => {
    var htmlDepen = [``]
    for (var i = 0; i <= (dataDepen?.datas || []).length - 1; i++) {
      var item =
      `<h2>${(dataDepen?.datas || []).length > i ?
      (dataDepen?.datas[i].name === 'Other' ? dataDepen?.datas[i].other : dataDepen?.datas[i].name) : ''}</h2>
      <h2>${dataDepen?.datas[i].yearStarted ? Translate(languageRedux).since : ''}
      ${dataDepen?.datas[i].yearStarted ? convertCalenderDDMMYYYY(dataDepen?.datas[i].yearStarted) : ''}</h2>
      <hr>
      `
      htmlDepen.push(item)
    }
    return htmlDepen
  }

  const immunization = () => {
    var htmlImmu = [``]
    for (var i = 0; i <= (dataImmu?.datas || []).length - 1; i++) {
      var item =
      `<h2>${(dataImmu?.datas || []).length > i ?
      (dataImmu?.datas[i].name === 'Other' ? dataImmu?.datas[i].other : dataImmu?.datas[i].name) : ''}</h2>
      <h2>${dataImmu?.datas[i].since ? Translate(languageRedux).date : ''}
      ${dataImmu?.datas[i].since ? convertCalenderDDMMYYYY(dataImmu?.datas[i].since) : ''}</h2>
      <hr>
      `
      htmlImmu.push(item)
    }
    return htmlImmu
  }

  const irregular = () => {
    var htmlIrre = [``]
    for (var i = 0; i <= (dataIrre?.datas || []).length - 1; i++) {
      var item =
      `<h2>${(dataIrre?.datas || []).length > i ?
      (dataIrre?.datas[i].name === 'Other' ? dataIrre?.datas[i].other : dataIrre?.datas[i].name) : ''}</h2>
      <h2>${dataIrre?.datas[i].since ? Translate(languageRedux).since : ''}
      ${dataIrre?.datas[i].since ? convertCalenderDDMMYYYY(dataIrre?.datas[i].since) : ''}</h2>
      <hr>
      `
      htmlIrre.push(item)
    }
    return htmlIrre
  }

  const prosthesis = () => {
    var htmlPros = [``]
    for (var i = 0; i <= (dataPros?.datas || []).length - 1; i++) {
      var item =
      `<h2>${(dataPros?.datas || []).length > i ?
      (dataPros?.datas[i].name === 'Other' ? dataPros?.datas[i].other : dataPros?.datas[i].name) : ''}</h2>
      <h2>${dataPros?.datas[i].since ? Translate(languageRedux).since : ''}
      ${dataPros?.datas[i].since ? convertCalenderDDMMYYYY(dataPros?.datas[i].since) : ''}</h2>
      <hr>
      `
      htmlPros.push(item)
    }
    return htmlPros
  }

  const hossur = () => {
    var htmlhossur = [``]
    for (var i = 0; i <= (dataHosSur?.datas || []).length - 1; i++) {
      var item =
      `<h2>${(dataHosSur?.datas || []).length > i ?
      (dataHosSur?.datas[i].type === 1 ? dataHosSur?.datas[i].hospitalization : dataHosSur?.datas[i].surgery) : ''}</h2>
      <h2>${dataHosSur?.datas[i].since ? Translate(languageRedux).since : ''}
      ${dataHosSur?.datas[i].since ? convertCalenderDDMMYYYY(dataHosSur?.datas[i].since) : ''}</h2>
      <hr>
      `
      htmlhossur.push(item)
    }
    return htmlhossur
  }

  const html = `
        <h1><center>${Translate(languageRedux).personalinfo}</center></h1
        <br>
        <h2>${Translate(languageRedux).FIRST_NAME}</h2>
        <h1>${userinfo?.nome}</h1>
        <hr>
        <h2>${Translate(languageRedux).surname}</h2>
        <h1>${userinfo?.cognome}</h1>
        <hr>
        <h2>${Translate(languageRedux).gender_member}</h2>
        <h1>${getGender()}</h1>
        <hr>
        <h2>${Translate(languageRedux).birthdate}</h2>
        <h1>${convertBirthdate(userinfo?.birthdate)}</h1>
        <hr>
        <h2>${Translate(languageRedux).placeOfBirth}</h2>
        <h1>${userinfo?.placeOfBirth}</h1>
        <hr>
        <h1><center>${Translate(languageRedux).address}</center></h1
        <br>
        <h2>${Translate(languageRedux).address}</h2>
        <h1>${userinfo?.address}</h1>
        <hr>
        <h2>${Translate(languageRedux).city}</h2>
        <h1>${userinfo?.city}</h1>
        <hr>
        <h2>${Translate(languageRedux).COUNTRY}</h2>
        <h1>${convertCountry()}</h1>
        <hr>
        <h1><center>${Translate(languageRedux).CONTACT_INFO}</center></h1
        <br>
        <h2>${Translate(languageRedux).EMAIL}</h2>
        <h1>${userinfo?.email}</h1>
        <hr>
        <h2>${Translate(languageRedux).PHONE}</h2>
        <h1>${userinfo?.phone1}</h1>
        <hr>
        <h1><center>${Translate(languageRedux).EMERGENCY_CONTACT}</center></h1
        <br>
        ${checkEmergencyContact()}
        <h1><center>${Translate(languageRedux).FAMILY_PHYSICIAN}</center></h1
        <h2>${Translate(languageRedux).name}</h2>
        <h1>${userinfo?.medicname1}</h1>
        <hr>
        <h2>${Translate(languageRedux).PHONE}</h2>
        <h1>${userinfo?.medicphone}</h1>
        <hr>
        <h2>${Translate(languageRedux).EMAIL}</h2>
        <h1>${userinfo?.medicemail}</h1>
        <hr>
        <h1><center>${Translate(languageRedux).patientAllergy}</center></h1
        <br>
        ${allergy()}
        <h1><center>${Translate(languageRedux).farmaci}</center></h1
        <br>
        ${medication()}
        <h1><center>${Translate(languageRedux).dependencies}</center></h1
        <br>
        ${dependency()}
        <h1><center>${Translate(languageRedux).hospitalization + ' & ' + Translate(languageRedux).surgery}</center></h1
        <br>
        ${hossur()}
        <h1><center>${Translate(languageRedux).immunizationmenu}</center></h1
        <br>
        ${immunization()}
        <h1><center>${Translate(languageRedux).IRREGULAR_TEST}</center></h1
        <br>
        ${irregular()}
        <h1><center>${Translate(languageRedux).PROSTHESIS_MEDICAL_AIDS}</center></h1
        <br>
        ${prosthesis()}
        `
  const _onPressShare = async () => {
    const results = await RNHTMLtoPDF.convert({
      html: html,
      fileName: Translate(languageRedux).medicalinfo,
      base64: true
    })
    let options = {
      url: `data:application/pdf;base64,${results.base64}`,
      fileName: Translate(languageRedux).medicalinfo
    }
    Share.open(options)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        err && console.log(err)
      })
  }
  return _onPressShare
}
