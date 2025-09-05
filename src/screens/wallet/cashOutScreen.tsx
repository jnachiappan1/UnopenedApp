import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import {fontSizes} from '../../utils/utils';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, SCREENS} from '../../navigation/mainNavigation';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';
import Button from '../../components/button/buttons';
import Input from '../../components/input/input';
import {useForm} from 'react-hook-form';
import {FlashList} from '@shopify/flash-list';
import PaymentMethodCard from '../../components/card/paymentMethodCard';
import {paymentMethods} from '../../utils/static';
import PayoutCard from '../../components/card/payoutCard';
import BankDetailsCard from '../../components/card/bankDetailsCard';
import {
  getBankAccount,
  getCashOutHistory,
  getCashOutRequest,
  createCashOut,
} from '../../utils/apiAction';
import {useQuery, useMutation} from '@tanstack/react-query';
import {showLoader} from '../../components/loader/loader';
import {showAlert} from '../../components/cAlert';
import {handleError, handleSettled} from '../../utils/method';

type CashOutScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.CashOutScreen
>;

const CashOutScreen: React.FC<CashOutScreenProps> = ({navigation}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [paymentError, setPaymentError] = useState(false);

  // Fetch bank account details
  const {
    data: bankAccountData,
    isLoading: isLoadingBankDetails,
    refetch: refetchBankDetails,
  } = useQuery({
    queryKey: ['bankAccount'],
    queryFn: getBankAccount,
  });

  // Fetch cash out history
  const {
    data: cashOutHistoryData,
    isLoading: isLoadingHistory,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ['cashOutHistory'],
    queryFn: getCashOutHistory,
  });
  const {
    data: cashOutRequestData,
    isLoading: isLoadingRequest,
    refetch: refetchRequest,
  } = useQuery({
    queryKey: ['cashOutRequest'],
    queryFn: getCashOutRequest,
  });
  console.log(cashOutRequestData, 'cashOutRequestData---------');
  // Show loader while fetching bank details
  useEffect(() => {
    if (isLoadingBankDetails) {
      showLoader(true);
    } else {
      showLoader(false);
    }
  }, [isLoadingBankDetails]);

  const {
    control,
    formState: {errors},
    handleSubmit,
    setValue,
    getValues,
  } = useForm<any>();

  // Cash out mutation
  const {mutate: cashOutMutation, isPending: isCashOutPending} = useMutation({
    mutationFn: createCashOut,
    onSuccess: data => {
      showLoader(false);
      showAlert({
        isVisible: true,
        type: 'success',
        title: 'Success!',
        description: 'Cash out request submitted successfully',
        doneText: 'Okay',
        onDonePress: () => {
          // Refresh bank details and payout history
          refetchBankDetails();
          refetchHistory();
          refetchRequest();
        },
      });
    },
    onError: handleError,
    onSettled: handleSettled,
  });

  const onSubmit = (data: any) => {
    if (!bankAccountData?.data?.bankDetails) {
      showAlert({
        isVisible: true,
        type: 'error',
        title: 'Error!',
        description: 'Please add bank details before proceeding with cash out.',
        doneText: 'Okay',
      });
      return;
    }

    if (!data.amount || parseFloat(data.amount) <= 0) {
      showAlert({
        isVisible: true,
        type: 'error',
        title: 'Error!',
        description: 'Please enter a valid amount.',
        doneText: 'Okay',
      });
      return;
    }

    if (selectedId === null) {
      setPaymentError(true);
      return;
    }

    setPaymentError(false);
    // showLoader(true);

    // Build payload based on selected payment method and call createCashOut API
    const selectedMethod = paymentMethods.find(m => m.id === selectedId);
    const amountValue = parseFloat(data.amount);
    const isVenmo =
      selectedMethod?.icon === 'venmo' ||
      selectedMethod?.title?.toLowerCase() === 'venmo';

    const payload :any= isVenmo
      ? {
          type: 'venmo',
          venmo: 'venmo.com',
          cash_app: 'cash_app.com',
          amount: amountValue,
        }
      : {
          type: 'cash_app' ,
          venmo: 'venmo.com',
          cash_app: 'cash_app.com',
          amount: amountValue,
        };

    cashOutMutation(payload);
  };

  return (
    <TitleBackHeaderContainer isBack title="Cash Out">
      <View style={styles.container}>
        {/* Show existing bank details if available, otherwise show Add Bank Details button */}
        {bankAccountData?.data?.bankDetails ? (
          <BankDetailsCard bankDetails={bankAccountData.data.bankDetails} />
        ) : (
          <Button
            title="Add Bank details"
            style={styles.addBankDetailsButton}
            textStyle={styles.addBankDetailsText}
            onPress={() => navigation.navigate(SCREENS.AddBankDetailsScreen)}
          />
        )}
      </View>
      <View style={styles.container}>
        <Input
          control={control}
          name="amount"
          label="Amount"
          containerStyle={styles.amountContainer}
          inputProps={{
            placeholder: 'Enter Amount',
            keyboardType: 'numeric',
          }}
          required={{value: true, message: 'Please enter amount'}}
          error={errors}
          maxLength={40}
          inputStyle={styles.inputStyle}
        />
        <Text style={styles.titleStyle}>Choose Payment Method</Text>
        <FlatList
          data={paymentMethods}
          scrollEnabled={false}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <PaymentMethodCard
              item={item}
              selected={selectedId === item.id}
              onPress={selectedItem => {
                setSelectedId(selectedItem.id);
                setPaymentError(false); // reset error
              }}
            />
          )}
        />
        {paymentError && (
          <Text style={styles.errorText}>Please select a payment method</Text>
        )}

        <Button
          title={isCashOutPending ? 'Processing...' : 'Cash Out'}
          style={[
            styles.cashOutButton,
            (!bankAccountData?.data?.bankDetails || isCashOutPending) &&
              styles.disabledButton,
          ]}
          textStyle={[
            styles.cashOutButtonText,
            (!bankAccountData?.data?.bankDetails || isCashOutPending) &&
              styles.disabledButtonText,
          ]}
          onPress={
            bankAccountData?.data?.bankDetails && !isCashOutPending
              ? handleSubmit(onSubmit)
              : undefined
          }
          disabled={!bankAccountData?.data?.bankDetails || isCashOutPending}
        />

        {!bankAccountData?.data?.bankDetails && (
          <Text style={styles.helpText}>
            Please add bank details to enable cash out
          </Text>
        )}

        {isCashOutPending && (
          <Text style={styles.helpText}>
            Processing your cash out request...
          </Text>
        )}
      </View>

      <Text style={styles.heading}>Payout History</Text>
      {isLoadingHistory ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading payout history...</Text>
        </View>
      ) : cashOutHistoryData?.data?.transactions &&
        cashOutHistoryData.data.transactions.length > 0 ? (
        <FlashList
          data={cashOutHistoryData.data?.transactions}
          renderItem={({item}) => <PayoutCard item={item} />}
          estimatedItemSize={100}
          keyExtractor={(item: any) =>
            item.id?.toString() || Math.random().toString()
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No payout history available</Text>
        </View>
      )}
    </TitleBackHeaderContainer>
  );
};

