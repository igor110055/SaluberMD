import React from 'react'
import {
  StyleSheet, View, Text, Image
} from 'react-native'
import { color040404, color3777EE, colorDDDEE1, colorF0F0F0, colorFFFFFF } from '../../../../constants/colors'
import imgDirectCall from '../../../../../assets/images/direct_call'
import _ from 'lodash'
import { customTxt } from '../../../../constants/css'
import Fonts from '../../../../constants/Fonts'

export default function CustomLineTabs({
  index, listTabs
}) {

  const renderLineView = () => {
    const checkLeft = () => {
      if (_.includes([0,1], index)) {
        return true
      }
      return false
    }

    const checkLeftCenter = () => {
      if (index === 0) {
        return true
      }
      return false
    }

    const checkRightCenter = () => {
      if (index === (listTabs.length - 1)) {
        return true
      }
      return false
    }

    const checkRight = () => {
      if (_.includes([listTabs.length - 2, listTabs.length - 1], index)) {
        return true
      }
      return false
    }

    const renderIconCenter = () => {
      if (index === 0) {
        return imgDirectCall.ic_null
      } else if (index === listTabs.length - 1) {
        return imgDirectCall.ic_done
      }
      return imgDirectCall.ic_inprogress
    }

    return (
      <View style={styles.lineView}>
        <View style={styles.rowView}>
          <View style={[
              styles.lineActive20View,
              checkLeft() ? styles.bgWhite : null
            ]}
          />
          <Image style={styles.imgIcon} source={checkLeftCenter() ? imgDirectCall.ic_inprogress : imgDirectCall.ic_done}/>
        </View>

        <View style={styles.rowFlexView}>
          <View style={[
              styles.lineActiveFlexView,
              checkLeftCenter() ? styles.lineInActiveView :  null
            ]}
          />
          <Image style={styles.imgIcon} source={renderIconCenter()}/>
          <View style={[
              styles.lineActiveFlexView,
              checkRightCenter() ? null : styles.lineInActiveView
            ]}
          />
        </View>

        <View style={styles.rowView}>
          <Image style={styles.imgIcon} source={checkRightCenter() ? imgDirectCall.ic_inprogress : imgDirectCall.ic_null}/>
          <View style={[
              styles.lineActive20View,
              styles.lineInActiveView,
              checkRight() ? styles.bgWhite : null
            ]}
          />
        </View>
      </View>
    )
  }

  const renderTitleView = () => {
    const getLeftTitle = () => {
      if (index === 0) {
        return listTabs[index]
      } else if ((index + 1) === (listTabs.length - 1)) {
        return listTabs[index - 1]
      } else if (index === (listTabs.length - 1)) {
        return listTabs[index - 2]
      }
      return listTabs[index - 1]
    }
    const getCenterTitle = () => {
      if (index === 0) {
        return listTabs[index + 1]
      } else if (index === (listTabs.length - 1)) {
        return listTabs[index - 1]
      } else if ((index + 1) === (listTabs.length - 1)) {
        return listTabs[index]
      }
      return listTabs[index]
    }
    const getRightTitle = () => {
      if (index === 0) {
        return listTabs[index + 2]
      } if (index === (listTabs.length - 1)) {
        return listTabs[index]
      } else if ((index + 1) === (listTabs.length - 1)) {
        return listTabs[index + 1]
      }
      return listTabs[index + 1]
    }

    return (
      <View style={styles.titleView}>
        <Text style={[
          styles.titleLeftStyle,
          listTabs[index] === getLeftTitle() ? customTxt(Fonts.SemiBold, 12, color040404).txt : customTxt(Fonts.SemiBold, 12, colorDDDEE1).txt
        ]}>{getLeftTitle()}</Text>
        <Text style={[
          styles.titleCenterStyle,
          listTabs[index] === getCenterTitle() ? customTxt(Fonts.SemiBold, 12, color040404).txt : customTxt(Fonts.SemiBold, 12, colorDDDEE1).txt
        ]}>{getCenterTitle()}</Text>
        <Text style={[
          styles.titleRightStyle,
          listTabs[index] === getRightTitle() ? customTxt(Fonts.SemiBold, 12, color040404).txt : customTxt(Fonts.SemiBold, 12, colorDDDEE1).txt
        ]}>{getRightTitle()}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {renderLineView()}
      {renderTitleView()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    backgroundColor: colorFFFFFF
  },
  lineView: {
    flex: 1,
    flexDirection: 'row'
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rowFlexView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  bgWhite: {
    backgroundColor: colorFFFFFF
  },
  lineActive20View: {
    width: 20,
    height: 2,
    backgroundColor: color3777EE
  },
  lineActiveFlexView: {
    flex: 1,
    height: 2,
    backgroundColor: color3777EE
  },
  lineInActiveView: {
    backgroundColor: colorF0F0F0
  },
  imgIcon: {
    width: 24,
    height: 24
  },
  titleView: {
    flex: 1,
    flexDirection: 'row'
  },
  titleLeftStyle: {
    flex: 1,
    marginLeft: 20
  },
  titleCenterStyle: {
    flex: 1,
    textAlign: 'center'
  },
  titleRightStyle: {
    flex: 1,
    marginRight: 20,
    textAlign: 'right'
  }
})
