import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image
} from 'react-native'
import RBSheet from 'react-native-raw-bottom-sheet'
import Fonts from '../constants/Fonts'
import { color2F80ED, color333333, colorE0E0E0, colorFFFFFF } from '../constants/colors'
import { customTxt } from '../constants/css'
import imgHealth from '../../assets/images/health_profile'

const CustomBottomSheet = ({
  listData, title, itemSelected, onItemClick,
  refBottomSheet, renderItemComponent,
  isName
}) => {

  return (
    <View style={styles.flatlistView}>
      <RBSheet ref={refBottomSheet} closeOnPressMask={true} height={400}>
        <View style={styles.fullView}>
          <View style={styles.headerView}>
            <Text style={styles.txtHeaderView}>{title}</Text>
          </View>
          <FlatList
            style={styles.fullView}
            data={listData}
            key={'#1'}
            extraData={listData}
            keyExtractor={(item, index) => index.toString()}
            onScrollToIndexFailed={() => { }}
            initialScrollIndex={listData.indexOf(itemSelected)}
            renderItem={({ item }) => {
              if (renderItemComponent) {
                return renderItemComponent(item)
              }
              return (
                <TouchableOpacity
                  onPress={() => onItemClick(item)}
                  style={[
                    styles.itemStyle
                  ]}>
                  <Text style={[
                    customTxt(Fonts.Regular, 14, color333333).txt,
                    styles.txt
                  ]}>{isName ? item?.name : item}</Text>
                  {
                    (isName ? itemSelected?.name : itemSelected) === (isName ? item?.name : item) && (
                      <View style={styles.viewCheck}>
                        <Image style={styles.imgCheck} source={imgHealth.ic_check} />
                      </View>
                    )
                  }
                </TouchableOpacity>
              )
            }}
          />
        </View>
      </RBSheet>
    </View>
  )
}

export default CustomBottomSheet

const styles = StyleSheet.create({
  itemView: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 15
  },
  flatlistView: {
    position: 'absolute',
    height: 0.1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'yellow'
  },
  fullView: {
    flex: 1,
    width: '100%',
    marginBottom: 15
  },
  headerView: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color2F80ED
  },
  txtHeaderView: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: Fonts.Bold
  },
  txt: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20
  },
  itemStyle: {
    borderBottomColor: colorE0E0E0,
    borderBottomWidth: 0.2,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 25,
    marginTop: 10
  },
  viewCheck: {
    position: 'absolute',
    width: 20,
    height: '100%',
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgCheck: {
    width: 16,
    height: 16
  }
})