export default CashOutScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    marginHorizontal: 15,
    marginTop: 10,
    paddingVertical: 10,
  },
  amountContainer: {
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
    marginVertical: 20,
    marginHorizontal: 0,
    paddingHorizontal: 0,
    alignSelf: 'center',
  },
  cashOutButtonText: {
    color: colors.white,
    fontSize: fontSizes.regular,
    fontFamily: fonts.bold,
  },
  disabledButton: {
    backgroundColor: colors.border,
    opacity: 0.6,
  },
  disabledButtonText: {
    color: colors.text,
  },
  helpText: {
    color: colors.text,
    fontSize: fontSizes.small,
    fontFamily: fonts.regular,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text,
    fontSize: fontSizes.regular,
    fontFamily: fonts.medium,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.text,
    fontSize: fontSizes.regular,
    fontFamily: fonts.medium,
    fontStyle: 'italic',
  },
  addBankDetailsButton: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 1,
    width: '90%',
    marginVertical: 10,
    marginHorizontal: 0,
    paddingHorizontal: 0,
    alignSelf: 'center',
  },
  addBankDetailsText: {
    color: colors.primary,
    fontSize: fontSizes.regular,
    fontFamily: fonts.bold,
  },
  heading: {
    fontSize: fontSizes.extraLarge,
    fontFamily: fonts.bold,
    marginLeft: 16,
    marginBottom: 12,
    color: '#1A1A1A',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontFamily: fonts.regular,
    paddingStart: 16,
    marginTop: -6,
    marginBottom: 10,
  },
});
