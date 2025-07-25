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
  FieldValues,
} from 'react-hook-form';
import {Dropdown} from 'react-native-element-dropdown';
import fonts from '../../assets/fonts/fonts';
import IconsSvg from '../../assets/svg/iconsSvg';
import colors from '../../utils/colors';
import commonStyles from '../../utils/common-styles';

export interface DropDownTypes {
  id: string;
  name: string;
}

type InputProps = {
  control: Control<any>;
  name: string;
  label?: string;
  error?: FieldErrors<FieldValues>;
  required?: string | ValidationRule<boolean> | undefined;
  containerStyle?: StyleProp<ViewStyle>;
  options?: DropDownTypes[];
  isSearch?: boolean;
  isDisable?: boolean;
  placeholder?: string;
  data?: DropDownTypes[];
  valueField?: string;
  labelField?: string;
  value?: any;
  onChangeValue?: (value: any) => void;
};

const DropdownInputs: React.FC<InputProps> = props => {
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
    valueField = 'id',
    labelField = 'name',
    value,
    onChangeValue,
  } = props;

  const err =
    error && Object.keys(error).length !== 0 && error[name]
      ? error[name]?.message?.toString()
      : '';

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
            activeColor={colors.white}
            renderLeftIcon={() =>
              I18nManager.isRTL ? <IconsSvg name="downArrow" /> : <></>
            }
            renderRightIcon={() =>
              !I18nManager.isRTL ? <IconsSvg name="downArrow" /> : <></>
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
        </View>
      )}
    />
  );
};

export default DropdownInputs;

const styles = StyleSheet.create({
  label: {
    fontWeight: '500',
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.label,
  },
  container: {},
  dropdownContainerStyle: {
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  dropDownContainer: {
    backgroundColor: colors.white,
    height: 48,
    borderRadius: 160,
    marginTop: 10,
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
  },
  placeholderStyle: {
    fontSize: 14,
    color: colors.primaryBlack,
    fontFamily: fonts.medium,
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