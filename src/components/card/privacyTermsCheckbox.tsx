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
import { fontSizes } from '../../utils/utils';

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
        style={[styles.checkbox, value && styles.checkboxChecked]}
        activeOpacity={0.7}
        onPress={() => onValueChange(!value)}>
        {value && <Text style={styles.checkIcon}>✓</Text>}
      </TouchableOpacity>
      <Text style={styles.text}>
        I agree{' '}
        <Text
          style={styles.link}
          onPress={onPrivacyPress}>
          Privacy policy
        </Text>{' '}
        &{' '}
        <Text
          style={styles.link}
          onPress={onTermsPress}>
          Terms & Conditions
        </Text>.
      </Text>
    </View>
  );
};
export default PrivacyTermsCheckbox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#999',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    borderColor: colors.primary,
  },
  checkIcon: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: fonts.medium,
    lineHeight: 18,
  },
  text: {
    flex: 1,
    flexWrap: 'wrap',
    fontSize: fontSizes.small,
    color: '#333',
    fontFamily: fonts.medium,
  },
  link: {
    color: colors.primary,
    textDecorationLine: 'underline',
    fontFamily: fonts.medium,
  },
});
