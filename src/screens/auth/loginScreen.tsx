import {View, Text, TouchableOpacity, StyleSheet, Keyboard} from 'react-native';
import React from 'react';
import fonts from '../../assets/fonts/fonts';
import Input from '../../components/input/input';
import {useForm} from 'react-hook-form';
import {capitalizeFirstLetter, emailPattern, OS} from '../../utils/utils';
import ImageBackgroundHeader from '../../components/headerContainer/imageBackgroundHeader';
import IconsSvg from '../../assets/svg/iconsSvg';
import colors from '../../utils/colors';
import Button from '../../components/button/buttons';
import WhiteButton from '../../components/button/whiteButton';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, SCREENS} from '../../navigation/mainNavigation';
import {useDispatch, useSelector} from 'react-redux';
import {useContainer} from '../../components/hooks/useContainer';
import {showLoader} from '../../components/loader/loader';
import {showAlert} from '../../components/cAlert';
import {useMutation} from '@tanstack/react-query';
import {signInApi} from '../../utils/apiAction';
import {handleError, handleSettled} from '../../utils/method';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type LoginProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.LoginScreen
>;
type Inputs = {
  email: string;
};

const LoginScreen: React.FC<LoginProps> = ({route, navigation}) => {
  const container = useContainer();

  const {
    control,
    formState: {errors},
    handleSubmit,
  } = useForm<any>();
  const {mutate} = useMutation({
    mutationFn: (data: Inputs) => signInApi('otp', data),
    onSuccess: async (data: any) => {
      showLoader(false);
      showAlert({
        isVisible: true,
        type: 'success',
        title: 'Sign In',
        description: capitalizeFirstLetter(data?.message),
        doneText: 'Okay',
        onDonePress: () => {
          navigation.navigate(SCREENS.VerifyOTP, {
            otp: data?.data.otp,
            email: data?.data?.user?.email,
            type: data?.data?.user?.verify_account ? 'login' : 'register',
          });
        },
      });
    },
    onError: handleError,
    onSettled: handleSettled,
  });

  const submit = (userData: Inputs) => {
    Keyboard.dismiss();
    showLoader(true);
    mutate(userData);
  };
  return (
    <ImageBackgroundHeader
      containerStyle={[container, styles.container]}
      hideBack={true}
      onBackPress={() => navigation.goBack()}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.content}
      >
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
            required={{value: true, message: 'Email address required'}}
            pattern={{
              value: emailPattern,
              message: 'Invalid email format',
            }}
            error={errors}
            keyboardType="email-address"
            maxLength={40}
            inputStyle={{height: 53, borderRadius: 160}}
          />
        </View>

        <Button
          title={'Send OTP'}
          style={styles.sendOtpButton}
          onPress={handleSubmit(submit)}
        />
        <WhiteButton
          title={'Login as Guest'}
          style={styles.guestButton}
          onPress={() => navigation.navigate(SCREENS.BottomTab)}
        />
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(SCREENS.SignUpScreen)}>
            <Text style={styles.registerLink}>Register Now</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackgroundHeader>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40,
  },

  title: {
    fontSize: 32,
    color: colors.primaryBlack,
    fontFamily: OS === 'ios' ? 'Satoshi' : fonts.bold,
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
  },

  sendOtpButton: {
    backgroundColor: colors.primary,
    width: '100%',
  },
  sendOtpText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: fonts?.medium || 'System',
  },
  guestButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  guestText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: fonts?.medium || 'System',
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  emailContainer: {marginTop: 20},
});
