import React, {useState, useEffect, useMemo, useCallback, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {useForm} from 'react-hook-form';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, SCREENS} from '../../navigation/mainNavigation';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import colors from '../../utils/colors';
import {fontSizes} from '../../utils/utils';
import fonts from '../../assets/fonts/fonts';
import Input from '../../components/input/input';
import InputCountry from '../../components/input/inputCountry';
import InputState from '../../components/input/inputState';
import InputCity from '../../components/input/inputCity';
import PhoneNumberInputs from '../../components/input/phoneNumberInputs';
import Button from '../../components/button/buttons';
import {selectedCountryType} from '../../utils/types';
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  InfiniteData,
  useQuery,
} from '@tanstack/react-query';
import {
  addAddress,
  getCountriesAction,
  getStateAction,
  viewProfile,
} from '../../utils/apiAction';
import {AddressPayloadType} from '../../utils/types';
import {showLoader} from '../../components/loader/loader';
import {showAlert} from '../../components/cAlert';
import LocationInput from '../../components/input/locationInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useFocusEffect} from '@react-navigation/native';
import parsePhoneNumberFromString from 'libphonenumber-js';

type AddAddressProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.AddAddressScreen
>;

interface AddressFormData {
  fullName: string;
  phone_number: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  addressType: string;
  isDefault: boolean;
  country_code: string;
  second_line_address?: string;
}

