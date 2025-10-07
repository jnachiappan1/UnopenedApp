import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import fonts from '../../assets/fonts/fonts';
import Input from '../../components/input/input';
import { useForm } from 'react-hook-form';
import Header from '../../components/headerContainer/header';
import ImageBackgroundHeader from '../../components/headerContainer/imageBackgroundHeader';
import IconsSvg from '../../assets/svg/iconsSvg';
import colors from '../../utils/colors';
import Button from '../../components/button/buttons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DatePiker from '../../components/datePicker/datePiker';
import moment from 'moment';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import { useMutation } from '@tanstack/react-query';
import { addBankAccount } from '../../utils/apiAction';
import { handleError, handleSettled } from '../../utils/method';
import { showAlert } from '../../components/cAlert';
import { showLoader } from '../../components/loader/loader';

type AddBankDetailsProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.AddBankDetailsScreen
>;

export type BankDetailsForm = {
  first_name: string;
  last_name: string;
  dob: {
    day: string;
    month: string;
    year: string;
  };
  phone_number: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  ssn_last_4: string;
  holder_name: string;
  bank_name: string;
  routing_number: string;
  account_number: string;
};

const AddBankDetailsScreen: React.FC<AddBankDetailsProps> = ({ navigation }) => {
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  const defaultValues: BankDetailsForm = {
    first_name: '',
    last_name: '',
    dob: {
      day: '',
      month: '',
      year: '',
    },
    phone_number: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    ssn_last_4: '',
    holder_name: '',
    bank_name: '',
    routing_number: '',
    account_number: '',
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    trigger,
  } = useForm<BankDetailsForm>({ 
    defaultValues,
    mode: 'onChange'
  });

  // Custom validation for dob field
  const validateDob = (value: any) => {
    if (!value || !value.day || !value.month || !value.year) {
      return 'Date of birth is required';
    }
    return true;
  };

  const { mutate } = useMutation({
    mutationFn: addBankAccount,
    onSuccess: (data) => {
      showLoader(false);
      showAlert({
        isVisible: true,
        type: 'success',
        title: 'Success!',
        description: 'Bank account details added successfully',
        doneText: 'Okay',
        onDonePress: () => {
          navigation.goBack();
        },
      });
    },
    onError: handleError,
    onSettled: handleSettled,
  });

  const handleDateChange = (dateString: string) => {
    const date = moment(dateString);
    setSelectedDate(dateString);
    setValue('dob.day', date.format('DD'));
    setValue('dob.month', date.format('MM'));
    setValue('dob.year', date.format('YYYY'));
    setDateModalVisible(false);
    // Trigger validation for the dob field
    trigger('dob');
  };

  const onSubmit = (data: BankDetailsForm) => {
    showLoader(true);
    mutate(data);
  };

  const formatDisplayDate = () => {
    if (selectedDate) {
      return moment(selectedDate).format('MM/DD/YYYY');
    }
    return 'Select Date of Birth';
  };

  return (
    <TitleBackHeaderContainer isBack title="Add Bank Details">
        <View style={styles.content}>
        <Text style={styles.title}>Personal Information</Text>
          <Input
            control={control}
            name="first_name"
            label="First Name"
            containerStyle={styles.halfWidth}
            inputProps={{
              placeholder: 'Enter First Name',
            }}
            required={{ value: true, message: 'First name is required' }}
            error={errors}
            maxLength={30}
            inputStyle={styles.inputStyle}
          />
          <Input
            control={control}
            name="last_name"
            label="Last Name"
            containerStyle={styles.halfWidth}
            inputProps={{
              placeholder: 'Enter Last Name',
            }}
            required={{ value: true, message: 'Last name is required' }}
            error={errors}
            maxLength={30}
            inputStyle={styles.inputStyle}
          />
 

        <TouchableOpacity
          onPress={() => setDateModalVisible(true)}
          activeOpacity={0.9}
          style={styles.dateTimeContainer}>
          <Input
            control={control}
            name="dob"
            label={'Date of Birth *'}
            inputProps={{
              placeholder: 'Select Date of Birth',
              value: selectedDate ? moment(selectedDate).format('DD/MM/YYYY') : '',
            }}
            disabled={true}
            isRightIcon={true}
            rightIconName={'calender'}
            error={errors}
            validate={validateDob}
          />
        </TouchableOpacity>

        <Input
          control={control}
          name="phone_number"
          label="Phone Number"
          containerStyle={styles.inputContainer}
          inputProps={{
            placeholder: 'Enter Phone Number',
          }}
          required={{ value: true, message: 'Phone number is required' }}
          error={errors}
          keyboardType="phone-pad"
          maxLength={15}
          inputStyle={styles.inputStyle}
        />

        <Input
          control={control}
          name="address"
          label="Address"
          containerStyle={styles.inputContainer}
          inputProps={{
            placeholder: 'Enter Address',
          }}
          required={{ value: true, message: 'Address is required' }}
          error={errors}
          maxLength={100}
          inputStyle={styles.inputStyle}
        />

        <View style={styles.row}>
          <Input
            control={control}
            name="city"
            label="City"
            containerStyle={styles.halfWidth}
            inputProps={{
              placeholder: 'Enter City',
            }}
            required={{ value: true, message: 'City is required' }}
            error={errors}
            maxLength={30}
            inputStyle={styles.inputStyle}
          />
          <Input
            control={control}
            name="state"
            label="State"
            containerStyle={styles.halfWidth}
            inputProps={{
              placeholder: 'Enter State',
            }}
            required={{ value: true, message: 'State is required' }}
            error={errors}
            maxLength={30}
            inputStyle={styles.inputStyle}
          />
        </View>

        <Input
          control={control}
          name="postal_code"
          label="Postal Code"
          containerStyle={styles.inputContainer}
          inputProps={{
            placeholder: 'Enter Postal Code',
          }}
          required={{ value: true, message: 'Postal code is required' }}
          error={errors}
          keyboardType="numeric"
          maxLength={10}
          inputStyle={styles.inputStyle}
        />

        <Input
          control={control}
          name="ssn_last_4"
          label="SSN Last 4 Digits"
          containerStyle={styles.inputContainer}
          inputProps={{
            placeholder: 'Enter Last 4 Digits of SSN',
          }}
          required={{ value: true, message: 'SSN last 4 digits are required' }}
          error={errors}
          keyboardType="numeric"
          maxLength={4}
          inputStyle={styles.inputStyle}
        />

        <Text style={styles.title}>Bank Information</Text>

        <Input
          control={control}
          name="holder_name"
          label="Account Holder Name"
          containerStyle={styles.inputContainer}
          inputProps={{
            placeholder: 'Enter Account Holder Name',
          }}
          required={{ value: true, message: 'Account holder name is required' }}
          error={errors}
          maxLength={50}
          inputStyle={styles.inputStyle}
        />

        <Input
          control={control}
          name="bank_name"
          label="Bank Name"
          containerStyle={styles.inputContainer}
          inputProps={{
            placeholder: 'Enter Bank Name',
          }}
          required={{ value: true, message: 'Bank name is required' }}
          error={errors}
          maxLength={50}
          inputStyle={styles.inputStyle}
        />

        <Input
          control={control}
          name="routing_number"
          label="Routing Number"
          containerStyle={styles.inputContainer}
          inputProps={{
            placeholder: 'Enter Routing Number',
          }}
          required={{ value: true, message: 'Routing number is required' }}
          error={errors}
          keyboardType="numeric"
          maxLength={9}
          inputStyle={styles.inputStyle}
        />

        <Input
          control={control}
          name="account_number"
          label="Account Number"
          containerStyle={styles.inputContainer}
          inputProps={{
            placeholder: 'Enter Account Number',
          }}
          required={{ value: true, message: 'Account number is required' }}
          error={errors}
          keyboardType="numeric"
          maxLength={17}
          inputStyle={styles.inputStyle}
        />

        </View>
     
        <Button
          title="Add Bank Details"
          style={styles.submitButton}
          onPress={handleSubmit(onSubmit)}
        />
      <DatePiker
        isVisible={dateModalVisible}
        onClose={() => setDateModalVisible(false)}
        onDateSelect={handleDateChange}
        minDate="1900-01-01"
        maxDate={moment().format('YYYY-MM-DD')}
      />
    </TitleBackHeaderContainer>
  );
};

export default AddBankDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    color: colors.primaryBlack,
    fontFamily: fonts.bold,
    marginTop: 30,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
    marginTop: 20,
  },
  inputContainer: {
    marginTop: 20,
  },
  inputStyle: {
    height: 53,
    borderRadius: 160,
    width: '100%',
  },
  dateContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    color: colors.primaryBlack,
    fontFamily: fonts.medium,
    marginBottom: 8,
  },
  dateButton: {
    height: 53,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.primaryBlack,
    fontFamily: fonts.regular,
  },
  placeholderText: {
    color: colors.text,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontFamily: fonts.regular,
    marginTop: 4,
    marginLeft: 4,
  },
  submitButton: {
    backgroundColor: colors.primary,
    marginBottom: 20,
  },
  dateTimeContainer: {
    width: '100%',
    marginTop: 20,
  },
});
