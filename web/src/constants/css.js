import { StyleSheet } from 'react-native'
import Fonts from './Fonts'
import * as colors from './colors'

const styles = StyleSheet.create({
  safeAreaView1: {
    flex: 0
  },
  safeAreaView2: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerView: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  shadown: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 9
  }
})

export default styles

const getFontWeight = (font) => {
  switch (font) {
    case Fonts.Bold:
      return '700'
    case Fonts.SemiBold:
      return '600'
    case Fonts.Medium:
      return '500'
    default:
      return '400'
  }
}

export const customTxt = (family, size, txtColor) => StyleSheet.create({
  txt: {
    fontFamily: family || Fonts.Regular,
    fontSize: size || 13,
    color: txtColor || colors.color040404,
    fontWeight: getFontWeight(family)
  }
})


export const border = (cl, wd) => StyleSheet.create({
  borderT: {
    borderTopColor: cl || colors.colorE0E0E0,
    borderTopWidth: wd || 1
  },
  borderR: {
    borderRightColor: cl || colors.colorF2F2F2,
    borderRightWidth: wd || 1
  },
  borderB: {
    borderBottomColor: cl || colors.colorF2F2F2,
    borderBottomWidth: wd || 1
  },
  borderL: {
    borderLeftColor: cl || colors.colorF2F2F2,
    borderLeftWidth: wd || 1
  },
  border: {
    borderColor: cl || colors.colorF2F2F2,
    borderWidth: wd || 1
  }
})
