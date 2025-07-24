import { ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import fonts from '../../assets/fonts/fonts';
import Input from '../../components/input/input';
import { useForm } from 'react-hook-form';
import { capitalizeFirstLetter, emailPattern, fontSizes, height, OS } from '../../utils/utils';
import colors from '../../utils/colors';
import { errorMsg } from '../../utils/types';
import { showAlert } from '../../components/cAlert';
import { showLoader } from '../../components/loader/loader';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import Button from '../../components/button/buttons';
import IconBackHeaderContainer from '../../components/headerContainer/iconBackHeaderContainer';
import IconsSvg from '../../assets/svg/iconsSvg';
import WhiteButton from '../../components/button/whiteButton';
import IMAGE from '../../assets/images';
import { handleError, handleSettled } from '../../utils/method';
import { useMutation } from '@tanstack/react-query';
import { signInApi } from '../../utils/apiAction';

type ProfileLoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.ProfileLoginScreen
>;

type Inputs = {
  email: string;
};

const ProfileLoginScreen: React.FC<ProfileLoginScreenProps> = ({
  navigation,
}) => {
  const defaultValues = {
    email: '',
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({ defaultValues });

  const {mutate} = useMutation({
    mutationFn: (data: Inputs) => signInApi('otp', data),
    onSuccess: async (data: any) => {
      console.log(data,"data---");
        showAlert({
          isVisible: true,
          type: 'success',
          title: 'Sign In',
          description: capitalizeFirstLetter(data?.message),
          doneText: 'Okay',
          onDonePress: () => {
            // navigation.navigate(SCREENS.ProfileVerifyScreen)
            navigation.navigate(SCREENS.ProfileVerifyScreen, {
              otp: data?.data.otp,
              email: data?.data?.user?.email,
              type: 'login',
            });
          },
        });
    },
    onError: handleError,
    onSettled:handleSettled
  });

  const submit = (userData: Inputs) => {
    showLoader(true);
    mutate(userData);
  };
  return (
    <IconBackHeaderContainer isBack>
      <ImageBackground
        source={IMAGE.imageBackground}
        resizeMode="contain"
        style={{
          height: height,
          paddingHorizontal: 20,
        }}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <View style={styles.content}>
          <IconsSvg name="box" />
          <Text style={styles.title}>Get Started now</Text>
          <Text style={styles.subtitle}>
            Create an account or log in to{'\n'}explore about our app
          </Text>
          <View style={styles.inputContainer}>
            <Input
              control={control}
              name="email"
              label={'Enter Email Address'}
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
              inputStyle={{ height: 53, borderRadius: 160 }}
            />
          </View>

          <Button
            title={'Send OTP'}
            style={styles.sendOtpButton}
            onPress={handleSubmit(submit)}
          />
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate(SCREENS.SignUpScreen)}>
              <Text style={styles.registerLink}>Register Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </IconBackHeaderContainer>
  );
};

export default ProfileLoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40
  },

  title: {
    fontSize: 32,
    color: colors.primaryBlack,
    fontFamily: OS === 'ios' ? "Satoshi" : fonts.bold,
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 17,
    fontFamily: fonts.regular,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
    marginVertical: 20
  },
  sendOtpButton: {
    backgroundColor: colors.primary,
    width: '100%'
  },
  sendOtpText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: fonts?.medium || 'System',
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30
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
  },
  emailContainer: { marginTop: 20 },
});