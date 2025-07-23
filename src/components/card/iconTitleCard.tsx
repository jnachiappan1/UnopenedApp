import React, {useState} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import fonts from '../../assets/fonts/fonts';
import IconsSvg, {IconName} from '../../assets/svg/iconsSvg';
import {fontSizes} from '../../utils/utils';
import colors from '../../utils/colors';
import { useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';

type ICDrawer = {
  svgName?: IconName;
  title?: string;
  style?: StyleProp<ViewStyle> | undefined;
  onPress?: () => void;
  disabled?: boolean;
  rightArrow?: boolean;
  isLanguage?: boolean;
  isToggleButtonOnOff?: boolean;
};

const IconTitleCard = (props: ICDrawer) => {
  const {
    svgName,
    title,
    style,
    onPress,
    disabled,
    rightArrow = false,
    isLanguage = false,
    isToggleButtonOnOff = false,
  } = props;
  const [isToggled, setIsToggled] = useState(false);
  if (!svgName) {
    return null; // or return a default icon, or handle the case in any way you prefer
  }
  const language = useSelector(
    (user: IRootState) => user.user.selectedLanguage,
  );
  
  
  const handleToggle = () => {
    setIsToggled(!isToggled);
  };
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}>
      <View
        style={
          isLanguage ? styles.childLanguageContainer : styles.childContainer
        }>
        <IconsSvg name={svgName} />
        <Text
          style={[
            styles.titleStyle,
            // eslint-disable-next-line react-native/no-inline-styles
            {color: title === 'Delete Account' ? '#D90505' : colors.gray},
          ]}>
          {title}
        </Text>
      </View>
      {isLanguage && (
        <View style={styles.languageContainer}>
          <Text style={styles.txtBtn}>{language === 'en' ? "English": "عربي"}</Text>
          <IconsSvg name="rightArrow" style={styles.rightArrow} />
        </View>
      )}
      {rightArrow && <IconsSvg name="rightArrow" />}

      {isToggleButtonOnOff && (
        <TouchableOpacity
          style={[styles.button, isToggled ? styles.buttonActive : null]}
          onPress={handleToggle}>
          <View
            style={[
              styles.indicator,
              isToggled ? styles.indicatorRight : styles.indicatorLeft,
            ]}
          />
        </TouchableOpacity>
        
      )}
    </TouchableOpacity>
  );
};

export default IconTitleCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#E6E6E6',
    borderBottomWidth: 1,
    paddingVertical: 6,
    alignItems:'center',
    alignContent: 'center',
    paddingHorizontal:10,
  },
  titleStyle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.medium,
    textAlign: 'left',
    color: colors.gray,
    paddingStart: 10,
    width: '88%',
  },
  childContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'lightgray',
    padding: 3,
    borderRadius: 20,
    width: 36,
    height: 20,
    alignSelf: 'center',
  },
  buttonActive: {
    backgroundColor: colors.primary,
  },
  indicator: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: colors.secondary,
  },
  indicatorLeft: {
    alignSelf: 'flex-start',
  },
  indicatorRight: {
    alignSelf: 'flex-end',
  },
  childLanguageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '75%',
    paddingStart: 5,
  },
  languageContainer: {
    flexDirection: 'row',
    width: '25%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txtBtn: {
    fontSize: fontSizes.small,
    color: colors.primary,
    fontFamily: fonts.regular,
  },
  rightArrow: {
    alignSelf: 'flex-end',
  },
  
});
