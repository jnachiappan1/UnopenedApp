import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import fonts from '../../assets/fonts/fonts';
import colors from '../../utils/colors';

type IHeader = {
  onBackPress?: () => void;
  title: string;
  hideBack?: boolean;
  closeButton?: boolean;
};

const Header: React.FC<IHeader> = ({
  onBackPress,
  title,
  hideBack = false,
  closeButton = false,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.headerContainer,
        {
          paddingTop: insets.top + 10,
        },
      ]}>
      <TouchableOpacity
        onPress={onBackPress}
        style={styles.backBtn}
        disabled={hideBack}>
        {/* {!hideBack && <IconsSvg name="leftArrow" style={styles.backIcon} />} */}
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>
      {/* {closeButton && (
        <HoverIcon
          iconName="close"
          style={styles.closeIcon}
          onPress={onBackPress}
        />
      )} */}
    </View>
  );
};

export default Header;
const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    paddingBottom: 12,
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
    marginTop: 2,
    flex: 1,
  },
});
