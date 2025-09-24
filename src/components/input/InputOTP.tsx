import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  Keyboard,
} from 'react-native';
import React, { useMemo, useRef } from 'react';
import OTPTextInput from 'react-native-otp-textinput';
import colors, { IColors } from '../../utils/colors';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Validate,
  ValidationRule,
} from 'react-hook-form';
import fonts from '../../assets/fonts/fonts';
import { Platform, useWindowDimensions } from 'react-native';

type InputProps = {
  control: Control<any>;
  name: string;
  label: string;
  required?: string | ValidationRule<boolean> | undefined;
  containerStyle?: StyleProp<ViewStyle>;
  error?: FieldErrors<FieldValues>;
  pattern?: ValidationRule<RegExp> | undefined;
  validate?:
    | Validate<any, FieldValues>
    | Record<string, Validate<any, FieldValues>>
    | undefined;
  style?: StyleProp<ViewStyle>;
  forwardedRef?: React.RefObject<OTPTextInput>;
  ref?: any;
  horizontalPadding?: number; // total horizontal padding of the parent container
};

const InputOtp = (props: InputProps) => {
  const {
    control,
    name,
    label,
    required,
    containerStyle,
    error,
    pattern,
    validate,
    forwardedRef,
    ref,
    horizontalPadding,
  } = props;
  const styles = getStyles(colors);
  const err =
    error &&
    Object.keys(error).length !== 0 &&
    error[name] &&
    error[name]?.message
      ? error[name]?.message?.toString()
      : '';

  let otpInputRef = useRef<OTPTextInput>(null);

  const { width: windowWidth } = useWindowDimensions();
  const inputCount = 6;
  // Default assumes parent uses paddingHorizontal: 24 → total 48
  const horizontalScreenPadding = typeof horizontalPadding === 'number' ? horizontalPadding : 48;
  const spacingBetweenInputs = 10; // consistent spacing

  const { otpItemWidth, otpItemHeight, otpItemMargin } = useMemo(() => {
    const availableWidth = Math.max(
      0,
      windowWidth - horizontalScreenPadding - (inputCount - 1) * spacingBetweenInputs,
    );
    // Bound width between 40 and 56 for usability
    const calculatedWidth = Math.min(56, Math.max(40, Math.floor(availableWidth / inputCount)));
    // Slightly taller on Android for visual balance
    const height = Platform.select({ ios: calculatedWidth, android: calculatedWidth + 4, default: calculatedWidth });
    return {
      otpItemWidth: calculatedWidth,
      otpItemHeight: height as number,
      otpItemMargin: spacingBetweenInputs / 2,
    };
  }, [windowWidth]);

  const otpTextInputStyle = useMemo(() => {
    return StyleSheet.flatten([
      styles.otpInput,
      { width: otpItemWidth, height: otpItemHeight, marginHorizontal: otpItemMargin },
    ]) as any;
  }, [otpItemWidth, otpItemHeight, otpItemMargin]);

  const clearText = () => {
    if (otpInputRef.current) {
      otpInputRef.current.clear();
    }
  };

  React.useImperativeHandle(forwardedRef || ref, () => ({
    clearText,
  }));

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required,
        pattern: pattern,
        validate: validate,
      }}
      render={({ field: { onChange } }) => (
        <View style={[styles.mainView, containerStyle]}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.otpContainer}>
            <OTPTextInput
              ref={otpInputRef}
              inputCount={inputCount}
              tintColor={colors.primary || '#268740'}
              offTintColor={colors.border || '#E5E5E5'}
              handleTextChange={text => {
                onChange(text);
                if (text.length === inputCount) {
                  Keyboard.dismiss();
                }
              }}
              textInputStyle={otpTextInputStyle}
              containerStyle={styles.otpTextContainer}
            />
          </View>
          {err ? (
            <Text style={styles.error} numberOfLines={2}>
              {err}
            </Text>
          ) : null}
        </View>
      )}
    />
  );
};

export default InputOtp;

const getStyles = (colors: IColors) =>
  StyleSheet.create({
    mainView: {
      marginVertical: 20,
    },
    label: {
      fontSize: 12,
      fontFamily: fonts.regular,
      color: colors.text,
      lineHeight: 16.8,
      marginBottom: 8,
    },
    otpContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
    },
    otpTextContainer: {
      // flexDirection: 'row',
      // justifyContent: 'center',
      // alignItems: 'center',
    },
    otpInput: {
      width: 45,
      height: 45,
      borderRadius: 150,
      borderWidth: 0.1,
      borderColor: colors.white,
      borderBottomWidth: 0.1,
      marginHorizontal: 6.5,
      fontFamily: fonts.bold,
      fontSize: 14,
      color: colors.primaryBlack || '#000000',
      backgroundColor: '#FFFFFF',
      textAlign: 'center',
    },
    error: {
      color: '#FF0000',
      fontSize: 12,
      marginTop: 8,
      textAlign: 'center',
      fontFamily: fonts.regular,
    },
  });
