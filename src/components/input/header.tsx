import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import fonts from '../../assets/fonts/fonts';
import colors from '../../utils/colors';
import {OS} from '../../utils/utils';
import IconsSvg from '../../assets/svg/iconsSvg';

type IHeader = {
  title: string;
  hideBack?: boolean;
  closeButton?: boolean;
  showClock?: boolean;
  onClockPress?: () => void | undefined;
  onBackPress?: () => void | undefined;
};

const Header: React.FC<IHeader> = ({
  title,
  hideBack = false,
  closeButton = false,
  showClock = false,
  onClockPress,
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.headerContainer,
        {
          paddingTop: OS === 'ios' ? insets.top : insets.top + 10,
        },
      ]}>
      <TouchableOpacity
        onPress={onBackPress}
        style={styles.backBtn}
        disabled={hideBack}>
        {!hideBack && <IconsSvg name="back" />}
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>

      {closeButton && (
        <TouchableOpacity onPress={onBackPress} style={{marginEnd: 26}}>
          <IconsSvg name="close" />
        </TouchableOpacity>
      )}
      {showClock ? (
        <TouchableOpacity onPress={onClockPress} style={styles.clock}>
          <IconsSvg name="filter" />
        </TouchableOpacity>
      ) : (
        <View style={{height: 36}} />
      )}
    </View>
  );
};

export default Header;
const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
  },
  backBtn: {
    marginLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {width: 24, height: 24},
  closeIcon: {width: 24, height: 24, marginEnd: 20},
  title: {
    marginLeft: 10,
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.title,
    flex: 1,
  },
  timeIcon: {
    width: 69,
    height: 70,
  },
  topIcon: {},
  clock: {
    height: 36,
    width: 36,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginEnd: 24,
    borderRadius: 8,
  },
});