const AddAddressScreen: React.FC<AddAddressProps> = ({navigation}) => {
  const queryClient = useQueryClient();
  const isAutofillingRef = useRef(false);
  const [defaultAddress, setDefaultAddress] = useState<string>('');

  const [selectedCountry, setPhoneCountry] = useState<selectedCountryType>({
    callingCode: ['1'],
    cca2: 'US',
    currency: ['USD'],
    flag: 'flag-us',
    name: 'United States',
    region: 'Americas',
    subregion: 'North America',
  });
  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
    setValue,
    getValues,
  } = useForm<AddressFormData>({
    defaultValues: {
      fullName: '',
      phone_number: '',
      address: '',
      country: 'US',
      state: '',
      city: '',
      zipCode: '',
      addressType: 'Home',
      isDefault: false,
      country_code: '+1',
      second_line_address: '',
    },
  });

  const watchedCountry = watch('country');
  const watchedCity = watch('city');
  const watchedAddress = watch('address');

  // Fetch countries to convert iso2 to country_id for state API
  // Use the same query pattern as InputCountry to share cache
  const {data: countriesData, isLoading: isLoadingCountries} = useInfiniteQuery<
    any,
    Error,
    InfiniteData<any>,
    string[],
    number
  >({
    queryKey: ['getCountriesAction', ''],
    queryFn: ({pageParam}) =>
      getCountriesAction({page: pageParam, limit: 300, search: ''}),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      if (lastPage?.data?.hasNext) {
        return lastPage.data.currentPage + 1;
      }
      return undefined;
    },
  });
  const {data, refetch} = useQuery({
    queryKey: ['getProfile'],
    queryFn: viewProfile,
  });
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );
  console.log("data-=-=--=--", data?.data?.user);
  
  const allCountries = useMemo(() => {
    if (!countriesData?.pages) return [];
    return countriesData.pages.flatMap(page => {
      return page?.data?.data || page?.data || [];
    });
  }, [countriesData]);

  // Helper function to get country object from calling code
  const getCountryByCallingCode = (
    callingCode: string,
  ): selectedCountryType | null => {
    // Common country mappings - you can expand this list
    const countryMap: Record<string, selectedCountryType> = {
      '1': {
        callingCode: ['1'],
        cca2: 'US',
        currency: ['USD'],
        flag: 'flag-us',
        name: 'United States',
        region: 'Americas',
        subregion: 'North America',
      },
      '91': {
        callingCode: ['91'],
        cca2: 'IN',
        currency: ['INR'],
        flag: 'flag-in',
        name: 'India',
        region: 'Asia',
        subregion: 'Southern Asia',
      },
      '44': {
        callingCode: ['44'],
        cca2: 'GB',
        currency: ['GBP'],
        flag: 'flag-gb',
        name: 'United Kingdom',
        region: 'Europe',
        subregion: 'Northern Europe',
      },
      '86': {
        callingCode: ['86'],
        cca2: 'CN',
        currency: ['CNY'],
        flag: 'flag-cn',
        name: 'China',
        region: 'Asia',
        subregion: 'Eastern Asia',
      },
    };

    return countryMap[callingCode] || null;
  };

  // Autofill form with profile data when available
  useEffect(() => {
    if (data?.data?.user) {
      const user = data.data.user;
      const currentFullName = getValues('fullName');
      const currentPhoneNumber = getValues('phone_number');
      const currentAddress = getValues('address');
      const currentState = getValues('state');
      const currentCity = getValues('city');
      const currentZipCode = getValues('zipCode');
      const currentCountry = getValues('country');

      // Set flag to indicate we're autofilling
      isAutofillingRef.current = true;

      // Only autofill if fields are empty (to avoid overwriting user input)
      if (!currentFullName && user.full_name) {
        setValue('fullName', user.full_name);
      }

      if (!currentPhoneNumber && user.phone_number) {
        setValue('phone_number', user.phone_number);
      }

      // if (!currentAddress && user.address) {
      //   setValue('address', user.address);
      //   setDefaultAddress(user.address);
      // }

      // if (!currentZipCode && user.pincode) {
      //   setValue('zipCode', user.pincode);
      // }

      // // Set country FIRST - this is important for state/city dropdowns
      // if (!currentCountry && user.country) {
      //   setValue('country', user.country);
      // }

      // // Set second line address if available
      // if (user.second_line_address) {
      //   setValue('second_line_address', user.second_line_address);
      // }

      // Set country code and update selected country
      if (user.country_code) {
        setValue('country_code', user.country_code);

        // Extract calling code (remove the + sign)
        const callingCode = user.country_code.replace('+', '');

        // Find country by calling code
        const country = getCountryByCallingCode(callingCode);
        if (country) {
          setPhoneCountry(country);
        } else {
          // Try to parse phone number to get country code
          try {
            const fullPhoneNumber = user.country_code + user.phone_number;
            const parsedNumber = parsePhoneNumberFromString(fullPhoneNumber);
            if (parsedNumber?.country) {
              // Use a default structure for the country
              // This is a fallback - ideally you'd have a complete mapping
              setPhoneCountry({
                callingCode: [callingCode],
                cca2: parsedNumber.country,
                currency: ['USD'], // Default, you might want to map this properly
                flag: `flag-${parsedNumber.country.toLowerCase()}`,
                name: parsedNumber.country,
                region: '',
                subregion: '',
              });
            }
          } catch (error) {
            console.log('Error parsing phone number:', error);
          }
        }
      }

      // Reset flag after autofill is complete
      setTimeout(() => {
        isAutofillingRef.current = false;
      }, 1000);
    }
  }, [data, setValue, getValues, setPhoneCountry]);

  // Helper to get country_id from iso2
  const getCountryIdFromIso2 = (
    iso2: string | undefined,
  ): number | undefined => {
    if (!iso2 || isLoadingCountries || allCountries.length === 0)
      return undefined;
    const country = allCountries.find((c: any) => c.iso2 === iso2);
    return country?.id;
  };

  // Get country_id for state lookup
  const currentCountryId = getCountryIdFromIso2(watchedCountry);

  // Fetch states to convert state name to state_id for city API
  const {data: statesData} = useInfiniteQuery<
    any,
    Error,
    InfiniteData<any>,
    string[],
    number
  >({
    queryKey: ['getStateAction', '', currentCountryId?.toString() || ''],
    queryFn: ({pageParam}) =>
      getStateAction({
        page: pageParam,
        limit: 300,
        search: '',
        country_id: currentCountryId as string | number,
      }),
    initialPageParam: 1,
    enabled: Boolean(currentCountryId),
    getNextPageParam: lastPage => {
      if (lastPage?.data?.hasNext) {
        return lastPage.data.currentPage + 1;
      }
      return undefined;
    },
  });

  const allStates = useMemo(() => {
    if (!statesData?.pages) return [];
    return statesData.pages.flatMap(page => {
      return page?.data?.data || page?.data || [];
    });
  }, [statesData]);

  // Set state after country_id is available and states are loaded
  // useEffect(() => {
  //   if (
  //     data?.data?.user &&
  //     !isLoadingCountries &&
  //     allCountries.length > 0 &&
  //     allStates.length > 0
  //   ) {
  //     const user = data.data.user;
  //     const currentState = getValues('state');
  //     const currentCountry = getValues('country');

  //     // Only proceed if country is set and matches user's country
  //     if (currentCountry && user.country === currentCountry) {
  //       const countryId = getCountryIdFromIso2(currentCountry);

  //       // Set state once country_id is available and states are loaded
  //       if (!currentState && user.state && countryId) {
  //         setValue('state', user.state);
  //       }
  //     }
  //   }
  // }, [
  //   data,
  //   watchedCountry,
  //   isLoadingCountries,
  //   allCountries,
  //   allStates,
  //   setValue,
  //   getValues,
  // ]);

  // Helper to get state_id from state name
  const getStateIdFromName = (
    stateName: string | undefined,
  ): number | undefined => {
    if (!stateName || allStates.length === 0) return undefined;
    const state = allStates.find((s: any) => s.name === stateName);
    return state?.id;
  };

  // Set city after state_id is available and cities are loaded
  // useEffect(() => {
  //   if (data?.data?.user && allStates.length > 0) {
  //     const user = data.data.user;
  //     const currentCity = getValues('city');
  //     const currentState = getValues('state');

  //     // Only proceed if state is set and matches user's state
  //     if (currentState && user.state === currentState) {
  //       const stateId = getStateIdFromName(currentState);

  //       // Set city once state_id is available
  //       if (!currentCity && user.city && stateId) {
  //         setValue('city', user.city);
  //       }
  //     }
  //   }
  // }, [data, watchedCity, allStates, setValue, getValues]);

  useEffect(() => {
    // Don't clear state/city if we're autofilling from profile
    if (watchedCountry && !isAutofillingRef.current) {
      setValue('state', '');
      setValue('city', '');
    }
  }, [watchedCountry, setValue]);

  useEffect(() => {
    console.log('City value changed to:', watchedCity);
  }, [watchedCity]);

  const {mutate} = useMutation({
    mutationFn: addAddress,
    onSuccess: data => {
      showLoader(false);
      queryClient.invalidateQueries({queryKey: ['getAddresses']});
      showAlert({
        isVisible: true,
        type: 'success',
        title: 'Address Added',
        description: 'Your address has been added successfully.',
        doneText: 'Okay',
        onDonePress: () => {
          navigation.goBack();
        },
      });
    },
    onError: error => {
      showLoader(false);
      showAlert({
        isVisible: true,
        type: 'error',
        title: 'Error',
        description: 'Failed to add address. Please try again.',
        doneText: 'Okay',
      });
    },
  });

  const onSubmit = (data: AddressFormData) => {
    // showLoader(true);

    const basePayload = {
      full_name: data.fullName,
      country_code: data.country_code,
      phone_number: data.phone_number,
      address: data.address,
      country: data.country,
      state: data.state,
      city: data.city,
      pincode: data.zipCode,
    } as const;

    const payload: AddressPayloadType =
      data.second_line_address && data.second_line_address.trim() !== ''
        ? {...basePayload, second_line_address: data.second_line_address.trim()}
        : {...basePayload};
console.log("payload-=-=-=-", payload);

    mutate(payload);
  };

  const setPhoneCountryData = (item: any) => {
    setPhoneCountry(item);
    setValue('country_code', '+' + item.callingCode[0]);
  };
  return (
    <TitleBackHeaderContainer title="Add New Address" isBack>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        style={styles.container}
        keyboardShouldPersistTaps="handled">
        <Input
          control={control}
          name="fullName"
          label="Full Name"
          required="Full name is required"
          error={errors}
          inputProps={{
            placeholder: 'Enter Your Full Name',
            autoCapitalize: 'words',
          }}
        />
        <PhoneNumberInputs
          label={'Personal Phone Number'}
          control={control}
          name="phone_number"
          placeholder={'Enter Phone Number'}
          keyboardType="phone-pad"
          selectedCountry={selectedCountry}
          setPhoneCountry={setPhoneCountryData}
          required={{
            value: true,
            message: 'Please enter your phone number',
          }}
          error={errors}
          disabled={false}
          style={{}}
          containerStyle={{height: 80, marginVertical: 20}}
        />

        <LocationInput
          control={control}
          name="address"
          label={'Address'}
          locationName={defaultAddress || watchedAddress}
          inputProps={{
            placeholder: 'Enter Address',
          }}
          required={{
            value: true,
            message: 'Please enter your address',
          }}
          error={errors}
          editable={true}
          onChangeText={(value: string) => {}}
          onPlaceParsed={info => {
            if (info?.countryCode) {
              setValue('country', info.countryCode, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }

            if (info?.stateCode) {
              setValue('state', info.stateCode, {
                shouldValidate: true,
                shouldDirty: true,
              });
            } else if (info?.stateName) {
              setValue('state', info.stateName, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }

            if (info?.city) {
              setValue('city', info.city, {
                shouldValidate: true,
                shouldDirty: true,
              });
            } else {
              setValue('city', '', {
                shouldValidate: true,
                shouldDirty: true,
              });
            }

            if (info?.postalCode) {
              setValue('zipCode', info.postalCode, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }
          }}
          toggleShowCurrentOnly={undefined}
        />
        <Input
          control={control}
          name="second_line_address"
          label={'House No. / Apartment No. (optional)'}
          inputProps={{
            placeholder: 'Enter House No. / Apartment No.',
          }}
          maxLength={40}
          containerStyle={styles.containerStyle}
        />
        <InputCountry
          control={control}
          name="country"
          placeholder="Select Country"
          label="Country"
          required={{value: true, message: 'Country is required'}}
          error={errors}
          containerStyle={styles.containerStyle}
          disabled={true}
        />

        <InputState
          control={control}
          name="state"
          label={'State'}
          country_id={getCountryIdFromIso2(watch('country'))}
          placeholder={'State'}
          error={errors}
          required={{value: true, message: 'State is required'}}
        />

        <InputCity
          control={control}
          name="city"
          label={'City'}
          state_id={getStateIdFromName(watch('state'))}
          placeholder={'City'}
          error={errors}
          required={{value: true, message: 'City is required'}}
        />

        <Input
          control={control}
          name="zipCode"
          label="Zip Code"
          required="Zip code is required"
          error={errors}
          keyboardType="numeric"
          inputProps={{
            placeholder: 'Enter zip code',
            maxLength: 10,
          }}
          containerStyle={styles.containerStyle}
        />

        <View style={styles.buttonContainer}>
          <Button title="Save Address" onPress={handleSubmit(onSubmit)} />
        </View>
      </KeyboardAwareScrollView>
    </TitleBackHeaderContainer>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  formContainer: {
    padding: 20,
  },
  inputContainer: {
    marginVertical: 10,
  },
  label: {
    fontWeight: '500',
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.label,
    marginBottom: 10,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
    borderRadius: 10,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  addressTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 4,
  },
  selectedAddressTypeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  addressTypeText: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  selectedAddressTypeText: {
    color: colors.white,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.medium,
    color: colors.text2,
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  containerStyle: {marginVertical: 5},
});
