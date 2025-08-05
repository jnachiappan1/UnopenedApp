import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import fonts from '../../assets/fonts/fonts';
import Input from '../../components/input/input';
import { useForm } from 'react-hook-form';
import { capitalizeFirstLetter, emailPattern } from '../../utils/utils';
import Header from '../../components/headerContainer/header';
import ImageBackgroundHeader from '../../components/headerContainer/imageBackgroundHeader';
import IconsSvg from '../../assets/svg/iconsSvg';
import colors from '../../utils/colors';
import Button from '../../components/button/buttons';
import WhiteButton from '../../components/button/whiteButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import DropdownInput from '../../components/input/dropdownInput';
import InputCountry from '../../components/input/inputCountry';
import InputState from '../../components/input/inputState';
import InputCity from '../../components/input/inputCity';
import GenderDropdown from '../../components/input/genderDropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useMutation } from '@tanstack/react-query';
import { signUp } from '../../utils/apiAction';
import { handleError, handleSettled } from '../../utils/method';
import { showAlert } from '../../components/cAlert';
import { showLoader } from '../../components/loader/loader';
import PhoneNumberInputs from '../../components/input/phoneNumberInputs';
import { selectedCountryType } from '../../utils/types';
import PrivacyTermsCheckbox from '../../components/card/privacyTermsCheckbox';

type LoginProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.SignUpScreen
>;

export type InputsRegistration = {
  full_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  gender: string;
  password: string;
};
const SignUpScreen: React.FC<LoginProps> = ({ route, navigation }) => {
  const [email, setEmail] = useState('johndoe@gmail.com');
  const [accepted, setAccepted] = useState(false);
  const [selectedCountry, setPhoneCountry] = useState<selectedCountryType>({
    callingCode: ['91'],
    cca2: 'IN',
    currency: ['INR'],
    flag: 'flag-in',
    name: 'India',
    region: 'Asia',
    subregion: 'Southern Asia',
  });
  const defaultValues = {
    full_name: '',
    email: '',
    country_code: '+91',
    phone_number: '',
    address: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    gender: '',
    password: '',
  };
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    getValues,
  } = useForm<InputsRegistration>({ defaultValues });
  const { mutate } = useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      showLoader(false);
      showAlert({
        isVisible: true,
        type: 'success',
        title: 'Welcome to Unopened!',
        description: 'You can now list your sealed items.',
        doneText: 'Okay',
        onDonePress: () => {
          navigation.navigate(SCREENS.VerifyOTP, {
            otp: data?.data.otp,
            email: watch('email') && getValues('email'),
            type: 'register'
          })
        },
      });
    },
    onError: handleError,
    onSettled: handleSettled,
  });
  const setPhoneCountryData = (item: any) => {
    setPhoneCountry(item);
    setValue('country_code', '+' + item.callingCode[0]);
    // updateFormField('country_code', item.callingCode[0]);
    // updateFormField('currency', item.currency[0]);
  };
  return (
    <ImageBackgroundHeader containerStyle={styles.container} hideBack={true}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        <IconsSvg name="box" style={styles.boxIconStyle} />
        <Text style={styles.title}>Get Started now</Text>
        <Text style={styles.subtitle}>
          Create an account or log in to{'\n'}explore about our app
        </Text>
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
        {/* <Input
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
        /> */}
        <PhoneNumberInputs
          label={'Personal Phone Number'}
          control={control}
          name="phone_number"
          placeholder={'Enter Phone Number'}
          keyboardType="phone-pad"
          //value={getValues('mobileNumber')}
          selectedCountry={selectedCountry}
          setPhoneCountry={setPhoneCountryData}
          required={{
            value: true,
            message: 'Please enter your phone number',
          }}
          error={errors}
          disabled={false}
          style={{}}
          containerStyle={{}}
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
            label={'Pincode'}
            // containerStyle={styles.emailContainer}
            inputProps={{
              placeholder: 'Enter Pincode',
            }}
            required={{
              value: true,
              message: 'Please enter your pincode',
            }}
            error={errors}
            keyboardType="numeric"
            maxLength={40}
            inputStyle={styles.inputStyle}
          />
          <GenderDropdown
            control={control}
            name="gender"
            label="Gender"
            required={{ value: true, message: 'Please select gender' }}
            error={errors}
          />
        </View>
        <PrivacyTermsCheckbox
          value={accepted}
          onValueChange={setAccepted}
          onPrivacyPress={() => {
            navigation.navigate(SCREENS.TermsConditionsScreen,{
              type:"privacy_policy"
            })
          }}
          onTermsPress={() => navigation.navigate(SCREENS.TermsConditionsScreen,{
            type:"terms_and_conditions"
          })}
        />
        <Button
          title={'Create Account'}
          style={styles.sendOtpButton}
          onPress={handleSubmit((data) => {
            showLoader(true);
            mutate(data);
          })}
        />

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(SCREENS.LoginScreen)}
          >
            <Text style={styles.registerLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackgroundHeader>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 24,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 30, // Add padding at bottom for better spacing
  },
  boxIconStyle: { alignSelf: 'center', marginTop: 30 },
  inputStyle: {
    height: 53,
    borderRadius: 160,
    width: '100%',
  },
  title: {
    fontSize: 32,
    color: colors.primaryBlack,
    fontFamily: fonts.bold,
    marginVertical: 10,

  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 17,
    fontFamily: fonts.regular,
    marginBottom: 20,
  },
  locationContainer: {
    marginTop: 20,
    width: '100%'
  },
  sendOtpButton: {
    backgroundColor: colors.primary,
    width: '100%',
    marginTop: 30,
    marginBottom: 20,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  registerText: {
    fontSize: 14,
    color: colors.text,
    fontFamily: fonts.regular,
  },
  registerLink: {
    fontSize: 14,
    color: colors.secondary,
    fontFamily: fonts.bold,
    marginLeft: 5,
  },
  emailContainer: {
    marginTop: 20
  },
});