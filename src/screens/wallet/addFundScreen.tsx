import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

type AddFundScreenProps = NativeStackScreenProps<RootStackParamList, SCREENS.AddFundScreen>;
type Inputs = {
  amount: string;
};
const AddFundScreen: React.FC<AddFundScreenProps> = ({ navigation }) => {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const defaultValues = {
    amount: '',
  };
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<Inputs>();

  const handleQuickSelect = (value: number) => {
    setValue('amount', value.toString());
  };

  const onSubmit = (data: any) => {
    if (!selectedPayment) {
      Alert.alert('Please select a payment method.');
      return;
    }

    console.log('Amount:', data.amount);
    console.log('Payment Method:', selectedPayment);
  };

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

        <FlatList
          data={quickAmounts}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.quickBtn}
              onPress={() => handleQuickSelect(item)}
            >
              <Text style={styles.quickText}>${item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.quickRow}
        />

        <Text style={styles.titleStyle}>Select Payment Method</Text>

        <FlatList
          data={paymentOptions}
          keyExtractor={(item) => item.icon}
          renderItem={({ item }) => (
            <PaymentMethodOption
              title={item.title}
              icon={item.icon}
              selected={selectedPayment === item.icon}
              onPress={(selectedItem) => {
                console.log('Selected payment method:', selectedItem);
                setSelectedPayment(selectedItem.icon);
              }}
            />
          )}
          scrollEnabled={false}
          style={styles.paymentOptionsContainer}
        />

        <Button title={'Cash Out'} style={styles.cashOutButton} onPress={handleSubmit(onSubmit)} />
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
  quickRow: {
    paddingHorizontal: 10,
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
