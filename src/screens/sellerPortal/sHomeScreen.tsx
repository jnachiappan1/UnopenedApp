import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import HeaderHomeContainer from '../../components/headerContainer/headerHomeContainer'
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DashboardAnalyticsCard from '../../components/card/dashboardAnalyticsCard';
import { IconName } from '../../assets/svg/iconsSvg';
import ProductListingCard from '../../components/card/productListingCard';
import { fontSizes } from '../../utils/utils';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';
import { IRootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSellerDashboardCount, getSellerOwnProductList } from '../../utils/apiAction';
import { ProductData } from '../../utils/types';
import { useFocusEffect } from '@react-navigation/native';

type PHomeScreenProps = NativeStackScreenProps<RootStackParamList, SCREENS.SHomeScreen>;

type DashboardAnalyticsItem = {
  title: string;
  subtitle: string;
  icon: IconName;
  key: string;
};

const defaultCounts = {
  active: 0,
  sold: 0,
  in_review: 0,
  withdrawn: 0,
  wallet_balance: 0,
};

const SHomeScreen: React.FC<PHomeScreenProps> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const userData = useSelector((user: IRootState) => user.user.userData);
  const queryClient = useQueryClient();
  
  // Clear React Query cache when user logs out
  useEffect(() => {
    if (!userData) {
      // Clear all cached data when no user is logged in
      queryClient.removeQueries({ queryKey: ['getSellerDashboardCount'] });
      queryClient.removeQueries({ queryKey: ['getSellerOwnProductList'] });
      console.log('Cleared React Query cache - user logged out');
    }
  }, [userData, queryClient]);

  const { 
    data: dashboardCountData, 
    refetch: refetchDashboardCountData,
    error: dashboardError,
    isError: isDashboardError,
    isFetching: isDashboardFetching
  } = useQuery({
    queryKey: ['getSellerDashboardCount'],
    queryFn: async () => {
      try {
        const result = await getSellerDashboardCount();
        return result;
      } catch (error) {
        console.error('Dashboard API error:', error);
        return {
          data: {
            counts: defaultCounts
          }
        };
      }
    },
    retry: 1,
    retryDelay: 1000,
    enabled: !!userData, // Only run when user is logged in
    staleTime: 0, // Always refetch when query becomes active
  });

  console.log(dashboardCountData,"dashboardCountData-------");

  const { 
    data: sellerOwnProductList, 
    refetch: refetchsellerOwnProductList,
    error: productError,
    isError: isProductError,
    isFetching: isProductFetching
  } = useQuery({
    queryKey: ['getSellerOwnProductList'],
    queryFn: async () => {
      try {
        const result = await getSellerOwnProductList();
        return result;
      } catch (error) {
        console.error('Product API error:', error);
        return {
          data: {
            product: []
          }
        };
      }
    },
    retry: 1,
    retryDelay: 1000,
    enabled: !!userData, // Only run when user is logged in
    staleTime: 0, // Always refetch when query becomes active
  });

  // useFocusEffect to call APIs when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (userData) {
        // Call both APIs when screen comes into focus
        const focusRefresh = async () => {
          try {
            const refreshPromises = [
              refetchDashboardCountData(),
              refetchsellerOwnProductList()
            ];
            
            const results = await Promise.allSettled(refreshPromises);
            
            results.forEach((result, index) => {
              const apiName = index === 0 ? 'Dashboard' : 'Product';
              if (result.status === 'fulfilled') {
                console.log(`${apiName} API focus refresh successful`);
              } else {
                console.error(`${apiName} API focus refresh failed:`, result.reason);
              }
            });
            
            console.log('Focus refresh completed');
          } catch (error) {
            console.error('Error during focus refresh:', error);
          }
        };
        
        focusRefresh();
      } else {
        console.log('No userData - skipping focus refresh and clearing data');
        // Reset selected tab to 'All' when user logs out
        setSelectedTab('All');
      }
    }, [userData, refetchDashboardCountData, refetchsellerOwnProductList])
  );

  const handleRefresh = useCallback(async () => {
    if (!userData) {
      console.log('No user data available - skipping refresh');
      setIsRefreshing(false);
      return;
    }
    console.log('Starting pull-to-refresh - calling APIs...');
    setIsRefreshing(true);  
    try {
      const refreshPromises = [
        refetchDashboardCountData(),
        refetchsellerOwnProductList()
      ];
      const results = await Promise.allSettled(refreshPromises);
      results.forEach((result, index) => {
        const apiName = index === 0 ? 'Dashboard' : 'Product';
        if (result.status === 'fulfilled') {
          console.log(`${apiName} API refresh successful`);
        } else {
          console.error(`${apiName} API refresh failed:`, result.reason);
        }
      });
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      console.log('Setting isRefreshing to false');
      setIsRefreshing(false);
    }
  }, [userData, refetchDashboardCountData, refetchsellerOwnProductList]);

  const isAnyApiFetching = userData ? (isDashboardFetching || isProductFetching) : false;
  
  // Use default empty array when no user data or when user is logged out
  const products: ProductData[] = React.useMemo(() => {
    if (!userData) {
      return []; // Return empty array when no user is logged in
    }
    try {
      return sellerOwnProductList?.data?.product || [];
    } catch (error) {
      console.error('Error extracting products:', error);
      return [];
    }
  }, [sellerOwnProductList, userData]);
  
  const EmptyStateMessage = React.memo(({ selectedTab }: { selectedTab: string }) => {
    const getEmptyMessage = () => {
      switch (selectedTab) {
        case 'Active':
          return {
            title: 'No Active Listings',
            subtitle: 'You don\'t have any active products listed at the moment.'
          };
        case 'Sold':
          return {
            title: 'No Sold Products',
            subtitle: 'You haven\'t sold any products yet. Keep promoting your listings!'
          };
        case 'In Review':
          return {
            title: 'No Products Under Review',
            subtitle: 'You don\'t have any products currently under review.'
          };
        default:
          return {
            title: 'No Products Found',
            subtitle: 'You don\'t have any products at the moment.'
          };
      }
    };
    const message = getEmptyMessage();
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateTitle}>{message.title}</Text>
        <Text style={styles.emptyStateSubtitle}>{message.subtitle}</Text>
      </View>
    );
  });

  const transformDashboardCounts = React.useCallback((counts: any): DashboardAnalyticsItem[] => {
    const safeCounts = counts && typeof counts === 'object' ? counts : defaultCounts;
    return [
      {
        key: 'active',
        title: (safeCounts.active ?? 0).toString(),
        subtitle: 'Active Listings',
        icon: 'productListPrimaryIcon',
      },
      {
        key: 'in_review',
        title: (safeCounts.in_review ?? 0).toString(),
        subtitle: 'Pending Review',
        icon: 'pendingIcon',
      },
      {
        key: 'sold',
        title: (safeCounts.sold ?? 0).toString(),
        subtitle: 'Sold Products',
        icon: 'boxIcon',
      },
      {
        key: 'wallet_balance',
        title: `$${safeCounts.wallet_balance ?? 0}`,
        subtitle: 'Wallet Balance',
        icon: 'walletPrimaryIcon',
      },
    ];
  }, []);

  // Use default counts when no user data or when user is logged out
  const counts = React.useMemo(() => {
    if (!userData) {
      return defaultCounts; // Return default counts when no user is logged in
    }
    try {
      if (isDashboardError) {
        console.log('Using default counts due to dashboard error');
        return defaultCounts;
      }
      const extractedCounts = dashboardCountData?.data?.counts;
      if (!extractedCounts || typeof extractedCounts !== 'object') {
        console.log('Using default counts due to invalid data structure');
        return defaultCounts;
      }
      return extractedCounts;
    } catch (error) {
      console.error('Error extracting counts:', error);
      return defaultCounts;
    }
  }, [dashboardCountData, isDashboardError, userData]);

  const dashboardAnalyticsData = React.useMemo(() => {
    try {
      return transformDashboardCounts(counts);
    } catch (error) {
      console.error('Error transforming dashboard counts:', error);
      return transformDashboardCounts(defaultCounts);
    }
  }, [counts, transformDashboardCounts]);

  const getStatusForTab = React.useCallback((tabName: string) => {
    switch (tabName) {
      case 'Active':
        return 'active';
      case 'Sold':
        return 'sold';
      case 'In Review':
        return 'in_review';
      default:
        return null;
    }
  }, []);

  const filterData = React.useCallback(() => {
    try {
      if (selectedTab === 'All') {
        return products;
      }
      const statusToFilter = getStatusForTab(selectedTab);
      return products.filter(item => item?.product_status === statusToFilter);
    } catch (error) {
      console.error('Error filtering data:', error);
      return [];
    }
  }, [selectedTab, products, getStatusForTab]);

  const getTabCounts = React.useCallback(() => {
    try {
      const counts: { [key: string]: number } = {
        All: products.length,
        Active: products.filter(item => item?.product_status === 'active').length,
        Sold: products.filter(item => item?.product_status === 'sold').length,
        'In Review': products.filter(item => item?.product_status === 'in_review').length,
      };
      return counts;
    } catch (error) {
      console.error('Error calculating tab counts:', error);
      return {
        All: 0,
        Active: 0,
        Sold: 0,
        'In Review': 0,
      };
    }
  }, [products]);

  const tabCounts = getTabCounts();
  const filteredData = filterData();

  const renderProductItem = React.useCallback(({ item }: { item: ProductData }) => {
    try {
      return (
        <ProductListingCard 
          item={item} 
          onSelect={(selectedItem) => {
            try {
              navigation.navigate(SCREENS.ProductDetailScreen, { productId: selectedItem.id });
            } catch (navError) {
              console.error('Navigation error:', navError);
            }
          }} 
        />
      );
    } catch (error) {
      console.error('Error rendering product item:', error);
      return <View />;
    }
  }, [navigation]);

  const renderTab = React.useCallback(({ item }: { item: string }) => {
    try {
      return (
        <TouchableOpacity
          key={item}
          onPress={() => {
            try {
              setSelectedTab(item);
            } catch (error) {
              console.error('Error setting tab:', error);
            }
          }}
          style={[
            styles.tab,
            selectedTab === item && styles.activeTab,
          ]}
        >
          <Text style={[styles.tabText, selectedTab === item && styles.activeTabText]}>
            {item}
          </Text>
          <View style={styles.countContainer}>
            <Text style={[styles.tabCountText, selectedTab === item && styles.activeTabCountText]}>
              {tabCounts[item] ?? 0}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } catch (error) {
      console.error('Error rendering tab:', error);
      return <View key={item} />;
    }
  }, [selectedTab, tabCounts]);

  return (
    <HeaderHomeContainer
      title={'Welcome,'}
      userName={`Hello ${userData?.full_name ?? 'Guest'}`}
      isHome
      refreshing={isRefreshing || isAnyApiFetching}
      onRefresh={handleRefresh}
      onSearchPress={() => { 
        console.log('Search pressed');
      }}
    >
      <FlatList
        data={dashboardAnalyticsData}
        keyExtractor={(item) => item.key}
        numColumns={2}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <DashboardAnalyticsCard
            title={item.title}
            subtitle={item.subtitle}
            icon={item.icon}
          />
        )}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Listing</Text>
          <Text style={styles.viewAllText}>View All</Text>
        </View>
        <FlatList
          data={['All', 'Active', 'Sold', 'In Review']}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderTab}
          keyExtractor={(item) => item}
          style={styles.tabs}
        />
        {
          userData ? (
            filteredData.length > 0 ? (
              <FlatList
                data={filteredData.slice(0, 5)}
                renderItem={renderProductItem}
                keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
                contentContainerStyle={styles.list}
              />
            ) : (
              <EmptyStateMessage selectedTab={selectedTab} />
            )
          ) : (
            <View style={styles.loginPromptContainer}>
              <Text style={styles.loginPromptTitle}>Please log in first</Text>
              <Text style={styles.loginPromptSubtitle}>
                You must be logged in to view your listings and recent products.
              </Text>
            </View>
          )
        }
      </View>
      <View style={styles.recentProductView}>
        <View style={styles.header}>
          <Text style={styles.title}>Recently Added Products</Text>
          <Text style={styles.viewAllText}>View All</Text>
        </View>
        {
          userData && products.length > 0 ? (
            <FlatList
              data={products.slice(0, 5)}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <ProductListingCard
                  item={item}
                  cardStyle={{ marginHorizontal: 5, width: 320 }}
                  onSelect={(selectedItem) => {
                    try {
                      navigation.navigate(SCREENS.ProductDetailScreen, { productId: selectedItem.id });
                    } catch (navError) {
                      console.error('Recent navigation error:', navError);
                    }
                  }}
                />
              )}
              keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
              contentContainerStyle={styles.contentContainerStyle}
            />
          ) : userData ? (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateTitle}>No Recent Products</Text>
              <Text style={styles.emptyStateSubtitle}>
                You haven't added any products recently.
              </Text>
            </View>
          ) : (
            <View style={styles.loginPromptContainer}>
              <Text style={styles.loginPromptTitle}>Please log in first</Text>
              <Text style={styles.loginPromptSubtitle}>
                You must be logged in to view recent products.
              </Text>
            </View>
          )
        }
      </View>
    </HeaderHomeContainer>
  );
}

