/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  I18nManager,
} from 'react-native';
import {
  Controller,
  Control,
  FieldErrors,
  ValidationRule,
  FieldError,
} from 'react-hook-form';
import {Dropdown} from 'react-native-element-dropdown';
import fonts from '../../assets/fonts/fonts';
import IconsSvg from '../../assets/svg/iconsSvg';
import colors from '../../utils/colors';
import commonStyles from '../../utils/common-styles';

export interface DropDownType {
  _id: string;
  type: string;
  name: string;
  value: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type InputProps = {
  control: Control<any>;
  name: string;
  label?: string;
  //error?: FieldErrors;
  error?: FieldError | FieldErrors | undefined;
  required?: string | ValidationRule<boolean> | undefined;
  containerStyle?: StyleProp<ViewStyle>;
  options?: DropDownType[]; // Add options prop for dropdown
  isSearch?: boolean;
  isDisable?: boolean;
  placeholder?: string;
  data?: any[];
  valueField?: string;
  labelField?: string;
  value?: any;
  onChangeValue?: (value: any) => void;
};

const DropdownInput: React.FC<InputProps> = props => {
  const {
    control,
    name,
    error,
    isSearch = false,
    isDisable = false,
    required,
    containerStyle,
    label,
    placeholder = '',
    data = [],
    valueField = '',
    labelField = '',
    value,
    onChangeValue,
  } = props;

  const err =
    error && Object.keys(error).length !== 0 && error[name]
      ? error[name]?.message?.toString()
      : '';
  // const err = error?.message || '';

  const productErr =
    error && 'message' in error && typeof error.message === 'string'
      ? error.message
      : '';

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required,
      }}
      render={({field: {onChange}}) => (
        <View style={[styles.container, containerStyle]}>
          <Text style={styles.label}>{label}</Text>
          <Dropdown
            style={styles.dropDownContainer}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            itemTextStyle={styles.itemTextStyle}
            data={data}
            search={isSearch}
            maxHeight={300}
            value={value}
            labelField={labelField}
            valueField={valueField}
            disable={isDisable}
            searchPlaceholder="Search..."
            placeholder={placeholder}
            onChange={item => {
              onChange(item);
              onChangeValue && onChangeValue(item);
            }}
            containerStyle={styles.dropdownContainerStyle}
            activeColor={colors.secondary}
            renderLeftIcon={() =>
              I18nManager.isRTL ? (
                <IconsSvg name="downArrow"  />
              ) : (
                <></>
              )
            }
            renderRightIcon={() =>
              !I18nManager.isRTL ? (
                <IconsSvg name="downArrow"  />
              ) : (
                <></>
              )
            }
          />

          {productErr ? (
            <Text style={commonStyles.error} numberOfLines={2}>
              {productErr}
            </Text>
          ) : err ? (
            <Text style={commonStyles.error} numberOfLines={2}>
              {err?.toString()}
            </Text>
          ) : null}
          {/* <Text style={commonStyles.error} numberOfLines={2}>
            {err}
          </Text> */}
        </View>
      )}
    />
  );
};

export default DropdownInput;

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.label,
    textAlign: 'left',
  },
  container: {},
  dropdownContainerStyle: {
    borderRadius: 10,
    backgroundColor: colors.secondary,
    borderColor: colors.border,
  },
  dropDownContainer: {
    backgroundColor: colors.secondary,
    height: 48,
    borderRadius: 8,
    marginTop: 5,
    borderWidth: 1,
    borderColor: colors.darkGray,
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.placeholder,
    textAlign: 'left',
  },
  selectedTextStyle: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.primaryBlack,
    textAlign: 'left',
  },
  itemTextStyle: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.primaryBlack,
    textAlign: 'left',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 50,
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.primaryBlack,
    borderRadius: 5,
  },
});
