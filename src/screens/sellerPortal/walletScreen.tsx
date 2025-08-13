import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
  
  console.log("Query states:", {
    walletFetching: isWalletFetching,
    transactionFetching: isTransactionFetching,
    walletData: !!walletData,
    transactionData: !!transactionData,
    userData: !!userData,
    transactionCount: transactionData?.data?.transaction?.length || 0,
    walletAmount: walletData?.data?.wallet?.amount || 'N/A',
    walletError: walletError?.message || 'None',
    transactionError: transactionError?.message || 'None'
  });

  // Check if any API is currently fetching (following SHomeScreen pattern)
  const isAnyApiFetching = userData ? (isWalletFetching || isTransactionFetching) : false;
  

  
  // Auto-focus API calls when screen loads
  useEffect(() => {
    if (userData) {
      console.log("User data found, triggering initial data fetch...");
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

  // Log data changes
  useEffect(() => {
    console.log("Data changed:", {
      walletData: !!walletData,
      transactionData: !!transactionData,
      transactionCount: transactionData?.data?.transaction?.length || 0
    });
  }, [walletData, transactionData]);
  
  // Pull to refresh handler following SHomeScreen pattern
  const handleRefresh = useCallback(async () => {
    console.log("handleRefresh called - starting refresh process");
    
    if (!userData) {
      console.log("No user data, skipping refresh");
      setIsRefreshing(false);
      return;
    }
    
    console.log("Setting refresh state to true");
    setIsRefreshing(true);
    
    try {
      console.log("Starting API refresh calls...");
      const refreshPromises = [
        refetchWalletDetail(),
        refetchTransactionData()
      ];
      
      console.log("Waiting for API calls to complete...");
      const results = await Promise.allSettled(refreshPromises);
      
      console.log("API calls completed, processing results...");
      results.forEach((result, index) => {
        const apiName = index === 0 ? 'Wallet' : 'Transaction';
        if (result.status === 'fulfilled') {
          console.log(`${apiName} refresh successful:`, result.value);
        } else {
          console.error(`${apiName} refresh failed:`, result.reason);
        }
      });
      
      console.log("Refresh completed successfully");
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      console.log("Setting refresh state to false");
      setIsRefreshing(false);
    }
  }, [userData, refetchWalletDetail, refetchTransactionData]);

  // Force refresh function as fallback
  const forceRefresh = useCallback(async () => {
    console.log("Force refresh called");
    try {
      setIsRefreshing(true);
      console.log("Force refresh: calling APIs directly");
      await Promise.all([
        getWalletDetail(),
        getTransactionList()
      ]);
      console.log("Force refresh: APIs completed successfully");
    } catch (error) {
      console.error("Force refresh fallback failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Monitor refresh function availability
  useEffect(() => {
    console.log("Refresh function status:", {
      handleRefreshAvailable: !!handleRefresh,
      forceRefreshAvailable: !!forceRefresh,
      isRefreshing,
      userData: !!userData
    });
  }, [handleRefresh, forceRefresh, isRefreshing, userData]);


  
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
        <View style={styles.transactionsList}>
          {isTransactionLoading ? (
            <View style={styles.loadingState}>
              <Text style={styles.loadingStateText}>Loading transactions...</Text>
            </View>
          ) : transactionData?.data?.transaction && transactionData.data.transaction.length > 0 ? (
            transactionData.data.transaction.map((item: TransactionType) => (
              <TransactionCard key={item.id} item={item} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No transactions found</Text>
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

})