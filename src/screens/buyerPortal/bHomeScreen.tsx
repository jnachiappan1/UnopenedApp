import { StyleSheet, FlatList, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import HeaderHomeContainer from '../../components/headerContainer/headerHomeContainer';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { bannerData } from '../../utils/static';
import BannerItem from '../../components/card/bannerItem';
import SearchBar from '../../components/card/searchBar';
import CategoryList from '../../components/card/categoryList';
import ProductSection from '../../components/card/productSection';
import { ProductCategory, ProductData } from '../../utils/types';
import { getAllProductList, getCategoryDetail, getProductList } from '../../utils/apiAction';
import { IRootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';

type LoginProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.BHomeScreen
>;
interface Product {
  description: string;
  originalPrice: string;
  id: number;
  name: string;
  price: string;
  image: string;
}

const BHomeScreen: React.FC<LoginProps> = ({ route, navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const userData = useSelector((user: IRootState) => user.user.userData);
  const isLogged = userData ? true : false;
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const searchQueryRef = useRef(searchQuery);
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const [selectedSort, setSelectedSort] = useState<{ id: string; name: string } | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [apiTrigger, setApiTrigger] = useState(0);
  const getApiParams = () => {
    const params: any = {};
    if (searchQuery.trim() !== '') {
      params.search = searchQuery.trim();
    } else {
      params.search = '';
    }
    if (selectedSort?.id) {
      const sortMapping: { [key: string]: string } = {
        'price_low_to_high': 'price_asc',
        'price_high_to_low': 'price_desc',
        'newest_first': 'newest',
        'name_a_to_z': 'name_asc',
        'name_z_to_a': 'name_desc'
      };
      params.sort_by = sortMapping[selectedSort.id] || selectedSort.id;
    } else {
      params.sort_by = 'null';
    }
    if (selectedPriceRange) {
      params.price = `${selectedPriceRange.min}-${selectedPriceRange.max}`;
    } else {
      params.price = '100-5000'; 
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

  const { data: categoryData, refetch: refetchcategoryDetail } = useQuery({
    queryKey: ['getCategoryDetail'],
    queryFn: () => getCategoryDetail(),
    enabled: isLogged,
  });
  const { data: allProductList, refetch: refetchAllProduct } = useQuery({
    queryKey: ['getAllProductList', userData?.id], 
    queryFn: () => getAllProductList(userData?.id),
  });

  const { data: productList, refetch: refetchProductList, isLoading, isFetching } = useQuery({
    queryKey: [
      'getProductList',
      searchQuery,
      selectedSort?.id,
      selectedPriceRange ? `${selectedPriceRange.min}-${selectedPriceRange.max}` : null,
      selectedCategories.map(c => c.id).sort().join(','),
      selectedCategoryIds.sort().join(','),
      userData?.id ?? null,
      apiTrigger
    ],
    queryFn: () => {
      return getProductList(getApiParams());
    },
    // enabled: isLogged,
    staleTime: 0, 
    refetchOnMount: true,
  });
  const triggerApiCall = () => {
    console.log('🔄 Triggering API call...');
    setApiTrigger(prev => prev + 1);
    if (isLogged) {
      refetchProductList();
    }
  };
  useEffect(() => {
    console.log('Filter changed, triggering API call');
    triggerApiCall();
  }, [searchQuery, selectedCategories, selectedSort, selectedPriceRange, selectedCategoryIds]);

  // Debug logs
  // useEffect(() => {
  //   console.log('🏠 BHomeScreen State:');
  //   console.log('isLogged:', isLogged);
  //   console.log('userData:', userData);
  //   console.log('Selected Category IDs:', selectedCategoryIds);
  //   console.log('Filter Categories:', selectedCategories);
  //   console.log('Selected Sort:', selectedSort);
  //   console.log('Selected Price Range:', selectedPriceRange);
  //   console.log('Search Query:', searchQuery);
  //   console.log('API Trigger:', apiTrigger);
  //   console.log('Product List Response:', productList);
  // }, [isLogged, userData, selectedCategoryIds, selectedCategories, selectedSort, selectedPriceRange, searchQuery, apiTrigger, productList]);

  const handleFilterPress = () => {
    const onApplyFilters = (
      filterCategories: ProductCategory[],
      filterSort: { id: string; name: string } | null,
      filterPriceRange: { min: number; max: number } | null
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
  const handlePress = (item: ProductData) => {
    console.log(item,"item====");
    
    // navigation.navigate(SCREENS.BProductDetailScreen, { item: item });
  };
  useEffect(() => {
    if (categoryData?.data?.category) {
      const activeCategories: ProductCategory[] = categoryData.data.category
        .filter((category: any) => category.status === 'active')
        .map((category: any) => ({
          id: category.id,
          name: category.name
        }));
      setCategories(activeCategories);
    }
  }, [categoryData]);

  const handleCategorySelect = (categoryId: number | null, categoryName: string | null) => {
    console.log('🏷️ Category selected:', categoryId, categoryName);
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
          newIds = [categoryId]; // Single selection
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
    console.log('🧹 Clearing all filters');
    setSelectedCategories([]);
    setSelectedSort(null);
    setSelectedPriceRange(null);
    setSelectedCategoryIds([]);
    setSelectedCategoryId(null);
    setSearchQuery('');
  };
  const displayProducts = productList?.data?.product;
  return (
    <HeaderHomeContainer
      title={'Welcome,'}
      userName={`Hello ${userData?.full_name ?? 'Guest'}`}
      isHome
      profileImage={userData?.profile_picture} 
      onSearchPress={() => { }}>

      <FlatList
        data={bannerData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <BannerItem item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmit={handleSearch}
        onFilterPress={handleFilterPress}
      />
      <CategoryList
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleCategorySelect}
      />
      <ProductSection
        title="Our Products"
        products={displayProducts?.slice(0, 6)}
        onViewAll={() => console.log('View All Pressed')}
        onPress={(item) => {
          console.log(item?.id , 'pressed product ID');
          navigation.navigate(SCREENS.BProductDetailScreen, {productId: item?.id });
        }}
      // isLoading={isLoading || isFetching}
      />
      <ProductSection
        title="Recently Listed Items"
        products={allProductList?.data?.product?.slice(0, 6)}
        onViewAll={() => console.log('View All Pressed')}
      />
      <View style={{ height: 100 }} />
    </HeaderHomeContainer>
  );
};

export default BHomeScreen;

const styles = StyleSheet.create({
  container: {
  
  },
});