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
import {IColors, getColors} from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';
import commonStyles from '../../utils/common-styles';

type InputProps = {
  control: Control<any>;
  name: string;
  label: string;
  pattern?: ValidationRule<RegExp> | undefined;
  validate?:
    | Validate<any, FieldValues>
    | Record<string, Validate<any, FieldValues>>
    | undefined;
  error?: FieldErrors<FieldValues>;
  required?: string | ValidationRule<boolean> | undefined;
  inputProps?: TextInputProps;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  inputBgColor?: string;
  keyboardType?: string | any;
};

const InputPassword: React.FC<InputProps> = props => {
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
    style,
    inputBgColor,
    keyboardType,
  } = props;
  const colors = getColors();
  const styles = getStyles(colors);
  const [showPassword, setShowPassword] = React.useState(false);
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
      render={({field: {onChange, value, onBlur}}) => (
        <View style={containerStyle}>
          <Text style={styles.label}>{label}</Text>
          <View
            style={[
              styles.container,
              style,
              {
                backgroundColor: inputBgColor
                  ? inputBgColor
                  : colors.background,
              },
            ]}>
            <TextInput
              style={styles.input}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholderTextColor={colors.placeholder}
              {...inputProps}
              secureTextEntry={!showPassword}
              keyboardType={keyboardType}
            />
            {/* <VIcons
              iconType="Feather"
              name={!showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={colors.placeholder}
              onPress={() => setShowPassword(!showPassword)}
            /> */}
          </View>
          <Text style={commonStyles.error} numberOfLines={3}>
            {err}
          </Text>
        </View>
      )}
    />
  );
};

export default InputPassword;

const getStyles = (colors: IColors) =>
  StyleSheet.create({
    label: {
      fontWeight: '500',
      fontSize: 14,
      fontFamily: fonts.medium,
      color: colors.label,
    },
    container: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      height: 50,
      alignItems: 'center',
      marginTop: 10,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 25,
    },
    input: {
      fontSize: 16,
      height: 48,
      flex: 1,
      color: colors.text,
      fontFamily: fonts.regular,
      alignItems: 'center',
    },
  });
