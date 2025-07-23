import { StyleSheet, View, } from 'react-native';
import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import fonts from '../../assets/fonts/fonts';
import Input from '../../components/input/input';
import { useForm } from 'react-hook-form';
import { fontSizes, height } from '../../utils/utils';
import colors from '../../utils/colors';
import { errorMsg } from '../../utils/types';
import { showAlert } from '../../components/cAlert';
import { showLoader } from '../../components/loader/loader';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import Button from '../../components/button/buttons';

type ChangePasswordScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.ChangePasswordScreen
>;

type Inputs = {
  currentPassword: string;
  newPassword: string;      
  confirmPassword: string;
};

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({
  navigation,
}) => {
  const defaultValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
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
  const newPassword = watch('newPassword');

  return (
    <TitleBackHeaderContainer title='Change Password' isBack>
      <View style={styles.container}>
        <View style={styles.inputsContainer}>
          <Input
            control={control}
            name="currentPassword"
            label={'Current Password'}
            containerStyle={styles.inputContainer}
            inputProps={{
              placeholder: 'Enter Current Password',
            }}
            required={{ value: true, message: 'Please enter current password' }}
            error={errors}
            maxLength={40}
            inputStyle={styles.inputStyle}
            isPassword
          />
          
          <Input
            control={control}
            name="newPassword"
            label={'New Password'}
            containerStyle={styles.inputContainer}
            inputProps={{
              placeholder: 'Enter New Password',
            }}
            required={{ value: true, message: 'Please enter new password' }}
            pattern={{
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message: 'Password must be at least 8 characters with uppercase, lowercase, number and special character'
            }}
            error={errors}
            maxLength={40}
            inputStyle={styles.inputStyle}
            isPassword
          />
          
          <Input
            control={control}
            name="confirmPassword"
            label={'Confirm New Password'}
            containerStyle={styles.inputContainer}
            inputProps={{
              placeholder: 'Enter Confirm New Password',
            }}
            required={{ value: true, message: 'Please enter confirm new password' }}
            validate={(value: string) => {
              return value === newPassword || 'Passwords do not match';
            }}
            error={errors}
            maxLength={40}
            inputStyle={styles.inputStyle}
            isPassword
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={'Save Changes'}
            style={styles.btnContainer}
            textStyle={styles.btnTextStyle}
            onPress={handleSubmit(submit)}
          />
        </View>
      </View>
    </TitleBackHeaderContainer>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  inputsContainer: {
    height:height/1.26,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
    paddingHorizontal: 16
  },
  inputStyle: {
    height: 53,
    borderRadius: 160,
    width: '100%',
  },
  buttonContainer: {
    flex:1,
    paddingHorizontal: 16,
    // paddingBottom: 30, 
    paddingTop: 20,
  },
  btnContainer: {
    width: "100%",
    backgroundColor: colors.primary,
    alignSelf: 'center',
  },
  btnTextStyle: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.bold,
    color: colors.white,
    textAlign: 'center',
  },
});