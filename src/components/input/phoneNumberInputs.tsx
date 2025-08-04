import React, {useState} from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  KeyboardTypeOptions,
  ColorValue,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import {
  Controller,
  Control,
  ValidationRule,
  Validate,
  FieldValues,
  FieldErrors,
} from 'react-hook-form';
import CountryPicker, {Country} from 'react-native-country-picker-modal';
import fonts from '../../assets/fonts/fonts';
import parsePhoneNumberFromString from 'libphonenumber-js';
import IconsSvg from '../../assets/svg/iconsSvg';
import colors from '../../utils/colors';
import { fontSizes } from '../../utils/utils';


type InputProps = {
  country?: string;
  control: Control<any>;
  name: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  placeholderTextColor?: ColorValue | undefined;
  pattern?: ValidationRule<RegExp> | undefined;
  style?: StyleProp<ViewStyle>;
  multiline?: boolean;
  validate?:
    | Validate<any, FieldValues>
    | Record<string, Validate<any, FieldValues>>
    | undefined;
  error?: FieldErrors<FieldValues>;
  required?: string | ValidationRule<boolean> | undefined;
  isDate?: boolean | undefined;
  disabled?: boolean | undefined;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
  containerStyle?: StyleProp<ViewStyle>;
  maxLength?: number | undefined;
  setPhoneCountry?: any;
  selectedCountry?: Country | null | undefined | any;
  selectionColor?: any;
  label?: string;
  value?: any;
  onChangeText?: any;
  onBlur?: any;
  onInputChange?: (value: string) => void;
};

const PhoneNumberInputs: React.FC<InputProps> = ({
  control,
  name,
  placeholder = '',
  keyboardType = 'default',
  error,
  required = '',
  disabled = false,
  label = '',
  multiline = false,
  containerStyle,
  maxLength,
  setPhoneCountry,
  selectedCountry,
  selectionColor = '#2D2245',
  onInputChange
}) => {
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const err =
    error &&
    Object.keys(error).length !== 0 &&
    error[name] &&
    error[name]?.message
      ? error[name]?.message?.toString()
      : '';
  const countryCode = selectedCountry?.callingCode
    ? `+${selectedCountry.callingCode[0]}`
    : '';

  const validatePhoneNumber = (phoneNumber: string) => {
    const parsedPhoneNumber = parsePhoneNumberFromString(
      phoneNumber,
      selectedCountry?.cca2,
    );
    if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
      // setPhoneError(
      //   `Invalid phone number for country code ${selectedCountry?.cca2}`,
      // );
      setPhoneError(
        `${'Invalid phone number for country code'} ${selectedCountry?.cca2}`
      );
      return false;
    }
    const expectedLength = parsedPhoneNumber.nationalNumber.length;
    const lengthWithoutCountryCode = phoneNumber.length;
    if (lengthWithoutCountryCode !== expectedLength) {
      // setPhoneError(
      //   `Invalid phone number for country code ${selectedCountry?.cca2}`,
      // );
      setPhoneError(
        `${'Invalid phone number for country code'} ${selectedCountry?.cca2}`
      );
      return false;
    }
    setPhoneError(null);
    return true;
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required,
        validate: value => {
          return validatePhoneNumber(value);
        },
      }}
      render={({field: {onChange, value, onBlur}}) => (
        <View style={[styles.container, containerStyle]}>
          {label && <Text style={styles.label}>{label}</Text>}
          
          <View style={[styles.input, containerStyle]}>
          {I18nManager.isRTL === false && <TouchableOpacity
              activeOpacity={0.2}
              onPress={() => setShowCountryPicker(true)}
              style={{width: '20%'}}>
              <View style={styles.imgInnerViewSty}>
                <Text style={{color: 'black'}}>{countryCode}</Text>
                <IconsSvg name="dropDown" style={styles.arrowDownImage} />
              </View>
            </TouchableOpacity>}
            <TextInput
              style={styles.phoneInputStyle}
              placeholder={placeholder}
              returnKeyLabel="Done"
              returnKeyType="done"
              keyboardType={keyboardType}
              placeholderTextColor={colors.black}
              selectionColor={selectionColor ? 'transparent' : '#2D2245'}
              value={value}
              onBlur={onBlur}
              // onChangeText={text => {
              //   onChange(text);
              //   validatePhoneNumber(text);
              // }}
              onChangeText={text => {
                onChange(text);
                validatePhoneNumber(text);
                if (onInputChange) {
                  onInputChange(text);
                }
              }}
              secureTextEntry={false}
              editable={!disabled}
              selectTextOnFocus={!disabled}
              multiline={multiline}
              maxLength={maxLength}
              numberOfLines={1}
            />
            {I18nManager.isRTL && <TouchableOpacity
              activeOpacity={0.2}
              onPress={() => setShowCountryPicker(true)}
              style={{width: '20%'}}>
              <View style={styles.imgInnerViewSty}>
                <Text style={{color: 'black'}}>{countryCode}</Text>
                <IconsSvg name="dropDown" style={styles.arrowDownImage} />
              </View>
            </TouchableOpacity>}
            
          </View>

          <Text style={styles.error} numberOfLines={2}>
            {err ? err : phoneError}
          </Text>
          {showCountryPicker && (
            <CountryPicker
              visible={showCountryPicker}
              withFilter
              withFlag={true}
              withCallingCode
              withEmoji
              withCountryNameButton={false}
              withCallingCodeButton
              withFlagButton
              theme={{
                onBackgroundTextColor: colors.black,
                backgroundColor: colors.background,
              }}
              onSelect={country => {
                setPhoneCountry(country);
              }}
              countryCode={selectedCountry ? selectedCountry?.cca2 : 'IN'}
              onClose={() => setShowCountryPicker(false)}
            />
          )}
        </View>
      )}
    />
  );
};

export default PhoneNumberInputs;

const styles = StyleSheet.create({
  arrowDownImage: {
    height: 24,
    width: 24,
    alignSelf: 'center',
  },
  container: {
    // width: '100%',
    height:"7%",
    marginTop:15
  },
  imgSty: {
    height: 18,
    width: 24,
    alignSelf: 'center',
    marginLeft: 12,
  },
  imgInnerViewSty: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  inputSty: {
    color: colors.secondary,
    fontSize: 17,
  },
  label: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.label,
    paddingHorizontal: 11,
    textAlign: 'left',
  },
  input: {
    height: 53,
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    fontSize: fontSizes.regular,
    color: colors.placeholder,
    fontFamily: fonts.medium,
    borderRadius: 160,
    //  borderColor: colors.border,
    // borderWidth: 1,
    // borderColor: colors.gray,
    
  },
  phoneInputStyle: {
    width: '80%',
    fontSize: fontSizes.regular,
    color: colors.black,
    fontFamily: fonts.medium,
    padding: 10,
    borderRadius: 16,
  },
  error: {
    marginTop: 5,
    fontSize: fontSizes.regular,
    color: 'red',
    fontFamily: fonts.medium,
    textAlign: 'left',
  },
});
