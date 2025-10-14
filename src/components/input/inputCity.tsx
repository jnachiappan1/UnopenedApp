import React, { useEffect, useRef, useState } from 'react';
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
import { getCityAction, getStateAction } from '../../utils/apiAction';
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
  country: string | undefined;
  state: string | undefined;
  stateCode?: string | undefined;
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
  country,
  state,
  stateCode,
  isShowError = true,
}) => {
  const colors = getColors();

  const searchInputRef = useRef<TextInput | null>(null);
  const [showList, setShowList] = useState(false);
  const [searchText, setSearchText] = useState('');
  const styles = getStyles(colors);
  // Query to get state name from state code
  const {
    data: stateData,
  } = useInfiniteQuery<any, Error, InfiniteData<any>, string[], number>({
    queryKey: ['getStateAction', '', country as string],
    queryFn: ({ pageParam }) =>
      getStateAction({
        page: pageParam,
        limit: 100,
        search: '',
        country: country as string,
      }),
    initialPageParam: 1,
    enabled: Boolean(country) && Boolean(stateCode),
    getNextPageParam: lastPage => {
      if (lastPage?.data?.hasNext) {
        return lastPage.data.currentPage + 1;
      }
      return undefined;
    },
  });

  // Get state name from state code
  const allStates = (stateData?.pages.flatMap(page => page.data || []) || []);
  const selectedState = allStates.find(state => state.state_code === stateCode);
  const stateName = selectedState?.name || state;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<any, Error, InfiniteData<any>, string[], number>({
    queryKey: ['getCityAction', searchText, country, stateName],
    queryFn: ({ pageParam }) =>
      getCityAction({
        page: pageParam,
        limit: 30,
        search: searchText,
        country: country as string,
        state: stateName as string,
      }),
    initialPageParam: 1,
    enabled: Boolean(country) && Boolean(stateName),
    getNextPageParam: lastPage => {
      if (lastPage?.data?.hasNext) {
        return lastPage.data.currentPage + 1;
      }
      return undefined;
    },
  });
 
  useEffect(() => {
    refetch();
  }, [refetch, searchText, country, stateName]);

  const allCities = (data?.pages.flatMap(page => page.data || []) || []).map(
    (city, index) => ({
      id: index + 1,
      name: city,
    })
  );

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
            disabled={isLoading || (!country && !stateName)}
          >
           <View style={styles.view}>
              {isLoading && country && stateName ? (
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