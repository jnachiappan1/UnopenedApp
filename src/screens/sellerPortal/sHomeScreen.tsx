import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
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
import { useQuery } from '@tanstack/react-query';
import { getSellerDashboardCount, getSellerOwnProductList } from '../../utils/apiAction';
import { ProductData } from '../../utils/types';

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
  const userData = useSelector((user: IRootState) => user.user.userData);
  console.log("userData---", userData);
  
  // Add error handling and retry logic to useQuery
  const { 
    data: dashboardCountData, 
    refetch: refetchDashboardCountData,
    error: dashboardError,
    isError: isDashboardError
  } = useQuery({
    queryKey: ['getSellerDashboardCount'],
    queryFn: async () => {
      try {
        const result = await getSellerDashboardCount();
        console.log('Dashboard API success:', result);
        return result;
      } catch (error) {
        console.error('Dashboard API error:', error);
        // Return a default structure instead of throwing
        return {
          data: {
            counts: defaultCounts
          }
        };
      }
    },
    retry: 1,
    retryDelay: 1000,
    enabled: !!userData, 
  });
  const { 
    data: sellerOwnProductList, 
    refetch: refetchsellerOwnProductList,
    error: productError,
    isError: isProductError
  } = useQuery({
    queryKey: ['getSellerOwnProductList'],
    queryFn: async () => {
      try {
        const result = await getSellerOwnProductList();
        console.log('Product API success:', result);
        return result;
      } catch (error) {
        console.error('Product API error:', error);
        // Return a default structure instead of throwing
        return {
          data: {
            product: []
          }
        };
      }
    },
    retry: 1,
    retryDelay: 1000,
    enabled: !!userData, 
  });

  // Safely extract products with fallback
  const products: ProductData[] = React.useMemo(() => {
    try {
      return sellerOwnProductList?.data?.product || [];
    } catch (error) {
      console.error('Error extracting products:', error);
      return [];
    }
  }, [sellerOwnProductList]);

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
    // Ensure counts is always an object
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

  // Safely extract counts with multiple fallbacks
  const counts = React.useMemo(() => {
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
  }, [dashboardCountData, isDashboardError]);

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
      console.log(item, "item======");
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
                data={filteredData}
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
          userData && (
            <FlatList
              data={products}
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