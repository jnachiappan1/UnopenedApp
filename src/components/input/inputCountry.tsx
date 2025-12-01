import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Validate,
  ValidationRule,
} from 'react-hook-form';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { getColors, IColors } from '../../utils/colors';
import { getCountriesAction } from '../../utils/apiAction';
import IconsSvg from '../../assets/svg/iconsSvg';
import commonStyles from '../../utils/common-styles';
import Header from './header';


type IInputCountryProps = {
  control: Control<any>;
  name: string;
  placeholder: string;
  label?: string;
  labelColor?: string;
  error?: FieldErrors<FieldValues>;
  required?: string | ValidationRule<boolean>;
  pattern?: ValidationRule<RegExp>;
  validate?:
  | Validate<any, FieldValues>
  | Record<string, Validate<any, FieldValues>>;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  isShowError?: boolean;
  disabled?: boolean
};

export interface ICountry {
  id: string | number;
  iso2: string;
  currency: string;
  dialCode: string;
  flag: string;
  name: string;
  unicodeFlag: string;
}

const InputCountry: React.FC<IInputCountryProps> = ({
  control,
  name,
  placeholder,
  label,
  labelColor,
  containerStyle,
  style,
  error,
  required,
  pattern,
  validate,
  isShowError = true,
  disabled
}) => {
  const colors = getColors();
  const searchInputRef = useRef<TextInput | null>(null);
  const [showList, setShowList] = useState(false);
  const [searchText, setSearchText] = useState('');
  const styles = getStyles(colors);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<any, Error, InfiniteData<any>, string[], number>({
    queryKey: ['getCountriesAction', searchText],
    queryFn: ({ pageParam }) =>
      getCountriesAction({ page: pageParam, limit: 100, search: searchText }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage?.data?.hasNext) {
        return lastPage.data.currentPage + 1;
      }
      return undefined;
    },
  });

const allCountries = useMemo(() => {
  return data?.pages.flatMap((page) => {
    return page?.data?.data || page?.data || [];
  }) || [];
}, [data]);

  const getError = useMemo(() => {
    return error?.[name]?.message?.toString() || '';
  }, [error, name]);

  const onClose = () => {
    setShowList(false);
    setSearchText('');
  };

  const handleSelectCountry = (
    onChange: (val: any) => void,
    country: ICountry
  ) => {
    onChange(country?.iso2);
    onClose();
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required, pattern, validate }}
      render={({ field: { onChange, value } }) => (
        <View style={[commonStyles.mainContainer, containerStyle]}>
          {label && (
            <Text style={[{ color: labelColor || colors.label }]}>
              {label}
            </Text>
          )}

          <TouchableOpacity
            style={[commonStyles.inputWrapper, style]}
            onPress={() => setShowList(true)}
            disabled={disabled}
            activeOpacity={0.7}>
            <View style={styles.view}>
              {isLoading ? (
                <ActivityIndicator size="small" />
              ) : value ? (
                <Text style={commonStyles.valueText} numberOfLines={1}>
                  {allCountries.find(country => country.iso2 === value)?.name || value}
                </Text>
              ) : (
                <Text style={commonStyles.placeholder}>{placeholder}</Text>
              )}
            </View>
            {value ? (
              <IconsSvg name="close" onPress={() => onChange(null)} />
            ) : (
              <IconsSvg name="downArrow" onPress={() => onChange(null)} />
            )}
          </TouchableOpacity>

          {isShowError && !!getError && (
            <Text style={commonStyles.error} numberOfLines={2}>
              {getError}
            </Text>
          )}

          <Modal visible={showList} animationType="slide" onRequestClose={onClose}>
            <View style={commonStyles.modalContainer}>
              <Header
                hideBack
                closeButton
                title="Select Country"
                onBackPress={onClose}
              />
              <View style={commonStyles.searchContainer}>
                <TextInput
                  ref={searchInputRef}
                  style={commonStyles.searchInput}
                  placeholder="Search Country"
                  placeholderTextColor={colors.placeholder}
                  onChangeText={setSearchText}
                  value={searchText}
                  autoFocus
                />
              </View>

              <FlatList
                data={allCountries}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                  <Text
                    style={commonStyles.countryItem}
                    onPress={() => handleSelectCountry(onChange, item)}>
                    {item.name}
                  </Text>
                )}
                contentContainerStyle={commonStyles.flatListContent}
                keyboardShouldPersistTaps="handled"
                onEndReached={() => {
                  if (hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                  }
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                  isFetchingNextPage ? (
                    <ActivityIndicator style={{ marginVertical: 10 }} />
                  ) : null
                }
                ListEmptyComponent={<Text>No countries found</Text>}
              />
            </View>
          </Modal>
        </View>
      )}
    />
  );
};

export default InputCountry;

const getStyles = (colors: IColors) =>
  StyleSheet.create({
   view: {
      width: '90%',
      height: 48,
      paddingHorizontal: 10,
      paddingVertical: 12,
    }
  });
