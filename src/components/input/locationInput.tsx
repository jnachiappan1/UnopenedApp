import React, {useEffect, useRef, useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  I18nManager,
  Alert,
} from 'react-native';
import {
  Controller,
  Control,
  ValidationRule,
  Validate,
  FieldValues,
  FieldErrors,
} from 'react-hook-form';
import fonts from '../../assets/fonts/fonts';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import colors, {getColors} from '../../utils/colors';
import commonStyles from '../../utils/common-styles';
import {capitalizeFirstLetter} from '../../utils/method';
import {google_api_key} from '../../utils/api';
import {fontSizes} from '../../utils/utils';

type InputPropsStyle = {
  control: Control<any>;
  name: string;
  locationName?: string | any;
  label?: string;
  rightLabel?: string;
  onRightLabelPress?: () => void;
  rightLabelColor?: string;
  pattern?: ValidationRule<RegExp> | undefined;
  validate?:
    | Validate<any, FieldValues>
    | Record<string, Validate<any, FieldValues>>
    | undefined;
  error?: FieldErrors<FieldValues>;
  required?: string | ValidationRule<boolean> | undefined;
  inputProps?: any;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  inputBgColor?: string;
  keyboardType?: string | any;
  iconName?: any;
  rightIconName?: any | undefined;
  isRightIcon?: boolean;
  maxLength?: number;
  editable: boolean | undefined;
  isLocationInput?: boolean;
  onChangeText: (value: string) => void;
  toggleShowCurrentOnly?: any;
  productError?: string | any;
  defaultValues?: string;
  biasLocation?: {latitude: number; longitude: number} | undefined;
  // Called when a place is selected and parsed, e.g. to autofill state/city/zip
  onPlaceParsed?: (info: {
    countryCode?: string;
    countryName?: string;
    stateCode?: string;
    stateName?: string;
    city?: string;
    postalCode?: string;
  }) => void;
};

