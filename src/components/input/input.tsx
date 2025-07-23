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
  maxLength?: number;
  disabled?: boolean;
  multiline?: boolean;
  isPassword?: boolean;
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
    maxLength,
    multiline = false,
    disabled = false,
    isPassword = false,
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
                  paddingRight: isPassword ? 50 : 16, // Add padding for eye icon
                },
                inputStyle,
              ]}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholderTextColor={colors.primaryBlack}
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
      position: 'relative', // Add relative positioning for absolute icon
      marginTop: 10,
    },
    input: {
      fontSize: fontSizes.regular,
      height: 53,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 160,
      color: colors.primaryBlack,
      fontFamily: fonts.medium,
      width: '100%',
    },
    iconView: {
      position: 'absolute', // Position absolutely within inputContainer
      right: 16, // Position from right edge
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      width: 40,
      height: 53, // Match input height
      // backgroundColor: 'red', // Remove this debug background
    },
    error: {
      color: 'red',
      fontSize: 14,
      minHeight: 12,
      marginVertical: 5,
    },
  });