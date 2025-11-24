import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
  TextStyle,
} from 'react-native';
import {
  Controller,
  Control,
  ValidationRule,
  Validate,
  FieldValues,
  FieldErrors,
} from 'react-hook-form';
import { IColors, getColors } from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';
import { fontSizes } from '../../utils/utils';
import IconsSvg from '../../assets/svg/iconsSvg';

type InputProps = {
  control: Control<any>;
  name: string;
  label?: string;
  pattern?: ValidationRule<RegExp> | undefined;
  validate?:
    | Validate<any, FieldValues>
    | Record<string, Validate<any, FieldValues>>
    | undefined;
  error?: FieldErrors<FieldValues>;
  required?: string | ValidationRule<boolean> | undefined;
  inputProps?: TextInputProps;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  labelStyle?: string;
  inputBgColor?: string;
  keyboardType?: string | any;
  rightIconName?: string | any;
  maxLength?: number;
  disabled?: boolean;
  multiline?: boolean;
  isPassword?: boolean;
  isRightIcon?: boolean;
  onValueChange?: (text: string) => void; 
  textStyle?: boolean;
};

const Input: React.FC<InputProps> = props => {
  const {
    control,
    name,
    label,
    pattern,
    validate,
    error,
    required,
    inputProps,
    containerStyle,
    inputContainerStyle,
    inputStyle,
    labelStyle,
    inputBgColor,
    keyboardType,
    rightIconName,
    maxLength,
    multiline = false,
    disabled = false,
    isPassword = false,
    isRightIcon = false,
    onValueChange, 
    textStyle
  } = props;

  const [showText, setShowText] = useState(!isPassword);
  const colors = getColors();
  const styles = getStyles(colors, multiline);

  const toggleShowText = () => {
    setShowText(!showText);
  };

  const err =
    error &&
    Object.keys(error).length !== 0 &&
    error[name] &&
    error[name]?.message
      ? error[name]?.message?.toString()
      : '';
      const renderRightIcon = isRightIcon && (
        <IconsSvg name={rightIconName} style={styles.rightIconStyle} />
      );
  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required,
        pattern: pattern,
        validate: validate,
      }}
      render={({ field: { onChange, value, onBlur } }) => (
        <View style={[styles.container, containerStyle]}>
          {label && (
            <Text
              style={[
                styles.label,
                { color: labelStyle ? labelStyle : colors.label },
              ]}
            >
              {label}
            </Text>
          )}

          <View style={[styles.inputContainer, inputContainerStyle]}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: inputBgColor ? inputBgColor : colors.white,
                  paddingRight: isPassword ? 50 : isRightIcon ? 50 : 16,
                  color: textStyle ? colors.white : colors.primaryBlack,
                },
                inputStyle,
              ]}
              value={value}
              onBlur={onBlur}
              onChangeText={(text: string) => {
                onChange(text); // form state update
                onValueChange?.(text); // ✅ custom handler from parent
              }}
              placeholderTextColor={colors.primaryBlack }
              {...inputProps}
              keyboardType={keyboardType ? keyboardType : 'default'}
              maxLength={maxLength}
              multiline={multiline}
              editable={!disabled}
              returnKeyType="done"
              secureTextEntry={isPassword && !showText}
            />

            {isPassword && (
              <TouchableOpacity
                style={styles.iconView}
                onPress={toggleShowText}
                activeOpacity={0.7}
              >
                <IconsSvg name={showText ? 'eye' : 'eyeOff'} />
              </TouchableOpacity>
            )}

            {isRightIcon && rightIconName && (
              <View style={styles.rightIconView}>
                <IconsSvg name={rightIconName} style={styles.rightIconStyle} />
              </View>
            )}
          </View>

          {err && (
            <Text style={styles.error} numberOfLines={2}>
              {err}
            </Text>
          )}
        </View>
      )}
    />
  );
};

export default Input;

const getStyles = (colors: IColors, multiline: boolean) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    label: {
      fontWeight: '500',
      fontSize: fontSizes.small,
      fontFamily: fonts.medium,
      color: colors.label,
    },
    inputContainer: {
      position: 'relative',
      marginTop: 10,
    },
    input: {
      fontSize: fontSizes.regular,
      height: 53,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 160,
     
      fontFamily: fonts.medium,
      width: '100%',
    },
    iconView: {
      position: 'absolute',
      right: 16,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      width: 40,
      height: 53,
    },
    rightIconView: {
      position: 'absolute',
      right: 16,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      width: 40,
      height: 53,
    },
    error: {
      color: 'red',
      fontSize: 14,
      minHeight: 12,
      marginVertical: 5,
    },
    rightIconStyle: {
      alignSelf: 'center',
      marginEnd: 10,
    },
  });
