import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import { fontSizes } from '../../utils/utils';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';
import Button from '../../components/button/buttons';
import Input from '../../components/input/input';
import { useForm } from 'react-hook-form';
import { paymentOptions, quickAmounts } from '../../utils/static';
import PaymentMethodOption from '../../components/card/paymentMethodOption';
import { useMutation } from '@tanstack/react-query';
import { makePayment } from '../../utils/apiAction';
import { useStripe } from '@stripe/stripe-react-native';
import { useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';
import { showLoader } from '../../components/loader/loader';
import { showAlert } from '../../components/cAlert';

type AddFundScreenProps = NativeStackScreenProps<RootStackParamList, SCREENS.AddFundScreen>;
type Inputs = {
  amount: string;
};

const AddFundScreen: React.FC<AddFundScreenProps> = ({ navigation }) => {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const userData = useSelector((user: IRootState) => user.user.userData);
  
  const defaultValues = {
    amount: '',
  };
  
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<Inputs>();

  const amount = watch('amount');

  const handleQuickSelect = (value: number) => {
    setValue('amount', value.toString());
  };

  // Add Stripe payment mutation
  const { mutate: addFundsMutation } = useMutation({
    mutationFn: (data: { amount: string }) => 
      makePayment('add_funds', null, { amount: data.amount, address_id: 0 }),
    onSuccess: (data: any) => {
      console.log('Add funds API response:', data);
      handleStripePayment(data);
    },
    onError: (error: any) => {
      showLoader(false);
      showAlert({
        isVisible: true,
        type: 'error',
        title: 'Error',
        description: 'Failed to initialize payment. Please try again.',
      });
    },
  });

  const handleStripePayment = async (paymentResponse: any) => {
    try {
      console.log('Processing Stripe payment for add funds...');
      
      if (paymentResponse?.data?.status !== 'success') {
        showLoader(false);
        showAlert({
          isVisible: true,
          type: 'error',
          title: 'Payment Error',
          description: 'Failed to create payment intent. Please try again.',
        });
        return;
      }

      const { clientSecret, ephemeralKey, customer, paymentIntentId } = paymentResponse.data;
      
      // Validate Stripe credentials
      if (!clientSecret || !ephemeralKey || !customer) {
        showLoader(false);
        showAlert({
          isVisible: true,
          type: 'error',
          title: 'Payment Configuration Error',
          description: 'Invalid payment credentials received. Please try again.',
        });
        return;
      }
      
      // Initialize Stripe payment sheet
      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Unopened Mobile',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: clientSecret,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: userData?.full_name || 'Customer',
        },
        returnURL: 'https://your-app.com/return',
      });

      if (error) {
        showLoader(false);
        showAlert({
          isVisible: true,
          type: 'error',
          title: 'Payment Initialization Error',
          description: `Failed to initialize payment: ${error.message}`,
        });
        return;
      }

      // Present Stripe payment sheet
      const { error: presentError } = await presentPaymentSheet();
      
      if (presentError) {
        showLoader(false);
        showAlert({
          isVisible: true,
          type: 'error',
          title: 'Payment Error',
          description: `Payment failed: ${presentError.message}`,
        });
      } else {
        // Payment successful
        showLoader(false);
        showAlert({
          isVisible: true,
          type: 'success',
          title: 'Success',
          description: `Successfully added $${amount} to your wallet!`,
          doneText: 'OK',
          onDonePress: () => {
            navigation.goBack();
          },
        });
      }
    } catch (error: any) {
      console.error('Stripe payment error:', error);
      showLoader(false);
      showAlert({
        isVisible: true,
        type: 'error',
        title: 'Error',
        description: 'Payment failed. Please try again.',
      });
    }
  };

  const onSubmit = (data: Inputs) => {
    if (!selectedPayment) {
      Alert.alert('Please select a payment method.');
      return;
    }

    if (!data.amount || parseFloat(data.amount) <= 0) {
      Alert.alert('Please enter a valid amount.');
      return;
    }

    if (selectedPayment === 'stripe') {
      showLoader(true);
      addFundsMutation({ amount: data.amount });
    } else {
      // Handle other payment methods here
      Alert.alert('Payment method not implemented yet.');
    }
  };

  // Add Stripe to payment options with proper typing
  const enhancedPaymentOptions = [
    ...paymentOptions.map(option => ({ ...option, id: option.title.toLowerCase().replace(/\s+/g, '_') })),
    {
      title: 'Stripe',
      icon: 'securePayment' as const,
      id: 'stripe'
    }
  ];

  return (
    <TitleBackHeaderContainer isBack title="Add Funds">
      <View style={styles.container}>
        <Input
          control={control}
          name="amount"
          label={'Add Money'}
          containerStyle={styles.amountContainer}
          inputProps={{
            placeholder: 'Enter Amount',
            keyboardType: 'numeric',
          }}
          required={{ value: true, message: 'Please enter amount' }}
          error={errors}
          maxLength={40}
          inputStyle={styles.inputStyle}
        />

        <View style={styles.quickAmountsContainer}>
          {quickAmounts.map((item) => (
            <TouchableOpacity
              key={item.toString()}
              style={styles.quickBtn}
              onPress={() => handleQuickSelect(item)}
            >
              <Text style={styles.quickText}>${item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.titleStyle}>Select Payment Method</Text>

        <View style={styles.paymentOptionsContainer}>
          {enhancedPaymentOptions.map((item) => (
            <PaymentMethodOption
              key={item.id}
              title={item.title}
              icon={item.icon}
              selected={selectedPayment === item.id}
              onPress={(selectedItem) => {
                setSelectedPayment(item.id);
              }}
            />
          ))}
        </View>

        <Button 
          title={'Add Fund'} 
          style={styles.cashOutButton} 
          onPress={handleSubmit(onSubmit)} 
        />
      </View>
    </TitleBackHeaderContainer>
  );
};

export default AddFundScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    marginHorizontal: 15,
    marginTop: 10,
    paddingVertical: 10,
  },
  amountContainer: {
    marginTop: 10,
    paddingStart: 10,
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    marginHorizontal: 0,
    width: '96%',
  },
  titleStyle: {
    fontSize: fontSizes.large,
    fontFamily: fonts.bold,
    color: '#1A1A1A',
    paddingStart: 10,
    paddingVertical: 10,
  },
  cashOutButton: {
    backgroundColor: colors.primary,
    width: '90%',
    marginVertical: 10,
    marginHorizontal: 0,
    paddingHorizontal: 0,
    alignSelf: 'center',
  },
  quickAmountsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  quickBtn: {
    backgroundColor: '#E6ECDE',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 10,
    marginVertical: 10,
  },
  quickText: {
    fontSize: 14,
    color: '#1C1C1E',
  },
  paymentOptionsContainer: {
    marginHorizontal: 10,
  },
});
