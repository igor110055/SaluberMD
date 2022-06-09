import Translate from 'translate'

export const STORAGE_KEY = {
  TOKEN: 'TOKEN',
  FACEID: 'FACEID',
  LANGUAGE: 'LANGUAGE',
  SERVER: 'SERVER',
  USERNAME: 'USERNAME',
  PASSWORD: 'PASSWORD',
  IS_FACE_ID: 'IS_FACE_ID',
  DEVICE_TOKEN: 'DEVICE_TOKEN',
  OLD_TOKEN: 'OLD_TOKEN'
}

export var language = 'en_US'

export const LANGUAGE = [
  {
    'name': 'Afrikaans',
    'value': 'af_AF',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Amharic',
    'value': 'am_AM',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Armenian',
    'value': 'hy_HY',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Azeerbaijani',
    'value': 'az_AZ',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Basque',
    'value': 'eu_EU',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Belarusian',
    'value': 'be_BE',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Bengali',
    'value': 'bn_BN',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Bosnian',
    'value': 'bs_BS',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Burmese',
    'value': 'my_MY',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Catalan',
    'value': 'ca_CA',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Cebuano',
    'value': 'ceb_C',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Čeština',
    'value': 'cs_CZ',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Chichewa',
    'value': 'ny_NY',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Chinese (Traditional)',
    'value': 'zh_TW',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Corsican',
    'value': 'co_CO',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Dansk',
    'value': 'da_DA',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Deutsch',
    'value': 'de_DE',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'English',
    'value': 'en_US',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Español',
    'value': 'es_ES',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Esperanto',
    'value': 'eo_EO',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Estonian',
    'value': 'et_ET',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Filipino',
    'value': 'tl_TL',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Français',
    'value': 'fr_FR',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Frisian',
    'value': 'fy_FY',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Gaeilge',
    'value': 'ga_GA',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Galician',
    'value': 'gl_GL',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Georgian',
    'value': 'ka_KA',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Gujarati',
    'value': 'gu_GU',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Haitian Creole',
    'value': 'ht_HT',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Hausa',
    'value': 'ha_HA',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Hawaiian',
    'value': 'haw_H',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Hindi',
    'value': 'hi_HI',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Hmong',
    'value': 'hmn_H',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Hrvatski',
    'value': 'hr_HR',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Hungarian',
    'value': 'hu_HU',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Icelandic',
    'value': 'is_IS',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Igbo',
    'value': 'ig_IG',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Indonesian',
    'value': 'id_ID',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Italiano',
    'value': 'it_IT',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Japanese',
    'value': 'ja_JA',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Javanese',
    'value': 'jw_JW',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Kannada',
    'value': 'kn_KN',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Kazakh',
    'value': 'kk_KK',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Khmer',
    'value': 'km_KM',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Korean',
    'value': 'ko_KO',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Kurdish',
    'value': 'ku_KU',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Kyrgyz',
    'value': 'ky_KY',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Latin',
    'value': 'la_LA',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Macedonian',
    'value': 'mk_MK',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Malagasy',
    'value': 'mg_MG',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Malay',
    'value': 'ms_MS',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Malayalam',
    'value': 'ml_ML',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Malti',
    'value': 'mt_MT',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Maori',
    'value': 'mi_MI',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Marathi',
    'value': 'mr_MR',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Mongolian',
    'value': 'mn_MN',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Nederlands',
    'value': 'nl_NL',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Nepali',
    'value': 'ne_NE',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Norwegian',
    'value': 'no_NO',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Pashto',
    'value': 'ps_PS',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Persian',
    'value': 'fa_FA',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Polski',
    'value': 'pl_PL',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Português',
    'value': 'pt_PT',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Punjabi',
    'value': 'pa_PA',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Pусский',
    'value': 'ru_RU',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Română',
    'value': 'ro_RO',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Samoan',
    'value': 'sm_SM',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Scots Gaelic',
    'value': 'gd_GD',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Serbian',
    'value': 'sr_SR',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Sesotho',
    'value': 'st_ST',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Shona',
    'value': 'sn_SN',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Shqiptar',
    'value': 'sq_SQ',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Sindhi',
    'value': 'sd_SD',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Sinhala',
    'value': 'si_SI',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Slovak',
    'value': 'sk_SK',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Slovenščina',
    'value': 'sl_SL',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Somali',
    'value': 'so_SO',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Sundanese',
    'value': 'su_SU',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Suomi',
    'value': 'fi_FI',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Svenska',
    'value': 'sv_SV',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Swahili',
    'value': 'sw_SW',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Tajik',
    'value': 'tg_TG',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Tamil',
    'value': 'ta_TA',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Telugu',
    'value': 'te_TE',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Thai',
    'value': 'th_TH',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Türkçe',
    'value': 'tr_TR',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Ukrainian',
    'value': 'uk_UK',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Urdu',
    'value': 'ur_UR',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Uzbek',
    'value': 'uz_UZ',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Vietnamese',
    'value': 'vi_VI',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Welsh',
    'value': 'cy_CY',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Xhosa',
    'value': 'xh_XH',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Yiddish',
    'value': 'yi_YI',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Yoruba',
    'value': 'yo_YO',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Zulu',
    'value': 'zu_ZU',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'Ελληνικά',
    'value': 'el_GR',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'български',
    'value': 'bg_BG',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'עברית',
    'value': 'iw_IL',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': 'عربى',
    'value': 'ar_AR',
    'idOpt': '1',
    'attr': null
  },
  {
    'name': '中文',
    'value': 'zh_CN',
    'idOpt': '1',
    'attr': null
  }
]

export function LsShow(lang) {
  return {
    name: Translate(lang).SHOW,
    data: [
      {
        name: Translate(lang).tendays,
        value: 10
      },
      {
        name: Translate(lang).sevendays,
        value: 7
      },
      {
        name: Translate(lang).amonth,
        value: 1
      },
      {
        name: Translate(lang).alldata,
        value: 1000
      }
    ]
  }
}

export function LsEntry(lang) {
  return {
    name: Translate(lang).ENTRY_TYPE,
    data: [
      {
        name: Translate(lang).ALL_ENTRIES,
        value: 0
      },
      {
        name: Translate(lang).device,
        value: 1
      },
      {
        name: Translate(lang).MANUAL_ENTRY,
        value: -1
      }
      // {
      //   name: Translate(lang).poc,
      //   value: 3
      // }
    ]
  }
}
