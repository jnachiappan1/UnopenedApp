/* eslint-disable @typescript-eslint/no-shadow */
import {StyleSheet, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {IColors, getColors} from '../../utils/colors';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import fonts from '../../assets/fonts/fonts';
import {CommonActions} from '@react-navigation/native';
import {RootStackParamList, SCREENS} from '../../navigation/mainNavigation';
import {useTimer} from '../../components/hooks/useTimer';
import Button from '../../components/button/buttons';
import ImageBackgroundHeader from '../../components/headerContainer/imageBackgroundHeader';
import InputOtp from '../../components/input/InputOTP';
import {showLoader} from '../../components/loader/loader';
import {useMutation} from '@tanstack/react-query';
import {showAlert} from '../../components/cAlert';
import {capitalizeFirstLetter} from '../../utils/utils';
import {verifyOtpApi, resendOtpApi} from '../../utils/apiAction';
import {handleError, handleSettled} from '../../utils/method';
import {ResendInputPayloadType} from '../../utils/payload';
import {useDispatch, useSelector} from 'react-redux';
import {
  saveUserData,
  saveUserType,
  setAuthToken,
} from '../../redux/reducers/user/UserReducer';
import {IRootState} from '../../redux/store';

type Inputs = {
  otp: string;
};
type ResendInput = {
  email: string;
};
type VerifyOTPProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.VerifyOTP
>;

const VerifyOTP: React.FC<VerifyOTPProps> = ({route, navigation}) => {
  let userType = useSelector((type: any) => type.user.userType);
  const fcmToken = useSelector((user: IRootState) => user.user.fcmToken);

  const {otp, email, type} = route.params;
  const [resendOtp, setResendOtp] = useState('');
  const dispatch = useDispatch();
  const colors = getColors();
  const styles = getStyles(colors);
  const {
    control,
    formState: {errors},
    handleSubmit,
  } = useForm<Inputs>();

  const {pause, reset, seconds, start} = useTimer({
    initialSeconds: 5,
    initiallyRunning: true,
  });

  useEffect(() => {
    if (seconds <= 0) {
      pause();
    }
  }, [seconds, pause]);

  const {mutate: resendMutate} = useMutation({
    mutationFn: (data: ResendInput) => resendOtpApi(type!, data),
    onSuccess: async (data: any) => {
      showLoader(false);
      setResendOtp(data?.data?.otp);
      showAlert({
        isVisible: true,
        type: 'success',
        title: 'OTP Resent',
        description: capitalizeFirstLetter(data?.message),
        doneText: 'Okay',
        onDonePress: () => {
          reset();
          start();
        },
      });
    },
    onError: handleError,
    onSettled: handleSettled,
  });
  const onResendOTP = () => {
    if (!email || !type) return;
    const payload: ResendInput = {email};
    showLoader(true);
    resendMutate(payload);
  };

  const renderCounting = (
    <Text style={styles.resendOTPTxt}>
      {'Resend code in'}{' '}
      <Text style={styles.digitTxt}>
        {'00:'}
        {seconds.toString().padStart(2, '0')}
      </Text>
    </Text>
  );

  const renderResendOTP = (
    <Text style={styles.resendOTPTxt} onPress={onResendOTP}>
      {"Didn't receive an OTP? "}{' '}
      <Text style={styles.digitTxt}>{'Resend again'}</Text>
    </Text>
  );

  const showResendTxt = seconds > 0 ? renderCounting : renderResendOTP;
  const {mutate} = useMutation({
    mutationFn: ({
      type,
      payload,
    }: {
      type: string;
      payload: ResendInputPayloadType;
    }) => verifyOtpApi(type, payload),
    onSuccess: async (data: any) => {
      showLoader(false);
      const newType = userType ? userType : 'buyer';
      dispatch(saveUserType(newType));
      dispatch(setAuthToken(data.data.token));
      dispatch(saveUserData(data.data.user));
      showAlert({
        isVisible: true,
        type: 'success',
        title: 'OTP Verified',
        description: capitalizeFirstLetter(data?.message),
        doneText: 'Okay',
        onDonePress: () => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: SCREENS.BottomTab}],
            }),
          );
        },
      });
    },
    onError: handleError,
    onSettled: handleSettled,
  });

  const submit = (data: Inputs) => {
    if (!type) return;

    const payload = {
      email,
      ...data,
      ...(type === 'login' || type === 'register' ? {fcmToken: fcmToken} : {}),
    };

    showLoader(true);
    mutate({type, payload});
  };

  return (
    <ImageBackgroundHeader
      title={''}
      containerStyle={styles.container}
      onBackPress={() => navigation.goBack()}>
      <Text style={styles.subHeading}>{'Verify OTP'}</Text>
      <Text style={styles.codeSentText}>
        {'Please enter 6 digit code we sent to you on'}
      </Text>
      <Text style={styles.emailText}>{email}</Text>
      <Text style={styles.emailText}>
        {'Otp: '}
        {resendOtp ? resendOtp : otp}
      </Text>

      <InputOtp
        control={control}
        name="otp"
        label=""
        required={{value: true, message: 'Required OTP'}}
        pattern={{
          value: /^[0-9]{6}$/,
          message: 'OTP must be a 6-digit number',
        }}
        error={errors}
      />
      <Button
        title={'Verify'}
        style={styles.buttonStyle}
        onPress={handleSubmit(submit)}
      />
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
    otpContainer: {marginTop: 20},
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
    scrollContainer: {
      flexGrow: 0.5,
      justifyContent: 'center',
    },
  });
