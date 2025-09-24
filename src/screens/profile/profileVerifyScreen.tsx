import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, SCREENS} from '../../navigation/mainNavigation';
import fonts from '../../assets/fonts/fonts';
import Input from '../../components/input/input';
import {useForm} from 'react-hook-form';
import {
  capitalizeFirstLetter,
  emailPattern,
  fontSizes,
  height,
  OS,
} from '../../utils/utils';
import colors from '../../utils/colors';
import {errorMsg} from '../../utils/types';
import {showAlert} from '../../components/cAlert';
import {showLoader} from '../../components/loader/loader';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import Button from '../../components/button/buttons';
import IconBackHeaderContainer from '../../components/headerContainer/iconBackHeaderContainer';
import IconsSvg from '../../assets/svg/iconsSvg';
import WhiteButton from '../../components/button/whiteButton';
import IMAGE from '../../assets/images';
import InputOtp from '../../components/input/InputOTP';
import {useTimer} from '../../components/hooks/useTimer';
import {handleError, handleSettled} from '../../utils/method';
import {useMutation} from '@tanstack/react-query';
import {resendOtpApi, verifyOtpApi} from '../../utils/apiAction';
import {ResendInputPayloadType} from '../../utils/payload';
import {
  saveUserData,
  setAuthToken,
} from '../../redux/reducers/user/UserReducer';
import {CommonActions} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../redux/store';

type ProfileVerifyScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.ProfileVerifyScreen
>;

type Inputs = {
  otp: string;
};
type ResendInput = {
  email: string;
};

const ProfileVerifyScreen: React.FC<ProfileVerifyScreenProps> = ({
  navigation,
  route,
}) => {
  const {otp, email, type} = route.params;
  const [resendOtp, setResendOtp] = useState('');
  const dispatch = useDispatch();
  const fcmToken = useSelector((user: IRootState) => user.user.fcmToken);
  console.log(fcmToken, 'fcmToken===');

  const defaultValues = {
    otp: '',
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm<Inputs>({defaultValues});
  const {mutate} = useMutation({
    mutationFn: ({type, payload}: {type: string; payload: any}) =>
      verifyOtpApi(type, payload),
    onSuccess: async (data: any) => {
      showLoader(false);
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

    // const payload = {
    //   email: email,
    //   ...data,
    // };
    const payload = {
      email,
      ...data,
      ...(type === 'login' || type === 'register' ? {fcmToken: fcmToken} : {}),
    };
    console.log(payload, 'payload===');
    console.log(type, 'type===');

    showLoader(true);
    mutate({type, payload});
  };

  const {pause, reset, running, seconds, start, stop} = useTimer({
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

  const {mutate: resendMutate} = useMutation({
    mutationFn: (data: ResendInput) => resendOtpApi(type!, data),
    onSuccess: async (data: any) => {
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
          horizontalPadding={40}
          error={errors}
        />
        <Button
          title={'Verify'}
          style={styles.buttonStyle}
          onPress={handleSubmit(submit)}
        />
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
    marginTop: 60,
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
});