export default SHomeScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  title: {
    fontSize: fontSizes.large,
    fontFamily: fonts.bold,
  },
  viewAllText: {
    color: colors.primary,
    fontSize: fontSizes.regular,
  },
  tabs: {
    flexDirection: 'row',
    marginVertical: 16,
    paddingHorizontal: 15
  },
  tab: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 16,
    borderRadius: 60,
    borderColor: colors.chineseSilver,
    borderWidth: 1,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.black,
    borderRadius: 60
  },
  tabText: {
    fontSize: fontSizes.regular,
    color: '#888',
  },
  activeTabText: {
    color: colors.white,
    fontSize: fontSizes.regular
  },
  tabCountText: {
    fontSize: fontSizes.small,
    color: colors.label,
  },
  activeTabCountText: {
    color: colors.label,
    fontSize: fontSizes.small
  },
  list: {
    paddingHorizontal: 15,
  },
  countContainer: {
    backgroundColor: '#E7ECDF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginStart: 5
  },
  recentProductView: { 
    marginBottom: 100 
  },
  contentContainerStyle: {
    paddingVertical: 10, 
    paddingHorizontal: 10
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: fontSizes.large,
    fontFamily: fonts.bold,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: fontSizes.regular,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  loginPromptContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginPromptTitle: {
    fontSize: fontSizes.large,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  loginPromptSubtitle: {
    fontSize: fontSizes.regular,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
});