const SearchLocationInput: React.FC<InputPropsStyle> = props => {
  const {
    control,
    name,
    label,
    rightLabel,
    onRightLabelPress,
    rightLabelColor,
    locationName,
    pattern,
    validate,
    error,
    required,
    inputProps,
    style,
    keyboardType,
    iconName,
    rightIconName,
    maxLength,
    editable,
    onChangeText,
    productError,
    biasLocation,
    onPlaceParsed,
  } = props;
  // keeping for future dynamic theming within component if needed
  const themeColors = getColors();
  const err =
    error &&
    Object.keys(error).length !== 0 &&
    error[name] &&
    error[name]?.message
      ? error[name]?.message?.toString()
      : '';
  const productErr = productError?.message || '';
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isExternalUpdate, setIsExternalUpdate] = useState<boolean>(false);
  const sessionTokenRef = useRef<string | null>(null);
  const autoCompleteRef = useRef<any>(null);
  const hasAppliedDefaultRef = useRef<boolean>(false);

  // Generate session token for Google Places API
  useEffect(() => {
    if (!sessionTokenRef.current) {
      sessionTokenRef.current = Math.random().toString(36).substring(7);
      // session token generated
    }
  }, []);
  console.log('locationName', locationName);

  // Log component mount
  useEffect(() => {
    console.log('SearchLocationInput component mounted');
    return () => console.log('SearchLocationInput component unmounted');
  }, []);

  return (
    <View style={[styles.container, style]}>
      <Controller
        control={control}
        name={name}
        rules={{
          required: required,
          pattern: pattern,
          validate: validate,
        }}
        render={({field: {onChange, value, onBlur}}) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
            const nextValue =
              typeof locationName === 'string'
                ? locationName
                : locationName ?? '';
            const currentValue =
              typeof value === 'string' ? value : value ?? '';
            if (nextValue && nextValue.trim() !== currentValue.trim()) {
              setIsExternalUpdate(true);
              // Update the form value first
              onChange(nextValue);

              // Then update the GooglePlacesAutocomplete component
              if (autoCompleteRef.current) {
                try {
                  autoCompleteRef.current.setAddressText(nextValue);
                } catch (error) {
                  console.log('Error setting address text:', error);
                }
              }
              // Keep external flag for a short time to ignore internal onChangeText
              const timer = setTimeout(() => setIsExternalUpdate(false), 200);
              return () => clearTimeout(timer);
            }
          }, [locationName, onChange, value]);

          // Handle defaultValues prop
          useEffect(() => {
            const defaultText = props.defaultValues ?? '';
            const currentValue =
              typeof value === 'string' ? value : value ?? '';
            if (
              !hasAppliedDefaultRef.current &&
              defaultText &&
              defaultText.trim() !== currentValue.trim()
            ) {
              hasAppliedDefaultRef.current = true;
              setIsExternalUpdate(true);
              onChange(defaultText);
              if (autoCompleteRef.current) {
                try {
                  autoCompleteRef.current.setAddressText(defaultText);
                } catch (error) {
                  console.log('Error setting default value:', error);
                }
              }
              const timer = setTimeout(() => setIsExternalUpdate(false), 200);
              return () => clearTimeout(timer);
            }
          }, [props.defaultValues]);

          // Cleanup effect
          useEffect(() => {
            return () => {
              // setIsExternalUpdate(false);
            };
          }, []);

          return (
            <>
              <View style={styles.labelRow}>
                {label ? <Text style={styles.label}>{label}</Text> : null}
              </View>
              <View style={styles.inputContainer}>
                {google_api_key ? (
                  <GooglePlacesAutocomplete
                    ref={ref => {
                      autoCompleteRef.current = ref;
                    }}
                    keyboardShouldPersistTaps="always"
                    placeholder={inputProps?.placeholder || 'Enter location'}
                    onPress={(data, details: any = null) => {
                      try {
                        if (
                          data &&
                          data.description &&
                          typeof data.description === 'string'
                        ) {
                          setTimeout(() => {
                            onChange(data.description);
                            onChangeText(data.description);
                          }, 0);
                          if (details && details.address_components) {
                            const comps =
                              details.address_components as Array<any>;
                            const findComp = (type: string) =>
                              comps.find(c => c.types?.includes(type));
                            const countryComp = findComp('country');
                            const stateComp = findComp(
                              'administrative_area_level_1',
                            );
                            const localityComp =
                              findComp('locality') ||
                              findComp('sublocality') ||
                              findComp('postal_town');
                            const postalComp = findComp('postal_code');
                            const parsed = {
                              countryCode: countryComp?.short_name,
                              countryName: countryComp?.long_name,
                              stateCode: stateComp?.short_name,
                              stateName: stateComp?.long_name,
                              city: localityComp?.long_name,
                              postalCode: postalComp?.long_name,
                            };
                            if (onPlaceParsed) {
                              onPlaceParsed(parsed);
                            }
                          }
                        } else {
                        }
                      } catch (error) {}
                    }}
                    query={{
                      key: google_api_key || '',
                      sessiontoken: sessionTokenRef.current || '',
                      language: 'en',
                      types: 'geocode|establishment',
                      ...(biasLocation
                        ? {
                            location: `${biasLocation.latitude},${biasLocation.longitude}`,
                            radius: 15000,
                          }
                        : {}),
                    }}
                    fetchDetails={true}
                    predefinedPlaces={[]}
                    predefinedPlacesAlwaysVisible={false}
                    textInputProps={{
                      onBlur: () => {
                        onBlur();
                        setIsFocused(false);
                      },
                      clearButtonMode: 'never',
                      keyboardType: keyboardType,
                      maxLength: maxLength,
                      editable: editable,
                      placeholderTextColor: colors.placeholder,
                      style: [styles.input, {paddingStart: 16}],
                      onFocus: () => {
                        setIsFocused(true);
                      },
                      onChangeText: text => {
                        try {
                          if (isExternalUpdate) {
                            return;
                          }

                          const currentValue =
                            typeof value === 'string' ? value : value ?? '';
                          if (
                            typeof text === 'string' &&
                            text.trim() === currentValue.trim()
                          ) {
                            return;
                          }

                          if (timeoutRef.current !== null) {
                            clearTimeout(timeoutRef.current);
                          }
                          timeoutRef.current = setTimeout(() => {
                            try {
                              if (typeof text === 'string') {
                                onChange(text);
                                onChangeText(text);
                              }
                            } catch (error) {}
                          }, 500);
                        } catch (error) {
                          console.log('Error in onChangeText:', error);
                        }
                      },
                      ...(inputProps || {}),
                    }}
                    numberOfLines={1}
                    onFail={error => {
                      if (sessionTokenRef.current) {
                        sessionTokenRef.current = Math.random()
                          .toString(36)
                          .substring(7);
                      }
                    }}
                    onNotFound={() => console.log('No search results found')}
                    timeout={10000}
                    debounce={300}
                    enablePoweredByContainer={false}
                    minLength={1}
                    renderHeaderComponent={() => (
                      <Text style={styles.resultsHeader}>
                        {capitalizeFirstLetter('Results')}
                      </Text>
                    )}
                    renderRow={(place: any) => {
                      const main =
                        place?.structured_formatting?.main_text ||
                        place?.description;
                      const secondary =
                        place?.structured_formatting?.secondary_text || '';

                      return (
                        <View style={styles.rowWrapper}>
                          <View style={styles.distanceCol}></View>

                          <View style={styles.placeCol}>
                            <Text style={styles.placeTitle} numberOfLines={1}>
                              {main}
                            </Text>
                            {!!secondary && (
                              <Text
                                style={styles.placeSubtitle}
                                numberOfLines={1}>
                                {secondary}
                              </Text>
                            )}
                          </View>
                        </View>
                      );
                    }}
                    styles={useMemo(
                      () => ({
                        container: {
                          flex: 1,
                          position: 'relative',
                        },
                        textInput: {
                          height: 53,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          borderRadius: 160,
                          backgroundColor: colors.white,
                          color: colors.primaryBlack,
                          fontFamily: fonts.medium,
                          fontSize: fontSizes.regular,
                        },
                        description: {
                          color: '#808390',
                        },
                        textInputContainer: {
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingHorizontal: 0,
                          paddingVertical: 0,
                          backgroundColor: 'transparent',
                        },
                        row: {
                          paddingVertical: 12,
                          paddingHorizontal: 12,
                          borderBottomWidth: 0.5,
                          borderBottomColor: colors.border,
                          backgroundColor: colors.background,
                        },
                        separator: {
                          height: 1,
                          backgroundColor: colors.border,
                        },
                        listView: {
                          position: 'absolute',
                          top: 60,
                          left: 0,
                          right: 0,
                          zIndex: 9999,
                          marginTop: 8,
                          borderRadius: 12,
                          overflow: 'hidden',
                          backgroundColor: colors.background,
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.15,
                          shadowRadius: 4,
                          elevation: 8,
                        },
                      }),
                      [],
                    )}
                    disableScroll={false}
                  />
                ) : (
                  <View style={styles.fallbackContainer}>
                    <Text style={styles.errorText}>
                      Google Places API not configured
                    </Text>
                    <Text style={styles.fallbackText}>
                      Please check your API key configuration
                    </Text>
                  </View>
                )}
              </View>
              {productErr ? (
                <Text style={commonStyles.error} numberOfLines={2}>
                  {productErr}
                </Text>
              ) : err ? (
                <Text style={commonStyles.error} numberOfLines={2}>
                  {err}
                </Text>
              ) : null}
            </>
          );
        }}
      />
    </View>
  );
};

