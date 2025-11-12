import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { FlashList } from '@shopify/flash-list'
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer'
import ProductListingCard from '../../components/card/productListingCard';
import colors from '../../utils/colors';
import { fontSizes } from '../../utils/utils';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import { ProductData } from '../../utils/types';
import { getSellerOwnProductList } from '../../utils/apiAction';
import { useQuery } from '@tanstack/react-query';
import fonts from '../../assets/fonts/fonts';
import { useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';
import { getStatusForTab } from '../../utils/method';
import { useFocusEffect } from '@react-navigation/native';
import { showLoader } from '../../components/loader/loader';

type ProductListScreenProps = NativeStackScreenProps<RootStackParamList, SCREENS.ProductListScreen>;

const ProductListScreen: React.FC<ProductListScreenProps> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('All');
  const userData = useSelector((user: IRootState) => user.user.userData);
  const { data: sellerOwnProductList, refetch: refetchsellerOwnProductList, } = useQuery({
    queryKey: ['getSellerOwnProductList'],
    queryFn: () => getSellerOwnProductList(),
    enabled: !!userData, 
  });
  const products: ProductData[] = sellerOwnProductList?.data?.product || [];
  
  const EmptyStateMessage = ({ selectedTab }: { selectedTab: string }) => {
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
  };


  const filterData = () => {
    if (selectedTab === 'All') {
      return products;
    }
    const statusToFilter = getStatusForTab(selectedTab);
    return products.filter(item => item.product_status === statusToFilter);
  };

  const getTabCounts = () => {
    const counts: { [key: string]: number } = {
      All: products.length,
      Active: products.filter(item => item.product_status === 'active').length,
      Sold: products.filter(item => item.product_status === 'sold').length,
      Withdrawn: products.filter(item => item.product_status === 'withdrawn').length,
      'In Review': products.filter(item => item.product_status === 'in_review').length,
    };
    return counts;
  };

  const tabCounts = getTabCounts();
  const filteredData = filterData();

  const renderProductItem = ({ item }: { item: ProductData }) => (
    <ProductListingCard item={item} onSelect={(item) => {
      navigation.navigate(SCREENS.ProductDetailScreen, { productId: item.id });
    }} />
  );

  const renderTab = ({ item }: { item: string }) => (
    <TouchableOpacity
      key={item}
      onPress={() => setSelectedTab(item)}
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

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <FlatList
        data={['All', 'Active', 'Sold', 'In Review','Withdrawn']}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderTab}
        keyExtractor={(item) => item}
        style={styles.tabs}
      />
    </View>
  );

  const handleProductSelect = (item: ProductData) => {
    navigation.navigate(SCREENS.ProductDetailScreen, { productId: item.id });
  }
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          showLoader(true);
          await refetchsellerOwnProductList();
        } catch (err) {
          console.error('Failed to fetch product list:', err);
        } finally {
          showLoader(false);
        }
      };
      if (userData) {
        fetchData();
      }
    }, [userData, refetchsellerOwnProductList])
  );
  return (
    <TitleBackHeaderContainer title='Products Listing' >
      {filteredData.length > 0 ? (
        <FlashList
          data={filteredData}
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: 10 }}>
              <ProductListingCard
                item={item}
                onSelect={handleProductSelect}
              />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={{ paddingEnd: 10 }}>
              {renderHeader()}
            </View>
          }
          estimatedItemSize={120}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <View style={{ paddingEnd: 10 }}>
            {renderHeader()}
          </View>
          <EmptyStateMessage selectedTab={selectedTab} />
        </View>
      )}
    </TitleBackHeaderContainer>
  )
}

export default ProductListScreen

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.background,
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
    alignItems: 'center'
  },
  activeTab: {
    backgroundColor: colors.black,
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
    textAlign: "center",
    justifyContent: "center"
  },
  activeTabCountText: {
    color: colors.label,
    fontSize: fontSizes.small
  },
  list: {
    // paddingHorizontal: 10,
    paddingBottom: 110
  },
  countContainer: {
    backgroundColor: '#E7ECDF',
    borderRadius: 20,
    marginStart: 5,
    minWidth: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
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
})