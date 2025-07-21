import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import fonts from '../../assets/fonts/fonts';
import Input from '../../components/input/input';
import { useForm } from 'react-hook-form';
import { emailPattern } from '../../utils/utils';
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

type LoginProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.SignUpScreen
>;

const SignUpScreen: React.FC<LoginProps> = ({ route, navigation }) => {
  const [email, setEmail] = useState('johndoe@gmail.com');
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    getValues,
  } = useForm<any>();
  
  return (
    <ImageBackgroundHeader containerStyle={styles.container} hideBack={true}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        <IconsSvg name="box" style={{ alignSelf: 'center' }} />

        <Text style={styles.title}>Get Started now</Text>

        <Text style={styles.subtitle}>
          Create an account or log in to{'\n'}explore about our app
        </Text>

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
          name="phoneNumber"
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
          <GenderDropdown
            control={control}
            name="gender"
            label="Gender"
            required={{
              value: true,
              message: 'Please select gender',
            }}
            error={errors}
            placeholder={'Select Gender'}
          />
        </View>

      
        <Button 
          title={'Create Account'} 
          style={styles.sendOtpButton}
          onPress={handleSubmit((data) => {
            // Handle form submission
            console.log(data);
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