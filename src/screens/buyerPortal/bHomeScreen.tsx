import {StyleSheet, FlatList, View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import HeaderHomeContainer from '../../components/headerContainer/headerHomeContainer';
import {RootStackParamList, SCREENS} from '../../navigation/mainNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {bannerData} from '../../utils/static';
import BannerItem from '../../components/card/bannerItem';
import SearchBar from '../../components/card/searchBar';
import CategoryList from '../../components/card/categoryList';
import ProductSection from '../../components/card/productSection';
import {ProductCategory, ProductData} from '../../utils/types';
import {
  getAllProductList,
  getCategoryDetail,
  getMyOrderList,
  getProductList,
} from '../../utils/apiAction';
import {IRootState} from '../../redux/store';
import {useSelector} from 'react-redux';
import {useQuery} from '@tanstack/react-query';
import TopPicksSection from '../../components/card/topPicksSection';
import OrderListingCard from '../../components/card/orderListingCard';
import fonts from '../../assets/fonts/fonts';
import colors from '../../utils/colors';

type LoginProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.BHomeScreen
>;

const BHomeScreen: React.FC<LoginProps> = ({route, navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const userData = useSelector((user: IRootState) => user.user.userData);
  
  const isLogged = userData ? true : false;
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const searchQueryRef = useRef(searchQuery);
  const [selectedCategories, setSelectedCategories] = useState<
    ProductCategory[]
  >([]);
  const [selectedSort, setSelectedSort] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [apiTrigger, setApiTrigger] = useState(0);

  const getApiParams = () => {
    const params: any = {};
    if (searchQuery.trim() !== '') {
      params.search = searchQuery.trim();
    } else {
      params.search = '';
    }
    if (selectedSort?.id) {
      const sortMapping: {[key: string]: string} = {
        price_low_to_high: 'price_low_to_high',
        price_high_to_low: 'price_high_to_low',
        newest_first: 'newest_first',
      };
      params.sort_by = sortMapping[selectedSort.id] || selectedSort.id;
    } else {
      params.sort_by = 'null';
    }
    if (selectedPriceRange) {
      params.price = `${selectedPriceRange.min}-${selectedPriceRange.max}`;
    } else {
      params.price = '';
    }
    const allCategoryIds = new Set<number>();
    selectedCategories.forEach(cat => {
      if (typeof cat.id === 'number') {
        allCategoryIds.add(cat.id);
      }
    });
    selectedCategoryIds.forEach(id => {
      allCategoryIds.add(id);
    });
    if (allCategoryIds.size > 0) {
      params.category_id = Array.from(allCategoryIds).join(',');
    }
    if (userData?.id) {
      params.user_id = userData.id;
    }
    return params;
  };

  const {data: categoryData} = useQuery({
    queryKey: ['getCategoryDetail'],
    queryFn: () => getCategoryDetail(),
    enabled: isLogged,
  });

  const {data: allProductList} = useQuery({
    queryKey: ['getAllProductList', userData?.id],
    queryFn: () => getAllProductList(userData?.id),
  });

  const {data: sellerOwnProductList, refetch: refetchsellerOwnProductList} =
    useQuery({
      queryKey: ['getMyOrderList', userData?.id],
      queryFn: () => getMyOrderList(),
      enabled: !!userData && !!userData.id,
      placeholderData: undefined,
      staleTime: 0,
      refetchOnMount: true,
    });
  const sellerOwnProductData =
    isLogged &&
    Array.isArray(sellerOwnProductList?.data?.product) &&
    sellerOwnProductList.data.product.every(
      (item: any) => item && typeof item === 'object' && 'id' in item,
    )
      ? (sellerOwnProductList.data.product as ProductData[])
      : [];

  const latestData =
    sellerOwnProductData.length > 0
      ? sellerOwnProductData.sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt).getTime() -
            new Date(a.updatedAt || a.createdAt).getTime(),
        )
      : [];

  const oneLatestItem = latestData.slice(0, 1);

  const {
    data: productList,
    refetch: refetchProductList,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [
      'getProductList',
      searchQuery,
      selectedSort?.id,
      selectedPriceRange
        ? `${selectedPriceRange.min}-${selectedPriceRange.max}`
        : null,
      selectedCategories
        .map(c => c.id)
        .sort()
        .join(','),
      selectedCategoryIds.sort().join(','),
      userData?.id ?? null,
      apiTrigger,
    ],
    queryFn: () => {
      return getProductList(getApiParams());
    },
    staleTime: 0,
    refetchOnMount: true,
  });

  const hasActiveFilters = () => {
    return (
      searchQuery.trim() !== '' ||
      selectedCategories.length > 0 ||
      selectedCategoryIds.length > 0 ||
      selectedSort !== null ||
      selectedPriceRange !== null
    );
  };

  const getEmptyMessage = () => {
    if (searchQuery.trim() !== '') {
      return {
        title: 'No Search Results',
        message: `No products found for "${searchQuery}". Try different keywords or check your spelling.`,
      };
    } else if (
      selectedCategories.length > 0 ||
      selectedCategoryIds.length > 0
    ) {
      return {
        title: 'No Products in Category',
        message:
          'No products found in the selected category. Try selecting a different category.',
      };
    } else if (selectedPriceRange !== null) {
      return {
        title: 'No Products in Price Range',
        message: `No products found in the price range $${selectedPriceRange.min} - $${selectedPriceRange.max}. Try adjusting your price range.`,
      };
    } else if (selectedSort !== null) {
      return {
        title: 'No Products Found',
        message: 'No products match your current sorting criteria.',
      };
    } else {
      return {
        title: 'No Products Available',
        message:
          'No products are currently available. Please check back later.',
      };
    }
  };

  const EmptyStateMessage = ({
    title,
    message,
    showClearButton = false,
  }: {
    title: string;
    message: string;
    showClearButton?: boolean;
  }) => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateTitle}>{title}</Text>
      <Text style={styles.emptyStateMessage}>{message}</Text>
      {showClearButton && (
        <TouchableOpacity
          style={styles.clearFiltersButton}
          onPress={clearAllFilters}>
          <Text style={styles.clearFiltersButtonText}>Clear All Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const triggerApiCall = () => {
    setApiTrigger(prev => prev + 1);
    if (isLogged) {
      refetchProductList();
      refetchsellerOwnProductList();
    }
  };

  useEffect(() => {
    triggerApiCall();
  }, [
    searchQuery,
    selectedCategories,
    selectedSort,
    selectedPriceRange,
    selectedCategoryIds,
  ]);

  useEffect(() => {}, [
    isLogged,
    userData,
    selectedCategoryIds,
    selectedCategories,
    selectedSort,
    selectedPriceRange,
    searchQuery,
    apiTrigger,
    productList,
  ]);

  const handleFilterPress = () => {
    const onApplyFilters = (
      filterCategories: ProductCategory[],
      filterSort: {id: string; name: string} | null,
      filterPriceRange: {min: number; max: number} | null,
    ) => {
      setSelectedCategoryIds([]);
      setSelectedCategoryId(null);
      setSelectedCategories(filterCategories);
      setSelectedSort(filterSort);
      setSelectedPriceRange(filterPriceRange);
      setTimeout(() => {
        triggerApiCall();
      }, 100);
    };
    navigation.navigate(SCREENS.FilterSortScreen, {
      onApplyFilters,
      initialFilters: selectedCategories,
      initialSort: selectedSort,
      initialPriceRange: selectedPriceRange,
    });
  };

  useEffect(() => {
    if (categoryData?.data?.category) {
      const activeCategories: ProductCategory[] = categoryData.data.category
        .filter((category: any) => category.status === 'active')
        .map((category: any) => ({
          id: category.id,
          name: category.name,
        }));
      setCategories(activeCategories);
    }
  }, [categoryData]);

  const handleCategorySelect = (
    categoryId: number | null,
    categoryName: string | null,
  ) => {
    if (categoryId !== null && selectedCategories.length > 0) {
      setSelectedCategories([]);
    }
    if (categoryId === null) {
      setSelectedCategoryIds([]);
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryIds(prevIds => {
        const isAlreadySelected = prevIds.includes(categoryId);
        let newIds: number[];
        if (isAlreadySelected) {
          newIds = prevIds.filter(id => id !== categoryId);
        } else {
          newIds = [categoryId];
        }
        return newIds;
      });
      setSelectedCategoryId(categoryId);
    }
  };

  const addToRecentSearches = async (query: string) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery === '') return;
  };

  const handleSearch = async () => {
    const query = searchQueryRef.current.trim();
    if (query !== '') {
      await addToRecentSearches(query);
    }
    triggerApiCall();
  };

  useEffect(() => {
    searchQueryRef.current = searchQuery;
  }, [searchQuery]);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSort(null);
    setSelectedPriceRange(null);
    setSelectedCategoryIds([]);
    setSelectedCategoryId(null);
    setSearchQuery('');
  };
  const displayProducts = (productList?.data?.product || []).filter(
    (item: ProductData) =>
      item.product_status === 'active' || item.product_status === 'sold',
  );
  const allProducts = (allProductList?.data?.product || []).filter(
    (item: ProductData) =>
      item.product_status === 'active' || item.product_status === 'sold',
  );
  const soldProducts = (allProductList?.data?.product || []).filter(
    (item: ProductData) => item.product_status === 'sold',
  );
  const showEmptyState =
    !isLoading &&
    !isFetching &&
    (!displayProducts || displayProducts.length === 0);
  const showRecentlyListed =
    !hasActiveFilters() && allProducts && allProducts.length > 0;

  const shouldShowMyPurchase =
    isLogged && oneLatestItem && oneLatestItem.length > 0;
  return (
    <HeaderHomeContainer
      title={'Welcome,'}
      userName={`Hello ${userData?.full_name ?? 'Guest'}`}
      isHome
      profileImage={userData?.profile_picture}
      onSearchPress={() => {}}>
      {!shouldShowMyPurchase ? (
        <FlatList
          data={bannerData}
          keyExtractor={item => item.id}
          renderItem={({item}) => <BannerItem item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <View style={{height: 10}} />
      )}

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmit={handleSearch}
        onFilterPress={handleFilterPress}
        hasActiveFilters={hasActiveFilters()}
      />

      <CategoryList
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleCategorySelect}
        onSeeMorePress={handleFilterPress}
      />

      {shouldShowMyPurchase && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{'My Purchase'}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(SCREENS.MyOrderScreen)}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {oneLatestItem.map((item, index) => (
            <View key={item?.id ?? index} style={{paddingHorizontal: 10}}>
              <OrderListingCard
                item={item}
                cardStyle={{marginBottom: 0}}
                onSelect={() =>
                  navigation.navigate(SCREENS.OrderTrackScreen, {
                    productId: item?.id,
                  })
                }
              />
            </View>
          ))}
        </>
      )}

      {showEmptyState ? (
        <EmptyStateMessage
          {...getEmptyMessage()}
          showClearButton={hasActiveFilters()}
        />
      ) : (
        <>
          <ProductSection
            title="Our Products"
            products={displayProducts?.slice(0, 4)}
            onViewAll={() => {
              navigation.navigate(SCREENS.BrowseScreen);
            }}
            onPress={item => {
              navigation.navigate(SCREENS.BProductDetailScreen, {
                productId: item?.id,
              });
            }}
          />

          {showRecentlyListed && (
            <ProductSection
              title="Recently Listed Items"
              products={allProducts?.slice(0, 4)}
              onPress={item => {
                navigation.navigate(SCREENS.BProductDetailScreen, {
                  productId: item?.id,
                });
              }}
            />
          )}
          {showRecentlyListed && (
            <TopPicksSection
              title="Sold Product"
              products={soldProducts}
              onViewAll={() => {}}
              onSelect={item =>
                navigation.navigate(SCREENS.BProductDetailScreen, {
                  productId: item?.id,
                })
              }
            />
          )}
        </>
      )}

      <View style={{height: 110}} />
    </HeaderHomeContainer>
  );
};

export default BHomeScreen;

const styles = StyleSheet.create({
  container: {},
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    minHeight: 300,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  clearFiltersButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  clearFiltersButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 10,
  },
  sectionTitle: {
    color: '#1A1A1A',
    fontSize: 18,
    fontFamily: fonts.bold,
  },
  viewAllText: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
});
