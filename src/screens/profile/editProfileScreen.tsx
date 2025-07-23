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
import ImageUpload from '../../components/model/profileImageUpload';
import { useFocusEffect } from '@react-navigation/native';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import Button from '../../components/button/buttons';
import InputCountry from '../../components/input/inputCountry';
import InputState from '../../components/input/inputState';
import InputCity from '../../components/input/inputCity';
import GenderDropdown from '../../components/input/genderDropdown';

type EditProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.EditProfileScreen
>;

type Inputs = {
  name: string;
  pincode: string;
  email?: string;
  address?: string;
  profileImage?: string;
  country?: string;
  state?: string;
  gender?: string;
};

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<Inputs>();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {

    }, []),
  );
  const onSubmit = (data: Inputs) => {

  };

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
          name="name"
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
        // disabled={isFormChanged ? false : true}
      />

      <ImageUpload
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
