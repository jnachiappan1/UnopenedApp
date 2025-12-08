import React, {useMemo, useRef, useState} from 'react';
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
import {getColors, IColors} from '../../utils/colors';
import {useQuery} from '@tanstack/react-query';
import {getCityAction} from '../../utils/apiAction';
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

  const {data, isLoading} = useQuery<any, Error>({
    queryKey: ['getCityAction', 'all', state_id as string],
    queryFn: async () => {
      let allCities: any[] = [];
      let page = 1;
      let hasNext = true;

      while (hasNext) {
        const response = await getCityAction({
          page,
          limit: 100,
          search: '',
          state_id: state_id as string | number,
        });
        const cities = response?.data?.data || response?.data || [];
        allCities = [...allCities, ...cities];
        hasNext = response?.data?.hasNext || false;
        page++;
      }

      const processedCities = allCities.map((city, index) => {
        if (typeof city === 'string') {
          return {
            id: index + 1,
            name: city,
          };
        }
        return city;
      });

      return {data: processedCities};
    },
    enabled: Boolean(state_id),
  });

  const filteredCities = useMemo(() => {
    const allCitiesList = data?.data || [];
    if (!searchText.trim()) {
      return allCitiesList;
    }
    const searchLower = searchText.toLowerCase().trim();
    return allCitiesList.filter((city: any) =>
      city.name?.toLowerCase().includes(searchLower),
    );
  }, [data, searchText]);

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
      rules={{required, pattern, validate}}
      render={({field: {onChange, value}}) => (
        <View style={[commonStyles.mainContainer, containerStyle]}>
          {label && (
            <Text style={{color: labelColor || colors.label}}>{label}</Text>
          )}
          <TouchableOpacity
            style={[commonStyles.inputWrapper, style]}
            onPress={() => setShowList(true)}
            disabled={isLoading || !state_id}>
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

          <Modal
            visible={showList}
            animationType="slide"
            onRequestClose={onClose}>
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
                data={filteredCities}
                keyExtractor={item => String(item.id)}
                renderItem={({item}) => (
                  <Text
                    style={commonStyles.countryItem}
                    onPress={() => {
                      onChange(item.name);
                      onClose();
                    }}>
                    {item.name}
                  </Text>
                )}
                contentContainerStyle={commonStyles.flatListContent}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                  <Text style={commonStyles.noDataText}>No cities found</Text>
                }
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
    },
  });
