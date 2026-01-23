import { Image, StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import IconsSvg from '../../assets/svg/iconsSvg';
import IMAGE from '../../assets/images';
import Input from '../../components/input/input';
import { useForm } from 'react-hook-form';
import fonts from '../../assets/fonts/fonts';
import colors from '../../utils/colors';
import { emailPattern, fontSizes } from '../../utils/utils';
import ProfileImageUpload from '../../components/model/profileImageUpload';
import { useFocusEffect } from '@react-navigation/native';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import Button from '../../components/button/buttons';
import InputCountry from '../../components/input/inputCountry';
import InputState from '../../components/input/inputState';
import InputCity from '../../components/input/inputCity';
import GenderDropdown from '../../components/input/genderDropdown';
import LocationInput from '../../components/input/locationInput';
import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  InfiniteData,
  useQueryClient,
} from '@tanstack/react-query';
import {
  updateProfile,
  viewProfile,
  getCountriesAction,
  getStateAction,
} from '../../utils/apiAction';
import { showLoader } from '../../components/loader/loader';
import { showAlert } from '../../components/cAlert';
import { handleError, handleSettled } from '../../utils/method';
import { saveUserData } from '../../redux/reducers/user/UserReducer';
import { useDispatch } from 'react-redux';
import { image_url } from '../../utils/api';

type EditProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.EditProfileScreen
>;

