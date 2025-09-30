import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import Input from './input';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';
import { fontSizes } from '../../utils/utils';
import { useWatch } from 'react-hook-form';

type InputProps = {
  control: any;
  name: string;
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  inputProps?: any;
  error?: any;
  onApply?: (code: string) => void; // Callback for when Apply is clicked
};

const ApplyOfferInput: React.FC<InputProps> = props => {
  const {
    control,
    name,
    label,
    containerStyle,
    inputStyle,
    inputProps,
    error,
    onApply,
  } = props;

  const styles = getStyles();
  const currentValue = useWatch({ control, name });
  const isDisabled = !currentValue || String(currentValue).trim().length === 0;

  const handleApplyClick = () => {
    const value = control._formValues?.[name] || '';
    if (onApply) {
      onApply(value);
    }
  };

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <Input
            control={control}
            name={name}
            label={undefined} // Don't show label here since we're showing it above
            containerStyle={styles.inputInnerContainer}
            inputStyle={[inputStyle, styles.inputWithApplyText]}
            inputProps={{
              ...inputProps,
              placeholder: inputProps?.placeholder || 'Enter discount code',
            }}
            error={error}
          />
        </View>
        <TouchableOpacity 
          style={[
            styles.applyButtonContainer,
            isDisabled && styles.applyButtonDisabled,
          ]}
          onPress={handleApplyClick}
          disabled={isDisabled}
        >
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ApplyOfferInput;

const getStyles = () =>
  StyleSheet.create({
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.white,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginTop: 10,
    },
    inputContainer: {
      flex: 1,
      marginRight: 10,
      marginTop: -8,
    },
    inputInnerContainer: {
      marginTop: 0,
      borderWidth: 0,
    },
    inputWithApplyText: {
      borderWidth: 0,
      backgroundColor: 'transparent',
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    applyButtonContainer: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
      minWidth: 60,
      alignItems: 'center',
      justifyContent: 'center',
    },
    applyButtonDisabled: {
      backgroundColor: '#C8E6C9',
      opacity: 0.7,
    },
    applyText: {
      color: colors.white,
      fontSize: fontSizes.small,
      fontFamily: fonts.bold,
    },
    label: {
      fontSize: fontSizes.small,
      fontFamily: fonts.regular,
      marginBottom: 4,
    },
  });
