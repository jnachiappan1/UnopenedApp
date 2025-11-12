import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
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
  cashOut,
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
  const [useBankDetails, setUseBankDetails] = useState<boolean>(false);

  const {
    data: bankAccountData,
    isLoading: isLoadingBankDetails,
    refetch: refetchBankDetails,
  } = useQuery({
    queryKey: ['bankAccount'],
    queryFn: getBankAccount,
  });

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

  const {
    control,
    formState: {errors},
    handleSubmit,
    setValue,
    getValues,
  } = useForm<any>();

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
          refetchBankDetails();
          refetchHistory();
          refetchRequest();
          navigation.goBack();
        },
      });
    },
    onError: handleError,
    onSettled: handleSettled,
  });

  const {mutate: bankCashOutMutation, isPending: isBankCashOutPending} =
    useMutation({
      mutationFn: cashOut,
      onSuccess: data => {
        showLoader(false);
        showAlert({
          isVisible: true,
          type: 'success',
          title: 'Success!',
          description: 'Cash out request submitted successfully',
          doneText: 'Okay',
          onDonePress: () => {
            refetchBankDetails();
            refetchHistory();
            refetchRequest();
            navigation.goBack();
          },
        });
      },
      onError: handleError,
      onSettled: handleSettled,
    });

  const onSubmit = (data: any) => {
    if (bankAccountData?.data?.verified === null) {
      showAlert({
        isVisible: true,
        type: 'error',
        title: 'Error!',
        description:
          'Your bank details are under verification once approved you will be able to cash out',
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

    const amountValue = parseFloat(data.amount);

    if (useBankDetails && bankAccountData?.data?.bankDetails) {
      bankCashOutMutation({amount: amountValue.toString()});
      return;
    }

    if (selectedId === null) {
      setPaymentError(true);
      return;
    }

    setPaymentError(false);
    const selectedMethod = paymentMethods.find(m => m.id === selectedId);
    const isVenmo =
      selectedMethod?.icon === 'venmo' ||
      selectedMethod?.title?.toLowerCase() === 'venmo';
    const venmoHandle: string | undefined = getValues('venmo');
    const cashAppHandle: string | undefined = getValues('cash_app');

    if (isVenmo && !venmoHandle) {
      showAlert({
        isVisible: true,
        type: 'error',
        title: 'Error!',
        description: 'Please enter your Venmo username.',
        doneText: 'Okay',
      });
      return;
    }

    if (!isVenmo && !cashAppHandle) {
      showAlert({
        isVisible: true,
        type: 'error',
        title: 'Error!',
        description: 'Please enter your Cash App $Cashtag.',
        doneText: 'Okay',
      });
      return;
    }

    const payload: any = isVenmo
      ? {
          type: 'venmo',
          venmo: venmoHandle,
          cash_app: '',
          amount: amountValue,
        }
      : {
          type: 'cash_app',
          venmo: '',
          cash_app: cashAppHandle,
          amount: amountValue,
        };

    cashOutMutation(payload);
  };

  return (
    <TitleBackHeaderContainer isBack title="Cash Out">
      <View style={styles.container}>
        <Text style={styles.titleStyle}>Choose Payment Method</Text>

        <Text style={styles.titleStyle}>
          For Instant CashOut Add Bank Details
        </Text>
        {bankAccountData?.data?.bankDetails ? (
          <>
            <View style={{marginTop: 15}}>
              <PaymentMethodCard
                item={{
                  id: -1,
                  title: 'Use Bank Account',
                  icon: 'addCard',
                }}
                selected={useBankDetails}
                onPress={() => {
                  const next = !useBankDetails;
                  setUseBankDetails(next);
                  if (next) {
                    setSelectedId(null);
                    setValue('venmo', '');
                    setValue('cash_app', '');
                  }
                  setPaymentError(false);
                }}
              />
              {useBankDetails && bankAccountData?.data?.bankDetails && (
                <>
                  <BankDetailsCard
                    bankDetails={bankAccountData.data.bankDetails}
                  />
                  <View style={{marginTop: 15}}>
                    <Button
                      title="Change Bank Account"
                      style={styles.changeBankDetailsButton}
                      textStyle={styles.changeBankDetailsText}
                      onPress={() =>
                        navigation.navigate(SCREENS.ChangeBankDetailsScreen)
                      }
                    />
                  </View>
                </>
              )}
            </View>
          </>
        ) : (
          <Button
            title="Add Bank details"
            style={styles.addBankDetailsButton}
            textStyle={styles.addBankDetailsText}
            onPress={() => navigation.navigate(SCREENS.AddBankDetailsScreen)}
          />
        )}
        {!useBankDetails && (
          <FlatList
            data={paymentMethods}
            scrollEnabled={false}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => {
              const isSelected = selectedId === item.id;
              const isVenmoItem =
                item.icon === 'venmo' || item.title?.toLowerCase() === 'venmo';
              const fieldName = isVenmoItem ? 'venmo' : 'cash_app';
              const placeholder = isVenmoItem ? 'Venmo Id' : 'Cash App Id';
              const requiredMessage = isVenmoItem
                ? 'Please enter Venmo Id'
                : 'Please enter Cash App Id';

              return (
                <View>
                  <PaymentMethodCard
                    item={item}
                    selected={isSelected}
                    onPress={selectedItem => {
                      if (selectedId !== selectedItem.id) {
                        setValue('venmo', '');
                        setValue('cash_app', '');
                      }
                      setSelectedId(selectedItem.id);
                      setPaymentError(false);
                    }}
                  />
                  {isSelected && (
                    <View style={styles.methodInputContainer}>
                      <Input
                        control={control}
                        name={fieldName}
                        label={''}
                        containerStyle={styles.amountContainer}
                        inputProps={{
                          placeholder,
                        }}
                        required={{value: true, message: requiredMessage}}
                        error={errors}
                        maxLength={40}
                        inputStyle={styles.inputStyle}
                      />
                    </View>
                  )}
                </View>
              );
            }}
            style={{marginTop: 15}}
          />
        )}
        {!useBankDetails && paymentError && (
          <Text style={styles.errorText}>Please select a payment method</Text>
        )}
        <Text style={styles.titleStyle}>
          Note: Wallet CashOut May Take 1-3 Business Days
        </Text>
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
          keyboardType={'numeric'}
        />

        <Button
          title={
            isCashOutPending || isBankCashOutPending
              ? 'Processing...'
              : 'Cash Out'
          }
          style={[styles.cashOutButton]}
          textStyle={[styles.cashOutButtonText]}
          onPress={handleSubmit(onSubmit)}
        />

        <Text style={styles.deductionText}>
          {'2.9 % Of amount will be deducted while cash out '}
        </Text>
        {(isCashOutPending || isBankCashOutPending) && (
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
  methodInputContainer: {
    marginTop: -4,
    marginBottom: 6,
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
  deductionText: {
    color: colors.primary,
    fontSize: fontSizes.regular,
    fontFamily: fonts.medium,
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
  changeBankDetailsButton: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 1,
    width: '90%',
    marginVertical: 10,
    marginHorizontal: 0,
    paddingHorizontal: 0,
    alignSelf: 'center',
  },
  changeBankDetailsText: {
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
