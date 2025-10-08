// components/PrivacyTermsCheckbox.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Linking,
} from 'react-native';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';
import {fontSizes} from '../../utils/utils';
import IconsSvg from '../../assets/svg/iconsSvg';

interface PrivacyTermsCheckboxProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  containerStyle?: StyleProp<ViewStyle>;
  onPrivacyPress?: () => void;
  onTermsPress?: () => void;
}

const PrivacyTermsCheckbox: React.FC<PrivacyTermsCheckboxProps> = ({
  value,
  onValueChange,
  containerStyle,
  onPrivacyPress,
  onTermsPress,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.checkIcon}
        onPress={() => onValueChange(!value)}>
        <IconsSvg name={value ? 'checkBoxSelected' : 'checkBox'} />
      </TouchableOpacity>
      <Text style={styles.text}>
        I agree{' '}
        <Text style={styles.link} onPress={onPrivacyPress}>
          Privacy policy
        </Text>{' '}
        &{' '}
        <Text style={styles.link} onPress={onTermsPress}>
          Terms & Conditions
        </Text>
        .
      </Text>
    </View>
  );
};
export default PrivacyTermsCheckbox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingVertical: 8,
    justifyContent: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#999',
    borderRadius: 4,
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    borderColor: colors.primary,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  checkIcon: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    flexWrap: 'wrap',
    fontSize: fontSizes.small,
    color: '#333',
    fontFamily: fonts.medium,
    alignSelf: 'center',
    marginStart: 10,
  },
  link: {
    color: colors.primary,
    textDecorationLine: 'underline',
    fontFamily: fonts.medium,
  },
});
