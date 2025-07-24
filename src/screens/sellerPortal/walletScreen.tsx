import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer'
import colors from '../../utils/colors'
import { fontSizes } from '../../utils/utils'
import fonts from '../../assets/fonts/fonts'
import IconsSvg from '../../assets/svg/iconsSvg'
import { FlashList } from '@shopify/flash-list'
import { pendingTranferData, transactions } from '../../utils/static'
import TransactionCard, { TransactionType } from '../../components/card/transactionCard'
import PendingCard from '../../components/card/pendingCard'
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useQuery } from '@tanstack/react-query'
import { getTransactionList, getWalletDetail } from '../../utils/apiAction'
type WalletScreenProps = NativeStackScreenProps<RootStackParamList, SCREENS.WalletScreen>;

const WalletScreen: React.FC<WalletScreenProps> = ({ navigation }) => {
  const { data: walletData, refetch: refetchWalletDetail } = useQuery({
    queryKey: ['getWalletDetail'],
    queryFn: () => getWalletDetail(),
  });
  const {
    isLoading: isTransactionLoading,
    data: transactionData,
    refetch: refetchTransactionData,
  } = useQuery({
    queryKey: ['getTransactionList'],
    queryFn: () => getTransactionList(),
  });
  
  console.log(JSON.stringify(transactionData),"transactionData---");
  
  return (
    <TitleBackHeaderContainer title='Wallet' >
      <View style={styles.transactionsContainer}>
        <View style={styles.innerBalanceContainer}>
          <Text style={styles.availableText}>Available Balance</Text>
          <Text style={styles.amountText}>
            {"$" +walletData?.data?.wallet?.amount}
          </Text>
        </View>
        <View style={styles.balanceContainer}>
          <TouchableOpacity style={styles.userContainer}
          onPress={()=>navigation.navigate(SCREENS.AddFundScreen)}>
            <IconsSvg name='funds' />
            <Text style={styles.addFunds}>
              Add Funds
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.userContainer} onPress={()=>navigation.navigate(SCREENS.CashOutScreen)}>
            <IconsSvg name='cashOut' />
            <Text style={styles.addFunds}>
              Cash Out
            </Text>
          </TouchableOpacity>

        </View>

      </View>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions History</Text>
        <Text style={styles.viewAllText}>View All</Text>
      </View>
        <FlashList
          data={transactionData?.data?.transaction || []}
          renderItem={({ item }) => <TransactionCard item={item as TransactionType} />}
          estimatedItemSize={80}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyExtractor={(item) => (item as TransactionType).id.toString()}
        />
        <Text style={styles.pendingText}>Pending Transfers</Text>
        <FlashList
        data={pendingTranferData}
        renderItem={({ item }) => <PendingCard item={item} />}
        estimatedItemSize={100}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 110 ,paddingHorizontal:15}}
      />
    </TitleBackHeaderContainer>
  )
}

export default WalletScreen

const styles = StyleSheet.create({
  availableText: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.bold,
    color: colors.white,
    textAlign: 'center'
  },
  amountText: {
    fontSize: fontSizes.sGigantic,
    fontFamily: fonts.bold,
    color: colors.white,
    textAlign: 'center'
  },
  userContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginStart: 10,
    borderRadius: 50,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderWidth: 1,
    height: 54,
    width: "45%",
    alignItems: "center",
    justifyContent: "center"
  },
  addFunds: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: colors.label,
    paddingHorizontal: 5
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    paddingVertical: 10
  },
  title: {
    fontSize: fontSizes.large,
    fontFamily: fonts.bold,
  },
  pendingText: {
    fontSize: fontSizes.large,
    fontFamily: fonts.bold,
    paddingStart:20,
    paddingBottom:10
  },
  viewAllText: {
    color: colors.primary,
    fontSize: fontSizes.regular,
  },
  transactionsContainer: { backgroundColor: colors.white, marginHorizontal: 10, borderRadius: 32 },
  balanceContainer: { flexDirection: 'row', alignSelf: 'center', paddingVertical: 15 },
  innerBalanceContainer: {     backgroundColor: colors.primary,
    borderRadius: 20,
    height: 87,
    justifyContent: 'center', }
})