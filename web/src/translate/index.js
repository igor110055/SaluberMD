import * as defines from '../constants/define'

import locale_af_AF from './language/locale-af_AF.json'
import locale_am_AM from './language/locale-am_AM.json'
import locale_hy_HY from './language/locale-hy_HY.json'
import locale_az_AZ from './language/locale-az_AZ.json'
import localle_eu_EU from './language/locale-eu_EU.json'
import locale_be_BE from './language/locale-be_BE.json'
import locale_bn_BN from './language/locale-bn_BN.json'
import bs_BS from './language/locale-bs_BS.json'
import my_MY from './language/locale-my_MY.json'
import ca_CA from './language/locale-ca_CA.json'
import ceb_C from './language/locale-ceb_C.json'
import cs_CZ from './language/locale-cs_CZ.json'
import ny_NY from './language/locale-ny_NY.json'
import zh_TW from './language/locale-zh_TW.json'
import co_CO from './language/locale-co_CO.json'
import da_DA from './language/locale-da_DA.json'
import de_DE from './language/locale-de_DE.json'
import en_US from './language/locale-en_US.json'
import es_ES from './language/locale-es_ES.json'
import eo_EO from './language/locale-eo_EO.json'
import et_ET from './language/locale-et_ET.json'
import tl_TL from './language/locale-tl_TL.json'
import fr_FR from './language/locale-fr_FR.json'
import fy_FY from './language/locale-fy_FY.json'
import ga_GA from './language/locale-ga_GA.json'
import gl_GL from './language/locale-gl_GL.json'
import ka_KA from './language/locale-ka_KA.json'
import gu_GU from './language/locale-gu_GU.json'
import ht_HT from './language/locale-ht_HT.json'
import ha_HA from './language/locale-ha_HA.json'
import haw_H from './language/locale-haw_H.json'
import hi_HI from './language/locale-hi_HI.json'
import hmn_H from './language/locale-hmn_H.json'
import hr_HR from './language/locale-hr_HR.json'
import hu_HU from './language/locale-hu_HU.json'
import is_IS from './language/locale-is_IS.json'
import ig_IG from './language/locale-ig_IG.json'
import id_ID from './language/locale-id_ID.json'
import it_IT from './language/locale-it_IT.json'
import ja_JA from './language/locale-ja_JA.json'
import jw_JW from './language/locale-jw_JW.json'
import kn_KN from './language/locale-kn_KN.json'
import kk_KK from './language/locale-kk_KK.json'
import km_KM from './language/locale-km_KM.json'
import ko_KO from './language/locale-ko_KO.json'
import ku_KU from './language/locale-ku_KU.json'
import ky_KY from './language/locale-ky_KY.json'
import la_LA from './language/locale-la_LA.json'
import mk_MK from './language/locale-mk_MK.json'
import mg_MG from './language/locale-mg_MG.json'
import ms_MS from './language/locale-ms_MS.json'
import ml_ML from './language/locale-ml_ML.json'
import mt_MT from './language/locale-mt_MT.json'
import mi_MI from './language/locale-mi_MI.json'
import mr_MR from './language/locale-mr_MR.json'
import mn_MN from './language/locale-mn_MN.json'
import nl_NL from './language/locale-nl_NL.json'
import ne_NE from './language/locale-ne_NE.json'
import no_NO from './language/locale-no_NO.json'
import ps_PS from './language/locale-ps_PS.json'
import fa_FA from './language/locale-fa_FA.json'
import pl_PL from './language/locale-pl_PL.json'
import pt_PT from './language/locale-pt_PT.json'
import pa_PA from './language/locale-pa_PA.json'
import ru_RU from './language/locale-ru_RU.json'
import ro_RO from './language/locale-ro_RO.json'
import sm_SM from './language/locale-sm_SM.json'
import gd_GD from './language/locale-gd_GD.json'
import sr_SR from './language/locale-sr_SR.json'
import st_ST from './language/locale-st_ST.json'
import sn_SN from './language/locale-sn_SN.json'
import sq_SQ from './language/locale-sq_SQ.json'
import sd_SD from './language/locale-sd_SD.json'
import si_SI from './language/locale-si_SI.json'
import sk_SK from './language/locale-sk_SK.json'
import sl_SL from './language/locale-sl_SL.json'
import so_SO from './language/locale-so_SO.json'
import su_SU from './language/locale-su_SU.json'
import fi_FI from './language/locale-fi_FI.json'
import sv_SV from './language/locale-sv_SV.json'
import sw_SW from './language/locale-sw_SW.json'
import tg_TG from './language/locale-tg_TG.json'
import ta_TA from './language/locale-ta_TA.json'
import te_TE from './language/locale-te_TE.json'
import th_TH from './language/locale-th_TH.json'
import tr_TR from './language/locale-tr_TR.json'
import uk_UK from './language/locale-uk_UK.json'
import ur_UR from './language/locale-ur_UR.json'
import uz_UZ from './language/locale-uz_UZ.json'
import vi_VI from './language/locale-vi_VI.json'
import cy_CY from './language/locale-cy_CY.json'
import xh_XH from './language/locale-xh_XH.json'
import yi_YI from './language/locale-yi_YI.json'
import yo_YO from './language/locale-yo_YO.json'
import zu_ZU from './language/locale-zu_ZU.json'
import el_GR from './language/locale-el_GR.json'
import bg_BG from './language/locale-bg_BG.json'
import iw_IL from './language/locale-iw_IL.json'
import ar_AR from './language/locale-ar_AR.json'
import zh_CN from './language/locale-zh_CN.json'

