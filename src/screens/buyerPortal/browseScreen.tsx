import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import HeaderHomeContainer from '../../components/headerContainer/headerHomeContainer';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, SCREENS} from '../../navigation/mainNavigation';
import SearchBar from '../../components/card/searchBar';
import TopPicksSection from '../../components/card/topPicksSection';
import ProductSection from '../../components/card/productSection';
import {products, topPicks} from '../../utils/static';
import fonts from '../../assets/fonts/fonts';
import colors from '../../utils/colors';
import IconsSvg from '../../assets/svg/iconsSvg';
import { ScrollView } from 'react-native-gesture-handler';

// Define props type
type BrowseScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.BrowseScreen
>;

const BrowseScreen: React.FC<BrowseScreenProps> = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const searchQueryRef = useRef(searchQuery);

  // Handle search input
  useEffect(() => {
    searchQueryRef.current = searchQuery;
    filterProducts(searchQuery, selectedCategories);
  }, [searchQuery]);

  const handleSearch = () => {
    const query = searchQueryRef.current.trim();
    if (query !== '') {
      setRecentSearches(prev => {
        if (!prev.includes(query)) {
          return [query, ...prev];
        }
        return prev;
      });
      setSearchQuery('');
    }
  };

  const handleClearAll = () => {
    setRecentSearches([]);
  };

  const removeSearch = (index: number) => {
    const updatedSearches = [...recentSearches];
    updatedSearches.splice(index, 1);
    setRecentSearches(updatedSearches);
  };

  const filterProducts = (query: string, categories: string[]) => {
    let result = products;

    // Filter by category
    if (categories.length > 0) {
      result = result.filter(product =>
        categories.includes(product.category),
      );
    }

    // Filter by search query
    if (query.trim() !== '') {
      result = result.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()),
      );
    }

    setFilteredProducts(result);
  };

  const handleFilterPress = () => {
    const onApplyFilters = (selectedCategories: string[]) => {
      setSelectedCategories(selectedCategories);
      filterProducts(searchQuery, selectedCategories);
    };

    navigation.navigate(SCREENS.FilterSortScreen, {
      onApplyFilters,
      initialFilters: selectedCategories,
    });
  };

  return (
    // <TitleBackHeaderContainer 
    // // title="Browse Screen"
    // >
      <SafeAreaView style={{flex:1,paddingTop:50}}>
  <ScrollView>
  <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmit={handleSearch}
        onFilterPress={handleFilterPress}
      />

      {/* Recent Searches */}
      <View style={styles.recentSearchesContainer}>
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        <TouchableOpacity
          onPress={handleClearAll}
          style={styles.clearAllButton}>
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
        <FlatList
          data={recentSearches}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <View style={styles.recentSearchItem}>
              <Text style={styles.recentSearchText}>{item}</Text>
              <TouchableOpacity onPress={() => removeSearch(index)}>
                <IconsSvg name="cancel" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.noRecentText}>No recent searches</Text>
          }
        />
      </View>

      {/* Trending Searches */}
      <TopPicksSection
        title="Trending Searches"
        products={topPicks}
        onViewAll={() => console.log('View All Top Picks')}
      />

      {/* Popular Products */}
      <ProductSection
        title="Popular Products"
        products={filteredProducts}
        onViewAll={() => console.log('View All Pressed')}
      />

      <View style={{height: 100}} />
  </ScrollView>
    
      </SafeAreaView>
    // </TitleBackHeaderContainer> 
  );
};

export default BrowseScreen;

const styles = StyleSheet.create({
  recentSearchesContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.darkLabel,
    marginBottom: 10,
  },
  clearAllButton: {
    position: 'absolute',
    right: 20,
    top: 0,
  },
  clearAllText: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recentSearchText: {
    flex: 1,
    color: colors.text3,
    fontSize: 16,
    fontFamily: fonts.medium,
  },
  noRecentText: {
    color: colors.gray,
    fontSize: 18,
    fontFamily: fonts.bold,
  },
});