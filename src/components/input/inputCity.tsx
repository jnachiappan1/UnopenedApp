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
} from 'react-native';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Validate,
  ValidationRule,
} from 'react-hook-form';
import { getColors, IColors } from '../../utils/colors';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { getCityAction } from '../../utils/apiAction';
import IconsSvg from '../../assets/svg/iconsSvg';
import Header from './header';
import commonStyles from '../../utils/common-styles';

type IInputCityProps = {
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
  containerStyle?: any;
  style?: any;
  state_id: string | number | undefined;
  isShowError?: boolean;
};

const InputCity: React.FC<IInputCityProps> = ({
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
  state_id,
  isShowError = true,
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
    queryKey: ['getCityAction', searchText, state_id as string],
    queryFn: ({ pageParam }) =>
      getCityAction({
        page: pageParam,
        limit: 30,
        search: searchText,
        state_id: state_id as string | number,
      }),
    initialPageParam: 1,
    enabled: Boolean(state_id),
    getNextPageParam: lastPage => {
      if (lastPage?.data?.hasNext) {
        return lastPage.data.currentPage + 1;
      }
      return undefined;
    },
  });

  const allCities = useMemo(() => {
    const cities = data?.pages.flatMap(page => page?.data?.data || page?.data || []) || [];
    // If cities are strings, convert to objects. If they're already objects, use them as is.
    return cities.map((city, index) => {
      if (typeof city === 'string') {
        return {
          id: index + 1,
          name: city,
        };
      }
      return city;
    });
  }, [data]);

  const errorMessage =
    error && error[name]?.message ? error[name]?.message.toString() : '';

  const onClose = () => {
    setShowList(false);
    setSearchText('');
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required, pattern, validate }}
      render={({ field: { onChange, value } }) => (
        <View style={[commonStyles.mainContainer, containerStyle]}>
          {label && (
            <Text style={{ color: labelColor || colors.label }}>
              {label}
            </Text>
          )}
          <TouchableOpacity
            style={[commonStyles.inputWrapper, style]}
            onPress={() => setShowList(true)}
            disabled={isLoading || !state_id}
          >
           <View style={styles.view}>
              {isLoading && state_id && !value ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : value ? (
                <Text style={commonStyles.valueText}>{value}</Text>
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
          {isShowError && !!errorMessage && (
            <Text style={commonStyles.error}>{errorMessage}</Text>
          )}

          <Modal visible={showList} animationType="slide" onRequestClose={onClose}>
            <View style={commonStyles.modalContainer}>
              <Header
                title="Select City"
                onBackPress={onClose}
                closeButton
                hideBack
              />
              <View style={commonStyles.searchContainer}>
                <TextInput
                  ref={searchInputRef}
                  style={commonStyles.searchInput}
                  placeholder="Search City"
                  placeholderTextColor={colors.placeholder}
                  value={searchText}
                  onChangeText={setSearchText}
                  autoFocus
                />
              </View>
              <FlatList
                data={allCities}
                keyExtractor={item => String(item.id)}
                renderItem={({ item }) => (
                  <Text
                    style={commonStyles.countryItem}
                    onPress={() => {
                      onChange(item.name);
                      onClose();
                    }}
                  >
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
                ListEmptyComponent={<Text style={commonStyles.noDataText}>No cities found</Text>}
              />
            </View>
          </Modal>
        </View>
      )}
    />
  );
};

export default InputCity;

const getStyles = (colors: IColors) =>
  StyleSheet.create({
   view: {
      width: '90%',
      height: 48,
      paddingHorizontal: 10,
      paddingVertical: 12,
    }
  });