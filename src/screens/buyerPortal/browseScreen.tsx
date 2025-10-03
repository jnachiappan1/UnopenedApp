import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, SCREENS} from '../../navigation/mainNavigation';
import SearchBar from '../../components/card/searchBar';
import TopPicksSection from '../../components/card/topPicksSection';
import ProductSection from '../../components/card/productSection';
import {products} from '../../utils/static';
import fonts from '../../assets/fonts/fonts';
import colors from '../../utils/colors';
import IconsSvg from '../../assets/svg/iconsSvg';
import {ScrollView} from 'react-native';
import {ProductCategory} from '../../utils/types';
import {useQuery} from '@tanstack/react-query';
import {getProductList} from '../../utils/apiAction';
import {useSelector} from 'react-redux';
import {IRootState} from '../../redux/store';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type BrowseScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.BrowseScreen
>;

const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT_SEARCHES = 5;

const BrowseScreen: React.FC<BrowseScreenProps> = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const userData = useSelector((user: IRootState) => user.user.userData);
  const isLogged = userData ? true : false;
  const searchQueryRef = useRef(searchQuery);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const savedSearches = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (savedSearches) {
        const parsedSearches = JSON.parse(savedSearches);
        setRecentSearches(parsedSearches);
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveRecentSearches = async (searches: string[]) => {
    try {
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  };

  const addToRecentSearches = async (query: string) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery === '') return;
    const updatedSearches = [
      trimmedQuery,
      ...recentSearches.filter(item => item !== trimmedQuery),
    ].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(updatedSearches);
    await saveRecentSearches(updatedSearches);
  };

  const getApiParams = () => {
    const params: any = {};
    if (searchQuery.trim() !== '') {
      params.search = searchQuery.trim();
    }
    if (selectedSort?.id) {
      const sortMapping: {[key: string]: string} = {
        price_low_to_high: 'price_low_to_high',
        price_high_to_low: 'price_high_to_low',
        newest_first: 'newest_first',
      };
      params.sort_by = sortMapping[selectedSort.id] || selectedSort.id;
    }
    if (selectedPriceRange) {
      params.price = `${selectedPriceRange.min}-${selectedPriceRange.max}`;
    }
    if (selectedCategories.length > 0) {
      params.category_id = selectedCategories.map(cat => cat.id).join(',');
    }
    if (userData?.id) {
      params.user_id = userData.id;
    }
    return params;
  };

  const {
    data: productListResponse,
    refetch: refetchProductList,
    isLoading,
  } = useQuery({
    queryKey: [
      'getProductList',
      searchQuery,
      selectedSort?.id,
      selectedPriceRange,
      selectedCategories,
    ],
    queryFn: () => getProductList(getApiParams()),
    staleTime: 5 * 60 * 1000,
  });
  const apiProducts = productListResponse?.data?.product || [];
  useEffect(() => {
    searchQueryRef.current = searchQuery;
  }, [searchQuery]);

  useEffect(() => {
    refetchProductList();
  }, [
    searchQuery,
    selectedCategories,
    selectedSort,
    selectedPriceRange,
    refetchProductList,
  ]);

  const handleSearch = async () => {
    const query = searchQueryRef.current.trim();
    if (query !== '') {
      await addToRecentSearches(query);
    }
  };

  const handleClearAll = async () => {
    setRecentSearches([]);
    await saveRecentSearches([]);
  };

  const removeSearch = async (index: number) => {
    const updatedSearches = [...recentSearches];
    updatedSearches.splice(index, 1);
    setRecentSearches(updatedSearches);
    await saveRecentSearches(updatedSearches);
  };

  const handleRecentSearchClick = async (searchTerm: string) => {
    setSearchQuery(searchTerm);
    await addToRecentSearches(searchTerm);
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchProductList();
      await loadRecentSearches();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getFilteredProducts = () => {
    let result = [...apiProducts];

    result = result.filter(
      product => (product as any).product_status !== 'withdrawn',
    );

    // Apply client-side filtering for search, categories, and price if not handled by API
    // Note: API may already handle some filtering based on parameters sent
    if (selectedCategories.length > 0) {
      result = result.filter(product => {
        const productCategory = (product as any).category || (product as any).category_id;
        if (productCategory) {
          return selectedCategories.some(
            category =>
              category.id === productCategory ||
              category.name === productCategory ||
              String(category.id) === String(productCategory),
          );
        }
        return false;
      });
    }

    if (searchQuery.trim() !== '') {
      result = result.filter(
        product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedPriceRange) {
      result = result.filter(product => {
        const productPrice =
          typeof product.price === 'string'
            ? parseFloat(product.price.replace(/[^0-9.-]+/g, ''))
            : product.price;

        if (isNaN(productPrice)) return false;

        return (
          productPrice >= selectedPriceRange.min &&
          productPrice <= selectedPriceRange.max
        );
      });
    }

    if (
      selectedSort?.id === 'Price: Low to High' ||
      selectedSort?.id === 'price_low_to_high'
    ) {
      result = result.sort((a, b) => {
        const aIsSold = (a as any).product_status === 'sold';
        const bIsSold = (b as any).product_status === 'sold';

        if (aIsSold && !bIsSold) return 1;
        if (!aIsSold && bIsSold) return -1;

        const priceA =
          typeof a.price === 'string'
            ? parseFloat(a.price.replace(/[^0-9.-]+/g, ''))
            : a.price;
        const priceB =
          typeof b.price === 'string'
            ? parseFloat(b.price.replace(/[^0-9.-]+/g, ''))
            : b.price;
        if (isNaN(priceA) && isNaN(priceB)) return 0;
        if (isNaN(priceA)) return 1;
        if (isNaN(priceB)) return -1;
        return priceA - priceB;
      });
    } else if (
      selectedSort?.id === 'Price: High to Low' ||
      selectedSort?.id === 'price_high_to_low'
    ) {
      result = result.sort((a, b) => {
        const aIsSold = (a as any).product_status === 'sold';
        const bIsSold = (b as any).product_status === 'sold';
        if (aIsSold && !bIsSold) return 1;
        if (!aIsSold && bIsSold) return -1;

        const priceA =
          typeof a.price === 'string'
            ? parseFloat(a.price.replace(/[^0-9.-]+/g, ''))
            : a.price;
        const priceB =
          typeof b.price === 'string'
            ? parseFloat(b.price.replace(/[^0-9.-]+/g, ''))
            : b.price;

        if (isNaN(priceA) && isNaN(priceB)) return 0;
        if (isNaN(priceA)) return 1;
        if (isNaN(priceB)) return -1;

        return priceB - priceA;
      });
    } else if (selectedSort?.id === 'Newest First') {
      result = result.sort((a, b) => {
        const aIsSold = (a as any).product_status === 'sold';
        const bIsSold = (b as any).product_status === 'sold';

        if (aIsSold && !bIsSold) return 1;
        if (!aIsSold && bIsSold) return -1;

        const dateA = (a as any).createdAt
          ? new Date((a as any).createdAt).getTime()
          : 0;
        const dateB = (b as any).createdAt
          ? new Date((b as any).createdAt).getTime()
          : 0;
        if (dateA === 0 && dateB === 0) {
          return b.id - a.id;
        }
        return dateB - dateA;
      });
    } else if (selectedSort?.id === 'Name: A to Z') {
      result = result.sort((a, b) => {
        const aIsSold = (a as any).product_status === 'sold';
        const bIsSold = (b as any).product_status === 'sold';
        if (aIsSold && !bIsSold) return 1;
        if (!aIsSold && bIsSold) return -1;

        return a.name.localeCompare(b.name);
      });
    } else if (selectedSort?.id === 'Name: Z to A') {
      result = result.sort((a, b) => {
        const aIsSold = (a as any).product_status === 'sold';
        const bIsSold = (b as any).product_status === 'sold';
        if (aIsSold && !bIsSold) return 1;
        if (!aIsSold && bIsSold) return -1;
        return b.name.localeCompare(a.name);
      });
    }

    console.log(
      '🔍 After sorting - Products status:',
      result.map(p => ({
        name: (p as any).name,
        status: (p as any).product_status,
        price: p.price,
      })),
    );

    return result;
  };

  const handleFilterPress = () => {
    const onApplyFilters = (
      selectedCategories: ProductCategory[],
      selectedSort: {id: string; name: string} | null,
      selectedPriceRange: {min: number; max: number} | null,
    ) => {
      setSelectedCategories(selectedCategories);
      setSelectedSort(selectedSort);
      setSelectedPriceRange(selectedPriceRange);
    };

    navigation.navigate(SCREENS.FilterSortScreen, {
      onApplyFilters,
      initialFilters: selectedCategories,
      initialSort: selectedSort,
      initialPriceRange: selectedPriceRange,
    });
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedSort !== null ||
    selectedPriceRange !== null;

  return (
    <>
      <View
        style={{
          height: insets.top,
          backgroundColor: colors.background,
          marginTop: 25,
        }}>
        <StatusBar
          backgroundColor={colors.background}
          barStyle="dark-content"
          translucent={false}
        />
      </View>
      <SafeAreaView style={{flex: 1}}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={handleSearch}
          onFilterPress={handleFilterPress}
          hasActiveFilters={hasActiveFilters}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]} 
              tintColor={colors.primary} 
            />
          }>
          {recentSearches.length > 0 && (
            <View style={styles.recentSearchesContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <TouchableOpacity
                  onPress={handleClearAll}
                  style={styles.clearAllButton}>
                  <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={recentSearches}
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={({item, index}) => (
                  <View style={styles.recentSearchItem}>
                    <TouchableOpacity
                      style={styles.recentSearchTextContainer}
                      onPress={() => handleRecentSearchClick(item)}>
                      <Text style={styles.recentSearchText}>{item}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removeSearch(index)}>
                      <IconsSvg name="cancel" />
                    </TouchableOpacity>
                  </View>
                )}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            </View>
          )}
          {/* <TopPicksSection
          title="Trending Searches"
          products={topPicks}
          onViewAll={() => console.log('View All Top Picks')}
        /> */}
          <ProductSection
            title="Popular Products"
            products={getFilteredProducts()}
            onViewAll={() => {}}
            showViewAll={false}
            onPress={item => {
              navigation.navigate(SCREENS.BProductDetailScreen, {
                productId: item?.id,
              });
            }}
          />
          <View style={{height: 100}} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default BrowseScreen;

const styles = StyleSheet.create({
  recentSearchesContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.darkLabel,
  },
  clearAllButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  clearAllText: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 8,
    marginBottom: 5,
  },
  recentSearchTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentSearchText: {
    color: colors.text3,
    fontSize: 16,
    fontFamily: fonts.medium,
  },
});
