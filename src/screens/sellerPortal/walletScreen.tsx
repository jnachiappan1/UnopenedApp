import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer'
import colors from '../../utils/colors'
import { fontSizes } from '../../utils/utils'
import fonts from '../../assets/fonts/fonts'
import IconsSvg from '../../assets/svg/iconsSvg'

import { pendingTranferData, transactions } from '../../utils/static'
import TransactionCard, { TransactionType } from '../../components/card/transactionCard'
import PendingCard from '../../components/card/pendingCard'
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useQuery } from '@tanstack/react-query'
import { getTransactionList, getWalletDetail } from '../../utils/apiAction'
import { useSelector } from 'react-redux'
import { IRootState } from '../../redux/store'
import { useFocusEffect } from '@react-navigation/native'
type WalletScreenProps = NativeStackScreenProps<RootStackParamList, SCREENS.WalletScreen>;

const WalletScreen: React.FC<WalletScreenProps> = ({ navigation }) => {
  const userData = useSelector((user: IRootState) => user.user.userData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  const { data: walletData, refetch: refetchWalletDetail, isFetching: isWalletFetching, error: walletError } = useQuery({
    queryKey: ['getWalletDetail', userData?.id],
    queryFn: () => getWalletDetail(),
    enabled: !!userData, 
    staleTime: 0, // Always consider data stale
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: 1000,
  });
  
  const {
    isLoading: isTransactionLoading,
    data: transactionData,
    refetch: refetchTransactionData,
    isFetching: isTransactionFetching,
    error: transactionError,
  } = useQuery({
    queryKey: ['getTransactionList', userData?.id],
    queryFn: () => getTransactionList(),
    enabled: !!userData,
    staleTime: 0, // Always consider data stale
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: 1000,
  });

  // Check if any API is currently fetching (following SHomeScreen pattern)
  const isAnyApiFetching = userData ? (isWalletFetching || isTransactionFetching) : false;
  

  
  // Auto-focus API calls when screen loads
  useEffect(() => {
    if (userData) {
      // Use setTimeout to ensure the component is fully mounted
      setTimeout(() => {
        refetchWalletDetail();
        refetchTransactionData();
      }, 100);
    }
  }, [userData, refetchWalletDetail, refetchTransactionData]);

  // Refresh data when screen comes into focus (following SHomeScreen pattern)
  useFocusEffect(
    useCallback(() => {
      if (userData) {
        const focusRefresh = async () => {
          try {
            const refreshPromises = [
              refetchWalletDetail(),
              refetchTransactionData()
            ];
            await Promise.allSettled(refreshPromises);
          } catch (error) {
            console.error('Error during focus refresh:', error);
          }
        };

        focusRefresh();
      }
    }, [userData, refetchWalletDetail, refetchTransactionData])
  );

  // Pull to refresh handler following SHomeScreen pattern
  const handleRefresh = useCallback(async () => {
    if (!userData) {
      setIsRefreshing(false);
      return;
    }
    
    setIsRefreshing(true);
    
    try {
      const refreshPromises = [
        refetchWalletDetail(),
        refetchTransactionData()
      ];
      
      await Promise.allSettled(refreshPromises);
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [userData, refetchWalletDetail, refetchTransactionData]);

  // Force refresh function as fallback
  const forceRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([
        getWalletDetail(),
        getTransactionList()
      ]);
    } catch (error) {
      console.error("Force refresh fallback failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Calculate transaction summaries
  const getTransactionSummary = () => {
    if (!transactionData?.data?.transaction) return null;
    
    const transactions = transactionData.data.transaction;
    
    const summary = transactions.reduce((acc: {
      walletFunds: number;
      addFunds: number;
      buyProduct: number;
      buyProductWallet: number;
      other: number;
    }, transaction: any) => {
      const { payment_transaction_type, amount, wallet_amount } = transaction;
      const numAmount = Number(amount) || 0;
      const numWalletAmount = Number(wallet_amount) || 0;
      
      switch (payment_transaction_type) {
        case 'wallet_funds':
          acc.walletFunds += numWalletAmount;
          break;
        case 'add_funds':
          acc.addFunds += numWalletAmount;
          break;
        case 'buy_product':
          acc.buyProduct += numAmount;
          acc.buyProductWallet += numWalletAmount;
          break;
        default:
          acc.other += numAmount;
      }
      
      return acc;
    }, {
      walletFunds: 0,
      addFunds: 0,
      buyProduct: 0,
      buyProductWallet: 0,
      other: 0
    });
    
    return summary;
  };

  const transactionSummary = getTransactionSummary();

  // Filter transactions based on selected filter
  const getFilteredTransactions = () => {
    if (!transactionData?.data?.transaction) return [];
    
    const transactions = transactionData.data.transaction;
    
    if (selectedFilter === 'all') return transactions;
    
    return transactions.filter((transaction: any) => 
      transaction.payment_transaction_type === selectedFilter
    );
  };

  const filteredTransactions = getFilteredTransactions();

  // Show loading state when initially loading and no data exists
  if ((isTransactionLoading || isWalletFetching) && !transactionData && !walletData) {
    return (
      <TitleBackHeaderContainer title='Wallet'>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading wallet information...</Text>
        </View>
      </TitleBackHeaderContainer>
    );
  }

  return (
    <TitleBackHeaderContainer 
      title='Wallet' 
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.transactionsContainer}>
          <View style={styles.innerBalanceContainer}>
            <Text style={styles.availableText}>Available Balance</Text>
            <Text style={styles.amountText}>
              {"$" + (walletData?.data?.wallet?.amount || "0.00")}
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

        {/* Filter Section */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity 
              style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, selectedFilter === 'wallet_funds' && styles.filterButtonActive]}
              onPress={() => setSelectedFilter('wallet_funds')}
            >
              <Text style={[styles.filterText, selectedFilter === 'wallet_funds' && styles.filterTextActive]}>
                Wallet Funds
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, selectedFilter === 'add_funds' && styles.filterButtonActive]}
              onPress={() => setSelectedFilter('add_funds')}
            >
              <Text style={[styles.filterText, selectedFilter === 'add_funds' && styles.filterTextActive]}>
                Added Funds
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, selectedFilter === 'buy_product' && styles.filterButtonActive]}
              onPress={() => setSelectedFilter('buy_product')}
            >
              <Text style={[styles.filterText, selectedFilter === 'buy_product' && styles.filterTextActive]}>
                Purchases
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.transactionsList}>
          {isTransactionLoading ? (
            <View style={styles.loadingState}>
              <Text style={styles.loadingStateText}>Loading transactions...</Text>
            </View>
          ) : filteredTransactions && filteredTransactions.length > 0 ? (
            filteredTransactions.map((item: TransactionType) => (
              <TransactionCard key={item.id} item={item} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {selectedFilter === 'all' ? 'No transactions found' : `No ${selectedFilter.replace('_', ' ')} transactions found`}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.pendingText}>Pending Transfers</Text>
        <View style={styles.pendingList}>
          {pendingTranferData.map((item) => (
            <PendingCard key={item.id} item={item} />
          ))}
        </View>
        <View style={{ height: 110 }} />
      </ScrollView>
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
    justifyContent: 'center', },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.regular,
    color: colors.label,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.regular,
    color: colors.label,
    textAlign: 'center',
  },

  transactionsList: {
    paddingBottom: 20,
  },
  pendingList: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  loadingState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingStateText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.regular,
    color: colors.label,
    textAlign: 'center',
  },

  summaryContainer: {
    backgroundColor: colors.white,
    marginHorizontal: 10,
    marginTop: 15,
    borderRadius: 20,
    padding: 15,
  },
  summaryTitle: {
    fontSize: fontSizes.large,
    fontFamily: fonts.bold,
    color: colors.label,
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    backgroundColor: colors.primary,
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 5,
  },
  summaryAmount: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: colors.white,
    textAlign: 'center',
  },

  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 10,
    backgroundColor: '#F4F5F7',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.label,
  },
  filterTextActive: {
    color: colors.white,
  },

})