const languageType = (type) => {
  switch (type) {
    case 'af_AF':
      return locale_af_AF.LOGGING_IN
    case 'am_AM':
      return locale_am_AM.LOGGING_IN
    case 'hy_HY':
      return locale_hy_HY
    case 'az_AZ':
      return locale_az_AZ
    case 'eu_EU':
      return localle_eu_EU
    case 'be_BE':
      return locale_be_BE
    case 'bn_BN':
      return locale_bn_BN
    case 'bs_BS':
      return bs_BS
    case 'my_MY':
      return my_MY
    case 'ca_CA':
      return ca_CA
    case 'ceb_C':
      return ceb_C
    case 'cs_CZ':
      return cs_CZ
    case 'ny_NY':
      return ny_NY
    case 'zh_TW':
      return zh_TW
    case 'co_CO':
      return co_CO
    case 'da_DA':
      return da_DA
    case 'de_DE':
      return de_DE
    case 'en_US':
      return en_US
    case 'es_ES':
      return es_ES
    case 'eo_EO':
      return eo_EO
    case 'et_ET':
      return et_ET
    case 'tl_TL':
      return tl_TL
    case 'fr_FR':
      return fr_FR
    case 'fy_FY':
      return fy_FY
    case 'ga_GA':
      return ga_GA
    case 'gl_GL':
      return gl_GL
    case 'ka_KA':
      return ka_KA
    case 'gu_GU':
      return gu_GU
    case 'ht_HT':
      return ht_HT
    case 'ha_HA':
      return ha_HA
    case 'haw_H':
      return haw_H
    case 'hi_HI':
      return hi_HI
    case 'hmn_H':
      return hmn_H
    case 'hr_HR':
      return hr_HR
    case 'hu_HU':
      return hu_HU
    case 'is_IS':
      return is_IS
    case 'ig_IG':
      return ig_IG
    case 'id_ID':
      return id_ID
    case 'it_IT':
      return it_IT
    case 'ja_JA':
      return ja_JA
    case 'jw_JW':
      return jw_JW
    case 'kn_KN':
      return kn_KN
    case 'kk_KK':
      return kk_KK
    case 'km_KM':
      return km_KM
    case 'ko_KO':
      return ko_KO
    case 'ku_KU':
      return ku_KU
    case 'ky_KY':
      return ky_KY
    case 'la_LA':
      return la_LA
    case 'mk_MK':
      return mk_MK
    case 'mg_MG':
      return mg_MG
    case 'ms_MS':
      return ms_MS
    case 'ml_ML':
      return ml_ML
    case 'mt_MT':
      return mt_MT
    case 'mi_MI':
      return mi_MI
    case 'mr_MR':
      return mr_MR
    case 'mn_MN':
      return mn_MN
    case 'nl_NL':
      return nl_NL
    case 'ne_NE':
      return ne_NE
    case 'no_NO':
      return no_NO
    case 'ps_PS':
      return ps_PS
    case 'fa_FA':
      return fa_FA
    case 'pl_PL':
      return pl_PL
    case 'pt_PT':
      return pt_PT
    case 'pa_PA':
      return pa_PA
    case 'ru_RU':
      return ru_RU
    case 'ro_RO':
      return ro_RO
    case 'sm_SM':
      return sm_SM
    case 'gd_GD':
      return gd_GD
    case 'sr_SR':
      return sr_SR
    case 'st_ST':
      return st_ST
    case 'sn_SN':
      return sn_SN
    case 'sq_SQ':
      return sq_SQ
    case 'sd_SD':
      return sd_SD
    case 'si_SI':
      return si_SI
    case 'sk_SK':
      return sk_SK
    case 'sl_SL':
      return sl_SL
    case 'so_SO':
      return so_SO
    case 'su_SU':
      return su_SU
    case 'fi_FI':
      return fi_FI
    case 'sv_SV':
      return sv_SV
    case 'sw_SW':
      return sw_SW
    case 'tg_TG':
      return tg_TG
    case 'ta_TA':
      return ta_TA
    case 'te_TE':
      return te_TE
    case 'th_TH':
      return th_TH
    case 'tr_TR':
      return tr_TR
    case 'uk_UK':
      return uk_UK
    case 'ur_UR':
      return ur_UR
    case 'uz_UZ':
      return uz_UZ
    case 'vi_VI':
      return vi_VI
    case 'cy_CY':
      return cy_CY
    case 'xh_XH':
      return xh_XH
    case 'yi_YI':
      return yi_YI
    case 'yo_YO':
      return yo_YO
    case 'zu_ZU':
      return zu_ZU
    case 'el_GR':
      return el_GR
    case 'bg_BG':
      return bg_BG
    case 'iw_IL':
      return iw_IL
    case 'ar_AR':
      return ar_AR
    case 'zh_CN':
      return zh_CN
    default:
      return en_US
  }
}

export default function Translate(type) {
  return languageType(type || defines.language)
}
