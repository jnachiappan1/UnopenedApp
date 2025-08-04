import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Validate,
  ValidationRule,
} from 'react-hook-form';
import Modal from 'react-native-modal';
import fonts from '../../assets/fonts/fonts';
import { IColors, getColors } from '../../utils/colors';
import IconsSvg from '../../assets/svg/iconsSvg';
import Header from '../headerContainer/header';
import commonStyles from '../../utils/common-styles';

type IInputProps = {
  control: Control<any>;
  name: string;
  placeholder: string;
  label?: string;
  labelColor?: string;
  error?: FieldErrors<FieldValues>;
  required?: string | ValidationRule<boolean> | undefined;
  pattern?: ValidationRule<RegExp> | undefined;
  validate?:
    | Validate<any, FieldValues>
    | Record<string, Validate<any, FieldValues>>
    | undefined;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  isShowError?: boolean;
};

export interface IItem {
  name: string;
  iso2: string;
  iso3: string;
  unicodeFlag: string;
}

const InputCountry = (props: IInputProps) => {
  const {
    placeholder,
    label,
    labelColor,
    containerStyle,
    style,
    control,
    name,
    error,
    required,
    pattern,
    validate,
    isShowError = true,
  } = props;
  const colors = getColors();
  const styles = getStyles(colors, isShowError);
  const searchInputRef = useRef<TextInput | null>(null);
  const [showList, setShowList] = useState<boolean>(false);
  const onSwipeComplete = () => {
    setShowList(false);
  };

  const [data, setData] = useState<IItem[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = () => {
    setLoading(true);
    fetch('https://countriesnow.space/api/v0.1/countries/flag/unicode', {
      method: 'Get',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(response => {
        if (response.error === false) {
         console.log('esponse.data');
          // let filterData = response.data.filter(
          //   (t: any) =>
          //     t.name === 'India' ||
          //     t.name === 'Singapore' ||
          //     t.name === 'New Zealand' ||
          //     t.name === 'Malaysia' ||
          //     t.name === 'Australia',
          // );
          setData(response?.data);
        }
        setLoading(false);
      })
      .catch(e => {
        console.log('err', e);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);
  const err =
    error &&
    Object.keys(error).length !== 0 &&
    error[name] &&
    error[name]?.message
      ? error[name]?.message?.toString()
      : '';

  // eslint-disable-next-line react/no-unstable-nested-components
  const ItemSeparatorComponent = () => <View style={styles.line} />;
  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required,
        pattern: pattern,
        validate: validate,
      }}
      render={({ field: { onChange, value } }) => (
        <View style={[styles.mainContainer, containerStyle]}>
          {label && (
            <Text
              style={[
                styles.titleLabel,
                { color: labelColor ? labelColor : colors.label },
              ]}
            >
              {label}
            </Text>
          )}
          <TouchableOpacity
            style={[styles.container, style]}
            onPress={() => setShowList(true)}
            disabled={loading}
          >
            <View style={styles.input}>
              {loading ? (
                <ActivityIndicator size={'small'} />
              ) : value ? (
                <Text style={styles.value} numberOfLines={1}>
                  {value}
                </Text>
              ) : (
                <Text style={styles.placeHolder}>{placeholder}</Text>
              )}
            </View>
            <IconsSvg name="downArrow" />
          </TouchableOpacity>
          {isShowError && (
            <Text style={commonStyles.error} numberOfLines={2}>
              {err}
            </Text>
          )}
          <Modal
            testID={'modal'}
            isVisible={showList}
            style={styles.view}
            onModalShow={() => searchInputRef?.current?.focus()}
          >
            <View style={styles.modelContainer}>
              <Header
                hideBack={true}
                closeButton
                title={'Select Country'}
                onBackPress={onSwipeComplete}
              />
              <View style={styles.searchContainer}>
                <IconsSvg name="search" style={styles.searchIcon} />
                <TextInput
                  ref={searchInputRef}
                  style={styles.searchInput}
                  placeholder={'Search Country'}
                  placeholderTextColor={colors.placeholder}
                  onChangeText={setSearchText}
                  value={searchText}
                />
              </View>
              <ScrollView>
                <View
                  style={styles.containerModel}
                  onStartShouldSetResponder={() => true}
                >
                  <FlatList
                    data={data.filter(t =>
                      t.name
                        .toLocaleLowerCase()
                        .startsWith(searchText.toLocaleLowerCase()),
                    )}
                    renderItem={({ item }) =>     
                    {
                      return(
                        <TouchableOpacity
                        style={styles.countryItem}
                        onPress={() => {
                          onChange(item.name);
                          setShowList(false);
                        }}
                      >
                        <Text style={styles.flagText}>{item.unicodeFlag}</Text>
                        <Text style={styles.countryName}>{item.name}</Text>
                      </TouchableOpacity>
                      )
                    }
                      
                     }
                    keyExtractor={item => item.name}
                    style={styles.flatList}
                    scrollEnabled={false}
                    ItemSeparatorComponent={ItemSeparatorComponent}
                  />
                </View>
              </ScrollView>
            </View>
          </Modal>
        </View>
      )}
    />
  );
};

export default InputCountry;

const getStyles = (colors: IColors, isShowError: boolean) =>
  StyleSheet.create({
    containerModel: { flex: 1 },
    mainContainer: { width: '100%' },
    titleLabel: {
      fontWeight: '500',
      fontSize: 12,
      fontFamily: fonts.medium,
      color: colors.label,
    },
    container: {
      height: 53,
      paddingHorizontal: 14,
      borderRadius: 25,
      backgroundColor: colors.white,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: isShowError ? 10 : 0,
    },
    input: {
      height: 40,
      flex: 1,
      justifyContent: 'center',
    },
    iconRight: { width: 24, height: 24 },
    placeHolder: {
      color: colors.primaryBlack,
      fontFamily: fonts.medium,
      fontSize: 14,
    },
    value: {
      color: colors.text,
      fontFamily: fonts.regular,
      fontSize: 16,
    },
    view: {
      margin: 0,
      flex: 1,
      height: Dimensions.get('screen').height,
    },
    modelContainer: {
      backgroundColor: colors.white,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      flex: 1,
      height: Dimensions.get('screen').height,
    },
    line: { height: 1, backgroundColor: colors.border },
    flatList: { marginVertical: 10, paddingHorizontal: 20, flex: 1 },
    renderTxt: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      color: colors.primary,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderRadius: 20,
      borderColor: colors.primary,
      paddingHorizontal: 15,
      marginHorizontal: 20,
      marginVertical: 12,
    },
    searchIcon: { height: 18, width: 18, alignSelf: 'center' },
    searchInput: {
      height: 40,
      flex: 1,
      paddingHorizontal: 10,
      color: colors.text,
    },
    countryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 14,
    },
    flagText: {
      fontSize: 18,
      marginRight: 10,
    },
    countryName: {
      fontSize: 16,
      color: colors.primary,
      fontFamily: fonts.medium,
    },
  });
