import {
  ActivityIndicator,
  Alert,
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
import React, { useEffect, useState } from 'react';
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
import colors from '../../utils/colors';
import IconsSvg from '../../assets/svg/iconsSvg';
import Header from '../headerContainer/header';
import commonStyles from '../../utils/common-styles';

type IInputProps = {
  control: Control<any>;
  name: string;
  placeholder: string;
  label?: string;
  error?: FieldErrors<FieldValues>;
  required?: string | ValidationRule<boolean> | undefined;
  pattern?: ValidationRule<RegExp> | undefined;
  validate?:
    | Validate<any, FieldValues>
    | Record<string, Validate<any, FieldValues>>
    | undefined;
  containerStyle?: StyleProp<ViewStyle>;
  country: string | undefined;
  state: string | undefined;
};

export interface IItem {
  name: string;
  iso2: string;
  iso3: string;
  unicodeFlag: string;
}

const InputCity = (props: IInputProps) => {
  const {
    placeholder,
    label,
    containerStyle,
    control,
    name,
    error,
    required,
    pattern,
    validate,
    country,
    state,
  } = props;

  const [showList, setShowList] = useState<boolean>(false);
  const onSwipeComplete = () => {
    setShowList(false);
  };

  const [data, setData] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = () => {
    setLoading(true);
    fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        country: country,
        state: state,
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (response.error === false) {
          setData(response.data);
        }
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      });
  };

  const fetchCityOfSingapore = () => {
    setLoading(true);
    fetch('https://countriesnow.space/api/v0.1/countries/cities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        country: 'Singapore',
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (response.error === false) {
          setData(response.data);
        }
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (country === 'Singapore') {
      fetchCityOfSingapore();
    } else {
      if (state) {
        fetchData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, country]);

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
          {label && <Text style={styles.titleLabel}>{label}</Text>}
          <TouchableOpacity
            style={[styles.container]}
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
          <Text style={commonStyles.error} numberOfLines={2}>
            {err}
          </Text>
          <Modal testID={'modal'} isVisible={showList} style={styles.view}>
            <View style={styles.modelContainer}>
              <Header
                hideBack={true}
                closeButton={true}
                title={'Select City'}
                onBackPress={onSwipeComplete}
              />
              <View style={styles.searchContainer}>
                <IconsSvg name="search" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search City"
                  placeholderTextColor={'#000'}
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
                      t
                        .toLocaleLowerCase()
                        .startsWith(searchText.toLocaleLowerCase()),
                    )}
                    renderItem={({ item }) => (
                      <Text
                        style={styles.renderTxt}
                        onPress={() => {
                          onChange(item);
                          setShowList(false);
                        }}
                      >
                        {item}
                      </Text>
                    )}
                    keyExtractor={(item, index) => item + index}
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

export default InputCity;

const styles = StyleSheet.create({
  containerModel: { flex: 1 },
  titleLabel: {
    fontWeight: '500',
      fontSize: 12,
      fontFamily: fonts.medium,
      color: colors.label,
    marginBottom: 8,
  },
  mainContainer: { width: '100%' },
  container: {
    height: 53,
    paddingHorizontal: 14,
    borderRadius: 260,
    backgroundColor: colors.white,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: { width: 20, height: 20 },
  input: {
    height: 40,
    flex: 1,
    justifyContent: 'center',
  },
  iconRight: { width: 24, height: 24 },
  placeHolder: {
    color: colors.primaryBlack,
      fontFamily: fonts.medium,
      fontSize:14
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
    backgroundColor: '#FFF',
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
});
