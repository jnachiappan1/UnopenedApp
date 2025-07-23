/* eslint-disable @typescript-eslint/no-shadow */
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IColors, getColors } from '../../utils/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import fonts from '../../assets/fonts/fonts';
import { CommonActions } from '@react-navigation/native';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import { useTimer } from '../../components/hooks/useTimer';
import Header from '../../components/headerContainer/header';
import Button from '../../components/button/buttons';
import InputPassword from '../../components/input/inputPassword';
import HeaderContainer from '../../components/headerContainer/headerContainer';
import ImageBackgroundHeader from '../../components/headerContainer/imageBackgroundHeader';
import InputOtp from '../../components/input/InputOTP';

type Inputs = {
  otp: string;
};

type VerifyOTPProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.VerifyOTP
>;

const VerifyOTP: React.FC<VerifyOTPProps> = ({ route, navigation }) => {
  // let userType = useSelector((type: any) => type.user.userType);
  // const {Email, Screen} = route.params;
  // const dispatch = useDispatch();
  const colors = getColors();
  const styles = getStyles(colors);
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>();

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

  const onResendOTP = () => {};

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

  const submit = (data: Inputs) => {};

  return (
    <ImageBackgroundHeader title={''} containerStyle={styles.container}>
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
      <Button title={'Verify'} style={styles.buttonStyle} onPress={()=> navigation.navigate(SCREENS.BottomTab)} />
      {showResendTxt}
    </ImageBackgroundHeader>
  );
};

export default VerifyOTP;

const getStyles = (colors: IColors) =>
  StyleSheet.create({
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
