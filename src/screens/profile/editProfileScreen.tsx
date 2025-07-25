import { Image, ScrollView, StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import IconsSvg from '../../assets/svg/iconsSvg';
import IMAGE from '../../assets/images';
import Input from '../../components/input/input';
import { useForm } from 'react-hook-form';
import fonts from '../../assets/fonts/fonts';
import colors from '../../utils/colors';
import { emailPattern, fontSizes, width } from '../../utils/utils';
import ProfileImageUpload from '../../components/model/profileImageUpload';
import { useFocusEffect } from '@react-navigation/native';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import Button from '../../components/button/buttons';
import InputCountry from '../../components/input/inputCountry';
import InputState from '../../components/input/inputState';
import InputCity from '../../components/input/inputCity';
import GenderDropdown from '../../components/input/genderDropdown';
import { useMutation, useQuery } from '@tanstack/react-query';
import { signUp, updateProfile, viewProfile } from '../../utils/apiAction';
import { showLoader } from '../../components/loader/loader';
import { showAlert } from '../../components/cAlert';
import { handleError, handleSettled } from '../../utils/method';
import { saveUserData } from '../../redux/reducers/user/UserReducer';
import { useDispatch } from 'react-redux';

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
  profileImage?: string;
  country?: string;
  city?: string;
  state?: string;
  gender?: string;
};

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
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
    formState: { errors, isDirty },
  } = useForm<Inputs>({ defaultValues: {
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    gender: '',
  },});

  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      dispatch(saveUserData(data.data.user));
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
  const onSubmit = (formData: Inputs)=> {
    const payload = {
      full_name: formData.full_name,
      email: formData.email,
      phone_number: formData.phone_number,
      address: formData.address,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      pincode: formData.pincode,
      gender: formData.gender,
      profile_image: formData.profileImage || '',
    };
  
    showLoader(true);
    mutate(payload);
  };
  useEffect(() => {
    if (data?.data?.user) {
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
      };
  
      reset(fields); // ✅ this won't set form as dirty
    }
  }, [data, reset]);
  return (
    <TitleBackHeaderContainer title={"My Profile"} isBack>
      <View style={styles.profileContainer}>
        <Image
          source={IMAGE.profileImage}
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
        <Input
          control={control}
          name="address"
          label={'Address	'}
          containerStyle={styles.emailContainer}
          inputProps={{
            placeholder: 'Enter Address',
          }}
          required={{ value: true, message: 'Please enter your address' }}
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
            required={{ value: true, message: 'Country is required' }}
          />
          <InputState
            control={control}
            name="state"
            label={'State'}
            country={watch('country') ? getValues('country') : undefined}
            placeholder={'State'}
            error={errors}
            required={{ value: true, message: 'State is required' }}
          />

          <InputCity
            control={control}
            name="city"
            label={'City'}
            country={watch('country') ? getValues('country') : undefined}
            state={watch('state') ? getValues('state') : undefined}
            placeholder={'City'}
            error={errors}
            required={{ value: true, message: 'City is required' }}
          />
          <Input
            control={control}
            name="pincode"
            label={'Pincode	'}
            // containerStyle={styles.emailContainer}
            inputProps={{
              placeholder: 'Enter Pincode',
            }}
            required={{ value: true, message: 'Please enter your pincode' }}
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
    // borderRadius: 30,
  },
  editIconStyle: {
    position: 'absolute',
    bottom: -10,
    right: 160
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 32,
    backgroundColor: colors.secondary,
  },
  btnContainer: {
    width: "90%",
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
    width: '100%'
  },
  emailContainer: {
    marginTop: 20
  },
});
