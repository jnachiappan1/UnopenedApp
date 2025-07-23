import { ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import fonts from '../../assets/fonts/fonts';
import Input from '../../components/input/input';
import { useForm } from 'react-hook-form';
import { emailPattern, fontSizes, height, OS } from '../../utils/utils';
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
import InputOtp from '../../components/input/InputOTP';
import { useTimer } from '../../components/hooks/useTimer';

type ProfileVerifyScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.ProfileVerifyScreen
>;

type Inputs = {
  otp: string;
};

const ProfileVerifyScreen: React.FC<ProfileVerifyScreenProps> = ({
  navigation,
}) => {
  const defaultValues = {
    otp: ''
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({ defaultValues });
  const submit = (data: Inputs) => {
    console.log('Password change data:', data);

  };

  const { pause, reset, running, seconds, start, stop } = useTimer({
    initialSeconds: 30,
    initiallyRunning: false,
  });

  const onSetCounting = () => {
    if (seconds >= 0) {
      const timerId = setInterval(() => {
        start();
      }, 1000);

      return () => clearInterval(timerId);
    } else {
      pause();
    }
  };

  useEffect(() => {
    onSetCounting();
  }, [seconds]);

  const onResendOTP = () => { };

  const renderCounting = (
    <Text style={styles.resendOTPTxt}>
      {'Resend code in'}{' '}
      <Text style={styles.digitTxt}>
        {'00:'}
        {seconds}
      </Text>{' '}
      {/* {('Seconds.')} */}
    </Text>
  );

  const renderResendOTP = (
    <Text style={styles.resendOTPTxt} onPress={onResendOTP}>
      {"Didn't receive an OTP,"}{' '}
      <Text style={styles.digitTxt}>{'Resend again'}</Text>
    </Text>
  );
  const showResendTxt = seconds >= 0 ? renderCounting : renderResendOTP;

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
        <Text style={styles.subHeading}>{'Verify OTP'}</Text>
        <Text style={styles.codeSentText}>
          {'Please enter 4 digit code we sent to you on'}
        </Text>
        <Text style={styles.emailText}>{'Loisbecket@gmail.com'}</Text>
        <InputOtp
          control={control}
          name="otp"
          label=""
          required={{ value: true, message: 'Required OTP' }}
          pattern={{
            value: /^[0-9]{4}$/,
            message: 'OTP must be a 4-digit number',
          }}
          error={errors}
        />
        <Button title={'Verify'} style={styles.buttonStyle} onPress={() => navigation.navigate(SCREENS.BottomTab)} />
        {showResendTxt}
      </ImageBackground>
    </IconBackHeaderContainer>
  );
};

export default ProfileVerifyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 24,
  },
  emailText: {
    fontFamily: fonts.bold,
    color: '#268740',
    fontSize: 14,
    marginVertical: 5,
  },
  subHeading: {
    fontFamily: fonts.bold,
    fontWeight: '400',
    color: colors.primaryBlack,
    fontSize: 32,
    marginVertical: 20,
    marginTop: 60
  },
  codeSentText: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: 14,
  },
  otpContainer: { marginTop: 20 },
  resendOTPTxt: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: fonts.regular,
    color: colors.text,
    marginBottom: 15,
    marginVertical: 10,
  },
  digitTxt: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  buttonStyle: {
    backgroundColor: colors.primary,
    width: '100%',
    alignSelf: 'center',
  },
});