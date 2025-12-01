import React, {useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Validate,
  ValidationRule,
} from 'react-hook-form';
import {getColors, IColors} from '../../utils/colors';
import {InfiniteData, useInfiniteQuery} from '@tanstack/react-query';
import { getStateAction } from '../../utils/apiAction';
import Header from './header';
import commonStyles from '../../utils/common-styles';
import IconsSvg from '../../assets/svg/iconsSvg';


type IInputStateProps = {
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
  country_id: string | number | undefined;
  isShowError?: boolean;
};

export interface IItem {
  id: string | number;
  name: string;
  state_code: string;
}

const InputState: React.FC<IInputStateProps> = ({
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
  country_id,
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
  } = useInfiniteQuery<
    any,
    Error,
    InfiniteData<any>,
    string[],
    number
  >({
    queryKey: ['getStateAction', searchText, country_id as string],
    queryFn: ({pageParam}) =>
      getStateAction({
        page: pageParam,
        limit: 30,
        search: searchText,
        country_id: country_id as string | number,
      }),
    initialPageParam: 1,
    enabled: Boolean(country_id),
    getNextPageParam: lastPage => {
      if (lastPage?.data?.hasNext) {
        return lastPage.data.currentPage + 1;
      }
      return undefined;
    },
  });

const allStates = useMemo(() => {
  return data?.pages.flatMap(page => page?.data?.data || page?.data || []) || [];
}, [data]);
  const getError = useMemo(() => {
    return error?.[name]?.message?.toString() || '';
  }, [error, name]);

  const onClose = () => {
    setShowList(false);
    setSearchText('');
  };

  const handleState = (onChange: (val: any) => void, item: IItem) => {
    onChange(item.name);
    onClose();
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{required, pattern, validate}}
      render={({field: {onChange, value}}) => {
        return (
          <View style={[commonStyles.mainContainer, containerStyle]}>
            {label && (
              <Text
                style={[
                  // globalStyles.titleHeader,
                  {color: labelColor || colors.label},
                ]}>
                {label}
              </Text>
            )}

            <TouchableOpacity
              style={[commonStyles.inputWrapper, style]}
              onPress={() => setShowList(true)}
              disabled={isLoading}
              activeOpacity={0.7}>
               <View style={styles.view}>
                {isLoading && country_id && !value ? (
                  <ActivityIndicator size="small" />
                ) : value ? (
                  <Text style={commonStyles.valueText} numberOfLines={1}>
                    {value}
                  </Text>
                ) : (
                  <Text style={commonStyles.placeholder}>{placeholder}</Text>
                )}
              </View>
              {value ? (
              <IconsSvg name='close' onPress={() => onChange(null)} />
            ) : (
              <IconsSvg name='downArrow' onPress={() => onChange(null)} />
            )}
            </TouchableOpacity>

            {isShowError && !!getError && (
              <Text style={commonStyles.error} numberOfLines={2}>
                {getError}
              </Text>
            )}

            <Modal
              visible={showList}
              animationType="slide"
              onRequestClose={onClose}>
              <View style={commonStyles.modalContainer}>
                <Header
                  hideBack
                  closeButton
                  title="Select State"
                  onBackPress={onClose}
                />
                <View style={commonStyles.searchContainer}>
                  <TextInput
                    ref={searchInputRef}
                    style={commonStyles.searchInput}
                    placeholder="Search State"
                    placeholderTextColor={colors.placeholder}
                    onChangeText={setSearchText}
                    value={searchText}
                    autoFocus={true}
                  />
                </View>
                <FlatList
                  data={allStates}
                  keyExtractor={item => String(item.id)}
                  renderItem={({item}) => (
                    <Text
                      style={commonStyles.countryItem}
                      onPress={() => handleState(onChange, item)}>
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
                      <ActivityIndicator style={{marginVertical: 10}} />
                    ) : null
                  }
                  ListEmptyComponent={
                    !country_id ? (
                      <Text style={commonStyles.noDataText}>Please select a country first</Text>
                    ) : (
                      <Text style={commonStyles.noDataText}>No states found</Text>
                    )
                  }
                />
              </View>
            </Modal>
          </View>
        );
      }}
    />
  );
};

export default InputState;
const getStyles = (colors: IColors) =>
  StyleSheet.create({
   view: {
      width: '90%',
      height: 48,
      paddingHorizontal: 10,
      paddingVertical: 12,
    }
  });