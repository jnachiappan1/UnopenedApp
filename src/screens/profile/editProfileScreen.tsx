import {Image, ScrollView, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState, useMemo, useRef} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, SCREENS} from '../../navigation/mainNavigation';
import IconsSvg from '../../assets/svg/iconsSvg';
import IMAGE from '../../assets/images';
import Input from '../../components/input/input';
import {useForm} from 'react-hook-form';
import fonts from '../../assets/fonts/fonts';
import colors from '../../utils/colors';
import {emailPattern, fontSizes, width} from '../../utils/utils'; // Add image_url import
import ProfileImageUpload from '../../components/model/profileImageUpload';
import {useFocusEffect} from '@react-navigation/native';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import Button from '../../components/button/buttons';
import InputCountry from '../../components/input/inputCountry';
import InputState from '../../components/input/inputState';
import InputCity from '../../components/input/inputCity';
import GenderDropdown from '../../components/input/genderDropdown';
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
import {showLoader} from '../../components/loader/loader';
import {showAlert} from '../../components/cAlert';
import {handleError, handleSettled} from '../../utils/method';
import {saveUserData} from '../../redux/reducers/user/UserReducer';
import {useDispatch} from 'react-redux';
import {image_url} from '../../utils/api';

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
  profileImage?: string | {uri: string; name: string; type: string};
  country?: string;
  city?: string;
  state?: string;
  gender?: string;
};

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const {data, refetch} = useQuery({
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
    formState: {errors, isDirty},
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

  // Watch the profileImage field for changes
  const watchedProfileImage = watch('profileImage');
  const watchedCountry = watch('country');
  const watchedState = watch('state');

  // Fetch countries to convert iso2 to country_id for state API
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

  const allCountries = useMemo(() => {
    if (!countriesData?.pages) return [];
    return countriesData.pages.flatMap(page => {
      return page?.data?.data || page?.data || [];
    });
  }, [countriesData]);

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

  // Helper to get state_id from state name
  const getStateIdFromName = (
    stateName: string | undefined,
  ): number | undefined => {
    if (!stateName || allStates.length === 0) return undefined;
    const state = allStates.find((s: any) => s.name === stateName);
    return state?.id;
  };

  // Track if initial data has been loaded
  const hasInitialDataLoaded = useRef(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Reset dependent fields when parent selection changes (but not during initial load)
  useEffect(() => {
    if (watchedCountry && !isInitialLoad) {
      setValue('state', '');
      setValue('city', '');
    }
  }, [watchedCountry, setValue, isInitialLoad]);

  useEffect(() => {
    if (watchedState && !isInitialLoad) {
      setValue('city', '');
    }
  }, [watchedState, setValue, isInitialLoad]);

  const {mutate} = useMutation({
    mutationFn: updateProfile,
    onSuccess: data => {
      dispatch(saveUserData(data.data.user));
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({queryKey: ['getProfile']});
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

  // Reset form when profile data and countries are loaded
  useEffect(() => {
    if (
      data?.data?.user &&
      !isLoadingCountries &&
      allCountries.length > 0
    ) {
      const user = data.data.user;
      const fields: Inputs = {
        full_name: user.full_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        country: user.country || '',
        state: user.state || '',
        city: user.city || '',
        pincode: user.pincode || '',
        gender: user.gender || '',
        profileImage: user.profile_picture || '',
      };

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
      return {uri: watchedProfileImage.uri};
    }
    if (
      watchedProfileImage &&
      typeof watchedProfileImage === 'string' &&
      watchedProfileImage.trim().length > 0
    ) {
      const imageUrl = watchedProfileImage.startsWith('http')
        ? watchedProfileImage
        : `${image_url}${watchedProfileImage}`;
      return {uri: imageUrl};
    }
    if (
      data?.data?.user?.profile_picture &&
      data.data.user.profile_picture.trim().length > 0
    ) {
      const imageUrl = data.data.user.profile_picture.startsWith('http')
        ? data.data.user.profile_picture
        : `${image_url}${data.data.user.profile_picture}`;
      return {uri: imageUrl};
    }
    return IMAGE.profileImage;
  };
  useFocusEffect(
    useCallback(() => {
      // Reset the flag so form can update with new data
      hasInitialDataLoaded.current = false;
      setIsInitialLoad(true);
      // Refetch profile data when screen comes into focus
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
          required={{value: true, message: 'Please enter your name'}}
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
          required={{value: true, message: 'Email address required'}}
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
        <Input
          control={control}
          name="address"
          label={'Address	'}
          containerStyle={styles.emailContainer}
          inputProps={{
            placeholder: 'Enter Address',
          }}
          required={{value: true, message: 'Please enter your address'}}
          error={errors}
          maxLength={40}
          inputStyle={styles.inputStyle}
        />

        <View style={styles.locationContainer}>
          <InputCountry
            control={control}
            name="country"
            label={'Country'}
            placeholder={'Country'}
            error={errors}
            required={{value: true, message: 'Country is required'}}
          />
          <InputState
            control={control}
            name="state"
            label={'State'}
            country_id={getCountryIdFromIso2(watchedCountry)}
            placeholder={'State'}
            error={errors}
            required={{value: true, message: 'State is required'}}
          />

          <InputCity
            control={control}
            name="city"
            label={'City'}
            state_id={getStateIdFromName(watchedState)}
            placeholder={'City'}
            error={errors}
            required={{value: true, message: 'City is required'}}
          />
          <Input
            control={control}
            name="pincode"
            label={'Pincode	'}
            // containerStyle={styles.emailContainer}
            inputProps={{
              placeholder: 'Enter Pincode',
            }}
            required={{value: true, message: 'Please enter your pincode'}}
            error={errors}
            maxLength={40}
            inputStyle={styles.inputStyle}
          />
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
});
