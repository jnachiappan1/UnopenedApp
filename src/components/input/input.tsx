import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextInputProps,
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
  labelStyle?: string;
  inputBgColor?: string;
  keyboardType?: string | any;
  maxLength?: number;
  disabled?: boolean;
  multiline?: boolean;
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
    inputStyle,
    labelStyle,
    inputBgColor,
    keyboardType,
    maxLength,
    multiline = false,
    disabled = false,
  } = props;

  const colors = getColors();
  const styles = getStyles(colors, multiline);
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
        <View
          style={[styles.container, containerStyle, ]}
        >
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
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: inputBgColor ? inputBgColor : colors.white,
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
          />
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
      fontSize: 12,
      fontFamily: fonts.medium,
      color: colors.label,
    },
    input: {
      fontSize: 14,
      height: 53,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 160,
      color: colors.primaryBlack,
      fontFamily: fonts.medium,
      alignItems: 'center',
      marginTop: 10,
      width: '100%',
    },
    error: {
      color: 'red',
      fontSize: 14,
      minHeight: 12,
      marginVertical: 5,
    },
  });