type Inputs = {
  full_name: string;
  pincode: string;
  email?: string;
  address?: string;
  phone_number?: string;
  profileImage?: string | { uri: string; name: string; type: string };
  country?: string;
  city?: string;
  state?: string;
  gender?: string;
  second_line_address?: string;
};

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ['getProfile'],
    queryFn: viewProfile,
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors, isDirty },
  } = useForm<Inputs>({
    defaultValues: {
      full_name: '',
      email: '',
      phone_number: '',
      address: '',
      country: '',
      state: '',
      city: '',
      pincode: '',
      gender: '',
      profileImage: '',
    },
  });

  const watchedProfileImage = watch('profileImage');
  const watchedCountry = watch('country');
  const watchedState = watch('state');
  const watchedAddress = watch('address');

  const [defaultAddress, setDefaultAddress] = useState<string>('');

  const { data: countriesData, isLoading: isLoadingCountries } = useInfiniteQuery<
    any,
    Error,
    InfiniteData<any>,
    string[],
    number
  >({
    queryKey: ['getCountriesAction', ''],
    queryFn: ({ pageParam }) =>
      getCountriesAction({ page: pageParam, limit: 300, search: '' }),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      if (lastPage?.data?.hasNext) {
        return lastPage.data.currentPage + 1;
      }
      return undefined;
    },
  });

  const allCountries = useMemo(() => {
    if (!countriesData?.pages) return [];
    return countriesData.pages.flatMap(page => {
      return page?.data?.data || page?.data || [];
    });
  }, [countriesData]);

  const getCountryIdFromIso2 = (
    iso2: string | undefined,
  ): number | undefined => {
    if (!iso2 || isLoadingCountries || allCountries.length === 0)
      return undefined;
    const country = allCountries.find((c: any) => c.iso2 === iso2);
    return country?.id;
  };

  const currentCountryId = getCountryIdFromIso2(watchedCountry);

  const { data: statesData } = useInfiniteQuery<
    any,
    Error,
    InfiniteData<any>,
    string[],
    number
  >({
    queryKey: ['getStateAction', '', currentCountryId?.toString() || ''],
    queryFn: ({ pageParam }) =>
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

  const getStateIdFromName = (
    stateName: string | undefined,
  ): number | undefined => {
    if (!stateName || allStates.length === 0) return undefined;
    const state = allStates.find((s: any) => s.name === stateName);
    return state?.id;
  };

  const hasInitialDataLoaded = useRef(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isAutofillingRef = useRef(false);

  const prevCountryRef = useRef<string | undefined>(undefined);
  const prevStateRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (prevCountryRef.current === watchedCountry) {
      return;
    }

    const prevCountry = prevCountryRef.current;
    prevCountryRef.current = watchedCountry;

    if (prevCountry === undefined) {
      return;
    }

    if (!isAutofillingRef.current) {
      setValue('state', '');
      setValue('city', '');
    }
  }, [watchedCountry, setValue]);

  useEffect(() => {
    if (prevStateRef.current === watchedState) {
      return;
    }

    const prevState = prevStateRef.current;
    prevStateRef.current = watchedState;

    if (prevState === undefined) {
      return;
    }

    if (!isAutofillingRef.current) {
      setValue('city', '');
    }
  }, [watchedState, setValue]);

  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onSuccess: data => {
      dispatch(saveUserData(data.data.user));
      queryClient.invalidateQueries({ queryKey: ['getProfile'] });
      showLoader(false);
      showAlert({
        isVisible: true,
        type: 'success',
        title: 'Profile',
        description: 'Your profile update successfully',
        doneText: 'Okay',
        onDonePress: () => {
          navigation.goBack();
        },
      });
    },
    onError: handleError,
    onSettled: handleSettled,
  });

  const onSubmit = (formData: Inputs) => {
    const formDataToSend = new FormData();
    formDataToSend.append('full_name', formData.full_name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone_number', formData.phone_number);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('country', formData.country);
    formDataToSend.append('state', formData.state);
    formDataToSend.append('city', formData.city);
    formDataToSend.append('pincode', formData.pincode);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('second_line_address', formData.second_line_address);
    if (formData.profileImage && typeof formData.profileImage === 'object') {
      formDataToSend.append('profile_picture', {
        uri: formData.profileImage.uri,
        type: formData.profileImage.type || 'image/jpeg',
        name: formData.profileImage.name || 'photo.jpg',
      });
    }

    showLoader(true);

    mutate(formDataToSend);
  };

  useEffect(() => {
    if (data?.data?.user && !isLoadingCountries && allCountries.length > 0) {
      const user = data.data.user;
      const address = user.address || {};

      const fields: Inputs = {
        full_name: user.full_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        address: address.address || '',
        country: address.country || '',
        state: address.state || '',
        city: address.city || '',
        pincode: address.pincode || '',
        gender: user.gender || '',
        profileImage: user.profile_picture || '',
        second_line_address: address.second_line_address || '',
      };

      setDefaultAddress(address.address || '');
      reset(fields);
      hasInitialDataLoaded.current = true;
      setIsInitialLoad(false);
    }
  }, [data, reset, isLoadingCountries, allCountries.length]);
  const getImageSource = () => {
    if (
      watchedProfileImage &&
      typeof watchedProfileImage === 'object' &&
      watchedProfileImage.uri
    ) {
      return { uri: watchedProfileImage.uri };
    }
    if (
      watchedProfileImage &&
      typeof watchedProfileImage === 'string' &&
      watchedProfileImage.trim().length > 0
    ) {
      const imageUrl = watchedProfileImage.startsWith('http')
        ? watchedProfileImage
        : `${image_url}${watchedProfileImage}`;
      return { uri: imageUrl };
    }
    if (
      data?.data?.user?.profile_picture &&
      data.data.user.profile_picture.trim().length > 0
    ) {
      const imageUrl = data.data.user.profile_picture.startsWith('http')
        ? data.data.user.profile_picture
        : `${image_url}${data.data.user.profile_picture}`;
      return { uri: imageUrl };
    }
    return IMAGE.userProfile;
  };
  useFocusEffect(
    useCallback(() => {
      hasInitialDataLoaded.current = false;
      setIsInitialLoad(true);
      prevCountryRef.current = undefined;
      prevStateRef.current = undefined;
      refetch();
    }, [refetch]),
  );
  return (
    <TitleBackHeaderContainer title={'My Profile'} isBack>
      <View style={styles.profileContainer}>
        <Image
          source={getImageSource()}
          style={styles.profileImage}
          resizeMode="cover"
        />
        <IconsSvg
          name="camera"
          style={styles.editIconStyle}
          onPress={() => setIsModalVisible(true)}
        />
      </View>

      <View style={[styles.imageContainer]}>
        <Input
          control={control}
          name="full_name"
          label={'Full Name'}
          containerStyle={styles.emailContainer}
          inputProps={{
            placeholder: 'Enter Name',
          }}
          required={{ value: true, message: 'Please enter your name' }}
          error={errors}
          maxLength={40}
          inputStyle={styles.inputStyle}
        />
        <Input
          control={control}
          name="phone_number"
          label={'Phone Number'}
          containerStyle={styles.emailContainer}
          inputProps={{
            placeholder: 'Enter Phone Number',
          }}
          required={{
            value: true,
            message: 'Please enter your phone number',
          }}
          error={errors}
          keyboardType="numeric"
          maxLength={40}
          inputStyle={styles.inputStyle}
          disabled
        />
        <Input
          control={control}
          name="email"
          label={'Email Address'}
          containerStyle={styles.emailContainer}
          inputProps={{
            placeholder: 'Enter Email Address Here',
          }}
          required={{ value: true, message: 'Email address required' }}
          pattern={{
            value: emailPattern,
            message: 'Invalid email format',
          }}
          error={errors}
          keyboardType="email-address"
          maxLength={40}
          inputStyle={styles.inputStyle}
          disabled
        />
        <View style={styles.locationInputContainer}>
          <LocationInput
            key={data?.data?.user?.address?.address || 'address-input'}
            control={control}
            name="address"
            label={'Address'}
            locationName={
              watchedAddress ||
              defaultAddress ||
              data?.data?.user?.address?.address ||
              ''
            }
            defaultValues={
              defaultAddress || data?.data?.user?.address?.address || ''
            }
            inputProps={{
              placeholder: 'Enter Address',
            }}
            required={{ value: true, message: 'Please enter your address' }}
            error={errors}
            editable={true}
            onChangeText={(value: string) => {
              setDefaultAddress(value);
            }}
            onPlaceParsed={info => {
              isAutofillingRef.current = true;

              if (info?.countryCode) {
                setValue('country', info.countryCode, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }

              if (info?.stateName) {
                setValue('state', info.stateName, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              } else if (info?.stateCode) {
                setValue('state', info.stateCode, {
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
                setValue('city', '', { shouldValidate: true, shouldDirty: true });
              }

              if (info?.postalCode) {
                setValue('pincode', info.postalCode, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }

              setTimeout(() => {
                isAutofillingRef.current = false;
              }, 500);
            }}
            toggleShowCurrentOnly={undefined}
          />
        </View>
        <Input
          control={control}
          name="second_line_address"
          label={'House No. / Apartment No. (optional)'}
          inputProps={{
            placeholder: 'Enter House No. / Apartment No.',
          }}
          maxLength={40}
          containerStyle={{ marginTop: 20 }}
        />

        <View style={styles.locationContainer}>
          <InputCountry
            control={control}
            name="country"
            label={'Country'}
            placeholder={'Country'}
            error={errors}
            required={{ value: true, message: 'Country is required' }}
          />
          <InputState
            control={control}
            name="state"
            label={'State'}
            country_id={getCountryIdFromIso2(watchedCountry)}
            placeholder={'State'}
            error={errors}
            required={{ value: true, message: 'State is required' }}
            containerStyle={{ marginTop: 20 }}
          />

          <InputCity
            control={control}
            name="city"
            label={'City'}
            state_id={getStateIdFromName(watchedState)}
            placeholder={'City'}
            error={errors}
            required={{ value: true, message: 'City is required' }}
            containerStyle={{ marginTop: 20 }}
          />
          <Input
            control={control}
            name="pincode"
            label={'Pincode	'}
            inputProps={{
              placeholder: 'Enter Pincode',
            }}
            required={{ value: true, message: 'Please enter your pincode' }}
            error={errors}
            maxLength={40}
            inputStyle={styles.inputStyle}
            containerStyle={{ marginTop: 20 }}
          />
          <View style={{ marginTop: 20 }}>
            <GenderDropdown control={control} name="gender" label="Gender" />
          </View>
        </View>
      </View>
      <Button
        title={'Save Changes'}
        style={styles.btnContainer}
        textStyle={styles.btnTextStyle}
        onPress={handleSubmit(onSubmit)}
        disabled={!isDirty}
      />
      <ProfileImageUpload
        control={control}
        name="profileImage"
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
      />
    </TitleBackHeaderContainer>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
  },
  imageContainer: {
    paddingHorizontal: 16,
    borderRadius: 12,
    zIndex: 1,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Make it circular
    borderWidth: 2, // Add border
    borderColor: colors.border || '#E0E0E0', // Add border color
  },
  editIconStyle: {
    position: 'absolute',
    bottom: -10,
    right: 160,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 32,
    backgroundColor: colors.secondary,
  },
  btnContainer: {
    width: '90%',
    backgroundColor: colors.primary,
    marginVertical: 30,
  },
  btnTextStyle: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.bold,
    color: colors.white,
    textAlign: 'center',
  },
  inputStyle: {
    height: 53,
    borderRadius: 160,
    width: '100%',
  },
  locationContainer: {
    marginTop: 20,
    width: '100%',
  },
  emailContainer: {
    marginTop: 20,
  },
  locationInputContainer: {
    marginTop: 20,
    zIndex: 10,
    position: 'relative',
  },
});