export default SearchLocationInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    position: 'relative',
    zIndex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontWeight: '500',
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.label,
  },
  rightLabelText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: colors.primaryBlack,
    marginStart: 10,
  },
  input: {
    height: 53,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 160,
    backgroundColor: colors.white,
    borderColor: colors.border,
    alignItems: 'center',
    width: '100%',
    // textAlign: I18nManager.isRTL ? 'right' : 'left',
    fontSize: fontSizes.regular,
    color: colors.primaryBlack,
    fontFamily: fonts.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 10,
    position: 'relative',
    zIndex: 2,
    width: '100%',
  },
  icon: {
    zIndex: 1 || 2,
    top: 15,
    left: 10,
    bottom: 27,
    position: 'absolute',
  },
  rightIcon: {
    position: 'absolute',
    zIndex: 1 || 2,
    marginTop: 20,
    right: 10,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    color: colors.primary,
    fontFamily: fonts.medium,
    fontSize: fontSizes.medium,
  },
  rowWrapper: {
    // flexDirection: 'row',
    // alignItems: 'center',
    paddingHorizontal: 5,
  },
  distanceCol: {
    width: 40,
    alignItems: 'flex-start',
  },
  distanceText: {
    color: colors.primary,
    fontFamily: fonts.bold,
    fontSize: fontSizes.medium,
  },

  placeCol: {
    // flex: 1,
  },
  placeTitle: {
    color: colors.primaryBlack,
    fontFamily: fonts.medium,
    fontSize: fontSizes.medium,
  },
  placeSubtitle: {
    color: colors.primaryBlack,
    fontFamily: fonts.medium,
    fontSize: fontSizes.medium,
    marginTop: 2,
  },
  errorText: {
    color: 'red',
    fontFamily: fonts.medium,
    fontSize: fontSizes.medium,
    textAlign: 'center',
    padding: 16,
  },
  fallbackContainer: {
    padding: 16,
    alignItems: 'center',
  },
  fallbackText: {
    color: colors.primaryBlack,
    fontFamily: fonts.medium,
    fontSize: fontSizes.small,
    textAlign: 'center',
    marginTop: 8,
  },
});
