import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer'
import { fontSizes, width } from '../../utils/utils';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';
import Button from '../../components/button/buttons';
import Input from '../../components/input/input';
import { useForm } from 'react-hook-form';
import { FlashList } from '@shopify/flash-list';
import PaymentMethodCard from '../../components/card/paymentMethodCard';
import { paymentMethods, payoutHistory } from '../../utils/static';
import PayoutCard from '../../components/card/payoutCard';

type CashOutScreenProps = NativeStackScreenProps<RootStackParamList, SCREENS.CashOutScreen>;

const CashOutScreen: React.FC<CashOutScreenProps> = ({ navigation }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    getValues,
  } = useForm<any>();
  return (
    <TitleBackHeaderContainer isBack title='Cash Out'>
      <View
        style={styles.container}
      >
        <Input
          control={control}
          name="amount"
          label={'Amount'}
          containerStyle={styles.amountContainer}
          inputProps={{
            placeholder: 'Enter Amount',
          }}
          required={{ value: true, message: 'Please enter enter amount' }}
          error={errors}
          maxLength={40}
          inputStyle={styles.inputStyle}
        />
        <Text style={styles.titleStyle}>
          Choose Payment Method
        </Text>
        <FlatList
          data={paymentMethods}
          scrollEnabled={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PaymentMethodCard
              item={item}
              selected={selectedId === item.id}
              onPress={(selectedItem) => {
                console.log('Selected item:', selectedItem);
                setSelectedId(selectedItem.id);
              }}
            />
          )}
        />
        <Button
          title={'Cash Out'}
          style={styles.cashOutButton}
        />
      </View>
      <Text style={styles.heading}>Payout History</Text>
        <FlashList
          data={payoutHistory}
          renderItem={({ item }) => <PayoutCard item={item} />}
          estimatedItemSize={100}
          keyExtractor={(item) => item.id}
        />
    </TitleBackHeaderContainer>
  )
}

export default CashOutScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    marginHorizontal: 15,
    marginTop: 10,
    paddingVertical: 10
  },
  amountContainer: {
    marginTop: 10,
    paddingStart: 10
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
    paddingVertical: 10
  },
  cashOutButton: {
    backgroundColor: colors.primary,
    width: '90%',
    marginVertical: 10,
    marginHorizontal: 0,
    paddingHorizontal: 0,
    alignSelf: 'center'
  },
  heading: {
    fontSize: fontSizes.extraLarge,
    fontFamily: fonts.bold,
    marginLeft: 16,
    marginBottom: 12,
    color: '#1A1A1A',
    marginTop:10
  },
})