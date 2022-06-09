import React, { useState, useEffect, useRef } from 'react'
import {
  StyleSheet, View, StatusBar, Text,
  ScrollView, TouchableOpacity, Image
} from 'react-native'
import {
  color2F80ED,
  color333333,
  color5F6368,
  colorFFFFFF
} from '../../../constants/colors'
import Header from '../../../components/Header'
import { customTxt } from '../../../constants/css'
import Fonts from '../../../constants/Fonts'
import imgMedicalRecord from '../../../../assets/images/medical_record'
import NavigationService from '../../../navigation'
import Routes from '../../../navigation/Routes'
import Translate from 'translate'
import { useSelector } from 'react-redux'

export default function TermsPrivacyView() {
  const [isPrivacy, setPrivacy] = useState(false)
  const [isAccept, setAccept] = useState(false)
  const scrolViewRef = useRef()
  const languageRedux = useSelector(state => state.common.language)


  const _onPressCancel = () => {
    setPrivacy(false)
    setAccept(false)
  }

  const textTitle = isPrivacy ? Translate(languageRedux).PRIVACY : Translate(languageRedux).TERMS_CONDITIONS
  const textContent = isPrivacy ? txtPrivacyShow : txtTermsShow

  useEffect(() => {
    if (scrolViewRef.current) {
      scrolViewRef.current?.scrollTo({
        x: 0,
        y: 0,
        animated: true
      })
    }
  }, [isPrivacy])

  const renderBottomButton = () => {
    const _onPressNext = () => {
      if (isPrivacy && isAccept) {
        NavigationService.navigate(Routes.SIGN_UP_INFORMATION_SCREEN)
      }
      setPrivacy(true)
    }

    return (
      <View style={styles.bottomBTView}>
        <TouchableOpacity
          onPress={_onPressNext}
          style={styles.nextStyle}>
          <Text style={[
            customTxt(Fonts.SemiBold, 16, colorFFFFFF).txt,
            styles.txtNext
          ]}>{Translate(languageRedux).NEXT}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderAccept = () => {
    return (
      <View style={styles.acceptView}>
        <TouchableOpacity onPress={() => setAccept(!isAccept)}>
          <Image
            style={styles.imgAccept}
            source={isAccept ? imgMedicalRecord.ic_check_box_on : imgMedicalRecord.ic_check_box_off}
          />
        </TouchableOpacity>
        <Text style={customTxt(Fonts.Regular, 12, color333333).txt}>{Translate(languageRedux).ACCEPT_BTN}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white"/>
      <Header
        textCenter={Translate(languageRedux).SIGNUP_BTN}
        backgroundColor={color5F6368}
        textColor={colorFFFFFF}
        textLeft={Translate(languageRedux).cancel}
        onPressLeft={isPrivacy ? _onPressCancel : null}
      />
      <View style={styles.contentView}>
        <Text style={[
          customTxt(Fonts.SemiBold, 16, color333333).txt,
          styles.marginB10
        ]}>{textTitle}</Text>
        <ScrollView ref={scrolViewRef}>
          <Text style={[
            customTxt(Fonts.Regular, 14, color333333).txt
          ]}>{textContent}</Text>
          {isPrivacy && renderAccept()}
          {renderBottomButton()}
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorFFFFFF
  },
  contentView: {
    flex: 1,
    marginTop: 48,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 48
  },
  bottomBTView: {
    alignItems: 'flex-end'
  },
  nextStyle: {
    backgroundColor: color2F80ED,
    borderRadius: 4,
    marginTop: 20
  },
  txtNext: {
    marginTop: 15,
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 15
  },
  acceptView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  imgAccept: {
    width: 24,
    height: 24,
    marginTop: 24,
    marginRight: 16,
    marginBottom: 24
  },
  marginB10: {
    marginBottom: 10
  }
})

const txtTermsShow = `
TERMS
Last revision: Dec 7, 2017
Use of the Site.
SaluberMD, LLC (“SaluberMD”, “we”, “us”, or “our”) operates the website located
at www.salubermd.com and other related websites and mobile applications with links to these
Terms of Use (collectively, the “Site”). We offer online telehealth services (the “Services”) enabling our members (“Members”) to report their health history and engage healthcare professionals (“Healthcare Professionals”) to obtain medical and healthcare services (“Services”). By accessing and using the Site, you agree to be bound by these Terms of Use and all other terms and policies that appear on the Site. If you do not wish to be bound by any of these Terms of Use, you may not use the Site or the Services.

HEALTHCARE SERVICES
The Healthcare Professionals who deliver Services through SaluberMD are independent professionals practicing within a group of independently owned professional practices collectively known as “SaluberMD Professionals”. SaluberMD, LLC does not practice medicine or any other licensed profession, and does not interfere with the practice of medicine or any other licensed profession by Healthcare Professionals, each of whom is responsible for his or her services and compliance with the requirements applicable to his or her profession and license. Neither SaluberMD nor any third parties who promote the Services or provide you with a link to the Services shall be liable for any professional advice you obtain from a Healthcare Professional via the Services.
SITE CONTENT
None of the Site content (other than information you receive from Healthcare Professionals) should be considered medical advice or an endorsement, representation or warranty that any particular medication or treatment is safe, appropriate, or effective for you.
PRIVACY
SaluberMD is required to comply with federal healthcare privacy and security laws and maintain safeguards to protect the security of your health information. Additionally, the information you provide to your Healthcare Professional during a medical consultation or therapy session is legally confidential, except for certain legal exceptions as more fully described in our Privacy Policy. We devote considerable effort toward ensuring that your personal information is secure. Information regarding our use of health and other personal information is provided in our Privacy Policy. As part of providing you the Services, we may need to provide you with certain communications, such as appointment reminders, service announcements and administrative messages. These communications are considered part of the Services and your Account. While secure electronic messaging is always preferred to insecure email, under certain circumstances, insecure email communication containing personal health information may take place between you and SaluberMD. SaluberMD cannot ensure the security or confidentiality of messages sent by email. Information relating to your care, including clinical notes and medical records, are stored on secure, encrypted servers maintained by SaluberMD.
USER ACCOUNTS
When you register on the Site, you are required to create an account (“Account”) by entering your name, email address, password and certain other information collected by SaluberMD (collectively “Account Information”). To create an Account, you must be of legal age to form a binding contract. If you are not of legal age to form a binding contract, you may not register to use our Services. You agree that the Account Information that you provide to us at all times, including during registration and in any information you upload to the Site, will be true, accurate, current, and complete. You may not transfer or share your Account password with anyone, or create more than one Account (with the exception of subaccounts established for children of whom you are the parent or legal guardian). You are responsible for maintaining the confidentiality of your Account password and for all activities that occur under your Account.

SaluberMD reserves the right to take any and all action, as it deems necessary or reasonable, regarding the security of the Site and your Account Information. In no event and under no circumstances shall SaluberMD be held liable to you for any liabilities or damages resulting from or arising out of your use of the Site, your use of the Account Information or your release of the Account Information to a third party. You may not use anyone else's account at any time.
ACCESS RIGHTS
We hereby grant to you a limited, non-exclusive, nontransferable right to access the Site and use the Services solely for your personal non-commercial use and only as permitted under these Terms of Use and any separate agreements you may have entered into with us (“Access Rights”). We reserve the right, in our sole discretion, to deny or suspend use of the Site or Services to anyone for any reason. You agree that you will not, and will not attempt to: (a) impersonate any person or entity, or otherwise misrepresent your affiliation with a person or entity; (b) use the Site or Services to violate any local, state, national or international law; (c) reverse engineer, disassemble, decompile, or translate any software or other components of the Site or Services; (d) distribute viruses or other harmful computer code through the Site; or (e) otherwise use the Services or Site in any manner that exceeds the scope of use granted above. In addition, you agree to refrain from abusive language and behavior which could be regarded as inappropriate, or conduct that is unlawful or illegal, when communicating with Healthcare Professionals through the Site and to refrain from contacting Healthcare Professionals for telehealth services outside of the Site. SaluberMD is not responsible for any interactions with Healthcare Professionals that are not conducted through the Site. We strongly recommend that you do not use the Services on public computers. We also recommend that you do not store your Account password through your web browser or other software.
FEES AND PURCHASE TERMS
You agree to pay all fees or charges to your Account in accordance with the fees, charges, and billing terms in effect at the time a fee or charge is due and payable. By providing SaluberMD with your credit card number or PayPal account and associated payment information, you agree that SaluberMD is authorized to immediately invoice your account for all fees and charges due and payable to SaluberMD hereunder and that no additional notice or consent is required. If your health plan, employer or agency has arranged with SaluberMD to pay the fee or any portion of the fee, or if the fee is pursuant to some other arrangement with SaluberMD, that fee adjustment will be reflected in the fee that you are ultimately charged. Please check with your employer, health plan or agency to determine if any Services will be reimbursed.

If you do not have insurance coverage for Services, or if your coverage is denied, you acknowledge and agree that you shall be personally responsible for all incurred expenses. SaluberMD offers no guarantee that you shall receive any such reimbursement.
SaluberMD reserves the right to modify or implement a new pricing structure at any time prior to billing you for your initial payment or for future payments due pursuant to these Terms of Use. You understand and agree that for Services provided on an appointment basis, you will be responsible for a missed appointment fee equal to all or a portion of the fees you and your insurer or other payor would have paid for the scheduled services if you do not cancel a scheduled appointment at least 24 hours in advance, unless we notify you in writing that a shorter cancellation window applies.
WEBSITE LINKS
WE WILL NOT BE LIABLE FOR ANY INFORMATION, SOFTWARE, OR LINKS FOUND AT ANY OTHER WEBSITE, INTERNET LOCATION, OR SOURCE OF INFORMATION, NOR FOR YOUR USE OF SUCH INFORMATION, SOFTWARE OR LINKS, NOR FOR THE ACTS OR OMISSIONS OF ANY SUCH WEBSITES OR THEIR RESPECTIVE OPERATORS.
OWNERSHIP
The Site and its entire contents, features and functionality (including but not limited to all information, software, text, displays, images, video and audio, and the design, selection and arrangement thereof), are owned by SaluberMD, its licensors or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret and other intellectual property or proprietary rights laws. These Terms of Use permit you to use the Site for your personal, non-commercial use only. You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store or transmit any of the material on our Site except as generally and ordinarily permitted through the Site according to these Terms of Use. You must not access or use for any commercial purposes any part of the Site or any services or materials available through the Site.
TRADEMARKS
Certain of the names, logos, and other materials displayed on the Site or in the Services may constitute trademarks, trade names, service marks or logos ("Marks") of SaluberMD or other entities. You are not authorized to use any such Marks without the express written permission
of SaluberMD. Ownership of all such Marks and the goodwill associated therewith remains with us or those other entities.
TERMINATION
You may deactivate your Account and end your registration at any time, for any reason by sending an email to info@salubermd.com. SaluberMD may suspend or terminate your use of the Site, your Account and/or registration for any reason at any time. Subject to applicable law, SaluberMD reserves the right to maintain, delete or destroy all communications and materials posted or uploaded to the Site pursuant to its internal record retention and/or content destruction policies. After such termination, SaluberMD will have no further obligation to provide the Services, except to the extent we are obligated to provide you access to your health records or Healthcare Professionals are required to provide you with continuing care under their applicable legal, ethical and professional obligations to you.
RIGHT TO MODIFY
We may at our sole discretion change, add, or delete portions of these Terms of Use at any time on a going-forward basis. Continued use of the Site and/or Services following notice of any such changes will indicate your acknowledgement of such changes and agreement to be bound by the revised Terms of Use, inclusive of such changes.
DISCLAIMER OF WARRANTIES
YOU EXPRESSLY AGREE THAT USE OF THE SITE OR SERVICES IS AT YOUR SOLE RISK. BOTH THE SITE AND SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. SALUBERMD EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR USE OR PURPOSE, NON-INFRINGEMENT, TITLE, OPERABILITY, CONDITION, QUIET ENJOYMENT, VALUE, ACCURACY OF DATA AND SYSTEM INTEGRATION.
INDEMNIFICATION
You agree to indemnify, defend and hold harmless SaluberMD, its officers, directors, employees, agents, subsidiaries, affiliates, licensors, and suppliers, from and against any claim, actions, demands, liabilities and settlements, including without limitation reasonable legal and accounting fees (“Claims”), resulting from, or alleged to result from, your violation of these Terms of Use.
GEOGRAPHICAL RESTRICTIONS
SaluberMD makes no representation that all products, services and/or material described on the Site, or the Services available through the Site, are appropriate or available for use in locations outside the United States or all territories within the United States.
DISCLOSURES
All Health Professionals on the Site hold professional licenses issued by the professional licensing boards in the states where they practice. All physicians and psychologists hold advanced degrees in either medicine or psychology and have undergone postgraduate training. You can report a complaint relating to the care provided by a Healthcare Professional by contacting the professional licensing board in the state where the care was received. In a professional relationship, sexual intimacy is never appropriate and should be reported to the board or agency that licenses, registers, or certifies the licensee.

You can find the contact information for each of the state professional licensing boards governing medicine on the Federation of State Medical Boards website at http://www.fsmb.org/state-medical-boards/contacts and governing psychology on the Association of State and Provincial Psychology Boards website at http://www.asppb.net/?page=BdContactNewPG.

Any clinical records created as a result of your use of the Services will be securely maintained by SaluberMD on behalf of SaluberMD Professionals for a period that is no less than the minimum number of years such records are required to be maintained under state and federal law, and which is typically at least six years.
MISCELLANEOUS
These Terms of Use and your use of the Site shall be governed by the laws of the State of Delaware, without giving effect to the principles of conflict of laws. Any dispute arising under or relating in any way to these Terms of Use will be resolved exclusively by final and binding arbitration in San Francisco, California under the rules of the American Arbitration Association, except that either party may bring a claim related to intellectual property rights, or seek temporary and preliminary specific performance and injunctive relief, in any court of competent jurisdiction, without the posting of bond or other security. The parties agree to the personal and subject matter jurisdiction and venue of the courts located in San Francisco, California, for any action related to these Terms of Use.
You understand that by checking the “agree” box for these Terms of Use and/or any other forms presented to you on the Site you are agreeing to these Terms of Use and that such action constitutes a legal signature. You agree that we may send to you any privacy or other notices, disclosures, or communications regarding the Services (collectively, "Communications") through electronic means including but not limited to: (1) by e-mail, using the address that you provided to us during registration, (2) short messaging service (“SMS”) text message to the mobile number you provided us during registration, (3) push notifications on your mobile device, or (4) by posting the Communications on the Site. The delivery of any Communications from us is effective when sent by us, regardless of whether you read the Communication when you receive it or whether you actually receive the delivery. You can withdraw your consent to receive Communications by deactivating your Account. You can opt-out of future Communications through SMS text message by replying “STOP” or by calling SaluberMD Member Support.

No waiver by SaluberMD of any term or condition set forth in these Terms of Use shall be deemed a further or continuing
waiver of such term or condition or a waiver of any other term or condition, and any failure of SaluberMD to assert a right or provision under these Terms of Use shall not constitute a waiver of such right or provision. If any provision of these Terms of Use is held by a court or other tribunal of competent jurisdiction to be invalid, illegal or unenforceable for any reason, such provision shall be eliminated or limited to the minimum extent such that the remaining provisions of the Terms of Use will continue in full force and effect.

SaluberMD devotes considerable effort to optimizing signal strength and diagnosis deficiencies but is not responsible for the internet or data bandwidth and signal of your mobile device.
The Digital Millennium Copyright Act of 1998 (the "DMCA") provides recourse for copyright owners who believe that material appearing on the Internet infringes their rights under U.S. copyright law. If you believe in good faith that materials appearing on the Site infringe your copyright, you (or your agent) may send us a notice requesting that the material be removed, or access to it blocked. In addition, if you believe in good faith that a notice of copyright infringement has been wrongly filed against you, the DMCA permits you to send us a counter- notice. Notices and counter-notices must meet statutory requirements imposed by the DMCA.

One place to find more information is the U.S. Copyright Office Web site, currently located at http://www.loc.gov/copyright. In accordance with the DMCA, SaluberMD has designated an agent to receive notification of alleged copyright infringement in accordance with the DMCA. Any written Notification of Claimed infringement should comply with Title 17, United States Code, Section 512(c)(3)(A) and should be provided in writing to SaluberMD LLC c/o Baily & Glasser, LLP, ATTN: Brian Glasser, 209 Capitol Street, Charleston, West Virginia 25301.

Please report any violations of these Terms of Use to info@salubermd.com.
`

const txtPrivacyShow = `
Introduction This notice explains SaluberMD’s policy concerning gathering, storing, handling, and securing customer information and data, and the various measures Telemedicine takes to protect your privacy.

Your Privacy SaluberMD pledges to always respect and secure your privacy. SaluberMD provides sophisticated telemedicine services using advanced technologies that require us to collect and store personal and medical information that you supply to us. Because collecting and storing data is a key part of our business, SaluberMD recognizes its commitment to at all times protect the secrecy and confidentiality of your information. We make great efforts to ensure that the information you share with SaluberMD is kept strictly confidential and secured through a variety of hardware and software procedures. We also recognize the importance of maintaining strict confidentiality and security policies regarding disclosure of customer identity or personal information.

Our Privacy Guarantee SaluberMD is the sole collector and owner of information submitted to us by you. SaluberMD will never share and/or transfer your personal information with or to any third party, unless legally required to do so by a recognized court of law. SaluberMD may share only non-personal or aggregate data that contain no personal identifying information.

Personal Information We Collect and Store You may provide SaluberMD with two types of information: 1. Personal information you choose to submit when you register with SaluberMD, such as your name, address, etc., and persons who are to be contacted in case of emergency. 2. Medical information, including medical histories you choose to submit during registration, and medical data we collect from our medical monitoring devices and during the interactive healthcare sessions we conduct with you at your request.

The personal and medical information is protected by security measures, as specified below.

Email Address In order to use this website, you must first complete a registration procedure. During registration you are required to give your contact information, such as name and email address. The email address is mandatory. When registration is complete, we send you – the new member – a welcoming email that provides your User ID and Password. If you forget your password, you may use the recovery procedure and a new password will be sent to your email address.

Home Address You may (but are not obliged to) provide your home address. This address, however, is required should you order an emergency card. The emergency card will be sent to this address.

Links To Other Websites Our website may contain links to other websites. You should carefully review the privacy policies and practices of other websites, as we cannot control or be responsible for their privacy practices.

Cookies Many websites use “cookies,” small computer files placed automatically on a PC’s hard drive that provide the web site with information about the user. SaluberMD does not use cookies on its customer website.

Our Security Measures Our website and database are protected by a comprehensive, multi-layered information security model. SaluberMD's security model is designed to ensure the confidentiality of the patient and health information providers through appropriate security measures.

Authentication: You must enter personal identification information to enter your personal account. On the login page you must enter your User ID and Password. When you login to the system with your User ID and Password you will have the right to view and edit your records. If you login to the system with your User ID and Emergency Password or you delegate another person (a medical specialist) to login with the Emergency Password you (or he/she) will have the right to view a partial set of your data – the emergency data. As the owner of this data, you will have the ability to control and define the set of emergency data that will be disclosed at emergency login.

Encryption – SSL 128 bits: Secure Socket Layer (SSL) technology is used for data transmission between our web site and the browser at your local computer. We use 128-bit encryption, the highest level of protection available for all Internet communications, including credit card and other financial transactions. SSL means that the personal information you provide us is transmitted safely because it is encrypted. Encryption involves systematic scrambling of numbers and letters so that if someone manages to intercept a digital packet of data, then he/she would not be able to use it. When you leave our secured site you may encounter a standard warning that most browsers display when a visitor moves from a "secured" page to an "unsecured" page. Verisign Valid Certificate: Our Verisign SSL Web Server Certificate provides secure communications by encrypting all data to and from the site. Verisign has checked and verified the company’s registration documents and the site's registered domain name. This enables you to check the site's validity yourself. Always check a site's certificate before entering any sensitive information.

SaluberMD Staff Access Limitation: Access to all customer information, including the sensitive information noted above, is restricted within our offices. Only authorized Telemedicine personnel who require the information to perform a specific job have access to web server logs and to information that can be linked to a specific individual. These employees are held to strict confidentiality and security policies regarding disclosure of customer identity or personal information.

Secured environment: The servers on which we store personally identifiable information are kept in a secure environment.

Changes to This Privacy Policy SaluberMD may update this privacy policy from time to time as necessary. If we propose to make changes in the way we treat personal information, we will notify you by placing a prominent notice on our site. We will handle personal identifiable information in accordance with the privacy policy that was in effect when such information was collected or submitted.

How to Contact Us Should you have questions or concerns about our privacy policy, please send us an email at info@salubermd.com. 
`
